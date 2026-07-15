import { vercelHandler } from './_lib.js'

export default vercelHandler(async (_req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify({ ok: true }))
})
