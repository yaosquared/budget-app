<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";
import { onClickOutside } from "@vueuse/core";

import { DAYS, HOURS, MINUTES, MONTHS, PERIODS } from "../../constants/ui";
import { IDropdown } from "../../types/ui";
import {
  getCalendarDays,
  getStartOfToday,
  parseISODate,
  toISODate,
} from "../../utils/dateTime";

const props = defineProps<IDropdown>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "toggle"): void;
}>();

const today = getStartOfToday();

const dropdownEl = ref<HTMLElement | null>(null);
const viewYear = ref(today.getFullYear());
const viewMonth = ref(today.getMonth());
const selectedHour = ref("12");
const selectedMinute = ref("00");
const selectedPeriod = ref("AM");

const isDate = computed(() => props.type === "date");
const isTime = computed(() => props.type === "time");

const selectedOptionLabel = computed(() => {
  if (isDate.value) return displayDate.value || props.placeholder;
  if (isTime.value) return displayTime.value || props.placeholder;
  return (
    props.options?.find((o) => o.value === props.modelValue)?.label ||
    props.placeholder
  );
});

const selectOptionValue = (value: string) => {
  emit("update:modelValue", value);
  emit("toggle");
};

const selectedDate = computed(() => parseISODate(props.modelValue));

const displayDate = computed(() => {
  if (!selectedDate.value) return "";
  return selectedDate.value.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});

const calendarDays = computed(() =>
  getCalendarDays(viewYear.value, viewMonth.value),
);

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

const selectDay = (date: Date) => {
  emit("update:modelValue", toISODate(date));
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
  (isOpen) => {
    if (!isOpen) return;

    if (isDate.value && selectedDate.value) {
      const date = selectedDate.value;
      viewYear.value = date.getFullYear();
      viewMonth.value = date.getMonth();
    }

    if (isTime.value) {
      syncTimeColumns();
    }
  },
);

const handleOutsideDropdownClick = (e: MouseEvent) => {
  if (
    props.open &&
    dropdownEl.value &&
    !dropdownEl.value.contains(e.target as Node)
  ) {
    emit("toggle");
  }
};

onClickOutside(dropdownEl, handleOutsideDropdownClick);

