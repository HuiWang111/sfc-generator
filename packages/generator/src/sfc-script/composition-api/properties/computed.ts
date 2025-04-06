import type { Statement } from '@babel/types'
import { CallExpressionOption } from './abstracts/call-expression'

export class ComputedOption extends CallExpressionOption {
  constructor(statements: Statement[]) {
    super(statements, 'computed')
  }
}
