<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { Icon } from "@iconify/vue";

import { MONTH_OPTIONS } from "../../constants/budget";
import {
  IBudgetForm,
  IBudgetFormData,
  IBudgetFormEmits,
} from "../../types/budget";
import Modal from "../ui/Modal.vue";
import Input from "../ui/Input.vue";
import Dropdown from "../ui/Dropdown.vue";

const props = defineProps<IBudgetForm>();
const emit = defineEmits<IBudgetFormEmits>();

const openDropdown = ref<string | null>(null);

const formData = reactive<IBudgetFormData>({
  category: "",
  month: "",
  budget: null,
});

const errors = reactive({
  category: "",
  month: "",
  budget: "",
});

watch(
  () => props.budget,
  (val) => {
    formData.category = val?.category ?? "";
    formData.month = val?.month ?? "";
    formData.budget = val?.budget ? Number(val.budget) : null;
    errors.category = "";
    errors.month = "";
    errors.budget = "";
  },
  { immediate: true },
);

const toggleDropdown = (id: string) => {
  openDropdown.value = openDropdown.value === id ? null : id;
};

const validate = () => {
  errors.category = formData.category.trim() ? "" : "Category is required.";
  errors.month = formData.month.trim() ? "" : "Month is required.";
  errors.budget =
    formData.budget && Number(formData.budget) > 0
      ? ""
      : "Budget must be greater than 0.";
  return !errors.category && !errors.month && !errors.budget;
};

const handleSubmit = () => {
  if (!validate()) return;

  const payload = {
    ...formData,
    ...(props.budget?.id && { id: props.budget.id }),
    budget: Number(formData.budget),
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
        <h4>{{ budget ? "Edit Budget" : "New Budget" }}</h4>

        <p class="subtitle">Fill in the details below</p>
      </div>
      <div class="form-body">
        <Input
          label="Category"
          v-model="formData.category"
          placeholder="e.g. Food / Transport"
          :error="errors.category"
        />
        <div class="input-group">
          <label>Month</label>
          <Dropdown
            v-model="formData.month"
            :options="MONTH_OPTIONS"
            placeholder="Select Month"
            :open="openDropdown === 'month'"
            @toggle="toggleDropdown('month')"
            :error="errors.month"
          />
        </div>
        <Input
          label="Budget"
          type="number"
          v-model="formData.budget"
          placeholder="0.00"
          :error="errors.budget"
        />
        <div class="form-actions">
          <!-- <button type="submit">Submit</button> -->
          <button type="button" @click="handleSubmit">
            {{ budget ? "Save Changes" : "Submit" }}
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

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 13px;
        font-weight: 600;
        color: $black-800;
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
