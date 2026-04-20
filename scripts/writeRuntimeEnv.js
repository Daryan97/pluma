import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')
const outputFile = path.join(distDir, 'env')

function serializeEnv(value, fallback = '') {
  if (value === undefined || value === null) return fallback
  return String(value)
}

const runtimeEnv = {
  VITE_SUPABASE_URL: serializeEnv(process.env.VITE_SUPABASE_URL),
  VITE_SUPABASE_ANON_KEY: serializeEnv(process.env.VITE_SUPABASE_ANON_KEY),
  VITE_ENV: serializeEnv(process.env.VITE_ENV, 'production'),
  VITE_SITE_URL: serializeEnv(process.env.VITE_SITE_URL),
}

async function writeRuntimeFile() {
  await mkdir(distDir, { recursive: true })
  const payload = `${JSON.stringify(runtimeEnv, null, 2)}\n`
  await writeFile(outputFile, payload, 'utf8')
  console.log(`[runtime-env] Wrote ${outputFile}`)
}

writeRuntimeFile().catch((error) => {
  console.error('[runtime-env] Failed to write dist/env file', error)
  process.exitCode = 1
})
