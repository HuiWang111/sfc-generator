import type { GeneratorOptions } from '@babel/generator'
import type { SFCBlock } from '@vue/compiler-sfc'
import type {
  BabelNode,
  GenerateOptions,
  ScriptAttrs,
  SFCGenerateOptions,
  TemplateNode,
  TextNode,
} from './types'
import generate from '@babel/generator'
import { TemplateNodeType } from './constants'
import { Template } from './template'

/**
 * 用于生成 template 代码的函数
 * @param node template 代码的 ast
 * @param options 生成配置
 * @returns template 代码
 */
export function generateTemplate(node: TemplateNode, options: GenerateOptions = {}) {
  const template = new Template(options)
  const content = template.generate(node)
  return ['<template>', content, '</template>'].join('\n')
}

/**
 * 用于生成 script 代码的函数
 * @param node babel 的 ast node
 * @param attrs script 标签的属性
 * @param opts 生成配置
 * @returns script 代码
 */
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
  const attrsMap = Object.entries(attrs).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value != null) {
      acc[key] = value
    }
    return acc
  }, {})

  return template.generate(
    {
      type: TemplateNodeType.Element,
      tag: 'script',
      attrsMap,
      children: [scriptContentNode],
    },
    0,
  )
}

/**
 * 用于生成 style 代码的函数
 * @param styles 生成 style 的 SFCBlock
 * @returns style 的代码
 */
export function generateStyle(styles: SFCBlock[]) {
  if (!styles.length)
    return ''

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

/**
 * 用于生成单文件组件代码的函数
 * @param opts 生成配置
 * @returns 单文件组件的代码
 */
export function generateComponent(opts: SFCGenerateOptions) {
  const list: string[] = []

  list.push(generateTemplate(opts.template.node, opts.template.options))

  if (opts.script) {
    list.push(generateScript(opts.script.node, opts.script.attrs, opts.script.options))
  }
  if (opts.styles && opts.styles.length) {
    list.push(generateStyle(opts.styles))
  }

  return list.join('\n\n')
}
