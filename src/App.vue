<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import TaskItem from './components/TaskItem.vue';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  editing: boolean;
}

const tasks = ref<Task[]>([]);
const newTaskText = ref('');
const isDarkMode = ref(false);
const currentTime = ref('');
let clockInterval: number | null = null;

const themeButtonText = computed(() => {
  return isDarkMode.value ? 'Modo Claro' : 'Dark Mode';
});

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value));
};

const saveTheme = () => {
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

const addTask = () => {
  const text = newTaskText.value.trim();
  if (text === '') return;

  const newTask: Task = {
    id: Date.now(),
    text: text,
    completed: false,
    editing: false,
  };

  tasks.value.unshift(newTask);
  newTaskText.value = '';
  saveTasks();
};

const deleteTask = (taskId: number) => {
  tasks.value = tasks.value.filter(task => task.id !== taskId);
  saveTasks();
};

const toggleTaskCompleted = (task: Task) => {
  if (task.editing) return;
  task.completed = !task.completed;
  saveTasks();
};

const handleSave = (taskToSave: Task) => {
  const task = tasks.value.find(t => t.id === taskToSave.id);
  if (task) {
    task.text = taskToSave.text;
    task.editing = false;
    saveTasks();
  }
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  saveTheme();
  document.body.classList.toggle('dark-mode', isDarkMode.value);
};

const updateClock = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;
};

const loadState = () => {
  const savedTheme = localStorage.getItem('theme');
  isDarkMode.value = savedTheme === 'dark';
  document.body.classList.toggle('dark-mode', isDarkMode.value);

  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    try {
      tasks.value = JSON.parse(savedTasks).map((task: Task) => ({ ...task, editing: false }));
    } catch (e) {
      console.error("Erro ao carregar tarefas do localStorage:", e);
      tasks.value = [];
    }
  }
};

onMounted(() => {
  loadState();
  updateClock();
  clockInterval = window.setInterval(updateClock, 1000);
});

onBeforeUnmount(() => {
  if (clockInterval) {
    clearInterval(clockInterval);
  }
});
</script>

<template>
  <div class="header">
    <h1>Minha Lista de Tarefas</h1>
    <button id="theme-toggle-btn" @click="toggleTheme">
      {{ themeButtonText }}
    </button>
  </div>

  <div class="input-area">
    <form @submit.prevent="addTask">
      <input type="text" id="task-input" placeholder="Adicionar nova tarefa..." v-model="newTaskText">
      <button id="add-task-btn" type="submit">Adicionar</button>
    </form>
  </div>

  <ul id="task-list" v-if="tasks.length > 0">
    <task-item
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @delete="deleteTask"
        @toggle-complete="toggleTaskCompleted"
        @save="handleSave"
    ></task-item>
  </ul>

  <div class="clock-container">
    <div class="clock-display">
      <svg class="clock-icon" viewBox="0 0 24 24"><path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"></path></svg>
      <span>{{ currentTime }}</span>
    </div>
  </div>
</template>

<style>
/*
 * ===============================================
 * ESTILOS GERAIS E VARIÁVEIS DE TEMA (CSS)
 * ===============================================
*/
:root {
    --bg-color: #f4f4f4;
    --container-bg-color: #fff;
    --text-color: #333;
    --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    --input-border-color: #ddd;
    --add-btn-bg: #007bff;
    --add-btn-hover-bg: #0056b3;
    --list-item-bg: #f9f9f9;
    --list-item-border: #eee;
    --completed-text-color: #888;
    --completed-bg: #e0e0e0;
    --edit-btn-bg: #28a745;
    --edit-btn-hover-bg: #218838;
    --delete-btn-bg: #dc3545;
    --delete-btn-hover-bg: #c82333;
    --theme-toggle-btn-bg: #6c757d;
    --theme-toggle-btn-hover-bg: #5a6268;
    --checkbox-border: #ccc;
    --checkbox-bg: #fff;
    --checkbox-checked-color: #28a745;
    --save-btn-bg: var(--add-btn-bg);
    --save-btn-hover-bg: var(--add-btn-hover-bg);
}

body.dark-mode {
    --bg-color: #2c2c2c;
    --container-bg-color: #3a3a3a;
    --text-color: #e0e0e0;
    --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    --input-border-color: #555;
    --add-btn-bg: #4a90e2;
    --add-btn-hover-bg: #357ABD;
    --list-item-bg: #4a4a4a;
    --list-item-border: #5a5a5a;
    --completed-text-color: #b0b0b0;
    --completed-bg: #5a5a5a;
    --edit-btn-bg: #34c759;
    --edit-btn-hover-bg: #2ca349;
    --delete-btn-bg: #e74c3c;
    --delete-btn-hover-bg: #c0392b;
    --theme-toggle-btn-bg: #495057;
    --theme-toggle-btn-hover-bg: #343a40;
    --checkbox-border: #777;
    --checkbox-bg: #444;
    --checkbox-checked-color: #34c759;
}

body {
    font-family: 'Roboto', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* Container principal da aplicação (usado pelo template do App.js) */
#app {
    background-color: var(--container-bg-color);
    padding: 30px;
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    width: 100%;
    max-width: 500px;
    text-align: center;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

h1 {
    color: var(--text-color);
    margin: 0;
}

#theme-toggle-btn {
    padding: 8px 12px;
    background-color: var(--theme-toggle-btn-bg);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#theme-toggle-btn:hover {
    background-color: var(--theme-toggle-btn-hover-bg);
}

.input-area {
    display: flex;
    margin-bottom: 30px;
}

.input-area form {
    display: flex;
    width: 100%;
}

#task-input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid var(--input-border-color);
    border-radius: 4px;
    outline: none;
    background-color: var(--container-bg-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

#task-input::placeholder {
    color: var(--text-color);
    opacity: 0.7;
}

#add-task-btn {
    padding: 10px 15px;
    background-color: var(--add-btn-bg);
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#add-task-btn:hover {
    background-color: var(--add-btn-hover-bg);
}

#task-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.clock-container {
    margin-top: 25px;
    display: flex;
    justify-content: flex-end;
}

.clock-display {
    color: var(--text-color);
    font-size: 0.9em;
    opacity: 0.8;
    background-color: var(--list-item-bg);
    padding: 5px 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.clock-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
}
</style>