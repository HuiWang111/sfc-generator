import type { NodePath } from '@babel/traverse'
import type { ObjectExpression, ObjectMethod } from '@babel/types'
import * as t from '@babel/types'
import {
  ComputedOption,
  DataOption,
  WatchOption,
} from './properties'

export class OptionsApi {
  // private isSetup: boolean
  private dataOption: DataOption | null = null
  private computedOption: ComputedOption | null = null
  private watchOption: WatchOption | null = null

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

  computed() {
    if (this.computedOption)
      return this.computedOption

    const computedNode = (
      this._node.get('properties')
        .find((prop): prop is NodePath<t.ObjectProperty> => {
          if (prop.isObjectProperty()) {
            const keyNode = prop.get('key')
            return keyNode.isIdentifier() && keyNode.node.name === 'computed'
          }
          return false
        })
    )

    if (computedNode) {
      this.computedOption = new ComputedOption(computedNode.node, this)
      return this.computedOption
    }

    const objectProperty = t.objectProperty(
      t.identifier('computed'),
      t.objectExpression([]),
    )
    this._node.pushContainer('properties', objectProperty)
    this.computedOption = new ComputedOption(objectProperty, this)
    return this.computedOption
  }

  watch() {
    if (this.watchOption)
      return this.watchOption

    const watchNode = (
      this._node.get('properties')
        .find((prop): prop is NodePath<t.ObjectProperty> => {
          if (prop.isObjectProperty()) {
            const keyNode = prop.get('key')
            return keyNode.isIdentifier() && keyNode.node.name === 'watch'
          }
          return false
        })
    )

    if (watchNode) {
      this.watchOption = new WatchOption(watchNode.node, this)
      return this.watchOption
    }

    const objectProperty = t.objectProperty(
      t.identifier('watch'),
      t.objectExpression([]),
    )
    this._node.pushContainer('properties', objectProperty)
    this.watchOption = new WatchOption(objectProperty, this)
    return this.watchOption
  }
}
