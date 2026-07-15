import { mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { Icon } from '@iconify/vue';

const _sfc_main = {
  __name: "NoImage",
  __ssrInlineRender: true,
  props: {
    plain: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative flex flex-col items-center justify-center w-full h-full select-none overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-blue-950 text-gray-500 dark:text-gray-300",
        "aria-hidden": "true"
      }, _attrs))}><div class="pointer-events-none absolute -top-12 -right-10 w-48 h-48 rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-2xl"></div><div class="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-indigo-200/30 dark:bg-indigo-600/10 blur-2xl"></div>`);
      if (__props.plain !== true) {
        _push(`<div class="relative z-10 flex flex-col items-center gap-3"><div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-sm">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:image-off",
          class: "text-3xl text-blue-500 dark:text-blue-400"
        }, null, _parent));
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NoImage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=NoImage-Df5cAWv5.mjs.map
