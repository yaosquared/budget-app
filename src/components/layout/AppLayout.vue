<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "../Sidebar.vue";
import Header from "../Header.vue";

const isCollapsed = ref<boolean>(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <div class="layout">
    <Header @toggleSidebar="toggleSidebar" />
    <div class="body">
      <Sidebar :collapsed="isCollapsed" />
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  height: 100dvh;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    display: flex;
    overflow: hidden;

    .content {
      flex: 1;
      padding: 20px;
      overflow: auto;
      background: $slate-50;
    }
  }
}
</style>
