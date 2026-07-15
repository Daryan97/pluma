import { ref, computed, withAsyncContext, watch, resolveComponent, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, withModifiers, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath, b as useContentLocale, f as useAsyncData, s as supabase } from './server.mjs';
import { Icon } from '@iconify/vue';
import { M as Markdown } from '../_/vue3-markdown-it.umd.min.mjs';
import { _ as _sfc_main$1 } from './NoImage-Df5cAWv5.mjs';

function countDistinctPosts(rows) {
  if (!Array.isArray(rows) || !rows.length) return 0;
  const keys = /* @__PURE__ */ new Set();
  for (const row of rows) {
    if (!row) continue;
    keys.add(row.translation_group_id || row.id);
  }
  return keys.size;
}
async function countLogicalPosts(supabase2, applyFilters) {
  let query = supabase2.from("posts").select("id, translation_group_id");
  if (typeof applyFilters === "function") {
    query = applyFilters(query) || query;
  }
  const { data, error } = await query;
  if (error) return { count: 0, error };
  return { count: countDistinctPosts(data), error: null };
}
async function resolveCategoryFilter(supabase2, slug, locale) {
  if (!slug || String(slug).toLowerCase() === "uncategorized") {
    return { category: null, categoryIds: null };
  }
  const { data: bySlug, error } = await supabase2.from("categories").select("id, name, slug, locale, translation_group_id").eq("slug", slug);
  if (error) {
    return { category: null, categoryIds: [], error };
  }
  let rows = bySlug || [];
  if (!rows.length) {
    const { data: fuzzy } = await supabase2.from("categories").select("id, name, slug, locale, translation_group_id").ilike("slug", slug);
    rows = fuzzy || [];
  }
  if (!rows.length) {
    return { category: null, categoryIds: [] };
  }
  const groupIds = [
    ...new Set(rows.map((r) => r.translation_group_id).filter(Boolean))
  ];
  if (groupIds.length) {
    const { data: siblings } = await supabase2.from("categories").select("id, name, slug, locale, translation_group_id").in("translation_group_id", groupIds);
    if (siblings == null ? void 0 : siblings.length) {
      const byId = new Map(rows.map((r) => [r.id, r]));
      for (const s of siblings) byId.set(s.id, s);
      rows = [...byId.values()];
    }
  }
  const category = rows.find((r) => r.locale === locale) || rows.find((r) => r.slug === slug) || rows[0];
  return {
    category,
    categoryIds: [...new Set(rows.map((r) => r.id))],
    error: null
  };
}
async function loadCategoriesForLocale(supabase2, locale) {
  const [{ data: native }, { data: postCats }] = await Promise.all([
    supabase2.from("categories").select("id, name, slug, locale, translation_group_id").eq("locale", locale).order("name"),
    supabase2.from("posts").select("category_id, category:categories ( id, name, slug, locale, translation_group_id )").eq("status", "published").eq("locale", locale).not("category_id", "is", null)
  ]);
  const bySlug = /* @__PURE__ */ new Map();
  for (const c of native || []) {
    if (c == null ? void 0 : c.slug) bySlug.set(c.slug, c);
  }
  for (const row of postCats || []) {
    const c = row == null ? void 0 : row.category;
    if (!(c == null ? void 0 : c.slug)) continue;
    const existing = bySlug.get(c.slug);
    if (!existing || c.locale === locale && existing.locale !== locale) {
      bySlug.set(c.slug, c);
    }
  }
  return [...bySlug.values()].sort(
    (a, b) => String(a.name || "").localeCompare(String(b.name || ""))
  );
}
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
  async setup(__props) {
    let __temp, __restore;
    const { t } = useI18n();
    const localePath = useLocalePath();
    const { contentLocale } = useContentLocale();
    const posts = ref([]);
    const imageErrorMap = ref({});
    function onImageError(id) {
      imageErrorMap.value = { ...imageErrorMap.value, [id]: true };
    }
    const loading = ref(false);
    const refreshing = ref(false);
    const noMorePosts = ref(false);
    let skipNextClientReset = false;
    ref(null);
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
    async function queryPostsPage({ from, to, locale }) {
      let cat_ids = null;
      let author_id = null;
      if (props.filterBy === "category" && props.filterValue) {
        if (props.filterValue.toLowerCase() !== "uncategorized") {
          const { categoryIds, error: catErr } = await resolveCategoryFilter(
            supabase,
            props.filterValue,
            locale
          );
          if (catErr || !(categoryIds == null ? void 0 : categoryIds.length)) {
            return { rows: [], exhausted: true };
          }
          cat_ids = categoryIds;
        }
      } else if (props.filterBy === "author" && props.filterValue) {
        const { data: author, error: authorErr } = await supabase.from("profiles").select("id").eq("username", props.filterValue).maybeSingle();
        if (authorErr || !author) {
          return { rows: [], exhausted: true };
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
      ).eq("status", "published").eq("locale", locale).order("created_at", { ascending: false }).range(from, to);
      if (props.filterBy === "category" && props.filterValue && props.filterValue.toLowerCase() !== "uncategorized") {
        if (cat_ids == null ? void 0 : cat_ids.length) {
          query = query.in("category_id", cat_ids);
        }
      } else if (props.filterBy === "author") {
        if (author_id) {
          query = query.eq("author_id", author_id);
        }
      } else if (props.filterBy === "category" && props.filterValue.toLowerCase() === "uncategorized") {
        query = query.is("category_id", null);
      }
      const { data, error } = await query;
      if (error) throw error;
      const rows = data || [];
      return { rows, exhausted: rows.length < pageSize };
    }
    const asyncKey = computed(
      () => `posts-${props.filterBy}-${props.filterValue || "all"}-${contentLocale.value}`
    );
    const { data: initialPage, pending: initialPending } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      asyncKey,
      async () => {
        const { rows, exhausted } = await queryPostsPage({
          from: 0,
          to: pageSize - 1,
          locale: contentLocale.value
        });
        return { rows, exhausted };
      },
      {
        watch: [() => props.filterBy, () => props.filterValue, contentLocale],
        server: true
      }
    )), __temp = await __temp, __restore(), __temp);
    watch(
      initialPage,
      (page) => {
        if (!page) return;
        posts.value = page.rows || [];
        noMorePosts.value = !!page.exhausted;
        (page.rows || []).length;
        loading.value = false;
        refreshing.value = false;
        skipNextClientReset = true;
      },
      { immediate: true }
    );
    watch(initialPending, (p) => {
      if (p && posts.value.length === 0) loading.value = true;
      if (!p) loading.value = false;
    }, { immediate: true });
    watch(
      [() => props.filterBy, () => props.filterValue, contentLocale],
      () => {
        if (skipNextClientReset) {
          skipNextClientReset = false;
          return;
        }
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
      _push(`<div class="${ssrRenderClass([{ "opacity-50 pointer-events-none": refreshing.value && posts.value.length > 0 }, "space-y-12 transition-opacity duration-200"])}"><!--[-->`);
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
                _push2(`<img${ssrRenderAttr("src", post.cover_image_url)}${ssrRenderAttr("alt", post.title)} width="1200" height="675" class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]" loading="lazy" decoding="async" draggable="false"${_scopeId}>`);
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
                    width: "1200",
                    height: "675",
                    class: "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]",
                    loading: "lazy",
                    decoding: "async",
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

export { _sfc_main as _, countLogicalPosts as c, loadCategoriesForLocale as l, resolveCategoryFilter as r };
//# sourceMappingURL=PostLoader-DXP-J1UD.mjs.map
