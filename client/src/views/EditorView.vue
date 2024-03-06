<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { payloadDecoration, payloadEffect } from '@/editor'

import contexts from '@/data/contexts'
import { contextFromDto } from '@/context'

import VisualiEditor from '@/components/VisualiEditor.vue'
import HtmlPreview from '@/components/HtmlPreview.vue'

const editorRef = ref<InstanceType<typeof VisualiEditor>>()
const editing = ref(false)
const content = ref<string>()

const ctx = contexts[1]
let context = ref(contextFromDto(ctx))

function toggleEdit() {
  editing.value = !editing.value
}

function updateEditor() {
  const editor = editorRef.value?.view
  if (!editor) return
  const effects = []
  const replacer: RegExp = /\{\{(\w+)\}\}/g
  let match: RegExpExecArray | null
  let doc = context.value.output
  while ((match = replacer.exec(doc)) != null) {
    const [placeholder, id] = match
    const input = context.value.inputs.get(id)
    if (!input) continue
    const inputValue = input.value || '\u200b'
    doc = doc.slice(0, match.index) + inputValue + doc.slice(match.index + placeholder.length)
    effects.push(
      payloadEffect.of([payloadDecoration.range(match.index, match.index + inputValue.length)])
    )
  }
  editor.dispatch({
    changes: [{ from: 0, to: editor.state.doc.length, insert: doc }],
    effects,
  })
  content.value = doc
}

onMounted(() => {
  updateEditor()
})

const onAlert = (msg: any) => alert(msg)
</script>

<template>
  <div class="card-container">
    <div class="card m-0">
      <div class="card-header p-2">
        <h6 class="card-title m-0">Input</h6>
      </div>
      <div class="card-body p-3 pt-2">
        <div class="form-group" v-for="input of context.inputs.values()" :key="input.id">
          <label :for="`input-${input.id}`">{{ input.name }}</label>
          <input
            type="text"
            class="form-control"
            :id="`input-${input.id}`"
            v-model="input.value"
            @input="updateEditor"
            spellcheck="false"
            autocomplete="off"
          />
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header p-2 d-flex align-items-center gap-1">
        <h6 class="card-title m-0">Output</h6>
        <button class="m-0 p-0 btn d-flex align-items-center p-1" @click="toggleEdit">
          <fa-icon icon="fa-solid fa-edit" style="height: 0.75em"></fa-icon>
        </button>
      </div>
      <div class="card-body p-0">
        <VisualiEditor class="h-100" ref="editorRef" :editable="editing" :lang="context.lang" />
      </div>
    </div>
    <div v-if="context.lang == 'html'" class="card">
      <div class="card-header p-2">
        <h6 class="card-title m-0">Rendered</h6>
      </div>
      <div class="card-body p-1">
        <HtmlPreview :content="content" @alert="onAlert" />
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-size: 1.2rem;
}

input,
textarea {
  padding: 5px;
}

.card-container {
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr 1fr;
  padding: 10px;
  gap: 10px;
}
</style>
<style>
.cm-editor {
  height: 100%;
}
.cm-content {
  font-size: 1.1em;
}
.cm-focused {
  outline: none !important;
}
</style>
