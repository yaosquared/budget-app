<script setup lang="ts">
const props = defineProps({
  value: Number,
  color: String,
  height: Number,
});
</script>

<template>
  <div class="progress" :style="{ height: height + 'px' }">
    <div
      class="bar"
      :style="{
        width: Math.min(100, Math.max(0, value ?? 0)) + '%',
        background: color,
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.progress {
  width: 100%;
  background: $slate-200;
  border-radius: 999px;
  overflow: hidden;

  .bar {
    height: 100%;
    transition: width 0.25s ease;
  }
}
</style>
