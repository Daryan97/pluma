<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-2">
        <Icon
          icon="mdi:folder-multiple-image"
          class="text-blue-600 dark:text-blue-400 text-2xl"
        />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {{ t('media.title') }}
        </h2>
      </div>
      <div
        class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2"
      >
        <span>{{ t('media.totalBuckets') }}: {{ buckets.length }}</span>
      </div>
    </header>

    <div v-if="!activeBucket" class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="text-sm font-medium text-gray-600 dark:text-gray-300">
          {{ t('media.buckets') }}
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button
            @click="toggleCreate"
            class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <Icon
              :icon="showCreate ? 'mdi:close' : 'mdi:plus'"
              class="text-sm"
            />
            <span>{{ showCreate ? t('common.cancel') : t('media.newBucket') }}</span>
          </button>
          <button
            @click="refreshBuckets"
            :disabled="loadingBuckets"
            class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Icon
              :icon="loadingBuckets ? 'mdi:loading' : 'mdi:refresh'"
              :class="loadingBuckets ? 'animate-spin' : 'text-sm'"
            />
            {{ t('common.refresh') }}
          </button>
        </div>
      </div>

      <div
        v-if="showCreate"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm space-y-6"
      >
        <div class="flex items-center gap-3">
          <div
            class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
          >
            <Icon icon="mdi:bucket" class="w-6 h-6" />
          </div>
          <div>
            <h3
              class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"
            >
              {{ t('media.createBucket') }}
            </h3>
            <p class="text-[12px] text-gray-500 dark:text-gray-400">
              {{ t('media.createBucketHint') }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:label-outline" class="text-blue-500" /> {{ t('media.name') }}
            </label>
            <div class="relative">
              <input
                v-model.trim="newBucketName"
                :placeholder="t('media.namePlaceholder')"
                :class="[
                  'w-full h-11 rounded-md px-3 bg-white dark:bg-gray-800 border text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                  bucketNameError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600',
                ]"
              />
              <span
                v-if="newBucketName && !bucketNameError"
                class="absolute end-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 text-xs inline-flex items-center gap-1"
              >
                <Icon icon="mdi:check-circle" /> {{ t('media.ok') }}
              </span>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              {{ t('media.nameHint') }}
            </p>
            <p
              v-if="bucketNameError"
              class="text-[11px] text-red-600 dark:text-red-400"
            >
              {{ bucketNameError }}
            </p>
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:earth" class="text-blue-500" /> {{ t('media.visibility') }}
            </label>
            <SelectRoot
              :modelValue="newBucketPublic ? 'public' : 'private'"
              @update:modelValue="(val) => (newBucketPublic = val === 'public')"
            >
              <SelectTrigger
                class="w-full inline-flex h-11 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400"
                :aria-label="t('media.visibilityAria')"
              >
                <SelectValue :placeholder="t('media.selectVisibility')" />
                <Icon
                  icon="radix-icons:chevron-down"
                  class="w-4 h-4 opacity-70"
                />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent
                  class="z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  :side-offset="5"
                >
                  <SelectScrollUpButton
                    class="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500"
                  >
                    <Icon icon="radix-icons:chevron-up" />
                  </SelectScrollUpButton>
                  <SelectViewport class="p-1">
                    <SelectGroup>
                      <SelectItem
                        value="public"
                        class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                      >
                        <SelectItemIndicator
                          class="absolute start-0 w-8 inline-flex items-center justify-center"
                        >
                          <Icon icon="mdi:check" class="w-4 h-4" />
                        </SelectItemIndicator>
                        <SelectItemText>{{ t('media.publicOption') }}</SelectItemText>
                      </SelectItem>
                      <SelectSeparator
                        class="h-px bg-gray-200 dark:bg-gray-700 my-1"
                      />
                      <SelectItem
                        value="private"
                        class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                      >
                        <SelectItemIndicator
                          class="absolute start-0 w-8 inline-flex items-center justify-center"
                        >
                          <Icon icon="mdi:check" class="w-4 h-4" />
                        </SelectItemIndicator>
                        <SelectItemText>{{ t('media.privateOption') }}</SelectItemText>
                      </SelectItem>
                    </SelectGroup>
                  </SelectViewport>
                  <SelectScrollDownButton
                    class="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500"
                  >
                    <Icon icon="radix-icons:chevron-down" />
                  </SelectScrollDownButton>
                </SelectContent>
              </SelectPortal>
            </SelectRoot>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              {{ t('media.visibilityHint') }}
            </p>
          </div>
          <div class="space-y-2 md:col-span-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:file-code-outline" class="text-blue-500" />
              {{ t('media.allowedMimeTypes') }}
            </label>
            <div class="relative group">
              <textarea
                v-model.trim="newBucketMime"
                rows="3"
                :placeholder="t('media.mimePlaceholder')"
                class="w-full rounded-lg px-4 py-3 bg-white/90 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400/60 focus:border-gray-400 dark:focus:border-gray-500 shadow-sm transition-colors leading-relaxed min-h-[96px] resize-none text-sm"
              ></textarea>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              {{ t('media.mimeHint') }}
            </p>
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100"
            >
              <Icon icon="mdi:scale" class="text-blue-500" /> {{ t('media.fileSizeLimit') }}
            </label>
            <input
              v-model.trim="newBucketSizeLimit"
              :placeholder="t('media.sizeLimitPlaceholder')"
              class="w-full h-11 rounded-md px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              {{ t('media.sizeLimitHint') }}
            </p>
          </div>
        </div>
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-4 justify-between pt-2"
        >
          <div
            class="flex items-center gap-2 flex-wrap text-[11px] text-gray-500 dark:text-gray-400"
          >
            <span class="inline-flex items-center gap-1"
              ><Icon icon="mdi:shield-lock-outline" class="text-gray-400" />
              {{ t('media.reservedNames') }}</span
            >
            <span
              v-if="bucketNameReserved"
              class="text-red-600 dark:text-red-400 font-medium"
              >{{ t('media.reservedName') }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="toggleCreate"
              type="button"
              class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <Icon icon="mdi:close" class="text-sm" /> {{ t('common.cancel') }}
            </button>
            <button
              @click="createBucket"
              :disabled="creating || !!bucketNameError || !newBucketName"
              class="inline-flex items-center gap-2 h-9 px-5 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Icon
                :icon="creating ? 'mdi:loading' : 'mdi:check-circle'"
                :class="creating ? 'animate-spin' : 'text-base'"
              />
              <span>{{ creating ? t('common.creating') : t('media.createBucket') }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="b in buckets"
          :key="b"
          class="group relative flex flex-col items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow transition cursor-pointer"
          @click="onBucketCardClick($event, b)"
          tabindex="0"
          @keydown.enter.prevent="openBucket(b)"
          @keydown.space.prevent="openBucket(b)"
          role="button"
          :aria-label="t('media.openBucket', { name: b })"
        >
          <div class="flex items-start justify-between w-full">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"
              >
                <Icon
                  icon="mdi:database"
                  class="text-blue-600 dark:text-blue-300 text-xl"
                />
              </div>
              <div class="text-start">
                <h3
                  class="text-sm font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2"
                >
                  <button
                    @click="openBucket(b)"
                    class="hover:underline underline-offset-2"
                  >
                    {{ b }}
                  </button>
                  <span
                    v-if="systemBuckets.has(b)"
                    class="inline-flex items-center h-5 px-2 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] font-semibold"
                    >{{ t('media.system') }}</span
                  >
                  <span
                    v-else-if="bucketVisibility[b] === false"
                    class="inline-flex items-center h-5 px-2 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700/60 dark:text-gray-200 text-[10px] font-semibold gap-1"
                  >
                    <Icon icon="mdi:lock" class="text-xs" /> {{ t('media.private') }}
                  </span>
                </h3>
                <p class="text-[11px] text-gray-500 dark:text-gray-400">
                  {{
                    systemBuckets.has(b)
                      ? t('media.managedInternally')
                      : t('media.userBucket')
                  }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1" v-if="!systemBuckets.has(b)">
              <button
                data-bucket-action
                @click.stop="attemptEmptyBucket(b)"
                :title="t('media.emptyBucket')"
                class="inline-flex items-center justify-center w-7 h-7 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60"
              >
                <Icon icon="mdi:delete-empty" class="text-sm" />
              </button>
              <button
                data-bucket-action
                @click.stop="attemptDeleteBucket(b)"
                :title="t('media.deleteBucket')"
                class="inline-flex items-center justify-center w-7 h-7 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60"
              >
                <Icon icon="mdi:trash-can" class="text-sm" />
              </button>
            </div>
          </div>
          <div
            v-if="bucketMeta[b]"
            class="mt-1 text-[11px] text-gray-500 dark:text-gray-400"
          >
            <template v-if="b === 'profile-avatar'">
              {{ t('media.avatarCount', { count: bucketMeta[b].files }) }}
            </template>
            <template v-else>
              {{ t('media.fileCount', { count: bucketMeta[b].files }) }}
            </template>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div
          class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 flex-wrap"
        >
          <button
            @click="closeBucket"
            class="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Icon icon="mdi:arrow-left" class="text-base" /> {{ t('media.buckets') }}
          </button>
          <span class="mx-1 opacity-40">/</span>
          <button
            @click="goBucketRoot"
            class="font-semibold hover:underline underline-offset-2"
          >
            {{ activeBucket }}
          </button>
          <span
            v-if="systemBuckets.has(activeBucket)"
            class="inline-flex items-center h-5 px-2 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] font-semibold"
            >{{ t('media.system') }}</span
          >
          <span
            v-else-if="bucketVisibility[activeBucket] === false"
            class="inline-flex items-center h-5 px-2 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700/60 dark:text-gray-200 text-[10px] font-semibold gap-1"
          >
            <Icon icon="mdi:lock" class="text-xs" /> {{ t('media.private') }}
          </span>
          <template v-if="pathSegments.length">
            <span class="opacity-40">/</span>
            <template v-for="(seg, idx) in pathSegments" :key="idx">
              <button
                @click="goToCrumb(idx)"
                class="hover:underline underline-offset-2"
              >
                {{ seg }}
              </button>
              <span v-if="idx < pathSegments.length - 1" class="opacity-40"
                >/</span
              >
            </template>
          </template>
          <button
            v-if="currentPath"
            @click="upOne"
            class="inline-flex items-center gap-1 h-7 px-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Icon icon="mdi:arrow-up" class="text-sm" /> {{ t('media.up') }}
          </button>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <button
            v-if="!systemBuckets.has(activeBucket)"
            @click="triggerUpload"
            :disabled="uploading"
            class="inline-flex items-center gap-1 h-8 px-3 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Icon
              :icon="uploading ? 'mdi:loading' : 'mdi:upload'"
              :class="uploading ? 'animate-spin' : 'text-sm'"
            />
            <span>{{ uploading ? t('common.uploading') : t('media.upload') }}</span>
          </button>
          <button
            v-if="!systemBuckets.has(activeBucket)"
            @click="attemptEmptyBucket(activeBucket)"
            class="inline-flex items-center gap-1 h-8 px-3 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/60"
          >
            <Icon icon="mdi:delete-empty" class="text-sm" /> {{ t('media.empty') }}
          </button>
          <button
            v-if="!systemBuckets.has(activeBucket)"
            @click="attemptDeleteBucket(activeBucket)"
            class="inline-flex items-center gap-1 h-8 px-3 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/60"
          >
            <Icon icon="mdi:trash-can" class="text-sm" /> {{ t('media.deleteBucket') }}
          </button>
          <div class="flex items-center h-8 w-48 sm:w-50 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 transition">
            <Icon icon="mdi:magnify" class="ms-2 text-gray-400 dark:text-gray-400 text-sm shrink-0" />
            <input
              v-model="searchTerm"
              type="text"
              :placeholder="t('media.searchPlaceholder')"
              class="flex-1 h-full bg-transparent px-2 text-xs leading-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
            />
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{
            t('media.itemsShown', {
              filtered: filteredEntries.length,
              total: entries.length,
            })
          }}</span>
          <button
            @click="refresh"
            class="inline-flex items-center gap-1 h-8 px-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Icon icon="mdi:refresh" class="text-sm" /> {{ t('common.refresh') }}
          </button>
          <button
            v-if="searchTerm"
            @click="searchTerm = ''"
            class="inline-flex items-center gap-1 h-8 px-2 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-[11px] font-medium hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none"
          >
            <Icon icon="mdi:close" class="text-sm" /> {{ t('common.clear') }}
          </button>
        </div>
      </div>

      <input
        ref="uploadInput"
        type="file"
        class="hidden"
        multiple
        @change="handleUpload"
      />

      <div
        class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <table class="min-w-full text-sm">
          <thead
            class="text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/40"
          >
            <tr>
              <th class="text-start font-semibold px-3 py-2 w-20">{{ t('media.preview') }}</th>
              <th class="text-start font-semibold px-3 py-2">{{ t('media.name') }}</th>
              <th class="text-start font-semibold px-3 py-2">{{ t('media.type') }}</th>
              <th class="text-start font-semibold px-3 py-2">{{ t('media.size') }}</th>
              <th class="text-start font-semibold px-3 py-2">{{ t('media.modified') }}</th>
              <th
                v-if="!isPrivateActiveBucket"
                class="text-start font-semibold px-3 py-2"
              >
                {{ t('media.usage') }}
              </th>
              <th class="text-start font-semibold px-3 py-2 w-48">{{ t('media.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="text-gray-500 dark:text-gray-400">
              <td :colspan="fileTableColspan" class="px-3 py-6 text-center">
                <Icon
                  icon="mdi:loading"
                  class="animate-spin inline-block me-2"
                />
                {{ t('common.loading') }}
              </td>
            </tr>
            <tr
              v-for="e in filteredEntries"
              :key="e.path"
              class="border-t border-gray-100 dark:border-gray-700/60 hover:bg-gray-50/70 dark:hover:bg-gray-700/40"
            >
              <td class="px-3 py-2">
                <div
                  v-if="e.type === 'file' || e.type === 'avatar-profile'"
                  class="w-14 h-14 rounded border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                >
                  <img
                    v-if="e.isImage"
                    :src="e.publicUrl"
                    :alt="t('media.preview')"
                    class="object-cover w-full h-full"
                    loading="lazy"
                  />
                  <Icon v-else icon="mdi:file" class="text-gray-400" />
                </div>
              </td>
              <td class="px-3 py-2">
                <button
                  v-if="e.type === 'folder' || e.type === 'avatar-profile'"
                  @click="
                    e.type === 'avatar-profile'
                      ? openAvatarFolder(e)
                      : openFolder(e)
                  "
                  class="inline-flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Icon
                    :icon="
                      e.type === 'avatar-profile'
                        ? 'mdi:folder-account'
                        : 'mdi:folder'
                    "
                    class="text-base"
                  />
                  {{ e.name }}
                  <span
                    v-if="e.type === 'avatar-profile' && e.profileMeta"
                    class="text-[11px] font-normal text-gray-500 dark:text-gray-400"
                    >{{ e.profileMeta.display }}</span
                  >
                </button>
                <div v-else class="flex flex-col gap-0.5 max-w-xs">
                  <span
                    class="font-medium text-gray-800 dark:text-gray-100 break-all"
                    :title="e.name"
                    >{{ e.name }}</span
                  >
                  <span
                    v-if="e.profileMeta"
                    class="text-[11px] text-gray-500 dark:text-gray-400 break-all"
                    >{{ e.profileMeta.display }}</span
                  >
                  <span
                    v-if="e.isCurrent"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-semibold w-fit"
                    >{{ t('media.current') }}</span
                  >
                </div>
              </td>
              <td class="px-3 py-2 text-gray-600 dark:text-gray-300">
                {{ e.type }}
              </td>
              <td
                class="px-3 py-2 tabular-nums text-gray-600 dark:text-gray-300"
              >
                {{ formatSize(e.size) }}
              </td>
              <td class="px-3 py-2 text-gray-600 dark:text-gray-300">
                {{ formatDate(e.updated_at) }}
              </td>
              <td v-if="!isPrivateActiveBucket" class="px-3 py-2">
                <div
                  v-if="e.type === 'file' || e.type === 'avatar-profile'"
                  class="flex flex-col gap-1"
                >
                  <span
                    :class="[
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold',
                      e.usage.total > 0
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
                    ]"
                  >
                    <Icon
                      :icon="
                        e.usage.total > 0 ? 'mdi:link' : 'mdi:check-circle'
                      "
                      class="text-xs"
                    />
                    {{
                      e.usage.total > 0
                        ? t('media.inUse', { count: e.usage.total })
                        : t('media.unused')
                    }}
                  </span>
                </div>
              </td>
              <td class="px-3 py-2">
                <div class="flex flex-wrap items-center gap-2">
                  <a
                    v-if="e.type === 'file' || e.type === 'avatar-profile'"
                    :href="e.publicUrl"
                    target="_blank"
                    class="inline-flex items-center gap-1 h-7 px-2 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[12px] font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60"
                  >
                    <Icon icon="mdi:open-in-new" class="text-sm" /> {{ t('common.open') }}
                  </a>
                  <button
                    v-if="
                      e.type === 'file' &&
                      bucketVisibility[activeBucket] === false
                    "
                    @click="handleGenerateSignedLink(e)"
                    class="inline-flex items-center gap-1 h-7 px-2 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[12px] font-medium hover:bg-purple-200 dark:hover:bg-purple-900/60"
                    :title="t('media.generateSignedLink')"
                  >
                    <Icon icon="mdi:link-variant" class="text-sm" /> {{ t('media.link') }}
                  </button>
                  <button
                    v-if="e.type === 'file' || e.type === 'avatar-profile'"
                    @click="prepareDelete(e)"
                    class="inline-flex items-center gap-1 h-7 px-2 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-[12px] font-medium hover:bg-red-200 dark:hover:bg-red-900/60"
                  >
                    <Icon icon="mdi:delete" class="text-sm" /> {{ t('common.delete') }}
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && filteredEntries.length === 0">
              <td
                :colspan="fileTableColspan"
                class="px-3 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                {{ t('media.noMatchingItems') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmDialog
      v-if="confirm.open"
      :open="confirm.open"
      :title="confirm.title"
      :description="confirm.description"
      :body="confirm.body"
      @confirm="performConfirm"
      @cancel="confirm.open = false"
    />
    <SignedLinkDialog
      v-if="linkDialog.open"
      :open="linkDialog.open"
      @generate="onGenerateSigned"
      @cancel="onLinkDialogCancel"
      @close="onLinkDialogClose"
    />
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

import { ref, reactive, computed } from "vue";
import { supabase } from "@/services/supabase";
import { Icon } from "@iconify/vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";import SignedLinkDialog from "@/components/dashboard/SignedLinkDialog.vue";
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectSeparator,
} from "radix-vue";

const buckets = ref([]);
const bucketMeta = reactive({});
const bucketVisibility = reactive({});
const systemBuckets = new Set([
  "post-thumbnails",
  "profile-avatar",
  "branding",
]);
const showCreate = ref(false);
const creating = ref(false);
const newBucketName = ref("");
const newBucketPublic = ref(true);
const newBucketMime = ref("");
const newBucketSizeLimit = ref("");
const uploading = ref(false);
const uploadInput = ref(null);
const loadingBuckets = ref(false);
const activeBucket = ref(null);
const currentPath = ref("");
const entries = ref([]);
const loading = ref(false);
const confirm = reactive({
  open: false,
  target: null,
  title: "",
  description: "",
  body: "",
  action: null,
});
const toast = useToast();
const linkDialog = reactive({ open: false, target: null });
const isPrivateActiveBucket = computed(() =>
  activeBucket.value ? bucketVisibility[activeBucket.value] === false : false
);
const fileTableColspan = computed(() => (isPrivateActiveBucket.value ? 6 : 7));

const pathSegments = computed(() =>
  currentPath.value ? currentPath.value.split("/").filter(Boolean) : []
);
const searchTerm = ref("");
const filteredEntries = computed(() => {
  if (!searchTerm.value.trim()) return entries.value;
  const q = searchTerm.value.toLowerCase();
  return entries.value.filter(
    (e) =>
      (e.name && e.name.toLowerCase().includes(q)) ||
      (e.profileMeta?.display &&
        e.profileMeta.display.toLowerCase().includes(q)) ||
      (e.path && e.path.toLowerCase().includes(q))
  );
});

const bucketNameReserved = computed(
  () => newBucketName.value && systemBuckets.has(newBucketName.value)
);
const bucketNameError = computed(() => {
  if (!newBucketName.value) return "";
  if (bucketNameReserved.value) return t("media.reservedSystemName");
  if (!/^[a-z0-9-]{3,50}$/.test(newBucketName.value)) return t("media.invalidFormat");
  return "";
});

function formatSize(size) {
  if (!size && size !== 0) return "-";
  if (size < 1024) return size + " B";
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
  return (size / 1024 / 1024).toFixed(1) + " MB";
}
function formatDate(d) {
  return d ? new Date(d).toLocaleString() : "-";
}

async function openBucket(name) {
  activeBucket.value = name;
  currentPath.value = "";
  await listObjects();
}
function closeBucket() {
  activeBucket.value = null;
  entries.value = [];
}
function goBucketRoot() {
  if (!activeBucket.value) return;
  currentPath.value = "";
  listObjects();
}
function upOne() {
  if (!currentPath.value) return;
  if (!currentPath.value.includes("/")) {
    currentPath.value = "";
    listObjects();
    return;
  }
  currentPath.value = currentPath.value.split("/").slice(0, -1).join("/");
  listObjects();
}
async function openFolder(entry) {
  currentPath.value = currentPath.value
    ? currentPath.value + "/" + entry.name
    : entry.name;
  await listObjects();
}
async function goToCrumb(idx) {
  currentPath.value = pathSegments.value.slice(0, idx + 1).join("/");
  await listObjects();
}

async function listObjects() {
  if (!activeBucket.value) return;
  loading.value = true;
  entries.value = [];
  try {
    if (activeBucket.value === "profile-avatar" && !currentPath.value) {
      const { data: profs, error: profErr } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .not("avatar_url", "is", null);
      if (profErr) throw profErr;
      const avatarProfiles = (profs || []).filter(
        (p) =>
          /\/storage\/v1\/object\//.test(p.avatar_url || "") &&
          p.avatar_url.includes("/profile-avatar/")
      );
      const mapped = [];
      for (const p of avatarProfiles) {
        const m = p.avatar_url.match(/\/profile-avatar\/(.+)$/);
        const objectPath = m ? m[1] : null;
        if (!objectPath) continue;
        const parentFolder = objectPath.includes("/")
          ? objectPath.split("/").slice(0, -1).join("/")
          : "";
        let size = 0,
          updated_at = null;
        try {
          const { data: listData } = await supabase.storage
            .from("profile-avatar")
            .list(parentFolder || undefined, { limit: 10 });
          const fname = objectPath.split("/").pop();
          const fileObj = (listData || []).find(
            (o) => o.name === fname && o.id
          );
          if (fileObj) {
            size = fileObj.metadata?.size || fileObj.size || 0;
            updated_at = fileObj.updated_at;
          }
        } catch {
        }
        mapped.push({
          name:
            p.display_name ||
            p.username ||
            t("media.userFallback", { id: p.id.substring(0, 6) }),
          profileMeta: {
            id: p.id,
            username: p.username,
            display: p.username ? "@" + p.username : p.id.substring(0, 8),
          },
          id: p.id,
          updated_at,
          created_at: null,
          last_accessed_at: null,
          metadata: null,
          size,
          type: "avatar-profile",
          path: objectPath,
          usageLoaded: true,
          usage: { posts: [], profiles: [p.id], branding: [], total: 1 },
          publicUrl: p.avatar_url,
          isImage: true,
        });
      }
      entries.value = mapped;
      bucketMeta[activeBucket.value] = { files: mapped.length };
    } else if (activeBucket.value === "profile-avatar" && currentPath.value) {
      const userId = currentPath.value.split("/")[0];
      let currentAvatarPath = null;
      try {
        const { data: prof } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", userId)
          .maybeSingle();
        if (prof?.avatar_url) {
          const m = prof.avatar_url.match(/\/profile-avatar\/(.+)$/);
          if (m) currentAvatarPath = m[1];
        }
      } catch {}
      const { data, error } = await supabase.storage
        .from("profile-avatar")
        .list(userId, {
          limit: 100,
          sortBy: { column: "name", order: "desc" },
        });
      if (error) throw error;
      const mapped = (data || [])
        .filter((o) => o.id)
        .map((o) => {
          const objectPath = userId + "/" + o.name;
          const publicUrl = supabase.storage
            .from("profile-avatar")
            .getPublicUrl(objectPath).data.publicUrl;
          const lower = o.name.toLowerCase();
          const isImage =
            /(\.png$|\.jpe?g$|\.webp$|\.gif$|\.svg$|\.avif$)/.test(lower);
          const isCurrent = currentAvatarPath === objectPath;
          return {
            name: o.name,
            id: o.id,
            updated_at: o.updated_at,
            created_at: o.created_at,
            last_accessed_at: o.last_accessed_at,
            metadata: o.metadata,
            size: o.metadata?.size || o.size || 0,
            type: "file",
            path: objectPath,
            usageLoaded: true,
            usage: {
              posts: [],
              profiles: isCurrent ? [userId] : [],
              branding: [],
              total: isCurrent ? 1 : 0,
            },
            publicUrl,
            isImage,
            isCurrent,
          };
        });
      entries.value = mapped;
    } else {
      const prefix = currentPath.value || "";
      const { data, error } = await supabase.storage
        .from(activeBucket.value)
        .list(prefix, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });
      if (error) throw error;
      const mapped = (data || []).map((obj) => {
        const objectPath = prefix ? `${prefix}/${obj.name}` : obj.name;
        // Folders typically have null id + null metadata; files usually have an id
        // and/or metadata. Some Storage backends omit id — treat metadata as file.
        const isFile =
          obj.id != null ||
          (obj.metadata != null && typeof obj.metadata === "object");
        const publicUrl = isFile
          ? publicUrlForObject(activeBucket.value, objectPath) ||
            supabase.storage.from(activeBucket.value).getPublicUrl(objectPath)
              .data.publicUrl
          : null;
        const lower = obj.name.toLowerCase();
        const isImage =
          isFile &&
          /(\.png$|\.jpe?g$|\.webp$|\.gif$|\.svg$|\.avif$)/.test(lower);
        return {
          name: obj.name,
          id: obj.id,
          updated_at: obj.updated_at,
          created_at: obj.created_at,
          last_accessed_at: obj.last_accessed_at,
          metadata: obj.metadata,
          size: obj.metadata?.size || obj.size || 0,
          type: isFile ? "file" : "folder",
          path: objectPath,
          usageLoaded: true,
          usage: { posts: [], profiles: [], branding: [], total: 0 },
          publicUrl,
          isImage,
        };
      });
      entries.value = mapped;
      bucketMeta[activeBucket.value] = bucketMeta[activeBucket.value] || {
        files: 0,
      };
      bucketMeta[activeBucket.value].files = mapped.filter(
        (m) => m.type === "file"
      ).length;
      if (bucketVisibility[activeBucket.value] !== false) {
        await computeUsageForEntries();
      }
      if (bucketVisibility[activeBucket.value] === false) {
        const filePaths = entries.value
          .filter((e) => e.type === "file")
          .map((e) => e.path);
        if (filePaths.length) {
          try {
            const { data: signedData, error: signErr } = await supabase.storage
              .from(activeBucket.value)
              .createSignedUrls(filePaths, 60);
            if (!signErr && signedData) {
              const map = new Map(signedData.map((d) => [d.path, d.signedUrl]));
              for (const e of entries.value) {
                if (e.type === "file" && map.has(e.path))
                  e.publicUrl = map.get(e.path);
              }
            }
          } catch (signE) {
            console.warn("signed urls batch failed", signE);
          }
        }
      }
    }
  } catch (e) {
    console.error("[media-list]", e);
    toast.error(e?.message || t("media.listFailed"));
  } finally {
    loading.value = false;
  }
}

async function computeUsageForEntries() {
  try {
    const [postsRes, profilesRes, brandingRes] = await Promise.all([
      supabase.from("posts").select("id, cover_image_url"),
      supabase.from("profiles").select("id, avatar_url"),
      supabase
        .from("settings")
        .select("value")
        .eq("key", "branding")
        .maybeSingle(),
    ]);
    const postsList = postsRes.data || [];
    const profilesList = profilesRes.data || [];
    const brandingRow = brandingRes.data;
    const brandingPaths = new Set();
    if (brandingRow?.value) {
      ["lightLogoPath", "darkLogoPath", "faviconPath"].forEach((k) => {
        if (brandingRow.value[k]) brandingPaths.add(brandingRow.value[k]);
      });
    }
    for (const e of entries.value) {
      if (e.type !== "file") continue;
      const pUsed = postsList
        .filter((p) => p.cover_image_url && p.cover_image_url.includes(e.path))
        .map((p) => p.id);
      const profUsed = profilesList
        .filter((pr) => pr.avatar_url && pr.avatar_url.includes(e.path))
        .map((pr) => pr.id);
      const brandingUsed = brandingPaths.has(e.path) ? ["branding"] : [];
      e.usage.posts = pUsed;
      e.usage.profiles = profUsed;
      e.usage.branding = brandingUsed;
      e.usage.total = pUsed.length + profUsed.length + brandingUsed.length;
    }
  } catch (e) {
    console.error(e);
  }
}

function prepareDelete(entry) {
  if (entry.type !== "file" && entry.type !== "avatar-profile") return;
  if (!entry.usageLoaded) {
    loadUsage(entry).then(() => prepareDelete(entry));
    return;
  }
  const inUse = entry.usage.total > 0;
  confirm.target = entry;
  confirm.title = inUse
    ? t("media.deleteAndDetachTitle")
    : t("media.deleteMediaTitle");
  confirm.description = inUse
    ? t("media.fileReferenced")
    : t("media.removeFileDesc");
  confirm.body = inUse
    ? t("media.deleteInUseBody", { usage: usageSummary(entry) })
    : t("media.deleteFileBody");
  confirm.action = "deleteFile";
  confirm.open = true;
}

function usageSummary(entry) {
  const bits = [];
  if (entry.usage.posts.length)
    bits.push(t("media.postsCount", { count: entry.usage.posts.length }));
  if (entry.usage.profiles.length)
    bits.push(t("media.profilesCount", { count: entry.usage.profiles.length }));
  if (entry.usage.branding.length) bits.push(t("media.branding"));
  return bits.join(", ");
}

async function performConfirm() {
  if (!confirm.action) {
    confirm.open = false;
    return;
  }
  if (confirm.action === "deleteFile") return await deleteFileConfirm();
  if (confirm.action === "emptyBucket") return await emptyBucketConfirm();
  if (confirm.action === "deleteBucket") return await deleteBucketConfirm();
  if (confirm.action === "emptyThenDelete") {
    const ok = await emptyBucketConfirm(true);
    if (ok) await deleteBucketConfirm();
    return;
  }
}

async function deleteFileConfirm() {
  const entry = confirm.target;
  if (!entry) {
    confirm.open = false;
    return;
  }
  try {
    if (entry.usage.total > 0) {
      if (entry.usage.posts.length) {
        await supabase
          .from("posts")
          .update({ cover_image_url: null })
          .in("id", entry.usage.posts);
      }
      if (entry.usage.profiles.length) {
        await supabase
          .from("profiles")
          .update({ avatar_url: null })
          .in("id", entry.usage.profiles);
      }
      if (entry.usage.branding.length) {
        const { data: brandingRow } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "branding")
          .maybeSingle();
        if (brandingRow?.value) {
          const v = brandingRow.value;
          ["lightLogo", "darkLogo", "favicon"].forEach((prefix) => {
            const pathKey = prefix + "Path";
            const urlKey = prefix + "Url";
            if (v[pathKey] === entry.path) {
              delete v[pathKey];
              delete v[urlKey];
            }
          });
          await supabase
            .from("settings")
            .update({ value: v })
            .eq("key", "branding");
        }
      }
    }
    const { error } = await supabase.storage
      .from(activeBucket.value)
      .remove([entry.path]);
    if (error) throw error;
    toast.success(t("media.fileDeleted"));
    confirm.open = false;
    confirm.target = null;
    confirm.action = null;
    await listObjects();
  } catch (e) {
    console.error("[media-delete]", e);
    toast.error(t("media.deleteFailed"));
  }
}

function attemptEmptyBucket(bucket) {
  if (systemBuckets.has(bucket)) {
    toast.error(t("media.systemCannotEmpty"));
    return;
  }
  confirm.open = true;
  confirm.target = bucket;
  confirm.action = "emptyBucket";
  confirm.title = t("media.emptyBucketTitle");
  confirm.description = t("media.emptyBucketDesc");
  confirm.body = t("media.emptyBucketBody", { bucket });
}

function attemptDeleteBucket(bucket) {
  if (systemBuckets.has(bucket)) {
    toast.error(t("media.systemCannotDelete"));
    return;
  }
  const meta = bucketMeta[bucket];
  if (meta && meta.files > 0) {
    confirm.action = "emptyThenDelete";
    confirm.title = t("media.bucketNotEmptyTitle");
    confirm.description = t("media.bucketContainsFiles", {
      count: meta.files,
    });
    confirm.body = t("media.emptyThenDeleteBody");
  } else {
    confirm.action = "deleteBucket";
    confirm.title = t("media.deleteBucketTitle");
    confirm.description = t("media.deleteBucketDesc");
    confirm.body = t("media.deleteBucketBody", { bucket });
  }
  confirm.open = true;
  confirm.target = bucket;
}

async function emptyBucketConfirm(silent = false) {
  const bucket = confirm.target;
  if (!bucket) {
    confirm.open = false;
    return false;
  }
  try {
    const { error } = await supabase.storage.emptyBucket(bucket);
    if (error) throw error;
    if (!silent) toast.success(t("media.bucketEmptied"));
    if (bucketMeta[bucket]) bucketMeta[bucket].files = 0;
    if (activeBucket.value === bucket) {
      currentPath.value = "";
      entries.value = [];
    }
    if (confirm.action === "emptyBucket") {
      confirm.open = false;
      confirm.action = null;
    }
    return true;
  } catch (e) {
    console.error("[media-empty]", e);
    toast.error(t("media.emptyFailed"));
    if (confirm.action === "emptyBucket") confirm.open = false;
    return false;
  }
}

async function deleteBucketConfirm() {
  const bucket = confirm.target;
  if (!bucket) {
    confirm.open = false;
    return;
  }
  try {
    const { error } = await supabase.storage.deleteBucket(bucket);
    if (error) throw error;
    toast.success(t("media.bucketDeleted"));
    const idx = buckets.value.indexOf(bucket);
    if (idx > -1) buckets.value.splice(idx, 1);
    delete bucketMeta[bucket];
    if (activeBucket.value === bucket) closeBucket();
  } catch (e) {
    console.error("[media-delete-bucket]", e);
    toast.error(t("media.deleteBucketFailed"));
  } finally {
    confirm.open = false;
    confirm.action = null;
  }
}

function triggerUpload() {
  if (!activeBucket.value || systemBuckets.has(activeBucket.value)) return;
  uploadInput.value && uploadInput.value.click();
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9_.-]/g, "-");
}

