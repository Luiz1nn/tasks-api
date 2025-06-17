import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'
import { Database } from './database.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.query

      const users = database.select('tasks', title|| description ? {
        title,
        description,
      } : null)

      return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = Array.isArray(req.body) ? req.body : [req.body]

      const invalid = tasks.find(task => !task.title || !task.description)
      if (invalid) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: "Cada tarefa precisa de 'title' e 'description'" }))
      }

      for (const { title, description } of tasks) {
        const task = {
          id: randomUUID(),
          title,
          description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: null,
        }

        database.insert('tasks', task)
      }

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const updated = database.update('tasks', id, {
        title,
        description,
      })

      if (!updated) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Tarefa não encontrada.' }))
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const updated = database.patch('tasks', id)

      if (!updated) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Tarefa não encontrada.' }))
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const updated = database.delete('tasks', id)

      if (!updated) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Tarefa não encontrada.' }))
      }

      return res.writeHead(204).end()
    }
  }
]