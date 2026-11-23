/* The visual editor uses server-rendered fictional previews and the settings session. */
window.caffootEmailTemplates = (() => {
    'use strict';
    const endpoint = '/api/settings/email-templates';
    const maximumLogoBytes = 2 * 1024 * 1024;
    const defaultTestMessage = 'Test emails use fictional sample values and your saved SMTP settings.';
    let currentEditor;
    let settingsCsrf;

    async function requestEmailSettings(csrf, payload, signal) {
        const response = await fetch(endpoint, {
            cache: 'no-store', signal,
            ...(payload ? {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'X-CSRF-Token': csrf},
                body: JSON.stringify(payload)
            } : {})
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Email Templates is temporarily unavailable.');
        return result;
    }

    function emailElement(tag, className, value) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (value !== undefined) element.textContent = value;
        return element;
    }

    function setEmailFeedback(element, message = '', error = false) {
        element.textContent = message;
        element.classList.toggle('error', error);
        element.hidden = !message;
    }

    function renderEmailPreview(target, rendered, logo, companyName) {
        // The server builds all preview markup. Even links in the supplied wording
        // arrive without a destination, so the preview never contacts an external site.
        const content = document.createElement('template');
        content.innerHTML = rendered.html;
        const header = content.content.querySelector('.mail-hero');
        const existingLogo = header.querySelector('img');
        if (logo) {
            const image = existingLogo || document.createElement('img');
            image.src = `data:${logo.mime};base64,${logo.data}`;
            image.alt = companyName;
            image.className = 'mail-logo';
            const ratio = Math.min(1, 180 / logo.width, 72 / logo.height);
            image.width = Math.max(1, Math.round(logo.width * ratio));
            image.height = Math.max(1, Math.round(logo.height * ratio));
            if (!existingLogo) header.querySelector('.mail-brandname').replaceWith(image);
        } else if (existingLogo) {
            existingLogo.replaceWith(emailElement('div', 'mail-brandname', companyName));
        }
        target.replaceChildren(content.content);
    }

    function readCompanyLogo(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('The logo could not be read.'));
            reader.onload = async () => {
                try {
                    const image = new Image();
                    image.src = reader.result;
                    await image.decode();
                    if (!image.naturalWidth || !image.naturalHeight) throw new Error();
                    resolve({mime: file.type, data: reader.result.split(',', 2)[1],
                        width: image.naturalWidth, height: image.naturalHeight});
                } catch {
                    reject(new Error('The selected logo is not a valid PNG or JPEG.'));
                }
            };
            reader.readAsDataURL(file);
        });
    }

    function mountEmailEditor(panel, csrf, settings) {
        const find = selector => panel.querySelector(selector);
        const byId = id => find('#' + id);
        const subject = byId('email-subject');
        const editor = byId('rich-editor');
        const draftButton = byId('save-draft');
        const publishButton = byId('publish');
        const restoreButton = byId('restore-default');
        const sendButton = byId('send-test');
        const linkButton = byId('insert-link');
        const linkDialog = find('.email-link-dialog');
        const linkAddress = byId('email-link-address');
        const previewFeedback = byId('email-preview-feedback');
        const editorFeedback = byId('editor-feedback');
        const testResult = byId('test-result');
        const brandFeedback = byId('branding-feedback');
        const brandButton = byId('save-branding');
        const fileInput = byId('logo-upload');
        const logoButton = byId('choose-logo');
        const removeButton = byId('remove-logo');
        const brandingFields = {name: byId('company-name'), primary: byId('brand-primary'),
            accent: byId('brand-accent'), footer: byId('brand-footer')};
        const templates = new Map(settings.templates.map(template => [template.id, template]));
        let selected = templates.values().next().value;
        let loadedWording;
        let savedBranding = settings.branding;
        let pendingLogo = 'keep';
        let logoRequest = 0;
        let loadingLogo = false;
        let templateBusy = false;
        let brandingBusy = false;
        let sending = false;
        let activeTab = 'templates';
        let lastField = editor;
        let caret;
        let previewTimer;
        let previewRequest;
        let brandingTimer;
        let brandingRequest;

        function currentWording() {
            return {subject: subject.value, body: editor.innerHTML};
        }

        function templateEdited() {
            return subject.value !== loadedWording.subject || editor.innerHTML !== loadedWording.body;
        }

        function readBrandingFields() {
            return Object.fromEntries(Object.entries(brandingFields).map(([key, input]) => [key, input.value]));
        }

        function brandingEdited() {
            return pendingLogo !== 'keep' ||
                Object.entries(readBrandingFields()).some(([key, value]) => value !== savedBranding[key]);
        }

        function canLeaveEmailEditor() {
            if (!panel.isConnected) return true;
            if (templateBusy || brandingBusy || sending || loadingLogo) return false;
            return !(templateEdited() || brandingEdited()) || window.confirm('Discard unsaved Email Templates changes?');
        }

        function syncTemplateStatus() {
            const changed = templateEdited();
            const status = byId('template-status');
            status.textContent = changed ? 'Unsaved Changes' : selected.draft ? 'Saved Draft Ready'
                : selected.publishedDefault ? 'Published Default' : 'Published';
            status.classList.toggle('draft', changed || Boolean(selected.draft));
            status.classList.toggle('ready', !changed && !selected.draft);
            byId('draft-message').textContent = changed ? 'Save this draft before publishing.'
                : selected.draft ? 'Your published email is unchanged. Review and publish the saved draft when ready.'
                : 'The published wording is active for this template.';
            draftButton.disabled = templateBusy;
            restoreButton.disabled = templateBusy;
            publishButton.disabled = templateBusy || changed || !selected.draft ||
                !subject.value.trim() || !editor.textContent.trim();
            sendButton.disabled = sending;
        }

        function syncBrandingControls() {
            const logo = pendingLogo === 'keep' ? savedBranding.logo : pendingLogo;
            byId('logo-label').textContent = logo ? (logo.filename || 'Company Logo Uploaded') : 'No Logo Uploaded';
            removeButton.disabled = !logo || brandingBusy;
            logoButton.disabled = brandingBusy || loadingLogo;
            brandButton.disabled = brandingBusy || loadingLogo;
            byId('primary-code').textContent = brandingFields.primary.value.toUpperCase();
            byId('accent-code').textContent = brandingFields.accent.value.toUpperCase();
        }

        function renderTemplateChoices() {
            const list = byId('template-list');
            list.replaceChildren();
            for (const [group, label] of [['service', 'Service Desk'], ['account', 'Account & Security']]) {
                list.append(emailElement('div', 'template-group', label));
                for (const template of templates.values()) {
                    if (template.group !== group) continue;
                    const button = emailElement('button', 'template-option');
                    button.type = 'button';
                    button.classList.toggle('active', template.id === selected.id);
                    button.setAttribute('aria-pressed', String(template.id === selected.id));
                    button.append(emailElement('span', 'template-name', template.name),
                        emailElement('span', 'template-descriptor', template.hint));
                    if (template.draft) button.append(emailElement('span', 'mini-draft', 'Saved Draft Available'));
                    button.addEventListener('click', () => chooseEmailTemplate(template, true));
                    list.append(button);
                }
            }
        }

        function rememberEmailCaret() {
            if (document.activeElement === subject) {
                lastField = subject;
                return;
            }
            const selection = window.getSelection();
            if (selection.rangeCount && editor.contains(selection.getRangeAt(0).commonAncestorContainer)) {
                lastField = editor;
                caret = selection.getRangeAt(0).cloneRange();
            }
        }

        function restoreEmailCaret() {
            editor.focus();
            const selection = window.getSelection();
            const range = caret && editor.contains(caret.commonAncestorContainer) ? caret : document.createRange();
            if (range !== caret) {
                range.selectNodeContents(editor);
                range.collapse(false);
            }
            selection.removeAllRanges();
            selection.addRange(range);
            return range;
        }

        function insertEmailToken(token) {
            if (lastField === subject) {
                subject.focus();
                const {selectionStart, selectionEnd} = subject;
                if (subject.value.length - (selectionEnd - selectionStart) + token.length > subject.maxLength) {
                    setEmailFeedback(editorFeedback, 'The subject can contain up to 240 characters.', true);
                    return;
                }
                subject.setRangeText(token, selectionStart, selectionEnd, 'end');
            } else {
                const range = restoreEmailCaret();
                const text = document.createTextNode(token);
                range.deleteContents();
                range.insertNode(text);
                range.setStartAfter(text);
                range.collapse(true);
                rememberEmailCaret();
            }
            editEmailWording();
        }

        async function copyEmailToken(token) {
            try {
                await navigator.clipboard.writeText(token);
                setEmailFeedback(editorFeedback, 'Copied ' + token + '.');
            } catch {
                setEmailFeedback(editorFeedback, 'Select and copy ' + token + ' from Available Variables.', true);
            }
        }

        function renderEmailVariables() {
            const variables = byId('variable-list');
            const menu = byId('insert-menu');
            variables.replaceChildren();
            menu.replaceChildren(new Option('＋ Insert Placeholder…', ''));
            for (const {key, label, help} of selected.variables) {
                const token = '{{' + key + '}}';
                menu.add(new Option(label + ' — ' + token, token));
                const row = emailElement('div', 'var-row');
                const text = emailElement('div', 'var-description');
                text.append(emailElement('div', 'var-name', label), emailElement('code', 'var-token', token),
                    emailElement('div', 'var-help', help));
                const actions = emailElement('div', 'var-actions');
                for (const [caption, run] of [['Insert', insertEmailToken], ['Copy', copyEmailToken]]) {
                    const button = emailElement('button', 'btn btn-outline', caption);
                    button.type = 'button';
                    button.setAttribute('aria-label', caption + ' ' + label);
                    button.addEventListener('click', () => void run(token));
                    actions.append(button);
                }
                row.append(text, actions);
                variables.append(row);
            }
            byId('variable-count').textContent = selected.variables.length + ' available';
        }

        function chooseEmailTemplate(template, fromList = false) {
            if (templateBusy || sending || (fromList && template.id === selected.id)) return;
            if (fromList && templateEdited() && !window.confirm('Discard unsaved changes to this template?')) return;
            selected = template;
            const wording = selected.draft || selected.published;
            subject.value = wording.subject;
            editor.innerHTML = wording.body;
            loadedWording = currentWording();
            lastField = editor;
            caret = undefined;
            byId('selected-template-title').textContent = selected.name;
            byId('selected-template-event').textContent = selected.event;
            byId('selected-template-recipient').textContent = selected.group === 'account' ? 'Authorised account recipient'
                : selected.to.startsWith('technician') ? 'Assigned IT technician' : 'Authorised employee';
            setEmailFeedback(editorFeedback);
            setEmailFeedback(testResult, defaultTestMessage);
            renderTemplateChoices();
            if (fromList) find('.template-option.active').focus({preventScroll: true});
            renderEmailVariables();
            syncTemplateStatus();
            updateEmailPreview();
        }

        function updateEmailPreview() {
            clearTimeout(previewTimer);
            previewRequest?.abort();
            const request = new AbortController();
            previewRequest = request;
            const payload = {action: 'preview', id: selected.id, ...currentWording()};
            const recipient = selected.to;
            if (byId('preview-to').textContent !== recipient) byId('preview-email').replaceChildren();
            byId('preview-to').textContent = recipient;
            previewTimer = setTimeout(async () => {
                if (!panel.isConnected) return;
                try {
                    const result = await requestEmailSettings(csrf, payload, request.signal);
                    if (request.signal.aborted || !panel.isConnected) return;
                    if (result.brandingRevision !== savedBranding.revision) {
                        throw new Error('Another administrator changed Company Branding. Reload Settings to update the preview.');
                    }
                    byId('preview-subject').textContent = result.subject;
                    renderEmailPreview(byId('preview-email'), result, savedBranding.logo, savedBranding.name);
                    setEmailFeedback(previewFeedback);
                } catch (error) {
                    if (request.signal.aborted) return;
                    setEmailFeedback(previewFeedback, error.message, true);
                }
            }, 160);
        }

        function updateBrandingPreview() {
            clearTimeout(brandingTimer);
            brandingRequest?.abort();
            const request = new AbortController();
            brandingRequest = request;
            const values = readBrandingFields();
            values.name = values.name.trim() || savedBranding.name;
            const logo = pendingLogo === 'keep' ? savedBranding.logo : pendingLogo;
            brandingTimer = setTimeout(async () => {
                if (!panel.isConnected) return;
                try {
                    const result = await requestEmailSettings(csrf, {action: 'branding-preview', ...values}, request.signal);
                    if (request.signal.aborted || !panel.isConnected) return;
                    renderEmailPreview(byId('branding-preview-email'), result, logo, values.name);
                } catch (error) {
                    if (!request.signal.aborted) setEmailFeedback(brandFeedback, error.message, true);
                }
            }, 160);
        }

        function editEmailWording() {
            syncTemplateStatus();
            updateEmailPreview();
            setEmailFeedback(editorFeedback);
        }

        async function changeEmailTemplate(action) {
            if (templateBusy) return;
            if (action === 'restore' && !window.confirm('Load the original wording for ' + selected.name + '?')) return;
            const originalWording = currentWording();
            const payload = {action, id: selected.id};
            if (action !== 'restore') payload.revision = selected.revision;
            if (action === 'draft') Object.assign(payload, originalWording);
            templateBusy = true;
            syncTemplateStatus();
            try {
                const result = await requestEmailSettings(csrf, payload);
                const latest = currentWording();
                if (action !== 'restore') {
                    selected = {...selected, ...result};
                    templates.set(selected.id, selected);
                }
                const wording = action === 'restore' ? result : selected.draft || selected.published;
                if (action !== 'restore') {
                    const content = document.createElement('div');
                    content.innerHTML = wording.body;
                    loadedWording = {subject: wording.subject, body: content.innerHTML};
                }
                if (latest.subject === originalWording.subject && latest.body === originalWording.body) {
                    subject.value = wording.subject;
                    editor.innerHTML = wording.body;
                    caret = undefined;
                }
                renderTemplateChoices();
                updateEmailPreview();
                setEmailFeedback(editorFeedback, {
                    draft: 'Draft saved. The published email is unchanged.',
                    publish: 'Template published.',
                    restore: 'Default wording loaded. Save as Draft and Publish to use it.'
                }[action]);
            } catch (error) {
                setEmailFeedback(editorFeedback, error.message, true);
            } finally {
                templateBusy = false;
                syncTemplateStatus();
            }
        }

        async function sendTemplateTest() {
            const recipient = byId('test-email-address');
            if (sending || !recipient.reportValidity()) return;
            sending = true;
            syncTemplateStatus();
            setEmailFeedback(testResult, 'Sending test email…');
            try {
                await requestEmailSettings(csrf, {
                    action: 'test', id: selected.id, ...currentWording(), recipient: recipient.value.trim()
                });
                setEmailFeedback(testResult, 'Test email sent. Check the recipient’s inbox.');
            } catch (error) {
                setEmailFeedback(testResult, error.message, true);
            } finally {
                sending = false;
                syncTemplateStatus();
            }
        }

        function applySavedBranding() {
            for (const [key, input] of Object.entries(brandingFields)) input.value = savedBranding[key];
            pendingLogo = 'keep';
            fileInput.value = '';
            syncBrandingControls();
        }

        async function chooseCompanyLogo() {
            const file = fileInput.files[0];
            if (!file) return;
            fileInput.value = '';
            if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > maximumLogoBytes) {
                setEmailFeedback(brandFeedback, 'Choose a PNG or JPEG logo up to 2 MB.', true);
                return;
            }
            const reading = ++logoRequest;
            loadingLogo = true;
            syncBrandingControls();
            try {
                const logo = await readCompanyLogo(file);
                if (reading !== logoRequest) return;
                pendingLogo = {...logo, filename: file.name};
                setEmailFeedback(brandFeedback, 'Logo added to the preview. Save Company Branding to use it.');
                updateBrandingPreview();
            } catch (error) {
                if (reading === logoRequest) setEmailFeedback(brandFeedback, error.message, true);
            } finally {
                if (reading === logoRequest) {
                    loadingLogo = false;
                    syncBrandingControls();
                }
            }
        }

        async function saveCompanyBranding() {
            if (brandingBusy || loadingLogo) return;
            brandingBusy = true;
            const fields = readBrandingFields();
            const previousLogo = pendingLogo;
            const logo = previousLogo && previousLogo !== 'keep'
                ? {mime: previousLogo.mime, data: previousLogo.data} : previousLogo;
            syncBrandingControls();
            try {
                savedBranding = await requestEmailSettings(csrf, {
                    action: 'branding', revision: savedBranding.revision, ...fields, logo
                });
                if (Object.entries(readBrandingFields()).every(([key, value]) => value === fields[key])) {
                    applySavedBranding();
                } else {
                    pendingLogo = 'keep';
                }
                setEmailFeedback(brandFeedback, 'Company branding saved.');
                updateBrandingPreview();
                updateEmailPreview();
            } catch (error) {
                setEmailFeedback(brandFeedback, error.message, true);
            } finally {
                brandingBusy = false;
                syncBrandingControls();
            }
        }

        function showEmailSettingsTab(tab, focus = false) {
            activeTab = tab;
            for (const button of panel.querySelectorAll('[data-email-tab]')) {
                const active = button.dataset.emailTab === activeTab;
                button.setAttribute('aria-selected', String(active));
                button.tabIndex = active ? 0 : -1;
                if (focus && active) button.focus();
            }
            byId('email-template-pane').hidden = tab !== 'templates';
            byId('email-branding-pane').hidden = tab !== 'branding';
            if (tab === 'branding') updateBrandingPreview();
        }

        function insertEmailLink() {
            const address = linkAddress.value.trim();
            const ticketLink = address === '{{ticket_link}}' && selected.variables.some(variable => variable.key === 'ticket_link');
            let secureAddress = false;
            if (/^https:\/\/[^\s<>"\\{}]+$/i.test(address)) {
                try {
                    const parsed = new URL(address);
                    secureAddress = Boolean(parsed.hostname && !parsed.username && !parsed.password);
                } catch { /* The address is invalid. */ }
            }
            if (!ticketLink && !secureAddress) {
                setEmailFeedback(byId('email-link-feedback'), 'Enter a valid HTTPS link.', true);
                return;
            }
            linkDialog.close('insert');
            const range = restoreEmailCaret();
            const anchor = document.createElement('a');
            anchor.setAttribute('href', address);
            if (range.collapsed) {
                anchor.textContent = address;
                range.insertNode(anchor);
                range.setStartAfter(anchor);
                range.collapse(true);
            } else {
                anchor.append(range.extractContents());
                range.insertNode(anchor);
                range.selectNodeContents(anchor);
            }
            rememberEmailCaret();
            editEmailWording();
        }

        for (const event of ['focus', 'input', 'keyup', 'pointerup']) {
            editor.addEventListener(event, rememberEmailCaret);
            subject.addEventListener(event, rememberEmailCaret);
        }
        subject.addEventListener('input', editEmailWording);
        editor.addEventListener('input', editEmailWording);
        // Keep pasted or dragged HTML out of the live editor. Formatting is applied in the toolbar.
        editor.addEventListener('paste', event => {
            event.preventDefault();
            document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
        });
        editor.addEventListener('drop', event => event.preventDefault());
        editor.addEventListener('click', event => {
            if (event.target.closest('a')) event.preventDefault();
        });
        find('.editor-tools').addEventListener('pointerdown', rememberEmailCaret);
        for (const button of panel.querySelectorAll('[data-format]')) {
            button.addEventListener('click', () => {
                restoreEmailCaret();
                document.execCommand('styleWithCSS', false, 'false');
                document.execCommand(button.dataset.format, false, null);
                rememberEmailCaret();
                editEmailWording();
            });
        }
        const insertMenu = byId('insert-menu');
        insertMenu.addEventListener('change', () => {
            if (insertMenu.value) insertEmailToken(insertMenu.value);
            insertMenu.value = '';
        });
        linkButton.addEventListener('click', () => {
            linkDialog.returnValue = '';
            linkAddress.value = '';
            setEmailFeedback(byId('email-link-feedback'));
            linkDialog.showModal();
            linkAddress.focus();
        });
        linkDialog.addEventListener('close', () => {
            if (linkDialog.returnValue !== 'insert') linkButton.focus();
        });
        byId('email-link-cancel').addEventListener('click', () => linkDialog.close());
        byId('email-link-confirm').addEventListener('click', insertEmailLink);
        linkAddress.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                insertEmailLink();
            }
        });
        draftButton.addEventListener('click', () => void changeEmailTemplate('draft'));
        publishButton.addEventListener('click', () => void changeEmailTemplate('publish'));
        restoreButton.addEventListener('click', () => void changeEmailTemplate('restore'));
        sendButton.addEventListener('click', () => void sendTemplateTest());
        for (const button of panel.querySelectorAll('[data-email-tab]')) {
            button.addEventListener('click', () => showEmailSettingsTab(button.dataset.emailTab));
            button.addEventListener('keydown', event => {
                if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                    event.preventDefault();
                    const tab = event.key === 'Home' ? 'templates' : event.key === 'End' ? 'branding'
                        : activeTab === 'templates' ? 'branding' : 'templates';
                    showEmailSettingsTab(tab, true);
                }
            });
        }
        Object.values(brandingFields).forEach(input => input.addEventListener('input', () => {
            syncBrandingControls();
            updateBrandingPreview();
        }));
        logoButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => void chooseCompanyLogo());
        removeButton.addEventListener('click', () => {
            ++logoRequest;
            loadingLogo = false;
            pendingLogo = null;
            fileInput.value = '';
            syncBrandingControls();
            setEmailFeedback(brandFeedback, 'Logo removed from the preview. Save Company Branding to confirm.');
            updateBrandingPreview();
        });
        brandButton.addEventListener('click', () => void saveCompanyBranding());
        applySavedBranding();
        chooseEmailTemplate(selected);
        byId('email-template-workspace').hidden = false;
        return {panel, canLeave: canLeaveEmailEditor};
    }

    async function hydrateEmailTemplates(root) {
        const csrf = settingsCsrf;
        const panel = root.querySelector('.email-template-settings');
        if (!panel || panel.dataset.emailTemplatesLoaded) return;
        panel.dataset.emailTemplatesLoaded = 'true';
        const feedback = panel.querySelector('#email-template-loading');
        const retry = panel.querySelector('#email-template-retry');
        async function loadEmailTemplates() {
            setEmailFeedback(feedback, 'Loading Email Templates…');
            retry.hidden = true;
            try {
                const result = await requestEmailSettings(csrf);
                if (!panel.isConnected) return;
                currentEditor = mountEmailEditor(panel, csrf, result);
                setEmailFeedback(feedback);
            } catch (error) {
                setEmailFeedback(feedback, error.message, true);
                retry.hidden = false;
            }
        }
        retry.addEventListener('click', () => void loadEmailTemplates());
        await loadEmailTemplates();
    }

    return {
        configure: token => { settingsCsrf = token; },
        hydrate: hydrateEmailTemplates,
        canLeave: () => currentEditor?.canLeave() ?? true
    };
})();
