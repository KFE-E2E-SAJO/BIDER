import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Pick<Config, 'content' | 'presets'> = {
  content: [
    './stories/**/*.{ts,tsx}', // ✅ 스토리북 내부 스토리
  ],

  presets: [sharedConfig],
};

export default config;
