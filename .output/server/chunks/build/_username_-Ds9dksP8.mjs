import { ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './PostLoader-Dw7v60eC.mjs';
import { Icon } from '@iconify/vue';
import { b as useI18n, c as useLocalePath, s as supabase } from './server.mjs';
import { useRoute } from 'vue-router';
import { u as useSettings } from './settingsStore-C3tJgnC4.mjs';
import '../_/vue3-markdown-it.umd.min.mjs';
import './NoImage-Df5cAWv5.mjs';
import './useToast-DuA5bmqL.mjs';
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

const _sfc_main = {
  __name: "[username]",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    const { featuresEnabled } = useSettings();
    const route = useRoute();
    const author = ref(null);
    const loading = ref(false);
    const postCount = ref(null);
    function roleLabel(role) {
      const key = `roles.${role}`;
      const translated = t(key);
      return translated === key ? role : translated;
    }
    const rssHref = computed(() => {
      return "";
    });
    async function fetchAuthor() {
      loading.value = true;
      author.value = null;
      postCount.value = null;
      const username = route.params.username;
      const { data, error } = await supabase.from("profiles").select("id, username, display_name, avatar_url, role").eq("username", username).single();
      if (!error && data) {
        author.value = data;
        const { count } = await supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published").eq("author_id", data.id);
        postCount.value = typeof count === "number" ? count : 0;
      }
      loading.value = false;
    }
    watch(() => route.params.username, fetchAuthor);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-5xl mx-auto" }, _attrs))}>`);
      if (!loading.value && author.value) {
        _push(`<div class="mt-10 mb-12 text-center"><div class="inline-flex flex-col items-center gap-4"><div class="relative"><div class="w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-sm">`);
        if (author.value.avatar_url) {
          _push(`<img${ssrRenderAttr("src", author.value.avatar_url)}${ssrRenderAttr("alt", author.value.display_name || author.value.username)} class="w-full h-full object-cover" loading="lazy" draggable="false">`);
        } else {
          _push(`<span class="text-3xl font-semibold text-gray-500 dark:text-gray-400 select-none">${ssrInterpolate((author.value.display_name || author.value.username || "?").charAt(0).toUpperCase())}</span>`);
        }
        _push(`</div></div><div><h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">${ssrInterpolate(author.value.display_name || author.value.username)}</h1><div class="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium"><span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:at",
          class: "text-sm"
        }, null, _parent));
        _push(`@${ssrInterpolate(author.value.username)}</span>`);
        if (postCount.value !== null) {
          _push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:book-open-variant",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(postCount.value)} ${ssrInterpolate(postCount.value === 1 ? unref(t)("posts.post") : unref(t)("posts.posts"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (author.value.role) {
          _push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 capitalize">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:shield-account",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(roleLabel(author.value.role))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (rssHref.value) {
          _push(`<a${ssrRenderAttr("href", rssHref.value)} target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[11px] font-semibold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:rss",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("author.followRss"))}</a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value) {
        _push(`<div class="mt-10 mb-12 flex flex-col items-center animate-pulse"><div class="w-28 h-28 rounded-2xl bg-gray-200 dark:bg-gray-700 mb-4"></div><div class="h-7 w-48 rounded bg-gray-200 dark:bg-gray-700 mb-3"></div><div class="flex gap-2"><div class="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700"></div><div class="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700"></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!loading.value && !author.value) {
        _push(`<div class="text-center my-24">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:account-off",
          class: "text-5xl text-gray-400 mb-4"
        }, null, _parent));
        _push(`<p class="text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(unref(t)("author.notFound"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(featuresEnabled).search && author.value) {
        _push(`<div class="w-full max-w-xl mx-auto mb-8"><div role="button" tabindex="0"${ssrRenderAttr("aria-label", unref(t)("nav.search"))} class="group flex items-center h-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm ring-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-none px-4 gap-3">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:magnify",
          class: "text-gray-500 dark:text-gray-400 text-xl"
        }, null, _parent));
        _push(`<span class="flex-1 text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">${ssrInterpolate(unref(t)("author.searchAnywhere"))}</span><span class="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium pr-1"><kbd class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[10px] font-mono text-gray-600 dark:text-gray-300 shadow-sm">/</kbd> ${ssrInterpolate(unref(t)("common.open"))}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (author.value) {
        _push(ssrRenderComponent(_sfc_main$1, {
          filterBy: "author",
          filterValue: _ctx.$route.params.username
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/author/[username].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_username_-Ds9dksP8.mjs.map
