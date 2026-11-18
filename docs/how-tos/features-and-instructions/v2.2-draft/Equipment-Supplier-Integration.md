# Equipment Supplier Integration

> **Draft v2.2 — unreleased.** These instructions describe the Stage 4 development application. The examples use fictional companies and equipment. For the published release, use the [v2.1 guides](../README.md).

A purchasing Supplier is the company that provided equipment. A Manufacturer identifies who made it. For example, a monitor manufactured by Dell might be purchased from Northlight Technology Ltd. Record Dell under Manufacturer and Northlight Technology Ltd under Supplier.

## Enable Suppliers And Check Access

1. An administrator signs in using an authenticator and opens **Settings & Data → Optional Features**.
2. In **Additional Features**, enable **Suppliers**. Enable **Devices** or **IT Assets** as appropriate for the workflows your organisation uses.
3. In **Permissions**, check the user's role and account overrides. The switches and effective permissions apply independently. See [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md).
4. Ask the colleague to open the relevant equipment workflow. Devices Edit allows the chooser on the Device form, and IT Assets Edit allows it on the receiving form. The chooser gives authorised equipment editors available company names even if they have no Supplier Directory access. Suppliers Edit is needed to add a company.

Devices Read lets a colleague see the recorded Supplier name on Device Details while Suppliers is enabled. To open the full company record from Device Details they also need Suppliers Read. IT Assets receipt history keeps the originally recorded Supplier text available to authorised IT Assets readers.

## Record A Supplier On One Device

1. Open **IT → Devices → Device Inventory**. Select **Add Device**, or open a Device and select **Edit**.
2. In the opening **Device Identity** card, find **Supplier (Optional)**. Enter part of a company name. Select an available result with the pointer, or use the arrow keys and press **Enter** to confirm the highlighted company.
3. If the company is unlisted, type its name and leave the field without selecting a result. Caffoot Lite saves that text with the Device. A typed name that exactly matches a company is also text until you explicitly select the result.
4. Complete the other Device fields as normal. Select **Save Device** to save. Open Device Details to check the recorded name. If you have Suppliers Read and the Device has a confirmed company association, **View Supplier** opens that company.
5. **Cancel**, close or press **Escape** to leave the form. If the choice list is open, the first Escape closes the list. When asked about unsaved changes, select **Keep Editing** to return to the form or **Discard Changes** to drop the draft.

**Example.** Create Meeting Room Display, set its Manufacturer to Dell and select Northlight Technology Ltd as Supplier. If you duplicate the display to record another unit, check the blank Supplier field and record its own purchase information if known.

If an existing company is unavailable for new selections, the saved Device can still show its linked name. Leave the field alone to retain it. To correct it, select another available company, enter the correct text or clear the field, then save. When Suppliers is switched off, the field and associated display are hidden. Saving an unrelated Device edit retains the existing Supplier data, which becomes visible again when the feature is re-enabled.

## Add A Company From An Equipment Form

