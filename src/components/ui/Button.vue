<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  text: String,
  icon: String,
});
</script>

<template>
  <button>
    <Icon :icon="icon" width="18" height="18" />
    <span>{{ text }}</span>
  </button>
</template>

<style scoped lang="scss">
button {
  background: linear-gradient(135deg, $indigo-600, $indigo-700);
  color: $white;
  border: 1px solid transparent;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: $indigo-700;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px $white-opacity-08,
      0 6px 14px rgba(0, 0, 0, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}
</style>
