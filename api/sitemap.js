import { buildFeedResponse, vercelHandler } from './_lib.js'

export default vercelHandler(async (req, res) => {
  const { body, contentType } = await buildFeedResponse(req, 'sitemap')
  res.statusCode = 200
  res.setHeader('Content-Type', contentType)
  res.setHeader('Cache-Control', 'public, max-age=60')
  res.end(body)
})
