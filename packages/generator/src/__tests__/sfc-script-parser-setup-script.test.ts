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
      t.stringLiteral(''),
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
      template.expression('() => lastName.value + \' \' + firstName.value')(),
    )
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    api.computed().update(
      'fullName',
      template.expression('() => firstName.value + \' \' + lastName.value')(),
    );
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    api.computed().remove('fullName');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    const valueNode = api.computed().get('reverseName')
    expect(valueNode).toMatchSnapshot()
  })

  it('update defineProps callExpression should work', () => {
    const js = `defineProps({
      value: {
        type: String,
        default: '',
      },
    })`

    const { ast, api } = parse<true>(js, { setup: true })
    if (!api)
      return

    api.props().add(
      t.objectProperty(
        t.identifier('checked'),
        t.identifier('Boolean'),
      ),
    )
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    api.props().update(
      t.objectProperty(
        t.identifier('value'),
        t.identifier('String'),
      ),
    );
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    api.props().remove('value');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    const valueNode = api.props().get('checked')
    expect(valueNode).toMatchSnapshot()
  })

  it('update defineProps variableDeclaration should work', () => {
    const js = `const props = defineProps({
      value: {
        type: String,
        default: '',
      },
    })`

    const { ast, api } = parse<true>(js, { setup: true })
    if (!api)
      return

    api.props().add(
      t.objectProperty(
        t.identifier('checked'),
        t.identifier('Boolean'),
      ),
    )
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    api.props().update(
      t.objectProperty(
        t.identifier('value'),
        t.identifier('String'),
      ),
    );
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    api.props().remove('value');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    const valueNode = api.props().get('checked')
    expect(valueNode).toMatchSnapshot()
  })

  it('create defineProps should work', () => {
    const js = `const str = ref('')`
    const { ast, api } = parse<true>(js, { setup: true })
    if (!api)
      return

    api.props().add(
      t.objectProperty(
        t.identifier('checked'),
        t.identifier('Boolean'),
      ),
    )
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('methods crud should work', () => {
    const js = `const inputValue = ref('')
    const checked = ref(false)

    function handleInput(val) {
      inputValue.value = val
    }`

    const { ast, api } = parse<true>(js, { setup: true })
    if (!api)
      return

    api.methods().add(
      template.statement(`function handleChange(val){
        checked.value = val
      }`)() as t.FunctionDeclaration,
    )
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    api.methods().update(
      template.statement(`function handleInput(value) {
        inputValue.value = value
      }`)() as t.FunctionDeclaration,
    );
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    api.methods().remove('handleInput');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    const valueNode = api.methods().get('handleChange')
    expect(valueNode).toMatchSnapshot()
  })

  it('watch crud should work', () => {
    const js = `const x = ref(0)`

    const { ast, api } = parse<true>(js, { setup: true })
    if (!api)
      return

    api.watch().add(
      template.statement('watch(x, (newX) => {\nconsole.log(`x is ${newX}`)\n})')() as t.ExpressionStatement
    )
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })
})
