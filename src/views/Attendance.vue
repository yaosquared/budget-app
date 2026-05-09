<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";

import { fetchAttendance, timeIn, timeOut } from "../api/attendance";
import { formatDate, formatTime } from "../utils/dateTime";
import { ATTENDANCE_COLUMNS } from "../constants/attendance";
import {
  IAttendanceData,
  IAttendanceFilterFormData,
} from "../types/attendance";
import Title from "../components/ui/Title.vue";
import Table from "../components/ui/Table.vue";
import Button from "../components/ui/Button.vue";
import ConfirmationModal from "../components/modals/ConfirmationModal.vue";
import AttendanceFilterForm from "../components/modals/AttendanceFilterForm.vue";

const queryClient = useQueryClient();
const isFilterAttendanceModalOpen = ref(false);
const isConfirmationModalOpen = ref(false);
const isTimingIn = ref(false);

const attendanceFilters = reactive<IAttendanceFilterFormData>({
  status: [],
  dateFrom: "",
  dateTo: "",
  timeInFrom: "",
  timeInTo: "",
  timeOutFrom: "",
  timeOutTo: "",
});

const { data, isLoading, isError, isFetching, hasNextPage, fetchNextPage } =
  useInfiniteQuery({
    queryKey: computed(() => ["attendance", { ...attendanceFilters }]),
    queryFn: fetchAttendance,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
  });

const rows = computed(() => {
  return (data.value?.pages ?? []).flatMap((page) =>
    page.data.map((item: IAttendanceData) => ({
      ...item,
      attendance_date: formatDate(item.created_at),
      time_in: formatTime(item.time_in),
      time_out: formatTime(item.time_out),
      has_timed_in: !!item.time_in,
      has_timed_out: !!item.time_out,
    })),
  );
});

const openTimeInModal = () => {
  isFilterAttendanceModalOpen.value = true;
};

const openConfirmationModal = () => {
  isConfirmationModalOpen.value = true;
};

const closeConfirmationModal = () => {
  isConfirmationModalOpen.value = false;
};

const today = new Date().toISOString().split("T")[0];

const canTimeIn = computed(() => {
  return !rows.value.some(
    (row) => row.attendance_date === formatDate(today) && row.has_timed_in,
  );
});

const canTimeOut = computed(() => {
  return rows.value.some(
    (row) => row.attendance_date === formatDate(today) && !row.has_timed_out,
  );
});

const handleTimeIn = async () => {
  isTimingIn.value = true;
  try {
    await timeIn();
    await queryClient.invalidateQueries({ queryKey: ["attendance"] });
    closeConfirmationModal();
  } catch (err) {
    console.error(err);
  } finally {
    isTimingIn.value = false;
  }
};

const handleTimeOut = async (row: IAttendanceData) => {
  try {
    await timeOut(row.id);
    await queryClient.invalidateQueries({ queryKey: ["attendance"] });
  } catch (err) {
    console.error(err);
  }
};

const handleFilterSubmit = (payload: IAttendanceFilterFormData) => {
  Object.assign(attendanceFilters, payload);
  closeFilterModal();
};

const handleFilterReset = () => {
  Object.assign(attendanceFilters, {
    status: [],
    dateFrom: "",
    dateTo: "",
    timeInFrom: "",
    timeInTo: "",
    timeOutFrom: "",
    timeOutTo: "",
  });
  closeFilterModal();
};

const closeFilterModal = () => {
  isFilterAttendanceModalOpen.value = false;
};
</script>

<template>
  <AttendanceFilterForm
    :isOpen="isFilterAttendanceModalOpen"
    @submit="handleFilterSubmit"
    @close="closeFilterModal"
    @reset="handleFilterReset"
  />
  <ConfirmationModal
    v-if="isConfirmationModalOpen"
    title="Are you sure you want to time in?"
    subTitle="This action cannot be undone."
    @confirm="handleTimeIn"
    @closeModal="closeConfirmationModal"
    type="attendance"
  />
  <section>
    <div class="header">
      <Title text="Attendance" />
      <div class="controls">
        <Button
          v-if="canTimeIn"
          icon="lucide:clock-plus"
          text="Time In"
          @click="openConfirmationModal"
        />
        <Button icon="lucide:filter" text="Filter" @click="openTimeInModal" />
      </div>
    </div>
    <Table
      :columns="ATTENDANCE_COLUMNS"
      :rows="rows"
      :isLoading="isLoading"
      :isFetching="isFetching"
      :isError="isError"
      :hasNextPage="hasNextPage"
      :canTimeOut="canTimeOut"
      @loadMore="fetchNextPage"
      @timeOut="handleTimeOut"
      page="attendance"
    />
  </section>
</template>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .controls {
    display: flex;
    gap: 10px;
  }

  .search {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    outline: none;

    &:focus {
      border-color: #3b82f6;
    }
  }
}
</style>
