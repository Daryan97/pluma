import { computed, ref, resolveComponent, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, withModifiers, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { u as useI18n, a as useLocalePath, p as projectInfo, d as useBranding } from './server.mjs';
import { Icon } from '@iconify/vue';
import { M as Markdown } from '../_/vue3-markdown-it.umd.min.mjs';
import { _ as _sfc_main$1 } from './NoImage-Df5cAWv5.mjs';
import { u as useSettings } from './settingsStore-B1-8Nave.mjs';
import { u as usePageSeo } from './usePageSeo-wMPCZyUZ.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    useRouter();
    const branding = useBranding();
    const { featuresEnabled } = useSettings();
    const showSearch = computed(() => featuresEnabled.value.search !== false);
    usePageSeo(
      computed(() => {
        var _a;
        const siteName = ((_a = branding.resolveLocalizedSiteName) == null ? void 0 : _a.call(branding, locale.value)) || projectInfo.name || "Pluma";
        return {
          title: `${t("archive.title")} | ${siteName}`,
          description: t("archive.description"),
          type: "website",
          collection: true
        };
      })
    );
    const categories = ref([]);
    const categoriesLoaded = ref(false);
    const categoryActive = ref("all");
    const posts = ref([]);
    const imageErrorMap = ref({});
    function onImageError(id) {
      imageErrorMap.value = { ...imageErrorMap.value, [id]: true };
    }
    const loading = ref(false);
    const noMorePosts = ref(false);
    function getAuthorName(author) {
      if (!author) return t("common.unknownAuthor");
      return author.display_name || author.username;
    }
    function getAuthorUsername(author) {
      if (!author) return "unknown";
      return author.username || author.display_name || "Unknown";
    }
    function getCategoryName(category) {
      return category ? category.name : t("common.uncategorized");
    }
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
    }
    function getExcerptMarkdown(content, maxLength = 200) {
      if (!content) return "";
      const excerpt = content.length > maxLength ? content.slice(0, maxLength) + "..." : content;
      return excerpt;
    }
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><section class="relative overflow-hidden"><div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div><div class="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div><div class="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-200/30 dark:bg-indigo-500/10 blur-3xl"></div><div class="max-w-6xl mx-auto px-4 pt-20 pb-16 lg:pt-28 lg:pb-24 relative"><div class="flex flex-col items-center text-center gap-8"><div class="space-y-5 max-w-3xl"><h1 class="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">${ssrInterpolate(unref(t)("archive.title"))}</h1><p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">${ssrInterpolate(unref(t)("archive.description"))}</p></div>`);
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
          _push(` ${ssrInterpolate(c.name || unref(t)("common.uncategorized"))}</button>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="relative -mt-4"><div class="max-w-6xl mx-auto px-4 py-12"><h2 class="sr-only">${ssrInterpolate(unref(t)("archive.archivedPosts"))}</h2>`);
      if (posts.value.length === 0 && loading.value) {
        _push(`<div class="space-y-10"><!--[-->`);
        ssrRenderList(3, (n) => {
          _push(`<div class="animate-pulse bg-white/90 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm"><div class="h-56 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700"></div><div class="p-6 space-y-5"><div class="h-5 w-2/3 bg-gray-200 dark:bg-gray-600 rounded"></div><div class="flex gap-3"><div class="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div><div class="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div><div class="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded"></div></div><div class="space-y-2"><div class="h-3 w-full bg-gray-200 dark:bg-gray-600 rounded"></div><div class="h-3 w-11/12 bg-gray-200 dark:bg-gray-600 rounded"></div><div class="h-3 w-4/5 bg-gray-200 dark:bg-gray-600 rounded"></div></div><div class="h-9 w-32 bg-gray-200 dark:bg-gray-600 rounded-md"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (posts.value.length === 0 && !loading.value) {
        _push(`<div class="relative text-center py-24 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700/70 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm"><div class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 opacity-60"></div>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:note-remove",
          class: "block mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4"
        }, null, _parent));
        _push(`<p class="text-sm text-gray-600 dark:text-gray-400 font-medium">${ssrInterpolate(unref(t)("archive.noPosts"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-12"><!--[-->`);
      ssrRenderList(posts.value, (post) => {
        var _a;
        _push(`<article class="group relative bg-white/95 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/archive/post/${post.slug}`),
          class: "block group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="relative w-full aspect-[16/8] md:aspect-[16/6] overflow-hidden bg-gray-100 dark:bg-gray-700"${_scopeId}>`);
              if (post.cover_image_url && !imageErrorMap.value[post.id]) {
                _push2(`<img${ssrRenderAttr("src", post.cover_image_url)}${ssrRenderAttr("alt", post.title)} width="1200" height="675" class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]" loading="lazy" decoding="async" draggable="false"${_scopeId}>`);
              } else {
                _push2(`<div class="flex items-center justify-center h-full"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
                _push2(`</div>`);
              }
              _push2(`<div class="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"${_scopeId}></div></div>`);
            } else {
              return [
                createVNode("div", { class: "relative w-full aspect-[16/8] md:aspect-[16/6] overflow-hidden bg-gray-100 dark:bg-gray-700" }, [
                  post.cover_image_url && !imageErrorMap.value[post.id] ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: post.cover_image_url,
                    alt: post.title,
                    width: "1200",
                    height: "675",
                    class: "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]",
                    loading: "lazy",
                    decoding: "async",
                    draggable: "false",
                    onDragstart: withModifiers(() => {
                    }, ["prevent"]),
                    onError: ($event) => onImageError(post.id)
                  }, null, 40, ["src", "alt", "onDragstart", "onError"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "flex items-center justify-center h-full"
                  }, [
                    createVNode(_sfc_main$1)
                  ])),
                  createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" })
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<div class="p-6 md:p-8"><div class="flex flex-wrap items-center gap-3 text-[11px] font-medium mb-4">`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/archive/category/${((_a = post.category) == null ? void 0 : _a.slug) || "uncategorized"}`),
          class: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:folder",
                class: "text-sm"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(getCategoryName(post.category))}`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:folder",
                  class: "text-sm"
                }),
                createTextVNode(" " + toDisplayString(getCategoryName(post.category)), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:calendar",
          class: "text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(formatDate(post.created_at))}</span>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/author/${getAuthorUsername(post.author)}`),
          class: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:account",
                class: "text-sm"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(getAuthorName(post.author))}`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:account",
                  class: "text-sm"
                }),
                createTextVNode(" " + toDisplayString(getAuthorName(post.author)), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/archive/post/${post.slug}`),
          class: "group/title block mb-3"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors"${_scopeId}>${ssrInterpolate(post.title)}</h2>`);
            } else {
              return [
                createVNode("h2", { class: "text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors" }, toDisplayString(post.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<div class="text-sm text-gray-600 dark:text-gray-300 mb-6">`);
        _push(ssrRenderComponent(unref(Markdown), {
          source: getExcerptMarkdown(post == null ? void 0 : post.content, 160),
          class: "markdown-content",
          ref_for: true,
          ref: "markdownContainer"
        }, null, _parent));
        _push(`</div><div class="flex items-center justify-between">`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/archive/post/${post.slug}`),
          class: "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:arrow-right",
                class: "text-base"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("common.readMore"))}`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:arrow-right",
                  class: "text-base"
                }),
                createTextVNode(" " + toDisplayString(unref(t)("common.readMore")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div></article>`);
      });
      _push(`<!--]--></div><div class="h-12"></div>`);
      if (loading.value && posts.value.length > 0) {
        _push(`<div class="flex justify-center py-8">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:loading",
          class: "animate-spin text-blue-500",
          width: "32"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (noMorePosts.value && posts.value.length > 0) {
        _push(`<div class="text-center text-gray-500 mt-8 text-sm">${ssrInterpolate(unref(t)("posts.noMore"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/archive/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B_uLS72B.mjs.map
