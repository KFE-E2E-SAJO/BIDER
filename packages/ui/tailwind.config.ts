import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Pick<Config, 'content' | 'presets'> = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // UI 컴포넌트 사용 위치
  ],
  presets: [sharedConfig],
};

export default config;
