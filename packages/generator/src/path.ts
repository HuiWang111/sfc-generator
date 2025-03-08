import type { ElementNode, TemplateNode } from './types'
import { isElementNode } from './is'

export class Path {
  constructor(private _node: TemplateNode) {}

  get parent() {
    return this._node.parent
  }

  get node() {
    return this._node
  }

  private _find(
    node: TemplateNode,
    predicate: (node: TemplateNode) => boolean,
  ): TemplateNode | null {
    if (isElementNode(node) && node.children) {
      for (const child of node.children) {
        if (predicate(child)) {
          return child
        }
        else if (isElementNode(child)) {
          const result = this._find(child, predicate)
          if (result) {
            return result
          }
        }
      }
    }
    return null
  }

  replaceWith(node: TemplateNode) {
    const parent = this._node.parent as ElementNode | undefined
    if (parent && parent.children) {
      const index = parent.children.indexOf(this._node)
      if (index > -1) {
        parent.children[index] = node
      }
    }
    node.parent = parent
    this._node = node
  }

  remove() {
    const parent = this._node.parent as ElementNode | undefined
    if (parent && parent.children) {
      const index = parent.children.indexOf(this._node)
      if (index > -1) {
        parent.children.splice(index, 1)
      }
    }
  }

  skip() {
    if (isElementNode(this._node) && this._node.children) {
      this._node.children.forEach((child) => {
        child.__skip__ = true
      })
    }
  }

  getSibling(index: number) {
    const parent = this._node.parent as ElementNode | undefined
    if (parent && parent.children) {
      return parent.children[index]
    }
    return null
  }

  find(predicate: (node: TemplateNode) => boolean) {
    return this._find(this._node, predicate)
  }
}
