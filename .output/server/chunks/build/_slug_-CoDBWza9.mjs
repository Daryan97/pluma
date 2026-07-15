import { ref, computed, withAsyncContext, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { u as useI18n, b as useContentLocale, f as useAsyncData, s as supabase, p as projectInfo, d as useBranding } from './server.mjs';
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

const POST_SELECT = `
  id,
  title,
  content,
  locale,
  category:categories (
    id,
    name,
    locale
  ),
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
    const slug = computed(() => route.params.slug);
    const { data: asyncPost, pending } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      () => `archive-post-${slug.value}-${contentLocale.value}`,
      async () => {
        if (!slug.value) return null;
        const { data, error } = await supabase.from("posts").select(POST_SELECT).eq("slug", slug.value).eq("locale", contentLocale.value).maybeSingle();
        if (error || !data) return null;
        return data;
      },
      { watch: [slug, contentLocale], server: true }
    )), __temp = await __temp, __restore(), __temp);
    watch(
      asyncPost,
      (data) => {
        post.value = data || null;
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
        return { title: siteName.value, type: "website" };
      })
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10" }, _attrs))}>`);
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
        _push(`<div class="mt-14">`);
        if (!post.value.comments_disabled) {
          _push(ssrRenderComponent(Comments, {
            "post-id": post.value.id,
            "post-author-id": (_a = post.value.author) == null ? void 0 : _a.id
          }, null, _parent));
        } else {
          _push(`<div class="text-center text-gray-500 dark:text-gray-400 text-sm py-10">${ssrInterpolate(unref(t)("posts.commentsDisabled"))}</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/archive/post/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-CoDBWza9.mjs.map
