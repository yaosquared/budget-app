<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { RouterLink } from "vue-router";
import { IHeaderEmits } from "../types/header";

const emit = defineEmits<IHeaderEmits>();
const isDev = import.meta.env.DEV;
</script>

<template>
  <header>
    <div class="left">
      <button class="burger" @click="emit('toggleSidebar')">
        <Icon icon="lucide:text-align-justify" />
      </button>
      <RouterLink to="/">
        <h1>
          <span v-if="isDev">App</span>
          <div v-else>
            <span class="logo-ip">Ip</span><span class="logo-own">Own</span>
          </div>
        </h1>
      </RouterLink>
    </div>
    <div class="right">
      <div class="avatar-container"></div>
    </div>
  </header>
</template>

<style scoped lang="scss">
header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  background: $black-900;
  color: $white;

  .left {
    display: flex;
    align-items: center;
    gap: 10px;

    .burger {
      background: none;
      border: none;
      color: $white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      font-size: 20px;
    }

    a {
      text-decoration: none;
      cursor: pointer;

      h1 {
        font-size: 30px;
        font-weight: 600;
        display: flex;
        align-items: center;
        letter-spacing: 0.4px;
        line-height: 1;
        user-select: none;

        .logo-ip {
          color: $slate-300;
          font-weight: 500;
        }

        .logo-own {
          color: $white;
          font-weight: 700;
          margin-left: 1px;
        }
      }
    }
  }

  .right {
    .avatar-container {
      border: 3px solid $white;
      border-radius: 100%;
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }
}
</style>
