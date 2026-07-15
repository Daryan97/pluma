<template>
  <CheckboxRoot
    :checked="resolvedChecked"
    :disabled="disabled"
    :required="required"
    :name="name"
    :value="value"
    :class="rootClass"
    :aria-label="ariaLabel"
    @update:checked="onUpdate"
  >
    <CheckboxIndicator class="flex items-center justify-center text-current">
      <Icon
        :icon="indeterminate ? 'mdi:minus' : 'mdi:check'"
        class="w-3.5 h-3.5"
      />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>

<script setup>
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { CheckboxRoot, CheckboxIndicator } from "radix-vue";

const props = defineProps({
  modelValue: { type: [Boolean, String], default: false },
  checked: { type: [Boolean, String], default: undefined },
  indeterminate: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  name: { type: String, default: undefined },
  value: { type: String, default: "on" },
  ariaLabel: { type: String, default: undefined },
  size: { type: String, default: "md" },
});

const emit = defineEmits(["update:modelValue", "update:checked", "change"]);

const resolvedChecked = computed(() => {
  if (props.indeterminate) return "indeterminate";
  if (props.checked !== undefined) return props.checked;
  return props.modelValue;
});

const rootClass = computed(() => {
  const size = props.size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return [
    size,
    "inline-flex items-center justify-center shrink-0 rounded-[5px] border transition",
    "border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-900/50",
    "text-transparent data-[state=checked]:text-white data-[state=indeterminate]:text-white",
    "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600",
    "data-[state=indeterminate]:bg-blue-600 data-[state=indeterminate]:border-blue-600",
    "hover:border-blue-400 dark:hover:border-blue-400",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    "dark:focus-visible:ring-offset-gray-900",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300",
    "cursor-pointer",
  ].join(" ");
});

function onUpdate(val) {
  const next = val === "indeterminate" ? false : !!val;
  emit("update:modelValue", next);
  emit("update:checked", next);
  emit("change", next);
}
</script>
