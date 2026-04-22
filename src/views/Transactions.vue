<script setup>
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { fetchTransactions } from "../api/transactions";
import { transactionColumns } from "../constants/transactions";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";
import Table from "../components/ui/Table.vue";

const { data, isLoading, isError } = useQuery({
  queryKey: ["transactions"],
  queryFn: fetchTransactions,
});

const rows = computed(() => data.value ?? []);
</script>

<template>
  <section>
    <div class="header">
      <Title text="Transactions" />
      <Button icon="lucide:circle-plus" text="New Transaction" />
    </div>
    <Table
      :columns="transactionColumns"
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
