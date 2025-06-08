/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './docs/.vitepress/**/*.{vue,js,ts,jsx,tsx,md}',
    './docs/**/*.{vue,js,ts,jsx,tsx,md}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: {
          light: 'var(--color-surface-light)',
          dark: 'var(--color-surface-dark)'
        },
        text: {
          light: 'var(--color-text-light)',
          dark: 'var(--color-text-dark)'
        },
        accent: {
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)'
        }
      }
    }
  },
  plugins: []
} 