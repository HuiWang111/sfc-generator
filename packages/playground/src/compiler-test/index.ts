import { parseComponent, compileTemplate, compileScript, compileStyle } from '@vue/compiler-sfc'
import { readFile } from 'fs/promises'
import { join } from 'path'

main()

async function main() {
  const sfc = await readFile(join(__dirname, 'sfc/form.vue'), 'utf-8')
  const sfcDescriptor = parseComponent(sfc)

  if (sfcDescriptor.template) {
    const template = compileTemplate({
      source: sfcDescriptor.template.content,
      filename: '',
    })

    console.log(template.code)
    const ast = template.ast as Record<string, any>
    console.log(ast)
    console.log(ast.children[0].children[2].children[2])
  }

  
  const script = compileScript(sfcDescriptor)
  // console.log(script.content)

  sfcDescriptor.styles.forEach((style) => {
    const res = compileStyle({
      source: style.content,
      filename: '',
      id: 'a',
    })

    // console.log(res.code)
    // console.log(res.rawResult)
  })
}