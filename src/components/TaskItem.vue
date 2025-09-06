<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
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

const deleteTask = () => {
  emit("delete", props.task.id);
};

const toggleComplete = () => {
  emit("toggle-complete", props.task);
};

const editTask = () => {
  if (props.task.completed) return;
  originalText.value = props.task.text;
  isEditing.value = true;
};

const saveEdit = () => {
  if (!isEditing.value) return;

  let newText = editInput.value?.value.trim();
  if (newText == null) {
    newText = originalText.value;
  }

  isEditing.value = false;
  emit("save", { ...props.task, text: newText });
};

const cancelEdit = () => {
  isEditing.value = false;
  //
  emit("save", { ...props.task, text: originalText.value });
};
</script>

<template>
  <!-- display flex makes the buttons side by side -->
  <li style="display: flex; gap: 10px">
    <div @click="toggleComplete" @keydown.space.prevent="toggleComplete"></div>

    <input
      v-if="isEditing"
      type="text"
      :value="task.text"
      ref="editInput"
      @keyup.enter="saveEdit"
      @keyup.esc="cancelEdit"
      @blur="saveEdit"
    />
    <span v-else @click="toggleComplete">{{ task.text }}</span>

    <div style="display: flex">
      <button v-if="isEditing" @click="saveEdit">Save</button>
      <button v-else @click="editTask">Edit</button>
      <button @click="deleteTask">Delete</button>
    </div>
  </li>
</template>
