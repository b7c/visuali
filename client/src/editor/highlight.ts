import { HighlightStyle, defaultHighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

export const visualiHighlightStyle = HighlightStyle.define([
  ...defaultHighlightStyle.specs,
  { tag: tags.comment, color: '#ccc', fontStyle: 'italic' },
])