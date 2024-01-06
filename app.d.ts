export {}

declare global {
  import { SinonStatic } from 'sinon'
  import { expect as chaiExpect } from 'chai'

  export let sinon: SinonStatic
  export let expect: typeof chaiExpect

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'test' | 'development' | 'production' | string
      [key: string]: string | undefined
    }
  }
}
