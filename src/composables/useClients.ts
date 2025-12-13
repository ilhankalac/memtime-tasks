import { reactive } from 'vue'
import { api } from '@/api'
import type { Client } from '@/types/entities'

export function useClients() {
  const clients = reactive<Client[]>([])

  async function fetchClients() {
    const data = await api.get<Client[]>('/clients')
    clients.length = 0
    clients.push(...data)
  }

  async function fetchProjects(clientId: number) {
    const client = clients.find(c => c.id === clientId)
    if (client && !client.projects) {
      client.projects = await api.get(`/clients/${clientId}/projects`)
    }
  }
    
  return {
    clients,
    fetchClients,
    fetchProjects,
  }
}
