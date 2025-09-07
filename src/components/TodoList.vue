<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { todoService } from '../services/todoService.ts'
import TaskItem from './TaskItem.vue'
import type { Task } from '../types'

const tasks = ref<Task[]>([])
const newTask = ref('')

const loadTasks = async () => {
  try {
    tasks.value = await todoService.getTasks()
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error)
  }
}

const addTask = async () => {
  if (!newTask.value.trim()) return

  try {
    await todoService.createTask(newTask.value)
    newTask.value = ''
    await loadTasks()
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error)
  }
}

onMounted(() => {
  loadTasks()
})
</script>

<template>
  <div class="todo-list">
    <h1>Lista de Tarefas</h1>
    
    <div class="add-task">
      <input 
        v-model="newTask"
        placeholder="Nova tarefa..."
        @keyup.enter="addTask"
      >
      <button @click="addTask">Adicionar</button>
    </div>

    <ul>
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @delete="loadTasks"
        @toggle-complete="loadTasks"
        @save="loadTasks"
      />
    </ul>
  </div>
</template>
