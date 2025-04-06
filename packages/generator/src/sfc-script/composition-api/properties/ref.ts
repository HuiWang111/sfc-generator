import type { Statement } from '@babel/types'
import { CallExpressionOption } from './abstracts/call-expression'

export class RefOption extends CallExpressionOption {
  constructor(statements: Statement[]) {
    super(statements, 'ref')
  }
}
