import js from '@eslint/js';

const config = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Add any global variables here
        node: true,
        browser: true,
        es2021: true
      }
    },
    rules: {
      // Common ESLint rules
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-duplicate-imports': 'error',
      'no-template-curly-in-string': 'warn',
      'camelcase': 'warn',
      'arrow-body-style': ['error', 'as-needed'],
      'import-x/extensions': 'off',
      'import-x/order': 'off',
      'max-statements': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'sonarjs/pseudo-random': 'off',
      'promise/prefer-await-to-callbacks': 'off'
    }
  }
];

const htmlPlugin = await import('@html-eslint/eslint-plugin');
const htmlParser = await import('@html-eslint/parser');

config.push({
  files: ['**/*.html'],
  plugins: {
    '@html-eslint': htmlPlugin
  },
  languageOptions: {
    parser: htmlParser
  },
  rules: {
    ...htmlPlugin.default.configs.extended,
  }
});

export default config;
