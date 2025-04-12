import type generate from '@babel/generator'
import type { GeneratorOptions } from '@babel/generator'
import type { SFCBlock } from '@vue/compiler-sfc'
import type { TemplateNodeType } from './constants'

export interface TemplateNodeAttr {
  name: string
  value: string
  dynamic?: boolean | undefined
}

export interface TemplateNodeDirective {
  name: string
  rawName: string
  value: string
  arg: null
  isDynamicArg: false
  modifiers: null
}

export interface TemplateNodeModel {
  value: string
  expression: string // eg: '"value"'
  callback: string
}

export type TemplateNode =
  | ElementNode
  | InterpolationNode
  | TextNode

export interface ElementNode {
  type: TemplateNodeType.Element
  tag: string
  attrs?: TemplateNodeAttr[]
  attrsList?: Omit<TemplateNodeAttr, 'dynamic'>[]
  attrsMap?: Record<string, string> // 包含 events / class
  rawAttrsMap?: Record<string, string>
  parent?: TemplateNode | undefined
  children: TemplateNode[]
  plain?: boolean
  static?: boolean
  staticRoot?: boolean
  events?: Record<string, {
    value: string
    dynamic: boolean
  }>
  staticClass?: string // eg: '"submit-container"'
  hasBindings?: boolean
  forProcessed?: boolean
  alias?: string // v-for 定义的变量，eg: v-for="data in list" 中的 data
  for?: string // 被循环的变量，eg: v-for="data in list" 中的 list
  directives?: TemplateNodeDirective[]
  model?: TemplateNodeModel
  __skip__?: boolean
}

export interface InterpolationNode {
  type: TemplateNodeType.Interpolation
  tokens: object[]
  expression: string
  text: string
  parent?: TemplateNode | undefined
  __skip__?: boolean
}

export interface TextNode {
  type: TemplateNodeType.Text
  text: string
  parent?: TemplateNode | undefined
  __skip__?: boolean
}

export interface GenerateOptions {
  breakOnAttrs?: number
  indentSize?: number
  autoIndent?: boolean
}

export type BabelNode = Parameters<typeof generate>[0]

export interface ScriptAttrs {
  setup?: boolean
  lang?: string
}

export interface SFCGenerateOptions {
  template: {
    node: TemplateNode
    options?: GenerateOptions
  }
  script?: {
    node: BabelNode
    attrs?: ScriptAttrs
    options?: GeneratorOptions
  }
  styles?: SFCBlock[]
}

export interface ScriptParseOptions<T = boolean> {
  setup?: T
  lang?: 'ts' | 'js'
  jsx?: boolean
}

export interface OptionOperator {
  add: (...args: any[]) => any
  update: (...args: any[]) => any
  remove: (name: string) => any
  get: (name: string) => any
}
