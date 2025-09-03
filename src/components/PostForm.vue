<!-- components/PostForm.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-10 pb-28 lg:pb-10">
    <div class="mb-6 flex items-center gap-3">
      <router-link
        to="/dashboard"
        class="inline-flex items-center gap-2 h-8 px-4 rounded-md text-[13px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <Icon icon="mdi:arrow-left" class="text-sm" />
        Back
      </router-link>
      <div
        class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
      >
        <Icon icon="mdi:chevron-right" class="w-4 h-4" />
        <span class="capitalize">{{
          mode === "edit" ? "Edit" : "Create"
        }}</span>
        <Icon icon="mdi:chevron-right" class="w-4 h-4" />
        <span>Post</span>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Main Column -->
      <div class="flex-1 space-y-6">
        <header class="flex items-center gap-3 flex-wrap">
          <div
            class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
          >
            <Icon icon="mdi:file-document-edit-outline" class="w-7 h-7" />
          </div>
          <div>
            <h1
              class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
            >
              {{ mode === "edit" ? "Edit Blog Post" : "New Blog Post" }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Craft engaging content with markdown, tags and a thumbnail.
            </p>
          </div>
          <div v-if="mode === 'edit' && postId" class="ml-auto">
            <router-link
              :to="`/posts/${slug}`"
              target="_blank"
              class="inline-flex items-center gap-2 h-9 px-3 rounded bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <Icon icon="mdi:open-in-new" class="text-sm" />
              View Post
            </router-link>
          </div>
        </header>

        <form id="postForm" @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Title & Slug Card -->
          <section
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-5"
          >
            <h2
              class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 uppercase"
            >
              Basic Info
            </h2>
            <div class="space-y-2">
              <label
                for="title"
                class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
              >
                <Icon icon="mdi:format-title" class="text-blue-500" /> Title
              </label>
              <input
                v-model="title"
                id="title"
                type="text"
                placeholder="Enter post title"
                :disabled="fieldsLocked"
                :class="[
                  inputClasses,
                  'h-11',
                  fieldsLocked ? 'opacity-60 cursor-not-allowed' : '',
                ]"
                required
              />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label
                  for="slug"
                  class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
                >
                  <Icon icon="mdi:link-variant" class="text-blue-500" /> Slug
                </label>
                <span class="text-[11px] text-gray-500 dark:text-gray-400"
                  >Auto from title • editable</span
                >
              </div>
              <div class="relative">
                <input
                  v-model="slug"
                  id="slug"
                  type="text"
                  placeholder="post-slug"
                  :disabled="fieldsLocked"
                  :class="[
                    inputClasses,
                    'pr-28',
                    slugError
                      ? 'border-red-500 focus:ring-red-500'
                      : slugAvailable === true
                      ? 'border-green-500 focus:ring-green-500'
                      : '',
                    fieldsLocked ? 'opacity-60 cursor-not-allowed' : '',
                  ]"
                  @input="onSlugInput"
                  @blur="debouncedCheckSlug()"
                  required
                />
                <span
                  v-if="checkingSlug"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 flex items-center gap-1"
                >
                  <Icon icon="mdi:loading" class="animate-spin" /> Checking
                </span>
                <span
                  v-else-if="slugAvailable && !slugError"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-green-600 dark:text-green-400 flex items-center gap-1"
                >
                  <Icon icon="mdi:check-circle" /> OK
                </span>
                <span
                  v-else-if="slugError"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <Icon icon="mdi:alert-circle" /> {{ slugError }}
                </span>
              </div>
              <p class="text-[11px] text-gray-500 dark:text-gray-400">
                Lowercase letters, numbers & hyphens only.
              </p>
            </div>
          </section>

          <!-- Content Card -->
          <section
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-4"
          >
            <div class="flex items-center justify-between">
              <h2
                class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 uppercase"
              >
                Content
              </h2>
              <span class="text-[11px] text-gray-500 dark:text-gray-500"
                >Markdown supported</span
              >
            </div>
            <div :class="fieldsLocked ? 'pointer-events-none opacity-60' : ''">
              <MdEditor
                v-model="content"
                height="400px"
                :preview="false"
                :theme="isDarkTheme ? 'dark' : 'light'"
                :toolbars-exclude="exclude"
                class="rounded-md border border-gray-300 dark:border-gray-600"
                :language="'en'"
                noUploadImg
              />
            </div>
          </section>

          <!-- Tags Card (mobile/stacked visible) -->
          <section
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-3 lg:hidden"
          >
            <h2
              class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 uppercase"
            >
              Tags
            </h2>
            <TagsInputRoot
              v-model="tagItems"
              :disabled="fieldsLocked"
              :class="[
                inputClasses,
                'flex gap-2 items-center flex-wrap !px-2 !py-2 bg-white dark:bg-gray-800',
                fieldsLocked ? 'opacity-60 cursor-not-allowed' : '',
              ]"
            >
              <TagsInputItem
                v-for="item in tagItems"
                :key="item"
                :value="item"
                class="flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium border border-blue-200 dark:border-blue-800 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-400 dark:aria-[current=true]:ring-blue-600"
              >
                <TagsInputItemText class="text-xs pl-1" />
                <TagsInputItemDelete
                  class="p-0.5 rounded hover:bg-blue-200/60 dark:hover:bg-blue-800/50 transition-colors"
                >
                  <Icon icon="lucide:x" class="w-3.5 h-3.5" />
                </TagsInputItemDelete>
              </TagsInputItem>
              <TagsInputInput
                placeholder="Add tag..."
                class="text-xs focus:outline-none flex-1 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 px-1"
              />
            </TagsInputRoot>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              Press Enter or comma.
            </p>
          </section>

          <!-- Mobile spacer (actions moved to fixed bar) -->
          <div class="lg:hidden"></div>
        </form>
      </div>

      <!-- Sidebar -->
      <aside class="w-full lg:w-80 space-y-6 lg:sticky lg:top-6 self-start">
        <!-- Status / Category Card -->
        <section
          class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-5"
        >
          <h2
            class="text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300 uppercase"
          >
            Publishing
          </h2>
          <!-- Author (editable for admins) -->
          <div class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:account" class="text-blue-500" /> Author
            </label>
            <div v-if="canChangeAuthor" class="relative">
              <SelectRoot
                v-model="authorId"
                :disabled="fieldsLocked"
                @update:modelValue="onAuthorSelect"
              >
                <SelectTrigger
                  class="w-full h-10 inline-flex items-center gap-3 justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Select author"
                >
                  <span
                    :class="
                      'w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 ' +
                      roleAvatarBg(selectedAuthor?.role)
                    "
                  >
                    <img
                      v-if="authorAvatar"
                      :src="authorAvatar"
                      :alt="authorDisplay || 'Avatar'"
                      class="w-full h-full object-cover"
                      @error="authorAvatar = null"
                    />
                    <span v-else>{{
                      (authorDisplay || "?").charAt(0).toUpperCase()
                    }}</span>
                  </span>
                  <span class="flex-1 text-left truncate">
                    <SelectValue :placeholder="'Select author'" />
                  </span>
                  <Icon
                    icon="radix-icons:chevron-down"
                    class="w-4 h-4 opacity-70"
                  />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent
                    class="z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    :side-offset="4"
                  >
                    <SelectScrollUpButton
                      class="flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500"
                    >
                      <Icon icon="radix-icons:chevron-up" />
                    </SelectScrollUpButton>
                    <SelectViewport class="p-1">
                      <SelectGroup>
                        <SelectItem
                          v-for="a in authors"
                          :key="a.id"
                          :value="a.id"
                          class="relative flex items-center gap-3 h-10 pl-10 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                        >
                          <SelectItemIndicator
                            class="absolute left-0 w-10 inline-flex items-center justify-center"
                          >
                            <Icon icon="radix-icons:check" class="w-4 h-4" />
                          </SelectItemIndicator>
                          <span
                            :class="
                              'w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 ' +
                              roleAvatarBg(a.role)
                            "
                          >
                            <img
                              v-if="a.avatar_url"
                              :src="a.avatar_url"
                              :alt="a.display_name || a.username || 'Avatar'"
                              class="w-full h-full object-cover"
                              @error="a.avatar_url = null"
                            />
                            <span v-else>{{
                              (a.display_name || a.username || "?")
                                .charAt(0)
                                .toUpperCase()
                            }}</span>
                          </span>
                          <SelectItemText>
                            <span
                              class="truncate capitalize flex items-center gap-1"
                            >
                              <span>{{ a.display_name || a.username }}</span>
                              <span
                                v-if="a.role && a.role !== 'reader'"
                                :class="[
                                  'ml-1 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded capitalize border border-transparent',
                                  a.role === 'admin'
                                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                                    : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
                                ]"
                                >{{ a.role }}</span
                              >
                            </span>
                          </SelectItemText>
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
            <div
              v-else
              class="h-10 flex items-center gap-3 rounded-md px-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300"
            >
              <span
                :class="
                  'w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 ' +
                  roleAvatarBg(selectedAuthor?.role || user?.role)
                "
              >
                <img
                  v-if="authorAvatar"
                  :src="authorAvatar"
                  :alt="authorDisplay || 'Avatar'"
                  class="w-full h-full object-cover"
                  @error="authorAvatar = null"
                />
                <span v-else>{{
                  (authorDisplay || "?").charAt(0).toUpperCase()
                }}</span>
              </span>
              <span class="truncate">{{ authorDisplay || "—" }}</span>
            </div>
          </div>
          <!-- Status -->
          <div class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:check-circle" class="text-blue-500" /> Status
            </label>
            <SelectRoot v-model="status">
              <SelectTrigger
                class="w-full h-10 inline-flex items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select status"
              >
                <span class="flex items-center gap-2 truncate capitalize">
                  <Icon :icon="statusIcon[status]" class="w-4 h-4" />
                  <SelectValue />
                </span>
                <Icon
                  icon="radix-icons:chevron-down"
                  class="w-4 h-4 opacity-70"
                />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent
                  class="z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  :side-offset="4"
                >
                  <SelectViewport class="p-1">
                    <SelectGroup>
                      <SelectItem
                        v-for="option in displayedStatusOptions"
                        :key="option"
                        :value="option"
                        class="relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                      >
                        <SelectItemIndicator
                          class="absolute left-0 w-8 inline-flex items-center justify-center"
                        >
                          <Icon icon="radix-icons:check" class="w-4 h-4" />
                        </SelectItemIndicator>
                        <Icon :icon="statusIcon[option]" class="w-4 h-4" />
                        <SelectItemText class="capitalize">{{
                          option
                        }}</SelectItemText>
                      </SelectItem>
                    </SelectGroup>
                  </SelectViewport>
                </SelectContent>
              </SelectPortal>
            </SelectRoot>
          </div>

          <!-- Category -->
          <div class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:format-list-bulleted" class="text-blue-500" />
              Category
            </label>
            <SelectRoot v-model="category" :disabled="fieldsLocked">
              <SelectTrigger
                class="w-full h-10 inline-flex items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Select category"
              >
                <span class="flex items-center gap-2 truncate">
                  <Icon
                    v-if="selectedCategoryName"
                    :icon="
                      (categories.find((c) => c.id === category) || {}).icon ||
                      'mdi:category'
                    "
                    class="w-4 h-4"
                  />
                  <SelectValue placeholder="Select a category" />
                </span>
                <Icon
                  icon="radix-icons:chevron-down"
                  class="w-4 h-4 opacity-70"
                />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent
                  class="z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  :side-offset="4"
                >
                  <SelectViewport class="p-1">
                    <SelectGroup>
                      <SelectItem
                        v-for="cat in categories"
                        :key="cat.id"
                        :value="cat.id"
                        class="relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                      >
                        <SelectItemIndicator
                          class="absolute left-0 w-8 inline-flex items-center justify-center"
                        >
                          <Icon icon="radix-icons:check" class="w-4 h-4" />
                        </SelectItemIndicator>
                        <Icon
                          :icon="cat.icon || 'mdi:category'"
                          class="w-4 h-4"
                        />
                        <SelectItemText class="truncate">{{
                          cat.name
                        }}</SelectItemText>
                      </SelectItem>
                    </SelectGroup>
                  </SelectViewport>
                </SelectContent>
              </SelectPortal>
            </SelectRoot>
          </div>

          <!-- Tags (desktop) -->
          <div class="hidden lg:block space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:tag" class="text-blue-500" /> Tags
            </label>
            <TagsInputRoot
              v-model="tagItems"
              :disabled="fieldsLocked"
              :class="[
                inputClasses,
                'flex gap-2 items-center flex-wrap !px-2 !py-2 bg-white dark:bg-gray-800',
                fieldsLocked ? 'opacity-60 cursor-not-allowed' : '',
              ]"
            >
              <TagsInputItem
                v-for="item in tagItems"
                :key="item"
                :value="item"
                class="flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium border border-blue-200 dark:border-blue-800 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-400 dark:aria-[current=true]:ring-blue-600"
              >
                <TagsInputItemText class="text-xs pl-1" />
                <TagsInputItemDelete
                  class="p-0.5 rounded hover:bg-blue-200/60 dark:hover:bg-blue-800/50 transition-colors"
                >
                  <Icon icon="lucide:x" class="w-3.5 h-3.5" />
                </TagsInputItemDelete>
              </TagsInputItem>
              <TagsInputInput
                placeholder="Add tag..."
                class="text-xs focus:outline-none flex-1 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 px-1"
              />
            </TagsInputRoot>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              Press Enter or comma.
            </p>
          </div>
        </section>

        <!-- Thumbnail Card -->
        <section
          class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-5"
        >
          <h2
            class="text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300 uppercase"
          >
            Thumbnail
          </h2>
          <RadioGroup
            v-model="thumbnailMode"
            class="mb-2"
            :disabled="fieldsLocked"
          >
            <div class="space-y-2">
              <RadioGroupOption
                v-for="option in thumbnailOptions"
                :key="option.value"
                :value="option.value"
                v-slot="{ active, checked }"
                as="template"
              >
                <div
                  :class="[
                    checked
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100',
                    'relative flex cursor-pointer rounded-md px-3 py-2 border text-sm items-center justify-between transition-colors',
                  ]"
                >
                  <span
                    :class="[
                      'flex items-center',
                      checked
                        ? 'text-blue-700 dark:text-blue-300 font-medium'
                        : '',
                    ]"
                  >
                    <Icon :icon="option.icon" class="mr-2" /> {{ option.label }}
                  </span>
                  <Icon
                    v-show="checked"
                    icon="mdi:check"
                    class="w-5 h-5 text-blue-600 dark:text-blue-400"
                  />
                </div>
              </RadioGroupOption>
            </div>
          </RadioGroup>
          <div v-if="thumbnailMode === 'upload'" class="space-y-2">
            <div
              class="relative flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed rounded-md text-gray-500 dark:text-gray-400 hover:border-blue-400 cursor-pointer transition"
              :class="[
                { 'border-blue-500': dragThumb },
                fieldsLocked ? 'opacity-60 pointer-events-none' : '',
              ]"
              @dragover.prevent="dragThumb = true"
              @dragleave.prevent="dragThumb = false"
              @drop.prevent="onThumbDrop"
              @click="onThumbZoneClick"
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                class="hidden"
                ref="fileInputRef"
                @change="onThumbFileChange"
              />
              <template v-if="previewUrl && !previewImageError">
                <img
                  :src="previewUrl"
                  :alt="title || 'Thumbnail preview'"
                  class="max-h-40 object-contain rounded"
                  @error="previewImageError = true"
                />
                <button
                  type="button"
                  @click.stop="clearThumbnail"
                  class="text-[11px] text-red-600 dark:text-red-400 hover:underline"
                  data-thumb-remove
                >
                  Remove
                </button>
              </template>
              <template v-else-if="previewUrl && previewImageError">
                <div class="flex flex-col items-center gap-2 py-6">
                  <NoImage />
                  <button
                    type="button"
                    @click.stop="clearThumbnail"
                    class="text-[11px] text-red-600 dark:text-red-400 hover:underline"
                    data-thumb-remove
                  >
                    Clear
                  </button>
                </div>
              </template>
              <template v-else>
                <Icon icon="mdi:image-outline" class="text-4xl" />
                <p class="text-xs">Click or drop thumbnail</p>
              </template>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-500">
              PNG / JPG / WEBP / GIF. Max ~2MB.
            </p>
          </div>
          <div v-else-if="thumbnailMode === 'url'" class="space-y-3">
            <input
              type="url"
              v-model="thumbnailUrl"
              placeholder="Enter image URL"
              :disabled="fieldsLocked"
              :class="[
                inputClasses,
                fieldsLocked ? 'opacity-60 cursor-not-allowed' : '',
              ]"
            />
            <div v-if="previewUrl" class="relative inline-block group">
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
                @click.stop="clearThumbnail"
                class="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
                title="Remove thumbnail"
              >
                <Icon icon="mdi:close" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <!-- Options & Actions -->
        <section
          class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-5"
        >
          <h2
            class="text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300 uppercase"
          >
            Options
          </h2>
          <div class="space-y-3">
            <label
              class="flex items-center gap-3 cursor-pointer select-none"
              :class="fieldsLocked ? 'opacity-60 cursor-not-allowed' : ''"
            >
              <input
                type="checkbox"
                v-model="commentsDisabled"
                class="sr-only peer"
                aria-label="Disable comments"
                :disabled="fieldsLocked"
              />
              <span
                class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[12px] font-medium border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 peer-checked:border-blue-300 peer-checked:bg-blue-100 dark:peer-checked:bg-blue-900/40 peer-checked:text-blue-700 dark:peer-checked:text-blue-300 transition-colors"
              >
                <Icon
                  :icon="
                    commentsDisabled ? 'mdi:comment-off' : 'mdi:comment-outline'
                  "
                  class="w-4 h-4"
                />
                <span>{{
                  commentsDisabled ? "Comments Disabled" : "Disable Comments"
                }}</span>
              </span>
            </label>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 -mt-1">
              Prevents users from adding comments to this post.
            </p>
          </div>
          <div class="pt-2 space-y-3 hidden lg:block">
            <button
              type="submit"
              form="postForm"
              :disabled="submitting || savingDraft || fieldsLocked"
              class="w-full inline-flex items-center gap-2 h-11 justify-center rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon
                :icon="
                  submitting && !savingDraft
                    ? 'mdi:loading'
                    : 'mdi:content-save'
                "
                :class="[
                  'text-base',
                  submitting && !savingDraft ? 'animate-spin' : '',
                ]"
              />
              {{ publishButtonLabel }}
            </button>
            <span
              v-if="
                !fieldsLocked &&
                (mode === 'create' || (mode === 'edit' && status === 'draft'))
              "
              class="block text-center text-xs text-gray-500 dark:text-gray-400"
            >
              OR
            </span>
            <span
              v-else-if="fieldsLocked"
              class="block text-center text-xs text-gray-500 dark:text-gray-400"
            >
              You cannot save drafts when the post is archived.
            </span>
            <button
              v-if="
                !fieldsLocked &&
                (mode === 'create' || (mode === 'edit' && status === 'draft'))
              "
              type="button"
              @click="handleSaveDraft"
              :disabled="submitting || savingDraft"
              class="w-full inline-flex items-center gap-2 h-11 justify-center rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon
                :icon="savingDraft ? 'mdi:loading' : 'mdi:content-save-outline'"
                :class="['text-base', savingDraft ? 'animate-spin' : '']"
              />
              {{ savingDraft ? "Saving Draft..." : "Save Draft" }}
            </button>
          </div>
        </section>
      </aside>
    </div>
  </div>
  <!-- Fixed Mobile Action Bar -->
  <div class="fixed inset-x-0 bottom-0 z-40 lg:hidden">
    <div
      class="mx-auto max-w-7xl px-4 pt-3 pb-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <div class="flex gap-3">
        <button
          form="postForm"
          type="submit"
          :disabled="submitting || savingDraft || fieldsLocked"
          class="flex-1 inline-flex items-center gap-2 h-11 justify-center rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon
            :icon="
              submitting && !savingDraft ? 'mdi:loading' : 'mdi:content-save'
            "
            :class="[
              'text-base',
              submitting && !savingDraft ? 'animate-spin' : '',
            ]"
          />
          {{ publishButtonLabel }}
        </button>
        <button
          v-if="
            !fieldsLocked &&
            (mode === 'create' || (mode === 'edit' && status === 'draft'))
          "
          type="button"
          @click="handleSaveDraft"
          :disabled="submitting || savingDraft"
          class="flex-1 inline-flex items-center gap-2 h-11 justify-center rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon
            :icon="savingDraft ? 'mdi:loading' : 'mdi:content-save-outline'"
            :class="['text-base', savingDraft ? 'animate-spin' : '']"
          />
          {{ savingDraft ? "Saving..." : "Draft" }}
        </button>
      </div>
    </div>
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
import { supabase } from "@/services/supabase";
import { useToast } from "vue-toastification";
import { MdEditor } from "md-editor-v3";
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";
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
  if (props.mode === "edit") {
    loadPost();
  } else {
    getUser().then(() => {
      if (user.value) {
        authorId.value = user.value.id;
        authorDisplay.value =
          user.value.display_name || user.value.username || "Unknown";
      }
    });
  }
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
const originalStatus = ref(null);
const category = ref(null);
const thumbnailFile = ref(null);
const fileInputRef = ref(null);
const thumbnailUrl = ref("");
const thumbnailMode = ref("upload");
const previewUrl = ref("");
const previewImageError = ref(false);
let objectUrlRef = null;
const commentsDisabled = ref(false);
const dragThumb = ref(false);

