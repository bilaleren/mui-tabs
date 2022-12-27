const path = require('path')
const chai = require('chai')
const chaiDom = require('chai-dom')
const testingLibrary = require('@testing-library/dom')

const transpileOnly = !process.env.TS_TYPE_CHECK

require('ts-node').register({
  project: path.join(__dirname, 'tsconfig.test.json'),
  transpileOnly
})

chai.use(chaiDom)

testingLibrary.configure({
  computedStyleSupportsPseudoElements: false
})

require('jsdom-global/register')

global.requestAnimationFrame = (cb) => cb
