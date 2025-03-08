import type { TemplateNode } from './types'
import { isElementNode } from './is'
import { Path } from './path'

export function traverse(
  node: TemplateNode,
  callback: (path: Path) => void,
) {
  if (!node.__skip__) {
    const path = new Path(node)
    callback(path)
  }

  if (
    isElementNode(node)
    && node.children
    && node.children.length
  ) {
    node.children.forEach(child => traverse(child, callback))
  }
}