const displayTime = computed(() => {
  if (!props.modelValue) return "";
  const [h, m] = props.modelValue.split(":");
  if (!h || !m) return "";
  const hour = parseInt(h);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(displayHour).padStart(2, "0")}:${m} ${period}`;
});

const syncTimeColumns = () => {
  if (!props.modelValue) return;
  const [h, m] = props.modelValue.split(":");
  if (!h || !m) return;
  const hour = parseInt(h);
  selectedPeriod.value = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  selectedHour.value = String(h12).padStart(2, "0");
  selectedMinute.value = m;
};

const commitTime = () => {
  let h = parseInt(selectedHour.value);
  if (selectedPeriod.value === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  const value = `${String(h).padStart(2, "0")}:${selectedMinute.value}`;
  emit("update:modelValue", value);
};

const selectHour = (h: string) => {
  selectedHour.value = h;
  commitTime();
};
const selectMinute = (m: string) => {
  selectedMinute.value = m;
  commitTime();
};
const selectPeriod = (p: string) => {
  selectedPeriod.value = p;
  commitTime();
};

const clearTime = () => {
  emit("update:modelValue", "");
  if (props.open) emit("toggle");
};
</script>

<template>
  <div class="dropdown" :class="{ open }" ref="dropdownEl">
    <label v-if="label">{{ label }}</label>
    <div class="box" @click="emit('toggle')">
      <span class="label-text" :class="{ placeholder: !modelValue }">
        {{ selectedOptionLabel }}
      </span>
      <button
        v-if="(isDate || isTime) && modelValue"
        type="button"
        class="clear-btn"
        @click.stop="isTime ? clearTime() : clearDate()"
      >
        <Icon icon="lucide:x" width="11" height="11" />
      </button>
      <Icon
        :icon="open ? 'lucide:chevron-up' : 'lucide:chevron-down'"
        class="arrow"
      />
    </div>

    <!-- Regular select list -->
    <div v-if="open && !isDate && !isTime" class="menu">
      <div
        v-for="opt in options"
        :key="opt.value"
        @click="selectOptionValue(opt.value)"
      >
        {{ opt.label }}
      </div>
    </div>

    <!-- Date calendar -->
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
        <button type="button" class="footer-btn accent" @click="selectToday">
          Today
        </button>
      </div>
    </div>

    <!-- Time picker: 3 columns -->
    <div v-if="open && isTime" class="menu time-picker">
      <div class="col-headers">
        <span>Hour</span>
        <span></span>
        <span>Minute</span>
        <span></span>
        <span>Period</span>
      </div>
      <div class="time-columns">
        <!-- Hours -->
        <ul class="time-col">
          <li
            v-for="h in HOURS"
            :key="h"
            :class="{ selected: selectedHour === h }"
            @click="selectHour(h)"
          >
            {{ h }}
          </li>
        </ul>

        <span class="col-sep">:</span>

        <!-- Minutes -->
        <ul class="time-col">
          <li
            v-for="m in MINUTES"
            :key="m"
            :class="{ selected: selectedMinute === m }"
            @click="selectMinute(m)"
          >
            {{ m }}
          </li>
        </ul>

        <span class="col-sep"></span>

        <!-- AM / PM -->
        <ul class="time-col period-col">
          <li
            v-for="p in PERIODS"
            :key="p"
            :class="{ selected: selectedPeriod === p }"
            @click="selectPeriod(p)"
          >
            {{ p }}
          </li>
        </ul>
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
    top: 100%;
    left: 0;
    right: 0;
    background: $white;
    border: 1px solid $slate-200;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    z-index: 9999;
    box-shadow: 0 10px 25px $black-opacity-10;

    &.open-up {
      top: auto;
      bottom: calc(100% + 6px);
    }

    &:not(.calendar):not(.time-picker) {
      overflow-y: auto;
      max-height: 150px;
      scrollbar-width: thin;
      scrollbar-color: $slate-300 transparent;
      scrollbar-gutter: stable;

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
    justify-content: flex-end;
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

  .time-picker {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .col-headers {
      display: grid;
      grid-template-columns: 1fr 16px 1fr 16px 1fr;
      text-align: center;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: $gray-400;
      padding: 0 2px;
    }

    .time-columns {
      display: grid;
      grid-template-columns: 1fr 16px 1fr 16px 1fr;
      align-items: start;
    }

    .col-sep {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      padding-top: 8px;
      font-size: 14px;
      font-weight: 700;
      color: $gray-300;
      user-select: none;
    }

    .time-col {
      all: unset;
      display: flex;
      flex-direction: column;
      max-height: 160px;
      overflow-y: auto;
      scrollbar-width: none;
      border-radius: 8px;

      &::-webkit-scrollbar {
        display: none;
      }

      li {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 7px 4px;
        font-size: 14px;
        font-weight: 500;
        color: $gray-600;
        cursor: pointer;
        border-radius: 6px;
        transition:
          background-color 0.12s,
          color 0.12s;
        text-align: center;

        &:hover:not(.selected) {
          background: $blue-50;
          color: $blue-600;
        }

        &.selected {
          background: $blue-600;
          color: $white;
          font-weight: 700;
        }
      }
    }

    .period-col li {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    .time-footer {
      border-top: 1px solid $slate-100;
      padding-top: 10px;
      display: flex;
      justify-content: flex-end;

      .confirm-btn {
        all: unset;
        font-size: 12px;
        font-weight: 600;
        color: $white;
        background: $blue-600;
        cursor: pointer;
        padding: 5px 14px;
        border-radius: 6px;
        transition: background-color 0.15s;

        &:hover {
          background: $blue-700;
        }
      }
    }
  }
}
</style>
