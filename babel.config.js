module.exports = function (api) {
  const useESModules = api.env(['legacy', 'modern'])

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          bugfixes: true,
          browserslistEnv: process.env.BABEL_ENV || process.env.NODE_ENV,
          modules: useESModules ? false : 'commonjs',
          shippedProposals: api.env('modern')
        }
      ],
      '@babel/preset-flow',
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    plugins: [
      [
        'babel-plugin-replace-imports',
        {
          test: /^@mui-tabs\/utils\/src/,
          replacer: useESModules ? '../../utils/esm' : '../utils'
        }
      ],
      ['@babel/plugin-transform-runtime', { useESModules, version: '^7.4.4' }]
    ]
  }
}
