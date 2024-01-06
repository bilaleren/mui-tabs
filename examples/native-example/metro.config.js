const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        inlineRequires: true,
        experimentalImportSupport: false
      }
    })
  },
  watchFolders: [
    path.resolve(__dirname, '../../src'),
    path.resolve(__dirname, '../../node_modules')
  ],
  projectRoot: path.resolve(__dirname)
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
