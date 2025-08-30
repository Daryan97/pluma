<template>
  <div class="max-w-md mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
      My Profile
    </h1>

    <!-- Auth User Info -->
    <section class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center mb-2">
        <h2
          class="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-300"
        >
          <Icon
            icon="mdi:shield-account"
            class="text-xl mr-2 text-gray-600 dark:text-gray-400"
          />
          Authentication Details
        </h2>
        <button
          v-if="!emailEdit"
          @click="startEmailEdit"
          class="text-sm text-blue-500 hover:underline"
        >
          Change Email
        </button>
      </div>

      <div v-if="!emailEdit">
        <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li class="flex items-center gap-2">
            <Icon
              icon="mdi:identification-card"
              class="text-base text-gray-500 dark:text-gray-400"
            />
            <span class="font-medium">ID:</span> {{ authUser.id }}
          </li>
          <li class="flex items-center gap-2">
            <Icon
              icon="mdi:email-outline"
              class="text-base text-gray-500 dark:text-gray-400"
            />
            <span class="font-medium">Email:</span> {{ authUser.email }}
          </li>
          <li class="flex items-center gap-2">
            <Icon
              icon="mdi:calendar-check"
              class="text-base text-gray-500 dark:text-gray-400"
            />
            <span class="font-medium">Created At:</span>
            {{ formatDate(authUser.created_at) }}
          </li>
        </ul>
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
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {{ savingEmail ? "Sending…" : "Send Change Request" }}
            </button>
            <button
              type="button"
              @click="cancelEmailEdit"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Profile Table Info -->
    <section class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div class="flex justify-between items-center mb-2">
        <h2
          class="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-300"
        >
          <Icon
            icon="mdi:account"
            class="text-xl mr-2 text-gray-600 dark:text-gray-400"
          />
          Profile Details
        </h2>
        <button
          v-if="!editMode"
          @click="startEdit"
          class="text-sm text-blue-500 hover:underline"
        >
          Edit
        </button>
      </div>

      <div v-if="!editMode">
        <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li class="flex items-center gap-2">
            <Icon
              icon="mdi:account-circle"
              class="text-base text-gray-500 dark:text-gray-400"
            />
            <span class="font-medium">Username:</span>
            {{ profile?.username || "N/A" }}
          </li>
          <li class="flex items-center gap-2">
            <Icon
              icon="mdi:account-box"
              class="text-base text-gray-500 dark:text-gray-400"
            />
            <span class="font-medium">Display Name:</span>
            {{ profile?.display_name || "N/A" }}
          </li>
        </ul>
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
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Avatar Management -->
    <section class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-6">
      <div class="flex justify-between items-center mb-3">
        <h2
          class="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-300"
        >
          <Icon
            icon="mdi:account-circle-outline"
            class="text-xl mr-2 text-gray-600 dark:text-gray-400"
          />
          Avatar
        </h2>
      </div>

      <div class="flex items-start gap-6">
        <div class="flex flex-col items-center gap-2">
          <div
            class="w-28 h-28 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
          >
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
            <Icon v-else icon="mdi:account" class="text-5xl text-gray-400" />
          </div>
          <button
            v-if="avatarUrl && !uploadingAvatar"
            @click="removeAvatar"
            class="text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>

        <div class="flex-1 space-y-3">
          <div>
            <input
              ref="avatarInputRef"
              type="file"
              accept="image/*"
              @change="onAvatarFileChange"
              class="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PNG/JPG/WEBP up to ~2MB recommended.
            </p>
          </div>

          <div v-if="avatarPreview" class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
            >
              <img
                :src="avatarPreview"
                alt="Preview"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex gap-2">
              <button
                @click="uploadAvatar"
                :disabled="uploadingAvatar"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 text-sm inline-flex items-center gap-2"
              >
                <Icon
                  :icon="uploadingAvatar ? 'mdi:loading' : 'mdi:upload'"
                  :class="uploadingAvatar ? 'animate-spin' : ''"
                />
                <span>{{ uploadingAvatar ? "Uploading..." : "Upload" }}</span>
              </button>
              <button
                @click="cancelAvatarSelection"
                :disabled="uploadingAvatar"
                class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Linked Accounts -->
    <section class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-8">
      <h2
        class="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4"
      >
        <Icon
          icon="mdi:link"
          class="text-xl mr-2 text-gray-600 dark:text-gray-400"
        />
        Linked Accounts
      </h2>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon
              icon="mdi:github"
              class="text-2xl text-gray-800 dark:text-gray-200"
            />
            <span class="font-medium text-gray-800 dark:text-gray-200"
              >GitHub</span
            >
          </div>
          <div>
            <button
              v-if="!githubLinked"
              @click="linkGithub"
              class="inline-flex items-center gap-1 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <Icon icon="mdi:link" class="text-lg" />
              <span>Link</span>
            </button>
            <button
              v-else
              @click="unlinkGithub"
              class="inline-flex items-center gap-1 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <Icon icon="tabler:unlink" class="text-lg" />
              <span>Unlink</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { supabase } from "@/services/supabase";
import { useToast } from "vue-toastification";
import { Icon } from "@iconify/vue";
import { useRoute, useRouter } from "vue-router";

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

const githubLinked = computed(() =>
  authUser.value.identities?.some((i) => i.provider === "github")
);

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

  // Preserve original extension for correct content-type handling
  const originalName = avatarFile.value.name || '';
  const ext = originalName.includes('.') ? originalName.split('.').pop().toLowerCase() : 'png';
  const filePath = `${userId}/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("profile-avatar")
      .upload(filePath, avatarFile.value, { upsert: false, contentType: avatarFile.value.type });
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

async function linkGithub() {
  const { data, error } = await supabase.auth.linkIdentity({
    provider: "github",
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

async function unlinkGithub() {
  const { data: identities, error: identitiesError } =
    await supabase.auth.getUserIdentities();

  if (identitiesError) {
    toast.error("Failed to fetch identities");
    return;
  }

  const githubIdentity = identities.identities.find(
    (i) => i.provider === "github"
  );
  if (!githubIdentity) {
    toast.error("No linked GitHub account found");
    return;
  }

  const { error } = await supabase.auth.unlinkIdentity(githubIdentity);
  if (error) {
    toast.error("Failed to unlink GitHub account");
  } else {
    toast.success("GitHub account unlinked successfully");
    loadUser();
  }
}
</script>
