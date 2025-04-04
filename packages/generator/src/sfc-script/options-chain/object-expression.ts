import type { NodePath } from '@babel/traverse'
import type { ObjectExpression, ObjectMethod } from '@babel/types'
import * as t from '@babel/types'
import {
  DataOption,
} from './options-properties'

export class ObjectExpressionOptionsChain {
  // private isSetup: boolean
  private dataOption: DataOption | null = null

  constructor(private _node: NodePath<ObjectExpression>) {}

  get node() {
    return this._node
  }

  data() {
    if (this.dataOption) {
      return this.dataOption
    }

    const dataNode = (
      this._node.get('properties')
        .find((prop): prop is NodePath<ObjectMethod> => {
          if (prop.isObjectMethod()) {
            const keyNode = prop.get('key')
            return keyNode.isIdentifier() && keyNode.node.name === 'data'
          }
          return false
        })
    )

    if (dataNode) {
      this.dataOption = new DataOption(dataNode.node, this)
      return this.dataOption
    }

    const objectMethod = t.objectMethod(
      'method',
      t.identifier('data'),
      [],
      t.blockStatement([
        t.returnStatement(
          t.objectExpression([]),
        ),
      ]),
    )
    this._node.pushContainer('properties', objectMethod)
    this.dataOption = new DataOption(objectMethod, this)
    return this.dataOption
  }
}
