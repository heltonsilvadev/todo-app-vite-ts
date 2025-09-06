<script setup lang="ts">
import { ref, nextTick } from 'vue';
import type { Task } from '../types';

const props = defineProps<{
  task: Task
}>();

const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'toggle-complete', task: Task): void
  (e: 'save', task: Task): void
}>();

const isEditing = ref(false);
const originalText = ref('');
const editInput = ref<HTMLInputElement | null>(null);

const deleteTask = () => {
  emit('delete', props.task.id);
};

const toggleComplete = () => {
  emit('toggle-complete', props.task);
};

const editTask = () => {
  if (props.task.completed) return;
  originalText.value = props.task.text;
  isEditing.value = true;

  nextTick(() => {
    editInput.value?.focus();
  });
};

const saveEdit = () => {
  if (!isEditing.value) return;

  let newText = editInput.value?.value.trim();
  if (newText === '') {
    newText = originalText.value;
  }

  isEditing.value = false;
  emit('save', { ...props.task, text: newText });
};

const cancelEdit = () => {
  isEditing.value = false;
  // Revert to original text
  emit('save', { ...props.task, text: originalText.value });
};
</script>

<template>
  <li :class="{ 'completed': task.completed }">
    <div
        class="task-checkbox"
        :class="{ 'checked': task.completed }"
        @click="toggleComplete"
        role="checkbox"
        :aria-checked="task.completed"
        tabindex="0"
        @keydown.space.prevent="toggleComplete"
    ></div>

    <input
        v-if="isEditing"
        type="text"
        class="edit-input"
        :value="task.text"
        ref="editInput" @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @blur="saveEdit"
    >
    <span v-else class="task-text" @click="toggleComplete">{{ task.text }}</span>

    <div class="task-actions">
      <button v-if="isEditing" class="save-btn" @click="saveEdit" aria-label="Salvar edição da tarefa">
        <svg viewBox="0 0 24 24"><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"></path></svg>
      </button>
      <button v-else class="edit-btn" @click="editTask" aria-label="Editar tarefa">
        <svg viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6.02 20.71,5.63L18.37,3.29C17.98,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path></svg>
      </button>
      <button class="delete-btn" @click="deleteTask" aria-label="Excluir tarefa">X</button>
    </div>
  </li>
</template>

