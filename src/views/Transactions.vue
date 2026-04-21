<script setup>
import { useQuery } from "@tanstack/vue-query";
import { fetchTransactions } from "../api/transactions";
import { computed } from "vue";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";
import Table from "../components/ui/Table.vue";

const { data, isLoading, isError } = useQuery({
  queryKey: ["transactions"],
  queryFn: fetchTransactions,
});

const rows = computed(() => data.value ?? []);

const transactionColumns = [
  { key: "id", label: "ID" },
  { key: "user_id", label: "User ID" },
  { key: "type", label: "Transaction Type" },
  { key: "amount", label: "Amount" },
];
</script>

<template>
  <section>
    <div class="controls">
      <Title text="Transactions" />
      <Button text="New Transaction" />
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
  gap: 10px;
  height: 100%;

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
