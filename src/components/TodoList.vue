<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { todoService } from '../services/todoService'
import TaskItem from './TaskItem.vue'
import type { Task } from '../types'

const tasks = ref<Task[]>([])
const newTask = ref('')
const isLoading = ref(false)
const error = ref('')

const loadTasks = async () => {
  try {
    isLoading.value = true
    error.value = ''
    tasks.value = await todoService.getTasks()
  } catch (err) {
    error.value = 'Erro ao carregar tarefas.'
    tasks.value = []
  } finally {
    isLoading.value = false
  }
}

const addTask = async () => {
  if (!newTask.value.trim()) return
  try {
    const createdTask = await todoService.createTask(newTask.value)
    if (createdTask) {
      tasks.value.push(createdTask)
      newTask.value = ''
    }
  } catch (error) {
    // Silent fail for now
  }
}

const reloadTasks = async () => {
  await loadTasks()
}

onMounted(() => {
  loadTasks()
})
</script>

<template>
  <div class="todo-list">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="add-task">
      <input
        v-model="newTask"
        placeholder="Nova tarefa..."
        @keyup.enter="addTask"
        :disabled="isLoading"
      >
      <button @click="addTask" :disabled="isLoading">
        {{ isLoading ? 'Adicionando...' : 'Adicionar' }}
      </button>
    </div>

    <div v-if="isLoading" class="loading">Carregando tarefas...</div>

    <ul v-else>
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @delete="reloadTasks"
      />
    </ul>
  </div>
</template>

<style scoped>
.todo-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add-task {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 8px;
}

button {
  padding: 8px 16px;
}

ul {
  list-style: none;
  padding: 0;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #fcc;
}

.loading {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 20px;
}
</style>