1. With Suppliers Edit, choose **+ Add Supplier** alongside the Supplier field in Device Identity or Receipt Details.
2. Enter the company name and any available company details, Main Office address, categories and contacts in the full Add Supplier form. Follow [Add And Correct A Supplier](Supplier-Management.md#add-and-correct-a-supplier) for help with its fields.
3. Select **Add Supplier**. The equipment form returns with all its entries and the newly saved company selected. Finish and save the equipment form to record the association.
4. Choose **Cancel**, close or press **Escape** to abandon company creation. If prompted, choose **Keep Editing** or **Discard Changes**. Discard returns you to the equipment form with its previous input intact. If company creation already succeeded, discarding the equipment form leaves that company in the directory.

If **+ Add Supplier** is missing but company choices are available, ask a colleague with effective Suppliers Edit to create the company, then reopen or refocus the chooser. Check for a duplicate company name if the creation form rejects the save.

## Record A Supplier When Equipment Arrives

1. Open **IT → IT Assets → Receive Stock**. Choose **New Stock Entry** or **Receive More Of An Existing Item** and enter the equipment details. See [IT Assets Stock Intake](IT-Assets-Stock-Intake.md).
2. In **Receipt Details**, enter **Quantity Received** and **Date Received**. In **Supplier (Optional)**, between the date and **Receipt Notes (Optional)**, choose an available company to confirm the association. You can leave the field blank or enter an unlisted name as text.
3. Complete the existing receipt checks and review **Receipt Summary**. Select **Record Receipt**. Open **Receipt History** to review the saved delivery.
4. Choose **Cancel**, then **Discard Changes** if prompted, to leave without recording the receipt or changing stock.

**Example.** Receive 50 USB keyboards from Northlight Technology Ltd. If Dockland Equipment Ltd later delivers 25 identical keyboards, use **Receive More Of An Existing Item** and choose Dockland for the second receipt. Each supplier belongs to its own delivery. Both receipts can add to the same pooled stock item.

With Suppliers switched off, **Supplier (Optional)** still accepts text on the receiving form. Existing confirmed associations and original receipt facts are retained. If a chosen company becomes unavailable before saving, review the error and select another available company or record text. **Issue Equipment** and **Get From Stock** continue to use their existing stock workflows without a Supplier selection. No receipt is inferred for the unit being issued or registered.

## Assign A Supplier To Existing Devices

An administrator needs Devices Edit with Devices and Suppliers enabled. An ordinary Devices editor can correct one Device in its own form.

1. Open **IT → Devices → Device Inventory**. Use **Search & Filter Devices** to find the records you want to change.
2. Select the checkboxes beside the Devices and choose **Assign Supplier** next to **Sort by**. Check the number of selected Devices.
3. Search for an available Supplier and select the matching company. Read the replacement warning if a selected Device already has Supplier information.
4. Select **Confirm Assignment** to apply the same Supplier to the selected Devices. Open Device Details to check a result. This action preserves their other fields and records who made the changes.
5. Select **Cancel** or close the dialog to leave the saved Devices unchanged. If any selected Device was removed, changed or is reserved for editing, the assignment is rejected for the entire selection. Refresh Device Inventory, wait for the other edit to finish if needed, and select the records again.

**Example.** You find a purchase order listing three independently purchased laptops from Northlight Technology Ltd. Search for the three Device Names, select the matching records and confirm the same Supplier. If you change the search before choosing **Assign Supplier**, check the selection again.

## Link, Correct Or Remove A Historical Receipt Association

You need IT Assets Edit while IT Assets and Suppliers are enabled. Use the original delivery record and any supporting delivery note to verify the Supplier.

1. Open **IT → IT Assets → Receipt History**. Find the delivery under **Stock Receipts** by its date, equipment and quantity. The **Supplier** column shows the name recorded when equipment arrived. Beneath it, check the current **Linked Supplier** or **No Supplier Association** label.
2. To link a single receipt, choose **Link Supplier**. For a confirmed link that needs correction, choose **Change Supplier**. Select the correct company and choose **Confirm Assignment**.
3. To update several deliveries, select the rows under **Stock Receipts** and choose **Assign Supplier** next to the heading. Review the count and any replacement warning, select the company and choose **Confirm Assignment**.
4. To remove a mistaken link, choose **Remove Supplier Association** on that receipt and select **Confirm Removal**. The original receipt text, date, quantity and stock movements remain in history. The supplier's record retains the historical protection and the correction is recorded in the Audit Trail.
5. Select **Cancel** or close the dialog to abandon the correction. If a receipt changes between selection and confirmation, no selected receipt is updated. Refresh Receipt History and review the current links before trying again.

**Example.** A receipt was recorded with the free-text name “Northlight”. The invoice confirms the company was Northlight Technology Ltd. Use **Link Supplier** on that receipt. If a later check shows the invoice belonged to a different delivery, choose **Change Supplier** or **Remove Supplier Association** as appropriate. The original recorded “Northlight” remains visible in the Supplier column.

Only individual deliveries can be corrected here. A row in Stock Inventory can represent several deliveries, each with a different Supplier. Supplier assignment does not change any Physically Held, Ready To Issue or issued quantities.

## Review What A Supplier Provided

You need **Suppliers Read**. You also need **Devices Read** or **IT Assets Read** for each enabled section whose records you want to inspect.

1. Open **Purchasing → Suppliers**, find the company and select its name or **View**.
2. In **Overview → At A Glance**, read **Supplier Equipment**. This is a quantity of physical units. A confirmed receipt contributes its original quantity. Each explicitly linked independent Device contributes one. A Device registered from stock adds no further units.
3. Select **Supplier Equipment** or open the **Supplied Equipment** tab. The list shows equipment name, source, type, identifier, original quantity, receipt date, status and available actions. **Visible Records** counts all the source records you may read for the company.
4. Use **Equipment Type** to narrow the displayed rows. Choose **All Equipment Types** to clear the filter. The filter leaves the Overview quantity and Visible Records count as they were.
5. Choose **View Device** to open the existing Device Details, or **View Receipt** to go to the original row under **IT Assets → Receipt History → Stock Receipts**. Use the browser Back control to return to the Supplier equipment list. Make corrections in the permitted Device or Receipt History workflow.

**Example.** A confirmed receipt for 50 USB keyboards and one independently added Device from the same company show **51 Supplier Equipment** and **2 Visible Records**. If the company supplies 10 laptops in one receipt and four are later registered as Devices, that delivery still represents 10 supplied units. An explicitly linked Device from stock can be listed separately, with a dash in **Original Quantity**. A dash in **Receipt Date** indicates a Device row.

A delivery keeps its original quantity after issue, return, preparation or write-off. The list shows an explicitly linked Device even when it is retired. Linking or correcting a receipt changes the company that gets credit for that original quantity. Removing the link removes the receipt from the current Supplier list and total while preserving its history.

If **Supplied Equipment** and **Supplier Equipment** are both absent, check whether you can read at least one enabled equipment section. A Supplier reader with only Devices Read sees only Device rows and their permitted quantities. A Supplier reader with only IT Assets Read sees only permitted receipt rows. If a company or equipment record becomes unavailable, reopen its current list and check your permissions and feature switches.

## Manage Supplier Availability And Retention

1. With an administrator account and Suppliers enabled, open the company under **Purchasing → Suppliers**. Review its status and the explanation beside the available actions.
2. For a company with confirmed supply history, choose **Disable**. Review the affected sections in the confirmation. The warning can include a section whose feature is currently off. Confirm or choose **Cancel** to leave the company available.
3. To make the company selectable again, open the same company and choose **Re-enable**. Review the latest warning before confirming. If the impact changes while the dialog is open, reopen the company and review it again.
4. Use the **Audit Trail** to check the recorded changes if your account has the required access. A correction or removal leaves the earlier relationship in the retained audit record. A company with confirmed supply history remains protected from deletion.

For company, location and contact lifecycle actions, see [Supplier Management](Supplier-Management.md). Keep the complete application data volume when following your organisation's SQLite backup process. The published v1.3.3 JSON import is an inventory migration path. Complete v2.2 installation, recovery and upgrade acceptance is tracked separately.
