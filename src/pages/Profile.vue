<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1
      class="text-3xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight"
    >
      My Profile
    </h1>

  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto">
      <!-- Auth User Info -->
      <section
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col"
      >
        <header class="flex items-center mb-4">
          <div class="flex items-center gap-2">
            <Icon
              icon="mdi:shield-account"
              class="flex-shrink-0 text-blue-500 dark:text-blue-400 text-xl"
            />
            <h2
              class="flex items-center text-base font-semibold tracking-wide text-gray-700 dark:text-gray-200"
            >
              Authentication
            </h2>
          </div>
        </header>

        <div v-if="!emailEdit">
          <dl
            class="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
          >
            <dt
              class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400"
            >
              <Icon
                icon="mdi:identification-card"
                class="text-blue-500 dark:text-blue-400 text-sm"
              />
              ID
            </dt>
            <dd class="truncate">{{ authUser.id }}</dd>
            <dt
              class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400"
            >
              <Icon
                icon="mdi:email-outline"
                class="text-blue-500 dark:text-blue-400 text-sm"
              />
              Email
            </dt>
            <dd class="break-all flex items-center gap-3 flex-wrap">
              <span>{{ authUser.email }}</span>
              <button
                v-if="!emailEdit"
                @click="startEmailEdit"
                class="inline-flex items-center h-7 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Change
              </button>
            </dd>
            <dt
              class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400"
            >
              <Icon
                icon="mdi:key"
                class="text-blue-500 dark:text-blue-400 text-sm"
              />
              Password
            </dt>
            <dd class="flex items-center gap-3">
              <span class="text-gray-500 dark:text-gray-400 italic"
                >Hidden</span
              >
              <button
                @click="router.push('/change-password')"
                class="inline-flex items-center h-7 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Change
              </button>
            </dd>
            <dt
              class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400"
            >
              <Icon
                icon="mdi:calendar-check"
                class="text-blue-500 dark:text-blue-400 text-sm"
              />
              Created
            </dt>
            <dd>{{ formatDate(authUser.created_at) }}</dd>
          </dl>
        </div>

        <div v-else>
          <form @submit.prevent="saveEmail">
            <div class="mb-2">
              <label
                class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
              >
                New Email:
              </label>
              <input
                v-model="emailAuthInput"
                type="email"
                class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div class="mt-4 flex space-x-2">
              <button
                type="submit"
                :disabled="savingEmail"
                class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {{ savingEmail ? "Sending…" : "Send Change Request" }}
              </button>
              <button
                type="button"
                @click="cancelEmailEdit"
                class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Profile Table Info -->
      <section
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col"
      >
        <header class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <Icon
              icon="mdi:account"
              class="flex-shrink-0 text-blue-500 dark:text-blue-400 text-xl"
            />
            <h2
              class="flex items-center text-base font-semibold tracking-wide text-gray-700 dark:text-gray-200"
            >
              Profile
            </h2>
          </div>
          <button
            v-if="!editMode"
            @click="startEdit"
            class="inline-flex items-center h-7 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit
          </button>
        </header>

        <div v-if="!editMode">
          <dl
            class="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
          >
            <dt
              class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400"
            >
              <Icon
                icon="mdi:account-circle"
                class="text-blue-500 dark:text-blue-400 text-sm"
              />
              Username
            </dt>
            <dd class="truncate">{{ profile?.username || "N/A" }}</dd>
            <dt
              class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400"
            >
              <Icon
                icon="mdi:account-box"
                class="text-blue-500 dark:text-blue-400 text-sm"
              />
              Display
            </dt>
            <dd class="truncate">{{ profile?.display_name || "N/A" }}</dd>
          </dl>
        </div>

        <div v-else>
          <form @submit.prevent="saveProfile">
            <div class="mb-2">
              <label
                class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
              >
                Username:
              </label>
              <input
                v-model="usernameInput"
                class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div class="mb-2">
              <label
                class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
              >
                Display Name:
              </label>
              <input
                v-model="displayNameInput"
                class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div class="mt-4 flex space-x-2">
              <button
                type="submit"
                class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save
              </button>
              <button
                type="button"
                @click="cancelEdit"
                class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Avatar Management -->
      <section
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col md:col-span-2 lg:col-span-1"
      >
        <header class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <Icon
              icon="mdi:account-circle-outline"
              class="flex-shrink-0 text-blue-500 dark:text-blue-400 text-xl"
            />
            <h2
              class="flex items-center text-base font-semibold tracking-wide text-gray-700 dark:text-gray-200"
            >
              Avatar
            </h2>
          </div>
          <button
            v-if="avatarUrl && !uploadingAvatar"
            @click="removeAvatar"
            class="inline-flex items-center h-7 px-3 rounded-md text-[11px] font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Remove
          </button>
        </header>

        <div class="flex flex-col items-center gap-4">
          <!-- Hidden file input -->
          <input
            ref="avatarInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onAvatarFileChange"
          />
          <div class="relative">
            <button
              type="button"
              @click="avatarInputRef?.click()"
              class="relative group w-32 h-32 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
            >
              <img
                v-if="avatarUrl && !avatarPreview"
                :src="avatarUrl"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <img
                v-else-if="avatarPreview"
                :src="avatarPreview"
                alt="New Avatar Preview"
                class="w-full h-full object-cover opacity-90"
              />
              <Icon v-else icon="mdi:account" class="text-6xl text-gray-400" />
              <div
                class="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition"
              >
                <Icon icon="mdi:camera" class="text-white text-xl mb-1" />
                <span class="text-[11px] tracking-wide font-medium text-white"
                  >Click to Change</span
                >
              </div>
            </button>
            <div
              v-if="avatarPreview"
              class="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-[10px] font-semibold shadow ring-2 ring-white dark:ring-gray-800 select-none"
            >
              Preview
            </div>
          </div>
          <div class="flex gap-2" v-if="avatarPreview">
            <button
              @click="uploadAvatar"
              :disabled="uploadingAvatar"
              class="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Icon
                :icon="uploadingAvatar ? 'mdi:loading' : 'mdi:upload'"
                :class="uploadingAvatar ? 'animate-spin' : ''"
                class="text-sm"
              />
              <span>{{ uploadingAvatar ? "Uploading..." : "Save" }}</span>
            </button>
            <button
              @click="cancelAvatarSelection"
              :disabled="uploadingAvatar"
              class="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <Icon icon="mdi:close" class="text-sm" />
              <span>Cancel</span>
            </button>
          </div>
          <p
            v-if="!avatarPreview"
            class="text-[11px] text-gray-500 dark:text-gray-400"
          >
            Click the avatar to upload a new one.
          </p>
        </div>
      </section>

      <!-- Linked Accounts -->
      <section
        v-if="enabledProviders.length > 0"
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col md:col-span-3 lg:col-span-3"
      >
        <header class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <Icon
              icon="mdi:link"
              class="flex-shrink-0 text-blue-500 dark:text-blue-400 text-xl"
            />
            <h2
              class="flex items-center text-base font-semibold tracking-wide text-gray-700 dark:text-gray-200"
            >
              Linked Accounts
            </h2>
          </div>
        </header>
        <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="provider in visibleProviders"
            :key="provider"
            class="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40 p-5 flex flex-col items-center text-center transition shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500"
          >
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center shadow-inner mb-2 border transition"
              :style="{ backgroundColor: brandBg(provider), borderColor: brandBorder(provider) }"
            >
              <Icon :icon="providerIcon(provider)" class="text-3xl" :style="{ color: providerGlyphColor(provider) || undefined }" />
            </div>
            <span class="font-medium text-gray-800 dark:text-gray-200 text-xs tracking-wide">{{ providerLabel(provider) }}</span>
            <div class="mt-3">
              <button
                v-if="!isLinked(provider)"
                @click="linkProvider(provider)"
                class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Icon icon="mdi:link" class="text-sm" />
                <span>Link</span>
              </button>
              <button
                v-else
                @click="unlinkProvider(provider)"
                class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[11px] font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Icon icon="tabler:unlink" class="text-sm" />
                <span>Unlink</span>
              </button>
            </div>
            <div
              class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-500/5 to-transparent"
            />
          </div>
          <!-- Expand/Collapse if many providers -->
        </div>
        <div v-if="hasOverflow" class="flex justify-center mt-2">
          <button
            type="button"
            @click="expanded = !expanded"
            class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
          >
            {{ expanded ? 'Show less' : `Show ${enabledProviders.length - COLLAPSED_COUNT} more` }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { supabase } from "@/services/supabase";
import { useToast } from "vue-toastification";
import { Icon } from "@iconify/vue";
import { useRoute, useRouter } from "vue-router";
import { useSettings, fetchSettings, ALL_PROVIDERS } from "@/stores/settingsStore";

const toast = useToast();
const route = useRoute();
const router = useRouter();

const authUser = ref({});
const profile = ref(null);

const avatarUrl = ref(null);
const avatarFile = ref(null);
const avatarPreview = ref(null);
const uploadingAvatar = ref(false);
const avatarInputRef = ref(null);

const editMode = ref(false);
const emailEdit = ref(false);
const usernameInput = ref("");
const displayNameInput = ref("");
const emailAuthInput = ref("");
const savingEmail = ref(false);
const lastRequestedEmail = ref("");

// Provider settings
const { providersEnabled, providerLabel, providerIcon, brandBg, brandBorder, providerGlyphColor } = useSettings();
const enabledProviders = computed(() =>
  ALL_PROVIDERS.filter((p) => providersEnabled.value?.[p] === true)
);

// Collapsible list logic for Linked Accounts (mirror Login)
const COLLAPSED_COUNT = 8; // show more items here since tiles are larger
const expanded = ref(false);
const hasOverflow = computed(() => enabledProviders.value.length > COLLAPSED_COUNT);
const visibleProviders = computed(() =>
  expanded.value ? enabledProviders.value : enabledProviders.value.slice(0, COLLAPSED_COUNT)
);

// Brand tints for icon circle
// provider helpers now sourced from settings store

const isLinked = (provider) =>
  !!authUser.value.identities?.some((i) => i.provider === provider);

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function storagePathFromPublicUrl(publicUrl, bucket = "profile-avatar") {
  try {
    const u = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;
    const rel = u.pathname.substring(idx + marker.length);
    return decodeURIComponent(rel);
  } catch {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(
      publicUrl.substring(idx + marker.length).split("?")[0]
    );
  }
}

async function loadUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    authUser.value = user;
    const { data, error } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (!error) {
      profile.value = data;
      avatarUrl.value = data.avatar_url || null;
    }
  }
}

