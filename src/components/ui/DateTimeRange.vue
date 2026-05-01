<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

import Dropdown from "./Dropdown.vue";
import { IDateTimeRange } from "../../types/ui";

const props = defineProps<IDateTimeRange>();

const emit = defineEmits<{
  "update:fromValue": [value: string];
  "update:toValue": [value: string];
}>();

const fromOpen = ref(false);
const toOpen = ref(false);

const toggleFrom = () => {
  fromOpen.value = !fromOpen.value;
  if (fromOpen.value) toOpen.value = false;
};

const toggleTo = () => {
  toOpen.value = !toOpen.value;
  if (toOpen.value) fromOpen.value = false;
};
</script>

<template>
  <div class="range-group">
    <label v-if="label" class="group-label">
      {{ label }}
    </label>

    <div class="range-row">
      <Dropdown
        class="range-dropdown"
        :type="type"
        :options="options"
        :placeholder="fromLabel"
        :open="fromOpen"
        :model-value="fromValue"
        @update:model-value="emit('update:fromValue', $event)"
        @toggle="toggleFrom"
      />

      <span class="range-divider">
        <Icon icon="lucide:arrow-right" width="14" height="14" />
      </span>

      <Dropdown
        class="range-dropdown"
        :type="type"
        :options="options"
        :placeholder="toLabel"
        :open="toOpen"
        :model-value="toValue"
        @update:model-value="emit('update:toValue', $event)"
        @toggle="toggleTo"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.range-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: $black-800;
  letter-spacing: 0.04em;

  svg {
    color: $indigo-600;
    flex-shrink: 0;
  }
}

.range-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.range-dropdown {
  flex: 1;
  min-width: 0;
}

.range-divider {
  display: flex;
  align-items: center;
  color: $slate-400;
  flex-shrink: 0;
  margin-top: 10px;
}
</style>
