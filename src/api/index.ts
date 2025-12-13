import axios, { AxiosError } from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
})

export interface ApiErrorResponse {
  error: string
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public originalError?: AxiosError
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function getErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  const status = error.response?.status

  if (status === 429) {
    return 'Rate limit exceeded - Please wait before making more requests'
  }

  if (status === 404) {
    const backendMessage = error.response?.data?.error
    return backendMessage || 'Resource not found'
  }

  if (status === 400) {
    const backendMessage = error.response?.data?.error
    return backendMessage || 'Invalid request - Please check your input'
  }

  if (status === 401) {
    return 'Unauthorized - Invalid API key'
  }

  if (status === 500) {
    return 'Server error - Please try again later'
  }

  const backendMessage = error.response?.data?.error
  if (backendMessage) {
    return backendMessage
  }

  if (error.message) {
    return error.message
  }

  return 'An unexpected error occurred'
}

class ApiClient {
  async get<T>(endpoint: string, params?: any): Promise<T> {
    try {
      const { data } = await client.get(endpoint, { params })
      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 0
        const message = getErrorMessage(error)
        throw new ApiError(status, message, error)
      }
      throw error
    }
  }

  async post<T>(endpoint: string, payload: any): Promise<T> {
    try {
      const { data } = await client.post(endpoint, payload)
      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 0
        const message = getErrorMessage(error)
        throw new ApiError(status, message, error)
      }
      throw error
    }
  }

  async put<T>(endpoint: string, payload: any): Promise<T> {
    try {
      const { data } = await client.put(endpoint, payload)
      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 0
        const message = getErrorMessage(error)
        throw new ApiError(status, message, error)
      }
      throw error
    }
  }

  async patch<T>(endpoint: string, payload: any): Promise<T> {
    try {
      const { data } = await client.patch(endpoint, payload)
      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 0
        const message = getErrorMessage(error)
        throw new ApiError(status, message, error)
      }
      throw error
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const { data } = await client.delete(endpoint)
      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 0
        const message = getErrorMessage(error)
        throw new ApiError(status, message, error)
      }
      throw error
    }
  }
}

export const api = new ApiClient()
