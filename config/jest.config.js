const path = require('path');

// Jest configuration for running tests in the AI-powered salesperson chat system
module.exports = {
  // Set the root directory for Jest to the parent directory of this config file
  rootDir: path.resolve(__dirname, '..'),

  // Use Node.js as the test environment
  testEnvironment: 'node',

  // Specify the test file patterns to match
  testMatch: ['<rootDir>/tests/**/*.test.(ts|tsx|js)'],

  // Define the file extensions Jest should consider
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Set up module name mapping for easier imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Configure the transform for TypeScript files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },

  // Specify setup files to run after the test environment is set up
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // Define which files to collect coverage information from
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts'
  ],

  // Set the directory for the coverage reports
  coverageDirectory: '<rootDir>/coverage',

  // Specify the coverage report formats
  coverageReporters: ['json', 'lcov', 'text', 'clover'],

  // Configure global settings for ts-jest
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json'
    }
  },

  // Specify patterns to ignore when running tests
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Enable verbose output for test results
  verbose: true,

  // Set the timeout for individual tests (in milliseconds)
  testTimeout: 30000
};