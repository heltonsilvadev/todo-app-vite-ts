<script setup lang="ts">
import { ref, useTemplateRef, nextTick } from "vue";
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
    const updatedTask = await todoService.updateTask(props.task.id, {
      completed: !props.task.completed,
    });
    Object.assign(props.task, updatedTask);
    emit("toggle-complete", updatedTask);
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
  // Focus the input on next tick when DOM is updated
  nextTick(() => {
    editInput.value?.focus();
  });
};

const saveEdit = async () => {
  if (!isEditing.value) return;

  let newText = editInput.value?.value.trim();
  if (newText == null) {
    newText = originalText.value;
  }

  try {
    const updatedTask = await todoService.updateTask(props.task.id, { task: newText });
    isEditing.value = false;
    Object.assign(props.task, updatedTask);
    emit("save", updatedTask);
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
  gap: 15px;
  align-items: center;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #fff;
  transition: all 0.2s ease;
}

.task-item:hover {
  border-color: #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.editable {
  cursor: pointer;
  transition: color 0.2s ease;
}

.editable:hover {
  color: #667eea;
}

input[type="text"],
span {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  color: inherit;
}

input[type="text"]:focus {
  background: #f8f9ff;
  padding: 4px 8px;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 5px;
  margin-left: auto;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

.delete {
  background: #fee;
  color: #d32f2f;
}

.delete:hover {
  background: #fdd;
}
</style>
