<script setup lang="ts">
import { useTimeEntries } from '@/composables/useTimeEntries'
import { formatDate } from '@/utils/dateFormat'
import { onMounted } from 'vue'

const { timeEntries, fetchTimeEntries, hasMore } = useTimeEntries()

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Task ID', key: 'taskId' },
  { title: 'Comment', key: 'comment' },
  { title: 'Start', key: 'start' },
  { title: 'End', key: 'end' },
  { title: 'Created At', key: 'createdAt' },
]

onMounted(() => {
  fetchTimeEntries()
})

const handleLoadMore = async () => {
  await fetchTimeEntries()
}
</script>

<template>
  <div>
    <v-card>
      <v-data-table :headers="headers" :items="timeEntries" density="compact">
        <template #item.start="{ item }">
          {{ formatDate(item.start) }}
        </template>
        <template #item.end="{ item }">
          {{ formatDate(item.end) }}
        </template>
        <template #item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<style scoped>
</style>

