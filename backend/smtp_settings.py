"""Optional self-hosted SMTP configuration and administrator test delivery.

SMTP is never required for sign-in or inventory.  Its configuration is held in
a Docker-host-owned private file beside the SQLite database, not browser
storage or an inventory JSON export. Protect backups of the /data volume.
Only safe non-secret fields may be returned to the browser.
"""
import ipaddress
import json
import os
import re
import smtplib
import ssl
import stat
import tempfile
import threading
import time
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

SMTP_LOCK = threading.Lock()
_TEST_LOCK = threading.Lock()
_NEXT_TEST_AT = 0.0
TEST_INTERVAL_SECONDS = 30
MAIL_TIMEOUT_SECONDS = 8

_DEFAULTS = {
    "host": "", "port": 587, "security": "starttls",
    "authenticate": True, "username": "", "password": "",
    "fromName": "Caffoot Lite", "fromEmail": "",
    "insecureConfirmed": False,
}
_EDITABLE_FIELDS = frozenset(_DEFAULTS)
_SAFE_HOST = re.compile(r"^[a-zA-Z0-9.-]+$", re.ASCII)
_EMAIL = re.compile(r"^[^\s@<>\x00-\x1f\x7f]+@[^\s@<>\x00-\x1f\x7f]+\.[^\s@<>\x00-\x1f\x7f]+$")


def config_path(database_path):
    return Path(database_path).with_name("smtp-settings.json")


def _read_private(path):
    path = Path(path)
    try:
        info = path.lstat()
    except FileNotFoundError:
        return None
    if not stat.S_ISREG(info.st_mode) or info.st_mode & 0o077:
        raise OSError("SMTP credentials require a private regular file")
    if info.st_size > 8192:
        raise OSError("Invalid SMTP settings file size")
    with path.open("r", encoding="utf-8") as source:
        settings = json.load(source)
    if not isinstance(settings, dict) or set(settings) != _EDITABLE_FIELDS:
        raise OSError("Invalid SMTP settings file")
    return settings


def public_settings(path):
    with SMTP_LOCK:
        saved = _read_private(path)
    value = saved or _DEFAULTS
    return {
        "configured": saved is not None,
        **{key: value[key] for key in value if key != "password"},
        "passwordConfigured": bool(value.get("password")),
    }


def _check_text(value, label, maximum, *, required=False):
    if (not isinstance(value, str) or len(value) > maximum or
            any(ord(char) < 32 or ord(char) == 127 for char in value)):
        raise ValueError("Invalid " + label)
    value = value.strip()
    if required and not value:
        raise ValueError(label + " is required")
    return value


def _validate_address(value, name):
    address = _check_text(value, name, 254, required=True)
    if not _EMAIL.fullmatch(address):
        raise ValueError("Enter a valid " + name)
    return address


def _validate_host(value):
    host = _check_text(value, "SMTP server address", 253, required=True)
    try:
        ipaddress.ip_address(host.strip("[]"))
        return host
    except ValueError:
        pass
    if not _SAFE_HOST.fullmatch(host) or ".." in host:
        raise ValueError("Invalid SMTP server address")
    if any(not label or len(label) > 63 or label[0] == "-" or label[-1] == "-"
           for label in host.split(".")):
        raise ValueError("Invalid SMTP server address")
    return host


def _validate(payload, existing):
    if not isinstance(payload, dict) or set(payload) != _EDITABLE_FIELDS:
        raise ValueError("Invalid SMTP configuration")
    host = _validate_host(payload["host"])
    port = payload["port"]
    if type(port) is not int or not 1 <= port <= 65535:
        raise ValueError("SMTP port must be between 1 and 65535")
    security = payload["security"]
    if security not in ("starttls", "ssl", "none"):
        raise ValueError("Unsupported SMTP connection security")
    authenticate = payload["authenticate"]
    insecure = payload["insecureConfirmed"]
    if type(authenticate) is not bool or type(insecure) is not bool:
        raise ValueError("Invalid SMTP authentication or connection confirmation")
    if security == "none" and not insecure:
        raise ValueError("Confirm the risks of unencrypted SMTP")
    if security == "none" and authenticate:
        raise ValueError("SMTP authentication requires encrypted transport")
    username = _check_text(payload["username"], "SMTP username", 254)
    supplied = _check_text(payload["password"], "SMTP password", 1024)
    if authenticate:
        if not username:
            raise ValueError("SMTP username is required")
        # Leaving Password blank retains the secret only for the same user.
        password = supplied or (
            existing.get("password", "") if existing and
            existing.get("username") == username and
            existing.get("authenticate") else ""
        )
        if not password:
            raise ValueError("SMTP password is required")
    else:
        username = ""
        password = ""
    from_name = _check_text(payload["fromName"], "sender name", 120)
    from_email = _validate_address(payload["fromEmail"], "sender email address")
    return {
        "host": host, "port": port, "security": security,
        "authenticate": authenticate, "username": username,
        "password": password, "fromName": from_name,
        "fromEmail": from_email, "insecureConfirmed": insecure if security == "none" else False,
    }


def save_settings(path, payload):
    """Validate and atomically save mode-0600 credentials on the data volume."""
    path = Path(path)
    with SMTP_LOCK:
        existing = _read_private(path)
        settings = _validate(payload, existing)
        path.parent.mkdir(parents=True, exist_ok=True)
        filename = None
        try:
            with tempfile.NamedTemporaryFile("w", encoding="utf-8",
                                             dir=path.parent, prefix=".smtp-",
                                             delete=False) as output:
                filename = output.name
                os.fchmod(output.fileno(), 0o600)
                json.dump(settings, output, ensure_ascii=False)
                output.flush()
                os.fsync(output.fileno())
            os.replace(filename, path)
        finally:
            if filename is not None:
                try:
                    Path(filename).unlink(missing_ok=True)
                except OSError:
                    pass
    return public_settings(path)


def _rate_limit_test():
    global _NEXT_TEST_AT
    with _TEST_LOCK:
        now = time.monotonic()
        if now < _NEXT_TEST_AT:
            raise ValueError("Please allow 30 seconds between test emails")
        _NEXT_TEST_AT = now + TEST_INTERVAL_SECONDS


def send_test_email(path, recipient):
    """Send only an administrator-initiated test, with a strict timeout and cooldown."""
    recipient = _validate_address(recipient, "test email recipient address")
    with SMTP_LOCK:
        config = _read_private(path)
    if config is None:
        raise ValueError("Configure SMTP before sending a test email")
    _rate_limit_test()
    mail = EmailMessage()
    mail["Subject"] = "Caffoot Lite SMTP test"
    mail["From"] = formataddr((config["fromName"], config["fromEmail"]))
    mail["To"] = recipient
    mail.set_content("This is a test message from your Caffoot Lite installation.")
    context = ssl.create_default_context()
    if config["security"] == "ssl":
        smtp = smtplib.SMTP_SSL(config["host"], config["port"],
                               timeout=MAIL_TIMEOUT_SECONDS, context=context)
    else:
        smtp = smtplib.SMTP(config["host"], config["port"],
                           timeout=MAIL_TIMEOUT_SECONDS)
    with smtp:
        smtp.ehlo()
        if config["security"] == "starttls":
            smtp.starttls(context=context)
            smtp.ehlo()
        if config["authenticate"]:
            smtp.login(config["username"], config["password"])
        smtp.send_message(mail)
    return {"status": "sent"}
