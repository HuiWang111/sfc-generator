import type { Expression, ObjectMethod, PatternLike, ReturnStatement } from '@babel/types'
import type { OptionOperator } from '../../../types'
import type { OptionsApi } from '../options-api'
import * as t from '@babel/types'

export class DataOption implements OptionOperator<OptionsApi> {
  constructor(
    private _node: ObjectMethod,
    private _parent: OptionsApi,
  ) {}

  node() {
    return this._node
  }

  get returnNode() {
    return this._node.body.body.find((i): i is ReturnStatement => {
      return t.isReturnStatement(i)
    })
  }

  add(name: string, value: Expression | PatternLike): this {
    const returnNode = this.returnNode
    if (!returnNode || !t.isObjectExpression(returnNode.argument))
      return this

    const objectProperty = t.objectProperty(t.identifier(name), value)
    returnNode.argument.properties.push(objectProperty)
    return this
  }

  remove(name: string) {
    const returnNode = this.returnNode
    if (!returnNode || !t.isObjectExpression(returnNode.argument))
      return this
    returnNode.argument.properties = returnNode.argument.properties.filter((i) => {
      return t.isObjectProperty(i) && t.isIdentifier(i.key) && i.key.name !== name
    })
    return this
  }

  update(name: string, value: Expression | PatternLike): this {
    const returnNode = this.returnNode
    if (!returnNode || !t.isObjectExpression(returnNode.argument))
      return this

    for (const prop of returnNode.argument.properties) {
      if (t.isObjectProperty(prop) && t.isIdentifier(prop.key) && prop.key.name === name) {
        prop.value = value
        break
      }
    }
    return this
  }

  get(name: string) {
    const returnNode = this.returnNode
    if (!returnNode || !t.isObjectExpression(returnNode.argument))
      return null

    for (const prop of returnNode.argument.properties) {
      if (t.isObjectProperty(prop) && t.isIdentifier(prop.key) && prop.key.name === name) {
        return prop.value
      }
    }
    return null
  }

  parent() {
    return this._parent
  }
}
