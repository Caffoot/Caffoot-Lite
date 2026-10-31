"""Installer-facing deployment settings (external HTTPS address and host port)."""
import re


def validate_published_port(value):
    if not isinstance(value, str) or not re.fullmatch(r"[0-9]{1,5}", value):
        raise ValueError("CAFFOOT_PORT must be a number between 1 and 65535")
    port = int(value)
    if not 1 <= port <= 65535:
        raise ValueError("CAFFOOT_PORT must be a number between 1 and 65535")
    return port
