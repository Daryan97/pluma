<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[60vh]">
      <Icon icon="mdi:loading" class="animate-spin text-4xl text-blue-500 mb-4" />
    </div>
    <template v-else>
  <header class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div class="flex items-center gap-2">
        <Icon
          icon="mdi:monitor-dashboard"
          class="text-blue-600 dark:text-blue-400 text-3xl"
        />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <router-link
          to="/dashboard/new-post"
          class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Icon icon="mdi:plus" class="text-base" />
          <span>New Post</span>
        </router-link>
        <CategoriesManagement />
      </div>
    </header>

    <TabsRoot
      class="flex flex-col w-full"
      v-model="activeTab"
      default-value="overview"
    >
      <TabsList
        class="relative shrink-0 flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto"
        aria-label="Dashboard sections"
      >
        <TabsIndicator
          class="absolute px-8 left-0 h-[2px] bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300"
        >
          <div class="bg-blue-500 w-full h-full" />
        </TabsIndicator>
        <TabsTrigger
          value="overview"
          class="px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
        >
          <Icon icon="mdi:view-dashboard" class="text-blue-500 dark:text-blue-400 text-lg" />
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="posts"
          class="px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
        >
          <Icon icon="mdi:post-outline" class="text-green-500 dark:text-green-400 text-lg" />
          Posts
        </TabsTrigger>
        <TabsTrigger
          v-if="role === 'admin' || role === 'author'"
          value="comments"
          class="px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
        >
          <Icon icon="mdi:comment-multiple-outline" class="text-yellow-500 dark:text-yellow-400 text-lg" />
          <span>Comments</span>
          <span
            v-if="stats.pendingComments > 0"
            class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-2 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200"
          >
            {{ stats.pendingComments }}
          </span>
        </TabsTrigger>
        <TabsTrigger
          v-if="role === 'admin'"
          value="members"
          class="px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
        >
          <Icon icon="mdi:account-group-outline" class="text-purple-500 dark:text-purple-400 text-lg" />
          Members
        </TabsTrigger>
        <TabsTrigger
          v-if="role === 'admin'"
          value="media"
          class="px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
        >
          <Icon icon="mdi:image-multiple-outline" class="text-pink-500 dark:text-pink-400 text-lg" />
          Media
        </TabsTrigger>
        <TabsTrigger
          v-if="role === 'admin'"
          value="settings"
          class="px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
        >
          <Icon icon="mdi:cog-outline" class="text-gray-500 dark:text-gray-300 text-lg" />
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" class="space-y-8">
        <StatsOverview :stats="stats" />
      </TabsContent>

      <TabsContent value="posts" class="space-y-6">
        <div class="flex justify-end">
          <div class="w-full sm:w-80 mb-4">
            <div
              class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition"
            >
              <Icon
                icon="mdi:magnify"
                class="ml-3 text-gray-500 dark:text-gray-300 text-base"
              />
              <input
                v-model="searchQuery"
                @input="onSearchInput"
                type="text"
                placeholder="Search posts..."
                class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                aria-label="Search posts"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                type="button"
                class="mr-1 inline-flex items-center justify-center w-7 h-7 rounded text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Clear search"
              >
                <Icon icon="mdi:close-circle" class="text-lg" />
              </button>
            </div>
          </div>
        </div>
        <PostsTable
          :posts="posts"
          v-model:selected="selected"
          :current-user="currentUser"
          :role="role"
          @toggleAll="toggleAll"
          @delete="
            (id) => askConfirmation('Delete this post?', () => deletePost(id))
          "
          @edit="editPost"
        >
          <template #filters>
            <PostFilters
              :selected-length="selected.length"
              @bulkDelete="
                askConfirmation('Delete selected posts?', bulkDelete)
              "
            >
              <template #status>
                <SelectRoot
                  v-model="statusFilter"
                  @update:modelValue="applyFilters"
                >
                  <SelectTrigger
                    class="w-full inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400"
                    aria-label="Filter by status"
                  >
                    <SelectValue placeholder="All Statuses" />
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
                        ><Icon icon="radix-icons:chevron-up"
                      /></SelectScrollUpButton>
                      <SelectViewport class="p-1">
                        <SelectGroup>
                          <SelectItem
                            value="all"
                            class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                            ><SelectItemIndicator
                              class="absolute left-0 w-8 inline-flex items-center justify-center"
                              ><Icon
                                icon="radix-icons:check" /></SelectItemIndicator
                            ><SelectItemText
                              >All Statuses</SelectItemText
                            ></SelectItem
                          >
                          <SelectSeparator
                            class="h-px bg-gray-200 dark:bg-gray-700 my-1"
                          />
                          <SelectItem
                            v-for="s in status"
                            :key="s"
                            :value="s"
                            class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                            ><SelectItemIndicator
                              class="absolute left-0 w-8 inline-flex items-center justify-center"
                              ><Icon
                                icon="radix-icons:check" /></SelectItemIndicator
                            ><SelectItemText>{{
                              s
                            }}</SelectItemText></SelectItem
                          >
                        </SelectGroup>
                      </SelectViewport>
                      <SelectScrollDownButton
                        class="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500"
                        ><Icon icon="radix-icons:chevron-down"
                      /></SelectScrollDownButton>
                    </SelectContent>
                  </SelectPortal>
                </SelectRoot>
              </template>
              <template #category>
                <SelectRoot
                  v-model="categoryFilter"
                  @update:modelValue="applyFilters"
                >
                  <SelectTrigger
                    class="w-full inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400"
                    aria-label="Filter by category"
                  >
                    <SelectValue placeholder="All Categories" />
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
                        ><Icon icon="radix-icons:chevron-up"
                      /></SelectScrollUpButton>
                      <SelectViewport class="p-1">
                        <SelectGroup>
                          <SelectItem
                            value="all"
                            class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                            ><SelectItemIndicator
                              class="absolute left-0 w-8 inline-flex items-center justify-center"
                              ><Icon
                                icon="radix-icons:check" /></SelectItemIndicator
                            ><SelectItemText
                              >All Categories</SelectItemText
                            ></SelectItem
                          >
                          <SelectSeparator
                            class="h-px bg-gray-200 dark:bg-gray-700 my-1"
                          />
                          <SelectItem
                            v-for="c in categories"
                            :key="c.id"
                            :value="c.id"
                            class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                            ><SelectItemIndicator
                              class="absolute left-0 w-8 inline-flex items-center justify-center"
                              ><Icon
                                icon="radix-icons:check" /></SelectItemIndicator
                            ><SelectItemText>{{
                              c.name
                            }}</SelectItemText></SelectItem
                          >
                        </SelectGroup>
                      </SelectViewport>
                      <SelectScrollDownButton
                        class="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500"
                        ><Icon icon="radix-icons:chevron-down"
                      /></SelectScrollDownButton>
                    </SelectContent>
                  </SelectPortal>
                </SelectRoot>
              </template>
              <template #author>
                <SelectRoot
                  v-model="authorFilter"
                  @update:modelValue="applyFilters"
                >
                  <SelectTrigger
                    class="w-full inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400"
                    aria-label="Filter by author"
                  >
                    <SelectValue placeholder="All Authors" />
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
                        ><Icon icon="radix-icons:chevron-up"
                      /></SelectScrollUpButton>
                      <SelectViewport class="p-1">
                        <SelectGroup>
                          <SelectItem
                            value="all"
                            class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                            ><SelectItemIndicator
                              class="absolute left-0 w-8 inline-flex items-center justify-center"
                              ><Icon
                                icon="radix-icons:check" /></SelectItemIndicator
                            ><SelectItemText
                              >All Authors</SelectItemText
                            ></SelectItem
                          >
                          <SelectSeparator
                            class="h-px bg-gray-200 dark:bg-gray-700 my-1"
                          />
                          <SelectItem
                            v-for="a in uniqueAuthors"
                            :key="a.id"
                            :value="a.id"
                            class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                            ><SelectItemIndicator
                              class="absolute left-0 w-8 inline-flex items-center justify-center"
                              ><Icon
                                icon="radix-icons:check" /></SelectItemIndicator
                            ><SelectItemText>{{
                              a.display_name || a.username
                            }}</SelectItemText></SelectItem
                          >
                        </SelectGroup>
                      </SelectViewport>
                      <SelectScrollDownButton
                        class="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500"
                        ><Icon icon="radix-icons:chevron-down"
                      /></SelectScrollDownButton>
                    </SelectContent>
                  </SelectPortal>
                </SelectRoot>
              </template>
              <template #date>
                <DateRangePickerRoot
                  :key="dateRangePickerKey"
                  v-model="dateRange"
                  locale="en-GB"
                  @update:modelValue="onDateRangeChange"
                >
                  <DateRangePickerField
                    v-slot="{ segments }"
                    class="h-9 items-center max-w-fit select-none bg-white dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 px-3 text-sm gap-1 flex focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none"
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
                        >{{ item.value }}</DateRangePickerInput
                      >
                      <DateRangePickerInput
                        v-else
                        :part="item.part"
                        type="start"
                        class="rounded px-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400"
                        >{{ item.value }}</DateRangePickerInput
                      >
                    </template>
                    <span class="mx-1 opacity-70">-</span>
                    <template
                      v-for="item in segments.end"
                      :key="'e-' + item.part"
                    >
                      <DateRangePickerInput
                        v-if="item.part === 'literal'"
                        :part="item.part"
                        type="end"
                        class="px-0"
                        >{{ item.value }}</DateRangePickerInput
                      >
                      <DateRangePickerInput
                        v-else
                        :part="item.part"
                        type="end"
                        class="rounded px-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400"
                        >{{ item.value }}</DateRangePickerInput
                      >
                    </template>
                    <DateRangePickerTrigger
                      class="ml-2 inline-flex items-center justify-center p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Icon icon="radix-icons:calendar" class="w-5 h-5" />
                    </DateRangePickerTrigger>
                    <button
                      type="button"
                      @click="clearDateRange"
                      :disabled="!startDate && !endDate"
                      aria-label="Clear date range"
                      class="inline-flex items-center gap-1 h-8 px-2 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-[11px] font-medium hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-400/50 disabled:opacity-50 ml-1"
                    >
                      <Icon icon="mdi:close" class="w-4 h-4" />
                      <span class="hidden sm:inline">Clear</span>
                    </button>
                  </DateRangePickerField>
                  <DateRangePickerContent
                    :side-offset="4"
                    class="rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 dark:ring-white/10 p-2 z-50"
                  >
                    <DateRangePickerArrow
                      class="fill-white dark:fill-gray-800"
                    />
                    <DateRangePickerCalendar
                      v-slot="{ weekDays, grid }"
                      class="p-2"
                    >
                      <DateRangePickerHeader
                        class="flex items-center justify-between px-2 py-1"
                      >
                        <DateRangePickerPrev
                          class="inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          ><Icon
                            icon="radix-icons:chevron-left"
                            class="w-4 h-4"
                        /></DateRangePickerPrev>
                        <DateRangePickerHeading
                          class="text-sm font-medium text-gray-900 dark:text-gray-100"
                        />
                        <DateRangePickerNext
                          class="inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          ><Icon
                            icon="radix-icons:chevron-right"
                            class="w-4 h-4"
                        /></DateRangePickerNext>
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
                              :key="'weekDate-' + index"
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
              </template>
            </PostFilters>
          </template>
        </PostsTable>
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
      </TabsContent>

      <TabsContent
        value="comments"
        v-if="role === 'admin' || role === 'author'"
        class=""
      >
        <PendingComments
          :comments="pendingComments"
          :page="pendingPage"
          :total-pages="pendingTotalPages"
          :loading="loadingPending"
          :pending-count="stats.pendingComments"
          :total-count="commentsTotalCount"
          :filter="commentsFilter"
          v-model:search="pendingSearchQuery"
          @search="onPendingSearch"
          @refresh="fetchPendingComments(true)"
          @change-page="changePendingPage"
          @change-filter="setCommentsFilter"
          @approve="approvePendingComment"
          @unapprove="unapproveComment"
          @delete="(id) => askConfirmation('Delete this comment?', () => deletePendingComment(id))"
        />
      </TabsContent>

      <TabsContent value="media" v-if="role === 'admin'" class="space-y-6">
        <MediaManager v-if="mediaLoaded" />
      </TabsContent>

      <TabsContent value="settings" v-if="role === 'admin'" class="space-y-10">
        <template v-if="brandingLoaded">
          <div class="grid gap-10 lg:grid-cols-2 items-start">
            <BrandingMetaForm />
            <LogoUpload class="self-stretch" />
            <StatsSettingsForm class="self-stretch lg:col-span-2" />
            <ProviderSettingsForm class="self-stretch lg:col-span-2" />
          </div>
        </template>
        <template v-else>
          <div class="text-sm text-gray-500 dark:text-gray-400 py-10 text-center">
            Loading settings...
          </div>
        </template>
      </TabsContent>

      <TabsContent value="members" v-if="role === 'admin'" class="space-y-6">
        <MembersManagement v-if="membersLoaded" />
        <div
          v-else
          class="text-sm text-gray-500 dark:text-gray-400 py-10 text-center"
        >
          Loading members...
        </div>
      </TabsContent>
    </TabsRoot>

    <ConfirmDialog
      v-if="showConfirm"
      :open="showConfirm"
      :title="'Confirm Action'"
      :description="confirmMessage"
      body="Are you sure you want to proceed?"
      @confirm="confirmAction"
      @cancel="closeDialog"
    />
    </template>
  </div>
