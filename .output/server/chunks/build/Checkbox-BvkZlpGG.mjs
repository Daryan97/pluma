import { computed, unref, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { Icon } from '@iconify/vue';
import { CheckboxRoot, CheckboxIndicator } from 'radix-vue';

const _sfc_main = {
  __name: "Checkbox",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: [Boolean, String], default: false },
    checked: { type: [Boolean, String], default: void 0 },
    indeterminate: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    name: { type: String, default: void 0 },
    value: { type: String, default: "on" },
    ariaLabel: { type: String, default: void 0 },
    size: { type: String, default: "md" }
  },
  emits: ["update:modelValue", "update:checked", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const resolvedChecked = computed(() => {
      if (props.indeterminate) return "indeterminate";
      if (props.checked !== void 0) return props.checked;
      return props.modelValue;
    });
    const rootClass = computed(() => {
      const size = props.size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
      return [
        size,
        "inline-flex items-center justify-center shrink-0 rounded-[5px] border transition",
        "border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-900/50",
        "text-transparent data-[state=checked]:text-white data-[state=indeterminate]:text-white",
        "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600",
        "data-[state=indeterminate]:bg-blue-600 data-[state=indeterminate]:border-blue-600",
        "hover:border-blue-400 dark:hover:border-blue-400",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "dark:focus-visible:ring-offset-gray-900",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300",
        "cursor-pointer"
      ].join(" ");
    });
    function onUpdate(val) {
      const next = val === "indeterminate" ? false : !!val;
      emit("update:modelValue", next);
      emit("update:checked", next);
      emit("change", next);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CheckboxRoot), mergeProps({
        checked: resolvedChecked.value,
        disabled: __props.disabled,
        required: __props.required,
        name: __props.name,
        value: __props.value,
        class: rootClass.value,
        "aria-label": __props.ariaLabel,
        "onUpdate:checked": onUpdate
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(CheckboxIndicator), { class: "flex items-center justify-center text-current" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: __props.indeterminate ? "mdi:minus" : "mdi:check",
                    class: "w-3.5 h-3.5"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Icon), {
                      icon: __props.indeterminate ? "mdi:minus" : "mdi:check",
                      class: "w-3.5 h-3.5"
                    }, null, 8, ["icon"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(CheckboxIndicator), { class: "flex items-center justify-center text-current" }, {
                default: withCtx(() => [
                  createVNode(unref(Icon), {
                    icon: __props.indeterminate ? "mdi:minus" : "mdi:check",
                    class: "w-3.5 h-3.5"
                  }, null, 8, ["icon"])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Checkbox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Checkbox-BvkZlpGG.mjs.map
