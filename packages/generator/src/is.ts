import { TemplateNodeType } from "./constants"
import { ElementNode, InterpolationNode, TemplateNode, TextNode } from "./types"

export function isTextNode(node: TemplateNode): node is TextNode {
  return node.type === TemplateNodeType.Text
}

export function isElementNode(node: TemplateNode): node is ElementNode {
  return node.type === TemplateNodeType.Element
}

export function isInterpolationNode(node: TemplateNode): node is InterpolationNode {
  return node.type === TemplateNodeType.Interpolation
}
