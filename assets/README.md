# Caffoot brand assets

This directory contains the approved official Caffoot hedgehog branding used from the v1.1.1 development cycle onward.

- `caffoot-icon-1024.png` — primary high-resolution application logo; embedded in the standalone HTML
- `caffoot-github-512.png` — GitHub/project branding image
- `caffoot-logo-256.png` — compact official logo
- `apple-touch-icon.png` — Apple home-screen icon; embedded in the standalone HTML
- `favicon.ico` — browser favicon; embedded in the standalone HTML

The source HTML references the files above using relative paths. The release build in `app/build-offline.cjs` embeds all referenced runtime images as data URIs so the distributed `Caffoot-Lite.html` works offline without an adjacent assets directory.

When changing artwork, rebuild the standalone HTML, run the build checks, and inspect the application header, browser tab icon, and offline behaviour before merging. Never modify stored inventory or backup data as part of a branding change.

The Caffoot name and mascot are project branding; see the repository README for the distinction from the MIT software licence.
