module.exports = {
  extends: ['extreme'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  rules: {
    'n/no-process-env': 'off',
    'import-x/extensions': 'off',
    'import-x/order': 'off',
    'max-statments': 'off',
  },
  ignorePatterns: ['node_modules', 'dist'],
};
