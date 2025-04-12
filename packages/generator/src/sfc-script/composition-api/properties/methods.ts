import type { FunctionDeclaration, Statement } from '@babel/types'
import type { OptionOperator } from '../../../types'
import * as t from '@babel/types'

export class MethodsOption implements OptionOperator {
  constructor(private statements: Statement[]) {}

  add(fn: FunctionDeclaration): this {
    this.statements.push(fn)
    return this
  }

  remove(name: string): this {
    const index = this.statements.findIndex((s) => {
      return (
        t.isFunctionDeclaration(s)
        && t.isIdentifier(s.id)
        && s.id.name === name
      )
    })

    if (index > -1) {
      this.statements.splice(index, 1)
    }

    return this
  }

  update(fn: FunctionDeclaration): this {
    const index = this.statements.findIndex(s => {
      if (
        t.isFunctionDeclaration(s)
        && t.isIdentifier(s.id)
        && s.id.name
        && s.id.name === fn.id?.name
      ) {
        return true
      }
      return false
    })
    
    if (index > -1) {
      this.statements[index] = fn
    }

    return this
  }

  get(name: string): FunctionDeclaration | undefined {
    return this.statements.find((s): s is FunctionDeclaration => {
      return (
        t.isFunctionDeclaration(s)
        && t.isIdentifier(s.id)
        && s.id.name === name
      )
    })
  }
}
