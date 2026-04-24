<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";

import { DAYS, MONTHS } from "../../constants/ui";
import { Option } from "../../types/ui";

const props = defineProps<{
  modelValue: string;
  options?: Option[];
  label?: string;
  placeholder?: string;
  open: boolean;
  type?: "select" | "date";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "toggle"): void;
}>();

const isDate = computed(() => props.type === "date");

const selectedLabel = computed(() => {
  if (isDate.value)
    return displayDate.value || props.placeholder || "Select a date";
  return (
    props.options?.find((o) => o.value === props.modelValue)?.label ||
    props.placeholder ||
    "Select"
  );
});

const select = (value: string) => {
  emit("update:modelValue", value);
  emit("toggle");
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const viewYear = ref(today.getFullYear());
const viewMonth = ref(today.getMonth());

const selectedDate = computed(() => {
  if (!props.modelValue) return null;
  const d = new Date(`${props.modelValue}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
});

const displayDate = computed(() => {
  if (!selectedDate.value) return "";
  return selectedDate.value.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});

const calendarDays = computed(() => {
  const year = viewYear.value;
  const month = viewMonth.value;
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = first - 1; i >= 0; i--)
    cells.push({
      date: new Date(year, month - 1, daysInPrev - i),
      inMonth: false,
    });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(year, month, d), inMonth: true });
  let t = 1;
  while (cells.length < 42)
    cells.push({ date: new Date(year, month + 1, t++), inMonth: false });

  return cells;
});

const prevMonth = () => {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value--;
  } else viewMonth.value--;
};
const nextMonth = () => {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value++;
  } else viewMonth.value++;
};

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const selectDay = (date: Date) => {
  emit("update:modelValue", toISO(date));
  emit("toggle");
};

const clearDate = () => {
  emit("update:modelValue", "");
  if (props.open) emit("toggle");
};

const selectToday = () => selectDay(today);

const isSelected = (d: Date) =>
  selectedDate.value?.toDateString() === d.toDateString();
const isToday = (d: Date) => today.toDateString() === d.toDateString();

watch(
  () => props.open,
  (val) => {
    if (val && isDate.value && selectedDate.value) {
      viewYear.value = selectedDate.value.getFullYear();
      viewMonth.value = selectedDate.value.getMonth();
    }
  },
);
</script>

<template>
  <div class="dropdown" :class="{ open }">
    <label v-if="label">{{ label }}</label>
    <div class="box" @click="emit('toggle')">
      <Icon
        v-if="isDate"
        icon="lucide:calendar"
        width="15"
        height="15"
        class="cal-icon"
        :class="{ placeholder: !modelValue }"
      />
      <span class="label-text" :class="{ placeholder: !modelValue }">
        {{ selectedLabel }}
      </span>
      <button
        v-if="isDate && modelValue"
        type="button"
        class="clear-btn"
        @click.stop="clearDate"
      >
        <Icon icon="lucide:x" width="11" height="11" />
      </button>
      <Icon
        :icon="open ? 'lucide:chevron-up' : 'lucide:chevron-down'"
        class="arrow"
      />
    </div>
    <div v-if="open && !isDate" class="menu">
      <div v-for="opt in options" :key="opt.value" @click="select(opt.value)">
        {{ opt.label }}
      </div>
    </div>
    <div v-if="open && isDate" class="menu calendar">
      <div class="cal-header">
        <span class="month-label">{{ MONTHS[viewMonth] }} {{ viewYear }}</span>
        <div class="nav">
          <button type="button" @click="prevMonth">
            <Icon icon="lucide:chevron-left" width="13" height="13" />
          </button>
          <button type="button" @click="nextMonth">
            <Icon icon="lucide:chevron-right" width="13" height="13" />
          </button>
        </div>
      </div>
      <div class="cal-grid">
        <span class="day-label" v-for="d in DAYS" :key="d">{{ d }}</span>
        <button
          v-for="(cell, i) in calendarDays"
          :key="i"
          type="button"
          class="day-cell"
          :class="{
            'out-month': !cell.inMonth,
            selected: isSelected(cell.date),
            today: isToday(cell.date) && !isSelected(cell.date),
          }"
          @click="selectDay(cell.date)"
        >
          {{ cell.date.getDate() }}
        </button>
      </div>
      <div class="cal-footer">
        <button type="button" class="footer-btn" @click="clearDate">
          Clear
        </button>
        <button type="button" class="footer-btn accent" @click="selectToday">
          Today
        </button>
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
    color: $gray-500;
  }

  .box {
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid $slate-200;
    background: $gray-50;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;

    &:hover {
      border-color: $blue-600;
      background: $blue-50;
    }

    .cal-icon {
      flex-shrink: 0;
      color: $blue-600;

      &.placeholder {
        color: $gray-400;
      }
    }

    .label-text {
      flex: 1;
      font-size: 14px;
      color: $black-900;

      &.placeholder {
        color: $gray-400;
      }
    }

    .arrow {
      flex-shrink: 0;
      color: $gray-400;
    }

    .clear-btn {
      all: unset;
      flex-shrink: 0;
      display: grid;
      place-items: center;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      background: $slate-200;
      color: $gray-500;
      cursor: pointer;
      transition: background-color 0.15s;

      &:hover {
        background: $gray-300;
      }
    }
  }

  .menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: $white;
    border: 1px solid $slate-200;
    border-radius: 12px;
    z-index: 50;
    box-shadow: 0 10px 25px $black-opacity-10;

    &:not(.calendar) {
      overflow-y: auto;
      max-height: 150px;
      scrollbar-width: thin;
      scrollbar-color: $slate-300 transparent;

      div {
        padding: 10px 12px;
        font-size: 14px;
        cursor: pointer;
        color: $gray-700;
        transition: 0.15s;
        white-space: nowrap;

        &:hover {
          background: $blue-50;
          color: $blue-600;
        }
      }
    }
  }

  .calendar {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .month-label {
      font-size: 13px;
      font-weight: 700;
      color: $black-900;
    }

    .nav {
      display: flex;
      gap: 2px;

      button {
        all: unset;
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        color: $gray-500;
        cursor: pointer;
        transition: background-color 0.15s;

        &:hover {
          background: $slate-100;
          color: $black-900;
        }
      }
    }
  }

  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;

    .day-label {
      font-size: 10px;
      font-weight: 600;
      color: $gray-400;
      text-align: center;
      padding: 3px 0;
      letter-spacing: 0.04em;
    }

    .day-cell {
      all: unset;
      display: grid;
      place-items: center;
      aspect-ratio: 1;
      border-radius: 6px;
      font-size: 13px;
      color: $gray-700;
      cursor: pointer;
      transition:
        background-color 0.1s,
        color 0.1s;

      &:hover:not(.selected) {
        background: $blue-50;
        color: $blue-600;
      }

      &.out-month {
        color: $gray-300;
      }

      &.today {
        font-weight: 700;
        color: $blue-600;
        background: $blue-50;
      }

      &.selected {
        background: $blue-600;
        color: $white;
        font-weight: 700;
      }
    }
  }

  .cal-footer {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid $slate-100;
    padding-top: 10px;

    .footer-btn {
      all: unset;
      font-size: 12px;
      font-weight: 600;
      color: $gray-500;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      transition:
        background-color 0.15s,
        color 0.15s;

      &:hover {
        background: $slate-100;
        color: $black-900;
      }

      &.accent {
        color: $blue-600;

        &:hover {
          background: $blue-50;
        }
      }
    }
  }
}
</style>
