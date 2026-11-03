# Svelte Device Details Pilot

This is a **separate, non-saving design and technology experiment** for [Caffoot Lite v2.1 — UI Redesign #266](https://github.com/Caffoot/Caffoot-Lite/issues/266). It does not replace or connect to the published v2.0.3 application.

We are testing whether Svelte can reproduce the accepted [Device Details & Forms Batch 04](../../future-design/approved/devices-details-forms-batch-04.html) and keep the interface straightforward to maintain. The real application, Python backend, SQLite database, Docker configuration and existing tests are untouched.

## Try it on your own computer

From this folder (requires Node.js 22):

```sh
npm install
npm run dev
```

Open the local address printed by Vite. Choose the physical device or virtual machine, open Device Details, try its tabs and Edit Device form, or switch to the read-only demonstration.

To test the compiled site using a simple web server rather than a Node.js application server:

```sh
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Then open `http://127.0.0.1:4173`. Node.js is only needed to **build** this preview; the compiled output is plain HTML, CSS, JavaScript and the existing brand image.

## What this pilot can show

- The accepted shared page navigation and Device Details dialog layout.
- An example physical hypervisor and a VM, with the correct physical-only Hardware tab and a host relationship.
- Editing controls, device-type-aware platform choices, rack fields, software and service selection, keyboard handling and a read-only view.
- Screenshots and automated browser checks in GitHub Actions, including mobile widths.

Everything on screen is **fictional demonstration data**. The Save Device button only validates the sample form and shows a message; it does not save a record. The other sections and account button are intentionally disabled to avoid suggesting the whole application is already rebuilt.

## What remains to prove before using Svelte in the app

- Actual Python API integration, sessions, CSRF and permission enforcement.
- Real edit reservations, IPAM consistency, Rack synchronisation and persisted data.
- Full forms/catalogue behaviour and comprehensive accessibility checks.
- Final visual acceptance and a separately agreed decision about whether to adopt Svelte.

No public Docker/GHCR preview image is built or published. We will review the pilot results before considering any production integration or release.
