import generate from '@babel/generator'
import template from '@babel/template'
import * as t from '@babel/types'
import { parse } from '../sfc-script'

describe('sfc setup script parser should work', () => {
  it('ref crud should work', () => {
    const js = 'const checked = ref(\'\')'

    const { ast, api } = parse<true>(js, { setup: true })
    if (!api)
      return

    api.data().add(
      'value',
      t.stringLiteral('')
    )
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    api.data().update('checked', t.booleanLiteral(false));
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    api.data().remove('checked');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    const valueNode = api.data().get('value')
    expect(valueNode).toMatchSnapshot()
  })

  it('computed crud should work', () => {
    const js = `const firstName = ref('Davide');
const lastName = ref('Li')
const fullName = computed(() => firstName.value + lastName.value)`

    const { ast, api } = parse<true>(js, { setup: true })
    if (!api)
      return

    api.computed().add(
      'reverseName',
      template.expression('() => lastName.value + \' \' + firstName.value')()
    )
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    api.computed().update(
      'fullName',
      template.expression('() => firstName.value + \' \' + lastName.value')()
    );
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    api.computed().remove('fullName');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    const valueNode = api.computed().get('reverseName')
    expect(valueNode).toMatchSnapshot()
  })
})
