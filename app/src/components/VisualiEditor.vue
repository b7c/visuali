<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { setup } from '@/editor'
import { payloadExtension } from '@/editor/effect'
import { getLanguageExtension } from '@/editor/language'

const props = defineProps<{
  editable?: boolean
  lang?: string
}>()

const editorRef = ref<EditorView>()
const editorHostRef = ref<HTMLElement>()

const editableCompart = new Compartment()
const langCompart = new Compartment()

watch(
  () => props.editable,
  (value) => {
    editorRef.value?.dispatch({
      effects: editableCompart.reconfigure(EditorState.readOnly.of(!value)),
    })
  }
)

watch(
  () => props.lang,
  (value) => {
    editorRef.value?.dispatch({
      effects: langCompart.reconfigure(getLanguageExtension(value)),
    })
  }
)

onMounted(() => {
  editorRef.value = new EditorView({
    extensions: [
      editableCompart.of(EditorState.readOnly.of(!props.editable)),
      EditorView.lineWrapping,
      setup,
      langCompart.of(getLanguageExtension(props.lang)),
      payloadExtension,
    ],
    parent: editorHostRef.value,
  })
})

defineExpose({ view: editorRef })
</script>

<template>
  <div ref="editorHostRef"></div>
</template>
