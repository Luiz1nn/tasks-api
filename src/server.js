import http from 'node:http'
import { csvParse } from './middlewares/csv-parse.js'
import { json } from './middlewares/json.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { routes } from './routes.js'

const server = http.createServer(async (req, res) => {
  const contentType = req.headers['content-type']
  if (contentType?.includes('text/csv')) {
    await csvParse(req)
  }
  else {
    await json(req, res)
  }

  const { method, url } = req

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)