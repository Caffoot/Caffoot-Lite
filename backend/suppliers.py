"""Supplier directory, canonical company data and section-local record lifecycle."""
from datetime import datetime, timezone
import json
import re
from urllib.parse import urlsplit

from .audit_events import record_actor_event
from .equipment_suppliers import read_supplied_equipment
from .permissions import _admin, can_access
from .sessions import session_account
from .supplier_issue_schema import ISSUE_STATUSES


def supplier_access(connection, actor, *, edit=False):
    if not can_access(connection, actor, "Suppliers", edit=edit):
        raise PermissionError("Suppliers access required")


def fields(value, required, optional=()):
    if not isinstance(value, dict) or not set(required) <= value.keys() <= set(required) | set(optional):
        raise ValueError("Invalid Supplier fields")
    return value


def cleaned(value, label, limit=160, *, required=False, multiline=False):
    if not isinstance(value, str):
        raise ValueError(f"Invalid {label}")
    value = value.strip()
    if (len(value) > limit or any(
            (ord(char) < 32 and not (multiline and char in "\n\r\t")) or ord(char) == 127
            for char in value)):
        raise ValueError(f"Invalid {label}")
    if required and not value:
        raise ValueError(f"Enter {label}")
    return value


def web_address(value):
    value = cleaned(value, "website address", 2048)
    if not value:
        return value
    try:
        parsed = urlsplit(value)
        parsed.port
        if (parsed.scheme in ("http", "https") and parsed.hostname
                and parsed.username is None and parsed.password is None
                and "\\" not in value and not any(char.isspace() for char in value)):
            return value
    except ValueError:
        pass
    raise ValueError("Enter a full website address beginning with https:// or http://")


def identities(value):
    if not isinstance(value, list) or any(type(item) is not int or item <= 0 for item in value):
        raise ValueError("Invalid Supplier record selections")
    if len(value) != len(set(value)):
        raise ValueError("Duplicate Supplier record selections")
    return set(value)


def text_list(value, label, limit):
    if not isinstance(value, list):
        raise ValueError(f"Invalid {label}")
    return [cleaned(item, label, limit, required=True) for item in value]


def contact_values(value):
    fields(value, ("name", "role", "phones", "emails", "profiles", "companyWide", "locationIds"))
    name = cleaned(value["name"], "a Contact name", required=True)
    role = cleaned(value["role"], "Contact role")
    phones = text_list(value["phones"], "telephone number", 80)
    emails = text_list(value["emails"], "email address", 254)
    if any(not re.fullmatch(r"[^@\s]+@[^@\s]+", email) for email in emails):
        raise ValueError("Enter a valid email address on each line")
    profiles = []
    if not isinstance(value["profiles"], list):
        raise ValueError("Invalid professional links")
    for profile in value["profiles"]:
        fields(profile, ("label", "url"))
        label = cleaned(profile["label"], "a professional link label", required=True)
        url = web_address(profile["url"])
        if not url:
            raise ValueError("Enter a web address for each professional link")
        profiles.append({"label": label, "url": url})
    wide = value["companyWide"]
    locations = identities(value["locationIds"])
    if type(wide) is not bool or wide == bool(locations):
        raise ValueError("Choose Company-wide Contact or at least one Location")
    return (name, role, json.dumps(phones), json.dumps(emails), json.dumps(profiles), wide), locations


def address(value):
    fields(value, ("address", "city", "postcode", "country"))
    return tuple(cleaned(value[key], label, limit) for key, label, limit in (
        ("address", "street address", 400), ("city", "town or city", 160),
        ("postcode", "postcode", 40), ("country", "country", 160),
    ))


def directory_categories(connection, *, issues=False):
    table = "supplier_issue_categories" if issues else "supplier_categories"
    return [{"id": identity, "name": name, "archived": bool(archived), "revision": revision}
            for identity, name, archived, revision in connection.execute(
                f"SELECT id,name,archived,revision FROM {table} ORDER BY name COLLATE NOCASE,id"
            )]


