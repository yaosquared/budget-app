<script setup>
const emit = defineEmits(["closeModal"]);
</script>

<template>
  <Teleport to="#modal">
    <div class="modal-container">
      <div
        role="button"
        tabIndex="0"
        @click="emit('closeModal')"
        class="modal-underlay"
      ></div>
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </Teleport>
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
    z-index: 1;
    border: none;
  }

  .modal-content {
    position: relative;
    z-index: 2;
    width: min(600px, 90vw);
    max-height: 80vh;
    background: $white;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid $slate-200;
    box-shadow: 0 20px 60px $black-900;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalIn 0.18s ease-out;

    > * {
      overflow-y: auto;
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