function parseFileSizeLimit(raw) {
  const value = String(raw || "").trim();
  if (!value) return undefined;
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/i);
  if (!match) return undefined;
  const amount = Number(match[1]);
  const unit = (match[2] || "b").toLowerCase();
  const multipliers = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 };
  return Math.round(amount * (multipliers[unit] || 1));
}

function publicUrlForObject(bucket, objectPath) {
  if (bucketVisibility[bucket] === false) {
    return null;
  }
  return supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl;
}

async function handleUpload(ev) {
  const files = Array.from(ev.target.files || []);
  if (!files.length) return;
  uploading.value = true;
  try {
    let success = 0,
      fail = 0;
    for (const f of files) {
      const cleaned = sanitizeFileName(f.name);
      const path =
        (currentPath.value ? currentPath.value + "/" : "") +
        Date.now() +
        "-" +
        cleaned;
      const { data, error } = await supabase.storage
        .from(activeBucket.value)
        .upload(path, f, {
          upsert: false,
          contentType: f.type || "application/octet-stream",
        });
      if (error) {
        console.warn("upload fail", cleaned, error);
        fail++;
      } else if (!data?.path) {
        console.warn("upload missing path", cleaned, data);
        fail++;
      } else {
        success++;
      }
    }
    if (success) toast.success(t("media.filesUploaded", { count: success }));
    if (fail) toast.error(t("media.uploadFailedCount", { count: fail }));
    await listObjects();
  } finally {
    uploading.value = false;
    ev.target.value = "";
  }
}

