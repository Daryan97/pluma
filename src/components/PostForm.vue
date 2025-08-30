<!-- components/PostForm.vue -->
<template>
  <div
    class="max-w-4xl mx-auto p-6 mt-10 rounded-2xl shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
  >
    <!-- Back -->
    <router-link
      to="/dashboard"
      class="mb-4 inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
    >
      <Icon icon="mdi:arrow-left" class="w-4 h-4" />
      Back to Dashboard
    </router-link>

    <h2 class="text-3xl font-bold mb-6 flex items-center gap-2 justify-center">
      <Icon
        icon="mdi:file-document-edit-outline"
        class="h-8 w-8 text-blue-500"
      />
      {{ mode === "edit" ? "Edit Blog Post" : "New Blog Post" }}
    </h2>

    <!-- FORM -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title -->
      <div>
        <label class="block mb-1 font-semibold" for="title">
          <span class="flex items-center gap-1">
            <Icon
              icon="mdi:format-title"
              class="inline-block mr-2"
              width="24"
            />
            Title
          </span>
        </label>
        <input
          v-model="title"
          id="title"
          type="text"
          placeholder="Enter post title"
          :class="inputClasses"
          required
        />
      </div>

      <!-- Slug -->
      <div>
        <label class="block mb-1 font-semibold" for="slug">
          <span class="flex items-center gap-1">
            <Icon
              icon="mdi:link-variant"
              class="inline-block mr-2"
              width="24"
            />
            Slug
          </span>
        </label>
        <div class="relative">
          <input
            v-model="slug"
            id="slug"
            type="text"
            placeholder="post-slug"
            :class="[
              inputClasses,
              slugError
                ? 'border-red-500 focus:ring-red-500'
                : slugAvailable === true
                ? 'border-green-500 focus:ring-green-500'
                : '',
            ]"
            @input="onSlugInput"
            @blur="debouncedCheckSlug()"
            required
          />
          <span
            v-if="checkingSlug"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 flex items-center gap-1"
          >
            <Icon icon="mdi:loading" class="animate-spin" />
            Checking
          </span>
          <span
            v-else-if="slugAvailable && !slugError"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1"
          >
            <Icon icon="mdi:check-circle" /> Available
          </span>
          <span
            v-else-if="slugError"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
          >
            <Icon icon="mdi:alert-circle" /> {{ slugError }}
          </span>
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Only lowercase letters, numbers, and hyphens. Auto-suggested from
          title.
        </p>
      </div>

      <!-- Category -->
      <div>
        <label class="block mb-1 font-semibold">
          <span class="flex items-center gap-1">
            <Icon
              icon="mdi:format-list-bulleted"
              class="inline-block mr-2"
              width="24"
            />
            Category
          </span>
        </label>
        <Listbox v-model="category">
          <div class="relative">
            <ListboxButton :class="listboxButtonClasses">
              <span class="block truncate">{{
                selectedCategoryName || "Select a category"
              }}</span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <Icon icon="mdi:chevron-down" class="w-5 h-5" />
              </span>
            </ListboxButton>
            <TransitionRoot
              enter="transition ease-out duration-100"
              enter-from="transform opacity-0 scale-95"
              enter-to="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leave-from="transform opacity-100 scale-100"
              leave-to="transform opacity-0 scale-95"
            >
              <ListboxOptions :class="listboxOptionsClasses">
                <ListboxOption
                  v-for="cat in categories"
                  :key="cat.id"
                  :value="cat.id"
                  class="cursor-pointer select-none relative py-2 pl-5 pr-4"
                  v-slot="{ active, selected }"
                >
                  <span
                    :class="[
                      'flex items-center justify-between truncate capitalize',
                      selected
                        ? 'font-semibold text-blue-600 dark:text-blue-400'
                        : 'font-normal',
                      active ? 'text-blue-600 dark:text-blue-400' : '',
                    ]"
                  >
                    <span>
                      <Icon
                        :icon="cat.icon || 'mdi:category'"
                        class="inline-block mr-2"
                      />
                      {{ cat.name }}
                    </span>
                    <Icon
                      icon="mdi:check"
                      width="24"
                      v-if="selected"
                      :class="[active ? 'text-blue-400' : 'text-blue-600']"
                    />
                  </span>
                </ListboxOption>
              </ListboxOptions>
            </TransitionRoot>
          </div>
        </Listbox>
      </div>

      <!-- Tags -->
      <div>
        <label class="block mb-1 font-semibold">
          <span class="flex items-center gap-1">
            <Icon icon="mdi:tag" class="inline-block mr-2" width="24" />
            Tags
          </span>
        </label>
        <TagsInputRoot
          v-model="tagItems"
          :class="[
            inputClasses,
            'flex gap-2 items-center flex-wrap !px-2 !py-2',
          ]"
        >
          <TagsInputItem
            v-for="item in tagItems"
            :key="item"
            :value="item"
            class="text-white flex shadow-md items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 aria-[current=true]:bg-blue-700 rounded px-1 py-0.5"
          >
            <TagsInputItemText class="text-sm pl-1" />
            <TagsInputItemDelete
              class="p-0.5 rounded bg-transparent hover:bg-black/10 dark:hover:bg-white/10"
            >
              <Icon icon="lucide:x" class="w-4 h-4" />
            </TagsInputItemDelete>
          </TagsInputItem>
          <TagsInputInput
            placeholder="Add tag..."
            class="text-sm focus:outline-none flex-1 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 px-1"
          />
        </TagsInputRoot>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Press Enter or comma to add a tag.
        </p>
      </div>

      <!-- Content -->
      <div>
        <label class="block mb-1 font-semibold">
          <span class="flex items-center gap-1">
            <Icon icon="mdi:format-text" class="inline-block mr-2" width="24" />
            Content
          </span>
        </label>
        <MdEditor
          v-model="content"
          height="300px"
          :preview="false"
          :theme="isDarkTheme ? 'dark' : 'light'"
          :toolbars-exclude="exclude"
          class="rounded-md border border-gray-300 dark:border-gray-600"
          :language="'en'"
        />
      </div>

      <!-- Status -->
      <div>
        <label class="block mb-1 font-semibold">
          <span class="flex items-center gap-1">
            <Icon
              icon="mdi:check-circle"
              class="inline-block mr-2"
              width="24"
            />
            Status
          </span>
        </label>
        <Listbox v-model="status">
          <div class="relative">
            <ListboxButton :class="listboxButtonClasses">
              <span class="block truncate capitalize">{{ status }}</span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <Icon icon="mdi:chevron-down" class="w-5 h-5" />
              </span>
            </ListboxButton>
            <TransitionRoot
              enter="transition ease-out duration-100"
              enter-from="transform opacity-0 scale-95"
              enter-to="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leave-from="transform opacity-100 scale-100"
              leave-to="transform opacity-0 scale-95"
            >
              <ListboxOptions :class="listboxOptionsClasses">
                <ListboxOption
                  v-for="option in displayedStatusOptions"
                  :key="option"
                  :value="option"
                  class="cursor-pointer select-none relative py-2 pl-5 pr-4"
                  v-slot="{ active, selected }"
                >
                  <span
                    :class="[
                      'block truncate capitalize',
                      selected ? 'font-semibold' : 'font-normal',
                      active ? 'text-blue-600 dark:text-blue-400' : '',
                    ]"
                  >
                    <Icon
                      :icon="statusIcon[option]"
                      class="inline-block mr-2"
                    />
                    {{ option }}
                  </span>
                </ListboxOption>
              </ListboxOptions>
            </TransitionRoot>
          </div>
        </Listbox>
      </div>

      <!-- Thumbnail Mode -->
      <div>
        <label class="block mb-1 font-semibold">
          <span class="flex items-center gap-1">
            <Icon icon="mdi:image" class="inline-block mr-2" width="24" />
            Thumbnail Image
          </span>
        </label>
        <RadioGroup v-model="thumbnailMode" class="mb-4">
          <div class="space-y-2 max-w">
            <RadioGroupOption
              v-for="option in thumbnailOptions"
              :key="option.value"
              :value="option.value"
              v-slot="{ active, checked }"
              as="template"
            >
              <div
                :class="[
                  active ? 'ring-2 ring-offset-sky-300' : '',
                  checked
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700',
                  'relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md',
                ]"
              >
                <div class="flex justify-between w-full">
                  <span
                    class="flex items-center text-sm font-medium"
                    :class="
                      checked
                        ? 'text-white'
                        : 'text-gray-900 dark:text-gray-100'
                    "
                  >
                    <Icon :icon="option.icon" class="mr-2" />{{ option.label }}
                  </span>
                  <div
                    v-show="checked"
                    class="flex items-center shrink-0 text-white"
                  >
                    <Icon icon="mdi:check" class="w-6 h-6" />
                  </div>
                </div>
              </div>
            </RadioGroupOption>
          </div>
        </RadioGroup>

        <div v-if="thumbnailMode === 'upload'">
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*"
            ref="fileInputRef"
            :class="fileInputClass"
          />
        </div>

        <div v-if="thumbnailMode === 'url'">
          <input
            type="url"
            v-model="thumbnailUrl"
            placeholder="Enter image URL"
            :class="inputClasses"
          />
        </div>

        <!-- Thumbnail Preview with fallback -->
        <div v-if="previewUrl" class="mt-4">
          <p
            class="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300 flex items-center gap-1"
          >
            <Icon icon="mdi:image-outline" class="w-4 h-4" /> Preview
          </p>
          <div class="relative inline-block group">
            <div
              class="max-h-48 rounded-md border border-gray-300 dark:border-gray-600 object-cover shadow overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800"
              style="min-width: 12rem; min-height: 6rem"
            >
              <img
                v-if="!previewImageError"
                :src="previewUrl"
                :alt="title || 'Thumbnail preview'"
                class="object-cover w-full h-full"
                @error="previewImageError = true"
              />
              <NoImage v-else />
            </div>
            <button
              type="button"
              @click="clearThumbnail"
              class="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
              title="Remove thumbnail"
            >
              <Icon icon="mdi:close" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Enable/Disable Comments -->
      <div class="mt-6">
        <label class="flex items-center gap-3 cursor-pointer">
          <input
        type="checkbox"
        v-model="commentsDisabled"
        class="h-5 w-5 accent-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span class="select-none font-semibold">Disable Comments</span>
        </label>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          When enabled, comments will be disabled for this post.
        </p>
      </div>

      <!-- Submit Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          class="flex items-center justify-center w-full rounded-md px-6 py-3 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Icon icon="mdi:content-save" class="inline-block mr-2" />
          {{ mode === "edit" ? "Update Post" : "Create Post" }}
        </button>
        <button
          v-if="mode === 'create'"
          type="button"
          @click="handleSaveDraft"
          class="flex items-center justify-center w-full rounded-md px-6 py-3 font-semibold bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
        >
          <Icon icon="mdi:content-save-outline" class="inline-block mr-2" />
          Save as Draft
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from "radix-vue";
import { supabase } from "@/services/supabase";
import { useToast } from "vue-toastification";
import { MdEditor } from "md-editor-v3";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  RadioGroup,
  RadioGroupOption,
  TransitionRoot,
} from "@headlessui/vue";
import { Icon } from "@iconify/vue";
import "md-editor-v3/lib/style.css";
import NoImage from "./NoImage.vue";

