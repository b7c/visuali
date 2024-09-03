import { Range, StateEffect, StateField } from "@codemirror/state"
import { Decoration, EditorView, type DecorationSet } from "@codemirror/view"

const payloadEffect = StateEffect.define<Range<Decoration>[]>()
const payloadExtension = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update: (value, transaction) => {
    value = value.map(transaction.changes)
    const payloadEffects = transaction.effects.filter((e) => e.is(payloadEffect))
    if (payloadEffects.length > 0) {
      value = value.update({ filter: (_to, _from, value: any) => value.class !== 'payload' })
    }
    for (const effect of payloadEffects) {
      value = value.update({ add: effect.value, sort: true })
    }
    return value
  },
  provide: (f) => EditorView.decorations.from(f)
})
const payloadDecoration = Decoration.mark({ class: 'payload' })

export { payloadExtension, payloadDecoration, payloadEffect }