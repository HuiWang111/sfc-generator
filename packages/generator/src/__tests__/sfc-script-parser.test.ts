import generate from '@babel/generator'
import template from '@babel/template'
import * as t from '@babel/types'
import { parse } from '../sfc-script'

describe('sfc script parser should work', () => {
  it('options update data should work', () => {
    const js = `export default {
  name: 'AInput',
  data () {
    return {
      value: '1'
    }
  },
}`

    const { ast, res } = parse(js)
    if (!res)
      return

    res.data().add('number', t.numericLiteral(1))
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    res.data().update('value', t.booleanLiteral(true));
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    res.data().remove('value');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    res.data().remove('number');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()
  })

  it('options create data should work', () => {
    const js = `export default {
  name: 'AInput',
}`

    const { ast, res } = parse(js)
    if (!res)
      return

    res.data().add('number', t.numericLiteral(1))
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    const value = res.data().get('number')
    expect(value).toMatchSnapshot()

    res.data().remove('number');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()
  })

  it('options update computed should work', () => {
    const js = `export default {
  name: 'AInput',
  data() {
    return {
      firstName: 'Davide',
      lastName: 'Li',
    }
  },
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    },
  },
}`

    const { ast, res } = parse(js)
    if (!res)
      return

    const returnStatement = template.statement('return this.lastName + \' \' + this.firstName')

    res.computed().add(
      t.objectMethod(
        'method',
        t.identifier('reverseName'),
        [],
        t.blockStatement([
          returnStatement(),
        ]),
      ),
    )
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    res.computed().update(
      t.objectMethod(
        'method',
        t.identifier('reverseName'),
        [],
        t.blockStatement([
          template.statement('return this.lastName + this.firstName')(),
        ]),
      ),
    );
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    res.computed().remove('reverseName');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    const value = res.computed().get('fullName')
    expect(value).toMatchSnapshot()
  })
})
