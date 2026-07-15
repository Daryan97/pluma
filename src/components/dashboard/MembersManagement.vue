<template>
  <div class="space-y-6">
    <div
      class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
    >
      <div class="px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shrink-0"
            >
              <Icon icon="mdi:account-group-outline" class="w-5 h-5" />
            </div>
            <div class="min-w-0">
              <h2
                class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"
              >
                {{ t('members.title') }}
              </h2>
              <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                {{ loading ? t('common.loading') : t('members.total', { count: totalCount }) }}
              </p>
            </div>
          </div>
          <div
            class="flex items-center h-9 w-full sm:w-72 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 focus-within:ring-2 focus-within:ring-blue-500"
          >
            <Icon icon="mdi:magnify" class="ms-3 text-gray-400 text-base shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('members.searchPlaceholder')"
              class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"
              @input="onSearchInput"
            />
          </div>
        </div>
      </div>

      <div v-if="loading" class="px-6 py-16 text-center">
        <Icon icon="mdi:loading" class="mx-auto animate-spin text-3xl text-blue-500 mb-3" />
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('members.loading') }}</p>
      </div>

      <div v-else-if="!users.length" class="px-6 py-16 text-center">
        <Icon
          icon="mdi:account-off-outline"
          class="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3"
        />
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('members.empty') }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ t('members.tryDifferentSearch') }}
        </p>
      </div>

      <ul v-else class="divide-y divide-gray-100 dark:divide-gray-700/80">
        <li
          v-for="user in users"
          :key="user.id"
          class="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors"
        >
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <span
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shrink-0"
            >
              {{ initials(user.display_name || user.username) }}
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {{ user.display_name || user.username }}
                </p>
                <span
                  v-if="user.id === currentUserId"
                  class="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                >
                  <Icon icon="mdi:account-check" class="text-xs" />
                  {{ t('members.you') }}
                </span>
              </div>
              <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                @{{ user.username }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-3 sm:shrink-0">
            <span
              class="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-medium"
              :class="roleBadgeClasses(user.role)"
            >
              <Icon :icon="roleIcon(user.role)" class="text-sm" />
              {{ t(`roles.${user.role}`) }}
            </span>

            <div class="relative role-select-wrapper min-w-[8.5rem]">
              <SelectRoot
                :key="user.id + '-' + originalRoles[user.id]"
                v-model="user.role"
                :disabled="updatingRoleId === user.id"
                @update:modelValue="() => updateRole(user)"
              >
                <SelectTrigger
                  class="w-full inline-flex h-8 items-center justify-between rounded-md px-2.5 text-xs bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  :aria-label="t('members.changeRoleAria')"
                >
                  <span class="flex items-center gap-1.5 min-w-0">
                    <Icon :icon="roleIcon(user.role)" class="text-sm shrink-0" />
                    <SelectValue :placeholder="t('members.role')" />
                  </span>
                  <Icon
                    v-if="updatingRoleId === user.id"
                    icon="mdi:loading"
                    class="w-3.5 h-3.5 animate-spin opacity-70"
                  />
                  <Icon
                    v-else
                    icon="radix-icons:chevron-down"
                    class="w-3.5 h-3.5 opacity-70 shrink-0"
                  />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent
                    class="z-[120] min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    :side-offset="4"
                  >
                    <SelectScrollUpButton
                      class="flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500"
                    >
                      <Icon icon="radix-icons:chevron-up" />
                    </SelectScrollUpButton>
                    <SelectViewport class="p-1 text-xs">
                      <SelectGroup>
                        <SelectItem
                          v-for="role in roleInfo"
                          :key="role.value"
                          :value="role.value"
                          class="leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-7 ps-7 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                        >
                          <SelectItemIndicator
                            class="absolute start-0 w-7 inline-flex items-center justify-center"
                          >
                            <Icon icon="radix-icons:check" class="w-4 h-4" />
                          </SelectItemIndicator>
                          <Icon :icon="role.icon" class="me-2 w-4 h-4" />
                          <SelectItemText>{{ role.name }}</SelectItemText>
                        </SelectItem>
                      </SelectGroup>
                    </SelectViewport>
                    <SelectScrollDownButton
                      class="flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500"
                    >
                      <Icon icon="radix-icons:chevron-down" />
                    </SelectScrollDownButton>
                  </SelectContent>
                </SelectPortal>
              </SelectRoot>
            </div>
          </div>
        </li>
      </ul>

      <div
        v-if="!loading && totalPages > 1"
        class="flex items-center justify-center gap-3 px-5 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300"
      >
        <button
          type="button"
          class="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          :disabled="page === 1"
          @click="prevPage"
        >
          <Icon icon="mdi:chevron-left" class="text-base" />
          {{ t('common.prev') }}
        </button>
        <span class="font-medium tabular-nums">{{ t('common.page', { current: page, total: totalPages }) }}</span>
        <button
          type="button"
          class="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          :disabled="page >= totalPages"
          @click="nextPage"
        >
          {{ t('common.next') }}
          <Icon icon="mdi:chevron-right" class="text-base" />
        </button>
      </div>
    </div>

    <ConfirmDialog
      v-if="showConfirm"
      :open="showConfirm"
      :title="t('members.confirmRoleChange')"
      :description="confirmMessage"
      :body="t('members.confirmProceed')"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

import { ref, watch, onMounted, computed } from "vue";
import { supabase } from "@/services/supabase";
import { Icon } from "@iconify/vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "radix-vue";

const toast = useToast();

const loading = ref(true);
const searchQuery = ref("");
let searchTimeout = null;

const users = ref([]);
const currentUserId = ref(null);
const originalRoles = ref({});
const page = ref(1);
const pageSize = 10;
const totalCount = ref(0);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalCount.value / pageSize))
);
const updatingRoleId = ref(null);

