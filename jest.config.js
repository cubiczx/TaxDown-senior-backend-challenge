module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/src/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', "/src/middleware/"],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', "!<rootDir>/src/middleware/**", '!**/node_modules/**'],
  coverageDirectory: '<rootDir>/coverage',
  testTimeout: 50000,
};
