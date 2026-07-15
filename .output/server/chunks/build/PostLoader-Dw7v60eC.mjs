import { ref, watch, resolveComponent, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, withModifiers, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { b as useI18n, c as useLocalePath, d as useContentLocale, s as supabase } from './server.mjs';
import { Icon } from '@iconify/vue';
import { M as Markdown } from '../_/vue3-markdown-it.umd.min.mjs';
import { _ as _sfc_main$1 } from './NoImage-Df5cAWv5.mjs';
import { u as useToast } from './useToast-DuA5bmqL.mjs';

const pageSize = 5;
const _sfc_main = {
  __name: "PostLoader",
  __ssrInlineRender: true,
  props: {
    filterBy: {
      type: String,
      default: "home"
    },
    filterValue: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const { contentLocale } = useContentLocale();
    const posts = ref([]);
    const imageErrorMap = ref({});
    function onImageError(id) {
      imageErrorMap.value = { ...imageErrorMap.value, [id]: true };
    }
    const loading = ref(false);
    const noMorePosts = ref(false);
    let offset = 0;
    ref(null);
    const toast = useToast();
    const props = __props;
    function getAuthorName(author) {
      if (!author) return t("common.unknownAuthor");
      return author.display_name || author.username;
    }
    function getAuthorUsername(author) {
      if (!author) return "unknown";
      return author.username || author.display_name || "Unknown";
    }
    function getCategoryName(category) {
      return category ? category.name : t("common.uncategorized");
    }
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    function getExcerptMarkdown(content, maxLength = 200) {
      if (!content) return "";
      const excerpt = content.length > maxLength ? content.slice(0, maxLength) + "..." : content;
      return excerpt;
    }
    async function loadPosts() {
      if (loading.value || noMorePosts.value) return;
      loading.value = true;
      var cat_id = null;
      var author_id = null;
      if (props.filterBy === "category" && props.filterValue) {
        if (props.filterValue.toLowerCase() === "uncategorized") {
          cat_id = null;
        } else {
          const { data: cat, error: catErr } = await supabase.from("categories").select("id").eq("slug", props.filterValue).eq("locale", contentLocale.value).single();
          if (catErr) {
            loading.value = false;
            return;
          }
          cat_id = cat ? cat.id : null;
        }
      } else if (props.filterBy === "author" && props.filterValue) {
        const { data: author, error: authorErr } = await supabase.from("profiles").select("id").eq("username", props.filterValue).single();
        if (authorErr || !author) {
          noMorePosts.value = true;
          loading.value = false;
          return;
        }
        author_id = author.id;
      }
      let query = supabase.from("posts").select(
        `
    id,
    title,
    content,
    tags,
    slug,
    locale,
    cover_image_url,
    created_at,
  category:categories ( id, name, slug, locale ),
    author:profiles ( id, username, display_name, role )
  `
      ).eq("status", "published").eq("locale", contentLocale.value).order("created_at", { ascending: false }).range(offset, offset + pageSize - 1);
      if (props.filterBy === "category" && props.filterValue && props.filterValue.toLowerCase() !== "uncategorized" && cat_id !== null) {
        query.eq("category_id", cat_id);
      } else if (props.filterBy === "author") {
        if (author_id) {
          query.eq("author_id", author_id);
        }
      } else if (props.filterBy === "category" && (props.filterValue.toLowerCase() === "uncategorized" || cat_id === null)) {
        query.is("category_id", null);
      }
      const { data, error } = await query;
      if (error) {
        toast.error(
          error.message ? t("posts.loadFailed", { message: error.message }) : t("posts.loadError")
        );
        loading.value = false;
        return;
      } else {
        if (data.length < pageSize) {
          noMorePosts.value = true;
        }
        posts.value.push(...data);
        offset += pageSize;
      }
      loading.value = false;
    }
    watch(
      [() => props.filterBy, () => props.filterValue, contentLocale],
      () => {
        posts.value = [];
        offset = 0;
        noMorePosts.value = false;
        loadPosts();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-5xl mx-auto" }, _attrs))}>`);
      if (posts.value.length === 0 && loading.value) {
        _push(`<div class="space-y-10"><!--[-->`);
        ssrRenderList(3, (n) => {
          _push(`<div class="animate-pulse bg-white/90 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm"><div class="h-56 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700"></div><div class="p-6 space-y-5"><div class="h-5 w-2/3 bg-gray-200 dark:bg-gray-600 rounded"></div><div class="flex gap-3"><div class="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div><div class="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div><div class="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded"></div></div><div class="space-y-2"><div class="h-3 w-full bg-gray-200 dark:bg-gray-600 rounded"></div><div class="h-3 w-11/12 bg-gray-200 dark:bg-gray-600 rounded"></div><div class="h-3 w-4/5 bg-gray-200 dark:bg-gray-600 rounded"></div></div><div class="h-9 w-32 bg-gray-200 dark:bg-gray-600 rounded-md"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (posts.value.length === 0 && !loading.value) {
        _push(`<div class="relative text-center py-24 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700/70 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm"><div class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 opacity-60"></div>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:note-remove",
          class: "block mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4"
        }, null, _parent));
        _push(`<p class="text-sm text-gray-600 dark:text-gray-400 font-medium">${ssrInterpolate(unref(t)("posts.noPosts"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-12"><!--[-->`);
      ssrRenderList(posts.value, (post) => {
        var _a;
        _push(`<article class="group relative bg-white/95 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/posts/${post.slug}`),
          class: "block group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="relative w-full aspect-[16/8] md:aspect-[16/6] overflow-hidden bg-gray-100 dark:bg-gray-700"${_scopeId}>`);
              if (post.cover_image_url && !imageErrorMap.value[post.id]) {
                _push2(`<img${ssrRenderAttr("src", post.cover_image_url)}${ssrRenderAttr("alt", post.title)} class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]" loading="lazy" draggable="false"${_scopeId}>`);
              } else {
                _push2(`<div class="flex items-center justify-center h-full"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
                _push2(`</div>`);
              }
              _push2(`<div class="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"${_scopeId}></div></div>`);
            } else {
              return [
                createVNode("div", { class: "relative w-full aspect-[16/8] md:aspect-[16/6] overflow-hidden bg-gray-100 dark:bg-gray-700" }, [
                  post.cover_image_url && !imageErrorMap.value[post.id] ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: post.cover_image_url,
                    alt: post.title,
                    class: "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]",
                    loading: "lazy",
                    draggable: "false",
                    onDragstart: withModifiers(() => {
                    }, ["prevent"]),
                    onError: ($event) => onImageError(post.id)
                  }, null, 40, ["src", "alt", "onDragstart", "onError"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "flex items-center justify-center h-full"
                  }, [
                    createVNode(_sfc_main$1)
                  ])),
                  createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" })
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<div class="p-6 md:p-8"><div class="flex flex-wrap items-center gap-3 text-[11px] font-medium mb-4">`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/category/${((_a = post.category) == null ? void 0 : _a.slug) || "uncategorized"}`),
          class: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:folder",
                class: "text-sm"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(getCategoryName(post.category))}`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:folder",
                  class: "text-sm"
                }),
                createTextVNode(" " + toDisplayString(getCategoryName(post.category)), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:calendar",
          class: "text-sm"
        }, null, _parent));
        _push(` ${ssrInterpolate(formatDate(post.created_at))}</span>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/author/${getAuthorUsername(post.author)}`),
          class: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:account",
                class: "text-sm"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(getAuthorName(post.author))}`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:account",
                  class: "text-sm"
                }),
                createTextVNode(" " + toDisplayString(getAuthorName(post.author)), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/posts/${post.slug}`),
          class: "group/title block mb-3"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors"${_scopeId}>${ssrInterpolate(post.title)}</h2>`);
            } else {
              return [
                createVNode("h2", { class: "text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors" }, toDisplayString(post.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<div class="text-sm text-gray-600 dark:text-gray-300 mb-6">`);
        _push(ssrRenderComponent(unref(Markdown), {
          source: getExcerptMarkdown(post == null ? void 0 : post.content, 160),
          class: "markdown-content",
          ref_for: true,
          ref: "markdownContainer"
        }, null, _parent));
        _push(`</div><div class="flex items-center justify-between">`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/posts/${post.slug}`),
          class: "inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:arrow-right",
                class: "text-base"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("common.readMore"))}`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:arrow-right",
                  class: "text-base"
                }),
                createTextVNode(" " + toDisplayString(unref(t)("common.readMore")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div></article>`);
      });
      _push(`<!--]--></div><div class="h-12"></div>`);
      if (loading.value && posts.value.length > 0) {
        _push(`<div class="flex justify-center py-8">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:loading",
          class: "animate-spin text-blue-500",
          width: "32"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (noMorePosts.value && posts.value.length > 0) {
        _push(`<div class="text-center text-gray-500 mt-8 text-sm">${ssrInterpolate(unref(t)("posts.noMore"))}</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PostLoader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=PostLoader-Dw7v60eC.mjs.map
