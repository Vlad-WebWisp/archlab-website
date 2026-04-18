/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B1222',
          alt: '#0F1A2E',
          light: '#F8FAFC',
          primary: '#2563EB',
          accent: '#06B6D4',
          success: '#10B981',
          warning: '#F59E0B',
          border: '#1E293B',
        },
        heading: {
          dark: '#F1F5F9',
          light: '#0F172A',
        },
        body: {
          dark: '#94A3B8',
          light: '#475569',
        },
        muted: '#64748B',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};
