import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseComponent } from '@vue/compiler-sfc'
import { generateStyle } from '../index'

describe('test generateStyle', () => {
  it('generateStyle should work', async () => {
    const sfc = await readFile(join(__dirname, 'components/form.vue'), 'utf-8')
    const sfcDescriptor = parseComponent(sfc)

    const code = generateStyle(sfcDescriptor.styles)
    expect(code).toMatchSnapshot()
  })
})
