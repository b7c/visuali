<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import type { SelectMenuItem } from '@nuxt/ui'

import { ref, onMounted, watch, reactive, nextTick, computed } from 'vue'
import { payloadDecoration, payloadEffect } from '@/editor'

import contexts from '@/data/contexts'
import { Context, contextFromDto } from '@/context'
import type { ContextDto } from '@/data/dto'

import VisualiEditor from '@/components/VisualiEditor.vue'
import HtmlPreview from '@/components/HtmlPreview.vue'

import type { SanitizeOptions } from '@/model/SanitizeOptions'
import SanitizeOptionsComponent from '@/components/SanitizeOptions.vue'
import AlertDialog from '@/components/AlertDialog.vue'

const editorRef = ref<InstanceType<typeof VisualiEditor>>()
const htmlPreviewRef = ref<InstanceType<typeof HtmlPreview>>()
const editing = ref(false)
const content = ref<string>()

const contextItems = computed<SelectMenuItem[]>(() => {
  return contexts.map<SelectMenuItem[]>(group => [
    {
      type: 'label',
      label: group.name,
    },
    ...group.contexts.map<SelectMenuItem>(item => ({
      label: item.name,
      ...item
    }))
  ]).flat()
})

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

let selectedContext = ref<ContextDto & { label: string }>({
  ...contexts[0].contexts[0],
  label: contexts[0].contexts[0].name
})
let context = ref<Context>(contextFromDto(selectedContext.value))
watch(selectedContext, () => (context.value = contextFromDto(selectedContext.value)))
watch(context, updateEditor)

function toggleEdit() {
  editing.value = !editing.value
}

async function updateEditor() {
  await nextTick()
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
</script>

<template>
  <SplitterGroup direction="horizontal">
    <SplitterPanel :min-size="20">
      <SplitterGroup direction="vertical">
        <SplitterPanel :min-size="20">
          <UCard class="h-full rounded-none">
            <template #header>
              <div class="h-full flex flex-row items-center gap-2 select-none">
                <h6>Input</h6>
                <USelectMenu
                  v-model="selectedContext"
                  :items="contextItems"
                  :option-label="'name'"
                  option-group-label="name"
                  :optionGroupChildren="['contexts']"
                  placeholder="Select a context"
                  class="ms-auto text-xs"
                  :ui="{ content: 'min-w-fit' }"
                />
                <UTooltip text="Sanitization">
                  <UPopover v-model:open="showSanitizeOptions">
                    <UButton
                      class="rounded-full"
                      variant="ghost"
                      color="neutral"
                      @click="showSanitizeOptions = true"
                      icon="i-mingcute-broom-line"
                    >
                    </UButton>
                    <template #content>
                      <SanitizeOptionsComponent v-model:visible="showSanitizeOptions" v-model:html-angle-brackets="sanitize.html.angleBrackets"
                        v-model:html-ampersand="sanitize.html.ampersand" v-model:html-quotes="sanitize.html.quotes"
                        v-model:string-quotes="sanitize.string.quotes" v-model:string-single-quotes="sanitize.string.singleQuotes"
                        v-model:string-backslash="sanitize.string.backslash"
                      />
                    </template>
                  </UPopover>
                </UTooltip>
              </div>
            </template>
            <template #default>
              <div class="card-body h-full p-0">
                <template v-if="context">
                  <UForm>
                    <UFormField
                      v-for="input of context.inputs.values()"
                      :key="input.id"
                      :label="input.name"
                    >
                      <UInput
                        class="w-full"
                        :id="`input-${input.id}`"
                        v-model="input.value"
                        @input="updateEditor"
                        spellcheck="false"
                        autocomplete="off" />
                    </UFormField>
                  </UForm>
                </template>
              </div>
            </template>
          </UCard>
        </SplitterPanel>
        <SplitterResizeHandle class="h-2 bg-elevated" />
        <SplitterPanel :min-size="20">
          <UCard class="h-full rounded-none overflow-hidden" :ui="{ body: 'sm:p-0 p-0' }">
            <template #header>
              <div class="flex flex-row items-center gap-2">
                <h6>Output</h6>
              </div>
            </template>
            <VisualiEditor ref="editorRef" :editable="editing" :lang="context.lang" />
          </UCard>
        </SplitterPanel>
      </SplitterGroup>
    </SplitterPanel>
    <SplitterResizeHandle class="w-2 bg-elevated" />
    <SplitterPanel :min-size="20">
      <UCard class="h-full rounded-none" :ui="{ body: 'p-0 sm:p-0 h-full' }">
        <template #header>
          <div class="h-full flex flex-row items-center gap-2 select-none">
            <h6>Result</h6>
            <UTooltip :text="enableAlerts ? 'Silence alerts' : 'Enable alerts'">
              <UButton
                class="ms-auto rounded-full"
                variant="ghost"
                color="neutral"
                :icon="enableAlerts ? 'i-mingcute-notification-line' : 'i-mingcute-notification-off-line'"
                @click="enableAlerts = !enableAlerts"
              />
            </UTooltip>
          </div>
          <Divider class="m-0" />
        </template>
        <template #default>
          <div v-if="context.lang==='html'" class="h-full">
            <HtmlPreview
              ref="htmlPreviewRef"
              :content="content"
              :enable-mouse-events="!showAlertDialog && !showSanitizeOptions"
              @alert="onAlert"
            />
          </div>
        </template>
      </UCard>
    </SplitterPanel>
  </SplitterGroup>
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
