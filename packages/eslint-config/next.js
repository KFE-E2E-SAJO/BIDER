import tseslint from 'typescript-eslint';
import globals from 'globals';
import pluginNext from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export const nextJsConfig = [
  {
    files: ['apps/**/*.{ts,tsx,js,jsx}', 'src/**/*.{ts,tsx,js,jsx}', 'pages/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
      },
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        ...globals.node,
      },
    },
    plugins: {
      '@next/next': pluginNext,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,

      // React 기본 규칙 (Next.js 앱에서도 적용)
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // 컴포넌트 정의 방식 (화살표 함수)
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      // 이벤트 핸들러 네이밍
      'react/jsx-handler-names': [
        'error',
        {
          eventHandlerPrefix: 'handle',
          eventHandlerPropPrefix: 'on',
          checkLocalVariables: true,
          checkInlineFunction: true,
        },
      ],

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-pascal-case': 'error',
      'react/prefer-stateless-function': 'error',
    },
    settings: {
      react: { version: 'detect' },
      next: {
        rootDir: ['apps/*/', './'],
      },
    },
  },
];

// Default export 추가
export default nextJsConfig;
