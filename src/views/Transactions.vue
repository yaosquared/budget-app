<script setup>
import { computed, reactive, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { Icon } from "@iconify/vue";

import { fetchTransactions } from "../api/transactions";
import { TRANSACTION_COLUMNS } from "../constants/transactions";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";
import Table from "../components/ui/Table.vue";
import Modal from "../components/ui/Modal.vue";
import Input from "../components/ui/Input.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";

const isModalOpen = ref(false);
const isFeatureComingSoonModalOpen = ref(false);

const formData = reactive({
  type: "",
  amount: null,
});

const openFeatureComingSoonModal = () => {
  isModalOpen.value = false;
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
  resetForm();
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const resetForm = () => {
  formData.type = "";
  formData.amount = null;
};

const submitTransaction = () => {
  const payload = {
    ...formData,
    amount: Number(formData.amount),
  };

  // TODO: integrate post api route
  console.log("Submitting:", payload);
  closeModal();
};

const { data, isLoading, isError } = useQuery({
  queryKey: ["transactions"],
  queryFn: fetchTransactions,
});

const rows = computed(() => data.value ?? []);
</script>

<template>
  <Modal @closeModal="closeModal" v-if="isModalOpen">
    <form @submit.prevent="submitTransaction">
      <button @click="closeModal" class="close-btn" type="button">
        <Icon icon="lucide:x" width="18" height="18" />
      </button>
      <div class="form-header">
        <h4>New Transaction</h4>
        <p class="subtitle">Fill in the details below</p>
      </div>
      <div class="form-body">
        <Input
          label="Transaction Type"
          v-model="formData.type"
          placeholder="e.g. Income / Expense"
        />
        <Input
          label="Amount"
          type="number"
          v-model="formData.amount"
          placeholder="0.00"
        />
        <div class="form-actions">
          <!-- <button type="submit">Submit</button> -->
          <button @click="openFeatureComingSoonModal">Submit</button>
        </div>
      </div>
    </form>
  </Modal>
  <FeatureComingSoon
    v-if="isFeatureComingSoonModalOpen"
    @closeModal="closeFeatureComingSoonModal"
  />
  <section>
    <div class="header">
      <Title text="Transactions" />
      <Button
        @click="openModal"
        icon="lucide:circle-plus"
        text="New Transaction"
      />
    </div>
    <Table
      :columns="TRANSACTION_COLUMNS"
      :rows="rows"
      :isLoading="isLoading"
      :isError="isError"
      @edit="openFeatureComingSoonModal"
      @delete="openFeatureComingSoonModal"
    />
  </section>
</template>

<style scoped lang="scss">
form {
  position: relative;
  padding: 28px;
  border-radius: 14px;
  background: $white;
  width: 100%;
  max-width: 600px;

  .close-btn {
    all: unset;
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    display: grid;
    place-items: center;
    padding: 6px;
    border-radius: 8px;
    transition: 0.2s ease;

    &:hover {
      background: $black-opacity-06;
      transform: scale(1.05);
    }
  }

  .form-header {
    margin-bottom: 24px;

    h4 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: $black-900;
    }

    .subtitle {
      margin: 4px 0 0;
      font-size: 13px;
      color: $slate-500;
    }
  }

  .form-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-actions {
    margin-top: 6px;

    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, $indigo-700, $indigo-600);
      color: $white;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 20px rgba(79, 70, 229, 0.25);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

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
