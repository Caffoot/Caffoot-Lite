/* Load the shared navigation and screen templates before connecting live actions. */
'use strict';
// Keep authenticated API errors as JSON. Only navigate after /api/session
// confirms that a failed application request belongs to an ended session.
const originalApplicationFetch = window.fetch.bind(window);
let applicationSessionProbe = null;
window.caffootSessionRedirectPending = false;
function returnToExistingSignIn() {
    if (window.caffootSessionRedirectPending) return;
    window.caffootSessionRedirectPending = true;
    window.location.replace('/setup#session-ended');
}
window.fetch = async (...args) => {
    const response = await originalApplicationFetch(...args);
    if (window.caffootSessionRedirectPending || ![401, 403].includes(response.status)) return response;
    let url;
    try {
        const input = args[0];
        url = new URL(typeof input === 'string' ? input : input.url, window.location.href);
    } catch (_) { return response; }
    if (url.origin !== window.location.origin ||
        !(url.pathname.startsWith('/api/') || url.pathname.startsWith('/interface/'))) return response;
    if (url.pathname === '/api/session') {
        if (response.status === 401) returnToExistingSignIn();
        return response;
    }
    if (!applicationSessionProbe) {
        applicationSessionProbe = originalApplicationFetch('/api/session', {cache: 'no-store'})
            .then(check => check.status === 401)
            .catch(() => false)
            .finally(() => { applicationSessionProbe = null; });
    }
    if (await applicationSessionProbe) returnToExistingSignIn();
    return response;
};
const interfaceTemplates = new Map();
const interfaceStyles = new Map();
function renderInterfaceTemplate(name, values = []) {
    if (!interfaceTemplates.has(name)) throw new Error('Missing interface template: ' + name);
    const template = interfaceTemplates.get(name).replace(/<!-- interface-include:([^ ]+) -->/g, (_, child) => {
        if (!interfaceTemplates.has(child)) throw new Error('Missing included template: ' + child);
        return interfaceTemplates.get(child);
    });
    return template.replace(/\{\{slot:(\d+)\}\}/g, (_, index) => String(values[Number(index)]));
}
async function loadInterfaceText(path) {
    const response = await fetch('/interface/' + path, {cache: 'no-store'});
    if (!response.ok) throw new Error('Unable to load the interface. Please sign in again.');
    return response.text();
}
async function initialiseInterface() {
    const screenNames = ['audit-trail','dashboard','migration','my-account','users','settings','racks','ipam','device-management','device-details','devices','device-inventory','shared'];
    const files = await Promise.all(screenNames.map(name => loadInterfaceText('screens/' + name + '.html')));
    for (const text of files) {
        for (const match of text.matchAll(/<!-- interface-template:([^ ]+) -->([\s\S]*?)<!-- \/interface-template -->/g)) {
            if (interfaceTemplates.has(match[1])) throw new Error('Duplicate interface template: ' + match[1]);
            interfaceTemplates.set(match[1], match[2]);
        }
    }
    const designs = ['dashboard','my-account','settings','device-details','devices','device-inventory','device-management','ipam','racks','users','audit-trail','staff','equipment','stock'];
    await Promise.all(designs.map(async name => {
        interfaceStyles.set(name, await loadInterfaceText('styles/' + name + '.css'));
    }));
    const equipmentStyle = document.createElement('style');
    equipmentStyle.textContent = interfaceStyles.get('equipment');
    document.head.append(equipmentStyle);
    const staffStyle = interfaceStyles.get('users') + '\n' + interfaceStyles.get('staff');
    interfaceStyles.set('staff', staffStyle);
    interfaceStyles.set('departments', staffStyle);
    interfaceStyles.set('it-assets', staffStyle + '\n' + interfaceStyles.get('stock'));
    const currentStyle = document.getElementById('interface-page-style');
    const pageStyle = document.createElement('style');
    pageStyle.id = currentStyle.id;
    currentStyle.replaceWith(pageStyle);
    const root = document.getElementById('interface-root');
    root.innerHTML = await loadInterfaceText('screens/navigation.html');
    root.replaceWith(...root.childNodes);
    const staffScript = document.createElement('script');
    staffScript.src = '/interface/staff-directory.js';
    staffScript.onerror = () => showInterfaceLoadError();
    staffScript.onload = () => {
        const script = document.createElement('script');
        script.src = '/interface/equipment.js';
        script.onerror = () => showInterfaceLoadError();
        script.onload = () => {
            const stockScript = document.createElement('script');
            stockScript.src = '/interface/stock-intake.js';
            stockScript.onerror = () => showInterfaceLoadError();
            stockScript.onload = () => {
                const applicationScript = document.createElement('script');
                applicationScript.src = '/interface/application.js';
                applicationScript.onerror = () => showInterfaceLoadError();
                document.body.append(applicationScript);
            };
            document.body.append(stockScript);
        };
        document.body.append(script);
    };
    document.body.append(staffScript);
}
function showInterfaceLoadError() {
    if (window.caffootSessionRedirectPending) return;
    const root = document.getElementById('interface-root') || document.getElementById('main-content');
    if (!root) return;
    root.replaceChildren();
    const message = document.createElement('p');
    message.textContent = 'Unable to load the interface. Please reload or sign in again.';
    root.append(message);
    root.setAttribute('aria-busy', 'false');
}
void initialiseInterface().catch(showInterfaceLoadError);
