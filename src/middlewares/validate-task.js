export function validateTask(req) {
  const { title, description } = req.body || {}

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return "O campo 'title' é obrigatório e deve ser uma string não vazia."
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    return "O campo 'description' é obrigatório e deve ser uma string não vazia."
  }

  return null
}