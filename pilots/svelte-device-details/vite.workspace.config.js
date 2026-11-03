import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';

// A dedicated production-ready static build; never package the fictional pilot.
export default defineConfig({
  plugins: [svelte()],
  base: '/workspace/',
  build: {
    outDir: '../../workspace-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {workspace: fileURLToPath(new URL('./workspace.html', import.meta.url)),dashboard: fileURLToPath(new URL('./dashboard.html', import.meta.url))}
    }
  },
  server: {host: '127.0.0.1'}
});
