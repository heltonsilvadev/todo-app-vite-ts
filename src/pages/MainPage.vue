<script setup lang="ts">
import { ref, onMounted } from "vue";
import TaskItem from "../components/TaskItem.vue";
import type { Task } from "../types";

const tasks = ref<Task[]>([]);
const newTaskText = ref("");

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};

const addTask = () => {
  const text = newTaskText.value.trim();
  if (text === "") return;

  const newTask: Task = {
    id: Date.now(),
    text: text,
    completed: false,
    editing: false,
  };

  tasks.value.unshift(newTask);
  newTaskText.value = "";
  saveTasks();
};

const deleteTask = (taskId: number) => {
  tasks.value = tasks.value.filter((task) => task.id !== taskId);
  saveTasks();
};

const toggleTaskCompleted = (task: Task) => {
  if (task.editing) return;
  task.completed = !task.completed;
  saveTasks();
};

const handleSave = (taskToSave: Task) => {
  const task = tasks.value.find((t) => t.id === taskToSave.id);
  if (task) {
    task.text = taskToSave.text;
    task.editing = false;
    saveTasks();
  }
};

const loadState = () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    try {
      tasks.value = JSON.parse(savedTasks).map((task: Task) => ({
        ...task,
        editing: false,
      }));
    } catch (e) {
      console.error("Erro ao carregar tarefas do localStorage:", e);
      tasks.value = [];
    }
  }
};

onMounted(() => {
  loadState();
});
</script>

<template>
  <div>
    <h1>Minha Lista de Tarefas</h1>
  </div>

  <div>
    <form @submit.prevent="addTask">
      <input
        type="text"
        placeholder="Adicionar nova tarefa..."
        v-model="newTaskText"
      />
      <button type="submit">Adicionar</button>
    </form>
  </div>

  <ul v-if="tasks.length > 0">
    <task-item
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @delete="deleteTask"
      @toggle-complete="toggleTaskCompleted"
      @save="handleSave"
    ></task-item>
  </ul>
</template>
