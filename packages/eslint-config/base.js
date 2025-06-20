import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import onlyWarn from 'eslint-plugin-only-warn';

export const baseConfig = [
  js.configs.recommended, // 기본 JS 추천 규칙 적용
  {
    plugins: {
      onlyWarn,
    },
    rules: {
      // 기본 규칙들
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': 'error',
      'no-useless-rename': 'error',
    },
  },
  // TurboRepo 관련 규칙 (조건부 적용)
  ...(process.env.TURBO_REPO
    ? [
        {
          plugins: {
            get turbo() {
              try {
                return require('eslint-plugin-turbo');
              } catch {
                return null;
              }
            },
          },
          rules: {
            'turbo/no-undeclared-env-vars': 'warn',
          },
        },
      ]
    : []),

  // ignore 설정
  {
    ignores: ['dist/**', 'node_modules/**', '.turbo/**'],
  },

  eslintConfigPrettier, // prettier 와 충돌나는 ESLint 포맷팅 규칙 비활성화
];
