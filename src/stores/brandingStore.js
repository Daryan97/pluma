import { ref } from 'vue';
import { supabase } from '@/services/supabase';

import { allConfiguredLocaleCodes } from '@/config/contentLocales';

export const DEFAULT_FOOTER_CREDITS = {
    plumaWatermark: true,
    rss: true,
    sitemap: true,
};

export function allConfiguredLocales() {
    return allConfiguredLocaleCodes();
}

function normalizeFooterCredits(raw) {
    const src = raw && typeof raw === 'object' ? raw : {};
    return {
        plumaWatermark: src.plumaWatermark !== false,
        rss: src.rss !== false,
        sitemap: src.sitemap !== false,
    };
}

/** Per-locale siteName / siteDescription map (primary lives at top-level). */
export function normalizeMetaTranslations(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    const out = {};
    for (const [code, entry] of Object.entries(raw)) {
        if (!code || !entry || typeof entry !== 'object') continue;
        const siteName =
            typeof entry.siteName === 'string' ? entry.siteName.trim() || null : null;
        const siteDescription =
            typeof entry.siteDescription === 'string'
                ? entry.siteDescription.trim() || null
                : null;
        if (siteName || siteDescription) {
            out[code] = { siteName, siteDescription };
        }
    }
    return out;
}

export function resolveLocalizedSiteName(locale) {
    const primary = primaryLocale.value || 'en';
    const code = locale || primary;
    if (code !== primary) {
        const tr = metaTranslations.value?.[code];
        // Explicit translation: keep empty; no translation: inherit primary.
        if (tr) return tr.siteName || null;
        return siteName.value;
    }
    return siteName.value;
}

export function resolveLocalizedSiteDescription(locale) {
    const primary = primaryLocale.value || 'en';
    const code = locale || primary;
    if (code !== primary) {
        const tr = metaTranslations.value?.[code];
        if (tr) return tr.siteDescription || null;
        return siteDescription.value;
    }
    return siteDescription.value;
}

export function normalizeLocaleSettings(rawEnabled, rawPrimary) {
    const known = allConfiguredLocales();
    const knownSet = new Set(known);
    let enabled = Array.isArray(rawEnabled)
        ? rawEnabled.map(String).filter((c) => knownSet.has(c))
        : [...known];
    if (!enabled.length) {
        enabled = known.includes('en') ? ['en'] : [known[0]].filter(Boolean);
    }
    let primary = typeof rawPrimary === 'string' ? rawPrimary : 'en';
    if (!enabled.includes(primary)) {
        primary = enabled.includes('en') ? 'en' : enabled[0];
    }
    return { enabledLocales: enabled, primaryLocale: primary };
}

const brandingLoaded = ref(false);
const brandingLoading = ref(false);
const brandingError = ref(null);
const siteName = ref(null);
const siteDescription = ref(null);
const twitterHandle = ref(null);
const footerCredits = ref({ ...DEFAULT_FOOTER_CREDITS });
const socialLinks = ref([]);
const lightLogoUrl = ref(null);
const darkLogoUrl = ref(null);
const faviconUrl = ref(null);
const lightLogoPath = ref(null);
const darkLogoPath = ref(null);
const faviconPath = ref(null);
const logoVersion = ref(Date.now());
const enabledLocales = ref(allConfiguredLocales());
const primaryLocale = ref('en');
const metaTranslations = ref({});

export function isLocaleEnabled(code) {
    if (!code) return false;
    return enabledLocales.value.includes(code);
}

async function saveBrandingSettings(value) {
    const { data: existingRow, error: readErr } = await supabase
        .from('settings')
        .select('key')
        .eq('key', 'branding')
        .maybeSingle();
    if (readErr) return { error: readErr };

    if (existingRow?.key) {
        return supabase.from('settings').update({ value }).eq('key', 'branding');
    }
    return supabase.from('settings').insert({ key: 'branding', value });
}

function storagePathFromPublicUrl(url) {
    if (!url) return null;
    try {
        const m = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
        if (m) {
            return m[2];
        }
    } catch (e) {
        console.warn('[branding] invalid public URL:', url, e);
    }
    return null;
}

