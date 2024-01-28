<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { sql } from '@codemirror/lang-sql'
import { payloadDecoration, payloadEffect, VisualiEditorView } from '@/editor'

const editorRef = ref<HTMLDivElement>()
let editor: VisualiEditorView

let context = ref({
  inputs: new Map<string, { name: string; hint: string; value: string }>([
    [
      'name',
      {
        name: 'Name',
        hint: '',
        value: ''
      }
    ]
  ]),
  output: `SELECT * FROM [users] WHERE [name] LIKE '%{{name}}%'`
})

function updateEditor() {
  const effects = []
  const replacer: RegExp = /\{\{(\w+)\}\}/g
  let match: RegExpExecArray | null
  let doc = context.value.output
  while ((match = replacer.exec(doc)) != null) {
    const placeholder = match[0]
    const id = match[1]
    const input = context.value.inputs.get(id)
    if (!input) {
      continue
    }
    doc = doc.slice(0, match.index) + input.value + doc.slice(match.index + placeholder.length)
    if (input.value.length > 0) {
      effects.push(
        payloadEffect.of([payloadDecoration.range(match.index, match.index + input.value.length)])
      )
    }
  }
  editor.dispatch({
    changes: [{ from: 0, to: editor.state.doc.length, insert: doc }],
    effects
  })
}

function inputChanged() {
  updateEditor()
}

onMounted(() => {
  editor = new VisualiEditorView(editorRef.value)
  editor.updateLanguage(sql())
  updateEditor()
})
</script>

<template>
  <div class="card mt-4 m-2">
    <div class="card-header">
      <h6 class="card-title m-0">Search user</h6>
    </div>
    <div class="card-body p-3 pt-2">
      <div class="form-group" v-for="input of context.inputs.values()" :key="input.name">
        <label for="in" v-if="input.name">{{ input.name }}</label>
        <input
          id="in"
          type="text"
          :class="['form-control', 'py-1', input.name ? '' : 'mt-2']"
          v-model="input.value"
          @input="inputChanged"
          :placeholder="input.hint"
        />
      </div>
    </div>
  </div>
  <div class="card mt-4 m-2">
    <div class="card-header">
      <h6 class="card-title m-0">Output</h6>
    </div>
    <div class="card-body p-1">
      <div ref="editorRef"></div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-size: 1.5rem;
}
input {
  font-size: 2rem;
}
</style>
<style>
.cm-content {
  font-size: 2rem;
}
.cm-focused {
  outline: none !important;
}
</style>