function toggleCreate() {
  showCreate.value = !showCreate.value;
}

function validateBucketName(name) {
  return /^[a-z0-9-]{3,50}$/.test(name);
}

async function createBucket() {
  if (!validateBucketName(newBucketName.value)) {
    toast.error(t("media.invalidBucketName"));
    return;
  }
  if (systemBuckets.has(newBucketName.value)) {
    toast.error(t("media.reservedBucketName"));
    return;
  }
  creating.value = true;
  try {
    const opts = { public: newBucketPublic.value };
    if (newBucketMime.value.trim())
      opts.allowedMimeTypes = newBucketMime.value
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);
    if (newBucketSizeLimit.value.trim()) {
      const parsedLimit = parseFileSizeLimit(newBucketSizeLimit.value);
      if (!parsedLimit) {
        toast.error(t("media.invalidSizeLimit"));
        creating.value = false;
        return;
      }
      opts.fileSizeLimit = parsedLimit;
    }
    const { error } = await supabase.storage.createBucket(
      newBucketName.value,
      opts
    );
    if (error) throw error;
    toast.success(t("media.bucketCreated"));
    bucketVisibility[newBucketName.value] = newBucketPublic.value;
    newBucketName.value = "";
    newBucketMime.value = "";
    newBucketSizeLimit.value = "";
    showCreate.value = false;
    await init(true);
  } catch (e) {
    console.error("[media-create-bucket]", e);
    toast.error(t("media.createFailed"));
  } finally {
    creating.value = false;
  }
}

