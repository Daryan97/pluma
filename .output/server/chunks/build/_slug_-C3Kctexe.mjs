import { ref, computed, resolveComponent, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, withModifiers, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath, b as useContentLocale, p as projectInfo, d as useBranding } from './server.mjs';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { _ as _sfc_main$1 } from './NoImage-Df5cAWv5.mjs';
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
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    useLocalePath();
    useContentLocale();
    const branding = useBranding();
    const route = useRoute();
    useRouter();
    const slug = route.params.slug;
    const loading = ref(true);
    ref("");
    const category = ref(null);
    const posts = ref([]);
    const postCount = ref(null);
    const imageErrorMap = ref({});
    function onImageError(id) {
      imageErrorMap.value = { ...imageErrorMap.value, [id]: true };
    }
    const isUncategorized = computed(() => slug === "uncategorized");
    const displayName = computed(() => {
      var _a;
      return isUncategorized.value ? "Uncategorized" : ((_a = category.value) == null ? void 0 : _a.name) || slug;
    });
    usePageSeo(
      computed(() => {
        var _a;
        const siteName = ((_a = branding.resolveLocalizedSiteName) == null ? void 0 : _a.call(branding, locale.value)) || projectInfo.name || "Pluma";
        return {
          title: `${displayName.value} | ${siteName}`,
          description: `Explore archived posts in ${displayName.value}.`,
          type: "website",
          collection: true
        };
      })
    );
    const categories = ref([]);
    const categoriesLoaded = ref(false);
    const categoryActive = ref(slug || "all");
    function formatDate(d) {
      try {
        return new Date(d).toLocaleDateString();
      } catch {
        return "";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><section class="relative overflow-hidden"><div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div><div class="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div><div class="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-200/30 dark:bg-indigo-500/10 blur-3xl"></div><div class="max-w-6xl mx-auto px-4 pt-20 pb-14 lg:pt-28 lg:pb-20 relative">`);
      if (!loading.value) {
        _push(`<div class="flex flex-col items-center text-center gap-8"><div class="inline-flex flex-col items-center gap-5"><div class="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-sm">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: isUncategorized.value ? "mdi:tag-off" : "mdi:tag",
          class: "text-3xl"
        }, null, _parent));
        _push(`</div><div class="space-y-5 max-w-3xl"><h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"> Archive \xB7 ${ssrInterpolate(displayName.value)}</h1><div class="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium">`);
        if (postCount.value !== null) {
          _push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:book-open-page-variant",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(postCount.value)} ${ssrInterpolate(postCount.value === 1 ? unref(t)("posts.post") : unref(t)("posts.posts"))}</span>`);
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
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
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
      _push(`<main class="relative -mt-4"><div class="max-w-6xl mx-auto px-4 py-12"><h2 class="sr-only">Archived Category Posts</h2>`);
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
      ssrRenderList(posts.value, (p) => {
        _push(`<article class="group relative bg-white/95 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">`);
        _push(ssrRenderComponent(_component_router_link, {
          to: `/archive/post/${p.slug}`,
          class: "block group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="relative w-full aspect-[16/8] md:aspect-[16/6] overflow-hidden bg-gray-100 dark:bg-gray-700"${_scopeId}>`);
              if (p.cover_image_url && !imageErrorMap.value[p.id]) {
                _push2(`<img${ssrRenderAttr("src", p.cover_image_url)}${ssrRenderAttr("alt", p.title)} class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]" loading="lazy" draggable="false"${_scopeId}>`);
              } else {
                _push2(`<div class="flex items-center justify-center h-full"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
                _push2(`</div>`);
              }
              _push2(`<div class="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"${_scopeId}></div></div>`);
            } else {
              return [
                createVNode("div", { class: "relative w-full aspect-[16/8] md:aspect-[16/6] overflow-hidden bg-gray-100 dark:bg-gray-700" }, [
                  p.cover_image_url && !imageErrorMap.value[p.id] ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: p.cover_image_url,
                    alt: p.title,
                    class: "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]",
                    loading: "lazy",
                    draggable: "false",
                    onDragstart: withModifiers(() => {
                    }, ["prevent"]),
                    onError: ($event) => onImageError(p.id)
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
        _push(`<div class="p-6 md:p-8"><div class="flex flex-wrap items-center gap-3 text-[11px] font-medium mb-4"><span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:calendar",
          class: "text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(formatDate(p.created_at))}</span></div>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: `/archive/post/${p.slug}`,
          class: "group/title block mb-3"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors"${_scopeId}>${ssrInterpolate(p.title)}</h2>`);
            } else {
              return [
                createVNode("h2", { class: "text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors" }, toDisplayString(p.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<div class="flex items-center justify-between">`);
        _push(ssrRenderComponent(_component_router_link, {
          to: `/archive/post/${p.slug}`,
          class: "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:arrow-right",
                class: "text-base"
              }, null, _parent2, _scopeId));
              _push2(` Read More `);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:arrow-right",
                  class: "text-base"
                }),
                createTextVNode(" Read More ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div></article>`);
      });
      _push(`<!--]--></div></div></main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/archive/category/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-C3Kctexe.mjs.map
