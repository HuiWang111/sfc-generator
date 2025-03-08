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
  isTextNode, 
  isInterpolationNode 
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

## API Types

```typescript
interface GenerateOptions {
  breakOnAttrs?: number   // Break attributes to new lines when count exceeds this
  indentSize?: number     // Indent size in spaces
  autoIndent?: boolean    // Enable auto indentation
}

interface ScriptAttrs {
  setup?: boolean         // Use <script setup>
  lang?: string          // Script language (ts/js)
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
