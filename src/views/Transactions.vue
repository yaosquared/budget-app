<script setup lang="ts">
import { computed, ref } from "vue";
import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";

import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from "../api/transactions";
import { TRANSACTION_COLUMNS } from "../constants/transactions";
import { ITransactionFormData, ITransactionsData } from "../types/transactions";
import { optimisticUpdateInfinite } from "../utils/optimistic";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";
import Table from "../components/ui/Table.vue";
import TransactionForm from "../components/modals/TransactionForm.vue";

const queryClient = useQueryClient();
const isTransactionFormModalOpen = ref(false);
const editingTransaction = ref<ITransactionsData | null>(null); // null = "new transaction", object = "edit transaction"

const { data, isLoading, isError, isFetching, hasNextPage, fetchNextPage } =
  useInfiniteQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
  });

const rows = computed(() => data.value?.pages.flatMap((p) => p.data) ?? []);

const openNewTransactionModal = () => {
  editingTransaction.value = null;
  isTransactionFormModalOpen.value = true;
};

const openEditTransactionModal = (transaction: ITransactionsData) => {
  editingTransaction.value = transaction;
  isTransactionFormModalOpen.value = true;
};

const handleFormSubmit = async (payload: ITransactionFormData) => {
  // create
  if (!payload.id) {
    const tempId = crypto.randomUUID();

    const optimisticTransaction = {
      ...payload,
      id: tempId,
    };

    const { rollback } = optimisticUpdateInfinite({
      queryClient,
      queryKey: ["transactions"],
      update: (old: any) => ({
        ...old,
        pages: [
          {
            ...old.pages[0],
            data: [optimisticTransaction, ...old.pages[0].data],
          },
          ...old.pages.slice(1),
        ],
      }),
    });

    try {
      const res = await createTransaction(payload);
      const realTransaction = res.data;

      queryClient.setQueryData(["transactions"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((t: any) =>
              t.id === tempId ? realTransaction : t,
            ),
          })),
        };
      });
    } catch (err) {
      rollback();
    }

    closeFormModal();
    return;
  }

  // update
  const { rollback } = optimisticUpdateInfinite({
    queryClient,
    queryKey: ["transactions"],
    update: (old: any) => ({
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: page.data.map((t: ITransactionsData) =>
          t.id === payload.id ? { ...t, ...payload } : t,
        ),
      })),
    }),
  });

  try {
    await updateTransaction(payload);
  } catch (err) {
    rollback();
  }

  closeFormModal();
};

const handleDeleteTransaction = async (id: string) => {
  const { rollback } = optimisticUpdateInfinite({
    queryClient,
    queryKey: ["transactions"],
    update: (old) => ({
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        data: page.data.filter((t: any) => t.id !== id),
      })),
    }),
  });

  try {
    await deleteTransaction(id);
  } catch {
    rollback();
  }
};

const closeFormModal = () => {
  isTransactionFormModalOpen.value = false;
  editingTransaction.value = null;
};
</script>

<template>
  <TransactionForm
    :key="editingTransaction?.id ?? 'new'"
    :isOpen="isTransactionFormModalOpen"
    :transaction="editingTransaction"
    @submit="handleFormSubmit"
    @close="closeFormModal"
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
      :isFetching="isFetching"
      :isError="isError"
      :hasNextPage="hasNextPage"
      @edit="openEditTransactionModal"
      @delete="handleDeleteTransaction"
      @loadMore="fetchNextPage"
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
