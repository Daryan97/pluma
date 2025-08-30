<template>
  <Dialog :open="open" @close="setIsOpen" class="relative z-50">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />

    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel
        class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl"
      >
        <DialogTitle class="text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <Icon icon="mdi:alert-circle-outline" class="w-6 h-6 text-red-600 inline-block mr-2" aria-hidden="true" />
          {{ title }}
        </DialogTitle>
        <DialogDescription
          class="text-sm text-gray-600 dark:text-gray-300 mt-1"
        >
          {{ description }}
        </DialogDescription>

        <p class="mt-4 text-sm text-gray-700 dark:text-gray-400">
          {{ body }}
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="cancel"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Icon icon="mdi:close-circle-outline" class="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
            <span>Cancel</span>
          </button>
          <button
            @click="confirm"
            class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Icon icon="mdi:check-circle-outline" class="w-4 h-4 text-white/90" aria-hidden="true" />
            <span>Confirm</span>
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  open: Boolean,
  title: String,
  description: String,
  body: String,
});

const emit = defineEmits(["confirm", "cancel"]);

const confirm = () => emit("confirm");
const cancel = () => emit("cancel");
const setIsOpen = () => emit("cancel");
</script>
