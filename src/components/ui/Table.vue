<script setup lang="ts">
const props = defineProps<{
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
}>();
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
      border-bottom: 1px solid #ddd;
      background: #fff;
    }

    thead {
      th {
        background: #f5f5f5;
        font-weight: 600;

        &:first-child {
          border-top-left-radius: 4px;
        }

        &:last-child {
          border-top-right-radius: 4px;
        }
      }
    }

    tbody {
      tr {
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
              border-bottom-left-radius: 4px;
            }

            &:last-child {
              border-bottom-right-radius: 4px;
            }
          }
        }
      }
    }
  }
}
</style>
