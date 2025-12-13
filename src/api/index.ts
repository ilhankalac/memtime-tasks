import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
})

class ApiClient {
  async get<T>(endpoint: string, params?: any): Promise<T> {
    const { data } = await client.get(endpoint, { params })
    return data
  }

  async post<T>(endpoint: string, payload: any): Promise<T> {
    const { data } = await client.post(endpoint, payload)
    return data
  }

  async put<T>(endpoint: string, payload: any): Promise<T> {
    const { data } = await client.put(endpoint, payload)
    return data
  }

  async delete<T>(endpoint: string): Promise<T> {
    const { data } = await client.delete(endpoint)
    return data
  }
}

export const api = new ApiClient()
