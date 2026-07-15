import { b as useI18n, c as useLocalePath, a as __nuxt_component_0 } from './server.mjs';
import { ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderDynamicModel, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import { A as ALL_PROVIDERS, u as useSettings } from './settingsStore-C3tJgnC4.mjs';
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

const COLLAPSED_COUNT = 6;
const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const loginLoading = ref(false);
    const magicLinkLoading = ref(false);
    const forgotLoading = ref(false);
    useRouter();
    useRoute();
    const { providersEnabled, providerLabel, providerIcon, brandBg, brandBorder, providerGlyphColor } = useSettings();
    const enabledProviders = computed(
      () => ALL_PROVIDERS.filter((p) => {
        var _a;
        return ((_a = providersEnabled.value) == null ? void 0 : _a[p]) === true;
      })
    );
    const expanded = ref(false);
    const smallGridMode = computed(() => enabledProviders.value.length > 3);
    const hasOverflow = computed(() => smallGridMode.value && enabledProviders.value.length > COLLAPSED_COUNT);
    const visibleProviders = computed(
      () => expanded.value || !smallGridMode.value ? enabledProviders.value : enabledProviders.value.slice(0, COLLAPSED_COUNT)
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-md mx-auto mt-14 mb-20" }, _attrs))}><div class="mb-8 text-center"><div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-sm mb-4">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:login",
        class: "text-3xl"
      }, null, _parent));
      _push(`</div><h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">${ssrInterpolate(unref(t)("auth.welcomeBack"))}</h1><p class="mt-2 text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(unref(t)("auth.signInContinue"))}</p></div><div class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"><form class="space-y-5" novalidate><div><label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:email-outline",
        class: "text-base text-blue-500"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("auth.email"))}</label><input${ssrRenderAttr("value", email.value)} type="email" autocomplete="email"${ssrRenderAttr("placeholder", unref(t)("auth.email"))} class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500" required></div><div><div class="flex items-center justify-between mb-1"><label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:lock-outline",
        class: "text-base text-blue-500"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("auth.password"))}</label><button type="button" class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"${ssrIncludeBooleanAttr(forgotLoading.value || loginLoading.value || magicLinkLoading.value) ? " disabled" : ""}>`);
      if (!forgotLoading.value) {
        _push(`<span>${ssrInterpolate(unref(t)("auth.forgot"))}</span>`);
      } else {
        _push(`<span>${ssrInterpolate(unref(t)("auth.sending"))}</span>`);
      }
      _push(`</button></div><div class="relative"><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)} autocomplete="current-password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500" required><button type="button"${ssrRenderAttr("aria-label", showPassword.value ? unref(t)("auth.hidePassword") : unref(t)("auth.showPassword"))} class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: showPassword.value ? "mdi:eye-off-outline" : "mdi:eye-outline",
        class: "text-lg"
      }, null, _parent));
      _push(`</button></div></div><button type="submit" class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none"${ssrIncludeBooleanAttr(loginLoading.value || magicLinkLoading.value || forgotLoading.value) ? " disabled" : ""}>`);
      if (loginLoading.value) {
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:loading",
          class: "animate-spin"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:login",
          class: "text-lg"
        }, null, _parent));
      }
      _push(`<span>${ssrInterpolate(loginLoading.value ? unref(t)("auth.loggingIn") : unref(t)("auth.login"))}</span></button><button type="button" class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none"${ssrIncludeBooleanAttr(magicLinkLoading.value || loginLoading.value || forgotLoading.value) ? " disabled" : ""}>`);
      if (magicLinkLoading.value) {
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:loading",
          class: "animate-spin"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:magic-staff",
          class: "text-lg"
        }, null, _parent));
      }
      _push(`<span>${ssrInterpolate(magicLinkLoading.value ? unref(t)("auth.sendingLink") : unref(t)("auth.sendMagicLink"))}</span></button>`);
      if (enabledProviders.value.length > 0) {
        _push(`<div class="space-y-4"><div class="relative"><div class="absolute inset-0 flex items-center" aria-hidden="true"><div class="w-full border-t border-gray-200 dark:border-gray-700"></div></div><div class="relative flex justify-center"><span class="bg-white dark:bg-gray-800 px-3 text-[11px] font-medium text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("auth.orContinueWith"))}</span></div></div>`);
        if (!smallGridMode.value) {
          _push(`<div class="grid gap-2 text-black"><!--[-->`);
          ssrRenderList(enabledProviders.value, (provider) => {
            _push(`<button type="button" class="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-md text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 hover:brightness-105" style="${ssrRenderStyle({ backgroundColor: unref(brandBg)(provider), borderColor: unref(brandBorder)(provider) })}"${ssrIncludeBooleanAttr(loginLoading.value || magicLinkLoading.value || forgotLoading.value) ? " disabled" : ""}${ssrRenderAttr("aria-label", unref(t)("auth.continueWith", { provider: unref(providerLabel)(provider) }))}>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: unref(providerIcon)(provider),
              class: "text-base",
              style: { color: unref(providerGlyphColor)(provider) || void 0 }
            }, null, _parent));
            _push(`<span>${ssrInterpolate(unref(providerLabel)(provider))}</span></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="flex flex-wrap justify-center gap-2"><!--[-->`);
          ssrRenderList(visibleProviders.value, (provider) => {
            _push(`<button type="button"${ssrRenderAttr("title", unref(providerLabel)(provider))}${ssrRenderAttr("aria-label", unref(t)("auth.continueWith", { provider: unref(providerLabel)(provider) }))} class="inline-flex items-center justify-center h-10 w-10 rounded-md text-gray-700 dark:text-gray-300 hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none border" style="${ssrRenderStyle({ backgroundColor: unref(brandBg)(provider), borderColor: unref(brandBorder)(provider) })}"${ssrIncludeBooleanAttr(loginLoading.value || magicLinkLoading.value || forgotLoading.value) ? " disabled" : ""}>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: unref(providerIcon)(provider),
              class: "text-base",
              style: { color: unref(providerGlyphColor)(provider) || void 0 }
            }, null, _parent));
            _push(`<span class="sr-only">${ssrInterpolate(unref(providerLabel)(provider))}</span></button>`);
          });
          _push(`<!--]--></div>`);
        }
        if (smallGridMode.value && hasOverflow.value) {
          _push(`<div class="flex justify-center"><button type="button" class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">${ssrInterpolate(expanded.value ? unref(t)("common.showLess") : unref(t)("common.showMore", { count: enabledProviders.value.length - COLLAPSED_COUNT }))}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="text-[13px] text-gray-600 dark:text-gray-400 pt-2 text-center">${ssrInterpolate(unref(t)("auth.noAccount"))} `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/signup"),
        class: "text-blue-600 dark:text-blue-400 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("auth.signup"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("auth.signup")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-BKez3e7t.mjs.map
