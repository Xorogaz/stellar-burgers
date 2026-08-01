module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/*.test.ts?(x)'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
    '^.+\\.css$': 'jest-css-modules-transform'
  },
  moduleNameMapper: {
    '^@pages$': '<rootDir>/src/pages',
    '^@components$': '<rootDir>/src/components',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@api$': '<rootDir>/src/utils/burger-api',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@selectors$': '<rootDir>/src/services/selectors'
  },
  collectCoverageFrom: [
    'src/services/**/*.{ts,tsx}',
    '!src/services/**/__tests__/**'
  ],
  coverageDirectory: '<rootDir>/coverage'
};