const props = defineProps({
  mode: { type: String, required: true },
  postId: String,
});

const router = useRouter();
const toast = useToast();

const isDarkTheme = ref(document.body.dataset.theme === "dark");
const observer = new MutationObserver(() => {
  isDarkTheme.value = document.body.dataset.theme === "dark";
});

onMounted(() => {
  fetchCategories();
  if (props.mode === "edit") loadPost();
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
});
onBeforeUnmount(() => observer.disconnect());

const title = ref("");
const slug = ref("");
const content = ref("");
const tagItems = ref([]);
const status = ref("published");
const category = ref(null);
const thumbnailFile = ref(null);
const fileInputRef = ref(null);
const thumbnailUrl = ref("");
const thumbnailMode = ref("upload");
const previewUrl = ref("");
const previewImageError = ref(false);
let objectUrlRef = null;
const commentsDisabled = ref(false);

const user = ref(null);

const categories = ref([]);
const statusOptions = ["published", "draft", "archived"];
const displayedStatusOptions = computed(() =>
  props.mode === "edit"
    ? statusOptions
    : statusOptions.filter((s) => s !== "draft")
);
const statusIcon = {
  published: "mdi:check-circle",
  draft: "mdi:file-document-outline",
  archived: "mdi:archive",
};
const thumbnailOptions = [
  { value: "upload", label: "Upload Image", icon: "mdi:upload" },
  { value: "url", label: "Image URL", icon: "mdi:image" },
];

