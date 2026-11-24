"""Run the real HTTPS application with a disposable recovery mail sink."""
import sys
from pathlib import Path
from unittest.mock import patch

from backend import server


def capture_mail(_config, _recipient, _subject, body, **_details):
    Path(sys.argv[1]).write_text(body.split("\n\n")[1], encoding="utf-8")
    return True


with (
    patch.object(server, "PORT", int(sys.argv[2])),
    patch.object(server, "smtp_public_settings", return_value={"configured": True}),
    patch.object(server, "queue_email", side_effect=capture_mail),
    patch.object(server, "notify_security_change"),
):
    server.main()
