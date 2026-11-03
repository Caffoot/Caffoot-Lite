import { mount } from 'svelte';
import Dashboard from './Dashboard.svelte';
import '@fontsource-variable/inter/wght.css';
import './styles.css';
import './workspace-typography.css';

mount(Dashboard,{target:document.getElementById('app')});
