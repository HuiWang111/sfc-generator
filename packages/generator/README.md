# @asiimov/sfc-generator

> Utilities for generate Vue Single File Components

## Installation

```bash
npm install @asiimov/sfc-generator
```

## Usage

### Generate SFC

```typescript
import { generateComponent } from '@asiimov/sfc-generator'

// Generate a complete SFC
const code = generateComponent({
  template: {
    node: templateASTNode,
  },
  script: {
    node: scriptASTNode,
    attrs: {
      setup: true,
      lang: 'ts'
    }
  },
  styles: [{
    content: '.foo { color: red; }',
    lang: 'scss',
    scoped: true
  }]
})
```

### Node Type Guards

提供了一系列用于判断节点类型的工具函数：

```typescript
import {
  isElementNode,
  isInterpolationNode,
  isTextNode
} from '@asiimov/sfc-generator'

// 判断是否为元素节点
if (isElementNode(node)) {
  // node.tag, node.children 等属性可用
}

// 判断是否为文本节点
if (isTextNode(node)) {
  // node.text 属性可用
}

// 判断是否为插值表达式节点
if (isInterpolationNode(node)) {
  // node.expression 属性可用
}
```

### AST Traversal

提供了遍历和操作 AST 节点的工具：

```typescript
import { traverse } from '@asiimov/sfc-generator'

// 遍历 AST
traverse(templateASTNode, (path) => {
  // 获取当前节点
  const node = path.node

  // 获取父节点
  const parent = path.parent

  // 查找符合条件的子节点
  const child = path.find(node => isElementNode(node) && node.tag === 'div')

  // 替换当前节点
  path.replaceWith(newNode)

  // 移除当前节点
  path.remove()

  // 跳过子节点的遍历
  path.skip()

  // 获取兄弟节点
  const sibling = path.getSibling(1)
})
```

### SFC Script Parser

提供了解析和操作 Vue 组件脚本部分的工具，支持 Vue 2 的 Options API 和 Vue 3 的 Composition API：

```typescript
import { parseSfcScript } from '@asiimov/sfc-generator'
// 注意：methods().add() 需要接收一个 ObjectMethod 类型的参数
// 使用 @babel/types 创建 AST 节点
import * as t from '@babel/types'

// 解析 Options API 风格的脚本
const { api: optionsApi, ast } = parseSfcScript(`
export default {
  name: 'MyComponent',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
`)

// 操作 Options API 组件
optionsApi.data().add('message', 'Hello')

optionsApi.methods().add(
  t.objectMethod(
    'method',
    t.identifier('decrement'),
    [],
    t.blockStatement([
      t.expressionStatement(
        t.updateExpression(
          '--',
          t.memberExpression(
            t.thisExpression(),
            t.identifier('count'),
            false
          )
        )
      )
    ])
  )
)

// 解析 Composition API 风格的脚本
const { api: compositionApi, ast } = parseSfcScript(`
const count = ref(0)
const message = ref('Hello')

function increment() {
  count.value++
}

function decrement() {
  count.value--
}
`, { setup: true })

// 操作 Composition API 组件
compositionApi.data().add('name', 'World')
// 注意：methods().add() 需要接收一个 FunctionDeclaration 类型的参数
// 使用 @babel/types 创建 AST 节点
compositionApi.methods().add(
  t.functionDeclaration(
    t.identifier('greet'),
    [],
    t.blockStatement([
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(
            t.identifier('console'),
            t.identifier('log'),
            false
          ),
          [
            t.templateLiteral(
              [t.templateElement({ raw: 'Hello ', cooked: 'Hello' }, false)],
              [t.memberExpression(
                t.identifier('name'),
                t.identifier('value'),
                false
              )]
            )
          ]
        )
      )
    ])
  )
)
```

#### 支持的 API 操作

##### Options API

- `data()` - 操作组件的 data 选项
- `computed()` - 操作组件的 computed 选项
- `methods()` - 操作组件的 methods 选项
- `props()` - 操作组件的 props 选项
- `watch()` - 操作组件的 watch 选项

##### Composition API

- `data()` - 操作 ref 变量
- `computed()` - 操作 computed 函数
- `props()` - 操作 defineProps 调用
- `methods()` - 操作函数声明
- `watch()` - 操作 watch 函数

每个 API 都提供以下操作：

- `add(name, value)` - 添加新的选项/属性
- `update(name, value)` - 更新现有的选项/属性
- `remove(name)` - 删除选项/属性
- `get(name)` - 获取选项/属性的值

## API Types

```typescript
interface GenerateOptions {
  breakOnAttrs?: number // Break attributes to new lines when count exceeds this
  indentSize?: number // Indent size in spaces
  autoIndent?: boolean // Enable auto indentation
}

interface ScriptAttrs {
  setup?: boolean // Use <script setup>
  lang?: string // Script language (ts/js)
}

interface SFCGenerateOptions {
  template: {
    node: TemplateNode
    options?: GenerateOptions
  }
  script?: {
    node: BabelNode
    attrs?: ScriptAttrs
    options?: GeneratorOptions
  }
  styles?: SFCBlock[]
}
```

## Notes

1. You need to provide valid AST nodes
2. Template AST must follow the library's node structure
3. Script AST must be Babel AST nodes
4. Style configs must follow @vue/compiler-sfc's SFCBlock interface

## License

ISC