onMounted(async () => {
  await loadUser();
  await fetchSettings();

  if (route.query.error) {
    const msg = route.query.error_description
      ? decodeURIComponent(route.query.error_description)
      : route.query.error;
    toast.error(msg);
    router.replace({ path: route.path, query: {} });
  } else if (route.query.edit === "true") {
    startEdit();
    router.replace({ path: route.path, query: {} });
  }
});

onBeforeUnmount(() => {
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value);
});

function startEdit() {
  usernameInput.value = profile.value?.username || "";
  displayNameInput.value = profile.value?.display_name || "";
  editMode.value = true;
}
function cancelEdit() {
  editMode.value = false;
}

async function saveProfile() {
  const { data: existing, error: dupError } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", usernameInput.value)
    .neq("id", authUser.value.id)
    .limit(1);

  if (dupError) {
    toast.error("Error checking username uniqueness");
    return;
  }
  if (existing && existing.length > 0) {
    toast.error("Username already taken");
    return;
  }

  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update({
      username: usernameInput.value,
      display_name: displayNameInput.value,
    })
    .eq("id", authUser.value.id)
    .select("username, display_name")
    .single();

  if (error) {
    toast.error("Failed to update profile");
  } else {
    profile.value = updatedProfile;
    toast.success("Profile updated");
    window.dispatchEvent(new Event("profileUpdated"));
    editMode.value = false;
  }
}