export async function fetchBranding(force = false) {
    if (brandingLoaded.value && !force) return;
    brandingLoading.value = true;
    brandingError.value = null;
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'branding')
            .maybeSingle();
        if (error) throw error;
        const value = data?.value || {};
        siteName.value = value.siteName || null;
        siteDescription.value = value.siteDescription || null;
        twitterHandle.value = value.twitterHandle || null;
        footerCredits.value = normalizeFooterCredits(value.footerCredits);
        socialLinks.value = Array.isArray(value.socialLinks) ? value.socialLinks : [];
        lightLogoUrl.value = value.lightLogoUrl || null;
        darkLogoUrl.value = value.darkLogoUrl || null;
        faviconUrl.value = value.faviconUrl || null;
        lightLogoPath.value = value.lightLogoPath || null;
        darkLogoPath.value = value.darkLogoPath || null;
        faviconPath.value = value.faviconPath || null;
        const localesNorm = normalizeLocaleSettings(
            value.enabledLocales,
            value.primaryLocale || value.locale
        );
        enabledLocales.value = localesNorm.enabledLocales;
        primaryLocale.value = localesNorm.primaryLocale;
        metaTranslations.value = normalizeMetaTranslations(value.metaTranslations);
        brandingLoaded.value = true;
    } catch (e) {
        console.error('[branding] fetch error', e);
        if (e.message === 'JWSError JWSInvalidSignature') {
            await supabase.auth.signOut();
            if (import.meta.client) {
                try {
                    await navigateTo('/');
                } catch {
                    window.location.href = '/';
                }
            }
        }

        brandingError.value = e;
    } finally {
        brandingLoading.value = false;
    }
}

export async function updateBranding({
    lightFile,
    darkFile,
    faviconFile,
    siteName: newSiteName,
    siteDescription: newSiteDescription,
    socialLinks: newSocialLinks,
    twitterHandle: newTwitterHandle,
    footerCredits: newFooterCredits,
    enabledLocales: newEnabledLocales,
    primaryLocale: newPrimaryLocale,
    metaTranslations: newMetaTranslations,
}) {
    let existingValue = {};
    const { data: existingRow } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'branding')
        .maybeSingle();
    if (existingRow?.value) existingValue = existingRow.value;

    const newValue = { ...existingValue };
    if (typeof newSiteName === 'string') newValue.siteName = newSiteName.trim() || null;
    if (typeof newSiteDescription === 'string') newValue.siteDescription = newSiteDescription.trim() || null;
    if (typeof newTwitterHandle === 'string') {
        const cleaned = newTwitterHandle.trim().replace(/^@/, '');
        newValue.twitterHandle = cleaned || null;
    }
    if (newFooterCredits && typeof newFooterCredits === 'object') {
        newValue.footerCredits = normalizeFooterCredits(newFooterCredits);
    }
    if (Array.isArray(newSocialLinks)) newValue.socialLinks = newSocialLinks.filter(l => l && l.label && l.url);
    if (newMetaTranslations !== undefined) {
        newValue.metaTranslations = normalizeMetaTranslations(newMetaTranslations);
    }
    if (Array.isArray(newEnabledLocales) || typeof newPrimaryLocale === 'string') {
        const localesNorm = normalizeLocaleSettings(
            Array.isArray(newEnabledLocales) ? newEnabledLocales : existingValue.enabledLocales,
            typeof newPrimaryLocale === 'string'
                ? newPrimaryLocale
                : existingValue.primaryLocale || existingValue.locale
        );
        newValue.enabledLocales = localesNorm.enabledLocales;
        newValue.primaryLocale = localesNorm.primaryLocale;
        newValue.locale = localesNorm.primaryLocale;
        // Drop translations for locales that are no longer enabled.
        const kept = normalizeMetaTranslations(newValue.metaTranslations);
        for (const code of Object.keys(kept)) {
            if (!localesNorm.enabledLocales.includes(code) || code === localesNorm.primaryLocale) {
                delete kept[code];
            }
        }
        newValue.metaTranslations = kept;
    }

    async function uploadVariant(file, variant) {
        if (!file) return;
        let prevUrlOrPath;
        if (variant === 'light') prevUrlOrPath = newValue.lightLogoUrl || newValue.lightLogoPath;
        else if (variant === 'dark') prevUrlOrPath = newValue.darkLogoUrl || newValue.darkLogoPath;
        else if (variant === 'favicon') prevUrlOrPath = newValue.faviconUrl || newValue.faviconPath;
        const prevPath = /^https?:\/\//i.test(prevUrlOrPath) ? storagePathFromPublicUrl(prevUrlOrPath) : prevUrlOrPath;

        const originalName = file.name || '';
        const ext = originalName.includes('.') ? originalName.split('.').pop().toLowerCase() : '';
        const objectPath = ext ? `${variant}.${ext}` : variant;

        const pathsToRemove = [...new Set([prevPath, objectPath].filter(Boolean))];
        if (pathsToRemove.length) {
            try {
                await supabase.storage.from('branding').remove(pathsToRemove);
            } catch (e) {
                console.warn('[branding] remove previous variant failed', variant, pathsToRemove, e);
            }
        }

        // Prefer insert (not upsert) so RLS only needs INSERT after a clean remove.
        const { error: upErr } = await supabase.storage.from('branding').upload(objectPath, file, {
            upsert: false,
            cacheControl: '3600',
            contentType: file.type || 'application/octet-stream',
        });
        if (upErr) {
            const err = new Error(upErr.message || 'Failed to upload branding asset');
            err.cause = upErr;
            err.step = 'storage';
            throw err;
        }

        const { data: pub } = supabase.storage.from('branding').getPublicUrl(objectPath);
        if (variant === 'light') {
            newValue.lightLogoUrl = pub.publicUrl;
            newValue.lightLogoPath = objectPath;
        } else if (variant === 'dark') {
            newValue.darkLogoUrl = pub.publicUrl;
            newValue.darkLogoPath = objectPath;
        } else if (variant === 'favicon') {
            newValue.faviconUrl = pub.publicUrl;
            newValue.faviconPath = objectPath;
        }
    }

    await Promise.all([
        uploadVariant(lightFile, 'light'),
        uploadVariant(darkFile, 'dark'),
        uploadVariant(faviconFile, 'favicon')
    ]);

    const { error } = await saveBrandingSettings(newValue);
    if (error) {
        const err = new Error(error.message || 'Failed to save branding settings');
        err.cause = error;
        err.step = 'settings';
        throw err;
    }
    brandingLoaded.value = false;
    await fetchBranding(true);
    logoVersion.value = Date.now();
}