def read_directory(connection):
    company_categories = {}
    for supplier, category in connection.execute(
        "SELECT a.supplier_id,a.category_id FROM supplier_category_assignments a "
        "JOIN supplier_categories c ON c.id=a.category_id ORDER BY c.name COLLATE NOCASE,c.id"
    ):
        company_categories.setdefault(supplier, []).append(category)
    return {
        "categories": directory_categories(connection),
        "suppliers": [
            {"id": identity, "name": name, "description": description, "status": status,
             "city": city, "categoryIds": company_categories.get(identity, []),
             "locationCount": location_count, "contactCount": contact_count}
            for identity, name, description, status, city, location_count, contact_count in connection.execute(
                "SELECT s.id,s.name,s.description,s.status,l.city,"
                "(SELECT count(*) FROM supplier_locations WHERE supplier_id=s.id AND archived=0),"
                "(SELECT count(*) FROM supplier_contacts WHERE supplier_id=s.id AND archived=0) "
                "FROM suppliers s LEFT JOIN supplier_locations l ON l.supplier_id=s.id AND l.is_main=1 "
                "ORDER BY s.name_key,s.id"
            )
        ],
    }


def get_supplier(connection, identity):
    if type(identity) is not int or not 0 < identity < 2**63:
        raise LookupError("Supplier not found")
    result = connection.execute(
        "SELECT id,name,website,description,status,revision,has_note_history FROM suppliers WHERE id=?", (identity,)
    ).fetchone()
    if result is None:
        raise LookupError("Supplier not found")
    return result


def supply_sections(connection, supplier):
    return [row[0] for row in connection.execute(
        "SELECT section FROM supplier_supply_history WHERE supplier_id=? ORDER BY section", (supplier,)
    )]


def supplier_delete_reason(connection, supplier, sections):
    if sections:
        return "This Supplier has supply history. Use Disable to retain its records."
    if supplier[6] or connection.execute("SELECT 1 FROM supplier_notes WHERE supplier_id=? LIMIT 1", (supplier[0],)).fetchone():
        return "This Supplier has Note history. Use Archive to retain its records."
    if connection.execute("SELECT 1 FROM supplier_issues WHERE supplier_id=? LIMIT 1", (supplier[0],)).fetchone():
        return "This Supplier has Issue history. Use Archive to retain its records."
    return ""


def contact_delete_reason(note_history, issue_history):
    if note_history:
        return "This Contact has Note history. Use Archive to retain its record."
    if issue_history:
        return "This Contact has Issue history. Use Archive to retain its record."
    return ""


def location_delete_reason(connection, location, main):
    if main:
        return "Choose another Main Office before deleting this Location."
    if connection.execute("SELECT 1 FROM supplier_contact_locations WHERE location_id=? LIMIT 1", (location,)).fetchone():
        return "Contacts are linked to this Location. Use Archive to retain those links."
    return ""


def read_supplier(connection, identity, actor):
    supplier = get_supplier(connection, identity)
    sections = supply_sections(connection, identity)
    equipment = read_supplied_equipment(connection, actor, identity)
    return {
        **({"equipment": equipment} if equipment is not None else {}),
        "id": identity, "name": supplier[1], "website": supplier[2], "description": supplier[3],
        "status": supplier[4], "revision": supplier[5],
        "hasSupplyHistory": bool(sections), "deleteReason": supplier_delete_reason(connection, supplier, sections),
        "categoryIds": [row[0] for row in connection.execute(
            "SELECT category_id FROM supplier_category_assignments WHERE supplier_id=?", (identity,)
        )],
        "categories": directory_categories(connection),
        "issueCategories": directory_categories(connection, issues=True),
        "issues": read_issue_rows(connection, identity),
        "locations": [
            {"id": lid, "name": name, "address": street, "city": city, "postcode": postcode, "country": country,
             "main": bool(main), "archived": bool(archived), "deleteReason": location_delete_reason(connection, lid, main)}
            for lid, name, street, city, postcode, country, main, archived in connection.execute(
                "SELECT id,name,address,city,postcode,country,is_main,archived FROM supplier_locations "
                "WHERE supplier_id=? ORDER BY is_main DESC,name COLLATE NOCASE,id", (identity,)
            )
        ],
        "contacts": [
            {"id": cid, "name": name, "role": role, "phones": json.loads(phones), "emails": json.loads(emails),
             "profiles": json.loads(profiles), "companyWide": bool(wide), "archived": bool(archived),
             "deleteReason": contact_delete_reason(note_history, issue_history),
             "locationIds": [row[0] for row in connection.execute(
                 "SELECT location_id FROM supplier_contact_locations WHERE contact_id=? ORDER BY location_id", (cid,)
             )]}
            for cid, name, role, phones, emails, profiles, wide, archived, note_history, issue_history in connection.execute(
                "SELECT id,name,role,phones,emails,profiles,company_wide,archived,has_note_history,has_issue_history "
                "FROM supplier_contacts WHERE supplier_id=? ORDER BY name COLLATE NOCASE,id", (identity,)
            )
        ],
        "notes": [
            {"id": nid, "contactId": contact, "text": body, "createdBy": created_label, "createdAt": created_at,
             "updatedBy": updated_label, "updatedAt": updated_at}
            for nid, contact, body, created_label, created_at, updated_label, updated_at in connection.execute(
                "SELECT id,contact_id,body,created_label,created_at,updated_label,updated_at "
                "FROM supplier_notes WHERE supplier_id=? ORDER BY id DESC", (identity,)
            )
        ],
    }


