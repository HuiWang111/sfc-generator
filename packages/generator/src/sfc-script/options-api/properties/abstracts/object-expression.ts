import type { ObjectExpression, ObjectMethod, ObjectProperty } from '@babel/types'
import type { OptionOperator } from '../../../../types'
import type { OptionsApi } from '../../options-api'
import * as t from '@babel/types'
import { BaseOption } from './base'

export abstract class ObjectExpressionOption extends BaseOption<ObjectProperty> implements OptionOperator {
  constructor(
    node: ObjectProperty,
    parent: OptionsApi,
  ) {
    super(node, parent)
  }

  private get properties() {
    const value = this._node.value as ObjectExpression
    return value.properties
  }

  add(prop: ObjectProperty | ObjectMethod) {
    this.properties.push(prop)
    return this
  }

  remove(name: string) {
    (this._node.value as ObjectExpression).properties = this.properties.filter((prop) => {
      if (t.isSpreadElement(prop))
        return true
      return t.isIdentifier(prop.key) && prop.key.name !== name
    })
    return this
  }

  update(prop: ObjectProperty | ObjectMethod) {
    (this._node.value as ObjectExpression).properties = this.properties.map((p) => {
      if (t.isSpreadElement(p))
        return p
      if (
        t.isIdentifier(p.key)
        && t.isIdentifier(prop.key)
        && p.key.name === prop.key.name
      ) {
        return prop
      }
      return p
    })
  }

  get(name: string) {
    return this.properties.find((prop) => {
      if (t.isSpreadElement(prop))
        return false
      return t.isIdentifier(prop.key) && prop.key.name === name
    })
  }
}
