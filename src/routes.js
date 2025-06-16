import { Database } from './database.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: '/tasks',
    handler: (req, res) => {
      const users = database.select('users')

      return res.end(JSON.stringify(users))
    }
  }
]