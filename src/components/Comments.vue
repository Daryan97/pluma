<template>
  <div v-if="postId" v-bind="$attrs" :class="['mt-12', $attrs.class]">
    <h3
      class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100"
    >
      <Icon icon="mdi:comment-text-outline" class="text-blue-500" />
      {{ t("comments.title") }}
      <span
        class="text-sm font-normal text-gray-500 dark:text-gray-400 flex items-center gap-1"
      >
        {{ t("comments.total", { count: totalCount }) }}
        <span
          v-if="canModerate && pendingCount > 0"
          class="text-xs ms-1 px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100"
          >{{ t("comments.pendingCount", { count: pendingCount }) }}</span
        >
      </span>
    </h3>

    <div class="flex flex-wrap items-center gap-4 mb-4 text-sm">
      <div v-if="canModerate" class="flex flex-col gap-1">
        <span
          class="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400"
          >{{ t("comments.filter") }}</span
        >
        <SelectRoot v-model="modFilter">
          <SelectTrigger
            class="min-w-[11rem] w-auto inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 data-[placeholder]:text-gray-400"
            :aria-label="t('comments.filterAria')"
          >
            <SelectValue :placeholder="t('comments.all')" />
            <Icon icon="radix-icons:chevron-down" class="w-4 h-4 opacity-70" />
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
                    value="all"
                    class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                  >
                    <SelectItemIndicator
                      class="absolute start-0 w-8 inline-flex items-center justify-center"
                    >
                      <Icon icon="radix-icons:check" />
                    </SelectItemIndicator>
                    <SelectItemText>{{ t("comments.all") }}</SelectItemText>
                  </SelectItem>
                  <SelectSeparator
                    class="h-px bg-gray-200 dark:bg-gray-700 my-1"
                  />
                  <SelectItem
                    value="approved"
                    class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                  >
                    <SelectItemIndicator
                      class="absolute start-0 w-8 inline-flex items-center justify-center"
                    >
                      <Icon icon="radix-icons:check" />
                    </SelectItemIndicator>
                    <SelectItemText>{{ t("comments.approved") }}</SelectItemText>
                  </SelectItem>
                  <SelectItem
                    value="pending"
                    class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                  >
                    <SelectItemIndicator
                      class="absolute start-0 w-8 inline-flex items-center justify-center"
                    >
                      <Icon icon="radix-icons:check" />
                    </SelectItemIndicator>
                    <SelectItemText>{{ t("comments.pendingLabel") }}</SelectItemText>
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
      </div>

      <div class="flex flex-col gap-1">
        <span
          class="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400"
          >{{ t("comments.sort") }}</span
        >
        <SelectRoot v-model="sortOrder">
          <SelectTrigger
            class="min-w-[14rem] w-auto inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 data-[placeholder]:text-gray-400"
            :aria-label="t('comments.sortAria')"
          >
            <SelectValue :placeholder="t('comments.sort')" />
            <Icon icon="radix-icons:chevron-down" class="w-4 h-4 opacity-70" />
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
                    value="newest"
                    class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                  >
                    <SelectItemIndicator
                      class="absolute start-0 w-8 inline-flex items-center justify-center"
                    >
                      <Icon icon="radix-icons:check" />
                    </SelectItemIndicator>
                    <SelectItemText>{{ t("comments.newestFirst") }}</SelectItemText>
                  </SelectItem>
                  <SelectSeparator
                    class="h-px bg-gray-200 dark:bg-gray-700 my-1"
                  />
                  <SelectItem
                    value="oldest"
                    class="text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                  >
                    <SelectItemIndicator
                      class="absolute start-0 w-8 inline-flex items-center justify-center"
                    >
                      <Icon icon="radix-icons:check" />
                    </SelectItemIndicator>
                    <SelectItemText>{{ t("comments.oldestFirst") }}</SelectItemText>
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
      </div>
    </div>

    <div v-if="sessionUser" class="mb-8">
      <form @submit.prevent="submitComment" class="space-y-3">
        <div class="relative group">
          <textarea
            ref="commentTextarea"
            v-model="newComment"
            rows="3"
            :placeholder="t('comments.placeholder')"
            class="peer w-full rounded-lg px-4 py-3 bg-white/90 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400/60 focus:border-gray-400 dark:focus:border-gray-500 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden leading-relaxed min-h-[96px] resize-none"
            :disabled="submitting"
            @keydown="onTextareaKeydown"
            @input="autoResize"
            :maxlength="MAX_COMMENT_LENGTH"
            required
          ></textarea>
          <div
            class="pointer-events-none absolute start-3 -top-2 z-10 px-1 rounded bg-white dark:bg-gray-800 text-[10px] font-medium text-gray-500 dark:text-gray-400 shadow-sm"
          >
            {{ t('comments.commentLabel') }}
          </div>
          <div
            class="mt-1 flex justify-between text-[11px] text-gray-400 dark:text-gray-500 select-none"
          >
            <span
              :class="{
                'text-red-500 dark:text-red-400':
                  newComment.length >= MAX_COMMENT_LENGTH,
              }"
              >{{ newComment.length }} / {{ MAX_COMMENT_LENGTH }}</span
            >
            <button
              v-if="newComment.length > 0"
              type="button"
              @click="clearComment"
              class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {{ t('common.clear') }}
            </button>
          </div>
        </div>
        <div
          class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
        >
          <span v-if="role === 'admin'">{{ t('comments.autoApprovedTip') }}</span>
          <span v-else>{{ t('comments.needsApprovalTip') }}</span>
        </div>
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1"
        >
          <div
            class="order-2 sm:order-1 text-[11px] text-gray-400 dark:text-gray-500 flex flex-wrap items-center gap-1"
          >
            <span>{{ t('comments.tip') }}</span>
            <span>{{ t('comments.pressKeys') }}</span>
            <kbd
              class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[10px] font-medium"
              >Ctrl</kbd
            >
            <span>+</span>
            <kbd
              class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[10px] font-medium"
              >Enter</kbd
            >
            <span class="hidden sm:inline">{{ t('comments.orOnMac') }}</span>
            <span class="sm:inline hidden">{{ t('comments.cmdEnterMac') }}</span>
            <span class="sm:hidden">{{ t('comments.cmdEnterShort') }}</span>
            <span>{{ t('comments.toSubmit') }}</span>
          </div>
          <div class="order-1 sm:order-2 flex justify-end">
            <button
              type="submit"
              class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-60 disabled:pointer-events-none"
              :disabled="submitting || !newComment.trim()"
            >
              <Icon v-if="submitting" icon="mdi:loading" class="animate-spin" />
              <Icon v-else icon="mdi:send" />
              <span>{{ submitting ? t('common.posting') : t('comments.postComment') }}</span>
            </button>
          </div>
        </div>
      </form>
      <hr class="my-8 border-gray-300 dark:border-gray-700" />
    </div>
    <div v-else class="mb-8 text-sm text-gray-600 dark:text-gray-300">
      {{ t('comments.pleaseSignIn') }}
      <router-link :to="localePath('/login')" class="text-blue-600 hover:underline"
        >{{ t('comments.signInToComment') }}</router-link
      >
      {{ t('comments.toComment') }}
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <Icon icon="mdi:loading" class="animate-spin text-blue-500" />
    </div>
    <div v-else>
      <div
        v-if="comments.length === 0 && modFilter === 'all'"
        class="text-gray-500 dark:text-gray-400 text-sm italic"
      >
        {{ t('comments.beFirst') }}
      </div>
      <div
        v-else-if="comments.length === 0 && modFilter === 'approved'"
        class="text-gray-500 dark:text-gray-400 text-sm italic"
      >
        {{ t('comments.noApproved') }}
      </div>
      <div
        v-else-if="comments.length === 0 && modFilter === 'pending'"
        class="text-gray-500 dark:text-gray-400 text-sm italic"
      >
        {{ t('comments.noPending') }}
      </div>
      <ul class="space-y-6" id="comments" v-else>
        <li
          v-for="c in comments"
          :key="c.id"
          class="p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40"
        >
          <div class="flex justify-between mb-2">
            <div class="flex items-start gap-3">
              <div
                class="w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
              >
                <img
                  v-if="c.author_avatar_url"
                  :src="c.author_avatar_url"
                  :alt="c.author_display_name || c.author_username || t('common.avatar')"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <Icon v-else icon="mdi:account" class="text-xl text-gray-500" />
              </div>
              <div class="flex flex-col">
                <div class="flex items-center flex-wrap gap-1 text-sm">
                  <span
                    class="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1"
                  >
                    {{
                      c.author_display_name || c.author_username || t('common.unknown')
                    }}
                    <span
                      v-if="c.author_id === postAuthorId"
                      class="ms-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-[10px] font-semibold tracking-wide uppercase text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                    >
                      <Icon icon="mdi:pen" class="text-[11px]" /> {{ t('comments.authorBadge') }}
                    </span>
                    <span
                      v-if="
                        !c.approved &&
                        (canModerate ||
                          (sessionUser && sessionUser.id === c.author_id))
                      "
                      class="ms-1 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-[10px] font-semibold tracking-wide uppercase text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
                    >
                      <Icon icon="mdi:clock-outline" class="text-[11px]" />
                      {{ t('comments.pendingLabel') }}
                    </span>
                  </span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs"
                    >• {{ formatDate(c.created_at) }}</span
                  >
                </div>
                <div
                  class="comment-content mt-1 text-sm leading-relaxed whitespace-pre-line break-all md:break-words overflow-hidden text-gray-800 dark:text-gray-200"
                >
                  {{ c.content }}
                </div>
              </div>
            </div>
            <div v-if="canModerate" class="flex items-start gap-2 text-xs">
              <button
                v-if="!c.approved"
                @click="approveComment(c.id)"
                class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[13px] font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500"
                :title="t('comments.approve')"
              >
                <Icon icon="mdi:check-circle" class="text-base" />
                <span class="hidden sm:inline">{{ t('comments.approve') }}</span>
              </button>
              <button
                @click="requestDelete(c.id)"
                class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[13px] font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-500"
                :title="t('common.delete')"
              >
                <Icon icon="mdi:delete" class="text-base" />
                <span class="hidden sm:inline">{{ t('common.delete') }}</span>
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div
        v-if="!endReached && comments.length"
        ref="loadMoreTrigger"
        class="h-10 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
      >
        <Icon v-if="loadingMore" icon="mdi:loading" class="animate-spin" />
        <span v-else>{{ t('comments.loadingMore') }}</span>
      </div>
      <div
        v-if="endReached && comments.length > pageSize"
        class="mt-4 text-center text-[11px] text-gray-400"
      >
        {{ t('comments.allLoaded') }}
      </div>
    </div>
    <ConfirmDialog
      :open="confirmOpen"
      :title="t('comments.deleteTitle')"
      :description="t('common.actionCannotBeUndone')"
      :body="t('comments.deleteConfirm')"
      @confirm="performDelete"
      @cancel="
        () => {
          confirmOpen = false;
          deleteTargetId = null;
        }
      "
    />
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
  nextTick,
} from "vue";
import { supabase } from "@/services/supabase";
import { Icon } from "@iconify/vue";import ConfirmDialog from "@/components/ConfirmDialog.vue";
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

