import { ref } from 'vue';
import { supabase } from '@/services/supabase';

const statsEnabled = ref({ posts: true, categories: true, authors: true });
const statsSettingsLoaded = ref(false);

export async function fetchStatsSettings() {
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

export function useStatsSettings() {
  return { statsEnabled, statsSettingsLoaded, fetchStatsSettings };
}
