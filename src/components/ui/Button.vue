<script setup>
const props = defineProps({
  text: String,
});
</script>

<template>
  <button>{{ text }}</button>
</template>

<style scoped lang="scss">
button {
  background-color: $black-900;
  color: $white;
  border: 1px solid $black-900;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.2px;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);

  &:hover {
    background-color: $black-950;
    border-color: $black-950;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    background-color: $black-800;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px $white-opacity-08,
      0 6px 14px rgba(0, 0, 0, 0.35);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}
</style>
