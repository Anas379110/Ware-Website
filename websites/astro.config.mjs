import { defineConfig } from 'astro/config';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  output: 'static',
  vite: { css: { postcss: { plugins: [tailwind(), autoprefixer()] } } },
});
