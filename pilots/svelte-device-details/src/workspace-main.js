import { mount } from 'svelte';
import IntegratedDeviceDetails from './IntegratedDeviceDetails.svelte';
import './styles.css';

// An authenticated, flag-controlled first workspace screen. All writes remain
// in the established interface until their full functional parity is approved.
mount(IntegratedDeviceDetails, {
  target: document.getElementById('app'),
  props: {workspaceMode: true}
});
