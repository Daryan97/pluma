import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { b as useI18n, c as useLocalePath, p as projectInfo } from './server.mjs';
import { _ as _sfc_main$1 } from './PostLoader-Dw7v60eC.mjs';
import { Icon } from '@iconify/vue';
import { u as useStatsSettings } from './statsSettingsStore-CFmMBcUt.mjs';
import { u as useSettings } from './settingsStore-C3tJgnC4.mjs';
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
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import '@supabase/supabase-js';
import 'radix-vue';
import '../_/vue3-markdown-it.umd.min.mjs';
import './NoImage-Df5cAWv5.mjs';
import './useToast-DuA5bmqL.mjs';

const catClass = "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700";
const activeCatClass = "bg-blue-600 text-white dark:bg-blue-500 dark:text-white border-blue-600 dark:border-blue-500 shadow";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    useRouter();
    const categories = ref([]);
    const categoriesLoaded = ref(false);
    const categoryActive = ref("all");
    const stats = ref([
      { key: "posts", label: t("home.stats.posts"), value: "\u2014" },
      { key: "categories", label: t("home.stats.categories"), value: "\u2014" },
      { key: "authors", label: t("home.stats.authors"), value: "\u2014" }
    ]);
    const statsLoaded = ref(false);
    const { statsEnabled } = useStatsSettings();
    const { featuresEnabled } = useSettings();
    const enabledStats = computed(() => stats.value.filter((s) => statsEnabled.value[s.key]));
    const statsGridStyle = computed(() => ({
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))"
    }));
    const latestPost = ref(null);
    const showWelcome = computed(() => featuresEnabled.value.welcome !== false);
    const showSiteName = computed(() => featuresEnabled.value.siteName !== false);
    const showSiteDescription = computed(() => featuresEnabled.value.siteDescription !== false);
    const showSearch = computed(() => featuresEnabled.value.search !== false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><section class="relative overflow-hidden"><div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div><div class="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div><div class="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-200/30 dark:bg-indigo-500/10 blur-3xl"></div><div class="max-w-6xl mx-auto px-4 pt-20 pb-16 lg:pt-28 lg:pb-24 relative"><div class="flex flex-col items-center text-center gap-8"><div class="space-y-5 max-w-3xl">`);
      if (showWelcome.value) {
        _push(`<div class="w-full flex justify-center">`);
        if (latestPost.value) {
          _push(`<button type="button" class="group flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-4 py-2 w-full max-w-lg sm:w-auto sm:max-w-none rounded-full text-[11px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition text-center"${ssrRenderAttr("aria-label", "Open latest post: " + latestPost.value.title)}>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:star-four-points",
            class: "text-base shrink-0 mx-auto sm:mx-0"
          }, null, _parent));
          _push(`<span class="flex-1 text-center sm:text-left leading-snug break-words"${ssrRenderAttr("title", latestPost.value.title)}>${ssrInterpolate(latestPost.value.title)}</span>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:arrow-right",
            class: "text-sm shrink-0 mx-auto sm:mx-0 opacity-60 group-hover:translate-x-0.5 transition-transform"
          }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<span class="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 rounded-full text-[11px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:lightning-bolt",
            class: "text-base"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("home.welcome"))}</span>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (showSiteName.value) {
        _push(`<h1 class="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">${ssrInterpolate(unref(projectInfo).name)}</h1>`);
      } else {
        _push(`<!---->`);
      }
      if (showSiteDescription.value) {
        _push(`<p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">${ssrInterpolate(unref(projectInfo).description || unref(t)("home.defaultDescription"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (showSearch.value) {
        _push(`<div class="w-full max-w-xl"><div role="button" tabindex="0"${ssrRenderAttr("aria-label", unref(t)("nav.search"))} class="group flex items-center h-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm ring-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-none px-4 gap-3">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:magnify",
          class: "text-gray-500 dark:text-gray-400 text-xl"
        }, null, _parent));
        _push(`<span class="flex-1 text-left text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("home.searchPlaceholder"))}</span><span class="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium pr-1"><kbd class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[10px] font-mono text-gray-600 dark:text-gray-300 shadow-sm">/</kbd> ${ssrInterpolate(unref(t)("common.open"))}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (statsLoaded.value && enabledStats.value.length > 0) {
        _push(`<div class="max-w-2xl w-full pt-4"><div class="grid gap-6" style="${ssrRenderStyle(statsGridStyle.value)}"><!--[-->`);
        ssrRenderList(enabledStats.value, (s) => {
          _push(`<div class="text-center"><div class="text-2xl font-bold text-gray-900 dark:text-gray-100">${ssrInterpolate(s.value)}</div><div class="mt-1 text-[11px] uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400">${ssrInterpolate(s.label)}</div></div>`);
        });
        _push(`<!--]--></div></div>`);
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
          _push(`<button class="${ssrRenderClass([
            categoryActive.value === (c.slug || "uncategorized") ? activeCatClass : catClass,
            "flex items-center gap-1 px-3 h-8 rounded-full whitespace-nowrap transition text-xs font-medium"
          ])}">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:folder",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(c.name || unref(t)("common.uncategorized"))}</button>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="relative -mt-4"><div class="max-w-6xl mx-auto px-4 py-12"><h2 class="sr-only">${ssrInterpolate(unref(t)("home.latestPosts"))}</h2>`);
      _push(ssrRenderComponent(_sfc_main$1, { filterBy: "home" }, null, _parent));
      _push(`</div></main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CqXnXryy.mjs.map