</template>

<script setup>
const loading = ref(true);
import { ref, onMounted, computed, watch } from "vue";
import { supabase } from "@/services/supabase";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
} from "radix-vue";
import StatsOverview from "@/components/dashboard/StatsOverview.vue";
import PostsTable from "@/components/dashboard/PostsTable.vue";
import PostFilters from "@/components/dashboard/PostFilters.vue";
import PendingComments from "@/components/dashboard/CommentsTable.vue";
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
import CategoriesManagement from "@/components/dashboard/CategoriesManagement.vue";
import LogoUpload from "@/components/dashboard/LogoUpload.vue";
import BrandingMetaForm from "@/components/dashboard/BrandingMetaForm.vue";
import MembersManagement from "@/components/dashboard/MembersManagement.vue";
import MediaManager from "@/components/dashboard/MediaManager.vue";
import {
  useBranding,
  updateBranding,
  fetchBranding,
} from "@/stores/brandingStore";
import StatsSettingsForm from '@/components/dashboard/StatsSettingsForm.vue';
import ProviderSettingsForm from '@/components/dashboard/ProviderSettingsForm.vue';

const showConfirm = ref(false);
const confirmMessage = ref("");

const statusFilter = ref("all");
const authorFilter = ref("all");
const categoryFilter = ref("all");
const startDate = ref("");
const endDate = ref("");
const dateRange = ref({ start: undefined, end: undefined });
const dateRangePickerKey = ref(0);
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
const stats = ref({
  totalPosts: 0,
  publishedPosts: 0,
  draftPosts: 0,
  pendingComments: 0,
  categories: 0,
  authors: 0,
  members: 0,
});
const activeTab = ref("overview");
const TAB_STORAGE_KEY = "pluma.dashboard.activeTab";
const postsLoaded = ref(false);
const pendingLoaded = ref(false);
const brandingLoaded = ref(false);
const membersLoaded = ref(false);
const mediaLoaded = ref(false);
const brandingStore = useBranding();
const posts = ref([]);
const selected = ref([]);
const currentUser = ref(null);
const role = ref("reader");
const currentUserId = ref(null);

