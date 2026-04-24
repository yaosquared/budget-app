<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { fetchBudgets } from "../api/budget";
import { BUDGET_COLUMNS, MONTH_OPTIONS } from "../constants/budget";
import Table from "../components/ui/Table.vue";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";
import Modal from "../components/ui/Modal.vue";
import Input from "../components/ui/Input.vue";
import Dropdown from "../components/ui/Dropdown.vue";

const isModalOpen = ref(false);
const isFeatureComingSoonModalOpen = ref(false);

const formData = reactive({
  category: "",
  month: "",
  budget: null,
});

const { data, isLoading, isError } = useQuery({
  queryKey: ["budgets"],
  queryFn: fetchBudgets,
});

const rows = computed(() => {
  return (data.value ?? []).map((item) => {
    const budget = Number(item.budget || 0);
    const spent = Number(item.spent || 0);
    const remaining = budget - spent;

    let status = "healthy";

    if (remaining < 0) {
      status = "over";
    } else if (spent / budget >= 0.8) {
      status = "warning";
    }

    return {
      ...item,
      remaining,
      status,
    };
  });
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const resetForm = () => {
  formData.category = "";
  formData.month = "";
  formData.budget = null;
};

const submitBudget = () => {
  const payload = {
    ...formData,
    amount: Number(formData.budget),
  };

  // TODO: integrate post api route
  console.log("Submitting:", payload);
  closeModal();
};

const openFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
};

const openDropdown = ref<string | null>(null);

const toggleDropdown = (id: string) => {
  openDropdown.value = openDropdown.value === id ? null : id;
};
</script>

<template>
  <Modal @closeModal="closeModal" v-if="isModalOpen">
    <form @submit.prevent="submitBudget">
      <button @click="closeModal" class="close-btn" type="button">
        <Icon icon="lucide:x" width="18" height="18" />
      </button>
      <div class="form-header">
        <h4>New Budget</h4>
        <p class="subtitle">Fill in the details below</p>
      </div>
      <div class="form-body">
        <Input
          label="Category"
          v-model="formData.category"
          placeholder="e.g. Food / Transport"
        />
        <div class="input-group">
          <label>Month</label>
          <Dropdown
            v-model="formData.month"
            :options="MONTH_OPTIONS"
            placeholder="Select Month"
            :open="openDropdown === 'month'"
            @toggle="toggleDropdown('month')"
          />
        </div>
        <Input
          label="Budget"
          type="number"
          v-model="formData.budget"
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
      <Title text="Budget" />
      <Button icon="lucide:circle-plus" text="New Budget" @click="openModal" />
    </div>
    <div class="content">
      <Table
        :columns="BUDGET_COLUMNS"
        :rows="rows"
        :isLoading="isLoading"
        :isError="isError"
        @click="openFeatureComingSoonModal"
      />
    </div>
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

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 13px;
        font-weight: 600;
        color: $black-800;
      }
    }
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

  .content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;

    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      .balance,
      .income,
      .expenses {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 16px;
        border-radius: 16px;
        background: #ffffff;
        border: 1px solid rgba(15, 23, 42, 0.06);
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
        transition:
          box-shadow 0.2s ease,
          transform 0.2s ease;

        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 14px;
          bottom: 14px;
          width: 4px;
          border-radius: 999px;
        }
      }

      .income {
        .value {
          color: #dc2626;
        }
      }

      .expenses {
        .value {
          &.positive {
            color: #16a34a;
          }

          &.negative {
            color: #dc2626;
          }
        }
      }

      .label {
        font-size: 11px;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.8px;
      }

      .value {
        font-size: 22px;
        font-weight: 700;
        color: #0f172a;
      }
    }
  }
}
</style>
