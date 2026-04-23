<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { Icon } from "@iconify/vue";

import { fetchGoals } from "../api/goals";
import { IGoalsData } from "../types/goals";
import { formatDate } from "../utils/dateTime";
import { statusOptions } from "../constants/goals";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";
import Dropdown from "../components/ui/Dropdown.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";

const openDropdown = ref<string | null>(null);
const goals = ref<IGoalsData[]>([]);
const isFeatureComingSoonModalOpen = ref(false);

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

const openFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
};
</script>

<template>
  <FeatureComingSoon
    v-if="isFeatureComingSoonModalOpen"
    @closeModal="closeFeatureComingSoonModal"
  />
  <section>
    <div class="header">
      <Title text="Goals" />
      <Button
        icon="lucide:circle-plus"
        text="New Goal"
        @click="openFeatureComingSoonModal"
      />
    </div>
    <div class="content">
      <div v-if="isLoading" class="message loading">Loading...</div>
      <div v-else-if="isError" class="message error">Error fetching data</div>
      <div v-else-if="goals.length === 0" class="message">
        No data available
      </div>
      <div v-else class="list">
        <div v-for="goal in goals" :key="goal.id" class="card">
          <div class="left">
            <Icon
              icon="lucide:grip-vertical"
              class="drag-handle"
              width="18"
              height="18"
            />
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
        border: 1px solid $slate-200;
        border-radius: 10px;
        background: $white;
        transition: 0.2s ease;

        &:hover {
          box-shadow: 0 4px 12px $black-opacity-06;
          border-color: $slate-200;
        }

        &:has(.drag-handle:hover) {
          background: $slate-50;
        }

        .left {
          display: flex;
          align-items: center;
          gap: 15px;

          .drag-handle {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            color: $slate-400;
          }

          .info {
            display: flex;
            flex-direction: column;
            gap: 4px;

            h3 {
              margin: 0;
              font-size: 15px;
              font-weight: 600;
              color: $black-900;
            }

            p {
              margin: 0;
              font-size: 13px;
              color: $slate-500;
            }

            small {
              font-size: 12px;
              color: $slate-400;

              .overdue {
                color: $red-500;
              }

              .due-today {
                color: $indigo-600;
              }
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
        color: $slate-500;
        padding: 20px;
      }
    }
  }
}
</style>