const allSelected = computed(
  () => selected.value.length === posts.value.length && posts.value.length > 0
);

const toggleAll = () => {
  selected.value = allSelected.value ? [] : posts.value.map((post) => post.id);
};

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

function clearSearch() {
  searchQuery.value = "";
  clearTimeout(searchTimeout);
  currentPage.value = 1;
  fetchDashboard();
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
        name,
        slug
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

function clearDateRange() {
  dateRange.value = { start: undefined, end: undefined };
  startDate.value = "";
  endDate.value = "";
  dateRangePickerKey.value++;
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
      currentUserId.value = user.id;
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
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug");
  if (!error && data) {
    categories.value = data;
  }
}

const pendingComments = ref([]);
const loadingPending = ref(false);
const pendingPage = ref(1);
const pendingPageSize = 10;
const pendingTotal = ref(0);
const commentsTotalCount = ref(0);
const pendingTotalPages = computed(() => Math.max(1, Math.ceil(pendingTotal.value / pendingPageSize)));
const pendingSearchQuery = ref("");
const commentsFilter = ref('all');
let pendingSearchTimeout = null;

function setCommentsFilter(f){
  if(['all','approved','pending'].includes(f)){
    commentsFilter.value = f;
    pendingPage.value = 1;
    fetchPendingComments(true);
  }
}

function onPendingSearch(){
  if(pendingSearchTimeout) clearTimeout(pendingSearchTimeout);
  pendingSearchTimeout = setTimeout(()=>{
    pendingPage.value = 1;
    fetchPendingComments(true);
  }, 300);
}

async function updatePendingCount() {
  if (role.value === 'admin' || role.value === 'author') {
    const { count: pending } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('approved', false);
    stats.value.pendingComments = pending || 0;
  }
}

async function fetchPendingComments(clear = false) {
  if (!(role.value === 'admin' || role.value === 'author')) return;
  loadingPending.value = true;
  if (clear) pendingComments.value = [];
  try {
    const from = (pendingPage.value - 1) * pendingPageSize;
    const to = from + pendingPageSize - 1;
    let base = supabase
      .from('comments')
      .select(`id, content, created_at, approved, post:posts(id, title, slug, author_id), author:profiles(id, username, display_name)`, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (commentsFilter.value === 'approved') {
      base = base.eq('approved', true);
    } else if (commentsFilter.value === 'pending') {
      base = base.eq('approved', false);
    }

    const { data, error, count } = await base.range(from, to);
    if (error) {
      console.error('Fetch comments failed', error);
      pendingComments.value = [];
      pendingTotal.value = 0;
    } else {
      let list = (data || []).map(c => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        approved: c.approved,
        post: c.post,
        author: c.author
      }));
      if (pendingSearchQuery.value.trim() !== '') {
        const q = pendingSearchQuery.value.toLowerCase();
        list = list.filter(c =>
          (c.content || '').toLowerCase().includes(q) ||
          (c.author?.display_name || c.author?.username || '').toLowerCase().includes(q) ||
          (c.post?.title || '').toLowerCase().includes(q)
        );
      }
      pendingComments.value = list;
      if (typeof count === 'number') pendingTotal.value = count;
      const lastPage = Math.max(1, Math.ceil(pendingTotal.value / pendingPageSize));
      if (pendingPage.value > lastPage) {
        pendingPage.value = lastPage;
        return fetchPendingComments();
      }
    }

    await updatePendingCount();
    const { count: allCount } = await supabase.from('comments').select('id', { count: 'exact', head: true });
    commentsTotalCount.value = allCount || 0;
  } finally {
    loadingPending.value = false;
  }
}

