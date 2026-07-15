import { ref, computed, withAsyncContext, watch, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { u as useI18n, b as useContentLocale, f as useAsyncData, p as projectInfo, s as supabase, d as useBranding, a as useLocalePath, g as __nuxt_component_0$1 } from './server.mjs';
import { P as PostPageSkeleton, _ as _sfc_main$2, C as Comments } from './PostPageSkeleton-CI_koHcl.mjs';
import { u as usePageSeo, a as articleSeoFromPost } from './usePageSeo-wMPCZyUZ.mjs';
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
import '../_/vue3-markdown-it.umd.min.mjs';
import './NoImage-Df5cAWv5.mjs';
import './utils-ScxCRkhj.mjs';
import './ConfirmDialog-BMJpAaMk.mjs';
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
      const _component_NuxtLink = __nuxt_component_0$1;
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
const POST_SELECT = `
  id,
  title,
  content,
  locale,
  category:categories (
    id,
    name,
    slug,
    locale
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
`;
const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { t, locale } = useI18n();
    const { contentLocale } = useContentLocale();
    const route = useRoute();
    const branding = useBranding();
    const post = ref(null);
    const loading = ref(false);
    const user = ref(null);
    const seriesPosts = ref([]);
    const isPreview = computed(() => Boolean(route.query.preview));
    const seriesMeta = computed(() => {
      var _a;
      return ((_a = post.value) == null ? void 0 : _a.series) || null;
    });
    async function loadSeriesPosts(seriesId) {
      if (!seriesId) {
        seriesPosts.value = [];
        return;
      }
      const { data } = await supabase.from("posts").select("id, title, slug, series_order, locale").eq("series_id", seriesId).eq("status", "published").eq("locale", contentLocale.value).order("series_order", { ascending: true, nullsFirst: false });
      seriesPosts.value = data || [];
    }
    async function fetchPostPayload(slug2, previewToken2, locale2) {
      if (!slug2) return null;
      if (previewToken2) {
        const { data: data2, error: error2 } = await supabase.rpc("get_post_by_preview_token", {
          p_token: previewToken2
        });
        if (error2 || !data2) return null;
        if (data2.series_id) {
          const { data: seriesRow } = await supabase.from("series").select("id, name, slug").eq("id", data2.series_id).maybeSingle();
          data2.series = seriesRow || null;
        }
        return data2;
      }
      const { data, error } = await supabase.from("posts").select(POST_SELECT).eq("slug", slug2).eq("locale", locale2).maybeSingle();
      if (error || !data) return null;
      if (data.series_id) {
        const { data: seriesRow } = await supabase.from("series").select("id, name, slug").eq("id", data.series_id).maybeSingle();
        data.series = seriesRow || null;
      }
      return data;
    }
    const slug = computed(() => route.params.slug);
    const previewToken = computed(
      () => typeof route.query.preview === "string" ? route.query.preview : null
    );
    const { data: asyncPost, pending } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      () => `post-${slug.value}-${contentLocale.value}-${previewToken.value || "pub"}`,
      async () => {
        const data = await fetchPostPayload(
          slug.value,
          previewToken.value,
          contentLocale.value
        );
        return data;
      },
      { watch: [slug, contentLocale, previewToken], server: true }
    )), __temp = await __temp, __restore(), __temp);
    watch(
      asyncPost,
      async (data) => {
        post.value = data || null;
        if (data == null ? void 0 : data.series_id) {
          await loadSeriesPosts(data.series_id);
        } else {
          seriesPosts.value = [];
        }
      },
      { immediate: true }
    );
    const siteName = computed(
      () => {
        var _a;
        return ((_a = branding.resolveLocalizedSiteName) == null ? void 0 : _a.call(branding, locale.value)) || projectInfo.name || "Pluma";
      }
    );
    usePageSeo(
      computed(() => {
        if (post.value) {
          return articleSeoFromPost(post.value, siteName.value);
        }
        if (!pending.value && !loading.value) {
          return {
            title: `${t("posts.notFoundTitle")} | ${siteName.value}`,
            description: t("posts.notFoundMeta"),
            type: "website",
            robots: "noindex, follow"
          };
        }
        return {
          title: siteName.value,
          type: "website"
        };
      })
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10" }, _attrs))}>`);
      if (isPreview.value) {
        _push(`<div class="mb-6 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-700 px-4 py-2 text-sm text-amber-800 dark:text-amber-200">${ssrInterpolate(unref(t)("posts.previewMode"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(pending) || loading.value) {
        _push(ssrRenderComponent(PostPageSkeleton, null, null, _parent));
      } else if (!post.value) {
        _push(`<div class="text-center py-32">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:alert-circle-outline",
          class: "text-5xl text-gray-300 dark:text-gray-600 mb-6"
        }, null, _parent));
        _push(`<p class="text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("posts.notFound"))}</p></div>`);
      } else {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$2, {
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
//# sourceMappingURL=_slug_-FoYfbwb1.mjs.map
