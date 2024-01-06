module.exports = {
  spec: ['src/**/__tests__/*.test.{ts,tsx}'],
  extensions: ['.ts', '.tsx'],
  require: [require.resolve('./mocha.setup.mjs')]
}
