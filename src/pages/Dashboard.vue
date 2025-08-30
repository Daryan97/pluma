<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <h1
      class="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-2"
    >
      <Icon
        icon="mdi:view-dashboard"
        class="text-blue-600 dark:text-blue-400 text-3xl"
      />
      Dashboard
    </h1>

    <!-- Stats Header with Create Button -->
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div
        class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"
      >
        <Icon icon="mdi:chart-box-outline" class="text-blue-500 text-xl" />
        Stats Overview
      </div>
      <div class="flex items-center gap-2">
        <router-link
          to="/dashboard/new-post"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-900 text-white rounded-md button"
        >
          <Icon icon="mdi:plus" />
          New Post
        </router-link>
        <CategoriesManagement />
        <router-link
          v-if="role === 'admin'"
          to="/dashboard/members"
          class="button inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-800 text-white rounded-md"
        >
          <Icon icon="mdi:account-group" class="text-lg" />
          Members
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Total Posts</p>
          <Icon
            icon="mdi:note-multiple-outline"
            class="text-blue-500 dark:text-blue-400 text-xl"
          />
        </div>
        <h2
          class="text-3xl font-semibold text-blue-600 dark:text-blue-400 mt-2"
        >
          {{ stats.totalPosts }}
        </h2>
      </div>

      <div
        class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            Pending Comments
          </p>
          <Icon
            icon="mdi:comment-alert-outline"
            class="text-yellow-500 dark:text-yellow-400 text-xl"
          />
        </div>
        <h2
          class="text-3xl font-semibold text-yellow-500 dark:text-yellow-400 mt-2"
        >
          {{ stats.pendingComments }}
        </h2>
      </div>
    </div>

    <!-- Branding Upload (Admin only) -->
    <div v-if="role === 'admin'" class="mb-10">
      <LogoUpload />
    </div>

    <!-- Posts Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-x-auto"
    >
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <!-- Title Row -->
        <div class="flex items-center justify-between mb-4">
          <h2
            class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <Icon
              icon="mdi:post-outline"
              class="text-xl text-gray-500 dark:text-gray-300"
            />
            Posts
          </h2>
        </div>

        <!-- Filters and Actions Row -->
        <div
          class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between w-full"
        >
          <!-- Delete Selected Button -->
          <div class="flex-shrink-0">
            <button
              @click="askConfirmation('Delete selected posts?', bulkDelete)"
              :disabled="selected.length === 0"
              class="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm disabled:opacity-50"
            >
              <Icon icon="mdi:trash-can-outline" />
              Delete Selected ({{ selected.length }})
            </button>
          </div>

          <!-- Filters -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full"
          >
            <div class="w-full sm:col-span-1">
              <SelectRoot v-model="statusFilter" @update:modelValue="applyFilters">
                <SelectTrigger
                  class="w-full inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400"
                  aria-label="Filter by status"
                >
                  <SelectValue placeholder="All Statuses" />
                  <Icon icon="radix-icons:chevron-down" class="w-4 h-4 opacity-70" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent
                    class="z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    :side-offset="5"
                  >
                    <SelectScrollUpButton class="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500">
                      <Icon icon="radix-icons:chevron-up" />
                    </SelectScrollUpButton>
                    <SelectViewport class="p-1">
                      <SelectGroup>
                        <SelectItem value="all" class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white">
                          <SelectItemIndicator class="absolute left-0 w-8 inline-flex items-center justify-center">
                            <Icon icon="radix-icons:check" />
                          </SelectItemIndicator>
                          <SelectItemText>All Statuses</SelectItemText>
                        </SelectItem>
                        <SelectSeparator class="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                        <SelectItem
                          v-for="s in status"
                          :key="s"
                          :value="s"
                          class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                        >
                          <SelectItemIndicator class="absolute left-0 w-8 inline-flex items-center justify-center">
                            <Icon icon="radix-icons:check" />
                          </SelectItemIndicator>
                          <SelectItemText>{{ s }}</SelectItemText>
                        </SelectItem>
                      </SelectGroup>
                    </SelectViewport>
                    <SelectScrollDownButton class="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500">
                      <Icon icon="radix-icons:chevron-down" />
                    </SelectScrollDownButton>
                  </SelectContent>
                </SelectPortal>
              </SelectRoot>
            </div>

            <!-- Category Select -->
            <div class="w-full">
              <SelectRoot v-model="categoryFilter" @update:modelValue="applyFilters">
                <SelectTrigger
                  class="w-full inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400"
                  aria-label="Filter by category"
                >
                  <SelectValue placeholder="All Categories" />
                  <Icon icon="radix-icons:chevron-down" class="w-4 h-4 opacity-70" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent
                    class="z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    :side-offset="5"
                  >
                    <SelectScrollUpButton class="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500">
                      <Icon icon="radix-icons:chevron-up" />
                    </SelectScrollUpButton>
                    <SelectViewport class="p-1">
                      <SelectGroup>
                        <SelectItem value="all" class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white">
                          <SelectItemIndicator class="absolute left-0 w-8 inline-flex items-center justify-center">
                            <Icon icon="radix-icons:check" />
                          </SelectItemIndicator>
                          <SelectItemText>All Categories</SelectItemText>
                        </SelectItem>
                        <SelectSeparator class="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                        <SelectItem
                          v-for="c in categories"
                          :key="c.id"
                          :value="c.id"
                          class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                        >
                          <SelectItemIndicator class="absolute left-0 w-8 inline-flex items-center justify-center">
                            <Icon icon="radix-icons:check" />
                          </SelectItemIndicator>
                          <SelectItemText>{{ c.name }}</SelectItemText>
                        </SelectItem>
                      </SelectGroup>
                    </SelectViewport>
                    <SelectScrollDownButton class="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500">
                      <Icon icon="radix-icons:chevron-down" />
                    </SelectScrollDownButton>
                  </SelectContent>
                </SelectPortal>
              </SelectRoot>
            </div>

            <!-- Author Select -->
            <div class="w-full">
              <SelectRoot v-model="authorFilter" @update:modelValue="applyFilters">
                <SelectTrigger
                  class="w-full inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400"
                  aria-label="Filter by author"
                >
                  <SelectValue placeholder="All Authors" />
                  <Icon icon="radix-icons:chevron-down" class="w-4 h-4 opacity-70" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent
                    class="z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    :side-offset="5"
                  >
                    <SelectScrollUpButton class="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500">
                      <Icon icon="radix-icons:chevron-up" />
                    </SelectScrollUpButton>
                    <SelectViewport class="p-1">
                      <SelectGroup>
                        <SelectItem value="all" class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white">
                          <SelectItemIndicator class="absolute left-0 w-8 inline-flex items-center justify-center">
                            <Icon icon="radix-icons:check" />
                          </SelectItemIndicator>
                          <SelectItemText>All Authors</SelectItemText>
                        </SelectItem>
                        <SelectSeparator class="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                        <SelectItem
                          v-for="a in uniqueAuthors"
                          :key="a.id"
                          :value="a.id"
                          class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                        >
                          <SelectItemIndicator class="absolute left-0 w-8 inline-flex items-center justify-center">
                            <Icon icon="radix-icons:check" />
                          </SelectItemIndicator>
                          <SelectItemText>{{ a.display_name || a.username }}</SelectItemText>
                        </SelectItem>
                      </SelectGroup>
                    </SelectViewport>
                    <SelectScrollDownButton class="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500">
                      <Icon icon="radix-icons:chevron-down" />
                    </SelectScrollDownButton>
                  </SelectContent>
                </SelectPortal>
              </SelectRoot>
            </div>

            <div class="col-span-1 sm:col-span-2 xl:col-span-2">
              <DateRangePickerRoot
                v-model="dateRange"
                locale="en-GB"
                @update:modelValue="onDateRangeChange"
              >
                <DateRangePickerField
                  v-slot="{ segments }"
                  class="flex justify-center items-center select-none bg-white dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 p-1 text-sm w-full"
                >
                  <template
                    v-for="item in segments.start"
                    :key="'s-' + item.part"
                  >
                    <DateRangePickerInput
                      v-if="item.part === 'literal'"
                      :part="item.part"
                      type="start"
                      class="px-0"
                    >
                      {{ item.value }}
                    </DateRangePickerInput>
                    <DateRangePickerInput
                      v-else
                      :part="item.part"
                      type="start"
                      class="rounded px-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400"
                    >
                      {{ item.value }}
                    </DateRangePickerInput>
                  </template>
                  <span class="mx-1">-</span>
                  <template
                    v-for="item in segments.end"
                    :key="'e-' + item.part"
                  >
                    <DateRangePickerInput
                      v-if="item.part === 'literal'"
                      :part="item.part"
                      type="end"
                      class="px-0"
                    >
                      {{ item.value }}
                    </DateRangePickerInput>
                    <DateRangePickerInput
                      v-else
                      :part="item.part"
                      type="end"
                      class="rounded px-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400"
                    >
                      {{ item.value }}
                    </DateRangePickerInput>
                  </template>
                  <DateRangePickerTrigger
                    class="ml-2 inline-flex items-center justify-center p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Icon icon="radix-icons:calendar" class="w-5 h-5" />
                  </DateRangePickerTrigger>
                </DateRangePickerField>
                <DateRangePickerContent
                  :side-offset="4"
                  class="rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 dark:ring-white/10 p-2 z-50"
                >
                  <DateRangePickerArrow class="fill-white dark:fill-gray-800" />
                  <DateRangePickerCalendar
                    v-slot="{ weekDays, grid }"
                    class="p-2"
                  >
                    <DateRangePickerHeader
                      class="flex items-center justify-between px-2 py-1"
                    >
                      <DateRangePickerPrev
                        class="inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Icon icon="radix-icons:chevron-left" class="w-4 h-4" />
                      </DateRangePickerPrev>
                      <DateRangePickerHeading
                        class="text-sm font-medium text-gray-900 dark:text-gray-100"
                      />
                      <DateRangePickerNext
                        class="inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Icon
                          icon="radix-icons:chevron-right"
                          class="w-4 h-4"
                        />
                      </DateRangePickerNext>
                    </DateRangePickerHeader>
                    <div
                      class="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0"
                    >
                      <DateRangePickerGrid
                        v-for="month in grid"
                        :key="month.value.toString()"
                        class="w-full border-collapse select-none space-y-1"
                      >
                        <DateRangePickerGridHead>
                          <DateRangePickerGridRow
                            class="mb-1 flex w-full justify-between"
                          >
                            <DateRangePickerHeadCell
                              v-for="day in weekDays"
                              :key="day"
                              class="w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                            >
                              {{ day }}
                            </DateRangePickerHeadCell>
                          </DateRangePickerGridRow>
                        </DateRangePickerGridHead>
                        <DateRangePickerGridBody>
                          <DateRangePickerGridRow
                            v-for="(weekDates, index) in month.rows"
                            :key="`weekDate-${index}`"
                            class="flex w-full"
                          >
                            <DateRangePickerCell
                              v-for="weekDate in weekDates"
                              :key="weekDate.toString()"
                              :date="weekDate"
                            >
                              <DateRangePickerCellTrigger
                                :day="weekDate"
                                :month="month.value"
                                class="relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                              />
                            </DateRangePickerCell>
                          </DateRangePickerGridRow>
                        </DateRangePickerGridBody>
                      </DateRangePickerGrid>
                    </div>
                  </DateRangePickerCalendar>
                </DateRangePickerContent>
              </DateRangePickerRoot>
            </div>

            <div class="sm:col-span-2 relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search posts..."
                class="w-full px-3 py-2 pl-10 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                @input="onSearchInput"
              />
              <Icon
                icon="mdi:magnify"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 text-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <table class="w-full text-sm text-left">
        <thead
          class="text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-900"
        >
          <tr>
            <th class="px-6 py-3 w-10">
              <input
                type="checkbox"
                @change="toggleAll"
                :checked="allSelected"
                class="accent-blue-600 w-4 h-4"
              />
            </th>
            <th class="px-6 py-3">Title</th>
            <th class="px-6 py-3">Category</th>
            <th class="px-6 py-3">Author</th>
            <th class="px-6 py-3">Created</th>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="post in posts"
            :key="post.id"
            class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <td class="px-6 py-3">
              <input
                type="checkbox"
                :value="post.id"
                v-model="selected"
                class="accent-blue-600 w-4 h-4"
              />
            </td>
            <td class="px-6 py-3 font-medium text-gray-800 dark:text-white">
              <router-link :to="`/posts/${post.slug}`" class="hover:underline">
                {{ post.title }}
              </router-link>
            </td>
            <td class="px-6 py-3 text-gray-600 dark:text-gray-300">
              <router-link
                :to="`/category/${post.category?.name}`"
                class="hover:underline"
              >
                {{ post.category?.name || "Uncategorized" }}
              </router-link>
            </td>

            <td class="px-6 py-3 text-gray-600 dark:text-gray-300">
              <router-link
                :to="`/author/${post.author?.username}`"
                class="hover:underline"
              >
                {{ post.author?.display_name || post.author?.username }}
              </router-link>
            </td>
            <td class="px-6 py-3 text-gray-600 dark:text-gray-300">
              {{ formatDate(post.created_at) }}
            </td>
            <td class="px-6 py-3">
              <span
                class="inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                :class="{
                  'bg-green-100 text-green-700 dark:bg-green-200/20 dark:text-green-400':
                    post.status === 'published',
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-200/20 dark:text-yellow-400':
                    post.status === 'draft',
                  'bg-gray-200 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300':
                    post.status === 'archived',
                }"
              >
                {{ post.status }}
              </span>
            </td>
            <td
              class="px-6 py-3 flex flex-col sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0 space-y-2"
            >
              <template
                v-if="post.author?.username === currentUser || role === 'admin'"
              >
                <button
                  @click="
                    askConfirmation('Delete this post?', () =>
                      deletePost(post.id)
                    )
                  "
                  class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  <Icon icon="mdi:delete-outline" class="text-sm" />
                  Delete
                </button>
                <button
                  @click="editPost(post.id)"
                  class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  <Icon icon="mdi:pencil-outline" class="text-sm" />
                  Edit
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <p
        v-if="posts.length === 0"
        class="text-center py-6 text-gray-500 dark:text-gray-400"
      >
        No posts found.
      </p>
    </div>

    <!-- Pagination Controls -->
    <div
      class="mt-4 flex justify-center items-center gap-4 text-gray-700 dark:text-gray-300"
    >
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <!-- Pending Comments Moderation -->
    <div v-if="(role === 'admin' || role === 'author')" class="mt-12">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
        <Icon icon="mdi:comment-alert-outline" class="text-yellow-500 text-xl" />
        Pending Comments <span class="text-sm font-normal text-gray-500 dark:text-gray-400">({{ stats.pendingComments }})</span>
  <button @click="fetchPendingComments(true)" class="ml-auto inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <Icon icon="mdi:refresh" class="text-sm" /> Refresh
        </button>
      </h2>
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
            <tr>
              <th class="px-4 py-2 text-left">Comment</th>
              <th class="px-4 py-2 text-left">User</th>
              <th class="px-4 py-2 text-left">Post</th>
              <th class="px-4 py-2 text-left">Date</th>
              <th class="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadingPending">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Loading pending comments...</td>
            </tr>
            <tr v-else-if="pendingComments.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No pending comments.</td>
            </tr>
            <tr v-for="c in pendingComments" :key="c.id" class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-4 py-2 align-top max-w-xs">
                <div class="text-gray-800 dark:text-gray-100 whitespace-pre-line break-words">{{ c.content }}</div>
              </td>
              <td class="px-4 py-2 align-top">
                <div class="text-gray-700 dark:text-gray-200">{{ c.author?.display_name || c.author?.username || 'Unknown' }}</div>
              </td>
              <td class="px-4 py-2 align-top">
                <router-link :to="`/posts/${c.post?.slug}`" class="text-blue-600 dark:text-blue-400 hover:underline">{{ c.post?.title || 'Post' }}</router-link>
              </td>
              <td class="px-4 py-2 align-top text-gray-500 dark:text-gray-400">{{ formatDate(c.created_at) }}</td>
              <td class="px-4 py-2 align-top">
                <div class="flex justify-end gap-2">
                  <button @click="approvePendingComment(c.id)" class="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs">
                    <Icon icon="mdi:check" class="text-sm" /> Approve
                  </button>
                  <button @click="askConfirmation('Delete this comment?', () => deletePendingComment(c.id))" class="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs">
                    <Icon icon="mdi:delete" class="text-sm" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="pendingTotalPages > 1" class="flex items-center justify-center gap-3 py-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
          <button
            class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
            :disabled="pendingPage === 1 || loadingPending"
            @click="changePendingPage(pendingPage - 1)"
          >Prev</button>
          <span>Page {{ pendingPage }} / {{ pendingTotalPages }}</span>
          <button
            class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
            :disabled="pendingPage === pendingTotalPages || loadingPending"
            @click="changePendingPage(pendingPage + 1)"
          >Next</button>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      v-if="showConfirm"
      :open="showConfirm"
      :title="'Confirm Action'"
      :description="confirmMessage"
      body="Are you sure you want to proceed?"
      @confirm="confirmAction"
      @cancel="closeDialog"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "@/services/supabase";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import {
  DateRangePickerRoot,
  DateRangePickerField,
  DateRangePickerInput,
  DateRangePickerTrigger,
  DateRangePickerContent,
  DateRangePickerArrow,
  DateRangePickerCalendar,
  DateRangePickerHeader,
  DateRangePickerPrev,
  DateRangePickerHeading,
  DateRangePickerNext,
  DateRangePickerGrid,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerGridBody,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "radix-vue";
import { useToast } from "vue-toastification";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import CategoriesManagement from "@/components/CategoriesManagement.vue";
import LogoUpload from "@/components/LogoUpload.vue";

const showConfirm = ref(false);
const confirmMessage = ref("");

const statusFilter = ref("all");
const authorFilter = ref("all");
const categoryFilter = ref("all");
const startDate = ref("");
const endDate = ref("");
const dateRange = ref({ start: undefined, end: undefined });
const uniqueAuthors = ref([]);
const categories = ref([]);
const status = ref(["published", "draft", "archived"]);

let confirmAction = () => {};

function askConfirmation(message, action) {
  confirmMessage.value = message;
  confirmAction = async () => {
    await action();
    showConfirm.value = false;
  };
  showConfirm.value = true;
}

function closeDialog() {
  showConfirm.value = false;
}

const router = useRouter();
const stats = ref({ totalPosts: 0, pendingComments: 0 });
const posts = ref([]);
const selected = ref([]);
const currentUser = ref(null);
const role = ref("reader");

const allSelected = computed(
  () => selected.value.length === posts.value.length && posts.value.length > 0
);

const toggleAll = () => {
  selected.value = allSelected.value ? [] : posts.value.map((post) => post.id);
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const currentPage = ref(1);
const pageSize = 10;
const totalPostsCount = ref(0);
const totalPages = computed(() => Math.ceil(totalPostsCount.value / pageSize));
const searchQuery = ref("");

const toast = useToast();

let searchTimeout = null;
function onSearchInput() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchDashboard();
  }, 400);
}