def log_change(connection, actor, action, label, record, identity, before=None, after=None):
    record_actor_event(
        connection, actor, kind="Suppliers", action=action, label=label,
        reason=f"Supplier {record.lower()} {action.lower()}", fields=[record],
        before=before, after={"recordId": identity, **(after or {})},
    )


def child_record(connection, table, supplier_id, identity):
    if type(identity) is not int or not 0 < identity < 2**63:
        raise LookupError("Supplier record not found")
    result = connection.execute(
        f"SELECT * FROM {table} WHERE supplier_id=? AND id=?", (supplier_id, identity)
    ).fetchone()
    if result is None:
        raise LookupError("Supplier record not found")
    return result


def confirmed(payload):
    if payload.get("confirmed") is not True:
        raise ValueError("Explicit confirmation is required")


def require_revision(expected, current):
    if type(expected) is not int or expected != current:
        raise FileExistsError("This record changed. Reopen it to review the latest details before saving.")


def save_categories(connection, supplier, selected):
    selected = identities(selected)
    previous = {row[0] for row in connection.execute(
        "SELECT category_id FROM supplier_category_assignments WHERE supplier_id=?", (supplier,)
    )}
    active = {row[0] for row in connection.execute("SELECT id FROM supplier_categories WHERE archived=0")}
    if not selected - previous <= active:
        raise ValueError("Only active Supplier Categories can be newly assigned")
    connection.executemany(
        "DELETE FROM supplier_category_assignments WHERE supplier_id=? AND category_id=?",
        [(supplier, category) for category in previous - selected],
    )
    connection.executemany(
        "INSERT INTO supplier_category_assignments VALUES(?,?)",
        [(supplier, category) for category in selected - previous],
    )


def save_company(connection, actor, supplier, payload):
    new = supplier is None
    fields(payload, ("name", "website", "description", "address", "categoryIds"), ("contacts",) if new else ())
    name = cleaned(payload["name"], "a Supplier name", required=True)
    company = (name, name.casefold(), web_address(payload["website"]),
               cleaned(payload["description"], "Supplier Description", 4000, multiline=True))
    location = address(payload["address"])
    if connection.execute("SELECT 1 FROM suppliers WHERE name_key=? AND id!=?", (company[1], 0 if new else supplier[0])).fetchone():
        raise FileExistsError("A Supplier with this name already exists")
    if new:
        identity = connection.execute(
            "INSERT INTO suppliers(name,name_key,website,description) VALUES(?,?,?,?)", company
        ).lastrowid
        main = connection.execute(
            "INSERT INTO supplier_locations(supplier_id,name,address,city,postcode,country,is_main) "
            "VALUES(?,'Main Office',?,?,?,?,1)", (identity, *location)
        ).lastrowid
        entries = payload.get("contacts", [])
        if not isinstance(entries, list):
            raise ValueError("Invalid Contact entries")
        for entry in entries:
            fields(entry, ("name", "role", "phones", "emails", "companyWide"))
            if type(entry["companyWide"]) is not bool:
                raise ValueError("Invalid Contact scope")
            if not any(entry[key] for key in ("name", "role", "phones", "emails", "companyWide")):
                continue
            contact = {**entry, "profiles": [], "locationIds": [] if entry["companyWide"] else [main]}
            save_contact(connection, actor, identity, None, contact)
    else:
        identity = supplier[0]
        connection.execute("UPDATE suppliers SET name=?,name_key=?,website=?,description=? WHERE id=?", (*company, identity))
        connection.execute(
            "UPDATE supplier_locations SET address=?,city=?,postcode=?,country=? WHERE supplier_id=? AND is_main=1",
            (*location, identity),
        )
    save_categories(connection, identity, payload["categoryIds"])
    log_change(connection, actor, "Created" if new else "Updated", name, "Company", identity,
               before=None if new else {"name": supplier[1]})
    return identity


