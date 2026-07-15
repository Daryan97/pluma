<template>
  <Dialog :open="open" @close="setIsOpen" class="relative z-50">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />

    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel
        class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl"
      >
        <DialogTitle class="text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <Icon
            :icon="icon"
            class="w-6 h-6 inline-block mr-2"
            :class="tone === 'soft' ? 'text-blue-500' : 'text-red-600'"
            aria-hidden="true"
          />
          {{ title }}
        </DialogTitle>
        <DialogDescription
          class="text-sm text-gray-600 dark:text-gray-300 mt-1"
        >
          {{ description }}
        </DialogDescription>

        <p v-if="body" class="mt-4 text-sm text-gray-700 dark:text-gray-400">
          {{ body }}
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="cancel"
            class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2"
            :class="
              tone === 'soft'
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:ring-blue-500'
                : 'bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:ring-gray-400'
            "
          >
            <Icon
              :icon="tone === 'soft' ? 'mdi:heart' : 'mdi:close-circle-outline'"
              class="w-4 h-4"
              aria-hidden="true"
            />
            <span>{{ cancelText }}</span>
          </button>
          <button
            @click="confirm"
            class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2"
            :class="
              tone === 'soft'
                ? 'bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:ring-gray-400'
                : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:ring-red-500'
            "
          >
            <Icon
              :icon="tone === 'soft' ? 'mdi:eye-off-outline' : 'mdi:check-circle-outline'"
              class="w-4 h-4"
              aria-hidden="true"
            />
            <span>{{ confirmText }}</span>
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup>
import { computed } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";
import { Icon } from "@iconify/vue";

const { t } = useI18n();

const props = defineProps({
  open: Boolean,
  title: String,
  description: String,
  body: { type: String, default: "" },
  confirmLabel: { type: String, default: null },
  cancelLabel: { type: String, default: null },
  tone: { type: String, default: "danger" }, // 'danger' | 'soft'
  icon: { type: String, default: "mdi:alert-circle-outline" },
});

const confirmText = computed(() => props.confirmLabel || t("common.confirm"));
const cancelText = computed(() => props.cancelLabel || t("common.cancel"));

const emit = defineEmits(["confirm", "cancel"]);

const confirm = () => emit("confirm");
const cancel = () => emit("cancel");
const setIsOpen = () => emit("cancel");
</script>
