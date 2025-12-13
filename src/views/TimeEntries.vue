<script setup lang="ts">
import { useTimeEntries, type TimeEntryFormData } from '@/composables/useTimeEntries'
import { formatDate } from '@/utils/dateFormat'
import { onMounted, ref } from 'vue'
import TimeEntryForm from '@/components/TimeEntryForm.vue'
import type { TimeEntry } from '@/types/entities'
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay()

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
const loading = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('info')

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    await fetchTimeEntries()
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const handleLoadMore = async () => {
  loading.value = true
  try {
    await fetchTimeEntries()
  } catch (error) {
  } finally {
    loading.value = false
  }
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
    } else {
      await createTimeEntry(formData)
    }
    dialogOpen.value = false
  } catch (error) {
  }
}

async function handleDelete(entry: TimeEntry) {
  if (confirm(`Are you sure you want to delete time entry #${entry.id}?`)) {
    try {
      await deleteTimeEntry(entry.id)
    } catch (error) {
    }
  }
}
</script>

<template>
  <div>
    <v-card>
      <v-card-title 
        class="d-flex justify-space-between align-center"
        :class="smAndDown? 'flex-column align-start' : ''"
      >
        <span>Time Entries</span>
        <v-btn 
          color="primary" 
          variant="outlined"
          @click="openCreateDialog"
        >
          <v-icon start>mdi-plus</v-icon>
          Add Time Entry
        </v-btn>
      </v-card-title>

      <v-data-table :headers="headers" :items="timeEntries" :loading="loading" density="compact">
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