export async function removeBrandingVariant(variant) {
    const valid = ['light', 'dark', 'favicon'];
    if (!valid.includes(variant)) return;
    let existingValue = {};
    const { data: existingRow } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'branding')
        .single();
    if (existingRow?.value) existingValue = existingRow.value;

    const urlKey = variant === 'light' ? 'lightLogoUrl' : variant === 'dark' ? 'darkLogoUrl' : 'faviconUrl';
    const pathKey = variant === 'light' ? 'lightLogoPath' : variant === 'dark' ? 'darkLogoPath' : 'faviconPath';
    const prevUrlOrPath = existingValue[urlKey] || existingValue[pathKey];
    const prevPath = /^https?:\/\//i.test(prevUrlOrPath) ? storagePathFromPublicUrl(prevUrlOrPath) : prevUrlOrPath;

    if (prevPath) {
        try { await supabase.storage.from('branding').remove([prevPath]); } catch (e) { console.warn('[branding] remove variant file failed', variant, e); }
    }

    delete existingValue[urlKey];
    delete existingValue[pathKey];

    const { error } = await saveBrandingSettings(existingValue);
    if (error) throw error;
    brandingLoaded.value = false;
    await fetchBranding(true);
    logoVersion.value = Date.now();
}

export function useBranding() {
    return {
        brandingLoaded,
        brandingLoading,
        brandingError,
        siteName,
        siteDescription,
        twitterHandle,
        footerCredits,
        socialLinks,
        lightLogoUrl,
        darkLogoUrl,
        faviconUrl,
        lightLogoPath,
        darkLogoPath,
        faviconPath,
        logoVersion,
        enabledLocales,
        primaryLocale,
        metaTranslations,
        fetchBranding,
        updateBranding,
        removeBrandingVariant,
        isLocaleEnabled,
        allConfiguredLocales,
        resolveLocalizedSiteName,
        resolveLocalizedSiteDescription,
    };
}
