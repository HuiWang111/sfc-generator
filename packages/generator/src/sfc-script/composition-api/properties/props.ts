import type { ObjectExpression, ObjectProperty, Statement } from '@babel/types'
import type { OptionOperator } from '../../../types'
import * as t from '@babel/types'

export class PropsOption implements OptionOperator {
  private calleeName = 'defineProps'
  private objectExpression: ObjectExpression | null = null

  constructor(statements: Statement[]) {
    for (const s of statements) {
      if (t.isVariableDeclaration(s)) {
        for (const d of s.declarations) {
          if (
            t.isIdentifier(d.id)
            && t.isCallExpression(d.init)
            && t.isIdentifier(d.init.callee)
            && d.init.callee.name === this.calleeName
          ) {
            if (!t.isObjectExpression(d.init.arguments[0])) {
              d.init.arguments[0] = t.objectExpression([])
            }
            this.objectExpression = d.init.arguments[0]
          }
        }
      }
      else if (t.isExpressionStatement(s)) {
        if (
          t.isCallExpression(s.expression)
          && t.isIdentifier(s.expression.callee)
          && s.expression.callee.name === this.calleeName
        ) {
          if (!t.isObjectExpression(s.expression.arguments[0])) {
            s.expression.arguments[0] = t.objectExpression([])
          }
          this.objectExpression = s.expression.arguments[0]
        }
      }
    }

    if (!this.objectExpression) {
      this.objectExpression = t.objectExpression([])
      statements.unshift(
        t.expressionStatement(
          t.callExpression(
            t.identifier(this.calleeName),
            [this.objectExpression],
          ),
        ),
      )
    }
  }

  add(prop: ObjectProperty): this {
    if (this.objectExpression)
      this.objectExpression.properties.push(prop)
    return this
  }

  remove(name: string): this {
    if (!this.objectExpression)
      return this

    this.objectExpression.properties = this.objectExpression.properties.filter((prop) => {
      if (t.isSpreadElement(prop))
        return true
      return t.isIdentifier(prop.key) && prop.key.name !== name
    })
    return this
  }

  update(prop: ObjectProperty): this {
    if (!this.objectExpression)
      return this

    this.objectExpression.properties = this.objectExpression.properties.map((p) => {
      if (t.isSpreadElement(p))
        return p
      if (
        t.isIdentifier(p.key)
        && t.isIdentifier(prop.key)
        && p.key.name === prop.key.name
      ) {
        return prop
      }
      return p
    })
    return this
  }

  get(name: string): ObjectProperty | undefined {
    if (!this.objectExpression)
      return undefined

    return this.objectExpression.properties.find((prop): prop is ObjectProperty => {
      if (t.isObjectProperty(prop)) {
        return t.isIdentifier(prop.key) && prop.key.name === name
      }
      return false
    })
  }
}
