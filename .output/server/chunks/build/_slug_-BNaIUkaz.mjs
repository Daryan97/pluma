import { ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { b as useI18n, c as useLocalePath, s as supabase } from './server.mjs';
import { _ as _sfc_main$1, C as Comments } from './Comments-ZmPmGUdU.mjs';
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
    const slug = ref(route.params.slug);
    watch(
      () => route.params.slug,
      (newSlug) => {
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
    async function fetchPost() {
      if (!slug.value) {
        post.value = null;
        loading.value = false;
        return;
      }
      loading.value = true;
      const { data, error } = await supabase.from("posts").select(
        `
      id,
      title,
      content,
      category:categories (
        id,
        name
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
    `
      ).eq("slug", slug.value).single();
      if (error) {
        post.value = null;
      } else if (!data) {
        post.value = null;
      } else {
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
        _push(ssrRenderComponent(_sfc_main$1, {
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
//# sourceMappingURL=_slug_-BNaIUkaz.mjs.map
