import type { Statement } from '@babel/types'
import {
  ComputedOption,
  PropsOption,
  RefOption,
  MethodsOption,
} from './properties'

export class CompositionApi {
  refOption: RefOption | null = null
  computedOption: ComputedOption | null = null
  propsOption: PropsOption | null = null
  methodsOption: MethodsOption | null = null

  constructor(private statements: Statement[]) {}

  data() {
    if (!this.refOption)
      this.refOption = new RefOption(this.statements)
    return this.refOption
  }

  computed() {
    if (!this.computedOption)
      this.computedOption = new ComputedOption(this.statements)
    return this.computedOption
  }

  props() {
    if (!this.propsOption)
      this.propsOption = new PropsOption(this.statements)
    return this.propsOption
  }

  methods() {
    if (!this.methodsOption)
      this.methodsOption = new MethodsOption(this.statements)
    return this.methodsOption
  }
}