const inputClasses = computed(
  () =>
    `w-full rounded-md px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`
);
const listboxButtonClasses = `w-full rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`;

const listboxOptionsClasses = `absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 newPostOptions`;

const fileInputClass = `w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600`;

const selectedCategoryName = computed(() => {
  const cat = categories.value.find((c) => c.id === category.value);
  return cat ? cat.name : null;
});

const manuallyEditedSlug = ref(false);
const slugAvailable = ref(null);
const slugError = ref("");
const checkingSlug = ref(false);
let slugCheckTimeout = null;

function slugifyFinal(raw) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function sanitizeSlugInput(raw) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "");
}

async function isSlugTaken(testSlug) {
  if (!testSlug) return false;
  const query = supabase
    .from("posts")
    .select("id", { count: "exact" })
    .eq("slug", testSlug)
    .limit(1);
  if (props.mode === "edit" && props.postId) {
  }
  const { data, error, count } = await query;
  if (error) return false;
  if (count && count > 0) {
    if (props.mode === "edit" && data?.length && data[0].id === props.postId) {
      return false;
    }
    return true;
  }
  return false;
}

async function suggestUniqueSlug(baseTitle) {
  const base = slugifyFinal(baseTitle);
  if (!base) return "";
  let candidate = base;
  let i = 1;
  while (await isSlugTaken(candidate)) {
    candidate = `${base}-${i}`;
    i++;
    if (i > 50) break;
  }
  return candidate;
}

