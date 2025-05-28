<!-- src/App.vue -->
<template>
  <router-view />
</template>
<script setup lang="ts">
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  transition: all 0.3s ease;
}

.admin-theme {
  background-color: #f8f9fa;
  --primary-color: #3490dc;
  --secondary-color: #6574cd;
}

.student-theme {
  background-color: #f0fdf4;
  --primary-color: #10b981;
  --secondary-color: #059669;
}
</style>