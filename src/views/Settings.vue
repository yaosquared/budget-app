<script setup lang="ts">
import { ref, computed } from "vue";
import { useInfiniteQuery } from "@tanstack/vue-query";

import { fetchSettings } from "../api/settings";
import { capitalize } from "../utils/string";
import { SETTINGS_COLUMNS } from "../constants/settings";
import { ISettingFormData, ISettingsData } from "../types/settings";
import Title from "../components/ui/Title.vue";
import Table from "../components/ui/Table.vue";
import FeatureComingSoon from "../components/modals/FeatureComingSoon.vue";
import SettingForm from "../components/modals/SettingForm.vue";

const isSettingFormModalOpen = ref(false);
const editingSetting = ref<ISettingsData | null>(null); // null = "new setting", object = "edit setting"
const isFeatureComingSoonModalOpen = ref(false);

const openSettingModal = (setting: ISettingsData) => {
  editingSetting.value = setting;
  isSettingFormModalOpen.value = true;
};

const handleFormSubmit = (payload: ISettingFormData) => {
  console.log("Submitting:", payload);

  if (payload.id) {
    // call update transaction api
    openFeatureComingSoonModal();
  }
  closeFormModal();
};

const closeFormModal = () => {
  isSettingFormModalOpen.value = false;
  editingSetting.value = null;
};

const openFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = true;
};

const closeFeatureComingSoonModal = () => {
  isFeatureComingSoonModalOpen.value = false;
};

const { data, isLoading, isError, isFetching, hasNextPage, fetchNextPage } =
  useInfiniteQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
  });

const rows = computed(() => {
  return (data.value?.pages ?? []).flatMap((page) =>
    page.data.flatMap((item: ISettingsData) =>
      Object.entries(item.data).map(([key, obj]: [string, any]) => ({
        id: item.id,
        user_id: item.user_id,
        code: capitalize(key),
        description: obj.description,
        value: capitalize(String(obj.value)),
        updated_at: item.updated_at,
        modified_by: item.modified_by,
      })),
    ),
  );
});
</script>

<template>
  <SettingForm
    :isOpen="isSettingFormModalOpen"
    :setting="editingSetting"
    @submit="handleFormSubmit"
    @close="closeFormModal"
  />
  <FeatureComingSoon
    v-if="isFeatureComingSoonModalOpen"
    @closeModal="closeFeatureComingSoonModal"
  />
  <section>
    <div class="header">
      <Title text="Settings" />
    </div>
    <Table
      :columns="SETTINGS_COLUMNS"
      :rows="rows"
      :isLoading="isLoading"
      :isFetching="isFetching"
      :isError="isError"
      :hasNextPage="hasNextPage"
      @edit="openSettingModal"
      @loadMore="fetchNextPage"
      page="settings"
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
