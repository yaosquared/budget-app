<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { fetchGoals } from "../api/goals";
import { IGoalsData } from "../types/goals";
import { formatDate } from "../utils/dateTime";
import { statusOptions } from "../constants/goals";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";
import Dropdown from "../components/ui/Dropdown.vue";

const openDropdown = ref<string | null>(null);
const goals = ref<IGoalsData[]>([]);

const { data, isLoading, isError } = useQuery({
  queryKey: ["goals"],
  queryFn: fetchGoals,
});

watchEffect(() => {
  if (data.value) {
    goals.value = data.value.map((item: IGoalsData) => ({
      ...item,
      due_date: formatDate(item.due_date),
    }));
  }
});

const toggleDropdown = (id: string) => {
  openDropdown.value = openDropdown.value === id ? null : id;
};

const isDueDate = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "due-today";
};
</script>

<template>
  <section>
    <div class="header">
      <Title text="Goals" />
      <Button icon="lucide:circle-plus" text="New Goal" />
    </div>
    <div class="content">
      <div v-if="isLoading" class="message loading">Loading...</div>
      <div v-else-if="isError" class="message error">Error fetching data</div>
      <div v-else-if="goals.length === 0" class="message">
        No data available
      </div>
      <div v-else class="list">
        <div v-for="goal in goals" :key="goal.id" class="card">
          <div class="info">
            <h3>{{ goal.title }}</h3>
            <p>{{ goal.description }}</p>
            <small
              >Due:
              <span :class="isDueDate(goal.due_date)">
                {{ goal.due_date }}
              </span></small
            >
          </div>
          <div class="actions">
            <Dropdown
              v-model="goal.status"
              :options="statusOptions"
              placeholder="Status"
              :open="openDropdown === goal.id"
              @toggle="toggleDropdown(goal.id)"
            />
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
    height: 100%;

    .message {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;

      &.loading {
        color: $slate-400;
      }

      &.error {
        color: $red-500;
      }
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 16px;
        border: 1px solid #eee;
        border-radius: 10px;
        background: white;
        transition: 0.2s ease;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          border-color: #e5e7eb;
        }

        .info {
          display: flex;
          flex-direction: column;
          gap: 4px;

          h3 {
            margin: 0;
            font-size: 15px;
            font-weight: 600;
            color: #111827;
          }

          p {
            margin: 0;
            font-size: 13px;
            color: #6b7280;
          }

          small {
            font-size: 12px;
            color: #9ca3af;

            .overdue {
              color: #dc2626;
            }

            .due-today {
              color: #eab308;
            }
          }
        }

        .actions {
          min-width: 160px;
          display: flex;
          justify-content: flex-end;
        }
      }

      .empty {
        text-align: center;
        color: #888;
        padding: 20px;
      }
    }
  }
}
</style>
