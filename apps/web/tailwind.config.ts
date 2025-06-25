import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Pick<Config, 'content' | 'presets'> = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './entities/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
    './shared/**/*.{js,ts,jsx,tsx}',
    './widgets/**/*.{js,ts,jsx,tsx}',
  ],

  presets: [sharedConfig],
};

export default config;
