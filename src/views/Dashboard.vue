<script setup>
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  fetchMetrics,
  fetchRecentBudgets,
  fetchRecentTransactions,
} from "../api/dashboard";

import Title from "../components/ui/Title.vue";
import Metrics from "../components/Metrics.vue";
import RecentBudgets from "../components/RecentBudgets.vue";
import RecentTransactions from "../components/RecentTransactions.vue";

const {
  data: metricsData,
  isLoading: isMetricsDataLoading,
  isError: isMetricsDataError,
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
  const data = metricsData.value;

  return [
    {
      key: "balance",
      label: "Balance",
      value: data?.current_balance ?? 0,
      prefix: "₱",
    },
    {
      key: "income",
      label: "Income",
      value: data?.income ?? 0,
      prefix: "₱",
    },
    {
      key: "expenses",
      label: "Expenses",
      value: data?.expenses ?? 0,
      prefix: "₱",
    },
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
      <Metrics
        :metrics
        :isMetricsDataLoading="isMetricsDataLoading"
        :isMetricsDataError="isMetricsDataError"
      />
      <div class="overview">
        <RecentBudgets
          :budgets="budgets"
          :isBudgetsDataLoading="isBudgetsDataLoading"
          :isBudgetsDataError="isBudgetsDataError"
        />
        <RecentTransactions
          :transactions="transactions"
          :isRecentTransactionsLoading="isRecentTransactionsLoading"
          :isRecentTransactionsError="isRecentTransactionsError"
        />
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

  .overview {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 16px;
    flex: 1;
    min-height: 0;
  }
}
</style>
