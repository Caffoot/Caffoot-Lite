"""Persistent self-signed TLS identity for standalone Next installations."""
import ipaddress
import os
import ssl
import subprocess
from pathlib import Path

CERT_NAME = "server.crt"
KEY_NAME = "server.key"


def subject_alternative_names(names):
    entries = []
    for name in names.split(","):
        name = name.strip()
        if not name or any(ch.isspace() for ch in name) or len(name) > 253:
            raise ValueError("invalid TLS hostname or IP address")
        try:
            ipaddress.ip_address(name)
        except ValueError:
            if not all(part and len(part) <= 63 and
                       part.strip("-").replace("-", "").isalnum()
                       for part in name.split(".")):
                raise ValueError("invalid TLS hostname or IP address")
            entries.append("DNS:" + name)
        else:
            entries.append("IP:" + name)
    if not entries:
        raise ValueError("TLS identity requires at least one hostname or IP")
    return ",".join(entries)


def ensure_certificate(directory, names):
    """Generate once; never silently replace an existing certificate or key."""
    directory = Path(directory)
    directory.mkdir(parents=True, exist_ok=True)
    cert, key = directory / CERT_NAME, directory / KEY_NAME
    if cert.exists() != key.exists():
        raise RuntimeError("TLS certificate/key pair incomplete; refusing replacement")
    if not cert.exists():
        san = subject_alternative_names(names)
        subprocess.run([
            "openssl", "req", "-x509", "-newkey", "rsa:3072",
            "-sha256", "-nodes", "-days", "825",
            "-keyout", str(key), "-out", str(cert),
            "-subj", "/CN=Caffoot Lite Next",
            "-addext", "subjectAltName=" + san,
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
        os.chmod(key, 0o600)
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.minimum_version = ssl.TLSVersion.TLSv1_2
    context.load_cert_chain(str(cert), str(key))
    return context
