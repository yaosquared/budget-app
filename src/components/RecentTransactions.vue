<script setup lang="ts">
import { IRecentTransactions } from "../types/dashboard";

const props = defineProps<IRecentTransactions>();
</script>

<template>
  <div class="card transactions">
    <p class="label">RECENT TRANSACTIONS</p>
    <div v-if="isRecentTransactionsLoading" class="scroll-area">
      <ul>
        <li class="skeleton" v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div v-else-if="isRecentTransactionsError" class="error">
      Failed to load recent transactions
    </div>
    <div v-else class="scroll-area">
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
</template>

<style scoped lang="scss">
.transactions {
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
