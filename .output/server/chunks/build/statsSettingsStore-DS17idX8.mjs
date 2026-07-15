import { ref } from 'vue';
import { s as supabase } from './server.mjs';

const statsEnabled = ref({ posts: true, categories: true, authors: true });
const statsSettingsLoaded = ref(false);
async function fetchStatsSettings() {
  const { data, error } = await supabase.from("settings").select("value").eq("key", "stats_home_enabled").maybeSingle();
  if (!error && data && data.value && typeof data.value === "object") {
    statsEnabled.value = {
      posts: data.value.posts !== false,
      categories: data.value.categories !== false,
      authors: data.value.authors !== false
    };
  } else {
    statsEnabled.value = { posts: true, categories: true, authors: true };
  }
  statsSettingsLoaded.value = true;
}
function useStatsSettings() {
  return { statsEnabled, statsSettingsLoaded, fetchStatsSettings };
}

export { fetchStatsSettings as f, useStatsSettings as u };
//# sourceMappingURL=statsSettingsStore-DS17idX8.mjs.map