def save_category(connection, actor, identity, revision, operation, payload):
    issues = operation.startswith("issue-category.")
    table = "supplier_issue_categories" if issues else "supplier_categories"
    kind = "Issue Category" if issues else "Category"
    current = None
    if identity is not None:
        if type(identity) is not int or not 0 < identity < 2**63:
            raise LookupError(f"Supplier {kind} not found")
        current = connection.execute(
            f"SELECT name,archived,revision FROM {table} WHERE id=?", (identity,)
        ).fetchone()
        if current is None:
            raise LookupError(f"Supplier {kind} not found")
        require_revision(revision, current[2])
    if operation.endswith(".save"):
        fields(payload, ("name",))
        name = cleaned(payload["name"], "a Category name", 70, required=True)
        key = name.casefold()
        if connection.execute(f"SELECT 1 FROM {table} WHERE name_key=? AND id!=?", (key, identity or 0)).fetchone():
            raise FileExistsError(f"A Supplier {kind} with this name already exists")
        if current:
            connection.execute(f"UPDATE {table} SET name=?,name_key=?,revision=revision+1 WHERE id=?", (name, key, identity))
        else:
            identity = connection.execute(f"INSERT INTO {table}(name,name_key) VALUES(?,?)", (name, key)).lastrowid
        log_change(connection, actor, "Updated" if current else "Created", name, kind, identity,
                   before={"name": current[0]} if current else None, after={"name": name})
    else:
        if not current:
            raise LookupError(f"Supplier {kind} not found")
        fields(payload, ("confirmed",))
        confirmed(payload)
        set_archived(connection, actor, table, identity, current[0], kind,
                     current[1], operation, revision=True)
    return {"issueCategories": directory_categories(connection, issues=True), "categoryId": identity} if issues else read_directory(connection)


def set_archived(connection, actor, table, identity, label, kind, current, operation, *, revision=False):
    archived = operation.endswith(".archive")
    if bool(current) == archived:
        raise FileExistsError(f"This {kind} status has already changed")
    increment = ",revision=revision+1" if revision else ""
    connection.execute(f"UPDATE {table} SET archived=?{increment} WHERE id=?", (int(archived), identity))
    log_change(connection, actor, "Archived" if archived else "Reactivated", label, kind, identity)


def save_location(connection, actor, supplier, current, payload):
    fields(payload, ("name", "address"))
    name = cleaned(payload["name"], "a Location name", required=True)
    values = (name, *address(payload["address"]))
    if current:
        identity = current[0]
        connection.execute(
            "UPDATE supplier_locations SET name=?,address=?,city=?,postcode=?,country=? WHERE id=?", (*values, identity)
        )
    else:
        identity = connection.execute(
            "INSERT INTO supplier_locations(supplier_id,name,address,city,postcode,country) VALUES(?,?,?,?,?,?)",
            (supplier, *values),
        ).lastrowid
    log_change(connection, actor, "Updated" if current else "Created", name, "Location", identity)


def save_contact(connection, actor, supplier, current, payload):
    values, locations = contact_values(payload)
    previous = set()
    if current:
        identity = current[0]
        previous = {row[0] for row in connection.execute(
            "SELECT location_id FROM supplier_contact_locations WHERE contact_id=?", (identity,)
        )}
        if current[8] and (locations - previous or values[-1] and not current[7]):
            raise ValueError("Reactivate this Contact before adding new Location assignments")
        connection.execute(
            "UPDATE supplier_contacts SET name=?,role=?,phones=?,emails=?,profiles=?,company_wide=? WHERE id=?",
            (*values, identity),
        )
    else:
        identity = connection.execute(
            "INSERT INTO supplier_contacts(supplier_id,name,role,phones,emails,profiles,company_wide) VALUES(?,?,?,?,?,?,?)",
            (supplier, *values),
        ).lastrowid
    for location in locations - previous:
        if child_record(connection, "supplier_locations", supplier, location)[8]:
            raise ValueError("Archived Locations cannot be newly assigned")
    connection.executemany(
        "DELETE FROM supplier_contact_locations WHERE contact_id=? AND location_id=?",
        [(identity, location) for location in previous - locations],
    )
    connection.executemany(
        "INSERT INTO supplier_contact_locations(supplier_id,contact_id,location_id) VALUES(?,?,?)",
        [(supplier, identity, location) for location in locations - previous],
    )
    log_change(connection, actor, "Updated" if current else "Created", values[0], "Contact", identity)


