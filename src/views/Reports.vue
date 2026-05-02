<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { fetchReportHistory } from "../api/reports";
import { REPORTS_COLUMNS } from "../constants/reports";
import { formatDateTime } from "../utils/dateTime";
import { IReportExportFormData } from "../types/reports";
import Title from "../components/ui/Title.vue";
import Table from "../components/ui/Table.vue";
import Button from "../components/ui/Button.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";
import ReportExportForm from "../components/modals/ReportExportForm.vue";

const isExportReportModalOpen = ref(false);
const isFeatureComingSoonModalOpen = ref(false);

const { data, isLoading, isError } = useQuery({
  queryKey: ["reports"],
  queryFn: fetchReportHistory,
});

const rows = computed(() => {
  return (data.value ?? []).map((item) => ({
    ...item,
    exported_date: formatDateTime(item.exported_date),
  }));
});

const openExportReportModal = () => {
  isExportReportModalOpen.value = true;
};

const handleExportSubmit = (payload: IReportExportFormData) => {
  console.log("Exporting:", payload);
  // TODO: integrate export api
  openFeatureComingSoonModal();
  closeExportModal();
};

const closeExportModal = () => {
  isExportReportModalOpen.value = false;
};

const openFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
};
</script>

<template>
  <ReportExportForm
    :isOpen="isExportReportModalOpen"
    @submit="handleExportSubmit"
    @close="closeExportModal"
  />
  <FeatureComingSoon
    v-if="isFeatureComingSoonModalOpen"
    @closeModal="closeFeatureComingSoonModal"
  />
  <section>
    <div class="header">
      <Title text="Reports" />
      <Button
        icon="lucide:download"
        text="Export"
        @click="openExportReportModal"
      />
    </div>
    <Table
      :columns="REPORTS_COLUMNS"
      :rows="rows"
      :isLoading="isLoading"
      :isError="isError"
      page="reports"
    />
  </section>
</template>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
