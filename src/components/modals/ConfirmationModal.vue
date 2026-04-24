<script setup lang="ts">
import { ref } from "vue";

import Modal from "../ui/Modal.vue";
import FeatureComingSoon from "./FeatureComingSoon.vue";

const props = defineProps({
  title: String,
  subTitle: String,
});

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

const isFeatureComingSoonModalOpen = ref(false);

const closeModal = () => {
  emit("closeModal");
};

const openFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
  emit("closeModal");
};
</script>

<template>
  <FeatureComingSoon
    v-if="isFeatureComingSoonModalOpen"
    @closeModal="closeFeatureComingSoonModal"
  />
  <Modal @closeModal="closeModal">
    <div class="not-implemented-modal">
      <button @click="closeModal" class="close-btn" type="button">
        <Icon icon="lucide:x" width="18" height="18" />
      </button>

      <form>
        <div class="content">
          <h4>{{ title }}</h4>
          <p>{{ subTitle }}</p>
        </div>

        <div class="actions">
          <button type="button" @click="closeModal">Cancel</button>
          <button
            type="button"
            class="submit"
            @click="openFeatureComingSoonModal"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.modal-container {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-underlay {
    position: absolute;
    inset: 0;
    background: $black-950;
    opacity: 0.55;
  }

  .modal-content {
    position: relative;
    z-index: 2;
    width: min(460px, 92vw);
    background: $white;
    border-radius: 14px;
    border: 1px solid $slate-200;
    box-shadow: 0 25px 70px $black-opacity-20;
    padding: 18px 18px 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalIn 0.18s ease-out;

    .close-btn {
      all: unset;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      display: grid;
      place-items: center;
      padding: 6px;
      border-radius: 8px;
      color: $gray-500;
      transition: 0.15s ease;

      &:hover {
        background: $slate-100;
        color: $black-900;
      }
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 6px;
        padding: 18px 8px 4px;

        h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: $black-900;
          letter-spacing: -0.01em;
        }

        p {
          margin: 0;
          font-size: 14px;
          color: $gray-500;
          line-height: 1.4;
        }
      }

      .actions {
        display: flex;
        gap: 10px;
        padding-top: 8px;

        button {
          flex: 1;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid transparent;
          background: $white;
          border: 1px solid $slate-200;
          color: $gray-700;

          &:hover {
            background: $slate-50;
            border-color: $slate-300;
            color: $black-900;
          }

          &.submit {
            background: $indigo-600;
            color: $white;

            &:hover {
              background: $indigo-700;
            }

            &:active {
              transform: scale(0.98);
            }
          }
        }
      }
    }
  }
}

@keyframes modalIn {
  from {
    transform: scale(0.96);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
