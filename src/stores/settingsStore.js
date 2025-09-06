import { ref } from 'vue';
import { supabase } from '@/services/supabase';

const featuresEnabled = ref({
  welcome: true,
  siteName: true,
  siteDescription: true,
  search: true,
});

export async function fetchSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'features_home_enabled')
    .maybeSingle();
  if (!error && data && data.value && typeof data.value === 'object') {
    featuresEnabled.value = {
      welcome: data.value.welcome !== false,
      siteName: data.value.siteName !== false,
      siteDescription: data.value.siteDescription !== false,
      search: data.value.search !== false,
    };
  } else {
    featuresEnabled.value = { welcome: true, siteName: true, siteDescription: true, search: true };
  }
}

export function useSettings() {
  return { featuresEnabled };
}
