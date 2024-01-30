import { bracketMatching, foldGutter, syntaxHighlighting } from '@codemirror/language'
import { type Extension } from '@codemirror/state'
import {
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  lineNumbers,
} from '@codemirror/view'

import { visualiHighlightStyle } from './highlight'
import { payloadDecoration, payloadEffect } from './effect'

const setup: Extension = (() => [
  lineNumbers(),
  highlightActiveLineGutter(),
  foldGutter(),
  drawSelection(),
  syntaxHighlighting(visualiHighlightStyle, { fallback: true }),
  bracketMatching(),
  highlightActiveLine(),
])()

export { setup, payloadDecoration, payloadEffect }
