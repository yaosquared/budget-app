<script setup lang="ts">
import { reactive, ref } from "vue";
import { Icon } from "@iconify/vue";

import {
  IReportExportForm,
  IReportExportFormData,
  IReportExportFormEmits,
} from "../../types/reports";
import { FORMAT_OPTIONS, TYPE_OPTIONS } from "../../constants/reports";
import Modal from "../ui/Modal.vue";
import Dropdown from "../ui/Dropdown.vue";
import DateTimeRange from "../ui/DateTimeRange.vue";

const props = defineProps<IReportExportForm>();
const emit = defineEmits<IReportExportFormEmits>();

const openDropdown = ref<string | null>(null);

const formData = reactive<IReportExportFormData>({
  type: "",
  format: "",
  dateFrom: "",
  dateTo: "",
});

const errors = reactive({
  type: "",
  format: "",
});

const toggleDropdown = (key: string) => {
  openDropdown.value = openDropdown.value === key ? null : key;
};

const validate = () => {
  errors.type = formData.type ? "" : "Report type is required.";
  errors.format = formData.format ? "" : "Format is required.";
  return !errors.type && !errors.format;
};

const resetForm = () => {
  formData.type = "";
  formData.format = "";
  formData.dateFrom = "";
  formData.dateTo = "";
  errors.type = "";
  errors.format = "";
};

const handleClose = () => {
  resetForm();
  emit("close");
};

const handleSubmit = () => {
  if (!validate()) return;
  emit("submit", { ...formData });
};
</script>

<template>
  <Modal v-if="isOpen" @closeModal="handleClose">
    <form @submit.prevent="handleSubmit">
      <button @click="handleClose" class="close-btn" type="button">
        <Icon icon="lucide:x" width="18" height="18" />
      </button>
      <div class="form-header">
        <h4>Export Report</h4>
        <p class="subtitle">Fill in the details below</p>
      </div>
      <div class="form-body">
        <div class="group">
          <Dropdown
            v-model="formData.type"
            label="Report Type"
            :options="TYPE_OPTIONS"
            :open="openDropdown === 'type'"
            :error="errors.type"
            placeholder="Select report type"
            @toggle="toggleDropdown('type')"
          />
          <Dropdown
            v-model="formData.format"
            label="Format"
            :options="FORMAT_OPTIONS"
            :open="openDropdown === 'format'"
            :error="errors.format"
            placeholder="Select file format"
            @toggle="toggleDropdown('format')"
          />
        </div>
        <DateTimeRange
          type="date"
          label="Date Range"
          fromLabel="From"
          toLabel="To"
          v-model:fromValue="formData.dateFrom"
          v-model:toValue="formData.dateTo"
        />
        <div class="form-actions">
          <button type="button" @click="handleSubmit">Export Report</button>
        </div>
      </div>
    </form>
  </Modal>
</template>

<style scoped lang="scss">
form {
  position: relative;
  padding: 18px;
  border-radius: 14px;
  background: $white;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: $slate-300 transparent;

  .close-btn {
    all: unset;
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    display: grid;
    place-items: center;
    padding: 6px;
    border-radius: 8px;
    transition: 0.2s ease;

    &:hover {
      background: $black-opacity-06;
      transform: scale(1.05);
    }
  }

  .form-header {
    margin-bottom: 24px;

    h4 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: $black-900;
    }

    .subtitle {
      margin: 4px 0 0;
      font-size: 13px;
      color: $slate-500;
    }
  }

  .form-body {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .group {
      display: flex;
      gap: 16px;

      .dropdown {
        width: 50%;
      }
    }
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .group-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: $black-800;
      letter-spacing: 0.04em;
      text-transform: uppercase;

      svg {
        color: $indigo-600;
        flex-shrink: 0;
      }
    }
  }

  .range-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .range-divider {
    display: flex;
    align-items: center;
    color: $slate-400;
    flex-shrink: 0;
  }

  .range-field {
    flex: 1;
    display: flex;
    align-items: center;
    border: 1.5px solid $slate-200;
    border-radius: 10px;
    overflow: hidden;
    background: $white;
    transition:
      border-color 0.18s ease,
      box-shadow 0.18s ease;

    &:focus-within {
      border-color: $indigo-600;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }

    .range-tag {
      padding: 0 10px;
      font-size: 11px;
      font-weight: 700;
      color: $indigo-600;
      background: rgba(99, 102, 241, 0.07);
      border-right: 1.5px solid $slate-200;
      white-space: nowrap;
      align-self: stretch;
      display: flex;
      align-items: center;
      letter-spacing: 0.03em;
    }

    .date-time-input {
      flex: 1;
      min-width: 0;
      padding: 9px 10px;
      border: none;
      outline: none;
      background: transparent;
      font-size: 13px;
      font-weight: 500;
      color: $black-900;
      cursor: pointer;
      font-family: inherit;

      &::-webkit-calendar-picker-indicator {
        opacity: 0.5;
        cursor: pointer;
        transition: opacity 0.15s ease;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .form-actions {
    margin-top: 6px;

    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, $indigo-700, $indigo-600);
      color: $white;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 20px rgba(79, 70, 229, 0.25);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}
</style>
