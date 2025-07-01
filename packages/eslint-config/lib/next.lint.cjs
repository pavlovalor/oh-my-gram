const { resolve } = require('node:path')

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    require.resolve('@vercel/style-guide/eslint/next'),
    require.resolve('./rules/common.cjs'),
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  settings: {
    'import/resolver': {
      typescript: {
        project: resolve(process.cwd(), 'tsconfig.json'),
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.*?js',
    'node_modules/',
  ],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }],
};
