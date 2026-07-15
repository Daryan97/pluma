import { buildWebManifest, sendWebManifest } from '../utils/webManifest.js'

export default defineEventHandler(async (event) => {
  return sendWebManifest(event, await buildWebManifest(event))
})
