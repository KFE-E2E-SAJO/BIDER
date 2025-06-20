// packages/ui/eslint.config.mjs
import { config } from '@repo/eslint-config';
// import { config } from '@repo/eslint-config/react-internal.js';

// /** @type {import("eslint").Linter.Config} */
// export default config;
import baseConfig from '@repo/eslint-config/react.js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'storybook-static/**', // Storybook 빌드 파일 제외
      '.storybook/main.ts', // Storybook 설정 파일도 제외 가능
    ],
  },
  ...baseConfig,
];
