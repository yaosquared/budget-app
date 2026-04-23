<script setup lang="ts">
import { formatDateTime } from "../../utils/dateTime";

const props = defineProps<{
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
}>();

const emit = defineEmits({
  edit: (row) => true,
  delete: (row) => true,
});
</script>

<template>
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
        <tr v-if="isLoading" class="message loading">
          <td :colspan="columns.length">Loading...</td>
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
              <button class="delete" @click="emit('delete', row)">
                Delete
              </button>
            </span>
            <span v-else>
              {{ row[col.key] }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.table-wrapper {
  overflow-x: auto;
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
    }

    thead {
      th {
        background: $gray-50;
        font-weight: 600;

        &:first-child {
          border-top-left-radius: 8px;
        }

        &:last-child {
          border-top-right-radius: 8px;
        }
      }
    }

    tbody {
      tr {
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
            &.Error {
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
            color: $slate-400;
          }

          &.error {
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
