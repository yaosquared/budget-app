<script setup lang="ts">
import { computed, ref, watch, onUnmounted, capitalize } from "vue";
import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";
import { Icon } from "@iconify/vue";

import { createGoal, fetchGoals, updateGoal } from "../api/goals";
import {
  IGoalFormData,
  IGoalsData,
  IGoalUpdateData,
  TGoalStatus,
} from "../types/goals";
import { formatDate } from "../utils/dateTime";
import { STATUS_OPTIONS, TAB_BTN_PROPERTIES } from "../constants/goals";
import { optimisticUpdateInfinite } from "../utils/optimistic";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";
import Dropdown from "../components/ui/Dropdown.vue";
import GoalForm from "../components/modals/GoalForm.vue";

const queryClient = useQueryClient();
const isGoalFormModalOpen = ref(false);
const editingGoal = ref<IGoalsData | null>(null);
const openDropdown = ref<string | null>(null);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
const activeTab = ref<"pending" | "completed">("pending");

const statusFilter = computed(() =>
  activeTab.value === "completed" ? ["completed"] : ["pending", "in_progress"],
);

const { data, isLoading, isError, isFetching, hasNextPage, fetchNextPage } =
  useInfiniteQuery({
    queryKey: ["goals", statusFilter],
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
        rawDueDate: item.due_date,
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

const isDueDate = (dueDate: string, status: string) => {
  if (status === "completed") return "completed";

  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "due-today";

  return "";
};
const openNewGoalModal = () => {
  editingGoal.value = null;
  isGoalFormModalOpen.value = true;
};

const handleFormSubmit = async (payload: IGoalFormData) => {
  // create
  if (!payload.id) {
    const tempId = crypto.randomUUID();

    const { rollback } = optimisticUpdateInfinite({
      queryClient,
      queryKey: ["goals", statusFilter],
      update: (old: any) => ({
        ...old,
        pages: [
          {
            ...old.pages[0],
            data: [{ ...payload, id: tempId }, ...old.pages[0].data],
          },
          ...old.pages.slice(1),
        ],
      }),
    });

    try {
      await createGoal(payload);
    } catch (err) {
      rollback();
    }

    closeFormModal();
    return;
  }

  // update
  if (!payload.id) return;

  const { rollback } = optimisticUpdateInfinite({
    queryClient,
    queryKey: ["goals", statusFilter],
    update: (old: any) => ({
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: page.data.map((t: IGoalsData) =>
          t.id === payload.id ? { ...t, ...payload } : t,
        ),
      })),
    }),
  });

  try {
    await updateGoal(payload as IGoalUpdateData);
  } catch (err) {
    rollback();
  }

  closeFormModal();
};

const handleStatusChange = async (goal: IGoalsData, newStatus: string) => {
  const { rollback } = optimisticUpdateInfinite({
    queryClient,
    queryKey: ["goals", statusFilter],
    update: (old: any) => ({
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: page.data.map((t: IGoalsData) =>
          t.id === goal.id ? { ...t, status: newStatus } : t,
        ),
      })),
    }),
  });

  try {
    await updateGoal({ id: goal.id, status: newStatus as TGoalStatus });
    await queryClient.invalidateQueries({ queryKey: ["goals"] }); // add this
  } catch (err) {
    rollback();
  }
};

const closeFormModal = () => {
  isGoalFormModalOpen.value = false;
  editingGoal.value = null;
};

const toggleDropdown = (id: string) => {
  openDropdown.value = openDropdown.value === id ? null : id;
};
</script>

<template>
  <GoalForm
    :isOpen="isGoalFormModalOpen"
    :goal="editingGoal"
    @submit="handleFormSubmit"
    @close="closeFormModal"
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
      <div class="tab-group">
        <button
          v-for="tab in TAB_BTN_PROPERTIES"
          :key="tab.key"
          :class="['tab-btn', activeTab === tab.key ? 'active' : '']"
          @click="activeTab = tab.key"
        >
          <Icon :icon="tab.icon" width="14" height="14" />
          {{ tab.label }}
        </button>
      </div>
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
              <h3>{{ capitalize(goal.title) }}</h3>
              <p>{{ capitalize(goal.description) }}</p>
              <small>
                Due:
                <span :class="isDueDate(goal.due_date, goal.status)">
                  {{ goal.due_date }}
                </span>
              </small>
            </div>
          </div>
          <div class="right">
            <Dropdown
              v-model="goal.status"
              :options="STATUS_OPTIONS"
              placeholder="Status"
              :open="openDropdown === goal.id"
              @toggle="toggleDropdown(goal.id)"
              @update:modelValue="(val) => handleStatusChange(goal, val)"
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

    .tab-group {
      display: inline-flex;
      background: $slate-100;
      border-radius: 10px;
      padding: 4px;
      gap: 4px;
      margin-bottom: 12px;

      .tab-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 16px;
        border: none;
        border-radius: 7px;
        font-size: 13px;
        font-weight: 600;
        color: $slate-400;
        background: transparent;
        cursor: pointer;
        transition:
          color 0.18s ease,
          background-color 0.18s ease,
          box-shadow 0.18s ease;
        white-space: nowrap;

        &:hover:not(.active) {
          color: $slate-600;
          background-color: $slate-200;
        }

        &.active {
          background: $white;
          color: $black-900;
          box-shadow: 0 1px 4px $black-opacity-06;
        }
      }
    }

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
      max-height: calc(100vh - 220px);
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
        width: 100%;
        gap: 16px;

        flex-direction: column;

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
          min-width: 0;
          width: 100%;

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
            min-width: 0;
            width: 100%;

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
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            small {
              font-size: 12px;
              font-weight: 500;
              color: $slate-400;

              .overdue {
                color: $red-500;
              }

              .due-today {
                color: $yellow-500;
              }

              .completed {
                color: $green-500;
              }
            }
          }
        }

        .right {
          display: flex;
          justify-content: center;
          width: 100%;
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

@media (min-width: 426px) {
  section {
    .content {
      .list {
        .card {
          flex-direction: row;

          .left {
            width: 50%;
          }

          .right {
            justify-content: flex-end;
            width: 50%;
          }
        }
      }
    }
  }
}
</style>
