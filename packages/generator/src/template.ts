import type { ElementNode, GenerateOptions, TemplateNode } from './types'
import { TemplateNodeType } from './types'

export class Template {
  constructor(private options: GenerateOptions = {}) {}

  private padCode(str: string, indentCount: number) {
    const { indentSize = 2 } = this.options
    const spaceCount = indentSize * indentCount
    return str.padStart(str.length + spaceCount)
  }

  private generateAttrCode(
    node: ElementNode,
    indentCount: number,
  ): [string, boolean] {
    const { breakOnAttrs = 2 } = this.options
    const attrEntries = Object.entries(node.attrsMap || {})
    if (!attrEntries.length) {
      return ['', false]
    }

    const shouldBreak = attrEntries.length > breakOnAttrs
    const attrCodes = (
      attrEntries
        .map(([key, value]) => {
          const expression = value === '' || String(value) === 'true'
            ? key.replace(/^:/, '')
            : `${key}="${value}"`

          if (shouldBreak) {
            return this.padCode(expression, indentCount)
          }
          return expression
        })
    )

    if (!shouldBreak) {
      return [attrCodes.join(' '), shouldBreak]
    }
    return [attrCodes.join('\n'), shouldBreak]
  }

  private generateEndTag(
    node: ElementNode,
    indentCount: number,
    shouldBreak: boolean,
  ) {
    if (!node.children || !node.children.length) {
      return this.padCode('/>', indentCount)
    }

    const { autoIndent = true } = this.options
    const childrenCode = (
      node.children
        .map((c) => {
          return this.generate(c, autoIndent ? indentCount + 1 : indentCount)
        })
        .join('')
    )
    return [
      this.padCode('>', shouldBreak ? indentCount : 0),
      childrenCode,
      this.padCode(`</${node.tag}>`, indentCount),
    ].join('\n')
  }

  generate(node: TemplateNode, indentCount = 1): string {
    if (
      node.type === TemplateNodeType.Interpolation
      || node.type === TemplateNodeType.Text
    ) {
      if (node.type === TemplateNodeType.Text && node.text === ' ') {
        return '\n'
      }
      return this.padCode(node.text, indentCount)
    }

    const { autoIndent = true } = this.options
    const [attrCode, shouldBreak] = this.generateAttrCode(node, autoIndent ? indentCount + 1 : indentCount)
    const startTag = this.padCode(`<${node.tag}`, indentCount)
    const endTag = this.generateEndTag(node, indentCount, shouldBreak)

    if (!shouldBreak) {
      return [
        startTag,
        attrCode ? ' ' : '',
        attrCode,
        endTag,
      ]
        .join('')
    }
    return [startTag, attrCode, endTag].join('\n')
  }
}
