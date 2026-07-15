<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6 min-w-0 w-full"
  >
    <div class="flex flex-wrap items-start gap-3 sm:flex-nowrap">
      <div
        class="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300"
      >
        <Icon icon="mdi:brush" class="w-6 h-6" />
      </div>
      <div class="flex-1 min-w-0">
        <h2
          class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase break-words"
        >
          {{ t('settings.siteMeta.title') }}
        </h2>
        <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1 break-words">
          {{ t('settings.siteMeta.description') }}
        </p>
      </div>
    </div>
    <form @submit.prevent="save" class="space-y-5">
      <div v-if="enabledLocalesList.length > 1" class="space-y-2">
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="code in enabledLocalesList"
            :key="code"
            type="button"
            class="inline-flex items-center gap-1 h-8 px-2.5 rounded-full text-[11px] font-medium uppercase tracking-wide transition"
            :class="
              manageLocale === code
                ? 'bg-blue-600 text-white'
                : hasMetaLocale(code)
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                  : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600'
            "
            :title="
              hasMetaLocale(code)
                ? t('settings.siteMeta.editLocale', { locale: code })
                : t('settings.siteMeta.addTranslationFor', { locale: code })
            "
            @click="switchManageLocale(code)"
          >
            <Icon
              :icon="hasMetaLocale(code) ? 'mdi:check' : 'mdi:plus'"
              class="text-sm"
            />
            {{ code }}
            <span
              v-if="code === primaryLocaleCode"
              class="text-[9px] font-semibold opacity-80 normal-case tracking-normal"
            >({{ t('settings.siteMeta.primary') }})</span>
          </button>
        </div>
        <p class="text-[11px] text-gray-500 dark:text-gray-400">
          {{ t('settings.siteMeta.manageLocaleHint') }}
        </p>
      </div>
      <div>
        <label
          class="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1"
          >{{ t('settings.siteMeta.siteName') }}
          <span v-if="enabledLocalesList.length > 1" class="font-normal normal-case tracking-normal text-gray-400"
            >({{ manageLocale }})</span
          ></label
        >
        <input
          v-model.trim="siteName"
          type="text"
          class="w-full h-11 rounded-md px-3 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :placeholder="t('settings.siteMeta.siteNamePlaceholder')"
          :required="manageLocale === primaryLocaleCode"
        />
      </div>
      <div>
        <label
          class="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1"
          >{{ t('settings.siteMeta.siteDescription') }}
          <span v-if="enabledLocalesList.length > 1" class="font-normal normal-case tracking-normal text-gray-400"
            >({{ manageLocale }})</span
          ></label
        >
        <textarea
          v-model.trim="siteDescription"
          rows="3"
          class="w-full rounded-md px-3 py-2 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          :placeholder="t('settings.siteMeta.siteDescriptionPlaceholder')"
        ></textarea>
      </div>
      <div
        v-if="manageLocale !== primaryLocaleCode && hasMetaLocale(manageLocale)"
        class="flex justify-end"
      >
        <button
          type="button"
          class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[11px] font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60"
          :disabled="saving"
          @click="removeCurrentTranslation"
        >
          <Icon icon="mdi:delete-outline" class="text-sm" />
          {{ t('settings.siteMeta.deleteTranslation') }}
        </button>
      </div>
      <div>
        <label
          class="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1"
          >{{ t('settings.siteMeta.twitterHandle') }}</label
        >
        <div
          class="flex items-center h-11 rounded-md bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden"
        >
          <span class="ps-3 text-sm text-gray-400 select-none">@</span>
          <input
            v-model.trim="twitterHandle"
            type="text"
            class="flex-1 h-full px-2 bg-transparent text-sm focus:outline-none"
            :placeholder="t('settings.siteMeta.twitterHandlePlaceholder')"
            autocomplete="off"
            maxlength="15"
          />
        </div>
        <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          {{ t('settings.siteMeta.twitterHint') }}
        </p>
      </div>
      <div class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <label
            class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"
            >{{ t('settings.siteMeta.socialLinks') }}
            <span v-if="links.length" class="font-normal text-gray-400"
              >({{ links.length }})</span
            ></label
          >
          <div class="flex flex-wrap items-center gap-2 justify-end">
            <button
              v-if="links.length"
              type="button"
              @click="collapsed = !collapsed"
              class="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/60"
            >
              <Icon
                :icon="collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'"
                class="text-sm"
              />
              {{ collapsed ? t('settings.siteMeta.expand') : t('settings.siteMeta.collapse') }}
            </button>
            <button
              type="button"
              @click="addSocialLink"
              class="inline-flex items-center gap-1 h-7 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/60"
            >
              <Icon icon="mdi:plus" class="text-sm" /> {{ t('settings.siteMeta.add') }}
            </button>
          </div>
        </div>
        <div
          v-if="links.length === 0"
          class="text-[11px] text-gray-500 dark:text-gray-400"
        >
          {{ t('settings.siteMeta.noLinks') }}
        </div>
        <transition name="fade">
          <div
            v-show="!collapsed"
            class="max-h-64 overflow-auto pe-1 custom-scroll space-y-3"
            data-social-links
          >
            <ul class="space-y-3">
              <li
                v-for="(link, i) in links"
                :key="link.id"
                class="group relative border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/30 flex flex-col gap-2"
              >
                <div class="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                  <input
                    v-model.trim="link.label"
                    type="text"
                    data-link-label
                    :placeholder="t('settings.siteMeta.labelPlaceholder')"
                    class="h-9 rounded-md px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                  />
                  <input
                    v-model.trim="link.url"
                    type="text"
                    :placeholder="t('settings.siteMeta.urlPlaceholder')"
                    class="h-9 rounded-md px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-3"
                  />
                </div>
                <div class="flex flex-wrap items-center gap-2 relative w-full">
                  <button
                    type="button"
                    @click.stop="toggleIconPicker(i, $event)"
                    class="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 shrink-0 hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :aria-expanded="openIconIndex === i"
                    :aria-label="t('settings.siteMeta.pickIcon')"
                  >
                    <Icon
                      :icon="link.icon || 'mdi:link-variant'"
                      class="w-5 h-5"
                    />
                  </button>
                  <Teleport to="body">
                    <div
                      v-if="openIconIndex === i"
                      class="icon-picker-panel fixed z-[1000] w-72 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg space-y-2"
                      :style="pickerStyle"
                      @click.stop
                    >
                      <div class="flex items-center gap-2">
                        <input
                          v-model.trim="iconSearch"
                          type="text"
                          :placeholder="t('settings.siteMeta.iconSearchPlaceholder')"
                          class="icon-picker-search flex-1 h-8 px-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          @click="closeIconPicker"
                          class="h-8 px-2 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
                          :aria-label="t('common.close')"
                        >
                          ✕
                        </button>
                      </div>
                      <div class="max-h-56 overflow-auto space-y-3 pe-1 custom-scroll">
                        <template v-if="filteredGroups.length">
                          <div v-for="group in filteredGroups" :key="group.key" class="space-y-1">
                            <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{{ group.label }}</div>
                            <div class="grid grid-cols-5 gap-2">
                              <button v-for="ic in group.icons" :key="ic" type="button" @click="selectIcon(i, ic)" :title="ic" class="group w-12 h-12 rounded-md border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-0.5 text-[9px] text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'ring-2 ring-blue-500': ic === link.icon }">
                                <Icon :icon="ic" class="w-5 h-5" />
                                <span class="truncate w-full px-1 group-hover:text-blue-600 dark:group-hover:text-blue-300">{{ ic.split(':')[1] }}</span>
                              </button>
                            </div>
                          </div>
                        </template>
                        <div v-else class="text-[11px] text-gray-500 dark:text-gray-400 py-4 text-center">
                          <span class="block">{{ t('settings.siteMeta.noMatches') }}</span>
                          <a href="https://icon-sets.iconify.design/mdi/" target="_blank" rel="noopener" class="underline block">{{ t('settings.siteMeta.seeAllIcons') }}</a>
                        </div>
                      </div>
                      <div class="flex justify-between pt-1">
                        <button
                          type="button"
                          @click="selectIcon(i, 'mdi:link-variant')"
                          class="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
                        >
                          {{ t('common.reset') }}
                        </button>
                        <span class="text-[10px] text-gray-400 dark:text-gray-500">{{ t('settings.siteMeta.iconsCount', { count: totalIcons }) }}</span>
                      </div>
                    </div>
                  </Teleport>
                  <input
                    v-model.trim="link.icon"
                    type="text"
                    :placeholder="t('settings.siteMeta.iconPlaceholder')"
                    class="flex-1 min-w-[140px] h-8 rounded-md px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @focus="openIconIndex = null"
                  />
                  <div class="flex flex-wrap items-center gap-1 ms-auto w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      @click="moveLink(i, -1)"
                      :disabled="i === 0"
                      :title="t('settings.siteMeta.moveUp')"
                      :aria-label="t('settings.siteMeta.moveUp')"
                      class="inline-flex items-center justify-center h-8 w-8 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-40"
                    >
                      <Icon icon="mdi:arrow-up" class="text-sm" />
                    </button>
                    <button
                      type="button"
                      @click="moveLink(i, 1)"
                      :disabled="i === links.length - 1"
                      :title="t('settings.siteMeta.moveDown')"
                      :aria-label="t('settings.siteMeta.moveDown')"
                      class="inline-flex items-center justify-center h-8 w-8 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-40"
                    >
                      <Icon icon="mdi:arrow-down" class="text-sm" />
                    </button>
                    <button
                      type="button"
                      @click="removeSocialLink(i)"
                      class="inline-flex items-center gap-1 h-8 px-2 rounded-md text-[11px] font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60"
                    >
                      <Icon icon="mdi:delete" class="text-sm" /> {{ t('common.remove') }}
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          :disabled="saving"
          class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40"
        >
          <Icon
            :icon="saving ? 'mdi:loading' : 'mdi:content-save'"
            :class="saving ? 'animate-spin' : ''"
            class="text-base"
          />
          <span>{{ saving ? t('common.saving') : t('common.save') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()

import {
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";
import { Icon } from "@iconify/vue";
import { useBranding } from "@/stores/brandingStore";
import { projectInfo } from "@/config/projectInfo";
const branding = useBranding();
const { updateBranding } = branding;
const toast = useToast();

const siteName = ref("");
const siteDescription = ref("");
const twitterHandle = ref("");
const links = ref([]);
const collapsed = ref(false);
const saving = ref(false);
const message = ref("");
const error = ref(false);
const pendingAdds = ref(0);
const openIconIndex = ref(null);
const manageLocale = ref("en");
const pickerCoords = ref({ top: 0, left: 0 });
const pickerStyle = computed(() => ({
  top: pickerCoords.value.top + "px",
  left: pickerCoords.value.left + "px",
}));

const enabledLocalesList = computed(() => branding.enabledLocales.value || []);
const primaryLocaleCode = computed(() => branding.primaryLocale.value || "en");

function hasMetaLocale(code) {
  if (code === primaryLocaleCode.value) {
    return !!(branding.siteName.value || branding.siteDescription.value);
  }
  const tr = branding.metaTranslations.value?.[code];
  return !!(tr?.siteName || tr?.siteDescription);
}

function loadLocaleFields(code) {
  if (code === primaryLocaleCode.value) {
    siteName.value = branding.siteName.value || "";
    siteDescription.value = branding.siteDescription.value || "";
    return;
  }
  const tr = branding.metaTranslations.value?.[code];
  if (tr?.siteName || tr?.siteDescription) {
    siteName.value = tr.siteName || "";
    siteDescription.value = tr.siteDescription || "";
  } else {
    // Prefill new translation from primary
    siteName.value = branding.siteName.value || "";
    siteDescription.value = branding.siteDescription.value || "";
  }
}

function switchManageLocale(code) {
  manageLocale.value = code;
  loadLocaleFields(code);
}
const iconSearch = ref("");
const iconGroupDefs = [
  { key: 'social', icons: ['mdi:facebook','mdi:facebook-messenger','mdi:instagram','mdi:twitter','mdi:reddit','mdi:pinterest','mdi:tumblr','mdi:snapchat','mdi:mastodon','mdi:vk','mdi:wechat','mdi:sina-weibo','ic:baseline-tiktok'] },
  { key: 'media', icons: ['mdi:youtube','mdi:vimeo','mdi:twitch','mdi:mixcloud','mdi:bandcamp','mdi:lastfm','mdi:flickr'] },
  { key: 'messaging', icons: ['mdi:discord','mdi:slack','mdi:telegram','mdi:whatsapp','mdi:signal','mdi:skype'] },
  { key: 'developer', icons: ['mdi:github','mdi:github-face','mdi:gitlab','mdi:bitbucket','mdi:codepen','mdi:stack-overflow'] },
  { key: 'content', icons: ['mdi:medium','mdi:wordpress','mdi:newspaper','mdi:forum','mdi:dribbble','mdi:behance'] },
  { key: 'community', icons: ['mdi:patreon','mdi:steam','mdi:meetup','mdi:quora','mdi:disqus'] },
  { key: 'corporate', icons: ['mdi:google','mdi:apple','mdi:android','mdi:microsoft'] },
  { key: 'general', icons: ['mdi:link-variant','mdi:web','mdi:email','mdi:email-outline','mdi:earth','mdi:phone','mdi:account','mdi:star','mdi:bookmark','mdi:pen','mdi:feather','mdi:camera','mdi:cloud','mdi:message','mdi:rss'] }
];
const filteredGroups = computed(()=> {
  const term = iconSearch.value.trim().toLowerCase();
  return iconGroupDefs
    .map(g=> ({
      key: g.key,
      label: t(`settings.siteMeta.iconGroups.${g.key}`),
      icons: g.icons.filter(ic => !term || ic.includes(term)),
    }))
    .filter(g=> g.icons.length);
});
const totalIcons = computed(()=> filteredGroups.value.reduce((sum,g)=> sum + g.icons.length, 0));
function toggleIconPicker(i, evt) {
  if (openIconIndex.value === i) {
    openIconIndex.value = null;
    return;
  }
  openIconIndex.value = i;
  positionPicker(evt.currentTarget);
  iconSearch.value = "";
  nextTick(() => {
    const el = document.querySelector(".icon-picker-search");
    el && el.focus();
  });
}

function positionPicker(triggerEl) {
  if (!triggerEl) return;
  const btn = triggerEl.getBoundingClientRect();
  const panelWidth = 288;
  const panelHeight = 340;
  const gap = 6;
  let left = btn.left;
  if (left + panelWidth > window.innerWidth - 8)
    left = window.innerWidth - panelWidth - 8;
  if (left < 8) left = 8;
  const spaceBelow = window.innerHeight - btn.bottom;
  let top;
  if (spaceBelow >= panelHeight + 8) {
    top = btn.bottom + gap;
  } else {
    top = btn.top - panelHeight - gap;
    if (top < 8) top = Math.max(8, btn.bottom + gap);
  }
  pickerCoords.value = { top: Math.round(top), left: Math.round(left) };
}
function selectIcon(i, iconName) {
  if (!links.value[i]) return;
  links.value[i].icon = iconName;
  openIconIndex.value = null;
}
function closeIconPicker() {
  openIconIndex.value = null;
}
const keydownHandler = (e) => {
  if (e.key === "Escape") openIconIndex.value = null;
};
const outsideHandler = (e) => {
  if (openIconIndex.value === null) return;
  const panel = document.querySelector(".icon-picker-panel");
  if (panel && panel.contains(e.target)) return;
  const toggleBtn = e.target.closest("button[aria-expanded]");
  if (toggleBtn) return;
  openIconIndex.value = null;
};
onMounted(() => {
  window.addEventListener("keydown", keydownHandler);
  window.addEventListener("mousedown", outsideHandler, true);
  const reposition = () => {
    if (openIconIndex.value === null) return;
    const list = document.querySelector("[data-social-links]");
    if (!list) return;
    const buttons = list.querySelectorAll("button[aria-expanded]");
    const btn = buttons[openIconIndex.value];
    if (btn) positionPicker(btn);
  };
  window.addEventListener("scroll", reposition, true);
  window.addEventListener("resize", reposition);
  window.__plumaIconPickerReposition = reposition;
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", keydownHandler);
  window.removeEventListener("mousedown", outsideHandler, true);
  if (window.__plumaIconPickerReposition) {
    window.removeEventListener(
      "scroll",
      window.__plumaIconPickerReposition,
      true
    );
    window.removeEventListener("resize", window.__plumaIconPickerReposition);
    delete window.__plumaIconPickerReposition;
  }
});

function safeId() {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch (_) {}
  return (
    "sl_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
  );
}

function init() {
  manageLocale.value = primaryLocaleCode.value;
  loadLocaleFields(manageLocale.value);
  twitterHandle.value = (branding.twitterHandle.value || "").replace(/^@/, "");
  links.value = (branding.socialLinks.value || []).map((l) => ({
    id: safeId(),
    label: l.label || "",
    url: l.url || "",
    icon: l.icon || "mdi:link-variant",
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

watch(
  () => [branding.primaryLocale.value, branding.enabledLocales.value?.join(",")],
  () => {
    if (!branding.brandingLoaded.value) return;
    if (!enabledLocalesList.value.includes(manageLocale.value)) {
      manageLocale.value = primaryLocaleCode.value;
    }
    loadLocaleFields(manageLocale.value);
  }
);

function internalAdd() {
  links.value = [
    ...links.value,
    { id: safeId(), label: "", url: "", icon: "mdi:link-variant" },
  ];
  collapsed.value = false;
  nextTick(() => {
    const container = document.querySelector("[data-social-links]");
    if (container) {
      const inputs = container.querySelectorAll("input[data-link-label]");
      inputs[inputs.length - 1]?.focus();
    }
  });
}
function addSocialLink() {
  if (!branding.brandingLoaded.value) {
    pendingAdds.value++;
    return;
  }
  internalAdd();
}
function removeSocialLink(i) {
  links.value.splice(i, 1);
}

function moveLink(i, delta) {
  const newIndex = i + delta;
  if (newIndex < 0 || newIndex >= links.value.length) return;
  openIconIndex.value = null;
  const arr = [...links.value];
  const [item] = arr.splice(i, 1);
  arr.splice(newIndex, 0, item);
  links.value = arr;
  nextTick(() => {
    const container = document.querySelector("[data-social-links]");
    if (container) {
      const inputs = container.querySelectorAll("input[data-link-label]");
      inputs[newIndex]?.focus();
    }
  });
}

async function save() {
  if (saving.value) return;
  saving.value = true;
  error.value = false;
  try {
    const cleaned = links.value
      .map((l) => ({
        label: l.label.trim(),
        url: l.url.trim(),
        icon: l.icon.trim() || "mdi:link-variant",
      }))
      .filter((l) => l.label && l.url);

    const translations = {
      ...(branding.metaTranslations.value || {}),
    };
    const payload = {
      lightFile: null,
      darkFile: null,
      faviconFile: null,
      twitterHandle: twitterHandle.value,
      socialLinks: cleaned,
    };

    if (manageLocale.value === primaryLocaleCode.value) {
      if (!siteName.value.trim()) {
        toast.error(t("settings.siteMeta.siteNameRequired"));
        return;
      }
      payload.siteName = siteName.value;
      payload.siteDescription = siteDescription.value;
      delete translations[manageLocale.value];
      payload.metaTranslations = translations;
    } else {
      const name = siteName.value.trim();
      const desc = siteDescription.value.trim();
      if (!name && !desc) {
        toast.error(t("settings.siteMeta.translationEmpty"));
        return;
      }
      translations[manageLocale.value] = {
        siteName: name || null,
        siteDescription: desc || null,
      };
      payload.metaTranslations = translations;
    }

    await updateBranding(payload);
    projectInfo.applyBranding({
      siteName: branding.resolveLocalizedSiteName(locale.value),
      siteDescription: branding.resolveLocalizedSiteDescription(locale.value),
      socialLinks: cleaned,
    });
    toast.success(t("settings.siteMeta.updated"));
    try {
      const { refreshDocumentSeo } = await import("@/utils/refreshDocumentSeo");
      refreshDocumentSeo?.();
    } catch (_) {}
    error.value = false;
  } catch (e) {
    console.error(e);
    toast.error(t("settings.siteMeta.saveFailed"));
    error.value = true;
  } finally {
    saving.value = false;
  }
}

async function removeCurrentTranslation() {
  if (manageLocale.value === primaryLocaleCode.value || saving.value) return;
  saving.value = true;
  try {
    const translations = { ...(branding.metaTranslations.value || {}) };
    delete translations[manageLocale.value];
    await updateBranding({
      lightFile: null,
      darkFile: null,
      faviconFile: null,
      metaTranslations: translations,
    });
    loadLocaleFields(manageLocale.value);
    toast.success(t("settings.siteMeta.translationDeleted"));
  } catch (e) {
    console.error(e);
    toast.error(t("settings.siteMeta.saveFailed"));
  } finally {
    saving.value = false;
  }
}

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
.custom-scroll::-webkit-scrollbar { width: 6px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.4); border-radius: 3px; }
.custom-scroll:hover::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.7); }
</style>
