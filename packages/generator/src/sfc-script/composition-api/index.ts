import type { Statement } from '@babel/types'
import * as t from '@babel/types'
import {
  RefOption,
  ComputedOption,
} from './properties'

export class CompositionApi {
  constructor(private statements: Statement[]) {}

  data() {
    return new RefOption(this.statements)
  }

  computed() {
    return new ComputedOption(this.statements)
  }
}
