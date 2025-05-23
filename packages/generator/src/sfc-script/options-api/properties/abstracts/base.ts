import type { OptionsApi } from '../..'

export abstract class BaseOption<N> {
  constructor(
    protected _node: N,
    protected _parent: OptionsApi,
  ) {}

  node() {
    return this._node
  }

  parent() {
    return this._parent
  }
}
