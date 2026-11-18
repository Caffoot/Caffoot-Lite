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
