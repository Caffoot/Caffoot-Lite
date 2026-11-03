import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';

// Two separate entry points: the original fictional-data pilot and our
// strictly opt-in read-only integration experiment. Both compile to static files.
export default defineConfig({
  plugins: [svelte()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        integration: fileURLToPath(new URL('./integration.html', import.meta.url))
      }
    }
  },
  server: { host: '127.0.0.1' }
});
