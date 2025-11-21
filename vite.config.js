import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { createFeedsPlugin } from './scripts/createFeedsPlugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  const siteUrl = env.VITE_SITE_URL || process.env.VITE_SITE_URL

  return {
    plugins: [
      vue(),
      tailwindcss(),
      createFeedsPlugin({
        supabaseUrl,
        supabaseAnonKey,
        siteUrl,
        cacheTtl: 1000 * 60 * 5,
      }),
    ],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})
