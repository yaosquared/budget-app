<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";

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

const { data, isLoading, isError } = useQuery({
  queryKey: ["settings"],
  queryFn: fetchSettings,
});

const rows = computed(() => {
  return (data.value ?? []).flatMap((item) =>
    Object.entries(item.data).map(([key, obj]) => ({
      code: capitalize(key),
      description: obj.description,
      value: capitalize(String(obj.value)),
      updated_at: item.updated_at,
      modified_by: item.modified_by,
    })),
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
      :isError="isError"
      @edit="openSettingModal"
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
