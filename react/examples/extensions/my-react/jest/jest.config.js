// Override the Jest config to ignore transpiling from specific folders
// See the base Jest config: https://bit.dev/teambit/react/react/~code/jest/jest.config.js

const reactJestConfig = require('@teambit/react/jest/jest.config');
const {
  generateNodeModulesPattern,
} = require('@teambit/dependencies.modules.packages-excluder');
const packagesToExclude = ['prop-types', '@teambit'];

module.exports = {
  ...reactJestConfig,
  transformIgnorePatterns: [
    ...reactJestConfig.transformIgnorePatterns,
    `/${generateNodeModulesPattern({ packages: packagesToExclude })}`,
  ],
};
