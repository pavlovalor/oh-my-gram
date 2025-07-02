/** @type {import("eslint").Linter.Config} */
export default {
  'jsx-quotes': ['error', 'prefer-double'],
  "react-refresh/only-export-components": "warn",
  "react/jsx-indent": ["warn", 2, {
    "indentLogicalExpressions": true,
    "checkAttributes": true
  }],
  "react/prop-types": 0,
  "react/no-typos": "warn",
  "react/jsx-no-bind":["warn", {
    "ignoreDOMComponents": false,
    "ignoreRefs": false,
    "allowArrowFunctions": true,
    "allowFunctions": false,
    "allowBind": false
  }],
  "react/display-name": "warn",
  "react/jsx-key": ["error", { "warnOnDuplicates": true }],
  "react/button-has-type": "warn",
  "react/self-closing-comp": "warn",
  "react/jsx-props-no-multi-spaces": "warn",
  "react/prefer-stateless-function": "error",
  "react/prefer-read-only-props": "warn",
  "react/no-unstable-nested-components": ["error", { "allowAsProps": true }],
  "react/jsx-closing-bracket-location": ["warn", "after-props"],
  "react/jsx-closing-tag-location": ["warn", "tag-aligned"],
  "react/jsx-curly-brace-presence": ["warn", "never"],
  "react/jsx-curly-spacing": ["warn", { "when": "never" }],
  "react/jsx-equals-spacing": ["warn", "never"],
  "react/jsx-no-comment-textnodes": "error",
  "react/jsx-no-useless-fragment": "warn",
  "react/jsx-pascal-case": "error",
  "react/jsx-tag-spacing": ["warn", {
    "beforeSelfClosing": "always"
  }],
  "react/jsx-wrap-multilines": ["warn", {
    "declaration": "parens-new-line",
    "assignment": "parens",
    "condition": "parens",
    "return": "parens",
    "arrow": "parens"
  }]
}