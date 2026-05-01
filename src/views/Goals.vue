<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { Icon } from "@iconify/vue";

import { fetchGoals } from "../api/goals";
import { IGoalsData } from "../types/goals";
import { formatDate } from "../utils/dateTime";
import { STATUS_OPTIONS } from "../constants/goals";
import Title from "../components/ui/Title.vue";
import Button from "../components/ui/Button.vue";
import Dropdown from "../components/ui/Dropdown.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";
import Modal from "../components/ui/Modal.vue";
import Input from "../components/ui/Input.vue";

const openDropdown = ref<string | null>(null);
const isNewModalOpen = ref(false);
const goals = ref<IGoalsData[]>([]);
const isFeatureComingSoonModalOpen = ref(false);

const formData = reactive({
  title: "",
  description: "",
  dueDate: "",
});

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

const openNewGoalModal = () => {
  isNewModalOpen.value = true;
};

const closeNewGoalModal = () => {
  isNewModalOpen.value = false;
  resetForm();
};

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

const resetForm = () => {
  formData.title = "";
  formData.description = "";
  formData.dueDate = "";
};

const submitBudget = () => {
  const payload = {
    ...formData,
    due_date: new Date(formData.dueDate).toISOString(),
  };

  // TODO: integrate post api route
  console.log("Submitting:", payload);
  closeNewGoalModal();
};

const openFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
};
</script>

<template>
  <Modal @closeModal="closeNewGoalModal" v-if="isNewModalOpen">
    <form @submit.prevent="submitBudget">
      <button @click="closeNewGoalModal" class="close-btn" type="button">
        <Icon icon="lucide:x" width="18" height="18" />
      </button>
      <div class="form-header">
        <h4>New Goal</h4>
        <p class="subtitle">Fill in the details below</p>
      </div>
      <div class="form-body">
        <div class="group">
          <Input
            label="Title"
            v-model="formData.title"
            placeholder="e.g. Groceries, Transport, Rent"
          />
          <Dropdown
            type="date"
            v-model="formData.dueDate"
            label="Due Date"
            placeholder="Pick a date"
            :open="openDropdown === 'dueDate'"
            @toggle="toggleDropdown('dueDate')"
          />
        </div>
        <Input
          label="Description"
          type="text"
          v-model="formData.description"
          placeholder="e.g. Monthly grocery budget for home"
        />
        <div class="form-actions">
          <!-- <button type="submit">Submit</button> -->
          <button @click="openFeatureComingSoonModal">Submit</button>
        </div>
      </div>
    </form>
  </Modal>
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
              :options="STATUS_OPTIONS"
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
form {
  position: relative;
  padding: 18px;
  border-radius: 14px;
  background: $white;
  width: 100%;
  max-width: 600px;
  scrollbar-width: thin;
  scrollbar-color: $slate-300 transparent;

  .close-btn {
    all: unset;
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    display: grid;
    place-items: center;
    padding: 6px;
    border-radius: 8px;
    transition: 0.2s ease;

    &:hover {
      background: $black-opacity-06;
      transform: scale(1.05);
    }
  }

  .form-header {
    margin-bottom: 24px;

    h4 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: $black-900;
    }

    .subtitle {
      margin: 4px 0 0;
      font-size: 13px;
      color: $slate-500;
    }
  }

  .form-body {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .group {
      display: flex;
      gap: 16px;

      .input-group {
        width: 50%;
      }

      .dropdown {
        width: 50%;
      }
    }
  }

  .form-actions {
    margin-top: 6px;

    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, $indigo-700, $indigo-600);
      color: $white;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 20px rgba(79, 70, 229, 0.25);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

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
