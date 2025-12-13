<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TimeEntry } from '@/types/entities'
import type { TimeEntryFormData } from '@/composables/useTimeEntries'

interface Props {
  modelValue: boolean
  timeEntry?: TimeEntry | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [formData: TimeEntryFormData, id?: number]
}>()

const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formData = ref<TimeEntryFormData>({
  taskId: 0,
  comment: '',
  start: '',
  end: ''
})

const isEditMode = computed(() => !!props.timeEntry)
const dialogTitle = computed(() => isEditMode.value ? 'Update Time Entry' : 'Create Time Entry')

watch(() => props.timeEntry, (entry) => {
  if (entry) {
    formData.value = {
      taskId: entry.taskId,
      comment: entry.comment,
      start: toLocalDateTimeString(entry.start),
      end: toLocalDateTimeString(entry.end)
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Reset form when dialog opens in create mode
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && !props.timeEntry) {
    resetForm()
  }
})

function toLocalDateTimeString(isoString: string): string {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function toISOString(localDateTimeString: string): string {
  if (!localDateTimeString) {
    throw new Error('Date time string is required')
  }
  // Parse the local datetime string directly to avoid timezone issues
  const [datePart, timePart] = localDateTimeString.split('T')
  if (!datePart || !timePart) {
    throw new Error('Invalid date time format')
  }
  
  const [year, month, day] = datePart.split('-')
  const [hours, minutes] = timePart.split(':')
  
  if (!year || !month || !day || !hours || !minutes) {
    throw new Error('Invalid date time format')
  }
  
  // Create ISO 8601 string with UTC timezone (Z)
  const isoString = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`
  
  // Validate by parsing
  const date = new Date(isoString)
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date time')
  }
  
  return isoString
}

function resetForm() {
  formData.value = {
    taskId: 0,
    comment: '',
    start: '',
    end: ''
  }
}

function isFormValid(): boolean {
  if (
    formData.value.taskId <= 0 ||
    formData.value.comment.trim() === '' ||
    formData.value.start === '' ||
    formData.value.end === ''
  ) {
    return false
  }

  const startDate = new Date(formData.value.start)
  const endDate = new Date(formData.value.end)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return false
  }

  if (endDate <= startDate) {
    return false
  }

  return true
}

function getEndDateError(): string {
  if (!formData.value.end) {
    return 'End time is required'
  }

  if (!formData.value.start) {
    return ''
  }

  const startDate = new Date(formData.value.start)
  const endDate = new Date(formData.value.end)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return ''
  }

  if (endDate <= startDate) {
    return 'End time must be after start time'
  }

  return ''
}

function handleSubmit() {
  if (!isFormValid()) {
    return
  }

  try {
    const submitData: TimeEntryFormData = {
      ...formData.value,
      start: toISOString(formData.value.start),
      end: toISOString(formData.value.end)
    }

    emit('submit', submitData, props.timeEntry?.id)
    dialogValue.value = false
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

function handleCancel() {
  dialogValue.value = false
  resetForm()
}
</script>

<template>
  <v-dialog 
    v-model="dialogValue" 
    max-width="600px" 
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ dialogTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model.number="formData.taskId"
            label="Task ID"
            type="number"
            required
            :rules="[(v) => v > 0 || 'Task ID is required']"
          />

          <v-textarea
            v-model="formData.comment"
            label="Comment"
            required
            rows="3"
            :rules="[(v) => !!v || 'Comment is required']"
          />

          <v-text-field
            v-model="formData.start"
            label="Start"
            type="datetime-local"
            required
            :rules="[(v) => !!v || 'Start time is required']"
          />

          <v-text-field
            v-model="formData.end"
            label="End"
            type="datetime-local"
            required
            :rules="[(v) => {
              const error = getEndDateError()
              return error === '' || error
            }]"
          />
        </v-form>
      </v-card-text>

      <div class="d-flex pa-5">
        <v-btn
          color="grey"
          class="flex-grow-1 me-2"
          variant="outlined"
          @click="handleCancel"
        >
          Cancel
        </v-btn>

        <v-btn
          color="primary"
          variant="elevated"
          class="flex-grow-1"
          @click="handleSubmit"
        >
          {{ isEditMode ? 'Update' : 'Create' }}
        </v-btn>
      </div>

    </v-card>
  </v-dialog>
</template>

<style scoped>
</style>
