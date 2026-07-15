import { ref, computed, watch, resolveComponent, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, withModifiers, withDirectives, withKeys, vModelText, vShow, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { TagsInputRoot, TagsInputItem, TagsInputItemText, TagsInputItemDelete, TagsInputInput, SelectRoot, SelectTrigger, SelectValue, SelectPortal, SelectContent, SelectScrollUpButton, SelectViewport, SelectGroup, SelectItem, SelectItemIndicator, SelectItemText, SelectScrollDownButton } from 'radix-vue';
import { b as useI18n, c as useLocalePath, d as useContentLocale, f as useBranding, s as supabase } from './server.mjs';
import { MdEditor } from 'md-editor-v3';
import { RadioGroup, RadioGroupOption } from '@headlessui/vue';
import { Icon } from '@iconify/vue';
import { _ as _sfc_main$1 } from './NoImage-Df5cAWv5.mjs';
import { _ as _sfc_main$2 } from './ConfirmDialog-CDJyHT9i.mjs';
import { u as useToast } from './useToast-DuA5bmqL.mjs';

const _sfc_main = {
  __name: "PostForm",
  __ssrInlineRender: true,
  props: {
    mode: { type: String, required: true },
    postId: String
  },
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const props = __props;
    const currentMode = ref(props.mode);
    const currentPostId = ref(props.postId || null);
    useRouter();
    const toast = useToast();
    const isDarkTheme = ref((void 0).body.dataset.theme === "dark");
    new MutationObserver(() => {
      isDarkTheme.value = (void 0).body.dataset.theme === "dark";
    });
    const title = ref("");
    const slug = ref("");
    const content = ref("");
    const tagItems = ref([]);
    const status = ref("published");
    const originalStatus = ref(null);
    const category = ref(null);
    const thumbnailFile = ref(null);
    ref(null);
    const thumbnailUrl = ref("");
    const thumbnailMode = ref("upload");
    const previewUrl = ref("");
    const previewImageError = ref(false);
    let objectUrlRef = null;
    const commentsDisabled = ref(false);
    const dragThumb = ref(false);
    const user = ref(null);
    const authorId = ref(null);
    const authorDisplay = ref("");
    const authorAvatar = ref(null);
    const authors = ref([]);
    const canChangeAuthor = computed(() => {
      const u = user.value;
      return !!(u && u.role === "admin" && !fieldsLocked.value);
    });
    const selectedAuthor = computed(() => {
      if (!authorId.value) return null;
      const list = authors.value || [];
      return list.find((a) => a.id === authorId.value) || (user.value && user.value.id === authorId.value ? user.value : null);
    });
    function roleAvatarBg(role) {
      if (role === "admin") return "bg-red-100 dark:bg-red-900/40";
      if (role === "author") return "bg-blue-100 dark:bg-blue-900/40";
      return "bg-gray-200 dark:bg-gray-600";
    }
    function onAuthorSelect(val) {
      var _a;
      if (!val) return;
      if (authors.value.length === 0 && ((_a = user.value) == null ? void 0 : _a.role) === "admin") {
        fetchAuthors();
      }
      const found = authors.value.find((a) => a.id === val) || (user.value && user.value.id === val ? user.value : null);
      if (found) {
        authorDisplay.value = found.display_name || found.username || "Unknown";
        authorAvatar.value = found.avatar_url || null;
      }
    }
    const categories = ref([]);
    const newCategoryName = ref("");
    const creatingCategory = ref(false);
    const seriesList = ref([]);
    const seriesId = ref("none");
    const seriesOrder = ref(null);
    const scheduledAtLocal = ref("");
    ref(null);
    const copyingPreview = ref(false);
    const { contentLocale, locales: contentLocales } = useContentLocale();
    const { primaryLocale, brandingLoaded } = useBranding();
    const postLocales = ref([primaryLocale.value || contentLocale.value || "en"]);
    const postLocale = computed({
      get: () => postLocales.value[0] || "en",
      set: (code) => {
        if (!code) return;
        if (!postLocales.value.includes(code)) {
          postLocales.value = [code, ...postLocales.value];
        } else {
          postLocales.value = [code, ...postLocales.value.filter((c) => c !== code)];
        }
      }
    });
    ref(null);
    const translationSiblings = ref([]);
    ref(false);
    const removingTranslation = ref(false);
    watch(
      () => [brandingLoaded.value, primaryLocale.value],
      () => {
        if (currentMode.value !== "create" || !brandingLoaded.value) return;
        if (primaryLocale.value) postLocales.value = [primaryLocale.value];
      }
    );
    const showRemoveTranslationConfirm = ref(false);
    const removeTranslationMessage = ref("");
    const pendingRemoveSibling = ref(null);
    function cancelRemoveTranslation() {
      showRemoveTranslationConfirm.value = false;
      pendingRemoveSibling.value = null;
      removeTranslationMessage.value = "";
    }
    async function confirmRemoveTranslation() {
      const sibling = pendingRemoveSibling.value;
      showRemoveTranslationConfirm.value = false;
      pendingRemoveSibling.value = null;
      removeTranslationMessage.value = "";
      if (!(sibling == null ? void 0 : sibling.id) || removingTranslation.value) return;
      removingTranslation.value = true;
      try {
        const { error } = await supabase.from("posts").delete().eq("id", sibling.id);
        if (error) throw new Error(error.message);
        translationSiblings.value = translationSiblings.value.filter(
          (s) => s.id !== sibling.id
        );
        postLocales.value = postLocales.value.filter((c) => c !== sibling.locale);
        toast.success(t("postForm.translationRemoved"));
      } catch (e) {
        toast.error((e == null ? void 0 : e.message) || t("postForm.genericFailed"));
      } finally {
        removingTranslation.value = false;
      }
    }
    watch(
      postLocale,
      () => {
        fetchCategories();
        fetchSeries();
        checkSlug();
      }
    );
    const statusOptions = ["published", "draft", "archived"];
    const displayedStatusOptions = computed(
      () => currentMode.value === "edit" ? statusOptions : statusOptions.filter((s) => s !== "draft")
    );
    const statusIcon = {
      published: "mdi:check-circle",
      draft: "mdi:file-document-outline",
      archived: "mdi:archive"
    };
    const thumbnailOptions = computed(() => [
      { value: "upload", label: t("postForm.uploadImage"), icon: "mdi:upload" },
      { value: "url", label: t("postForm.imageUrl"), icon: "mdi:image" }
    ]);
    const inputClasses = computed(
      () => `w-full rounded-md px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`
    );
    const selectedCategoryName = computed(() => {
      const cat = categories.value.find((c) => c.id === category.value);
      return cat ? cat.name : null;
    });
    const manuallyEditedSlug = ref(false);
    const fieldsLocked = computed(
      () => status.value === "archived" && originalStatus.value === "archived"
    );
    const publishButtonLabel = computed(() => {
      if (submitting.value && !savingDraft.value) {
        if (status.value === "draft") return t("postForm.publishingBtn");
        return status.value === "archived" ? t("postForm.updatingBtn") : props.mode === "create" ? t("postForm.creatingBtn") : t("postForm.updatingBtn");
      }
      if (status.value === "draft") return t("postForm.publishPost");
      if (status.value === "archived")
        return originalStatus.value === "archived" ? t("postForm.archivedLabel") : t("postForm.archivePost");
      return props.mode === "create" ? t("postForm.publishPost") : t("postForm.updatePost");
    });
    const slugAvailable = ref(null);
    const slugError = ref("");
    const checkingSlug = ref(false);
    function slugifyFinal(raw) {
      return raw.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
    }
    async function isSlugTaken(testSlug, localeCode = null) {
      if (!testSlug) return false;
      const loc = localeCode || postLocale.value || "en";
      const query = supabase.from("posts").select("id", { count: "exact" }).eq("slug", testSlug).eq("locale", loc).limit(1);
      if (currentMode.value === "edit" && currentPostId.value) {
        query.neq("id", currentPostId.value);
      }
      const { data, error, count } = await query;
      if (error) return false;
      if (count && count > 0) {
        if (currentMode.value === "edit" && (data == null ? void 0 : data.length) && data[0].id === currentPostId.value) {
          return false;
        }
        return true;
      }
      return false;
    }
    async function suggestUniqueSlug(baseTitle) {
      const base = slugifyFinal(baseTitle);
      if (!base) return "";
      let candidate = base;
      let i = 1;
      while (await isSlugTaken(candidate)) {
        candidate = `${base}-${i}`;
        i++;
        if (i > 50) break;
      }
      return candidate;
    }
    async function autoFillSlug() {
      if (manuallyEditedSlug.value) return;
      if (!title.value) {
        slug.value = "";
        return;
      }
      checkingSlug.value = true;
      const suggestion = await suggestUniqueSlug(title.value);
      slug.value = suggestion;
      checkingSlug.value = false;
      await checkSlug();
    }
    async function checkSlug() {
      slugError.value = "";
      const current = slug.value;
      if (!current) {
        slugAvailable.value = null;
        return;
      }
      if (!/^[a-z0-9-]+$/.test(current)) {
        slugError.value = t("postForm.slugInvalid");
        slugAvailable.value = false;
        return;
      }
      checkingSlug.value = true;
      const taken = await isSlugTaken(current);
      slugAvailable.value = !taken;
      if (taken) slugError.value = t("postForm.slugTaken");
      checkingSlug.value = false;
    }
    watch(title, () => {
      autoFillSlug();
    });
    const exclude = [
      "sub",
      "sup",
      "codeRow",
      "mermaid",
      "katex",
      "save",
      "=",
      "previewOnly",
      "htmlPreview",
      "catalog",
      "github"
    ];
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*").eq("locale", postLocale.value || "en");
      if (error) toast.error(t("postForm.categoriesLoadFailed"));
      else categories.value = data;
    };
    const fetchSeries = async () => {
      const { data, error } = await supabase.from("series").select("id, name, slug, locale").eq("locale", postLocale.value || "en").order("name");
      if (!error && data) seriesList.value = data;
    };
    function slugifyCategory(raw) {
      return raw.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
    }
    async function createCategoryInline() {
      var _a;
      const name = newCategoryName.value.trim();
      if (!name || creatingCategory.value || fieldsLocked.value) return;
      if (name.toLowerCase() === "uncategorized") {
        toast.error(t("categories.reserved"));
        return;
      }
      if (categories.value.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
        toast.error(t("categories.exists"));
        return;
      }
      creatingCategory.value = true;
      try {
        let baseSlug = slugifyCategory(name) || Date.now().toString();
        let uniqueSlug = baseSlug;
        let i = 1;
        while (categories.value.some((c) => c.slug === uniqueSlug)) {
          uniqueSlug = `${baseSlug}-${i++}`;
          if (i > 100) break;
        }
        const { data, error } = await supabase.from("categories").insert({
          name,
          slug: uniqueSlug,
          locale: postLocale.value || "en",
          translation_group_id: ((_a = crypto.randomUUID) == null ? void 0 : _a.call(crypto)) || void 0
        }).select("*").single();
        if (error) throw error;
        categories.value = [...categories.value, data].sort(
          (a, b) => a.name.localeCompare(b.name)
        );
        category.value = data.id;
        newCategoryName.value = "";
        toast.success(t("postForm.categoryCreated"));
      } catch (e) {
        console.error(e);
        toast.error(e.message || t("postForm.categoryCreateFailed"));
      } finally {
        creatingCategory.value = false;
      }
    }
    async function fetchAuthors() {
      const { data, error } = await supabase.from("profiles").select("id, username, display_name, avatar_url, role").in("role", ["admin", "author"]);
      if (!error && data) {
        authors.value = data.sort(
          (a, b) => (a.display_name || a.username || "").localeCompare(
            b.display_name || b.username || ""
          )
        );
        if (authorId.value && !authors.value.find((a) => a.id === authorId.value)) {
          const currentAuthor = data.find((a) => a.id === authorId.value);
          if (currentAuthor) authors.value.push(currentAuthor);
        }
      }
    }
    const submitting = ref(false);
    const savingDraft = ref(false);
    watch([authorId, authors], () => {
      if (!authorId.value) return;
      const a = authors.value.find((x) => x.id === authorId.value);
      if (a) {
        authorDisplay.value = a.display_name || a.username || "Unknown";
        authorAvatar.value = a.avatar_url || null;
      } else if (user.value && user.value.id === authorId.value) {
        authorDisplay.value = user.value.display_name || user.value.username || "Unknown";
        authorAvatar.value = user.value.avatar_url || null;
      }
    });
    function revokeObjectUrl() {
      if (objectUrlRef) {
        URL.revokeObjectURL(objectUrlRef);
        objectUrlRef = null;
      }
    }
    function updatePreview() {
      revokeObjectUrl();
      if (thumbnailMode.value === "upload" && thumbnailFile.value) {
        objectUrlRef = URL.createObjectURL(thumbnailFile.value);
        previewUrl.value = objectUrlRef;
      } else if (thumbnailMode.value === "url" && thumbnailUrl.value) {
        previewUrl.value = thumbnailUrl.value.trim();
      } else {
        previewUrl.value = "";
      }
      previewImageError.value = false;
    }
    watch([thumbnailMode, thumbnailUrl], () => {
      updatePreview();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_router_link = resolveComponent("router-link");
      _push(`<!--[--><div class="max-w-7xl mx-auto px-4 py-10 pb-28 lg:pb-10"><div class="mb-6 flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_router_link, {
        to: unref(localePath)("/dashboard"),
        class: "inline-flex items-center gap-2 h-8 px-4 rounded-md text-[13px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Icon), {
              icon: "mdi:arrow-left",
              class: "text-sm"
            }, null, _parent2, _scopeId));
            _push2(`${ssrInterpolate(unref(t)("common.back"))}`);
          } else {
            return [
              createVNode(unref(Icon), {
                icon: "mdi:arrow-left",
                class: "text-sm"
              }),
              createTextVNode(toDisplayString(unref(t)("common.back")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:chevron-right",
        class: "w-4 h-4"
      }, null, _parent));
      _push(`<span class="capitalize">${ssrInterpolate(currentMode.value === "edit" ? unref(t)("postForm.editPost") : unref(t)("postForm.createPost"))}</span>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:chevron-right",
        class: "w-4 h-4"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(unref(t)("posts.post"))}</span></div></div><div class="flex flex-col lg:flex-row gap-8"><div class="flex-1 space-y-6"><header class="flex items-center gap-3 flex-wrap"><div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:file-document-edit-outline",
        class: "w-7 h-7"
      }, null, _parent));
      _push(`</div><div><h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">${ssrInterpolate(currentMode.value === "edit" ? unref(t)("postForm.editTitle") : unref(t)("postForm.newTitle"))}</h1><p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${ssrInterpolate(unref(t)("postForm.subtitle"))}</p></div>`);
      if (currentMode.value === "edit" && currentPostId.value) {
        _push(`<div class="ml-auto">`);
        _push(ssrRenderComponent(_component_router_link, {
          to: unref(localePath)(`/posts/${slug.value}`),
          target: "_blank",
          class: "inline-flex items-center gap-2 h-9 px-3 rounded bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:open-in-new",
                class: "text-sm"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("postForm.viewPost"))}`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:open-in-new",
                  class: "text-sm"
                }),
                createTextVNode(" " + toDisplayString(unref(t)("postForm.viewPost")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><form id="postForm" class="space-y-8"><section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-5"><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 uppercase">${ssrInterpolate(unref(t)("postForm.basicInfo"))}</h2><div class="space-y-2"><label for="title" class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:format-title",
        class: "text-blue-500"
      }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("postForm.title"))}</label><input${ssrRenderAttr("value", title.value)} id="title" type="text"${ssrRenderAttr("placeholder", unref(t)("postForm.titlePlaceholder"))}${ssrIncludeBooleanAttr(fieldsLocked.value) ? " disabled" : ""} class="${ssrRenderClass([
        inputClasses.value,
        "h-11",
        fieldsLocked.value ? "opacity-60 cursor-not-allowed" : ""
      ])}" required></div><div class="space-y-2"><div class="flex items-center justify-between"><label for="slug" class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:link-variant",
        class: "text-blue-500"
      }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("postForm.slug"))}</label><span class="text-[11px] text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("postForm.slugAutoHint"))}</span></div><div class="relative"><input${ssrRenderAttr("value", slug.value)} id="slug" type="text"${ssrRenderAttr("placeholder", unref(t)("postForm.slugPlaceholder"))}${ssrIncludeBooleanAttr(fieldsLocked.value) ? " disabled" : ""} class="${ssrRenderClass([
        inputClasses.value,
        "pr-28",
        slugError.value ? "border-red-500 focus:ring-red-500" : slugAvailable.value === true ? "border-green-500 focus:ring-green-500" : "",
        fieldsLocked.value ? "opacity-60 cursor-not-allowed" : ""
      ])}" required>`);
      if (checkingSlug.value) {
        _push(`<span class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 flex items-center gap-1">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:loading",
          class: "animate-spin"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("postForm.checking"))}</span>`);
      } else if (slugAvailable.value && !slugError.value) {
        _push(`<span class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-green-600 dark:text-green-400 flex items-center gap-1">`);
        _push(ssrRenderComponent(unref(Icon), { icon: "mdi:check-circle" }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("postForm.ok"))}</span>`);
      } else if (slugError.value) {
        _push(`<span class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1">`);
        _push(ssrRenderComponent(unref(Icon), { icon: "mdi:alert-circle" }, null, _parent));
        _push(` ${ssrInterpolate(slugError.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-[11px] text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("postForm.slugHint"))}</p></div></section><section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-4"><div class="flex items-center justify-between"><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 uppercase">${ssrInterpolate(unref(t)("postForm.content"))}</h2><span class="text-[11px] text-gray-500 dark:text-gray-500">${ssrInterpolate(unref(t)("postForm.markdownSupported"))}</span></div><div class="${ssrRenderClass(fieldsLocked.value ? "pointer-events-none opacity-60" : "")}">`);
      _push(ssrRenderComponent(unref(MdEditor), {
        modelValue: content.value,
        "onUpdate:modelValue": ($event) => content.value = $event,
        height: "400px",
        preview: false,
        theme: isDarkTheme.value ? "dark" : "light",
        "toolbars-exclude": exclude,
        class: "rounded-md border border-gray-300 dark:border-gray-600",
        language: "en",
        noUploadImg: ""
      }, null, _parent));
      _push(`</div></section><section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-3 lg:hidden"><h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 uppercase">${ssrInterpolate(unref(t)("postForm.tags"))}</h2>`);
      _push(ssrRenderComponent(unref(TagsInputRoot), {
        modelValue: tagItems.value,
        "onUpdate:modelValue": ($event) => tagItems.value = $event,
        disabled: fieldsLocked.value,
        class: [
          inputClasses.value,
          "flex gap-2 items-center flex-wrap !px-2 !py-2 bg-white dark:bg-gray-800",
          fieldsLocked.value ? "opacity-60 cursor-not-allowed" : ""
        ]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(tagItems.value, (item) => {
              _push2(ssrRenderComponent(unref(TagsInputItem), {
                key: item,
                value: item,
                class: "flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium border border-blue-200 dark:border-blue-800 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-400 dark:aria-[current=true]:ring-blue-600"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(TagsInputItemText), { class: "text-xs pl-1" }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(TagsInputItemDelete), { class: "p-0.5 rounded hover:bg-blue-200/60 dark:hover:bg-blue-800/50 transition-colors" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Icon), {
                            icon: "lucide:x",
                            class: "w-3.5 h-3.5"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Icon), {
                              icon: "lucide:x",
                              class: "w-3.5 h-3.5"
                            })
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(TagsInputItemText), { class: "text-xs pl-1" }),
                      createVNode(unref(TagsInputItemDelete), { class: "p-0.5 rounded hover:bg-blue-200/60 dark:hover:bg-blue-800/50 transition-colors" }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "lucide:x",
                            class: "w-3.5 h-3.5"
                          })
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(unref(TagsInputInput), {
              placeholder: unref(t)("postForm.addTag"),
              class: "text-xs focus:outline-none flex-1 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 px-1"
            }, null, _parent2, _scopeId));
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(tagItems.value, (item) => {
                return openBlock(), createBlock(unref(TagsInputItem), {
                  key: item,
                  value: item,
                  class: "flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium border border-blue-200 dark:border-blue-800 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-400 dark:aria-[current=true]:ring-blue-600"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(TagsInputItemText), { class: "text-xs pl-1" }),
                    createVNode(unref(TagsInputItemDelete), { class: "p-0.5 rounded hover:bg-blue-200/60 dark:hover:bg-blue-800/50 transition-colors" }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: "lucide:x",
                          class: "w-3.5 h-3.5"
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["value"]);
              }), 128)),
              createVNode(unref(TagsInputInput), {
                placeholder: unref(t)("postForm.addTag"),
                class: "text-xs focus:outline-none flex-1 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 px-1"
              }, null, 8, ["placeholder"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-[11px] text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("postForm.tagHint"))}</p></section><div class="lg:hidden"></div></form></div><aside class="w-full lg:w-80 space-y-6 lg:sticky lg:top-6 self-start"><section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-5"><h2 class="text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300 uppercase">${ssrInterpolate(unref(t)("postForm.publishing"))}</h2><div class="space-y-2"><label class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:account",
        class: "text-blue-500"
      }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("postForm.author"))}</label>`);
      if (canChangeAuthor.value) {
        _push(`<div class="relative">`);
        _push(ssrRenderComponent(unref(SelectRoot), {
          modelValue: authorId.value,
          "onUpdate:modelValue": [($event) => authorId.value = $event, onAuthorSelect],
          disabled: fieldsLocked.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(SelectTrigger), {
                class: "w-full h-10 inline-flex items-center gap-3 justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed",
                "aria-label": unref(t)("postForm.selectAuthor")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a2, _b2;
                  if (_push3) {
                    _push3(`<span class="${ssrRenderClass(
                      "w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 " + roleAvatarBg((_a2 = selectedAuthor.value) == null ? void 0 : _a2.role)
                    )}"${_scopeId2}>`);
                    if (authorAvatar.value) {
                      _push3(`<img${ssrRenderAttr("src", authorAvatar.value)}${ssrRenderAttr("alt", authorDisplay.value || "Avatar")} class="w-full h-full object-cover" loading="lazy"${_scopeId2}>`);
                    } else {
                      _push3(`<span${_scopeId2}>${ssrInterpolate((authorDisplay.value || "?").charAt(0).toUpperCase())}</span>`);
                    }
                    _push3(`</span><span class="flex-1 text-left truncate"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(SelectValue), {
                      placeholder: unref(t)("postForm.selectAuthor")
                    }, null, _parent3, _scopeId2));
                    _push3(`</span>`);
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: "radix-icons:chevron-down",
                      class: "w-4 h-4 opacity-70"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode("span", {
                        class: "w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 " + roleAvatarBg((_b2 = selectedAuthor.value) == null ? void 0 : _b2.role)
                      }, [
                        authorAvatar.value ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: authorAvatar.value,
                          alt: authorDisplay.value || "Avatar",
                          class: "w-full h-full object-cover",
                          onError: ($event) => authorAvatar.value = null,
                          loading: "lazy"
                        }, null, 40, ["src", "alt", "onError"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((authorDisplay.value || "?").charAt(0).toUpperCase()), 1))
                      ], 2),
                      createVNode("span", { class: "flex-1 text-left truncate" }, [
                        createVNode(unref(SelectValue), {
                          placeholder: unref(t)("postForm.selectAuthor")
                        }, null, 8, ["placeholder"])
                      ]),
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
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(SelectViewport), { class: "p-1" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(SelectGroup), null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<!--[-->`);
                                      ssrRenderList(authors.value, (a) => {
                                        _push6(ssrRenderComponent(unref(SelectItem), {
                                          key: a.id,
                                          value: a.id,
                                          class: "relative flex items-center gap-3 h-10 pl-10 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-10 inline-flex items-center justify-center" }, {
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
                                              _push7(`<span class="${ssrRenderClass(
                                                "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 " + roleAvatarBg(a.role)
                                              )}"${_scopeId6}>`);
                                              if (a.avatar_url) {
                                                _push7(`<img${ssrRenderAttr("src", a.avatar_url)}${ssrRenderAttr("alt", a.display_name || a.username || "Avatar")} class="w-full h-full object-cover" loading="lazy"${_scopeId6}>`);
                                              } else {
                                                _push7(`<span${_scopeId6}>${ssrInterpolate((a.display_name || a.username || "?").charAt(0).toUpperCase())}</span>`);
                                              }
                                              _push7(`</span>`);
                                              _push7(ssrRenderComponent(unref(SelectItemText), null, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`<span class="truncate capitalize flex items-center gap-1"${_scopeId7}><span${_scopeId7}>${ssrInterpolate(a.display_name || a.username)}</span>`);
                                                    if (a.role && a.role !== "reader") {
                                                      _push8(`<span class="${ssrRenderClass([
                                                        "ml-1 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded capitalize border border-transparent",
                                                        a.role === "admin" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                                      ])}"${_scopeId7}>${ssrInterpolate(a.role)}</span>`);
                                                    } else {
                                                      _push8(`<!---->`);
                                                    }
                                                    _push8(`</span>`);
                                                  } else {
                                                    return [
                                                      createVNode("span", { class: "truncate capitalize flex items-center gap-1" }, [
                                                        createVNode("span", null, toDisplayString(a.display_name || a.username), 1),
                                                        a.role && a.role !== "reader" ? (openBlock(), createBlock("span", {
                                                          key: 0,
                                                          class: [
                                                            "ml-1 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded capitalize border border-transparent",
                                                            a.role === "admin" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                                          ]
                                                        }, toDisplayString(a.role), 3)) : createCommentVNode("", true)
                                                      ])
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-10 inline-flex items-center justify-center" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Icon), {
                                                      icon: "radix-icons:check",
                                                      class: "w-4 h-4"
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode("span", {
                                                  class: "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 " + roleAvatarBg(a.role)
                                                }, [
                                                  a.avatar_url ? (openBlock(), createBlock("img", {
                                                    key: 0,
                                                    src: a.avatar_url,
                                                    alt: a.display_name || a.username || "Avatar",
                                                    class: "w-full h-full object-cover",
                                                    onError: ($event) => a.avatar_url = null,
                                                    loading: "lazy"
                                                  }, null, 40, ["src", "alt", "onError"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((a.display_name || a.username || "?").charAt(0).toUpperCase()), 1))
                                                ], 2),
                                                createVNode(unref(SelectItemText), null, {
                                                  default: withCtx(() => [
                                                    createVNode("span", { class: "truncate capitalize flex items-center gap-1" }, [
                                                      createVNode("span", null, toDisplayString(a.display_name || a.username), 1),
                                                      a.role && a.role !== "reader" ? (openBlock(), createBlock("span", {
                                                        key: 0,
                                                        class: [
                                                          "ml-1 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded capitalize border border-transparent",
                                                          a.role === "admin" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                                        ]
                                                      }, toDisplayString(a.role), 3)) : createCommentVNode("", true)
                                                    ])
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
                                        (openBlock(true), createBlock(Fragment, null, renderList(authors.value, (a) => {
                                          return openBlock(), createBlock(unref(SelectItem), {
                                            key: a.id,
                                            value: a.id,
                                            class: "relative flex items-center gap-3 h-10 pl-10 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-10 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), {
                                                    icon: "radix-icons:check",
                                                    class: "w-4 h-4"
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("span", {
                                                class: "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 " + roleAvatarBg(a.role)
                                              }, [
                                                a.avatar_url ? (openBlock(), createBlock("img", {
                                                  key: 0,
                                                  src: a.avatar_url,
                                                  alt: a.display_name || a.username || "Avatar",
                                                  class: "w-full h-full object-cover",
                                                  onError: ($event) => a.avatar_url = null,
                                                  loading: "lazy"
                                                }, null, 40, ["src", "alt", "onError"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((a.display_name || a.username || "?").charAt(0).toUpperCase()), 1))
                                              ], 2),
                                              createVNode(unref(SelectItemText), null, {
                                                default: withCtx(() => [
                                                  createVNode("span", { class: "truncate capitalize flex items-center gap-1" }, [
                                                    createVNode("span", null, toDisplayString(a.display_name || a.username), 1),
                                                    a.role && a.role !== "reader" ? (openBlock(), createBlock("span", {
                                                      key: 0,
                                                      class: [
                                                        "ml-1 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded capitalize border border-transparent",
                                                        a.role === "admin" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                                      ]
                                                    }, toDisplayString(a.role), 3)) : createCommentVNode("", true)
                                                  ])
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
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(SelectGroup), null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(authors.value, (a) => {
                                        return openBlock(), createBlock(unref(SelectItem), {
                                          key: a.id,
                                          value: a.id,
                                          class: "relative flex items-center gap-3 h-10 pl-10 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-10 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), {
                                                  icon: "radix-icons:check",
                                                  class: "w-4 h-4"
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("span", {
                                              class: "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 " + roleAvatarBg(a.role)
                                            }, [
                                              a.avatar_url ? (openBlock(), createBlock("img", {
                                                key: 0,
                                                src: a.avatar_url,
                                                alt: a.display_name || a.username || "Avatar",
                                                class: "w-full h-full object-cover",
                                                onError: ($event) => a.avatar_url = null,
                                                loading: "lazy"
                                              }, null, 40, ["src", "alt", "onError"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((a.display_name || a.username || "?").charAt(0).toUpperCase()), 1))
                                            ], 2),
                                            createVNode(unref(SelectItemText), null, {
                                              default: withCtx(() => [
                                                createVNode("span", { class: "truncate capitalize flex items-center gap-1" }, [
                                                  createVNode("span", null, toDisplayString(a.display_name || a.username), 1),
                                                  a.role && a.role !== "reader" ? (openBlock(), createBlock("span", {
                                                    key: 0,
                                                    class: [
                                                      "ml-1 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded capitalize border border-transparent",
                                                      a.role === "admin" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                                    ]
                                                  }, toDisplayString(a.role), 3)) : createCommentVNode("", true)
                                                ])
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
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(SelectViewport), { class: "p-1" }, {
                              default: withCtx(() => [
                                createVNode(unref(SelectGroup), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(authors.value, (a) => {
                                      return openBlock(), createBlock(unref(SelectItem), {
                                        key: a.id,
                                        value: a.id,
                                        class: "relative flex items-center gap-3 h-10 pl-10 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-10 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), {
                                                icon: "radix-icons:check",
                                                class: "w-4 h-4"
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("span", {
                                            class: "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 " + roleAvatarBg(a.role)
                                          }, [
                                            a.avatar_url ? (openBlock(), createBlock("img", {
                                              key: 0,
                                              src: a.avatar_url,
                                              alt: a.display_name || a.username || "Avatar",
                                              class: "w-full h-full object-cover",
                                              onError: ($event) => a.avatar_url = null,
                                              loading: "lazy"
                                            }, null, 40, ["src", "alt", "onError"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((a.display_name || a.username || "?").charAt(0).toUpperCase()), 1))
                                          ], 2),
                                          createVNode(unref(SelectItemText), null, {
                                            default: withCtx(() => [
                                              createVNode("span", { class: "truncate capitalize flex items-center gap-1" }, [
                                                createVNode("span", null, toDisplayString(a.display_name || a.username), 1),
                                                a.role && a.role !== "reader" ? (openBlock(), createBlock("span", {
                                                  key: 0,
                                                  class: [
                                                    "ml-1 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded capitalize border border-transparent",
                                                    a.role === "admin" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                                  ]
                                                }, toDisplayString(a.role), 3)) : createCommentVNode("", true)
                                              ])
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
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(SelectContent), {
                        class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                        "side-offset": 4
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500" }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(SelectViewport), { class: "p-1" }, {
                            default: withCtx(() => [
                              createVNode(unref(SelectGroup), null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(authors.value, (a) => {
                                    return openBlock(), createBlock(unref(SelectItem), {
                                      key: a.id,
                                      value: a.id,
                                      class: "relative flex items-center gap-3 h-10 pl-10 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-10 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), {
                                              icon: "radix-icons:check",
                                              class: "w-4 h-4"
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("span", {
                                          class: "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 " + roleAvatarBg(a.role)
                                        }, [
                                          a.avatar_url ? (openBlock(), createBlock("img", {
                                            key: 0,
                                            src: a.avatar_url,
                                            alt: a.display_name || a.username || "Avatar",
                                            class: "w-full h-full object-cover",
                                            onError: ($event) => a.avatar_url = null,
                                            loading: "lazy"
                                          }, null, 40, ["src", "alt", "onError"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((a.display_name || a.username || "?").charAt(0).toUpperCase()), 1))
                                        ], 2),
                                        createVNode(unref(SelectItemText), null, {
                                          default: withCtx(() => [
                                            createVNode("span", { class: "truncate capitalize flex items-center gap-1" }, [
                                              createVNode("span", null, toDisplayString(a.display_name || a.username), 1),
                                              a.role && a.role !== "reader" ? (openBlock(), createBlock("span", {
                                                key: 0,
                                                class: [
                                                  "ml-1 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded capitalize border border-transparent",
                                                  a.role === "admin" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                                ]
                                              }, toDisplayString(a.role), 3)) : createCommentVNode("", true)
                                            ])
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
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(SelectTrigger), {
                  class: "w-full h-10 inline-flex items-center gap-3 justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[placeholder]:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed",
                  "aria-label": unref(t)("postForm.selectAuthor")
                }, {
                  default: withCtx(() => {
                    var _a2;
                    return [
                      createVNode("span", {
                        class: "w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 " + roleAvatarBg((_a2 = selectedAuthor.value) == null ? void 0 : _a2.role)
                      }, [
                        authorAvatar.value ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: authorAvatar.value,
                          alt: authorDisplay.value || "Avatar",
                          class: "w-full h-full object-cover",
                          onError: ($event) => authorAvatar.value = null,
                          loading: "lazy"
                        }, null, 40, ["src", "alt", "onError"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((authorDisplay.value || "?").charAt(0).toUpperCase()), 1))
                      ], 2),
                      createVNode("span", { class: "flex-1 text-left truncate" }, [
                        createVNode(unref(SelectValue), {
                          placeholder: unref(t)("postForm.selectAuthor")
                        }, null, 8, ["placeholder"])
                      ]),
                      createVNode(unref(Icon), {
                        icon: "radix-icons:chevron-down",
                        class: "w-4 h-4 opacity-70"
                      })
                    ];
                  }),
                  _: 1
                }, 8, ["aria-label"]),
                createVNode(unref(SelectPortal), null, {
                  default: withCtx(() => [
                    createVNode(unref(SelectContent), {
                      class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                      "side-offset": 4
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(SelectScrollUpButton), { class: "flex items-center justify-center h-5 bg-white dark:bg-gray-800 text-gray-500" }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), { icon: "radix-icons:chevron-up" })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(SelectViewport), { class: "p-1" }, {
                          default: withCtx(() => [
                            createVNode(unref(SelectGroup), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(authors.value, (a) => {
                                  return openBlock(), createBlock(unref(SelectItem), {
                                    key: a.id,
                                    value: a.id,
                                    class: "relative flex items-center gap-3 h-10 pl-10 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-10 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), {
                                            icon: "radix-icons:check",
                                            class: "w-4 h-4"
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("span", {
                                        class: "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 " + roleAvatarBg(a.role)
                                      }, [
                                        a.avatar_url ? (openBlock(), createBlock("img", {
                                          key: 0,
                                          src: a.avatar_url,
                                          alt: a.display_name || a.username || "Avatar",
                                          class: "w-full h-full object-cover",
                                          onError: ($event) => a.avatar_url = null,
                                          loading: "lazy"
                                        }, null, 40, ["src", "alt", "onError"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((a.display_name || a.username || "?").charAt(0).toUpperCase()), 1))
                                      ], 2),
                                      createVNode(unref(SelectItemText), null, {
                                        default: withCtx(() => [
                                          createVNode("span", { class: "truncate capitalize flex items-center gap-1" }, [
                                            createVNode("span", null, toDisplayString(a.display_name || a.username), 1),
                                            a.role && a.role !== "reader" ? (openBlock(), createBlock("span", {
                                              key: 0,
                                              class: [
                                                "ml-1 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded capitalize border border-transparent",
                                                a.role === "admin" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                                              ]
                                            }, toDisplayString(a.role), 3)) : createCommentVNode("", true)
                                          ])
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
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="h-10 flex items-center gap-3 rounded-md px-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300"><span class="${ssrRenderClass(
          "w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-semibold text-gray-600 dark:text-gray-300 " + roleAvatarBg(((_a = selectedAuthor.value) == null ? void 0 : _a.role) || ((_b = user.value) == null ? void 0 : _b.role))
        )}">`);
        if (authorAvatar.value) {
          _push(`<img${ssrRenderAttr("src", authorAvatar.value)}${ssrRenderAttr("alt", authorDisplay.value || "Avatar")} class="w-full h-full object-cover" loading="lazy">`);
        } else {
          _push(`<span>${ssrInterpolate((authorDisplay.value || "?").charAt(0).toUpperCase())}</span>`);
        }
        _push(`</span><span class="truncate">${ssrInterpolate(authorDisplay.value || "\u2014")}</span></div>`);
      }
      _push(`</div><div class="space-y-2"><label class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:check-circle",
        class: "text-blue-500"
      }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("postForm.status"))}</label>`);
      _push(ssrRenderComponent(unref(SelectRoot), {
        modelValue: status.value,
        "onUpdate:modelValue": ($event) => status.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SelectTrigger), {
              class: "w-full h-10 inline-flex items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
              "aria-label": "Select status"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="flex items-center gap-2 truncate capitalize"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: statusIcon[status.value],
                    class: "w-4 h-4"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(SelectValue), null, null, _parent3, _scopeId2));
                  _push3(`</span>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "radix-icons:chevron-down",
                    class: "w-4 h-4 opacity-70"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("span", { class: "flex items-center gap-2 truncate capitalize" }, [
                      createVNode(unref(Icon), {
                        icon: statusIcon[status.value],
                        class: "w-4 h-4"
                      }, null, 8, ["icon"]),
                      createVNode(unref(SelectValue))
                    ]),
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
                    "side-offset": 4
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(SelectViewport), { class: "p-1" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(SelectGroup), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(displayedStatusOptions.value, (option) => {
                                      _push6(ssrRenderComponent(unref(SelectItem), {
                                        key: option,
                                        value: option,
                                        class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
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
                                              icon: statusIcon[option],
                                              class: "w-4 h-4"
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(SelectItemText), null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(unref(t)(`posts.status.${option}`))}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(unref(t)(`posts.status.${option}`)), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), {
                                                    icon: "radix-icons:check",
                                                    class: "w-4 h-4"
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(Icon), {
                                                icon: statusIcon[option],
                                                class: "w-4 h-4"
                                              }, null, 8, ["icon"]),
                                              createVNode(unref(SelectItemText), null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(t)(`posts.status.${option}`)), 1)
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
                                      (openBlock(true), createBlock(Fragment, null, renderList(displayedStatusOptions.value, (option) => {
                                        return openBlock(), createBlock(unref(SelectItem), {
                                          key: option,
                                          value: option,
                                          class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), {
                                                  icon: "radix-icons:check",
                                                  class: "w-4 h-4"
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(Icon), {
                                              icon: statusIcon[option],
                                              class: "w-4 h-4"
                                            }, null, 8, ["icon"]),
                                            createVNode(unref(SelectItemText), null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(t)(`posts.status.${option}`)), 1)
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(SelectGroup), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(displayedStatusOptions.value, (option) => {
                                      return openBlock(), createBlock(unref(SelectItem), {
                                        key: option,
                                        value: option,
                                        class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), {
                                                icon: "radix-icons:check",
                                                class: "w-4 h-4"
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(Icon), {
                                            icon: statusIcon[option],
                                            class: "w-4 h-4"
                                          }, null, 8, ["icon"]),
                                          createVNode(unref(SelectItemText), null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(t)(`posts.status.${option}`)), 1)
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(SelectViewport), { class: "p-1" }, {
                            default: withCtx(() => [
                              createVNode(unref(SelectGroup), null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(displayedStatusOptions.value, (option) => {
                                    return openBlock(), createBlock(unref(SelectItem), {
                                      key: option,
                                      value: option,
                                      class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), {
                                              icon: "radix-icons:check",
                                              class: "w-4 h-4"
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(Icon), {
                                          icon: statusIcon[option],
                                          class: "w-4 h-4"
                                        }, null, 8, ["icon"]),
                                        createVNode(unref(SelectItemText), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(t)(`posts.status.${option}`)), 1)
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(SelectContent), {
                      class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                      "side-offset": 4
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(SelectViewport), { class: "p-1" }, {
                          default: withCtx(() => [
                            createVNode(unref(SelectGroup), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(displayedStatusOptions.value, (option) => {
                                  return openBlock(), createBlock(unref(SelectItem), {
                                    key: option,
                                    value: option,
                                    class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), {
                                            icon: "radix-icons:check",
                                            class: "w-4 h-4"
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(Icon), {
                                        icon: statusIcon[option],
                                        class: "w-4 h-4"
                                      }, null, 8, ["icon"]),
                                      createVNode(unref(SelectItemText), null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(t)(`posts.status.${option}`)), 1)
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(SelectTrigger), {
                class: "w-full h-10 inline-flex items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                "aria-label": "Select status"
              }, {
                default: withCtx(() => [
                  createVNode("span", { class: "flex items-center gap-2 truncate capitalize" }, [
                    createVNode(unref(Icon), {
                      icon: statusIcon[status.value],
                      class: "w-4 h-4"
                    }, null, 8, ["icon"]),
                    createVNode(unref(SelectValue))
                  ]),
                  createVNode(unref(Icon), {
                    icon: "radix-icons:chevron-down",
                    class: "w-4 h-4 opacity-70"
                  })
                ]),
                _: 1
              }),
              createVNode(unref(SelectPortal), null, {
                default: withCtx(() => [
                  createVNode(unref(SelectContent), {
                    class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                    "side-offset": 4
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(SelectViewport), { class: "p-1" }, {
                        default: withCtx(() => [
                          createVNode(unref(SelectGroup), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(displayedStatusOptions.value, (option) => {
                                return openBlock(), createBlock(unref(SelectItem), {
                                  key: option,
                                  value: option,
                                  class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Icon), {
                                          icon: "radix-icons:check",
                                          class: "w-4 h-4"
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(Icon), {
                                      icon: statusIcon[option],
                                      class: "w-4 h-4"
                                    }, null, 8, ["icon"]),
                                    createVNode(unref(SelectItemText), null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(t)(`posts.status.${option}`)), 1)
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
      }, _parent));
      _push(`</div><div class="space-y-2"><label class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:translate",
        class: "text-blue-500"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("postForm.languages"))}</label><div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(unref(contentLocales), (loc) => {
        _push(`<button type="button"${ssrIncludeBooleanAttr(fieldsLocked.value || removingTranslation.value) ? " disabled" : ""} class="${ssrRenderClass([
          postLocales.value.includes(loc.code) ? "border-blue-300 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300",
          "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium border transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
        ])}"><span class="uppercase tracking-wide opacity-70">${ssrInterpolate(loc.code)}</span> ${ssrInterpolate(loc.name)} `);
        if (postLocales.value.includes(loc.code)) {
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:check",
            class: "text-sm"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div><p class="text-[11px] text-gray-500 dark:text-gray-400">${ssrInterpolate(currentMode.value === "create" ? unref(t)("postForm.languagesHintCreate") : unref(t)("postForm.languagesHintEdit"))}</p>`);
      if (currentMode.value === "edit" && translationSiblings.value.length) {
        _push(`<div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-3 space-y-2"><div class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">${ssrInterpolate(unref(t)("postForm.translations"))}</div><p class="text-[11px] text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("postForm.translationsHint"))}</p><ul class="space-y-1.5"><!--[-->`);
        ssrRenderList(translationSiblings.value, (sib) => {
          _push(`<li class="flex items-center gap-2 text-sm"><span class="inline-flex items-center justify-center h-6 min-w-[1.75rem] px-1.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">${ssrInterpolate(sib.locale)}</span><span class="truncate flex-1 text-gray-800 dark:text-gray-100">${ssrInterpolate(sib.title || unref(t)("postForm.untitled"))}</span>`);
          if (sib.id === currentPostId.value) {
            _push(`<span class="text-[10px] text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("postForm.currentTranslation"))}</span>`);
          } else {
            _push(`<!--[--><button type="button" class="text-xs text-blue-600 dark:text-blue-400 hover:underline">${ssrInterpolate(unref(t)("common.edit"))}</button><button type="button" class="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"${ssrIncludeBooleanAttr(fieldsLocked.value || removingTranslation.value) ? " disabled" : ""}>${ssrInterpolate(unref(t)("common.remove"))}</button><!--]-->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (status.value === "draft" || scheduledAtLocal.value) {
        _push(`<div class="space-y-2"><label class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:clock-outline",
          class: "text-blue-500"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("postForm.schedulePublish"))}</label><input${ssrRenderAttr("value", scheduledAtLocal.value)} type="datetime-local"${ssrIncludeBooleanAttr(fieldsLocked.value) ? " disabled" : ""} class="w-full h-10 rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"><p class="text-[11px] text-gray-500 dark:text-gray-400"> Saves as draft until this time, then publishes automatically. </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-2"><label class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:format-list-bulleted",
        class: "text-blue-500"
      }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("postForm.category"))}</label>`);
      _push(ssrRenderComponent(unref(SelectRoot), {
        modelValue: category.value,
        "onUpdate:modelValue": ($event) => category.value = $event,
        disabled: fieldsLocked.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SelectTrigger), {
              class: "w-full h-10 inline-flex items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed",
              "aria-label": "Select category"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="flex items-center gap-2 truncate"${_scopeId2}>`);
                  if (selectedCategoryName.value) {
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: (categories.value.find((c) => c.id === category.value) || {}).icon || "mdi:category",
                      class: "w-4 h-4"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(SelectValue), {
                    placeholder: unref(t)("postForm.selectCategory")
                  }, null, _parent3, _scopeId2));
                  _push3(`</span>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "radix-icons:chevron-down",
                    class: "w-4 h-4 opacity-70"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("span", { class: "flex items-center gap-2 truncate" }, [
                      selectedCategoryName.value ? (openBlock(), createBlock(unref(Icon), {
                        key: 0,
                        icon: (categories.value.find((c) => c.id === category.value) || {}).icon || "mdi:category",
                        class: "w-4 h-4"
                      }, null, 8, ["icon"])) : createCommentVNode("", true),
                      createVNode(unref(SelectValue), {
                        placeholder: unref(t)("postForm.selectCategory")
                      }, null, 8, ["placeholder"])
                    ]),
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
                    "side-offset": 4
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(SelectViewport), { class: "p-1" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(SelectGroup), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(categories.value, (cat) => {
                                      _push6(ssrRenderComponent(unref(SelectItem), {
                                        key: cat.id,
                                        value: cat.id,
                                        class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
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
                                              icon: cat.icon || "mdi:category",
                                              class: "w-4 h-4"
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(SelectItemText), { class: "truncate" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(cat.name)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(cat.name), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), {
                                                    icon: "radix-icons:check",
                                                    class: "w-4 h-4"
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(Icon), {
                                                icon: cat.icon || "mdi:category",
                                                class: "w-4 h-4"
                                              }, null, 8, ["icon"]),
                                              createVNode(unref(SelectItemText), { class: "truncate" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(cat.name), 1)
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
                                      (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (cat) => {
                                        return openBlock(), createBlock(unref(SelectItem), {
                                          key: cat.id,
                                          value: cat.id,
                                          class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), {
                                                  icon: "radix-icons:check",
                                                  class: "w-4 h-4"
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(Icon), {
                                              icon: cat.icon || "mdi:category",
                                              class: "w-4 h-4"
                                            }, null, 8, ["icon"]),
                                            createVNode(unref(SelectItemText), { class: "truncate" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(cat.name), 1)
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(SelectGroup), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (cat) => {
                                      return openBlock(), createBlock(unref(SelectItem), {
                                        key: cat.id,
                                        value: cat.id,
                                        class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), {
                                                icon: "radix-icons:check",
                                                class: "w-4 h-4"
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(Icon), {
                                            icon: cat.icon || "mdi:category",
                                            class: "w-4 h-4"
                                          }, null, 8, ["icon"]),
                                          createVNode(unref(SelectItemText), { class: "truncate" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(cat.name), 1)
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
                        }, _parent4, _scopeId3));
                        _push4(`<div class="border-t border-gray-200 dark:border-gray-700 p-2 space-y-2"${_scopeId3}><p class="text-[10px] uppercase tracking-wide text-gray-400 px-1"${_scopeId3}>${ssrInterpolate(unref(t)("postForm.newCategory"))}</p><div class="flex gap-2"${_scopeId3}><input${ssrRenderAttr("value", newCategoryName.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("postForm.namePlaceholder"))}${ssrIncludeBooleanAttr(fieldsLocked.value || creatingCategory.value) ? " disabled" : ""} class="flex-1 h-8 rounded-md px-2 text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId3}><button type="button"${ssrIncludeBooleanAttr(fieldsLocked.value || creatingCategory.value || !newCategoryName.value) ? " disabled" : ""} class="inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 disabled:opacity-50"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Icon), {
                          icon: creatingCategory.value ? "mdi:loading" : "mdi:plus",
                          class: [creatingCategory.value ? "animate-spin" : "", "text-sm"]
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(unref(t)("postForm.add"))}</button></div></div>`);
                      } else {
                        return [
                          createVNode(unref(SelectViewport), { class: "p-1" }, {
                            default: withCtx(() => [
                              createVNode(unref(SelectGroup), null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (cat) => {
                                    return openBlock(), createBlock(unref(SelectItem), {
                                      key: cat.id,
                                      value: cat.id,
                                      class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), {
                                              icon: "radix-icons:check",
                                              class: "w-4 h-4"
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(Icon), {
                                          icon: cat.icon || "mdi:category",
                                          class: "w-4 h-4"
                                        }, null, 8, ["icon"]),
                                        createVNode(unref(SelectItemText), { class: "truncate" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(cat.name), 1)
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
                          createVNode("div", {
                            class: "border-t border-gray-200 dark:border-gray-700 p-2 space-y-2",
                            onPointerdown: withModifiers(() => {
                            }, ["stop"])
                          }, [
                            createVNode("p", { class: "text-[10px] uppercase tracking-wide text-gray-400 px-1" }, toDisplayString(unref(t)("postForm.newCategory")), 1),
                            createVNode("div", { class: "flex gap-2" }, [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => newCategoryName.value = $event,
                                type: "text",
                                placeholder: unref(t)("postForm.namePlaceholder"),
                                disabled: fieldsLocked.value || creatingCategory.value,
                                class: "flex-1 h-8 rounded-md px-2 text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                onKeydown: withKeys(withModifiers(createCategoryInline, ["prevent"]), ["enter"])
                              }, null, 40, ["onUpdate:modelValue", "placeholder", "disabled", "onKeydown"]), [
                                [
                                  vModelText,
                                  newCategoryName.value,
                                  void 0,
                                  { trim: true }
                                ]
                              ]),
                              createVNode("button", {
                                type: "button",
                                disabled: fieldsLocked.value || creatingCategory.value || !newCategoryName.value,
                                class: "inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 disabled:opacity-50",
                                onClick: createCategoryInline
                              }, [
                                createVNode(unref(Icon), {
                                  icon: creatingCategory.value ? "mdi:loading" : "mdi:plus",
                                  class: [creatingCategory.value ? "animate-spin" : "", "text-sm"]
                                }, null, 8, ["icon", "class"]),
                                createTextVNode(" " + toDisplayString(unref(t)("postForm.add")), 1)
                              ], 8, ["disabled"])
                            ])
                          ], 40, ["onPointerdown"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(SelectContent), {
                      class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                      "side-offset": 4
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(SelectViewport), { class: "p-1" }, {
                          default: withCtx(() => [
                            createVNode(unref(SelectGroup), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (cat) => {
                                  return openBlock(), createBlock(unref(SelectItem), {
                                    key: cat.id,
                                    value: cat.id,
                                    class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), {
                                            icon: "radix-icons:check",
                                            class: "w-4 h-4"
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(Icon), {
                                        icon: cat.icon || "mdi:category",
                                        class: "w-4 h-4"
                                      }, null, 8, ["icon"]),
                                      createVNode(unref(SelectItemText), { class: "truncate" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(cat.name), 1)
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
                        createVNode("div", {
                          class: "border-t border-gray-200 dark:border-gray-700 p-2 space-y-2",
                          onPointerdown: withModifiers(() => {
                          }, ["stop"])
                        }, [
                          createVNode("p", { class: "text-[10px] uppercase tracking-wide text-gray-400 px-1" }, toDisplayString(unref(t)("postForm.newCategory")), 1),
                          createVNode("div", { class: "flex gap-2" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => newCategoryName.value = $event,
                              type: "text",
                              placeholder: unref(t)("postForm.namePlaceholder"),
                              disabled: fieldsLocked.value || creatingCategory.value,
                              class: "flex-1 h-8 rounded-md px-2 text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                              onKeydown: withKeys(withModifiers(createCategoryInline, ["prevent"]), ["enter"])
                            }, null, 40, ["onUpdate:modelValue", "placeholder", "disabled", "onKeydown"]), [
                              [
                                vModelText,
                                newCategoryName.value,
                                void 0,
                                { trim: true }
                              ]
                            ]),
                            createVNode("button", {
                              type: "button",
                              disabled: fieldsLocked.value || creatingCategory.value || !newCategoryName.value,
                              class: "inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 disabled:opacity-50",
                              onClick: createCategoryInline
                            }, [
                              createVNode(unref(Icon), {
                                icon: creatingCategory.value ? "mdi:loading" : "mdi:plus",
                                class: [creatingCategory.value ? "animate-spin" : "", "text-sm"]
                              }, null, 8, ["icon", "class"]),
                              createTextVNode(" " + toDisplayString(unref(t)("postForm.add")), 1)
                            ], 8, ["disabled"])
                          ])
                        ], 40, ["onPointerdown"])
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
                class: "w-full h-10 inline-flex items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed",
                "aria-label": "Select category"
              }, {
                default: withCtx(() => [
                  createVNode("span", { class: "flex items-center gap-2 truncate" }, [
                    selectedCategoryName.value ? (openBlock(), createBlock(unref(Icon), {
                      key: 0,
                      icon: (categories.value.find((c) => c.id === category.value) || {}).icon || "mdi:category",
                      class: "w-4 h-4"
                    }, null, 8, ["icon"])) : createCommentVNode("", true),
                    createVNode(unref(SelectValue), {
                      placeholder: unref(t)("postForm.selectCategory")
                    }, null, 8, ["placeholder"])
                  ]),
                  createVNode(unref(Icon), {
                    icon: "radix-icons:chevron-down",
                    class: "w-4 h-4 opacity-70"
                  })
                ]),
                _: 1
              }),
              createVNode(unref(SelectPortal), null, {
                default: withCtx(() => [
                  createVNode(unref(SelectContent), {
                    class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                    "side-offset": 4
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(SelectViewport), { class: "p-1" }, {
                        default: withCtx(() => [
                          createVNode(unref(SelectGroup), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (cat) => {
                                return openBlock(), createBlock(unref(SelectItem), {
                                  key: cat.id,
                                  value: cat.id,
                                  class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Icon), {
                                          icon: "radix-icons:check",
                                          class: "w-4 h-4"
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(Icon), {
                                      icon: cat.icon || "mdi:category",
                                      class: "w-4 h-4"
                                    }, null, 8, ["icon"]),
                                    createVNode(unref(SelectItemText), { class: "truncate" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(cat.name), 1)
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
                      createVNode("div", {
                        class: "border-t border-gray-200 dark:border-gray-700 p-2 space-y-2",
                        onPointerdown: withModifiers(() => {
                        }, ["stop"])
                      }, [
                        createVNode("p", { class: "text-[10px] uppercase tracking-wide text-gray-400 px-1" }, toDisplayString(unref(t)("postForm.newCategory")), 1),
                        createVNode("div", { class: "flex gap-2" }, [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => newCategoryName.value = $event,
                            type: "text",
                            placeholder: unref(t)("postForm.namePlaceholder"),
                            disabled: fieldsLocked.value || creatingCategory.value,
                            class: "flex-1 h-8 rounded-md px-2 text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                            onKeydown: withKeys(withModifiers(createCategoryInline, ["prevent"]), ["enter"])
                          }, null, 40, ["onUpdate:modelValue", "placeholder", "disabled", "onKeydown"]), [
                            [
                              vModelText,
                              newCategoryName.value,
                              void 0,
                              { trim: true }
                            ]
                          ]),
                          createVNode("button", {
                            type: "button",
                            disabled: fieldsLocked.value || creatingCategory.value || !newCategoryName.value,
                            class: "inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 disabled:opacity-50",
                            onClick: createCategoryInline
                          }, [
                            createVNode(unref(Icon), {
                              icon: creatingCategory.value ? "mdi:loading" : "mdi:plus",
                              class: [creatingCategory.value ? "animate-spin" : "", "text-sm"]
                            }, null, 8, ["icon", "class"]),
                            createTextVNode(" " + toDisplayString(unref(t)("postForm.add")), 1)
                          ], 8, ["disabled"])
                        ])
                      ], 40, ["onPointerdown"])
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
      _push(`</div><div class="space-y-2"><label class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:bookshelf",
        class: "text-indigo-500"
      }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("postForm.series"))}</label>`);
      _push(ssrRenderComponent(unref(SelectRoot), {
        modelValue: seriesId.value,
        "onUpdate:modelValue": ($event) => seriesId.value = $event,
        disabled: fieldsLocked.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SelectTrigger), {
              class: "w-full h-10 inline-flex items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60",
              "aria-label": "Select series"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(SelectValue), {
                    placeholder: unref(t)("postForm.none")
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "radix-icons:chevron-down",
                    class: "w-4 h-4 opacity-70"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(SelectValue), {
                      placeholder: unref(t)("postForm.none")
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
                    "side-offset": 4
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(SelectViewport), { class: "p-1" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(SelectGroup), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(SelectItem), {
                                      value: "none",
                                      class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
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
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(unref(SelectItemText), null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`${ssrInterpolate(unref(t)("postForm.none"))}`);
                                              } else {
                                                return [
                                                  createTextVNode(toDisplayString(unref(t)("postForm.none")), 1)
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), {
                                                  icon: "radix-icons:check",
                                                  class: "w-4 h-4"
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectItemText), null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(t)("postForm.none")), 1)
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<!--[-->`);
                                    ssrRenderList(seriesList.value, (s) => {
                                      _push6(ssrRenderComponent(unref(SelectItem), {
                                        key: s.id,
                                        value: s.id,
                                        class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
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
                                            _push7(ssrRenderComponent(unref(SelectItemText), { class: "truncate" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(s.name)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(s.name), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Icon), {
                                                    icon: "radix-icons:check",
                                                    class: "w-4 h-4"
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(SelectItemText), { class: "truncate" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(s.name), 1)
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
                                      createVNode(unref(SelectItem), {
                                        value: "none",
                                        class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), {
                                                icon: "radix-icons:check",
                                                class: "w-4 h-4"
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectItemText), null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(t)("postForm.none")), 1)
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      (openBlock(true), createBlock(Fragment, null, renderList(seriesList.value, (s) => {
                                        return openBlock(), createBlock(unref(SelectItem), {
                                          key: s.id,
                                          value: s.id,
                                          class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Icon), {
                                                  icon: "radix-icons:check",
                                                  class: "w-4 h-4"
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(SelectItemText), { class: "truncate" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(s.name), 1)
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(SelectGroup), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectItem), {
                                      value: "none",
                                      class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), {
                                              icon: "radix-icons:check",
                                              class: "w-4 h-4"
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectItemText), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(t)("postForm.none")), 1)
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    (openBlock(true), createBlock(Fragment, null, renderList(seriesList.value, (s) => {
                                      return openBlock(), createBlock(unref(SelectItem), {
                                        key: s.id,
                                        value: s.id,
                                        class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Icon), {
                                                icon: "radix-icons:check",
                                                class: "w-4 h-4"
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(SelectItemText), { class: "truncate" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(s.name), 1)
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(SelectViewport), { class: "p-1" }, {
                            default: withCtx(() => [
                              createVNode(unref(SelectGroup), null, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectItem), {
                                    value: "none",
                                    class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), {
                                            icon: "radix-icons:check",
                                            class: "w-4 h-4"
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectItemText), null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(t)("postForm.none")), 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  (openBlock(true), createBlock(Fragment, null, renderList(seriesList.value, (s) => {
                                    return openBlock(), createBlock(unref(SelectItem), {
                                      key: s.id,
                                      value: s.id,
                                      class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Icon), {
                                              icon: "radix-icons:check",
                                              class: "w-4 h-4"
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(SelectItemText), { class: "truncate" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(s.name), 1)
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(SelectContent), {
                      class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                      "side-offset": 4
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(SelectViewport), { class: "p-1" }, {
                          default: withCtx(() => [
                            createVNode(unref(SelectGroup), null, {
                              default: withCtx(() => [
                                createVNode(unref(SelectItem), {
                                  value: "none",
                                  class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Icon), {
                                          icon: "radix-icons:check",
                                          class: "w-4 h-4"
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(SelectItemText), null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(t)("postForm.none")), 1)
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                (openBlock(true), createBlock(Fragment, null, renderList(seriesList.value, (s) => {
                                  return openBlock(), createBlock(unref(SelectItem), {
                                    key: s.id,
                                    value: s.id,
                                    class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Icon), {
                                            icon: "radix-icons:check",
                                            class: "w-4 h-4"
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(SelectItemText), { class: "truncate" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(s.name), 1)
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(SelectTrigger), {
                class: "w-full h-10 inline-flex items-center justify-between rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60",
                "aria-label": "Select series"
              }, {
                default: withCtx(() => [
                  createVNode(unref(SelectValue), {
                    placeholder: unref(t)("postForm.none")
                  }, null, 8, ["placeholder"]),
                  createVNode(unref(Icon), {
                    icon: "radix-icons:chevron-down",
                    class: "w-4 h-4 opacity-70"
                  })
                ]),
                _: 1
              }),
              createVNode(unref(SelectPortal), null, {
                default: withCtx(() => [
                  createVNode(unref(SelectContent), {
                    class: "z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
                    "side-offset": 4
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(SelectViewport), { class: "p-1" }, {
                        default: withCtx(() => [
                          createVNode(unref(SelectGroup), null, {
                            default: withCtx(() => [
                              createVNode(unref(SelectItem), {
                                value: "none",
                                class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Icon), {
                                        icon: "radix-icons:check",
                                        class: "w-4 h-4"
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(SelectItemText), null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(unref(t)("postForm.none")), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              (openBlock(true), createBlock(Fragment, null, renderList(seriesList.value, (s) => {
                                return openBlock(), createBlock(unref(SelectItem), {
                                  key: s.id,
                                  value: s.id,
                                  class: "relative flex items-center gap-2 h-8 pl-8 pr-3 rounded text-sm cursor-pointer select-none text-gray-700 dark:text-gray-100 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SelectItemIndicator), { class: "absolute left-0 w-8 inline-flex items-center justify-center" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Icon), {
                                          icon: "radix-icons:check",
                                          class: "w-4 h-4"
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(SelectItemText), { class: "truncate" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(s.name), 1)
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
      }, _parent));
      if (seriesId.value && seriesId.value !== "none") {
        _push(`<input${ssrRenderAttr("value", seriesOrder.value)} type="number" min="1"${ssrRenderAttr("placeholder", unref(t)("postForm.order"))}${ssrIncludeBooleanAttr(fieldsLocked.value) ? " disabled" : ""} class="w-full h-9 rounded-md px-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="hidden lg:block space-y-2"><label class="text-sm font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:tag",
        class: "text-blue-500"
      }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("postForm.tags"))}</label>`);
      _push(ssrRenderComponent(unref(TagsInputRoot), {
        modelValue: tagItems.value,
        "onUpdate:modelValue": ($event) => tagItems.value = $event,
        disabled: fieldsLocked.value,
        class: [
          inputClasses.value,
          "flex gap-2 items-center flex-wrap !px-2 !py-2 bg-white dark:bg-gray-800",
          fieldsLocked.value ? "opacity-60 cursor-not-allowed" : ""
        ]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(tagItems.value, (item) => {
              _push2(ssrRenderComponent(unref(TagsInputItem), {
                key: item,
                value: item,
                class: "flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium border border-blue-200 dark:border-blue-800 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-400 dark:aria-[current=true]:ring-blue-600"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(TagsInputItemText), { class: "text-xs pl-1" }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(TagsInputItemDelete), { class: "p-0.5 rounded hover:bg-blue-200/60 dark:hover:bg-blue-800/50 transition-colors" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Icon), {
                            icon: "lucide:x",
                            class: "w-3.5 h-3.5"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Icon), {
                              icon: "lucide:x",
                              class: "w-3.5 h-3.5"
                            })
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(TagsInputItemText), { class: "text-xs pl-1" }),
                      createVNode(unref(TagsInputItemDelete), { class: "p-0.5 rounded hover:bg-blue-200/60 dark:hover:bg-blue-800/50 transition-colors" }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "lucide:x",
                            class: "w-3.5 h-3.5"
                          })
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(unref(TagsInputInput), {
              placeholder: unref(t)("postForm.addTag"),
              class: "text-xs focus:outline-none flex-1 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 px-1"
            }, null, _parent2, _scopeId));
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(tagItems.value, (item) => {
                return openBlock(), createBlock(unref(TagsInputItem), {
                  key: item,
                  value: item,
                  class: "flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium border border-blue-200 dark:border-blue-800 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-400 dark:aria-[current=true]:ring-blue-600"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(TagsInputItemText), { class: "text-xs pl-1" }),
                    createVNode(unref(TagsInputItemDelete), { class: "p-0.5 rounded hover:bg-blue-200/60 dark:hover:bg-blue-800/50 transition-colors" }, {
                      default: withCtx(() => [
                        createVNode(unref(Icon), {
                          icon: "lucide:x",
                          class: "w-3.5 h-3.5"
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["value"]);
              }), 128)),
              createVNode(unref(TagsInputInput), {
                placeholder: unref(t)("postForm.addTag"),
                class: "text-xs focus:outline-none flex-1 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 px-1"
              }, null, 8, ["placeholder"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-[11px] text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(t)("postForm.tagHint"))}</p></div></section><section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-5"><h2 class="text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300 uppercase">${ssrInterpolate(unref(t)("postForm.thumbnail"))}</h2>`);
      _push(ssrRenderComponent(unref(RadioGroup), {
        modelValue: thumbnailMode.value,
        "onUpdate:modelValue": ($event) => thumbnailMode.value = $event,
        class: "mb-2",
        disabled: fieldsLocked.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(thumbnailOptions.value, (option) => {
              _push2(ssrRenderComponent(unref(RadioGroupOption), {
                key: option.value,
                value: option.value,
                as: "template"
              }, {
                default: withCtx(({ active, checked }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="${ssrRenderClass([
                      checked ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700" : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100",
                      "relative flex cursor-pointer rounded-md px-3 py-2 border text-sm items-center justify-between transition-colors"
                    ])}"${_scopeId2}><span class="${ssrRenderClass([
                      "flex items-center",
                      checked ? "text-blue-700 dark:text-blue-300 font-medium" : ""
                    ])}"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: option.icon,
                      class: "mr-2"
                    }, null, _parent3, _scopeId2));
                    _push3(` ${ssrInterpolate(option.label)}</span>`);
                    _push3(ssrRenderComponent(unref(Icon), {
                      style: checked ? null : { display: "none" },
                      icon: "mdi:check",
                      class: "w-5 h-5 text-blue-600 dark:text-blue-400"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", {
                        class: [
                          checked ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700" : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100",
                          "relative flex cursor-pointer rounded-md px-3 py-2 border text-sm items-center justify-between transition-colors"
                        ]
                      }, [
                        createVNode("span", {
                          class: [
                            "flex items-center",
                            checked ? "text-blue-700 dark:text-blue-300 font-medium" : ""
                          ]
                        }, [
                          createVNode(unref(Icon), {
                            icon: option.icon,
                            class: "mr-2"
                          }, null, 8, ["icon"]),
                          createTextVNode(" " + toDisplayString(option.label), 1)
                        ], 2),
                        withDirectives(createVNode(unref(Icon), {
                          icon: "mdi:check",
                          class: "w-5 h-5 text-blue-600 dark:text-blue-400"
                        }, null, 512), [
                          [vShow, checked]
                        ])
                      ], 2)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-2" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(thumbnailOptions.value, (option) => {
                  return openBlock(), createBlock(unref(RadioGroupOption), {
                    key: option.value,
                    value: option.value,
                    as: "template"
                  }, {
                    default: withCtx(({ active, checked }) => [
                      createVNode("div", {
                        class: [
                          checked ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700" : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100",
                          "relative flex cursor-pointer rounded-md px-3 py-2 border text-sm items-center justify-between transition-colors"
                        ]
                      }, [
                        createVNode("span", {
                          class: [
                            "flex items-center",
                            checked ? "text-blue-700 dark:text-blue-300 font-medium" : ""
                          ]
                        }, [
                          createVNode(unref(Icon), {
                            icon: option.icon,
                            class: "mr-2"
                          }, null, 8, ["icon"]),
                          createTextVNode(" " + toDisplayString(option.label), 1)
                        ], 2),
                        withDirectives(createVNode(unref(Icon), {
                          icon: "mdi:check",
                          class: "w-5 h-5 text-blue-600 dark:text-blue-400"
                        }, null, 512), [
                          [vShow, checked]
                        ])
                      ], 2)
                    ]),
                    _: 2
                  }, 1032, ["value"]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (thumbnailMode.value === "upload") {
        _push(`<div class="space-y-2"><div class="${ssrRenderClass([[
          { "border-blue-500": dragThumb.value },
          fieldsLocked.value ? "opacity-60 pointer-events-none" : ""
        ], "relative flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed rounded-md text-gray-500 dark:text-gray-400 hover:border-blue-400 cursor-pointer transition"])}"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="hidden">`);
        if (previewUrl.value && !previewImageError.value) {
          _push(`<!--[--><img${ssrRenderAttr("src", previewUrl.value)}${ssrRenderAttr("alt", title.value || unref(t)("postForm.thumbnail"))} class="max-h-40 object-contain rounded" loading="lazy"><button type="button" class="text-[11px] text-red-600 dark:text-red-400 hover:underline" data-thumb-remove>${ssrInterpolate(unref(t)("postForm.removeImage"))}</button><!--]-->`);
        } else if (previewUrl.value && previewImageError.value) {
          _push(`<div class="flex flex-col items-center gap-2 py-6">`);
          _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
          _push(`<button type="button" class="text-[11px] text-red-600 dark:text-red-400 hover:underline" data-thumb-remove>${ssrInterpolate(unref(t)("postForm.clearImage"))}</button></div>`);
        } else {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:image-outline",
            class: "text-4xl"
          }, null, _parent));
          _push(`<p class="text-xs">${ssrInterpolate(unref(t)("postForm.dropHint"))}</p><!--]-->`);
        }
        _push(`</div><p class="text-[11px] text-gray-500 dark:text-gray-500">${ssrInterpolate(unref(t)("postForm.thumbnailFormats"))}</p></div>`);
      } else if (thumbnailMode.value === "url") {
        _push(`<div class="space-y-3"><input type="url"${ssrRenderAttr("value", thumbnailUrl.value)}${ssrRenderAttr("placeholder", unref(t)("postForm.enterImageUrl"))}${ssrIncludeBooleanAttr(fieldsLocked.value) ? " disabled" : ""} class="${ssrRenderClass([
          inputClasses.value,
          fieldsLocked.value ? "opacity-60 cursor-not-allowed" : ""
        ])}">`);
        if (previewUrl.value) {
          _push(`<div class="relative inline-block group"><div class="max-h-48 rounded-md border border-gray-300 dark:border-gray-600 object-cover shadow overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800" style="${ssrRenderStyle({ "min-width": "12rem", "min-height": "6rem" })}">`);
          if (!previewImageError.value) {
            _push(`<img${ssrRenderAttr("src", previewUrl.value)}${ssrRenderAttr("alt", title.value || unref(t)("postForm.thumbnail"))} class="object-cover w-full h-full" loading="lazy">`);
          } else {
            _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
          }
          _push(`</div><button type="button" class="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"${ssrRenderAttr("title", unref(t)("postForm.removeImage"))}>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:close",
            class: "w-4 h-4"
          }, null, _parent));
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-5"><h2 class="text-xs font-semibold tracking-wider text-gray-700 dark:text-gray-300 uppercase">${ssrInterpolate(unref(t)("postForm.options"))}</h2><div class="space-y-3"><button type="button"${ssrIncludeBooleanAttr(fieldsLocked.value) ? " disabled" : ""}${ssrRenderAttr("aria-pressed", commentsDisabled.value)} class="${ssrRenderClass([
        commentsDisabled.value ? "border-blue-300 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" : "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300",
        "inline-flex items-center gap-1 h-8 px-3 rounded-md text-[12px] font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
      ])}">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: commentsDisabled.value ? "mdi:comment-off" : "mdi:comment-outline",
        class: "w-4 h-4"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(commentsDisabled.value ? unref(t)("postForm.commentsDisabled") : unref(t)("postForm.disableComments"))}</span></button><p class="text-[11px] text-gray-500 dark:text-gray-400 -mt-1">${ssrInterpolate(unref(t)("postForm.commentsHelper"))}</p></div><div class="pt-2 space-y-3 hidden lg:block"><button type="submit" form="postForm"${ssrIncludeBooleanAttr(submitting.value || savingDraft.value || fieldsLocked.value) ? " disabled" : ""} class="w-full inline-flex items-center gap-2 h-11 justify-center rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: submitting.value && !savingDraft.value ? "mdi:loading" : "mdi:content-save",
        class: [
          "text-base",
          submitting.value && !savingDraft.value ? "animate-spin" : ""
        ]
      }, null, _parent));
      _push(` ${ssrInterpolate(publishButtonLabel.value)}</button>`);
      if (!fieldsLocked.value && (currentMode.value === "create" || currentMode.value === "edit" && status.value === "draft")) {
        _push(`<span class="block text-center text-xs text-gray-500 dark:text-gray-400"> OR </span>`);
      } else if (fieldsLocked.value) {
        _push(`<span class="block text-center text-xs text-gray-500 dark:text-gray-400"> You cannot save drafts when the post is archived. </span>`);
      } else {
        _push(`<!---->`);
      }
      if (!fieldsLocked.value && (currentMode.value === "create" || currentMode.value === "edit" && status.value === "draft")) {
        _push(`<button type="button"${ssrIncludeBooleanAttr(submitting.value || savingDraft.value) ? " disabled" : ""} class="w-full inline-flex items-center gap-2 h-11 justify-center rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: savingDraft.value ? "mdi:loading" : "mdi:content-save-outline",
          class: ["text-base", savingDraft.value ? "animate-spin" : ""]
        }, null, _parent));
        _push(` ${ssrInterpolate(savingDraft.value ? unref(t)("postForm.savingDraft") : unref(t)("postForm.saveDraft"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (currentMode.value === "edit" && currentPostId.value && slug.value) {
        _push(`<button type="button" class="w-full inline-flex items-center gap-2 h-10 justify-center rounded-md text-sm font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:eye-outline",
          class: "text-base"
        }, null, _parent));
        _push(`${ssrInterpolate(unref(t)("postForm.preview"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (currentMode.value === "edit" && currentPostId.value) {
        _push(`<button type="button"${ssrIncludeBooleanAttr(copyingPreview.value) ? " disabled" : ""} class="w-full inline-flex items-center gap-2 h-10 justify-center rounded-md text-sm font-medium bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/60 disabled:opacity-50">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: copyingPreview.value ? "mdi:loading" : "mdi:link-variant",
          class: ["text-base", copyingPreview.value ? "animate-spin" : ""]
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("postForm.copyPreviewLink"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></aside></div></div><div class="fixed inset-x-0 bottom-0 z-40 lg:hidden"><div class="mx-auto max-w-7xl px-4 pt-3 pb-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-700 shadow-lg"><div class="flex gap-3"><button form="postForm" type="submit"${ssrIncludeBooleanAttr(submitting.value || savingDraft.value || fieldsLocked.value) ? " disabled" : ""} class="flex-1 inline-flex items-center gap-2 h-11 justify-center rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: submitting.value && !savingDraft.value ? "mdi:loading" : "mdi:content-save",
        class: [
          "text-base",
          submitting.value && !savingDraft.value ? "animate-spin" : ""
        ]
      }, null, _parent));
      _push(` ${ssrInterpolate(publishButtonLabel.value)}</button>`);
      if (!fieldsLocked.value && (currentMode.value === "create" || currentMode.value === "edit" && status.value === "draft")) {
        _push(`<button type="button"${ssrIncludeBooleanAttr(submitting.value || savingDraft.value) ? " disabled" : ""} class="flex-1 inline-flex items-center gap-2 h-11 justify-center rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: savingDraft.value ? "mdi:loading" : "mdi:content-save-outline",
          class: ["text-base", savingDraft.value ? "animate-spin" : ""]
        }, null, _parent));
        _push(` ${ssrInterpolate(savingDraft.value ? unref(t)("postForm.savingDraft") : unref(t)("postForm.draft"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (showRemoveTranslationConfirm.value) {
        _push(ssrRenderComponent(_sfc_main$2, {
          open: showRemoveTranslationConfirm.value,
          title: unref(t)("common.confirmAction"),
          description: removeTranslationMessage.value,
          body: unref(t)("common.areYouSure"),
          "confirm-label": unref(t)("common.remove"),
          onConfirm: confirmRemoveTranslation,
          onCancel: cancelRemoveTranslation
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PostForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=PostForm-BZRPyYqM.mjs.map
