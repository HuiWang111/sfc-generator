import type { Expression, Statement, VariableDeclaration } from '@babel/types'
import type { OptionOperator } from '../../../../types'
import * as t from '@babel/types'

export abstract class VariableCallExpressionOption implements OptionOperator {
  constructor(
    private statements: Statement[],
    private calleeName: string,
  ) {}

  add(name: string, value: Expression): this {
    this.statements.push(
      t.variableDeclaration(
        'const',
        [
          t.variableDeclarator(
            t.identifier(name),
            t.callExpression(
              t.identifier(this.calleeName),
              [value],
            ),
          ),
        ],
      ),
    )
    return this
  }

  remove(name: string): this {
    const index = this.statements.findIndex((s) => {
      if (t.isVariableDeclaration(s)) {
        return s.declarations.some((d) => {
          return t.isIdentifier(d.id) && d.id.name === name
        })
      }
      return false
    })
    if (index > -1) {
      this.statements.splice(index, 1)
    }
    return this
  }

  update(name: string, value: Expression): this {
    for (const s of this.statements) {
      if (t.isVariableDeclaration(s)) {
        for (const d of s.declarations) {
          if (
            t.isIdentifier(d.id)
            && d.id.name === name
            && t.isCallExpression(d.init)
            && t.isIdentifier(d.init.callee)
            && d.init.callee.name === this.calleeName
          ) {
            d.init.arguments = [value]
          }
        }
      }
    }
    return this
  }

  get(name: string): Expression | null {
    const s = this.statements.find((s) => {
      return (
        t.isVariableDeclaration(s)
        && s.declarations.some((d) => {
          return (
            t.isIdentifier(d.id)
            && d.id.name === name
          )
        })
      )
    }) as VariableDeclaration | undefined

    if (s) {
      for (const d of s.declarations) {
        if (
          t.isCallExpression(d.init)
          && t.isIdentifier(d.init.callee)
          && d.init.callee.name === this.calleeName
        ) {
          return d.init.arguments[0] as Expression
        }
      }
    }
    return null
  }
}
