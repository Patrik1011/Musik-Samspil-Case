import js from '@eslint/js';
import react from 'eslint-plugin-react';
import tseslint from '@typescript-eslint/eslint-plugin';

const config = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        node: true,
        browser: true,
        es2021: true,
      },
      parser: '@typescript-eslint/parser',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-duplicate-imports': 'error',
      'no-template-curly-in-string': 'warn',
      camelcase: 'warn',
      'arrow-body-style': ['error', 'as-needed'],
      'import-x/extensions': 'off',
      'import-x/order': 'off',
      'max-statements': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'sonarjs/pseudo-random': 'off',
      'promise/prefer-await-to-callbacks': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: '@typescript-eslint/parser',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
    },
    extends: [
      tseslint.configs.recommended,
      react.configs.recommended,
    ],
    settings: {
      react: {
        version: 'detect', // Automatically detect the react version
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    },
  },
];

export default config;