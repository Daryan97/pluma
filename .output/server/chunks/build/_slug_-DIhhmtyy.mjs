import { ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { _ as _sfc_main$1, r as resolveCategoryFilter, c as countLogicalPosts, l as loadCategoriesForLocale } from './PostLoader-DXP-J1UD.mjs';
import { Icon } from '@iconify/vue';
import { u as useI18n, a as useLocalePath, b as useContentLocale, p as projectInfo, s as supabase, d as useBranding } from './server.mjs';
import { useRoute, useRouter } from 'vue-router';
import { u as useSettings } from './settingsStore-B1-8Nave.mjs';
import { u as usePageSeo } from './usePageSeo-wMPCZyUZ.mjs';
import '../_/vue3-markdown-it.umd.min.mjs';
import './NoImage-Df5cAWv5.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import '@supabase/supabase-js';
import 'radix-vue';

const catClass = "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700";
const activeCatClass = "bg-blue-600 text-white dark:bg-blue-500 dark:text-white border-blue-600 dark:border-blue-500 shadow";
const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    useLocalePath();
    const { contentLocale } = useContentLocale();
    const route = useRoute();
    useRouter();
    const branding = useBranding();
    const category = ref(null);
    const countLoading = ref(false);
    const postCount = ref(null);
    let fetchSeq = 0;
    const categories = ref([]);
    const categoriesLoaded = ref(false);
    const categoryActive = ref(route.params.slug || "all");
    const { featuresEnabled } = useSettings();
    const isUncategorized = computed(() => route.params.slug === "uncategorized");
    const displayName = computed(() => {
      var _a;
      if (isUncategorized.value) return t("common.uncategorized");
      return ((_a = category.value) == null ? void 0 : _a.name) || route.params.slug;
    });
    const rssHref$1 = computed(() => {
      return "";
    });
    function applyKnownCategory(slug) {
      if (!slug || slug === "uncategorized") {
        category.value = null;
        return;
      }
      const known = categories.value.find((c) => c.slug === slug);
      if (known) category.value = known;
    }
    async function fetchCategory() {
      const seq = ++fetchSeq;
      const slug = route.params.slug;
      countLoading.value = true;
      postCount.value = null;
      applyKnownCategory(slug);
      if (!isUncategorized.value) {
        const { category: resolved, categoryIds } = await resolveCategoryFilter(
          supabase,
          slug,
          contentLocale.value
        );
        if (seq !== fetchSeq) return;
        if (resolved) {
          category.value = resolved;
        }
        if (categoryIds == null ? void 0 : categoryIds.length) {
          const { count } = await countLogicalPosts(
            supabase,
            (q) => q.eq("status", "published").eq("locale", contentLocale.value).in("category_id", categoryIds)
          );
          if (seq !== fetchSeq) return;
          postCount.value = typeof count === "number" ? count : 0;
        } else {
          postCount.value = 0;
        }
      } else {
        category.value = null;
        const { count } = await countLogicalPosts(
          supabase,
          (q) => q.eq("status", "published").eq("locale", contentLocale.value).is("category_id", null)
        );
        if (seq !== fetchSeq) return;
        postCount.value = typeof count === "number" ? count : 0;
      }
      countLoading.value = false;
    }
    async function loadCategories() {
      categories.value = await loadCategoriesForLocale(supabase, contentLocale.value);
      categoriesLoaded.value = true;
      applyKnownCategory(route.params.slug);
    }
    watch(() => route.params.slug, (val) => {
      categoryActive.value = val || "all";
      applyKnownCategory(val);
      fetchCategory();
    });
    watch(contentLocale, () => {
      loadCategories();
      fetchCategory();
    });
    const siteName = computed(
      () => {
        var _a;
        return ((_a = branding.resolveLocalizedSiteName) == null ? void 0 : _a.call(branding, locale.value)) || projectInfo.name || "Pluma";
      }
    );
    usePageSeo(
      computed(() => ({
        title: `${displayName.value} | ${siteName.value}`,
        description: `Explore posts in ${displayName.value}.`,
        type: "website",
        collection: true
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><section class="relative overflow-hidden"><div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div><div class="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div><div class="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-200/30 dark:bg-indigo-500/10 blur-3xl"></div><div class="max-w-6xl mx-auto px-4 pt-20 pb-14 lg:pt-28 lg:pb-20 relative"><div class="flex flex-col items-center text-center gap-8"><div class="inline-flex flex-col items-center gap-5"><div class="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-sm">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: isUncategorized.value ? "mdi:tag-off" : "mdi:tag",
        class: "text-3xl"
      }, null, _parent));
      _push(`</div><div class="space-y-5 max-w-3xl"><h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">${ssrInterpolate(displayName.value)}</h1><div class="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium">`);
      if (postCount.value !== null) {
        _push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:book-open-page-variant",
          class: "text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(postCount.value)} ${ssrInterpolate(postCount.value === 1 ? unref(t)("posts.post") : unref(t)("posts.posts"))}</span>`);
      } else if (countLoading.value) {
        _push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50/60 dark:bg-blue-900/20 text-blue-400 dark:text-blue-400 animate-pulse">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:book-open-page-variant",
          class: "text-sm"
        }, null, _parent));
        _push(` \u2026 </span>`);
      } else {
        _push(`<!---->`);
      }
      if (isUncategorized.value) {
        _push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:alert-circle-outline",
          class: "text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("category.noCategory"))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (rssHref$1.value) {
        _push(`<a${ssrRenderAttr("href", rssHref$1.value)} target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[11px] font-semibold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:rss",
          class: "text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("category.followRss"))}</a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (unref(featuresEnabled).search) {
        _push(`<div class="w-full max-w-xl"><div role="button" tabindex="0" aria-label="Open global search" class="group flex items-center h-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm ring-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-none px-4 gap-3">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:magnify",
          class: "text-gray-500 dark:text-gray-400 text-xl"
        }, null, _parent));
        _push(`<span class="flex-1 text-left text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("category.searchAnywhere"))}</span><span class="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium pr-1"><kbd class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[10px] font-mono text-gray-600 dark:text-gray-300 shadow-sm">/</kbd> Open </span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section>`);
      if (categoriesLoaded.value && categories.value.length) {
        _push(`<section class="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm sticky top-0 z-20"><div class="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-track-transparent"><button class="${ssrRenderClass([categoryActive.value === "all" ? activeCatClass : catClass, "flex items-center gap-1 px-3 h-8 rounded-full whitespace-nowrap transition text-xs font-medium"])}">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:infinity",
          class: "text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("common.all"))}</button><!--[-->`);
        ssrRenderList(categories.value, (c) => {
          _push(`<button class="${ssrRenderClass([categoryActive.value === (c.slug || "uncategorized") ? activeCatClass : catClass, "flex items-center gap-1 px-3 h-8 rounded-full whitespace-nowrap transition text-xs font-medium"])}">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:folder",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(c.name || "Uncategorized")}</button>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="relative -mt-4"><div class="max-w-6xl mx-auto px-4 py-12"><h2 class="sr-only">Category Posts</h2>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        filterBy: "category",
        filterValue: _ctx.$route.params.slug
      }, null, _parent));
      _push(`</div></main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/category/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-DIhhmtyy.mjs.map