const user = ref(null);
const authorId = ref(null);
const authorDisplay = ref("");
const authorAvatar = ref(null);
const authors = ref([]);
const canChangeAuthor = computed(() => {
  const u = user.value;
  return !!(u && u.role === "admin" && !fieldsLocked.value);
});
const selectedAuthor = computed(() => {
  if (!authorId.value) return null;
  const list = authors.value || [];
  return (
    list.find((a) => a.id === authorId.value) ||
    (user.value && user.value.id === authorId.value ? user.value : null)
  );
});
function roleAvatarBg(role) {
  if (role === "admin") return "bg-red-100 dark:bg-red-900/40";
  if (role === "author") return "bg-blue-100 dark:bg-blue-900/40";
  return "bg-gray-200 dark:bg-gray-600";
}

function onAuthorSelect(val) {
  if (!val) return;
  if (authors.value.length === 0 && user.value?.role === "admin") {
    fetchAuthors();
  }
  const found =
    authors.value.find((a) => a.id === val) ||
    (user.value && user.value.id === val ? user.value : null);
  if (found) {
    authorDisplay.value = found.display_name || found.username || "Unknown";
    authorAvatar.value = found.avatar_url || null;
  }
}

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

const selectedCategoryName = computed(() => {
  const cat = categories.value.find((c) => c.id === category.value);
  return cat ? cat.name : null;
});

