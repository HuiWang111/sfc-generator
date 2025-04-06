import type { NodePath } from '@babel/traverse'
import type { ObjectExpression, ObjectMethod, ObjectProperty } from '@babel/types'
import * as t from '@babel/types'
import {
  ComputedOption,
  DataOption,
  MethodsOption,
  PropsOption,
  WatchOption,
} from './properties'

export class OptionsApi {
  // private isSetup: boolean
  private dataOption: DataOption | null = null
  private computedOption: ComputedOption | null = null
  private watchOption: WatchOption | null = null
  private methodsOption: MethodsOption | null = null
  private propsOption: PropsOption | null = null

  constructor(private _node: NodePath<ObjectExpression>) {}

  private getOptionNode<T extends ObjectMethod | ObjectProperty>(name: string) {
    return this._node.get('properties')
      .find((prop): prop is NodePath<T> => {
        const keyNode = prop.get('key')
        return keyNode.isIdentifier() && keyNode.node.name === name
      })
  }

  get node() {
    return this._node
  }

  data() {
    if (this.dataOption) {
      return this.dataOption
    }

    const dataNode = this.getOptionNode<ObjectMethod>('data')
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

    const computedNode = this.getOptionNode<ObjectProperty>('computed')
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

    const watchNode = this.getOptionNode<ObjectProperty>('watch')
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

  methods() {
    if (this.methodsOption)
      return this.methodsOption

    const methodsNode = this.getOptionNode<ObjectProperty>('methods')
    if (methodsNode) {
      this.methodsOption = new MethodsOption(methodsNode.node, this)
      return this.methodsOption
    }

    const objectProperty = t.objectProperty(
      t.identifier('methods'),
      t.objectExpression([]),
    )
    this._node.pushContainer('properties', objectProperty)
    this.methodsOption = new MethodsOption(objectProperty, this)
    return this.methodsOption
  }

  props() {
    if (this.propsOption)
      return this.propsOption

    const propsNode = this.getOptionNode<ObjectProperty>('props')
    if (propsNode) {
      this.propsOption = new PropsOption(propsNode.node, this)
      return this.propsOption
    }

    const objectProperty = t.objectProperty(
      t.identifier('props'),
      t.objectExpression([]),
    )
    this._node.pushContainer('properties', objectProperty)
    this.propsOption = new PropsOption(objectProperty, this)
    return this.propsOption
  }
}
