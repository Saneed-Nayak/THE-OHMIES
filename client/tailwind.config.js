/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: '#16a34a',
        'primary-hover': '#15803d',
        warning: '#d97706',
        danger: '#dc2626',
        'danger-hover': '#b91c1c',
        info: '#2563eb',
        dark: '#111827',
        light: '#f9fafb',
      }
    },
  },
  plugins: [],
}