const manuallyEditedSlug = ref(false);
const fieldsLocked = computed(
  () => status.value === "archived" && originalStatus.value === "archived"
);
const publishButtonLabel = computed(() => {
  if (submitting.value && !savingDraft.value) {
    if (status.value === "draft") return "Publishing...";
    return status.value === "archived"
      ? "Updating..."
      : props.mode === "create"
      ? "Creating..."
      : "Updating...";
  }
  if (status.value === "draft") return "Publish Post";
  if (status.value === "archived")
    return originalStatus.value === "archived" ? "Archived" : "Archive Post";
  return props.mode === "create" ? "Publish Post" : "Update Post";
});
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
      .select("id, username, display_name, role, avatar_url")
      .eq("id", currentUser.id)
      .single();
    user.value = profile || {
      id: currentUser.id,
      username: currentUser.email,
      role: "reader",
      display_name: currentUser.email?.split("@")[0],
    };
    if (user.value.role === "admin") {
      fetchAuthors();
    }
  }
}

async function fetchAuthors() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, role")
    .in("role", ["admin", "author"]);
  if (!error && data) {
    authors.value = data.sort((a, b) =>
      (a.display_name || a.username || "").localeCompare(
        b.display_name || b.username || ""
      )
    );
    if (authorId.value && !authors.value.find((a) => a.id === authorId.value)) {
      const currentAuthor = data.find((a) => a.id === authorId.value);
      if (currentAuthor) authors.value.push(currentAuthor);
    }
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
  originalStatus.value = post.status;
  category.value = post.category_id;
  commentsDisabled.value = post.comments_disabled || false;
  authorId.value = post.author_id;
  if (user.value && user.value.id === post.author_id) {
    authorDisplay.value =
      user.value.display_name || user.value.username || "Unknown";
    authorAvatar.value = user.value.avatar_url || null;
  } else if (post.author_id) {
    const { data: aProf } = await supabase
      .from("profiles")
      .select("display_name, username, avatar_url, role")
      .eq("id", post.author_id)
      .single();
    authorDisplay.value = aProf?.display_name || aProf?.username || "Unknown";
    authorAvatar.value = aProf?.avatar_url || null;
    if (
      user.value &&
      user.value.role === "admin" &&
      aProf &&
      !authors.value.find((a) => a.id === post.author_id)
    ) {
      authors.value.push({ id: post.author_id, ...aProf });
    }
  }
  if (post.cover_image_url) {
    thumbnailMode.value = "url";
    thumbnailUrl.value = post.cover_image_url;
  }
  slug.value = post.slug || "";
  manuallyEditedSlug.value = true;
  await checkSlug();
};

