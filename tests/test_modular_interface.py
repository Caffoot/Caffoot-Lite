"""Check pinned stylesheet provenance and the packaged template dependency graph."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]

# The approved Stage 6.6 reset and administrator eligibility rules sit before
# the final responsive block in Users, with all pinned bytes kept in order.
USERS_ADDITION_BOUNDARY = b'\n@media(max-width:730px){\n .shell,.shell.collapsed{'
USERS_APPROVED_RULES = b"""#staff-password-reset .modal-warning{margin-top:14px}
[data-password-reset-dialog] .users-management-modal .modal{width:min(490px,100%)}
[data-password-reset-dialog] .modal-actions{justify-content:flex-end;gap:10px;flex-wrap:wrap}
.reset-password-fields{display:grid;gap:15px}
#staff-password-reset-error{color:var(--theme-danger-text,#a52626);font-weight:650}
#staff-confirm-temporary-password[aria-invalid="true"]{outline:2px solid var(--theme-danger-text,#a52626);outline-offset:1px}
.account-reset-result{margin:12px 0 0;padding:12px;border:1px solid #c4e3d6;border-radius:9px;background:#eef8f3;color:#266c52;font-size:12px;line-height:1.5}
.dark .account-reset-result{background:var(--theme-good-bg);color:var(--theme-good-text);border-color:#065f46}
.administrator-eligibility{display:grid;gap:5px;margin-top:8px;color:var(--muted);font-size:11px}
.administrator-eligibility>div{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
"""


# #458 appends exactly these five reviewed rules to the pinned Audit Trail CSS.
AUDIT_APPROVED_RULES = b"""
/* #458: approved affected-record identity block in the existing dialog. */
.audit-modal .identity-grid { margin:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; padding:15px; border:1px solid var(--line); border-radius:10px; }
.audit-modal .identity-grid dt { display:block; font-size:10px; color:var(--muted); margin-bottom:6px; }
.audit-modal .identity-grid dd { margin:0; font-size:12px; font-weight:650; overflow-wrap:anywhere; }
@media(max-width:730px) { .audit-modal .identity-grid { grid-template-columns:1fr; } }

.audit-screen #activity-results tr[hidden] { display:none!important; }
"""


class ModularInterfaceTests(unittest.TestCase):
    def test_every_design_stylesheet_is_the_exact_pinned_source(self):
        sources=json.loads((ROOT/'interface/design-sources.json').read_text())
        self.assertEqual(len(sources),12)
        for source in sources:
            with self.subTest(screen=source['screen']):
                original=subprocess.check_output(['git','show',source['revision']+':'+source['source']],cwd=ROOT)
                self.assertEqual(source['revision'],'c26db4a56bbc30f95b56201e81a7a76d13c6037b')
                self.assertEqual(hashlib.sha256(original).hexdigest(),source['htmlSha256'])
                for template in source['templates']:
                    self.assertTrue((ROOT/template).is_file(), template)
                expected=b'\n'.join(re.findall(rb'<style\b[^>]*>([\s\S]*?)</style>',original))
                actual=(ROOT/'interface/styles'/ (source['screen']+'.css')).read_bytes()
                if source['screen']=='users':
                    self.assertEqual(expected.count(USERS_ADDITION_BOUNDARY), 1)
                    start = expected.index(USERS_ADDITION_BOUNDARY) + 1
                    end = start + len(USERS_APPROVED_RULES)
                    self.assertEqual(actual[start:end], USERS_APPROVED_RULES)
                    actual = actual[:start] + actual[end:]
                elif source['screen']=='audit-trail':
                    self.assertEqual(actual[len(expected):], AUDIT_APPROVED_RULES)
                    actual = actual[:len(expected)]
                self.assertEqual(actual,expected)
                self.assertEqual(hashlib.sha256(actual).hexdigest(),source['cssSha256'])

    def test_templates_and_includes_are_unique_and_resolvable(self):
        templates={}
        for file in (ROOT/'interface/screens').glob('*.html'):
            for name,body in re.findall(r'<!-- interface-template:([^ ]+) -->([\s\S]*?)<!-- /interface-template -->',file.read_text()):
                self.assertNotIn(name,templates)
                templates[name]=body
        calls=set(re.findall(r'renderInterfaceTemplate\("([^"]+)"', (ROOT/'interface/application.js').read_text()))
        self.assertFalse(calls-set(templates))
        for name,body in templates.items():
            for child in re.findall(r'<!-- interface-include:([^ ]+) -->',body):
                self.assertIn(child,templates)
                self.assertNotEqual(child,name)
        self.assertTrue((ROOT/'interface/screens/device-inventory.html').is_file())
        self.assertIn('COPY interface/ ./interface/',(ROOT/'Dockerfile').read_text())
