import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderDynamicModel, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
import { u as useI18n, a as useLocalePath } from './server.mjs';
import { Icon } from '@iconify/vue';
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

const _sfc_main = {
  __name: "change-password",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    useRouter();
    useRoute();
    const password = ref("");
    const passwordStrength = ref({ percent: 0, label: t("auth.passwordStrength.weak"), barClass: "bg-red-400 dark:bg-red-500", textClass: "text-red-500 dark:text-red-400" });
    const errorMsg = ref(null);
    const success = ref(false);
    const loading = ref(false);
    const authenticated = ref(false);
    const showPassword = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      if (authenticated.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-md mx-auto mt-14 mb-20" }, _attrs))}><div class="mb-8 text-center"><div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-sm mb-4">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:lock-reset",
          class: "text-3xl"
        }, null, _parent));
        _push(`</div><h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">${ssrInterpolate(unref(t)("auth.changePassword"))}</h1><p class="mt-2 text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(unref(t)("auth.enterNewPassword"))}</p></div><div class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"><form class="space-y-5" novalidate><div><div class="flex items-center justify-between mb-1"><label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:lock-outline",
          class: "text-base text-blue-500"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("auth.newPassword"))}</label><span class="text-[11px] text-gray-400 dark:text-gray-500">${ssrInterpolate(unref(t)("auth.minPassword"))}</span></div><div class="relative group"><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)} autocomplete="new-password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500" required><button type="button"${ssrRenderAttr("aria-label", showPassword.value ? unref(t)("auth.hidePassword") : unref(t)("auth.showPassword"))} class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: showPassword.value ? "mdi:eye-off-outline" : "mdi:eye-outline",
          class: "text-lg"
        }, null, _parent));
        _push(`</button></div><div class="mt-1 flex items-center gap-2 text-[11px]"><div class="flex-1 h-1 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden"><div class="${ssrRenderClass(["h-full transition-all", passwordStrength.value.barClass])}" style="${ssrRenderStyle({ width: passwordStrength.value.percent + "%" })}"></div></div><span class="${ssrRenderClass(["font-medium", passwordStrength.value.textClass])}">${ssrInterpolate(passwordStrength.value.label)}</span></div></div><button type="submit" class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none"${ssrIncludeBooleanAttr(loading.value || passwordStrength.value.percent < 25) ? " disabled" : ""}>`);
        if (loading.value) {
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:loading",
            class: "animate-spin"
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:check",
            class: "text-lg"
          }, null, _parent));
        }
        _push(`<span>${ssrInterpolate(loading.value ? unref(t)("auth.updatingPassword") : unref(t)("auth.resetPassword"))}</span></button>`);
        if (errorMsg.value) {
          _push(`<p class="text-red-500 text-[13px] text-center">${ssrInterpolate(errorMsg.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (success.value) {
          _push(`<p class="text-green-600 dark:text-green-400 text-[13px] text-center">${ssrInterpolate(unref(t)("auth.passwordResetSuccess"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/change-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=change-password-DFRoDUOB.mjs.map
