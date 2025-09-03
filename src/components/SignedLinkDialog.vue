<template>
  <Dialog :open="open" @close="cancel" class="relative z-50">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel class="w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl">
        <DialogTitle class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Icon icon="mdi:link-variant" class="w-5 h-5 text-blue-600" />
          Temporary Link
        </DialogTitle>
        <DialogDescription class="text-sm text-gray-600 dark:text-gray-300 mt-1">Generate a signed URL for temporary access.</DialogDescription>
        <div class="mt-4 space-y-4">
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">Duration (seconds)</label>
            <input
              v-model.trim="secondsInput"
              type="number"
              min="1"
              placeholder="300"
              class="w-full h-11 rounded-md px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keydown.enter.prevent="confirmInternal"
            />
            <p class="text-[11px] text-gray-500 dark:text-gray-400">How long the link should remain valid. Default 300s.</p>
            <p v-if="error" class="text-[11px] text-red-600 dark:text-red-400">{{ error }}</p>
          </div>
          <div v-if="generatedUrl" class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">Generated URL</label>
            <div class="relative">
              <input :value="generatedUrl" readonly class="w-full rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-[12px] text-gray-700 dark:text-gray-200 pr-20" />
              <button type="button" @click="copy" class="absolute top-1/2 -translate-y-1/2 right-2 inline-flex items-center gap-1 h-7 px-2 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[11px] font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60">
                <Icon icon="mdi:content-copy" class="text-sm" /> Copy
              </button>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="cancel" class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400">
            <Icon icon="mdi:close-circle-outline" class="w-4 h-4" /> Cancel
          </button>
          <button v-if="!generatedUrl" @click="confirmInternal" class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Icon icon="mdi:link-plus" class="w-4 h-4" /> Generate
          </button>
          <button v-else @click="closeAfter" class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            <Icon icon="mdi:check-circle-outline" class="w-4 h-4" /> Done
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
  open: Boolean,
  defaultSeconds: { type: Number, default: 300 },
});
const emit = defineEmits(['generate','cancel','close']);

const secondsInput = ref(String(props.defaultSeconds));
const error = ref('');
const generatedUrl = ref('');

watch(() => props.open, (val) => {
  if(val){
    secondsInput.value = String(props.defaultSeconds || 300);
    error.value='';
    generatedUrl.value='';
  }
});

function confirmInternal(){
  error.value='';
  const secs = parseInt(secondsInput.value,10);
  if(!secs || secs<=0){ error.value='Enter a positive number'; return; }
  emit('generate', secs, (url)=>{ generatedUrl.value = url || ''; });
}
function cancel(){ emit('cancel'); }
function closeAfter(){ emit('close'); }
async function copy(){ if(!generatedUrl.value) return; try { await navigator.clipboard.writeText(generatedUrl.value); } catch{} }
</script>
