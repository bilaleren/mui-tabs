module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.', '../..', '../../src'],
        extensions: ['.ts', '.tsx', '.png'],
        alias: {
          react: './node_modules/react',
          'react-native': './node_modules/react-native',
          '@utils': '../../src/utils',
          '@assets': '../../src/assets',
          'mui-tabs/native': '../../src/native'
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]
};
