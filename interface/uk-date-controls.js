/* UK calendar date controls. User-facing DD/MM/YYYY; existing source input.value remains ISO. */
(() => {
  'use strict';

  const MONTHS = ['January','February','March','April','May','June','July','August',
    'September','October','November','December'];
  const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const records = new WeakMap();
  const all = new Set();
  let serial = 0;
  let open = null;

  function validIso(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const year = Number(value.slice(0,4));
    const month = Number(value.slice(5,7));
    const day = Number(value.slice(8,10));
    if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    const d = new Date(0);
    d.setUTCHours(0,0,0,0);
    d.setUTCFullYear(year, month - 1, day);
    return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
  }

  function toUk(value) {
    return validIso(value) ? value.slice(8,10) + '/' + value.slice(5,7) + '/' + value.slice(0,4) : '';
  }

  function toIso(value) {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value || '').trim());
    if (!match) return '';
    const iso = match[3] + '-' + match[2] + '-' + match[1];
    return validIso(iso) ? iso : '';
  }

  function dateFromIso(value) {
    const date = new Date(0);
    date.setUTCHours(0,0,0,0);
    date.setUTCFullYear(Number(value.slice(0,4)), Number(value.slice(5,7)) - 1, Number(value.slice(8,10)));
    return date;
  }

  function isoFromDate(date) {
    const y = date.getUTCFullYear();
    return String(y).padStart(4,'0') + '-' +
      String(date.getUTCMonth() + 1).padStart(2,'0') + '-' +
      String(date.getUTCDate()).padStart(2,'0');
  }

  function shiftDate(value, days) {
    const date = dateFromIso(value);
    date.setUTCDate(date.getUTCDate() + days);
    return isoFromDate(date);
  }

  function monthDate(year, month, day) {
    const d = new Date(0);
    d.setUTCHours(0,0,0,0);
    d.setUTCFullYear(year, month, day);
    return d;
  }

  function fieldLabel(native) {
    const parent = native.closest('.device-review-field,.preview-form-field');
    const label = parent ? parent.querySelector('label') : null;
    return label ? label.textContent.trim() : native.getAttribute('aria-label') || 'Date';
  }

  function errorFor(record) {
    const text = record.text.value.trim();
    if (!text) return record.text.required ? 'Enter a date in DD/MM/YYYY format.' : '';
    const iso = toIso(text);
    if (!iso) return 'Enter a real calendar date in DD/MM/YYYY format.';
    const native = record.native;
    if (native.min && validIso(native.min) && iso < native.min)
      return 'Date must be on or after ' + toUk(native.min) + '.';
    if (native.max && validIso(native.max) && iso > native.max)
      return 'Date must be on or before ' + toUk(native.max) + '.';
    return '';
  }

  function applyText(record, notify) {
    const text = record.text;
    let raw = text.value.trim();
    if (/^\d{8}$/.test(raw)) {
      raw = raw.slice(0,2) + '/' + raw.slice(2,4) + '/' + raw.slice(4);
      text.value = raw;
    }
    const message = errorFor(record);
    text.setCustomValidity(message);
    text.setAttribute('aria-invalid', String(!!message && !!raw));
    record.error.textContent = message && raw ? message : '';
    const iso = toIso(raw);
    const source = record.native;
    const before = source.value;
    source.value = message ? '' : iso;
    if (notify && before !== source.value) {
      source.dispatchEvent(new Event('input', {bubbles:true}));
    }
    return !message;
  }

  function syncOne(record, force) {
    if (!record.native.isConnected) return;
    record.text.disabled = record.native.disabled;
    record.text.readOnly = record.native.readOnly;
    record.button.disabled = record.native.disabled || record.native.readOnly;
    if (!force && document.activeElement === record.text) return;
    record.text.value = toUk(record.native.value);
    record.text.setCustomValidity('');
    record.text.setAttribute('aria-invalid', 'false');
    record.error.textContent = '';
  }

  function sync(root) {
    for (const record of all) {
      if (!record.native.isConnected) {
        all.delete(record);
        continue;
      }
      if (!root || root === record.native || root.contains(record.native)) syncOne(record, false);
    }
  }

  function validate(root) {
    sync(root);
    for (const record of all) {
      if (!record.native.isConnected) {
        all.delete(record);
        continue;
      }
      if (root && root !== record.native && !root.contains(record.native)) continue;
      if (!applyText(record, false) || !record.text.checkValidity()) {
        record.text.reportValidity();
        record.text.focus();
        return false;
      }
    }
    return true;
  }

  function focus(native) {
    const record = records.get(native);
    (record ? record.text : native).focus();
  }

  function closePicker(restoreFocus) {
    if (!open) return;
    const previous = open;
    open = null;
    previous.record.button.setAttribute('aria-expanded','false');
    previous.popup.remove();
    if (restoreFocus && previous.record.button.isConnected) previous.record.button.focus();
  }

  function positionPicker() {
    if (!open || !open.record.button.isConnected) return;
    const button = open.record.button.getBoundingClientRect();
    const popup = open.popup;
    const width = Math.min(310, Math.max(250, window.innerWidth - 16));
    popup.style.width = width + 'px';
    popup.style.left = Math.max(8,Math.min(button.left, window.innerWidth - width - 8)) + 'px';
    const height = popup.getBoundingClientRect().height;
    const below = window.innerHeight - button.bottom;
    popup.style.top = Math.max(8, below >= height + 8
      ? button.bottom + 5 : button.top - height - 5) + 'px';
  }

  function calendarLabel(iso) {
    return new Intl.DateTimeFormat('en-GB', {
      weekday:'long', day:'numeric', month:'long', year:'numeric', timeZone:'UTC',
    }).format(dateFromIso(iso));
  }

  function drawCalendar(targetIso) {
    if (!open) return;
    const state = open;
    const source = state.record.native;
    const selected = validIso(source.value) ? source.value : '';
    const first = monthDate(state.year, state.month, 1);
    const offset = (first.getUTCDay() + 6) % 7;
    const start = monthDate(state.year, state.month, 1 - offset);
    const container = state.popup;
    container.replaceChildren();
    const header = document.createElement('div');
    header.className = 'caffoot-uk-date-header';
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'caffoot-uk-date-nav';
    previous.textContent = '‹';
    previous.setAttribute('aria-label','Previous month');
    const heading = document.createElement('strong');
    heading.id = state.headingId;
    heading.textContent = MONTHS[state.month] + ' ' + state.year;
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'caffoot-uk-date-nav';
    next.textContent = '›';
    next.setAttribute('aria-label','Next month');
    previous.disabled = state.year === 1 && state.month === 0;
    next.disabled = state.year === 9999 && state.month === 11;
    function stepMonth(delta) {
      const d = monthDate(state.year,state.month + delta,1);
      state.year = d.getUTCFullYear();
      state.month = d.getUTCMonth();
      drawCalendar();
    }
    previous.addEventListener('click', () => stepMonth(-1));
    next.addEventListener('click', () => stepMonth(1));
    header.append(previous,heading,next);
    container.append(header);

    const weekdays = document.createElement('div');
    weekdays.className = 'caffoot-uk-date-weekdays';
    WEEKDAYS.forEach(label => {
      const cell = document.createElement('span');
      cell.textContent = label;
      weekdays.append(cell);
    });
    container.append(weekdays);

    const days = document.createElement('div');
    days.className = 'caffoot-uk-date-days';
    const today = isoFromDate(new Date());
    let focusButton = null;
    for (let i = 0; i < 42; i++) {
      const date = monthDate(start.getUTCFullYear(),start.getUTCMonth(),start.getUTCDate() + i);
      const iso = isoFromDate(date);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'caffoot-uk-date-day';
      button.dataset.iso = iso;
      button.textContent = String(date.getUTCDate());
      button.setAttribute('aria-label',calendarLabel(iso));
      if (date.getUTCMonth() !== state.month) button.classList.add('is-outside');
      if (iso === selected) {
        button.classList.add('is-selected');
        button.setAttribute('aria-pressed','true');
      }
      if (iso === today) button.classList.add('is-today');
      button.disabled = (source.min && validIso(source.min) && iso < source.min) ||
        (source.max && validIso(source.max) && iso > source.max);
      button.tabIndex = -1;
      button.addEventListener('click',() => {
        state.record.text.value = toUk(iso);
        applyText(state.record,true);
        source.dispatchEvent(new Event('change',{bubbles:true}));
        closePicker(false);
        state.record.text.focus();
      });
      days.append(button);
      if (targetIso && iso === targetIso && !button.disabled) focusButton = button;
      else if (!targetIso && iso === (selected || today) && !button.disabled) focusButton = button;
    }
    container.append(days);
    state.focusDate = focusButton ? focusButton.dataset.iso : '';
    if (!focusButton) focusButton = days.querySelector('button:not([disabled])');
    if (focusButton) focusButton.tabIndex = 0;
    if (targetIso && focusButton) focusButton.focus();
    positionPicker();
  }

  function openPicker(record) {
    if (record.text.disabled || record.text.readOnly) return;
    if (open && open.record === record) {
      closePicker(true);
      return;
    }
    closePicker(false);
    const initial = toIso(record.text.value) || record.native.value || isoFromDate(new Date());
    const d = dateFromIso(initial);
    const popup = document.createElement('div');
    const popupId = 'caffoot-uk-date-picker-' + (++serial);
    popup.id = popupId;
    popup.className = 'caffoot-uk-date-picker';
    popup.setAttribute('role','dialog');
    popup.setAttribute('aria-label','Choose ' + fieldLabel(record.native) + ' (DD/MM/YYYY)');
    record.button.setAttribute('aria-controls',popupId);
    record.button.setAttribute('aria-expanded','true');
    document.body.append(popup);
    open = {record,popup,year:d.getUTCFullYear(),month:d.getUTCMonth(),
      headingId:popupId+'-month',focusDate:''};
    popup.setAttribute('aria-labelledby',open.headingId);
    drawCalendar();
    const selected = popup.querySelector('.caffoot-uk-date-day[tabindex="0"]');
    if (selected) selected.focus();
    else popup.querySelector('.caffoot-uk-date-nav')?.focus();
  }

  function navigateDate(key,shift) {
    if (!open) return;
    const state = open;
    const active = document.activeElement;
    if (!active || !active.classList.contains('caffoot-uk-date-day')) return;
    const current = active.dataset.iso;
    let next = current;
    if (key === 'ArrowLeft') next = shiftDate(current,-1);
    else if (key === 'ArrowRight') next = shiftDate(current,1);
    else if (key === 'ArrowUp') next = shiftDate(current,-7);
    else if (key === 'ArrowDown') next = shiftDate(current,7);
    else if (key === 'Home') next = shiftDate(current,-((dateFromIso(current).getUTCDay()+6)%7));
    else if (key === 'End') next = shiftDate(current,6-((dateFromIso(current).getUTCDay()+6)%7));
    else if (key === 'PageUp' || key === 'PageDown') {
      const d = dateFromIso(current);
      d.setUTCDate(1);
      d.setUTCMonth(d.getUTCMonth() + (key === 'PageUp' ? -1 : 1) * (shift ? 12 : 1));
      const day = Math.min(Number(current.slice(8,10)),
        monthDate(d.getUTCFullYear(),d.getUTCMonth()+1,0).getUTCDate());
      d.setUTCDate(day);
      next = isoFromDate(d);
    } else return;
    if (!validIso(next)) return;
    if ((state.record.native.min && next < state.record.native.min) ||
        (state.record.native.max && next > state.record.native.max)) return;
    const date = dateFromIso(next);
    state.year = date.getUTCFullYear();
    state.month = date.getUTCMonth();
    drawCalendar(next);
  }

  function enhance(native) {
    if (!native || native.type !== 'date' || native.dataset.caffootUkDate === 'true') return;
    native.dataset.caffootUkDate = 'true';
    const wrapper = document.createElement('span');
    wrapper.className = 'caffoot-uk-date-wrap';
    const text = document.createElement('input');
    text.type = 'text';
    text.id = 'caffoot-uk-' + (native.id || 'date-' + (++serial));
    text.className = native.className + ' caffoot-uk-date-text';
    text.placeholder = 'DD/MM/YYYY';
    text.maxLength = 10;
    text.inputMode = 'numeric';
    text.autocomplete = 'off';
    text.spellcheck = false;
    text.value = toUk(native.value);
    text.required = native.required;
    text.disabled = native.disabled;
    text.readOnly = native.readOnly;
    text.setAttribute('aria-label',fieldLabel(native) + ' (DD/MM/YYYY)');
    const described = native.getAttribute('aria-describedby');
    const error = document.createElement('span');
    error.id = text.id + '-error';
    error.className = 'caffoot-uk-date-error';
    error.setAttribute('aria-live','polite');
    text.setAttribute('aria-describedby',(described ? described + ' ' : '') + error.id);
    const label = native.id ? [...document.querySelectorAll('label')].find(l => l.htmlFor === native.id) : null;
    if (label) label.htmlFor = text.id;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'caffoot-uk-date-trigger';
    button.setAttribute('aria-label','Choose ' + fieldLabel(native) + ' from calendar');
    button.setAttribute('aria-haspopup','dialog');
    button.setAttribute('aria-expanded','false');
    button.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M7 3v4M17 3v4M3 10h18"></path></svg>';
    button.disabled = native.disabled || native.readOnly;

    // Retain the original ID/name/type/value and native programmatic API:
    // all existing form-data, validation and stock transaction code uses ISO.
    native.required = false;
    native.tabIndex = -1;
    native.setAttribute('aria-hidden','true');
    native.classList.add('caffoot-uk-date-source');
    native.parentNode.insertBefore(wrapper,native);
    wrapper.append(native,text,button);
    wrapper.parentNode.insertBefore(error,wrapper.nextSibling);
    const record = {native,text,button,error};
    records.set(native,record);
    all.add(record);
    text.addEventListener('input',() => applyText(record,true));
    text.addEventListener('change',() => {
      applyText(record,true);
      native.dispatchEvent(new Event('change',{bubbles:true}));
    });
    text.addEventListener('blur',() => applyText(record,false));
    native.addEventListener('input',() => syncOne(record,false));
    native.addEventListener('change',() => syncOne(record,false));
    button.addEventListener('click',() => openPicker(record));
    syncOne(record,true);
  }

  function scan(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.matches && node.matches('input[type="date"]')) enhance(node);
    if (node.querySelectorAll) node.querySelectorAll('input[type="date"]:not([data-caffoot-uk-date])').forEach(enhance);
  }

  document.addEventListener('submit', event => {
    if (!validate(event.target)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);
  document.addEventListener('reset', event => {
    const form = event.target;
    queueMicrotask(() => {
      for (const record of all) if (form.contains(record.native)) syncOne(record,true);
    });
  },true);
  document.addEventListener('click', () => {
    // Existing button handlers may set source.value without firing input.
    requestAnimationFrame(() => sync(document));
  },true);
  document.addEventListener('pointerdown',event => {
    if (open && !open.popup.contains(event.target) && !open.record.button.contains(event.target))
      closePicker(false);
  },true);
  document.addEventListener('keydown',event => {
    if (!open) return;
    if (!open.popup.contains(event.target)) return;
    if (event.key === 'Escape') {
      event.stopPropagation();
      event.preventDefault();
      closePicker(true);
    } else if (event.key === 'Tab') {
      closePicker(false);
    } else if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key) &&
      event.target.classList.contains('caffoot-uk-date-day')) {
      event.preventDefault();
      navigateDate(event.key,event.shiftKey);
    }
  },true);
  window.addEventListener('resize',positionPicker);
  window.addEventListener('scroll',positionPicker,true);
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) for (const node of mutation.addedNodes) scan(node);
    if (open && !open.record.native.isConnected) closePicker(false);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  scan(document.documentElement);

  window.caffootUkDates = {toIso,toUk,validIso,sync,validate,focus};
})();