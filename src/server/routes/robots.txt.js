import { createFeedGenerator } from '../utils/createFeedGenerator.js'

export default defineEventHandler(async (event) => {
  const generator = createFeedGenerator(event)
  const { robots } = await generator.generate()
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return robots
})
