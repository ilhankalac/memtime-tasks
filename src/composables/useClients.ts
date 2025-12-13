import { reactive } from 'vue'
import { api } from '@/api'
import type { Client, Project, Task } from '@/types/entities'

export function useClients() {
  const clients = reactive<Client[]>([])

  async function fetchClients() {
    const data = await api.get<Client[]>('/clients')
    clients.length = 0
    clients.push(...data)
  }

  async function fetchProjects(clientId: number): Promise<void> {
    const client = clients.find(c => c.id === clientId)
    if (client && !client.projects) {
      client.projects = await api.get<Project[]>(`/clients/${clientId}/projects`)
    }
  }

  async function fetchTasks(projectId: number): Promise<void> {
    const project = clients
      .flatMap(c => c.projects || [])
      .find(p => p.id === projectId)
    if (project && !project.tasks) {
      project.tasks = await api.get<Task[]>(`/projects/${projectId}/tasks`)
    }
  }
    
  return {
    clients,
    fetchClients,
    fetchProjects,
    fetchTasks,
  }
}
