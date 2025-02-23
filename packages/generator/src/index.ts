import type { GeneratorOptions } from '@babel/generator'
import type { BabelNode, GenerateOptions, ScriptAttrs, TemplateNode, TextNode } from './types'
import generate from '@babel/generator'
import { Template } from './template'
import { TemplateNodeType } from './types'

export function generateTemplate(node: TemplateNode, options: GenerateOptions = {}) {
  const template = new Template(options)
  const content = template.generate(node)
  return ['<template>', content, '</template>'].join('\n')
}

export function generateScript(
  node: BabelNode,
  attrs: ScriptAttrs = {},
  opts: GeneratorOptions = {},
) {
  const { code } = generate(node, opts)
  const template = new Template({
    autoIndent: false,
  })
  const scriptContentNode: TextNode = {
    type: TemplateNodeType.Text,
    text: code,
  }
  return template.generate(
    {
      type: TemplateNodeType.Element,
      tag: 'script',
      attrsMap: attrs as Record<string, string>,
      children: [scriptContentNode],
    },
    0,
  )
}
