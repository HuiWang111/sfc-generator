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

    const { ast, api } = parse(js)
    if (!api)
      return

    api.data().add('number', t.numericLiteral(1))
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    api.data().update('value', t.booleanLiteral(true));
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    api.data().remove('value');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    api.data().remove('number');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()
  })

  it('options create data should work', () => {
    const js = `export default {
  name: 'AInput',
}`

    const { ast, api } = parse(js)
    if (!api)
      return

    api.data().add('number', t.numericLiteral(1))
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    const value = api.data().get('number')
    expect(value).toMatchSnapshot()

    api.data().remove('number');
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

    const { ast, api } = parse(js)
    if (!api)
      return

    const returnStatement = template.statement('return this.lastName + \' \' + this.firstName')

    api.computed().add(
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

    api.computed().update(
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

    api.computed().remove('reverseName');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    const value = api.computed().get('fullName')
    expect(value).toMatchSnapshot()
  })

  it('options create computed should work', () => {
    const js = `export default {
  name: 'AInput',
}`

    const { ast, api } = parse(js)
    if (!api)
      return

    api.computed().add(
      t.objectMethod(
        'method',
        t.identifier('name'),
        [],
        t.blockStatement([
          template.statement('return this._name')(),
        ]),
      ),
    )
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('options update watch should work', () => {
    const js = `export default {
  name: 'AInput',
  data() {
    return {
      firstName: 'Davide',
      lastName: 'Li',
      fullName: '',
    }
  },
  watch: {
    firstName(val) {
      this.fullName = val + this.lastName
    }
  },
}`

    const { ast, api } = parse(js)
    if (!api)
      return

    api.watch().add(
      t.objectMethod(
        'method',
        t.identifier('lastName'),
        [t.identifier('val')],
        t.blockStatement([
          template.statement('this.fullName =  this.firstName + \' \' + val;')(),
        ]),
      ),
    )
    let { code } = generate(ast)
    expect(code).toMatchSnapshot()

    api.watch().update(
      t.objectMethod(
        'method',
        t.identifier('firstName'),
        [t.identifier('val')],
        t.blockStatement([
          template.statement('this.fullName = val + \' \' + this.lastName')(),
        ]),
      ),
    );
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    api.watch().remove('firstName');
    ({ code } = generate(ast))
    expect(code).toMatchSnapshot()

    const value = api.watch().get('lastName')
    expect(value).toMatchSnapshot()
  })

  it('options create watch should work', () => {
    const js = `export default {
  name: 'AInput',
}`

    const { ast, api } = parse(js)
    if (!api)
      return

    api.watch().add(
      t.objectMethod(
        'method',
        t.identifier('firstName'),
        [t.identifier('val')],
        t.blockStatement([
          template.statement('this.fullName = val + \' \' + this.lastName')(),
        ]),
      ),
    )
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })
})
