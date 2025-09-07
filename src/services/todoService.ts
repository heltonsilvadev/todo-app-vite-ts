interface Task {
  id: number;
  task: string;
  completed: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const todoService = {
  async getTasks(): Promise<Task[]> {
    const response = await fetch('/api/todos')
    const data: ApiResponse<Task[]> = await response.json()
    return data.data
  },

  async createTask(task: string): Promise<Task> {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    })
    const data: ApiResponse<Task> = await response.json()
    return data.data
  },

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const data: ApiResponse<Task> = await response.json()
    return data.data
  },

  async deleteTask(id: number): Promise<void> {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
  }
}
