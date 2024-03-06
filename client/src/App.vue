<script setup lang="ts"></script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow p-2">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand kode">visuali</router-link>
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
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item me-0">
            <router-link to="/about" class="nav-link">About</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container-fluid p-0">
    <RouterView />
  </div>
</template>

<style scoped>
.navbar-brand {
  text-transform: none;
}
</style>
