export {
  TemplateNodeType,
} from './constants'

export {
  generateComponent,
  generateScript,
  generateStyle,
  generateTemplate,
} from './generates'

export {
  isElementNode,
  isInterpolationNode,
  isTextNode,
} from './is'

export { Path } from './path'

export {
  parse as parseSfcScript,
} from './sfc-script'

export { traverse } from './traverse'

export type {
  GenerateOptions,
  ScriptAttrs,
  SFCGenerateOptions,
  TemplateNode,
} from './types'
