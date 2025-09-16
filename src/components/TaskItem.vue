<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { todoService } from "../services/todoService";
import type { Task } from "../types";

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  (e: "delete", id: number): void;
  (e: "toggle-complete", task: Task): void;
  (e: "save", task: Task): void;
}>();

const isEditing = ref(false);
const originalText = ref("");
// this will get a reference to the dom element once the component is mounted
const editInput = useTemplateRef("editInput");

const toggleComplete = async () => {
  try {
    await todoService.updateTask(props.task.id, {
      completed: !props.task.completed
    });
    emit("toggle-complete", props.task);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
  }
};

const deleteTask = async () => {
  try {
    await todoService.deleteTask(props.task.id);
    emit("delete", props.task.id);
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
  }
};

const editTask = () => {
  if (props.task.completed) return;
  originalText.value = props.task.task;
  isEditing.value = true;
};

const saveEdit = async () => {
  if (!isEditing.value) return;

  let newText = editInput.value?.value.trim();
  if (newText == null) {
    newText = originalText.value;
  }

  try {
    await todoService.updateTask(props.task.id, { task: newText });
    isEditing.value = false;
    emit("save", { ...props.task, task: newText });
  } catch (error) {
    console.error('Erro ao salvar tarefa:', error);
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  emit("save", { ...props.task, task: originalText.value });
};
</script>

<template>
  <li class="task-item">
    <input
      type="checkbox"
      :checked="task.completed"
      @change="toggleComplete"
      class="checkbox"
    />

    <input
      v-if="isEditing"
      type="text"
      :value="task.task"
      ref="editInput"
      @keyup.enter="saveEdit"
      @keyup.esc="cancelEdit"
      @blur="saveEdit"
      :class="{ completed: task.completed }"
    />
    <span
      v-else
      @dblclick="editTask"
      :class="{ completed: task.completed, editable: !task.completed }"
    >
      {{ task.task }}
    </span>

    <div class="actions">
      <button v-if="isEditing" @click="saveEdit">Save</button>
      <button v-else-if="!task.completed" @click="editTask">Edit</button>
      <button @click="deleteTask" class="delete">Delete</button>
    </div>
  </li>
</template>

<style scoped>
.task-item {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.checkbox {
  margin-right: 10px;
}

.completed {
  text-decoration: line-through;
}

.editable {
  cursor: pointer;
}

input[type="text"],
span {
  flex: 1;
}

.actions {
  display: flex;
  margin-left: auto;
}

button {
  padding: 5px 10px;
  margin-left: 5px;
}

.delete {
  background: #f44336;
  color: white;
  border: none;
}

.delete:hover {
  background: #d32f2f;
}
</style>
