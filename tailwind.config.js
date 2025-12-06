/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'mdla-yellow': '#FFCC00',
        'mdla-black': '#1A1A1A',
        'mdla-red': '#E30613',
      },
    },
  },
  plugins: [],
};
