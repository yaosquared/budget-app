<script setup lang="ts">
import Modal from "../ui/Modal.vue";

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

const closeModal = () => {
  emit("closeModal");
};
</script>

<template>
  <Modal @closeModal="closeModal">
    <div class="not-implemented-modal">
      <button @click="closeModal" class="close-btn" type="button">
        <Icon icon="lucide:x" width="18" height="18" />
      </button>

      <div class="content">
        <h4>Not Yet Implemented</h4>
        <p>This feature is currently under development.</p>
        <small>Please check back later.</small>
      </div>

      <div class="actions">
        <button type="button" @click="closeModal">Got it</button>
      </div>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.modal-container {
  position: fixed;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-underlay {
    position: absolute;
    inset: 0;
    background: $black-950;
    opacity: 0.6;
    border: none;
  }

  .modal-content {
    position: relative;
    z-index: 2;
    width: min(600px, 90vw);
    max-height: 80vh;
    background: $white;
    border-radius: 10px;
    padding: 20px;
    border: 1px solid $slate-200;
    box-shadow: 0 20px 60px $black-opacity-20;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalIn 0.18s ease-out;

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
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-top: 10px;

      h4 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: $black-900;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: $slate-500;
      }

      small {
        font-size: 12px;
        color: $slate-400;
      }
    }

    .actions {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;

      button {
        padding: 10px 14px;
        border-radius: 8px;
        border: none;
        background: $indigo-600;
        color: $white;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s ease;

        &:hover {
          background: $indigo-700;
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
