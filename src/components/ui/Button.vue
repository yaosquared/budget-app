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
  background: $indigo-600-700;
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
  box-shadow: 0 2px 6px $black-opacity-06;

  &:hover {
    background: $indigo-700-600;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px $white-opacity-08,
      0 6px 14px $black-opacity-06;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}
</style>