async function refresh() {
  await listObjects();
}
async function refreshBuckets() {
  await init(true);
}

async function loadBuckets(force = false) {
  if (buckets.value.length && !force) return;
  loadingBuckets.value = true;
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    buckets.value = (data || [])
      .map((b) => {
        const name = b.name || b.id;
        bucketVisibility[name] = b.public;
        return name;
      })
      .sort();
  } catch (e) {
    console.error("[media] loadBuckets failed", e);
    toast.error(t("media.loadBucketsFailed"));
  } finally {
    loadingBuckets.value = false;
  }
}

async function init(force = false) {
  await loadBuckets(force);
  if (!force && Object.keys(bucketMeta).length) return;
  for (const b of buckets.value) {
    if (b === "profile-avatar") {
      try {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, avatar_url")
          .not("avatar_url", "is", null);
        bucketMeta[b] = {
          files: (profs || []).filter(
            (p) => p.avatar_url && p.avatar_url.includes("/profile-avatar/")
          ).length,
        };
      } catch {
        bucketMeta[b] = { files: 0 };
      }
    } else {
      try {
        const { data } = await supabase.storage
          .from(b)
          .list("", { limit: 100 });
        bucketMeta[b] = {
          files: (data || []).filter(
            (d) =>
              d.id != null ||
              (d.metadata != null && typeof d.metadata === "object")
          ).length,
        };
      } catch {
        bucketMeta[b] = { files: 0 };
      }
    }
  }
}
init();

