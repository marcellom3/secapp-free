/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#536dfe',
        'primary-dark': '#3a54d9',
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
        'dark-input': '#334155',
      },
    },
  },
  plugins: [],
}
