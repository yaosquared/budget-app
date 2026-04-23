<script setup>
import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { fetchReportHistory } from "../api/reports";
import { reportsColumns } from "../constants/reports";
import { formatDateTime } from "../utils/dateTime";
import Title from "../components/ui/Title.vue";
import Table from "../components/ui/Table.vue";
import Button from "../components/ui/Button.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";

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
      <Title text="Reports" />
      <Button
        icon="lucide:download"
        text="Export"
        @click="openFeatureComingSoonModal"
      />
    </div>

    <Table
      :columns="reportsColumns"
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
  gap: 20px;
  height: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
