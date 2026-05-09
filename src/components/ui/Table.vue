<script setup lang="ts">
import { ref, watch, onUnmounted, capitalize } from "vue";

import { ITable } from "../../types/ui";
import { formatDateTime } from "../../utils/dateTime";
import ConfirmationModal from "../modals/ConfirmationModal.vue";
import { formatLabel } from "../../utils/string";

const props = defineProps<ITable>();

const emit = defineEmits({
  edit: (row) => true,
  delete: (row) => true,
  loadMore: () => true,
  timeOut: (row) => true,
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
    emit("delete", selectedRow.value.id);
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
        <tr v-else-if="!rows || rows.length === 0" class="message empty">
          <td :colspan="columns.length">
            <div class="empty-state">No data available</div>
          </td>
        </tr>
        <tr v-else v-for="row in rows" :key="row.id">
          <td v-for="col in columns" :key="col.key">
            <span v-if="['category', 'exported_by'].includes(col.key)">
              {{ capitalize(row[col.key]) }}
            </span>
            <span v-else-if="col.key === 'type'">
              {{ formatLabel(row[col.key]) }}
            </span>
            <span v-else-if="col.key === 'code'" class="code">
              {{ row[col.key] }}
            </span>
            <span v-else-if="col.key === 'format'" class="format">{{
              row[col.key]
            }}</span>
            <span
              v-else-if="
                ['amount', 'budget', 'spent', 'remaining'].includes(col.key)
              "
            >
              ₱{{ Number(row[col.key] || 0).toLocaleString() }}
            </span>
            <span
              v-else-if="col.key === 'status'"
              :class="['status', row.status]"
            >
              {{ row.status }}
            </span>
            <span v-else-if="['created_at', 'updated_at'].includes(col.key)">
              {{ formatDateTime(row[col.key]) }}
            </span>
            <span v-else-if="col.key === 'actions'" class="actions">
              <template v-if="page === 'attendance'">
                <button
                  v-if="canTimeOut && row.has_timed_in && !row.has_timed_out"
                  class="time-out"
                  @click="emit('timeOut', row)"
                >
                  Time Out
                </button>
              </template>
              <template v-else>
                <button class="edit" @click="emit('edit', row)">Edit</button>
                <button
                  v-if="page !== 'settings'"
                  class="delete"
                  @click="openDeleteConfirmationModal(row)"
                >
                  Delete
                </button>
              </template>
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
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 800px;

    &.empty {
      height: 100%;
    }

    th,
    td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid $gray-200;
      background: $white;
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
            &.code,
            &.format {
              text-transform: uppercase;
            }

            &.status {
              font-weight: 600;
              text-transform: capitalize;
            }

            &.healthy,
            &.present,
            &.success {
              color: $green-500;
            }

            &.warning,
            &.late,
            &.pending {
              color: $yellow-500;
            }

            &.over,
            &.absent,
            &.error,
            &.failed {
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

              .time-out {
                background: $amber-100;
                color: $amber-700;

                &:hover {
                  background: $amber-200;
                }
              }
            }
          }
        }

        &.message {
          display: table;
          width: 100%;
          table-layout: fixed;

          td {
            height: calc(100vh - 220px);
            text-align: center;
            vertical-align: middle;
            font-weight: 500;
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

          &.empty {
            td {
              height: calc(100vh - 220px);
              text-align: center;
              vertical-align: middle;
              font-weight: 500;
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
