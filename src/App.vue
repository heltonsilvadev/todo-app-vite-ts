

<template>
  <div class="app">
    <header>
      <h1>📝 Minha Lista de Tarefas</h1>
      <p>Organize suas tarefas de forma simples e eficiente</p>
    </header>

    <Navbar />

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

header p {
  margin: 0;
  font-size: 1.1em;
  opacity: 0.9;
}

main {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
}
</style>
