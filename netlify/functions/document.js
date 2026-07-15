import { buildDocumentResponse } from '../../api/_lib.js'

export default async (req, res) => {
  try {
    // Netlify provides original path via headers
    const raw =
      req.headers['x-forwarded-uri'] ||
      req.headers['x-netlify-original-pathname'] ||
      req.url ||
      '/'
    let path = String(raw).split('?')[0]
    if (path.startsWith('/.netlify/functions/document')) path = '/'
    path = path.replace(/\/+/g, '/') || '/'
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)

    const { status, body, contentType, robots } = await buildDocumentResponse(req, path)
    res.statusCode = status
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'no-cache')
    if (robots) res.setHeader('X-Robots-Tag', robots)
    res.end(body)
  } catch (error) {
    console.error('[netlify-document]', error)
    res.statusCode = 500
    res.end('Internal Server Error')
  }
}
