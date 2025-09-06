<script setup lang="ts">
import { ref, nextTick } from 'vue';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  editing: boolean;
}

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
  emit('save', { ...props.task, text: newText || props.task.text });
};

const cancelEdit = () => {
  isEditing.value = false;
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

<style>
/* Estilos para o elemento <li> que encapsula cada tarefa */
#task-list li {
    background-color: var(--list-item-bg);
    padding: 10px;
    border: 1px solid var(--list-item-border);
    border-radius: 4px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    word-break: break-word; /* Garante que textos longos quebrem a linha */
    color: var(--text-color);
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Checkbox customizado para marcar tarefas como concluídas */
.task-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid var(--checkbox-border);
    background-color: var(--checkbox-bg);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}

.task-checkbox::before {
    content: '';
    display: none;
    width: 10px;
    height: 10px;
    background-color: var(--checkbox-checked-color);
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

.task-checkbox.checked::before {
    display: block;
}

/* Campo de input para edição */
.edit-input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid var(--input-border-color);
    border-radius: 4px;
    outline: none;
    background-color: var(--container-bg-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Texto da tarefa */
#task-list li .task-text {
    flex-grow: 1;
    text-align: left;
    cursor: pointer;
}

/* Ações da tarefa (botões de editar/salvar/excluir) */
#task-list .task-actions {
    display: flex;
    gap: 5px;
}

/* Estilos para tarefas concluídas */
#task-list li.completed .task-text {
    text-decoration: line-through;
    color: var(--completed-text-color);
}

#task-list li.completed {
    background-color: var(--completed-bg);
}

/* Botões de ação genéricos */
.delete-btn, .edit-btn, .save-btn {
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.delete-btn { background-color: var(--delete-btn-bg); }
.delete-btn:hover { background-color: var(--delete-btn-hover-bg); }

.edit-btn { background-color: var(--edit-btn-bg); }
.edit-btn:hover { background-color: var(--edit-btn-hover-bg); }

.save-btn { background-color: var(--save-btn-bg); }
.save-btn:hover { background-color: var(--save-btn-hover-bg); }

.save-btn svg, .edit-btn svg {
    width: 16px;
    height: 16px;
    fill: white;
}
</style>