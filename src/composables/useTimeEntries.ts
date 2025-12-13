import { reactive, ref } from 'vue'
import { api } from '@/api'
import type { TimeEntry } from '@/types/entities'

const ITEMS_PER_PAGE = 10

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

  return {
    timeEntries,
    fetchTimeEntries,
    hasMore,
  }
}
