import type { TemplateNode } from '../types'
import { parse } from '@babel/parser'
import { compileTemplate, parseComponent } from '@vue/compiler-sfc'
import { generateComponent } from '../generates'

describe('test generateComponent', () => {
  const template = `<template>
  <div>
    <n-btn
      style="margin-bottom: 10px;"
      @click="toggleLocale"
    >
      {{ localeCode.includes('zh') ? '切换语言' : 'toggle language' }}
    </n-btn>
    <n-config-provider
      :locale="locale"
    >
      <n-empty />
    </n-config-provider>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { en, zhCN } from '../../locale'

const localeCode = ref('zh-cn')
const locale = computed(() => localeCode.value.includes('zh') ? zhCN : en)

const toggleLocale = () => {
  localeCode.value = localeCode.value.includes('zh')
    ? 'en'
    : 'zh'
}

onMounted(() => {
  localeCode.value = window.navigator.language
})
</script>`

  it('generateComponent should work', () => {
    const sfcDescriptor = parseComponent(template)
    const script = sfcDescriptor.script || sfcDescriptor.scriptSetup
    if (!script)
      return

    const ast = parse(script.content, {
      sourceType: 'module',
    })
    const code = generateComponent({
      template: {
        node: compileTemplate({
          source: sfcDescriptor.template!.content,
          filename: '',
        }).ast as TemplateNode,
      },
      script: {
        node: ast,
        attrs: {
          setup: script.setup as boolean,
        },
      },
      styles: sfcDescriptor.styles,
    })

    expect(code).toMatchSnapshot()
  })
})
