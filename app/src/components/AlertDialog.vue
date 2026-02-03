<script setup lang="ts">
const props = defineProps<{ text: string }>()
const visible = defineModel<boolean>('visible')
</script>

<template>
  <UModal
    v-model:open="visible"
    style="min-width: 24rem"
    class="select-none"
  >
    <template #title>
      Alert!
    </template>
    <template #body>
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        {{ props.text }}
      </span>
      <div class="flex justify-end gap-2">
        <Button type="button" label="OK" severity="secondary" @click="visible = false"/>
      </div>
    </template>
  </UModal>
</template>