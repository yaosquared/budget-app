<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Icon } from "@iconify/vue";

import {
  IAttendanceFilterForm,
  IAttendanceFilterFormData,
  IAttendanceFilterFormEmits,
} from "../../types/attendance";
import Modal from "../ui/Modal.vue";
import MultiSelectChips from "../ui/MultiSelectChips.vue";
import DateTimeRange from "../ui/DateTimeRange.vue";

const props = defineProps<IAttendanceFilterForm>();
const emit = defineEmits<IAttendanceFilterFormEmits>();

const selectedStatus = ref<string[]>([]);

const buttonStatusProperties = [
  {
    text: "Present",
    color: "#16a34a",
    bgColor: "rgba(22, 163, 74, 0.10)",
    isActive: { color: "#ffffff", bgColor: "#16a34a" },
  },
  {
    text: "Late",
    color: "#eab308",
    bgColor: "rgba(234, 179, 8, 0.12)",
    isActive: { color: "#ffffff", bgColor: "#eab308" },
  },
  {
    text: "Absent",
    color: "#dc2626",
    bgColor: "#fee2e2",
    isActive: { color: "#ffffff", bgColor: "#dc2626" },
  },
];

const formData = reactive<IAttendanceFilterFormData>({
  status: [],
  dateFrom: "",
  dateTo: "",
  timeInFrom: "",
  timeInTo: "",
  timeOutFrom: "",
  timeOutTo: "",
});

const timeOptions = computed(() => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const minute = m === 0 ? "00" : "30";
      const ampm = h < 12 ? "AM" : "PM";
      const value = `${String(h).padStart(2, "0")}:${minute}`;
      const label = `${hour}:${minute} ${ampm}`;
      options.push({ label, value });
    }
  }
  return options;
});

const resetForm = () => {
  selectedStatus.value = [];
  formData.status = [];
  formData.dateFrom = "";
  formData.dateTo = "";
  formData.timeInFrom = "";
  formData.timeInTo = "";
  formData.timeOutFrom = "";
  formData.timeOutTo = "";
};

const handleClose = () => {
  resetForm();
  emit("close");
};

const handleSubmit = () => {
  const payload = {
    ...formData,
    status: selectedStatus.value,
  };
  emit("submit", payload);
};
</script>

<template>
  <Modal v-if="isOpen" @closeModal="handleClose">
    <form @submit.prevent="handleSubmit">
      <button @click="handleClose" class="close-btn" type="button">
        <Icon icon="lucide:x" width="18" height="18" />
      </button>
      <div class="form-header">
        <h4>Filter Attendance</h4>
        <p class="subtitle">Fill in the details below</p>
      </div>
      <div class="form-body">
        <MultiSelectChips
          :data="buttonStatusProperties"
          v-model="selectedStatus"
        />
        <DateTimeRange
          type="date"
          label="Date Range"
          fromLabel="From"
          toLabel="To"
          v-model:fromValue="formData.dateFrom"
          v-model:toValue="formData.dateTo"
        />
        <DateTimeRange
          type="time"
          label="Time In Range"
          icon="lucide:clock-arrow-up"
          fromLabel="Start"
          toLabel="End"
          :options="timeOptions"
          v-model:from-value="formData.timeInFrom"
          v-model:to-value="formData.timeInTo"
        />
        <DateTimeRange
          type="time"
          label="Time Out Range"
          icon="lucide:clock-arrow-down"
          fromLabel="Start"
          toLabel="End"
          :options="timeOptions"
          v-model:from-value="formData.timeOutFrom"
          v-model:to-value="formData.timeOutTo"
        />
        <div class="form-actions">
          <button type="button" @click="handleSubmit">Apply Filters</button>
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
