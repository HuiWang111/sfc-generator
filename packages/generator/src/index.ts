import type { GenerateOptions, TemplateNode } from './types'
import { Template } from './template'

export function generateTemplate(node: TemplateNode, options: GenerateOptions = {}) {
  const template = new Template(options)
  const content = template.generate(node)
  return ['<template>', content, '</template>'].join('\n')
}
