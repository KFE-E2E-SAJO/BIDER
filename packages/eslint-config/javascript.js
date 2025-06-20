import globals from 'globals';

export const javascriptConfig = {
  files: ['**/*.{js,jsx}'],
  languageOptions: {
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  rules: {
    'no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'no-console': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    'object-shorthand': 'error',
    'no-useless-rename': 'error',

    // 화살표 함수 선호
    'prefer-arrow-callback': 'error',
    'func-style': ['error', 'expression'],
  },
};
