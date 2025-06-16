import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { validateTask } from './middlewares/validate-task.js';

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: '/tasks',
    handler: (req, res) => {
      const users = database.select('tasks')

      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: '/tasks',
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
        created_at: new Date().toString(),
        updated_at: new Date().toString(),
        completed_at: null,
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
]