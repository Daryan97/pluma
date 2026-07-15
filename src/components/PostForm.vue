<template>
  <div class="max-w-7xl mx-auto px-4 py-10 pb-28 lg:pb-10">
    <div class="mb-6 flex items-center gap-3">
      <router-link
        :to="localePath('/dashboard')"
        class="inline-flex items-center gap-2 h-8 px-4 rounded-md text-[13px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <Icon icon="mdi:arrow-left" class="text-sm" />{{ t('common.back') }}</router-link>
      <div
        class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
      >
        <Icon icon="mdi:chevron-right" class="w-4 h-4" />
        <span class="capitalize">{{
          currentMode === "edit" ? t('postForm.editPost') : t('postForm.createPost')
        }}</span>
        <Icon icon="mdi:chevron-right" class="w-4 h-4" />
        <span>{{ t('posts.post') }}</span>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
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
              {{ currentMode === "edit" ? t('postForm.editTitle') : t('postForm.newTitle') }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ t('postForm.subtitle') }}
            </p>
          </div>
          <div v-if="currentMode === 'edit' && currentPostId" class="ml-auto">
            <router-link
              :to="localePath(`/posts/${slug}`)"
              target="_blank"
              class="inline-flex items-center gap-2 h-9 px-3 rounded bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <Icon icon="mdi:open-in-new" class="text-sm" />
              {{ t('postForm.viewPost') }}
            </router-link>
          </div>
        </header>

        <form id="postForm" @submit.prevent="handleSubmit" class="space-y-8">
          <section
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-5"
          >
            <h2
              class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 uppercase"
            >
              {{ t('postForm.basicInfo') }}
            </h2>
            <div class="space-y-2">
              <label
                for="title"
                class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
              >
                <Icon icon="mdi:format-title" class="text-blue-500" />{{ t('postForm.title') }}</label>
              <input
                v-model="title"
                id="title"
                type="text"
                :placeholder="t('postForm.titlePlaceholder')"
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
                  <Icon icon="mdi:link-variant" class="text-blue-500" />{{ t('postForm.slug') }}</label>
                <span class="text-[11px] text-gray-500 dark:text-gray-400"
                  >{{ t('postForm.slugAutoHint') }}</span
                >
              </div>
              <div class="relative">
                <input
                  v-model="slug"
                  id="slug"
                  type="text"
                  :placeholder="t('postForm.slugPlaceholder')"
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
                  <Icon icon="mdi:loading" class="animate-spin" /> {{ t('postForm.checking') }}
                </span>
                <span
                  v-else-if="slugAvailable && !slugError"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-green-600 dark:text-green-400 flex items-center gap-1"
                >
                  <Icon icon="mdi:check-circle" /> {{ t('postForm.ok') }}
                </span>
                <span
                  v-else-if="slugError"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <Icon icon="mdi:alert-circle" /> {{ slugError }}
                </span>
              </div>
              <p class="text-[11px] text-gray-500 dark:text-gray-400">
                {{ t('postForm.slugHint') }}
              </p>
            </div>
          </section>

          <section
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-4"
          >
            <div class="flex items-center justify-between">
              <h2
                class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 uppercase"
              >{{ t('postForm.content') }}</h2>
              <span class="text-[11px] text-gray-500 dark:text-gray-500"
                >{{ t('postForm.markdownSupported') }}</span
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

          <section
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-3 lg:hidden"
          >
            <h2
              class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 uppercase"
            >{{ t('postForm.tags') }}</h2>
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
                :placeholder="t('postForm.addTag')"
                class="text-xs focus:outline-none flex-1 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 px-1"
              />
            </TagsInputRoot>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              {{ t('postForm.tagHint') }}
            </p>
          </section>

          <div class="lg:hidden"></div>
        </form>
      </div>

      <aside class="w-full lg:w-80 space-y-6 lg:sticky lg:top-6 self-start">
        <section
          class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-5"
        >
          <h2
            class="text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300 uppercase"
          >{{ t('postForm.publishing') }}</h2>
          <div class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:account" class="text-blue-500" />{{ t('postForm.author') }}</label>
            <div v-if="canChangeAuthor" class="relative">
              <SelectRoot
                v-model="authorId"
                :disabled="fieldsLocked"
                @update:modelValue="onAuthorSelect"
              >
                <SelectTrigger
                  class="w-full h-10 inline-flex items-center gap-3 justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  :aria-label="t('postForm.selectAuthor')"
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
                      loading="lazy"
                    />
                    <span v-else>{{
                      (authorDisplay || "?").charAt(0).toUpperCase()
                    }}</span>
                  </span>
                  <span class="flex-1 text-left truncate">
                    <SelectValue :placeholder="t('postForm.selectAuthor')" />
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
                              loading="lazy"
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
                  loading="lazy"
                />
                <span v-else>{{
                  (authorDisplay || "?").charAt(0).toUpperCase()
                }}</span>
              </span>
              <span class="truncate">{{ authorDisplay || "—" }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:check-circle" class="text-blue-500" />{{ t('postForm.status') }}</label>
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
                        <SelectItemText>{{
                          t(`posts.status.${option}`)
                        }}</SelectItemText>
                      </SelectItem>
                    </SelectGroup>
                  </SelectViewport>
                </SelectContent>
              </SelectPortal>
            </SelectRoot>
          </div>

          <div class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:translate" class="text-blue-500" />
              {{ t("postForm.languages") }}
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="loc in contentLocales"
                :key="loc.code"
                type="button"
                :disabled="fieldsLocked || removingTranslation"
                class="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium border transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                :class="
                  postLocales.includes(loc.code)
                    ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                "
                @click="togglePostLocale(loc.code)"
              >
                <span class="uppercase tracking-wide opacity-70">{{ loc.code }}</span>
                {{ loc.name }}
                <Icon
                  v-if="postLocales.includes(loc.code)"
                  icon="mdi:check"
                  class="text-sm"
                />
              </button>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              {{
                currentMode === "create"
                  ? t("postForm.languagesHintCreate")
                  : t("postForm.languagesHintEdit")
              }}
            </p>

            <div
              v-if="currentMode === 'edit' && translationSiblings.length"
              class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-3 space-y-2"
            >
              <div class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                {{ t("postForm.translations") }}
              </div>
              <p class="text-[11px] text-gray-500 dark:text-gray-400">
                {{ t("postForm.translationsHint") }}
              </p>
              <ul class="space-y-1.5">
                <li
                  v-for="sib in translationSiblings"
                  :key="sib.id"
                  class="flex items-center gap-2 text-sm"
                >
                  <span
                    class="inline-flex items-center justify-center h-6 min-w-[1.75rem] px-1.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase"
                  >
                    {{ sib.locale }}
                  </span>
                  <span class="truncate flex-1 text-gray-800 dark:text-gray-100">
                    {{ sib.title || t("postForm.untitled") }}
                  </span>
                  <span
                    v-if="sib.id === currentPostId"
                    class="text-[10px] text-gray-500 dark:text-gray-400"
                  >
                    {{ t("postForm.currentTranslation") }}
                  </span>
                  <template v-else>
                    <button
                      type="button"
                      class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      @click="openTranslation(sib.id)"
                    >
                      {{ t("common.edit") }}
                    </button>
                    <button
                      type="button"
                      class="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                      :disabled="fieldsLocked || removingTranslation"
                      @click="removeTranslation(sib)"
                    >
                      {{ t("common.remove") }}
                    </button>
                  </template>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="status === 'draft' || scheduledAtLocal" class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:clock-outline" class="text-blue-500" />
              {{ t('postForm.schedulePublish') }}
            </label>
            <input
              v-model="scheduledAtLocal"
              type="datetime-local"
              :disabled="fieldsLocked"
              class="w-full h-10 rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            />
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              Saves as draft until this time, then publishes automatically.
            </p>
          </div>

          <div class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:format-list-bulleted" class="text-blue-500" />{{ t('postForm.category') }}</label>
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
                  <SelectValue :placeholder="t('postForm.selectCategory')" />
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
                  <div
                    class="border-t border-gray-200 dark:border-gray-700 p-2 space-y-2"
                    @pointerdown.stop
                  >
                    <p class="text-[10px] uppercase tracking-wide text-gray-400 px-1">
                      {{ t('postForm.newCategory') }}
                    </p>
                    <div class="flex gap-2">
                      <input
                        v-model.trim="newCategoryName"
                        type="text"
                        :placeholder="t('postForm.namePlaceholder')"
                        :disabled="fieldsLocked || creatingCategory"
                        class="flex-1 h-8 rounded-md px-2 text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @keydown.enter.prevent="createCategoryInline"
                      />
                      <button
                        type="button"
                        :disabled="fieldsLocked || creatingCategory || !newCategoryName"
                        class="inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 disabled:opacity-50"
                        @click="createCategoryInline"
                      >
                        <Icon
                          :icon="creatingCategory ? 'mdi:loading' : 'mdi:plus'"
                          :class="creatingCategory ? 'animate-spin' : ''"
                          class="text-sm"
                        />
                        {{ t('postForm.add') }}
                      </button>
                    </div>
                  </div>
                </SelectContent>
              </SelectPortal>
            </SelectRoot>
          </div>

          <div class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:bookshelf" class="text-indigo-500" />{{ t('postForm.series') }}</label>
            <SelectRoot v-model="seriesId" :disabled="fieldsLocked">
              <SelectTrigger
                class="w-full h-10 inline-flex items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                aria-label="Select series"
              >
                <SelectValue :placeholder="t('postForm.none')" />
                <Icon icon="radix-icons:chevron-down" class="w-4 h-4 opacity-70" />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent
                  class="z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  :side-offset="4"
                >
                  <SelectViewport class="p-1">
                    <SelectGroup>
                      <SelectItem
                        value="none"
                        class="relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                      >
                        <SelectItemIndicator class="absolute left-0 w-8 inline-flex items-center justify-center">
                          <Icon icon="radix-icons:check" class="w-4 h-4" />
                        </SelectItemIndicator>
                        <SelectItemText>{{ t('postForm.none') }}</SelectItemText>
                      </SelectItem>
                      <SelectItem
                        v-for="s in seriesList"
                        :key="s.id"
                        :value="s.id"
                        class="relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                      >
                        <SelectItemIndicator class="absolute left-0 w-8 inline-flex items-center justify-center">
                          <Icon icon="radix-icons:check" class="w-4 h-4" />
                        </SelectItemIndicator>
                        <SelectItemText class="truncate">{{ s.name }}</SelectItemText>
                      </SelectItem>
                    </SelectGroup>
                  </SelectViewport>
                </SelectContent>
              </SelectPortal>
            </SelectRoot>
            <input
              v-if="seriesId && seriesId !== 'none'"
              v-model.number="seriesOrder"
              type="number"
              min="1"
              :placeholder="t('postForm.order')"
              :disabled="fieldsLocked"
              class="w-full h-9 rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="hidden lg:block space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:tag" class="text-blue-500" />{{ t('postForm.tags') }}</label>
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
                :placeholder="t('postForm.addTag')"
                class="text-xs focus:outline-none flex-1 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 px-1"
              />
            </TagsInputRoot>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              {{ t('postForm.tagHint') }}
            </p>
          </div>
        </section>

        <section
          class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-5"
        >
          <h2
            class="text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300 uppercase"
          >{{ t('postForm.thumbnail') }}</h2>
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
                  :alt="title || t('postForm.thumbnail')"
                  class="max-h-40 object-contain rounded"
                  @error="previewImageError = true"
                  loading="lazy"
                />
                <button
                  type="button"
                  @click.stop="clearThumbnail"
                  class="text-[11px] text-red-600 dark:text-red-400 hover:underline"
                  data-thumb-remove
                >
                  {{ t('postForm.removeImage') }}
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
                    {{ t('postForm.clearImage') }}
                  </button>
                </div>
              </template>
              <template v-else>
                <Icon icon="mdi:image-outline" class="text-4xl" />
                <p class="text-xs">{{ t('postForm.dropHint') }}</p>
              </template>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-500">
              {{ t('postForm.thumbnailFormats') }}
            </p>
          </div>
          <div v-else-if="thumbnailMode === 'url'" class="space-y-3">
            <input
              type="url"
              v-model="thumbnailUrl"
              :placeholder="t('postForm.enterImageUrl')"
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
                  :alt="title || t('postForm.thumbnail')"
                  class="object-cover w-full h-full"
                  @error="previewImageError = true"
                  loading="lazy"
                />
                <NoImage v-else />
              </div>
              <button
                type="button"
                @click.stop="clearThumbnail"
                class="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
                :title="t('postForm.removeImage')"
              >
                <Icon icon="mdi:close" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-5"
        >
          <h2
            class="text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300 uppercase"
          >{{ t('postForm.options') }}</h2>
          <div class="space-y-3">
            <button
              type="button"
              :disabled="fieldsLocked"
              :aria-pressed="commentsDisabled"
              class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[12px] font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              :class="
                commentsDisabled
                  ? 'border-blue-300 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300'
              "
              @click="commentsDisabled = !commentsDisabled"
            >
              <Icon
                :icon="
                  commentsDisabled ? 'mdi:comment-off' : 'mdi:comment-outline'
                "
                class="w-4 h-4"
              />
              <span>{{
                commentsDisabled
                  ? t("postForm.commentsDisabled")
                  : t("postForm.disableComments")
              }}</span>
            </button>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 -mt-1">
              {{ t("postForm.commentsHelper") }}
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
                (currentMode === 'create' || (currentMode === 'edit' && status === 'draft'))
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
                (currentMode === 'create' || (currentMode === 'edit' && status === 'draft'))
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
              {{ savingDraft ? t('postForm.savingDraft') : t('postForm.saveDraft') }}
            </button>
            <button
              v-if="currentMode === 'edit' && currentPostId && slug"
              type="button"
              @click="openPreview"
              class="w-full inline-flex items-center gap-2 h-10 justify-center rounded-md text-sm font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60"
            >
              <Icon icon="mdi:eye-outline" class="text-base" />{{ t('postForm.preview') }}</button>
            <button
              v-if="currentMode === 'edit' && currentPostId"
              type="button"
              @click="copyPreviewLink"
              :disabled="copyingPreview"
              class="w-full inline-flex items-center gap-2 h-10 justify-center rounded-md text-sm font-medium bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/60 disabled:opacity-50"
            >
              <Icon
                :icon="copyingPreview ? 'mdi:loading' : 'mdi:link-variant'"
                :class="['text-base', copyingPreview ? 'animate-spin' : '']"
              />
              {{ t('postForm.copyPreviewLink') }}
            </button>
          </div>
        </section>
      </aside>
    </div>
  </div>
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
            (currentMode === 'create' || (currentMode === 'edit' && status === 'draft'))
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
          {{ savingDraft ? t('postForm.savingDraft') : t('postForm.draft') }}
        </button>
      </div>
    </div>
  </div>
  <ConfirmDialog
    v-if="showRemoveTranslationConfirm"
    :open="showRemoveTranslationConfirm"
    :title="t('common.confirmAction')"
    :description="removeTranslationMessage"
    :body="t('common.areYouSure')"
    :confirm-label="t('common.remove')"
    @confirm="confirmRemoveTranslation"
    @cancel="cancelRemoveTranslation"
  />
</template>

<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

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
import { supabase } from "@/services/supabase";import { useBranding } from "@/stores/brandingStore";
import { MdEditor } from "md-editor-v3";
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";
import { Icon } from "@iconify/vue";
import "md-editor-v3/lib/style.css";
import NoImage from "./NoImage.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

const props = defineProps({
  mode: { type: String, required: true },
  postId: String,
});

const currentMode = ref(props.mode);
const currentPostId = ref(props.postId || null);

const router = useRouter();
const toast = useToast();

const isDarkTheme = ref(document.body.dataset.theme === "dark");
const observer = new MutationObserver(() => {
  isDarkTheme.value = document.body.dataset.theme === "dark";
});

onMounted(() => {
  fetchCategories();
  fetchSeries();
  if (currentMode.value === "edit" && currentPostId.value) {
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
const newCategoryName = ref("");
const creatingCategory = ref(false);
const seriesList = ref([]);
const seriesId = ref("none");
const seriesOrder = ref(null);
const scheduledAtLocal = ref("");
const previewToken = ref(null);
const copyingPreview = ref(false);
const { contentLocale, locales: contentLocales } = useContentLocale();
const { primaryLocale, brandingLoaded } = useBranding();
const postLocales = ref([primaryLocale.value || contentLocale.value || "en"]);
const postLocale = computed({
  get: () => postLocales.value[0] || "en",
  set: (code) => {
    if (!code) return;
    if (!postLocales.value.includes(code)) {
      postLocales.value = [code, ...postLocales.value];
    } else {
      postLocales.value = [code, ...postLocales.value.filter((c) => c !== code)];
    }
  },
});
const translationGroupId = ref(null);
const translationSiblings = ref([]);
const addingTranslation = ref(false);
const removingTranslation = ref(false);

watch(
  () => [brandingLoaded.value, primaryLocale.value],
  () => {
    if (currentMode.value !== "create" || !brandingLoaded.value) return;
    if (primaryLocale.value) postLocales.value = [primaryLocale.value];
  }
);

function togglePostLocale(code) {
  if (!code || fieldsLocked.value) return;
  const selected = postLocales.value.includes(code);

  if (currentMode.value === "edit") {
    if (selected) {
      if (code === postLocale.value) {
        toast.warning(t("postForm.cannotDisableCurrentLocale"));
        return;
      }
      const sibling = translationSiblings.value.find((s) => s.locale === code);
      if (sibling) {
        removeTranslation(sibling);
        return;
      }
      postLocales.value = postLocales.value.filter((c) => c !== code);
      return;
    }
    addTranslation(code);
    return;
  }

  if (selected) {
    if (postLocales.value.length <= 1) {
      toast.warning(t("postForm.needOneLanguage"));
      return;
    }
    postLocales.value = postLocales.value.filter((c) => c !== code);
  } else {
    postLocales.value = [...postLocales.value, code];
  }
}

async function loadTranslationSiblings(groupId, fallbackLocale, fallbackId) {
  const current = fallbackLocale || "en";
  if (!groupId) {
    translationSiblings.value = [
      {
        id: fallbackId,
        locale: current,
        title: title.value,
      },
    ];
    postLocales.value = [current];
    return;
  }
  const { data, error } = await supabase
    .from("posts")
    .select("id, locale, title")
    .eq("translation_group_id", groupId)
    .order("locale");
  if (error || !data?.length) {
    translationSiblings.value = [
      {
        id: fallbackId,
        locale: current,
        title: title.value,
      },
    ];
    postLocales.value = [current];
    return;
  }
  translationSiblings.value = data;
  const others = data.map((d) => d.locale).filter((l) => l !== current);
  postLocales.value = [current, ...others];
}

function openTranslation(id) {
  if (!id || id === currentPostId.value) return;
  router.push(localePath(`/dashboard/edit/${id}`));
}

const showRemoveTranslationConfirm = ref(false);
const removeTranslationMessage = ref("");
const pendingRemoveSibling = ref(null);

function removeTranslation(sibling) {
  if (!sibling?.id || removingTranslation.value || fieldsLocked.value) return;
  if (sibling.id === currentPostId.value) {
    toast.warning(t("postForm.cannotDisableCurrentLocale"));
    return;
  }
  if (translationSiblings.value.length <= 1) {
    toast.warning(t("postForm.needOneLanguage"));
    return;
  }
  const label = sibling.locale?.toUpperCase?.() || sibling.locale;
  pendingRemoveSibling.value = sibling;
  removeTranslationMessage.value = t("postForm.removeTranslationConfirm", {
    locale: label,
  });
  showRemoveTranslationConfirm.value = true;
}

function cancelRemoveTranslation() {
  showRemoveTranslationConfirm.value = false;
  pendingRemoveSibling.value = null;
  removeTranslationMessage.value = "";
}

async function confirmRemoveTranslation() {
  const sibling = pendingRemoveSibling.value;
  showRemoveTranslationConfirm.value = false;
  pendingRemoveSibling.value = null;
  removeTranslationMessage.value = "";
  if (!sibling?.id || removingTranslation.value) return;
  removingTranslation.value = true;
  try {
    const { error } = await supabase.from("posts").delete().eq("id", sibling.id);
    if (error) throw new Error(error.message);
    translationSiblings.value = translationSiblings.value.filter(
      (s) => s.id !== sibling.id
    );
    postLocales.value = postLocales.value.filter((c) => c !== sibling.locale);
    toast.success(t("postForm.translationRemoved"));
  } catch (e) {
    toast.error(e?.message || t("postForm.genericFailed"));
  } finally {
    removingTranslation.value = false;
  }
}

async function resolveCategoryForLocale(locale, sourceCategoryId) {
  if (!sourceCategoryId) return null;
  const { data: src } = await supabase
    .from("categories")
    .select("id, locale, translation_group_id")
    .eq("id", sourceCategoryId)
    .maybeSingle();
  if (!src) return null;
  if (src.locale === locale) return src.id;
  if (!src.translation_group_id) return null;
  const { data: match } = await supabase
    .from("categories")
    .select("id")
    .eq("translation_group_id", src.translation_group_id)
    .eq("locale", locale)
    .maybeSingle();
  return match?.id || null;
}

async function resolveSeriesForLocale(locale, sourceSeriesId) {
  if (!sourceSeriesId || sourceSeriesId === "none") return null;
  const { data: src } = await supabase
    .from("series")
    .select("id, locale, translation_group_id")
    .eq("id", sourceSeriesId)
    .maybeSingle();
  if (!src) return null;
  if (src.locale === locale) return src.id;
  if (!src.translation_group_id) return null;
  const { data: match } = await supabase
    .from("series")
    .select("id")
    .eq("translation_group_id", src.translation_group_id)
    .eq("locale", locale)
    .maybeSingle();
  return match?.id || null;
}

async function addTranslation(localeCode) {
  if (!localeCode || addingTranslation.value || fieldsLocked.value) return;
  if (!currentPostId.value) {
    toast.warning(t("postForm.saveBeforeTranslate"));
    return;
  }
  addingTranslation.value = true;
  try {
    let groupId = translationGroupId.value;
    if (!groupId) {
      groupId = crypto.randomUUID();
      const { error: groupErr } = await supabase
        .from("posts")
        .update({ translation_group_id: groupId })
        .eq("id", currentPostId.value);
      if (groupErr) throw new Error(groupErr.message);
      translationGroupId.value = groupId;
    }
    if (await isSlugTaken(slug.value, localeCode)) {
      throw new Error(t("postForm.slugTakenInLocale", { locale: localeCode }));
    }
    const catId = await resolveCategoryForLocale(localeCode, category.value);
    const serId = await resolveSeriesForLocale(
      localeCode,
      seriesId.value === "none" ? null : seriesId.value
    );
    const payload = {
      title: title.value,
      content: content.value || "",
      tags: tagItems.value.map((x) => x.trim()).filter(Boolean),
      category_id: catId,
      status: "draft",
      cover_image_url: thumbnailUrl.value || null,
      slug: slug.value,
      locale: localeCode,
      translation_group_id: groupId,
      comments_disabled: commentsDisabled.value,
      author_id: authorId.value,
      series_id: serId,
      series_order: serId ? seriesOrder.value : null,
    };
    const { data: inserted, error } = await supabase
      .from("posts")
      .insert([payload])
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    toast.success(t("postForm.translationCreated"));
    router.push(localePath(`/dashboard/edit/${inserted.id}`));
  } catch (e) {
    toast.error(e?.message || t("postForm.genericFailed"));
  } finally {
    addingTranslation.value = false;
  }
}

watch(
  postLocale,
  () => {
    fetchCategories();
    fetchSeries();
    checkSlug();
  }
);
const statusOptions = ["published", "draft", "archived"];
const displayedStatusOptions = computed(() =>
  currentMode.value === "edit"
    ? statusOptions
    : statusOptions.filter((s) => s !== "draft")
);
const statusIcon = {
  published: "mdi:check-circle",
  draft: "mdi:file-document-outline",
  archived: "mdi:archive",
};
const thumbnailOptions = computed(() => [
  { value: "upload", label: t('postForm.uploadImage'), icon: "mdi:upload" },
  { value: "url", label: t('postForm.imageUrl'), icon: "mdi:image" },
]);

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
    if (status.value === "draft") return t('postForm.publishingBtn');
    return status.value === "archived"
      ? t('postForm.updatingBtn')
      : props.mode === "create"
      ? t('postForm.creatingBtn')
      : t('postForm.updatingBtn');
  }
  if (status.value === "draft") return t('postForm.publishPost');
  if (status.value === "archived")
    return originalStatus.value === "archived"
      ? t('postForm.archivedLabel')
      : t('postForm.archivePost');
  return props.mode === "create" ? t('postForm.publishPost') : t('postForm.updatePost');
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

async function isSlugTaken(testSlug, localeCode = null) {
  if (!testSlug) return false;
  const loc = localeCode || postLocale.value || "en";
  const query = supabase
    .from("posts")
    .select("id", { count: "exact" })
    .eq("slug", testSlug)
    .eq("locale", loc)
    .limit(1);
  if (currentMode.value === "edit" && currentPostId.value) {
    query.neq("id", currentPostId.value);
  }
  const { data, error, count } = await query;
  if (error) return false;
  if (count && count > 0) {
    if (currentMode.value === "edit" && data?.length && data[0].id === currentPostId.value) {
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
    slugError.value = t('postForm.slugInvalid');
    slugAvailable.value = false;
    return;
  }
  checkingSlug.value = true;
  const taken = await isSlugTaken(current);
  slugAvailable.value = !taken;
  if (taken) slugError.value = t('postForm.slugTaken');
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
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("locale", postLocale.value || "en");
  if (error) toast.error(t('postForm.categoriesLoadFailed'));
  else categories.value = data;
};

const fetchSeries = async () => {
  const { data, error } = await supabase
    .from("series")
    .select("id, name, slug, locale")
    .eq("locale", postLocale.value || "en")
    .order("name");
  if (!error && data) seriesList.value = data;
};

function toLocalDatetimeInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function scheduledAtIso() {
  if (!scheduledAtLocal.value) return null;
  const d = new Date(scheduledAtLocal.value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function seriesFields() {
  const sid = seriesId.value && seriesId.value !== "none" ? seriesId.value : null;
  return {
    series_id: sid,
    series_order:
      sid && seriesOrder.value != null && seriesOrder.value !== ""
        ? Number(seriesOrder.value)
        : null,
  };
}

function openPreview() {
  if (!slug.value) {
    toast.error(t('postForm.saveSlugFirst'));
    return;
  }
  const path = localePath(`/posts/${slug.value}`);
  window.open(`${window.location.origin}${path}`, "_blank", "noopener");
}

async function copyPreviewLink() {
  if (!currentPostId.value) return;
  copyingPreview.value = true;
  try {
    let token = previewToken.value;
    if (!token) {
      token = crypto.randomUUID();
      const { error } = await supabase
        .from("posts")
        .update({ preview_token: token })
        .eq("id", currentPostId.value);
      if (error) throw error;
      previewToken.value = token;
    }
    const path = localePath(`/posts/${slug.value || "preview"}`);
    const url = `${window.location.origin}${path}?preview=${token}`;
    await navigator.clipboard.writeText(url);
    toast.success(t('postForm.previewLinkCopied'));
  } catch (e) {
    toast.error(e?.message || t('postForm.previewLinkFailed'));
  } finally {
    copyingPreview.value = false;
  }
}

function slugifyCategory(raw) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function createCategoryInline() {
  const name = newCategoryName.value.trim();
  if (!name || creatingCategory.value || fieldsLocked.value) return;
  if (name.toLowerCase() === "uncategorized") {
    toast.error(t('categories.reserved'));
    return;
  }
  if (categories.value.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    toast.error(t('categories.exists'));
    return;
  }
  creatingCategory.value = true;
  try {
    let baseSlug = slugifyCategory(name) || Date.now().toString();
    let uniqueSlug = baseSlug;
    let i = 1;
    while (categories.value.some((c) => c.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${i++}`;
      if (i > 100) break;
    }
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug: uniqueSlug,
        locale: postLocale.value || "en",
        translation_group_id: crypto.randomUUID?.() || undefined,
      })
      .select("*")
      .single();
    if (error) throw error;
    categories.value = [...categories.value, data].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    category.value = data.id;
    newCategoryName.value = "";
    toast.success(t('postForm.categoryCreated'));
  } catch (e) {
    console.error(e);
    toast.error(e.message || t('postForm.categoryCreateFailed'));
  } finally {
    creatingCategory.value = false;
  }
}

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
    toast.error(t('postForm.fetchUserFailed'));
    return router.push(localePath('/dashboard'));
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", currentPostId.value)
    .single();

  if (error) {
    toast.error(t('postForm.postNotFound'));
    return router.push(localePath('/dashboard'));
  }

  const role = user.value?.role || "reader";
  if (role !== "admin" && user.value?.id !== post.author_id) {
    toast.error(t('postForm.notAuthorized'));
    return router.push(localePath('/dashboard'));
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
  scheduledAtLocal.value = toLocalDatetimeInput(post.scheduled_at);
  seriesId.value = post.series_id || "none";
  postLocales.value = [post.locale || contentLocale.value || "en"];
  translationGroupId.value = post.translation_group_id || null;
  seriesOrder.value = post.series_order ?? null;
  previewToken.value = post.preview_token || null;
  await loadTranslationSiblings(
    translationGroupId.value,
    post.locale,
    post.id
  );
  await fetchCategories();
  await fetchSeries();
  await checkSlug();
};

function validateThumb(file) {
  if (!file) return false;
  const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    toast.error(t('postForm.unsupportedFileType'));
    return false;
  }
  if (file.size > 2 * 1024 * 1024) {
    toast.error(t('postForm.fileTooLarge'));
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
    if (!title.value || !content.value) throw new Error(t('postForm.fillAllFields'));
    if (!slug.value) slug.value = slugifyFinal(title.value);
    slug.value = slugifyFinal(slug.value);
    await checkSlug();
    if (!slug.value) throw new Error(t('postForm.slugRequired'));
    if (slugError.value) throw new Error(slugError.value);
    if (slugAvailable.value === false)
      throw new Error(t('postForm.chooseDifferentSlug'));

    let effectiveStatus = status.value;
    const publishingFromDraft =
      currentMode.value === "edit" && status.value === "draft" && !scheduledAtLocal.value;
    if (publishingFromDraft) effectiveStatus = "published";
    const archivingFromActive =
      currentMode.value === "edit" &&
      status.value === "archived" &&
      originalStatus.value !== "archived";

    const scheduleIso = scheduledAtIso();
    if (scheduleIso && effectiveStatus === "published") {
      effectiveStatus = "draft";
    }

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
      if (error) throw new Error(t('postForm.uploadThumbnailFailed'));
      finalThumb = supabase.storage
        .from("post-thumbnails")
        .getPublicUrl(data.path).data.publicUrl;
    } else if (thumbnailMode.value === "url") {
      finalThumb = thumbnailUrl.value;
    }

    const localesToSave = [...new Set(postLocales.value.filter(Boolean))];
    if (!localesToSave.length) throw new Error(t("postForm.needOneLanguage"));

    const primaryLoc = localesToSave[0];
    const groupId =
      currentMode.value === "create" && localesToSave.length > 1
        ? crypto.randomUUID()
        : translationGroupId.value ||
          (localesToSave.length > 1 ? crypto.randomUUID() : null);

    const postPayload = {
      title: title.value,
      content: content.value,
      tags: tagItems.value.map((x) => x.trim()).filter((x) => x),
      category_id: category.value,
      status: effectiveStatus,
      cover_image_url: finalThumb,
      slug: slug.value,
      locale: primaryLoc,
      comments_disabled: commentsDisabled.value,
      scheduled_at: effectiveStatus === "published" ? null : scheduleIso,
      ...seriesFields(),
    };
    if (groupId) postPayload.translation_group_id = groupId;

    if (currentMode.value === "create") {
      postPayload.author_id = authorId.value || userData.user.id;
      const rows = [];
      for (const loc of localesToSave) {
        if (await isSlugTaken(slug.value, loc)) {
          throw new Error(t("postForm.slugTakenInLocale", { locale: loc }));
        }
        const catId = await resolveCategoryForLocale(loc, category.value);
        const serId = await resolveSeriesForLocale(
          loc,
          seriesId.value === "none" ? null : seriesId.value
        );
        rows.push({
          ...postPayload,
          locale: loc,
          category_id: catId,
          series_id: serId,
          series_order: serId ? seriesOrder.value : null,
          translation_group_id: groupId || undefined,
        });
      }
      const { data: inserted, error } = await supabase
        .from("posts")
        .insert(rows)
        .select("id, status, slug, locale, translation_group_id");
      if (error) throw new Error(error.message);
      const primary =
        inserted?.find((r) => r.locale === primaryLoc) || inserted?.[0];
      if (!primary) throw new Error(t("postForm.genericFailed"));
      toast.success(
        localesToSave.length > 1
          ? t("postForm.createdMulti", { count: localesToSave.length })
          : t("postForm.created")
      );
      currentMode.value = "edit";
      currentPostId.value = primary.id;
      translationGroupId.value = primary.translation_group_id || groupId;
      originalStatus.value = primary.status || effectiveStatus;
      status.value = primary.status || effectiveStatus;
      postLocales.value = [primary.locale, ...localesToSave.filter((l) => l !== primary.locale)];
      router.replace({ name: "EditPost", params: { id: primary.id } });
    } else {
      if (canChangeAuthor.value && authorId.value) {
        postPayload.author_id = authorId.value;
      }
      // Keep this row's locale stable while editing
      postPayload.locale = postLocale.value || primaryLoc;
      const { error } = await supabase
        .from("posts")
        .update(postPayload)
        .eq("id", currentPostId.value);
      if (error) throw new Error(error.message);
      if (archivingFromActive) {
        toast.success(t("postForm.archived"));
        originalStatus.value = "archived";
        status.value = "archived";
      } else if (publishingFromDraft) {
        toast.success(t("postForm.published"));
        originalStatus.value = "published";
        status.value = "published";
        scheduledAtLocal.value = "";
      } else if (scheduleIso && effectiveStatus === "draft") {
        toast.success(t("postForm.scheduled"));
        originalStatus.value = "draft";
        status.value = "draft";
      } else {
        toast.success(t("postForm.updated"));
        originalStatus.value = effectiveStatus;
        status.value = effectiveStatus;
      }
    }
  } catch (e) {
    if (e && e.message) toast.error(e.message);
    else toast.error(t('postForm.genericFailed'));
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
    if (!title.value) throw new Error(t('postForm.titleRequiredDraft'));
    if (!slug.value) slug.value = slugifyFinal(title.value);
    slug.value = slugifyFinal(slug.value);
    await checkSlug();
    if (slugError.value) throw new Error(slugError.value);
    if (slugAvailable.value === false) throw new Error(t('postForm.slugTaken'));
    const localesToSave = [...new Set(postLocales.value.filter(Boolean))];
    if (!localesToSave.length) throw new Error(t("postForm.needOneLanguage"));
    const primaryLoc = localesToSave[0];
    const groupId =
      currentMode.value === "create" && localesToSave.length > 1
        ? crypto.randomUUID()
        : translationGroupId.value || null;

    const draftPayload = {
      title: title.value,
      content: content.value || "",
      tags: tagItems.value.map((x) => x.trim()).filter((x) => x),
      category_id: category.value,
      status: "draft",
      slug: slugifyFinal(slug.value),
      locale: primaryLoc,
      comments_disabled: commentsDisabled.value,
      cover_image_url: null,
      scheduled_at: scheduledAtIso(),
      ...seriesFields(),
    };
    if (groupId) draftPayload.translation_group_id = groupId;
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
    if (currentMode.value === "create") {
      draftPayload.author_id = authorId.value || userData.user.id;
      const rows = [];
      for (const loc of localesToSave) {
        if (await isSlugTaken(slug.value, loc)) {
          throw new Error(t("postForm.slugTakenInLocale", { locale: loc }));
        }
        const catId = await resolveCategoryForLocale(loc, category.value);
        const serId = await resolveSeriesForLocale(
          loc,
          seriesId.value === "none" ? null : seriesId.value
        );
        rows.push({
          ...draftPayload,
          locale: loc,
          category_id: catId,
          series_id: serId,
          series_order: serId ? seriesOrder.value : null,
          translation_group_id: groupId || undefined,
        });
      }
      const { data: inserted, error } = await supabase
        .from("posts")
        .insert(rows)
        .select("id, status, slug, locale, translation_group_id");
      if (error) throw new Error(error.message);
      const primary =
        inserted?.find((r) => r.locale === primaryLoc) || inserted?.[0];
      if (!primary) throw new Error(t("postForm.genericFailed"));
      toast.success(t("postForm.draftSaved"));
      currentMode.value = "edit";
      currentPostId.value = primary.id;
      translationGroupId.value = primary.translation_group_id || groupId;
      originalStatus.value = primary.status || "draft";
      status.value = primary.status || "draft";
      postLocales.value = [
        primary.locale,
        ...localesToSave.filter((l) => l !== primary.locale),
      ];
      router.replace({ name: "EditPost", params: { id: primary.id } });
    } else {
      if (canChangeAuthor.value && authorId.value) {
        draftPayload.author_id = authorId.value;
      }
      draftPayload.locale = postLocale.value || primaryLoc;
      const { error } = await supabase
        .from("posts")
        .update(draftPayload)
        .eq("id", currentPostId.value);
      if (error) throw new Error(error.message);
      toast.success(t("postForm.draftUpdated"));
    }
  } catch (e) {
    if (e && e.message) toast.error(e.message);
    else toast.error(t('postForm.genericFailed'));
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
