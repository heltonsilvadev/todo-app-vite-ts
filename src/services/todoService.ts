import type { Task } from '../types'

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api/'

const checkResponse = <T>(data: ApiResponse<T>) => {
  if (!data.success) {
    throw new Error(data.error || 'Erro na API')
  }
}

export const todoService = {
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE}todos`)
    const data: ApiResponse<Task[]> = await response.json()
    checkResponse(data)
    return data.data
  },

  async createTask(task: string): Promise<Task> {
    const response = await fetch(`${API_BASE}todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    })
    const data: ApiResponse<Task> = await response.json()
    checkResponse(data)
    return data.data
  },

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE}todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const data: ApiResponse<Task> = await response.json()
    checkResponse(data)
    return data.data
  },

  async deleteTask(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}todos/${id}`, { method: 'DELETE' })
    const data: ApiResponse<Task> = await response.json()
    checkResponse(data)
  }
}
