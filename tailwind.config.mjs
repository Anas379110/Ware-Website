/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,ts}'],
  theme: {
    extend: {
      fontFamily: { arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'] },
      colors: {
        // هوية Ware — كحلي مؤسسي + ذهبي مالي هادئ (UI-UX.md)
        brand: {
          DEFAULT: '#122C4A',
          dark: '#0B1D30',
          gold: '#B08D57',
        },
        neutral: { 50: '#F7F7F7', 900: '#1A1A1A' },
      },
    },
  },
  plugins: [],
};
