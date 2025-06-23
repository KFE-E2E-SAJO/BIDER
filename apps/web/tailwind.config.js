/** @type {import('tailwindcss').Config} */
import sharedConfig from '@repo/tailwind-config';
const config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [sharedConfig],
};

export default config;