def save_note(connection, actor, supplier, current, payload):
    fields(payload, ("contactId", "text"))
    contact_id = payload["contactId"]
    contact = None if contact_id is None else child_record(connection, "supplier_contacts", supplier, contact_id)
    if current and current[2] != contact_id:
        raise ValueError("A Note's owner cannot be changed")
    text = cleaned(payload["text"], "a Note", 12000, required=True, multiline=True)
    actor_name = connection.execute("SELECT username FROM accounts WHERE id=?", (actor,)).fetchone()[0]
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    if current:
        identity = current[0]
        connection.execute("UPDATE supplier_notes SET body=?,updated_by=?,updated_label=?,updated_at=? WHERE id=?",
                           (text, actor, actor_name, now, identity))
    else:
        identity = connection.execute(
            "INSERT INTO supplier_notes(supplier_id,contact_id,body,created_by,created_label,created_at) VALUES(?,?,?,?,?,?)",
            (supplier, contact_id, text, actor, actor_name, now),
        ).lastrowid
        connection.execute("UPDATE suppliers SET has_note_history=1 WHERE id=?", (supplier,))
        if contact:
            connection.execute("UPDATE supplier_contacts SET has_note_history=1 WHERE id=?", (contact_id,))
    log_note(connection, actor, "Updated" if current else "Created", supplier, identity,
             contact_id, current[4:7] if current else (actor, actor_name, now))


def log_note(connection, actor, action, supplier, identity, contact_id, creator):
    log_change(connection, actor, action, "Contact Note" if contact_id is not None else "Supplier Note", "Note", identity,
               after={"supplierId": supplier, "contactId": contact_id, "createdById": creator[0],
                      "createdBy": creator[1], "createdAt": creator[2]})


def change_company_status(connection, actor, supplier, operation, payload):
    identity, name, _, _, status, _, _ = supplier
    sections = supply_sections(connection, identity)
    if operation in ("supplier.disable", "supplier.enable"):
        _admin(connection, actor)
        fields(payload, ("confirmed", "sections"))
        confirmed(payload)
        if not sections or payload["sections"] != sections:
            raise FileExistsError("Affected sections changed. Review and confirm the current impact.")
        if operation == "supplier.enable":
            expected, next_status, action = "disabled", "active", "Re-enabled"
        else:
            expected, next_status, action = "active", "disabled", "Disabled"
    else:
        fields(payload, ("confirmed",))
        confirmed(payload)
        if operation == "supplier.delete":
            reason = supplier_delete_reason(connection, supplier, sections)
            if reason:
                raise FileExistsError(reason)
            connection.execute("DELETE FROM supplier_contacts WHERE supplier_id=?", (identity,))
            connection.execute("DELETE FROM supplier_locations WHERE supplier_id=?", (identity,))
            connection.execute("DELETE FROM suppliers WHERE id=?", (identity,))
            log_change(connection, actor, "Deleted", name, "Company", identity)
            return None
        if sections:
            raise FileExistsError("Use Disable or Re-enable for a Supplier with supply history")
        if operation == "supplier.archive":
            expected, next_status, action = "active", "archived", "Archived"
        else:
            expected, next_status, action = "archived", "active", "Reactivated"
    if expected != status:
        raise FileExistsError("This Supplier status has already changed")
    connection.execute("UPDATE suppliers SET status=? WHERE id=?", (next_status, identity))
    log_change(connection, actor, action, name, "Company", identity, {"status": status}, {"status": next_status})
    return identity