const roleInfo = computed(() => [
  {
    value: "reader",
    name: t("roles.reader"),
    description: t("members.descriptions.reader"),
    icon: "mdi:account-box",
  },
  {
    value: "author",
    name: t("roles.author"),
    description: t("members.descriptions.author"),
    icon: "mdi:account-edit",
  },
  {
    value: "admin",
    name: t("roles.admin"),
    description: t("members.descriptions.admin"),
    icon: "mdi:shield-account",
  },
  {
    value: "disabled",
    name: t("roles.disabled"),
    description: t("members.descriptions.disabled"),
    icon: "mdi:account-cancel",
  },
]);

function initials(name) {
  const s = String(name || "?").trim();
  return (s.charAt(0) || "?").toUpperCase();
}

function roleIcon(role) {
  return (
    roleInfo.value.find((r) => r.value === role)?.icon || "mdi:account"
  );
}

function roleBadgeClasses(role) {
  return (
    {
      reader: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      author: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      admin: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      disabled: "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300",
    }[role] || "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
  );
}

function onSearchInput() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchUsers();
  }, 300);
}

async function fetchCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) currentUserId.value = user.id;
}

async function fetchUsers() {
  loading.value = true;
  let query = supabase
    .from("profiles")
    .select("id, username, display_name, role", { count: "exact" })
    .order("username", { ascending: true })
    .range((page.value - 1) * pageSize, page.value * pageSize - 1);

  if (searchQuery.value.trim()) {
    query = query
      .ilike("username", `%${searchQuery.value}%`)
      .or(`display_name.ilike.%${searchQuery.value}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    toast.error(t("members.fetchFailed", { message: error.message }));
  } else {
    users.value = data;
    totalCount.value = count || 0;
    originalRoles.value = data.reduce((acc, u) => {
      acc[u.id] = u.role || "reader";
      return acc;
    }, {});
  }
  loading.value = false;
}

function prevPage() {
  if (page.value > 1) page.value--;
}
function nextPage() {
  if (page.value < totalPages.value) page.value++;
}
watch(page, fetchUsers);

const showConfirm = ref(false);
const confirmMessage = ref("");
let confirmResolve;
function askConfirmation(message) {
  confirmMessage.value = message;
  showConfirm.value = true;
  return new Promise((resolve) => {
    confirmResolve = resolve;
  });
}
function handleConfirm() {
  showConfirm.value = false;
  confirmResolve?.(true);
}
function handleCancel() {
  showConfirm.value = false;
  confirmResolve?.(false);
}

async function updateRole(user) {
  if (user.id === currentUserId.value) {
    const proceed = await askConfirmation(t("members.selfRoleWarning"));
    if (!proceed) {
      user.role = originalRoles.value[user.id] || "reader";
      return;
    }
  }
  updatingRoleId.value = user.id;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role: user.role })
      .eq("id", user.id)
      .select("id, role")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error(t("members.noRowsUpdated"));
    user.role = data.role;
    originalRoles.value[user.id] = data.role;
    toast.success(
      t("members.roleUpdated", { role: data.role, username: user.username })
    );
  } catch (e) {
    toast.error(t("members.updateFailed", { message: e.message }));
    user.role = originalRoles.value[user.id] || "reader";
  } finally {
    updatingRoleId.value = null;
  }
}

onMounted(async () => {
  await fetchCurrentUserId();
  await fetchUsers();
});
</script>

