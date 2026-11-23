// Connect the Service Desk screens to the same access checks used by ticket history.
window.caffootServiceDesk = (() => {
    'use strict';
    const apiRoot = '/api/service-desk/it/';
    const statuses = ['Open', 'In Progress', 'On Hold', 'Closed'];
    const priorities = ['Low', 'Medium', 'High'];
    const holdReasons = ['Waiting for User', 'Waiting for Supplier', 'Waiting for Parts', 'Other'];
    const reassignmentReasons = ['Sickness', 'Annual Leave / Holiday', 'Other Absence', 'Required Skill Set',
        'Workload / Availability', 'Other / Not Listed'];
    const tabs = ['Overview', 'Updates', 'History'];
    const pageSize = 50;
    const maximumFileBytes = 10000000;
    const maximumRetainedBytes = 100000000;
    const fileFormats = '.png,.jpg,.jpeg,.pdf,.txt,.docx,.xlsx';
    const dates = new Intl.DateTimeFormat('en-GB', {dateStyle:'medium', timeStyle:'short'});
    let config, currentDialog, queueRefresh;

    async function requestTickets(path, payload, signal) {
        const response = await fetch(apiRoot + path, {
            cache:'no-store', signal,
            ...(payload === undefined ? {} : {method:'POST', headers:{
                'Content-Type':'application/json', 'X-CSRF-Token':config.csrf
            }, body:JSON.stringify(payload)})
        });
        if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            const message = response.status === 403 ? 'You no longer have permission for this Service Desk action.'
                : response.status === 401 ? 'Sign in again to use Service Desk.'
                : result.error || 'Unable to complete the Service Desk request.';
            const error = new Error(message);
            error.status = response.status;
            throw error;
        }
        return response.json();
    }

    function ticketNumber(id) {
        return 'SD-' + String(id).padStart(4, '0');
    }

    function ticketOptions(choices, selected = '') {
        return choices.map(choice => {
            const [value, label] = Array.isArray(choice) ? choice : [choice, choice];
            return `<option value="${escapeHtml(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${escapeHtml(label)}</option>`;
        }).join('');
    }

    function ticketDate(value) {
        return value ? dates.format(new Date(value)) : '—';
    }

    function ticketTag(value) {
        return `<span class="service-desk-tag" data-ticket-tag="${escapeHtml(value)}">${escapeHtml(value)}</span>`;
    }

    function renderTicketQueue() {
        return renderInterfaceTemplate('service-desk/queue', [
            config.canEdit() ? '' : 'hidden', ticketOptions(statuses, 'Open'), ticketOptions(priorities)
        ]);
    }

    function renderTicketRows(tickets) {
        return tickets.map(ticket => `<tr>
          <td><button class="device-name" type="button" data-ticket-open="${ticket.id}">${ticketNumber(ticket.id)}</button><div class="device-detail">${escapeHtml(ticket.subject)}</div></td>
          <td>${escapeHtml(ticket.employee || ticket.author)}</td><td>${escapeHtml(ticket.equipmentLabel || ticket.equipmentId)}</td>
          <td>${ticketTag(ticket.priority)}</td><td>${ticketTag(ticket.status)}</td>
          <td>${escapeHtml(ticket.technician || 'Unassigned')}</td><td>${ticketDate(ticket.updatedAt)}</td>
          <td><button class="btn btn-small btn-outline" type="button" data-ticket-open="${ticket.id}" aria-label="Open Details For ${ticketNumber(ticket.id)}">Open Details</button></td>
        </tr>`).join('') || '<tr><td colspan="8" class="service-desk-empty">No tickets match the selected filters.</td></tr>';
    }

    function hydrateTicketQueue(container) {
        const page = container.querySelector('.service-desk-page');
        const filters = page.querySelector('#ticket-queue-filters');
        const counts = page.querySelector('[data-ticket-workload]');
        const rows = page.querySelector('[data-ticket-rows]');
        const count = page.querySelector('[data-ticket-count]');
        const pagination = page.querySelector('[data-ticket-pagination]');
        let offset = 0, pendingSearch, request;
        async function refreshQueue() {
            if (!page.isConnected) return;
            clearTimeout(pendingSearch);
            request?.abort();
            request = new AbortController();
            const signal = request.signal;
            const params = new URLSearchParams();
            for (const [key, value] of new FormData(filters)) {
                if (value) params.set(key, value);
            }
            params.set('offset', offset);
            page.setAttribute('aria-busy', 'true');
            try {
                const data = await requestTickets('tickets?' + params, undefined, signal);
                if (signal.aborted || !page.isConnected) return;
                if (offset > 0 && !data.tickets.length) {
                    offset = Math.max(0, offset - pageSize);
                    void refreshQueue();
                    return;
                }
                const technician = filters.elements.technician;
                const selected = technician.value;
                const choices = data.technicians.map(entry => [entry.id, entry.name]);
                if (selected && !choices.some(([id]) => String(id) === selected)) {
                    choices.push([selected, technician.selectedOptions[0].textContent]);
                }
                technician.innerHTML = ticketOptions([['', 'All Technicians'], ...choices], selected);
                counts.innerHTML = statuses.slice(0, 3).map((status, index) => `
                    <button type="button" class="service-desk-workload-card" data-workload-status="${status}" aria-pressed="${status === filters.elements.status.value}">
                        <span class="service-desk-stat-head">${status}<span aria-hidden="true">${['◫','⚒','Ⅱ'][index]}</span></span>
                        <strong>${data.workloadCounts[status]}</strong><small>View Matching Tickets →</small>
                    </button>`).join('');
                rows.innerHTML = renderTicketRows(data.tickets);
                const first = data.tickets.length ? offset + 1 : 0;
                count.textContent = `Showing ${first}–${offset + data.tickets.length} of ${data.filteredTotal} Tickets`;
                pagination.hidden = data.filteredTotal <= pageSize;
                pagination.querySelector('[data-ticket-page="-1"]').disabled = offset === 0;
                pagination.querySelector('[data-ticket-page="1"]').disabled = offset + pageSize >= data.filteredTotal;
            } catch (error) {
                if (signal.aborted || !page.isConnected) return;
                counts.replaceChildren();
                rows.replaceChildren();
                pagination.hidden = true;
                count.textContent = error.message;
                if (error.status === 403) page.querySelector('[data-ticket-create]').hidden = true;
            } finally {
                if (!signal.aborted) page.removeAttribute('aria-busy');
            }
        }
        function changeTicketFilters() {
            offset = 0;
            void refreshQueue();
        }
        filters.addEventListener('submit', event => {
            event.preventDefault();
            changeTicketFilters();
        });
        function resetTicketFilters() {
            for (const field of ['search','priority','assignment','technician']) filters.elements[field].value = '';
            filters.elements.status.value = 'Open';
            filters.elements.sort.value = 'newest';
            changeTicketFilters();
        }
        filters.addEventListener('reset', event => {
            event.preventDefault();
            resetTicketFilters();
        });
        page.addEventListener('change', event => {
            if (event.target.form === filters && event.target.name !== 'search') changeTicketFilters();
        });
        filters.elements.search.addEventListener('input', () => {
            clearTimeout(pendingSearch);
            request?.abort();
            pendingSearch = setTimeout(changeTicketFilters, 220);
        });
        page.addEventListener('click', event => {
            const shortcut = event.target.closest('[data-workload-status]');
            const navigation = event.target.closest('[data-ticket-page]');
            if (shortcut) {
                filters.elements.status.value = shortcut.dataset.workloadStatus;
                filters.elements.assignment.value = '';
                changeTicketFilters();
                page.querySelector('#service-desk-queue').scrollIntoView({block:'start'});
                filters.elements.status.focus({preventScroll:true});
            } else if (navigation) {
                offset += Number(navigation.dataset.ticketPage) * pageSize;
                void refreshQueue();
            }
        });
        queueRefresh = {refresh:refreshQueue, reset:resetTicketFilters};
        void refreshQueue();
    }

    function renderTicketEquipmentPanel(kind, id) {
        if (!config?.canRead()) return '';
        const panelClass = kind === 'device' ? 'device-review-panel full' : 'card card-padded';
        return `<section class="${panelClass} service-desk-equipment" tabindex="-1" data-ticket-equipment-kind="${kind}" data-ticket-equipment-id="${escapeHtml(id)}">
          <h3>Linked Tickets</h3><div data-ticket-equipment-results aria-live="polite">Loading Tickets…</div>
        </section>`;
    }

    function hydrateTicketEquipment(root) {
        for (const panel of root.querySelectorAll('[data-ticket-equipment-kind]:not([data-ticket-equipment-ready])')) {
            panel.dataset.ticketEquipmentReady = '';
            const result = panel.querySelector('[data-ticket-equipment-results]');
            const query = new URLSearchParams({equipmentKind:panel.dataset.ticketEquipmentKind,
                equipmentId:panel.dataset.ticketEquipmentId, limit:10});
            const linkedPages = {offset:Number(panel.dataset.ticketEquipmentOffset || 0)};
            async function refreshEquipmentTickets() {
                query.set('offset', linkedPages.offset);
                try {
                    const {tickets, filteredTotal} = await requestTickets('tickets?' + query);
                    if (!panel.isConnected) return;
                    result.innerHTML = tickets.length ? `<ul>${tickets.map(ticket => `<li>
                      <button type="button" class="btn btn-small btn-outline" data-ticket-open="${ticket.id}">${ticketNumber(ticket.id)} · ${escapeHtml(ticket.subject)}</button>
                      ${ticketTag(ticket.status)}</li>`).join('')}</ul>
                      ${filteredTotal > 10 ? `<div class="service-desk-pagination">
                        <button type="button" class="btn btn-small btn-outline" data-linked-page="-1" ${linkedPages.offset === 0 ? 'disabled' : ''}>Previous</button>
                        <button type="button" class="btn btn-small btn-outline" data-linked-page="1" ${linkedPages.offset + 10 >= filteredTotal ? 'disabled' : ''}>Next</button>
                      </div>` : ''}` : 'No linked tickets.';
                } catch (error) {
                    if (error.status === 403 || error.status === 404) panel.hidden = true;
                    else result.textContent = error.message;
                }
            }
            panel.addEventListener('click', event => {
                const navigation = event.target.closest('[data-linked-page]');
                if (!navigation) return;
                linkedPages.offset += Number(navigation.dataset.linkedPage) * 10;
                panel.dataset.ticketEquipmentOffset = String(linkedPages.offset);
                void refreshEquipmentTickets();
            });
            panel.addEventListener('ticket-refresh', () => void refreshEquipmentTickets());
            void refreshEquipmentTickets();
        }
    }

    function openTicketWindow(eyebrow, title, subtitle = '') {
        config.openModal(renderInterfaceTemplate('service-desk/dialog', [eyebrow, escapeHtml(title), escapeHtml(subtitle)]));
        return document.querySelector('.service-desk-dialog');
    }

    function showTicketError(dialog, message) {
        const alert = dialog.root.querySelector('[data-ticket-error]');
        alert.hidden = !message;
        alert.textContent = message || '';
    }

    function ticketDialogActive(dialog) {
        return dialog === currentDialog && dialog.root.isConnected;
    }

    async function openCreateTicket() {
        if (!config.canEdit()) return;
        const dialog = {root:openTicketWindow('Create Ticket', 'Create Ticket', 'Record a problem, maintenance task or support request.')};
        currentDialog = dialog;
        try {
            const [{equipment}, {categories}] = await Promise.all([
                requestTickets('equipment'), requestTickets('categories')
            ]);
            if (!ticketDialogActive(dialog)) return;
            dialog.equipment = equipment;
            dialog.root.querySelector('[data-ticket-body]').innerHTML = `<form id="service-desk-create-form" data-ticket-form="create">
              <div class="device-review-grid"><section class="device-review-panel full">
              <h3>New Support Ticket</h3><p>All Service Desk tickets are associated with an existing Device or IT Asset.</p>
              <label class="service-desk-field">Device / Asset <span aria-hidden="true">*</span><select name="equipment" required>
                ${ticketOptions([['','Select a Device / Asset…'], ...equipment.map((entry,index) => [index,entry.label])])}</select></label>
              <p>Employee access follows the equipment’s verified assignment.</p>
              ${equipment.length ? '' : '<p>No authorised equipment is available. Add or check the equipment record before creating a ticket.</p>'}
              <label class="service-desk-field">Ticket Category <span aria-hidden="true">*</span><select name="categoryId" required>
                ${ticketOptions([['','Select a Category…'], ...categories.map(entry => [entry.id, entry.name])])}</select></label>
              <label class="service-desk-field">Subject <span aria-hidden="true">*</span><input name="subject" maxlength="200" required placeholder="Briefly describe the issue"></label>
              <label class="service-desk-field">Description <span aria-hidden="true">*</span><textarea name="description" maxlength="16000" rows="5" required placeholder="Describe the issue or work required…"></textarea></label>
              ${ticketFileInput()}
              <p class="service-desk-info">New tickets start Open · Medium Priority · Unassigned.</p>
              </section></div></form>`;
            dialog.root.querySelector('[data-ticket-footer]').innerHTML = `
              <button type="button" class="btn btn-outline" data-ticket-dismiss>Cancel</button>
              <button type="submit" class="btn btn-primary" form="service-desk-create-form" ${equipment.length ? '' : 'disabled'}>Create Ticket</button>`;
        } catch (error) {
            if (ticketDialogActive(dialog)) {
                dialog.root.querySelector('[data-ticket-body]').replaceChildren();
                showTicketError(dialog, error.message);
            }
        }
    }

    async function openTicketDetails(id, source) {
        const dialog = {id, tab:'Overview', root:openTicketWindow('Ticket Details', ticketNumber(id)), source};
        currentDialog = dialog;
        await refreshTicketDetails(dialog);
    }

    async function refreshTicketDetails(dialog) {
        try {
            const ticket = await requestTickets('tickets/' + dialog.id);
            if (!ticketDialogActive(dialog)) return;
            dialog.ticket = ticket;
            dialog.root.querySelector('h2').textContent = ticketNumber(ticket.id) + ' — ' + ticket.subject;
            dialog.root.querySelector('[data-ticket-subtitle]').textContent =
                `${ticket.equipmentLabel || ticket.equipmentId} · Requester: ${ticket.employee || ticket.author} · ${ticket.status} · ${ticket.priority} Priority`;
            await showTicketTab(dialog);
        } catch (error) {
            if (ticketDialogActive(dialog)) {
                dialog.root.querySelector('[data-ticket-body]').replaceChildren();
                dialog.root.querySelector('[data-ticket-tabs]').hidden = true;
                dialog.root.querySelector('[data-ticket-footer]').innerHTML = '<button type="button" class="btn btn-outline" data-ticket-dismiss>Close</button>';
                showTicketError(dialog, error.message);
            }
        }
    }

    function ticketFact(label, value, edit = '') {
        return `<div><dt>${label}</dt><dd>${escapeHtml(value)}${edit}</dd></div>`;
    }

    function renderTicketOverview(ticket) {
        const edit = (key, label) => ticket.canEdit ? ` <button type="button" class="device-review-smallbtn" data-ticket-edit-field="${key}" aria-label="Edit ${label}">Edit</button>` : '';
        return `<div class="device-review-grid">
          <section class="device-review-panel"><h3>Ticket Information</h3><p>Current support request and classification.</p>
            <dl class="device-review-facts">
              ${ticketFact('Ticket Number', ticketNumber(ticket.id))}${ticketFact('Status', ticket.status)}
              ${ticketFact('Ticket Category', ticket.category, edit('category', 'Ticket Category'))}
              ${ticketFact('Priority', ticket.priority, edit('priority', 'Priority'))}
              ${ticketFact('Assigned Technician', ticket.technician || 'Unassigned')}${ticketFact('Last Updated', ticketDate(ticket.updatedAt))}
            </dl><div data-ticket-classification></div></section>
          <section class="device-review-panel"><h3>Equipment &amp; Requester</h3><p>This ticket stays linked to its canonical Device / IT Asset.</p>
            <dl class="device-review-facts">${ticketFact('Device / Asset', ticket.equipmentLabel || ticket.equipmentId)}
              ${ticketFact('Requester', ticket.employee || ticket.author)}${ticketFact('Equipment Record', 'Linked To IT Inventory')}
              ${ticketFact('Ticket Audience', 'Derived from verified equipment assignment')}</dl></section>
          <section class="device-review-panel full"><h3>Original Problem</h3><p class="service-desk-message-text">${escapeHtml(ticket.description)}</p></section>
          </div>`;
    }

    function ticketFileInput() {
        return `<label class="service-desk-field">Attachments (Optional)<input name="attachments" type="file" multiple accept="${fileFormats}"></label>
          <p>PNG, JPEG, PDF, TXT, DOCX or XLSX. Up to 10 MB per file and 100 MB retained per ticket.</p>`;
    }

    function renderTicketUpdates(ticket, messages, attachments) {
        const entries = messages.map(message => {
            const files = attachments.filter(attachment => attachment.messageId === message.id);
            return `<article class="service-desk-message">
              <div class="service-desk-message-head"><div><strong>${escapeHtml(message.author)}${message.kind === 'Resolution Note' ? ' · Resolution Note' : ''}</strong>
              <small>${ticketDate(message.createdAt)}${message.editedAt ? ' · Edited (Audited)' : ''}</small></div>
              ${ticket.canEdit && message.editable ? `<button type="button" class="device-review-smallbtn" data-ticket-edit-message="${message.id}">Edit</button>` : ''}</div>
              <p class="service-desk-message-text">${escapeHtml(message.body)}</p>
              <div class="service-desk-visibility" data-internal="${!message.employeeVisible}">${message.employeeVisible ? '◉ Employee Visible' : '▣ Internal · IT Only'}</div>
              ${files.length ? `<ul class="service-desk-files">${files.map(file => `<li>
                <a href="${apiRoot}tickets/${ticket.id}/attachments/${file.id}" download="${escapeHtml(file.filename)}">${escapeHtml(file.filename)}</a>
                ${ticket.canEdit ? `<button type="button" class="device-review-smallbtn" data-ticket-remove-file="${file.id}" aria-label="Remove ${escapeHtml(file.filename)}">Remove</button>` : ''}
                </li>`).join('')}</ul>` : ''}
            </article>`;
        }).join('');
        return `<div class="device-review-grid">
          <section class="device-review-panel full"><h3>Ticket Updates</h3><p>Chronological employee replies and technician notes, with permitted visibility.</p>
            ${entries || '<p>No updates have been added to this ticket yet.</p>'}</section>
          ${ticket.canEdit ? `<section class="device-review-panel full"><h3>${ticket.status === 'Closed' ? 'Add Internal Note' : 'Add Ticket Update'}</h3>
            <form data-ticket-form="messages">
              <label class="service-desk-field">Update<textarea name="body" rows="4" maxlength="16000" required placeholder="Record progress or write a message to the employee…"></textarea></label>
              ${ticket.status === 'Closed' ? '<p>Closed tickets accept internal IT notes. Reopen before adding an employee-visible update.</p>' :
                '<label class="device-review-checkbox"><input name="employeeVisible" type="checkbox"> Make Update Visible To Employee</label><p>Updates and their attachments are internal to IT by default. Authorised employees can read employee-visible updates and download their attachments.</p>'}
              ${ticketFileInput()}<div class="service-desk-form-actions"><button type="submit" class="btn btn-primary">Add Update</button></div>
            </form></section>` : ''}
        </div>`;
    }

    function ticketHistoryText(event) {
        const details = event.details;
        switch (event.kind) {
            case 'Created': return 'Created the ticket as Open, Medium and Unassigned.';
            case 'Status Changed':
                return `Changed status from ${details.before} to ${details.status}.${details.reason ? ' Reason: ' + details.reason + '.' : ''}${details.explanation ? ' Explanation: ' + details.explanation : ''}`;
            case 'Assignment Changed':
                return details.previousTechnician ? `Reassigned the ticket from ${details.previousTechnician} to ${details.technician}. Reason (IT Only): ${details.reason}.${details.explanation ? ' Explanation: ' + details.explanation : ''}`
                    : `Assigned the ticket to ${details.technician}.`;
            case 'Priority Changed': return `Changed priority from ${details.before} to ${details.priority}.`;
            case 'Category Changed': return `Changed category from ${details.previousCategory} to ${details.category}.`;
            case 'Closed': return 'Closed the ticket with an employee-visible Resolution Note.';
            case 'Reopened': return 'Reopened the ticket as Open and retained its previous assignee and closure history.';
            case 'Message Added': return 'Added a ticket update.';
            case 'Message Edited':
                return details.removedAttachmentId ? `Removed the attachment “${details.filename}”.`
                    : `Corrected a ticket update.${details.previousBody ? ' Previous text: ' + details.previousBody : ''}`;
            default: return event.kind;
        }
    }

    function renderTicketHistory(history) {
        return `<div class="device-review-grid"><section class="device-review-panel full"><h3>Ticket History</h3>
          <p>Audit of ticket lifecycle changes, including technician attribution and timestamps.</p>
          <ol class="service-desk-timeline">${history.map(event => `<li><strong>${escapeHtml(event.author)}</strong> ${escapeHtml(ticketHistoryText(event))}
          <small>${ticketDate(event.at)}</small></li>`).join('')}</ol></section></div>`;
    }

    function ticketActions(ticket) {
        if (!ticket.canEdit) return [];
        if (ticket.status === 'Closed') return [['reopen','Reopen Ticket']];
        if (ticket.status === 'On Hold') return [['resume','Resume Ticket']];
        return [['assign',ticket.technicianId ? 'Reassign Ticket' : 'Assign Ticket'], ['hold','Place On Hold'], ['close','Close Ticket']];
    }

    async function showTicketTab(dialog, focusTab = false) {
        const ticket = dialog.ticket;
        const tab = dialog.tab;
        dialog.action = null;
        const root = dialog.root;
        const nav = root.querySelector('[data-ticket-tabs]');
        const body = root.querySelector('[data-ticket-body]');
        showTicketError(dialog);
        nav.hidden = false;
        nav.innerHTML = tabs.map(name => `<button type="button" class="device-review-tab" role="tab"
          id="ticket-tab-${name.toLowerCase()}" aria-controls="service-desk-tab-panel" data-ticket-tab="${name}"
          tabindex="${name === tab ? 0 : -1}" aria-selected="${name === tab}">${name}</button>`).join('');
        if (focusTab) nav.querySelector('[aria-selected="true"]').focus();
        root.querySelector('[data-ticket-footer]').innerHTML = '<button type="button" class="btn btn-outline" data-ticket-dismiss>Close</button>'
          + ticketActions(ticket).map(([action, label]) => `<button type="button" class="btn ${action === 'close' ? 'btn-primary' : 'btn-outline'}" data-ticket-start="${action}">${label}</button>`).join('');
        body.id = 'service-desk-tab-panel';
        body.setAttribute('role', 'tabpanel');
        body.setAttribute('aria-labelledby', 'ticket-tab-' + tab.toLowerCase());
        body.scrollTop = 0;
        if (tab === 'Overview') {
            body.innerHTML = renderTicketOverview(ticket);
            return;
        }
        body.innerHTML = '<p role="status">Loading…</p>';
        const load = Symbol();
        dialog.tabLoad = load;
        try {
            const data = await requestTickets(`tickets/${dialog.id}/${tab === 'Updates' ? 'messages' : 'history'}`);
            if (!ticketDialogActive(dialog) || tab !== dialog.tab || load !== dialog.tabLoad || dialog.action) return;
            if (tab === 'Updates') dialog.updates = data;
            body.innerHTML = tab === 'Updates' ? renderTicketUpdates(ticket, data.messages, data.attachments) : renderTicketHistory(data.history);
        } catch (error) {
            if (ticketDialogActive(dialog) && dialog.tab === tab && load === dialog.tabLoad && !dialog.action) {
                body.replaceChildren();
                showTicketError(dialog, error.message);
            }
        }
    }

    function ticketActionForm(action, label, fields) {
        return `<div class="device-review-grid"><section class="device-review-panel full service-desk-action">
          <h3>${label}</h3><form data-ticket-form="${action}">${fields}
          <div class="service-desk-form-actions"><button type="button" class="btn btn-outline" data-ticket-cancel>Cancel</button>
            <button type="submit" class="btn btn-primary">${label}</button></div></form></section></div>`;
    }

    function ticketSelect(name, label, placeholder, choices) {
        return `<label class="service-desk-field">${label} <span aria-hidden="true">*</span><select name="${name}" required>
          ${ticketOptions([['', placeholder], ...choices])}</select></label>`;
    }

    async function openTicketAction(dialog, action, id) {
        const ticket = dialog.ticket;
        const body = dialog.root.querySelector('[data-ticket-body]');
        const footer = dialog.root.querySelector('[data-ticket-footer]');
        const label = ticketActions(ticket).find(([key]) => key === action)?.[1];
        dialog.action = {action, id};
        const requestedAction = dialog.action;
        showTicketError(dialog);
        footer.innerHTML = '<button type="button" class="btn btn-outline" data-ticket-dismiss>Close</button>';
        let fields = '', title = label;
        const explanation = '<label class="service-desk-field">Additional Explanation (Optional)<textarea name="explanation" rows="3" maxlength="2000"></textarea></label>';
        if (action === 'assign') {
            body.innerHTML = '<p role="status">Loading Technicians…</p>';
            const reassign = !!ticket.technicianId;
            try {
                const {technicians} = await requestTickets(`tickets/${ticket.id}/technicians`);
                if (!ticketDialogActive(dialog) || dialog.action !== requestedAction) return;
                fields = ticketSelect('technicianId', reassign ? 'Reassign To' : 'Assign To', 'Select a Technician…',
                    technicians.map(entry => [entry.id, entry.name]));
                if (reassign) {
                    fields += ticketSelect('reason', 'Reason For Reassignment', 'Select a Reason…', reassignmentReasons)
                      + explanation + '<p>The reason and explanation remain internal to IT.</p>';
                } else fields += '<p>Assigning an Open ticket moves it to In Progress.</p>';
                if (!technicians.length) fields += '<p>No other authorised technician is available.</p>';
            } catch (error) {
                if (ticketDialogActive(dialog) && dialog.action === requestedAction) {
                    body.innerHTML = '<button type="button" class="btn btn-outline" data-ticket-cancel>Cancel</button>';
                    showTicketError(dialog, error.message);
                }
                return;
            }
        } else if (action === 'hold') {
            fields = ticketSelect('reason', 'Reason For On Hold', 'Select a Reason…', holdReasons) + explanation
              + '<label class="device-review-checkbox"><input name="employeeVisible" type="checkbox"> Make Explanation Visible To Employee</label><p>The On Hold reason is employee-visible. The explanation is internal to IT by default.</p>';
        } else if (action === 'resume') {
            fields = `<p>The ticket will return to its recorded previous status <strong>${escapeHtml(ticket.statusBeforeHold)}</strong>.</p>`;
        } else if (action === 'close') {
            fields = '<label class="service-desk-field">Resolution Note <span aria-hidden="true">*</span><textarea name="resolutionNote" rows="5" maxlength="16000" required placeholder="Explain how the problem was resolved…"></textarea></label><p class="service-desk-info">The Resolution Note is visible to the currently authorised employee audience.</p>';
        } else if (action === 'reopen') {
            fields = '<p>Reopen this ticket as <strong>Open</strong>, keeping the previous assigned technician, prior closure attempts and full history.</p>';
        } else if (action === 'edit-message') {
            const message = dialog.updates.messages.find(entry => entry.id === id && entry.editable);
            if (!message) return;
            title = 'Save Correction';
            fields = `<label class="service-desk-field">Correct Update<textarea name="body" rows="5" maxlength="16000" required>${escapeHtml(message.body)}</textarea></label><p>The original text is retained in the IT ticket history.</p>`;
        } else if (action === 'remove-file') {
            const file = dialog.updates.attachments.find(entry => entry.id === id);
            if (!file) return;
            title = 'Remove Attachment';
            fields = `<p>Remove <strong>${escapeHtml(file.filename)}</strong> from the ticket. The removal is recorded in its history.</p>`;
        }
        body.innerHTML = ticketActionForm(action, title, fields);
        body.scrollTop = 0;
        if (action === 'assign') {
            const form = body.querySelector('form');
            const submit = form.querySelector('button[type="submit"]');
            const checkAssignment = () => { submit.disabled = !form.matches(':valid'); };
            form.addEventListener('change', checkAssignment);
            checkAssignment();
        }
        body.querySelector('select,textarea,button')?.focus();
    }

    async function editTicketClassification(dialog, field) {
        const slot = dialog.root.querySelector('[data-ticket-classification]');
        if (!slot) return;
        const ticket = dialog.ticket;
        showTicketError(dialog);
        try {
            const priority = field === 'priority';
            const choices = priority ? priorities : (await requestTickets('categories')).categories.map(entry => [entry.id,entry.name]);
            if (!ticketDialogActive(dialog) || !slot.isConnected) return;
            const label = priority ? 'Priority' : 'Ticket Category';
            const selected = priority ? ticket.priority : ticket.categoryId;
            if (!priority && !choices.some(([id]) => id === selected)) choices.unshift(['', 'Select a Category…']);
            slot.innerHTML = `<form data-ticket-form="${field}" class="service-desk-classification">
              <label class="service-desk-field">${label}<select name="${priority ? 'priority' : 'categoryId'}" required>${ticketOptions(choices, selected)}</select></label>
              <div class="service-desk-form-actions"><button type="button" class="device-review-smallbtn" data-ticket-cancel-field="${field}">Cancel</button>
              <button type="submit" class="device-review-smallbtn primary">Save</button></div></form>`;
            slot.querySelector('select').focus();
        } catch (error) {
            if (ticketDialogActive(dialog)) showTicketError(dialog, error.message);
        }
    }

    async function ticketAttachmentPayload(input) {
        const files = [...(input?.files || [])];
        if (!files.length) return {};
        if (files.some(file => !file.size || file.size > maximumFileBytes))
            throw new Error('Each attachment must be between 1 byte and 10 MB.');
        if (files.reduce((total, file) => total + file.size, 0) > maximumRetainedBytes)
            throw new Error('A ticket can retain up to 100 MB of attachments.');
        const attachments = [];
        for (const file of files) {
            const contents = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result).split(',')[1]);
                reader.onerror = () => reject(new Error('Could not read ' + file.name + '.'));
                reader.readAsDataURL(file);
            });
            attachments.push({filename:file.name, contents});
        }
        return {attachments};
    }

    async function saveTicketForm(dialog, form) {
        const action = form.dataset.ticketForm;
        const data = new FormData(form);
        dialog.root.dataset.saving = 'true';
        const buttons = [...dialog.root.querySelectorAll('button:not([disabled])')];
        buttons.forEach(button => { button.disabled = true; });
        showTicketError(dialog);
        try {
            let path = 'tickets', payload = {};
            if (action === 'create') {
                const selected = dialog.equipment[Number(data.get('equipment'))];
                payload = {equipmentId:selected.id, equipmentKind:selected.kind, categoryId:Number(data.get('categoryId')),
                    subject:data.get('subject'), description:data.get('description'), ...await ticketAttachmentPayload(form.elements.attachments)};
                if (selected.stockIssueId) payload.stockIssueId = selected.stockIssueId;
            } else {
                path += '/' + dialog.id + '/';
                const subresource = action === 'edit-message' ? 'messages/' + dialog.action.id
                    : action === 'remove-file' ? 'attachments/' + dialog.action.id : action;
                path += subresource;
                for (const [key, value] of data) {
                    if (key === 'attachments') continue;
                    payload[key] = ['categoryId', 'technicianId'].includes(key) ? Number(value)
                        : key === 'employeeVisible' ? true : value;
                }
                if (action === 'messages') Object.assign(payload, await ticketAttachmentPayload(form.elements.attachments));
                else if (action !== 'edit-message' && action !== 'remove-file') payload.expectedUpdatedAt = dialog.ticket.updatedAt;
            }
            const result = await requestTickets(path, payload);
            dialog.root.dataset.saving = 'false';
            if (!ticketDialogActive(dialog)) return;
            if (action === 'create') {
                queueRefresh?.reset();
                config.closeModal();
                config.notify(ticketNumber(result.id) + ' created.', 'success');
                return;
            }
            void queueRefresh?.refresh();
            dialog.source?.dispatchEvent(new Event('ticket-refresh'));
            await refreshTicketDetails(dialog);
            config.notify('Ticket updated.', 'success');
        } catch (error) {
            if (ticketDialogActive(dialog)) {
                if (error.status === 409 || error.status === 403 || error.status === 404) await refreshTicketDetails(dialog);
                showTicketError(dialog, error.message);
            }
        } finally {
            dialog.root.dataset.saving = 'false';
            buttons.forEach(button => { button.disabled = false; });
        }
    }

    document.addEventListener('click', event => {
        const trigger = event.target.closest('button');
        if (!trigger || !config) return;
        if (trigger.matches('[data-ticket-create]')) return void openCreateTicket();
        if (trigger.matches('[data-ticket-open]')) return void openTicketDetails(Number(trigger.dataset.ticketOpen),
            trigger.closest('[data-ticket-equipment-kind]'));
        const dialog = currentDialog;
        if (!dialog || !dialog.root.contains(trigger) || dialog.root.dataset.saving === 'true') return;
        if (trigger.matches('[data-ticket-dismiss]')) config.closeModal();
        else if (trigger.matches('[data-ticket-tab]')) {
            dialog.tab = trigger.dataset.ticketTab;
            void showTicketTab(dialog, true);
        } else if (trigger.matches('[data-ticket-start]')) void openTicketAction(dialog, trigger.dataset.ticketStart);
        else if (trigger.matches('[data-ticket-edit-message]')) void openTicketAction(dialog, 'edit-message', Number(trigger.dataset.ticketEditMessage));
        else if (trigger.matches('[data-ticket-remove-file]')) void openTicketAction(dialog, 'remove-file', Number(trigger.dataset.ticketRemoveFile));
        else if (trigger.matches('[data-ticket-edit-field]')) void editTicketClassification(dialog, trigger.dataset.ticketEditField);
        else if (trigger.matches('[data-ticket-cancel]')) void showTicketTab(dialog, true);
        else if (trigger.matches('[data-ticket-cancel-field]')) {
            dialog.root.querySelector('[data-ticket-classification]').replaceChildren();
            dialog.root.querySelector(`[data-ticket-edit-field="${trigger.dataset.ticketCancelField}"]`).focus();
        }
    });

    document.addEventListener('submit', event => {
        if (!event.target.matches('[data-ticket-form]')) return;
        event.preventDefault();
        if (currentDialog?.root.contains(event.target) && currentDialog.root.dataset.saving !== 'true')
            void saveTicketForm(currentDialog, event.target);
    });

    document.addEventListener('keydown', event => {
        if (!currentDialog?.root.contains(event.target) || !event.target.matches('[data-ticket-tab]')) return;
        const changes = {ArrowLeft:-1, ArrowRight:1, Home:-tabs.length, End:tabs.length};
        const change = changes[event.key];
        if (!change) return;
        event.preventDefault();
        const index = tabs.indexOf(currentDialog.tab);
        currentDialog.tab = tabs[change === -tabs.length ? 0 : change === tabs.length ? tabs.length - 1 : (index + change + tabs.length) % tabs.length];
        void showTicketTab(currentDialog, true);
    });

    function closeTicketDialog(restoreSource) {
        const source = currentDialog?.source;
        currentDialog = null;
        if (restoreSource && source?.dataset.ticketEquipmentKind === 'device') {
            config.restoreDevice(source.dataset.ticketEquipmentId, source.dataset.ticketEquipmentOffset);
        } else if (restoreSource) {
            source?.dispatchEvent(new Event('ticket-refresh'));
        }
    }

    return {
        configure: options => { config = options; },
        canRead: () => !!config?.canRead(),
        render: renderTicketQueue,
        hydrateQueue: hydrateTicketQueue,
        equipmentPanel: renderTicketEquipmentPanel,
        hydrateEquipment: hydrateTicketEquipment,
        closed: closeTicketDialog
    };
})();
