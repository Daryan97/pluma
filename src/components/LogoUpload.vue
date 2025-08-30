<template>
  <div class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
    <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
      <Icon icon="mdi:image-edit" class="text-blue-500" /> Site Branding
    </h3>

    <div class="grid sm:grid-cols-2 gap-4">
      <!-- Light -->
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Light Logo</label>
        <div
          class="relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md text-gray-500 dark:text-gray-400 hover:border-blue-400 cursor-pointer"
          :class="{ 'border-blue-500': dragLight }"
          @dragover.prevent="dragLight = true"
          @dragleave.prevent="dragLight = false"
          @drop.prevent="onDrop($event, 'light')"
        >
          <input type="file" accept="image/png,image/svg+xml,image/jpeg" class="hidden" ref="lightInput" @change="onFileChange('light')" />
          <div v-if="lightPreview" class="w-full flex flex-col items-center gap-2">
            <img :src="lightPreview" alt="Light Logo Preview" class="max-h-20 object-contain" />
            <button type="button" @click="clearFile('light')" class="text-xs text-red-600 hover:underline">Remove</button>
          </div>
          <template v-else>
            <Icon icon="mdi:image-outline" class="text-3xl" />
            <p class="text-xs">Click or drop file</p>
          </template>
          <button type="button" class="absolute inset-0" @click="lightInput.click()" aria-label="Select light logo" />
        </div>
      </div>

      <!-- Dark -->
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Dark Logo</label>
        <div
          class="relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md text-gray-500 dark:text-gray-400 hover:border-blue-400 cursor-pointer"
          :class="{ 'border-blue-500': dragDark }"
          @dragover.prevent="dragDark = true"
          @dragleave.prevent="dragDark = false"
          @drop.prevent="onDrop($event, 'dark')"
        >
          <input type="file" accept="image/png,image/svg+xml,image/jpeg" class="hidden" ref="darkInput" @change="onFileChange('dark')" />
          <div v-if="darkPreview" class="w-full flex flex-col items-center gap-2">
            <img :src="darkPreview" alt="Dark Logo Preview" class="max-h-20 object-contain bg-gray-900 p-1 rounded" />
            <button type="button" @click="clearFile('dark')" class="text-xs text-red-600 hover:underline">Remove</button>
          </div>
          <template v-else>
            <Icon icon="mdi:image-outline" class="text-3xl" />
            <p class="text-xs">Click or drop file</p>
          </template>
          <button type="button" class="absolute inset-0" @click="darkInput.click()" aria-label="Select dark logo" />
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button
        @click="upload"
        :disabled="(!lightFile && !darkFile) || uploading"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 disabled:opacity-50 hover:bg-blue-700"
      >
        <Icon icon="mdi:upload" class="text-base" />
        <span v-if="!uploading">Upload</span>
        <span v-else>Uploading...</span>
      </button>
      <p class="text-xs text-gray-500 dark:text-gray-400">PNG / JPG / SVG. Max ~2MB each.</p>
    </div>

    <div v-if="error" class="text-xs text-red-600">{{ error }}</div>

  <div class="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3" v-if="branding.lightLogoUrl.value">
        <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <span class="font-medium">Light:</span>
      <img :src="`${branding.lightLogoUrl.value}?v=${branding.logoVersion.value}`" alt="Current light logo" class="h-8 object-contain bg-white p-1 rounded" />
        </div>
        <button @click="remove('light')" class="text-[11px] px-2 py-1 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60">Remove</button>
      </div>
      <div class="flex items-center gap-3" v-if="branding.darkLogoUrl.value">
        <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <span class="font-medium">Dark:</span>
      <img :src="`${branding.darkLogoUrl.value}?v=${branding.logoVersion.value}`" alt="Current dark logo" class="h-8 object-contain bg-gray-900 p-1 rounded" />
        </div>
        <button @click="remove('dark')" class="text-[11px] px-2 py-1 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60">Remove</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useBranding, updateBranding, fetchBranding, removeBrandingVariant } from '@/stores/brandingStore';
import { useToast } from 'vue-toastification';

const branding = useBranding();
const toast = useToast();

const lightInput = ref(null);
const darkInput = ref(null);
const lightFile = ref(null);
const darkFile = ref(null);
const lightPreview = ref(null);
const darkPreview = ref(null);
const dragLight = ref(false);
const dragDark = ref(false);
const uploading = ref(false);
const error = ref(null);

function validate(file) {
  if (!file) return false;
  const allowed = ['image/png', 'image/jpeg', 'image/svg+xml'];
  if (!allowed.includes(file.type)) {
    error.value = 'Unsupported file type';
    return false;
  }
  if (file.size > 2000 * 1024) {
    error.value = 'File too large (>2MB)';
    return false;
  }
  return true;
}

function readPreview(file, target) {
  if (!file) return;
  if (file.type === 'image/svg+xml') {
    const reader = new FileReader();
    reader.onload = () => { target.value = reader.result; };
    reader.readAsDataURL(file);
  } else {
    const url = URL.createObjectURL(file);
    target.value = url;
  }
}

function onFileChange(kind) {
  const input = kind === 'light' ? lightInput.value : darkInput.value;
  const file = input.files[0];
  if (!validate(file)) { input.value = ''; return; }
  if (kind === 'light') { lightFile.value = file; readPreview(file, lightPreview); }
  else { darkFile.value = file; readPreview(file, darkPreview); }
  error.value = null;
}

function onDrop(e, kind) {
  const dtFile = e.dataTransfer.files[0];
  if (!validate(dtFile)) return;
  if (kind === 'light') { lightFile.value = dtFile; readPreview(dtFile, lightPreview); dragLight.value = false; }
  else { darkFile.value = dtFile; readPreview(dtFile, darkPreview); dragDark.value = false; }
  error.value = null;
}

function clearFile(kind) {
  if (kind === 'light') { lightFile.value = null; lightPreview.value = null; lightInput.value.value = ''; }
  else { darkFile.value = null; darkPreview.value = null; darkInput.value.value = ''; }
}

async function upload() {
  if (!lightFile.value && !darkFile.value) return;
  uploading.value = true;
  error.value = null;
  try {
    await updateBranding({ lightFile: lightFile.value, darkFile: darkFile.value });
    await fetchBranding(true);
    toast.success('Branding updated');
    clearFile('light');
    clearFile('dark');
  } catch (e) {
    console.error(e);
    error.value = e.message || 'Upload failed';
    toast.error('Upload failed');
  } finally {
    uploading.value = false;
  }
}

async function remove(kind) {
  try {
    await removeBrandingVariant(kind);
    toast.success(`${kind.charAt(0).toUpperCase() + kind.slice(1)} logo removed`);
  } catch (e) {
    console.error(e);
    toast.error('Remove failed');
  }
}
</script>

<style scoped>
button[aria-label] { outline: none; }
</style>
