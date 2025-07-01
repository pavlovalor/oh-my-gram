// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['apps/**', 'packages/**'],
  extends: ['@omg/eslint-config/library'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: require.resolve('./tsconfig.json'),
  },
};