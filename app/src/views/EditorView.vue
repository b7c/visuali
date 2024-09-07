<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue'
import { payloadDecoration, payloadEffect } from '@/editor'

import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

import InputText from 'primevue/inputtext'
import CascadeSelect from 'primevue/cascadeselect'

import contexts from '@/data/contexts'
import { Context, contextFromDto } from '@/context'
import type { ContextDto } from '@/data/dto'

import Card from 'primevue/card'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

import VisualiEditor from '@/components/VisualiEditor.vue'
import HtmlPreview from '@/components/HtmlPreview.vue'

import type { SanitizeOptions } from '@/model/SanitizeOptions'
import SanitizeOptionsDialog from '@/components/SanitizeOptionsDialog.vue'
import AlertDialog from '@/components/AlertDialog.vue'

const editorRef = ref<InstanceType<typeof VisualiEditor>>()
const htmlPreviewRef = ref<InstanceType<typeof HtmlPreview>>()
const editing = ref(false)
const content = ref<string>()

const sanitize = reactive<SanitizeOptions>({
  html: {
    quotes: false,
    singleQuotes: false,
    angleBrackets: false,
    ampersand: false
  },
  string: {
    quotes: false,
    singleQuotes: false,
    backslash: false,
    slash: false
  }
})
const showSanitizeOptions = ref(false)

const modalDiv = ref<HTMLDivElement>()

let selectedContext = ref<ContextDto>(contexts[0].contexts[0])
let context = ref<Context>(contextFromDto(selectedContext.value))
watch(selectedContext, () => (context.value = contextFromDto(selectedContext.value)))
watch(context, updateEditor)

function toggleEdit() {
  editing.value = !editing.value
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
    if (sanitize.html.ampersand) {
      inputValue = inputValue.replace(/&/g, '&amp;')
    }
    if (sanitize.html.angleBrackets) {
      inputValue = inputValue.replace(/</g, '&lt;')
      inputValue = inputValue.replace(/>/g, '&gt;')
    }
    if (sanitize.html.quotes) {
      inputValue = inputValue.replace(/"/g, '&quot;')
    }
    if (sanitize.string.backslash) {
      inputValue = inputValue.replace(/\\/g, '\\\\')
    }
    if (sanitize.string.slash) {
      inputValue = inputValue.replace(/\//g, '\\/')
    }
    if (sanitize.string.quotes) {
      inputValue = inputValue.replace(/"/g, '\\"')
    }
    if (sanitize.string.singleQuotes) {
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

watch(sanitize, () => updateEditor())

const enableAlerts = ref(true)
const showAlertDialog = ref(false)
const alertText = ref('')
const onAlert = (msg: any) => {
  if (enableAlerts.value) {
    alertText.value = `${msg || ''}`
    showAlertDialog.value = true
  }
}
watch(enableAlerts, (enabled) => enabled && htmlPreviewRef.value?.refresh())

// Prevents the iframe from stealing mouse events
// while resizing splitter panels.
const isDragging = ref(false)
function beginDrag() {
  isDragging.value = true
}
function endDrag() {
  isDragging.value = false
}
</script>

<template>
  <div class="h-full p-2 bg-slate-100">
    <Splitter
      @resizestart="beginDrag"
      @resizeend="endDrag"
      :gutter-size="8"
      class="h-full rounded-none border-none bg-transparent"
    >
      <SplitterPanel class="overflow-visible">
        <Splitter
          @resizestart="beginDrag"
          @resizeend="endDrag"
          layout="vertical"
          :gutter-size="8"
          class="h-full rounded-none border-none bg-transparent"
        >
          <SplitterPanel class="overflow-visible">
            <Card class="h-full">
              <template #header>
                <div class="p-4 py-2 h-full flex flex-row items-center gap-2 select-none">
                  <h6>Input</h6>
                  <CascadeSelect
                    v-model="selectedContext"
                    :options="contexts"
                    :option-label="'name'"
                    option-group-label="name"
                    :optionGroupChildren="['contexts']"
                    placeholder="Select a context"
                    class="ms-auto text-xs"
                  />
                  <Button
                    text
                    severity="secondary"
                    @click="showSanitizeOptions = true"
                    class="w-8 -me-2"
                    v-tooltip="{
                      value: 'Sanitization',
                      showDelay: 600,
                    }"
                  >
                    <fa-icon icon="fa-solid fa-broom" style="height: 0.75em"></fa-icon>
                  </Button>
                </div>
                <Divider class="m-0 z-40" />
              </template>
              <template #content>
                <div class="card-body h-full p-0">
                  <template v-if="context">
                    <div class="flex items-center gap-2" v-for="input of context.inputs.values()" :key="input.id">
                      <label :for="`input-${input.id}`">{{ input.name }}</label>
                      <InputText :id="`input-${input.id}`"
                        class="w-full"
                        v-model="input.value"
                        @input="updateEditor"
                        spellcheck="false"
                        autocomplete="off" />
                    </div>
                  </template>
                </div>
              </template>
            </Card>
          </SplitterPanel>
          <SplitterPanel class="h-full overflow-visible">
            <Card class="h-full overflow-hidden" pt:body:class="p-0 h-full overflow-hidden" pt:content:class="h-full">
              <template #header>
                <div class="px-4 py-2 flex flex-row items-center gap-2">
                  <h6>Output</h6>
                </div>
                <Divider class="m-0 z-40" />
              </template>
              <template #content>
                <div class="card-body p-0 h-full">
                  <VisualiEditor class="h-full" ref="editorRef" :editable="editing" :lang="context.lang" />
                </div>
              </template>
            </Card>
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
      <SplitterPanel id="rendered" class="h-full overflow-visible" v-if="context.lang==='html'">
        <Card class="h-full" pt:body:class="p-0 h-full" pt:content:class="h-full">
          <template #header>
            <div class="p-4 py-2 h-full flex flex-row items-center gap-2 select-none">
              <h6>Result</h6>
              <Button
                text
                severity="secondary"
                @click="enableAlerts = !enableAlerts"
                class="ms-auto w-8 -mx-2"
                v-tooltip="{
                  value: enableAlerts
                    ? 'Silence alerts'
                    : 'Enable alerts',
                  showDelay: 600,
                }"
              >
                <fa-icon
                  :icon="`fa-solid ${enableAlerts?'fa-bell':'fa-bell-slash'}`"
                  style="height: 0.75em"/>
              </Button>
            </div>
            <Divider class="m-0" />
          </template>
          <template #content>
            <div v-if="context.lang==='html'" class="card-body p-1 h-full">
              <HtmlPreview
                ref="htmlPreviewRef"
                :content="content"
                :enable-mouse-events="!isDragging"
                @alert="onAlert"
              />
            </div>
          </template>
        </Card>
      </SplitterPanel>
    </Splitter>
  </div>
  <SanitizeOptionsDialog v-model:visible="showSanitizeOptions" v-model:html-angle-brackets="sanitize.html.angleBrackets"
    v-model:html-ampersand="sanitize.html.ampersand" v-model:html-quotes="sanitize.html.quotes"
    v-model:string-quotes="sanitize.string.quotes" v-model:string-single-quotes="sanitize.string.singleQuotes"
    v-model:string-backslash="sanitize.string.backslash" />
  <AlertDialog v-model:visible="showAlertDialog" :text="alertText" />
</template>

<style scoped>
* {
  font-size: 1.2rem;
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
