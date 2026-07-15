import { computed, ref, watch, resolveComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderClass } from 'vue/server-renderer';
import { M as Markdown } from '../_/vue3-markdown-it.umd.min.mjs';
import { Icon } from '@iconify/vue';
import { _ as _sfc_main$3 } from './NoImage-Df5cAWv5.mjs';
import { a as getBrowserUrl, g as getBrowserOrigin } from './utils-ScxCRkhj.mjs';
import { _ as _export_sfc, u as useI18n, a as useLocalePath, s as supabase } from './server.mjs';
import { _ as _sfc_main$4 } from './ConfirmDialog-BMJpAaMk.mjs';
import { SelectRoot, SelectTrigger, SelectValue, SelectPortal, SelectContent, SelectScrollUpButton, SelectViewport, SelectGroup, SelectItem, SelectItemIndicator, SelectItemText, SelectSeparator, SelectScrollDownButton } from 'radix-vue';
import { u as useToast } from './useToast-DuA5bmqL.mjs';

const _sfc_main$2 = {
  __name: "Post",
  __ssrInlineRender: true,
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const props = __props;
    const readingTime = computed(() => {
      var _a;
      if (!((_a = props.post) == null ? void 0 : _a.content)) return null;
      const text = props.post.content.replace(/`{1,3}[^`]*`{1,3}/g, "").replace(/```[\s\S]*?```/g, "").replace(/[#>*_\-`~]|!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[(.*?)\]\([^)]*\)/g, "$1");
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.round(words / 200));
    });
    const canNativeShare = false;
    const twitterShareUrl = computed(() => {
      var _a;
      const url = encodeURIComponent(getBrowserUrl());
      const text = encodeURIComponent(((_a = props.post) == null ? void 0 : _a.title) || t("posts.shareText"));
      return `https://x.com/intent/tweet?text=${text}&url=${url}`;
    });
    const linkCopied = ref(false);
    const markdownContainer = ref(null);
    const coverImageError = ref(false);
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    function addEnhancements() {
      nextTick(() => {
        var _a, _b, _c;
        const preBlocks = ((_a = markdownContainer.value) == null ? void 0 : _a.querySelectorAll("pre")) || [];
        preBlocks.forEach((pre) => {
          var _a2;
          const existing = pre.querySelector(".code-scroll");
          if (existing) return;
          const code = pre.querySelector("code");
          if (!code) return;
          const wrapper = (void 0).createElement("div");
          wrapper.className = "code-scroll";
          code.parentNode.insertBefore(wrapper, code);
          wrapper.appendChild(code);
          const language = (_a2 = code.className.match(/language-(\w+)/)) == null ? void 0 : _a2[1];
          if (language && !pre.querySelector(".language-label")) {
            const label = (void 0).createElement("span");
            label.className = "language-label";
            label.innerText = language.toUpperCase();
            pre.appendChild(label);
          }
          if (!pre.querySelector(".copy-btn")) {
            const btn = (void 0).createElement("button");
            btn.className = "copy-btn";
            btn.innerText = t("posts.codeCopy");
            btn.onclick = async () => {
              try {
                await (void 0).clipboard.writeText(code.innerText);
                btn.innerText = t("posts.codeCopied");
                setTimeout(() => btn.innerText = t("posts.codeCopy"), 1500);
              } catch {
                btn.innerText = t("posts.codeFailed");
                setTimeout(() => btn.innerText = t("posts.codeCopy"), 1500);
              }
            };
            pre.appendChild(btn);
          }
        });
        try {
          if ((void 0).opener && (void 0).opener.postMessage) {
            const navigationEntry = typeof performance.getEntriesByType === "function" ? (_b = performance.getEntriesByType("navigation")) == null ? void 0 : _b[0] : null;
            const navStart = (_c = navigationEntry == null ? void 0 : navigationEntry.startTime) != null ? _c : 0;
            const renderTime = Math.round(performance.now() - navStart);
            (void 0).opener.postMessage({ __pluma_e2e_time: true, time: renderTime }, getBrowserOrigin());
          }
        } catch (e) {
        }
      });
    }
    watch(
      () => props.post,
      () => {
        coverImageError.value = false;
        addEnhancements();
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      const _component_router_link = resolveComponent("router-link");
      if (!__props.post) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center text-gray-500 dark:text-gray-400 py-24" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:file-search-outline",
          class: "text-5xl text-gray-300 dark:text-gray-600 mb-4"
        }, null, _parent));
        _push(`<p class="text-sm">${ssrInterpolate(unref(t)("posts.loadingOrMissing"))}</p></div>`);
      } else {
        _push(`<article${ssrRenderAttrs(mergeProps({
          class: "relative",
          itemscope: "",
          itemtype: "https://schema.org/Article"
        }, _attrs))}><figure class="relative mb-10 group rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-700/60 bg-gray-100 dark:bg-gray-800"><div class="relative aspect-[16/7] md:aspect-[16/5] w-full overflow-hidden">`);
        if (__props.post.cover_image_url && !coverImageError.value) {
          _push(`<img${ssrRenderAttr("src", __props.post.cover_image_url)}${ssrRenderAttr("alt", __props.post.title + " cover image")} width="1200" height="525" class="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.25,.1,.25,1)] group-hover:scale-[1.04]" loading="eager" decoding="async" fetchpriority="high" draggable="false">`);
        } else {
          _push(ssrRenderComponent(_sfc_main$3, { plain: true }, null, _parent));
        }
        _push(`<div class="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent"></div><div class="absolute top-4 left-4 flex flex-wrap gap-2">`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/category/${((_a = __props.post.category) == null ? void 0 : _a.slug) || "uncategorized"}`),
          class: "inline-flex items-center gap-1 px-3 h-8 rounded-full text-[11px] font-medium bg-white/80 dark:bg-gray-900/60 text-blue-700 dark:text-blue-300 backdrop-blur hover:bg-white dark:hover:bg-gray-900 transition border border-white/60 dark:border-gray-700/60"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2;
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:folder",
                class: "text-sm"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(((_a2 = __props.post.category) == null ? void 0 : _a2.name) || unref(t)("common.uncategorized"))}`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:folder",
                  class: "text-sm"
                }),
                createTextVNode(" " + toDisplayString(((_b2 = __props.post.category) == null ? void 0 : _b2.name) || unref(t)("common.uncategorized")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
        if (__props.post.cover_image_url) {
          _push(`<meta itemprop="image"${ssrRenderAttr("content", __props.post.cover_image_url)}>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</figure><div class="mb-8 px-1"><h1 class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-gray-100" itemprop="headline">${ssrInterpolate(__props.post.title)}</h1><div class="mt-4 flex flex-wrap items-center gap-3 text-[12px] md:text-[13px] font-medium text-gray-600 dark:text-gray-400">`);
        if ((_b = __props.post.author) == null ? void 0 : _b.username) {
          _push(ssrRenderComponent(_component_router_link, {
            to: unref(localePath)(`/author/${__props.post.author.username}`),
            class: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a2, _b2, _c2, _d2;
              if (_push2) {
                _push2(ssrRenderComponent(unref(Icon), {
                  icon: "mdi:account",
                  class: "text-sm"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(((_a2 = __props.post.author) == null ? void 0 : _a2.display_name) || ((_b2 = __props.post.author) == null ? void 0 : _b2.username))}`);
              } else {
                return [
                  createVNode(unref(Icon), {
                    icon: "mdi:account",
                    class: "text-sm"
                  }),
                  createTextVNode(" " + toDisplayString(((_c2 = __props.post.author) == null ? void 0 : _c2.display_name) || ((_d2 = __props.post.author) == null ? void 0 : _d2.username)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (__props.post.created_at) {
          _push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:calendar",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(formatDate(__props.post.created_at))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (readingTime.value) {
          _push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:clock-outline",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("posts.minRead", { minutes: readingTime.value }))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="prose prose-lg dark:prose-invert max-w-none text-gray-900 dark:text-gray-100" itemprop="articleBody">`);
        _push(ssrRenderComponent(unref(Markdown), {
          source: __props.post.content,
          class: "markdown-content",
          ref_key: "markdownContainer",
          ref: markdownContainer
        }, null, _parent));
        _push(`</div><div class="mt-12 flex flex-col gap-10">`);
        if ((_c = __props.post.tags) == null ? void 0 : _c.length) {
          _push(`<div class="border-t border-gray-200 dark:border-gray-700 pt-8"><h4 class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">${ssrInterpolate(unref(t)("posts.tags"))}</h4><div class="flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(__props.post.tags, (tag) => {
            _push(`<span class="inline-flex items-center gap-1 px-3 h-8 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:tag",
              class: "text-sm"
            }, null, _parent));
            _push(` ${ssrInterpolate(tag)}</span>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-t border-gray-200 dark:border-gray-700"><div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:share-variant",
          class: "text-lg text-blue-500"
        }, null, _parent));
        _push(`<span class="font-medium">${ssrInterpolate(unref(t)("posts.share"))}</span></div><div class="flex items-center gap-3"><button class="inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600">`);
        if (!linkCopied.value) {
          _push(`<div class="inline-flex items-center gap-1">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:link",
            class: "text-base"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("posts.copyLink"))}</div>`);
        } else {
          _push(`<div class="inline-flex items-center gap-1">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:check",
            class: "text-base"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("posts.linkCopied"))}</div>`);
        }
        _push(`</button><a${ssrRenderAttr("href", twitterShareUrl.value)} target="_blank" rel="noopener" class="inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900/60 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-600">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:twitter",
          class: "text-base"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("posts.tweet"))}</a>`);
        if (unref(canNativeShare)) {
          _push(`<button class="inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:share",
            class: "text-base"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("posts.shareAction"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
        if (__props.post.created_at) {
          _push(`<meta itemprop="datePublished"${ssrRenderAttr("content", __props.post.created_at)}>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.post.updated_at) {
          _push(`<meta itemprop="dateModified"${ssrRenderAttr("content", __props.post.updated_at || __props.post.created_at)}>`);
        } else {
          _push(`<!---->`);
        }
        if (((_d = __props.post.author) == null ? void 0 : _d.display_name) || ((_e = __props.post.author) == null ? void 0 : _e.username)) {
          _push(`<meta itemprop="author"${ssrRenderAttr("content", ((_f = __props.post.author) == null ? void 0 : _f.display_name) || ((_g = __props.post.author) == null ? void 0 : _g.username))}>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<meta itemprop="publisher"${ssrRenderAttr("content", ((_h = __props.post.author) == null ? void 0 : _h.display_name) || ((_i = __props.post.author) == null ? void 0 : _i.username) || unref(t)("common.unknown"))}></article>`);
      }
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Post.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const pageSize = 5;
const MAX_COMMENT_LENGTH = 1e3;
const _sfc_main$1 = {
  __name: "Comments",
  __ssrInlineRender: true,
  props: {
    postId: { type: [String, Number], required: true },
    postAuthorId: { type: String, required: true }
  },
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const props = __props;
    const toast = useToast();
    const comments = ref([]);
    const loading = ref(false);
    const loadingMore = ref(false);
    const endReached = ref(false);
    const loadMoreTrigger = ref(null);
    let commentsObserver = null;
    function initObserver() {
      if (commentsObserver) commentsObserver.disconnect();
      commentsObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && !loadingMore.value && !loading.value && !endReached.value) {
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
    const canModerate = computed(
      () => role.value === "admin" || role.value === "author"
    );
    function formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    function baseQuery() {
      let q = supabase.from("comments").select(
        `id, post_id, author_id, content, approved, created_at, author:profiles!comments_author_id_fkey(id, username, display_name, avatar_url)`
      ).eq("post_id", props.postId).order("created_at", { ascending: sortOrder.value === "oldest" });
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
        toast.error(t("comments.loadFailed"));
      } else {
        const mapped = (data || []).map((c) => {
          var _a, _b, _c;
          return {
            id: c.id,
            post_id: c.post_id,
            author_id: c.author_id,
            content: c.content,
            approved: c.approved,
            created_at: c.created_at,
            author_display_name: (_a = c.author) == null ? void 0 : _a.display_name,
            author_username: (_b = c.author) == null ? void 0 : _b.username,
            author_avatar_url: (_c = c.author) == null ? void 0 : _c.avatar_url
          };
        });
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
    async function performDelete() {
      if (!deleteTargetId.value) return;
      const { error } = await supabase.from("comments").delete().eq("id", deleteTargetId.value);
      if (error) {
        toast.error(t("comments.deleteFailed"));
      } else {
        toast.success(t("comments.deleted"));
        comments.value = comments.value.filter(
          (c) => c.id !== deleteTargetId.value
        );
      }
      confirmOpen.value = false;
      deleteTargetId.value = null;
      await updateCounts();
    }
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
    async function updateCounts() {
      if (!props.postId) return;
      try {
        if (canModerate.value) {
          const [{ count: total }, { count: pending }] = await Promise.all([
            supabase.from("comments").select("id", { count: "exact", head: true }).eq("post_id", props.postId),
            supabase.from("comments").select("id", { count: "exact", head: true }).eq("post_id", props.postId).eq("approved", false)
          ]);
          totalCount.value = total || 0;
          pendingCount.value = pending || 0;
        } else {
          const approvedPromise = supabase.from("comments").select("id", { count: "exact", head: true }).eq("post_id", props.postId).eq("approved", true);
          const ownPendingPromise = sessionUser.value ? supabase.from("comments").select("id", { count: "exact", head: true }).eq("post_id", props.postId).eq("approved", false).eq("author_id", sessionUser.value.id) : Promise.resolve({ count: 0 });
          const [{ count: approvedCnt }, { count: ownPendingCnt }] = await Promise.all([approvedPromise, ownPendingPromise]);
          totalCount.value = (approvedCnt || 0) + (ownPendingCnt || 0);
          pendingCount.value = 0;
        }
      } catch (e) {
        console.warn("Count update failed", e);
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      if (__props.postId) {
        _push(`<div${ssrRenderAttrs(mergeProps(_ctx.$attrs, {
          class: ["mt-12", _ctx.$attrs.class]
        }, _attrs))} data-v-8b4ed900><h3 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100" data-v-8b4ed900>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:comment-text-outline",
          class: "text-blue-500"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("comments.title"))} <span class="text-sm font-normal text-gray-500 dark:text-gray-400 flex items-center gap-1" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.total", { count: totalCount.value }))} `);
        if (canModerate.value && pendingCount.value > 0) {
          _push(`<span class="text-xs ms-1 px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.pendingCount", { count: pendingCount.value }))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span></h3><div class="flex flex-wrap items-center gap-4 mb-4 text-sm" data-v-8b4ed900>`);
        if (canModerate.value) {
          _push(`<div class="flex flex-col gap-1" data-v-8b4ed900><span class="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.filter"))}</span>`);
          _push(ssrRenderComponent(unref(SelectRoot), {
            modelValue: modFilter.value,
            "onUpdate:modelValue": ($event) => modFilter.value = $event
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(SelectTrigger), {
                  class: "min-w-[11rem] w-auto inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 data-[placeholder]:text-gray-400",
                  "aria-label": unref(t)("comments.filterAria")
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(SelectValue), {
                        placeholder: unref(t)("comments.all")
                      }, null, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(Icon), {
                        icon: "radix-icons:chevron-down",
                        class: "w-4 h-4 opacity-70"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(SelectValue), {
                          placeholder: unref(t)("comments.all")
                        }, null, 8, ["placeholder"]),
                        createVNode(unref(Icon), {
                          icon: "radix-icons:chevron-down",
                          class: "w-4 h-4 opacity-70"
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(SelectPortal), null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(SelectContent), {
                        class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                        "side-offset": 5
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-up" }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(SelectViewport), { class: "p-1" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(SelectGroup), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(SelectItem), {
                                          value: "all",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(SelectItemText), null, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(unref(t)("comments.all"))}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(unref(t)("comments.all")), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectItemText), null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(unref(t)("comments.all")), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }, null, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(unref(SelectItem), {
                                          value: "approved",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(SelectItemText), null, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(unref(t)("comments.approved"))}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(unref(t)("comments.approved")), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectItemText), null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(unref(t)("comments.approved")), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(unref(SelectItem), {
                                          value: "pending",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(SelectItemText), null, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(unref(t)("comments.pendingLabel"))}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(unref(t)("comments.pendingLabel")), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectItemText), null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(unref(t)("comments.pendingLabel")), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(SelectItem), {
                                            value: "all",
                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectItemText), null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(t)("comments.all")), 1)
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                          createVNode(unref(SelectItem), {
                                            value: "approved",
                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectItemText), null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(t)("comments.approved")), 1)
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectItem), {
                                            value: "pending",
                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectItemText), null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(t)("comments.pendingLabel")), 1)
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(SelectGroup), null, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItem), {
                                          value: "all",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectItemText), null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(t)("comments.all")), 1)
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                        createVNode(unref(SelectItem), {
                                          value: "approved",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectItemText), null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(t)("comments.approved")), 1)
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectItem), {
                                          value: "pending",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectItemText), null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(t)("comments.pendingLabel")), 1)
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-down" }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                default: withCtx(() => [
                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(SelectViewport), { class: "p-1" }, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectGroup), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItem), {
                                        value: "all",
                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectItemText), null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(t)("comments.all")), 1)
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                      createVNode(unref(SelectItem), {
                                        value: "approved",
                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectItemText), null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(t)("comments.approved")), 1)
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectItem), {
                                        value: "pending",
                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectItemText), null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(t)("comments.pendingLabel")), 1)
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                default: withCtx(() => [
                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(SelectContent), {
                          class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                          "side-offset": 5
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(SelectViewport), { class: "p-1" }, {
                              default: withCtx(() => [
                                createVNode(unref(SelectGroup), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectItem), {
                                      value: "all",
                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectItemText), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(t)("comments.all")), 1)
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                    createVNode(unref(SelectItem), {
                                      value: "approved",
                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectItemText), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(t)("comments.approved")), 1)
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(SelectItem), {
                                      value: "pending",
                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectItemText), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(t)("comments.pendingLabel")), 1)
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(SelectTrigger), {
                    class: "min-w-[11rem] w-auto inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 data-[placeholder]:text-gray-400",
                    "aria-label": unref(t)("comments.filterAria")
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(SelectValue), {
                        placeholder: unref(t)("comments.all")
                      }, null, 8, ["placeholder"]),
                      createVNode(unref(Icon), {
                        icon: "radix-icons:chevron-down",
                        class: "w-4 h-4 opacity-70"
                      })
                    ]),
                    _: 1
                  }, 8, ["aria-label"]),
                  createVNode(unref(SelectPortal), null, {
                    default: withCtx(() => [
                      createVNode(unref(SelectContent), {
                        class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                        "side-offset": 5
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(SelectViewport), { class: "p-1" }, {
                            default: withCtx(() => [
                              createVNode(unref(SelectGroup), null, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectItem), {
                                    value: "all",
                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectItemText), null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(t)("comments.all")), 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                  createVNode(unref(SelectItem), {
                                    value: "approved",
                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectItemText), null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(t)("comments.approved")), 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(SelectItem), {
                                    value: "pending",
                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectItemText), null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(t)("comments.pendingLabel")), 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-col gap-1" data-v-8b4ed900><span class="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.sort"))}</span>`);
        _push(ssrRenderComponent(unref(SelectRoot), {
          modelValue: sortOrder.value,
          "onUpdate:modelValue": ($event) => sortOrder.value = $event
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(SelectTrigger), {
                class: "min-w-[14rem] w-auto inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 data-[placeholder]:text-gray-400",
                "aria-label": unref(t)("comments.sortAria")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(SelectValue), {
                      placeholder: unref(t)("comments.sort")
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: "radix-icons:chevron-down",
                      class: "w-4 h-4 opacity-70"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(SelectValue), {
                        placeholder: unref(t)("comments.sort")
                      }, null, 8, ["placeholder"]),
                      createVNode(unref(Icon), {
                        icon: "radix-icons:chevron-down",
                        class: "w-4 h-4 opacity-70"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(SelectPortal), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(SelectContent), {
                      class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                      "side-offset": 5
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-up" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(SelectViewport), { class: "p-1" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(SelectGroup), null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(SelectItem), {
                                        value: "newest",
                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(SelectItemText), null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(unref(t)("comments.newestFirst"))}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(unref(t)("comments.newestFirst")), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectItemText), null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(t)("comments.newestFirst")), 1)
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }, null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(unref(SelectItem), {
                                        value: "oldest",
                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(SelectItemText), null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(unref(t)("comments.oldestFirst"))}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(unref(t)("comments.oldestFirst")), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectItemText), null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(t)("comments.oldestFirst")), 1)
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(SelectItem), {
                                          value: "newest",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectItemText), null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(t)("comments.newestFirst")), 1)
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                        createVNode(unref(SelectItem), {
                                          value: "oldest",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectItemText), null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(t)("comments.oldestFirst")), 1)
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(SelectGroup), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItem), {
                                        value: "newest",
                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectItemText), null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(t)("comments.newestFirst")), 1)
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                      createVNode(unref(SelectItem), {
                                        value: "oldest",
                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectItemText), null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(t)("comments.oldestFirst")), 1)
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-down" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(SelectViewport), { class: "p-1" }, {
                              default: withCtx(() => [
                                createVNode(unref(SelectGroup), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectItem), {
                                      value: "newest",
                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectItemText), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(t)("comments.newestFirst")), 1)
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                    createVNode(unref(SelectItem), {
                                      value: "oldest",
                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectItemText), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(t)("comments.oldestFirst")), 1)
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(SelectContent), {
                        class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                        "side-offset": 5
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(SelectViewport), { class: "p-1" }, {
                            default: withCtx(() => [
                              createVNode(unref(SelectGroup), null, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectItem), {
                                    value: "newest",
                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectItemText), null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(t)("comments.newestFirst")), 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                  createVNode(unref(SelectItem), {
                                    value: "oldest",
                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectItemText), null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(t)("comments.oldestFirst")), 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(SelectTrigger), {
                  class: "min-w-[14rem] w-auto inline-flex h-9 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 data-[placeholder]:text-gray-400",
                  "aria-label": unref(t)("comments.sortAria")
                }, {
                  default: withCtx(() => [
                    createVNode(unref(SelectValue), {
                      placeholder: unref(t)("comments.sort")
                    }, null, 8, ["placeholder"]),
                    createVNode(unref(Icon), {
                      icon: "radix-icons:chevron-down",
                      class: "w-4 h-4 opacity-70"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                createVNode(unref(SelectPortal), null, {
                  default: withCtx(() => [
                    createVNode(unref(SelectContent), {
                      class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                      "side-offset": 5
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(SelectViewport), { class: "p-1" }, {
                          default: withCtx(() => [
                            createVNode(unref(SelectGroup), null, {
                              default: withCtx(() => [
                                createVNode(unref(SelectItem), {
                                  value: "newest",
                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(SelectItemText), null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(t)("comments.newestFirst")), 1)
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                createVNode(unref(SelectItem), {
                                  value: "oldest",
                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(SelectItemText), null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(t)("comments.oldestFirst")), 1)
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
        if (sessionUser.value) {
          _push(`<div class="mb-8" data-v-8b4ed900><form class="space-y-3" data-v-8b4ed900><div class="relative group" data-v-8b4ed900><textarea rows="3"${ssrRenderAttr("placeholder", unref(t)("comments.placeholder"))} class="peer w-full rounded-lg px-4 py-3 bg-white/90 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400/60 focus:border-gray-400 dark:focus:border-gray-500 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden leading-relaxed min-h-[96px] resize-none"${ssrIncludeBooleanAttr(submitting.value) ? " disabled" : ""}${ssrRenderAttr("maxlength", MAX_COMMENT_LENGTH)} required data-v-8b4ed900>${ssrInterpolate(newComment.value)}</textarea><div class="pointer-events-none absolute start-3 -top-2 z-10 px-1 rounded bg-white dark:bg-gray-800 text-[10px] font-medium text-gray-500 dark:text-gray-400 shadow-sm" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.commentLabel"))}</div><div class="mt-1 flex justify-between text-[11px] text-gray-400 dark:text-gray-500 select-none" data-v-8b4ed900><span class="${ssrRenderClass({
            "text-red-500 dark:text-red-400": newComment.value.length >= MAX_COMMENT_LENGTH
          })}" data-v-8b4ed900>${ssrInterpolate(newComment.value.length)} / ${ssrInterpolate(MAX_COMMENT_LENGTH)}</span>`);
          if (newComment.value.length > 0) {
            _push(`<button type="button" class="text-xs text-blue-600 dark:text-blue-400 hover:underline" data-v-8b4ed900>${ssrInterpolate(unref(t)("common.clear"))}</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400" data-v-8b4ed900>`);
          if (role.value === "admin") {
            _push(`<span data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.autoApprovedTip"))}</span>`);
          } else {
            _push(`<span data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.needsApprovalTip"))}</span>`);
          }
          _push(`</div><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1" data-v-8b4ed900><div class="order-2 sm:order-1 text-[11px] text-gray-400 dark:text-gray-500 flex flex-wrap items-center gap-1" data-v-8b4ed900><span data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.tip"))}</span><span data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.pressKeys"))}</span><kbd class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[10px] font-medium" data-v-8b4ed900>Ctrl</kbd><span data-v-8b4ed900>+</span><kbd class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[10px] font-medium" data-v-8b4ed900>Enter</kbd><span class="hidden sm:inline" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.orOnMac"))}</span><span class="sm:inline hidden" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.cmdEnterMac"))}</span><span class="sm:hidden" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.cmdEnterShort"))}</span><span data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.toSubmit"))}</span></div><div class="order-1 sm:order-2 flex justify-end" data-v-8b4ed900><button type="submit" class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-60 disabled:pointer-events-none"${ssrIncludeBooleanAttr(submitting.value || !newComment.value.trim()) ? " disabled" : ""} data-v-8b4ed900>`);
          if (submitting.value) {
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:loading",
              class: "animate-spin"
            }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Icon), { icon: "mdi:send" }, null, _parent));
          }
          _push(`<span data-v-8b4ed900>${ssrInterpolate(submitting.value ? unref(t)("common.posting") : unref(t)("comments.postComment"))}</span></button></div></div></form><hr class="my-8 border-gray-300 dark:border-gray-700" data-v-8b4ed900></div>`);
        } else {
          _push(`<div class="mb-8 text-sm text-gray-600 dark:text-gray-300" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.pleaseSignIn"))} `);
          _push(ssrRenderComponent(_component_router_link, {
            to: unref(localePath)("/login"),
            class: "text-blue-600 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("comments.signInToComment"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("comments.signInToComment")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(` ${ssrInterpolate(unref(t)("comments.toComment"))}</div>`);
        }
        if (loading.value) {
          _push(`<div class="flex justify-center py-10" data-v-8b4ed900>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:loading",
            class: "animate-spin text-blue-500"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<div data-v-8b4ed900>`);
          if (comments.value.length === 0 && modFilter.value === "all") {
            _push(`<div class="text-gray-500 dark:text-gray-400 text-sm italic" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.beFirst"))}</div>`);
          } else if (comments.value.length === 0 && modFilter.value === "approved") {
            _push(`<div class="text-gray-500 dark:text-gray-400 text-sm italic" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.noApproved"))}</div>`);
          } else if (comments.value.length === 0 && modFilter.value === "pending") {
            _push(`<div class="text-gray-500 dark:text-gray-400 text-sm italic" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.noPending"))}</div>`);
          } else {
            _push(`<ul class="space-y-6" id="comments" data-v-8b4ed900><!--[-->`);
            ssrRenderList(comments.value, (c) => {
              _push(`<li class="p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40" data-v-8b4ed900><div class="flex justify-between mb-2" data-v-8b4ed900><div class="flex items-start gap-3" data-v-8b4ed900><div class="w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0" data-v-8b4ed900>`);
              if (c.author_avatar_url) {
                _push(`<img${ssrRenderAttr("src", c.author_avatar_url)}${ssrRenderAttr("alt", c.author_display_name || c.author_username || unref(t)("common.avatar"))} class="w-full h-full object-cover" loading="lazy" data-v-8b4ed900>`);
              } else {
                _push(ssrRenderComponent(unref(Icon), {
                  icon: "mdi:account",
                  class: "text-xl text-gray-500"
                }, null, _parent));
              }
              _push(`</div><div class="flex flex-col" data-v-8b4ed900><div class="flex items-center flex-wrap gap-1 text-sm" data-v-8b4ed900><span class="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1" data-v-8b4ed900>${ssrInterpolate(c.author_display_name || c.author_username || unref(t)("common.unknown"))} `);
              if (c.author_id === __props.postAuthorId) {
                _push(`<span class="ms-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-[10px] font-semibold tracking-wide uppercase text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-200" data-v-8b4ed900>`);
                _push(ssrRenderComponent(unref(Icon), {
                  icon: "mdi:pen",
                  class: "text-[11px]"
                }, null, _parent));
                _push(` ${ssrInterpolate(unref(t)("comments.authorBadge"))}</span>`);
              } else {
                _push(`<!---->`);
              }
              if (!c.approved && (canModerate.value || sessionUser.value && sessionUser.value.id === c.author_id)) {
                _push(`<span class="ms-1 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-[10px] font-semibold tracking-wide uppercase text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200" data-v-8b4ed900>`);
                _push(ssrRenderComponent(unref(Icon), {
                  icon: "mdi:clock-outline",
                  class: "text-[11px]"
                }, null, _parent));
                _push(` ${ssrInterpolate(unref(t)("comments.pendingLabel"))}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</span><span class="text-gray-500 dark:text-gray-400 text-xs" data-v-8b4ed900>\u2022 ${ssrInterpolate(formatDate(c.created_at))}</span></div><div class="comment-content mt-1 text-sm leading-relaxed whitespace-pre-line break-all md:break-words overflow-hidden text-gray-800 dark:text-gray-200" data-v-8b4ed900>${ssrInterpolate(c.content)}</div></div></div>`);
              if (canModerate.value) {
                _push(`<div class="flex items-start gap-2 text-xs" data-v-8b4ed900>`);
                if (!c.approved) {
                  _push(`<button class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[13px] font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500"${ssrRenderAttr("title", unref(t)("comments.approve"))} data-v-8b4ed900>`);
                  _push(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:check-circle",
                    class: "text-base"
                  }, null, _parent));
                  _push(`<span class="hidden sm:inline" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.approve"))}</span></button>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`<button class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[13px] font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-500"${ssrRenderAttr("title", unref(t)("common.delete"))} data-v-8b4ed900>`);
                _push(ssrRenderComponent(unref(Icon), {
                  icon: "mdi:delete",
                  class: "text-base"
                }, null, _parent));
                _push(`<span class="hidden sm:inline" data-v-8b4ed900>${ssrInterpolate(unref(t)("common.delete"))}</span></button></div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></li>`);
            });
            _push(`<!--]--></ul>`);
          }
          if (!endReached.value && comments.value.length) {
            _push(`<div class="h-10 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400" data-v-8b4ed900>`);
            if (loadingMore.value) {
              _push(ssrRenderComponent(unref(Icon), {
                icon: "mdi:loading",
                class: "animate-spin"
              }, null, _parent));
            } else {
              _push(`<span data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.loadingMore"))}</span>`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (endReached.value && comments.value.length > pageSize) {
            _push(`<div class="mt-4 text-center text-[11px] text-gray-400" data-v-8b4ed900>${ssrInterpolate(unref(t)("comments.allLoaded"))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(ssrRenderComponent(_sfc_main$4, {
          open: confirmOpen.value,
          title: unref(t)("comments.deleteTitle"),
          description: unref(t)("common.actionCannotBeUndone"),
          body: unref(t)("comments.deleteConfirm"),
          onConfirm: performDelete,
          onCancel: () => {
            confirmOpen.value = false;
            deleteTargetId.value = null;
          }
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Comments.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Comments = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-8b4ed900"]]);
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "space-y-8 animate-pulse",
    "aria-hidden": "true"
  }, _attrs))}><div class="rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-700/60 bg-gray-100 dark:bg-gray-800"><div class="aspect-[16/7] md:aspect-[16/5] w-full bg-gray-200 dark:bg-gray-700"></div></div><div class="space-y-4 px-1"><div class="h-10 md:h-12 w-4/5 max-w-3xl rounded-lg bg-gray-200 dark:bg-gray-700"></div><div class="flex flex-wrap gap-3"><div class="h-7 w-28 rounded-md bg-gray-200 dark:bg-gray-700"></div><div class="h-7 w-24 rounded-md bg-gray-200 dark:bg-gray-700"></div><div class="h-7 w-20 rounded-md bg-gray-200 dark:bg-gray-700"></div></div></div><div class="space-y-3"><div class="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div><div class="h-3 w-11/12 rounded bg-gray-200 dark:bg-gray-700"></div><div class="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div><div class="h-3 w-4/5 rounded bg-gray-200 dark:bg-gray-700"></div><div class="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div><div class="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PostPageSkeleton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PostPageSkeleton = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { Comments as C, PostPageSkeleton as P, _sfc_main$2 as _ };
//# sourceMappingURL=PostPageSkeleton-CI_koHcl.mjs.map
