import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// User site (<username>.github.io) is served from the domain root, so no `base` is needed.
// If you deploy to a project repo instead, set `base: '/<repo-name>'`.
export default defineConfig({
  site: 'https://mohamad-abdulkadir.github.io',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
