<script setup>
import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { fetchSettings } from "../api/settings";
import { capitalize } from "../utils/string";
import { settingsColumns } from "../constants/settings";
import Title from "../components/ui/Title.vue";
import Table from "../components/ui/Table.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";

const isFeatureComingSoonModalOpen = ref(false);

const openFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
};

const { data, isLoading, isError } = useQuery({
  queryKey: ["settings"],
  queryFn: fetchSettings,
});

const rows = computed(() => {
  const result = [];

  (data.value ?? []).forEach((item) => {
    const settings = item.data;

    Object.entries(settings).forEach(([key, obj]) => {
      result.push({
        code: capitalize(key),
        description: obj.description,
        value: capitalize(obj.value),
        updated_at: item.updated_at,
        modified_by: item.modified_by,
      });
    });
  });

  return result;
});
</script>

<template>
  <FeatureComingSoon
    v-if="isFeatureComingSoonModalOpen"
    @closeModal="closeFeatureComingSoonModal"
  />
  <section>
    <div class="header">
      <Title text="Settings" />
    </div>
    <Table
      :columns="settingsColumns"
      :rows="rows"
      :isLoading="isLoading"
      :isError="isError"
      @edit="openFeatureComingSoonModal"
    />
  </section>
</template>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
