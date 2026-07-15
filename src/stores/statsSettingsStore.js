import { supabase } from '@/services/supabase';

/**
 * SSR-safe stats settings. Call from Nuxt setup / asyncData only.
 */
export function useStatsSettings() {
  const statsEnabled = useState('stats.enabled', () => ({
    posts: true,
    categories: true,
    authors: true,
  }));
  const statsSettingsLoaded = useState('stats.loaded', () => false);

  async function fetchStatsSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'stats_home_enabled')
      .maybeSingle();
    if (!error && data && data.value && typeof data.value === 'object') {
      statsEnabled.value = {
        posts: data.value.posts !== false,
        categories: data.value.categories !== false,
        authors: data.value.authors !== false,
      };
    } else {
      statsEnabled.value = { posts: true, categories: true, authors: true };
    }
    statsSettingsLoaded.value = true;
  }

  return { statsEnabled, statsSettingsLoaded, fetchStatsSettings };
}

// No standalone fetchStatsSettings export — see settingsStore note on auto-imports.