def change_child(connection, actor, supplier, record, identity, operation, payload):
    table, writer = {
        "location": ("supplier_locations", save_location),
        "contact": ("supplier_contacts", save_contact),
        "note": ("supplier_notes", save_note),
    }[record]
    current = None if identity is None else child_record(connection, table, supplier, identity)
    if operation == f"{record}.save":
        writer(connection, actor, supplier, current, payload)
        return
    if current is None:
        raise LookupError("Supplier record not found")
    fields(payload, ("confirmed",))
    confirmed(payload)
    kind = record.title()
    if operation == "location.make-main":
        if current[8]:
            raise ValueError("Reactivate this Location before choosing it as Main Office")
        connection.execute("UPDATE supplier_locations SET is_main=0 WHERE supplier_id=? AND is_main=1", (supplier,))
        connection.execute("UPDATE supplier_locations SET is_main=1 WHERE id=?", (identity,))
        log_change(connection, actor, "Updated", current[2], "Main Office", identity)
    elif operation == f"{record}.delete":
        if record == "location":
            reason = location_delete_reason(connection, identity, current[7])
        elif record == "contact":
            reason = contact_delete_reason(current[9], current[10])
        else:
            reason = ""
        if reason:
            raise FileExistsError(reason)
        connection.execute(f"DELETE FROM {table} WHERE id=?", (identity,))
        if record == "note":
            log_note(connection, actor, "Deleted", supplier, identity, current[2], current[4:7])
        else:
            log_change(connection, actor, "Deleted", current[2], kind, identity)
    else:
        archived = current[8]
        set_archived(connection, actor, table, identity, current[2], kind, archived, operation)


def read_issue_rows(connection, supplier=None, *, recent=False):
    where, values = ("WHERE i.supplier_id=?", (supplier,)) if supplier is not None else ("", ())
    limit = ""
    if recent:
        where = "WHERE i.status IN ('Open','In Progress')"
        limit = "LIMIT 5"
    rows = connection.execute(f"""
        SELECT i.id,i.supplier_id,s.name,i.title,i.category_id,i.status,i.created_at,i.updated_at
        FROM supplier_issues i JOIN suppliers s ON s.id=i.supplier_id
        {where} ORDER BY i.updated_at DESC,i.id DESC {limit}
    """, values).fetchall()
    issues = {
        identity: {"id": identity, "supplierId": company, "supplierName": name, "title": title,
                   "categoryId": category, "status": status, "createdAt": created, "updatedAt": updated, "contacts": []}
        for identity, company, name, title, category, status, created, updated in rows
    }
    if issues and not recent:
        for issue, contact, name, archived in connection.execute(f"""
            SELECT x.issue_id,c.id,c.name,c.archived FROM supplier_issue_contacts x
            JOIN supplier_issues i ON i.id=x.issue_id
            JOIN supplier_contacts c ON c.id=x.contact_id
            {where} ORDER BY c.name COLLATE NOCASE,c.id
        """, values):
            issues[issue]["contacts"].append({"id": contact, "name": name, "archived": bool(archived)})
    return list(issues.values())


def read_issues(connection):
    return {"issues": read_issue_rows(connection), "issueCategories": directory_categories(connection, issues=True)}


def read_purchasing_dashboard(connection):
    total, available = connection.execute("SELECT count(*),count(CASE WHEN status='active' THEN 1 END) FROM suppliers").fetchone()
    counts = dict(connection.execute("SELECT status,count(*) FROM supplier_issues GROUP BY status"))
    return {"totalSuppliers": total, "availableSuppliers": available,
            "statusCounts": {status: counts.get(status, 0) for status in ISSUE_STATUSES},
            "recentIssues": read_issue_rows(connection, recent=True),
            "issueCategories": directory_categories(connection, issues=True)}


def read_issue(connection, supplier_id, identity):
    issue = child_record(connection, "supplier_issues", supplier_id, identity)
    company = get_supplier(connection, supplier_id)
    return {
        "supplier": {
            "id": supplier_id, "name": company[1], "revision": company[5],
            "contacts": [
                {"id": contact, "name": name, "archived": bool(archived)}
                for contact, name, archived in connection.execute(
                    "SELECT id,name,archived FROM supplier_contacts WHERE supplier_id=? ORDER BY name COLLATE NOCASE,id",
                    (supplier_id,),
                )
            ],
            "issueCategories": directory_categories(connection, issues=True),
        },
        "id": identity, "supplierId": supplier_id, "title": issue[2], "description": issue[3],
        "categoryId": issue[4], "status": issue[5], "createdBy": issue[7], "createdAt": issue[8],
        "updatedAt": issue[9],
        "contactIds": [contact for (contact,) in connection.execute(
            "SELECT contact_id FROM supplier_issue_contacts WHERE issue_id=? ORDER BY contact_id", (identity,)
        )],
        "updates": [
            {"id": update, "text": body, "createdBy": creator, "createdAt": created,
             "updatedBy": editor, "updatedAt": updated}
            for update, body, creator, created, editor, updated in connection.execute(
                "SELECT id,body,created_label,created_at,updated_label,updated_at FROM supplier_issue_updates "
                "WHERE issue_id=? ORDER BY created_at,id", (identity,)
            )
        ],
    }


