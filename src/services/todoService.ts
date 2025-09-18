import type { Task } from '../types'

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

const isDevelopment = !import.meta.env.PROD
const API_BASE = isDevelopment
  ? 'http://localhost:3001/api'
  : import.meta.env.VITE_API_URL || 'https://todo-backend.heltondev.workers.dev/api'

const checkResponse = <T>(response: Response, data: ApiResponse<T>) => {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  if (!data.success) {
    throw new Error(data.error || 'Erro na API')
  }
}

export const todoService = {
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE}/todos`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    const data: ApiResponse<Task[]> = await response.json()
    checkResponse(response, data)
    return data.data
  },

  async createTask(task: string): Promise<Task> {
    const response = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task })
    })

    const data: ApiResponse<Task> = await response.json()
    checkResponse(response, data)
    return data.data
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    const data: ApiResponse<Task> = await response.json()
    checkResponse(response, data)
    return data.data
  },

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data: ApiResponse<Task> = await response.json()
    checkResponse(response, data)
  }
}
