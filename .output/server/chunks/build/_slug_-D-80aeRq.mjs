import { ref, computed, watch, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { b as useI18n, c as useLocalePath, s as supabase, a as __nuxt_component_0 } from './server.mjs';
import { _ as _sfc_main$1$1, C as Comments } from './Comments-ZmPmGUdU.mjs';
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
import './utils-BOiLVUQi.mjs';
import './ConfirmDialog-CDJyHT9i.mjs';
import '@headlessui/vue';
import './useToast-DuA5bmqL.mjs';

const _sfc_main$1 = {
  __name: "SeriesNav",
  __ssrInlineRender: true,
  props: {
    series: { type: Object, default: null },
    posts: { type: Array, default: () => [] },
    currentId: { type: String, default: null }
  },
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (__props.series && __props.posts.length) {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/40 p-5" }, _attrs))}><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:bookshelf",
          class: "text-base text-indigo-500"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("series.label", { name: __props.series.name }))}</h2><ol class="list-none space-y-2 p-0 m-0"><!--[-->`);
        ssrRenderList(__props.posts, (p) => {
          _push(`<li class="list-none">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(localePath)(`/posts/${p.slug}`),
            class: [
              "flex items-center gap-2 text-sm rounded-md px-2 py-1.5 transition",
              p.id === __props.currentId ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
            ]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b;
              if (_push2) {
                _push2(`<span class="text-[11px] text-gray-400 w-5 shrink-0 tabular-nums"${_scopeId}>${ssrInterpolate((_a = p.series_order) != null ? _a : "\xB7")}</span><span class="truncate"${_scopeId}>${ssrInterpolate(p.title)}</span>`);
              } else {
                return [
                  createVNode("span", { class: "text-[11px] text-gray-400 w-5 shrink-0 tabular-nums" }, toDisplayString((_b = p.series_order) != null ? _b : "\xB7"), 1),
                  createVNode("span", { class: "truncate" }, toDisplayString(p.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ol></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SeriesNav.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    const route = useRoute();
    const post = ref(null);
    const loading = ref(true);
    const user = ref(null);
    const seriesPosts = ref([]);
    const slug = ref(route.params.slug);
    const isPreview = computed(() => Boolean(route.query.preview));
    const seriesMeta = computed(() => {
      var _a;
      return ((_a = post.value) == null ? void 0 : _a.series) || null;
    });
    watch(
      () => [route.params.slug, route.query.preview],
      ([newSlug]) => {
        slug.value = newSlug;
        fetchPost();
      },
      { immediate: true }
    );
    async function getUser() {
      const {
        data: { user: currentUser }
      } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: profile } = await supabase.from("profiles").select("username, display_name, role, avatar_url").eq("id", currentUser.id).single();
        user.value = profile || null;
      }
    }
    async function loadSeriesPosts(seriesId) {
      if (!seriesId) {
        seriesPosts.value = [];
        return;
      }
      const { data } = await supabase.from("posts").select("id, title, slug, series_order").eq("series_id", seriesId).eq("status", "published").order("series_order", { ascending: true, nullsFirst: false });
      seriesPosts.value = data || [];
    }
    async function fetchPost() {
      if (!slug.value) {
        post.value = null;
        loading.value = false;
        return;
      }
      loading.value = true;
      seriesPosts.value = [];
      const previewToken = typeof route.query.preview === "string" ? route.query.preview : null;
      if (previewToken) {
        const { data: data2, error: error2 } = await supabase.rpc("get_post_by_preview_token", {
          p_token: previewToken
        });
        if (error2 || !data2) {
          post.value = null;
        } else {
          post.value = data2;
          if (data2.series_id) await loadSeriesPosts(data2.series_id);
        }
        loading.value = false;
        return;
      }
      const { data, error } = await supabase.from("posts").select(
        `
      id,
      title,
      content,
      category:categories (
        id,
        name,
        slug
      ),
      series_id,
      series_order,
      tags,
      slug,
      comments_disabled,
      cover_image_url,
      created_at,
      status,
      updated_at,
      author:profiles (
        id,
        username,
        display_name
      )
    `
      ).eq("slug", slug.value).single();
      if (error || !data) {
        post.value = null;
      } else {
        if (data.series_id) {
          const { data: seriesRow } = await supabase.from("series").select("id, name, slug").eq("id", data.series_id).maybeSingle();
          data.series = seriesRow || null;
          await loadSeriesPosts(data.series_id);
        }
        post.value = data;
      }
      loading.value = false;
    }
    watch(
      post,
      (newPost) => {
        return;
      },
      { immediate: true }
    );
    getUser();
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10" }, _attrs))}>`);
      if (isPreview.value) {
        _push(`<div class="mb-6 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-700 px-4 py-2 text-sm text-amber-800 dark:text-amber-200">${ssrInterpolate(unref(t)("posts.previewMode"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value) {
        _push(`<div class="flex justify-center items-center py-32"><div class="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div></div>`);
      } else if (!post.value) {
        _push(`<div class="text-center py-32">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:alert-circle-outline",
          class: "text-5xl text-gray-300 dark:text-gray-600 mb-6"
        }, null, _parent));
        _push(`<p class="text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("posts.notFound"))}</p></div>`);
      } else {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$1$1, {
          post: post.value,
          user: user.value
        }, null, _parent));
        if (seriesMeta.value) {
          _push(ssrRenderComponent(_sfc_main$1, {
            series: seriesMeta.value,
            posts: seriesPosts.value,
            "current-id": post.value.id
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-14">`);
        if (!post.value.comments_disabled && !isPreview.value) {
          _push(ssrRenderComponent(Comments, {
            "post-id": post.value.id,
            "post-author-id": (_a = post.value.author) == null ? void 0 : _a.id
          }, null, _parent));
        } else if (post.value.comments_disabled) {
          _push(`<div class="text-center text-gray-500 dark:text-gray-400 text-sm py-10">${ssrInterpolate(unref(t)("posts.commentsDisabled"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/posts/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-D-80aeRq.mjs.map