function startEmailEdit() {
  emailAuthInput.value = "";
  emailEdit.value = true;
}
function cancelEmailEdit() {
  emailEdit.value = false;
}

async function saveEmail() {
  if (savingEmail.value) return;
  savingEmail.value = true;

  if (emailAuthInput.value === lastRequestedEmail.value) {
    savingEmail.value = false;
    return;
  }

  if (emailAuthInput.value && emailAuthInput.value !== authUser.value.email) {
    const { data, error } = await supabase.auth.updateUser(
      { email: emailAuthInput.value },
      { emailRedirectTo: `${window.location.origin}/profile` }
    );

    if (error) {
      toast.error(error.message || "Failed to change email");
      savingEmail.value = false;
      return;
    }

    authUser.value.email = data.user.email;
    toast.success("Email change request sent");
    lastRequestedEmail.value = emailAuthInput.value;
  } else {
    toast.error("Please enter a new email address");
    savingEmail.value = false;
    return;
  }

  emailEdit.value = false;
  savingEmail.value = false;
}

function onAvatarFileChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const okTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!okTypes.includes(file.type)) {
    toast.error("Only PNG/JPEG/WEBP images are allowed");
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    toast.error("File too large (max 2MB)");
    return;
  }

  avatarFile.value = file;
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value);
  avatarPreview.value = URL.createObjectURL(file);
}

