import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import jsonc from 'eslint-plugin-jsonc';
import playwright from 'eslint-plugin-playwright';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // JavaScript and TypeScript files
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': 'warn', // Warn instead of error for unused variables
      'no-undef': 'error', // Ensure undefined variables are caught
      'no-console': ['error', { allow: ['warn', 'error'] }], // Disallow console.log but allow console.warn and console.error
    },
  },

  // TypeScript-specific rules
  tseslint.configs.recommended,

  // JSON files
  {
    files: ['**/*.json'],
    plugins: { json, jsonc },
    extends: ['json/recommended'],
    rules: {
      'jsonc/no-comments': 'warn', // Warn about comments in JSON files
    },
  },

  // Markdown files
  {
    files: ['**/*.md'],
    plugins: { markdown },
    extends: ['markdown/recommended'],
    rules: {
      'markdown/no-inline-html': 'off', // Allow inline HTML in Markdown
    },
  },

  // Playwright test files
  playwright.configs['flat/recommended'],
  {
    files: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
    rules: {
      'playwright/no-focused-test': 'error', // Prevent focused tests
      'playwright/no-skipped-test': 'warn', // Warn about skipped tests
      'playwright/no-wait-for-timeout': 'error', // Disallow `page.waitForTimeout`
      'playwright/no-force-option': 'error', // Disallow `force: true` in actions
      'playwright/expect-expect': 'error', // Ensure `expect` is used in tests
      'playwright/no-conditional-in-test': 'warn', // Warn about conditionals in tests
      'playwright/no-page-pause': 'error',
      'playwright/no-wait-for-selector': 'error',
      'playwright/no-duplicate-hooks': 'error',
      'playwright/no-useless-await': 'error',
      'playwright/no-useless-not': 'error',
      'playwright/no-get-by-title': 'error',
      'playwright/no-nested-step': 'error',
      'playwright/no-networkidle': 'error',
      'playwright/no-nth-methods': 'error',
      'playwright/no-raw-locators': ['error', { allowed: ['iframe', "[aria-busy='false']"] }],
      'playwright/missing-playwright-await': ['error'],
      'playwright/valid-expect': 'error',
      'playwright/valid-title': 'error',
      'playwright/prefer-comparison-matcher': 'error',
      'playwright/prefer-equality-matcher': 'error',
      'playwright/prefer-to-be': 'error',
      'playwright/prefer-to-contain': 'error',
      'playwright/prefer-to-have-length': 'error',
      'playwright/prefer-hooks-in-order': 'error',
      'playwright/prefer-hooks-on-top': 'error',
      'playwright/prefer-locator': 'error',
      'playwright/prefer-lowercase-title': 'error',
      'playwright/prefer-native-locators': 'error',
      'playwright/max-expects': ['error', { max: 5 }],
    },
  },

  // Ignore specific files and folders
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/test-results/**',
      '**/test-report/**',
      '**/allure-results/**',
      '**/allure-report/**',
      '**/playwright-report/**',
      '**/specs/**',
      '**/logs/**',
      '**/temp/**',
      '**services/**',
      '**/tsconfig.json',
      '**/tsconfig.*.json',
      '**/package*.json',
      '**/openapitools.json',
      '**/executors.json',
      '.vscode/**',
      'artifacts/*State.json',
      '**/utils/test-scenarios.json',
      '**/configs/executor.json',
      '**/artifacts/*cookies.json',
    ],
  },
]);
