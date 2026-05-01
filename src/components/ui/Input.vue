<script setup lang="ts">
import { computed } from "vue";

import { IInput } from "../../types/ui";

const props = defineProps<IInput>();

const emit = defineEmits(["update:modelValue"]);

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <div class="input-group">
    <label v-if="label">{{ label }}</label>

    <input :type="type" v-model="inputValue" :placeholder="placeholder" />
  </div>
</template>

<style scoped lang="scss">
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: $black-800;
  }

  input {
    padding: 11px 12px;
    border: 1px solid $slate-200;
    border-radius: 10px;
    background: $slate-50;
    font-size: 14px;
    transition: all 0.2s ease;

    &::placeholder {
      color: $slate-400;
    }

    &:focus {
      outline: none;
      border-color: $indigo-600;
      background: $white;
      box-shadow: 0 0 0 2px rgba($indigo-600, 0.15);
    }

    &.error {
      border-color: $red-500;
      background: $white;
    }
  }

  .error-text {
    font-size: 12px;
    color: $red-500;
  }
}
</style>
