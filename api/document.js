import { buildDocumentResponse, vercelHandler } from './_lib.js'

export default vercelHandler(async (req, res) => {
  const host = req.headers?.host || 'localhost'
  const url = new URL(req.url || '/', `https://${host}`)
  let path = url.searchParams.get('path') || '/'
  path = decodeURIComponent(path).replace(/\/+/g, '/')
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  if (!path.startsWith('/')) path = `/${path}`

  const { status, body, contentType, robots } = await buildDocumentResponse(req, path || '/')
  res.statusCode = status
  res.setHeader('Content-Type', contentType)
  res.setHeader('Cache-Control', 'no-cache')
  if (robots) res.setHeader('X-Robots-Tag', robots)
  res.end(body)
})
