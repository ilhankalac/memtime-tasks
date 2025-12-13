import { reactive, ref } from 'vue'
import { api } from '@/api'
import type { Client, Project, Task } from '@/types/entities'

const ITEMS_PER_PAGE = 10

export function useClients() {
  const clients = reactive<Client[]>([])
  const clientsOffset = ref(0)
  const hasMoreClients = ref(true)

  const projectsOffsets = reactive<Record<number, number>>({})
  const hasMoreProjects = reactive<Record<number, boolean>>({})

  const tasksOffsets = reactive<Record<number, number>>({})
  const hasMoreTasks = reactive<Record<number, boolean>>({})

  async function fetchClients(sortBy?: string, order: 'asc' | 'desc' = 'asc') {
    const params: any = {
      limit: ITEMS_PER_PAGE,
      offset: clientsOffset.value
    }

    if (sortBy) {
      params.sortBy = sortBy
      params.order = order
    }

    const data = await api.get<Client[]>('/clients', params)

    clients.push(...data)
    clientsOffset.value += data.length
    hasMoreClients.value = data.length === ITEMS_PER_PAGE
  }

  async function fetchProjects(clientId: number, sortBy?: string, order: 'asc' | 'desc' = 'asc'): Promise<void> {
    const client = clients.find(c => c.id === clientId)
    if (!client) return

    const isFirstFetch = !client.projects
    if (isFirstFetch) {
      client.projects = []
      projectsOffsets[clientId] = 0
    }

    if (hasMoreProjects[clientId] === false) return

    const params: any = {
      limit: ITEMS_PER_PAGE,
      offset: projectsOffsets[clientId] || 0
    }

    if (sortBy) {
      params.sortBy = sortBy
      params.order = order
    }

    const data = await api.get<Project[]>(`/clients/${clientId}/projects`, params)

    client.projects!.push(...data)
    projectsOffsets[clientId] = (projectsOffsets[clientId] || 0) + data.length
    hasMoreProjects[clientId] = data.length === ITEMS_PER_PAGE
  }

  async function fetchTasks(projectId: number, sortBy?: string, order: 'asc' | 'desc' = 'asc'): Promise<void> {
    const project = clients
      .flatMap(c => c.projects || [])
      .find(p => p.id === projectId)
    if (!project) return

    const isFirstFetch = !project.tasks
    if (isFirstFetch) {
      project.tasks = []
      tasksOffsets[projectId] = 0
    }

    if (hasMoreTasks[projectId] === false) return

    const params: any = {
      limit: ITEMS_PER_PAGE,
      offset: tasksOffsets[projectId] || 0
    }

    if (sortBy) {
      params.sortBy = sortBy
      params.order = order
    }

    const data = await api.get<Task[]>(`/projects/${projectId}/tasks`, params)

    project.tasks!.push(...data)
    tasksOffsets[projectId] = (tasksOffsets[projectId] || 0) + data.length
    hasMoreTasks[projectId] = data.length === ITEMS_PER_PAGE
  }

  return {
    clients,
    fetchClients,
    fetchProjects,
    fetchTasks,
    hasMoreClients,
    hasMoreProjects,
    hasMoreTasks,
  }
}
