<template>
  <div class="space-y-6">
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 members-table-wrapper"
    >
      <div
        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"
      >
        <h2
          class="text-sm font-semibold tracking-wide text-gray-900 dark:text-white flex items-center gap-2"
        >
          <Icon
            icon="mdi:account-group-outline"
            class="text-blue-500 text-base"
          />
          Members
          <span
            v-if="!loading"
            class="text-[11px] font-normal text-gray-500 dark:text-gray-400"
            >({{ totalCount }})</span
          >
        </h2>
        <div class="relative w-full sm:w-80">
          <div class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
            <Icon icon="mdi:magnify" class="ml-3 text-gray-500 dark:text-gray-300 text-base" />
            <input
              v-model="searchQuery"
              @input="onSearchInput"
              type="text"
              placeholder="Search members..."
              class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div
        v-if="loading"
        class="text-sm text-gray-500 dark:text-gray-400 py-10 text-center"
      >
        Loading members...
      </div>
      <div v-else class="rounded-b-2xl">
        <!-- Responsive scroll wrapper -->
        <div class="overflow-x-auto -mx-4 sm:mx-0">
          <table
            class="min-w-[780px] w-full text-left text-sm text-gray-800 dark:text-gray-100 border-separate border-spacing-0"
          >
          <thead
            class="bg-gray-50 dark:bg-gray-900 text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300"
          >
            <tr>
              <th class="px-6 py-3 font-medium text-left">Username</th>
              <th class="px-6 py-3 font-medium text-left">Display Name</th>
              <th class="px-6 py-3 font-medium text-left">Role</th>
              <th class="px-6 py-3 font-medium text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="user in users"
              :key="user.id"
              class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td
                class="px-6 py-3 align-top font-medium text-gray-800 dark:text-gray-100 flex items-center gap-1"
              >
                <span>{{ user.username }}</span>
                <Icon
                  v-if="user.id === currentUserId"
                  icon="mdi:account-check"
                  class="text-blue-500 dark:text-blue-400 text-base"
                />
              </td>
              <td class="px-6 py-3 align-top text-gray-700 dark:text-gray-300">
                {{ user.display_name || "-" }}
              </td>
              <td class="px-6 py-3 align-top">
                <span
                  class="inline-flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium capitalize transition select-none"
                  :class="{
                    'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300':
                      user.role === 'reader',
                    'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300':
                      user.role === 'author',
                    'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300':
                      user.role === 'admin',
                    'bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300':
                      user.role === 'disabled',
                  }"
                >
                  <Icon
                    :icon="
                      roleInfo.find((r) => r.name.toLowerCase() === user.role)
                        ?.icon
                    "
                    class="text-base"
                  />
                  {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-3 align-top">
                <div class="relative role-select-wrapper">
                  <SelectRoot
                    :key="user.id + '-' + originalRoles[user.id]"
                    v-model="user.role"
                    @update:modelValue="() => updateRole(user)"
                    :disabled="updatingRoleId === user.id"
                  >
                    <SelectTrigger
                      class="w-full inline-flex h-8 items-center justify-between rounded border px-2 text-xs bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:opacity-50"
                      aria-label="Change role"
                    >
                      <span class="flex items-center gap-2">
                        <Icon
                          :icon="roleInfo.find(r => r.name.toLowerCase() === user.role)?.icon"
                          class="text-base"
                        />
                        <SelectValue :placeholder="'Select role'" />
                      </span>
                      <Icon icon="radix-icons:chevron-down" class="w-4 h-4 opacity-70" />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectContent
                        class="z-[120] min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                        :side-offset="4"
                      >
                        <SelectScrollUpButton class="flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500">
                          <Icon icon="radix-icons:chevron-up" />
                        </SelectScrollUpButton>
                        <SelectViewport class="p-1 text-xs">
                          <SelectGroup>
                            <SelectItem
                              v-for="role in roleInfo"
                              :key="role.name"
                              :value="role.name.toLowerCase()"
                              class="leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-7 pl-7 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                            >
                              <SelectItemIndicator class="absolute left-0 w-7 inline-flex items-center justify-center">
                                <Icon icon="radix-icons:check" class="w-4 h-4" />
                              </SelectItemIndicator>
                              <Icon :icon="role.icon" class="mr-2 w-4 h-4" />
                              <SelectItemText>{{ role.name }}</SelectItemText>
                            </SelectItem>
                          </SelectGroup>
                        </SelectViewport>
                        <SelectScrollDownButton class="flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500">
                          <Icon icon="radix-icons:chevron-down" />
                        </SelectScrollDownButton>
                      </SelectContent>
                    </SelectPortal>
                  </SelectRoot>
                </div>
                <span
                  v-if="updatingRoleId === user.id"
                  class="ml-2 inline-flex items-center text-xs text-gray-500 dark:text-gray-400"
                >
                  <Icon icon="mdi:loading" class="animate-spin mr-1" />
                  Saving
                </span>
              </td>
            </tr>
            <tr v-if="!users.length">
              <td
                colspan="4"
                class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                No members found.
              </td>
            </tr>
          </tbody>
          </table>
        </div>
        <div
          v-if="!loading"
          class="flex justify-center items-center gap-4 text-gray-700 dark:text-gray-300 px-6 py-4 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl"
        >
          <button
            @click="prevPage"
            :disabled="page === 1"
            class="inline-flex items-center gap-2 h-8 px-3 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <Icon icon="mdi:chevron-left" class="text-base" />
            Prev
          </button>
          <span class="text-xs font-medium"
            >Page {{ page }} / {{ totalPages }}</span
          >
          <button
            @click="nextPage"
            :disabled="page >= totalPages"
            class="inline-flex items-center gap-2 h-8 px-3 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Next
            <Icon icon="mdi:chevron-right" class="text-base" />
          </button>
        </div>
      </div>
    </div>
    <ConfirmDialog
      v-if="showConfirm"
      :open="showConfirm"
      title="Confirm Role Change"
      :description="confirmMessage"
      body="Are you sure you want to proceed?"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { supabase } from "@/services/supabase";
import { Icon } from "@iconify/vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { useToast } from "vue-toastification";
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
} from 'radix-vue';

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

const roleInfo = [
  {
    name: "Reader",
    description: "Can read and comment on posts.",
    icon: "mdi:account-box",
  },
  {
    name: "Author",
    description: "Can create and edit their own posts.",
    icon: "mdi:account-edit",
  },
  {
    name: "Admin",
    description: "Can manage all users and posts.",
    icon: "mdi:shield-account",
  },
  {
    name: "Disabled",
    description: "Cannot log in or access any features.",
    icon: "mdi:account-cancel",
  },
];

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
    toast.error("Failed to fetch members: " + error.message);
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
    const proceed = await askConfirmation(
      "You are changing your own role. This may remove your admin access. Continue?"
    );
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
    if (!data) throw new Error("No rows updated. Check RLS policies.");
    user.role = data.role;
    originalRoles.value[user.id] = data.role;
    toast.success(`Role updated to ${data.role} for ${user.username}`);
  } catch (e) {
    toast.error("Error updating role: " + e.message);
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
