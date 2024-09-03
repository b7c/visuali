<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
</script>

<template>
  <div class="container-lg p-4">
    <div class="d-flex flex-row gap-2 fs-3 align-items-center">
      <span class="kode text-secondary text-lowercase fs-1 text-bold">visuali</span>
      <div class="separator"></div>
      <a href="https://github.com/b7c/visuali" target="_blank" class="icon-link">
        <FontAwesomeIcon :icon="faGithub" class="text-secondary" />
      </a>
    </div>
    <p class="fs-4">
      Injection attack visualiser developed by
      <a href="https://b7c.io" target="_blank" class="text-secondary">rob</a>
    </p>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 0.2em;
  text-decoration-color: var(--bs-gray-700);
}

.separator {
  margin: 0 0.25em;
  display: block;
  height: 1em;
  border-right: 1px dotted gray;
}

.icon-link {
  transition: scale 0.2s;
}

.icon-link:hover {
  scale: 1.5;
}
</style>
