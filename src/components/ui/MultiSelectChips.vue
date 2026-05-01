<script setup lang="ts">
import { IMultiSelectChips } from "../../types/ui";

const props = defineProps<IMultiSelectChips>();

const emit = defineEmits(["update:modelValue"]);

const toggle = (value: string) => {
  const current = [...props.modelValue];

  if (current.includes(value)) {
    emit(
      "update:modelValue",
      current.filter((v) => v !== value),
    );
  } else {
    emit("update:modelValue", [...current, value]);
  }
};

const isActive = (value: string) => props.modelValue.includes(value);
</script>

<template>
  <div class="input-group">
    <label>Status</label>
    <div class="btn-group">
      <button
        v-for="item in data"
        :key="item.text"
        type="button"
        @click="toggle(item.text)"
        :class="{ active: isActive(item.text) }"
        :style="
          isActive(item.text)
            ? {
                color: item.isActive.color,
                background: item.isActive.bgColor,
                borderColor: item.isActive.color,
              }
            : {
                color: item.color,
                background: item.bgColor,
                borderColor: item.color,
              }
        "
      >
        {{ item.text }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: $black-800;
  }

  .btn-group {
    display: flex;
    gap: 10px;

    button {
      all: unset;
      border-radius: 50px;
      padding: 5px 15px;
      border: 1px solid $slate-300;
      cursor: pointer;
      color: $slate-600;
      transition: 0.2s ease;

      &.active {
        font-weight: 600;
      }
    }
  }
}
</style>
