**@asiimov/sfc-generator**

***

# @asiimov/sfc-generator

> Utilities for generate Vue Single File Components

## Installation

```bash
npm install @asiimov/sfc-generator
```

## Usage

```ts
import {
  generateComponent,
  generateTemplate,
  generateScript,
  generateStyle,
} from '@asiimov/sfc-generator'

// Generate a complete SFC
const component = generateComponent({
  template: {
    node: templateASTNode,
  },
  script: {
    node: scriptASTNode,
  },
  style: [
    {
      content: '.foo { color: red; }',
      lang: 'scss',
      scoped: true,
    }
  ],
})

// Generate template only
const templateCode = generateTemplate(templateASTNode, {
  indentSize: 2,
  breakOnAttrs: 2,
  autoIndent: true,
})
// Generate script only
const scriptCode = generateScript(scriptASTNode, {
  setup: true,
  lang: 'ts'
})
// Generate style only
const styleCode = generateStyle([
  {
    content: '.foo { color: red; }',
    lang: 'scss',
    scoped: true,
  },
])
```

## API Types

### SFCGenerateOptions

```ts
interface GenerateOptions {
  breakOnAttrs?: number // Break attributes to new lines when count exceeds this
  indentSize?: number // Indent size in spaces
  autoIndent?: boolean // Enable auto indentation
}
```

### ScriptAttrs

```ts
interface ScriptAttrs {
  setup?: boolean // Use <script setup>
  lang?: string // Script language (ts/js)
}
```

### SFCGenerateOptions 

```ts
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
