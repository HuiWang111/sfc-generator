import generate from '@babel/generator'
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
})
