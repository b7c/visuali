<script setup lang="ts">
const htmlAngleBrackets = defineModel<boolean>('htmlAngleBrackets')
const htmlQuotes = defineModel<boolean>('htmlQuotes')
const htmlAmpersand = defineModel<boolean>('htmlAmpersand')
const stringQuotes = defineModel<boolean>('stringQuotes')
const stringSingleQuotes = defineModel<boolean>('stringSingleQuotes')
const stringBackslash = defineModel<boolean>('stringBackslash')
const emit = defineEmits(['dragstart', 'dragend'])
</script>

<template>
  <UCard>
    <template #header><strong>Sanitization</strong></template>
    <h1 class="font-bold mb-1">HTML</h1>
    <div class="flex items-center gap-2">
      <UCheckbox
        v-model="htmlAngleBrackets"
        :binary="true"
      >
        <template #label>
          <div class="flex justify-center items-center gap-1">
            Angle brackets
            <UBadge class="p-2 rounded-full text-toned bg-accented" :ui="{ base: 'justify-center', label: '-m-10' }" label="<"></UBadge>
            <UBadge class="p-2 rounded-full text-toned bg-accented" :ui="{ base: 'justify-center', label: '-m-10' }" color="neutral" label=">"></UBadge>
          </div>
        </template>
      </UCheckbox>
    </div>
    <div class="flex items-center gap-2">
      <UCheckbox
        v-model="htmlAmpersand"
        :binary="true"
      >
        <template #label>
          <div class="flex justify-center items-center gap-1">
            Ampersand
            <UBadge class="p-2 rounded-full text-toned bg-accented" :ui="{ base: 'justify-center', label: '-m-10' }" label="&"></UBadge>
          </div>
        </template>
      </UCheckbox>
    </div>
    <div class="flex items-center gap-2">
      <UCheckbox
        v-model="htmlQuotes"
        :binary="true"
      >
        <template #label>
          <div class="flex justify-center items-center gap-1">
            Double quotes
            <UBadge class="p-2 rounded-full text-toned bg-accented" :ui="{ base: 'justify-center', label: '-m-10' }" color="neutral" label="&quot;"></UBadge>
          </div>
        </template>
      </UCheckbox>
    </div>
    <USeparator class="my-4" />
    <h1 class="font-bold mb-1">String</h1>
    <div class="flex items-center gap-2">
      <UCheckbox
        v-model="stringQuotes"
        :binary="true"
      >
        <template #label>
          <div class="flex justify-center items-center gap-1">
            Double quotes
            <UBadge class="p-2 rounded-full text-toned bg-accented" :ui="{ base: 'justify-center', label: '-m-10' }" color="neutral" label="&quot;"></UBadge>
          </div>
        </template>
      </UCheckbox>
    </div>
    <div class="flex items-center gap-2">
      <UCheckbox
        v-model="stringSingleQuotes"
        :binary="true"
      >
        <template #label>
          <div class="flex justify-center items-center gap-1">
            Single quotes
            <UBadge class="p-2 rounded-full text-toned bg-accented" :ui="{ base: 'justify-center', label: '-m-10' }" color="neutral" label="'"></UBadge>
          </div>
        </template>
      </UCheckbox>
    </div>
    <div class="flex items-center gap-2">
      <UCheckbox v-model="stringBackslash">
        <template #label>
          <div class="flex justify-center items-center gap-1">
            Backslash
            <UBadge class="p-2 rounded-full text-toned bg-accented" :ui="{ base: 'justify-center', label: '-m-10' }" color="neutral" label="\"></UBadge>
          </div>
        </template>
      </UCheckbox>
    </div>
  </UCard>
</template>