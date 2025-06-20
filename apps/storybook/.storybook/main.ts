import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { join, dirname } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath('@chromatic-com/storybook'), getAbsolutePath('@storybook/addon-docs')],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  // async viteFinal(baseConfig) {
  //   return mergeConfig(baseConfig, {
  //     plugins: [tsconfigPaths()],

  //     // 2) @ui 패키지 alias (모노레포)
  //     resolve: {
  //       alias: {
  //         ...(baseConfig.resolve?.alias || {}),
  //         '@repo/ui': path.resolve(__dirname, '../../../packages/ui/src'),
  //       },
  //     },

  //     // 3) Storybook 루트 밖 파일 접근 허용
  //     server: {
  //       fs: {
  //         allow: ['../../../packages/ui/src', '../stories', '..'],
  //       },
  //     },
  //   });
  // },
};

export default config;
