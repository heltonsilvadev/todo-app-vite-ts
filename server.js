import express from 'express'
import cors from 'cors'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Dados
let tasks = []
let nextId = 1

// GET /api/todos
app.get('/api/todos', (req, res) => {
  res.json({
    success: true,
    data: tasks
  })
})

// POST /api/todos
app.post('/api/todos', (req, res) => {
  const { task } = req.body

  if (!task || !task.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Campo obrigatório'
    })
  }

  const newTask = {
    id: nextId++,
    task: task.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  }

  tasks.push(newTask)

  res.status(201).json({
    success: true,
    data: newTask
  })
})

// PUT /api/todos/:id
app.put('/api/todos/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id))

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Tarefa não encontrada'
    })
  }

  if (req.body.task !== undefined) {
    task.task = req.body.task.trim()
  }

  if (req.body.completed !== undefined) {
    task.completed = Boolean(req.body.completed)
  }

  res.json({
    success: true,
    data: task
  })
})

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id))

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Tarefa não encontrada'
    })
  }

  const deletedTask = tasks.splice(index, 1)[0]

  res.json({
    success: true,
    data: deletedTask
  })
})

app.listen(3001, () => {
  console.log('Serveidor rodando em http://localhost:3001')
})
