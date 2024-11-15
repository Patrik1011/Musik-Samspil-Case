import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.cache/**",
      "**/build/**"
    ],
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: [
          "./apps/web/tsconfig.app.json",
          "./apps/server/tsconfig.json"
        ]
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