const props = defineProps({
  postId: { type: [String, Number], required: true },
  postAuthorId: { type: String, required: true },
});

const toast = useToast();

const comments = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const endReached = ref(false);
const pageSize = 5;
const loadMoreTrigger = ref(null);
let commentsObserver = null;
function initObserver() {
  if (commentsObserver) commentsObserver.disconnect();
  commentsObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        !loadingMore.value &&
        !loading.value &&
        !endReached.value
      ) {
        fetchComments();
      }
    },
    { root: null, rootMargin: "200px", threshold: 0 }
  );
  if (loadMoreTrigger.value) commentsObserver.observe(loadMoreTrigger.value);
}
const newComment = ref("");
const commentTextarea = ref(null);
const submitting = ref(false);
const sessionUser = ref(null);
const role = ref("reader");
const confirmOpen = ref(false);
const deleteTargetId = ref(null);
const totalCount = ref(0);
const pendingCount = ref(0);
const modFilter = ref("all");
const sortOrder = ref("newest");
const MAX_COMMENT_LENGTH = 1000;

const canModerate = computed(
  () => role.value === "admin" || role.value === "author"
);

async function fetchSession() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  sessionUser.value = user || null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, display_name, username")
      .eq("id", user.id)
      .single();
    role.value = profile?.role || "reader";
  }
  await updateCounts();
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function baseQuery() {
  let q = supabase
    .from("comments")
    .select(
      `id, post_id, author_id, content, approved, created_at, author:profiles!comments_author_id_fkey(id, username, display_name, avatar_url)`
    )
    .eq("post_id", props.postId)
    .order("created_at", { ascending: sortOrder.value === "oldest" });
  if (canModerate.value) {
    if (modFilter.value === "approved") q = q.eq("approved", true);
    else if (modFilter.value === "pending") q = q.eq("approved", false);
  } else {
    if (sessionUser.value) {
      q = q.or(`approved.eq.true,author_id.eq.${sessionUser.value.id}`);
    } else {
      q = q.eq("approved", true);
    }
  }
  return q;
}

