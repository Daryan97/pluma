import { ref, computed, unref, watch, resolveComponent, mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, withModifiers, withDirectives, vModelText, withKeys, useModel, mergeModels, reactive, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderSlot, ssrLooseContain, ssrRenderStyle, ssrRenderTeleport } from 'vue/server-renderer';
import { _ as _export_sfc, b as useI18n, c as useLocalePath, C as CONTENT_LOCALES, i as fetchBranding, s as supabase, f as useBranding, D as DEFAULT_FOOTER_CREDITS, n as normalizeLocaleSettings } from './server.mjs';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent, DateRangePickerRoot, DateRangePickerField, DateRangePickerInput, DateRangePickerTrigger, DateRangePickerContent, DateRangePickerArrow, DateRangePickerCalendar, DateRangePickerHeader, DateRangePickerPrev, DateRangePickerHeading, DateRangePickerNext, DateRangePickerGrid, DateRangePickerGridHead, DateRangePickerGridRow, DateRangePickerHeadCell, DateRangePickerGridBody, DateRangePickerCell, DateRangePickerCellTrigger, SelectRoot, SelectTrigger, SelectValue, SelectPortal, SelectContent, SelectScrollUpButton, SelectViewport, SelectGroup, SelectItem, SelectItemIndicator, SelectItemText, SelectSeparator, SelectScrollDownButton } from 'radix-vue';
import { _ as _sfc_main$h } from './Checkbox-BvkZlpGG.mjs';
import { _ as _sfc_main$g } from './ConfirmDialog-CDJyHT9i.mjs';
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';
import { u as useToast } from './useToast-DuA5bmqL.mjs';
import { u as useStatsSettings } from './statsSettingsStore-CFmMBcUt.mjs';
import { u as useSettings } from './settingsStore-C3tJgnC4.mjs';
import { g as getBrowserOrigin } from './utils-BOiLVUQi.mjs';
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

