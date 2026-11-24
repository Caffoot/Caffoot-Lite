// Connect the Service Desk screens to the same access checks used by ticket history.
window.caffootServiceDesk = (() => {
    'use strict';
    const apiRoot = '/api/service-desk/';
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
    let config, currentDialog, queueRefresh, employeeQueueRefresh;

    async function requestServiceDesk(path, payload, signal) {
        const response = await fetch(path, {
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

    function requestTickets(path, payload, signal, scope = 'it') {
        return requestServiceDesk(apiRoot + scope + '/' + path, payload, signal);
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

    function renderEmployeeTicketQueue() {
        return renderInterfaceTemplate('service-desk/employee-queue', [ticketOptions(statuses, 'Open')]);
    }

    function renderTicketRows(tickets, scope) {
        const employee = scope !== 'it';
        const assignment = scope === 'personal' ? 'Assigned to Me' : 'Shared with My Department';
        return tickets.map(ticket => `<tr>
          <td><button class="device-name" type="button" data-ticket-open="${ticket.id}">${ticketNumber(ticket.id)}</button><div class="device-detail">${escapeHtml(ticket.subject)}</div></td>
          <td>${escapeHtml(ticket.employee || ticket.author)}</td><td>${escapeHtml(ticket.equipmentLabel || ticket.equipmentId)}
            ${employee ? `<div class="device-detail">${assignment}</div>` : ''}</td>
          <td>${ticketTag(ticket.priority)}</td><td>${ticketTag(ticket.status)}</td>
          <td>${escapeHtml(ticket.technician || 'Unassigned')}</td>${employee ? '' : '<td>' + ticketDate(ticket.updatedAt) + '</td>'}
          <td><button class="btn btn-small btn-outline" type="button" data-ticket-open="${ticket.id}" aria-label="Open Details For ${ticketNumber(ticket.id)}">${employee ? 'Open' : 'Open Details'}</button></td>
        </tr>`).join('') || `<tr><td colspan="${employee ? 7 : 8}" class="service-desk-empty">No tickets match the selected filters.</td></tr>`;
    }

    const supportWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    function renderSupportWeek(form, hours) {
        form.querySelector('[data-support-week]').innerHTML = hours.map((day, index) => {
            const name = supportWeekdays[index];
            return `<div class="support-day" data-support-day>
                <strong>${name}</strong>
                <label class="support-availability"><input type="checkbox" name="enabled" aria-label="${name} Open" ${day.enabled ? 'checked' : ''}>
                    <span data-support-availability></span></label>
                <label class="service-desk-field"><span class="sr-only support-time-label">Start Time</span>
                    <input type="time" name="start" aria-label="${name} Start Time" value="${escapeHtml(day.start)}" required></label>
                <label class="service-desk-field"><span class="sr-only support-time-label">End Time</span>
                    <input type="time" name="end" aria-label="${name} End Time" value="${escapeHtml(day.end)}" required></label>
            </div>`;
        }).join('');
    }

    function readSupportWeek(form, summary) {
        const schedule = [...form.querySelectorAll('[data-support-day]')].map(row => {
            const enabled = row.querySelector('[name="enabled"]').checked;
            const start = row.querySelector('[name="start"]');
            const end = row.querySelector('[name="end"]');
            row.querySelector('[data-support-availability]').textContent = enabled ? 'Open' : 'Closed';
            start.disabled = end.disabled = !enabled;
            end.setCustomValidity(enabled && start.value && end.value && start.value >= end.value
                ? 'Enter an end time later than the start time.' : '');
            return {enabled, start:start.value, end:end.value};
        });
        summary.innerHTML = schedule.map((day, index) => `<dt>${supportWeekdays[index]}</dt>
            <dd>${day.enabled ? `${escapeHtml(day.start || '—')}–${escapeHtml(day.end || '—')}` : 'Closed'}</dd>`).join('');
        return schedule;
    }

    function renderSupportLists(section, settings) {
        const exclusions = section.querySelector('[data-support-exclusions]');
        exclusions.innerHTML = settings.excludedDates.map(entry => {
            const label = entry.date.split('-').reverse().join('/');
            return `<tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(entry.reason)}</td>
                <td><button class="btn btn-small btn-outline" type="button" data-support-action="remove-date"
                    data-date="${escapeHtml(entry.date)}" aria-label="Remove Excluded Date ${escapeHtml(label)}">Remove</button></td></tr>`;
        }).join('') || '<tr><td colspan="3">No excluded dates have been added.</td></tr>';
        section.querySelector('[data-support-categories]').innerHTML = settings.categories.map(category => {
            const fixed = category.id === settings.fixedCategoryId;
            const visibility = category.hidden ? 'Restore' : 'Hide';
            return `<tr><th scope="row">${escapeHtml(category.name)}</th><td><span class="service-desk-visibility" data-internal="${Boolean(category.hidden)}">${category.hidden ? 'Hidden' : 'Active'}</span></td>
                <td><div class="support-list-actions">${fixed ? 'Fixed' : `
                    <button type="button" class="btn btn-small btn-outline" data-support-action="rename-category"
                        data-id="${category.id}" aria-label="Rename ${escapeHtml(category.name)}">Rename</button>
                    <button type="button" class="btn btn-small btn-outline" data-support-action="${visibility.toLowerCase()}-category"
                        data-id="${category.id}" aria-label="${visibility} ${escapeHtml(category.name)}">${visibility}</button>`}</div></td></tr>`;
        }).join('');
    }

    function bindSupportTabs(section) {
        const tabs = [...section.querySelectorAll('[data-support-tab]')];
        function selectSupportTab(selected) {
            tabs.forEach(tab => {
                const active = tab === selected;
                tab.tabIndex = active ? 0 : -1;
                tab.classList.toggle('active', active);
                tab.setAttribute('aria-selected', active);
                section.querySelector('#' + tab.getAttribute('aria-controls')).hidden = !active;
            });
            selected.focus();
        }
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => selectSupportTab(tab));
            tab.addEventListener('keydown', event => {
                const next = {ArrowLeft:(index - 1 + tabs.length) % tabs.length, ArrowRight:(index + 1) % tabs.length,
                    Home:0, End:tabs.length - 1}[event.key];
                if (next === undefined) return;
                event.preventDefault();
                selectSupportTab(tabs[next]);
            });
        });
    }

    async function hydrateServiceDeskSettings(container) {
        const section = container.querySelector('.service-desk-settings');
        const feedback = section.querySelector('[data-support-feedback]');
        const content = section.querySelector('[data-support-settings]');
        const warning = section.querySelector('[data-support-timezone]');
        const hoursForm = section.querySelector('[data-support-form="working-hours"]');
        const summary = section.querySelector('[data-support-summary]');
        const dialog = section.querySelector('dialog');
        const rename = dialog.querySelector('[name="name"]');
        const confirmError = dialog.querySelector('[data-support-confirm-error]');
        const confirmButton = dialog.querySelector('[data-support-confirm-button]');
        let settings, hoursRevision, saving = false, confirmation;

        function showSupportFeedback(message, error = false) {
            feedback.textContent = message;
            feedback.dataset.error = String(error);
            feedback.hidden = !message;
        }

        function updateSupportHours() {
            renderSupportWeek(hoursForm, settings.workingHours);
            readSupportWeek(hoursForm, summary);
            hoursRevision = settings.calendarRevision;
        }

        async function saveSupportSettings(payload, message) {
            if (saving) return false;
            saving = true;
            section.setAttribute('aria-busy', 'true');
            showSupportFeedback('');
            confirmError.hidden = true;
            try {
                const {serviceDesk} = await requestServiceDesk('/api/settings/service-desk', payload);
                if (!section.isConnected) return false;
                const hoursUnchanged = JSON.stringify(settings.workingHours) === JSON.stringify(serviceDesk.workingHours);
                if (hoursUnchanged && hoursRevision === settings.calendarRevision) hoursRevision = serviceDesk.calendarRevision;
                settings = serviceDesk;
                if (payload.action === 'working-hours') updateSupportHours();
                if (payload.action !== 'working-hours') renderSupportLists(section, settings);
                showSupportFeedback(message);
                return true;
            } catch (error) {
                if (dialog.open) {
                    confirmError.textContent = error.message;
                    confirmError.hidden = false;
                } else {
                    showSupportFeedback(error.message, true);
                }
                return false;
            } finally {
                saving = false;
                section.removeAttribute('aria-busy');
            }
        }

        try {
            ({serviceDesk:settings} = await requestServiceDesk('/api/settings/service-desk'));
        } catch (error) {
            showSupportFeedback(error.message, true);
            return;
        }
        if (!section.isConnected) return;
        warning.hidden = Boolean(settings.timezone);
        warning.textContent = 'Set a valid installation time zone (TZ) in your deployment and restart Caffoot Lite. Period reporting and working-time measurements are unavailable while TZ is missing or invalid. Ticket operations are available.';
        section.querySelector('[data-support-timezone-description]').textContent = settings.timezone
            ? `Installation Time Zone — ${settings.timezone}` : 'Installation Time Zone — Unavailable';
        updateSupportHours();
        renderSupportLists(section, settings);
        bindSupportTabs(section);
        showSupportFeedback('');
        content.hidden = false;

        hoursForm.addEventListener('input', () => readSupportWeek(hoursForm, summary));
        hoursForm.addEventListener('reset', event => {
            event.preventDefault();
            if (saving) return;
            updateSupportHours();
            showSupportFeedback('Unsaved working hours discarded.');
        });
        section.addEventListener('submit', async event => {
            const form = event.target;
            if (!form.matches('[data-support-form]')) return;
            event.preventDefault();
            const action = form.dataset.supportForm;
            if (action === 'working-hours') {
                const workingHours = readSupportWeek(form, summary);
                if (form.reportValidity()) {
                    await saveSupportSettings({action, calendarRevision:hoursRevision, workingHours}, 'Working hours saved.');
                }
                return;
            }
            const payload = {action, ...Object.fromEntries(new FormData(form))};
            if (await saveSupportSettings(payload, action === 'add-date' ? 'Excluded date added.' : 'Category added.')) {
                form.reset();
            }
        });
        section.addEventListener('click', event => {
            const button = event.target.closest('[data-support-action]');
            if (!button || saving) return;
            const action = button.dataset.supportAction;
            const category = settings.categories.find(item => item.id === Number(button.dataset.id));
            const isRename = action === 'rename-category';
            const [title, description, buttonLabel, success] = {
                'remove-date':['Remove Excluded Date', 'The date will count towards working time from now on if it falls within Working Hours.', 'Remove Date', 'Excluded date removed.'],
                'rename-category':['Rename Category', 'Existing tickets retain their recorded category label.', 'Save Category', 'Category renamed.'],
                'hide-category':['Hide Category', 'The category will be removed from new ticket selections. Existing tickets retain it.', 'Hide Category', 'Category hidden.'],
                'restore-category':['Restore Category', 'The category will appear in new ticket selections again.', 'Restore Category', 'Category restored.']
            }[action];
            confirmation = {action, category, date:button.dataset.date, success};
            dialog.querySelector('h3').textContent = title;
            dialog.querySelector('[data-support-confirm-description]').textContent = description;
            rename.closest('label').hidden = !isRename;
            rename.disabled = !isRename;
            rename.required = isRename;
            rename.value = isRename ? category.name : '';
            confirmError.hidden = true;
            confirmButton.textContent = buttonLabel;
            dialog.showModal();
            if (isRename) rename.select();
        });
        dialog.addEventListener('cancel', event => { if (saving) event.preventDefault(); });
        dialog.querySelector('[data-support-cancel]').addEventListener('click', () => { if (!saving) dialog.close(); });
        dialog.querySelector('form').addEventListener('submit', async event => {
            event.preventDefault();
            const {action, category, date, success} = confirmation;
            const payload = category ? {action, id:category.id} : {action, date};
            if (action === 'rename-category') Object.assign(payload, {name:rename.value, previousName:category.name});
            if (await saveSupportSettings(payload, success)) {
                dialog.close();
                const nextAction = action === 'hide-category' ? 'restore-category' : action === 'restore-category' ? 'hide-category' : action;
                const rowAction = category && section.querySelector(`[data-id="${category.id}"][data-support-action="${nextAction}"]`);
                (rowAction || section.querySelector('[data-support-form="add-date"] input')).focus();
            }
        });
    }

    function renderReportActivity(report, values, rows, notice, message = '') {
        const available = report?.available;
        for (const key of ['created', 'closed', 'reopened']) {
            values[key].textContent = available ? report.counts[key] : '—';
        }
        const minutes = available && report.averageSeconds !== null ? Math.floor(report.averageSeconds / 60) : null;
        values.average.textContent = minutes === null ? '—' : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
        notice.textContent = message || (report?.timezoneWarning
            ? 'Reporting is unavailable. Set a valid installation time zone (TZ) in your deployment and restart Caffoot Lite.'
            : report && !available ? 'Period reporting is unavailable until your administrator configures the installation time zone.'
            : report?.durationUnavailable ? 'Average resolution time is unavailable because this period includes a closure without a complete working-time measurement.'
            : '');
        notice.hidden = !notice.textContent;
        rows.innerHTML = available && report.technicians.length
            ? report.technicians.map(person => `<tr><th scope="row">${escapeHtml(person.name)}</th>
                <td>${person.started}</td><td>${person.closed}</td></tr>`).join('')
            : `<tr><td colspan="3">${available ? 'No technicians are available.' : '—'}</td></tr>`;
    }

    function hydrateTicketReporting(page) {
        const panel = page.querySelector('.service-desk-report');
        const period = panel.querySelector('[data-report-period]');
        const dates = panel.querySelector('[data-report-dates]');
        const from = dates.querySelector('[name="from"]');
        const to = dates.querySelector('[name="to"]');
        const rows = panel.querySelector('[data-report-technicians]');
        const notice = panel.querySelector('[data-report-notice]');
        const values = Object.fromEntries([...panel.querySelectorAll('[data-report-metric]')]
            .map(element => [element.dataset.reportMetric, element]));
        let latest = 0, pending = Promise.resolve(), initialised = false, today;

        function requestReport(payload) {
            const version = ++latest;
            panel.setAttribute('aria-busy', 'true');
            pending = pending.then(async () => {
                if (!page.isConnected) return;
                try {
                    const report = await requestTickets('report', payload);
                    if (!page.isConnected || version !== latest) return;
                    if (!initialised) {
                        period.value = report.preference.period;
                        from.value = report.preference.from || '';
                        to.value = report.preference.to || '';
                        dates.hidden = period.value !== 'custom';
                        initialised = true;
                    }
                    today = report.today;
                    renderReportActivity(report, values, rows, notice);
                } catch (error) {
                    if (page.isConnected && version === latest) {
                        renderReportActivity(null, values, rows, notice, error.message);
                    }
                } finally {
                    if (version === latest) {
                        panel.removeAttribute('aria-busy');
                        period.disabled = false;
                    }
                }
            });
        }

        function selectReportPeriod() {
            const custom = period.value === 'custom';
            dates.hidden = !custom;
            if (!custom) return requestReport({period: period.value});
            if (!from.value && !to.value && today) {
                from.value = today.slice(0, 8) + '01';
                to.value = today;
            }
            if (!from.value || !to.value || from.value > to.value || !from.validity.valid || !to.validity.valid) {
                ++latest;
                panel.removeAttribute('aria-busy');
                renderReportActivity(null, values, rows, notice, 'Choose a valid From and To date.');
                return;
            }
            requestReport({period:'custom', from:from.value, to:to.value});
        }

        period.addEventListener('change', selectReportPeriod);
        dates.addEventListener('change', selectReportPeriod);
        requestReport();
        return () => {
            if (page.isConnected && (dates.hidden || (from.value && to.value && from.value <= to.value))) requestReport();
        };
    }

    function hydrateTicketQueue(container) {
        const page = container.querySelector('.service-desk-page');
        const employee = page.classList.contains('employee-tickets');
        const filters = page.querySelector('form[role="search"]');
        const counts = page.querySelector('[data-ticket-workload]');
        const rows = page.querySelector('[data-ticket-rows]');
        const count = page.querySelector('[data-ticket-count]');
        const pagination = page.querySelector('[data-ticket-pagination]');
        const shortcuts = ['Awaiting IT attention', 'Being worked on', 'Waiting for the next step'];
        const shortcutIcons = ['i-box', 'i-tool', 'i-history'];
        let scope = employee ? 'personal' : 'it';
        let offset = 0, pendingSearch, request;
        async function refreshQueue() {
            if (!page.isConnected) return;
            clearTimeout(pendingSearch);
            request?.abort();
            request = new AbortController();
            const signal = request.signal;
            const params = new URLSearchParams();
            for (const [key, value] of new FormData(filters)) {
                if (!value) continue;
                if (key === 'equipment') {
                    const [kind, id] = JSON.parse(value);
                    params.set('equipmentKind', kind);
                    params.set('equipmentId', id);
                } else params.set(key, value);
            }
            params.set('offset', offset);
            page.setAttribute('aria-busy', 'true');
            try {
                const data = await requestTickets('tickets?' + params, undefined, signal, scope);
                if (signal.aborted || !page.isConnected) return;
                if (offset > 0 && !data.tickets.length) {
                    offset = Math.max(0, offset - pageSize);
                    void refreshQueue();
                    return;
                }
                if (!employee) {
                    const technician = filters.elements.technician;
                    const selected = technician.value;
                    const choices = data.technicians.map(entry => [entry.id, entry.name]);
                    if (selected && !choices.some(([id]) => String(id) === selected)) {
                        choices.push([selected, technician.selectedOptions[0].textContent]);
                    }
                    technician.innerHTML = ticketOptions([['', 'All Technicians'], ...choices], selected);
                }
                counts.innerHTML = statuses.slice(0, 3).map((status, index) => `
                    <button type="button" class="service-desk-workload-card" data-workload-status="${status}" aria-pressed="${status === filters.elements.status.value}">
                        <span class="service-desk-stat-head">${status}<span aria-hidden="true">${employee
                            ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><use href="#${shortcutIcons[index]}"/></svg>`
                            : ['◫','⚒','Ⅱ'][index]}</span></span>
                        <strong>${data.workloadCounts[status]}</strong><small>${employee ? shortcuts[index] : 'View Matching Tickets →'}</small>
                    </button>`).join('');
                rows.innerHTML = renderTicketRows(data.tickets, scope);
                const first = data.tickets.length ? offset + 1 : 0;
                const total = Object.values(data.workloadCounts).reduce((sum, value) => sum + value, 0);
                count.textContent = employee && data.filteredTotal <= pageSize
                    ? `Showing ${data.tickets.length} of ${total} Tickets`
                    : `Showing ${first}–${offset + data.tickets.length} of ${data.filteredTotal} Tickets`;
                pagination.hidden = data.filteredTotal <= pageSize;
                pagination.querySelector('[data-ticket-page="-1"]').disabled = offset === 0;
                pagination.querySelector('[data-ticket-page="1"]').disabled = offset + pageSize >= data.filteredTotal;
            } catch (error) {
                if (signal.aborted || !page.isConnected) return;
                counts.replaceChildren();
                rows.replaceChildren();
                pagination.hidden = true;
                count.textContent = error.message;
                if (error.status === 403) page.querySelector('[data-ticket-create],[data-employee-ticket-create]').hidden = true;
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
        function resetTicketFilters(status = 'Open') {
            const fields = employee ? ['search','equipment'] : ['search','priority','assignment','technician'];
            for (const field of fields) filters.elements[field].value = '';
            filters.elements.status.value = status;
            filters.elements.sort.value = 'newest';
            changeTicketFilters();
        }
        filters.addEventListener('reset', event => {
            event.preventDefault();
            resetTicketFilters(employee ? '' : 'Open');
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
                if (!employee) filters.elements.assignment.value = '';
                changeTicketFilters();
                if (!employee) {
                    page.querySelector('#service-desk-queue').scrollIntoView({block:'start'});
                    filters.elements.status.focus({preventScroll:true});
                }
            } else if (navigation) {
                offset += Number(navigation.dataset.ticketPage) * pageSize;
                void refreshQueue();
            }
        });
        if (!employee) {
            queueRefresh = {refresh:refreshQueue, reset:resetTicketFilters, report:hydrateTicketReporting(page)};
            void refreshQueue();
            return;
        }
        const scopeTabs = [...page.querySelectorAll('[data-ticket-scope]')];
        const context = page.querySelector('[data-ticket-context]');
        const caption = page.querySelector('[data-ticket-scope-caption]');
        const panel = page.querySelector('[role="tabpanel"]');
        let equipmentRequest;
        async function selectEmployeeScope(next, focus = false) {
            if (!page.isConnected) return;
            scope = next;
            page.dataset.employeeScope = next;
            const department = next === 'department';
            for (const tab of scopeTabs) {
                const selected = tab.dataset.ticketScope === next;
                tab.setAttribute('aria-selected', selected);
                tab.tabIndex = selected ? 0 : -1;
                if (selected) {
                    panel.setAttribute('aria-labelledby', tab.id);
                    if (focus) tab.focus();
                }
            }
            page.querySelector('[data-ticket-list-heading]').textContent = department ? 'Department Ticket List' : 'My Ticket List';
            caption.textContent = department ? 'Shared Equipment' : 'Personally Assigned Equipment';
            context.textContent = department ? 'Tickets for equipment shared with your current Department.'
                : 'Tickets linked to equipment assigned to you, including tickets created by IT Support for it.';
            counts.replaceChildren();
            rows.replaceChildren();
            count.textContent = 'Loading Tickets…';
            pagination.hidden = true;
            filters.elements.equipment.innerHTML = ticketOptions([['', 'All Equipment']]);
            resetTicketFilters();
            equipmentRequest?.abort();
            equipmentRequest = new AbortController();
            const signal = equipmentRequest.signal;
            try {
                const result = await requestTickets('equipment', undefined, signal, next);
                if (signal.aborted || !page.isConnected) return;
                if (department) {
                    caption.textContent = result.department ? result.department + ' · Shared Equipment' : 'Shared Equipment';
                    context.textContent = result.department
                        ? `Current members of ${result.department} can view permitted conversations for shared equipment, including requests raised by colleagues.`
                        : 'Your Staff record has no current Department.';
                }
                const choices = new Map();
                for (const item of result.equipment) {
                    const key = JSON.stringify([item.kind, item.id]);
                    choices.set(key, item.label.replace(/ · Issue \d+$/, ''));
                }
                filters.elements.equipment.innerHTML = ticketOptions([['', 'All Equipment'], ...choices]);
            } catch (error) {
                if (!signal.aborted && page.isConnected) context.textContent = error.message;
            }
        }
        for (const tab of scopeTabs) {
            tab.addEventListener('click', () => void selectEmployeeScope(tab.dataset.ticketScope));
            tab.addEventListener('keydown', event => {
                if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
                event.preventDefault();
                const index = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - scopeTabs.indexOf(tab);
                void selectEmployeeScope(scopeTabs[index].dataset.ticketScope, true);
            });
        }
        employeeQueueRefresh = {refresh:refreshQueue, select:selectEmployeeScope};
        void selectEmployeeScope(scope);
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

    function openTicketWindow(eyebrow, title, subtitle = '', employee = false) {
        config.openModal(renderInterfaceTemplate('service-desk/dialog', [
            eyebrow, escapeHtml(title), escapeHtml(subtitle), employee ? 'My Workspace' : 'Service Desk'
        ]));
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

    async function openCreateTicket(employee = false, linkedEquipment = null) {
        if (!(employee ? config.canUseEmployee() : config.canEdit())) return;
        const subtitle = employee ? 'Report a problem with equipment assigned to you or shared with your Department.'
            : 'Record a problem, maintenance task or support request.';
        const dialog = {employee, equipment:[], root:openTicketWindow('Create Ticket', 'Create Ticket', subtitle, employee)};
        dialog.root.classList.toggle('employee-ticket-dialog', employee);
        currentDialog = dialog;
        try {
            const scope = employee ? 'personal' : 'it';
            const [{equipment}, {categories, softwareCategoryId}, shared] = await Promise.all([requestTickets('equipment', undefined, undefined, scope),
                requestTickets('categories', undefined, undefined, scope),
                employee ? requestTickets('equipment', undefined, undefined, 'department') : null]);
            if (!ticketDialogActive(dialog)) return;
            dialog.equipment = employee ? [
                ...equipment.map(item => ({...item, scope:'personal', label:item.label + ' · Assigned to Me'})),
                ...shared.equipment.map(item => ({...item, scope:'department', label:item.label + ' · Shared with ' + shared.department}))
            ] : equipment;
            const choices = dialog.equipment;
            const selected = linkedEquipment ? choices.findIndex(item => item.scope === linkedEquipment.scope
                && (linkedEquipment.asset ? 'stock-issue-' + item.stockIssueId : item.id) === linkedEquipment.id) : -1;
            const equipmentField = `<label class="service-desk-field">Device / Asset <span aria-hidden="true">*</span><select name="equipment" required>
                ${ticketOptions([['','Select a Device / Asset…'], ...choices.map((entry,index) => [index,entry.label])], selected)}</select></label>`;
            const categoryField = `<label class="service-desk-field">Ticket Category <span aria-hidden="true">*</span><select name="categoryId" required>
                ${ticketOptions([['','Select a Category…'], ...categories.map(entry => [entry.id, entry.name])])}</select></label>`;
            const equipmentHelp = choices.length ? '' : `<p>${employee
                ? 'No equipment is available. Ask IT to check your personal or Department assignment.'
                : 'No authorised equipment is available. Add or check the equipment record before creating a ticket.'}</p>`;
            const body = dialog.root.querySelector('[data-ticket-body]');
            body.innerHTML = `<form id="service-desk-create-form" data-ticket-form="create">
              <div class="device-review-grid"><section class="device-review-panel full">
              <h3>${employee ? 'New Support Request' : 'New Support Ticket'}</h3>
              <p>${employee ? 'Select the affected equipment and describe the problem.' : 'All Service Desk tickets are associated with an existing Device or IT Asset.'}</p>
              ${employee ? '<div class="employee-ticket-create-fields">' + equipmentField + categoryField + '</div>' + equipmentHelp
                  : equipmentField + '<p>Employee access follows the equipment’s verified assignment.</p>' + equipmentHelp + categoryField}
              ${employee ? `<div class="device-review-warning service-desk-confidentiality" data-ticket-confidentiality role="status" hidden>
                  <strong>Department Ticket — Confidentiality Warning</strong>
                  <p>This ticket, employee-visible replies and permitted attachments will be visible to authorised Staff Members in any Department currently or subsequently assigned to this Device.</p>
                  <p><strong>Do not include or attach confidential, personal or sensitive information.</strong></p>
                </div><div data-ticket-software-field hidden>
                  <label class="service-desk-field">Affected Software (Optional)<select name="affectedSoftware" disabled></select></label>
                  <p data-ticket-software-help aria-live="polite"></p>
                </div>` : ''}
              <label class="service-desk-field">Subject <span aria-hidden="true">*</span><input name="subject" maxlength="${employee ? 120 : 200}" required placeholder="Briefly describe the issue"></label>
              <label class="service-desk-field">Description <span aria-hidden="true">*</span><textarea name="description" maxlength="${employee ? 3000 : 16000}" rows="5" required placeholder="Describe the issue or work required…"></textarea></label>
              ${ticketFileInput(employee)}
              <p class="service-desk-info">New tickets start <strong>Open</strong> · <strong>Medium Priority</strong> · <strong>Unassigned</strong>.</p>
              </section></div></form>`;
            dialog.root.querySelector('[data-ticket-footer]').innerHTML = `
              <button type="button" class="btn btn-outline" data-ticket-dismiss>Cancel</button>
              <button type="submit" class="btn btn-primary" form="service-desk-create-form" ${choices.length ? '' : 'disabled'}>Create Ticket</button>`;
            if (linkedEquipment && selected === -1) showTicketError(dialog, 'This equipment is no longer available for a new ticket.');
            if (employee) {
                const form = body.querySelector('form');
                const updateConfidentiality = () => {
                    const index = form.elements.equipment.value;
                    const item = index === '' ? null : dialog.equipment[Number(index)];
                    form.querySelector('[data-ticket-confidentiality]').hidden = item?.scope !== 'department' || item.kind !== 'device';
                };
                updateConfidentiality();
                form.addEventListener('change', event => {
                    if (event.target.name === 'equipment') updateConfidentiality();
                    if (['equipment','categoryId'].includes(event.target.name))
                        void updateTicketSoftware(dialog, form, softwareCategoryId);
                });
            }
        } catch (error) {
            if (ticketDialogActive(dialog)) {
                dialog.root.querySelector('[data-ticket-body]').replaceChildren();
                showTicketError(dialog, error.message);
            }
        }
    }

    async function updateTicketSoftware(dialog, form, categoryId) {
        dialog.softwareRequest?.abort();
        const select = form.elements.affectedSoftware;
        const field = select.closest('[data-ticket-software-field]');
        const help = field.querySelector('[data-ticket-software-help]');
        const equipment = form.elements.equipment.value;
        const item = equipment === '' ? null : dialog.equipment[Number(equipment)];
        field.hidden = !(item?.kind === 'device' && ['Laptop', 'Desktop'].includes(item.type) &&
            Number(form.elements.categoryId.value) === categoryId);
        select.disabled = true;
        select.innerHTML = ticketOptions([['','Select Software…']]);
        if (field.hidden) return;
        dialog.softwareRequest = new AbortController();
        const signal = dialog.softwareRequest.signal;
        help.textContent = 'Loading recorded software…';
        try {
            const {software} = await requestTickets('software?' + new URLSearchParams({deviceId:item.id}), undefined, signal, item.scope);
            if (!ticketDialogActive(dialog) || signal.aborted) return;
            select.innerHTML = ticketOptions([['','Select Software…'], ...software.map(entry => [entry.key, entry.label])]);
            select.disabled = false;
            help.textContent = 'Choose software recorded on this Device or Other / Not Listed.';
        } catch (error) {
            if (ticketDialogActive(dialog) && !signal.aborted) help.textContent = error.message;
        }
    }

    async function openTicketDetails(id, source, scope = 'it') {
        const employee = scope !== 'it';
        const dialog = {id, scope, employee, tab:'Overview', root:openTicketWindow('Ticket Details', ticketNumber(id), '', employee), source};
        dialog.root.classList.toggle('employee-ticket-dialog', employee);
        currentDialog = dialog;
        await refreshTicketDetails(dialog);
    }

    async function refreshTicketDetails(dialog) {
        try {
            const ticket = await requestTickets('tickets/' + dialog.id, undefined, undefined, dialog.scope);
            if (!ticketDialogActive(dialog)) return;
            dialog.ticket = ticket;
            dialog.root.querySelector('h2').textContent = ticketNumber(ticket.id) + ' — ' + ticket.subject;
            const equipment = ticket.equipmentLabel || ticket.equipmentId;
            dialog.root.querySelector('[data-ticket-subtitle]').textContent = dialog.employee
                ? `${equipment} · ${ticket.status} · ${ticket.technician || 'Unassigned'}`
                : `${equipment} · Requester: ${ticket.employee || ticket.author} · ${ticket.status} · ${ticket.priority} Priority`;
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
              ${ticket.affectedSoftware ? ticketFact('Affected Software', ticket.affectedSoftware) : ''}
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

    function renderEmployeeTicketOverview(ticket, scope, statusDetails) {
        const notice = ticket.status === 'On Hold' && statusDetails?.reason
            ? `<section class="device-review-panel full"><h3>On Hold</h3><p>Reason <strong>${escapeHtml(statusDetails.reason)}</strong></p>
                ${statusDetails.explanation ? `<p class="service-desk-message-text">${escapeHtml(statusDetails.explanation)}</p>` : ''}</section>`
            : ticket.status === 'Closed' && statusDetails?.body
                ? `<section class="device-review-panel full"><h3>Resolution Note</h3><p class="service-desk-message-text">${escapeHtml(statusDetails.body)}</p></section>`
                : '';
        return `<div class="device-review-grid">
          <section class="device-review-panel"><h3>Ticket Information</h3><p>Current status and the people involved in your support request.</p>
            <dl class="device-review-facts">
              ${ticketFact('Ticket Number', ticketNumber(ticket.id))}${ticketFact('Requester', ticket.employee || ticket.author)}
              ${ticketFact('Status', ticket.status)}${ticketFact('Priority', ticket.priority)}
              ${ticketFact('Assigned To', ticket.technician || 'Unassigned')}${ticketFact('Category', ticket.category)}
              ${ticket.affectedSoftware ? ticketFact('Affected Software', ticket.affectedSoftware) : ''}
            </dl></section>
          <section class="device-review-panel"><h3>Linked Equipment</h3><p>Each ticket remains linked to its original Device or IT Asset.</p>
            <dl class="device-review-facts">${ticketFact('Device / Asset', ticket.equipmentLabel || ticket.equipmentId)}
              ${ticketFact('Assignment', scope === 'personal' ? 'Assigned to Me' : 'Shared with My Department')}
              ${ticketFact('Equipment Type', ticket.equipmentType || '—')}${ticketFact('Last Updated', ticketDate(ticket.updatedAt))}
            </dl></section>
          <section class="device-review-panel full"><h3>Reported Problem</h3><p class="service-desk-message-text">${escapeHtml(ticket.description)}</p></section>
          ${notice}</div>`;
    }

    function ticketFileInput(employee = false) {
        return `<label class="service-desk-field">${employee ? 'Attachment' : 'Attachments'} (Optional)<input name="attachments" type="file" ${employee ? '' : 'multiple'} accept="${fileFormats}"></label>
          <p>PNG, JPEG, PDF, TXT, DOCX or XLSX. Up to 10 MB per file and 100 MB retained per ticket.</p>`;
    }

    function renderTicketUpdates(ticket, messages, attachments, scope) {
        const employee = scope !== 'it';
        const conversation = employee ? [
            {author:ticket.author, kind:'Original Request', body:ticket.description, createdAt:ticket.createdAt}, ...messages
        ] : messages;
        const entries = conversation.map(message => {
            const files = attachments.filter(attachment => attachment.messageId === message.id);
            const label = employee || message.kind === 'Resolution Note' ? ' · ' + message.kind : '';
            return `<article class="service-desk-message">
              <div class="service-desk-message-head"><div><strong>${escapeHtml(message.author + label)}</strong>
              <small>${ticketDate(message.createdAt)}${message.editedAt ? ' · Edited (Audited)' : ''}</small></div>
              ${ticket.canEdit && message.editable ? `<button type="button" class="device-review-smallbtn" data-ticket-edit-message="${message.id}">Edit</button>` : ''}</div>
              <p class="service-desk-message-text">${escapeHtml(message.body)}</p>
              ${employee ? '' : `<div class="service-desk-visibility" data-internal="${!message.employeeVisible}">${message.employeeVisible ? '◉ Employee Visible' : '▣ Internal · IT Only'}</div>`}
              ${files.length ? `<ul class="service-desk-files">${files.map(file => `<li>
                <a href="${apiRoot}${scope}/tickets/${ticket.id}/attachments/${file.id}" download="${escapeHtml(file.filename)}">${escapeHtml(file.filename)}</a>
                ${ticket.canEdit ? `<button type="button" class="device-review-smallbtn" data-ticket-remove-file="${file.id}" aria-label="Remove ${escapeHtml(file.filename)}">Remove</button>` : ''}
                </li>`).join('')}</ul>` : ''}
            </article>`;
        }).join('');
        if (employee) {
            return `<div class="device-review-grid"><section class="device-review-panel full">
              <h3>Ticket Conversation</h3><p>Updates shared with you and other currently authorised Department members, where applicable.</p>
              ${entries}
              ${ticket.status === 'Closed' ? '<p class="service-desk-info">Select <strong>Reopen Ticket</strong> before sending a reply or adding an attachment.</p>'
                : `<form data-ticket-form="messages">
                    <label class="service-desk-field">Reply To IT <span aria-hidden="true">*</span>
                    <textarea name="body" rows="4" maxlength="3000" required placeholder="Write your message to the IT team…"></textarea></label>
                    ${ticketFileInput(true)}
                    <div class="service-desk-form-actions"><button type="submit" class="btn btn-primary">Send Reply</button></div>
                  </form>`}
              </section></div>`;
        }
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
            case 'Created': return 'Created the ticket as Open, Medium and Unassigned.'
                + (details.affectedSoftware ? ' Affected software was ' + details.affectedSoftware + '.' : '');
            case 'Status Changed':
                return `Changed status from ${details.before} to ${details.status}.${details.reason ? ' Reason: ' + details.reason + '.' : ''}${details.explanation ? ' Explanation: ' + details.explanation : ''}`;
            case 'Assignment Changed':
                return details.previousTechnician ? `Reassigned the ticket from ${details.previousTechnician} to ${details.technician}. Reason (IT Only): ${details.reason}.${details.explanation ? ' Explanation: ' + details.explanation : ''}`
                    : `Assigned the ticket to ${details.technician}.`;
            case 'Priority Changed': return `Changed priority from ${details.before} to ${details.priority}.`;
            case 'Category Changed': return `Changed category from ${details.previousCategory} to ${details.category}.`
                + (details.previousAffectedSoftware ? ' Affected software was ' + details.previousAffectedSoftware + '.' : '');
            case 'Closed': return 'Closed the ticket with an employee-visible Resolution Note.';
            case 'Reopened': return 'Reopened the ticket as Open and retained its previous assignee and closure history.';
            case 'Message Added': return 'Added a ticket update.';
            case 'Message Edited':
                return details.removedAttachmentId ? `Removed the attachment “${details.filename}”.`
                    : `Corrected a ticket update.${details.previousBody ? ' Previous text: ' + details.previousBody : ''}`;
            default: return event.kind;
        }
    }

    function renderTicketHistory(history, employee) {
        return `<div class="device-review-grid"><section class="device-review-panel full"><h3>Ticket History</h3>
          <p>${employee ? 'See who raised the ticket and when its status or other details changed.'
            : 'Audit of ticket lifecycle changes, including technician attribution and timestamps.'}</p>
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
        const close = `<button type="button" class="btn btn-outline" data-ticket-dismiss>${dialog.employee ? 'Close Window' : 'Close'}</button>`;
        const employeeAction = ticket.status === 'Closed'
            ? '<form id="reopen-employee-ticket" data-ticket-form="reopen"></form><button type="submit" form="reopen-employee-ticket" class="btn btn-primary">Reopen Ticket</button>'
            : tab !== 'Updates' ? '<button type="button" class="btn btn-primary" data-ticket-reply>Reply To IT</button>' : '';
        root.querySelector('[data-ticket-footer]').innerHTML = close + (dialog.employee ? employeeAction
            : ticketActions(ticket).map(([action, label]) => `<button type="button" class="btn ${action === 'close' ? 'btn-primary' : 'btn-outline'}" data-ticket-start="${action}">${label}</button>`).join(''));
        body.id = 'service-desk-tab-panel';
        body.setAttribute('role', 'tabpanel');
        body.setAttribute('aria-labelledby', 'ticket-tab-' + tab.toLowerCase());
        body.scrollTop = 0;
        if (tab === 'Overview' && !dialog.employee) {
            body.innerHTML = renderTicketOverview(ticket);
            return;
        }
        body.innerHTML = '<p role="status">Loading…</p>';
        const load = Symbol();
        dialog.tabLoad = load;
        try {
            const path = 'tickets/' + dialog.id + '/';
            if (tab === 'Overview') {
                let statusDetails;
                if (ticket.status === 'On Hold') {
                    const {history} = await requestTickets(path + 'history', undefined, undefined, dialog.scope);
                    statusDetails = history.findLast(event => event.kind === 'Status Changed' && event.details.status === 'On Hold')?.details;
                } else if (ticket.status === 'Closed') {
                    const {messages} = await requestTickets(path + 'messages', undefined, undefined, dialog.scope);
                    statusDetails = messages.findLast(message => message.kind === 'Resolution Note');
                }
                if (ticketDialogActive(dialog) && tab === dialog.tab && load === dialog.tabLoad && !dialog.action)
                    body.innerHTML = renderEmployeeTicketOverview(ticket, dialog.scope, statusDetails);
                return;
            }
            const data = await requestTickets(path + (tab === 'Updates' ? 'messages' : 'history'), undefined, undefined, dialog.scope);
            if (!ticketDialogActive(dialog) || tab !== dialog.tab || load !== dialog.tabLoad || dialog.action) return;
            if (tab === 'Updates') dialog.updates = data;
            body.innerHTML = tab === 'Updates' ? renderTicketUpdates(ticket, data.messages, data.attachments, dialog.scope)
                : renderTicketHistory(data.history, dialog.employee);
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
            let scope = dialog.scope || 'it';
            if (action === 'create') {
                const selected = data.get('equipment') === '' ? null : dialog.equipment[Number(data.get('equipment'))];
                if (!selected) throw new Error('Select a Device or IT Asset.');
                if (dialog.employee) scope = selected.scope;
                payload = {equipmentId:selected.id, equipmentKind:selected.kind, categoryId:Number(data.get('categoryId')),
                    subject:data.get('subject'), description:data.get('description'), ...await ticketAttachmentPayload(form.elements.attachments)};
                if (selected.stockIssueId) payload.stockIssueId = selected.stockIssueId;
                if (dialog.employee && data.get('affectedSoftware')) payload.affectedSoftware = data.get('affectedSoftware');
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
                else if (!dialog.employee && action !== 'edit-message' && action !== 'remove-file') payload.expectedUpdatedAt = dialog.ticket.updatedAt;
            }
            const result = await requestTickets(path, payload, undefined, scope);
            dialog.root.dataset.saving = 'false';
            if (!ticketDialogActive(dialog)) return;
            if (action === 'create') {
                if (dialog.employee) void employeeQueueRefresh?.select(scope);
                else {
                    queueRefresh?.reset();
                    queueRefresh?.report();
                }
                config.closeModal();
                config.notify(ticketNumber(result.id) + ' created.', 'success');
                return;
            }
            void (dialog.employee ? employeeQueueRefresh : queueRefresh)?.refresh();
            if (!dialog.employee) queueRefresh?.report();
            dialog.source?.dispatchEvent(new Event('ticket-refresh'));
            await refreshTicketDetails(dialog);
            config.notify(dialog.employee ? (action === 'reopen' ? 'Ticket reopened.' : 'Reply sent.') : 'Ticket updated.', 'success');
        } catch (error) {
            if (ticketDialogActive(dialog)) {
                if (dialog.id && [409,403,404].includes(error.status)) await refreshTicketDetails(dialog);
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
        if (trigger.matches('[data-employee-ticket-create]')) return void openCreateTicket(true);
        if (trigger.matches('[data-ticket-report-equipment]')) return void openCreateTicket(true, {
            id:trigger.dataset.ticketReportEquipment, scope:trigger.dataset.equipmentScope, asset:trigger.hasAttribute('data-ticket-report-asset')
        });
        if (trigger.matches('[data-ticket-open]')) return void openTicketDetails(Number(trigger.dataset.ticketOpen),
            trigger.closest('[data-ticket-equipment-kind]'), trigger.closest('[data-employee-scope]')?.dataset.employeeScope);
        const dialog = currentDialog;
        if (!dialog || !dialog.root.contains(trigger) || dialog.root.dataset.saving === 'true') return;
        if (trigger.matches('[data-ticket-dismiss]')) config.closeModal();
        else if (trigger.matches('[data-ticket-reply]')) {
            dialog.tab = 'Updates';
            void showTicketTab(dialog, true);
        }
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
        currentDialog?.softwareRequest?.abort();
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
        canUseEmployee: () => !!config?.canUseEmployee(),
        render: renderTicketQueue,
        renderEmployee: renderEmployeeTicketQueue,
        hydrateQueue: hydrateTicketQueue,
        openLinkedTicket: (id, scope) => {
            if (scope === 'department') void employeeQueueRefresh?.select(scope);
            void openTicketDetails(id, undefined, scope);
        },
        hydrateSettings: hydrateServiceDeskSettings,
        equipmentPanel: renderTicketEquipmentPanel,
        hydrateEquipment: hydrateTicketEquipment,
        closed: closeTicketDialog
    };
})();
