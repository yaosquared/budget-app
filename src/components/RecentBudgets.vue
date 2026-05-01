<script setup lang="ts">
import { IRecentBudgets } from "../types/dashboard";
import ProgressBar from "./ui/ProgressBar.vue";

const props = defineProps<IRecentBudgets>();
</script>

<template>
  <div class="budget">
    <p class="label">RECENT BUDGETS</p>
    <div v-if="isBudgetsDataLoading" class="scroll-area">
      <div class="budget-item skeleton" v-for="n in 10" :key="n"></div>
    </div>
    <div v-else-if="isBudgetsDataError" class="error">
      Failed to load recent budgets
    </div>
    <div v-else class="scroll-area">
      <div class="budget-item" v-for="item in budgets" :key="item.id">
        <span>{{ item.category }}</span>
        <ProgressBar
          :value="
            Math.min((Number(item.spent) / Number(item.budget)) * 100, 100)
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
</template>

<style scoped lang="scss">
.budget {
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

  .scroll-area {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-right: 6px;
    scrollbar-width: thin;
    scrollbar-color: $slate-300 transparent;

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

      &.skeleton {
        height: 52px;
        border-radius: 10px;
        background: linear-gradient(
          90deg,
          $slate-200 25%,
          $slate-100 50%,
          $slate-200 75%
        );
        background-size: 200% 100%;
        animation: shimmer 2.4s infinite;
        margin-bottom: 14px;
      }
    }
  }

  .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-weight: 500;
    padding: 12px;
    font-size: 13px;
    color: $red-500;
  }
}
</style>