const fetchDashboard = async () => {
  let query = supabase
    .from("posts")
    .select(
      `
      id,
      title,
      created_at,
      status,
      slug,
      category:categories (
        id,
        name
      ),
      author:profiles (
        id,
        display_name,
        username
      )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(
      (currentPage.value - 1) * pageSize,
      currentPage.value * pageSize - 1
    );

  if (searchQuery.value.trim() !== "") {
    query = query.ilike("title", `%${searchQuery.value}%`);
  }

  if (categoryFilter.value && categoryFilter.value !== "all") {
    query = query.eq("category_id", categoryFilter.value);
  }

  if (statusFilter.value && statusFilter.value !== "all") {
    query = query.eq("status", statusFilter.value);
  }

  if (authorFilter.value && authorFilter.value !== "all") {
    query = query.eq("author_id", authorFilter.value);
  }

  if (startDate.value) {
    const from = new Date(startDate.value);
    query = query.gte("created_at", from.toISOString());
  }
  if (endDate.value) {
    const to = new Date(endDate.value);
    to.setDate(to.getDate() + 1);
    query = query.lt("created_at", to.toISOString());
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching posts:", error);
    posts.value = [];
    totalPostsCount.value = 0;
  } else {
    posts.value = data || [];
    totalPostsCount.value = count || 0;
  }

  const { count: total } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });
  stats.value.totalPosts = total || 0;

  const { count: pending } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("approved", false);
  stats.value.pendingComments = pending || 0;

  selected.value = [];
};

function applyFilters() {
  currentPage.value = 1;
  fetchDashboard();
}

function toYMD(val) {
  if (!val) return "";
  if (val instanceof Date) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, "0");
    const d = String(val.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  if (
    typeof val === "object" &&
    "year" in val &&
    "month" in val &&
    "day" in val
  ) {
    const y = val.year;
    const m = String(val.month).padStart(2, "0");
    const d = String(val.day).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return "";
}

function onDateRangeChange(range) {
  startDate.value = toYMD(range?.start);
  endDate.value = toYMD(range?.end);
  applyFilters();
}

async function fetchCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("username, display_name, role")
      .eq("id", user.id)
      .single();
    if (!error && profile) {
      currentUser.value = profile.username;
      role.value = profile.role || "reader";
    }
  }
}

const deletePost = async (id) => {
  await supabase.from("posts").delete().eq("id", id);
  selected.value = selected.value.filter((pid) => pid !== id);

  toast.success("Post deleted successfully");
  await fetchDashboard();
};

const bulkDelete = async () => {
  if (selected.value.length === 0) return;
  await supabase.from("posts").delete().in("id", selected.value);
  selected.value = [];

  toast.success("Selected posts deleted successfully");
  await fetchDashboard();
};

const editPost = (id) => {
  router.push(`/dashboard/edit/${id}`);
};

function changePage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchDashboard();
}

async function fetchAuthors() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name");

  if (!error && data) {
    uniqueAuthors.value = data;
  }
}

async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("id, name");

  if (!error && data) {
    categories.value = data;
  }
}

const pendingComments = ref([]);
const loadingPending = ref(false);
const pendingPage = ref(1);
const pendingPageSize = 10;
const pendingTotal = ref(0);
const pendingTotalPages = computed(() => Math.max(1, Math.ceil(pendingTotal.value / pendingPageSize)));

async function updatePendingCount() {
  if (role.value === 'admin') {
    const { count } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('approved', false);
    stats.value.pendingComments = count || 0;
  } else if (role.value === 'author' && currentUser.value) {
    const { data: postIds } = await supabase
      .from('posts')
      .select('id')
      .eq('author_id', (await supabase.auth.getUser()).data.user.id);
    const ids = (postIds || []).map(p => p.id);
    if (ids.length === 0) {
      stats.value.pendingComments = 0;
      return;
    }
    const { count } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .in('post_id', ids)
      .eq('approved', false);
    stats.value.pendingComments = count || 0;
  }
}

async function fetchPendingComments(clear = false) {
  if (!(role.value === 'admin' || role.value === 'author')) return;
  loadingPending.value = true;
  if (clear) {
    pendingComments.value = [];
  }
  try {
    const from = (pendingPage.value - 1) * pendingPageSize;
    const to = from + pendingPageSize - 1;
    let query = supabase
      .from('comments')
      .select(`id, content, created_at, post:posts(id, title, slug, author_id), author:profiles(id, username, display_name)`, { count: 'exact' })
      .eq('approved', false)
      .order('created_at', { ascending: false })
      .range(from, to);
    if (role.value === 'author') {
      const { data: postIds } = await supabase
        .from('posts')
        .select('id')
        .eq('author_id', (await supabase.auth.getUser()).data.user.id);
      const ids = (postIds || []).map(p => p.id);
      if (ids.length === 0) {
        pendingComments.value = [];
        pendingTotal.value = 0;
        await updatePendingCount();
        loadingPending.value = false;
        return;
      }
      query = query.in('post_id', ids);
    }
    const { data, error, count } = await query;
    if (error) {
      console.error('Fetch pending comments failed', error);
      pendingComments.value = [];
      pendingTotal.value = 0;
    } else {
      pendingComments.value = (data || []).map(c => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        post: c.post,
        author: c.author,
      }));
      if (typeof count === 'number') pendingTotal.value = count;
      const lastPage = Math.max(1, Math.ceil(pendingTotal.value / pendingPageSize));
      if (pendingPage.value > lastPage) {
        pendingPage.value = lastPage;
        return fetchPendingComments();
      }
    }
    await updatePendingCount();
  } finally {
    loadingPending.value = false;
  }
}

function changePendingPage(page) {
  if (page < 1 || page > pendingTotalPages.value || page === pendingPage.value) return;
  pendingPage.value = page;
  fetchPendingComments();
}

async function approvePendingComment(id) {
  const { error } = await supabase.from('comments').update({ approved: true }).eq('id', id);
  if (error) return console.error(error);
  await fetchPendingComments();
}

async function deletePendingComment(id) {
  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) return console.error(error);
  await fetchPendingComments();
}

onMounted(async () => {
  await fetchCurrentUser();
  await fetchDashboard();
  fetchAuthors();
  fetchCategories();
  await fetchPendingComments();
});
</script>

<style scoped>
.button {
  color: white;
  transition: background-color 0.2s ease;
}
</style>
