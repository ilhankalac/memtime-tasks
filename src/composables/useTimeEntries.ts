import { reactive, ref } from 'vue'
import { api } from '@/api'
import type { TimeEntry } from '@/types/entities'

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

  async function fetchTimeEntries() {
    const data = await api.get<TimeEntry[]>('/time-entries', {
      limit: ITEMS_PER_PAGE,
      offset: offset.value
    })

    timeEntries.push(...data)
    offset.value += data.length
    hasMore.value = data.length === ITEMS_PER_PAGE
  }

  async function createTimeEntry(formData: TimeEntryFormData): Promise<TimeEntry> {
    const newEntry = await api.post<TimeEntry>('/time-entries', formData)
    timeEntries.unshift(newEntry)
    return newEntry
  }

  async function updateTimeEntry(id: number, formData: TimeEntryFormData): Promise<TimeEntry> {
    const updatedEntry = await api.put<TimeEntry>(`/time-entries/${id}`, formData)
    const index = timeEntries.findIndex(entry => entry.id === id)
    if (index !== -1) {
      Object.assign(timeEntries[index]!, updatedEntry)
    }
    return updatedEntry
  }

  async function deleteTimeEntry(id: number): Promise<void> {
    await api.delete(`/time-entries/${id}`)
    const index = timeEntries.findIndex(entry => entry.id === id)
    if (index !== -1) {
      timeEntries.splice(index, 1)
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
