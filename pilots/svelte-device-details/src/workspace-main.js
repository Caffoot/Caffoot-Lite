import { mount } from 'svelte';
import IntegratedDeviceDetails from './IntegratedDeviceDetails.svelte';
// Bundle the SIL OFL-licensed Inter variable font locally; no Google Fonts
// request, no internet dependency, and real 550/750/790 weights.
import '@fontsource-variable/inter/wght.css';
import './styles.css';
import './workspace-typography.css';

// An authenticated, flag-controlled first workspace screen. All writes remain
// in the established interface until their full functional parity is approved.
mount(IntegratedDeviceDetails, {
  target: document.getElementById('app'),
  props: {workspaceMode: true}
});
