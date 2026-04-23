<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { fetchAttendance } from "../api/attendance";
import { formatDate, formatTime } from "../utils/dateTime";
import { attendanceColumns } from "../constants/attendance";
import Title from "../components/ui/Title.vue";
import Table from "../components/ui/Table.vue";
import Button from "../components/ui/Button.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";

const isFeatureComingSoonModalOpen = ref(false);

const { data, isLoading, isError } = useQuery({
  queryKey: ["transactions"],
  queryFn: fetchAttendance,
});

const rows = computed(() => {
  return (data.value ?? []).map((item: any) => ({
    ...item,
    attendance_date: formatDate(item.attendance_date),
    time_in: formatTime(item.time_in),
    time_out: formatTime(item.time_out),
  }));
});

const openFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
};
</script>

<template>
  <FeatureComingSoon
    v-if="isFeatureComingSoonModalOpen"
    @closeModal="closeFeatureComingSoonModal"
  />
  <section>
    <div class="header">
      <Title text="Attendance" />
      <div class="controls">
        <Button
          icon="lucide:clock-plus"
          text="Time In"
          @click="openFeatureComingSoonModal"
        />
        <Button
          icon="lucide:filter"
          text="Filter"
          @click="openFeatureComingSoonModal"
        />
      </div>
    </div>

    <Table
      :columns="attendanceColumns"
      :rows="rows"
      :isLoading="isLoading"
      :isError="isError"
    />
  </section>
</template>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .controls {
    display: flex;
    gap: 10px;
  }

  .search {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    outline: none;

    &:focus {
      border-color: #3b82f6;
    }
  }
}
</style>
