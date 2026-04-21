<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import { NAV_ITEMS } from "../constants/navData";
import { ISidebarProps } from "../types/sidebar";

const props = defineProps<ISidebarProps>();

const isHovered = ref<boolean>(false);

const isExpanded = computed(() => {
  return !props.collapsed || isHovered.value;
});
</script>

<template>
  <aside
    :class="{ collapsed: props.collapsed && !isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <nav>
      <RouterLink
        v-for="(item, idx) in NAV_ITEMS"
        :key="idx"
        :to="item.path"
        class="nav-item"
        active-class="active"
      >
        <Icon :icon="item.icon" class="icon" />
        <span v-if="isExpanded">
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
aside {
  height: 100%;
  background: $black-950;
  color: $white;
  flex-shrink: 0;
  width: 220px;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  overflow: hidden;

  &.collapsed {
    width: 70px;

    .nav-item {
      justify-content: center;
      padding: 10px 0;

      span {
        margin-left: 0;
      }
    }
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 8px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 10px 10px 10px 20px;
    border-radius: 8px;
    color: $slate-300;
    text-decoration: none;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: $white-opacity-06;
    }

    &.active {
      background-color: $white-opacity-08;
      color: $white;

      .icon {
        color: $white;
      }
    }

    .icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    span {
      margin-left: 12px;
      white-space: nowrap;
    }
  }
}
</style>
