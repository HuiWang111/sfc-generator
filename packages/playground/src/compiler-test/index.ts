/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-console */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { compileScript, compileStyle, compileTemplate, parseComponent } from '@vue/compiler-sfc'

main()

async function main() {
  const sfc = await readFile(join(__dirname, 'sfc/form.vue'), 'utf-8')
  const sfcDescriptor = parseComponent(sfc)

  if (sfcDescriptor.template) {
    const template = compileTemplate({
      source: sfcDescriptor.template.content,
      filename: '',
    })

    // console.log(template.code)
    const ast = template.ast as Record<string, any>
    // console.log(ast)
    // console.log(ast.children[0].children[0].children[0])
  }

  const script = compileScript(sfcDescriptor)
  // console.log(script)

  sfcDescriptor.styles.forEach((style) => {
    const res = compileStyle({
      source: style.content,
      filename: '',
      id: 'a',
    })

    console.log(res.rawResult)
    // console.log(res.code)
    // console.log(res.rawResult)
  })
}
