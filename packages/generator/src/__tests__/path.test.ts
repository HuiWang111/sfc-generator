import type { ElementNode, TemplateNode } from '../types'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { compileTemplate, parseComponent } from '@vue/compiler-sfc'
import { generateTemplate } from '../generates'
import { isElementNode } from '../is'
import { Path } from '../path'

describe('test path', () => {
  const sfc = readFileSync(join(__dirname, 'components/form.vue'), 'utf-8')
  const sfcDescriptor = parseComponent(sfc)
  if (sfcDescriptor.template) {
    const res: any = compileTemplate({
      source: sfcDescriptor.template.content,
      filename: '',
    })
    const path = new Path(res.ast!.children![0] as TemplateNode)
    const path1 = new Path(res.ast!.children![0].children[0] as TemplateNode)

    it('find should work', () => {
      const node = path.find(node => isElementNode(node) && node.tag === 'a-button')
      expect(node).not.toBeNull()
      expect(isElementNode(node!)).toBe(true)
      expect((node as ElementNode).attrsMap).toEqual({
        '@click': 'handleSubmit',
        'type': 'primary',
        'class': 'submit-btn',
      })
    })

    it('getSibling should work', () => {
      const node = path1.getSibling(2)
      expect((node as ElementNode).attrsMap!.class).toBe('form-item')
    })

    it('replaceWith should work', () => {
      const template = `<div>new node</div>`
      const newNode = compileTemplate({
        source: template,
        filename: '',
      }).ast as TemplateNode
      path.replaceWith(newNode)
      expect(path.node).toEqual(newNode)
      expect(generateTemplate(path.node.parent!)).toMatchSnapshot()
    })

    it('remove should work', () => {
      const parent = path.parent
      path.remove()
      expect(generateTemplate(parent!)).toMatchSnapshot()
    })
  }
})