function changePendingPage(page) {
  if (page < 1 || page > pendingTotalPages.value || page === pendingPage.value)
    return;
  pendingPage.value = page;
  fetchPendingComments();
}

async function approvePendingComment(id) {
  const { error } = await supabase.from('comments').update({ approved: true }).eq('id', id);
  if (error) return console.error(error);
  await fetchPendingComments();
}

async function unapproveComment(id){
  const { error } = await supabase.from('comments').update({ approved: false }).eq('id', id);
  if (error) return console.error(error);
  await fetchPendingComments();
}

async function deletePendingComment(id) {
  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) return console.error(error);
  await fetchPendingComments();
}

async function fetchStats() {
  const { count: total } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });
  stats.value.totalPosts = total || 0;

  const { count: published } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");
  stats.value.publishedPosts = published || 0;

  const { count: drafts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");
  stats.value.draftPosts = drafts || 0;

  if (role.value === "admin" || role.value === "author") {
    const { count: pending } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("approved", false);
    stats.value.pendingComments = pending || 0;
  } else {
    stats.value.pendingComments = 0;
  }

  const { count: catCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });
  stats.value.categories = catCount || 0;

  const { count: authorCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .in("role", ["author", "admin"]);
  stats.value.authors = authorCount || 0;

  const { count: memberCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });
  stats.value.members = memberCount || 0;
}

