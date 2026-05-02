<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Modal from "../ui/Modal.vue";
import Input from "../ui/Input.vue";
import Dropdown from "../ui/Dropdown.vue";
import { IGoalForm, IGoalFormData, IGoalFormEmits } from "../../types/goals";
import { reactive, ref, watch } from "vue";

const props = defineProps<IGoalForm>();
const emit = defineEmits<IGoalFormEmits>();

const openDropdown = ref<string | null>(null);

const formData = reactive<IGoalFormData>({
  title: "",
  description: "",
  dueDate: "",
});

const errors = reactive({
  title: "",
  description: "",
  dueDate: "",
});

watch(
  () => props.goal,
  (val) => {
    formData.title = val?.title ?? "";
    formData.description = val?.description ?? "";
    formData.dueDate = val?.due_date ?? "";
    errors.title = "";
    errors.description = "";
    errors.dueDate = "";
  },
  { immediate: true },
);

const toggleDropdown = (id: string) => {
  openDropdown.value = openDropdown.value === id ? null : id;
};

const validate = () => {
  errors.title = formData.title.trim() ? "" : "Title is required.";
  errors.description = formData.description.trim()
    ? ""
    : "Description is required.";
  errors.dueDate = formData.dueDate ? "" : "Due date is required.";
  return !errors.title && !errors.description && !errors.dueDate;
};

const handleSubmit = () => {
  if (!validate()) return;

  const payload = {
    ...formData,
    ...(props.goal?.id && { id: props.goal.id }),
  };
  emit("submit", payload);
};
</script>

<template>
  <Modal v-if="isOpen" @closeModal="emit('close')">
    <form @submit.prevent="handleSubmit">
      <button @click="emit('close')" class="close-btn" type="button">
        <Icon icon="lucide:x" width="18" height="18" />
      </button>
      <div class="form-header">
        <h4>{{ goal ? "Edit Goal" : "New Goal" }}</h4>
        <p class="subtitle">Fill in the details below</p>
      </div>
      <div class="form-body">
        <div class="group">
          <Input
            label="Title"
            v-model="formData.title"
            placeholder="e.g. Groceries, Transport, Rent"
            :error="errors.title"
          />
          <Dropdown
            type="date"
            v-model="formData.dueDate"
            label="Due Date"
            placeholder="Pick a date"
            :open="openDropdown === 'dueDate'"
            @toggle="toggleDropdown('dueDate')"
            :error="errors.dueDate"
          />
        </div>
        <Input
          label="Description"
          v-model="formData.description"
          placeholder="e.g. Monthly grocery budget for home"
          :error="errors.description"
        />
        <div class="form-actions">
          <button type="button" @click="handleSubmit">
            {{ goal ? "Save Changes" : "Submit" }}
          </button>
        </div>
      </div>
    </form>
  </Modal>
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
</style>
