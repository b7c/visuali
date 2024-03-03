<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const frameRef = ref<HTMLIFrameElement>()
const props = defineProps<{ content: string | undefined }>()
const emit = defineEmits<{ alert: [value: any] }>()

watch(
  () => props.content,
  (value) => {
    frameRef?.value?.contentWindow?.postMessage({
      type: 'html',
      value,
    })
  }
)

const handleMessage = (event: MessageEvent) => {
  if (event.source === frameRef.value?.contentWindow) {
    event.stopImmediatePropagation()
    const { type, value } = event.data
    if (type === 'alert') {
      emit('alert', value)
    }
  }
}

onMounted(() => {
  const doc = frameRef.value?.contentDocument
  if (doc) {
    const script = document.createElement('script')
    script.text = `(${initializeFrame})();`
    doc.body.innerHTML = props.content || ''
    doc.body.appendChild(script)
  }
  window.addEventListener('message', handleMessage)
  return () => window.removeEventListener('message', handleMessage)
})

const initializeFrame = () => {
  if (!window.frameElement) return
  window.alert = (value) => {
    window.parent.postMessage({ type: 'alert', value }, '*')
  }
  window.addEventListener('message', (event) => {
    const { type, value } = event.data
    if (type === 'html') {
      document.body.innerHTML = value
      Array.from(document.body.querySelectorAll('script')).forEach((script) => {
        const scriptEl = document.createElement('script')
        scriptEl.src = script.src
        scriptEl.text = script.text
        document.body.appendChild(scriptEl).parentNode?.removeChild(scriptEl)
      })
    }
  })
}
</script>

<template>
  <iframe ref="frameRef"></iframe>
</template>

<style scoped>
iframe {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
