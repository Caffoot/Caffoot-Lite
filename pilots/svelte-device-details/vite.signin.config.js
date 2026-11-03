import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';

// The public sign-in preview is separate from the protected workspace assets.
export default defineConfig({
  plugins: [svelte()],
  base: '/sign-in/',
  build: {
    outDir: '../../signin-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {signin: fileURLToPath(new URL('./signin.html', import.meta.url))}
    }
  },
  server: {host:'127.0.0.1'}
});
