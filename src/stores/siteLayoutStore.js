import { supabase } from '@/services/supabase'

export const POST_LIST_LAYOUTS = ['classic', 'magazine', 'compact']

/**
 * SSR-safe site layout settings. Call from Nuxt setup / asyncData only.
 */
export function useSiteLayout() {
  const postListLayout = useState('siteLayout.postList', () => 'classic')
  const siteLayoutLoaded = useState('siteLayout.loaded', () => false)

  function normalizeLayout(raw) {
    const value =
      raw && typeof raw === 'object' ? raw.postList : typeof raw === 'string' ? raw : null
    return POST_LIST_LAYOUTS.includes(value) ? value : 'classic'
  }

  async function fetchSiteLayout() {
    if (siteLayoutLoaded.value) return postListLayout.value

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'site_layout')
      .maybeSingle()

    if (!error && data?.value != null) {
      postListLayout.value = normalizeLayout(data.value)
    } else {
      postListLayout.value = 'classic'
    }
    siteLayoutLoaded.value = true
    return postListLayout.value
  }

  async function saveSiteLayout(postList) {
    const layout = normalizeLayout({ postList })
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'site_layout', value: { postList: layout } })
    if (error) throw error
    postListLayout.value = layout
    siteLayoutLoaded.value = true
    return layout
  }

  return {
    postListLayout,
    siteLayoutLoaded,
    fetchSiteLayout,
    saveSiteLayout,
    normalizeLayout,
  }
}
