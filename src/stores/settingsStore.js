
import { ref } from 'vue';
import { supabase } from '@/services/supabase';

const featuresEnabled = ref({
  welcome: true,
  siteName: true,
  siteDescription: true,
  search: true,
});

export const ALL_PROVIDERS = [
  'apple', 'azure', 'bitbucket', 'discord', 'facebook', 'figma', 'github', 'gitlab', 'google', 'kakao', 'keycloak', 'linkedin_oidc', 'notion', 'twitch', 'twitter', 'slack_oidc', 'spotify', 'workos', 'zoom'
];

const providersEnabled = ref({});

const PROVIDER_META = {
  apple: { label: 'Apple', icon: 'logos:apple', bg: '#ececef', border: '#e5e7eb' },
  azure: { label: 'Azure', icon: 'logos:microsoft-azure', bg: '#e0efff', border: '#cfe3ff' },
  bitbucket: { label: 'Bitbucket', icon: 'logos:bitbucket', bg: '#e0e8ff', border: '#d9e0ff' },
  discord: { label: 'Discord', icon: 'logos:discord-icon', bg: '#e0e5ff', border: '#dfe3ff' },
  facebook: { label: 'Facebook', icon: 'logos:facebook', bg: '#e3efff', border: '#dbeafe' },
  figma: { label: 'Figma', icon: 'logos:figma', bg: '#ffe6db', border: '#ffd8cc' },
  github: { label: 'GitHub', icon: 'logos:github-icon', bg: '#e9e9e9', border: '#e5e7eb' },
  gitlab: { label: 'GitLab', icon: 'logos:gitlab-icon', bg: '#ffe6db', border: '#ffd8cc' },
  google: { label: 'Google', icon: 'logos:google-icon', bg: '#e9ebef', border: '#e5e7eb' },
  kakao: { label: 'Kakao', icon: 'streamline-logos:kakao-talk-logo-solid', bg: '#ffeda6', border: '#ffe780', glyph: '#381e1f' },
  keycloak: { label: 'KeyCloak', icon: 'simple-icons:keycloak', bg: '#e0e6ff', border: '#c7d2fe', glyph: '#3262d2' },
  linkedin_oidc: { label: 'LinkedIn (OIDC)', icon: 'logos:linkedin-icon', bg: '#e0efff', border: '#cfe3ff' },
  notion: { label: 'Notion', icon: 'logos:notion-icon', bg: '#ededed', border: '#e5e7eb' },
  twitch: { label: 'Twitch', icon: 'logos:twitch', bg: '#e6d0ff', border: '#e9d5ff' },
  twitter: { label: 'Twitter', icon: 'logos:twitter', bg: '#d6f1ff', border: '#bae6fd' },
  slack_oidc: { label: 'Slack (OIDC)', icon: 'logos:slack-icon', bg: '#e6efff', border: '#e0e7ff' },
  spotify: { label: 'Spotify', icon: 'logos:spotify-icon', bg: '#dfffe0', border: '#bbf7d0' },
  workos: { label: 'WorkOS', icon: 'logos:workos-icon', bg: '#e0e6ff', border: '#c7d2fe' },
  zoom: { label: 'Zoom', icon: 'logos:zoom-icon', bg: '#d6eaff', border: '#bfdbfe' },
};

function providerLabel(key) {
  return PROVIDER_META[key]?.label || key;
}
function providerIcon(key) {
  return PROVIDER_META[key]?.icon || 'mdi:link';
}
function brandBg(key) {
  return PROVIDER_META[key]?.bg || '#f3f4f6';
}
function brandBorder(key) {
  return PROVIDER_META[key]?.border || '#e5e7eb';
}
function providerGlyphColor(key) {
  return PROVIDER_META[key]?.glyph || null;
}


export async function fetchSettings() {
  const { data: featuresData, error: featuresError } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'features_home_enabled')
    .maybeSingle();
  if (!featuresError && featuresData && featuresData.value && typeof featuresData.value === 'object') {
    featuresEnabled.value = {
      welcome: featuresData.value.welcome !== false,
      siteName: featuresData.value.siteName !== false,
      siteDescription: featuresData.value.siteDescription !== false,
      search: featuresData.value.search !== false,
    };
  } else {
    featuresEnabled.value = { welcome: true, siteName: true, siteDescription: true, search: true };
  }

  const { data: provData, error: provError } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'auth_providers_enabled')
    .maybeSingle();
  if (!provError && provData && provData.value && typeof provData.value === 'object') {
    providersEnabled.value = {};
    for (const p of ALL_PROVIDERS) {
      providersEnabled.value[p] = provData.value[p] === true;
    }
  } else {
    providersEnabled.value = {};
    for (const p of ALL_PROVIDERS) providersEnabled.value[p] = false;
  }
}

export async function saveProvidersEnabled(newProviders) {
  await supabase.from('settings').upsert([
    { key: 'auth_providers_enabled', value: newProviders }
  ], { onConflict: 'key' });
  providersEnabled.value = { ...newProviders };
}

export function useSettings() {
  return {
    featuresEnabled,
    providersEnabled,
    ALL_PROVIDERS,
    saveProvidersEnabled,
    providerLabel,
    providerIcon,
    brandBg,
    brandBorder,
    providerGlyphColor,
    PROVIDER_META,
  };
}