const _sfc_main$f = {
  __name: "StatsOverview",
  __ssrInlineRender: true,
  props: {
    stats: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    const props = __props;
    function formatNumber(val) {
      if (val === null || val === void 0) return "0";
      if (val > 999) return Intl.NumberFormat("en", { notation: "compact" }).format(val);
      return val;
    }
    const metrics = computed(() => [
      { key: "totalPosts", label: t("dashboard.stats.totalPosts"), value: props.stats.totalPosts || 0, icon: "mdi:note-multiple-outline", iconClass: "text-blue-500 dark:text-blue-400", valueClass: "text-blue-600 dark:text-blue-400" },
      { key: "publishedPosts", label: t("dashboard.stats.published"), value: props.stats.publishedPosts || 0, icon: "mdi:check-circle-outline", iconClass: "text-green-500 dark:text-green-400", valueClass: "text-green-600 dark:text-green-400" },
      { key: "draftPosts", label: t("dashboard.stats.drafts"), value: props.stats.draftPosts || 0, icon: "mdi:file-document-edit-outline", iconClass: "text-purple-500 dark:text-purple-400", valueClass: "text-purple-600 dark:text-purple-400" },
      { key: "pendingComments", label: t("dashboard.stats.pendingComments"), value: props.stats.pendingComments || 0, icon: "mdi:comment-alert-outline", iconClass: "text-yellow-500 dark:text-yellow-400", valueClass: "text-yellow-500 dark:text-yellow-400" },
      { key: "categories", label: t("dashboard.stats.categories"), value: props.stats.categories || 0, icon: "mdi:folder-outline", iconClass: "text-indigo-500 dark:text-indigo-400", valueClass: "text-indigo-600 dark:text-indigo-400" },
      { key: "authors", label: t("dashboard.stats.authors"), value: props.stats.authors || 0, icon: "mdi:account-edit-outline", iconClass: "text-cyan-500 dark:text-cyan-400", valueClass: "text-cyan-600 dark:text-cyan-400" },
      { key: "members", label: t("dashboard.stats.members"), value: props.stats.members || 0, icon: "mdi:account-multiple-outline", iconClass: "text-teal-500 dark:text-teal-400", valueClass: "text-teal-600 dark:text-teal-400" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" }, _attrs))}><!--[-->`);
      ssrRenderList(metrics.value, (m) => {
        _push(`<div class="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 flex flex-col"><div class="flex items-start justify-between gap-3"><div><p class="text-gray-500 dark:text-gray-400 text-[13px] font-medium">${ssrInterpolate(m.label)}</p></div>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: m.icon,
          class: m.iconClass + " text-xl"
        }, null, _parent));
        _push(`</div><div class="mt-3 flex items-end gap-2"><h2 class="${ssrRenderClass("text-3xl font-semibold " + m.valueClass)}">${ssrInterpolate(formatNumber(m.value))}</h2>`);
        if (m.sublabel) {
          _push(`<span class="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">${ssrInterpolate(m.sublabel)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/StatsOverview.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = {
  __name: "PostsTable",
  __ssrInlineRender: true,
  props: {
    posts: { type: Array, required: true },
    selected: { type: Array, required: true },
    currentUser: String,
    role: String
  },
  emits: ["toggleAll", "delete", "edit", "update:selected"],
  setup(__props, { emit: __emit }) {
    const { t, locales } = useI18n();
    const props = __props;
    const emit = __emit;
    const selectedProxy = computed({
      get: () => props.selected,
      set: (val) => emit("update:selected", val)
    });
    const allSelected = computed(
      () => selectedProxy.value.length === props.posts.length && props.posts.length > 0
    );
    const someSelected = computed(
      () => selectedProxy.value.length > 0 && !allSelected.value
    );
    function canManage(post) {
      var _a;
      return ((_a = post.author) == null ? void 0 : _a.username) === props.currentUser || props.role === "admin";
    }
    function initials(name) {
      const s = String(name || "?").trim();
      return (s.charAt(0) || "?").toUpperCase();
    }
    function formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    function localeLabel(code) {
      const list = unref(locales) || [];
      const hit = list.find((l) => l.code === code);
      return (hit == null ? void 0 : hit.name) || code;
    }
    function postLocales(post) {
      if (Array.isArray(post == null ? void 0 : post.locales) && post.locales.length) {
        return post.locales;
      }
      return (post == null ? void 0 : post.locale) ? [post.locale] : [];
    }
    function statusClasses(status) {
      return {
        published: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        draft: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        archived: "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
      }[status] || "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300";
    }
    function dotClasses(status) {
      return {
        published: "bg-green-500",
        draft: "bg-amber-500",
        archived: "bg-gray-400 dark:bg-gray-500"
      }[status] || "bg-gray-400";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden" }, _attrs))}><div class="px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-4"><div class="flex flex-wrap items-center justify-between gap-3"><div class="flex items-center gap-3 min-w-0"><div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shrink-0">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:post-outline",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</div><div class="min-w-0"><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase">${ssrInterpolate(unref(t)("posts.title"))}</h2><p class="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">${ssrInterpolate(unref(t)("posts.onThisPage", { count: __props.posts.length }))} `);
      if (__props.selected.length) {
        _push(`<span class="text-blue-600 dark:text-blue-400"> \xB7 ${ssrInterpolate(unref(t)("posts.selected", { count: __props.selected.length }))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p></div></div>`);
      if (__props.posts.length) {
        _push(`<div class="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer select-none" role="button" tabindex="0">`);
        _push(ssrRenderComponent(_sfc_main$h, {
          checked: allSelected.value,
          indeterminate: someSelected.value,
          class: "pointer-events-none",
          "aria-label": "Select all posts",
          tabindex: "-1"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("posts.selectAll"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      ssrRenderSlot(_ctx.$slots, "filters", {}, null, _push, _parent);
      _push(`</div>`);
      if (!__props.posts.length) {
        _push(`<div class="px-6 py-16 text-center">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:file-document-outline",
          class: "mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3"
        }, null, _parent));
        _push(`<p class="text-sm font-medium text-gray-700 dark:text-gray-300">${ssrInterpolate(unref(t)("posts.noPosts"))}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${ssrInterpolate(unref(t)("posts.adjustFilters"))}</p></div>`);
      } else {
        _push(`<ul class="divide-y divide-gray-100 dark:divide-gray-700/80"><!--[-->`);
        ssrRenderList(__props.posts, (post) => {
          var _a, _b;
          _push(`<li class="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors"><div class="flex items-start gap-3 min-w-0 flex-1"><input type="checkbox"${ssrRenderAttr("value", post.id)}${ssrIncludeBooleanAttr(Array.isArray(selectedProxy.value) ? ssrLooseContain(selectedProxy.value, post.id) : selectedProxy.value) ? " checked" : ""} class="mt-1"${ssrRenderAttr("aria-label", `Select ${post.title}`)}><div class="min-w-0 flex-1">`);
          _push(ssrRenderComponent(_component_router_link, {
            to: `/posts/${post.slug}`,
            class: "text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(post.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(post.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">`);
          _push(ssrRenderComponent(_component_router_link, {
            to: `/category/${((_a = post.category) == null ? void 0 : _a.slug) || "uncategorized"}`,
            class: "inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a2, _b2;
              if (_push2) {
                _push2(ssrRenderComponent(unref(Icon), {
                  icon: "mdi:folder-outline",
                  class: "text-sm"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(((_a2 = post.category) == null ? void 0 : _a2.name) || unref(t)("common.uncategorized"))}`);
              } else {
                return [
                  createVNode(unref(Icon), {
                    icon: "mdi:folder-outline",
                    class: "text-sm"
                  }),
                  createTextVNode(" " + toDisplayString(((_b2 = post.category) == null ? void 0 : _b2.name) || unref(t)("common.uncategorized")), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<span class="text-gray-300 dark:text-gray-600">\xB7</span>`);
          if ((_b = post.author) == null ? void 0 : _b.username) {
            _push(ssrRenderComponent(_component_router_link, {
              to: `/author/${post.author.username}`,
              class: "inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a2, _b2, _c, _d, _e, _f, _g, _h;
                if (_push2) {
                  _push2(`<span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 text-[9px] font-semibold text-gray-600 dark:text-gray-200"${_scopeId}>${ssrInterpolate(initials(((_a2 = post.author) == null ? void 0 : _a2.display_name) || ((_b2 = post.author) == null ? void 0 : _b2.username)))}</span> ${ssrInterpolate(((_c = post.author) == null ? void 0 : _c.display_name) || ((_d = post.author) == null ? void 0 : _d.username))}`);
                } else {
                  return [
                    createVNode("span", { class: "inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 text-[9px] font-semibold text-gray-600 dark:text-gray-200" }, toDisplayString(initials(((_e = post.author) == null ? void 0 : _e.display_name) || ((_f = post.author) == null ? void 0 : _f.username))), 1),
                    createTextVNode(" " + toDisplayString(((_g = post.author) == null ? void 0 : _g.display_name) || ((_h = post.author) == null ? void 0 : _h.username)), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="text-gray-300 dark:text-gray-600">\xB7</span><span class="inline-flex items-center gap-1">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:calendar-outline",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(formatDate(post.created_at))}</span></div></div></div><div class="flex items-center justify-between sm:justify-end gap-3 sm:pl-2 sm:shrink-0">`);
          if (postLocales(post).length) {
            _push(`<div class="flex flex-wrap items-center gap-1"><!--[-->`);
            ssrRenderList(postLocales(post), (code) => {
              _push(`<span class="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-medium uppercase tracking-wide bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"${ssrRenderAttr("title", localeLabel(code))}>`);
              _push(ssrRenderComponent(unref(Icon), {
                icon: "mdi:translate",
                class: "text-sm"
              }, null, _parent));
              _push(` ${ssrInterpolate(code)}</span>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="${ssrRenderClass([statusClasses(post.status), "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-medium capitalize"])}"><span class="${ssrRenderClass([dotClasses(post.status), "w-1.5 h-1.5 rounded-full"])}"></span> ${ssrInterpolate(unref(t)(`posts.status.${post.status}`, post.status))}</span>`);
          if (canManage(post)) {
            _push(`<div class="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity"><button type="button" class="inline-flex items-center justify-center h-8 w-8 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"${ssrRenderAttr("title", unref(t)("common.edit"))}>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:pencil-outline",
              class: "text-lg"
            }, null, _parent));
            _push(`</button><button type="button" class="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"${ssrRenderAttr("title", unref(t)("common.remove"))}>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:delete-outline",
              class: "text-lg"
            }, null, _parent));
            _push(`</button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/PostsTable.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = {
  __name: "PostFilters",
  __ssrInlineRender: true,
  props: {
    selectedLength: { type: Number, required: true },
    hasActiveFilters: { type: Boolean, default: false }
  },
  emits: ["bulkDelete", "clearFilters"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    useLocalePath();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><div class="flex flex-wrap items-center gap-2"><button type="button"${ssrIncludeBooleanAttr(__props.selectedLength === 0) ? " disabled" : ""} class="${ssrRenderClass([
        __props.selectedLength ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50" : "bg-gray-100 dark:bg-gray-700/40 text-gray-500 dark:text-gray-400",
        "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-40"
      ])}">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:trash-can-outline",
        class: "text-base"
      }, null, _parent));
      _push(` Remove `);
      if (__props.selectedLength) {
        _push(`<span class="min-w-[1.15rem] h-4 px-1 rounded-full bg-red-100 dark:bg-red-900/50 text-[10px] leading-4 text-center tabular-nums">${ssrInterpolate(__props.selectedLength)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (__props.hasActiveFilters) {
        _push(`<button type="button" class="inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:filter-off-outline",
          class: "text-base"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("common.clearFilters"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-wrap gap-2"><div class="w-full sm:w-[9.75rem] grow sm:grow-0">`);
      ssrRenderSlot(_ctx.$slots, "status", {}, null, _push, _parent);
      _push(`</div><div class="w-full sm:w-[9.75rem] grow sm:grow-0">`);
      ssrRenderSlot(_ctx.$slots, "locale", {}, null, _push, _parent);
      _push(`</div><div class="w-full sm:w-[11rem] grow sm:grow-0">`);
      ssrRenderSlot(_ctx.$slots, "category", {}, null, _push, _parent);
      _push(`</div><div class="w-full sm:w-[11rem] grow sm:grow-0">`);
      ssrRenderSlot(_ctx.$slots, "author", {}, null, _push, _parent);
      _push(`</div><div class="w-full sm:min-w-[17rem] sm:flex-1">`);
      ssrRenderSlot(_ctx.$slots, "date", {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/PostFilters.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = {
  __name: "CommentsTable",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    comments: Array,
    page: Number,
    totalPages: Number,
    loading: Boolean,
    pendingCount: Number,
    totalCount: Number,
    filter: { type: String, default: "all" }
  }, {
    "search": {},
    "searchModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels([
    "refresh",
    "search",
    "change-page",
    "approve",
    "unapprove",
    "delete",
    "change-filter"
  ], ["update:search"]),
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const search = useModel(__props, "search");
    const filters = computed(() => [
      { value: "all", label: t("comments.all") },
      { value: "approved", label: t("comments.approved") },
      { value: "pending", label: t("comments.pendingLabel") }
    ]);
    function initials(name) {
      const s = String(name || "?").trim();
      return (s.charAt(0) || "?").toUpperCase();
    }
    function formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden" }, _attrs))}><div class="px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-4"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div class="flex items-center gap-3 min-w-0"><div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shrink-0">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:comment-multiple-outline",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</div><div class="min-w-0"><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase">${ssrInterpolate(unref(t)("comments.title"))}</h2><p class="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">${ssrInterpolate(unref(t)("comments.total", { count: __props.totalCount }))} `);
      if (__props.pendingCount) {
        _push(`<span class="text-amber-600 dark:text-amber-400"> \xB7 ${ssrInterpolate(unref(t)("comments.pendingCount", { count: __props.pendingCount }))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p></div></div><div class="flex flex-wrap items-center gap-2"><div class="flex items-center h-9 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 p-0.5" role="tablist"><!--[-->`);
      ssrRenderList(filters.value, (f) => {
        _push(`<button type="button" role="tab"${ssrRenderAttr("aria-selected", __props.filter === f.value)} class="${ssrRenderClass([
          __props.filter === f.value ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60",
          "inline-flex items-center gap-1 h-8 px-3 rounded text-[11px] font-medium transition"
        ])}">${ssrInterpolate(f.label)} `);
        if (f.value === "pending" && __props.pendingCount > 0) {
          _push(`<span class="${ssrRenderClass([
            __props.filter === f.value ? "bg-white/20 text-white" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
            "ms-0.5 min-w-[1.1rem] h-4 px-1 rounded-full text-[10px] leading-4 text-center"
          ])}">${ssrInterpolate(__props.pendingCount)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div><button type="button" class="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"${ssrRenderAttr("title", unref(t)("common.refresh"))}>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:refresh",
        class: "text-lg"
      }, null, _parent));
      _push(`</button></div></div><div class="flex items-center h-9 w-full sm:max-w-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 focus-within:ring-2 focus-within:ring-blue-500">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:magnify",
        class: "ms-3 text-gray-400 text-base shrink-0"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", search.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("comments.searchPlaceholder"))} class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"></div></div>`);
      if (__props.loading) {
        _push(`<div class="px-6 py-16 text-center">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:loading",
          class: "mx-auto animate-spin text-3xl text-blue-500 mb-3"
        }, null, _parent));
        _push(`<p class="text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("comments.loading"))}</p></div>`);
      } else if (!__props.comments.length) {
        _push(`<div class="px-6 py-16 text-center">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:comment-off-outline",
          class: "mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3"
        }, null, _parent));
        _push(`<p class="text-sm font-medium text-gray-700 dark:text-gray-300">${ssrInterpolate(unref(t)("comments.empty"))}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${ssrInterpolate(unref(t)("comments.nothingMatches"))}</p></div>`);
      } else {
        _push(`<ul class="divide-y divide-gray-100 dark:divide-gray-700/80"><!--[-->`);
        ssrRenderList(__props.comments, (c) => {
          var _a, _b, _c;
          _push(`<li class="group flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors"><div class="min-w-0 flex-1 space-y-2"><div class="flex flex-wrap items-center gap-2"><span class="${ssrRenderClass([
            c.approved ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
            "inline-flex items-center gap-1 h-6 px-2 rounded-full text-[10px] font-semibold uppercase tracking-wide"
          ])}"><span class="${ssrRenderClass([c.approved ? "bg-green-500" : "bg-amber-500", "w-1.5 h-1.5 rounded-full"])}"></span> ${ssrInterpolate(c.approved ? unref(t)("comments.approved") : unref(t)("comments.pendingLabel"))}</span><span class="text-[11px] text-gray-500 dark:text-gray-400">${ssrInterpolate(formatDate(c.created_at))}</span></div><p class="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line break-words leading-relaxed">${ssrInterpolate(c.content)}</p><div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400"><span class="inline-flex items-center gap-1.5"><span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 text-[10px] font-semibold text-gray-600 dark:text-gray-200">${ssrInterpolate(initials(((_a = c.author) == null ? void 0 : _a.display_name) || ((_b = c.author) == null ? void 0 : _b.username)))}</span> ${ssrInterpolate(c.author ? c.author.display_name || c.author.username || unref(t)("comments.userFallback") : unref(t)("common.unknown"))}</span><span class="text-gray-300 dark:text-gray-600">\xB7</span>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: unref(localePath)(`/posts/${(_c = c.post) == null ? void 0 : _c.slug}`),
            class: "inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[16rem]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a2, _b2;
              if (_push2) {
                _push2(ssrRenderComponent(unref(Icon), {
                  icon: "mdi:file-document-outline",
                  class: "text-sm shrink-0"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(((_a2 = c.post) == null ? void 0 : _a2.title) || unref(t)("posts.post"))}`);
              } else {
                return [
                  createVNode(unref(Icon), {
                    icon: "mdi:file-document-outline",
                    class: "text-sm shrink-0"
                  }),
                  createTextVNode(" " + toDisplayString(((_b2 = c.post) == null ? void 0 : _b2.title) || unref(t)("posts.post")), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div><div class="flex items-center gap-1 lg:shrink-0 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100 transition-opacity">`);
          if (!c.approved) {
            _push(`<button type="button" class="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500">`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:check",
              class: "text-base"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(t)("comments.approve"))}</button>`);
          } else {
            _push(`<button type="button" class="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:undo",
              class: "text-base"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(t)("comments.unapprove"))}</button>`);
          }
          _push(`<button type="button" class="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"${ssrRenderAttr("title", unref(t)("common.remove"))}>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:delete-outline",
            class: "text-lg"
          }, null, _parent));
          _push(`</button></div></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      if (__props.totalPages > 1) {
        _push(`<div class="flex items-center justify-center gap-3 px-5 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300"><button type="button" class="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"${ssrIncludeBooleanAttr(__props.page === 1 || __props.loading) ? " disabled" : ""}>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:chevron-left",
          class: "text-base"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("common.prev"))}</button><span class="font-medium tabular-nums">${ssrInterpolate(unref(t)("common.page", { current: __props.page, total: __props.totalPages }))}</span><button type="button" class="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"${ssrIncludeBooleanAttr(__props.page === __props.totalPages || __props.loading) ? " disabled" : ""}>${ssrInterpolate(unref(t)("common.next"))} `);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:chevron-right",
          class: "text-base"
        }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/CommentsTable.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = {
  __name: "CategoriesManagement",
  __ssrInlineRender: true,
  emits: ["changed"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    useLocalePath();
    const isOpen = ref(false);
    const categories = ref([]);
    const newName = ref("");
    const editingId = ref(null);
    const editingName = ref("");
    const searchTerm = ref("");
    const toast = useToast();
    const emit = __emit;
    const reservedCategoryNames = ["uncategorized"];
    const filteredCategories = computed(() => {
      const term = searchTerm.value.toLowerCase().trim();
      return term ? categories.value.filter((c) => c.name.toLowerCase().includes(term)) : categories.value;
    });
    async function fetchCategories() {
      const { data, error } = await supabase.from("categories").select("id, name, slug").order("name", { ascending: true });
      if (!error) categories.value = data;
    }
    watch(isOpen, (open) => {
      if (open) fetchCategories();
    });
    function slugify(raw) {
      return raw.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
    }
    async function addCategory() {
      const name = newName.value.trim();
      if (!name) return;
      if (reservedCategoryNames.includes(name.toLowerCase())) {
        toast.error(t("categories.reserved"));
        return;
      }
      if (categories.value.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
        toast.error(t("categories.exists"));
        return;
      }
      let baseSlug = slugify(name);
      if (!baseSlug) baseSlug = Date.now().toString();
      let uniqueSlug = baseSlug;
      let i = 1;
      while (categories.value.some((c) => c.slug === uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${i++}`;
        if (i > 100) break;
      }
      await supabase.from("categories").insert({ name, slug: uniqueSlug });
      newName.value = "";
      await fetchCategories();
      emit("changed");
      toast.success(t("categories.added"));
    }
    function startEdit(cat) {
      editingId.value = cat.id;
      editingName.value = cat.name;
    }
    function cancelEdit() {
      editingId.value = null;
      editingName.value = "";
    }
    async function updateCategory(id) {
      const name = editingName.value.trim();
      if (!name) return;
      if (reservedCategoryNames.includes(name.toLowerCase())) {
        toast.error(t("categories.reserved"));
        return;
      }
      if (categories.value.some((c) => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) {
        toast.error(t("categories.exists"));
        return;
      }
      const existing = categories.value.find((c) => c.id === id);
      let updatePayload = { name };
      if (existing && !existing.slug) {
        let baseSlug = slugify(name);
        if (!baseSlug) baseSlug = Date.now().toString();
        let uniqueSlug = baseSlug;
        let i = 1;
        while (categories.value.some((c) => c.slug === uniqueSlug && c.id !== id)) {
          uniqueSlug = `${baseSlug}-${i++}`;
          if (i > 100) break;
        }
        updatePayload.slug = uniqueSlug;
      }
      await supabase.from("categories").update(updatePayload).eq("id", id);
      cancelEdit();
      await fetchCategories();
      emit("changed");
      toast.success(t("categories.updated"));
    }
    async function deleteCategory(id) {
      await supabase.from("categories").delete().eq("id", id);
      await fetchCategories();
      emit("changed");
      toast.success(t("categories.deleted"));
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps(_ctx.$attrs, _attrs))}><button class="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:format-list-bulleted",
        class: "text-base"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(unref(t)("categories.manage"))}</span></button>`);
      _push(ssrRenderComponent(unref(Dialog), {
        open: isOpen.value,
        onClose: () => isOpen.value = false,
        class: "relative z-50"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="fixed inset-0 bg-black/30 backdrop-blur-sm"${_scopeId}></div><div class="fixed inset-0 flex items-center justify-center p-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DialogPanel), { class: "w-full max-w-sm sm:max-w-md overflow-auto rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-start shadow-xl" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center justify-between mb-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(DialogTitle), { class: "text-lg font-semibold text-gray-900 dark:text-gray-100" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Icon), {
                          icon: "mdi:format-list-bulleted",
                          class: "inline-block me-2 text-gray-600 dark:text-gray-400"
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(unref(t)("categories.manage"))}`);
                      } else {
                        return [
                          createVNode(unref(Icon), {
                            icon: "mdi:format-list-bulleted",
                            class: "inline-block me-2 text-gray-600 dark:text-gray-400"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("categories.manage")), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<button class="inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:close",
                    class: "text-base"
                  }, null, _parent3, _scopeId2));
                  _push3(`</button></div><div class="flex flex-col sm:flex-row gap-2 mb-4"${_scopeId2}><div class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:format-list-bulleted",
                    class: "ms-3 text-gray-500 dark:text-gray-400 text-base"
                  }, null, _parent3, _scopeId2));
                  _push3(`<input${ssrRenderAttr("value", newName.value)}${ssrRenderAttr("placeholder", unref(t)("categories.newName"))} class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"${_scopeId2}></div><button class="w-full sm:w-auto inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:plus",
                    class: "text-base"
                  }, null, _parent3, _scopeId2));
                  _push3(`<span${_scopeId2}>${ssrInterpolate(unref(t)("categories.add"))}</span></button></div><div class="mb-4 relative"${_scopeId2}><div class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:magnify",
                    class: "ms-3 text-gray-500 dark:text-gray-400 text-base"
                  }, null, _parent3, _scopeId2));
                  _push3(`<input${ssrRenderAttr("value", searchTerm.value)}${ssrRenderAttr("placeholder", unref(t)("categories.searchPlaceholder"))} class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"${_scopeId2}></div></div><ul class="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto"${_scopeId2}><!--[-->`);
                  ssrRenderList(filteredCategories.value, (cat) => {
                    _push3(`<li class="flex items-center justify-between py-2"${_scopeId2}><div class="flex-1 pe-2"${_scopeId2}>`);
                    if (editingId.value === cat.id) {
                      _push3(`<input${ssrRenderAttr("value", editingName.value)} class="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"${_scopeId2}>`);
                    } else {
                      _push3(`<span class="text-gray-900 dark:text-gray-100"${_scopeId2}>${ssrInterpolate(cat.name)}</span>`);
                    }
                    _push3(`</div><div class="flex flex-col sm:flex-row gap-2"${_scopeId2}>`);
                    if (editingId.value === cat.id) {
                      _push3(`<!--[--><button class="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Icon), {
                        icon: "mdi:check",
                        class: "text-base"
                      }, null, _parent3, _scopeId2));
                      _push3(`<span${_scopeId2}>${ssrInterpolate(unref(t)("common.save"))}</span></button><button class="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Icon), {
                        icon: "mdi:close",
                        class: "text-base"
                      }, null, _parent3, _scopeId2));
                      _push3(`<span${_scopeId2}>${ssrInterpolate(unref(t)("common.cancel"))}</span></button><!--]-->`);
                    } else {
                      _push3(`<!--[--><button class="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 focus:outline-none focus:ring-2 focus:ring-amber-500"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Icon), {
                        icon: "mdi:pencil-outline",
                        class: "text-base"
                      }, null, _parent3, _scopeId2));
                      _push3(`<span${_scopeId2}>${ssrInterpolate(unref(t)("common.edit"))}</span></button><button class="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-500"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Icon), {
                        icon: "mdi:delete-outline",
                        class: "text-base"
                      }, null, _parent3, _scopeId2));
                      _push3(`<span${_scopeId2}>${ssrInterpolate(unref(t)("common.delete"))}</span></button><!--]-->`);
                    }
                    _push3(`</div></li>`);
                  });
                  _push3(`<!--]--></ul><div class="mt-4 text-end"${_scopeId2}><button class="inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:close",
                    class: "text-base"
                  }, null, _parent3, _scopeId2));
                  _push3(`<span${_scopeId2}>${ssrInterpolate(unref(t)("common.close"))}</span></button></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                      createVNode(unref(DialogTitle), { class: "text-lg font-semibold text-gray-900 dark:text-gray-100" }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "mdi:format-list-bulleted",
                            class: "inline-block me-2 text-gray-600 dark:text-gray-400"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("categories.manage")), 1)
                        ]),
                        _: 1
                      }),
                      createVNode("button", {
                        onClick: ($event) => isOpen.value = false,
                        class: "inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:close",
                          class: "text-base"
                        })
                      ], 8, ["onClick"])
                    ]),
                    createVNode("div", { class: "flex flex-col sm:flex-row gap-2 mb-4" }, [
                      createVNode("div", { class: "flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition" }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:format-list-bulleted",
                          class: "ms-3 text-gray-500 dark:text-gray-400 text-base"
                        }),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => newName.value = $event,
                          onKeydown: withKeys(addCategory, ["enter"]),
                          placeholder: unref(t)("categories.newName"),
                          class: "flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                        }, null, 40, ["onUpdate:modelValue", "placeholder"]), [
                          [vModelText, newName.value]
                        ])
                      ]),
                      createVNode("button", {
                        onClick: addCategory,
                        class: "w-full sm:w-auto inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:plus",
                          class: "text-base"
                        }),
                        createVNode("span", null, toDisplayString(unref(t)("categories.add")), 1)
                      ])
                    ]),
                    createVNode("div", { class: "mb-4 relative" }, [
                      createVNode("div", { class: "flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition" }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:magnify",
                          class: "ms-3 text-gray-500 dark:text-gray-400 text-base"
                        }),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                          placeholder: unref(t)("categories.searchPlaceholder"),
                          class: "flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                        }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                          [vModelText, searchTerm.value]
                        ])
                      ])
                    ]),
                    createVNode("ul", { class: "divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(filteredCategories.value, (cat) => {
                        return openBlock(), createBlock("li", {
                          key: cat.id,
                          class: "flex items-center justify-between py-2"
                        }, [
                          createVNode("div", { class: "flex-1 pe-2" }, [
                            editingId.value === cat.id ? withDirectives((openBlock(), createBlock("input", {
                              key: 0,
                              "onUpdate:modelValue": ($event) => editingName.value = $event,
                              onKeydown: withKeys(($event) => updateCategory(editingId.value), ["enter"]),
                              class: "w-full px-2 py-1 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            }, null, 40, ["onUpdate:modelValue", "onKeydown"])), [
                              [vModelText, editingName.value]
                            ]) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-gray-900 dark:text-gray-100"
                            }, toDisplayString(cat.name), 1))
                          ]),
                          createVNode("div", { class: "flex flex-col sm:flex-row gap-2" }, [
                            editingId.value === cat.id ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              createVNode("button", {
                                onClick: ($event) => updateCategory(cat.id),
                                class: "inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              }, [
                                createVNode(unref(Icon), {
                                  icon: "mdi:check",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString(unref(t)("common.save")), 1)
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: cancelEdit,
                                class: "inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              }, [
                                createVNode(unref(Icon), {
                                  icon: "mdi:close",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString(unref(t)("common.cancel")), 1)
                              ])
                            ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                              createVNode("button", {
                                onClick: ($event) => startEdit(cat),
                                class: "inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                              }, [
                                createVNode(unref(Icon), {
                                  icon: "mdi:pencil-outline",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString(unref(t)("common.edit")), 1)
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => deleteCategory(cat.id),
                                class: "inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-500"
                              }, [
                                createVNode(unref(Icon), {
                                  icon: "mdi:delete-outline",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString(unref(t)("common.delete")), 1)
                              ], 8, ["onClick"])
                            ], 64))
                          ])
                        ]);
                      }), 128))
                    ]),
                    createVNode("div", { class: "mt-4 text-end" }, [
                      createVNode("button", {
                        onClick: ($event) => isOpen.value = false,
                        class: "inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:close",
                          class: "text-base"
                        }),
                        createVNode("span", null, toDisplayString(unref(t)("common.close")), 1)
                      ], 8, ["onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "fixed inset-0 bg-black/30 backdrop-blur-sm" }),
              createVNode("div", { class: "fixed inset-0 flex items-center justify-center p-4" }, [
                createVNode(unref(DialogPanel), { class: "w-full max-w-sm sm:max-w-md overflow-auto rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-start shadow-xl" }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                      createVNode(unref(DialogTitle), { class: "text-lg font-semibold text-gray-900 dark:text-gray-100" }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "mdi:format-list-bulleted",
                            class: "inline-block me-2 text-gray-600 dark:text-gray-400"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("categories.manage")), 1)
                        ]),
                        _: 1
                      }),
                      createVNode("button", {
                        onClick: ($event) => isOpen.value = false,
                        class: "inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:close",
                          class: "text-base"
                        })
                      ], 8, ["onClick"])
                    ]),
                    createVNode("div", { class: "flex flex-col sm:flex-row gap-2 mb-4" }, [
                      createVNode("div", { class: "flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition" }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:format-list-bulleted",
                          class: "ms-3 text-gray-500 dark:text-gray-400 text-base"
                        }),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => newName.value = $event,
                          onKeydown: withKeys(addCategory, ["enter"]),
                          placeholder: unref(t)("categories.newName"),
                          class: "flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                        }, null, 40, ["onUpdate:modelValue", "placeholder"]), [
                          [vModelText, newName.value]
                        ])
                      ]),
                      createVNode("button", {
                        onClick: addCategory,
                        class: "w-full sm:w-auto inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:plus",
                          class: "text-base"
                        }),
                        createVNode("span", null, toDisplayString(unref(t)("categories.add")), 1)
                      ])
                    ]),
                    createVNode("div", { class: "mb-4 relative" }, [
                      createVNode("div", { class: "flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition" }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:magnify",
                          class: "ms-3 text-gray-500 dark:text-gray-400 text-base"
                        }),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                          placeholder: unref(t)("categories.searchPlaceholder"),
                          class: "flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                        }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                          [vModelText, searchTerm.value]
                        ])
                      ])
                    ]),
                    createVNode("ul", { class: "divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(filteredCategories.value, (cat) => {
                        return openBlock(), createBlock("li", {
                          key: cat.id,
                          class: "flex items-center justify-between py-2"
                        }, [
                          createVNode("div", { class: "flex-1 pe-2" }, [
                            editingId.value === cat.id ? withDirectives((openBlock(), createBlock("input", {
                              key: 0,
                              "onUpdate:modelValue": ($event) => editingName.value = $event,
                              onKeydown: withKeys(($event) => updateCategory(editingId.value), ["enter"]),
                              class: "w-full px-2 py-1 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            }, null, 40, ["onUpdate:modelValue", "onKeydown"])), [
                              [vModelText, editingName.value]
                            ]) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-gray-900 dark:text-gray-100"
                            }, toDisplayString(cat.name), 1))
                          ]),
                          createVNode("div", { class: "flex flex-col sm:flex-row gap-2" }, [
                            editingId.value === cat.id ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              createVNode("button", {
                                onClick: ($event) => updateCategory(cat.id),
                                class: "inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              }, [
                                createVNode(unref(Icon), {
                                  icon: "mdi:check",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString(unref(t)("common.save")), 1)
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: cancelEdit,
                                class: "inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              }, [
                                createVNode(unref(Icon), {
                                  icon: "mdi:close",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString(unref(t)("common.cancel")), 1)
                              ])
                            ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                              createVNode("button", {
                                onClick: ($event) => startEdit(cat),
                                class: "inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                              }, [
                                createVNode(unref(Icon), {
                                  icon: "mdi:pencil-outline",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString(unref(t)("common.edit")), 1)
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => deleteCategory(cat.id),
                                class: "inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-500"
                              }, [
                                createVNode(unref(Icon), {
                                  icon: "mdi:delete-outline",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString(unref(t)("common.delete")), 1)
                              ], 8, ["onClick"])
                            ], 64))
                          ])
                        ]);
                      }), 128))
                    ]),
                    createVNode("div", { class: "mt-4 text-end" }, [
                      createVNode("button", {
                        onClick: ($event) => isOpen.value = false,
                        class: "inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:close",
                          class: "text-base"
                        }),
                        createVNode("span", null, toDisplayString(unref(t)("common.close")), 1)
                      ], 8, ["onClick"])
                    ])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/CategoriesManagement.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {
  __name: "SeriesManagement",
  __ssrInlineRender: true,
  emits: ["changed"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const { t } = useI18n();
    useLocalePath();
    const emit = __emit;
    const toast = useToast();
    const isOpen = ref(false);
    const series = ref([]);
    const newName = ref("");
    const error = ref("");
    function slugify(name) {
      return String(name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
    }
    async function load() {
      var _a;
      error.value = "";
      const { data, error: err } = await supabase.from("series").select("id, name, slug").order("name");
      if (err) {
        error.value = ((_a = err.message) == null ? void 0 : _a.includes("does not exist")) || err.code === "42P01" ? t("series.installHint") : err.message;
        series.value = [];
        return;
      }
      series.value = data || [];
    }
    async function addSeries() {
      const name = newName.value.trim();
      if (!name) return;
      const slug = slugify(name);
      const { error: err } = await supabase.from("series").insert([{ name, slug }]);
      if (err) {
        toast.error(err.message);
        return;
      }
      newName.value = "";
      await load();
      emit("changed");
      toast.success(t("series.created"));
    }
    async function removeSeries(id) {
      const { error: err } = await supabase.from("series").delete().eq("id", id);
      if (err) {
        toast.error(err.message);
        return;
      }
      await load();
      emit("changed");
      toast.success(t("series.removed"));
    }
    __expose({ load, series });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps(_ctx.$attrs, _attrs))}><button class="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:bookshelf",
        class: "text-base"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(unref(t)("series.manage"))}</span></button>`);
      _push(ssrRenderComponent(unref(Dialog), {
        open: isOpen.value,
        onClose: () => isOpen.value = false,
        class: "relative z-50"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="fixed inset-0 bg-black/30 backdrop-blur-sm"${_scopeId}></div><div class="fixed inset-0 flex items-center justify-center p-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DialogPanel), { class: "w-full max-w-sm sm:max-w-md overflow-auto rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-left shadow-xl" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center justify-between mb-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(DialogTitle), { class: "text-lg font-semibold text-gray-900 dark:text-gray-100" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Icon), {
                          icon: "mdi:bookshelf",
                          class: "inline-block mr-2 text-gray-600 dark:text-gray-400"
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(unref(t)("series.manage"))}`);
                      } else {
                        return [
                          createVNode(unref(Icon), {
                            icon: "mdi:bookshelf",
                            class: "inline-block mr-2 text-gray-600 dark:text-gray-400"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("series.manage")), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<button class="inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:close",
                    class: "text-base"
                  }, null, _parent3, _scopeId2));
                  _push3(`</button></div><div class="flex flex-col gap-2 mb-4"${_scopeId2}><input${ssrRenderAttr("value", newName.value)}${ssrRenderAttr("placeholder", unref(t)("series.newName"))} class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"${_scopeId2}><button class="inline-flex items-center justify-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:plus",
                    class: "text-base"
                  }, null, _parent3, _scopeId2));
                  _push3(` ${ssrInterpolate(unref(t)("series.add"))}</button></div><ul class="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto"${_scopeId2}><!--[-->`);
                  ssrRenderList(series.value, (item) => {
                    _push3(`<li class="flex items-center justify-between py-2 gap-2"${_scopeId2}><div class="min-w-0 flex-1"${_scopeId2}><div class="truncate text-gray-900 dark:text-gray-100"${_scopeId2}>${ssrInterpolate(item.name)}</div><div class="truncate text-[11px] text-gray-500"${_scopeId2}>${ssrInterpolate(item.slug)}</div></div><button class="inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: "mdi:delete-outline",
                      class: "text-sm"
                    }, null, _parent3, _scopeId2));
                    _push3(`</button></li>`);
                  });
                  _push3(`<!--]--></ul>`);
                  if (error.value) {
                    _push3(`<p class="mt-3 text-xs text-amber-600 dark:text-amber-400"${_scopeId2}>${ssrInterpolate(error.value)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                      createVNode(unref(DialogTitle), { class: "text-lg font-semibold text-gray-900 dark:text-gray-100" }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "mdi:bookshelf",
                            class: "inline-block mr-2 text-gray-600 dark:text-gray-400"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("series.manage")), 1)
                        ]),
                        _: 1
                      }),
                      createVNode("button", {
                        onClick: ($event) => isOpen.value = false,
                        class: "inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:close",
                          class: "text-base"
                        })
                      ], 8, ["onClick"])
                    ]),
                    createVNode("div", { class: "flex flex-col gap-2 mb-4" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => newName.value = $event,
                        onKeydown: withKeys(addSeries, ["enter"]),
                        placeholder: unref(t)("series.newName"),
                        class: "h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                      }, null, 40, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, newName.value]
                      ]),
                      createVNode("button", {
                        onClick: addSeries,
                        class: "inline-flex items-center justify-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:plus",
                          class: "text-base"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("series.add")), 1)
                      ])
                    ]),
                    createVNode("ul", { class: "divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(series.value, (item) => {
                        return openBlock(), createBlock("li", {
                          key: item.id,
                          class: "flex items-center justify-between py-2 gap-2"
                        }, [
                          createVNode("div", { class: "min-w-0 flex-1" }, [
                            createVNode("div", { class: "truncate text-gray-900 dark:text-gray-100" }, toDisplayString(item.name), 1),
                            createVNode("div", { class: "truncate text-[11px] text-gray-500" }, toDisplayString(item.slug), 1)
                          ]),
                          createVNode("button", {
                            onClick: ($event) => removeSeries(item.id),
                            class: "inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                          }, [
                            createVNode(unref(Icon), {
                              icon: "mdi:delete-outline",
                              class: "text-sm"
                            })
                          ], 8, ["onClick"])
                        ]);
                      }), 128))
                    ]),
                    error.value ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-3 text-xs text-amber-600 dark:text-amber-400"
                    }, toDisplayString(error.value), 1)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "fixed inset-0 bg-black/30 backdrop-blur-sm" }),
              createVNode("div", { class: "fixed inset-0 flex items-center justify-center p-4" }, [
                createVNode(unref(DialogPanel), { class: "w-full max-w-sm sm:max-w-md overflow-auto rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-left shadow-xl" }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                      createVNode(unref(DialogTitle), { class: "text-lg font-semibold text-gray-900 dark:text-gray-100" }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "mdi:bookshelf",
                            class: "inline-block mr-2 text-gray-600 dark:text-gray-400"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("series.manage")), 1)
                        ]),
                        _: 1
                      }),
                      createVNode("button", {
                        onClick: ($event) => isOpen.value = false,
                        class: "inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:close",
                          class: "text-base"
                        })
                      ], 8, ["onClick"])
                    ]),
                    createVNode("div", { class: "flex flex-col gap-2 mb-4" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => newName.value = $event,
                        onKeydown: withKeys(addSeries, ["enter"]),
                        placeholder: unref(t)("series.newName"),
                        class: "h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                      }, null, 40, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, newName.value]
                      ]),
                      createVNode("button", {
                        onClick: addSeries,
                        class: "inline-flex items-center justify-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:plus",
                          class: "text-base"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("series.add")), 1)
                      ])
                    ]),
                    createVNode("ul", { class: "divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(series.value, (item) => {
                        return openBlock(), createBlock("li", {
                          key: item.id,
                          class: "flex items-center justify-between py-2 gap-2"
                        }, [
                          createVNode("div", { class: "min-w-0 flex-1" }, [
                            createVNode("div", { class: "truncate text-gray-900 dark:text-gray-100" }, toDisplayString(item.name), 1),
                            createVNode("div", { class: "truncate text-[11px] text-gray-500" }, toDisplayString(item.slug), 1)
                          ]),
                          createVNode("button", {
                            onClick: ($event) => removeSeries(item.id),
                            class: "inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                          }, [
                            createVNode(unref(Icon), {
                              icon: "mdi:delete-outline",
                              class: "text-sm"
                            })
                          ], 8, ["onClick"])
                        ]);
                      }), 128))
                    ]),
                    error.value ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-3 text-xs text-amber-600 dark:text-amber-400"
                    }, toDisplayString(error.value), 1)) : createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/SeriesManagement.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = {
  __name: "FooterCreditsSettings",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    const branding = useBranding();
    const saving = ref(false);
    const error = ref("");
    const showWatermarkPrompt = ref(false);
    const local = reactive({ ...DEFAULT_FOOTER_CREDITS });
    const options = computed(() => [
      {
        key: "plumaWatermark",
        label: t("settings.footerCredits.options.plumaWatermark.label"),
        icon: "mdi:feather",
        desc: t("settings.footerCredits.options.plumaWatermark.desc")
      },
      {
        key: "poweredByStack",
        label: t("settings.footerCredits.options.poweredByStack.label"),
        icon: "mdi:layers-outline",
        desc: t("settings.footerCredits.options.poweredByStack.desc")
      },
      {
        key: "rss",
        label: t("settings.footerCredits.options.rss.label"),
        icon: "mdi:rss",
        desc: t("settings.footerCredits.options.rss.desc")
      },
      {
        key: "sitemap",
        label: t("settings.footerCredits.options.sitemap.label"),
        icon: "mdi:map-outline",
        desc: t("settings.footerCredits.options.sitemap.desc")
      }
    ]);
    function syncFromStore() {
      var _a;
      const credits = ((_a = branding.footerCredits) == null ? void 0 : _a.value) || DEFAULT_FOOTER_CREDITS;
      Object.assign(local, { ...DEFAULT_FOOTER_CREDITS, ...credits });
    }
    watch(
      () => {
        var _a;
        return (_a = branding.footerCredits) == null ? void 0 : _a.value;
      },
      () => syncFromStore(),
      { deep: true }
    );
    function confirmHideWatermark() {
      showWatermarkPrompt.value = false;
      local.plumaWatermark = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6 min-w-0 w-full" }, _attrs))}><div class="flex flex-wrap items-start gap-3 mb-2 sm:flex-nowrap"><div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:page-layout-footer",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</div><div class="flex-1 min-w-0"><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase break-words">${ssrInterpolate(unref(t)("settings.footerCredits.title"))}</h2><p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1 break-words">${ssrInterpolate(unref(t)("settings.footerCredits.description"))}</p></div></div><form class="space-y-6"><div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><!--[-->`);
      ssrRenderList(options.value, (opt) => {
        _push(`<div class="flex flex-wrap items-center gap-3 justify-between group rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow transition"><div class="flex items-center gap-3 min-w-0">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: opt.icon,
          class: "w-7 h-7 text-blue-500 dark:text-blue-300 flex-shrink-0"
        }, null, _parent));
        _push(`<div class="flex flex-col min-w-0"><span class="font-semibold text-gray-900 dark:text-white text-sm truncate">${ssrInterpolate(opt.label)}</span><span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words leading-snug">${ssrInterpolate(opt.desc)}</span></div></div><button type="button" role="switch"${ssrRenderAttr("aria-checked", local[opt.key])}${ssrRenderAttr("aria-label", opt.label)} class="${ssrRenderClass([
          "relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none duration-200 ms-auto",
          local[opt.key] ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700",
          "group-hover:ring-2 group-hover:ring-blue-300 group-focus:ring-2 group-focus:ring-blue-400"
        ])}"><span class="${ssrRenderClass([
          "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition duration-200",
          local[opt.key] ? "translate-x-5" : "translate-x-1"
        ])}"></span></button></div>`);
      });
      _push(`<!--]--></div><div class="flex gap-2 pt-2 items-center justify-end"><button type="submit"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-400">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: saving.value ? "mdi:loading" : "mdi:content-save",
        class: [saving.value ? "animate-spin" : "", "text-base"]
      }, null, _parent));
      _push(`<span>${ssrInterpolate(saving.value ? unref(t)("common.saving") : unref(t)("common.save"))}</span></button>`);
      if (error.value) {
        _push(`<span class="text-red-600 text-sm">${ssrInterpolate(error.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form>`);
      _push(ssrRenderComponent(_sfc_main$g, {
        open: showWatermarkPrompt.value,
        tone: "soft",
        icon: "mdi:feather",
        title: unref(t)("settings.footerCredits.watermarkPrompt.title"),
        description: unref(t)("settings.footerCredits.watermarkPrompt.description"),
        body: unref(t)("settings.footerCredits.watermarkPrompt.body"),
        "cancel-label": unref(t)("settings.footerCredits.watermarkPrompt.keep"),
        "confirm-label": unref(t)("settings.footerCredits.watermarkPrompt.hide"),
        onCancel: ($event) => showWatermarkPrompt.value = false,
        onConfirm: confirmHideWatermark
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/FooterCreditsSettings.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = {
  __name: "LocaleSettingsForm",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locales } = useI18n();
    const branding = useBranding();
    const saving = ref(false);
    const error = ref("");
    const validationError = ref("");
    const localEnabled = ref([]);
    const localPrimary = ref("en");
    const dirty = ref(false);
    const catalog = computed(() => {
      const i18nList = unref(locales) || [];
      if (i18nList.length) {
        return i18nList.map((l) => ({
          code: l.code,
          name: l.name || l.code
        }));
      }
      return CONTENT_LOCALES;
    });
    const enabledCatalog = computed(
      () => catalog.value.filter((l) => localEnabled.value.includes(l.code))
    );
    function syncFromStore() {
      var _a, _b;
      const norm = normalizeLocaleSettings(
        (_a = branding.enabledLocales) == null ? void 0 : _a.value,
        (_b = branding.primaryLocale) == null ? void 0 : _b.value
      );
      localEnabled.value = [...norm.enabledLocales];
      localPrimary.value = norm.primaryLocale;
      validationError.value = "";
      dirty.value = false;
    }
    watch(
      () => {
        var _a, _b;
        return [
          ...((_a = branding.enabledLocales) == null ? void 0 : _a.value) || [],
          (_b = branding.primaryLocale) == null ? void 0 : _b.value
        ];
      },
      () => {
        if (dirty.value || saving.value) return;
        syncFromStore();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6 min-w-0 w-full" }, _attrs))}><div class="flex flex-wrap items-start gap-3 mb-2 sm:flex-nowrap"><div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:translate",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</div><div class="flex-1 min-w-0"><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase break-words">${ssrInterpolate(unref(t)("settings.locales.title"))}</h2><p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1 break-words">${ssrInterpolate(unref(t)("settings.locales.description"))}</p></div></div><form class="space-y-8"><div><h3 class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">${ssrInterpolate(unref(t)("settings.locales.enabledTitle"))}</h3><div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><!--[-->`);
      ssrRenderList(catalog.value, (loc) => {
        _push(`<div class="flex flex-wrap items-center gap-3 justify-between group rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow transition"><div class="flex items-center gap-3 min-w-0"><span class="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase flex items-center justify-center shrink-0">${ssrInterpolate(loc.code)}</span><div class="flex flex-col min-w-0"><span class="font-semibold text-gray-900 dark:text-white text-sm truncate">${ssrInterpolate(loc.name)}</span><span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words leading-snug">${ssrInterpolate(localEnabled.value.includes(loc.code) ? unref(t)("settings.locales.enabledHint") : unref(t)("settings.locales.disabledHint"))}</span></div></div><button type="button" role="switch"${ssrRenderAttr("aria-checked", localEnabled.value.includes(loc.code))}${ssrRenderAttr("aria-label", unref(t)("settings.locales.enable", { name: loc.name }))} class="${ssrRenderClass([
          "relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none duration-200 ms-auto",
          localEnabled.value.includes(loc.code) ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700",
          "group-hover:ring-2 group-hover:ring-blue-300 group-focus:ring-2 group-focus:ring-blue-400"
        ])}"><span class="${ssrRenderClass([
          "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition duration-200",
          localEnabled.value.includes(loc.code) ? "translate-x-5" : "translate-x-1"
        ])}"></span></button></div>`);
      });
      _push(`<!--]--></div></div><div class="pt-2"><h3 class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">${ssrInterpolate(unref(t)("settings.locales.primaryTitle"))}</h3><p class="text-[12px] text-gray-500 dark:text-gray-400 mb-3 break-words">${ssrInterpolate(unref(t)("settings.locales.primaryDescription"))}</p><div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><!--[-->`);
      ssrRenderList(enabledCatalog.value, (loc) => {
        _push(`<button type="button" class="${ssrRenderClass([
          "flex items-center gap-3 rounded-xl px-4 py-3 text-start border transition group",
          localPrimary.value === loc.code ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-sm" : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow"
        ])}"><span class="${ssrRenderClass([
          "w-7 h-7 rounded-lg text-[10px] font-bold uppercase flex items-center justify-center shrink-0",
          localPrimary.value === loc.code ? "bg-blue-500 text-white" : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
        ])}">${ssrInterpolate(loc.code)}</span><div class="flex flex-col min-w-0 flex-1"><span class="font-semibold text-gray-900 dark:text-white text-sm truncate">${ssrInterpolate(loc.name)}</span>`);
        if (localPrimary.value === loc.code) {
          _push(`<span class="text-xs text-blue-600 dark:text-blue-300 mt-0.5">${ssrInterpolate(unref(t)("settings.locales.primaryBadge"))}</span>`);
        } else {
          _push(`<span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${ssrInterpolate(unref(t)("settings.locales.primary"))}</span>`);
        }
        _push(`</div>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: localPrimary.value === loc.code ? "mdi:check-circle" : "mdi:circle-outline",
          class: [
            "w-5 h-5 shrink-0",
            localPrimary.value === loc.code ? "text-blue-500 dark:text-blue-300" : "text-gray-300 dark:text-gray-600"
          ]
        }, null, _parent));
        _push(`</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (validationError.value) {
        _push(`<p class="text-amber-600 dark:text-amber-400 text-sm">${ssrInterpolate(validationError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex gap-2 pt-2 items-center justify-end"><button type="submit"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-400">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: saving.value ? "mdi:loading" : "mdi:content-save",
        class: [saving.value ? "animate-spin" : "", "text-base"]
      }, null, _parent));
      _push(`<span>${ssrInterpolate(saving.value ? unref(t)("common.saving") : unref(t)("common.save"))}</span></button>`);
      if (error.value) {
        _push(`<span class="text-red-600 text-sm">${ssrInterpolate(error.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></div>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/LocaleSettingsForm.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = {
  __name: "LogoUpload",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    const branding = useBranding();
    ref(null);
    ref(null);
    ref(null);
    const lightFile = ref(null);
    const darkFile = ref(null);
    const faviconFile = ref(null);
    const lightPreview = ref(null);
    const darkPreview = ref(null);
    const faviconPreview = ref(null);
    const dragLight = ref(false);
    const dragDark = ref(false);
    const dragFavicon = ref(false);
    const uploading = ref(false);
    const error = ref(null);
    const siteInitial = computed(
      () => (branding.siteName.value || "S").trim().charAt(0).toUpperCase()
    );
    const versionSuffix = computed(
      () => branding.logoVersion.value ? `?v=${branding.logoVersion.value}` : ""
    );
    const lightDisplaySrc = computed(
      () => lightPreview.value || (branding.lightLogoUrl.value ? branding.lightLogoUrl.value + versionSuffix.value : null)
    );
    const darkDisplaySrc = computed(
      () => darkPreview.value || (branding.darkLogoUrl.value ? branding.darkLogoUrl.value + versionSuffix.value : null)
    );
    const faviconDisplaySrc = computed(
      () => faviconPreview.value || (branding.faviconUrl.value ? branding.faviconUrl.value + versionSuffix.value : null)
    );
    const lightDims = ref({ w: null, h: null });
    const darkDims = ref({ w: null, h: null });
    const favDims = ref({ w: null, h: null });
    function measure(src, target) {
      if (!src) {
        target.value = { w: null, h: null };
        return;
      }
      const img = new Image();
      img.onload = () => {
        target.value = { w: img.naturalWidth, h: img.naturalHeight };
      };
      img.src = src;
    }
    watch(lightDisplaySrc, (v) => measure(v, lightDims), { immediate: true });
    watch(darkDisplaySrc, (v) => measure(v, darkDims), { immediate: true });
    watch(faviconDisplaySrc, (v) => measure(v, favDims), { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full min-w-0" }, _attrs))} data-v-6a528ec1><div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between" data-v-6a528ec1><div class="flex items-start gap-3" data-v-6a528ec1><div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300" data-v-6a528ec1>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:image-edit",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</div><div class="flex-1" data-v-6a528ec1><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.title"))}</h2><p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.description"))}</p></div></div></div><div class="p-5 space-y-8 flex-1 flex flex-col" data-v-6a528ec1><div class="grid sm:grid-cols-3 gap-5" data-v-6a528ec1><div data-v-6a528ec1><label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.lightLogo"))}</label><div class="${ssrRenderClass([{ "border-blue-500": dragLight.value }, "relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md text-gray-500 dark:text-gray-400 hover:border-blue-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"])}" role="button" tabindex="0"${ssrRenderAttr("aria-label", unref(t)("settings.logos.lightLogo"))} data-v-6a528ec1><input type="file" accept="image/png,image/svg+xml,image/jpeg" class="hidden" data-v-6a528ec1>`);
      if (lightPreview.value) {
        _push(`<div class="w-full flex flex-col items-center gap-2" data-v-6a528ec1><img${ssrRenderAttr("src", lightPreview.value)}${ssrRenderAttr("alt", unref(t)("settings.logos.lightPreviewAlt"))} class="max-h-20 object-contain" loading="lazy" data-v-6a528ec1><button type="button" class="text-xs text-red-600 hover:underline" data-remove data-v-6a528ec1>${ssrInterpolate(unref(t)("common.remove"))}</button></div>`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:image-outline",
          class: "text-3xl"
        }, null, _parent));
        _push(`<p class="text-xs" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.clickOrDrop"))}</p><!--]-->`);
      }
      _push(`</div></div><div data-v-6a528ec1><label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.darkLogo"))}</label><div class="${ssrRenderClass([{ "border-blue-500": dragDark.value }, "relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md text-gray-500 dark:text-gray-400 hover:border-blue-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"])}" role="button" tabindex="0"${ssrRenderAttr("aria-label", unref(t)("settings.logos.darkLogo"))} data-v-6a528ec1><input type="file" accept="image/png,image/svg+xml,image/jpeg" class="hidden" data-v-6a528ec1>`);
      if (darkPreview.value) {
        _push(`<div class="w-full flex flex-col items-center gap-2" data-v-6a528ec1><img${ssrRenderAttr("src", darkPreview.value)}${ssrRenderAttr("alt", unref(t)("settings.logos.darkPreviewAlt"))} class="max-h-20 object-contain bg-gray-900 p-1 rounded" loading="lazy" data-v-6a528ec1><button type="button" class="text-xs text-red-600 hover:underline" data-remove data-v-6a528ec1>${ssrInterpolate(unref(t)("common.remove"))}</button></div>`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:image-outline",
          class: "text-3xl"
        }, null, _parent));
        _push(`<p class="text-xs" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.clickOrDrop"))}</p><!--]-->`);
      }
      _push(`</div></div><div data-v-6a528ec1><label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.favicon"))}</label><div class="${ssrRenderClass([{ "border-blue-500": dragFavicon.value }, "relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md text-gray-500 dark:text-gray-400 hover:border-blue-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"])}" role="button" tabindex="0"${ssrRenderAttr("aria-label", unref(t)("settings.logos.favicon"))} data-v-6a528ec1><input type="file" accept="image/x-icon,image/png" class="hidden" data-v-6a528ec1>`);
      if (faviconPreview.value) {
        _push(`<div class="w-full flex flex-col items-center gap-2" data-v-6a528ec1><img${ssrRenderAttr("src", faviconPreview.value)}${ssrRenderAttr("alt", unref(t)("settings.logos.faviconPreviewAlt"))} class="h-12 w-12 object-contain bg-white dark:bg-gray-900 p-1 rounded" loading="lazy" data-v-6a528ec1><button type="button" class="text-xs text-red-600 hover:underline" data-remove data-v-6a528ec1>${ssrInterpolate(unref(t)("common.remove"))}</button></div>`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:star-four-points-outline",
          class: "text-3xl"
        }, null, _parent));
        _push(`<p class="text-xs" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.clickOrDrop"))}</p><!--]-->`);
      }
      _push(`</div></div></div><div class="grid md:grid-cols-2 gap-6"${ssrRenderAttr("aria-label", unref(t)("settings.logos.previewsAria"))} data-v-6a528ec1>`);
      if (darkDisplaySrc.value && lightDisplaySrc.value && faviconDisplaySrc.value) {
        _push(`<div class="flex justify-center md:col-span-2" data-v-6a528ec1><span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-900/30 text-green-300 text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:check",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("settings.logos.allAssetsSet"))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-4 shadow-sm" data-v-6a528ec1><div class="flex items-center justify-between" data-v-6a528ec1><h3 class="text-xs font-semibold uppercase tracking-wide text-gray-600" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.lightPreview"))}</h3><div class="flex items-center gap-2" data-v-6a528ec1>`);
      if (lightDims.value.w) {
        _push(`<span class="text-[10px] text-gray-400" data-v-6a528ec1>${ssrInterpolate(lightDims.value.w)}\xD7${ssrInterpolate(lightDims.value.h)}px</span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(branding).lightLogoUrl.value) {
        _push(`<button type="button" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:delete",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("common.remove"))}</button>`);
      } else if (lightPreview.value) {
        _push(`<button type="button" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700/60 text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:close",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("common.clear"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="rounded-md border border-gray-200 bg-white px-3 py-2 flex items-center gap-3" data-v-6a528ec1><div class="flex items-center gap-2 min-w-0" data-v-6a528ec1>`);
      if (lightDisplaySrc.value) {
        _push(`<img${ssrRenderAttr("src", lightDisplaySrc.value)}${ssrRenderAttr("alt", unref(t)("settings.logos.lightLogoAlt"))} class="h-8 max-w-[140px] object-contain" loading="lazy" data-v-6a528ec1>`);
      } else {
        _push(`<div class="h-8 w-8 rounded-md bg-blue-600 text-white flex items-center justify-center text-sm font-semibold" data-v-6a528ec1>${ssrInterpolate(siteInitial.value)}</div>`);
      }
      _push(`<span class="text-sm font-medium text-gray-700 truncate max-w-[140px]" data-v-6a528ec1>${ssrInterpolate(unref(branding).siteName.value || unref(t)("settings.logos.siteNameFallback"))}</span></div><div class="flex items-center gap-2 text-[10px] text-gray-500 ms-auto opacity-70 select-none" data-v-6a528ec1><span class="hidden sm:inline" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.navHome"))}</span><span class="hidden sm:inline" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.navPosts"))}</span><span class="hidden md:inline" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.navAbout"))}</span></div></div><div class="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2" data-v-6a528ec1><div class="flex items-center gap-2 flex-1 min-w-0" data-v-6a528ec1><div class="flex items-center gap-2" data-v-6a528ec1><div class="h-4 w-4 rounded overflow-hidden flex items-center justify-center bg-gray-200" data-v-6a528ec1>`);
      if (faviconDisplaySrc.value) {
        _push(`<img${ssrRenderAttr("src", faviconDisplaySrc.value)}${ssrRenderAttr("alt", unref(t)("settings.logos.favAlt"))} class="h-4 w-4 object-contain" loading="lazy" data-v-6a528ec1>`);
      } else {
        _push(`<span class="text-[8px] font-semibold text-gray-600 dark:text-gray-300" data-v-6a528ec1>${ssrInterpolate(siteInitial.value)}</span>`);
      }
      _push(`</div><span class="text-[11px] font-medium text-gray-700 truncate max-w-[130px]" data-v-6a528ec1>${ssrInterpolate(unref(branding).siteName.value || unref(t)("settings.logos.siteNameFallback"))}</span></div><span class="ms-auto text-[9px] text-gray-400" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.tab"))}</span></div><div class="flex items-center gap-1" data-v-6a528ec1>`);
      if (unref(branding).faviconUrl.value) {
        _push(`<button type="button" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition text-[10px]"${ssrRenderAttr("aria-label", unref(t)("settings.logos.removeFavicon"))} data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:delete",
          class: "text-xs"
        }, null, _parent));
        _push(`</button>`);
      } else if (faviconPreview.value) {
        _push(`<button type="button" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700/60 text-[10px]"${ssrRenderAttr("aria-label", unref(t)("settings.logos.clearFavicon"))} data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:close",
          class: "text-xs"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex flex-wrap gap-2 pt-1" data-v-6a528ec1>`);
      if (!lightDisplaySrc.value) {
        _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:alert-circle-outline",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("settings.logos.missingLightLogo"))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (lightDisplaySrc.value) {
        _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:check",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("settings.logos.lightLogoSet"))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (faviconDisplaySrc.value) {
        _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:star-four-points",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("settings.logos.faviconSet"))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (!faviconDisplaySrc.value) {
        _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:alert",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("settings.logos.missingFavicon"))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-4 flex flex-col gap-4 relative overflow-hidden shadow-sm" data-v-6a528ec1><div class="flex items-center justify-between" data-v-6a528ec1><h3 class="text-xs font-semibold uppercase tracking-wide text-gray-300" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.darkPreview"))}</h3><div class="flex items-center gap-2" data-v-6a528ec1>`);
      if (darkDims.value.w) {
        _push(`<span class="text-[10px] text-gray-500" data-v-6a528ec1>${ssrInterpolate(darkDims.value.w)}\xD7${ssrInterpolate(darkDims.value.h)}px</span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(branding).darkLogoUrl.value) {
        _push(`<button type="button" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-900/30 text-red-300 hover:bg-red-900/50 transition text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:delete",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("common.remove"))}</button>`);
      } else if (darkPreview.value) {
        _push(`<button type="button" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-700/40 text-gray-300 hover:bg-gray-700/60 text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:close",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("common.clear"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="rounded-md border border-gray-700 bg-gray-800/60 px-3 py-2 flex items-center gap-3 backdrop-blur" data-v-6a528ec1><div class="flex items-center gap-2 min-w-0" data-v-6a528ec1>`);
      if (darkDisplaySrc.value) {
        _push(`<img${ssrRenderAttr("src", darkDisplaySrc.value)}${ssrRenderAttr("alt", unref(t)("settings.logos.darkLogoAlt"))} class="h-8 max-w-[140px] object-contain" loading="lazy" data-v-6a528ec1>`);
      } else {
        _push(`<div class="h-8 w-8 rounded-md bg-gray-700 text-gray-200 flex items-center justify-center text-sm font-semibold" data-v-6a528ec1>${ssrInterpolate(siteInitial.value)}</div>`);
      }
      _push(`<span class="text-sm font-medium text-gray-200 truncate max-w-[140px]" data-v-6a528ec1>${ssrInterpolate(unref(branding).siteName.value || unref(t)("settings.logos.siteNameFallback"))}</span></div><div class="flex items-center gap-2 text-[10px] text-gray-400 ms-auto opacity-70 select-none" data-v-6a528ec1><span class="hidden sm:inline" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.navHome"))}</span><span class="hidden sm:inline" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.navPosts"))}</span><span class="hidden md:inline" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.navAbout"))}</span></div></div><div class="flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800/70 px-3 py-2" data-v-6a528ec1><div class="flex items-center gap-2 flex-1 min-w-0" data-v-6a528ec1><div class="h-4 w-4 rounded overflow-hidden flex items-center justify-center bg-gray-600" data-v-6a528ec1>`);
      if (faviconDisplaySrc.value) {
        _push(`<img${ssrRenderAttr("src", faviconDisplaySrc.value)}${ssrRenderAttr("alt", unref(t)("settings.logos.favAlt"))} class="h-4 w-4 object-contain" loading="lazy" data-v-6a528ec1>`);
      } else {
        _push(`<span class="text-[8px] font-semibold text-gray-200" data-v-6a528ec1>${ssrInterpolate(siteInitial.value)}</span>`);
      }
      _push(`</div><span class="text-[11px] font-medium text-gray-300 truncate max-w-[130px]" data-v-6a528ec1>${ssrInterpolate(unref(branding).siteName.value || unref(t)("settings.logos.siteNameFallback"))}</span><span class="ms-auto text-[9px] text-gray-500" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.tab"))}</span></div><div class="flex items-center gap-1" data-v-6a528ec1>`);
      if (unref(branding).faviconUrl.value) {
        _push(`<button type="button" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-900/30 text-red-300 hover:bg-red-900/50 transition text-[10px]"${ssrRenderAttr("title", unref(t)("settings.logos.removeFavicon"))}${ssrRenderAttr("aria-label", unref(t)("settings.logos.removeFavicon"))} data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:delete",
          class: "text-xs"
        }, null, _parent));
        _push(`</button>`);
      } else if (faviconPreview.value) {
        _push(`<button type="button" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-700/40 text-gray-300 hover:bg-gray-700/60 text-[10px]"${ssrRenderAttr("title", unref(t)("settings.logos.clearFavicon"))}${ssrRenderAttr("aria-label", unref(t)("settings.logos.clearFavicon"))} data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:close",
          class: "text-xs"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex flex-wrap gap-2 pt-1" data-v-6a528ec1>`);
      if (!darkDisplaySrc.value) {
        _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-300 text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:alert-circle-outline",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("settings.logos.missingDarkLogo"))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (darkDisplaySrc.value) {
        _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-900/30 text-green-300 text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:check",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("settings.logos.darkLogoSet"))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (faviconDisplaySrc.value) {
        _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-300 text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:star-four-points",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("settings.logos.faviconSet"))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (!faviconDisplaySrc.value) {
        _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-900/30 text-rose-300 text-[10px]" data-v-6a528ec1>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:alert",
          class: "text-xs"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("settings.logos.missingFavicon"))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (error.value) {
        _push(`<div class="text-xs text-red-600" data-v-6a528ec1>${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-auto" data-v-6a528ec1><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-2 sm:px-0" data-v-6a528ec1><p class="text-[11px] text-gray-500 dark:text-gray-400 leading-snug" data-v-6a528ec1>${ssrInterpolate(unref(t)("settings.logos.accepted"))}</p><div class="flex items-center gap-3" data-v-6a528ec1><button${ssrIncludeBooleanAttr(uploading.value || !lightFile.value && !darkFile.value && !faviconFile.value) ? " disabled" : ""} class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-50" data-v-6a528ec1>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:backup-restore",
        class: "text-sm"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("common.reset"))}</button><button${ssrIncludeBooleanAttr(!lightFile.value && !darkFile.value && !faviconFile.value || uploading.value) ? " disabled" : ""} class="inline-flex items-center gap-2 h-9 px-5 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-6a528ec1>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: uploading.value ? "mdi:loading" : "mdi:upload",
        class: [uploading.value ? "animate-spin" : "", "text-base"]
      }, null, _parent));
      _push(`<span data-v-6a528ec1>${ssrInterpolate(uploading.value ? unref(t)("common.uploading") : unref(t)("common.upload"))}</span></button></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/LogoUpload.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const LogoUpload = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-6a528ec1"]]);
const _sfc_main$6 = {
  __name: "BrandingMetaForm",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    const branding = useBranding();
    const siteName = ref("");
    const siteDescription = ref("");
    const twitterHandle = ref("");
    const links = ref([]);
    const collapsed = ref(false);
    const saving = ref(false);
    ref("");
    ref(false);
    const pendingAdds = ref(0);
    const openIconIndex = ref(null);
    const pickerCoords = ref({ top: 0, left: 0 });
    const pickerStyle = computed(() => ({
      top: pickerCoords.value.top + "px",
      left: pickerCoords.value.left + "px"
    }));
    const iconSearch = ref("");
    const iconGroupDefs = [
      { key: "social", icons: ["mdi:facebook", "mdi:facebook-messenger", "mdi:instagram", "mdi:twitter", "mdi:reddit", "mdi:pinterest", "mdi:tumblr", "mdi:snapchat", "mdi:mastodon", "mdi:vk", "mdi:wechat", "mdi:sina-weibo", "ic:baseline-tiktok"] },
      { key: "media", icons: ["mdi:youtube", "mdi:vimeo", "mdi:twitch", "mdi:mixcloud", "mdi:bandcamp", "mdi:lastfm", "mdi:flickr"] },
      { key: "messaging", icons: ["mdi:discord", "mdi:slack", "mdi:telegram", "mdi:whatsapp", "mdi:signal", "mdi:skype"] },
      { key: "developer", icons: ["mdi:github", "mdi:github-face", "mdi:gitlab", "mdi:bitbucket", "mdi:codepen", "mdi:stack-overflow"] },
      { key: "content", icons: ["mdi:medium", "mdi:wordpress", "mdi:newspaper", "mdi:forum", "mdi:dribbble", "mdi:behance"] },
      { key: "community", icons: ["mdi:patreon", "mdi:steam", "mdi:meetup", "mdi:quora", "mdi:disqus"] },
      { key: "corporate", icons: ["mdi:google", "mdi:apple", "mdi:android", "mdi:microsoft"] },
      { key: "general", icons: ["mdi:link-variant", "mdi:web", "mdi:email", "mdi:email-outline", "mdi:earth", "mdi:phone", "mdi:account", "mdi:star", "mdi:bookmark", "mdi:pen", "mdi:feather", "mdi:camera", "mdi:cloud", "mdi:message", "mdi:rss"] }
    ];
    const filteredGroups = computed(() => {
      const term = iconSearch.value.trim().toLowerCase();
      return iconGroupDefs.map((g) => ({
        key: g.key,
        label: t(`settings.siteMeta.iconGroups.${g.key}`),
        icons: g.icons.filter((ic) => !term || ic.includes(term))
      })).filter((g) => g.icons.length);
    });
    const totalIcons = computed(() => filteredGroups.value.reduce((sum, g) => sum + g.icons.length, 0));
    function safeId() {
      try {
        if (crypto == null ? void 0 : crypto.randomUUID) return crypto.randomUUID();
      } catch (_) {
      }
      return "sl_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    }
    function init() {
      siteName.value = branding.siteName.value || "";
      siteDescription.value = branding.siteDescription.value || "";
      twitterHandle.value = (branding.twitterHandle.value || "").replace(/^@/, "");
      links.value = (branding.socialLinks.value || []).map((l) => ({
        id: safeId(),
        label: l.label || "",
        url: l.url || "",
        icon: l.icon || "mdi:link-variant"
      }));
      collapsed.value = links.value.length > 4;
    }
    watch(
      () => branding.brandingLoaded.value,
      (loaded) => {
        if (loaded) {
          init();
          if (pendingAdds.value > 0) {
            for (let i = 0; i < pendingAdds.value; i++) internalAdd();
            pendingAdds.value = 0;
          }
        }
      },
      { immediate: true }
    );
    function internalAdd() {
      links.value = [
        ...links.value,
        { id: safeId(), label: "", url: "", icon: "mdi:link-variant" }
      ];
      collapsed.value = false;
      nextTick(() => {
        var _a;
        const container = (void 0).querySelector("[data-social-links]");
        if (container) {
          const inputs = container.querySelectorAll("input[data-link-label]");
          (_a = inputs[inputs.length - 1]) == null ? void 0 : _a.focus();
        }
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6 min-w-0 w-full" }, _attrs))} data-v-ea3d009f><div class="flex flex-wrap items-start gap-3 sm:flex-nowrap" data-v-ea3d009f><div class="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300" data-v-ea3d009f>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:brush",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</div><div class="flex-1 min-w-0" data-v-ea3d009f><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase break-words" data-v-ea3d009f>${ssrInterpolate(unref(t)("settings.siteMeta.title"))}</h2><p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1 break-words" data-v-ea3d009f>${ssrInterpolate(unref(t)("settings.siteMeta.description"))}</p></div></div><form class="space-y-5" data-v-ea3d009f><div data-v-ea3d009f><label class="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1" data-v-ea3d009f>${ssrInterpolate(unref(t)("settings.siteMeta.siteName"))}</label><input${ssrRenderAttr("value", siteName.value)} type="text" class="w-full h-11 rounded-md px-3 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrRenderAttr("placeholder", unref(t)("settings.siteMeta.siteNamePlaceholder"))} required data-v-ea3d009f></div><div data-v-ea3d009f><label class="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1" data-v-ea3d009f>${ssrInterpolate(unref(t)("settings.siteMeta.siteDescription"))}</label><textarea rows="3" class="w-full rounded-md px-3 py-2 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"${ssrRenderAttr("placeholder", unref(t)("settings.siteMeta.siteDescriptionPlaceholder"))} data-v-ea3d009f>${ssrInterpolate(siteDescription.value)}</textarea></div><div data-v-ea3d009f><label class="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1" data-v-ea3d009f>${ssrInterpolate(unref(t)("settings.siteMeta.twitterHandle"))}</label><div class="flex items-center h-11 rounded-md bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden" data-v-ea3d009f><span class="ps-3 text-sm text-gray-400 select-none" data-v-ea3d009f>@</span><input${ssrRenderAttr("value", twitterHandle.value)} type="text" class="flex-1 h-full px-2 bg-transparent text-sm focus:outline-none"${ssrRenderAttr("placeholder", unref(t)("settings.siteMeta.twitterHandlePlaceholder"))} autocomplete="off" maxlength="15" data-v-ea3d009f></div><p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400" data-v-ea3d009f>${ssrInterpolate(unref(t)("settings.siteMeta.twitterHint"))}</p></div><div class="space-y-3" data-v-ea3d009f><div class="flex flex-wrap items-center justify-between gap-2" data-v-ea3d009f><label class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400" data-v-ea3d009f>${ssrInterpolate(unref(t)("settings.siteMeta.socialLinks"))} `);
      if (links.value.length) {
        _push(`<span class="font-normal text-gray-400" data-v-ea3d009f>(${ssrInterpolate(links.value.length)})</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><div class="flex flex-wrap items-center gap-2 justify-end" data-v-ea3d009f>`);
      if (links.value.length) {
        _push(`<button type="button" class="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/60" data-v-ea3d009f>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: collapsed.value ? "mdi:chevron-down" : "mdi:chevron-up",
          class: "text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(collapsed.value ? unref(t)("settings.siteMeta.expand") : unref(t)("settings.siteMeta.collapse"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="inline-flex items-center gap-1 h-7 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/60" data-v-ea3d009f>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:plus",
        class: "text-sm"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("settings.siteMeta.add"))}</button></div></div>`);
      if (links.value.length === 0) {
        _push(`<div class="text-[11px] text-gray-500 dark:text-gray-400" data-v-ea3d009f>${ssrInterpolate(unref(t)("settings.siteMeta.noLinks"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="max-h-64 overflow-auto pe-1 custom-scroll space-y-3" data-social-links style="${ssrRenderStyle(!collapsed.value ? null : { display: "none" })}" data-v-ea3d009f><ul class="space-y-3" data-v-ea3d009f><!--[-->`);
      ssrRenderList(links.value, (link, i) => {
        _push(`<li class="group relative border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/30 flex flex-col gap-2" data-v-ea3d009f><div class="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center" data-v-ea3d009f><input${ssrRenderAttr("value", link.label)} type="text" data-link-label${ssrRenderAttr("placeholder", unref(t)("settings.siteMeta.labelPlaceholder"))} class="h-9 rounded-md px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2" data-v-ea3d009f><input${ssrRenderAttr("value", link.url)} type="text"${ssrRenderAttr("placeholder", unref(t)("settings.siteMeta.urlPlaceholder"))} class="h-9 rounded-md px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-3" data-v-ea3d009f></div><div class="flex flex-wrap items-center gap-2 relative w-full" data-v-ea3d009f><button type="button" class="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 shrink-0 hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrRenderAttr("aria-expanded", openIconIndex.value === i)}${ssrRenderAttr("aria-label", unref(t)("settings.siteMeta.pickIcon"))} data-v-ea3d009f>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: link.icon || "mdi:link-variant",
          class: "w-5 h-5"
        }, null, _parent));
        _push(`</button>`);
        ssrRenderTeleport(_push, (_push2) => {
          if (openIconIndex.value === i) {
            _push2(`<div class="icon-picker-panel fixed z-[1000] w-72 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg space-y-2" style="${ssrRenderStyle(pickerStyle.value)}" data-v-ea3d009f><div class="flex items-center gap-2" data-v-ea3d009f><input${ssrRenderAttr("value", iconSearch.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("settings.siteMeta.iconSearchPlaceholder"))} class="icon-picker-search flex-1 h-8 px-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-ea3d009f><button type="button" class="h-8 px-2 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"${ssrRenderAttr("aria-label", unref(t)("common.close"))} data-v-ea3d009f> \u2715 </button></div><div class="max-h-56 overflow-auto space-y-3 pe-1 custom-scroll" data-v-ea3d009f>`);
            if (filteredGroups.value.length) {
              _push2(`<!--[-->`);
              ssrRenderList(filteredGroups.value, (group) => {
                _push2(`<div class="space-y-1" data-v-ea3d009f><div class="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500" data-v-ea3d009f>${ssrInterpolate(group.label)}</div><div class="grid grid-cols-5 gap-2" data-v-ea3d009f><!--[-->`);
                ssrRenderList(group.icons, (ic) => {
                  _push2(`<button type="button"${ssrRenderAttr("title", ic)} class="${ssrRenderClass([{ "ring-2 ring-blue-500": ic === link.icon }, "group w-12 h-12 rounded-md border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-0.5 text-[9px] text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500"])}" data-v-ea3d009f>`);
                  _push2(ssrRenderComponent(unref(Icon), {
                    icon: ic,
                    class: "w-5 h-5"
                  }, null, _parent));
                  _push2(`<span class="truncate w-full px-1 group-hover:text-blue-600 dark:group-hover:text-blue-300" data-v-ea3d009f>${ssrInterpolate(ic.split(":")[1])}</span></button>`);
                });
                _push2(`<!--]--></div></div>`);
              });
              _push2(`<!--]-->`);
            } else {
              _push2(`<div class="text-[11px] text-gray-500 dark:text-gray-400 py-4 text-center" data-v-ea3d009f><span class="block" data-v-ea3d009f>${ssrInterpolate(unref(t)("settings.siteMeta.noMatches"))}</span><a href="https://icon-sets.iconify.design/mdi/" target="_blank" rel="noopener" class="underline block" data-v-ea3d009f>${ssrInterpolate(unref(t)("settings.siteMeta.seeAllIcons"))}</a></div>`);
            }
            _push2(`</div><div class="flex justify-between pt-1" data-v-ea3d009f><button type="button" class="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60" data-v-ea3d009f>${ssrInterpolate(unref(t)("common.reset"))}</button><span class="text-[10px] text-gray-400 dark:text-gray-500" data-v-ea3d009f>${ssrInterpolate(unref(t)("settings.siteMeta.iconsCount", { count: totalIcons.value }))}</span></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        _push(`<input${ssrRenderAttr("value", link.icon)} type="text"${ssrRenderAttr("placeholder", unref(t)("settings.siteMeta.iconPlaceholder"))} class="flex-1 min-w-[140px] h-8 rounded-md px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-ea3d009f><div class="flex flex-wrap items-center gap-1 ms-auto w-full sm:w-auto justify-end" data-v-ea3d009f><button type="button"${ssrIncludeBooleanAttr(i === 0) ? " disabled" : ""}${ssrRenderAttr("title", unref(t)("settings.siteMeta.moveUp"))}${ssrRenderAttr("aria-label", unref(t)("settings.siteMeta.moveUp"))} class="inline-flex items-center justify-center h-8 w-8 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-40" data-v-ea3d009f>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:arrow-up",
          class: "text-sm"
        }, null, _parent));
        _push(`</button><button type="button"${ssrIncludeBooleanAttr(i === links.value.length - 1) ? " disabled" : ""}${ssrRenderAttr("title", unref(t)("settings.siteMeta.moveDown"))}${ssrRenderAttr("aria-label", unref(t)("settings.siteMeta.moveDown"))} class="inline-flex items-center justify-center h-8 w-8 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-40" data-v-ea3d009f>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:arrow-down",
          class: "text-sm"
        }, null, _parent));
        _push(`</button><button type="button" class="inline-flex items-center gap-1 h-8 px-2 rounded-md text-[11px] font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60" data-v-ea3d009f>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:delete",
          class: "text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("common.remove"))}</button></div></div></li>`);
      });
      _push(`<!--]--></ul></div></div><div class="flex items-center gap-3 pt-2" data-v-ea3d009f><button type="submit"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40" data-v-ea3d009f>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: saving.value ? "mdi:loading" : "mdi:content-save",
        class: [saving.value ? "animate-spin" : "", "text-base"]
      }, null, _parent));
      _push(`<span data-v-ea3d009f>${ssrInterpolate(saving.value ? unref(t)("common.saving") : unref(t)("common.save"))}</span></button></div></form></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/BrandingMetaForm.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const BrandingMetaForm = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-ea3d009f"]]);
const pageSize$1 = 10;
const _sfc_main$5 = {
  __name: "MembersManagement",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    const toast = useToast();
    const loading = ref(true);
    const searchQuery = ref("");
    const users = ref([]);
    const currentUserId = ref(null);
    const originalRoles = ref({});
    const page = ref(1);
    const totalCount = ref(0);
    const totalPages = computed(
      () => Math.max(1, Math.ceil(totalCount.value / pageSize$1))
    );
    const updatingRoleId = ref(null);
    const roleInfo = computed(() => [
      {
        value: "reader",
        name: t("roles.reader"),
        description: t("members.descriptions.reader"),
        icon: "mdi:account-box"
      },
      {
        value: "author",
        name: t("roles.author"),
        description: t("members.descriptions.author"),
        icon: "mdi:account-edit"
      },
      {
        value: "admin",
        name: t("roles.admin"),
        description: t("members.descriptions.admin"),
        icon: "mdi:shield-account"
      },
      {
        value: "disabled",
        name: t("roles.disabled"),
        description: t("members.descriptions.disabled"),
        icon: "mdi:account-cancel"
      }
    ]);
    function initials(name) {
      const s = String(name || "?").trim();
      return (s.charAt(0) || "?").toUpperCase();
    }
    function roleIcon(role) {
      var _a;
      return ((_a = roleInfo.value.find((r) => r.value === role)) == null ? void 0 : _a.icon) || "mdi:account";
    }
    function roleBadgeClasses(role) {
      return {
        reader: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        author: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        admin: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        disabled: "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
      }[role] || "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300";
    }
    async function fetchUsers() {
      loading.value = true;
      let query = supabase.from("profiles").select("id, username, display_name, role", { count: "exact" }).order("username", { ascending: true }).range((page.value - 1) * pageSize$1, page.value * pageSize$1 - 1);
      if (searchQuery.value.trim()) {
        query = query.ilike("username", `%${searchQuery.value}%`).or(`display_name.ilike.%${searchQuery.value}%`);
      }
      const { data, error, count } = await query;
      if (error) {
        toast.error(t("members.fetchFailed", { message: error.message }));
      } else {
        users.value = data;
        totalCount.value = count || 0;
        originalRoles.value = data.reduce((acc, u) => {
          acc[u.id] = u.role || "reader";
          return acc;
        }, {});
      }
      loading.value = false;
    }
    watch(page, fetchUsers);
    const showConfirm = ref(false);
    const confirmMessage = ref("");
    let confirmResolve;
    function askConfirmation(message) {
      confirmMessage.value = message;
      showConfirm.value = true;
      return new Promise((resolve) => {
        confirmResolve = resolve;
      });
    }
    function handleConfirm() {
      showConfirm.value = false;
      confirmResolve == null ? void 0 : confirmResolve(true);
    }
    function handleCancel() {
      showConfirm.value = false;
      confirmResolve == null ? void 0 : confirmResolve(false);
    }
    async function updateRole(user) {
      if (user.id === currentUserId.value) {
        const proceed = await askConfirmation(t("members.selfRoleWarning"));
        if (!proceed) {
          user.role = originalRoles.value[user.id] || "reader";
          return;
        }
      }
      updatingRoleId.value = user.id;
      try {
        const { data, error } = await supabase.from("profiles").update({ role: user.role }).eq("id", user.id).select("id, role").maybeSingle();
        if (error) throw error;
        if (!data) throw new Error(t("members.noRowsUpdated"));
        user.role = data.role;
        originalRoles.value[user.id] = data.role;
        toast.success(
          t("members.roleUpdated", { role: data.role, username: user.username })
        );
      } catch (e) {
        toast.error(t("members.updateFailed", { message: e.message }));
        user.role = originalRoles.value[user.id] || "reader";
      } finally {
        updatingRoleId.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"><div class="px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-4"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div class="flex items-center gap-3 min-w-0"><div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shrink-0">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:account-group-outline",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</div><div class="min-w-0"><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase">${ssrInterpolate(unref(t)("members.title"))}</h2><p class="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">${ssrInterpolate(loading.value ? unref(t)("common.loading") : unref(t)("members.total", { count: totalCount.value }))}</p></div></div><div class="flex items-center h-9 w-full sm:w-72 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 focus-within:ring-2 focus-within:ring-blue-500">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:magnify",
        class: "ms-3 text-gray-400 text-base shrink-0"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("members.searchPlaceholder"))} class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"></div></div></div>`);
      if (loading.value) {
        _push(`<div class="px-6 py-16 text-center">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:loading",
          class: "mx-auto animate-spin text-3xl text-blue-500 mb-3"
        }, null, _parent));
        _push(`<p class="text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("members.loading"))}</p></div>`);
      } else if (!users.value.length) {
        _push(`<div class="px-6 py-16 text-center">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:account-off-outline",
          class: "mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3"
        }, null, _parent));
        _push(`<p class="text-sm font-medium text-gray-700 dark:text-gray-300">${ssrInterpolate(unref(t)("members.empty"))}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${ssrInterpolate(unref(t)("members.tryDifferentSearch"))}</p></div>`);
      } else {
        _push(`<ul class="divide-y divide-gray-100 dark:divide-gray-700/80"><!--[-->`);
        ssrRenderList(users.value, (user) => {
          _push(`<li class="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors"><div class="flex items-center gap-3 min-w-0 flex-1"><span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shrink-0">${ssrInterpolate(initials(user.display_name || user.username))}</span><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">${ssrInterpolate(user.display_name || user.username)}</p>`);
          if (user.id === currentUserId.value) {
            _push(`<span class="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:account-check",
              class: "text-xs"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(t)("members.you"))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate"> @${ssrInterpolate(user.username)}</p></div></div><div class="flex items-center justify-between sm:justify-end gap-3 sm:shrink-0"><span class="${ssrRenderClass([roleBadgeClasses(user.role), "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-medium"])}">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: roleIcon(user.role),
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)(`roles.${user.role}`))}</span><div class="relative role-select-wrapper min-w-[8.5rem]">`);
          _push(ssrRenderComponent(unref(SelectRoot), {
            key: user.id + "-" + originalRoles.value[user.id],
            modelValue: user.role,
            "onUpdate:modelValue": [($event) => user.role = $event, () => updateRole(user)],
            disabled: updatingRoleId.value === user.id
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(SelectTrigger), {
                  class: "w-full inline-flex h-8 items-center justify-between rounded-md px-2.5 text-xs bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50",
                  "aria-label": unref(t)("members.changeRoleAria")
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="flex items-center gap-1.5 min-w-0"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Icon), {
                        icon: roleIcon(user.role),
                        class: "text-sm shrink-0"
                      }, null, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(SelectValue), {
                        placeholder: unref(t)("members.role")
                      }, null, _parent3, _scopeId2));
                      _push3(`</span>`);
                      if (updatingRoleId.value === user.id) {
                        _push3(ssrRenderComponent(unref(Icon), {
                          icon: "mdi:loading",
                          class: "w-3.5 h-3.5 animate-spin opacity-70"
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(ssrRenderComponent(unref(Icon), {
                          icon: "radix-icons:chevron-down",
                          class: "w-3.5 h-3.5 opacity-70 shrink-0"
                        }, null, _parent3, _scopeId2));
                      }
                    } else {
                      return [
                        createVNode("span", { class: "flex items-center gap-1.5 min-w-0" }, [
                          createVNode(unref(Icon), {
                            icon: roleIcon(user.role),
                            class: "text-sm shrink-0"
                          }, null, 8, ["icon"]),
                          createVNode(unref(SelectValue), {
                            placeholder: unref(t)("members.role")
                          }, null, 8, ["placeholder"])
                        ]),
                        updatingRoleId.value === user.id ? (openBlock(), createBlock(unref(Icon), {
                          key: 0,
                          icon: "mdi:loading",
                          class: "w-3.5 h-3.5 animate-spin opacity-70"
                        })) : (openBlock(), createBlock(unref(Icon), {
                          key: 1,
                          icon: "radix-icons:chevron-down",
                          class: "w-3.5 h-3.5 opacity-70 shrink-0"
                        }))
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(SelectPortal), null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(SelectContent), {
                        class: "z-[120] min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                        "side-offset": 4
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-up" }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(SelectViewport), { class: "p-1 text-xs" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(SelectGroup), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<!--[-->`);
                                        ssrRenderList(roleInfo.value, (role) => {
                                          _push6(ssrRenderComponent(unref(SelectItem), {
                                            key: role.value,
                                            value: role.value,
                                            class: "leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-7 ps-7 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                          }, {
                                            default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute start-0 w-7 inline-flex items-center justify-center" }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(ssrRenderComponent(unref(Icon), {
                                                        icon: "radix-icons:check",
                                                        class: "w-4 h-4"
                                                      }, null, _parent8, _scopeId7));
                                                    } else {
                                                      return [
                                                        createVNode(unref(Icon), {
                                                          icon: "radix-icons:check",
                                                          class: "w-4 h-4"
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                                _push7(ssrRenderComponent(unref(Icon), {
                                                  icon: role.icon,
                                                  class: "me-2 w-4 h-4"
                                                }, null, _parent7, _scopeId6));
                                                _push7(ssrRenderComponent(unref(SelectItemText), null, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`${ssrInterpolate(role.name)}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(role.name), 1)
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              } else {
                                                return [
                                                  createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-7 inline-flex items-center justify-center" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(Icon), {
                                                        icon: "radix-icons:check",
                                                        class: "w-4 h-4"
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(Icon), {
                                                    icon: role.icon,
                                                    class: "me-2 w-4 h-4"
                                                  }, null, 8, ["icon"]),
                                                  createVNode(unref(SelectItemText), null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(role.name), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        });
                                        _push6(`<!--]-->`);
                                      } else {
                                        return [
                                          (openBlock(true), createBlock(Fragment, null, renderList(roleInfo.value, (role) => {
                                            return openBlock(), createBlock(unref(SelectItem), {
                                              key: role.value,
                                              value: role.value,
                                              class: "leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-7 ps-7 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-7 inline-flex items-center justify-center" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), {
                                                      icon: "radix-icons:check",
                                                      class: "w-4 h-4"
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(Icon), {
                                                  icon: role.icon,
                                                  class: "me-2 w-4 h-4"
                                                }, null, 8, ["icon"]),
                                                createVNode(unref(SelectItemText), null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(role.name), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["value"]);
                                          }), 128))
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(SelectGroup), null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(roleInfo.value, (role) => {
                                          return openBlock(), createBlock(unref(SelectItem), {
                                            key: role.value,
                                            value: role.value,
                                            class: "leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-7 ps-7 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-7 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), {
                                                    icon: "radix-icons:check",
                                                    class: "w-4 h-4"
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(Icon), {
                                                icon: role.icon,
                                                class: "me-2 w-4 h-4"
                                              }, null, 8, ["icon"]),
                                              createVNode(unref(SelectItemText), null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(role.name), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["value"]);
                                        }), 128))
                                      ]),
                                      _: 1
                                    })
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-down" }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500" }, {
                                default: withCtx(() => [
                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(SelectViewport), { class: "p-1 text-xs" }, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectGroup), null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(roleInfo.value, (role) => {
                                        return openBlock(), createBlock(unref(SelectItem), {
                                          key: role.value,
                                          value: role.value,
                                          class: "leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-7 ps-7 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-7 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), {
                                                  icon: "radix-icons:check",
                                                  class: "w-4 h-4"
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(Icon), {
                                              icon: role.icon,
                                              class: "me-2 w-4 h-4"
                                            }, null, 8, ["icon"]),
                                            createVNode(unref(SelectItemText), null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(role.name), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 128))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500" }, {
                                default: withCtx(() => [
                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(SelectContent), {
                          class: "z-[120] min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                          "side-offset": 4
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(SelectViewport), { class: "p-1 text-xs" }, {
                              default: withCtx(() => [
                                createVNode(unref(SelectGroup), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(roleInfo.value, (role) => {
                                      return openBlock(), createBlock(unref(SelectItem), {
                                        key: role.value,
                                        value: role.value,
                                        class: "leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-7 ps-7 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-7 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), {
                                                icon: "radix-icons:check",
                                                class: "w-4 h-4"
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(Icon), {
                                            icon: role.icon,
                                            class: "me-2 w-4 h-4"
                                          }, null, 8, ["icon"]),
                                          createVNode(unref(SelectItemText), null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(role.name), 1)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1032, ["value"]);
                                    }), 128))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(SelectTrigger), {
                    class: "w-full inline-flex h-8 items-center justify-between rounded-md px-2.5 text-xs bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50",
                    "aria-label": unref(t)("members.changeRoleAria")
                  }, {
                    default: withCtx(() => [
                      createVNode("span", { class: "flex items-center gap-1.5 min-w-0" }, [
                        createVNode(unref(Icon), {
                          icon: roleIcon(user.role),
                          class: "text-sm shrink-0"
                        }, null, 8, ["icon"]),
                        createVNode(unref(SelectValue), {
                          placeholder: unref(t)("members.role")
                        }, null, 8, ["placeholder"])
                      ]),
                      updatingRoleId.value === user.id ? (openBlock(), createBlock(unref(Icon), {
                        key: 0,
                        icon: "mdi:loading",
                        class: "w-3.5 h-3.5 animate-spin opacity-70"
                      })) : (openBlock(), createBlock(unref(Icon), {
                        key: 1,
                        icon: "radix-icons:chevron-down",
                        class: "w-3.5 h-3.5 opacity-70 shrink-0"
                      }))
                    ]),
                    _: 2
                  }, 1032, ["aria-label"]),
                  createVNode(unref(SelectPortal), null, {
                    default: withCtx(() => [
                      createVNode(unref(SelectContent), {
                        class: "z-[120] min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                        "side-offset": 4
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500" }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(SelectViewport), { class: "p-1 text-xs" }, {
                            default: withCtx(() => [
                              createVNode(unref(SelectGroup), null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(roleInfo.value, (role) => {
                                    return openBlock(), createBlock(unref(SelectItem), {
                                      key: role.value,
                                      value: role.value,
                                      class: "leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-7 ps-7 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-7 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), {
                                              icon: "radix-icons:check",
                                              class: "w-4 h-4"
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(Icon), {
                                          icon: role.icon,
                                          class: "me-2 w-4 h-4"
                                        }, null, 8, ["icon"]),
                                        createVNode(unref(SelectItemText), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(role.name), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 128))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500" }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      if (!loading.value && totalPages.value > 1) {
        _push(`<div class="flex items-center justify-center gap-3 px-5 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300"><button type="button" class="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""}>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:chevron-left",
          class: "text-base"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("common.prev"))}</button><span class="font-medium tabular-nums">${ssrInterpolate(unref(t)("common.page", { current: page.value, total: totalPages.value }))}</span><button type="button" class="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"${ssrIncludeBooleanAttr(page.value >= totalPages.value) ? " disabled" : ""}>${ssrInterpolate(unref(t)("common.next"))} `);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:chevron-right",
          class: "text-base"
        }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (showConfirm.value) {
        _push(ssrRenderComponent(_sfc_main$g, {
          open: showConfirm.value,
          title: unref(t)("members.confirmRoleChange"),
          description: confirmMessage.value,
          body: unref(t)("members.confirmProceed"),
          onConfirm: handleConfirm,
          onCancel: handleCancel
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/MembersManagement.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const MAX_SECONDS = 43200;
const _sfc_main$4 = {
  __name: "SignedLinkDialog",
  __ssrInlineRender: true,
  props: {
    open: Boolean,
    defaultSeconds: { type: Number, default: 300 }
  },
  emits: ["generate", "cancel", "close"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    const props = __props;
    const emit = __emit;
    const secondsInput = ref(String(Math.min(props.defaultSeconds, MAX_SECONDS)));
    const error = ref("");
    const generatedUrl = ref("");
    const urlCopied = ref(false);
    watch(
      () => props.open,
      (val) => {
        if (val) {
          secondsInput.value = String(Math.min(props.defaultSeconds || 300, MAX_SECONDS));
          error.value = "";
          generatedUrl.value = "";
        }
      }
    );
    function digitsKeydown(e) {
      const allowed = [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End"
      ];
      if (e.ctrlKey || e.metaKey) return;
      if (allowed.includes(e.key)) return;
      if (/^[0-9]$/.test(e.key)) return;
      e.preventDefault();
    }
    function digitsInput(e) {
      const cleaned = e.target.value.replace(/\D+/g, "");
      if (!cleaned) {
        secondsInput.value = "";
        return;
      }
      let val = parseInt(cleaned, 10);
      if (isNaN(val)) val = 1;
      if (val < 1) val = 1;
      if (val > MAX_SECONDS) val = MAX_SECONDS;
      secondsInput.value = String(val);
    }
    function confirmInternal() {
      error.value = "";
      const secs = parseInt(secondsInput.value, 10);
      if (!secs || secs <= 0) {
        error.value = t("media.signedLink.positiveNumber");
        return;
      }
      if (secs > MAX_SECONDS) {
        error.value = t("media.signedLink.maxSeconds", { max: MAX_SECONDS });
        return;
      }
      emit("generate", secs, (url) => {
        generatedUrl.value = url || "";
      });
    }
    function cancel() {
      emit("cancel");
    }
    function closeAfter() {
      emit("close");
    }
    async function copy() {
      if (!generatedUrl.value) return;
      try {
        await (void 0).clipboard.writeText(generatedUrl.value);
        urlCopied.value = true;
        setTimeout(() => {
          urlCopied.value = false;
        }, 1500);
      } catch {
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Dialog), mergeProps({
        open: __props.open,
        onClose: cancel,
        class: "relative z-50"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="fixed inset-0 bg-black/30 backdrop-blur-sm"${_scopeId}></div><div class="fixed inset-0 flex items-center justify-center p-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DialogPanel), { class: "w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(DialogTitle), { class: "text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Icon), {
                          icon: "mdi:link-variant",
                          class: "w-5 h-5 text-blue-600"
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(unref(t)("media.signedLink.title"))}`);
                      } else {
                        return [
                          createVNode(unref(Icon), {
                            icon: "mdi:link-variant",
                            class: "w-5 h-5 text-blue-600"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("media.signedLink.title")), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(DialogDescription), { class: "text-sm text-gray-600 dark:text-gray-300 mt-1" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(t)("media.signedLink.description"))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(t)("media.signedLink.description")), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="mt-4 space-y-4"${_scopeId2}><div class="space-y-2"${_scopeId2}><label class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"${_scopeId2}>${ssrInterpolate(unref(t)("media.signedLink.duration"))}</label><div class="flex items-center gap-2"${_scopeId2}><button type="button"${ssrIncludeBooleanAttr(!!generatedUrl.value) ? " disabled" : ""} class="h-11 w-11 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-lg font-semibold select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:dark:hover:bg-gray-700"${ssrRenderAttr("aria-label", unref(t)("media.signedLink.decreaseDuration"))}${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:minus",
                    class: "text-lg"
                  }, null, _parent3, _scopeId2));
                  _push3(`</button><input${ssrRenderAttr("value", secondsInput.value)} type="text" inputmode="numeric" pattern="[0-9]*" min="1" placeholder="300"${ssrIncludeBooleanAttr(!!generatedUrl.value) ? " disabled" : ""} class="w-full h-11 rounded-md px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:dark:bg-gray-700 disabled:text-gray-500 disabled:dark:text-gray-400"${_scopeId2}><button type="button"${ssrIncludeBooleanAttr(!!generatedUrl.value) ? " disabled" : ""} class="h-11 w-11 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-lg font-semibold select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:dark:hover:bg-gray-700"${ssrRenderAttr("aria-label", unref(t)("media.signedLink.increaseDuration"))}${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:plus",
                    class: "text-lg"
                  }, null, _parent3, _scopeId2));
                  _push3(`</button></div><p class="text-[11px] text-gray-500 dark:text-gray-400"${_scopeId2}>${ssrInterpolate(unref(t)("media.signedLink.durationHint"))}</p>`);
                  if (error.value) {
                    _push3(`<p class="text-[11px] text-red-600 dark:text-red-400"${_scopeId2}>${ssrInterpolate(error.value)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  if (generatedUrl.value) {
                    _push3(`<div class="space-y-2"${_scopeId2}><label class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"${_scopeId2}>${ssrInterpolate(unref(t)("media.signedLink.generatedUrl"))}</label><div class="relative"${_scopeId2}><input${ssrRenderAttr("value", generatedUrl.value)} readonly class="w-full rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-[12px] text-gray-700 dark:text-gray-200 pe-20"${_scopeId2}><button type="button" class="absolute top-1/2 -translate-y-1/2 end-2 inline-flex items-center gap-1 h-6 px-1 rounded bg-blue-600 text-white dark:bg-blue-500/90 dark:text-white text-[10px] font-medium shadow hover:bg-blue-700 dark:hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 transition-colors"${ssrRenderAttr("aria-label", unref(t)("media.signedLink.copyUrlAria"))}${_scopeId2}>`);
                    if (!urlCopied.value) {
                      _push3(ssrRenderComponent(unref(Icon), {
                        icon: "mdi:content-copy",
                        class: "w-3.5 h-3.5"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(ssrRenderComponent(unref(Icon), {
                        icon: "mdi:check",
                        class: "w-3.5 h-3.5"
                      }, null, _parent3, _scopeId2));
                    }
                    if (!urlCopied.value) {
                      _push3(`<span${_scopeId2}>${ssrInterpolate(unref(t)("common.copy"))}</span>`);
                    } else {
                      _push3(`<span${_scopeId2}>${ssrInterpolate(unref(t)("common.copied"))}</span>`);
                    }
                    _push3(`</button></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="mt-6 flex justify-end gap-3"${_scopeId2}><button class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:close-circle-outline",
                    class: "w-4 h-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` ${ssrInterpolate(unref(t)("common.cancel"))}</button>`);
                  if (!generatedUrl.value) {
                    _push3(`<button class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: "mdi:link-plus",
                      class: "w-4 h-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` ${ssrInterpolate(unref(t)("media.signedLink.generate"))}</button>`);
                  } else {
                    _push3(`<button class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500/50"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: "mdi:check-circle-outline",
                      class: "w-4 h-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` ${ssrInterpolate(unref(t)("media.signedLink.done"))}</button>`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(unref(DialogTitle), { class: "text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2" }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: "mdi:link-variant",
                          class: "w-5 h-5 text-blue-600"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("media.signedLink.title")), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(DialogDescription), { class: "text-sm text-gray-600 dark:text-gray-300 mt-1" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(t)("media.signedLink.description")), 1)
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "mt-4 space-y-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400" }, toDisplayString(unref(t)("media.signedLink.duration")), 1),
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode("button", {
                            type: "button",
                            disabled: !!generatedUrl.value,
                            class: "h-11 w-11 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-lg font-semibold select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:dark:hover:bg-gray-700",
                            onClick: ($event) => !generatedUrl.value && (secondsInput.value = String(
                              Math.max(1, (parseInt(secondsInput.value, 10) || 0) - 1)
                            )),
                            "aria-label": unref(t)("media.signedLink.decreaseDuration")
                          }, [
                            createVNode(unref(Icon), {
                              icon: "mdi:minus",
                              class: "text-lg"
                            })
                          ], 8, ["disabled", "onClick", "aria-label"]),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => secondsInput.value = $event,
                            type: "text",
                            inputmode: "numeric",
                            pattern: "[0-9]*",
                            min: "1",
                            placeholder: "300",
                            disabled: !!generatedUrl.value,
                            class: "w-full h-11 rounded-md px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:dark:bg-gray-700 disabled:text-gray-500 disabled:dark:text-gray-400",
                            onKeydown: [
                              ($event) => !generatedUrl.value && digitsKeydown($event),
                              withKeys(withModifiers(($event) => !generatedUrl.value && confirmInternal(), ["prevent"]), ["enter"])
                            ],
                            onInput: ($event) => !generatedUrl.value && digitsInput($event)
                          }, null, 40, ["onUpdate:modelValue", "disabled", "onKeydown", "onInput"]), [
                            [
                              vModelText,
                              secondsInput.value,
                              void 0,
                              { trim: true }
                            ]
                          ]),
                          createVNode("button", {
                            type: "button",
                            disabled: !!generatedUrl.value,
                            class: "h-11 w-11 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-lg font-semibold select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:dark:hover:bg-gray-700",
                            onClick: ($event) => !generatedUrl.value && (secondsInput.value = String(
                              Math.min(MAX_SECONDS, Math.max(1, (parseInt(secondsInput.value, 10) || 0) + 1))
                            )),
                            "aria-label": unref(t)("media.signedLink.increaseDuration")
                          }, [
                            createVNode(unref(Icon), {
                              icon: "mdi:plus",
                              class: "text-lg"
                            })
                          ], 8, ["disabled", "onClick", "aria-label"])
                        ]),
                        createVNode("p", { class: "text-[11px] text-gray-500 dark:text-gray-400" }, toDisplayString(unref(t)("media.signedLink.durationHint")), 1),
                        error.value ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-[11px] text-red-600 dark:text-red-400"
                        }, toDisplayString(error.value), 1)) : createCommentVNode("", true)
                      ]),
                      generatedUrl.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-2"
                      }, [
                        createVNode("label", { class: "text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400" }, toDisplayString(unref(t)("media.signedLink.generatedUrl")), 1),
                        createVNode("div", { class: "relative" }, [
                          createVNode("input", {
                            value: generatedUrl.value,
                            readonly: "",
                            class: "w-full rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-[12px] text-gray-700 dark:text-gray-200 pe-20"
                          }, null, 8, ["value"]),
                          createVNode("button", {
                            type: "button",
                            onClick: copy,
                            class: "absolute top-1/2 -translate-y-1/2 end-2 inline-flex items-center gap-1 h-6 px-1 rounded bg-blue-600 text-white dark:bg-blue-500/90 dark:text-white text-[10px] font-medium shadow hover:bg-blue-700 dark:hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 transition-colors",
                            "aria-label": unref(t)("media.signedLink.copyUrlAria")
                          }, [
                            !urlCopied.value ? (openBlock(), createBlock(unref(Icon), {
                              key: 0,
                              icon: "mdi:content-copy",
                              class: "w-3.5 h-3.5"
                            })) : (openBlock(), createBlock(unref(Icon), {
                              key: 1,
                              icon: "mdi:check",
                              class: "w-3.5 h-3.5"
                            })),
                            !urlCopied.value ? (openBlock(), createBlock("span", { key: 2 }, toDisplayString(unref(t)("common.copy")), 1)) : (openBlock(), createBlock("span", { key: 3 }, toDisplayString(unref(t)("common.copied")), 1))
                          ], 8, ["aria-label"])
                        ])
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "mt-6 flex justify-end gap-3" }, [
                      createVNode("button", {
                        onClick: cancel,
                        class: "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:close-circle-outline",
                          class: "w-4 h-4"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("common.cancel")), 1)
                      ]),
                      !generatedUrl.value ? (openBlock(), createBlock("button", {
                        key: 0,
                        onClick: confirmInternal,
                        class: "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:link-plus",
                          class: "w-4 h-4"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("media.signedLink.generate")), 1)
                      ])) : (openBlock(), createBlock("button", {
                        key: 1,
                        onClick: closeAfter,
                        class: "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:check-circle-outline",
                          class: "w-4 h-4"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("media.signedLink.done")), 1)
                      ]))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "fixed inset-0 bg-black/30 backdrop-blur-sm" }),
              createVNode("div", { class: "fixed inset-0 flex items-center justify-center p-4" }, [
                createVNode(unref(DialogPanel), { class: "w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl" }, {
                  default: withCtx(() => [
                    createVNode(unref(DialogTitle), { class: "text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2" }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: "mdi:link-variant",
                          class: "w-5 h-5 text-blue-600"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("media.signedLink.title")), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(DialogDescription), { class: "text-sm text-gray-600 dark:text-gray-300 mt-1" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(t)("media.signedLink.description")), 1)
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "mt-4 space-y-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400" }, toDisplayString(unref(t)("media.signedLink.duration")), 1),
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode("button", {
                            type: "button",
                            disabled: !!generatedUrl.value,
                            class: "h-11 w-11 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-lg font-semibold select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:dark:hover:bg-gray-700",
                            onClick: ($event) => !generatedUrl.value && (secondsInput.value = String(
                              Math.max(1, (parseInt(secondsInput.value, 10) || 0) - 1)
                            )),
                            "aria-label": unref(t)("media.signedLink.decreaseDuration")
                          }, [
                            createVNode(unref(Icon), {
                              icon: "mdi:minus",
                              class: "text-lg"
                            })
                          ], 8, ["disabled", "onClick", "aria-label"]),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => secondsInput.value = $event,
                            type: "text",
                            inputmode: "numeric",
                            pattern: "[0-9]*",
                            min: "1",
                            placeholder: "300",
                            disabled: !!generatedUrl.value,
                            class: "w-full h-11 rounded-md px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:dark:bg-gray-700 disabled:text-gray-500 disabled:dark:text-gray-400",
                            onKeydown: [
                              ($event) => !generatedUrl.value && digitsKeydown($event),
                              withKeys(withModifiers(($event) => !generatedUrl.value && confirmInternal(), ["prevent"]), ["enter"])
                            ],
                            onInput: ($event) => !generatedUrl.value && digitsInput($event)
                          }, null, 40, ["onUpdate:modelValue", "disabled", "onKeydown", "onInput"]), [
                            [
                              vModelText,
                              secondsInput.value,
                              void 0,
                              { trim: true }
                            ]
                          ]),
                          createVNode("button", {
                            type: "button",
                            disabled: !!generatedUrl.value,
                            class: "h-11 w-11 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-lg font-semibold select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:dark:hover:bg-gray-700",
                            onClick: ($event) => !generatedUrl.value && (secondsInput.value = String(
                              Math.min(MAX_SECONDS, Math.max(1, (parseInt(secondsInput.value, 10) || 0) + 1))
                            )),
                            "aria-label": unref(t)("media.signedLink.increaseDuration")
                          }, [
                            createVNode(unref(Icon), {
                              icon: "mdi:plus",
                              class: "text-lg"
                            })
                          ], 8, ["disabled", "onClick", "aria-label"])
                        ]),
                        createVNode("p", { class: "text-[11px] text-gray-500 dark:text-gray-400" }, toDisplayString(unref(t)("media.signedLink.durationHint")), 1),
                        error.value ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-[11px] text-red-600 dark:text-red-400"
                        }, toDisplayString(error.value), 1)) : createCommentVNode("", true)
                      ]),
                      generatedUrl.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-2"
                      }, [
                        createVNode("label", { class: "text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400" }, toDisplayString(unref(t)("media.signedLink.generatedUrl")), 1),
                        createVNode("div", { class: "relative" }, [
                          createVNode("input", {
                            value: generatedUrl.value,
                            readonly: "",
                            class: "w-full rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-[12px] text-gray-700 dark:text-gray-200 pe-20"
                          }, null, 8, ["value"]),
                          createVNode("button", {
                            type: "button",
                            onClick: copy,
                            class: "absolute top-1/2 -translate-y-1/2 end-2 inline-flex items-center gap-1 h-6 px-1 rounded bg-blue-600 text-white dark:bg-blue-500/90 dark:text-white text-[10px] font-medium shadow hover:bg-blue-700 dark:hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 transition-colors",
                            "aria-label": unref(t)("media.signedLink.copyUrlAria")
                          }, [
                            !urlCopied.value ? (openBlock(), createBlock(unref(Icon), {
                              key: 0,
                              icon: "mdi:content-copy",
                              class: "w-3.5 h-3.5"
                            })) : (openBlock(), createBlock(unref(Icon), {
                              key: 1,
                              icon: "mdi:check",
                              class: "w-3.5 h-3.5"
                            })),
                            !urlCopied.value ? (openBlock(), createBlock("span", { key: 2 }, toDisplayString(unref(t)("common.copy")), 1)) : (openBlock(), createBlock("span", { key: 3 }, toDisplayString(unref(t)("common.copied")), 1))
                          ], 8, ["aria-label"])
                        ])
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "mt-6 flex justify-end gap-3" }, [
                      createVNode("button", {
                        onClick: cancel,
                        class: "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:close-circle-outline",
                          class: "w-4 h-4"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("common.cancel")), 1)
                      ]),
                      !generatedUrl.value ? (openBlock(), createBlock("button", {
                        key: 0,
                        onClick: confirmInternal,
                        class: "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:link-plus",
                          class: "w-4 h-4"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("media.signedLink.generate")), 1)
                      ])) : (openBlock(), createBlock("button", {
                        key: 1,
                        onClick: closeAfter,
                        class: "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:check-circle-outline",
                          class: "w-4 h-4"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("media.signedLink.done")), 1)
                      ]))
                    ])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/SignedLinkDialog.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "MediaManager",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    const buckets = ref([]);
    const bucketMeta = reactive({});
    const bucketVisibility = reactive({});
    const systemBuckets = /* @__PURE__ */ new Set([
      "post-thumbnails",
      "profile-avatar",
      "branding"
    ]);
    const showCreate = ref(false);
    const creating = ref(false);
    const newBucketName = ref("");
    const newBucketPublic = ref(true);
    const newBucketMime = ref("");
    const newBucketSizeLimit = ref("");
    const uploading = ref(false);
    ref(null);
    const loadingBuckets = ref(false);
    const activeBucket = ref(null);
    const currentPath = ref("");
    const entries = ref([]);
    const loading = ref(false);
    const confirm = reactive({
      open: false,
      target: null,
      title: "",
      description: "",
      body: "",
      action: null
    });
    const toast = useToast();
    const linkDialog = reactive({ open: false, target: null });
    const isPrivateActiveBucket = computed(
      () => activeBucket.value ? bucketVisibility[activeBucket.value] === false : false
    );
    const fileTableColspan = computed(() => isPrivateActiveBucket.value ? 6 : 7);
    const pathSegments = computed(
      () => currentPath.value ? currentPath.value.split("/").filter(Boolean) : []
    );
    const searchTerm = ref("");
    const filteredEntries = computed(() => {
      if (!searchTerm.value.trim()) return entries.value;
      const q = searchTerm.value.toLowerCase();
      return entries.value.filter(
        (e) => {
          var _a;
          return e.name && e.name.toLowerCase().includes(q) || ((_a = e.profileMeta) == null ? void 0 : _a.display) && e.profileMeta.display.toLowerCase().includes(q) || e.path && e.path.toLowerCase().includes(q);
        }
      );
    });
    const bucketNameReserved = computed(
      () => newBucketName.value && systemBuckets.has(newBucketName.value)
    );
    const bucketNameError = computed(() => {
      if (!newBucketName.value) return "";
      if (bucketNameReserved.value) return t("media.reservedSystemName");
      if (!/^[a-z0-9-]{3,50}$/.test(newBucketName.value)) return t("media.invalidFormat");
      return "";
    });
    function formatSize(size) {
      if (!size && size !== 0) return "-";
      if (size < 1024) return size + " B";
      if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
      return (size / 1024 / 1024).toFixed(1) + " MB";
    }
    function formatDate(d) {
      return d ? new Date(d).toLocaleString() : "-";
    }
    function closeBucket() {
      activeBucket.value = null;
      entries.value = [];
    }
    async function listObjects() {
      var _a;
      if (!activeBucket.value) return;
      loading.value = true;
      entries.value = [];
      try {
        if (activeBucket.value === "profile-avatar" && !currentPath.value) {
          const { data: profs, error: profErr } = await supabase.from("profiles").select("id, username, display_name, avatar_url").not("avatar_url", "is", null);
          if (profErr) throw profErr;
          const avatarProfiles = (profs || []).filter(
            (p) => /\/storage\/v1\/object\//.test(p.avatar_url || "") && p.avatar_url.includes("/profile-avatar/")
          );
          const mapped = [];
          for (const p of avatarProfiles) {
            const m = p.avatar_url.match(/\/profile-avatar\/(.+)$/);
            const objectPath = m ? m[1] : null;
            if (!objectPath) continue;
            const parentFolder = objectPath.includes("/") ? objectPath.split("/").slice(0, -1).join("/") : "";
            let size = 0, updated_at = null;
            try {
              const { data: listData } = await supabase.storage.from("profile-avatar").list(parentFolder || void 0, { limit: 10 });
              const fname = objectPath.split("/").pop();
              const fileObj = (listData || []).find(
                (o) => o.name === fname && o.id
              );
              if (fileObj) {
                size = ((_a = fileObj.metadata) == null ? void 0 : _a.size) || fileObj.size || 0;
                updated_at = fileObj.updated_at;
              }
            } catch {
            }
            mapped.push({
              name: p.display_name || p.username || t("media.userFallback", { id: p.id.substring(0, 6) }),
              profileMeta: {
                id: p.id,
                username: p.username,
                display: p.username ? "@" + p.username : p.id.substring(0, 8)
              },
              id: p.id,
              updated_at,
              created_at: null,
              last_accessed_at: null,
              metadata: null,
              size,
              type: "avatar-profile",
              path: objectPath,
              usageLoaded: true,
              usage: { posts: [], profiles: [p.id], branding: [], total: 1 },
              publicUrl: p.avatar_url,
              isImage: true
            });
          }
          entries.value = mapped;
          bucketMeta[activeBucket.value] = { files: mapped.length };
        } else if (activeBucket.value === "profile-avatar" && currentPath.value) {
          const userId = currentPath.value.split("/")[0];
          let currentAvatarPath = null;
          try {
            const { data: prof } = await supabase.from("profiles").select("avatar_url").eq("id", userId).maybeSingle();
            if (prof == null ? void 0 : prof.avatar_url) {
              const m = prof.avatar_url.match(/\/profile-avatar\/(.+)$/);
              if (m) currentAvatarPath = m[1];
            }
          } catch {
          }
          const { data, error } = await supabase.storage.from("profile-avatar").list(userId, {
            limit: 100,
            sortBy: { column: "name", order: "desc" }
          });
          if (error) throw error;
          const mapped = (data || []).filter((o) => o.id).map((o) => {
            var _a2;
            const objectPath = userId + "/" + o.name;
            const publicUrl = supabase.storage.from("profile-avatar").getPublicUrl(objectPath).data.publicUrl;
            const lower = o.name.toLowerCase();
            const isImage = /(\.png$|\.jpe?g$|\.webp$|\.gif$|\.svg$|\.avif$)/.test(lower);
            const isCurrent = currentAvatarPath === objectPath;
            return {
              name: o.name,
              id: o.id,
              updated_at: o.updated_at,
              created_at: o.created_at,
              last_accessed_at: o.last_accessed_at,
              metadata: o.metadata,
              size: ((_a2 = o.metadata) == null ? void 0 : _a2.size) || o.size || 0,
              type: "file",
              path: objectPath,
              usageLoaded: true,
              usage: {
                posts: [],
                profiles: isCurrent ? [userId] : [],
                branding: [],
                total: isCurrent ? 1 : 0
              },
              publicUrl,
              isImage,
              isCurrent
            };
          });
          entries.value = mapped;
        } else {
          const prefix = currentPath.value || "";
          const { data, error } = await supabase.storage.from(activeBucket.value).list(prefix, {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" }
          });
          if (error) throw error;
          const mapped = (data || []).map((obj) => {
            var _a2;
            const objectPath = prefix ? `${prefix}/${obj.name}` : obj.name;
            const isFile = obj.id != null || obj.metadata != null && typeof obj.metadata === "object";
            const publicUrl = isFile ? publicUrlForObject(activeBucket.value, objectPath) || supabase.storage.from(activeBucket.value).getPublicUrl(objectPath).data.publicUrl : null;
            const lower = obj.name.toLowerCase();
            const isImage = isFile && /(\.png$|\.jpe?g$|\.webp$|\.gif$|\.svg$|\.avif$)/.test(lower);
            return {
              name: obj.name,
              id: obj.id,
              updated_at: obj.updated_at,
              created_at: obj.created_at,
              last_accessed_at: obj.last_accessed_at,
              metadata: obj.metadata,
              size: ((_a2 = obj.metadata) == null ? void 0 : _a2.size) || obj.size || 0,
              type: isFile ? "file" : "folder",
              path: objectPath,
              usageLoaded: true,
              usage: { posts: [], profiles: [], branding: [], total: 0 },
              publicUrl,
              isImage
            };
          });
          entries.value = mapped;
          bucketMeta[activeBucket.value] = bucketMeta[activeBucket.value] || {
            files: 0
          };
          bucketMeta[activeBucket.value].files = mapped.filter(
            (m) => m.type === "file"
          ).length;
          if (bucketVisibility[activeBucket.value] !== false) {
            await computeUsageForEntries();
          }
          if (bucketVisibility[activeBucket.value] === false) {
            const filePaths = entries.value.filter((e) => e.type === "file").map((e) => e.path);
            if (filePaths.length) {
              try {
                const { data: signedData, error: signErr } = await supabase.storage.from(activeBucket.value).createSignedUrls(filePaths, 60);
                if (!signErr && signedData) {
                  const map = new Map(signedData.map((d) => [d.path, d.signedUrl]));
                  for (const e of entries.value) {
                    if (e.type === "file" && map.has(e.path))
                      e.publicUrl = map.get(e.path);
                  }
                }
              } catch (signE) {
                console.warn("signed urls batch failed", signE);
              }
            }
          }
        }
      } catch (e) {
        console.error("[media-list]", e);
        toast.error((e == null ? void 0 : e.message) || t("media.listFailed"));
      } finally {
        loading.value = false;
      }
    }
    async function computeUsageForEntries() {
      try {
        const [postsRes, profilesRes, brandingRes] = await Promise.all([
          supabase.from("posts").select("id, cover_image_url"),
          supabase.from("profiles").select("id, avatar_url"),
          supabase.from("settings").select("value").eq("key", "branding").maybeSingle()
        ]);
        const postsList = postsRes.data || [];
        const profilesList = profilesRes.data || [];
        const brandingRow = brandingRes.data;
        const brandingPaths = /* @__PURE__ */ new Set();
        if (brandingRow == null ? void 0 : brandingRow.value) {
          ["lightLogoPath", "darkLogoPath", "faviconPath"].forEach((k) => {
            if (brandingRow.value[k]) brandingPaths.add(brandingRow.value[k]);
          });
        }
        for (const e of entries.value) {
          if (e.type !== "file") continue;
          const pUsed = postsList.filter((p) => p.cover_image_url && p.cover_image_url.includes(e.path)).map((p) => p.id);
          const profUsed = profilesList.filter((pr) => pr.avatar_url && pr.avatar_url.includes(e.path)).map((pr) => pr.id);
          const brandingUsed = brandingPaths.has(e.path) ? ["branding"] : [];
          e.usage.posts = pUsed;
          e.usage.profiles = profUsed;
          e.usage.branding = brandingUsed;
          e.usage.total = pUsed.length + profUsed.length + brandingUsed.length;
        }
      } catch (e) {
        console.error(e);
      }
    }
    async function performConfirm() {
      if (!confirm.action) {
        confirm.open = false;
        return;
      }
      if (confirm.action === "deleteFile") return await deleteFileConfirm();
      if (confirm.action === "emptyBucket") return await emptyBucketConfirm();
      if (confirm.action === "deleteBucket") return await deleteBucketConfirm();
      if (confirm.action === "emptyThenDelete") {
        const ok = await emptyBucketConfirm(true);
        if (ok) await deleteBucketConfirm();
        return;
      }
    }
    async function deleteFileConfirm() {
      const entry = confirm.target;
      if (!entry) {
        confirm.open = false;
        return;
      }
      try {
        if (entry.usage.total > 0) {
          if (entry.usage.posts.length) {
            await supabase.from("posts").update({ cover_image_url: null }).in("id", entry.usage.posts);
          }
          if (entry.usage.profiles.length) {
            await supabase.from("profiles").update({ avatar_url: null }).in("id", entry.usage.profiles);
          }
          if (entry.usage.branding.length) {
            const { data: brandingRow } = await supabase.from("settings").select("value").eq("key", "branding").maybeSingle();
            if (brandingRow == null ? void 0 : brandingRow.value) {
              const v = brandingRow.value;
              ["lightLogo", "darkLogo", "favicon"].forEach((prefix) => {
                const pathKey = prefix + "Path";
                const urlKey = prefix + "Url";
                if (v[pathKey] === entry.path) {
                  delete v[pathKey];
                  delete v[urlKey];
                }
              });
              await supabase.from("settings").update({ value: v }).eq("key", "branding");
            }
          }
        }
        const { error } = await supabase.storage.from(activeBucket.value).remove([entry.path]);
        if (error) throw error;
        toast.success(t("media.fileDeleted"));
        confirm.open = false;
        confirm.target = null;
        confirm.action = null;
        await listObjects();
      } catch (e) {
        console.error("[media-delete]", e);
        toast.error(t("media.deleteFailed"));
      }
    }
    async function emptyBucketConfirm(silent = false) {
      const bucket = confirm.target;
      if (!bucket) {
        confirm.open = false;
        return false;
      }
      try {
        const { error } = await supabase.storage.emptyBucket(bucket);
        if (error) throw error;
        if (!silent) toast.success(t("media.bucketEmptied"));
        if (bucketMeta[bucket]) bucketMeta[bucket].files = 0;
        if (activeBucket.value === bucket) {
          currentPath.value = "";
          entries.value = [];
        }
        if (confirm.action === "emptyBucket") {
          confirm.open = false;
          confirm.action = null;
        }
        return true;
      } catch (e) {
        console.error("[media-empty]", e);
        toast.error(t("media.emptyFailed"));
        if (confirm.action === "emptyBucket") confirm.open = false;
        return false;
      }
    }
    async function deleteBucketConfirm() {
      const bucket = confirm.target;
      if (!bucket) {
        confirm.open = false;
        return;
      }
      try {
        const { error } = await supabase.storage.deleteBucket(bucket);
        if (error) throw error;
        toast.success(t("media.bucketDeleted"));
        const idx = buckets.value.indexOf(bucket);
        if (idx > -1) buckets.value.splice(idx, 1);
        delete bucketMeta[bucket];
        if (activeBucket.value === bucket) closeBucket();
      } catch (e) {
        console.error("[media-delete-bucket]", e);
        toast.error(t("media.deleteBucketFailed"));
      } finally {
        confirm.open = false;
        confirm.action = null;
      }
    }
    function publicUrlForObject(bucket, objectPath) {
      if (bucketVisibility[bucket] === false) {
        return null;
      }
      return supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl;
    }
    async function loadBuckets(force = false) {
      if (buckets.value.length && !force) return;
      loadingBuckets.value = true;
      try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) throw error;
        buckets.value = (data || []).map((b) => {
          const name = b.name || b.id;
          bucketVisibility[name] = b.public;
          return name;
        }).sort();
      } catch (e) {
        console.error("[media] loadBuckets failed", e);
        toast.error(t("media.loadBucketsFailed"));
      } finally {
        loadingBuckets.value = false;
      }
    }
    async function init(force = false) {
      await loadBuckets(force);
      if (!force && Object.keys(bucketMeta).length) return;
      for (const b of buckets.value) {
        if (b === "profile-avatar") {
          try {
            const { data: profs } = await supabase.from("profiles").select("id, avatar_url").not("avatar_url", "is", null);
            bucketMeta[b] = {
              files: (profs || []).filter(
                (p) => p.avatar_url && p.avatar_url.includes("/profile-avatar/")
              ).length
            };
          } catch {
            bucketMeta[b] = { files: 0 };
          }
        } else {
          try {
            const { data } = await supabase.storage.from(b).list("", { limit: 100 });
            bucketMeta[b] = {
              files: (data || []).filter(
                (d) => d.id != null || d.metadata != null && typeof d.metadata === "object"
              ).length
            };
          } catch {
            bucketMeta[b] = { files: 0 };
          }
        }
      }
    }
    init();
    async function generateSignedUrl(entry, seconds = 60, copy = true) {
      if (!activeBucket.value || !entry || entry.type !== "file") return;
      try {
        const { data, error } = await supabase.storage.from(activeBucket.value).createSignedUrl(entry.path, seconds);
        if (error) throw error;
        if (data == null ? void 0 : data.signedUrl) {
          entry.publicUrl = data.signedUrl;
          if (copy && void 0) ;
          else {
            toast.success(t("media.signedUrlGenerated"));
          }
        } else toast.error(t("media.signedUrlFailed"));
      } catch (e) {
        console.error("signed-url-single", e);
        toast.error(t("media.signedUrlError"));
      }
    }
    function onGenerateSigned(secs, cb) {
      if (!linkDialog.target) return;
      generateSignedUrl(linkDialog.target, secs, false).then(() => {
        cb && cb(linkDialog.target.publicUrl);
      });
    }
    function onLinkDialogCancel() {
      linkDialog.open = false;
      linkDialog.target = null;
    }
    function onLinkDialogClose() {
      linkDialog.open = false;
      linkDialog.target = null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))} data-v-83ed4a80><header class="flex items-center justify-between flex-wrap gap-4" data-v-83ed4a80><div class="flex items-center gap-2" data-v-83ed4a80>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:folder-multiple-image",
        class: "text-blue-600 dark:text-blue-400 text-2xl"
      }, null, _parent));
      _push(`<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.title"))}</h2></div><div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2" data-v-83ed4a80><span data-v-83ed4a80>${ssrInterpolate(unref(t)("media.totalBuckets"))}: ${ssrInterpolate(buckets.value.length)}</span></div></header>`);
      if (!activeBucket.value) {
        _push(`<div class="space-y-4" data-v-83ed4a80><div class="flex items-center justify-between flex-wrap gap-3" data-v-83ed4a80><div class="text-sm font-medium text-gray-600 dark:text-gray-300" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.buckets"))}</div><div class="flex items-center gap-2 flex-wrap" data-v-83ed4a80><button class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500" data-v-83ed4a80>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: showCreate.value ? "mdi:close" : "mdi:plus",
          class: "text-sm"
        }, null, _parent));
        _push(`<span data-v-83ed4a80>${ssrInterpolate(showCreate.value ? unref(t)("common.cancel") : unref(t)("media.newBucket"))}</span></button><button${ssrIncludeBooleanAttr(loadingBuckets.value) ? " disabled" : ""} class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-83ed4a80>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: loadingBuckets.value ? "mdi:loading" : "mdi:refresh",
          class: loadingBuckets.value ? "animate-spin" : "text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("common.refresh"))}</button></div></div>`);
        if (showCreate.value) {
          _push(`<div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm space-y-6" data-v-83ed4a80><div class="flex items-center gap-3" data-v-83ed4a80><div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:bucket",
            class: "w-6 h-6"
          }, null, _parent));
          _push(`</div><div data-v-83ed4a80><h3 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.createBucket"))}</h3><p class="text-[12px] text-gray-500 dark:text-gray-400" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.createBucketHint"))}</p></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-83ed4a80><div class="space-y-2" data-v-83ed4a80><label class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:label-outline",
            class: "text-blue-500"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("media.name"))}</label><div class="relative" data-v-83ed4a80><input${ssrRenderAttr("value", newBucketName.value)}${ssrRenderAttr("placeholder", unref(t)("media.namePlaceholder"))} class="${ssrRenderClass([
            "w-full h-11 rounded-md px-3 bg-white dark:bg-gray-800 border text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
            bucketNameError.value ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"
          ])}" data-v-83ed4a80>`);
          if (newBucketName.value && !bucketNameError.value) {
            _push(`<span class="absolute end-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 text-xs inline-flex items-center gap-1" data-v-83ed4a80>`);
            _push(ssrRenderComponent(unref(Icon), { icon: "mdi:check-circle" }, null, _parent));
            _push(` ${ssrInterpolate(unref(t)("media.ok"))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-[11px] text-gray-500 dark:text-gray-400" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.nameHint"))}</p>`);
          if (bucketNameError.value) {
            _push(`<p class="text-[11px] text-red-600 dark:text-red-400" data-v-83ed4a80>${ssrInterpolate(bucketNameError.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="space-y-2" data-v-83ed4a80><label class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:earth",
            class: "text-blue-500"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("media.visibility"))}</label>`);
          _push(ssrRenderComponent(unref(SelectRoot), {
            modelValue: newBucketPublic.value ? "public" : "private",
            "onUpdate:modelValue": (val) => newBucketPublic.value = val === "public"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(SelectTrigger), {
                  class: "w-full inline-flex h-11 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400",
                  "aria-label": unref(t)("media.visibilityAria")
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(SelectValue), {
                        placeholder: unref(t)("media.selectVisibility")
                      }, null, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(Icon), {
                        icon: "radix-icons:chevron-down",
                        class: "w-4 h-4 opacity-70"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(SelectValue), {
                          placeholder: unref(t)("media.selectVisibility")
                        }, null, 8, ["placeholder"]),
                        createVNode(unref(Icon), {
                          icon: "radix-icons:chevron-down",
                          class: "w-4 h-4 opacity-70"
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(SelectPortal), null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(SelectContent), {
                        class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                        "side-offset": 5
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-up" }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(SelectViewport), { class: "p-1" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(SelectGroup), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(SelectItem), {
                                          value: "public",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(Icon), {
                                                      icon: "mdi:check",
                                                      class: "w-4 h-4"
                                                    }, null, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(Icon), {
                                                        icon: "mdi:check",
                                                        class: "w-4 h-4"
                                                      })
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(SelectItemText), null, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(unref(t)("media.publicOption"))}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(unref(t)("media.publicOption")), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), {
                                                      icon: "mdi:check",
                                                      class: "w-4 h-4"
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectItemText), null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(unref(t)("media.publicOption")), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }, null, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(unref(SelectItem), {
                                          value: "private",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(Icon), {
                                                      icon: "mdi:check",
                                                      class: "w-4 h-4"
                                                    }, null, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(Icon), {
                                                        icon: "mdi:check",
                                                        class: "w-4 h-4"
                                                      })
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(SelectItemText), null, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(unref(t)("media.privateOption"))}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(unref(t)("media.privateOption")), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), {
                                                      icon: "mdi:check",
                                                      class: "w-4 h-4"
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectItemText), null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(unref(t)("media.privateOption")), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(SelectItem), {
                                            value: "public",
                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), {
                                                    icon: "mdi:check",
                                                    class: "w-4 h-4"
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectItemText), null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(t)("media.publicOption")), 1)
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                          createVNode(unref(SelectItem), {
                                            value: "private",
                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), {
                                                    icon: "mdi:check",
                                                    class: "w-4 h-4"
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectItemText), null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(t)("media.privateOption")), 1)
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(SelectGroup), null, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItem), {
                                          value: "public",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), {
                                                  icon: "mdi:check",
                                                  class: "w-4 h-4"
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectItemText), null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(t)("media.publicOption")), 1)
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                        createVNode(unref(SelectItem), {
                                          value: "private",
                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), {
                                                  icon: "mdi:check",
                                                  class: "w-4 h-4"
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectItemText), null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(t)("media.privateOption")), 1)
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-down" }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                default: withCtx(() => [
                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(SelectViewport), { class: "p-1" }, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectGroup), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItem), {
                                        value: "public",
                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), {
                                                icon: "mdi:check",
                                                class: "w-4 h-4"
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectItemText), null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(t)("media.publicOption")), 1)
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                      createVNode(unref(SelectItem), {
                                        value: "private",
                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), {
                                                icon: "mdi:check",
                                                class: "w-4 h-4"
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectItemText), null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(t)("media.privateOption")), 1)
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                default: withCtx(() => [
                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(SelectContent), {
                          class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                          "side-offset": 5
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(SelectViewport), { class: "p-1" }, {
                              default: withCtx(() => [
                                createVNode(unref(SelectGroup), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectItem), {
                                      value: "public",
                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), {
                                              icon: "mdi:check",
                                              class: "w-4 h-4"
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectItemText), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(t)("media.publicOption")), 1)
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                    createVNode(unref(SelectItem), {
                                      value: "private",
                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), {
                                              icon: "mdi:check",
                                              class: "w-4 h-4"
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectItemText), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(t)("media.privateOption")), 1)
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(SelectTrigger), {
                    class: "w-full inline-flex h-11 items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400",
                    "aria-label": unref(t)("media.visibilityAria")
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(SelectValue), {
                        placeholder: unref(t)("media.selectVisibility")
                      }, null, 8, ["placeholder"]),
                      createVNode(unref(Icon), {
                        icon: "radix-icons:chevron-down",
                        class: "w-4 h-4 opacity-70"
                      })
                    ]),
                    _: 1
                  }, 8, ["aria-label"]),
                  createVNode(unref(SelectPortal), null, {
                    default: withCtx(() => [
                      createVNode(unref(SelectContent), {
                        class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                        "side-offset": 5
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(SelectViewport), { class: "p-1" }, {
                            default: withCtx(() => [
                              createVNode(unref(SelectGroup), null, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectItem), {
                                    value: "public",
                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), {
                                            icon: "mdi:check",
                                            class: "w-4 h-4"
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectItemText), null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(t)("media.publicOption")), 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                  createVNode(unref(SelectItem), {
                                    value: "private",
                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-8 pe-8 ps-8 relative select-none cursor-pointer data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute start-0 w-8 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), {
                                            icon: "mdi:check",
                                            class: "w-4 h-4"
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectItemText), null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(t)("media.privateOption")), 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<p class="text-[11px] text-gray-500 dark:text-gray-400" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.visibilityHint"))}</p></div><div class="space-y-2 md:col-span-2" data-v-83ed4a80><label class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:file-code-outline",
            class: "text-blue-500"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("media.allowedMimeTypes"))}</label><div class="relative group" data-v-83ed4a80><textarea rows="3"${ssrRenderAttr("placeholder", unref(t)("media.mimePlaceholder"))} class="w-full rounded-lg px-4 py-3 bg-white/90 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400/60 focus:border-gray-400 dark:focus:border-gray-500 shadow-sm transition-colors leading-relaxed min-h-[96px] resize-none text-sm" data-v-83ed4a80>${ssrInterpolate(newBucketMime.value)}</textarea></div><p class="text-[11px] text-gray-500 dark:text-gray-400" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.mimeHint"))}</p></div><div class="space-y-2" data-v-83ed4a80><label class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:scale",
            class: "text-blue-500"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("media.fileSizeLimit"))}</label><input${ssrRenderAttr("value", newBucketSizeLimit.value)}${ssrRenderAttr("placeholder", unref(t)("media.sizeLimitPlaceholder"))} class="w-full h-11 rounded-md px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-83ed4a80><p class="text-[11px] text-gray-500 dark:text-gray-400" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.sizeLimitHint"))}</p></div></div><div class="flex flex-col sm:flex-row sm:items-center gap-4 justify-between pt-2" data-v-83ed4a80><div class="flex items-center gap-2 flex-wrap text-[11px] text-gray-500 dark:text-gray-400" data-v-83ed4a80><span class="inline-flex items-center gap-1" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:shield-lock-outline",
            class: "text-gray-400"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("media.reservedNames"))}</span>`);
          if (bucketNameReserved.value) {
            _push(`<span class="text-red-600 dark:text-red-400 font-medium" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.reservedName"))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex items-center gap-2" data-v-83ed4a80><button type="button" class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:close",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("common.cancel"))}</button><button${ssrIncludeBooleanAttr(creating.value || !!bucketNameError.value || !newBucketName.value) ? " disabled" : ""} class="inline-flex items-center gap-2 h-9 px-5 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: creating.value ? "mdi:loading" : "mdi:check-circle",
            class: creating.value ? "animate-spin" : "text-base"
          }, null, _parent));
          _push(`<span data-v-83ed4a80>${ssrInterpolate(creating.value ? unref(t)("common.creating") : unref(t)("media.createBucket"))}</span></button></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-v-83ed4a80><!--[-->`);
        ssrRenderList(buckets.value, (b) => {
          _push(`<div class="group relative flex flex-col items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow transition cursor-pointer" tabindex="0" role="button"${ssrRenderAttr("aria-label", unref(t)("media.openBucket", { name: b }))} data-v-83ed4a80><div class="flex items-start justify-between w-full" data-v-83ed4a80><div class="flex items-center gap-3" data-v-83ed4a80><div class="w-10 h-10 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:database",
            class: "text-blue-600 dark:text-blue-300 text-xl"
          }, null, _parent));
          _push(`</div><div class="text-start" data-v-83ed4a80><h3 class="text-sm font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2" data-v-83ed4a80><button class="hover:underline underline-offset-2" data-v-83ed4a80>${ssrInterpolate(b)}</button>`);
          if (unref(systemBuckets).has(b)) {
            _push(`<span class="inline-flex items-center h-5 px-2 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] font-semibold" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.system"))}</span>`);
          } else if (bucketVisibility[b] === false) {
            _push(`<span class="inline-flex items-center h-5 px-2 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700/60 dark:text-gray-200 text-[10px] font-semibold gap-1" data-v-83ed4a80>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:lock",
              class: "text-xs"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(t)("media.private"))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</h3><p class="text-[11px] text-gray-500 dark:text-gray-400" data-v-83ed4a80>${ssrInterpolate(unref(systemBuckets).has(b) ? unref(t)("media.managedInternally") : unref(t)("media.userBucket"))}</p></div></div>`);
          if (!unref(systemBuckets).has(b)) {
            _push(`<div class="flex items-center gap-1" data-v-83ed4a80><button data-bucket-action${ssrRenderAttr("title", unref(t)("media.emptyBucket"))} class="inline-flex items-center justify-center w-7 h-7 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60" data-v-83ed4a80>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:delete-empty",
              class: "text-sm"
            }, null, _parent));
            _push(`</button><button data-bucket-action${ssrRenderAttr("title", unref(t)("media.deleteBucket"))} class="inline-flex items-center justify-center w-7 h-7 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60" data-v-83ed4a80>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:trash-can",
              class: "text-sm"
            }, null, _parent));
            _push(`</button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (bucketMeta[b]) {
            _push(`<div class="mt-1 text-[11px] text-gray-500 dark:text-gray-400" data-v-83ed4a80>`);
            if (b === "profile-avatar") {
              _push(`<!--[-->${ssrInterpolate(unref(t)("media.avatarCount", { count: bucketMeta[b].files }))}<!--]-->`);
            } else {
              _push(`<!--[-->${ssrInterpolate(unref(t)("media.fileCount", { count: bucketMeta[b].files }))}<!--]-->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="space-y-4" data-v-83ed4a80><div class="flex items-center justify-between flex-wrap gap-3" data-v-83ed4a80><div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 flex-wrap" data-v-83ed4a80><button class="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-83ed4a80>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:arrow-left",
          class: "text-base"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("media.buckets"))}</button><span class="mx-1 opacity-40" data-v-83ed4a80>/</span><button class="font-semibold hover:underline underline-offset-2" data-v-83ed4a80>${ssrInterpolate(activeBucket.value)}</button>`);
        if (unref(systemBuckets).has(activeBucket.value)) {
          _push(`<span class="inline-flex items-center h-5 px-2 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] font-semibold" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.system"))}</span>`);
        } else if (bucketVisibility[activeBucket.value] === false) {
          _push(`<span class="inline-flex items-center h-5 px-2 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700/60 dark:text-gray-200 text-[10px] font-semibold gap-1" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:lock",
            class: "text-xs"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("media.private"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (pathSegments.value.length) {
          _push(`<!--[--><span class="opacity-40" data-v-83ed4a80>/</span><!--[-->`);
          ssrRenderList(pathSegments.value, (seg, idx) => {
            _push(`<!--[--><button class="hover:underline underline-offset-2" data-v-83ed4a80>${ssrInterpolate(seg)}</button>`);
            if (idx < pathSegments.value.length - 1) {
              _push(`<span class="opacity-40" data-v-83ed4a80>/</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]--><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (currentPath.value) {
          _push(`<button class="inline-flex items-center gap-1 h-7 px-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:arrow-up",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("media.up"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex items-center gap-3 flex-wrap" data-v-83ed4a80>`);
        if (!unref(systemBuckets).has(activeBucket.value)) {
          _push(`<button${ssrIncludeBooleanAttr(uploading.value) ? " disabled" : ""} class="inline-flex items-center gap-1 h-8 px-3 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: uploading.value ? "mdi:loading" : "mdi:upload",
            class: uploading.value ? "animate-spin" : "text-sm"
          }, null, _parent));
          _push(`<span data-v-83ed4a80>${ssrInterpolate(uploading.value ? unref(t)("common.uploading") : unref(t)("media.upload"))}</span></button>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(systemBuckets).has(activeBucket.value)) {
          _push(`<button class="inline-flex items-center gap-1 h-8 px-3 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/60" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:delete-empty",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("media.empty"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(systemBuckets).has(activeBucket.value)) {
          _push(`<button class="inline-flex items-center gap-1 h-8 px-3 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/60" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:trash-can",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("media.deleteBucket"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center h-8 w-48 sm:w-50 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 transition" data-v-83ed4a80>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:magnify",
          class: "ms-2 text-gray-400 dark:text-gray-400 text-sm shrink-0"
        }, null, _parent));
        _push(`<input${ssrRenderAttr("value", searchTerm.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("media.searchPlaceholder"))} class="flex-1 h-full bg-transparent px-2 text-xs leading-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none" data-v-83ed4a80></div><span class="text-xs text-gray-500 dark:text-gray-400" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.itemsShown", {
          filtered: filteredEntries.value.length,
          total: entries.value.length
        }))}</span><button class="inline-flex items-center gap-1 h-8 px-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-83ed4a80>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:refresh",
          class: "text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("common.refresh"))}</button>`);
        if (searchTerm.value) {
          _push(`<button class="inline-flex items-center gap-1 h-8 px-2 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-[11px] font-medium hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:close",
            class: "text-sm"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("common.clear"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><input type="file" class="hidden" multiple data-v-83ed4a80><div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" data-v-83ed4a80><table class="min-w-full text-sm" data-v-83ed4a80><thead class="text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/40" data-v-83ed4a80><tr data-v-83ed4a80><th class="text-start font-semibold px-3 py-2 w-20" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.preview"))}</th><th class="text-start font-semibold px-3 py-2" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.name"))}</th><th class="text-start font-semibold px-3 py-2" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.type"))}</th><th class="text-start font-semibold px-3 py-2" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.size"))}</th><th class="text-start font-semibold px-3 py-2" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.modified"))}</th>`);
        if (!isPrivateActiveBucket.value) {
          _push(`<th class="text-start font-semibold px-3 py-2" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.usage"))}</th>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<th class="text-start font-semibold px-3 py-2 w-48" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.actions"))}</th></tr></thead><tbody data-v-83ed4a80>`);
        if (loading.value) {
          _push(`<tr class="text-gray-500 dark:text-gray-400" data-v-83ed4a80><td${ssrRenderAttr("colspan", fileTableColspan.value)} class="px-3 py-6 text-center" data-v-83ed4a80>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:loading",
            class: "animate-spin inline-block me-2"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("common.loading"))}</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(filteredEntries.value, (e) => {
          _push(`<tr class="border-t border-gray-100 dark:border-gray-700/60 hover:bg-gray-50/70 dark:hover:bg-gray-700/40" data-v-83ed4a80><td class="px-3 py-2" data-v-83ed4a80>`);
          if (e.type === "file" || e.type === "avatar-profile") {
            _push(`<div class="w-14 h-14 rounded border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center" data-v-83ed4a80>`);
            if (e.isImage) {
              _push(`<img${ssrRenderAttr("src", e.publicUrl)}${ssrRenderAttr("alt", unref(t)("media.preview"))} class="object-cover w-full h-full" loading="lazy" data-v-83ed4a80>`);
            } else {
              _push(ssrRenderComponent(unref(Icon), {
                icon: "mdi:file",
                class: "text-gray-400"
              }, null, _parent));
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-3 py-2" data-v-83ed4a80>`);
          if (e.type === "folder" || e.type === "avatar-profile") {
            _push(`<button class="inline-flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400 hover:underline" data-v-83ed4a80>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: e.type === "avatar-profile" ? "mdi:folder-account" : "mdi:folder",
              class: "text-base"
            }, null, _parent));
            _push(` ${ssrInterpolate(e.name)} `);
            if (e.type === "avatar-profile" && e.profileMeta) {
              _push(`<span class="text-[11px] font-normal text-gray-500 dark:text-gray-400" data-v-83ed4a80>${ssrInterpolate(e.profileMeta.display)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</button>`);
          } else {
            _push(`<div class="flex flex-col gap-0.5 max-w-xs" data-v-83ed4a80><span class="font-medium text-gray-800 dark:text-gray-100 break-all"${ssrRenderAttr("title", e.name)} data-v-83ed4a80>${ssrInterpolate(e.name)}</span>`);
            if (e.profileMeta) {
              _push(`<span class="text-[11px] text-gray-500 dark:text-gray-400 break-all" data-v-83ed4a80>${ssrInterpolate(e.profileMeta.display)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (e.isCurrent) {
              _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-semibold w-fit" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.current"))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          }
          _push(`</td><td class="px-3 py-2 text-gray-600 dark:text-gray-300" data-v-83ed4a80>${ssrInterpolate(e.type)}</td><td class="px-3 py-2 tabular-nums text-gray-600 dark:text-gray-300" data-v-83ed4a80>${ssrInterpolate(formatSize(e.size))}</td><td class="px-3 py-2 text-gray-600 dark:text-gray-300" data-v-83ed4a80>${ssrInterpolate(formatDate(e.updated_at))}</td>`);
          if (!isPrivateActiveBucket.value) {
            _push(`<td class="px-3 py-2" data-v-83ed4a80>`);
            if (e.type === "file" || e.type === "avatar-profile") {
              _push(`<div class="flex flex-col gap-1" data-v-83ed4a80><span class="${ssrRenderClass([
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold",
                e.usage.total > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              ])}" data-v-83ed4a80>`);
              _push(ssrRenderComponent(unref(Icon), {
                icon: e.usage.total > 0 ? "mdi:link" : "mdi:check-circle",
                class: "text-xs"
              }, null, _parent));
              _push(` ${ssrInterpolate(e.usage.total > 0 ? unref(t)("media.inUse", { count: e.usage.total }) : unref(t)("media.unused"))}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</td>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<td class="px-3 py-2" data-v-83ed4a80><div class="flex flex-wrap items-center gap-2" data-v-83ed4a80>`);
          if (e.type === "file" || e.type === "avatar-profile") {
            _push(`<a${ssrRenderAttr("href", e.publicUrl)} target="_blank" class="inline-flex items-center gap-1 h-7 px-2 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[12px] font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60" data-v-83ed4a80>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:open-in-new",
              class: "text-sm"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(t)("common.open"))}</a>`);
          } else {
            _push(`<!---->`);
          }
          if (e.type === "file" && bucketVisibility[activeBucket.value] === false) {
            _push(`<button class="inline-flex items-center gap-1 h-7 px-2 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[12px] font-medium hover:bg-purple-200 dark:hover:bg-purple-900/60"${ssrRenderAttr("title", unref(t)("media.generateSignedLink"))} data-v-83ed4a80>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:link-variant",
              class: "text-sm"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(t)("media.link"))}</button>`);
          } else {
            _push(`<!---->`);
          }
          if (e.type === "file" || e.type === "avatar-profile") {
            _push(`<button class="inline-flex items-center gap-1 h-7 px-2 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-[12px] font-medium hover:bg-red-200 dark:hover:bg-red-900/60" data-v-83ed4a80>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:delete",
              class: "text-sm"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(t)("common.delete"))}</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!loading.value && filteredEntries.value.length === 0) {
          _push(`<tr data-v-83ed4a80><td${ssrRenderAttr("colspan", fileTableColspan.value)} class="px-3 py-10 text-center text-sm text-gray-500 dark:text-gray-400" data-v-83ed4a80>${ssrInterpolate(unref(t)("media.noMatchingItems"))}</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div>`);
      }
      if (confirm.open) {
        _push(ssrRenderComponent(_sfc_main$g, {
          open: confirm.open,
          title: confirm.title,
          description: confirm.description,
          body: confirm.body,
          onConfirm: performConfirm,
          onCancel: ($event) => confirm.open = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (linkDialog.open) {
        _push(ssrRenderComponent(_sfc_main$4, {
          open: linkDialog.open,
          onGenerate: onGenerateSigned,
          onCancel: onLinkDialogCancel,
          onClose: onLinkDialogClose
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/MediaManager.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const MediaManager = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-83ed4a80"]]);
const _sfc_main$2 = {
  __name: "StatsSettingsForm",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    const { statsEnabled } = useStatsSettings();
    const { featuresEnabled } = useSettings();
    const featureOptions = computed(() => [
      {
        key: "welcome",
        label: t("settings.homepage.features.welcome.label"),
        icon: "mdi:star-four-points",
        desc: t("settings.homepage.features.welcome.desc")
      },
      {
        key: "siteName",
        label: t("settings.homepage.features.siteName.label"),
        icon: "mdi:format-title",
        desc: t("settings.homepage.features.siteName.desc")
      },
      {
        key: "siteDescription",
        label: t("settings.homepage.features.siteDescription.label"),
        icon: "mdi:card-text-outline",
        desc: t("settings.homepage.features.siteDescription.desc")
      },
      {
        key: "search",
        label: t("settings.homepage.features.search.label"),
        icon: "mdi:magnify",
        desc: t("settings.homepage.features.search.desc")
      }
    ]);
    const statOptions = computed(() => [
      {
        key: "posts",
        label: t("settings.homepage.stats.posts.label"),
        icon: "mdi:post-outline",
        desc: t("settings.homepage.stats.posts.desc")
      },
      {
        key: "categories",
        label: t("settings.homepage.stats.categories.label"),
        icon: "mdi:folder-outline",
        desc: t("settings.homepage.stats.categories.desc")
      },
      {
        key: "authors",
        label: t("settings.homepage.stats.authors.label"),
        icon: "mdi:account-multiple-outline",
        desc: t("settings.homepage.stats.authors.desc")
      }
    ]);
    const localEnabled = ref({ posts: true, categories: true, authors: true });
    const localFeatures = ref({
      welcome: true,
      siteName: true,
      siteDescription: true,
      search: true
    });
    const error = ref("");
    watch(statsEnabled, (val) => {
      localEnabled.value = { ...val };
    });
    watch(featuresEnabled, (val) => {
      localFeatures.value = { ...val };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6 min-w-0 w-full" }, _attrs))}><div class="flex flex-wrap items-start gap-3 mb-6 sm:flex-nowrap"><div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:chart-bar",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</div><div class="flex-1 min-w-0"><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase break-words">${ssrInterpolate(unref(t)("settings.homepage.title"))}</h2><p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1 break-words">${ssrInterpolate(unref(t)("settings.homepage.description"))}</p></div></div><form class="space-y-8"><div><h3 class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">${ssrInterpolate(unref(t)("settings.homepage.featuresTitle"))}</h3><div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><!--[-->`);
      ssrRenderList(featureOptions.value, (feature) => {
        _push(`<div class="flex flex-wrap items-center gap-3 justify-between group rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow transition"><div class="flex items-center gap-3 min-w-0">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: feature.icon,
          class: "w-7 h-7 text-blue-500 dark:text-blue-300 flex-shrink-0"
        }, null, _parent));
        _push(`<div class="flex flex-col min-w-0"><span class="font-semibold text-gray-900 dark:text-white text-sm truncate">${ssrInterpolate(feature.label)}</span><span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words leading-snug">${ssrInterpolate(feature.desc)}</span></div></div><button type="button" role="switch"${ssrRenderAttr("aria-checked", localFeatures.value[feature.key])}${ssrRenderAttr("aria-label", feature.label)} class="${ssrRenderClass([
          "relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none duration-200 ms-auto",
          localFeatures.value[feature.key] ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700",
          "group-hover:ring-2 group-hover:ring-blue-300 group-focus:ring-2 group-focus:ring-blue-400"
        ])}"><span class="${ssrRenderClass([
          "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition duration-200",
          localFeatures.value[feature.key] ? "translate-x-5" : "translate-x-1"
        ])}"></span></button></div>`);
      });
      _push(`<!--]--></div></div><div class="pt-4"><h3 class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">${ssrInterpolate(unref(t)("settings.homepage.statsTitle"))}</h3><div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><!--[-->`);
      ssrRenderList(statOptions.value, (stat) => {
        _push(`<div class="flex flex-wrap items-center gap-3 justify-between group rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow transition"><div class="flex items-center gap-3 min-w-0">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: stat.icon,
          class: "w-7 h-7 text-blue-500 dark:text-blue-300 flex-shrink-0"
        }, null, _parent));
        _push(`<div class="flex flex-col min-w-0"><span class="font-semibold text-gray-900 dark:text-white text-sm truncate">${ssrInterpolate(stat.label)}</span><span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words leading-snug">${ssrInterpolate(stat.desc)}</span></div></div><button type="button" role="switch"${ssrRenderAttr("aria-checked", localEnabled.value[stat.key])}${ssrRenderAttr("aria-label", stat.label)} class="${ssrRenderClass([
          "relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none duration-200 ms-auto",
          localEnabled.value[stat.key] ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700",
          "group-hover:ring-2 group-hover:ring-blue-300 group-focus:ring-2 group-focus:ring-blue-400"
        ])}"><span class="${ssrRenderClass([
          "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition duration-200",
          localEnabled.value[stat.key] ? "translate-x-5" : "translate-x-1"
        ])}"></span></button></div>`);
      });
      _push(`<!--]--></div></div><div class="flex gap-2 pt-4 items-center justify-end"><button type="submit" class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-400">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:content-save",
        class: "text-base"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(unref(t)("common.save"))}</span></button>`);
      if (error.value) {
        _push(`<span class="text-red-600 text-sm">${ssrInterpolate(error.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/StatsSettingsForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "ProviderSettingsForm",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useLocalePath();
    const appOrigin = getBrowserOrigin();
    const { providersEnabled, ALL_PROVIDERS, providerLabel, providerIcon, brandBg, brandBorder, providerGlyphColor } = useSettings();
    const localProviders = ref({});
    const saving = ref(false);
    const error = ref("");
    watch(
      () => providersEnabled.value,
      (val) => {
        localProviders.value = { ...val };
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6 min-w-0 w-full" }, _attrs))}><div class="flex flex-wrap items-start gap-3 mb-6 sm:flex-nowrap"><div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:lock-open-variant-outline",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</div><div class="flex-1 min-w-0"><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase break-words">${ssrInterpolate(unref(t)("settings.providers.title"))}</h2><p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1 break-words">${ssrInterpolate(unref(t)("settings.providers.description"))}</p></div></div><form class="space-y-8"><div class="rounded-lg border border-amber-200/70 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20 p-3 text-amber-800 dark:text-amber-200 text-[12px] flex flex-col sm:flex-row sm:items-start gap-2 break-words">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:alert-circle-outline",
        class: "text-amber-600 dark:text-amber-300 mt-0.5"
      }, null, _parent));
      _push(`<div class="min-w-0 space-y-2"><p class="font-semibold">${ssrInterpolate(unref(t)("settings.providers.important"))}</p><p class="mt-0.5 break-words">${ssrInterpolate(unref(t)("settings.providers.importantBody"))}</p><ul class="mt-2 space-y-1 list-disc list-inside break-words"><li>${ssrInterpolate(unref(t)("settings.providers.signInRedirect"))} <code class="px-1 py-0.5 rounded bg-amber-100/60 dark:bg-amber-900/40 break-all">${ssrInterpolate(unref(appOrigin))}</code></li><li>${ssrInterpolate(unref(t)("settings.providers.linkAccountsRedirect"))} <code class="px-1 py-0.5 rounded bg-amber-100/60 dark:bg-amber-900/40 break-all">${ssrInterpolate(unref(appOrigin) + "/profile")}</code></li></ul></div></div><div><div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(ALL_PROVIDERS), (provider) => {
        _push(`<div class="flex items-center justify-between group rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow transition"><div class="flex items-center gap-3 min-w-0"><div class="w-8 h-8 rounded-md border flex items-center justify-center flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: unref(brandBg)(provider), borderColor: unref(brandBorder)(provider) })}">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: unref(providerIcon)(provider),
          class: "w-5 h-5",
          style: { color: unref(providerGlyphColor)(provider) || void 0 }
        }, null, _parent));
        _push(`</div><div class="flex flex-col min-w-0"><span class="font-semibold text-gray-900 dark:text-white text-sm truncate">${ssrInterpolate(unref(providerLabel)(provider))}</span></div></div><button type="button" role="switch"${ssrRenderAttr("aria-checked", localProviders.value[provider])}${ssrRenderAttr("aria-label", unref(providerLabel)(provider))} class="${ssrRenderClass([
          "relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none duration-200 ms-4",
          localProviders.value[provider] ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700",
          "group-hover:ring-2 group-hover:ring-blue-300 group-focus:ring-2 group-focus:ring-blue-400"
        ])}"><span class="${ssrRenderClass([
          "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition duration-200",
          localProviders.value[provider] ? "translate-x-5" : "translate-x-1"
        ])}"></span></button></div>`);
      });
      _push(`<!--]--></div></div><div class="flex gap-2 pt-4 items-center justify-end"><button type="submit"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-400">`);
      if (saving.value) {
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:loading",
          class: "animate-spin text-base"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:content-save",
          class: "text-base"
        }, null, _parent));
      }
      _push(`<span>${ssrInterpolate(saving.value ? unref(t)("common.saving") : unref(t)("common.save"))}</span></button>`);
      if (error.value) {
        _push(`<span class="text-red-600 text-sm">${ssrInterpolate(error.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/ProviderSettingsForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const filterTriggerClass = "w-full inline-flex h-9 items-center justify-between gap-2 rounded-md px-2.5 text-sm bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400";
const TAB_STORAGE_KEY = "pluma.dashboard.activeTab";
const pageSize = 10;
const pendingPageSize = 10;
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const loading = ref(true);
    const showConfirm = ref(false);
    const confirmMessage = ref("");
    const statusFilter = ref("all");
    const localeFilter = ref("all");
    const authorFilter = ref("all");
    const categoryFilter = ref("all");
    const startDate = ref("");
    const endDate = ref("");
    const dateRange = ref({ start: void 0, end: void 0 });
    const dateRangePickerKey = ref(0);
    const uniqueAuthors = ref([]);
    const categories = ref([]);
    const status = ref(["published", "draft", "archived"]);
    const { locales: i18nLocales } = useI18n();
    const postLocalesInUse = ref([]);
    const filterLocales = computed(() => {
      const catalog = unref(i18nLocales) || [];
      const nameByCode = /* @__PURE__ */ Object.create(null);
      for (const l of catalog) {
        nameByCode[l.code] = l.name || l.code;
      }
      for (const l of CONTENT_LOCALES) {
        if (!nameByCode[l.code]) nameByCode[l.code] = l.name;
      }
      return postLocalesInUse.value.map((code) => ({
        code,
        name: nameByCode[code] || code
      }));
    });
    async function fetchPostLocalesInUse() {
      const { data, error } = await supabase.from("posts").select("locale");
      if (error || !data) {
        postLocalesInUse.value = [];
        return;
      }
      postLocalesInUse.value = [
        ...new Set(data.map((r) => r.locale).filter(Boolean))
      ].sort();
      if (localeFilter.value !== "all" && !postLocalesInUse.value.includes(localeFilter.value)) {
        localeFilter.value = "all";
      }
    }
    async function enrichPostsWithLocales(rows) {
      if (!rows.length) return rows;
      const groupIds = [
        ...new Set(rows.map((p) => p.translation_group_id).filter(Boolean))
      ];
      const byGroup = /* @__PURE__ */ Object.create(null);
      if (groupIds.length) {
        const { data: siblings, error } = await supabase.from("posts").select("locale, translation_group_id").in("translation_group_id", groupIds);
        if (!error && siblings) {
          for (const s of siblings) {
            if (!s.translation_group_id || !s.locale) continue;
            if (!byGroup[s.translation_group_id]) byGroup[s.translation_group_id] = [];
            if (!byGroup[s.translation_group_id].includes(s.locale)) {
              byGroup[s.translation_group_id].push(s.locale);
            }
          }
          for (const id of Object.keys(byGroup)) {
            byGroup[id].sort();
          }
        }
      }
      return rows.map((p) => ({
        ...p,
        locales: p.translation_group_id && byGroup[p.translation_group_id] || (p.locale ? [p.locale] : [])
      }));
    }
    const hasActivePostFilters = computed(
      () => statusFilter.value !== "all" || localeFilter.value !== "all" || categoryFilter.value !== "all" || authorFilter.value !== "all" || !!startDate.value || !!endDate.value
    );
    let confirmAction = () => {
    };
    function askConfirmation(message, action) {
      confirmMessage.value = message;
      confirmAction = async () => {
        await action();
        showConfirm.value = false;
      };
      showConfirm.value = true;
    }
    function closeDialog() {
      showConfirm.value = false;
    }
    const router = useRouter();
    const stats = ref({
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      pendingComments: 0,
      categories: 0,
      authors: 0,
      members: 0
    });
    const activeTab = ref("overview");
    const postsLoaded = ref(false);
    const pendingLoaded = ref(false);
    const brandingLoaded = ref(false);
    const membersLoaded = ref(false);
    const mediaLoaded = ref(false);
    const brandingStore = useBranding();
    const posts = ref([]);
    const selected = ref([]);
    const currentUser = ref(null);
    const role = ref("reader");
    ref(null);
    const allSelected = computed(
      () => selected.value.length === posts.value.length && posts.value.length > 0
    );
    const toggleAll = () => {
      selected.value = allSelected.value ? [] : posts.value.map((post) => post.id);
    };
    const currentPage = ref(1);
    const totalPostsCount = ref(0);
    const totalPages = computed(() => Math.ceil(totalPostsCount.value / pageSize));
    const searchQuery = ref("");
    const toast = useToast();
    let searchTimeout = null;
    function onSearchInput() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        fetchDashboard();
      }, 400);
    }
    function clearSearch() {
      searchQuery.value = "";
      clearTimeout(searchTimeout);
      currentPage.value = 1;
      fetchDashboard();
    }
    const fetchDashboard = async () => {
      let query = supabase.from("posts").select(
        `
      id,
      title,
      created_at,
      status,
      slug,
      locale,
      translation_group_id,
      category:categories (
        id,
        name,
        slug
      ),
      author:profiles (
        id,
        display_name,
        username
      )
    `,
        { count: "exact" }
      ).order("created_at", { ascending: false }).range((currentPage.value - 1) * pageSize, currentPage.value * pageSize - 1);
      if (searchQuery.value.trim() !== "") {
        query = query.ilike("title", `%${searchQuery.value}%`);
      }
      if (categoryFilter.value && categoryFilter.value !== "all") {
        query = query.eq("category_id", categoryFilter.value);
      }
      if (statusFilter.value && statusFilter.value !== "all") {
        query = query.eq("status", statusFilter.value);
      }
      if (localeFilter.value && localeFilter.value !== "all") {
        query = query.eq("locale", localeFilter.value);
      }
      if (authorFilter.value && authorFilter.value !== "all") {
        query = query.eq("author_id", authorFilter.value);
      }
      if (startDate.value) {
        const from = new Date(startDate.value);
        query = query.gte("created_at", from.toISOString());
      }
      if (endDate.value) {
        const to = new Date(endDate.value);
        to.setDate(to.getDate() + 1);
        query = query.lt("created_at", to.toISOString());
      }
      const { data, error, count } = await query;
      if (error) {
        console.error("Error fetching posts:", error);
        posts.value = [];
        totalPostsCount.value = 0;
      } else {
        posts.value = await enrichPostsWithLocales(data || []);
        totalPostsCount.value = count || 0;
      }
      const { count: total } = await supabase.from("posts").select("*", { count: "exact", head: true });
      stats.value.totalPosts = total || 0;
      const { count: pending } = await supabase.from("comments").select("*", { count: "exact", head: true }).eq("approved", false);
      stats.value.pendingComments = pending || 0;
      selected.value = [];
    };
    function applyFilters() {
      currentPage.value = 1;
      fetchDashboard();
    }
    function toYMD(val) {
      if (!val) return "";
      if (val instanceof Date) {
        const y = val.getFullYear();
        const m = String(val.getMonth() + 1).padStart(2, "0");
        const d = String(val.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }
      if (typeof val === "object" && "year" in val && "month" in val && "day" in val) {
        const y = val.year;
        const m = String(val.month).padStart(2, "0");
        const d = String(val.day).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }
      return "";
    }
    function onDateRangeChange(range) {
      startDate.value = toYMD(range == null ? void 0 : range.start);
      endDate.value = toYMD(range == null ? void 0 : range.end);
      applyFilters();
    }
    function clearDateRange() {
      dateRange.value = { start: void 0, end: void 0 };
      startDate.value = "";
      endDate.value = "";
      dateRangePickerKey.value++;
      applyFilters();
    }
    function clearAllPostFilters() {
      statusFilter.value = "all";
      localeFilter.value = "all";
      categoryFilter.value = "all";
      authorFilter.value = "all";
      dateRange.value = { start: void 0, end: void 0 };
      startDate.value = "";
      endDate.value = "";
      dateRangePickerKey.value++;
      applyFilters();
    }
    const deletePost = async (id) => {
      await supabase.from("posts").delete().eq("id", id);
      selected.value = selected.value.filter((pid) => pid !== id);
      toast.success(t("posts.deleted"));
      await Promise.all([fetchPostLocalesInUse(), fetchDashboard()]);
    };
    const bulkDelete = async () => {
      if (selected.value.length === 0) return;
      await supabase.from("posts").delete().in("id", selected.value);
      selected.value = [];
      toast.success(t("posts.deletedSelected"));
      await Promise.all([fetchPostLocalesInUse(), fetchDashboard()]);
    };
    const editPost = (id) => {
      router.push(localePath(`/dashboard/edit/${id}`));
    };
    function changePage(page) {
      if (page < 1 || page > totalPages.value) return;
      currentPage.value = page;
      fetchDashboard();
    }
    async function fetchAuthors() {
      const { data, error } = await supabase.from("profiles").select("id, username, display_name");
      if (!error && data) {
        uniqueAuthors.value = data;
      }
    }
    async function fetchCategories() {
      const { data, error } = await supabase.from("categories").select("id, name, slug");
      if (!error && data) {
        categories.value = data;
      }
    }
    const pendingComments = ref([]);
    const loadingPending = ref(false);
    const pendingPage = ref(1);
    const pendingTotal = ref(0);
    const commentsTotalCount = ref(0);
    const pendingTotalPages = computed(
      () => Math.max(1, Math.ceil(pendingTotal.value / pendingPageSize))
    );
    const pendingSearchQuery = ref("");
    const commentsFilter = ref("all");
    let pendingSearchTimeout = null;
    function setCommentsFilter(f) {
      if (["all", "approved", "pending"].includes(f)) {
        commentsFilter.value = f;
        pendingPage.value = 1;
        fetchPendingComments(true);
      }
    }
    function onPendingSearch() {
      if (pendingSearchTimeout) clearTimeout(pendingSearchTimeout);
      pendingSearchTimeout = setTimeout(() => {
        pendingPage.value = 1;
        fetchPendingComments(true);
      }, 300);
    }
    async function updatePendingCount() {
      if (role.value === "admin" || role.value === "author") {
        const { count: pending } = await supabase.from("comments").select("id", { count: "exact", head: true }).eq("approved", false);
        stats.value.pendingComments = pending || 0;
      }
    }
    async function fetchPendingComments(clear = false) {
      if (!(role.value === "admin" || role.value === "author")) return;
      loadingPending.value = true;
      if (clear) pendingComments.value = [];
      try {
        const from = (pendingPage.value - 1) * pendingPageSize;
        const to = from + pendingPageSize - 1;
        let base = supabase.from("comments").select(
          `id, content, created_at, approved, post:posts(id, title, slug, author_id), author:profiles(id, username, display_name)`,
          { count: "exact" }
        ).order("created_at", { ascending: false });
        if (commentsFilter.value === "approved") {
          base = base.eq("approved", true);
        } else if (commentsFilter.value === "pending") {
          base = base.eq("approved", false);
        }
        const { data, error, count } = await base.range(from, to);
        if (error) {
          console.error("Fetch comments failed", error);
          pendingComments.value = [];
          pendingTotal.value = 0;
        } else {
          let list = (data || []).map((c) => ({
            id: c.id,
            content: c.content,
            created_at: c.created_at,
            approved: c.approved,
            post: c.post,
            author: c.author
          }));
          if (pendingSearchQuery.value.trim() !== "") {
            const q = pendingSearchQuery.value.toLowerCase();
            list = list.filter(
              (c) => {
                var _a, _b, _c;
                return (c.content || "").toLowerCase().includes(q) || (((_a = c.author) == null ? void 0 : _a.display_name) || ((_b = c.author) == null ? void 0 : _b.username) || "").toLowerCase().includes(q) || (((_c = c.post) == null ? void 0 : _c.title) || "").toLowerCase().includes(q);
              }
            );
          }
          pendingComments.value = list;
          if (typeof count === "number") pendingTotal.value = count;
          const lastPage = Math.max(1, Math.ceil(pendingTotal.value / pendingPageSize));
          if (pendingPage.value > lastPage) {
            pendingPage.value = lastPage;
            return fetchPendingComments();
          }
        }
        await updatePendingCount();
        const { count: allCount } = await supabase.from("comments").select("id", { count: "exact", head: true });
        commentsTotalCount.value = allCount || 0;
      } finally {
        loadingPending.value = false;
      }
    }
    function changePendingPage(page) {
      if (page < 1 || page > pendingTotalPages.value || page === pendingPage.value) return;
      pendingPage.value = page;
      fetchPendingComments();
    }
    async function approvePendingComment(id) {
      const { error } = await supabase.from("comments").update({ approved: true }).eq("id", id);
      if (error) return console.error(error);
      await fetchPendingComments();
    }
    async function unapproveComment(id) {
      const { error } = await supabase.from("comments").update({ approved: false }).eq("id", id);
      if (error) return console.error(error);
      await fetchPendingComments();
    }
    async function deletePendingComment(id) {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) return console.error(error);
      await fetchPendingComments();
    }
    watch(activeTab, async (val) => {
      try {
        localStorage.setItem(TAB_STORAGE_KEY, val);
      } catch (e) {
      }
      if (val === "posts" && !postsLoaded.value) {
        await Promise.all([
          fetchAuthors(),
          fetchCategories(),
          fetchPostLocalesInUse(),
          fetchDashboard()
        ]);
        postsLoaded.value = true;
      } else if (val === "comments" && !pendingLoaded.value && (role.value === "admin" || role.value === "author")) {
        await fetchPendingComments(true);
        pendingLoaded.value = true;
      } else if (val === "settings" && !brandingLoaded.value && role.value === "admin") {
        brandingLoaded.value = true;
        if (!brandingStore.brandingLoaded.value) await fetchBranding(true);
      } else if (val === "members" && !membersLoaded.value && role.value === "admin") {
        membersLoaded.value = true;
      } else if (val === "media" && !mediaLoaded.value && role.value === "admin") {
        mediaLoaded.value = true;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-4 py-10" }, _attrs))} data-v-0e0cd714>`);
      if (loading.value) {
        _push(`<div class="flex flex-col items-center justify-center min-h-[60vh]" data-v-0e0cd714>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:loading",
          class: "animate-spin text-4xl text-blue-500 mb-4"
        }, null, _parent));
        _push(`<p class="text-gray-700 dark:text-gray-300 text-lg" data-v-0e0cd714>${ssrInterpolate(unref(t)("dashboard.gathering"))}</p></div>`);
      } else {
        _push(`<!--[--><header class="flex items-start justify-between mb-6 flex-wrap gap-4" data-v-0e0cd714><div class="flex items-center gap-2 min-w-0" data-v-0e0cd714>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:monitor-dashboard",
          class: "text-blue-600 dark:text-blue-400 text-3xl"
        }, null, _parent));
        _push(`<h1 class="text-3xl font-bold text-gray-900 dark:text-white break-words" data-v-0e0cd714>${ssrInterpolate(unref(t)("dashboard.title"))}</h1></div><div class="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto" data-v-0e0cd714>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)("/dashboard/new-post"),
          class: "inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:plus",
                class: "text-base"
              }, null, _parent2, _scopeId));
              _push2(`<span data-v-0e0cd714${_scopeId}>${ssrInterpolate(unref(t)("posts.newPost"))}</span>`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:plus",
                  class: "text-base"
                }),
                createVNode("span", null, toDisplayString(unref(t)("posts.newPost")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></header>`);
        _push(ssrRenderComponent(unref(TabsRoot), {
          class: "flex flex-col w-full",
          modelValue: activeTab.value,
          "onUpdate:modelValue": ($event) => activeTab.value = $event,
          "default-value": "overview"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(TabsList), {
                class: "relative shrink-0 flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto",
                "aria-label": unref(t)("dashboard.title")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(TabsIndicator), { class: "absolute px-8 left-0 h-[2px] bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="bg-blue-500 w-full h-full" data-v-0e0cd714${_scopeId3}></div>`);
                        } else {
                          return [
                            createVNode("div", { class: "bg-blue-500 w-full h-full" })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(TabsTrigger), {
                      value: "overview",
                      class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Icon), {
                            icon: "mdi:view-dashboard",
                            class: "text-blue-500 dark:text-blue-400 text-lg"
                          }, null, _parent4, _scopeId3));
                          _push4(` ${ssrInterpolate(unref(t)("dashboard.overview"))}`);
                        } else {
                          return [
                            createVNode(unref(Icon), {
                              icon: "mdi:view-dashboard",
                              class: "text-blue-500 dark:text-blue-400 text-lg"
                            }),
                            createTextVNode(" " + toDisplayString(unref(t)("dashboard.overview")), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(TabsTrigger), {
                      value: "posts",
                      class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Icon), {
                            icon: "mdi:post-outline",
                            class: "text-green-500 dark:text-green-400 text-lg"
                          }, null, _parent4, _scopeId3));
                          _push4(` ${ssrInterpolate(unref(t)("posts.title"))}`);
                        } else {
                          return [
                            createVNode(unref(Icon), {
                              icon: "mdi:post-outline",
                              class: "text-green-500 dark:text-green-400 text-lg"
                            }),
                            createTextVNode(" " + toDisplayString(unref(t)("posts.title")), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (role.value === "admin" || role.value === "author") {
                      _push3(ssrRenderComponent(unref(TabsTrigger), {
                        value: "comments",
                        class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(Icon), {
                              icon: "mdi:comment-multiple-outline",
                              class: "text-yellow-500 dark:text-yellow-400 text-lg"
                            }, null, _parent4, _scopeId3));
                            _push4(`<span data-v-0e0cd714${_scopeId3}>${ssrInterpolate(unref(t)("comments.title"))}</span>`);
                            if (stats.value.pendingComments > 0) {
                              _push4(`<span class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-2 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200" data-v-0e0cd714${_scopeId3}>${ssrInterpolate(stats.value.pendingComments)}</span>`);
                            } else {
                              _push4(`<!---->`);
                            }
                          } else {
                            return [
                              createVNode(unref(Icon), {
                                icon: "mdi:comment-multiple-outline",
                                class: "text-yellow-500 dark:text-yellow-400 text-lg"
                              }),
                              createVNode("span", null, toDisplayString(unref(t)("comments.title")), 1),
                              stats.value.pendingComments > 0 ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-2 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200"
                              }, toDisplayString(stats.value.pendingComments), 1)) : createCommentVNode("", true)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    if (role.value === "admin") {
                      _push3(ssrRenderComponent(unref(TabsTrigger), {
                        value: "members",
                        class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(Icon), {
                              icon: "mdi:account-group-outline",
                              class: "text-purple-500 dark:text-purple-400 text-lg"
                            }, null, _parent4, _scopeId3));
                            _push4(` ${ssrInterpolate(unref(t)("members.title"))}`);
                          } else {
                            return [
                              createVNode(unref(Icon), {
                                icon: "mdi:account-group-outline",
                                class: "text-purple-500 dark:text-purple-400 text-lg"
                              }),
                              createTextVNode(" " + toDisplayString(unref(t)("members.title")), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    if (role.value === "admin") {
                      _push3(ssrRenderComponent(unref(TabsTrigger), {
                        value: "media",
                        class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(Icon), {
                              icon: "mdi:image-multiple-outline",
                              class: "text-pink-500 dark:text-pink-400 text-lg"
                            }, null, _parent4, _scopeId3));
                            _push4(` ${ssrInterpolate(unref(t)("dashboard.media"))}`);
                          } else {
                            return [
                              createVNode(unref(Icon), {
                                icon: "mdi:image-multiple-outline",
                                class: "text-pink-500 dark:text-pink-400 text-lg"
                              }),
                              createTextVNode(" " + toDisplayString(unref(t)("dashboard.media")), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    if (role.value === "admin") {
                      _push3(ssrRenderComponent(unref(TabsTrigger), {
                        value: "settings",
                        class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(Icon), {
                              icon: "mdi:cog-outline",
                              class: "text-gray-500 dark:text-gray-300 text-lg"
                            }, null, _parent4, _scopeId3));
                            _push4(` ${ssrInterpolate(unref(t)("dashboard.settings"))}`);
                          } else {
                            return [
                              createVNode(unref(Icon), {
                                icon: "mdi:cog-outline",
                                class: "text-gray-500 dark:text-gray-300 text-lg"
                              }),
                              createTextVNode(" " + toDisplayString(unref(t)("dashboard.settings")), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      createVNode(unref(TabsIndicator), { class: "absolute px-8 left-0 h-[2px] bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300" }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "bg-blue-500 w-full h-full" })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(TabsTrigger), {
                        value: "overview",
                        class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "mdi:view-dashboard",
                            class: "text-blue-500 dark:text-blue-400 text-lg"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("dashboard.overview")), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(TabsTrigger), {
                        value: "posts",
                        class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "mdi:post-outline",
                            class: "text-green-500 dark:text-green-400 text-lg"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("posts.title")), 1)
                        ]),
                        _: 1
                      }),
                      role.value === "admin" || role.value === "author" ? (openBlock(), createBlock(unref(TabsTrigger), {
                        key: 0,
                        value: "comments",
                        class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "mdi:comment-multiple-outline",
                            class: "text-yellow-500 dark:text-yellow-400 text-lg"
                          }),
                          createVNode("span", null, toDisplayString(unref(t)("comments.title")), 1),
                          stats.value.pendingComments > 0 ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-2 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200"
                          }, toDisplayString(stats.value.pendingComments), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      role.value === "admin" ? (openBlock(), createBlock(unref(TabsTrigger), {
                        key: 1,
                        value: "members",
                        class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "mdi:account-group-outline",
                            class: "text-purple-500 dark:text-purple-400 text-lg"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("members.title")), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      role.value === "admin" ? (openBlock(), createBlock(unref(TabsTrigger), {
                        key: 2,
                        value: "media",
                        class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "mdi:image-multiple-outline",
                            class: "text-pink-500 dark:text-pink-400 text-lg"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("dashboard.media")), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      role.value === "admin" ? (openBlock(), createBlock(unref(TabsTrigger), {
                        key: 3,
                        value: "settings",
                        class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "mdi:cog-outline",
                            class: "text-gray-500 dark:text-gray-300 text-lg"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("dashboard.settings")), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(TabsContent), {
                value: "overview",
                class: "space-y-8"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$f, { stats: stats.value }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_sfc_main$f, { stats: stats.value }, null, 8, ["stats"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(TabsContent), {
                value: "posts",
                class: "space-y-6"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex flex-col sm:flex-row sm:items-center gap-3 justify-between" data-v-0e0cd714${_scopeId2}><div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto" data-v-0e0cd714${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$b, { onChanged: fetchCategories }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$a, null, null, _parent3, _scopeId2));
                    _push3(`</div><div class="w-full sm:w-80" data-v-0e0cd714${_scopeId2}><div class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 focus-within:ring-2 focus-within:ring-blue-500 transition" data-v-0e0cd714${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: "mdi:magnify",
                      class: "ml-3 text-gray-400 text-base"
                    }, null, _parent3, _scopeId2));
                    _push3(`<input${ssrRenderAttr("value", searchQuery.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("posts.searchPlaceholder"))} class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"${ssrRenderAttr("aria-label", unref(t)("posts.searchPlaceholder"))} data-v-0e0cd714${_scopeId2}>`);
                    if (searchQuery.value) {
                      _push3(`<button type="button" class="mr-1 inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"${ssrRenderAttr("aria-label", unref(t)("posts.clearSearch"))} data-v-0e0cd714${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Icon), {
                        icon: "mdi:close",
                        class: "text-base"
                      }, null, _parent3, _scopeId2));
                      _push3(`</button>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div></div></div>`);
                    _push3(ssrRenderComponent(_sfc_main$e, {
                      posts: posts.value,
                      selected: selected.value,
                      "onUpdate:selected": ($event) => selected.value = $event,
                      "current-user": currentUser.value,
                      role: role.value,
                      onToggleAll: toggleAll,
                      onDelete: (id) => askConfirmation(unref(t)("posts.deleteConfirm"), () => deletePost(id)),
                      onEdit: editPost
                    }, {
                      filters: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$d, {
                            "selected-length": selected.value.length,
                            "has-active-filters": hasActivePostFilters.value,
                            onBulkDelete: ($event) => askConfirmation(unref(t)("posts.deleteSelectedConfirm"), bulkDelete),
                            onClearFilters: clearAllPostFilters
                          }, {
                            status: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(SelectRoot), {
                                  modelValue: statusFilter.value,
                                  "onUpdate:modelValue": [($event) => statusFilter.value = $event, applyFilters]
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(SelectTrigger), {
                                        class: filterTriggerClass,
                                        "aria-label": unref(t)("posts.allStatuses")
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<span class="flex items-center gap-1.5 min-w-0 truncate" data-v-0e0cd714${_scopeId6}>`);
                                            _push7(ssrRenderComponent(unref(Icon), {
                                              icon: "mdi:circle-slice-8",
                                              class: "text-sm opacity-60 shrink-0"
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(SelectValue), {
                                              placeholder: unref(t)("posts.allStatuses")
                                            }, null, _parent7, _scopeId6));
                                            _push7(`</span>`);
                                            _push7(ssrRenderComponent(unref(Icon), {
                                              icon: "radix-icons:chevron-down",
                                              class: "w-4 h-4 opacity-70 shrink-0"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                                createVNode(unref(Icon), {
                                                  icon: "mdi:circle-slice-8",
                                                  class: "text-sm opacity-60 shrink-0"
                                                }),
                                                createVNode(unref(SelectValue), {
                                                  placeholder: unref(t)("posts.allStatuses")
                                                }, null, 8, ["placeholder"])
                                              ]),
                                              createVNode(unref(Icon), {
                                                icon: "radix-icons:chevron-down",
                                                class: "w-4 h-4 opacity-70 shrink-0"
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(unref(SelectPortal), null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(SelectContent), {
                                              class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                              "side-offset": 5
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-up" }, null, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(unref(SelectViewport), { class: "p-1" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(unref(SelectGroup), null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(unref(SelectItem), {
                                                                value: "all",
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent12, _scopeId11));
                                                                        } else {
                                                                          return [
                                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(ssrRenderComponent(unref(SelectItemText), null, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`${ssrInterpolate(unref(t)("posts.allStatuses"))}`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode(toDisplayString(unref(t)("posts.allStatuses")), 1)
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(unref(SelectItemText), null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(unref(t)("posts.allStatuses")), 1)
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 1
                                                              }, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }, null, _parent10, _scopeId9));
                                                              _push10(`<!--[-->`);
                                                              ssrRenderList(status.value, (s) => {
                                                                _push10(ssrRenderComponent(unref(SelectItem), {
                                                                  key: s,
                                                                  value: s,
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent12, _scopeId11));
                                                                          } else {
                                                                            return [
                                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(unref(SelectItemText), null, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(unref(t)(`posts.status.${s}`))}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(unref(t)(`posts.status.${s}`)), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                    } else {
                                                                      return [
                                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(unref(SelectItemText), null, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(unref(t)(`posts.status.${s}`)), 1)
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024)
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 2
                                                                }, _parent10, _scopeId9));
                                                              });
                                                              _push10(`<!--]-->`);
                                                            } else {
                                                              return [
                                                                createVNode(unref(SelectItem), {
                                                                  value: "all",
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(unref(SelectItemText), null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(unref(t)("posts.allStatuses")), 1)
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                                (openBlock(true), createBlock(Fragment, null, renderList(status.value, (s) => {
                                                                  return openBlock(), createBlock(unref(SelectItem), {
                                                                    key: s,
                                                                    value: s,
                                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(unref(SelectItemText), null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(unref(t)(`posts.status.${s}`)), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["value"]);
                                                                }), 128))
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(unref(SelectGroup), null, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItem), {
                                                                value: "all",
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(unref(SelectItemText), null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(unref(t)("posts.allStatuses")), 1)
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                              (openBlock(true), createBlock(Fragment, null, renderList(status.value, (s) => {
                                                                return openBlock(), createBlock(unref(SelectItem), {
                                                                  key: s,
                                                                  value: s,
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(unref(SelectItemText), null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(unref(t)(`posts.status.${s}`)), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["value"]);
                                                              }), 128))
                                                            ]),
                                                            _: 1
                                                          })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-down" }, null, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectGroup), null, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItem), {
                                                              value: "all",
                                                              class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectItemText), null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(unref(t)("posts.allStatuses")), 1)
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                            (openBlock(true), createBlock(Fragment, null, renderList(status.value, (s) => {
                                                              return openBlock(), createBlock(unref(SelectItem), {
                                                                key: s,
                                                                value: s,
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(unref(SelectItemText), null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(unref(t)(`posts.status.${s}`)), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["value"]);
                                                            }), 128))
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(SelectContent), {
                                                class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                                "side-offset": 5
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectGroup), null, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItem), {
                                                            value: "all",
                                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectItemText), null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(unref(t)("posts.allStatuses")), 1)
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                          (openBlock(true), createBlock(Fragment, null, renderList(status.value, (s) => {
                                                            return openBlock(), createBlock(unref(SelectItem), {
                                                              key: s,
                                                              value: s,
                                                              class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectItemText), null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(unref(t)(`posts.status.${s}`)), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["value"]);
                                                          }), 128))
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(SelectTrigger), {
                                          class: filterTriggerClass,
                                          "aria-label": unref(t)("posts.allStatuses")
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                              createVNode(unref(Icon), {
                                                icon: "mdi:circle-slice-8",
                                                class: "text-sm opacity-60 shrink-0"
                                              }),
                                              createVNode(unref(SelectValue), {
                                                placeholder: unref(t)("posts.allStatuses")
                                              }, null, 8, ["placeholder"])
                                            ]),
                                            createVNode(unref(Icon), {
                                              icon: "radix-icons:chevron-down",
                                              class: "w-4 h-4 opacity-70 shrink-0"
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["aria-label"]),
                                        createVNode(unref(SelectPortal), null, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectContent), {
                                              class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                              "side-offset": 5
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectGroup), null, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItem), {
                                                          value: "all",
                                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectItemText), null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(unref(t)("posts.allStatuses")), 1)
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                        (openBlock(true), createBlock(Fragment, null, renderList(status.value, (s) => {
                                                          return openBlock(), createBlock(unref(SelectItem), {
                                                            key: s,
                                                            value: s,
                                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectItemText), null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(unref(t)(`posts.status.${s}`)), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["value"]);
                                                        }), 128))
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(SelectRoot), {
                                    modelValue: statusFilter.value,
                                    "onUpdate:modelValue": [($event) => statusFilter.value = $event, applyFilters]
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectTrigger), {
                                        class: filterTriggerClass,
                                        "aria-label": unref(t)("posts.allStatuses")
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                            createVNode(unref(Icon), {
                                              icon: "mdi:circle-slice-8",
                                              class: "text-sm opacity-60 shrink-0"
                                            }),
                                            createVNode(unref(SelectValue), {
                                              placeholder: unref(t)("posts.allStatuses")
                                            }, null, 8, ["placeholder"])
                                          ]),
                                          createVNode(unref(Icon), {
                                            icon: "radix-icons:chevron-down",
                                            class: "w-4 h-4 opacity-70 shrink-0"
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["aria-label"]),
                                      createVNode(unref(SelectPortal), null, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectContent), {
                                            class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                            "side-offset": 5
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectGroup), null, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItem), {
                                                        value: "all",
                                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectItemText), null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(unref(t)("posts.allStatuses")), 1)
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                      (openBlock(true), createBlock(Fragment, null, renderList(status.value, (s) => {
                                                        return openBlock(), createBlock(unref(SelectItem), {
                                                          key: s,
                                                          value: s,
                                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectItemText), null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(unref(t)(`posts.status.${s}`)), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["value"]);
                                                      }), 128))
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue"])
                                ];
                              }
                            }),
                            locale: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(SelectRoot), {
                                  modelValue: localeFilter.value,
                                  "onUpdate:modelValue": [($event) => localeFilter.value = $event, applyFilters]
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(SelectTrigger), {
                                        class: filterTriggerClass,
                                        "aria-label": unref(t)("posts.allLocales")
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<span class="flex items-center gap-1.5 min-w-0 truncate" data-v-0e0cd714${_scopeId6}>`);
                                            _push7(ssrRenderComponent(unref(Icon), {
                                              icon: "mdi:translate",
                                              class: "text-sm opacity-60 shrink-0"
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(SelectValue), {
                                              placeholder: unref(t)("posts.allLocales")
                                            }, null, _parent7, _scopeId6));
                                            _push7(`</span>`);
                                            _push7(ssrRenderComponent(unref(Icon), {
                                              icon: "radix-icons:chevron-down",
                                              class: "w-4 h-4 opacity-70 shrink-0"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                                createVNode(unref(Icon), {
                                                  icon: "mdi:translate",
                                                  class: "text-sm opacity-60 shrink-0"
                                                }),
                                                createVNode(unref(SelectValue), {
                                                  placeholder: unref(t)("posts.allLocales")
                                                }, null, 8, ["placeholder"])
                                              ]),
                                              createVNode(unref(Icon), {
                                                icon: "radix-icons:chevron-down",
                                                class: "w-4 h-4 opacity-70 shrink-0"
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(unref(SelectPortal), null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(SelectContent), {
                                              class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                              "side-offset": 5
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(unref(SelectViewport), { class: "p-1" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(unref(SelectGroup), null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(unref(SelectItem), {
                                                                value: "all",
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent12, _scopeId11));
                                                                        } else {
                                                                          return [
                                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(ssrRenderComponent(unref(SelectItemText), null, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`${ssrInterpolate(unref(t)("posts.allLocales"))}`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode(toDisplayString(unref(t)("posts.allLocales")), 1)
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(unref(SelectItemText), null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(unref(t)("posts.allLocales")), 1)
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 1
                                                              }, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }, null, _parent10, _scopeId9));
                                                              _push10(`<!--[-->`);
                                                              ssrRenderList(filterLocales.value, (loc) => {
                                                                _push10(ssrRenderComponent(unref(SelectItem), {
                                                                  key: loc.code,
                                                                  value: loc.code,
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent12, _scopeId11));
                                                                          } else {
                                                                            return [
                                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(unref(SelectItemText), null, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(loc.name)}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(loc.name), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                    } else {
                                                                      return [
                                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(unref(SelectItemText), null, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(loc.name), 1)
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024)
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 2
                                                                }, _parent10, _scopeId9));
                                                              });
                                                              _push10(`<!--]-->`);
                                                            } else {
                                                              return [
                                                                createVNode(unref(SelectItem), {
                                                                  value: "all",
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(unref(SelectItemText), null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(unref(t)("posts.allLocales")), 1)
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                                (openBlock(true), createBlock(Fragment, null, renderList(filterLocales.value, (loc) => {
                                                                  return openBlock(), createBlock(unref(SelectItem), {
                                                                    key: loc.code,
                                                                    value: loc.code,
                                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(unref(SelectItemText), null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(loc.name), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["value"]);
                                                                }), 128))
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(unref(SelectGroup), null, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItem), {
                                                                value: "all",
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(unref(SelectItemText), null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(unref(t)("posts.allLocales")), 1)
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                              (openBlock(true), createBlock(Fragment, null, renderList(filterLocales.value, (loc) => {
                                                                return openBlock(), createBlock(unref(SelectItem), {
                                                                  key: loc.code,
                                                                  value: loc.code,
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(unref(SelectItemText), null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(loc.name), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["value"]);
                                                              }), 128))
                                                            ]),
                                                            _: 1
                                                          })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectGroup), null, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItem), {
                                                              value: "all",
                                                              class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectItemText), null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(unref(t)("posts.allLocales")), 1)
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                            (openBlock(true), createBlock(Fragment, null, renderList(filterLocales.value, (loc) => {
                                                              return openBlock(), createBlock(unref(SelectItem), {
                                                                key: loc.code,
                                                                value: loc.code,
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(unref(SelectItemText), null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(loc.name), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["value"]);
                                                            }), 128))
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(SelectContent), {
                                                class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                                "side-offset": 5
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectGroup), null, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItem), {
                                                            value: "all",
                                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectItemText), null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(unref(t)("posts.allLocales")), 1)
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                          (openBlock(true), createBlock(Fragment, null, renderList(filterLocales.value, (loc) => {
                                                            return openBlock(), createBlock(unref(SelectItem), {
                                                              key: loc.code,
                                                              value: loc.code,
                                                              class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectItemText), null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(loc.name), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["value"]);
                                                          }), 128))
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(SelectTrigger), {
                                          class: filterTriggerClass,
                                          "aria-label": unref(t)("posts.allLocales")
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                              createVNode(unref(Icon), {
                                                icon: "mdi:translate",
                                                class: "text-sm opacity-60 shrink-0"
                                              }),
                                              createVNode(unref(SelectValue), {
                                                placeholder: unref(t)("posts.allLocales")
                                              }, null, 8, ["placeholder"])
                                            ]),
                                            createVNode(unref(Icon), {
                                              icon: "radix-icons:chevron-down",
                                              class: "w-4 h-4 opacity-70 shrink-0"
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["aria-label"]),
                                        createVNode(unref(SelectPortal), null, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectContent), {
                                              class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                              "side-offset": 5
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectGroup), null, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItem), {
                                                          value: "all",
                                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectItemText), null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(unref(t)("posts.allLocales")), 1)
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                        (openBlock(true), createBlock(Fragment, null, renderList(filterLocales.value, (loc) => {
                                                          return openBlock(), createBlock(unref(SelectItem), {
                                                            key: loc.code,
                                                            value: loc.code,
                                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectItemText), null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(loc.name), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["value"]);
                                                        }), 128))
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(SelectRoot), {
                                    modelValue: localeFilter.value,
                                    "onUpdate:modelValue": [($event) => localeFilter.value = $event, applyFilters]
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectTrigger), {
                                        class: filterTriggerClass,
                                        "aria-label": unref(t)("posts.allLocales")
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                            createVNode(unref(Icon), {
                                              icon: "mdi:translate",
                                              class: "text-sm opacity-60 shrink-0"
                                            }),
                                            createVNode(unref(SelectValue), {
                                              placeholder: unref(t)("posts.allLocales")
                                            }, null, 8, ["placeholder"])
                                          ]),
                                          createVNode(unref(Icon), {
                                            icon: "radix-icons:chevron-down",
                                            class: "w-4 h-4 opacity-70 shrink-0"
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["aria-label"]),
                                      createVNode(unref(SelectPortal), null, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectContent), {
                                            class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                            "side-offset": 5
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectGroup), null, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItem), {
                                                        value: "all",
                                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectItemText), null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(unref(t)("posts.allLocales")), 1)
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                      (openBlock(true), createBlock(Fragment, null, renderList(filterLocales.value, (loc) => {
                                                        return openBlock(), createBlock(unref(SelectItem), {
                                                          key: loc.code,
                                                          value: loc.code,
                                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectItemText), null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(loc.name), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["value"]);
                                                      }), 128))
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue"])
                                ];
                              }
                            }),
                            category: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(SelectRoot), {
                                  modelValue: categoryFilter.value,
                                  "onUpdate:modelValue": [($event) => categoryFilter.value = $event, applyFilters]
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(SelectTrigger), {
                                        class: filterTriggerClass,
                                        "aria-label": unref(t)("posts.allCategories")
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<span class="flex items-center gap-1.5 min-w-0 truncate" data-v-0e0cd714${_scopeId6}>`);
                                            _push7(ssrRenderComponent(unref(Icon), {
                                              icon: "mdi:folder-outline",
                                              class: "text-sm opacity-60 shrink-0"
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(SelectValue), {
                                              placeholder: unref(t)("posts.allCategories")
                                            }, null, _parent7, _scopeId6));
                                            _push7(`</span>`);
                                            _push7(ssrRenderComponent(unref(Icon), {
                                              icon: "radix-icons:chevron-down",
                                              class: "w-4 h-4 opacity-70 shrink-0"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                                createVNode(unref(Icon), {
                                                  icon: "mdi:folder-outline",
                                                  class: "text-sm opacity-60 shrink-0"
                                                }),
                                                createVNode(unref(SelectValue), {
                                                  placeholder: unref(t)("posts.allCategories")
                                                }, null, 8, ["placeholder"])
                                              ]),
                                              createVNode(unref(Icon), {
                                                icon: "radix-icons:chevron-down",
                                                class: "w-4 h-4 opacity-70 shrink-0"
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(unref(SelectPortal), null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(SelectContent), {
                                              class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                              "side-offset": 5
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-up" }, null, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(unref(SelectViewport), { class: "p-1" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(unref(SelectGroup), null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(unref(SelectItem), {
                                                                value: "all",
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent12, _scopeId11));
                                                                        } else {
                                                                          return [
                                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(ssrRenderComponent(unref(SelectItemText), null, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`${ssrInterpolate(unref(t)("posts.allCategories"))}`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode(toDisplayString(unref(t)("posts.allCategories")), 1)
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(unref(SelectItemText), null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(unref(t)("posts.allCategories")), 1)
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 1
                                                              }, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }, null, _parent10, _scopeId9));
                                                              _push10(`<!--[-->`);
                                                              ssrRenderList(categories.value, (c) => {
                                                                _push10(ssrRenderComponent(unref(SelectItem), {
                                                                  key: c.id,
                                                                  value: c.id,
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent12, _scopeId11));
                                                                          } else {
                                                                            return [
                                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(unref(SelectItemText), null, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(c.name)}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(c.name), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                    } else {
                                                                      return [
                                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(unref(SelectItemText), null, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(c.name), 1)
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024)
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 2
                                                                }, _parent10, _scopeId9));
                                                              });
                                                              _push10(`<!--]-->`);
                                                            } else {
                                                              return [
                                                                createVNode(unref(SelectItem), {
                                                                  value: "all",
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(unref(SelectItemText), null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(unref(t)("posts.allCategories")), 1)
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                                (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
                                                                  return openBlock(), createBlock(unref(SelectItem), {
                                                                    key: c.id,
                                                                    value: c.id,
                                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(unref(SelectItemText), null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(c.name), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["value"]);
                                                                }), 128))
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(unref(SelectGroup), null, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItem), {
                                                                value: "all",
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(unref(SelectItemText), null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(unref(t)("posts.allCategories")), 1)
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                              (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
                                                                return openBlock(), createBlock(unref(SelectItem), {
                                                                  key: c.id,
                                                                  value: c.id,
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(unref(SelectItemText), null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(c.name), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["value"]);
                                                              }), 128))
                                                            ]),
                                                            _: 1
                                                          })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-down" }, null, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectGroup), null, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItem), {
                                                              value: "all",
                                                              class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectItemText), null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(unref(t)("posts.allCategories")), 1)
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                            (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
                                                              return openBlock(), createBlock(unref(SelectItem), {
                                                                key: c.id,
                                                                value: c.id,
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(unref(SelectItemText), null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(c.name), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["value"]);
                                                            }), 128))
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(SelectContent), {
                                                class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                                "side-offset": 5
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectGroup), null, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItem), {
                                                            value: "all",
                                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectItemText), null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(unref(t)("posts.allCategories")), 1)
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                          (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
                                                            return openBlock(), createBlock(unref(SelectItem), {
                                                              key: c.id,
                                                              value: c.id,
                                                              class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectItemText), null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(c.name), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["value"]);
                                                          }), 128))
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(SelectTrigger), {
                                          class: filterTriggerClass,
                                          "aria-label": unref(t)("posts.allCategories")
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                              createVNode(unref(Icon), {
                                                icon: "mdi:folder-outline",
                                                class: "text-sm opacity-60 shrink-0"
                                              }),
                                              createVNode(unref(SelectValue), {
                                                placeholder: unref(t)("posts.allCategories")
                                              }, null, 8, ["placeholder"])
                                            ]),
                                            createVNode(unref(Icon), {
                                              icon: "radix-icons:chevron-down",
                                              class: "w-4 h-4 opacity-70 shrink-0"
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["aria-label"]),
                                        createVNode(unref(SelectPortal), null, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectContent), {
                                              class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                              "side-offset": 5
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectGroup), null, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItem), {
                                                          value: "all",
                                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectItemText), null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(unref(t)("posts.allCategories")), 1)
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                        (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
                                                          return openBlock(), createBlock(unref(SelectItem), {
                                                            key: c.id,
                                                            value: c.id,
                                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectItemText), null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(c.name), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["value"]);
                                                        }), 128))
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(SelectRoot), {
                                    modelValue: categoryFilter.value,
                                    "onUpdate:modelValue": [($event) => categoryFilter.value = $event, applyFilters]
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectTrigger), {
                                        class: filterTriggerClass,
                                        "aria-label": unref(t)("posts.allCategories")
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                            createVNode(unref(Icon), {
                                              icon: "mdi:folder-outline",
                                              class: "text-sm opacity-60 shrink-0"
                                            }),
                                            createVNode(unref(SelectValue), {
                                              placeholder: unref(t)("posts.allCategories")
                                            }, null, 8, ["placeholder"])
                                          ]),
                                          createVNode(unref(Icon), {
                                            icon: "radix-icons:chevron-down",
                                            class: "w-4 h-4 opacity-70 shrink-0"
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["aria-label"]),
                                      createVNode(unref(SelectPortal), null, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectContent), {
                                            class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                            "side-offset": 5
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectGroup), null, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItem), {
                                                        value: "all",
                                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectItemText), null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(unref(t)("posts.allCategories")), 1)
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                      (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
                                                        return openBlock(), createBlock(unref(SelectItem), {
                                                          key: c.id,
                                                          value: c.id,
                                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectItemText), null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(c.name), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["value"]);
                                                      }), 128))
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue"])
                                ];
                              }
                            }),
                            author: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(SelectRoot), {
                                  modelValue: authorFilter.value,
                                  "onUpdate:modelValue": [($event) => authorFilter.value = $event, applyFilters]
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(SelectTrigger), {
                                        class: filterTriggerClass,
                                        "aria-label": unref(t)("posts.allAuthors")
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<span class="flex items-center gap-1.5 min-w-0 truncate" data-v-0e0cd714${_scopeId6}>`);
                                            _push7(ssrRenderComponent(unref(Icon), {
                                              icon: "mdi:account-outline",
                                              class: "text-sm opacity-60 shrink-0"
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(SelectValue), {
                                              placeholder: unref(t)("posts.allAuthors")
                                            }, null, _parent7, _scopeId6));
                                            _push7(`</span>`);
                                            _push7(ssrRenderComponent(unref(Icon), {
                                              icon: "radix-icons:chevron-down",
                                              class: "w-4 h-4 opacity-70 shrink-0"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                                createVNode(unref(Icon), {
                                                  icon: "mdi:account-outline",
                                                  class: "text-sm opacity-60 shrink-0"
                                                }),
                                                createVNode(unref(SelectValue), {
                                                  placeholder: unref(t)("posts.allAuthors")
                                                }, null, 8, ["placeholder"])
                                              ]),
                                              createVNode(unref(Icon), {
                                                icon: "radix-icons:chevron-down",
                                                class: "w-4 h-4 opacity-70 shrink-0"
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(unref(SelectPortal), null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(SelectContent), {
                                              class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                              "side-offset": 5
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-up" }, null, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(unref(SelectViewport), { class: "p-1" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(unref(SelectGroup), null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(unref(SelectItem), {
                                                                value: "all",
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent12, _scopeId11));
                                                                        } else {
                                                                          return [
                                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(ssrRenderComponent(unref(SelectItemText), null, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`${ssrInterpolate(unref(t)("posts.allAuthors"))}`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode(toDisplayString(unref(t)("posts.allAuthors")), 1)
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(unref(SelectItemText), null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(unref(t)("posts.allAuthors")), 1)
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 1
                                                              }, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }, null, _parent10, _scopeId9));
                                                              _push10(`<!--[-->`);
                                                              ssrRenderList(uniqueAuthors.value, (a) => {
                                                                _push10(ssrRenderComponent(unref(SelectItem), {
                                                                  key: a.id,
                                                                  value: a.id,
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(ssrRenderComponent(unref(Icon), { icon: "radix-icons:check" }, null, _parent12, _scopeId11));
                                                                          } else {
                                                                            return [
                                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(unref(SelectItemText), null, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(a.display_name || a.username)}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(a.display_name || a.username), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                    } else {
                                                                      return [
                                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(unref(SelectItemText), null, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(a.display_name || a.username), 1)
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024)
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 2
                                                                }, _parent10, _scopeId9));
                                                              });
                                                              _push10(`<!--]-->`);
                                                            } else {
                                                              return [
                                                                createVNode(unref(SelectItem), {
                                                                  value: "all",
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(unref(SelectItemText), null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(unref(t)("posts.allAuthors")), 1)
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                                (openBlock(true), createBlock(Fragment, null, renderList(uniqueAuthors.value, (a) => {
                                                                  return openBlock(), createBlock(unref(SelectItem), {
                                                                    key: a.id,
                                                                    value: a.id,
                                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(unref(SelectItemText), null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(a.display_name || a.username), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["value"]);
                                                                }), 128))
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(unref(SelectGroup), null, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItem), {
                                                                value: "all",
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(unref(SelectItemText), null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(unref(t)("posts.allAuthors")), 1)
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                              (openBlock(true), createBlock(Fragment, null, renderList(uniqueAuthors.value, (a) => {
                                                                return openBlock(), createBlock(unref(SelectItem), {
                                                                  key: a.id,
                                                                  value: a.id,
                                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(unref(SelectItemText), null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(a.display_name || a.username), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["value"]);
                                                              }), 128))
                                                            ]),
                                                            _: 1
                                                          })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(unref(Icon), { icon: "radix-icons:chevron-down" }, null, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectGroup), null, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItem), {
                                                              value: "all",
                                                              class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectItemText), null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(unref(t)("posts.allAuthors")), 1)
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                            (openBlock(true), createBlock(Fragment, null, renderList(uniqueAuthors.value, (a) => {
                                                              return openBlock(), createBlock(unref(SelectItem), {
                                                                key: a.id,
                                                                value: a.id,
                                                                class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(unref(SelectItemText), null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(a.display_name || a.username), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["value"]);
                                                            }), 128))
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(SelectContent), {
                                                class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                                "side-offset": 5
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectGroup), null, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItem), {
                                                            value: "all",
                                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectItemText), null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(unref(t)("posts.allAuthors")), 1)
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                          (openBlock(true), createBlock(Fragment, null, renderList(uniqueAuthors.value, (a) => {
                                                            return openBlock(), createBlock(unref(SelectItem), {
                                                              key: a.id,
                                                              value: a.id,
                                                              class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(unref(SelectItemText), null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(a.display_name || a.username), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["value"]);
                                                          }), 128))
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(SelectTrigger), {
                                          class: filterTriggerClass,
                                          "aria-label": unref(t)("posts.allAuthors")
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                              createVNode(unref(Icon), {
                                                icon: "mdi:account-outline",
                                                class: "text-sm opacity-60 shrink-0"
                                              }),
                                              createVNode(unref(SelectValue), {
                                                placeholder: unref(t)("posts.allAuthors")
                                              }, null, 8, ["placeholder"])
                                            ]),
                                            createVNode(unref(Icon), {
                                              icon: "radix-icons:chevron-down",
                                              class: "w-4 h-4 opacity-70 shrink-0"
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["aria-label"]),
                                        createVNode(unref(SelectPortal), null, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectContent), {
                                              class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                              "side-offset": 5
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectGroup), null, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItem), {
                                                          value: "all",
                                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectItemText), null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(unref(t)("posts.allAuthors")), 1)
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                        (openBlock(true), createBlock(Fragment, null, renderList(uniqueAuthors.value, (a) => {
                                                          return openBlock(), createBlock(unref(SelectItem), {
                                                            key: a.id,
                                                            value: a.id,
                                                            class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(unref(SelectItemText), null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(a.display_name || a.username), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["value"]);
                                                        }), 128))
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(SelectRoot), {
                                    modelValue: authorFilter.value,
                                    "onUpdate:modelValue": [($event) => authorFilter.value = $event, applyFilters]
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectTrigger), {
                                        class: filterTriggerClass,
                                        "aria-label": unref(t)("posts.allAuthors")
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                            createVNode(unref(Icon), {
                                              icon: "mdi:account-outline",
                                              class: "text-sm opacity-60 shrink-0"
                                            }),
                                            createVNode(unref(SelectValue), {
                                              placeholder: unref(t)("posts.allAuthors")
                                            }, null, 8, ["placeholder"])
                                          ]),
                                          createVNode(unref(Icon), {
                                            icon: "radix-icons:chevron-down",
                                            class: "w-4 h-4 opacity-70 shrink-0"
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["aria-label"]),
                                      createVNode(unref(SelectPortal), null, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectContent), {
                                            class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                            "side-offset": 5
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectViewport), { class: "p-1" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectGroup), null, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItem), {
                                                        value: "all",
                                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectItemText), null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(unref(t)("posts.allAuthors")), 1)
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                      (openBlock(true), createBlock(Fragment, null, renderList(uniqueAuthors.value, (a) => {
                                                        return openBlock(), createBlock(unref(SelectItem), {
                                                          key: a.id,
                                                          value: a.id,
                                                          class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(unref(SelectItemText), null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(a.display_name || a.username), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["value"]);
                                                      }), 128))
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue"])
                                ];
                              }
                            }),
                            date: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(DateRangePickerRoot), {
                                  key: dateRangePickerKey.value,
                                  modelValue: dateRange.value,
                                  "onUpdate:modelValue": [($event) => dateRange.value = $event, onDateRangeChange],
                                  locale: "en-GB"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(DateRangePickerField), { class: "h-9 w-full items-center select-none bg-white dark:bg-gray-900/40 rounded-md text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 px-2.5 text-sm gap-0.5 flex focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none" }, {
                                        default: withCtx(({ segments }, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(Icon), {
                                              icon: "mdi:calendar-range",
                                              class: "text-base text-gray-400 shrink-0 mr-1"
                                            }, null, _parent7, _scopeId6));
                                            _push7(`<!--[-->`);
                                            ssrRenderList(segments.start, (item) => {
                                              _push7(`<!--[-->`);
                                              if (item.part === "literal") {
                                                _push7(ssrRenderComponent(unref(DateRangePickerInput), {
                                                  part: item.part,
                                                  type: "start",
                                                  class: "px-0 text-gray-400"
                                                }, {
                                                  default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`${ssrInterpolate(item.value)}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(item.value), 1)
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              } else {
                                                _push7(ssrRenderComponent(unref(DateRangePickerInput), {
                                                  part: item.part,
                                                  type: "start",
                                                  class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                                }, {
                                                  default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`${ssrInterpolate(item.value)}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(item.value), 1)
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              }
                                              _push7(`<!--]-->`);
                                            });
                                            _push7(`<!--]--><span class="mx-1 text-gray-400" data-v-0e0cd714${_scopeId6}>\u2013</span><!--[-->`);
                                            ssrRenderList(segments.end, (item) => {
                                              _push7(`<!--[-->`);
                                              if (item.part === "literal") {
                                                _push7(ssrRenderComponent(unref(DateRangePickerInput), {
                                                  part: item.part,
                                                  type: "end",
                                                  class: "px-0 text-gray-400"
                                                }, {
                                                  default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`${ssrInterpolate(item.value)}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(item.value), 1)
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              } else {
                                                _push7(ssrRenderComponent(unref(DateRangePickerInput), {
                                                  part: item.part,
                                                  type: "end",
                                                  class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                                }, {
                                                  default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`${ssrInterpolate(item.value)}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(item.value), 1)
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              }
                                              _push7(`<!--]-->`);
                                            });
                                            _push7(`<!--]--><div class="ml-auto flex items-center gap-0.5 shrink-0" data-v-0e0cd714${_scopeId6}>`);
                                            if (startDate.value || endDate.value) {
                                              _push7(`<button type="button"${ssrRenderAttr("aria-label", unref(t)("common.clear"))} class="inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-v-0e0cd714${_scopeId6}>`);
                                              _push7(ssrRenderComponent(unref(Icon), {
                                                icon: "mdi:close",
                                                class: "w-4 h-4"
                                              }, null, _parent7, _scopeId6));
                                              _push7(`</button>`);
                                            } else {
                                              _push7(`<!---->`);
                                            }
                                            _push7(ssrRenderComponent(unref(DateRangePickerTrigger), { class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" }, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(unref(Icon), {
                                                    icon: "radix-icons:calendar",
                                                    class: "w-4 h-4"
                                                  }, null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(unref(Icon), {
                                                      icon: "radix-icons:calendar",
                                                      class: "w-4 h-4"
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(`</div>`);
                                          } else {
                                            return [
                                              createVNode(unref(Icon), {
                                                icon: "mdi:calendar-range",
                                                class: "text-base text-gray-400 shrink-0 mr-1"
                                              }),
                                              (openBlock(true), createBlock(Fragment, null, renderList(segments.start, (item) => {
                                                return openBlock(), createBlock(Fragment, {
                                                  key: "s-" + item.part
                                                }, [
                                                  item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                    key: 0,
                                                    part: item.part,
                                                    type: "start",
                                                    class: "px-0 text-gray-400"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(item.value), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                    key: 1,
                                                    part: item.part,
                                                    type: "start",
                                                    class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(item.value), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["part"]))
                                                ], 64);
                                              }), 128)),
                                              createVNode("span", { class: "mx-1 text-gray-400" }, "\u2013"),
                                              (openBlock(true), createBlock(Fragment, null, renderList(segments.end, (item) => {
                                                return openBlock(), createBlock(Fragment, {
                                                  key: "e-" + item.part
                                                }, [
                                                  item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                    key: 0,
                                                    part: item.part,
                                                    type: "end",
                                                    class: "px-0 text-gray-400"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(item.value), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                    key: 1,
                                                    part: item.part,
                                                    type: "end",
                                                    class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(item.value), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["part"]))
                                                ], 64);
                                              }), 128)),
                                              createVNode("div", { class: "ml-auto flex items-center gap-0.5 shrink-0" }, [
                                                startDate.value || endDate.value ? (openBlock(), createBlock("button", {
                                                  key: 0,
                                                  type: "button",
                                                  "aria-label": unref(t)("common.clear"),
                                                  class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                                  onClick: withModifiers(clearDateRange, ["stop"])
                                                }, [
                                                  createVNode(unref(Icon), {
                                                    icon: "mdi:close",
                                                    class: "w-4 h-4"
                                                  })
                                                ], 8, ["aria-label"])) : createCommentVNode("", true),
                                                createVNode(unref(DateRangePickerTrigger), { class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), {
                                                      icon: "radix-icons:calendar",
                                                      class: "w-4 h-4"
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(unref(DateRangePickerContent), {
                                        "side-offset": 4,
                                        class: "rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 dark:ring-white/10 p-2 z-50"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(DateRangePickerArrow), { class: "fill-white dark:fill-gray-800" }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(DateRangePickerCalendar), { class: "p-2" }, {
                                              default: withCtx(({ weekDays, grid }, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(unref(DateRangePickerHeader), { class: "flex items-center justify-between px-2 py-1" }, {
                                                    default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(unref(DateRangePickerPrev), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                          default: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(unref(Icon), {
                                                                icon: "radix-icons:chevron-left",
                                                                class: "w-4 h-4"
                                                              }, null, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(unref(Icon), {
                                                                  icon: "radix-icons:chevron-left",
                                                                  class: "w-4 h-4"
                                                                })
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(unref(DateRangePickerHeading), { class: "text-sm font-medium text-gray-900 dark:text-gray-100" }, null, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(unref(DateRangePickerNext), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                          default: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(unref(Icon), {
                                                                icon: "radix-icons:chevron-right",
                                                                class: "w-4 h-4"
                                                              }, null, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(unref(Icon), {
                                                                  icon: "radix-icons:chevron-right",
                                                                  class: "w-4 h-4"
                                                                })
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(unref(DateRangePickerPrev), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(Icon), {
                                                                icon: "radix-icons:chevron-left",
                                                                class: "w-4 h-4"
                                                              })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(DateRangePickerHeading), { class: "text-sm font-medium text-gray-900 dark:text-gray-100" }),
                                                          createVNode(unref(DateRangePickerNext), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(Icon), {
                                                                icon: "radix-icons:chevron-right",
                                                                class: "w-4 h-4"
                                                              })
                                                            ]),
                                                            _: 1
                                                          })
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                  _push8(`<div class="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0" data-v-0e0cd714${_scopeId7}><!--[-->`);
                                                  ssrRenderList(grid, (month) => {
                                                    _push8(ssrRenderComponent(unref(DateRangePickerGrid), {
                                                      key: month.value.toString(),
                                                      class: "w-full border-collapse select-none space-y-1"
                                                    }, {
                                                      default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(ssrRenderComponent(unref(DateRangePickerGridHead), null, {
                                                            default: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(unref(DateRangePickerGridRow), { class: "mb-1 flex w-full justify-between" }, {
                                                                  default: withCtx((_9, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(`<!--[-->`);
                                                                      ssrRenderList(weekDays, (day) => {
                                                                        _push11(ssrRenderComponent(unref(DateRangePickerHeadCell), {
                                                                          key: day,
                                                                          class: "w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                                                                        }, {
                                                                          default: withCtx((_10, _push12, _parent12, _scopeId11) => {
                                                                            if (_push12) {
                                                                              _push12(`${ssrInterpolate(day)}`);
                                                                            } else {
                                                                              return [
                                                                                createTextVNode(toDisplayString(day), 1)
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 2
                                                                        }, _parent11, _scopeId10));
                                                                      });
                                                                      _push11(`<!--]-->`);
                                                                    } else {
                                                                      return [
                                                                        (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                                                          return openBlock(), createBlock(unref(DateRangePickerHeadCell), {
                                                                            key: day,
                                                                            class: "w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(toDisplayString(day), 1)
                                                                            ]),
                                                                            _: 2
                                                                          }, 1024);
                                                                        }), 128))
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 2
                                                                }, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(unref(DateRangePickerGridRow), { class: "mb-1 flex w-full justify-between" }, {
                                                                    default: withCtx(() => [
                                                                      (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                                                        return openBlock(), createBlock(unref(DateRangePickerHeadCell), {
                                                                          key: day,
                                                                          class: "w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(day), 1)
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024);
                                                                      }), 128))
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent9, _scopeId8));
                                                          _push9(ssrRenderComponent(unref(DateRangePickerGridBody), null, {
                                                            default: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(`<!--[-->`);
                                                                ssrRenderList(month.rows, (weekDates, index2) => {
                                                                  _push10(ssrRenderComponent(unref(DateRangePickerGridRow), {
                                                                    key: "weekDate-" + index2,
                                                                    class: "flex w-full"
                                                                  }, {
                                                                    default: withCtx((_9, _push11, _parent11, _scopeId10) => {
                                                                      if (_push11) {
                                                                        _push11(`<!--[-->`);
                                                                        ssrRenderList(weekDates, (weekDate) => {
                                                                          _push11(ssrRenderComponent(unref(DateRangePickerCell), {
                                                                            key: weekDate.toString(),
                                                                            date: weekDate
                                                                          }, {
                                                                            default: withCtx((_10, _push12, _parent12, _scopeId11) => {
                                                                              if (_push12) {
                                                                                _push12(ssrRenderComponent(unref(DateRangePickerCellTrigger), {
                                                                                  day: weekDate,
                                                                                  month: month.value,
                                                                                  class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                                }, null, _parent12, _scopeId11));
                                                                              } else {
                                                                                return [
                                                                                  createVNode(unref(DateRangePickerCellTrigger), {
                                                                                    day: weekDate,
                                                                                    month: month.value,
                                                                                    class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                                  }, null, 8, ["day", "month"])
                                                                                ];
                                                                              }
                                                                            }),
                                                                            _: 2
                                                                          }, _parent11, _scopeId10));
                                                                        });
                                                                        _push11(`<!--]-->`);
                                                                      } else {
                                                                        return [
                                                                          (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                                            return openBlock(), createBlock(unref(DateRangePickerCell), {
                                                                              key: weekDate.toString(),
                                                                              date: weekDate
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode(unref(DateRangePickerCellTrigger), {
                                                                                  day: weekDate,
                                                                                  month: month.value,
                                                                                  class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                                }, null, 8, ["day", "month"])
                                                                              ]),
                                                                              _: 2
                                                                            }, 1032, ["date"]);
                                                                          }), 128))
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 2
                                                                  }, _parent10, _scopeId9));
                                                                });
                                                                _push10(`<!--]-->`);
                                                              } else {
                                                                return [
                                                                  (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index2) => {
                                                                    return openBlock(), createBlock(unref(DateRangePickerGridRow), {
                                                                      key: "weekDate-" + index2,
                                                                      class: "flex w-full"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                                          return openBlock(), createBlock(unref(DateRangePickerCell), {
                                                                            key: weekDate.toString(),
                                                                            date: weekDate
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode(unref(DateRangePickerCellTrigger), {
                                                                                day: weekDate,
                                                                                month: month.value,
                                                                                class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                              }, null, 8, ["day", "month"])
                                                                            ]),
                                                                            _: 2
                                                                          }, 1032, ["date"]);
                                                                        }), 128))
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024);
                                                                  }), 128))
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent9, _scopeId8));
                                                        } else {
                                                          return [
                                                            createVNode(unref(DateRangePickerGridHead), null, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(DateRangePickerGridRow), { class: "mb-1 flex w-full justify-between" }, {
                                                                  default: withCtx(() => [
                                                                    (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                                                      return openBlock(), createBlock(unref(DateRangePickerHeadCell), {
                                                                        key: day,
                                                                        class: "w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(day), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024);
                                                                    }), 128))
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1024),
                                                            createVNode(unref(DateRangePickerGridBody), null, {
                                                              default: withCtx(() => [
                                                                (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index2) => {
                                                                  return openBlock(), createBlock(unref(DateRangePickerGridRow), {
                                                                    key: "weekDate-" + index2,
                                                                    class: "flex w-full"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                                        return openBlock(), createBlock(unref(DateRangePickerCell), {
                                                                          key: weekDate.toString(),
                                                                          date: weekDate
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(unref(DateRangePickerCellTrigger), {
                                                                              day: weekDate,
                                                                              month: month.value,
                                                                              class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                            }, null, 8, ["day", "month"])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1032, ["date"]);
                                                                      }), 128))
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024);
                                                                }), 128))
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                  });
                                                  _push8(`<!--]--></div>`);
                                                } else {
                                                  return [
                                                    createVNode(unref(DateRangePickerHeader), { class: "flex items-center justify-between px-2 py-1" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(DateRangePickerPrev), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(Icon), {
                                                              icon: "radix-icons:chevron-left",
                                                              class: "w-4 h-4"
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(DateRangePickerHeading), { class: "text-sm font-medium text-gray-900 dark:text-gray-100" }),
                                                        createVNode(unref(DateRangePickerNext), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(Icon), {
                                                              icon: "radix-icons:chevron-right",
                                                              class: "w-4 h-4"
                                                            })
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("div", { class: "flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0" }, [
                                                      (openBlock(true), createBlock(Fragment, null, renderList(grid, (month) => {
                                                        return openBlock(), createBlock(unref(DateRangePickerGrid), {
                                                          key: month.value.toString(),
                                                          class: "w-full border-collapse select-none space-y-1"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(DateRangePickerGridHead), null, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(DateRangePickerGridRow), { class: "mb-1 flex w-full justify-between" }, {
                                                                  default: withCtx(() => [
                                                                    (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                                                      return openBlock(), createBlock(unref(DateRangePickerHeadCell), {
                                                                        key: day,
                                                                        class: "w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(day), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024);
                                                                    }), 128))
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1024),
                                                            createVNode(unref(DateRangePickerGridBody), null, {
                                                              default: withCtx(() => [
                                                                (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index2) => {
                                                                  return openBlock(), createBlock(unref(DateRangePickerGridRow), {
                                                                    key: "weekDate-" + index2,
                                                                    class: "flex w-full"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                                        return openBlock(), createBlock(unref(DateRangePickerCell), {
                                                                          key: weekDate.toString(),
                                                                          date: weekDate
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(unref(DateRangePickerCellTrigger), {
                                                                              day: weekDate,
                                                                              month: month.value,
                                                                              class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                            }, null, 8, ["day", "month"])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1032, ["date"]);
                                                                      }), 128))
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024);
                                                                }), 128))
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 2
                                                        }, 1024);
                                                      }), 128))
                                                    ])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(DateRangePickerArrow), { class: "fill-white dark:fill-gray-800" }),
                                              createVNode(unref(DateRangePickerCalendar), { class: "p-2" }, {
                                                default: withCtx(({ weekDays, grid }) => [
                                                  createVNode(unref(DateRangePickerHeader), { class: "flex items-center justify-between px-2 py-1" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(DateRangePickerPrev), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(Icon), {
                                                            icon: "radix-icons:chevron-left",
                                                            class: "w-4 h-4"
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(DateRangePickerHeading), { class: "text-sm font-medium text-gray-900 dark:text-gray-100" }),
                                                      createVNode(unref(DateRangePickerNext), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(Icon), {
                                                            icon: "radix-icons:chevron-right",
                                                            class: "w-4 h-4"
                                                          })
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("div", { class: "flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0" }, [
                                                    (openBlock(true), createBlock(Fragment, null, renderList(grid, (month) => {
                                                      return openBlock(), createBlock(unref(DateRangePickerGrid), {
                                                        key: month.value.toString(),
                                                        class: "w-full border-collapse select-none space-y-1"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(DateRangePickerGridHead), null, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(DateRangePickerGridRow), { class: "mb-1 flex w-full justify-between" }, {
                                                                default: withCtx(() => [
                                                                  (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                                                    return openBlock(), createBlock(unref(DateRangePickerHeadCell), {
                                                                      key: day,
                                                                      class: "w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(day), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024);
                                                                  }), 128))
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(unref(DateRangePickerGridBody), null, {
                                                            default: withCtx(() => [
                                                              (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index2) => {
                                                                return openBlock(), createBlock(unref(DateRangePickerGridRow), {
                                                                  key: "weekDate-" + index2,
                                                                  class: "flex w-full"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                                      return openBlock(), createBlock(unref(DateRangePickerCell), {
                                                                        key: weekDate.toString(),
                                                                        date: weekDate
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(DateRangePickerCellTrigger), {
                                                                            day: weekDate,
                                                                            month: month.value,
                                                                            class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                          }, null, 8, ["day", "month"])
                                                                        ]),
                                                                        _: 2
                                                                      }, 1032, ["date"]);
                                                                    }), 128))
                                                                  ]),
                                                                  _: 2
                                                                }, 1024);
                                                              }), 128))
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1024);
                                                    }), 128))
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(DateRangePickerField), { class: "h-9 w-full items-center select-none bg-white dark:bg-gray-900/40 rounded-md text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 px-2.5 text-sm gap-0.5 flex focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none" }, {
                                          default: withCtx(({ segments }) => [
                                            createVNode(unref(Icon), {
                                              icon: "mdi:calendar-range",
                                              class: "text-base text-gray-400 shrink-0 mr-1"
                                            }),
                                            (openBlock(true), createBlock(Fragment, null, renderList(segments.start, (item) => {
                                              return openBlock(), createBlock(Fragment, {
                                                key: "s-" + item.part
                                              }, [
                                                item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                  key: 0,
                                                  part: item.part,
                                                  type: "start",
                                                  class: "px-0 text-gray-400"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(item.value), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                  key: 1,
                                                  part: item.part,
                                                  type: "start",
                                                  class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(item.value), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["part"]))
                                              ], 64);
                                            }), 128)),
                                            createVNode("span", { class: "mx-1 text-gray-400" }, "\u2013"),
                                            (openBlock(true), createBlock(Fragment, null, renderList(segments.end, (item) => {
                                              return openBlock(), createBlock(Fragment, {
                                                key: "e-" + item.part
                                              }, [
                                                item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                  key: 0,
                                                  part: item.part,
                                                  type: "end",
                                                  class: "px-0 text-gray-400"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(item.value), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                  key: 1,
                                                  part: item.part,
                                                  type: "end",
                                                  class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(item.value), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["part"]))
                                              ], 64);
                                            }), 128)),
                                            createVNode("div", { class: "ml-auto flex items-center gap-0.5 shrink-0" }, [
                                              startDate.value || endDate.value ? (openBlock(), createBlock("button", {
                                                key: 0,
                                                type: "button",
                                                "aria-label": unref(t)("common.clear"),
                                                class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                                onClick: withModifiers(clearDateRange, ["stop"])
                                              }, [
                                                createVNode(unref(Icon), {
                                                  icon: "mdi:close",
                                                  class: "w-4 h-4"
                                                })
                                              ], 8, ["aria-label"])) : createCommentVNode("", true),
                                              createVNode(unref(DateRangePickerTrigger), { class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), {
                                                    icon: "radix-icons:calendar",
                                                    class: "w-4 h-4"
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(DateRangePickerContent), {
                                          "side-offset": 4,
                                          class: "rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 dark:ring-white/10 p-2 z-50"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(DateRangePickerArrow), { class: "fill-white dark:fill-gray-800" }),
                                            createVNode(unref(DateRangePickerCalendar), { class: "p-2" }, {
                                              default: withCtx(({ weekDays, grid }) => [
                                                createVNode(unref(DateRangePickerHeader), { class: "flex items-center justify-between px-2 py-1" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(DateRangePickerPrev), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), {
                                                          icon: "radix-icons:chevron-left",
                                                          class: "w-4 h-4"
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(DateRangePickerHeading), { class: "text-sm font-medium text-gray-900 dark:text-gray-100" }),
                                                    createVNode(unref(DateRangePickerNext), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), {
                                                          icon: "radix-icons:chevron-right",
                                                          class: "w-4 h-4"
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode("div", { class: "flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0" }, [
                                                  (openBlock(true), createBlock(Fragment, null, renderList(grid, (month) => {
                                                    return openBlock(), createBlock(unref(DateRangePickerGrid), {
                                                      key: month.value.toString(),
                                                      class: "w-full border-collapse select-none space-y-1"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(DateRangePickerGridHead), null, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(DateRangePickerGridRow), { class: "mb-1 flex w-full justify-between" }, {
                                                              default: withCtx(() => [
                                                                (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                                                  return openBlock(), createBlock(unref(DateRangePickerHeadCell), {
                                                                    key: day,
                                                                    class: "w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(day), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024);
                                                                }), 128))
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(unref(DateRangePickerGridBody), null, {
                                                          default: withCtx(() => [
                                                            (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index2) => {
                                                              return openBlock(), createBlock(unref(DateRangePickerGridRow), {
                                                                key: "weekDate-" + index2,
                                                                class: "flex w-full"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                                    return openBlock(), createBlock(unref(DateRangePickerCell), {
                                                                      key: weekDate.toString(),
                                                                      date: weekDate
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(DateRangePickerCellTrigger), {
                                                                          day: weekDate,
                                                                          month: month.value,
                                                                          class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                        }, null, 8, ["day", "month"])
                                                                      ]),
                                                                      _: 2
                                                                    }, 1032, ["date"]);
                                                                  }), 128))
                                                                ]),
                                                                _: 2
                                                              }, 1024);
                                                            }), 128))
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1024);
                                                  }), 128))
                                                ])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  (openBlock(), createBlock(unref(DateRangePickerRoot), {
                                    key: dateRangePickerKey.value,
                                    modelValue: dateRange.value,
                                    "onUpdate:modelValue": [($event) => dateRange.value = $event, onDateRangeChange],
                                    locale: "en-GB"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(DateRangePickerField), { class: "h-9 w-full items-center select-none bg-white dark:bg-gray-900/40 rounded-md text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 px-2.5 text-sm gap-0.5 flex focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none" }, {
                                        default: withCtx(({ segments }) => [
                                          createVNode(unref(Icon), {
                                            icon: "mdi:calendar-range",
                                            class: "text-base text-gray-400 shrink-0 mr-1"
                                          }),
                                          (openBlock(true), createBlock(Fragment, null, renderList(segments.start, (item) => {
                                            return openBlock(), createBlock(Fragment, {
                                              key: "s-" + item.part
                                            }, [
                                              item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                key: 0,
                                                part: item.part,
                                                type: "start",
                                                class: "px-0 text-gray-400"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item.value), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                key: 1,
                                                part: item.part,
                                                type: "start",
                                                class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item.value), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["part"]))
                                            ], 64);
                                          }), 128)),
                                          createVNode("span", { class: "mx-1 text-gray-400" }, "\u2013"),
                                          (openBlock(true), createBlock(Fragment, null, renderList(segments.end, (item) => {
                                            return openBlock(), createBlock(Fragment, {
                                              key: "e-" + item.part
                                            }, [
                                              item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                key: 0,
                                                part: item.part,
                                                type: "end",
                                                class: "px-0 text-gray-400"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item.value), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                                key: 1,
                                                part: item.part,
                                                type: "end",
                                                class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item.value), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["part"]))
                                            ], 64);
                                          }), 128)),
                                          createVNode("div", { class: "ml-auto flex items-center gap-0.5 shrink-0" }, [
                                            startDate.value || endDate.value ? (openBlock(), createBlock("button", {
                                              key: 0,
                                              type: "button",
                                              "aria-label": unref(t)("common.clear"),
                                              class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                              onClick: withModifiers(clearDateRange, ["stop"])
                                            }, [
                                              createVNode(unref(Icon), {
                                                icon: "mdi:close",
                                                class: "w-4 h-4"
                                              })
                                            ], 8, ["aria-label"])) : createCommentVNode("", true),
                                            createVNode(unref(DateRangePickerTrigger), { class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), {
                                                  icon: "radix-icons:calendar",
                                                  class: "w-4 h-4"
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(DateRangePickerContent), {
                                        "side-offset": 4,
                                        class: "rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 dark:ring-white/10 p-2 z-50"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(DateRangePickerArrow), { class: "fill-white dark:fill-gray-800" }),
                                          createVNode(unref(DateRangePickerCalendar), { class: "p-2" }, {
                                            default: withCtx(({ weekDays, grid }) => [
                                              createVNode(unref(DateRangePickerHeader), { class: "flex items-center justify-between px-2 py-1" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(DateRangePickerPrev), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(Icon), {
                                                        icon: "radix-icons:chevron-left",
                                                        class: "w-4 h-4"
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(DateRangePickerHeading), { class: "text-sm font-medium text-gray-900 dark:text-gray-100" }),
                                                  createVNode(unref(DateRangePickerNext), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(Icon), {
                                                        icon: "radix-icons:chevron-right",
                                                        class: "w-4 h-4"
                                                      })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("div", { class: "flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0" }, [
                                                (openBlock(true), createBlock(Fragment, null, renderList(grid, (month) => {
                                                  return openBlock(), createBlock(unref(DateRangePickerGrid), {
                                                    key: month.value.toString(),
                                                    class: "w-full border-collapse select-none space-y-1"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(DateRangePickerGridHead), null, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(DateRangePickerGridRow), { class: "mb-1 flex w-full justify-between" }, {
                                                            default: withCtx(() => [
                                                              (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                                                return openBlock(), createBlock(unref(DateRangePickerHeadCell), {
                                                                  key: day,
                                                                  class: "w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(day), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024);
                                                              }), 128))
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(unref(DateRangePickerGridBody), null, {
                                                        default: withCtx(() => [
                                                          (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index2) => {
                                                            return openBlock(), createBlock(unref(DateRangePickerGridRow), {
                                                              key: "weekDate-" + index2,
                                                              class: "flex w-full"
                                                            }, {
                                                              default: withCtx(() => [
                                                                (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                                  return openBlock(), createBlock(unref(DateRangePickerCell), {
                                                                    key: weekDate.toString(),
                                                                    date: weekDate
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(DateRangePickerCellTrigger), {
                                                                        day: weekDate,
                                                                        month: month.value,
                                                                        class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                      }, null, 8, ["day", "month"])
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["date"]);
                                                                }), 128))
                                                              ]),
                                                              _: 2
                                                            }, 1024);
                                                          }), 128))
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1024);
                                                }), 128))
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["modelValue", "onUpdate:modelValue"]))
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$d, {
                              "selected-length": selected.value.length,
                              "has-active-filters": hasActivePostFilters.value,
                              onBulkDelete: ($event) => askConfirmation(unref(t)("posts.deleteSelectedConfirm"), bulkDelete),
                              onClearFilters: clearAllPostFilters
                            }, {
                              status: withCtx(() => [
                                createVNode(unref(SelectRoot), {
                                  modelValue: statusFilter.value,
                                  "onUpdate:modelValue": [($event) => statusFilter.value = $event, applyFilters]
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectTrigger), {
                                      class: filterTriggerClass,
                                      "aria-label": unref(t)("posts.allStatuses")
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                          createVNode(unref(Icon), {
                                            icon: "mdi:circle-slice-8",
                                            class: "text-sm opacity-60 shrink-0"
                                          }),
                                          createVNode(unref(SelectValue), {
                                            placeholder: unref(t)("posts.allStatuses")
                                          }, null, 8, ["placeholder"])
                                        ]),
                                        createVNode(unref(Icon), {
                                          icon: "radix-icons:chevron-down",
                                          class: "w-4 h-4 opacity-70 shrink-0"
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["aria-label"]),
                                    createVNode(unref(SelectPortal), null, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectContent), {
                                          class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                          "side-offset": 5
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectViewport), { class: "p-1" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectGroup), null, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectItem), {
                                                      value: "all",
                                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectItemText), null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(unref(t)("posts.allStatuses")), 1)
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                    (openBlock(true), createBlock(Fragment, null, renderList(status.value, (s) => {
                                                      return openBlock(), createBlock(unref(SelectItem), {
                                                        key: s,
                                                        value: s,
                                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectItemText), null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(unref(t)(`posts.status.${s}`)), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["value"]);
                                                    }), 128))
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              locale: withCtx(() => [
                                createVNode(unref(SelectRoot), {
                                  modelValue: localeFilter.value,
                                  "onUpdate:modelValue": [($event) => localeFilter.value = $event, applyFilters]
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectTrigger), {
                                      class: filterTriggerClass,
                                      "aria-label": unref(t)("posts.allLocales")
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                          createVNode(unref(Icon), {
                                            icon: "mdi:translate",
                                            class: "text-sm opacity-60 shrink-0"
                                          }),
                                          createVNode(unref(SelectValue), {
                                            placeholder: unref(t)("posts.allLocales")
                                          }, null, 8, ["placeholder"])
                                        ]),
                                        createVNode(unref(Icon), {
                                          icon: "radix-icons:chevron-down",
                                          class: "w-4 h-4 opacity-70 shrink-0"
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["aria-label"]),
                                    createVNode(unref(SelectPortal), null, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectContent), {
                                          class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                          "side-offset": 5
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectViewport), { class: "p-1" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectGroup), null, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectItem), {
                                                      value: "all",
                                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectItemText), null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(unref(t)("posts.allLocales")), 1)
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                    (openBlock(true), createBlock(Fragment, null, renderList(filterLocales.value, (loc) => {
                                                      return openBlock(), createBlock(unref(SelectItem), {
                                                        key: loc.code,
                                                        value: loc.code,
                                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectItemText), null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(loc.name), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["value"]);
                                                    }), 128))
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              category: withCtx(() => [
                                createVNode(unref(SelectRoot), {
                                  modelValue: categoryFilter.value,
                                  "onUpdate:modelValue": [($event) => categoryFilter.value = $event, applyFilters]
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectTrigger), {
                                      class: filterTriggerClass,
                                      "aria-label": unref(t)("posts.allCategories")
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                          createVNode(unref(Icon), {
                                            icon: "mdi:folder-outline",
                                            class: "text-sm opacity-60 shrink-0"
                                          }),
                                          createVNode(unref(SelectValue), {
                                            placeholder: unref(t)("posts.allCategories")
                                          }, null, 8, ["placeholder"])
                                        ]),
                                        createVNode(unref(Icon), {
                                          icon: "radix-icons:chevron-down",
                                          class: "w-4 h-4 opacity-70 shrink-0"
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["aria-label"]),
                                    createVNode(unref(SelectPortal), null, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectContent), {
                                          class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                          "side-offset": 5
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectViewport), { class: "p-1" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectGroup), null, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectItem), {
                                                      value: "all",
                                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectItemText), null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(unref(t)("posts.allCategories")), 1)
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                    (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
                                                      return openBlock(), createBlock(unref(SelectItem), {
                                                        key: c.id,
                                                        value: c.id,
                                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectItemText), null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(c.name), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["value"]);
                                                    }), 128))
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              author: withCtx(() => [
                                createVNode(unref(SelectRoot), {
                                  modelValue: authorFilter.value,
                                  "onUpdate:modelValue": [($event) => authorFilter.value = $event, applyFilters]
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectTrigger), {
                                      class: filterTriggerClass,
                                      "aria-label": unref(t)("posts.allAuthors")
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                          createVNode(unref(Icon), {
                                            icon: "mdi:account-outline",
                                            class: "text-sm opacity-60 shrink-0"
                                          }),
                                          createVNode(unref(SelectValue), {
                                            placeholder: unref(t)("posts.allAuthors")
                                          }, null, 8, ["placeholder"])
                                        ]),
                                        createVNode(unref(Icon), {
                                          icon: "radix-icons:chevron-down",
                                          class: "w-4 h-4 opacity-70 shrink-0"
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["aria-label"]),
                                    createVNode(unref(SelectPortal), null, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectContent), {
                                          class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                          "side-offset": 5
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectViewport), { class: "p-1" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectGroup), null, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectItem), {
                                                      value: "all",
                                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectItemText), null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(unref(t)("posts.allAuthors")), 1)
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                    (openBlock(true), createBlock(Fragment, null, renderList(uniqueAuthors.value, (a) => {
                                                      return openBlock(), createBlock(unref(SelectItem), {
                                                        key: a.id,
                                                        value: a.id,
                                                        class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(unref(SelectItemText), null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(a.display_name || a.username), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["value"]);
                                                    }), 128))
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              date: withCtx(() => [
                                (openBlock(), createBlock(unref(DateRangePickerRoot), {
                                  key: dateRangePickerKey.value,
                                  modelValue: dateRange.value,
                                  "onUpdate:modelValue": [($event) => dateRange.value = $event, onDateRangeChange],
                                  locale: "en-GB"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(DateRangePickerField), { class: "h-9 w-full items-center select-none bg-white dark:bg-gray-900/40 rounded-md text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 px-2.5 text-sm gap-0.5 flex focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none" }, {
                                      default: withCtx(({ segments }) => [
                                        createVNode(unref(Icon), {
                                          icon: "mdi:calendar-range",
                                          class: "text-base text-gray-400 shrink-0 mr-1"
                                        }),
                                        (openBlock(true), createBlock(Fragment, null, renderList(segments.start, (item) => {
                                          return openBlock(), createBlock(Fragment, {
                                            key: "s-" + item.part
                                          }, [
                                            item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                              key: 0,
                                              part: item.part,
                                              type: "start",
                                              class: "px-0 text-gray-400"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(item.value), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                              key: 1,
                                              part: item.part,
                                              type: "start",
                                              class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(item.value), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["part"]))
                                          ], 64);
                                        }), 128)),
                                        createVNode("span", { class: "mx-1 text-gray-400" }, "\u2013"),
                                        (openBlock(true), createBlock(Fragment, null, renderList(segments.end, (item) => {
                                          return openBlock(), createBlock(Fragment, {
                                            key: "e-" + item.part
                                          }, [
                                            item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                              key: 0,
                                              part: item.part,
                                              type: "end",
                                              class: "px-0 text-gray-400"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(item.value), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                              key: 1,
                                              part: item.part,
                                              type: "end",
                                              class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(item.value), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["part"]))
                                          ], 64);
                                        }), 128)),
                                        createVNode("div", { class: "ml-auto flex items-center gap-0.5 shrink-0" }, [
                                          startDate.value || endDate.value ? (openBlock(), createBlock("button", {
                                            key: 0,
                                            type: "button",
                                            "aria-label": unref(t)("common.clear"),
                                            class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                            onClick: withModifiers(clearDateRange, ["stop"])
                                          }, [
                                            createVNode(unref(Icon), {
                                              icon: "mdi:close",
                                              class: "w-4 h-4"
                                            })
                                          ], 8, ["aria-label"])) : createCommentVNode("", true),
                                          createVNode(unref(DateRangePickerTrigger), { class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), {
                                                icon: "radix-icons:calendar",
                                                class: "w-4 h-4"
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(DateRangePickerContent), {
                                      "side-offset": 4,
                                      class: "rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 dark:ring-white/10 p-2 z-50"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(DateRangePickerArrow), { class: "fill-white dark:fill-gray-800" }),
                                        createVNode(unref(DateRangePickerCalendar), { class: "p-2" }, {
                                          default: withCtx(({ weekDays, grid }) => [
                                            createVNode(unref(DateRangePickerHeader), { class: "flex items-center justify-between px-2 py-1" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(DateRangePickerPrev), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), {
                                                      icon: "radix-icons:chevron-left",
                                                      class: "w-4 h-4"
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(DateRangePickerHeading), { class: "text-sm font-medium text-gray-900 dark:text-gray-100" }),
                                                createVNode(unref(DateRangePickerNext), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), {
                                                      icon: "radix-icons:chevron-right",
                                                      class: "w-4 h-4"
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("div", { class: "flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0" }, [
                                              (openBlock(true), createBlock(Fragment, null, renderList(grid, (month) => {
                                                return openBlock(), createBlock(unref(DateRangePickerGrid), {
                                                  key: month.value.toString(),
                                                  class: "w-full border-collapse select-none space-y-1"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(DateRangePickerGridHead), null, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(DateRangePickerGridRow), { class: "mb-1 flex w-full justify-between" }, {
                                                          default: withCtx(() => [
                                                            (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                                              return openBlock(), createBlock(unref(DateRangePickerHeadCell), {
                                                                key: day,
                                                                class: "w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(day), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024);
                                                            }), 128))
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(unref(DateRangePickerGridBody), null, {
                                                      default: withCtx(() => [
                                                        (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index2) => {
                                                          return openBlock(), createBlock(unref(DateRangePickerGridRow), {
                                                            key: "weekDate-" + index2,
                                                            class: "flex w-full"
                                                          }, {
                                                            default: withCtx(() => [
                                                              (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                                return openBlock(), createBlock(unref(DateRangePickerCell), {
                                                                  key: weekDate.toString(),
                                                                  date: weekDate
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(DateRangePickerCellTrigger), {
                                                                      day: weekDate,
                                                                      month: month.value,
                                                                      class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                    }, null, 8, ["day", "month"])
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["date"]);
                                                              }), 128))
                                                            ]),
                                                            _: 2
                                                          }, 1024);
                                                        }), 128))
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1024);
                                              }), 128))
                                            ])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1032, ["modelValue", "onUpdate:modelValue"]))
                              ]),
                              _: 2
                            }, 1032, ["selected-length", "has-active-filters", "onBulkDelete"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="mt-4 flex items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-300" data-v-0e0cd714${_scopeId2}><button type="button"${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50" data-v-0e0cd714${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: "mdi:chevron-left",
                      class: "text-base"
                    }, null, _parent3, _scopeId2));
                    _push3(` ${ssrInterpolate(unref(t)("common.prev"))}</button><span class="font-medium tabular-nums" data-v-0e0cd714${_scopeId2}>${ssrInterpolate(unref(t)("common.page", { current: currentPage.value, total: totalPages.value || 1 }))}</span><button type="button"${ssrIncludeBooleanAttr(currentPage.value === totalPages.value || totalPages.value === 0) ? " disabled" : ""} class="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50" data-v-0e0cd714${_scopeId2}>${ssrInterpolate(unref(t)("common.next"))} `);
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: "mdi:chevron-right",
                      class: "text-base"
                    }, null, _parent3, _scopeId2));
                    _push3(`</button></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center gap-3 justify-between" }, [
                        createVNode("div", { class: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto" }, [
                          createVNode(_sfc_main$b, { onChanged: fetchCategories }),
                          createVNode(_sfc_main$a)
                        ]),
                        createVNode("div", { class: "w-full sm:w-80" }, [
                          createVNode("div", { class: "flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 focus-within:ring-2 focus-within:ring-blue-500 transition" }, [
                            createVNode(unref(Icon), {
                              icon: "mdi:magnify",
                              class: "ml-3 text-gray-400 text-base"
                            }),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                              onInput: onSearchInput,
                              type: "text",
                              placeholder: unref(t)("posts.searchPlaceholder"),
                              class: "flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none",
                              "aria-label": unref(t)("posts.searchPlaceholder")
                            }, null, 40, ["onUpdate:modelValue", "placeholder", "aria-label"]), [
                              [vModelText, searchQuery.value]
                            ]),
                            searchQuery.value ? (openBlock(), createBlock("button", {
                              key: 0,
                              onClick: clearSearch,
                              type: "button",
                              class: "mr-1 inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                              "aria-label": unref(t)("posts.clearSearch")
                            }, [
                              createVNode(unref(Icon), {
                                icon: "mdi:close",
                                class: "text-base"
                              })
                            ], 8, ["aria-label"])) : createCommentVNode("", true)
                          ])
                        ])
                      ]),
                      createVNode(_sfc_main$e, {
                        posts: posts.value,
                        selected: selected.value,
                        "onUpdate:selected": ($event) => selected.value = $event,
                        "current-user": currentUser.value,
                        role: role.value,
                        onToggleAll: toggleAll,
                        onDelete: (id) => askConfirmation(unref(t)("posts.deleteConfirm"), () => deletePost(id)),
                        onEdit: editPost
                      }, {
                        filters: withCtx(() => [
                          createVNode(_sfc_main$d, {
                            "selected-length": selected.value.length,
                            "has-active-filters": hasActivePostFilters.value,
                            onBulkDelete: ($event) => askConfirmation(unref(t)("posts.deleteSelectedConfirm"), bulkDelete),
                            onClearFilters: clearAllPostFilters
                          }, {
                            status: withCtx(() => [
                              createVNode(unref(SelectRoot), {
                                modelValue: statusFilter.value,
                                "onUpdate:modelValue": [($event) => statusFilter.value = $event, applyFilters]
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectTrigger), {
                                    class: filterTriggerClass,
                                    "aria-label": unref(t)("posts.allStatuses")
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                        createVNode(unref(Icon), {
                                          icon: "mdi:circle-slice-8",
                                          class: "text-sm opacity-60 shrink-0"
                                        }),
                                        createVNode(unref(SelectValue), {
                                          placeholder: unref(t)("posts.allStatuses")
                                        }, null, 8, ["placeholder"])
                                      ]),
                                      createVNode(unref(Icon), {
                                        icon: "radix-icons:chevron-down",
                                        class: "w-4 h-4 opacity-70 shrink-0"
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["aria-label"]),
                                  createVNode(unref(SelectPortal), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectContent), {
                                        class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                        "side-offset": 5
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectViewport), { class: "p-1" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectGroup), null, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectItem), {
                                                    value: "all",
                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectItemText), null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(unref(t)("posts.allStatuses")), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                  (openBlock(true), createBlock(Fragment, null, renderList(status.value, (s) => {
                                                    return openBlock(), createBlock(unref(SelectItem), {
                                                      key: s,
                                                      value: s,
                                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectItemText), null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(unref(t)(`posts.status.${s}`)), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["value"]);
                                                  }), 128))
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            locale: withCtx(() => [
                              createVNode(unref(SelectRoot), {
                                modelValue: localeFilter.value,
                                "onUpdate:modelValue": [($event) => localeFilter.value = $event, applyFilters]
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectTrigger), {
                                    class: filterTriggerClass,
                                    "aria-label": unref(t)("posts.allLocales")
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                        createVNode(unref(Icon), {
                                          icon: "mdi:translate",
                                          class: "text-sm opacity-60 shrink-0"
                                        }),
                                        createVNode(unref(SelectValue), {
                                          placeholder: unref(t)("posts.allLocales")
                                        }, null, 8, ["placeholder"])
                                      ]),
                                      createVNode(unref(Icon), {
                                        icon: "radix-icons:chevron-down",
                                        class: "w-4 h-4 opacity-70 shrink-0"
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["aria-label"]),
                                  createVNode(unref(SelectPortal), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectContent), {
                                        class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                        "side-offset": 5
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectViewport), { class: "p-1" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectGroup), null, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectItem), {
                                                    value: "all",
                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectItemText), null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(unref(t)("posts.allLocales")), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                  (openBlock(true), createBlock(Fragment, null, renderList(filterLocales.value, (loc) => {
                                                    return openBlock(), createBlock(unref(SelectItem), {
                                                      key: loc.code,
                                                      value: loc.code,
                                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectItemText), null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(loc.name), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["value"]);
                                                  }), 128))
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            category: withCtx(() => [
                              createVNode(unref(SelectRoot), {
                                modelValue: categoryFilter.value,
                                "onUpdate:modelValue": [($event) => categoryFilter.value = $event, applyFilters]
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectTrigger), {
                                    class: filterTriggerClass,
                                    "aria-label": unref(t)("posts.allCategories")
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                        createVNode(unref(Icon), {
                                          icon: "mdi:folder-outline",
                                          class: "text-sm opacity-60 shrink-0"
                                        }),
                                        createVNode(unref(SelectValue), {
                                          placeholder: unref(t)("posts.allCategories")
                                        }, null, 8, ["placeholder"])
                                      ]),
                                      createVNode(unref(Icon), {
                                        icon: "radix-icons:chevron-down",
                                        class: "w-4 h-4 opacity-70 shrink-0"
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["aria-label"]),
                                  createVNode(unref(SelectPortal), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectContent), {
                                        class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                        "side-offset": 5
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectViewport), { class: "p-1" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectGroup), null, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectItem), {
                                                    value: "all",
                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectItemText), null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(unref(t)("posts.allCategories")), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                  (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
                                                    return openBlock(), createBlock(unref(SelectItem), {
                                                      key: c.id,
                                                      value: c.id,
                                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectItemText), null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(c.name), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["value"]);
                                                  }), 128))
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            author: withCtx(() => [
                              createVNode(unref(SelectRoot), {
                                modelValue: authorFilter.value,
                                "onUpdate:modelValue": [($event) => authorFilter.value = $event, applyFilters]
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectTrigger), {
                                    class: filterTriggerClass,
                                    "aria-label": unref(t)("posts.allAuthors")
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                        createVNode(unref(Icon), {
                                          icon: "mdi:account-outline",
                                          class: "text-sm opacity-60 shrink-0"
                                        }),
                                        createVNode(unref(SelectValue), {
                                          placeholder: unref(t)("posts.allAuthors")
                                        }, null, 8, ["placeholder"])
                                      ]),
                                      createVNode(unref(Icon), {
                                        icon: "radix-icons:chevron-down",
                                        class: "w-4 h-4 opacity-70 shrink-0"
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["aria-label"]),
                                  createVNode(unref(SelectPortal), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectContent), {
                                        class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                        "side-offset": 5
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectViewport), { class: "p-1" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectGroup), null, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SelectItem), {
                                                    value: "all",
                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectItemText), null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(unref(t)("posts.allAuthors")), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                  (openBlock(true), createBlock(Fragment, null, renderList(uniqueAuthors.value, (a) => {
                                                    return openBlock(), createBlock(unref(SelectItem), {
                                                      key: a.id,
                                                      value: a.id,
                                                      class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(SelectItemText), null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(a.display_name || a.username), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["value"]);
                                                  }), 128))
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            date: withCtx(() => [
                              (openBlock(), createBlock(unref(DateRangePickerRoot), {
                                key: dateRangePickerKey.value,
                                modelValue: dateRange.value,
                                "onUpdate:modelValue": [($event) => dateRange.value = $event, onDateRangeChange],
                                locale: "en-GB"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(DateRangePickerField), { class: "h-9 w-full items-center select-none bg-white dark:bg-gray-900/40 rounded-md text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 px-2.5 text-sm gap-0.5 flex focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none" }, {
                                    default: withCtx(({ segments }) => [
                                      createVNode(unref(Icon), {
                                        icon: "mdi:calendar-range",
                                        class: "text-base text-gray-400 shrink-0 mr-1"
                                      }),
                                      (openBlock(true), createBlock(Fragment, null, renderList(segments.start, (item) => {
                                        return openBlock(), createBlock(Fragment, {
                                          key: "s-" + item.part
                                        }, [
                                          item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                            key: 0,
                                            part: item.part,
                                            type: "start",
                                            class: "px-0 text-gray-400"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(item.value), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                            key: 1,
                                            part: item.part,
                                            type: "start",
                                            class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(item.value), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["part"]))
                                        ], 64);
                                      }), 128)),
                                      createVNode("span", { class: "mx-1 text-gray-400" }, "\u2013"),
                                      (openBlock(true), createBlock(Fragment, null, renderList(segments.end, (item) => {
                                        return openBlock(), createBlock(Fragment, {
                                          key: "e-" + item.part
                                        }, [
                                          item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                            key: 0,
                                            part: item.part,
                                            type: "end",
                                            class: "px-0 text-gray-400"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(item.value), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                            key: 1,
                                            part: item.part,
                                            type: "end",
                                            class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(item.value), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["part"]))
                                        ], 64);
                                      }), 128)),
                                      createVNode("div", { class: "ml-auto flex items-center gap-0.5 shrink-0" }, [
                                        startDate.value || endDate.value ? (openBlock(), createBlock("button", {
                                          key: 0,
                                          type: "button",
                                          "aria-label": unref(t)("common.clear"),
                                          class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                          onClick: withModifiers(clearDateRange, ["stop"])
                                        }, [
                                          createVNode(unref(Icon), {
                                            icon: "mdi:close",
                                            class: "w-4 h-4"
                                          })
                                        ], 8, ["aria-label"])) : createCommentVNode("", true),
                                        createVNode(unref(DateRangePickerTrigger), { class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), {
                                              icon: "radix-icons:calendar",
                                              class: "w-4 h-4"
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(DateRangePickerContent), {
                                    "side-offset": 4,
                                    class: "rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 dark:ring-white/10 p-2 z-50"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(DateRangePickerArrow), { class: "fill-white dark:fill-gray-800" }),
                                      createVNode(unref(DateRangePickerCalendar), { class: "p-2" }, {
                                        default: withCtx(({ weekDays, grid }) => [
                                          createVNode(unref(DateRangePickerHeader), { class: "flex items-center justify-between px-2 py-1" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(DateRangePickerPrev), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), {
                                                    icon: "radix-icons:chevron-left",
                                                    class: "w-4 h-4"
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(DateRangePickerHeading), { class: "text-sm font-medium text-gray-900 dark:text-gray-100" }),
                                              createVNode(unref(DateRangePickerNext), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), {
                                                    icon: "radix-icons:chevron-right",
                                                    class: "w-4 h-4"
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("div", { class: "flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0" }, [
                                            (openBlock(true), createBlock(Fragment, null, renderList(grid, (month) => {
                                              return openBlock(), createBlock(unref(DateRangePickerGrid), {
                                                key: month.value.toString(),
                                                class: "w-full border-collapse select-none space-y-1"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(DateRangePickerGridHead), null, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(DateRangePickerGridRow), { class: "mb-1 flex w-full justify-between" }, {
                                                        default: withCtx(() => [
                                                          (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                                            return openBlock(), createBlock(unref(DateRangePickerHeadCell), {
                                                              key: day,
                                                              class: "w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(day), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024);
                                                          }), 128))
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(unref(DateRangePickerGridBody), null, {
                                                    default: withCtx(() => [
                                                      (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index2) => {
                                                        return openBlock(), createBlock(unref(DateRangePickerGridRow), {
                                                          key: "weekDate-" + index2,
                                                          class: "flex w-full"
                                                        }, {
                                                          default: withCtx(() => [
                                                            (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                              return openBlock(), createBlock(unref(DateRangePickerCell), {
                                                                key: weekDate.toString(),
                                                                date: weekDate
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(DateRangePickerCellTrigger), {
                                                                    day: weekDate,
                                                                    month: month.value,
                                                                    class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                  }, null, 8, ["day", "month"])
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["date"]);
                                                            }), 128))
                                                          ]),
                                                          _: 2
                                                        }, 1024);
                                                      }), 128))
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128))
                                          ])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1032, ["modelValue", "onUpdate:modelValue"]))
                            ]),
                            _: 2
                          }, 1032, ["selected-length", "has-active-filters", "onBulkDelete"])
                        ]),
                        _: 2
                      }, 1032, ["posts", "selected", "onUpdate:selected", "current-user", "role", "onDelete"]),
                      createVNode("div", { class: "mt-4 flex items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-300" }, [
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => changePage(currentPage.value - 1),
                          disabled: currentPage.value === 1,
                          class: "inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }, [
                          createVNode(unref(Icon), {
                            icon: "mdi:chevron-left",
                            class: "text-base"
                          }),
                          createTextVNode(" " + toDisplayString(unref(t)("common.prev")), 1)
                        ], 8, ["onClick", "disabled"]),
                        createVNode("span", { class: "font-medium tabular-nums" }, toDisplayString(unref(t)("common.page", { current: currentPage.value, total: totalPages.value || 1 })), 1),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => changePage(currentPage.value + 1),
                          disabled: currentPage.value === totalPages.value || totalPages.value === 0,
                          class: "inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }, [
                          createTextVNode(toDisplayString(unref(t)("common.next")) + " ", 1),
                          createVNode(unref(Icon), {
                            icon: "mdi:chevron-right",
                            class: "text-base"
                          })
                        ], 8, ["onClick", "disabled"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (role.value === "admin" || role.value === "author") {
                _push2(ssrRenderComponent(unref(TabsContent), {
                  value: "comments",
                  class: ""
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_sfc_main$c, {
                        comments: pendingComments.value,
                        page: pendingPage.value,
                        "total-pages": pendingTotalPages.value,
                        loading: loadingPending.value,
                        "pending-count": stats.value.pendingComments,
                        "total-count": commentsTotalCount.value,
                        filter: commentsFilter.value,
                        search: pendingSearchQuery.value,
                        "onUpdate:search": ($event) => pendingSearchQuery.value = $event,
                        onSearch: onPendingSearch,
                        onRefresh: ($event) => fetchPendingComments(true),
                        onChangePage: changePendingPage,
                        onChangeFilter: setCommentsFilter,
                        onApprove: approvePendingComment,
                        onUnapprove: unapproveComment,
                        onDelete: (id) => askConfirmation(unref(t)("comments.deleteConfirm"), () => deletePendingComment(id))
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_sfc_main$c, {
                          comments: pendingComments.value,
                          page: pendingPage.value,
                          "total-pages": pendingTotalPages.value,
                          loading: loadingPending.value,
                          "pending-count": stats.value.pendingComments,
                          "total-count": commentsTotalCount.value,
                          filter: commentsFilter.value,
                          search: pendingSearchQuery.value,
                          "onUpdate:search": ($event) => pendingSearchQuery.value = $event,
                          onSearch: onPendingSearch,
                          onRefresh: ($event) => fetchPendingComments(true),
                          onChangePage: changePendingPage,
                          onChangeFilter: setCommentsFilter,
                          onApprove: approvePendingComment,
                          onUnapprove: unapproveComment,
                          onDelete: (id) => askConfirmation(unref(t)("comments.deleteConfirm"), () => deletePendingComment(id))
                        }, null, 8, ["comments", "page", "total-pages", "loading", "pending-count", "total-count", "filter", "search", "onUpdate:search", "onRefresh", "onDelete"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (role.value === "admin") {
                _push2(ssrRenderComponent(unref(TabsContent), {
                  value: "media",
                  class: "space-y-6"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (mediaLoaded.value) {
                        _push3(ssrRenderComponent(MediaManager, null, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                    } else {
                      return [
                        mediaLoaded.value ? (openBlock(), createBlock(MediaManager, { key: 0 })) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (role.value === "admin") {
                _push2(ssrRenderComponent(unref(TabsContent), {
                  value: "settings",
                  class: "space-y-10"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (brandingLoaded.value) {
                        _push3(`<div class="grid gap-10 lg:grid-cols-2 items-start" data-v-0e0cd714${_scopeId2}>`);
                        _push3(ssrRenderComponent(BrandingMetaForm, null, null, _parent3, _scopeId2));
                        _push3(ssrRenderComponent(LogoUpload, { class: "self-stretch" }, null, _parent3, _scopeId2));
                        _push3(ssrRenderComponent(_sfc_main$2, { class: "self-stretch lg:col-span-2" }, null, _parent3, _scopeId2));
                        _push3(ssrRenderComponent(_sfc_main$1, { class: "self-stretch lg:col-span-2" }, null, _parent3, _scopeId2));
                        _push3(ssrRenderComponent(_sfc_main$9, { class: "self-stretch lg:col-span-2" }, null, _parent3, _scopeId2));
                        _push3(ssrRenderComponent(_sfc_main$8, { class: "self-stretch lg:col-span-2" }, null, _parent3, _scopeId2));
                        _push3(`</div>`);
                      } else {
                        _push3(`<div class="text-sm text-gray-500 dark:text-gray-400 py-10 text-center" data-v-0e0cd714${_scopeId2}>${ssrInterpolate(unref(t)("dashboard.loadingSettings"))}</div>`);
                      }
                    } else {
                      return [
                        brandingLoaded.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid gap-10 lg:grid-cols-2 items-start"
                        }, [
                          createVNode(BrandingMetaForm),
                          createVNode(LogoUpload, { class: "self-stretch" }),
                          createVNode(_sfc_main$2, { class: "self-stretch lg:col-span-2" }),
                          createVNode(_sfc_main$1, { class: "self-stretch lg:col-span-2" }),
                          createVNode(_sfc_main$9, { class: "self-stretch lg:col-span-2" }),
                          createVNode(_sfc_main$8, { class: "self-stretch lg:col-span-2" })
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-sm text-gray-500 dark:text-gray-400 py-10 text-center"
                        }, toDisplayString(unref(t)("dashboard.loadingSettings")), 1))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (role.value === "admin") {
                _push2(ssrRenderComponent(unref(TabsContent), {
                  value: "members",
                  class: "space-y-6"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (membersLoaded.value) {
                        _push3(ssrRenderComponent(_sfc_main$5, null, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<div class="text-sm text-gray-500 dark:text-gray-400 py-10 text-center" data-v-0e0cd714${_scopeId2}>${ssrInterpolate(unref(t)("dashboard.loadingMembers"))}</div>`);
                      }
                    } else {
                      return [
                        membersLoaded.value ? (openBlock(), createBlock(_sfc_main$5, { key: 0 })) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-sm text-gray-500 dark:text-gray-400 py-10 text-center"
                        }, toDisplayString(unref(t)("dashboard.loadingMembers")), 1))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode(unref(TabsList), {
                  class: "relative shrink-0 flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto",
                  "aria-label": unref(t)("dashboard.title")
                }, {
                  default: withCtx(() => [
                    createVNode(unref(TabsIndicator), { class: "absolute px-8 left-0 h-[2px] bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "bg-blue-500 w-full h-full" })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(TabsTrigger), {
                      value: "overview",
                      class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: "mdi:view-dashboard",
                          class: "text-blue-500 dark:text-blue-400 text-lg"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("dashboard.overview")), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(TabsTrigger), {
                      value: "posts",
                      class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: "mdi:post-outline",
                          class: "text-green-500 dark:text-green-400 text-lg"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("posts.title")), 1)
                      ]),
                      _: 1
                    }),
                    role.value === "admin" || role.value === "author" ? (openBlock(), createBlock(unref(TabsTrigger), {
                      key: 0,
                      value: "comments",
                      class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: "mdi:comment-multiple-outline",
                          class: "text-yellow-500 dark:text-yellow-400 text-lg"
                        }),
                        createVNode("span", null, toDisplayString(unref(t)("comments.title")), 1),
                        stats.value.pendingComments > 0 ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-2 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-800/60 dark:text-yellow-200"
                        }, toDisplayString(stats.value.pendingComments), 1)) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    role.value === "admin" ? (openBlock(), createBlock(unref(TabsTrigger), {
                      key: 1,
                      value: "members",
                      class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: "mdi:account-group-outline",
                          class: "text-purple-500 dark:text-purple-400 text-lg"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("members.title")), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    role.value === "admin" ? (openBlock(), createBlock(unref(TabsTrigger), {
                      key: 2,
                      value: "media",
                      class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: "mdi:image-multiple-outline",
                          class: "text-pink-500 dark:text-pink-400 text-lg"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("dashboard.media")), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    role.value === "admin" ? (openBlock(), createBlock(unref(TabsTrigger), {
                      key: 3,
                      value: "settings",
                      class: "px-5 h-11 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: "mdi:cog-outline",
                          class: "text-gray-500 dark:text-gray-300 text-lg"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("dashboard.settings")), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                createVNode(unref(TabsContent), {
                  value: "overview",
                  class: "space-y-8"
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$f, { stats: stats.value }, null, 8, ["stats"])
                  ]),
                  _: 1
                }),
                createVNode(unref(TabsContent), {
                  value: "posts",
                  class: "space-y-6"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center gap-3 justify-between" }, [
                      createVNode("div", { class: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto" }, [
                        createVNode(_sfc_main$b, { onChanged: fetchCategories }),
                        createVNode(_sfc_main$a)
                      ]),
                      createVNode("div", { class: "w-full sm:w-80" }, [
                        createVNode("div", { class: "flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 focus-within:ring-2 focus-within:ring-blue-500 transition" }, [
                          createVNode(unref(Icon), {
                            icon: "mdi:magnify",
                            class: "ml-3 text-gray-400 text-base"
                          }),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                            onInput: onSearchInput,
                            type: "text",
                            placeholder: unref(t)("posts.searchPlaceholder"),
                            class: "flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none",
                            "aria-label": unref(t)("posts.searchPlaceholder")
                          }, null, 40, ["onUpdate:modelValue", "placeholder", "aria-label"]), [
                            [vModelText, searchQuery.value]
                          ]),
                          searchQuery.value ? (openBlock(), createBlock("button", {
                            key: 0,
                            onClick: clearSearch,
                            type: "button",
                            class: "mr-1 inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                            "aria-label": unref(t)("posts.clearSearch")
                          }, [
                            createVNode(unref(Icon), {
                              icon: "mdi:close",
                              class: "text-base"
                            })
                          ], 8, ["aria-label"])) : createCommentVNode("", true)
                        ])
                      ])
                    ]),
                    createVNode(_sfc_main$e, {
                      posts: posts.value,
                      selected: selected.value,
                      "onUpdate:selected": ($event) => selected.value = $event,
                      "current-user": currentUser.value,
                      role: role.value,
                      onToggleAll: toggleAll,
                      onDelete: (id) => askConfirmation(unref(t)("posts.deleteConfirm"), () => deletePost(id)),
                      onEdit: editPost
                    }, {
                      filters: withCtx(() => [
                        createVNode(_sfc_main$d, {
                          "selected-length": selected.value.length,
                          "has-active-filters": hasActivePostFilters.value,
                          onBulkDelete: ($event) => askConfirmation(unref(t)("posts.deleteSelectedConfirm"), bulkDelete),
                          onClearFilters: clearAllPostFilters
                        }, {
                          status: withCtx(() => [
                            createVNode(unref(SelectRoot), {
                              modelValue: statusFilter.value,
                              "onUpdate:modelValue": [($event) => statusFilter.value = $event, applyFilters]
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(SelectTrigger), {
                                  class: filterTriggerClass,
                                  "aria-label": unref(t)("posts.allStatuses")
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                      createVNode(unref(Icon), {
                                        icon: "mdi:circle-slice-8",
                                        class: "text-sm opacity-60 shrink-0"
                                      }),
                                      createVNode(unref(SelectValue), {
                                        placeholder: unref(t)("posts.allStatuses")
                                      }, null, 8, ["placeholder"])
                                    ]),
                                    createVNode(unref(Icon), {
                                      icon: "radix-icons:chevron-down",
                                      class: "w-4 h-4 opacity-70 shrink-0"
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["aria-label"]),
                                createVNode(unref(SelectPortal), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectContent), {
                                      class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                      "side-offset": 5
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectViewport), { class: "p-1" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectGroup), null, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectItem), {
                                                  value: "all",
                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectItemText), null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(unref(t)("posts.allStatuses")), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                (openBlock(true), createBlock(Fragment, null, renderList(status.value, (s) => {
                                                  return openBlock(), createBlock(unref(SelectItem), {
                                                    key: s,
                                                    value: s,
                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectItemText), null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(unref(t)(`posts.status.${s}`)), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["value"]);
                                                }), 128))
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          locale: withCtx(() => [
                            createVNode(unref(SelectRoot), {
                              modelValue: localeFilter.value,
                              "onUpdate:modelValue": [($event) => localeFilter.value = $event, applyFilters]
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(SelectTrigger), {
                                  class: filterTriggerClass,
                                  "aria-label": unref(t)("posts.allLocales")
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                      createVNode(unref(Icon), {
                                        icon: "mdi:translate",
                                        class: "text-sm opacity-60 shrink-0"
                                      }),
                                      createVNode(unref(SelectValue), {
                                        placeholder: unref(t)("posts.allLocales")
                                      }, null, 8, ["placeholder"])
                                    ]),
                                    createVNode(unref(Icon), {
                                      icon: "radix-icons:chevron-down",
                                      class: "w-4 h-4 opacity-70 shrink-0"
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["aria-label"]),
                                createVNode(unref(SelectPortal), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectContent), {
                                      class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                      "side-offset": 5
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectViewport), { class: "p-1" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectGroup), null, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectItem), {
                                                  value: "all",
                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectItemText), null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(unref(t)("posts.allLocales")), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                (openBlock(true), createBlock(Fragment, null, renderList(filterLocales.value, (loc) => {
                                                  return openBlock(), createBlock(unref(SelectItem), {
                                                    key: loc.code,
                                                    value: loc.code,
                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectItemText), null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(loc.name), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["value"]);
                                                }), 128))
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          category: withCtx(() => [
                            createVNode(unref(SelectRoot), {
                              modelValue: categoryFilter.value,
                              "onUpdate:modelValue": [($event) => categoryFilter.value = $event, applyFilters]
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(SelectTrigger), {
                                  class: filterTriggerClass,
                                  "aria-label": unref(t)("posts.allCategories")
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                      createVNode(unref(Icon), {
                                        icon: "mdi:folder-outline",
                                        class: "text-sm opacity-60 shrink-0"
                                      }),
                                      createVNode(unref(SelectValue), {
                                        placeholder: unref(t)("posts.allCategories")
                                      }, null, 8, ["placeholder"])
                                    ]),
                                    createVNode(unref(Icon), {
                                      icon: "radix-icons:chevron-down",
                                      class: "w-4 h-4 opacity-70 shrink-0"
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["aria-label"]),
                                createVNode(unref(SelectPortal), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectContent), {
                                      class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                      "side-offset": 5
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectViewport), { class: "p-1" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectGroup), null, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectItem), {
                                                  value: "all",
                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectItemText), null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(unref(t)("posts.allCategories")), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
                                                  return openBlock(), createBlock(unref(SelectItem), {
                                                    key: c.id,
                                                    value: c.id,
                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectItemText), null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(c.name), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["value"]);
                                                }), 128))
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          author: withCtx(() => [
                            createVNode(unref(SelectRoot), {
                              modelValue: authorFilter.value,
                              "onUpdate:modelValue": [($event) => authorFilter.value = $event, applyFilters]
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(SelectTrigger), {
                                  class: filterTriggerClass,
                                  "aria-label": unref(t)("posts.allAuthors")
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "flex items-center gap-1.5 min-w-0 truncate" }, [
                                      createVNode(unref(Icon), {
                                        icon: "mdi:account-outline",
                                        class: "text-sm opacity-60 shrink-0"
                                      }),
                                      createVNode(unref(SelectValue), {
                                        placeholder: unref(t)("posts.allAuthors")
                                      }, null, 8, ["placeholder"])
                                    ]),
                                    createVNode(unref(Icon), {
                                      icon: "radix-icons:chevron-down",
                                      class: "w-4 h-4 opacity-70 shrink-0"
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["aria-label"]),
                                createVNode(unref(SelectPortal), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectContent), {
                                      class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                                      "side-offset": 5
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectViewport), { class: "p-1" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectGroup), null, {
                                              default: withCtx(() => [
                                                createVNode(unref(SelectItem), {
                                                  value: "all",
                                                  class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(SelectItemText), null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(unref(t)("posts.allAuthors")), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(SelectSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                                                (openBlock(true), createBlock(Fragment, null, renderList(uniqueAuthors.value, (a) => {
                                                  return openBlock(), createBlock(unref(SelectItem), {
                                                    key: a.id,
                                                    value: a.id,
                                                    class: "text-sm leading-none text-gray-700 dark:text-gray-100 rounded flex items-center h-7 pr-8 pl-8 relative select-none cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(Icon), { icon: "radix-icons:check" })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(SelectItemText), null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(a.display_name || a.username), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["value"]);
                                                }), 128))
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectScrollDownButton), { class: "flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), { icon: "radix-icons:chevron-down" })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          date: withCtx(() => [
                            (openBlock(), createBlock(unref(DateRangePickerRoot), {
                              key: dateRangePickerKey.value,
                              modelValue: dateRange.value,
                              "onUpdate:modelValue": [($event) => dateRange.value = $event, onDateRangeChange],
                              locale: "en-GB"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(DateRangePickerField), { class: "h-9 w-full items-center select-none bg-white dark:bg-gray-900/40 rounded-md text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 px-2.5 text-sm gap-0.5 flex focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none" }, {
                                  default: withCtx(({ segments }) => [
                                    createVNode(unref(Icon), {
                                      icon: "mdi:calendar-range",
                                      class: "text-base text-gray-400 shrink-0 mr-1"
                                    }),
                                    (openBlock(true), createBlock(Fragment, null, renderList(segments.start, (item) => {
                                      return openBlock(), createBlock(Fragment, {
                                        key: "s-" + item.part
                                      }, [
                                        item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                          key: 0,
                                          part: item.part,
                                          type: "start",
                                          class: "px-0 text-gray-400"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(item.value), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                          key: 1,
                                          part: item.part,
                                          type: "start",
                                          class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(item.value), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["part"]))
                                      ], 64);
                                    }), 128)),
                                    createVNode("span", { class: "mx-1 text-gray-400" }, "\u2013"),
                                    (openBlock(true), createBlock(Fragment, null, renderList(segments.end, (item) => {
                                      return openBlock(), createBlock(Fragment, {
                                        key: "e-" + item.part
                                      }, [
                                        item.part === "literal" ? (openBlock(), createBlock(unref(DateRangePickerInput), {
                                          key: 0,
                                          part: item.part,
                                          type: "end",
                                          class: "px-0 text-gray-400"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(item.value), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["part"])) : (openBlock(), createBlock(unref(DateRangePickerInput), {
                                          key: 1,
                                          part: item.part,
                                          type: "end",
                                          class: "rounded px-0.5 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/30 data-[placeholder]:text-gray-400"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(item.value), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["part"]))
                                      ], 64);
                                    }), 128)),
                                    createVNode("div", { class: "ml-auto flex items-center gap-0.5 shrink-0" }, [
                                      startDate.value || endDate.value ? (openBlock(), createBlock("button", {
                                        key: 0,
                                        type: "button",
                                        "aria-label": unref(t)("common.clear"),
                                        class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                        onClick: withModifiers(clearDateRange, ["stop"])
                                      }, [
                                        createVNode(unref(Icon), {
                                          icon: "mdi:close",
                                          class: "w-4 h-4"
                                        })
                                      ], 8, ["aria-label"])) : createCommentVNode("", true),
                                      createVNode(unref(DateRangePickerTrigger), { class: "inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), {
                                            icon: "radix-icons:calendar",
                                            class: "w-4 h-4"
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ])
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(DateRangePickerContent), {
                                  "side-offset": 4,
                                  class: "rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 dark:ring-white/10 p-2 z-50"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(DateRangePickerArrow), { class: "fill-white dark:fill-gray-800" }),
                                    createVNode(unref(DateRangePickerCalendar), { class: "p-2" }, {
                                      default: withCtx(({ weekDays, grid }) => [
                                        createVNode(unref(DateRangePickerHeader), { class: "flex items-center justify-between px-2 py-1" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(DateRangePickerPrev), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), {
                                                  icon: "radix-icons:chevron-left",
                                                  class: "w-4 h-4"
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(DateRangePickerHeading), { class: "text-sm font-medium text-gray-900 dark:text-gray-100" }),
                                            createVNode(unref(DateRangePickerNext), { class: "inline-flex items-center cursor-pointer justify-center rounded-md w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), {
                                                  icon: "radix-icons:chevron-right",
                                                  class: "w-4 h-4"
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", { class: "flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(grid, (month) => {
                                            return openBlock(), createBlock(unref(DateRangePickerGrid), {
                                              key: month.value.toString(),
                                              class: "w-full border-collapse select-none space-y-1"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(DateRangePickerGridHead), null, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(DateRangePickerGridRow), { class: "mb-1 flex w-full justify-between" }, {
                                                      default: withCtx(() => [
                                                        (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                                          return openBlock(), createBlock(unref(DateRangePickerHeadCell), {
                                                            key: day,
                                                            class: "w-7 rounded-md text-[10px] font-normal text-gray-500 dark:text-gray-400"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(day), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024);
                                                        }), 128))
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(unref(DateRangePickerGridBody), null, {
                                                  default: withCtx(() => [
                                                    (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index2) => {
                                                      return openBlock(), createBlock(unref(DateRangePickerGridRow), {
                                                        key: "weekDate-" + index2,
                                                        class: "flex w-full"
                                                      }, {
                                                        default: withCtx(() => [
                                                          (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                            return openBlock(), createBlock(unref(DateRangePickerCell), {
                                                              key: weekDate.toString(),
                                                              date: weekDate
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(DateRangePickerCellTrigger), {
                                                                  day: weekDate,
                                                                  month: month.value,
                                                                  class: "relative flex items-center justify-center rounded-full whitespace-nowrap text-xs font-normal w-7 h-7 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 data-[outside-view]:text-gray-400 data-[selected]:!bg-blue-600 data-[selected]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/40 data-[highlighted]:bg-blue-200 dark:data-[highlighted]:bg-blue-800 data-[unavailable]:pointer-events-none data-[unavailable]:text-gray-400 data-[unavailable]:line-through before:absolute before:top-[3px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-blue-500"
                                                                }, null, 8, ["day", "month"])
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["date"]);
                                                          }), 128))
                                                        ]),
                                                        _: 2
                                                      }, 1024);
                                                    }), 128))
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128))
                                        ])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1032, ["modelValue", "onUpdate:modelValue"]))
                          ]),
                          _: 2
                        }, 1032, ["selected-length", "has-active-filters", "onBulkDelete"])
                      ]),
                      _: 2
                    }, 1032, ["posts", "selected", "onUpdate:selected", "current-user", "role", "onDelete"]),
                    createVNode("div", { class: "mt-4 flex items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-300" }, [
                      createVNode("button", {
                        type: "button",
                        onClick: ($event) => changePage(currentPage.value - 1),
                        disabled: currentPage.value === 1,
                        class: "inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:chevron-left",
                          class: "text-base"
                        }),
                        createTextVNode(" " + toDisplayString(unref(t)("common.prev")), 1)
                      ], 8, ["onClick", "disabled"]),
                      createVNode("span", { class: "font-medium tabular-nums" }, toDisplayString(unref(t)("common.page", { current: currentPage.value, total: totalPages.value || 1 })), 1),
                      createVNode("button", {
                        type: "button",
                        onClick: ($event) => changePage(currentPage.value + 1),
                        disabled: currentPage.value === totalPages.value || totalPages.value === 0,
                        class: "inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }, [
                        createTextVNode(toDisplayString(unref(t)("common.next")) + " ", 1),
                        createVNode(unref(Icon), {
                          icon: "mdi:chevron-right",
                          class: "text-base"
                        })
                      ], 8, ["onClick", "disabled"])
                    ])
                  ]),
                  _: 2
                }, 1024),
                role.value === "admin" || role.value === "author" ? (openBlock(), createBlock(unref(TabsContent), {
                  key: 0,
                  value: "comments",
                  class: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$c, {
                      comments: pendingComments.value,
                      page: pendingPage.value,
                      "total-pages": pendingTotalPages.value,
                      loading: loadingPending.value,
                      "pending-count": stats.value.pendingComments,
                      "total-count": commentsTotalCount.value,
                      filter: commentsFilter.value,
                      search: pendingSearchQuery.value,
                      "onUpdate:search": ($event) => pendingSearchQuery.value = $event,
                      onSearch: onPendingSearch,
                      onRefresh: ($event) => fetchPendingComments(true),
                      onChangePage: changePendingPage,
                      onChangeFilter: setCommentsFilter,
                      onApprove: approvePendingComment,
                      onUnapprove: unapproveComment,
                      onDelete: (id) => askConfirmation(unref(t)("comments.deleteConfirm"), () => deletePendingComment(id))
                    }, null, 8, ["comments", "page", "total-pages", "loading", "pending-count", "total-count", "filter", "search", "onUpdate:search", "onRefresh", "onDelete"])
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                role.value === "admin" ? (openBlock(), createBlock(unref(TabsContent), {
                  key: 1,
                  value: "media",
                  class: "space-y-6"
                }, {
                  default: withCtx(() => [
                    mediaLoaded.value ? (openBlock(), createBlock(MediaManager, { key: 0 })) : createCommentVNode("", true)
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                role.value === "admin" ? (openBlock(), createBlock(unref(TabsContent), {
                  key: 2,
                  value: "settings",
                  class: "space-y-10"
                }, {
                  default: withCtx(() => [
                    brandingLoaded.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "grid gap-10 lg:grid-cols-2 items-start"
                    }, [
                      createVNode(BrandingMetaForm),
                      createVNode(LogoUpload, { class: "self-stretch" }),
                      createVNode(_sfc_main$2, { class: "self-stretch lg:col-span-2" }),
                      createVNode(_sfc_main$1, { class: "self-stretch lg:col-span-2" }),
                      createVNode(_sfc_main$9, { class: "self-stretch lg:col-span-2" }),
                      createVNode(_sfc_main$8, { class: "self-stretch lg:col-span-2" })
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-sm text-gray-500 dark:text-gray-400 py-10 text-center"
                    }, toDisplayString(unref(t)("dashboard.loadingSettings")), 1))
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                role.value === "admin" ? (openBlock(), createBlock(unref(TabsContent), {
                  key: 3,
                  value: "members",
                  class: "space-y-6"
                }, {
                  default: withCtx(() => [
                    membersLoaded.value ? (openBlock(), createBlock(_sfc_main$5, { key: 0 })) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-sm text-gray-500 dark:text-gray-400 py-10 text-center"
                    }, toDisplayString(unref(t)("dashboard.loadingMembers")), 1))
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (showConfirm.value) {
          _push(ssrRenderComponent(_sfc_main$g, {
            open: showConfirm.value,
            title: unref(t)("common.confirmAction"),
            description: confirmMessage.value,
            body: unref(t)("common.areYouSure"),
            onConfirm: unref(confirmAction),
            onCancel: closeDialog
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0e0cd714"]]);

export { index as default };
//# sourceMappingURL=index-DMMFlTPT.mjs.map
