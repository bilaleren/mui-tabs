module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-flow',
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@utils': './src/utils',
          '@assets': './src/assets',
          'test-utils': './utils/test-utils.ts'
        }
      }
    ],
    '@babel/plugin-transform-runtime'
  ]
}
