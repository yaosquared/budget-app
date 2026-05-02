<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { fetchTransactions } from "../api/transactions";
import { TRANSACTION_COLUMNS } from "../constants/transactions";
import { ITransactionFormData, ITransactionsData } from "../types/transactions";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";
import Table from "../components/ui/Table.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";
import TransactionForm from "../components/modals/TransactionForm.vue";

const isTransactionFormModalOpen = ref(false);
const editingTransaction = ref<ITransactionsData | null>(null); // null = "new transaction", object = "edit transaction"
const isFeatureComingSoonModalOpen = ref(false);

const { data, isLoading, isError } = useQuery({
  queryKey: ["transactions"],
  queryFn: fetchTransactions,
});

const rows = computed(() => data.value ?? []);

const openNewTransactionModal = () => {
  editingTransaction.value = null;
  isTransactionFormModalOpen.value = true;
};

const openEditTransactionModal = (transaction: ITransactionsData) => {
  editingTransaction.value = transaction;
  isTransactionFormModalOpen.value = true;
};

const handleFormSubmit = (payload: ITransactionFormData) => {
  console.log("Submitting:", payload);

  if (payload.id) {
    // call update transaction api
    openFeatureComingSoonModal();
  } else {
    // call create transaction api
    openFeatureComingSoonModal();
  }
  closeFormModal();
};

const closeFormModal = () => {
  isTransactionFormModalOpen.value = false;
  editingTransaction.value = null;
};

const openFeatureComingSoonModal = () => {
  isTransactionFormModalOpen.value = false;
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
};
</script>

<template>
  <TransactionForm
    :isOpen="isTransactionFormModalOpen"
    :transaction="editingTransaction"
    @submit="handleFormSubmit"
    @close="closeFormModal"
  />
  <FeatureComingSoon
    v-if="isFeatureComingSoonModalOpen"
    @closeModal="closeFeatureComingSoonModal"
  />
  <section>
    <div class="header">
      <Title text="Transactions" />
      <Button
        @click="openNewTransactionModal"
        icon="lucide:circle-plus"
        text="New Transaction"
      />
    </div>
    <Table
      :columns="TRANSACTION_COLUMNS"
      :rows="rows"
      :isLoading="isLoading"
      :isError="isError"
      @edit="openEditTransactionModal"
      @delete="openFeatureComingSoonModal"
      page="transactions"
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