def issue_snapshot(supplier_id, values, contacts, origin):
    title, description, category, status = values
    actor, author, created = origin
    return {"supplierId": supplier_id, "title": title, "description": description,
            "categoryId": category, "status": status, "contactIds": sorted(contacts),
            "createdById": actor, "createdBy": author, "createdAt": created}


def save_issue(connection, actor, supplier_id, identity, payload):
    current = child_record(connection, "supplier_issues", supplier_id, identity) if identity is not None else None
    if current:
        fields(payload, ("title", "description", "categoryId", "contactIds"), ("status", "newUpdate"))
    else:
        fields(payload, ("title", "description"), ("categoryId", "contactIds"))
    title = cleaned(payload["title"], "an Issue Title", required=True)
    description = cleaned(payload["description"], "a Main Description", 12000, required=True, multiline=True)
    status = payload.get("status", current[5] if current else "Open")
    if status not in ISSUE_STATUSES:
        raise ValueError("Choose a valid Issue Status")
    category = payload.get("categoryId")
    if category is not None:
        if type(category) is not int or not 0 < category < 2**63:
            raise ValueError("Choose a valid Issue Category")
        if not (current and category == current[4]) and not connection.execute(
                "SELECT 1 FROM supplier_issue_categories WHERE id=? AND archived=0", (category,)).fetchone():
            raise ValueError("Only active Issue Categories can be newly assigned")
    contacts = identities(payload.get("contactIds", []))
    previous = {contact for (contact,) in connection.execute(
        "SELECT contact_id FROM supplier_issue_contacts WHERE issue_id=?", (identity,)
    )} if current else set()
    for contact in contacts - previous:
        if child_record(connection, "supplier_contacts", supplier_id, contact)[8]:
            raise ValueError("Archived Contacts cannot be newly linked")
    new_update = cleaned(payload.get("newUpdate", ""), "Issue Update", 12000, multiline=True)
    author = connection.execute("SELECT username FROM accounts WHERE id=?", (actor,)).fetchone()[0]
    now = datetime.now(timezone.utc).isoformat(timespec="microseconds").replace("+00:00", "Z")
    values = (title, description, category, status)
    if current:
        if current[2:6] != values or previous != contacts:
            connection.execute("UPDATE supplier_issues SET title=?,description=?,category_id=?,status=?,updated_at=? WHERE id=?",
                               (*values, now, identity))
            log_change(connection, actor, "Updated", title, "Issue", identity,
                       issue_snapshot(supplier_id, current[2:6], previous, current[6:9]),
                       issue_snapshot(supplier_id, values, contacts, current[6:9]))
    else:
        identity = connection.execute(
            "INSERT INTO supplier_issues(supplier_id,title,description,category_id,status,created_by,created_label,created_at,updated_at) "
            "VALUES(?,?,?,?,?,?,?,?,?)", (supplier_id, *values, actor, author, now, now)
        ).lastrowid
        log_change(connection, actor, "Created", title, "Issue", identity,
                   after=issue_snapshot(supplier_id, values, contacts, (actor, author, now)))
    connection.executemany("DELETE FROM supplier_issue_contacts WHERE issue_id=? AND contact_id=?",
                           [(identity, contact) for contact in previous - contacts])
    connection.executemany("INSERT INTO supplier_issue_contacts VALUES(?,?,?)",
                           [(supplier_id, identity, contact) for contact in contacts - previous])
    if new_update:
        write_issue_update(connection, actor, supplier_id, identity, title, new_update)
    return identity


