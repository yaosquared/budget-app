<script setup>
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { fetchReportHistory } from "../api/reports";
import { reportsColumns } from "../constants/reports";
import Title from "../components/ui/Title.vue";
import Table from "../components/ui/Table.vue";
import Button from "../components/ui/Button.vue";

const { data, isLoading, isError } = useQuery({
  queryKey: ["reports"],
  queryFn: fetchReportHistory,
});

const rows = computed(() => data.value ?? []);
</script>

<template>
  <section>
    <div class="header">
      <Title text="Reports" />
      <Button icon="lucide:download" text="Export" />
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
