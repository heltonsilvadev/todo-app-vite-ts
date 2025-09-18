<template>
  <div class="main-page">
    <h1>Todo App</h1>
    <TodoList />
  </div>
</template>

<script setup lang="ts">
import TodoList from '../components/TodoList.vue'
</script>

<style scoped>
.main-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  text-align: center;
}
</style>
