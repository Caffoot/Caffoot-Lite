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


## Read-only integration with the existing Caffoot Lite backend

The second, separately agreed experiment adds a **real-data, read-only entry point**, `integration.html`. It is not the fictional-data pilot described above.

The normal Python application will serve it at `/__dev/svelte-device-details/` **only when all three conditions hold**:

1. The test server has been explicitly started with `CAFFOOT_DEV_SVELTE_DETAILS=1`.
2. The Svelte build has been created locally under this folder's `dist/`.
3. The browser has an authenticated session with **Devices Read** permission or higher.

A normal v2.0.3 installation has none of the preview build files copied into its Docker image, and the route is switched **off by default**. The ordinary `/setup`, `/inventory`, API requests and Docker installation remain unchanged.

To try the real-data integration, use a **disposable local database**, never a production inventory. Build the frontend with `npm run build` and start the existing Python server with its normal HTTPS settings and the additional development-only environment flag. The preview uses the existing `/api/inventory/sections`, `/api/inventory/devices` and (only when permitted) `/api/inventory/racks` endpoints. It never requests IPAM data or makes a write request. There are no Edit, Save or Delete controls.

Automated tests cover the route's disabled-by-default setting, authentication and section permissions, static-file safety, actual browser rendering and important physical/virtual differences. The new workflow also confirms that the old login and inventory routes remain available. The existing full backend tests run separately on every relevant pull request.

**Still to do later, after separate agreement:** live editing and reservations, real save/validation flows, complete catalogues, detailed history, full permissions across Devices/IPAM/Racks, and wider UI migration. This small experiment does not claim that these are implemented.

The [v2.1 development issue](https://github.com/Caffoot/Caffoot-Lite/issues/266) records what we have approved. Neither this experiment nor its tests authorise a merge or release.

## Stage 2A: first Svelte workspace (development branch only)

This first **production-facing integration batch** uses the same real read-only
Devices implementation with reusable navigation and header components.

- `npm run build:workspace` builds a **separate** repository-root `workspace-dist/` static
  bundle. It does not ship the fictional-data pilot.
- Docker uses a temporary Node builder stage and copies only the compiled
  workspace files into the final Python image. Node is not required at runtime.
- The Python server serves `/workspace/` only when
  `CAFFOOT_SVELTE_WORKSPACE=1`, with an authenticated account that has at
  least one existing Devices, IPAM or Racks section permission. This switch
  is **off by default** and is not enabled in the published Compose files.
- The new sidebar displays only permitted sections. Unconverted areas and the
  top-right **My Account** link go to their real existing `/inventory#section`
  screens; the unchanged backend still decides what is authorised.
- Devices are **read only** in this new workspace. All existing Add/Edit/Save,
  IPAM, Racks, account and administrator actions remain available from the
  established application. No storage or business rule is migrated.

Run `python -m unittest discover -s tests -p test_svelte_workspace_http.py -v`
to check route protection. The branch's Stage 2A GitHub Actions workflow also
tests the real browser using a disposable SQLite fixture, runs the existing
browser regression, builds a Docker image without publishing it and retains
screenshots for owner review. This is not evidence of acceptance until the
tests and screenshots have actually been reviewed.

The full release remains v2.0.3. No public preview or new version is authorised.
