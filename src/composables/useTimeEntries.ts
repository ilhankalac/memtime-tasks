import { reactive, ref } from 'vue'
import { api, ApiError } from '@/api'
import type { TimeEntry } from '@/types/entities'
import { useNotification } from './useNotification'

const ITEMS_PER_PAGE = 10

export interface TimeEntryFormData {
  taskId: number
  comment: string
  start: string
  end: string
}

export function useTimeEntries() {
  const timeEntries = reactive<TimeEntry[]>([])
  const offset = ref(0)
  const hasMore = ref(true)
  const { showError, showSuccess } = useNotification()

  async function fetchTimeEntries() {
    try {
      const data = await api.get<TimeEntry[]>('/time-entries', {
        limit: ITEMS_PER_PAGE,
        offset: offset.value
      })

      timeEntries.push(...data)
      offset.value += data.length
      hasMore.value = data.length === ITEMS_PER_PAGE
    } catch (error) {
      if (error instanceof ApiError) {
        showError(error.message)
      } else {
        showError('Failed to fetch time entries')
      }
      throw error
    }
  }

  async function createTimeEntry(formData: TimeEntryFormData): Promise<TimeEntry> {
    try {
      const newEntry = await api.post<TimeEntry>('/time-entries', formData)
      timeEntries.unshift(newEntry)
      showSuccess('Time entry created successfully')
      return newEntry
    } catch (error) {
      if (error instanceof ApiError) {
        showError(error.message)
      } else {
        showError('Failed to create time entry')
      }
      throw error
    }
  }

  async function updateTimeEntry(id: number, formData: TimeEntryFormData): Promise<TimeEntry> {
    try {
      const updatedEntry = await api.put<TimeEntry>(`/time-entries/${id}`, formData)
      const index = timeEntries.findIndex(entry => entry.id === id)
      if (index !== -1) {
        Object.assign(timeEntries[index]!, updatedEntry)
      }
      showSuccess('Time entry updated successfully')
      return updatedEntry
    } catch (error) {
      if (error instanceof ApiError) {
        showError(error.message)
      } else {
        showError('Failed to update time entry')
      }
      throw error
    }
  }

  async function deleteTimeEntry(id: number): Promise<void> {
    try {
      await api.delete(`/time-entries/${id}`)
      const index = timeEntries.findIndex(entry => entry.id === id)
      if (index !== -1) {
        timeEntries.splice(index, 1)
      }
      showSuccess('Time entry deleted successfully')
    } catch (error) {
      if (error instanceof ApiError) {
        showError(error.message)
      } else {
        showError('Failed to delete time entry')
      }
      throw error
    }
  }

  return {
    timeEntries,
    fetchTimeEntries,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    hasMore,
  }
}
