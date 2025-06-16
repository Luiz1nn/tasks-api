import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { validateTask } from './middlewares/validate-task.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const users = database.select('tasks')

      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const error = validateTask(req)

      if (error) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error }))
      }

      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
      }

      database.insert('tasks', task)

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
]