async function loadUsage(entry) {
  try {
    await computeUsageForEntries();
  } catch {}
}

function openAvatarFolder(entry) {
  if (entry.type !== "avatar-profile") return;
  const userId = entry.path.split("/")[0];
  currentPath.value = userId;
  listObjects();
}

async function generateSignedUrl(entry, seconds = 60, copy = true) {
  if (!activeBucket.value || !entry || entry.type !== "file") return;
  try {
    const { data, error } = await supabase.storage
      .from(activeBucket.value)
      .createSignedUrl(entry.path, seconds);
    if (error) throw error;
    if (data?.signedUrl) {
      entry.publicUrl = data.signedUrl;
      if (copy && navigator?.clipboard) {
        try {
          await navigator.clipboard.writeText(data.signedUrl);
          toast.success(t("media.signedUrlCopied"));
        } catch {
          toast.success(t("media.signedUrlGenerated"));
        }
      } else {
        toast.success(t("media.signedUrlGenerated"));
      }
    } else toast.error(t("media.signedUrlFailed"));
  } catch (e) {
    console.error("signed-url-single", e);
    toast.error(t("media.signedUrlError"));
  }
}

function handleGenerateSignedLink(entry) {
  if (!entry) return;
  linkDialog.open = true;
  linkDialog.target = entry;
}

function onGenerateSigned(secs, cb) {
  if (!linkDialog.target) return;
  generateSignedUrl(linkDialog.target, secs, false).then(() => {
    cb && cb(linkDialog.target.publicUrl);
  });
}
function onLinkDialogCancel() {
  linkDialog.open = false;
  linkDialog.target = null;
}
function onLinkDialogClose() {
  linkDialog.open = false;
  linkDialog.target = null;
}

function onBucketCardClick(ev, bucket) {
  if (ev.target.closest("[data-bucket-action]")) return;
  openBucket(bucket);
}
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}
tbody tr:last-child td:first-child {
  border-end-start-radius: 0.5rem;
}
tbody tr:last-child td:last-child {
  border-end-end-radius: 0.5rem;
}
</style>
