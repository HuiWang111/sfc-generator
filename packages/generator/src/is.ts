import type { ElementNode, InterpolationNode, TemplateNode, TextNode } from './types'
import { TemplateNodeType } from './constants'

export function isTextNode(node: TemplateNode): node is TextNode {
  return node.type === TemplateNodeType.Text
}

export function isElementNode(node: TemplateNode): node is ElementNode {
  return node.type === TemplateNodeType.Element
}

export function isInterpolationNode(node: TemplateNode): node is InterpolationNode {
  return node.type === TemplateNodeType.Interpolation
}
