/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    require.resolve('./rules/common.cjs'),
  ],
  plugins: ['@typescript-eslint/eslint-plugin'],
  env: {
    node: true,
    jest: true,
  },
}