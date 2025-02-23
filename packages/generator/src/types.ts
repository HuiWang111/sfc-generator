import type generate from '@babel/generator'

export enum TemplateNodeType {
  Element = 1,
  Interpolation = 2, // 插值表达式
  Text = 3,
}

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
}

export interface InterpolationNode {
  type: TemplateNodeType.Interpolation
  tokens: object[]
  expression: string
  text: string
}

export interface TextNode {
  type: TemplateNodeType.Text
  text: string
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
