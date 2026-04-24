<script setup lang="ts">
import { IMetricsTransformed } from "../types/dashboard";

const props = defineProps<{
  metrics: IMetricsTransformed[];
  isMetricsDataLoading: boolean;
  isMetricsDataError: boolean;
}>();
</script>

<template>
  <div class="metrics">
    <div v-for="item in metrics" :key="item.key" :class="item.key">
      <p class="label">{{ item.label }}</p>
      <h3 v-if="isMetricsDataLoading" class="value skeleton"></h3>
      <h3 v-else-if="isMetricsDataError" class="value error">—</h3>
      <h3 v-else class="value">
        {{ item.prefix }}{{ Number(item.value || 0).toLocaleString() }}
      </h3>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

      &.skeleton {
        width: 80px;
        height: 26px;
        border-radius: 6px;
        background: linear-gradient(
          90deg,
          $slate-200 25%,
          $slate-100 50%,
          $slate-200 75%
        );
        background-size: 200% 100%;
        animation: shimmer 2.4s infinite;
      }

      &.error {
        color: $slate-400;
        font-weight: 600;
      }
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
</style>
