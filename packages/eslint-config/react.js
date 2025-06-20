import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';

export const reactConfig = [
  {
    files: ['packages/**/*.{ts,tsx,js,jsx}', 'components/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      // React JSX 파싱을 위한 설정 추가
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        React: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
    },
    rules: {
      // React 기본 규칙들
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // 컴포넌트 정의 방식 (팀 컨벤션: 화살표 함수)
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      // React 핵심 규칙
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off', //Next.js에서 불필요
      'react/prop-types': 'off', // TypeScript 사용시 불필요

      'react/jsx-handler-names': [
        'error',
        {
          eventHandlerPrefix: 'handle',
          eventHandlerPropPrefix: 'on',
          checkLocalVariables: true, // 로컬 변수도 체크
          checkInlineFunction: true, // 인라인 함수도 체크
        },
      ],

      //Import 순서 규칙
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unused-modules': 'warn',
      'import/first': 'error', // import가 파일 맨 위에 와야 함

      // 컴포넌트 네이밍 (PascalCase)
      'react/jsx-pascal-case': 'error',

      // 함수형 컴포넌트 선호
      'react/prefer-stateless-function': 'error',
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
];
export default reactConfig;
