<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from "vue";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { Icon } from "@iconify/vue";

import { fetchGoals } from "../api/goals";
import { IGoalFormData, IGoalsData } from "../types/goals";
import { formatDate } from "../utils/dateTime";
import { STATUS_OPTIONS } from "../constants/goals";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";
import Dropdown from "../components/ui/Dropdown.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";
import GoalForm from "../components/modals/GoalForm.vue";

const isGoalFormModalOpen = ref(false);
const editingGoal = ref<IGoalsData | null>(null);
const openDropdown = ref<string | null>(null);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
const isFeatureComingSoonModalOpen = ref(false);

const { data, isLoading, isError, isFetching, hasNextPage, fetchNextPage } =
  useInfiniteQuery({
    queryKey: ["goals"],
    queryFn: fetchGoals,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
  });

const goals = computed(
  () =>
    data.value?.pages.flatMap((page) =>
      page.data.map((item) => ({
        ...item,
        due_date: formatDate(item.due_date),
      })),
    ) ?? [],
);

watch(sentinel, (el) => {
  if (observer) observer.disconnect();
  if (!el) return;

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage.value && !isFetching.value) {
        fetchNextPage();
      }
    },
    { threshold: 0.1 },
  );

  observer.observe(el);
});

onUnmounted(() => observer?.disconnect());

const isDueDate = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "due-today";
};

const openNewGoalModal = () => {
  editingGoal.value = null;
  isGoalFormModalOpen.value = true;
};

const handleFormSubmit = (payload: IGoalFormData) => {
  console.log("Submitting:", payload);
  if (payload.id) {
    openFeatureComingSoonModal();
  } else {
    openFeatureComingSoonModal();
  }
  closeFormModal();
};

const closeFormModal = () => {
  isGoalFormModalOpen.value = false;
  editingGoal.value = null;
};

const toggleDropdown = (id: string) => {
  openDropdown.value = openDropdown.value === id ? null : id;
};

const openFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
};
</script>

<template>
  <GoalForm
    :isOpen="isGoalFormModalOpen"
    :goal="editingGoal"
    @submit="handleFormSubmit"
    @close="closeFormModal"
  />
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
        @click="openNewGoalModal"
      />
    </div>
    <div class="content">
      <div v-if="isLoading" class="list">
        <div v-for="n in 10" :key="n" class="card skeleton"></div>
      </div>
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
              <small>
                Due:
                <span :class="isDueDate(goal.due_date)">
                  {{ goal.due_date }}
                </span>
              </small>
            </div>
          </div>
          <div class="actions">
            <Dropdown
              v-model="goal.status"
              :options="STATUS_OPTIONS"
              placeholder="Status"
              :open="openDropdown === goal.id"
              @toggle="toggleDropdown(goal.id)"
            />
          </div>
        </div>

        <div v-if="hasNextPage" ref="sentinel" style="height: 1px" />
        <div v-if="isFetching" class="message loading">Loading more...</div>
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
    overflow: hidden;

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
      overflow-y: auto;
      max-height: calc(100vh - 180px);
      scrollbar-width: thin;
      scrollbar-color: $slate-300 transparent;
      padding-right: 4px;

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

        &.skeleton {
          min-height: 100px;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            $slate-200 25%,
            $slate-100 50%,
            $slate-200 75%
          );
          background-size: 200% 100%;
          animation: shimmer 2.4s infinite;
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
