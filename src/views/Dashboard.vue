<script setup>
import Title from "../components/ui/Title.vue";
import {
  budgetData,
  metricsData,
  transactionsData,
} from "../constants/dashboard";
</script>

<template>
  <section>
    <div class="header">
      <Title text="Dashboard" />
    </div>

    <div class="content">
      <div class="metrics">
        <div v-for="item in metricsData" :key="item.key" :class="item.key">
          <p class="label">{{ item.label }}</p>
          <h3 class="value">
            {{ item.prefix }}{{ item.value.toLocaleString() }}
          </h3>
        </div>
      </div>

      <div class="overview">
        <div class="card budget">
          <p class="label">BUDGET</p>

          <div class="scroll-area">
            <div class="budget-item" v-for="item in budgetData" :key="item.id">
              <span>{{ item.category }}</span>

              <div class="progress">
                <div class="bar" :style="{ width: item.progress + '%' }"></div>
              </div>

              <small>
                ₱{{ item.spent.toLocaleString() }} / ₱{{
                  item.limit.toLocaleString()
                }}
              </small>
            </div>
          </div>
        </div>

        <div class="card transactions">
          <p class="label">RECENT TRANSACTIONS</p>

          <div class="scroll-area">
            <ul>
              <li v-for="item in transactionsData" :key="item.id">
                <span>{{ item.name }}</span>

                <span :class="item.type">
                  {{ item.type === "expense" ? "-" : "+" }}₱{{
                    item.amount.toLocaleString()
                  }}
                </span>
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

    .balance::before {
      background: $indigo-600;
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
      flex-shrink: 0;
    }
  }

  .overview {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 16px;
    flex: 1;
    min-height: 0;

    .budget,
    .transactions {
      min-height: 0;
    }

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
          color: $black-950;
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
            border-radius: 999px;
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

          .income {
            color: $green-500;
            font-weight: 600;
          }

          .expense {
            color: $red-500;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
