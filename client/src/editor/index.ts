import { bracketMatching, foldGutter, syntaxHighlighting } from '@codemirror/language'
import { Compartment, EditorState, type Extension } from '@codemirror/state'
import {
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  lineNumbers,
  EditorView,
} from '@codemirror/view'

import { visualiHighlightStyle } from './highlight'
import { payloadExtension, payloadDecoration, payloadEffect } from './effect'

const setup: Extension = (() => [
  lineNumbers(),
  highlightActiveLineGutter(),
  foldGutter(),
  drawSelection(),
  syntaxHighlighting(visualiHighlightStyle, { fallback: true }),
  bracketMatching(),
  highlightActiveLine(),
])()

class VisualiEditorView extends EditorView {
  private languageCompartment: Compartment
  constructor(parent?: Element | DocumentFragment | undefined) {
    const compartment = new Compartment()
    super({
      extensions: [
        EditorState.readOnly.of(true),
        EditorView.lineWrapping,
        setup,
        compartment.of([]),
        payloadExtension,
      ],
      parent,
    })
    this.languageCompartment = compartment
  }

  updateLanguage(language: Extension | undefined) {
    this.dispatch({
      effects: this.languageCompartment.reconfigure(language || [])
    })
  }
}

export { VisualiEditorView, setup, payloadDecoration, payloadEffect }