watch(activeTab, async (val) => {
  try {
    localStorage.setItem(TAB_STORAGE_KEY, val);
  } catch (e) {}
  if (val === "posts" && !postsLoaded.value) {
    await Promise.all([fetchAuthors(), fetchCategories(), fetchDashboard()]);
    postsLoaded.value = true;
  } else if (
    val === "comments" &&
    !pendingLoaded.value &&
    (role.value === "admin" || role.value === "author")
  ) {
    await fetchPendingComments(true);
    pendingLoaded.value = true;
  } else if (
    val === "settings" &&
    !brandingLoaded.value &&
    role.value === "admin"
  ) {
    brandingLoaded.value = true;
    if (!brandingStore.brandingLoaded.value) await fetchBranding(true);
  } else if (
    val === "members" &&
    !membersLoaded.value &&
    role.value === "admin"
  ) {
    membersLoaded.value = true;
  } else if (val === "media" && !mediaLoaded.value && role.value === "admin") {
    mediaLoaded.value = true;
  }
});

function isTabAllowed(tab) {
  if (["members", "media", "settings"].includes(tab))
    return role.value === "admin";
  if (tab === "comments")
    return role.value === "admin" || role.value === "author";
  return ["overview", "posts"].includes(tab);
}

function restoreActiveTab() {
  try {
    const stored = localStorage.getItem(TAB_STORAGE_KEY);
    if (stored && isTabAllowed(stored)) {
      activeTab.value = stored;
    }
  } catch (e) {}
}

onMounted(async () => {
  loading.value = true;
  await fetchCurrentUser();
  restoreActiveTab();
  await fetchStats();
  loading.value = false;
});
</script>

<style scoped>
.button {
  color: white;
  transition: background-color 0.2s ease;
}
</style>
