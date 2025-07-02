/** @type {import('eslint').Linter.Config} */
export default {
  'quotes': ['error', 'single', { 
    avoidEscape: true, 
    allowTemplateLiterals: true 
  }],
  'eol-last': ['error', 'always'],
  'keyword-spacing': ['error', { 
    before: true, 
    after: true 
  }],
  'no-restricted-exports': ['error', { 
    restrictedNamedExports: ['default'] 
  }],
  'no-trailing-spaces': 'warn',
  '@typescript-eslint/no-explicit-any': ['warn', {
    'ignoreRestArgs': true,
  }],
  '@typescript-eslint/no-namespace': 'off',
  '@typescript-eslint/no-unused-expressions': 'off',
  '@typescript-eslint/no-unused-vars': ['warn', {
    'argsIgnorePattern': '^_'
  }],
  'semi': ['warn', 'never'],
  'jsx-quotes': ['warn', 'prefer-double'],
  'indent': ['warn', 2],
  'array-bracket-spacing': ['warn', 'never'],
  'object-curly-spacing': ['warn', 'always'],
  'no-multiple-empty-lines': 'warn',
  'func-call-spacing': ['warn', 'never'],
  'space-in-parens': ['warn', 'never'],
  'rest-spread-spacing': ['warn', 'never'],
  'switch-colon-spacing': ['warn', {
    after: true, 
    before: false
  }],
  'no-multi-spaces': ['warn', {
    ignoreEOLComments: true
  }],
  'arrow-spacing': ['warn', {
      before: true,
      after: true,
  }],
  'arrow-parens': ['warn', 'as-needed'],
  'coma-dangle': 'off',
  '@typescript-eslint/member-delimiter-style': ['warn', {
    multiline: {
      delimiter: 'semi',
      requireLast: true
    },
    singleline: {
      delimiter: 'semi',
      requireLast: false
    },
    multilineDetection: 'brackets'
  }],
  '@typescript-eslint/block-spacing': ['warn', 'always'],
  'computed-property-spacing': ['warn', 'never'],
  'dot-location': ['warn', 'property'],
  'max-len': ['warn', {
    code: 130,
    comments: 120,
    ignoreTrailingComments: true,
    ignoreTemplateLiterals: true,
    ignoreRegExpLiterals: true,
    ignoreStrings: true,
    ignoreUrls: true,
  }],
  'lines-between-class-members': ['warn', {
    enforce: [
      { blankLine: "always", prev: "method", next: "method" }
    ]
  }],
  '@typescript-eslint/brace-style': ['warn', '1tbs', { 
    allowSingleLine: true 
  }],
  '@typescript-eslint/comma-dangle': [
    'warn',
    {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline', // No trailing commas in function params
    },
  ],
  'comma-style': ['warn', 'last'],
  'no-whitespace-before-property': 'warn',
  'space-infix-ops': ['warn', {
    int32Hint: true
  }],
  'space-before-function-paren': ['warn', {
    named: 'never',
    asyncArrow: 'always',
    anonymous: 'always'
  }],
  'key-spacing': ['warn', {
    singleLine: {
      beforeColon: false,
      afterColon: true
    },
    multiLine: {
      beforeColon: false,
      afterColon: true
    }
  }],
  'comma-spacing': ['warn', {
    before: false,
    after: true
  }],
  '@typescript-eslint/brace-style': 'off',
  '@typescript-eslint/block-spacing': 'off',
  '@typescript-eslint/comma-dangle': 'off',
  '@typescript-eslint/member-delimiter-style': 'off'
}