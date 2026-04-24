<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { fetchAttendance } from "../api/attendance";
import { formatDate, formatTime } from "../utils/dateTime";
import { ATTENDANCE_COLUMNS } from "../constants/attendance";
import Title from "../components/ui/Title.vue";
import Table from "../components/ui/Table.vue";
import Button from "../components/ui/Button.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";
import ConfirmationModal from "../components/modals/ConfirmationModal.vue";

const isFeatureComingSoonModalOpen = ref(false);
const isConfirmationModalOpen = ref(false);

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

const openConfirmationModal = () => {
  isConfirmationModalOpen.value = true;
};

const closeConfirmationModal = () => {
  isConfirmationModalOpen.value = false;
};

const openFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
};
</script>

<template>
  <ConfirmationModal
    v-if="isConfirmationModalOpen"
    title="Are you sure you want to time in?"
    subTitle="This action cannot be undone."
    @closeModal="closeConfirmationModal"
  />
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
          @click="openConfirmationModal"
        />
        <Button
          icon="lucide:filter"
          text="Filter"
          @click="openFeatureComingSoonModal"
        />
      </div>
    </div>

    <Table
      :columns="ATTENDANCE_COLUMNS"
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
