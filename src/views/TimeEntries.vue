<script setup lang="ts">
import { useTimeEntries, type TimeEntryFormData } from '@/composables/useTimeEntries'
import { formatDate } from '@/utils/dateFormat'
import { onMounted, ref } from 'vue'
import TimeEntryForm from '@/components/TimeEntryForm.vue'
import type { TimeEntry } from '@/types/entities'

const { timeEntries, fetchTimeEntries, createTimeEntry, updateTimeEntry, deleteTimeEntry, hasMore } = useTimeEntries()

const headers = [
  { title: 'ID', key: 'id', width: 80 },
  { title: 'Task ID', key: 'taskId', width: 120 },
  { title: 'Comment', key: 'comment' },
  { title: 'Start', key: 'start', width: 180 },
  { title: 'End', key: 'end', width: 180 },
  { title: 'Created At', key: 'createdAt', width: 180 },
  { title: 'Actions', key: 'actions', sortable: false, width: 150 }
]

const dialogOpen = ref(false)
const selectedEntry = ref<TimeEntry | null>(null)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

onMounted(() => {
  fetchTimeEntries()
})

const handleLoadMore = async () => {
  await fetchTimeEntries()
}

function openCreateDialog() {
  selectedEntry.value = null
  dialogOpen.value = true
}

function openEditDialog(entry: TimeEntry) {
  selectedEntry.value = entry
  dialogOpen.value = true
}

async function handleFormSubmit(formData: TimeEntryFormData, id?: number) {
  try {
    if (id) {
      await updateTimeEntry(id, formData)
      showSnackbar(`Time entry #${id} updated successfully!`, 'success')
    } else {
      const newEntry = await createTimeEntry(formData)
      showSnackbar(`Time entry #${newEntry.id} created successfully!`, 'success')
    }
  } catch (error: any) {
    const status = error?.response?.status
    if (status === 404) {
      showSnackbar('Time entry not found.', 'error')
    } else if (status === 400) {
      showSnackbar('Invalid input. Please check your data.', 'error')
    } else {
      showSnackbar('Failed to save time entry.', 'error')
    }
  }
}

async function handleDelete(entry: TimeEntry) {
  if (confirm(`Are you sure you want to delete time entry #${entry.id}?`)) {
    try {
      await deleteTimeEntry(entry.id)
      showSnackbar(`Time entry #${entry.id} deleted successfully!`, 'success')
    } catch (error: any) {
      const status = error?.response?.status
      if (status === 404) {
        showSnackbar('Time entry not found.', 'error')
      } else {
        showSnackbar('Failed to delete time entry.', 'error')
      }
    }
  }
}

function showSnackbar(message: string, color: string) {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}
</script>

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Time Entries</span>
        <v-btn color="primary" @click="openCreateDialog">
          Create Time Entry
        </v-btn>
      </v-card-title>

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
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            color="primary"
            @click="openEditDialog(item)"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="handleDelete(item)"
          />
        </template>
      </v-data-table>
    </v-card>

    <TimeEntryForm
      v-model="dialogOpen"
      :time-entry="selectedEntry"
      @submit="handleFormSubmit"
    />

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<style scoped>
</style>

