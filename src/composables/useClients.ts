import { reactive } from 'vue'
import { api } from '@/api'
import type { Client } from '@/types/entities'

export function useClients() {
  const clients = reactive<Client[]>([])

  // fetch all clients
  async function fetchClients() {
    const data = await api.get<Client[]>('/clients')
    clients.length = 0
    clients.push(...data)
    console.log('Fetched clients:', data)
  }
    
  return {
    clients,
    fetchClients,
  }
}
