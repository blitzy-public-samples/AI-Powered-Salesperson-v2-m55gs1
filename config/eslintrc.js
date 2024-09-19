module.exports = {
  // Set this configuration as the root to prevent ESLint from searching for other config files
  root: true,

  // Define the environments where the code will run
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },

  // Extend recommended ESLint configurations and plugins
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],

  // Use TypeScript parser for ESLint
  parser: '@typescript-eslint/parser',

  // Set parser options
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },

  // Include necessary plugins
  plugins: ['react', '@typescript-eslint', 'prettier'],

  // Define custom rules
  rules: {
    // Disable the rule requiring React to be in scope (not needed in Next.js)
    'react/react-in-jsx-scope': 'off',
    // Disable explicit return type requirement for TypeScript
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Warn on console.log, but allow console.warn and console.error
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Enforce Prettier formatting
    'prettier/prettier': 'error',
  },

  // Configure React settings
  settings: {
    react: {
      version: 'detect',
    },
  },

  // Override rules for TypeScript files
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
      },
    },
  ],
};