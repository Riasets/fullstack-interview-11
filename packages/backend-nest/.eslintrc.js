module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    '@typescript-eslint/no-unused-vars': ['warn', { vars: 'all', args: 'none' }],

    'semi': ['warn', 'always'],
    'no-console': ['warn'],
    'comma-dangle': ['warn', 'always-multiline'],
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    'strict': ['warn', 'global'],
    'space-before-function-paren': ['warn', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],
    'object-curly-spacing': ['warn', 'always'],
    'key-spacing': ['warn', { beforeColon: false, afterColon: true }],
    'quotes': ['warn', 'single', { allowTemplateLiterals: true }],
    'keyword-spacing': 'warn',
    'curly': ['warn', 'all'],
    'no-multi-spaces': ['warn', { ignoreEOLComments: true }],
    'indent': ['warn', 2, { SwitchCase: 1, ignoredNodes: ["PropertyDefinition"] }],
    'function-paren-newline': ['warn', 'multiline'],
    'arrow-parens': ['warn', 'always'],
  },
};
