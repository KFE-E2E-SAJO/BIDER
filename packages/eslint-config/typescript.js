import tseslint from 'typescript-eslint';
import globals from 'globals';

export const typescriptConfig = [
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
        // 모노레포 환경을 위한 project 설정
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      '@typescript-eslint/naming-convention': [
        'error',
        // 인터페이스는 PascalCase, I로 시작 금지
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
        // 타입 별칭은 PascalCase
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        // 함수는 camelCase
        {
          selector: 'function',
          format: ['camelCase'],
        },
        // 변수는 용도에 따라 다르게
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        //// 상수는 UPPER_CASE 또는 camelCase
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
      ],
      // 화살표 함수 선호
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'expression'],

      'no-useless-rename': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
    },
  },
];
