/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 * https://github.com/facebook/jest/issues/8310
 * 
 */


module.exports = {
  "verbose": true,
  "testTimeout": 20000,
  "roots": [
    "<rootDir>/src/test/",
    "<rootDir>/src/main/"
  ],
  "collectCoverage": true,
  "collectCoverageFrom": ["src/main/**/*.js"],
  "coverageDirectory": "coverage",
  "coverageReporters": [
    "html", "json", "json-summary"
  ],
  "transform": {
    '\\.(js)$':
      '<rootDir>/jest.transformer.js',
  }
}
