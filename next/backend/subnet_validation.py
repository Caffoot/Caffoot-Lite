"""Read-only subnet hierarchy diagnostics matching published v1.3.3 rules.

Mirrors hierarchyParseCidr and hierarchyValidate. Does not replace
hierarchyValidateTypes, normaliseState, or the complete import review.
"""
import re


def parse_hierarchy_cidr(value, min_prefix=0, max_prefix=32):
    if not isinstance(value, str):
        return None
    match = re.fullmatch(r"([^/]+)/(\d{1,2})", value)
    if not match:
        return None
    octets = match.group(1).split(".")
    if len(octets) != 4 or any(
        not re.fullmatch(r"\d{1,3}", part) or int(part) > 255 for part in octets
    ):
        return None
    prefix = int(match.group(2))
    if not min_prefix <= prefix <= max_prefix:
        return None
    address = 0
    for part in octets:
        address = address * 256 + int(part)
    size = 2 ** (32 - prefix)
    start = (address // size) * size
    canonical = ".".join(str((start >> shift) & 255) for shift in (24, 16, 8, 0))
    return {
        "prefix": prefix, "start": start, "end": start + size - 1,
        "size": size, "aligned": address == start,
        "canonical": canonical + "/" + str(prefix),
    }


def validate_subnet_hierarchy(subnets):
    """Published hierarchyValidate diagnostics, preserving source order."""
    if not isinstance(subnets, list):
        return ["Subnets must be an array."]
    errors = []
    ids, cidrs, ranges = {}, set(), {}
    for subnet in subnets:
        if (not isinstance(subnet, dict) or
                not isinstance(subnet.get("id"), str) or
                not subnet["id"].strip()):
            errors.append("Subnet ID is missing.")
            continue
        identifier = subnet["id"]
        if identifier in ids:
            errors.append("Duplicate subnet ID: " + identifier)
            continue
        ids[identifier] = subnet
        kind = subnet.get("kind", "network")
        if kind not in ("network", "container", "reserved", "loopback"):
            errors.append("Invalid subnet kind: " + identifier)
            continue
        parent_id = subnet.get("parentId")
        if parent_id not in (None, "") and not isinstance(parent_id, str):
            errors.append("Invalid parent ID for " + identifier)
        lower = 0 if kind in ("container", "reserved") else 32 if kind == "loopback" else 1
        upper = 32
        if kind == "loopback":
            upper = 32
        parsed = parse_hierarchy_cidr(subnet.get("cidr"), lower, upper)
        if parsed is None:
            errors.append("Invalid CIDR for " + identifier + ": " + str(subnet.get("cidr")))
        elif not parsed["aligned"]:
            errors.append("Misaligned CIDR " + str(subnet["cidr"]) + "; use " + parsed["canonical"])
        else:
            ranges[identifier] = parsed
            if parsed["canonical"] in cidrs:
                errors.append("Duplicate CIDR: " + parsed["canonical"])
            cidrs.add(parsed["canonical"])

    for subnet in subnets:
        if not isinstance(subnet, dict):
            continue
        identifier = subnet.get("id")
        if not identifier or identifier not in ranges:
            continue
        parent_id = subnet.get("parentId") if isinstance(subnet.get("parentId"), str) else None
        if not parent_id:
            continue
        if parent_id == identifier:
            errors.append("Subnet cannot parent itself: " + identifier)
            continue
        parent = ids.get(parent_id)
        if parent is None:
            errors.append("Missing parent " + parent_id + " for " + identifier)
            continue
        if parent.get("kind") != "container":
            errors.append("Parent must be a container: " + parent_id)
        child_range, parent_range = ranges[identifier], ranges.get(parent_id)
        if parent_range and not (
            parent_range["start"] <= child_range["start"] and
            child_range["end"] <= parent_range["end"] and
            child_range["size"] < parent_range["size"]
        ):
            errors.append("Child " + identifier + " is not strictly inside parent " + parent_id)
        seen = {identifier}
        cursor = parent
        while cursor is not None:
            if cursor["id"] in seen:
                errors.append("Parent cycle involving " + identifier)
                break
            seen.add(cursor["id"])
            cursor = ids.get(cursor.get("parentId")) if cursor.get("parentId") else None

    def ancestor(ancestor_id, child_id):
        seen = set()
        subnet = ids.get(child_id)
        while subnet and subnet.get("parentId") and subnet["id"] not in seen:
            seen.add(subnet["id"])
            if subnet["parentId"] == ancestor_id:
                return True
            subnet = ids.get(subnet["parentId"])
        return False

    for i, left in enumerate(subnets):
        for right in subnets[i + 1:]:
            if not isinstance(left, dict) or not isinstance(right, dict):
                continue
            if left.get("id") == right.get("id"):
                continue
            x, y = ranges.get(left.get("id")), ranges.get(right.get("id"))
            if (x and y and x["start"] <= y["end"] and y["start"] <= x["end"] and
                    not ancestor(left["id"], right["id"]) and
                    not ancestor(right["id"], left["id"])):
                errors.append("Overlapping unrelated subnets: " + str(left.get("cidr")) +
                              " and " + str(right.get("cidr")))
    return errors
