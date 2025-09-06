import { ref } from 'vue';
import { supabase } from '@/services/supabase';
import router from '@/router';

const brandingLoaded = ref(false);
const brandingLoading = ref(false);
const brandingError = ref(null);
const siteName = ref(null);
const siteDescription = ref(null);
const socialLinks = ref([]);
const lightLogoUrl = ref(null);
const darkLogoUrl = ref(null);
const faviconUrl = ref(null);
const lightLogoPath = ref(null);
const darkLogoPath = ref(null);
const faviconPath = ref(null);
const logoVersion = ref(Date.now());

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
        socialLinks.value = Array.isArray(value.socialLinks) ? value.socialLinks : [];
        lightLogoUrl.value = value.lightLogoUrl || null;
        darkLogoUrl.value = value.darkLogoUrl || null;
        faviconUrl.value = value.faviconUrl || null;
        lightLogoPath.value = value.lightLogoPath || null;
        darkLogoPath.value = value.darkLogoPath || null;
        faviconPath.value = value.faviconPath || null;
        brandingLoaded.value = true;
    } catch (e) {
        console.error('[branding] fetch error', e);
        if (e.message === 'JWSError JWSInvalidSignature') {
            await supabase.auth.signOut();
            router.push('/');
        }

        brandingError.value = e;
    } finally {
        brandingLoading.value = false;
    }
}

export async function updateBranding({ lightFile, darkFile, faviconFile, siteName: newSiteName, siteDescription: newSiteDescription, socialLinks: newSocialLinks }) {
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
    if (Array.isArray(newSocialLinks)) newValue.socialLinks = newSocialLinks.filter(l => l && l.label && l.url);

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

        if (prevPath && prevPath !== objectPath) {
            try { await supabase.storage.from('branding').remove([prevPath]); } catch (e) { console.warn('[branding] remove previous variant failed (different path)', variant, prevPath, e); }
        } else {
            try { await supabase.storage.from('branding').remove([objectPath]); } catch (_) {
                console.warn('[branding] remove previous variant failed (same path)', variant, objectPath, _);
            }
        }

        const { error: upErr } = await supabase.storage.from('branding').upload(objectPath, file, { upsert: true, cacheControl: '3600', contentType: file.type });
        if (upErr) throw upErr;

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

    const { error } = await supabase.from('settings').upsert({ key: 'branding', value: newValue });
    if (error) throw error;
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

    const { error } = await supabase.from('settings').upsert({ key: 'branding', value: existingValue });
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
        socialLinks,
        lightLogoUrl,
        darkLogoUrl,
        faviconUrl,
        lightLogoPath,
        darkLogoPath,
        faviconPath,
        logoVersion,
        fetchBranding,
        updateBranding,
        removeBrandingVariant
    };
}
