/* Load the shared navigation and screen templates before connecting live actions. */
'use strict';
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
    const designs = ['dashboard','my-account','settings','device-details','ipam','racks','users','audit-trail'];
    await Promise.all(designs.map(async name => {
        interfaceStyles.set(name, await loadInterfaceText('styles/' + name + '.css'));
    }));
    const currentStyle = document.getElementById('interface-page-style');
    const pageStyle = document.createElement('style');
    pageStyle.id = currentStyle.id;
    currentStyle.replaceWith(pageStyle);
    const root = document.getElementById('interface-root');
    root.innerHTML = await loadInterfaceText('screens/navigation.html');
    root.replaceWith(...root.childNodes);
    const script = document.createElement('script');
    script.src = '/interface/application.js';
    script.onerror = () => showInterfaceLoadError();
    document.body.append(script);
}
function showInterfaceLoadError() {
    const root = document.getElementById('interface-root') || document.getElementById('main-content');
    if (!root) return;
    root.replaceChildren();
    const message = document.createElement('p');
    message.textContent = 'Unable to load the interface. Please reload or sign in again.';
    root.append(message);
    root.setAttribute('aria-busy', 'false');
}
void initialiseInterface().catch(showInterfaceLoadError);
