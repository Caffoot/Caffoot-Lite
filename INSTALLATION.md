# Install Caffoot Lite

**Infrastructure, Simplified. — For HomeLabs and Small Teams**

Caffoot Lite is a standalone HTML application. You do **not** need Docker, Node.js, a database, an account, or a web server to use the released file.

## ⚠️ Read this before you start — browser storage

**Your inventory is saved in the browser's local storage, NOT inside the HTML file.** Caffoot Lite does not provide automatic backups, cloud synchronisation or a server-side database.

**Clearing browser/site data may permanently erase your inventory.** A different browser or profile, or moving/renaming the HTML file, may show an empty inventory due to differing `file://` storage behaviour.

**Export JSON backups regularly and ALWAYS before upgrades, moves, renames or resets.** Save them outside the browser and test restoration. The backup may include sensitive network information.

## Download the released application

**v1.1.0 was published on 18 October 2026.** Download it from the [v1.1.0 release](https://github.com/caffoot/Caffoot-Lite/releases/tag/v1.1.0), or use the [latest stable release](https://github.com/caffoot/Caffoot-Lite/releases/latest).

1. Visit the [Caffoot Lite GitHub repository](https://github.com/caffoot/Caffoot-Lite).
2. Open **Releases** and select the latest stable release.
3. Expand **Assets** and download the version-named Caffoot Lite release ZIP (recommended, includes guides and licences), or download **`Caffoot-Lite.html`** directly. **Do not** choose GitHub's automatically generated “Source code (zip)” if you only want to run the application.
4. If using the release ZIP, extract it first. Save the HTML file in a folder you can find again, such as Documents/Caffoot-Lite.
5. Double-click the HTML file, or use **Open With** to choose Safari, Chrome, Edge or Firefox.
6. The app should open in a browser tab without an internet connection.

If your browser downloads the file instead of opening it, use the browser's **File → Open File** option to open the saved `.html` file.

## First steps

1. Open **IPAM → Manage Subnets** and create an IP Address Block, then add Network / VLAN subnets within it.
2. Open **Devices** and add a device using an address from an existing subnet.
3. Explore **IPAM**, **Racks** and the **Dashboard** as needed.
4. Find **Data Management** and export a **JSON backup** once you have added useful data.

## Where is my data?

Caffoot Lite stores its inventory in **this browser's local storage**. The HTML file is the application, **not** a database containing your devices. There is no automatic cloud sync or multi-user sharing.

**Important:** Browser storage for files opened with `file://` can differ between browsers and browser versions. Opening the file in another browser, a private/incognito window, or from another folder or filename may show a fresh inventory. Clearing browser/site data may permanently remove your inventory.

**Always export a JSON backup before** upgrading, moving/renaming the HTML file, resetting the app, clearing browser data, or changing browsers. Keep the backup somewhere safe and test that you can restore it.

## Troubleshooting

- **I see no devices:** Check that you opened the expected file in the same browser/profile. Restore a JSON backup if needed.
- **The file opens as text:** Confirm the filename ends in `.html`, not `.html.txt`, and choose a browser with **Open With**.
- **Changes do not persist:** Avoid private/incognito browsing; check browser storage restrictions, then export your data before trying a different browser or location.
- **The download is missing:** Check the [official latest release](https://github.com/caffoot/Caffoot-Lite/releases/latest) and expand **Assets**. Do not download arbitrary builds from unverified third parties.
- **An import fails:** Do not overwrite your only backup. Confirm you selected a Caffoot Lite JSON export and retain the original file for diagnosis.

For features and day-to-day workflows, see [USER-GUIDE.md](USER-GUIDE.md).


## Updating to a new version safely

In Settings & Data → Data Management, use **Check for updates** to check the latest published stable release. This is a manual online check; it does not send inventory or install anything. The check requires an internet connection and reports the latest public release.

1. Download a JSON backup from your current version.
2. Keep the old HTML and download the new `Caffoot-Lite.html` into a separate folder from the [official releases](https://github.com/caffoot/Caffoot-Lite/releases).
3. Open the new file in your usual browser. Saved data may be unavailable after moving or renaming a file.
4. If needed, choose your backup in Settings & Data and review the replacement summary before restoring.
5. Verify devices, IPAM, subnets and racks. Keep the old HTML and backup until satisfied.

The safe update guide and backups work offline. Newer backup schemas require a compatible app; retain your original backup for recovery.

## Complete release package

For v1.1.0, download `Caffoot-Lite-1.1.0.zip` from the [published release](https://github.com/caffoot/Caffoot-Lite/releases/tag/v1.1.0). Extract it and open `Caffoot-Lite.html`; keep the guides and licences beside it. `SHA256SUMS` contains file hashes for checking integrity. The standalone HTML also includes full software notices in About Caffoot Lite, available offline. Example backups under `app/fixtures/` are fictional demonstrations; importing one replaces the current inventory after confirmation.

### Local file storage scope

The upgrade test observed shared browser storage across original and renamed HTML paths in the CI Chromium profile. Do not assume separate folders protect separate inventories: restoring in a new copy can change data visible in the old copy. Other browsers may isolate paths. Keep an exported JSON backup outside the browser; use a separate browser profile for isolated test inventories. The test asserts restoration and persistence according to the observed scope instead of assuming isolation.
