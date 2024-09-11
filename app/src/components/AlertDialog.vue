<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps(['text'])
const visible = defineModel('visible')
const emit = defineEmits(['dragstart', 'dragend'])
</script>

<template>
  <Dialog
    modal
    header="Alert!"
    v-model:visible="visible"
    style="min-width: 24rem"
    @dragstart="() => emit('dragstart')"
    @dragend="() => emit('dragend')"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8">
      {{ props.text }}
    </span>
    <div class="flex justify-end gap-2">
      <Button type="button" label="OK" severity="secondary" @click="visible = false"/>
    </div>
  </Dialog>
</template>