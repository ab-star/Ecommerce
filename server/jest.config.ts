import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Use ts-jest preset
  testEnvironment: 'node', // Set the environment for Node.js
  rootDir: './', // Root directory of your project
  moduleDirectories: ['node_modules', 'src'], // Ensure proper module resolution
  moduleFileExtensions: ['ts', 'js', 'json'], // Extensions to process
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
  testMatch: [
    '**/tests/**/*.test.ts', // Match test files in the tests folder
    '**/__tests__/**/*.ts', // Or use __tests__ for naming convention
  ],
  coverageDirectory: 'coverage', // Store coverage reports
  collectCoverage: true, // Collect coverage during tests
  coverageThreshold: {
    global: {
      lines: 80, // Ensure at least 80% test coverage for your project
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
  setupFiles: ['dotenv/config'], // Optional, if you're using environment variables
  globals: {
    'ts-jest': {
      isolatedModules: true, // Optimize TypeScript compilation for Jest
    },
  },
};

export default config;