async function autoFillSlug() {
  if (manuallyEditedSlug.value) return;
  if (!title.value) {
    slug.value = "";
    return;
  }
  checkingSlug.value = true;
  const suggestion = await suggestUniqueSlug(title.value);
  slug.value = suggestion;
  checkingSlug.value = false;
  await checkSlug();
}

async function checkSlug() {
  slugError.value = "";
  const current = slug.value;
  if (!current) {
    slugAvailable.value = null;
    return;
  }
  if (!/^[a-z0-9-]+$/.test(current)) {
    slugError.value = "Invalid characters";
    slugAvailable.value = false;
    return;
  }
  checkingSlug.value = true;
  const taken = await isSlugTaken(current);
  slugAvailable.value = !taken;
  if (taken) slugError.value = "Slug already taken";
  checkingSlug.value = false;
}

function debouncedCheckSlug() {
  clearTimeout(slugCheckTimeout);
  slugCheckTimeout = setTimeout(checkSlug, 300);
}

function onSlugInput() {
  const sanitized = sanitizeSlugInput(slug.value);
  if (sanitized !== slug.value) slug.value = sanitized;
  manuallyEditedSlug.value = true;
  debouncedCheckSlug();
}

watch(title, () => {
  autoFillSlug();
});

const exclude = [
  "sub",
  "sup",
  "codeRow",
  "link",
  "image",
  "mermaid",
  "katex",
  "save",
  "=",
  "previewOnly",
  "htmlPreview",
  "catalog",
  "github",
];

const fetchCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) toast.error("Failed to load categories");
  else categories.value = data;
};

async function getUser() {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  if (currentUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, display_name, role")
      .eq("id", currentUser.id)
      .single();

    user.value = profile || {
      id: currentUser.id,
      username: currentUser.email,
      role: "reader",
    };
  }
}

