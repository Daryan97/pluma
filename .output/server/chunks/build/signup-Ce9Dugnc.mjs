import { u as useI18n, a as useLocalePath, g as __nuxt_component_0$1 } from './server.mjs';
import { ref, reactive, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderDynamicModel, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
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
  __name: "signup",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const email = ref("");
    const password = ref("");
    const username = ref("");
    const displayName = ref("");
    const submitting = ref(false);
    const showPassword = ref(false);
    const usernameError = ref("");
    const passwordStrength = reactive({ percent: 0, label: "Weak", barClass: "bg-red-400 dark:bg-red-500", textClass: "text-red-500 dark:text-red-400" });
    useRouter();
    const localePath = useLocalePath();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-md mx-auto mt-14 mb-20" }, _attrs))}><div class="mb-8 text-center"><div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-sm mb-4">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:account-plus",
        class: "text-3xl"
      }, null, _parent));
      _push(`</div><h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">${ssrInterpolate(unref(t)("auth.createAccount"))}</h1><p class="mt-2 text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(unref(t)("auth.joinTagline"))}</p></div><div class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"><form class="space-y-5" novalidate><div><label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:email-outline",
        class: "text-base text-blue-500"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("auth.email"))}</label><div class="relative"><input${ssrRenderAttr("value", email.value)} type="email" autocomplete="email" placeholder="you@example.com" class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500" required></div></div><div><div class="flex items-center justify-between mb-1"><label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:lock-outline",
        class: "text-base text-blue-500"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("auth.password"))}</label><span class="text-[11px] text-gray-400 dark:text-gray-500">${ssrInterpolate(unref(t)("auth.minPassword"))}</span></div><div class="relative group"><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)} autocomplete="new-password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500" required><button type="button"${ssrRenderAttr("aria-label", showPassword.value ? unref(t)("auth.hidePassword") : unref(t)("auth.showPassword"))} class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: showPassword.value ? "mdi:eye-off-outline" : "mdi:eye-outline",
        class: "text-lg"
      }, null, _parent));
      _push(`</button></div><div class="mt-1 flex items-center gap-2 text-[11px]"><div class="flex-1 h-1 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden"><div class="${ssrRenderClass(["h-full transition-all", passwordStrength.barClass])}" style="${ssrRenderStyle({ width: passwordStrength.percent + "%" })}"></div></div><span class="${ssrRenderClass(["font-medium", passwordStrength.textClass])}">${ssrInterpolate(passwordStrength.label)}</span></div></div><div><div class="flex items-center justify-between mb-1"><label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:account-circle",
        class: "text-base text-blue-500"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("auth.username"))}</label><span class="text-[11px] text-gray-400 dark:text-gray-500">A\u2013Z, a\u2013z, 0\u20139, - and _</span></div><div class="relative"><input${ssrRenderAttr("value", username.value)} type="text" autocomplete="username" placeholder="yourusername" class="${ssrRenderClass([usernameError.value ? "border-red-500 focus:ring-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600", "w-full h-11 rounded-md border bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"])}" required>`);
      if (usernameError.value) {
        _push(`<div class="mt-1 text-[11px] text-red-600 dark:text-red-400">${ssrInterpolate(usernameError.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div><label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:card-account-details-outline",
        class: "text-base text-blue-500"
      }, null, _parent));
      _push(` Display Name </label><input${ssrRenderAttr("value", displayName.value)} type="text" autocomplete="name" placeholder="Your name" class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500" required></div><button type="submit"${ssrIncludeBooleanAttr(submitting.value || usernameError.value || !email.value || !password.value || !username.value || !displayName.value || passwordStrength.percent < 25) ? " disabled" : ""} class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none">`);
      if (submitting.value) {
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:loading",
          class: "animate-spin"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:account-plus",
          class: "text-lg"
        }, null, _parent));
      }
      _push(`<span>${ssrInterpolate(submitting.value ? unref(t)("auth.creatingAccount") : unref(t)("auth.signup"))}</span></button><p class="text-[13px] text-gray-600 dark:text-gray-400 pt-2 text-center">${ssrInterpolate(unref(t)("auth.haveAccount"))} `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/login"),
        class: "text-blue-600 dark:text-blue-400 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("auth.login"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("auth.login")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/signup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=signup-Ce9Dugnc.mjs.map
