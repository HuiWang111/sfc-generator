import type { Expression, ObjectMethod, PatternLike, ReturnStatement } from '@babel/types'
import type { OptionsApi } from '..'
import type { OptionOperator } from '../../../types'
import * as t from '@babel/types'
import { BaseOption } from './abstracts/base'

export class DataOption extends BaseOption<ObjectMethod> implements OptionOperator {
  constructor(
    node: ObjectMethod,
    parent: OptionsApi,
  ) {
    super(node, parent)
  }

  private get returnNode() {
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
}
