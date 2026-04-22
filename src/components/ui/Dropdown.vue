<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";

type Option = {
  label: string;
  value: string;
};

const props = defineProps<{
  modelValue: string;
  options: Option[];
  label?: string;
  placeholder?: string;
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "toggle"): void;
}>();

const selectedLabel = computed(() => {
  return (
    props.options.find((o) => o.value === props.modelValue)?.label ||
    props.placeholder ||
    "Select"
  );
});

const select = (value: string) => {
  emit("update:modelValue", value);
  emit("toggle");
};
</script>

<template>
  <div class="dropdown" :class="{ open }">
    <label v-if="label">{{ label }}</label>

    <div class="box" @click="emit('toggle')">
      <span class="label-text">
        {{ selectedLabel }}
      </span>

      <Icon :icon="open ? 'lucide:chevron-up' : 'lucide:chevron-down'" />
    </div>

    <div v-if="open" class="menu">
      <div v-for="opt in options" :key="opt.value" @click="select(opt.value)">
        {{ opt.label }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
  }

  .box {
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #fafafa;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.2s ease;

    &:hover {
      border-color: #2563eb;
      background: #f5f9ff;
    }
  }

  .label-text {
    flex: 1;
    font-size: 14px;
    color: #111827;
  }

  .arrow {
    font-size: 12px;
    color: #9ca3af;
    transition: transform 0.2s ease;
  }

  &.open .arrow {
    transform: rotate(180deg);
  }

  .menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    z-index: 20;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);

    div {
      padding: 10px 12px;
      font-size: 14px;
      cursor: pointer;
      color: #374151;
      transition: 0.15s;
      white-space: nowrap;

      &:hover {
        background: #f3f6ff;
        color: #2563eb;
      }
    }
  }
}
</style>
