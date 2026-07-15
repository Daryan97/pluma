import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath } from './server.mjs';
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { A as ALL_PROVIDERS, u as useSettings } from './settingsStore-B1-8Nave.mjs';
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

const COLLAPSED_COUNT = 8;
const _sfc_main = {
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const { t } = useI18n();
    useLocalePath();
    useRouter();
    const authUser = ref({});
    const profile = ref(null);
    const avatarUrl = ref(null);
    ref(null);
    const avatarPreview = ref(null);
    const uploadingAvatar = ref(false);
    ref(null);
    const editMode = ref(false);
    const emailEdit = ref(false);
    const usernameInput = ref("");
    const displayNameInput = ref("");
    const emailAuthInput = ref("");
    const savingEmail = ref(false);
    ref("");
    const { providersEnabled, providerLabel, providerIcon, brandBg, brandBorder, providerGlyphColor } = useSettings();
    const enabledProviders = computed(
      () => ALL_PROVIDERS.filter((p) => {
        var _a;
        return ((_a = providersEnabled.value) == null ? void 0 : _a[p]) === true;
      })
    );
    const expanded = ref(false);
    const hasOverflow = computed(() => enabledProviders.value.length > COLLAPSED_COUNT);
    const visibleProviders = computed(
      () => expanded.value ? enabledProviders.value : enabledProviders.value.slice(0, COLLAPSED_COUNT)
    );
    const isLinked = (provider) => {
      var _a;
      return !!((_a = authUser.value.identities) == null ? void 0 : _a.some((i) => i.provider === provider));
    };
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl mx-auto px-4 py-8" }, _attrs))}><h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">${ssrInterpolate(unref(t)("profile.title"))}</h1><div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto"><section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col"><header class="flex items-center mb-4"><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:shield-account",
        class: "flex-shrink-0 text-blue-500 dark:text-blue-400 text-xl"
      }, null, _parent));
      _push(`<h2 class="flex items-center text-base font-semibold tracking-wide text-gray-700 dark:text-gray-200">${ssrInterpolate(unref(t)("profile.authentication"))}</h2></div></header>`);
      if (!emailEdit.value) {
        _push(`<div><dl class="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"><dt class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:identification-card",
          class: "text-blue-500 dark:text-blue-400 text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("profile.id"))}</dt><dd class="truncate">${ssrInterpolate(authUser.value.id)}</dd><dt class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:email-outline",
          class: "text-blue-500 dark:text-blue-400 text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("auth.email"))}</dt><dd class="break-all flex items-center gap-3 flex-wrap"><span>${ssrInterpolate(authUser.value.email)}</span>`);
        if (!emailEdit.value) {
          _push(`<button class="inline-flex items-center h-7 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500">${ssrInterpolate(unref(t)("common.change"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</dd><dt class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:key",
          class: "text-blue-500 dark:text-blue-400 text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("auth.password"))}</dt><dd class="flex items-center gap-3"><span class="text-gray-500 dark:text-gray-400 italic">${ssrInterpolate(unref(t)("common.hidden"))}</span><button class="inline-flex items-center h-7 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500">${ssrInterpolate(unref(t)("common.change"))}</button></dd><dt class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:calendar-check",
          class: "text-blue-500 dark:text-blue-400 text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("profile.created"))}</dt><dd>${ssrInterpolate(formatDate(authUser.value.created_at))}</dd></dl></div>`);
      } else {
        _push(`<div><form><div class="mb-2"><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">${ssrInterpolate(unref(t)("profile.newEmail"))}</label><input${ssrRenderAttr("value", emailAuthInput.value)} type="email" class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"></div><div class="mt-4 flex space-x-2"><button type="submit"${ssrIncludeBooleanAttr(savingEmail.value) ? " disabled" : ""} class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500">${ssrInterpolate(savingEmail.value ? unref(t)("auth.sending") : unref(t)("profile.sendChangeRequest"))}</button><button type="button" class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400">${ssrInterpolate(unref(t)("common.cancel"))}</button></div></form></div>`);
      }
      _push(`</section><section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col"><header class="flex justify-between items-center mb-4"><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:account",
        class: "flex-shrink-0 text-blue-500 dark:text-blue-400 text-xl"
      }, null, _parent));
      _push(`<h2 class="flex items-center text-base font-semibold tracking-wide text-gray-700 dark:text-gray-200">${ssrInterpolate(unref(t)("profile.profileSection"))}</h2></div>`);
      if (!editMode.value) {
        _push(`<button class="inline-flex items-center h-7 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500">${ssrInterpolate(unref(t)("common.edit"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
      if (!editMode.value) {
        _push(`<div><dl class="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"><dt class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:account-circle",
          class: "text-blue-500 dark:text-blue-400 text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("profile.username"))}</dt><dd class="truncate">${ssrInterpolate(((_a = profile.value) == null ? void 0 : _a.username) || unref(t)("common.na"))}</dd><dt class="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:account-box",
          class: "text-blue-500 dark:text-blue-400 text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("profile.display"))}</dt><dd class="truncate">${ssrInterpolate(((_b = profile.value) == null ? void 0 : _b.display_name) || unref(t)("common.na"))}</dd></dl></div>`);
      } else {
        _push(`<div><form><div class="mb-2"><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">${ssrInterpolate(unref(t)("auth.username"))}:</label><input${ssrRenderAttr("value", usernameInput.value)} class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required></div><div class="mb-2"><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">${ssrInterpolate(unref(t)("profile.displayName"))}</label><input${ssrRenderAttr("value", displayNameInput.value)} class="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required></div><div class="mt-4 flex space-x-2"><button type="submit" class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500">${ssrInterpolate(unref(t)("common.save"))}</button><button type="button" class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400">${ssrInterpolate(unref(t)("common.cancel"))}</button></div></form></div>`);
      }
      _push(`</section><section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col md:col-span-2 lg:col-span-1"><header class="flex items-center justify-between mb-4"><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:account-circle-outline",
        class: "flex-shrink-0 text-blue-500 dark:text-blue-400 text-xl"
      }, null, _parent));
      _push(`<h2 class="flex items-center text-base font-semibold tracking-wide text-gray-700 dark:text-gray-200">${ssrInterpolate(unref(t)("profile.avatar"))}</h2></div>`);
      if (avatarUrl.value && !uploadingAvatar.value) {
        _push(`<button class="inline-flex items-center h-7 px-3 rounded-md text-[11px] font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-500">${ssrInterpolate(unref(t)("common.remove"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><div class="flex flex-col items-center gap-4"><input type="file" accept="image/*" class="hidden"><div class="relative"><button type="button" class="relative group w-32 h-32 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition">`);
      if (avatarUrl.value && !avatarPreview.value) {
        _push(`<img${ssrRenderAttr("src", avatarUrl.value)}${ssrRenderAttr("alt", unref(t)("profile.avatar"))} class="w-full h-full object-cover">`);
      } else if (avatarPreview.value) {
        _push(`<img${ssrRenderAttr("src", avatarPreview.value)}${ssrRenderAttr("alt", unref(t)("profile.newAvatarPreviewAlt"))} class="w-full h-full object-cover opacity-90">`);
      } else {
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:account",
          class: "text-6xl text-gray-400"
        }, null, _parent));
      }
      _push(`<div class="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:camera",
        class: "text-white text-xl mb-1"
      }, null, _parent));
      _push(`<span class="text-[11px] tracking-wide font-medium text-white">${ssrInterpolate(unref(t)("profile.clickToChange"))}</span></div></button>`);
      if (avatarPreview.value) {
        _push(`<div class="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-[10px] font-semibold shadow ring-2 ring-white dark:ring-gray-800 select-none">${ssrInterpolate(unref(t)("profile.preview"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (avatarPreview.value) {
        _push(`<div class="flex gap-2"><button${ssrIncludeBooleanAttr(uploadingAvatar.value) ? " disabled" : ""} class="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: uploadingAvatar.value ? "mdi:loading" : "mdi:upload",
          class: [uploadingAvatar.value ? "animate-spin" : "", "text-sm"]
        }, null, _parent));
        _push(`<span>${ssrInterpolate(uploadingAvatar.value ? unref(t)("common.uploading") : unref(t)("common.save"))}</span></button><button${ssrIncludeBooleanAttr(uploadingAvatar.value) ? " disabled" : ""} class="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:close",
          class: "text-sm"
        }, null, _parent));
        _push(`<span>${ssrInterpolate(unref(t)("common.cancel"))}</span></button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!avatarPreview.value) {
        _push(`<p class="text-[11px] text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("profile.clickAvatarHint"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
      if (enabledProviders.value.length > 0) {
        _push(`<section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col md:col-span-3 lg:col-span-3"><header class="flex items-center justify-between mb-4"><div class="flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:link",
          class: "flex-shrink-0 text-blue-500 dark:text-blue-400 text-xl"
        }, null, _parent));
        _push(`<h2 class="flex items-center text-base font-semibold tracking-wide text-gray-700 dark:text-gray-200">${ssrInterpolate(unref(t)("profile.linkedAccounts"))}</h2></div></header><div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"><!--[-->`);
        ssrRenderList(visibleProviders.value, (provider) => {
          _push(`<div class="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40 p-5 flex flex-col items-center text-center transition shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500"><div class="w-14 h-14 rounded-full flex items-center justify-center shadow-inner mb-2 border transition" style="${ssrRenderStyle({ backgroundColor: unref(brandBg)(provider), borderColor: unref(brandBorder)(provider) })}">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: unref(providerIcon)(provider),
            class: "text-3xl",
            style: { color: unref(providerGlyphColor)(provider) || void 0 }
          }, null, _parent));
          _push(`</div><span class="font-medium text-gray-800 dark:text-gray-200 text-xs tracking-wide">${ssrInterpolate(unref(providerLabel)(provider))}</span><div class="mt-3">`);
          if (!isLinked(provider)) {
            _push(`<button class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500">`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:link",
              class: "text-sm"
            }, null, _parent));
            _push(`<span>${ssrInterpolate(unref(t)("profile.link"))}</span></button>`);
          } else {
            _push(`<button class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[11px] font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-500">`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "tabler:unlink",
              class: "text-sm"
            }, null, _parent));
            _push(`<span>${ssrInterpolate(unref(t)("profile.unlink"))}</span></button>`);
          }
          _push(`</div><div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-500/5 to-transparent"></div></div>`);
        });
        _push(`<!--]--></div>`);
        if (hasOverflow.value) {
          _push(`<div class="flex justify-center mt-2"><button type="button" class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">${ssrInterpolate(expanded.value ? unref(t)("common.showLess") : unref(t)("common.showMore", { count: enabledProviders.value.length - COLLAPSED_COUNT }))}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-BIy3O2VW.mjs.map