const loadPost = async () => {
  await getUser();

  if (!user.value) {
    toast.error("Failed to fetch user data.");
    return router.push("/dashboard");
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", props.postId)
    .single();

  if (error) {
    toast.error("Post not found");
    return router.push("/dashboard");
  }

  const role = user.value?.role || "reader";
  if (role !== "admin" && user.value?.id !== post.author_id) {
    toast.error("You are not authorized to edit this post.");
    return router.push("/dashboard");
  }

  title.value = post.title;
  content.value = post.content;
  tagItems.value = Array.isArray(post.tags) ? post.tags : [];
  status.value = post.status;
  category.value = post.category_id;
  commentsDisabled.value = post.comments_disabled || false;
  if (post.cover_image_url) {
    thumbnailMode.value = "url";
    thumbnailUrl.value = post.cover_image_url;
  }
  slug.value = post.slug || "";
  manuallyEditedSlug.value = true;
  await checkSlug();
};

const handleFileUpload = (e) => {
  thumbnailFile.value = e.target.files[0];
  updatePreview();
};

const handleSubmit = async () => {
  const { data: userData } = await supabase.auth.getUser();

  if (!title.value || !content.value) return toast.error("Fill all fields");

  let finalThumb = null;
  if (thumbnailMode.value === "upload" && thumbnailFile.value) {
    const orig = thumbnailFile.value.name || "";
    const ext = orig.includes(".")
      ? orig.split(".").pop().toLowerCase()
      : "png";
    const fileName = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("post-thumbnails")
      .upload(fileName, thumbnailFile.value, {
        upsert: false,
        contentType: thumbnailFile.value.type,
      });
    if (error) {
      console.error("Thumbnail upload error:", error);
      return toast.error("Failed to upload thumbnail");
    }
    finalThumb = supabase.storage
      .from("post-thumbnails")
      .getPublicUrl(data.path).data.publicUrl;
  } else if (thumbnailMode.value === "url") {
    finalThumb = thumbnailUrl.value;
  }

  slug.value = slugifyFinal(slug.value);
  const postPayload = {
    title: title.value,
    content: content.value,
    tags: tagItems.value.map((t) => t.trim()).filter((t) => t),
    category_id: category.value,
    status: status.value,
    cover_image_url: finalThumb,
    slug: slug.value,
    comments_disabled: commentsDisabled.value,
  };

  if (!slug.value) return toast.error("Slug required");
  if (slugError.value) return toast.error(slugError.value);
  if (slugAvailable.value === false)
    return toast.error("Choose a different slug");

  if (props.mode === "create") {
    postPayload.author_id = userData.user.id;
    const { error } = await supabase.from("posts").insert([postPayload]);
    if (error) return toast.error(error.message);
    toast.success("Post created!");
  } else {
    const { error } = await supabase
      .from("posts")
      .update(postPayload)
      .eq("id", props.postId);
    if (error) return toast.error(error.message);
    toast.success("Post updated!");
  }

  router.push("/dashboard");
};

const handleSaveDraft = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!title.value) return toast.error("Title required for draft");
  if (!slug.value) {
    slug.value = slugifyFinal(title.value);
  }
  await checkSlug();
  if (slugError.value) return toast.error(slugError.value);
  if (slugAvailable.value === false) return toast.error("Slug taken");

  const draftPayload = {
    title: title.value,
    content: content.value || "",
    tags: tagItems.value.map((t) => t.trim()).filter((t) => t),
    category_id: category.value,
    status: "draft",
    slug: slugifyFinal(slug.value),
  };
  if (thumbnailMode.value === "url" && thumbnailUrl.value) {
    draftPayload.cover_image_url = thumbnailUrl.value;
  }
  if (thumbnailMode.value === "upload" && thumbnailFile.value) {
    const orig = thumbnailFile.value.name || "";
    const fileExt = orig.includes(".")
      ? orig.split(".").pop().toLowerCase()
      : "png";
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("post-thumbnails")
      .upload(fileName, thumbnailFile.value, {
        upsert: false,
        contentType: thumbnailFile.value.type,
      });
    if (!error) {
      draftPayload.cover_image_url = supabase.storage
        .from("post-thumbnails")
        .getPublicUrl(data.path).data.publicUrl;
    }
  }

  draftPayload.author_id = userData.user.id;
  const { error } = await supabase.from("posts").insert([draftPayload]);
  if (error) return toast.error(error.message);
  toast.success("Draft saved");
  router.push("/dashboard");
};

function revokeObjectUrl() {
  if (objectUrlRef) {
    URL.revokeObjectURL(objectUrlRef);
    objectUrlRef = null;
  }
}

function updatePreview() {
  revokeObjectUrl();
  if (thumbnailMode.value === "upload" && thumbnailFile.value) {
    objectUrlRef = URL.createObjectURL(thumbnailFile.value);
    previewUrl.value = objectUrlRef;
  } else if (thumbnailMode.value === "url" && thumbnailUrl.value) {
    previewUrl.value = thumbnailUrl.value.trim();
  } else {
    previewUrl.value = "";
  }
  previewImageError.value = false;
}

function clearThumbnail() {
  if (thumbnailMode.value === "upload") {
    thumbnailFile.value = null;
    if (fileInputRef.value) fileInputRef.value.value = "";
  } else if (thumbnailMode.value === "url") {
    thumbnailUrl.value = "";
  }
  updatePreview();
}

watch([thumbnailMode, thumbnailUrl], () => {
  updatePreview();
});

onBeforeUnmount(() => {
  revokeObjectUrl();
});
</script>
