<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const frame = ref<HTMLIFrameElement>()
const {
  content,
  enableMouseEvents = true
} = defineProps<{
  content?: string,
  enableMouseEvents?: boolean
}>()
const emit = defineEmits<{ alert: [value: any] }>()

watch(
  () => content,
  (value) => {
    frame?.value?.contentWindow?.postMessage({
      type: 'html',
      value,
    })
  }
)

// This function gets invoked inside the iframe for initialisation.
const initFrame = () => {
  if (!window.frameElement) return
  window.alert = (value) => {
    window.parent.postMessage({ type: 'alert', value }, '*')
  }
  window.addEventListener('error', (ev) => {
    console.warn(ev.error)
    ev.preventDefault()
  })
  window.addEventListener('message', (event) => {
    const { type, value } = event.data
    if (type === 'html') {
      document.body.innerHTML = value
      Array.from(document.body.querySelectorAll('script')).forEach((script) => {
        const scriptEl = document.createElement('script')
        if (script.hasAttribute('src')) {
          scriptEl.src = script.src
        }
        scriptEl.text = script.text
        document.body.appendChild(scriptEl).parentNode?.removeChild(scriptEl)
      })
      // Prevent links from opening inside the iframe.
      document.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
        if (!a.href.startsWith('javascript:')) {
          a.target = '_blank'
        }
      })
    } else if (type === 'style') {
      const style = window.document.createElement('style')
      style.innerText = value
      window.document.head.appendChild(style)
    }
  })
}

const handleMessage = (event: MessageEvent) => {
  if (event.source === frame.value?.contentWindow) {
    event.stopImmediatePropagation()
    const { type, value } = event.data
    if (type === 'alert') {
      emit('alert', value)
    }
  }
}

onMounted(() => {
  const doc = frame.value?.contentDocument
  if (doc) {
    const script = document.createElement('script')
    script.text = `(${initFrame})();`
    doc.body.innerHTML = content || ''
    doc.body.appendChild(script)
    frame?.value?.contentWindow?.postMessage({
      type: 'style',
      value: `
        html {
          font-size: 16px;
        }
        body {
          font-size: 1.25rem; font-family: Calibri, sans-serif;
        }
        input {
          font-size: 20px;
        }
      `
    })
  }
  window.addEventListener('message', handleMessage)
  return () => window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <iframe ref="frame" :class="{
    'pointer-events-none': !enableMouseEvents,
  }"></iframe>
</template>

<style scoped>
iframe {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
