<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

import { ITable } from "../../types/ui";
import { formatDateTime } from "../../utils/dateTime";
import ConfirmationModal from "../modals/ConfirmationModal.vue";

const props = defineProps<ITable>();

const emit = defineEmits({
  edit: (row) => true,
  delete: (row) => true,
  loadMore: () => true,
});

const selectedRow = ref<any>(null);
const isDeleteConfirmationModalOpen = ref(false);

const openDeleteConfirmationModal = (row: any) => {
  selectedRow.value = row;
  isDeleteConfirmationModalOpen.value = true;
};

const closeDeleteConfirmationModal = () => {
  isDeleteConfirmationModalOpen.value = false;
};

const handleDeleteRow = () => {
  if (selectedRow.value) {
    console.log("selectedRow.value", selectedRow.value);
    // emit("delete", selectedRow.value);
  }
  closeDeleteConfirmationModal();
};

const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

watch(sentinel, (el) => {
  if (observer) observer.disconnect();
  if (!el) return;

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && props.hasNextPage && !props.isFetching) {
        emit("loadMore");
      }
    },
    { threshold: 0.1 },
  );

  observer.observe(el);
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
  <ConfirmationModal
    v-if="isDeleteConfirmationModalOpen"
    title="Are you sure you want to delete this record?"
    subTitle="This action cannot be undone."
    @closeModal="closeDeleteConfirmationModal"
    @confirm="handleDeleteRow"
  />
  <div class="table-wrapper">
    <table :class="{ empty: !rows?.length }">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="n in 20" :key="n" v-if="isLoading" class="message loading">
          <td v-if="isLoading" :colspan="columns.length" class="skeleton"></td>
        </tr>
        <tr v-else-if="isError" class="message error">
          <td :colspan="columns.length">Error fetching data</td>
        </tr>
        <tr v-else-if="!rows || rows.length === 0" class="message">
          <td :colspan="columns.length">No data available</td>
        </tr>
        <tr v-else v-for="row in rows" :key="row.id">
          <td v-for="col in columns" :key="col.key">
            <span v-if="col.key === 'amount'">
              {{ row.currency }} {{ row.amount }}
            </span>
            <span
              v-else-if="col.key === 'status'"
              :class="['status', row.status]"
            >
              {{ row.status }}
            </span>
            <span
              v-else-if="col.key === 'created_at' || col.key === 'updated_at'"
            >
              {{ formatDateTime(row[col.key]) }}
            </span>
            <span v-else-if="col.key === 'actions'" class="actions">
              <button class="edit" @click="emit('edit', row)">Edit</button>
              <button
                v-if="page !== 'settings'"
                class="delete"
                @click="openDeleteConfirmationModal(row)"
              >
                Delete
              </button>
            </span>
            <span v-else>
              {{ row[col.key] }}
            </span>
          </td>
        </tr>

        <tr v-if="hasNextPage">
          <td :colspan="columns.length">
            <div ref="sentinel" style="height: 1px" />
            <div
              v-if="isFetching"
              style="text-align: center; padding: 12px; color: gray"
            >
              Loading more data...
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.table-wrapper {
  overflow: hidden;
  height: 100%;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;

    &.empty {
      height: 100%;
    }

    th,
    td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid $gray-200;
      background: $white;
      white-space: nowrap;
    }

    thead {
      tr {
        display: table;
        width: 100%;
        table-layout: fixed;

        th {
          position: sticky;
          top: 0;
          z-index: 2;
          background-color: $gray-50;
          font-weight: 600;

          &:first-child {
            border-top-left-radius: 8px;
          }

          &:last-child {
            border-top-right-radius: 8px;
          }
        }
      }
    }

    tbody {
      display: block;
      overflow-y: auto;
      max-height: calc(100vh - 220px);
      width: 100%;
      scrollbar-width: thin;
      scrollbar-color: $slate-300 transparent;

      tr {
        display: table;
        width: 100%;
        table-layout: fixed;

        td {
          span {
            &.status {
              font-weight: 600;
              text-transform: capitalize;
            }

            &.healthy,
            &.present,
            &.Success {
              color: $green-500;
            }

            &.warning,
            &.late,
            &.Pending {
              color: $yellow-500;
            }

            &.over,
            &.absent,
            &.Error,
            &.Failed {
              color: $red-600;
            }

            &.actions {
              display: flex;
              align-items: center;
              gap: 8px;

              button {
                border: none;
                border-radius: 6px;
                padding: 6px 10px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;

                &:active {
                  transform: scale(0.95);
                }
              }

              .edit {
                background: $sky-100;
                color: $sky-700;

                &:hover {
                  background: $sky-200;
                }
              }

              .delete {
                background: $red-100;
                color: $red-700;

                &:hover {
                  background: $red-200;
                }
              }
            }
          }
        }

        &.message {
          td {
            text-align: center;
          }

          &.loading {
            width: 100%;
            color: $slate-400;

            > td {
              &.skeleton {
                height: 60px;
                background: linear-gradient(
                  90deg,
                  $slate-200 25%,
                  $slate-100 50%,
                  $slate-200 75%
                );
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
              }
            }
          }

          &.error {
            height: 100%;
            color: $red-500;
          }
        }

        &:last-child {
          td {
            &:first-child {
              border-bottom-left-radius: 8px;
            }

            &:last-child {
              border-bottom-right-radius: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
