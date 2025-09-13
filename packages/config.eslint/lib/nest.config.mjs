import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import commonRules from './rules/common.rules.mjs';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  ...compat.extends(),
  {
    files: ['**/*.ts'],
    ignores: ['dist/**/*', 'node_modules'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json', sourceType: 'module' }
    },
    plugins: { '@typescript-eslint': tsPlugin, import: importPlugin },
    rules: {
      ...commonRules,
    }
  }
];
