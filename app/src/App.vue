<script setup lang="ts">
import Menubar from 'primevue/menubar'
</script>

<template>
  <div id="app" class="bg-slate-100">
    <Menubar class="m-2 mb-0">
      <template #start>
        <div class="kode text-lg select-none">visuali</div>
      </template>
    </Menubar>
    <div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.navbar-brand {
  text-transform: none;
}
</style>
