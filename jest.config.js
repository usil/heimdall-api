/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 * https://github.com/facebook/jest/issues/8310
 * 
 * 
  "transform": {
    '\\.(js)$':
      '<rootDir>/transformer.js',
  },
 * 
 */

var path = require('path');
var Module = require('module');
var originalRequire = Module.prototype.require;

Module.prototype.require = function() {
    if (arguments['0'].startsWith("$/")) {
        var fullPath = path.join(process.env.npm_config_local_prefix, arguments['0'].substring(2));
        arguments['0'] = fullPath;
    }
    return originalRequire.apply(this, arguments);
}

module.exports = {
  "verbose": true,
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