function cancelAvatarSelection() {
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value);
  avatarPreview.value = null;
  avatarFile.value = null;
  if (avatarInputRef.value) avatarInputRef.value.value = "";
}

async function uploadAvatar() {
  if (!avatarFile.value || uploadingAvatar.value) return;
  uploadingAvatar.value = true;

  try {
    const { data, error } = await supabase.storage
      .from("profile-avatar")
      .list("", { limit: 1 });
  } catch (e) {
    console.error("list() threw:", e);
  }

  try {
    const userId = authUser.value?.id;
    if (!userId) throw new Error("Not authenticated");
    const originalName = avatarFile.value.name || "";
    const ext = originalName.includes(".")
      ? originalName.split(".").pop().toLowerCase()
      : "png";
    const filePath = `${userId}/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("profile-avatar")
      .upload(filePath, avatarFile.value, {
        upsert: false,
        contentType: avatarFile.value.type,
      });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage
      .from("profile-avatar")
      .getPublicUrl(filePath);

    const { error: updErr } = await supabase
      .from("profiles")
      .update({ avatar_url: pub.publicUrl })
      .eq("id", userId);
    if (updErr) throw updErr;

    avatarUrl.value = pub.publicUrl;
    toast.success("Avatar updated");
    window.dispatchEvent(new Event("profileUpdated"));
    cancelAvatarSelection();
  } catch (e) {
    console.error(e);
    toast.error(e.message || "Failed to upload avatar");
  } finally {
    uploadingAvatar.value = false;
  }
}

async function removeAvatar() {
  if (!avatarUrl.value) return;

  try {
    const path = storagePathFromPublicUrl(avatarUrl.value, "profile-avatar");
    if (path) {
      const { error: remErr } = await supabase.storage
        .from("profile-avatar")
        .remove([path]);
      if (remErr) throw remErr;
    }

    const { error: updErr } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", authUser.value.id);
    if (updErr) throw updErr;

    avatarUrl.value = null;
    toast.success("Avatar removed");
    window.dispatchEvent(new Event("profileUpdated"));
  } catch (e) {
    console.warn("Storage removal issue", e);
    toast.error(e.message || "Failed to remove avatar");
  }
}

async function linkProvider(provider) {
  const { data, error } = await supabase.auth.linkIdentity({
    provider,
    options: {
      redirectTo: `${window.location.origin}/profile`,
      skipBrowserRedirect: true,
    },
  });
  if (error) {
    toast.error(error.message);
    return;
  }
  window.location.assign(data.url);
}

async function unlinkProvider(provider) {
  const user = authUser.value;
  if (!user) {
    toast.error("Not authenticated");
    return;
  }

  const identity = user.identities?.find((i) => i.provider === provider);
  if (!identity) {
    toast.error(`No linked ${provider} account`);
    return;
  }

  const identityId = identity.identity_id || identity.id;
  if (!identityId) {
    toast.error("identity_id not found");
    return;
  }

  const { error } = await supabase.auth.unlinkIdentity({
    identity_id: identityId,
  });
  if (error) {
    toast.error(error.message);
    return;
  }

  toast.success(`${provider} account unlinked`);
  await loadUser();
}
</script>
