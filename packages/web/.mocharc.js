module.exports = {
  extensions: ['.ts', '.tsx'],
  spec: ['src/**/*.test.{ts,tsx}'],
  require: [require.resolve('./setupTests')]
}
