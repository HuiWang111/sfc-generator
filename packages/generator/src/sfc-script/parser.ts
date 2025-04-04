import type { ParserOptions } from '@babel/parser'
import type { ScriptParseOptions } from '../types'
import { parse as babelParse } from '@babel/parser'
import traverse from '@babel/traverse'
import { ObjectExpressionOptionsChain } from './options-chain'

export function parse(code: string, options: ScriptParseOptions = {}) {
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

  let res: ObjectExpressionOptionsChain | null = null

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      if (setup)
        return

      const declarationPath = path.get('declaration')
      if (declarationPath.isObjectExpression()) {
        res = new ObjectExpressionOptionsChain(declarationPath)
      }
    },
  })

  if (!res) {
    throw new Error(`script setup is ${setup}, parse code error`)
  }

  return {
    res: res as ObjectExpressionOptionsChain | null,
    ast,
  }
}
