import type { Statement, ExpressionStatement } from '@babel/types'
import { OptionOperator } from "../../../types";

export class WatchOption implements Pick<OptionOperator, 'add'> {
  constructor(private statements: Statement[]) {}

  add(value: ExpressionStatement): this {
    this.statements.push(value)
    return this
  }
}