import { createClient } from '@supabase/supabase-js'
import { loadRuntimeEnv } from '@/lib/runtimeEnv'

const {
  VITE_SUPABASE_URL: supabaseUrl,
  VITE_SUPABASE_ANON_KEY: supabaseAnonKey,
} = await loadRuntimeEnv()

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
