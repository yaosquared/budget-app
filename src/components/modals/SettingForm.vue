<script setup lang="ts">
import { reactive, watch } from "vue";
import { Icon } from "@iconify/vue";

import Modal from "../ui/Modal.vue";
import Input from "../ui/Input.vue";
import {
  ISettingForm,
  ISettingFormData,
  ISettingFormEmits,
} from "../../types/settings";

const props = defineProps<ISettingForm>();
const emit = defineEmits<ISettingFormEmits>();

const formData = reactive<ISettingFormData>({
  code: "",
  value: "",
});

const errors = reactive({
  value: "",
});

watch(
  () => props.setting,
  (val) => {
    formData.code = val?.code ?? "";
    formData.value = val?.value ?? "";
    errors.value = "";
  },
  { immediate: true },
);

const validate = () => {
  errors.value = formData.value.trim() ? "" : "Value is required.";

  return !errors.value;
};

const handleSubmit = () => {
  if (!validate()) return;

  const payload = {
    ...formData,
    ...(props.setting?.id && { id: props.setting.id }),
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
        <h4>{{ setting ? "Edit Setting" : "New Setting" }}</h4>
        <p class="subtitle">Fill in the details below</p>
      </div>
      <div class="form-body">
        <Input
          label="Code"
          v-model="formData.code"
          placeholder="e.g. Income / Currency"
          :disabled="true"
        />
        <Input
          label="Value"
          type="text"
          v-model="formData.value"
          placeholder="Enter new value"
          :error="errors.value"
        />
        <div class="form-actions">
          <button type="button" @click="handleSubmit">
            {{ setting ? "Save Changes" : "Submit" }}
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