async function fetchComments({ reset = false } = {}) {
  if (!props.postId) return;
  if (reset) {
    comments.value = [];
    endReached.value = false;
  }
  if (endReached.value && !reset) return;

  const from = reset ? 0 : comments.value.length;
  const to = from + pageSize - 1;
  loading.value = from === 0;
  loadingMore.value = from > 0;

  const { data, error } = await baseQuery().range(from, to);
  if (error) {
    console.error(error);
    toast.error(t('comments.loadFailed'));
  } else {
    const mapped = (data || []).map((c) => ({
      id: c.id,
      post_id: c.post_id,
      author_id: c.author_id,
      content: c.content,
      approved: c.approved,
      created_at: c.created_at,
      author_display_name: c.author?.display_name,
      author_username: c.author?.username,
      author_avatar_url: c.author?.avatar_url,
    }));
    if (reset) {
      comments.value = mapped;
    } else {
      const existing = new Set(comments.value.map((c) => c.id));
      for (const m of mapped) if (!existing.has(m.id)) comments.value.push(m);
    }
    if (mapped.length < pageSize) endReached.value = true;
  }
  loading.value = false;
  loadingMore.value = false;
  if (reset) {
    await nextTick();
    initObserver();
  }
}

async function submitComment() {
  if (!newComment.value.trim() || !sessionUser.value) return;
  submitting.value = true;
  try {
    const insertPayload = {
      post_id: props.postId,
      author_id: sessionUser.value.id,
      content: newComment.value.trim(),
      approved: canModerate.value,
    };
    const { error } = await supabase.from("comments").insert([insertPayload]);
    if (error) throw error;
    newComment.value = "";
    toast.success(
      insertPayload.approved
        ? t('comments.posted')
        : t('comments.submitted')
    );
    await fetchComments({ reset: true });
    await updateCounts();
  } catch (e) {
    console.error(e);
    toast.error(t('comments.postFailed'));
  } finally {
    submitting.value = false;
    autoResize();
  }
}

