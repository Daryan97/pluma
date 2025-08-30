<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <h1
      class="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"
    >
      <Icon
        icon="mdi:account-group"
        class="text-indigo-600 dark:text-indigo-400 text-3xl"
      />
      Members Management
    </h1>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8">
      <!-- Search Input -->
      <div class="mb-4 relative max-w-sm">
        <input
          v-model="searchQuery"
          @input="onSearchInput"
          type="text"
          placeholder="Search members..."
          class="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <Icon
          icon="mdi:magnify"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
        />
      </div>
      <table class="w-full text-left text-sm text-gray-700 dark:text-gray-200">
        <thead class="bg-gray-100 dark:bg-gray-900">
          <tr>
            <th class="px-6 py-3">Username</th>
            <th class="px-6 py-3">Display Name</th>
            <th class="px-6 py-3">Role</th>
            <th class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-t border-gray-200 dark:border-gray-700"
          >
            <td class="flex items-center px-6 py-4">
              {{ user.username }}
              <span
                v-if="user.id === currentUserId"
                class="ml-1 text-sm text-gray-500 dark:text-gray-400"
              >
                <Icon
                  icon="mdi:account-check"
                  class="text-blue-500 dark:text-blue-400"
                  width="16"
                />
              </span>
            </td>
            <td class="px-6 py-4">{{ user.display_name || "-" }}</td>
            <td class="px-6 py-4 capitalize">
              <span
                class="inline-flex items-center gap-2"
                :class="{
                  'text-green-600 dark:text-green-400': user.role === 'reader',
                  'text-blue-600 dark:text-blue-400': user.role === 'author',
                  'text-red-600 dark:text-red-400': user.role === 'admin',
                }"
              >
                <Icon
                  :icon="
                    roleInfo.find((r) => r.name.toLowerCase() === user.role)
                      ?.icon
                  "
                  class="text-lg"
                />
                {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <Listbox
                as="div"
                v-model="user.role"
                @update:modelValue="() => updateRole(user)"
                class="relative inline-block w-full text-left"
              >
                <ListboxLabel class="sr-only">Role</ListboxLabel>
                <ListboxButton
                  class="flex items-center justify-between w-full border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                >
                  <span class="flex items-center gap-2">
                    <Icon
                      :icon="
                        roleInfo.find((r) => r.name.toLowerCase() === user.role)
                          ?.icon
                      "
                      class="text-lg"
                    />
                    {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
                  </span>
                  <Icon icon="mdi:chevron-down" class="text-lg" />
                </ListboxButton>
                <ListboxOptions
                  as="ul"
                  class="absolute mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-10"
                >
                  <ListboxOption
                    as="li"
                    v-for="role in roleInfo"
                    :key="role.name"
                    :value="role.name.toLowerCase()"
                    v-slot="{ active, selected }"
                    class="cursor-pointer select-none relative py-2 pl-3 pr-9 list-none"
                    :class="active ? 'bg-indigo-100 dark:bg-indigo-800' : ''"
                  >
                    <span
                      :class="
                        selected
                          ? 'text-indigo-600'
                          : 'text-gray-800 dark:text-gray-100'
                      "
                      class="flex items-center gap-2"
                    >
                      <Icon :icon="role.icon" class="text-lg" />
                      {{ role.name }}
                    </span>
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 dark:text-indigo-400"
                    >
                      <Icon icon="mdi:check" class="text-lg" />
                    </span>
                  </ListboxOption>
                </ListboxOptions>
              </Listbox>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination Controls -->
    <div class="mt-4 flex justify-center items-center gap-4 text-gray-700 dark:text-gray-300">
      <button
        @click="prevPage"
        :disabled="page === 1"
        class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {{ page }} of {{ Math.ceil(totalCount / pageSize) }}</span>
      <button
        @click="nextPage"
        :disabled="page >= Math.ceil(totalCount / pageSize)"
        class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
  <ConfirmDialog
    :open="showConfirm"
    title="Confirm Role Change"
    :description="confirmMessage"
    body="Are you sure you want to proceed?"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { supabase } from "@/services/supabase";
import { useToast } from "vue-toastification";
import { Icon } from "@iconify/vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import {
  Listbox,
  ListboxOption,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
} from "@headlessui/vue";

const searchQuery = ref("");
let searchTimeout = null;

function onSearchInput() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchUsers();
  }, 300);
}

const users = ref([]);
const currentUserId = ref(null);
const originalRoles = ref({});
const toast = useToast();
const page = ref(1);
const pageSize = 10;
const totalCount = ref(0);

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
];

async function fetchCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) currentUserId.value = user.id;
}

async function fetchUsers() {
  let query = supabase
    .from("profiles")
    .select("id, username, display_name, role", { count: 'exact' })
    .order("username", { ascending: true });

  if (searchQuery.value.trim()) {
    query = query.ilike("username", `%${searchQuery.value}%`)
      .or(`display_name.ilike.%${searchQuery.value}%`);
  }
  const { data, error, count } = await query.range(
    (page.value - 1) * pageSize,
    page.value * pageSize - 1
  );
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
}

function prevPage() {
  if (page.value > 1) page.value--;
}
function nextPage() {
  const last = Math.ceil(totalCount.value / pageSize);
  if (page.value < last) page.value++;
}

watch(page, fetchUsers);

const showConfirm = ref(false);
const confirmMessage = ref("");

let confirmAction = () => {};

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
  confirmResolve(true);
}

function handleCancel() {
  showConfirm.value = false;
  confirmResolve(false);
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
  const { error } = await supabase
    .from("profiles")
    .update({ role: user.role })
    .eq("id", user.id);
  if (error) {
    toast.error("Error updating role: " + error.message);
  } else {
    toast.success(`Role updated to ${user.role} for ${user.username}`);
  }
}

onMounted(() => {
  fetchCurrentUserId();
  fetchUsers();
});
</script>
