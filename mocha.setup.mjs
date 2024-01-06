import * as chai from 'chai'
import sinon from 'sinon'
import chaiDom from 'chai-dom'
import register from '@babel/register'
import 'jsdom-global/register.js'

chai.use(chaiDom)

global.sinon = sinon
global.expect = chai.expect

register({
  extensions: ['.ts', '.tsx', '.js', '.jsx']
})

global.requestAnimationFrame = (cb) => cb