def write_issue_update(connection, actor, supplier_id, issue_id, title, body, current=None):
    author = connection.execute("SELECT username FROM accounts WHERE id=?", (actor,)).fetchone()[0]
    now = datetime.now(timezone.utc).isoformat(timespec="microseconds").replace("+00:00", "Z")
    if current:
        identity, previous, creator, created_label, created_at = current
        if previous == body:
            return
        connection.execute("UPDATE supplier_issue_updates SET body=?,updated_by=?,updated_label=?,updated_at=? WHERE id=?",
                           (body, actor, author, now, identity))
    else:
        identity = connection.execute(
            "INSERT INTO supplier_issue_updates(issue_id,body,created_by,created_label,created_at) VALUES(?,?,?,?,?)",
            (issue_id, body, actor, author, now),
        ).lastrowid
        creator, created_label, created_at = actor, author, now
    connection.execute("UPDATE supplier_issues SET updated_at=? WHERE id=?", (now, issue_id))
    snapshot = {"supplierId": supplier_id, "issueId": issue_id, "createdById": creator,
                "createdBy": created_label, "createdAt": created_at}
    log_change(connection, actor, "Corrected" if current else "Created", title, "Issue Update", identity,
               before={**snapshot, "text": previous} if current else None,
               after={**snapshot, "text": body})


def correct_issue_update(connection, actor, supplier_id, identity, payload):
    fields(payload, ("issueId", "text"))
    issue = child_record(connection, "supplier_issues", supplier_id, payload["issueId"])
    if type(identity) is not int or not 0 < identity < 2**63:
        raise LookupError("Issue Update not found")
    update = connection.execute(
        "SELECT id,body,created_by,created_label,created_at FROM supplier_issue_updates WHERE issue_id=? AND id=?",
        (issue[0], identity),
    ).fetchone()
    if not update:
        raise LookupError("Issue Update not found")
    body = cleaned(payload["text"], "an Issue Update", 12000, required=True, multiline=True)
    write_issue_update(connection, actor, supplier_id, issue[0], issue[2], body, update)
    return issue[0]


OPERATIONS = frozenset((
    "supplier.save", "supplier.archive", "supplier.reactivate", "supplier.delete",
    "supplier.disable", "supplier.enable", "category.save", "category.archive", "category.reactivate",
    "location.save", "location.archive", "location.reactivate", "location.delete", "location.make-main",
    "contact.save", "contact.archive", "contact.reactivate", "contact.delete", "note.save", "note.delete",
    "issue.save", "issue-update.correct", "issue-category.save", "issue-category.archive", "issue-category.reactivate",
))


def save_supplier_operation(connection, actor, session_token, request):
    """Check permissions and the displayed revision under the same lock as the write."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        if session_account(connection, session_token) != actor:
            raise PermissionError("Verified session required")
        supplier_access(connection, actor, edit=True)
        fields(request, ("operation", "data"), ("supplierId", "recordId", "revision"))
        operation = request["operation"]
        if not isinstance(operation, str) or operation not in OPERATIONS:
            raise ValueError("Invalid Supplier operation")
        data, supplier_id = request["data"], request.get("supplierId")
        identity, revision = request.get("recordId"), request.get("revision")
        record = operation.split(".")[0]
        if record in ("category", "issue-category"):
            result = save_category(connection, actor, identity, revision, operation, data)
        elif operation == "supplier.save" and supplier_id is None:
            result = read_supplier(connection, save_company(connection, actor, None, data), actor)
        else:
            supplier = get_supplier(connection, supplier_id)
            require_revision(revision, supplier[5])
            issue_id = None
            if operation == "supplier.save":
                save_company(connection, actor, supplier, data)
            elif record == "supplier":
                supplier_id = change_company_status(connection, actor, supplier, operation, data)
            elif record == "issue":
                issue_id = save_issue(connection, actor, supplier_id, identity, data)
            elif record == "issue-update":
                issue_id = correct_issue_update(connection, actor, supplier_id, identity, data)
            else:
                change_child(connection, actor, supplier_id, record, identity, operation, data)
            if supplier_id is None:
                result = read_directory(connection)
            else:
                connection.execute("UPDATE suppliers SET revision=revision+1 WHERE id=?", (supplier_id,))
                result = read_supplier(connection, supplier_id, actor)
                if issue_id is not None:
                    result["issue"] = read_issue(connection, supplier_id, issue_id)
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise


def read_supply_impact(connection, actor, identity):
    supplier_access(connection, actor, edit=True)
    _admin(connection, actor)
    supplier = get_supplier(connection, identity)
    return {"revision": supplier[5], "sections": supply_sections(connection, identity)}
