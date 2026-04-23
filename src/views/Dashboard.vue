<script setup>
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  fetchMetrics,
  fetchRecentBudgets,
  fetchRecentTransactions,
} from "../api/dashboard";

import Title from "../components/ui/Title.vue";
import ProgressBar from "../components/ui/ProgressBar.vue";

const {
  data: metricsData,
  isLoading: isMetricsDataLoading,
  isError: isMetricDataError,
} = useQuery({
  queryKey: ["metrics"],
  queryFn: fetchMetrics,
});

const {
  data: budgetsData,
  isLoading: isBudgetsDataLoading,
  isError: isBudgetsDataError,
} = useQuery({
  queryKey: ["recentBudgets"],
  queryFn: fetchRecentBudgets,
});

const {
  data: recentTransactions,
  isLoading: isRecentTransactionsLoading,
  isError: isRecentTransactionsError,
} = useQuery({
  queryKey: ["recentTransactions"],
  queryFn: fetchRecentTransactions,
});

const metrics = computed(() => {
  if (!metricsData.value) return [];

  const data = metricsData.value;

  return [
    {
      key: "balance",
      label: "Balance",
      value: data.current_balance,
      prefix: "₱",
    },
    { key: "income", label: "Income", value: data.income, prefix: "₱" },
    { key: "expenses", label: "Expenses", value: data.expenses, prefix: "₱" },
  ];
});

const budgets = computed(() => {
  return (budgetsData.value ?? []).map((item) => {
    const budget = Number(item.budget || 0);
    const spent = Number(item.spent || 0);
    const remaining = budget - spent;

    let status = "healthy";

    if (remaining < 0) status = "over";
    else if (spent / budget >= 0.8) status = "warning";

    return {
      ...item,
      remaining,
      status,
    };
  });
});

const transactions = computed(() => {
  return recentTransactions.value?.data ?? recentTransactions.value ?? [];
});
</script>
<template>
  <section>
    <div class="header">
      <Title text="Dashboard" />
    </div>

    <div class="content">
      <div class="metrics">
        <div v-for="item in metrics" :key="item.key" :class="item.key">
          <p class="label">{{ item.label }}</p>

          <h3 class="value">
            {{ item.prefix }}{{ Number(item.value || 0).toLocaleString() }}
          </h3>
        </div>
      </div>

      <div class="overview">
        <div class="card budget">
          <p class="label">RECENT BUDGETS</p>

          <div class="scroll-area">
            <div class="budget-item" v-for="item in budgets" :key="item.id">
              <span>{{ item.category }}</span>

              <ProgressBar
                :value="
                  Math.min(
                    (Number(item.spent) / Number(item.budget)) * 100,
                    100,
                  )
                "
                color="#4f46e5"
                :height="8"
              />

              <small>
                ₱{{ Number(item.spent).toLocaleString() }} / ₱{{
                  Number(item.budget).toLocaleString()
                }}
              </small>
            </div>
          </div>
        </div>

        <div class="card transactions">
          <p class="label">RECENT TRANSACTIONS</p>

          <div class="scroll-area">
            <ul>
              <li v-for="item in transactions" :key="item.id">
                <div class="left">
                  <span class="name">{{ item.type }}</span>
                </div>

                <div class="right">
                  <small class="budget">
                    {{ item.currency }}
                    {{ Number(item.amount).toLocaleString() }}
                  </small>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
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
    flex: 1;
    gap: 20px;
    min-height: 0;
  }

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
      background: $white;
      border: 1px solid rgba($black-950, 0.06);
      box-shadow: 0 2px 6px rgba($black-950, 0.04);

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 14px;
        bottom: 14px;
        width: 4px;
        border-radius: 999px;
      }

      .label {
        font-size: 11px;
        color: $slate-400;
        text-transform: uppercase;
        letter-spacing: 0.8px;
      }

      .value {
        font-size: 22px;
        font-weight: 700;
        color: $black-950;
      }
    }

    .balance {
      &::before {
        background: $indigo-600;
      }

      .value {
        color: $indigo-600;
      }
    }

    .income {
      &::before {
        background: $green-500;
      }

      .value {
        color: $green-500;
      }
    }

    .expenses {
      &::before {
        background: $red-500;
      }

      .value {
        color: $red-500;
      }
    }
  }

  .card {
    background: $white;
    border-radius: 16px;
    padding: 18px;
    border: 1px solid rgba($black-950, 0.06);
    box-shadow: 0 2px 6px rgba($black-950, 0.04);
    display: flex;
    flex-direction: column;
    min-height: 0;

    .label {
      font-size: 12px;
      color: $slate-400;
      margin-bottom: 10px;
    }
  }

  .overview {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 16px;
    flex: 1;
    min-height: 0;

    .scroll-area {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding-right: 6px;
      scrollbar-width: thin;
      scrollbar-color: $slate-300 transparent;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: $slate-300;
        border-radius: 999px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }

    .budget {
      .budget-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 14px;

        span {
          font-size: 14px;
          font-weight: 600;
        }

        small {
          font-size: 12px;
          color: $slate-400;
        }

        .progress {
          height: 8px;
          background: $slate-200;
          border-radius: 999px;
          overflow: hidden;

          .bar {
            height: 100%;
            background: $indigo-600;
          }
        }
      }
    }

    .transactions {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          border-radius: 10px;
          background: $slate-50;
          border: 1px solid rgba($black-950, 0.05);
          cursor: pointer;
          transition: 0.15s ease;

          &:hover {
            background: $slate-100;
            transform: translateX(2px);
          }

          span:first-child {
            font-size: 14px;
            font-weight: 500;
            color: $black-950;
          }
        }
      }
    }
  }
}
</style>
