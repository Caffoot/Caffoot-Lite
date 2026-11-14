"""Package an isolated, offline visual preview from the accepted interface sources."""
import base64
import hashlib
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
BASELINE = '221739ae8c1331d396977adb6e79dc910f39380d'
PINNED = 'c26db4a56bbc30f95b56201e81a7a76d13c6037b'
ARCHIVE = '159424b56bb770ea6ab260764c4e9357d9c8667c'


def build_preview():
    """Embed the real styles, templates and logo without loading the application."""
    paths = [f'interface/styles/{name}.css' for name in
             ('utilities', 'shared', 'components', 'dialogs', 'users', 'themes')]
    templates = {}
    for filename in ('users', 'shared'):
        path = f'interface/screens/{filename}.html'
        paths.append(path)
        for name, body in re.findall(r'<!-- interface-template:([^ ]+) -->([\s\S]*?)<!-- /interface-template -->', (ROOT / path).read_text()):
            templates[name] = body
    navigation_path = 'interface/screens/navigation.html'
    paths.extend([navigation_path, 'interface/application.js', 'assets/caffoot-logo-256.png'])
    navigation = (ROOT / navigation_path).read_text()
    symbols = re.search(r'<svg[\s\S]*?</svg>', navigation)[0]
    sidebar_brand = re.search(r'<div class="brand">[\s\S]*?</div></div></div>', navigation)[0]
    logo = 'data:image/png;base64,' + base64.b64encode((ROOT / 'assets/caffoot-logo-256.png').read_bytes()).decode()
    sidebar_brand = sidebar_brand.replace('/assets/caffoot-logo-256.png', logo)
    topbar = re.search(r'<header class="topbar">[\s\S]*?</header>', navigation)[0]
    manifest = {'baseline': BASELINE, 'pinnedDesignRevision': PINNED,
                'functionalArchiveRevision': ARCHIVE, 'runtimeChanged': False,
                'embeddedOrFollowedSources': {path: hashlib.sha256((ROOT / path).read_bytes()).hexdigest() for path in paths}}
    manifest['pinnedDesigns'] = json.loads((ROOT / 'interface/design-sources.json').read_text())
    for source in manifest['pinnedDesigns']:
        original = subprocess.check_output(['git', 'show', PINNED + ':' + source['source']], cwd=ROOT)
        assert hashlib.sha256(original).hexdigest() == source['htmlSha256']
    manifest['functionalReferences'] = {}
    for name in ('caffoot-staff-member-login-preview.html', 'caffoot-staff-directory-assignments-preview.html'):
        original = subprocess.check_output(['git', 'show', ARCHIVE + ':future-design/stage-3-previews/' + name], cwd=ROOT)
        manifest['functionalReferences'][name] = hashlib.sha256(original).hexdigest()
    styles = '\n'.join(f'<style data-source="{path}">\n{(ROOT / path).read_text()}\n</style>' for path in paths if path.endswith('.css'))
    embedded = json.dumps(templates).replace('</', '<\\/')
    preview = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'">
<title>Caffoot Lite — Staff Preview Only — Do Not Merge</title>
<!-- Isolated visual preview. MIT-licensed Caffoot Lite interface sources are embedded unchanged. -->
{styles}<style data-source="preview-additions.css">{(HERE / 'preview-additions.css').read_text()}</style>
</head><body><div id="app" class="shell">{symbols}
<aside class="sidebar" id="sidebar" aria-label="Application Navigation">{sidebar_brand}<div id="preview-navigation"></div><div class="nav-bottom"><button class="nav-item subtle" data-destination="settings" id="preview-settings">Settings &amp; Data</button><button type="button" class="sidebar-button" id="preview-collapse" aria-label="Collapse Or Expand Menu" title="Collapse or expand sidebar"><svg width="15" height="15" fill="none" stroke="currentColor"><use href="#i-box"/></svg><span class="collapse-text">Collapse Menu</span></button></div></aside>
<div class="workspace">{topbar}<main class="main" id="main-content"></main></div>
<div class="toast" role="status" id="preview-toast"></div>
</div>
<details id="preview-review-controls"><summary>Preview Only · Sample Data · Controls</summary><div class="preview-review-panel"><h2>Visual Review Controls</h2><p>Fictional records. Changes stay in this page and reset on reload. No application connection.</p>
<div class="field"><label for="preview-persona">View As</label><select class="input" id="preview-persona"><option value="admin">Administrator</option><option value="staff-editor">Staff Editor · No Departments Read</option><option value="staff-reader">Staff Reader · No Departments Read</option><option value="department-editor">Department Editor Only</option><option value="department-reader">Department Reader Only</option></select></div>
<div class="field"><label for="preview-theme">Theme</label><select class="input" id="preview-theme"><option value="light">Light</option><option value="dark">Dark</option></select></div>
<label class="role-membership"><input type="checkbox" id="preview-assets"> Simulate IT Assets Enabled</label><p>Off by default. This review control changes sample visibility only; it is not a proposed feature control.</p><button class="btn" id="preview-reset">Reset Sample Data</button></div></details>
<script type="application/json" id="preview-source-templates">{embedded}</script>
<script>{(HERE / 'preview-interactions.js').read_text()}</script></body></html>'''
    (HERE / 'preview.html').write_text(preview)
    (HERE / 'source-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')


if __name__ == '__main__':
    build_preview()
