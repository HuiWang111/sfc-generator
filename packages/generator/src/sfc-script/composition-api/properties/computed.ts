import type { Statement } from '@babel/types'
import { VariableCallExpressionOption } from './abstracts/variable-call-expression'

export class ComputedOption extends VariableCallExpressionOption {
  constructor(statements: Statement[]) {
    super(statements, 'computed')
  }
}
