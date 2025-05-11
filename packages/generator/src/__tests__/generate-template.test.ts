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

  it('test generate with scopedSlots', async () => {
    const source = `<n-selector style="width: 30px;">
  <span>children</span>
  <template #trigger="{ toggle }">
    <div id="portrait-more" style="cursor: pointer;width: 30px;height: 30px;" @click="toggle" v-html="moreIcon" />
  </template>
  <template #panel>
    <n-selector-item>
      <help label="帮助" :icon-size="26" :config-list="configList">
        <template #title>
          <div>自定义 title</div>
        </template>
      </help>
    </n-selector-item>
  </template>
</n-selector>`
    const res = compileTemplate({
      source,
      filename: '',
    })

    const code = template.generate(res.ast as TemplateNode)
    expect(code).toMatchSnapshot()
  })
})
