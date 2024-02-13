<script setup lang="ts"></script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow p-2">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">visuali</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0"></ul>
      </div>
    </div>
  </nav>
  <div class="container-fluid">
    <RouterView />
  </div>
</template>

<style scoped>
.navbar-brand {
  text-transform: none;
}
</style>
