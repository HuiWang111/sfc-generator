import type { ParserOptions } from '@babel/parser'
import type { ScriptParseOptions } from '../types'
// import type { CompositionApi } from './composition-api'
import { parse as babelParse } from '@babel/parser'
import traverse from '@babel/traverse'
import { OptionsApi } from './options-api'

export function parse<T = boolean>(
  code: string,
  options: ScriptParseOptions<T> = {},
): {
    // api: T extends true ? CompositionApi : OptionsApi
    api: OptionsApi
    ast: ReturnType<typeof babelParse>
  } {
  const { lang, jsx = false, setup = false } = options

  const plugins: ParserOptions['plugins'] = []
  if (lang === 'ts') {
    plugins.push('typescript')
  }
  if (jsx) {
    plugins.push('jsx')
  }

  const ast = babelParse(code, {
    sourceType: 'module',
    plugins,
  })

  let api: OptionsApi | null = null

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      if (setup)
        return

      const declarationPath = path.get('declaration')
      if (declarationPath.isObjectExpression()) {
        api = new OptionsApi(declarationPath)
      }
    },
  })

  if (!api) {
    throw new Error(`script setup attr is ${setup}, parse code error: ${code}`)
  }

  return {
    api,
    ast,
  }
}
