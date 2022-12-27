import { Plugin } from 'rollup'
import { Processor } from 'postcss'
import { Options as OptionsInternal, Pattern } from 'fast-glob'

export interface CssPluginOptions {
  input: Pattern | Pattern[]
  outputDir: string
  postcss: () => Processor
  onEnd?: (cssRecord: Record<string, string>) => any
  globOptions?: OptionsInternal
}

type CssPlugin = (options: CssPluginOptions) => Plugin

export default CssPlugin
