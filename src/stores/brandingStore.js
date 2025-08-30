import { ref } from 'vue';
import { supabase } from '@/services/supabase';

// Clean branding store: stores public URLs (lightLogoUrl, darkLogoUrl) in settings table.
const brandingLoaded = ref(false);
const brandingLoading = ref(false);
const brandingError = ref(null);
const lightLogoUrl = ref(null);
const darkLogoUrl = ref(null);
// Also expose storage-relative paths (derived) for UI display if needed
const lightLogoPath = ref(null);
const darkLogoPath = ref(null);
// Version key to force cache-busting in UI when logos change
const logoVersion = ref(Date.now());

// Convert a Supabase public storage URL -> path inside the bucket (without bucket name)
function storagePathFromPublicUrl(url) {
    if (!url) return null;
    try {
        // Pattern: .../storage/v1/object/public/<bucket>/<path_inside_bucket>
        const m = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
        if (m) {
            // m[1] is bucket name, m[2] is the object path we want
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
            .single();
        if (error) throw error;
        const value = data?.value || {};
        lightLogoUrl.value = value.lightLogoUrl || null;
        darkLogoUrl.value = value.darkLogoUrl || null;
        lightLogoPath.value = value.lightLogoPath || null;
        darkLogoPath.value = value.darkLogoPath || null;
        brandingLoaded.value = true;
    } catch (e) {
        console.error('[branding] fetch error', e);
        brandingError.value = e;
    } finally {
        brandingLoading.value = false;
    }
}

export async function updateBranding({ lightFile, darkFile }) {
    // Fetch existing to merge values
    let existingValue = {};
    const { data: existingRow } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'branding')
        .single();
    if (existingRow?.value) existingValue = existingRow.value;

    const newValue = { ...existingValue }; // preserve other keys

    async function uploadVariant(file, variant) {
        if (!file) return;
        // Determine previously stored object path (if any)
        const prevUrlOrPath = variant === 'light' ? (newValue.lightLogoUrl || newValue.lightLogoPath) : (newValue.darkLogoUrl || newValue.darkLogoPath);
        const prevPath = /^https?:\/\//i.test(prevUrlOrPath) ? storagePathFromPublicUrl(prevUrlOrPath) : prevUrlOrPath;

        // Build new deterministic path using variant plus current file extension
        const originalName = file.name || '';
        const ext = originalName.includes('.') ? originalName.split('.').pop().toLowerCase() : '';
    const objectPath = ext ? `${variant}.${ext}` : variant; // e.g. light.png / dark.svg

        // If previous path exists and is different from the target path, remove it first
        if (prevPath && prevPath !== objectPath) {
            try { await supabase.storage.from('branding').remove([prevPath]); } catch (e) { console.warn('[branding] remove previous variant failed (different path)', variant, prevPath, e); }
        } else {
            // Remove the existing file at objectPath (overwrite scenario)
            try { await supabase.storage.from('branding').remove([objectPath]); } catch (_) {/* ignore if not present */}
        }

        // Upload new file (allow upsert to avoid race conditions)
        const { error: upErr } = await supabase.storage.from('branding').upload(objectPath, file, { upsert: true, cacheControl: '3600', contentType: file.type });
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage.from('branding').getPublicUrl(objectPath);
        if (variant === 'light') {
            newValue.lightLogoUrl = pub.publicUrl;
            newValue.lightLogoPath = objectPath; // store path too for future flexibility
        } else {
            newValue.darkLogoUrl = pub.publicUrl;
            newValue.darkLogoPath = objectPath;
        }
    }

    await Promise.all([
        uploadVariant(lightFile, 'light'),
        uploadVariant(darkFile, 'dark')
    ]);

    const { error } = await supabase.from('settings').upsert({ key: 'branding', value: newValue });
    if (error) throw error;
    brandingLoaded.value = false;
    await fetchBranding(true);
    logoVersion.value = Date.now();
}

// Remove a specific branding variant ('light' | 'dark') – deletes file then updates settings
export async function removeBrandingVariant(variant) {
    const valid = ['light', 'dark'];
    if (!valid.includes(variant)) return;
    // Fetch latest
    let existingValue = {};
    const { data: existingRow } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'branding')
        .single();
    if (existingRow?.value) existingValue = existingRow.value;

    const urlKey = variant === 'light' ? 'lightLogoUrl' : 'darkLogoUrl';
    const pathKey = variant === 'light' ? 'lightLogoPath' : 'darkLogoPath';
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
        lightLogoUrl,
        darkLogoUrl,
        lightLogoPath,
        darkLogoPath,
    logoVersion,
        fetchBranding,
        updateBranding,
        removeBrandingVariant
    };
}
