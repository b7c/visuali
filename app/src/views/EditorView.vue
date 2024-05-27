<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue'
import { payloadDecoration, payloadEffect } from '@/editor'

import { Modal } from 'bootstrap'

import contexts from '@/data/contexts'
import { Context, contextFromDto } from '@/context'
import type { ContextDto } from '@/data/dto'

import VisualiEditor from '@/components/VisualiEditor.vue'
import HtmlPreview from '@/components/HtmlPreview.vue'

const editorRef = ref<InstanceType<typeof VisualiEditor>>()
const editing = ref(false)
const content = ref<string>()

const sanitiseOpts = reactive({
  htmlAngleBrackets: false,
  htmlQuotes: false,
  stringDQuotes: false,
  stringSQuotes: false,
  stringBackslash: false,
  stringFwdSlash: false,
})

const modalDiv = ref<HTMLDivElement>()

let selectedContext = ref<ContextDto>(contexts[0])
let context = ref<Context>(contextFromDto(selectedContext.value))
watch(selectedContext, () => (context.value = contextFromDto(selectedContext.value)))
watch(context, updateEditor)

function toggleEdit() {
  editing.value = !editing.value
}

function showSanitisation() {
  const div = modalDiv.value
  if (!div) return
  Modal.getOrCreateInstance(div).show()
}

function updateEditor() {
  const editor = editorRef.value?.view
  if (!editor) return
  const effects = []
  const replacer: RegExp = /\{\{(\w+)\}\}/g
  let match: RegExpExecArray | null
  let doc = context.value.output || ''
  while ((match = replacer.exec(doc)) != null) {
    const [placeholder, id] = match
    const input = context.value.inputs.get(id)
    if (!input) continue
    let inputValue = input.value || '\u200b'
    console.log(sanitiseOpts)
    if (sanitiseOpts.htmlAngleBrackets) {
      inputValue = inputValue.replace(/</g, '&lt;')
      inputValue = inputValue.replace(/>/g, '&gt;')
    }
    if (sanitiseOpts.htmlQuotes) {
      inputValue = inputValue.replace(/"/g, '&quot;')
    }
    if (sanitiseOpts.stringBackslash) {
      inputValue = inputValue.replace(/\\/g, '\\\\')
    }
    if (sanitiseOpts.stringFwdSlash) {
      inputValue = inputValue.replace(/\//g, '\\/')
    }
    if (sanitiseOpts.stringDQuotes) {
      inputValue = inputValue.replace(/"/g, '\\"')
    }
    if (sanitiseOpts.stringSQuotes) {
      inputValue = inputValue.replace(/'/g, "\\'")
    }
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

watch(sanitiseOpts, () => updateEditor())

const onAlert = (msg: any) => alert(msg)
</script>

<template>
  <div class="card-container">
    <div class="card m-0">
      <div class="card-header p-2 d-flex flex-row align-items-center">
        <h6 class="card-title m-0">Input</h6>
        <button class="m-0 p-0 btn d-flex align-items-center p-1" @click="showSanitisation">
          <fa-icon icon="fa-solid fa-broom" style="height: 0.75em"></fa-icon>
        </button>
        <select class="form-select form-select-sm py-0 px-2 m-0 bg-none" v-model="selectedContext">
          <option v-for="(ctx, idx) in contexts" :key="idx" :value="ctx">
            {{ ctx.name }}
          </option>
        </select>
      </div>
      <div class="card-body p-3 pt-2">
        <template v-if="context">
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
        </template>
      </div>
    </div>
    <template v-if="context">
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
    </template>
  </div>
  <!-- Modal -->
  <div ref="modalDiv" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Sanitisation</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <div>
              <h6>HTML encode</h6>
            </div>
            <div>
              <input
                v-model="sanitiseOpts.htmlAngleBrackets"
                id="sanitiseHtmlAngleBrackets"
                type="checkbox"
                class="form-check-input"
              />
              <label for="sanitiseHtmlAngleBrackets" class="ps-2 form-label"
                >Angle brackets: <span class="char">&gt;</span>
                <span class="char">&lt;</span></label
              >
            </div>
            <div>
              <input
                v-model="sanitiseOpts.htmlQuotes"
                id="sanitiseHtmlQuotes"
                type="checkbox"
                class="form-check-input"
              />
              <label for="sanitiseHtmlQuotes" class="ps-2 form-label"
                >Double quotes <span class="char">"</span></label
              >
            </div>
          </div>
          <div>
            <div>
              <h6>String Escape</h6>
            </div>
            <div>
              <input
                v-model="sanitiseOpts.stringDQuotes"
                id="sanitiseStringQuotes"
                type="checkbox"
                class="form-check-input"
              />
              <label for="sanitiseStringQuotes" class="ps-2 form-label"
                >Double quotes <span class="char">"</span></label
              >
            </div>
            <div>
              <input
                v-model="sanitiseOpts.stringSQuotes"
                id="sanitiseStringSQuotes"
                type="checkbox"
                class="form-check-input"
              />
              <label for="sanitiseStringSQuotes" class="ps-2 form-label"
                >Single quotes <span class="char">'</span></label
              >
            </div>
            <div>
              <input
                v-model="sanitiseOpts.stringBackslash"
                id="sanitiseStringBackslash"
                type="checkbox"
                class="form-check-input"
              />
              <label for="sanitiseStringBackslash" class="ps-2 form-label"
                >Backslash <span class="char">\</span></label
              >
            </div>
            <div>
              <input
                v-model="sanitiseOpts.stringFwdSlash"
                id="sanitiseStringFwdSlash"
                type="checkbox"
                class="form-check-input"
              />
              <label for="sanitiseStringFwdSlash" class="ps-2 form-label"
                >Forward slash <span class="char">/</span></label
              >
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Ok</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-size: 1.2rem;
}

.separator {
  margin: 0 0.25em;
  display: block;
  height: 1em;
  border-right: 2px dotted gray;
}

input,
textarea {
  padding: 5px;
}

.char {
  margin-right: 4px;
  padding: 0px 4px;
  background: #eee;
  border-radius: 4px;
  font-family: Monospace;
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