async function approveComment(id) {
  const { error } = await supabase
    .from("comments")
    .update({ approved: true })
    .eq("id", id);
  if (error) return toast.error(t('comments.approveFailed'));
  toast.success(t('comments.approveSuccess'));
  await fetchComments({ reset: true });
  await updateCounts();
}

function requestDelete(id) {
  deleteTargetId.value = id;
  confirmOpen.value = true;
}

async function performDelete() {
  if (!deleteTargetId.value) return;
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", deleteTargetId.value);
  if (error) {
    toast.error(t('comments.deleteFailed'));
  } else {
    toast.success(t('comments.deleted'));
    comments.value = comments.value.filter(
      (c) => c.id !== deleteTargetId.value
    );
  }
  confirmOpen.value = false;
  deleteTargetId.value = null;
  await updateCounts();
}

onMounted(async () => {
  await fetchSession();
  await fetchComments({ reset: true });
  await updateCounts();
  initObserver();
  autoResize();
});

watch(
  () => [props.postId],
  () => {
    fetchComments({ reset: true });
    updateCounts();
  }
);

watch(modFilter, () => {
  if (canModerate.value) {
    fetchComments({ reset: true });
  }
});

watch(sortOrder, () => {
  fetchComments({ reset: true });
});

onBeforeUnmount(() => {
  if (commentsObserver) commentsObserver.disconnect();
});

async function updateCounts() {
  if (!props.postId) return;
  try {
    if (canModerate.value) {
      const [{ count: total }, { count: pending }] = await Promise.all([
        supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .eq("post_id", props.postId),
        supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .eq("post_id", props.postId)
          .eq("approved", false),
      ]);
      totalCount.value = total || 0;
      pendingCount.value = pending || 0;
    } else {
      const approvedPromise = supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("post_id", props.postId)
        .eq("approved", true);
      const ownPendingPromise = sessionUser.value
        ? supabase
            .from("comments")
            .select("id", { count: "exact", head: true })
            .eq("post_id", props.postId)
            .eq("approved", false)
            .eq("author_id", sessionUser.value.id)
        : Promise.resolve({ count: 0 });
      const [{ count: approvedCnt }, { count: ownPendingCnt }] =
        await Promise.all([approvedPromise, ownPendingPromise]);
      totalCount.value = (approvedCnt || 0) + (ownPendingCnt || 0);
      pendingCount.value = 0;
    }
  } catch (e) {
    console.warn("Count update failed", e);
  }
}

function onTextareaKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    if (!submitting.value && newComment.value.trim()) {
      e.preventDefault();
      submitComment();
    }
  }
}

function autoResize() {
  const el = commentTextarea.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 600) + "px";
}

watch(newComment, async (val) => {
  if (val.length > MAX_COMMENT_LENGTH)
    newComment.value = val.slice(0, MAX_COMMENT_LENGTH);
  await nextTick();
  autoResize();
});

function clearComment() {
  newComment.value = "";
  const el = commentTextarea.value;
  if (el) {
    el.style.height = "";
  }
  nextTick(() => autoResize());
}
</script>

<style scoped>
#comments {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
.comment-content {
  overflow-wrap: anywhere;
  word-break: break-word;
  max-width: 100%;
}
</style>
