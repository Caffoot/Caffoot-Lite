# Caffoot Lite branding and browser assets

This folder holds the Caffoot hedgehog artwork, browser icons and locally bundled scripts/styles used by the current Docker/SQLite application and project documentation.

- `favicon.ico` and `apple-touch-icon.png` — browser and home-screen artwork.
- `caffoot-icon-1024.png` — high-resolution hedgehog branding.
- `caffoot-github-512.png` and `caffoot-logo-256.png` — project branding resources kept for documentation and design work.
- `qrcode.min.js` — bundled QR-code support for authentication setup.
- `tailwind.css` — local interface stylesheet used by the application.

The repository-root [Dockerfile](../Dockerfile) explicitly lists the assets copied into the runtime image. Some project artwork is kept in the repository without being bundled into the container. The standalone v1.3.3 HTML build and its historical scripts are preserved in the [v1.3.3 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3), **not** built by this repository's current Docker workflow.

Keep approved artwork and existing runtime references intact when updating the interface. Branding changes must not affect stored inventory or installation compatibility.
