import type { GeneratorOptions } from '@babel/generator'
import type { SFCBlock } from '@vue/compiler-sfc'
import type { BabelNode, GenerateOptions, ScriptAttrs, SFCGenerateOptions, TemplateNode, TextNode } from './types'
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

export function generateStyle(styles: SFCBlock[]) {
  const template = new Template({
    autoIndent: false,
  })

  return styles.map((style) => {
    const attrsMap: Record<string, any> = {}
    if (style.lang) {
      attrsMap.lang = style.lang
    }
    if (style.scoped) {
      attrsMap.scoped = style.scoped
    }
    const styleContentNode: TextNode = {
      type: TemplateNodeType.Text,
      text: style.content.trim(),
    }

    return template.generate(
      {
        type: TemplateNodeType.Element,
        tag: 'style',
        attrsMap,
        children: [styleContentNode],
      },
      0,
    )
  }).join('\n\n')
}

export function generateComponent(opts: SFCGenerateOptions) {
  const list: string[] = []

  list.push(generateTemplate(opts.template.node, opts.template.options))

  if (opts.script) {
    list.push(generateScript(opts.script.node, opts.script.attrs, opts.script.options))
  }
  if (opts.styles) {
    list.push(generateStyle(opts.styles))
  }

  return list.join('\n\n')
}