function validateThumb(file) {
  if (!file) return false;
  const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    toast.error("Unsupported file type");
    return false;
  }
  if (file.size > 2 * 1024 * 1024) {
    toast.error("File too large (>2MB)");
    return false;
  }
  return true;
}

function onThumbFileChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!validateThumb(file)) {
    if (fileInputRef.value) fileInputRef.value.value = "";
    return;
  }
  thumbnailFile.value = file;
  thumbnailUrl.value = "";
  updatePreview();
}

function onThumbDrop(e) {
  dragThumb.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  if (!validateThumb(file)) return;
  thumbnailFile.value = file;
  thumbnailUrl.value = "";
  if (fileInputRef.value) fileInputRef.value.value = "";
  updatePreview();
}

function onThumbZoneClick(e) {
  if (e.target.closest("[data-thumb-remove]")) return;
  if (fileInputRef.value) fileInputRef.value.click();
}

const submitting = ref(false);
const savingDraft = ref(false);

const handleSubmit = async () => {
  if (submitting.value) return;
  submitting.value = true;
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!title.value || !content.value) throw new Error("Fill all fields");
    if (!slug.value) slug.value = slugifyFinal(title.value);
    slug.value = slugifyFinal(slug.value);
    await checkSlug();
    if (!slug.value) throw new Error("Slug required");
    if (slugError.value) throw new Error(slugError.value);
    if (slugAvailable.value === false)
      throw new Error("Choose a different slug");

    let effectiveStatus = status.value;
    const publishingFromDraft =
      props.mode === "edit" && status.value === "draft";
    if (publishingFromDraft) effectiveStatus = "published";
    const archivingFromActive =
      props.mode === "edit" &&
      status.value === "archived" &&
      originalStatus.value !== "archived";


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
      if (error) throw new Error("Failed to upload thumbnail");
      finalThumb = supabase.storage
        .from("post-thumbnails")
        .getPublicUrl(data.path).data.publicUrl;
    } else if (thumbnailMode.value === "url") {
      finalThumb = thumbnailUrl.value;
    }

    const postPayload = {
      title: title.value,
      content: content.value,
      tags: tagItems.value.map((t) => t.trim()).filter((t) => t),
      category_id: category.value,
      status: effectiveStatus,
      cover_image_url: finalThumb,
      slug: slug.value,
      comments_disabled: commentsDisabled.value,
    };

    if (props.mode === "create") {
      postPayload.author_id = authorId.value || userData.user.id;
      const { error } = await supabase.from("posts").insert([postPayload]);
      if (error) throw new Error(error.message);
      toast.success("Post created!");
    } else {
      if (canChangeAuthor.value && authorId.value) {
        postPayload.author_id = authorId.value;
      }
      const { error } = await supabase
        .from("posts")
        .update(postPayload)
        .eq("id", props.postId);
      if (error) throw new Error(error.message);
      if (archivingFromActive) {
        toast.success("Post archived");
        originalStatus.value = "archived";
      } else if (publishingFromDraft) {
        toast.success("Post published!");
        originalStatus.value = "published";
      } else {
        toast.success("Post updated!");
        originalStatus.value = effectiveStatus;
      }
    }
    await router.push("/dashboard");
  } catch (e) {
    if (e && e.message) toast.error(e.message);
    else toast.error("Failed");
  } finally {
    submitting.value = false;
  }
};

