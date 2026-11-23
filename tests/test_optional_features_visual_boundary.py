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
        prior_warning = 'Review the protected confirmation steps before clearing inventory and managed options.'
        approved_warning = ('Review the protected confirmation steps before clearing inventory, managed options '
                            'and all Service Desk ticket data.')
        self.assertEqual(old.count(prior_warning), 1)
        old = old.replace(prior_warning, approved_warning)
        for name in ('data','email','maintenance'):
            panel=r'<section class="account-panel[^\"]*" data-section="'+name+r'" role="tabpanel">[\s\S]*?</section>'
            button=r'<button[^>]+data-tab="'+name+r'"[^>]*>[\s\S]*?</button>'
            for pattern in (panel,button):
                self.assertEqual(re.search(pattern,old)[0],re.search(pattern,new)[0],name)

    def test_existing_style_sources_and_twelve_design_pins_are_unchanged(self):
        for path in ('interface/styles/settings.css','interface/styles/ipam.css','interface/styles/device-details.css','interface/design-sources.json'):
            current = (ROOT/path).read_text()
            additions = {
                'interface/styles/settings.css': '\n[data-feature-card="equipment_lifecycle"] > .btn',
                'interface/styles/device-details.css': '\n.device-lifecycle-section {',
            }
            if path in additions:
                current = current.split(additions[path], 1)[0]
            self.assertEqual(current,baseline_text(path),path)
        self.assertEqual(len(json.loads((ROOT/'interface/design-sources.json').read_text())),12)

    def test_pi_correction_templates_keep_existing_dashboard_and_report_layout(self):
        for path in ('interface/screens/dashboard.html', 'interface/screens/shared.html'):
            original = subprocess.check_output(
                ['git', 'show', 'bda35d73398820f49c8c1cf0647aa1c8c92bbf2e:' + path],
                cwd=ROOT, text=True)
            current = (ROOT / path).read_text()
            if path.endswith('/dashboard.html'):
                current = current.split('\n<!-- interface-template:dashboard/lifecycle-panel -->', 1)[0]
                current = current.replace('                {{slot:28}}\n', '', 1)
            self.assertEqual(re.sub(r' data-dashboard-sections="[^"]*"', '', current), original)
