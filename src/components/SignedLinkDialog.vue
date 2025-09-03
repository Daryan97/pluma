<template>
  <Dialog :open="open" @close="cancel" class="relative z-50">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel
        class="w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl"
      >
        <DialogTitle
          class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2"
        >
          <Icon icon="mdi:link-variant" class="w-5 h-5 text-blue-600" />
          Temporary Link
        </DialogTitle>
        <DialogDescription class="text-sm text-gray-600 dark:text-gray-300 mt-1"
          >Generate a signed URL for temporary access.</DialogDescription
        >
        <div class="mt-4 space-y-4">
          <div class="space-y-2">
            <label
              class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"
              >Duration (seconds)</label
            >
            <div class="flex items-center gap-2">
              <button
                type="button"
                :disabled="!!generatedUrl"
                class="h-11 w-11 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-lg font-semibold select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:dark:hover:bg-gray-700"
                @click="
                  !generatedUrl && (secondsInput = String(
                    Math.max(1, (parseInt(secondsInput, 10) || 0) - 1)
                  ))
                "
                aria-label="Decrease duration"
              >
                <Icon icon="mdi:minus" class="text-lg" />
              </button>
              <input
                v-model.trim="secondsInput"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                min="1"
                placeholder="300"
                :disabled="!!generatedUrl"
                class="w-full h-11 rounded-md px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:dark:bg-gray-700 disabled:text-gray-500 disabled:dark:text-gray-400"
                @keydown="!generatedUrl && digitsKeydown($event)"
                @input="!generatedUrl && digitsInput($event)"
                @keydown.enter.prevent="!generatedUrl && confirmInternal()"
              />
              <button
                type="button"
                :disabled="!!generatedUrl"
                class="h-11 w-11 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-lg font-semibold select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:dark:hover:bg-gray-700"
                @click="
                  !generatedUrl && (secondsInput = String(
                    Math.min(MAX_SECONDS, Math.max(1, (parseInt(secondsInput, 10) || 0) + 1))
                  ))
                "
                aria-label="Increase duration"
              >
                <Icon icon="mdi:plus" class="text-lg" />
              </button>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              How long the link should remain valid. Default 300s.
            </p>
            <p v-if="error" class="text-[11px] text-red-600 dark:text-red-400">
              {{ error }}
            </p>
          </div>
          <div v-if="generatedUrl" class="space-y-2">
            <label
              class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"
              >Generated URL</label
            >
            <div class="relative">
              <input
                :value="generatedUrl"
                readonly
                class="w-full rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-[12px] text-gray-700 dark:text-gray-200 pr-20"
              />
              <button
                type="button"
                @click="copy"
                class="absolute top-1/2 -translate-y-1/2 right-2 inline-flex items-center gap-1 h-6 px-1 rounded bg-blue-600 text-white dark:bg-blue-500/90 dark:text-white text-[10px] font-medium shadow hover:bg-blue-700 dark:hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 transition-colors"
                aria-label="Copy URL"
              >
                <Icon
                  icon="mdi:content-copy"
                  class="w-3.5 h-3.5"
                  v-if="!urlCopied"
                />
                <Icon icon="mdi:check" class="w-3.5 h-3.5" v-else />
                <span v-if="!urlCopied">Copy</span>
                <span v-else>Copied!</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="cancel"
            class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <Icon icon="mdi:close-circle-outline" class="w-4 h-4" /> Cancel
          </button>
          <button
            v-if="!generatedUrl"
            @click="confirmInternal"
            class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Icon icon="mdi:link-plus" class="w-4 h-4" /> Generate
          </button>
          <button
            v-else
            @click="closeAfter"
            class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          >
            <Icon icon="mdi:check-circle-outline" class="w-4 h-4" /> Done
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  open: Boolean,
  defaultSeconds: { type: Number, default: 300 },
});
const emit = defineEmits(["generate", "cancel", "close"]);

const MAX_SECONDS = 43200; // 12 hours
const secondsInput = ref(String(Math.min(props.defaultSeconds, MAX_SECONDS)));
const error = ref("");
const generatedUrl = ref("");
const urlCopied = ref(false);

watch(
  () => props.open,
  (val) => {
    if (val) {
  secondsInput.value = String(Math.min(props.defaultSeconds || 300, MAX_SECONDS));
      error.value = "";
      generatedUrl.value = "";
    }
  }
);

function digitsKeydown(e) {
  const allowed = [
    "Backspace",
    "Delete",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
  ];
  if (e.ctrlKey || e.metaKey) return;
  if (allowed.includes(e.key)) return;
  if (/^[0-9]$/.test(e.key)) return;
  e.preventDefault();
}
function digitsInput(e) {
  const cleaned = e.target.value.replace(/\D+/g, "");
  if (!cleaned) {
    secondsInput.value = "";
    return;
  }
  let val = parseInt(cleaned, 10);
  if (isNaN(val)) val = 1;
  if (val < 1) val = 1;
  if (val > MAX_SECONDS) val = MAX_SECONDS;
  secondsInput.value = String(val);
}
function confirmInternal() {
  error.value = "";
  const secs = parseInt(secondsInput.value, 10);
  if (!secs || secs <= 0) {
    error.value = "Enter a positive number";
    return;
  }
  if (secs > MAX_SECONDS) {
    error.value = `Maximum allowed is ${MAX_SECONDS} seconds`;
    return;
  }
  emit("generate", secs, (url) => {
    generatedUrl.value = url || "";
  });
}
function cancel() {
  emit("cancel");
}
function closeAfter() {
  emit("close");
}
async function copy() {
  if (!generatedUrl.value) return;
  try {
    await navigator.clipboard.writeText(generatedUrl.value);
    urlCopied.value = true;
    setTimeout(() => {
      urlCopied.value = false;
    }, 1500);
  } catch {}
}
</script>
