"""Keep the three existing Settings panels and approved styles unchanged."""
import json
import re
import subprocess
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
BASELINE='89ad05eab13f7a429dcbd5f4266a26e52f5de8d2'


def baseline_text(path):
    return subprocess.check_output(['git','show',BASELINE+':'+path],cwd=ROOT,text=True)


class OptionalFeaturesVisualBoundaryTests(unittest.TestCase):
    def test_existing_settings_panels_and_tab_buttons_are_byte_preserved(self):
        old=baseline_text('interface/screens/settings.html')
        new=(ROOT/'interface/screens/settings.html').read_text()
        for name in ('data','email','maintenance'):
            panel=r'<section class="account-panel[^\"]*" data-section="'+name+r'" role="tabpanel">[\s\S]*?</section>'
            button=r'<button[^>]+data-tab="'+name+r'"[^>]*>[\s\S]*?</button>'
            for pattern in (panel,button):
                self.assertEqual(re.search(pattern,old)[0],re.search(pattern,new)[0],name)

    def test_existing_style_sources_and_twelve_design_pins_are_unchanged(self):
        for path in ('interface/styles/settings.css','interface/styles/ipam.css','interface/styles/device-details.css','interface/design-sources.json'):
            self.assertEqual((ROOT/path).read_text(),baseline_text(path),path)
        self.assertEqual(len(json.loads((ROOT/'interface/design-sources.json').read_text())),12)
