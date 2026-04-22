<script setup lang="ts">
import { ref } from "vue";
import Dropdown from "../components/ui/Dropdown.vue";

const exportType = ref("sales");
const exportFormat = ref("csv");
const dateRange = ref("today");

const openDropdown = ref<string | null>(null);

const toggleDropdown = (key: string) => {
  openDropdown.value = openDropdown.value === key ? null : key;
};

const handleExport = () => {
  console.log({
    exportType: exportType.value,
    exportFormat: exportFormat.value,
    dateRange: dateRange.value,
  });
};

const typeOptions = [
  { label: "Sales", value: "sales" },
  { label: "Inventory", value: "inventory" },
  { label: "Users", value: "users" },
];

const formatOptions = [
  { label: "CSV", value: "csv" },
  { label: "Excel", value: "excel" },
  { label: "PDF", value: "pdf" },
];

const rangeOptions = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "All Time", value: "all" },
];
</script>

<template>
  <div class="export-card">
    <div class="grid">
      <Dropdown
        v-model="exportType"
        label="Report Type"
        :options="typeOptions"
        :open="openDropdown === 'type'"
        @toggle="toggleDropdown('type')"
      />

      <Dropdown
        v-model="exportFormat"
        label="Format"
        :options="formatOptions"
        :open="openDropdown === 'format'"
        @toggle="toggleDropdown('format')"
      />

      <Dropdown
        v-model="dateRange"
        label="Date Range"
        :options="rangeOptions"
        :open="openDropdown === 'range'"
        @toggle="toggleDropdown('range')"
      />
    </div>

    <div class="actions">
      <button class="btn" @click="handleExport">Export Report</button>
    </div>
  </div>
</template>
