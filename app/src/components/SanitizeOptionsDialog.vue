<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import Badge from 'primevue/badge'
import Fieldset from 'primevue/fieldset'

const visible = defineModel('visible')

const htmlAngleBrackets = defineModel('htmlAngleBrackets')
const htmlQuotes = defineModel('htmlQuotes')
const htmlAmpersand = defineModel('htmlAmpersand')
const stringQuotes = defineModel('stringQuotes')
const stringSingleQuotes = defineModel('stringSingleQuotes')
const stringBackslash = defineModel('stringBackslash')
</script>

<template>
  <Dialog
    v-model:visible="visible"
    header="Sanitization"
    pt:header:class="py-2 pb-0 select-none"
  >
    <Fieldset legend="HTML">
      <div class="flex items-center gap-2">
        <Checkbox
          v-model="htmlAngleBrackets"
          :binary="true"
          inputId="sanitiseHtmlAngleBrackets"
        />
        <label
          for="sanitiseHtmlAngleBrackets"
          class="flex items-center gap-1"
        >
          <span>Angle brackets</span>
          <Badge size="small" severity="secondary" value="<"></Badge>
          <Badge size="small" severity="secondary" value=">"></Badge>
        </label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox
          v-model="htmlAmpersand"
          :binary="true"
          inputId="sanitizeHtmlAmpersand"
        />
        <label
          for="sanitizeHtmlAmpersand"
          class="flex items-center gap-1"
        >
          <span>Ampersand</span>
          <Badge size="small" severity="secondary" value="&amp;"></Badge>
        </label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox
          v-model="htmlQuotes"
          :binary="true"
          inputId="sanitiseHtmlQuotes"
        />
        <label
          for="sanitiseHtmlQuotes"
          class="flex items-center gap-1"
        >
          <span>Double quotes</span>
          <Badge size="small" severity="secondary" value="&quot"/>
        </label>
      </div>
    </Fieldset>
    <Fieldset legend="String">
      <div class="flex items-center gap-2">
        <Checkbox
          v-model="stringQuotes"
          :binary="true"
          inputId="sanitiseStringQuotes"
        />
        <label
          for="sanitiseStringQuotes"
          class="flex items-center gap-1"
        >
          <span>Double quotes</span>
          <Badge size="small" severity="secondary" value="&quot;"/>
        </label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox
            v-model="stringSingleQuotes"
            :binary="true"
            inputId="sanitiseStringSQuotes"
            />
        <label
          for="sanitiseStringSQuotes"
          class="flex items-center gap-1"
        >
          <span>Single quotes </span>
          <Badge size="small" severity="secondary" value="'"/>
        </label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox
          v-model="stringBackslash"
          :binary="true"
          inputId="sanitiseStringBackslash"
        />
        <label
          for="sanitiseStringBackslash"
          class="flex items-center gap-1"
        >
          <span>Backslash</span>
          <Badge size="small" severity="secondary" value="\"/>
        </label>
      </div>
    </Fieldset>
  </Dialog>
</template>