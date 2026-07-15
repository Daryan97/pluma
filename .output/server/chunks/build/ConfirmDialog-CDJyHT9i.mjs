import { computed, unref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';
import { Icon } from '@iconify/vue';
import { b as useI18n } from './server.mjs';

const _sfc_main = {
  __name: "ConfirmDialog",
  __ssrInlineRender: true,
  props: {
    open: Boolean,
    title: String,
    description: String,
    body: { type: String, default: "" },
    confirmLabel: { type: String, default: null },
    cancelLabel: { type: String, default: null },
    tone: { type: String, default: "danger" },
    // 'danger' | 'soft'
    icon: { type: String, default: "mdi:alert-circle-outline" }
  },
  emits: ["confirm", "cancel"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    const props = __props;
    const confirmText = computed(() => props.confirmLabel || t("common.confirm"));
    const cancelText = computed(() => props.cancelLabel || t("common.cancel"));
    const emit = __emit;
    const confirm = () => emit("confirm");
    const cancel = () => emit("cancel");
    const setIsOpen = () => emit("cancel");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Dialog), mergeProps({
        open: __props.open,
        onClose: setIsOpen,
        class: "relative z-50"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="fixed inset-0 bg-black/30 backdrop-blur-sm"${_scopeId}></div><div class="fixed inset-0 flex items-center justify-center p-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DialogPanel), { class: "w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(DialogTitle), { class: "text-xl font-bold text-gray-800 dark:text-white flex items-center" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Icon), {
                          icon: __props.icon,
                          class: ["w-6 h-6 inline-block mr-2", __props.tone === "soft" ? "text-blue-500" : "text-red-600"],
                          "aria-hidden": "true"
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(__props.title)}`);
                      } else {
                        return [
                          createVNode(unref(Icon), {
                            icon: __props.icon,
                            class: ["w-6 h-6 inline-block mr-2", __props.tone === "soft" ? "text-blue-500" : "text-red-600"],
                            "aria-hidden": "true"
                          }, null, 8, ["icon", "class"]),
                          createTextVNode(" " + toDisplayString(__props.title), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(DialogDescription), { class: "text-sm text-gray-600 dark:text-gray-300 mt-1" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(__props.description)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(__props.description), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (__props.body) {
                    _push3(`<p class="mt-4 text-sm text-gray-700 dark:text-gray-400"${_scopeId2}>${ssrInterpolate(__props.body)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="mt-6 flex justify-end gap-3"${_scopeId2}><button class="${ssrRenderClass([
                    __props.tone === "soft" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:ring-blue-500" : "bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:ring-gray-400",
                    "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2"
                  ])}"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: __props.tone === "soft" ? "mdi:heart" : "mdi:close-circle-outline",
                    class: "w-4 h-4",
                    "aria-hidden": "true"
                  }, null, _parent3, _scopeId2));
                  _push3(`<span${_scopeId2}>${ssrInterpolate(cancelText.value)}</span></button><button class="${ssrRenderClass([
                    __props.tone === "soft" ? "bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:ring-gray-400" : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:ring-red-500",
                    "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2"
                  ])}"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: __props.tone === "soft" ? "mdi:eye-off-outline" : "mdi:check-circle-outline",
                    class: "w-4 h-4",
                    "aria-hidden": "true"
                  }, null, _parent3, _scopeId2));
                  _push3(`<span${_scopeId2}>${ssrInterpolate(confirmText.value)}</span></button></div>`);
                } else {
                  return [
                    createVNode(unref(DialogTitle), { class: "text-xl font-bold text-gray-800 dark:text-white flex items-center" }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: __props.icon,
                          class: ["w-6 h-6 inline-block mr-2", __props.tone === "soft" ? "text-blue-500" : "text-red-600"],
                          "aria-hidden": "true"
                        }, null, 8, ["icon", "class"]),
                        createTextVNode(" " + toDisplayString(__props.title), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(DialogDescription), { class: "text-sm text-gray-600 dark:text-gray-300 mt-1" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(__props.description), 1)
                      ]),
                      _: 1
                    }),
                    __props.body ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-4 text-sm text-gray-700 dark:text-gray-400"
                    }, toDisplayString(__props.body), 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "mt-6 flex justify-end gap-3" }, [
                      createVNode("button", {
                        onClick: cancel,
                        class: [
                          "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2",
                          __props.tone === "soft" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:ring-blue-500" : "bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:ring-gray-400"
                        ]
                      }, [
                        createVNode(unref(Icon), {
                          icon: __props.tone === "soft" ? "mdi:heart" : "mdi:close-circle-outline",
                          class: "w-4 h-4",
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        createVNode("span", null, toDisplayString(cancelText.value), 1)
                      ], 2),
                      createVNode("button", {
                        onClick: confirm,
                        class: [
                          "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2",
                          __props.tone === "soft" ? "bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:ring-gray-400" : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:ring-red-500"
                        ]
                      }, [
                        createVNode(unref(Icon), {
                          icon: __props.tone === "soft" ? "mdi:eye-off-outline" : "mdi:check-circle-outline",
                          class: "w-4 h-4",
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        createVNode("span", null, toDisplayString(confirmText.value), 1)
                      ], 2)
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
                createVNode(unref(DialogPanel), { class: "w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl" }, {
                  default: withCtx(() => [
                    createVNode(unref(DialogTitle), { class: "text-xl font-bold text-gray-800 dark:text-white flex items-center" }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: __props.icon,
                          class: ["w-6 h-6 inline-block mr-2", __props.tone === "soft" ? "text-blue-500" : "text-red-600"],
                          "aria-hidden": "true"
                        }, null, 8, ["icon", "class"]),
                        createTextVNode(" " + toDisplayString(__props.title), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(DialogDescription), { class: "text-sm text-gray-600 dark:text-gray-300 mt-1" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(__props.description), 1)
                      ]),
                      _: 1
                    }),
                    __props.body ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-4 text-sm text-gray-700 dark:text-gray-400"
                    }, toDisplayString(__props.body), 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "mt-6 flex justify-end gap-3" }, [
                      createVNode("button", {
                        onClick: cancel,
                        class: [
                          "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2",
                          __props.tone === "soft" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:ring-blue-500" : "bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:ring-gray-400"
                        ]
                      }, [
                        createVNode(unref(Icon), {
                          icon: __props.tone === "soft" ? "mdi:heart" : "mdi:close-circle-outline",
                          class: "w-4 h-4",
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        createVNode("span", null, toDisplayString(cancelText.value), 1)
                      ], 2),
                      createVNode("button", {
                        onClick: confirm,
                        class: [
                          "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2",
                          __props.tone === "soft" ? "bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:ring-gray-400" : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:ring-red-500"
                        ]
                      }, [
                        createVNode(unref(Icon), {
                          icon: __props.tone === "soft" ? "mdi:eye-off-outline" : "mdi:check-circle-outline",
                          class: "w-4 h-4",
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        createVNode("span", null, toDisplayString(confirmText.value), 1)
                      ], 2)
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmDialog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ConfirmDialog-CDJyHT9i.mjs.map
