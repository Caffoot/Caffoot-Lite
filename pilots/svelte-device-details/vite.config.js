import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// This is a standalone experiment. The ordinary Caffoot Lite build is unchanged.
export default defineConfig({
  plugins: [svelte()],
  base: './',
  build: { outDir: 'dist', emptyOutDir: true },
  server: { host: '127.0.0.1' }
});
