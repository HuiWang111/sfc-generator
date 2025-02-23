import { parse } from '@babel/parser'
import { generateScript } from '../index'

describe('test generateScript', () => {
  it('generateScript should work', () => {
    const code = `import { ref } from 'vue'

const visible = ref(false)
function setVisible (v) {
  visible.value = v
}`

    const ast = parse(code, {
      sourceType: 'module',
    })
    const res = generateScript(ast)
    expect(res).toMatchSnapshot()
  })

  it('generateScript should work with script attrs', () => {
    const code = `import { ref } from 'vue'

const visible = ref(false)
function setVisible (v) {
  visible.value = v
}`

    const ast = parse(code, {
      sourceType: 'module',
    })
    const res = generateScript(ast, { lang: 'ts', setup: true })
    expect(res).toMatchSnapshot()
  })
})
