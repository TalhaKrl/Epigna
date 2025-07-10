module.exports = {
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-allure',
      {
        outputDirectory: 'allure-results',
      },
    ],
  ],
  testMatch: ['**/tests/api/**/*.test.js'],
};
