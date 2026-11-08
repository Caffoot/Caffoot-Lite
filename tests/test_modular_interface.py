"""Check pinned stylesheet provenance and the packaged template dependency graph."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]


class ModularInterfaceTests(unittest.TestCase):
    def test_every_design_stylesheet_is_the_exact_pinned_source(self):
        sources=json.loads((ROOT/'interface/design-sources.json').read_text())
        self.assertEqual(len(sources),12)
        for source in sources:
            with self.subTest(screen=source['screen']):
                original=subprocess.check_output(['git','show',source['revision']+':'+source['source']],cwd=ROOT,text=True)
                self.assertEqual(source['revision'],'c26db4a56bbc30f95b56201e81a7a76d13c6037b')
                self.assertEqual(hashlib.sha256(original.encode()).hexdigest(),source['htmlSha256'])
                for template in source['templates']:
                    self.assertTrue((ROOT/template).is_file(), template)
                expected='\n'.join(re.findall(r'<style\b[^>]*>([\s\S]*?)</style>',original))
                actual=(ROOT/'interface/styles'/ (source['screen']+'.css')).read_text()
                self.assertEqual(actual,expected)
                self.assertEqual(hashlib.sha256(actual.encode()).hexdigest(),source['cssSha256'])

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
