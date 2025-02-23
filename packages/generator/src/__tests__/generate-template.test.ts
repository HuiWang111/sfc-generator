import type { TemplateNode } from '../types'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { compileTemplate, parseComponent } from '@vue/compiler-sfc'
import { Template } from '../template'

describe('test generate template', () => {
  const template = new Template()

  it('test generate simple node', () => {
    const res = compileTemplate({
      source: '<div>test</div>',
      filename: '',
    })

    const code = template.generate(res.ast as TemplateNode)
    expect(code).toMatchSnapshot()
  })

  it('test generate simple node with attrs', () => {
    const res = compileTemplate({
      source: '<div class="test" v-if="visible">test</div>',
      filename: '',
    })

    const code = template.generate(res.ast as TemplateNode)
    expect(code).toMatchSnapshot()
  })

  it('test generate simple node with interpolation expression', () => {
    const res = compileTemplate({
      source: '<div>{{ test }}</div>',
      filename: '',
    })

    const code = template.generate(res.ast as TemplateNode)
    expect(code).toMatchSnapshot()
  })

  it('test generate component node', () => {
    const res = compileTemplate({
      source: '<Test>test</Test>',
      filename: '',
    })

    const code = template.generate(res.ast as TemplateNode)
    expect(code).toMatchSnapshot()

    const res1 = compileTemplate({
      source: '<form-create>test</form-create>',
      filename: '',
    })

    const code1 = template.generate(res1.ast as TemplateNode)
    expect(code1).toMatchSnapshot()
  })

  it('test generate form component', async () => {
    const sfc = await readFile(join(__dirname, 'components/form.vue'), 'utf-8')
    const sfcDescriptor = parseComponent(sfc)

    if (sfcDescriptor.template) {
      const res = compileTemplate({
        source: sfcDescriptor.template.content,
        filename: '',
      })

      const code = template.generate(res.ast as TemplateNode)
      expect(code).toMatchSnapshot()
    }
  })
})
