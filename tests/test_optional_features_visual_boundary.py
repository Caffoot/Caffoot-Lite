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
    def approved_email_panel(self, panel):
        # Stage 5.6 (#425) adds one mailbox field and updates the affected copy.
        # Build the expected panel from the frozen markup to check every other byte.
        smtp_actions = '<div class="form-actions"><button class="btn btn-outline" data-action="reset-smtp-settings"'
        notification_field = (
            '<div class="divider"></div>\n'
            '<div class="mini-section">Service Desk Notifications</div>\n'
            '<div class="form-grid smtp-fields">\n'
            '<label class="setting-field full">IT Support Email Address '
            '<input placeholder="it-support@example.com" name="itSupportEmail" maxlength="254" '
            'type="email" aria-describedby="it-support-email-help"/></label>\n'
            '</div>\n'
            '<p class="muted-note" id="it-support-email-help">Use one shared IT mailbox or an individual '
            'administrator’s address. Leave blank to skip new-ticket emails. Staff can still create tickets.</p>\n'
        )
        for previous, approved in (
            (smtp_actions, notification_field + smtp_actions),
            ('<p class="muted-note preview-note">SMTP is optional. It does not enable notifications '
             'or account recovery on its own.</p>\n', ''),
            ('Caffoot Lite must still install, sign in and manage infrastructure without an email server. '
             'Configuring SMTP does not, by itself, turn on notifications or password recovery.',
             'Caffoot Lite can still manage inventory and Service Desk tickets when email is unavailable.'),
            ('Service Desk &amp; Tickets <span>Future</span>',
             'Service Desk &amp; Tickets <span>Configured SMTP Required</span>'),
            ('<p class="muted-note">Recovery and account-security notices are available when email is configured. '
             'Audit delivery and tickets remain planned.</p>', ''),
        ):
            self.assertEqual(panel.count(previous), 1, previous)
            panel = panel.replace(previous, approved)
        return panel

    def test_existing_settings_panels_and_tab_buttons_are_byte_preserved(self):
        old=baseline_text('interface/screens/settings.html')
        new=(ROOT/'interface/screens/settings.html').read_text()
        prior_warning = 'Review the protected confirmation steps before clearing inventory and managed options.'
        approved_warning = ('Review the protected confirmation steps before clearing operational records '
                            'and restoring default catalogues.')
        self.assertEqual(old.count(prior_warning), 1)
        old = old.replace(prior_warning, approved_warning)
        for name in ('data','email','maintenance'):
            panel=r'<section class="account-panel[^\"]*" data-section="'+name+r'" role="tabpanel">[\s\S]*?</section>'
            button=r'<button[^>]+data-tab="'+name+r'"[^>]*>[\s\S]*?</button>'
            expected_panel = re.search(panel,old)[0]
            if name == 'email':
                expected_panel = self.approved_email_panel(expected_panel)
            self.assertEqual(expected_panel,re.search(panel,new)[0],name)
            self.assertEqual(re.search(button,old)[0],re.search(button,new)[0],name)

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
            # #454 explicitly removes these redundant main-page eyebrows.
            # Preserve the exact comparison of every other byte.
            approved_removals = {
                'interface/screens/dashboard.html': (
                    ('YOUR INFRASTRUCTURE AT A GLANCE', 1),
                ),
                'interface/screens/shared.html': (
                    ('INFRASTRUCTURE INVENTORY', 2),
                    ('NETWORK ADDRESS MANAGEMENT', 1),
                    ('ACCOUNT ADMINISTRATION', 1),
                ),
            }
            for label, count in approved_removals[path]:
                line = '                    <div class="eyebrow">' + label + '</div>\n'
                self.assertEqual(original.count(line), count, label)
                original = original.replace(line, '')
            self.assertEqual(re.sub(r' data-dashboard-sections="[^"]*"', '', current), original)
