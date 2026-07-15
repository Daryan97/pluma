import { computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { Icon } from '@iconify/vue';
import { _ as _export_sfc, u as useI18n, a as useLocalePath, b as useContentLocale, c as useCookie, s as supabase, d as useBranding, e as useRuntimeConfig } from './server.mjs';
import { g as getBrowserOrigin } from './utils-ScxCRkhj.mjs';
import { _ as _sfc_main$1 } from './ConfirmDialog-BMJpAaMk.mjs';
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
import 'vue-router';
import '@supabase/supabase-js';
import 'radix-vue';
import '@headlessui/vue';

const cardClass = "test-card rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-5 sm:p-6 h-full gap-4";
const cardWideClass = "test-card-wide rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-5 sm:p-6 h-full gap-4 lg:col-span-2";
const iconWrap = "p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shrink-0";
const btnSoft = "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50";
const btnDanger = "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200/70 dark:border-red-800/40 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50";
const btnChip = "inline-flex items-center h-8 px-3 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700";
const btnBlock = "w-full h-9 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700/60";
const btnBlockDanger = "w-full h-9 rounded-md text-sm font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50";
const inputClass = "w-full h-9 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";
const preClass = "test-pre leading-tight p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 overflow-auto w-full h-full min-h-0";
const chipClass = "px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200";
const cardHeaderClass = "flex flex-wrap items-start justify-between gap-3 min-h-0 overflow-hidden self-stretch";
const cardSlotClass = "min-h-0 flex items-start content-start gap-2 flex-wrap overflow-auto self-stretch";
const emptyPreClass = "test-pre leading-tight p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 overflow-auto w-full h-full min-h-0";
const _sfc_main = {
  __name: "Test",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale, locales, defaultLocale } = useI18n();
    useLocalePath();
    const branding = useBranding();
    const { contentLocale } = useContentLocale();
    const runtimeConfig = useRuntimeConfig();
    const localeCookieName = ["pluma", "locale"].join("_");
    const localeCookieRef = useCookie(localeCookieName);
    const localeCookie = computed(() => localeCookieRef.value || "");
    const devResult = ref("");
    const suiteRunning = ref(false);
    const suiteSummary = ref(null);
    const e2eRunning = ref(false);
    const confirmOpen = ref(false);
    const confirmTitle = ref("");
    const confirmDescription = ref("");
    const confirmLabel = ref("");
    let confirmAction = null;
    function getCurrentSiteOrigin() {
      return getBrowserOrigin();
    }
    function formatJson(obj) {
      try {
        return typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
      } catch {
        return String(obj);
      }
    }
    function onConfirm() {
      confirmOpen.value = false;
      const fn = confirmAction;
      confirmAction = null;
      if (typeof fn === "function") fn();
    }
    const bucketName = ref("");
    const loading = ref(false);
    const result = ref("");
    const errorMsg = ref("");
    const action = ref("");
    const sessionUser = ref(null);
    const sessionRaw = ref("");
    const sessionExpiry = ref("");
    const profileRole = ref("");
    const settingsRaw = ref("");
    const settingsMap = ref({});
    const brandingRaw = ref("");
    const rlsTables = [
      "settings",
      "profiles",
      "posts",
      "comments",
      "categories",
      "series"
    ];
    const rlsResult = ref("");
    const latencyMs = ref(null);
    const localStorageDump = ref("");
    const statsLoading = ref(false);
    const statsResult = ref("");
    const statsRls = ref(false);
    ref("");
    const localeDiagLoading = ref(false);
    const localeDiagRaw = ref("");
    const feedsLoading = ref(false);
    const feedsRaw = ref("");
    const runtimeRaw = ref("");
    function authProvidersDisplay() {
      const ap = settingsMap.value["auth_providers_enabled"] || settingsMap.value["auth_providers"] || null;
      if (!ap) return "\u2014";
      try {
        const enabled = Object.keys(ap).filter((k) => ap[k]);
        return enabled.length ? enabled.join(", ") : "none enabled";
      } catch {
        return JSON.stringify(ap);
      }
    }
    function siteTitleDisplay() {
      const brandingRow = settingsMap.value["branding"] || null;
      if (brandingRow && brandingRow.siteName) return brandingRow.siteName;
      return settingsMap.value["site_title"] || "\u2014";
    }
    function siteOriginDisplay() {
      const configured = settingsMap.value["site_origin"] || getBrowserOrigin() || "\u2014";
      const current = getCurrentSiteOrigin() || "\u2014";
      if (configured === current) return current;
      return `${current} (configured: ${configured})`;
    }
    function installationDisplay() {
      const inst = settingsMap.value["installation"] || null;
      if (!inst) return "\u2014";
      const ok = !!inst.complete;
      const when = inst.completed_at ? new Date(inst.completed_at).toLocaleString() : null;
      return ok ? `Complete - ${when || "unknown"}` : `Incomplete${when ? " - " + when : ""}`;
    }
    async function refreshSession() {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      sessionUser.value = (session == null ? void 0 : session.user) || null;
      sessionRaw.value = session ? formatJson(session) : "";
      sessionExpiry.value = (session == null ? void 0 : session.expires_at) ? new Date(session.expires_at * 1e3).toLocaleString() : "";
      if (sessionUser.value) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", sessionUser.value.id).maybeSingle();
        profileRole.value = (profile == null ? void 0 : profile.role) || "";
      } else profileRole.value = "";
    }
    function loadRuntimeEnv() {
      const pub = runtimeConfig.public || {};
      runtimeRaw.value = formatJson({
        env: pub.env,
        siteUrl: pub.siteUrl,
        siteLocale: pub.siteLocale,
        twitterSite: pub.twitterSite,
        supabaseUrl: pub.supabaseUrl ? String(pub.supabaseUrl).replace(/^(https?:\/\/[^/]+).*/, "$1/\u2026") : null,
        supabaseAnonKey: pub.supabaseAnonKey ? `${String(pub.supabaseAnonKey).slice(0, 8)}\u2026(${String(pub.supabaseAnonKey).length} chars)` : null,
        configuredOrigin: getBrowserOrigin(),
        currentOrigin: getCurrentSiteOrigin()
      });
    }
    refreshSession();
    loadRuntimeEnv();
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8" }, _attrs))} data-v-2ee78148><header class="space-y-4" data-v-2ee78148><div class="flex flex-wrap items-start justify-between gap-4" data-v-2ee78148><div data-v-2ee78148><div class="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300 mb-2" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:flask-outline",
        class: "text-base"
      }, null, _parent));
      _push(` Dev only </div><h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight" data-v-2ee78148> Internal Test &amp; Debug </h1><p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl" data-v-2ee78148> Development diagnostics for Supabase, auth, branding, i18n, and feeds. Guarded by <code class="text-xs" data-v-2ee78148>devOnly</code> meta and <code class="text-xs" data-v-2ee78148>VITE_ENV=development</code>. </p></div><button type="button"${ssrIncludeBooleanAttr(suiteRunning.value) ? " disabled" : ""} class="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: suiteRunning.value ? "mdi:loading" : "mdi:play-circle-outline",
        class: [suiteRunning.value ? "animate-spin" : "", "text-lg"]
      }, null, _parent));
      _push(` ${ssrInterpolate(suiteRunning.value ? "Running\u2026" : "Run quick suite")}</button></div>`);
      if (suiteSummary.value) {
        _push(`<div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4" data-v-2ee78148><div class="flex flex-wrap gap-2 mb-3" data-v-2ee78148><!--[-->`);
        ssrRenderList(suiteSummary.value.checks, (item) => {
          _push(`<span class="${ssrRenderClass([
            item.ok ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-medium"
          ])}" data-v-2ee78148>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: item.ok ? "mdi:check" : "mdi:close",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(item.name)}</span>`);
        });
        _push(`<!--]--></div><pre class="text-[11px] leading-tight overflow-x-auto text-gray-700 dark:text-gray-300" data-v-2ee78148>${ssrInterpolate(formatJson(suiteSummary.value))}</pre></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch" data-v-2ee78148><section class="${ssrRenderClass(cardClass)}" data-v-2ee78148><div class="${ssrRenderClass(cardHeaderClass)}" data-v-2ee78148><div class="flex items-center gap-2 min-w-0" data-v-2ee78148><span class="${ssrRenderClass(iconWrap)}" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:bucket-outline",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</span><div class="min-w-0" data-v-2ee78148><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100" data-v-2ee78148> Storage buckets </h2><p class="text-[12px] text-gray-500 dark:text-gray-400 truncate" data-v-2ee78148> List or inspect Supabase storage buckets. </p></div></div><div class="flex gap-2 shrink-0" data-v-2ee78148><button type="button" class="${ssrRenderClass(btnSoft)}"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-2ee78148>${ssrInterpolate(loading.value && action.value === "list" ? "Listing\u2026" : "List")}</button><button type="button" class="${ssrRenderClass(btnSoft)}"${ssrIncludeBooleanAttr(loading.value || !bucketName.value) ? " disabled" : ""} data-v-2ee78148>${ssrInterpolate(loading.value && action.value === "check" ? "Checking\u2026" : "Check")}</button></div></div><div class="${ssrRenderClass(cardSlotClass)}" data-v-2ee78148><input${ssrRenderAttr("value", bucketName.value)} type="text" placeholder="bucket name" class="${ssrRenderClass(inputClass)}" data-v-2ee78148></div><pre class="${ssrRenderClass(result.value || errorMsg.value ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(errorMsg.value ? "ERROR: " + errorMsg.value : result.value || "No result yet.")}</pre></section><section class="${ssrRenderClass(cardClass)}" data-v-2ee78148><div class="${ssrRenderClass(cardHeaderClass)}" data-v-2ee78148><div class="flex items-center gap-2 min-w-0" data-v-2ee78148><span class="${ssrRenderClass(iconWrap)}" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:chart-box-outline",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</span><div class="min-w-0" data-v-2ee78148><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100" data-v-2ee78148> Full stats </h2><p class="text-[12px] text-gray-500 dark:text-gray-400 truncate" data-v-2ee78148> Aggregate counts for posts, users, categories, series, comments. </p></div></div><button type="button" class="${ssrRenderClass(btnSoft)}"${ssrIncludeBooleanAttr(statsLoading.value) ? " disabled" : ""} data-v-2ee78148>${ssrInterpolate(statsLoading.value ? "Refreshing\u2026" : "Refresh")}</button></div><div class="${ssrRenderClass(cardSlotClass)}" data-v-2ee78148>`);
      if (statsRls.value) {
        _push(`<span class="text-[11px] text-amber-700 dark:text-amber-300 truncate" data-v-2ee78148> RLS may be blocking some counts. </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><pre class="${ssrRenderClass(statsResult.value ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(statsResult.value || "No stats loaded yet.")}</pre></section><section class="${ssrRenderClass(cardClass)}" data-v-2ee78148><div class="${ssrRenderClass(cardHeaderClass)}" data-v-2ee78148><div class="flex items-center gap-2 min-w-0" data-v-2ee78148><span class="${ssrRenderClass(iconWrap)}" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:account-key-outline",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</span><div class="min-w-0" data-v-2ee78148><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100" data-v-2ee78148> Auth &amp; session </h2><p class="text-[12px] text-gray-500 dark:text-gray-400 truncate" data-v-2ee78148> Current session and profile role. </p></div></div><div class="flex gap-2 shrink-0" data-v-2ee78148><button type="button" class="${ssrRenderClass(btnSoft)}" data-v-2ee78148>Refresh</button><button type="button" class="${ssrRenderClass(btnDanger)}"${ssrIncludeBooleanAttr(!sessionUser.value) ? " disabled" : ""} data-v-2ee78148> Sign out </button></div></div><div class="${ssrRenderClass(cardSlotClass)}" data-v-2ee78148><span class="${ssrRenderClass(chipClass)}" data-v-2ee78148>User: ${ssrInterpolate(((_a = sessionUser.value) == null ? void 0 : _a.email) || "none")}</span><span class="${ssrRenderClass(chipClass)}" data-v-2ee78148>Role: ${ssrInterpolate(profileRole.value || "n/a")}</span><span class="${ssrRenderClass(chipClass)}" data-v-2ee78148>Expires: ${ssrInterpolate(sessionExpiry.value || "n/a")}</span></div><pre class="${ssrRenderClass(sessionRaw.value ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(sessionRaw.value || "No session data.")}</pre></section><section class="${ssrRenderClass(cardClass)}" data-v-2ee78148><div class="${ssrRenderClass(cardHeaderClass)}" data-v-2ee78148><div class="flex items-center gap-2 min-w-0" data-v-2ee78148><span class="${ssrRenderClass(iconWrap)}" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:translate",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</span><div class="min-w-0" data-v-2ee78148><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100" data-v-2ee78148> Locale &amp; i18n </h2><p class="text-[12px] text-gray-500 dark:text-gray-400 truncate" data-v-2ee78148> Cookie, branding locales, posts by locale. </p></div></div><button type="button" class="${ssrRenderClass(btnSoft)}"${ssrIncludeBooleanAttr(localeDiagLoading.value) ? " disabled" : ""} data-v-2ee78148>${ssrInterpolate(localeDiagLoading.value ? "Loading\u2026" : "Refresh")}</button></div><div class="${ssrRenderClass(cardSlotClass)}" data-v-2ee78148><span class="${ssrRenderClass(chipClass)}" data-v-2ee78148>UI: ${ssrInterpolate(unref(locale))}</span><span class="${ssrRenderClass(chipClass)}" data-v-2ee78148>Cookie: ${ssrInterpolate(localeCookie.value || "(none)")}</span><span class="${ssrRenderClass(chipClass)}" data-v-2ee78148>Primary: ${ssrInterpolate(((_b = unref(branding).primaryLocale) == null ? void 0 : _b.value) || "\u2014")}</span><span class="${ssrRenderClass(chipClass)}" data-v-2ee78148>Content: ${ssrInterpolate(unref(contentLocale))}</span></div><pre class="${ssrRenderClass(localeDiagRaw.value ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(localeDiagRaw.value || "No locale diagnostics yet.")}</pre></section><section class="${ssrRenderClass(cardClass)}" data-v-2ee78148><div class="${ssrRenderClass(cardHeaderClass)}" data-v-2ee78148><div class="flex items-center gap-2 min-w-0" data-v-2ee78148><span class="${ssrRenderClass(iconWrap)}" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:rss",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</span><div class="min-w-0" data-v-2ee78148><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100" data-v-2ee78148> Feeds &amp; health </h2><p class="text-[12px] text-gray-500 dark:text-gray-400 truncate" data-v-2ee78148> Probe public feed and health endpoints. </p></div></div><button type="button" class="${ssrRenderClass(btnSoft)}"${ssrIncludeBooleanAttr(feedsLoading.value) ? " disabled" : ""} data-v-2ee78148>${ssrInterpolate(feedsLoading.value ? "Probing\u2026" : "Probe")}</button></div><div class="${ssrRenderClass(cardSlotClass)}" data-v-2ee78148><span class="text-[11px] text-gray-500 dark:text-gray-400 truncate" data-v-2ee78148> Origin: ${ssrInterpolate(getCurrentSiteOrigin() || "\u2014")}</span></div><pre class="${ssrRenderClass(feedsRaw.value ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(feedsRaw.value || "No feed probe yet.")}</pre></section><section class="${ssrRenderClass(cardClass)}" data-v-2ee78148><div class="${ssrRenderClass(cardHeaderClass)}" data-v-2ee78148><div class="flex items-center gap-2 min-w-0" data-v-2ee78148><span class="${ssrRenderClass(iconWrap)}" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:cog-outline",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</span><div class="min-w-0" data-v-2ee78148><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100" data-v-2ee78148> Runtime config </h2><p class="text-[12px] text-gray-500 dark:text-gray-400 truncate" data-v-2ee78148> Public runtime values (secrets masked). </p></div></div><button type="button" class="${ssrRenderClass(btnSoft)}" data-v-2ee78148>Refresh</button></div><div class="${ssrRenderClass(cardSlotClass)}" data-v-2ee78148></div><pre class="${ssrRenderClass(runtimeRaw.value ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(runtimeRaw.value || "No runtime data yet.")}</pre></section><section class="${ssrRenderClass(cardWideClass)}" data-v-2ee78148><div class="flex flex-wrap items-center gap-2 min-h-0" data-v-2ee78148><span class="${ssrRenderClass(iconWrap)}" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:palette-outline",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</span><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100 flex-1" data-v-2ee78148> Settings &amp; branding </h2><button type="button" class="${ssrRenderClass(btnSoft)}" data-v-2ee78148>Settings</button><button type="button" class="${ssrRenderClass(btnSoft)}" data-v-2ee78148>Branding</button></div>`);
      if (settingsRaw.value) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] min-h-0" data-v-2ee78148><div data-v-2ee78148><div class="text-gray-500" data-v-2ee78148>Installation</div><div class="truncate" data-v-2ee78148>${ssrInterpolate(installationDisplay())}</div></div><div data-v-2ee78148><div class="text-gray-500" data-v-2ee78148>Auth providers</div><div class="truncate" data-v-2ee78148>${ssrInterpolate(authProvidersDisplay())}</div></div><div data-v-2ee78148><div class="text-gray-500" data-v-2ee78148>Site origin</div><div class="truncate" data-v-2ee78148>${ssrInterpolate(siteOriginDisplay())}</div></div><div data-v-2ee78148><div class="text-gray-500" data-v-2ee78148>Site title</div><div class="truncate" data-v-2ee78148>${ssrInterpolate(siteTitleDisplay())}</div></div></div>`);
      } else {
        _push(`<div class="${ssrRenderClass(cardSlotClass)}" data-v-2ee78148></div>`);
      }
      _push(`<div class="grid md:grid-cols-2 gap-4 min-h-0 h-full" data-v-2ee78148><pre class="${ssrRenderClass(settingsRaw.value ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(settingsRaw.value || "No settings data")}</pre><pre class="${ssrRenderClass(brandingRaw.value ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(brandingRaw.value || "No branding data")}</pre></div></section><section class="${ssrRenderClass(cardClass)}" data-v-2ee78148><div class="${ssrRenderClass(cardHeaderClass)}" data-v-2ee78148><div class="flex items-center gap-2 min-w-0" data-v-2ee78148><span class="${ssrRenderClass(iconWrap)}" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:shield-key-outline",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</span><div class="min-w-0" data-v-2ee78148><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100" data-v-2ee78148> RLS probe </h2><p class="text-[12px] text-gray-500 dark:text-gray-400 truncate" data-v-2ee78148> Select * limit 5 from a table. </p></div></div></div><div class="${ssrRenderClass(cardSlotClass)}" data-v-2ee78148><!--[-->`);
      ssrRenderList(rlsTables, (tbl) => {
        _push(`<button type="button" class="${ssrRenderClass(btnChip)}" data-v-2ee78148>${ssrInterpolate(tbl)}</button>`);
      });
      _push(`<!--]--></div><pre class="${ssrRenderClass(rlsResult.value ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(rlsResult.value || "Pick a table to probe.")}</pre></section><section class="${ssrRenderClass(cardClass)}" data-v-2ee78148><div class="${ssrRenderClass(cardHeaderClass)}" data-v-2ee78148><div class="flex items-center gap-2 min-w-0" data-v-2ee78148><span class="${ssrRenderClass(iconWrap)}" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:timer-outline",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</span><div class="min-w-0" data-v-2ee78148><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100" data-v-2ee78148> Latency </h2><p class="text-[12px] text-gray-500 dark:text-gray-400 truncate" data-v-2ee78148> Round-trip ping to settings. </p></div></div><button type="button" class="${ssrRenderClass(btnSoft)}" data-v-2ee78148>Ping</button></div><div class="${ssrRenderClass(cardSlotClass)}" data-v-2ee78148><span class="text-[11px] text-gray-500 dark:text-gray-400" data-v-2ee78148>${ssrInterpolate(latencyMs.value !== null ? `${latencyMs.value} ms` : "\u2014")}</span></div><pre class="${ssrRenderClass(latencyMs.value !== null ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(latencyMs.value !== null ? formatJson({ ping_ms: latencyMs.value, at: (/* @__PURE__ */ new Date()).toISOString() }) : "Click Ping to measure.")}</pre></section><section class="${ssrRenderClass(cardWideClass)}" data-v-2ee78148><div class="${ssrRenderClass(cardHeaderClass)}" data-v-2ee78148><div class="flex items-center gap-2 min-w-0" data-v-2ee78148><span class="${ssrRenderClass(iconWrap)}" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:database-outline",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</span><div class="min-w-0" data-v-2ee78148><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100" data-v-2ee78148> Local storage </h2><p class="text-[12px] text-gray-500 dark:text-gray-400 truncate" data-v-2ee78148> Dump or clear this origin\u2019s localStorage. </p></div></div><div class="flex gap-2 shrink-0" data-v-2ee78148><button type="button" class="${ssrRenderClass(btnSoft)}" data-v-2ee78148>Read</button><button type="button" class="${ssrRenderClass(btnDanger)}" data-v-2ee78148>Clear</button></div></div><div class="${ssrRenderClass(cardSlotClass)}" data-v-2ee78148></div><pre class="${ssrRenderClass(localStorageDump.value ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(localStorageDump.value || "No localStorage dump yet.")}</pre></section><section class="${ssrRenderClass(cardWideClass)}" data-v-2ee78148><div class="flex flex-wrap items-center gap-2 min-h-0" data-v-2ee78148><span class="${ssrRenderClass(iconWrap)}" data-v-2ee78148>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:tools",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</span><h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100 flex-1" data-v-2ee78148> Dev tools </h2><div class="flex flex-wrap gap-2" data-v-2ee78148><button type="button" class="${ssrRenderClass(btnChip)}" data-v-2ee78148>Toggle theme</button><button type="button" class="${ssrRenderClass(btnChip)}" data-v-2ee78148>Seed categories</button><button type="button" class="${ssrRenderClass(btnChip)}" data-v-2ee78148>Latency dist</button><button type="button" class="${ssrRenderClass(btnChip)}" data-v-2ee78148>Concurrency</button><button type="button" class="${ssrRenderClass(btnChip)}"${ssrIncludeBooleanAttr(e2eRunning.value) ? " disabled" : ""} data-v-2ee78148>${ssrInterpolate(e2eRunning.value ? "E2E\u2026" : "E2E render")}</button></div></div><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 min-h-0" data-v-2ee78148><button type="button" class="${ssrRenderClass(btnBlock)}" data-v-2ee78148>Create dummy post</button><button type="button" class="${ssrRenderClass(btnBlock)}" data-v-2ee78148> Create multi-locale post </button><button type="button" class="${ssrRenderClass(btnBlock)}" data-v-2ee78148>Archive latest post</button><button type="button" class="${ssrRenderClass(btnBlock)}" data-v-2ee78148> Unarchive latest post </button><button type="button" class="${ssrRenderClass(btnBlock)}" data-v-2ee78148>List test posts</button><button type="button" class="${ssrRenderClass(btnBlockDanger)}" data-v-2ee78148> Delete test posts </button></div><pre class="${ssrRenderClass(devResult.value ? preClass : emptyPreClass)}" data-v-2ee78148>${ssrInterpolate(devResult.value || "No action yet.")}</pre></section></div>`);
      if (confirmOpen.value) {
        _push(ssrRenderComponent(_sfc_main$1, {
          open: confirmOpen.value,
          title: confirmTitle.value,
          description: confirmDescription.value,
          body: unref(t)("common.areYouSure"),
          "confirm-label": confirmLabel.value,
          onConfirm,
          onCancel: ($event) => confirmOpen.value = false
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Test.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Test = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2ee78148"]]);

export { Test as default };
//# sourceMappingURL=Test-Fd2YV1tP.mjs.map