const handleSaveDraft = async () => {
  if (savingDraft.value || submitting.value || status.value === "archived")
    return;
  savingDraft.value = true;
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!title.value) throw new Error("Title required for draft");
    if (!slug.value) slug.value = slugifyFinal(title.value);
    slug.value = slugifyFinal(slug.value);
    await checkSlug();
    if (slugError.value) throw new Error(slugError.value);
    if (slugAvailable.value === false) throw new Error("Slug taken");
    const draftPayload = {
      title: title.value,
      content: content.value || "",
      tags: tagItems.value.map((t) => t.trim()).filter((t) => t),
      category_id: category.value,
      status: "draft",
      slug: slugifyFinal(slug.value),
      comments_disabled: commentsDisabled.value,
      cover_image_url: null,
    };
    if (thumbnailMode.value === "url") {
      draftPayload.cover_image_url = thumbnailUrl.value
        ? thumbnailUrl.value
        : null;
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
    if (props.mode === "create") {
      draftPayload.author_id = authorId.value || userData.user.id;
      const { error } = await supabase.from("posts").insert([draftPayload]);
      if (error) throw new Error(error.message);
      toast.success("Draft saved");
    } else {
      if (canChangeAuthor.value && authorId.value) {
        draftPayload.author_id = authorId.value;
      }
      const { error } = await supabase
        .from("posts")
        .update(draftPayload)
        .eq("id", props.postId);
      if (error) throw new Error(error.message);
      toast.success("Draft updated");
    }
    await router.push("/dashboard");
  } catch (e) {
    if (e && e.message) toast.error(e.message);
    else toast.error("Failed");
  } finally {
    savingDraft.value = false;
  }
};

watch([authorId, authors], () => {
  if (!authorId.value) return;
  const a = authors.value.find((x) => x.id === authorId.value);
  if (a) {
    authorDisplay.value = a.display_name || a.username || "Unknown";
    authorAvatar.value = a.avatar_url || null;
  } else if (user.value && user.value.id === authorId.value) {
    authorDisplay.value =
      user.value.display_name || user.value.username || "Unknown";
    authorAvatar.value = user.value.avatar_url || null;
  }
});

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
