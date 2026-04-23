<script setup>
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { fetchBudgets } from "../api/budget";
import { budgetColumns } from "../constants/budget";
import Table from "../components/ui/Table.vue";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";

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
</script>

<template>
  <section>
    <div class="header">
      <Title text="Budget" />
      <Button icon="lucide:circle-plus" text="New Budget" />
    </div>
    <div class="content">
      <Table
        :columns="budgetColumns"
        :rows="rows"
        :isLoading="isLoading"
        :isError="isError"
      />
    </div>
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
