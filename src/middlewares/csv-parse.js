import { parse } from 'csv-parse'

export async function csvParse(req) {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const fullStreamContent = Buffer.concat(buffers).toString()

  let records = []
  const parser = parse(fullStreamContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })

  for await (const record of parser) {
    if (!record.title || !record.description) {
      return res
        .writeHead(400)
        .end(JSON.stringify({ error: "CSV deve conter as colunas 'title' e 'description' preenchidas." }))
    }

    records.push({
      title: record.title,
      description: record.description
    })
  }

  req.body = records
}