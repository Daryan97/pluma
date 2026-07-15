import { createFeedGenerator } from '../utils/createFeedGenerator.js'
import { parseFeedFilters } from '../utils/feeds/generator.js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filters = parseFeedFilters(query)
  if (typeof query.locale === 'string') filters.locale = query.locale

  const generator = createFeedGenerator(event)
  const { sitemap } = await generator.generate({ rssFilters: filters })
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=60')
  return sitemap
})
