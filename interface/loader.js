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
    window.caffootServiceDesk?.stopUnread();
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
let installedSoftwareCatalogue;
async function initialiseInterface() {
    const screenNames = ['audit-trail','dashboard','migration','my-account','users','settings','racks','ipam','device-management','device-details','devices','device-inventory','service-desk','shared'];
    const [catalogueText, ...files] = await Promise.all([
        loadInterfaceText('installed-software-catalogue.json'),
        ...screenNames.map(name => loadInterfaceText('screens/' + name + '.html'))
    ]);
    installedSoftwareCatalogue = JSON.parse(catalogueText);
    for (const text of files) {
        for (const match of text.matchAll(/<!-- interface-template:([^ ]+) -->([\s\S]*?)<!-- \/interface-template -->/g)) {
            if (interfaceTemplates.has(match[1])) throw new Error('Duplicate interface template: ' + match[1]);
            interfaceTemplates.set(match[1], match[2]);
        }
    }
    const designs = ['dashboard','my-account','settings','device-details','devices','device-inventory','device-management','ipam','racks','users','audit-trail','staff','equipment','stock','suppliers','dashboard-lifecycle','settings-lifecycle','device-details-lifecycle','device-management-lifecycle','service-desk','settings-email-templates'];
    await Promise.all(designs.map(async name => {
        interfaceStyles.set(name, await loadInterfaceText('styles/' + name + '.css'));
    }));
    // Preserve the exact pinned v2.1 stylesheets and append only approved Batch 4.4 rules.
    for(const name of ['dashboard','settings','device-details','device-management'])
        interfaceStyles.set(name, interfaceStyles.get(name) + interfaceStyles.get(name + '-lifecycle'));
    interfaceStyles.set('settings', interfaceStyles.get('settings') + interfaceStyles.get('settings-email-templates'));
    interfaceStyles.set('service-desk-queue', interfaceStyles.get('device-inventory'));
    const serviceDeskStyle = document.createElement('style');
    serviceDeskStyle.textContent = interfaceStyles.get('service-desk');
    document.head.append(serviceDeskStyle);
    const equipmentStyle = document.createElement('style');
    equipmentStyle.textContent = interfaceStyles.get('equipment');
    document.head.append(equipmentStyle);
    const supplierStyle = document.createElement('style');
    supplierStyle.textContent = interfaceStyles.get('suppliers');
    document.head.append(supplierStyle);
    const staffStyle = interfaceStyles.get('users') + '\n' + interfaceStyles.get('staff');
    interfaceStyles.set('staff', staffStyle);
    interfaceStyles.set('departments', staffStyle);
    interfaceStyles.set('it-assets', staffStyle + '\n' + interfaceStyles.get('stock'));
    interfaceStyles.set('suppliers', interfaceStyles.get('device-inventory') + '\n' + staffStyle +
        '\n' + interfaceStyles.get('stock') + '\n' + interfaceStyles.get('suppliers'));
    interfaceStyles.set('purchasing', interfaceStyles.get('dashboard') + '\n' + interfaceStyles.get('suppliers'));
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
                const supplierScript = document.createElement('script');
                supplierScript.src = '/interface/suppliers.js';
                supplierScript.onerror = () => showInterfaceLoadError();
                supplierScript.onload = () => {
                    const lifecycleScript = document.createElement('script');
                    lifecycleScript.src = '/interface/lifecycle.js';
                    lifecycleScript.onerror = () => showInterfaceLoadError();
                    lifecycleScript.onload = () => {
                        const ukDatesScript = document.createElement('script');
                        ukDatesScript.src = '/interface/uk-date-controls.js';
                        ukDatesScript.onerror = () => showInterfaceLoadError();
                        ukDatesScript.onload = () => {
                            const serviceDeskScript = document.createElement('script');
                            serviceDeskScript.src = '/interface/service-desk.js';
                            serviceDeskScript.onerror = showInterfaceLoadError;
                            serviceDeskScript.onload = () => {
                                const emailTemplatesScript = document.createElement('script');
                                emailTemplatesScript.src = '/interface/email-templates.js';
                                emailTemplatesScript.onerror = showInterfaceLoadError;
                                emailTemplatesScript.onload = loadApplication;
                                document.body.append(emailTemplatesScript);
                            };
                            document.body.append(serviceDeskScript);
                        };
                        document.body.append(ukDatesScript);
                    };
                    document.body.append(lifecycleScript);
                };
                document.body.append(supplierScript);
            };
            function loadApplication() {
                const applicationScript = document.createElement('script');
                applicationScript.src = '/interface/application.js';
                applicationScript.onerror = () => showInterfaceLoadError();
                document.body.append(applicationScript);
            }
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
