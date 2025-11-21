<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6"
  >
    <div class="flex items-start gap-3">
      <div
        class="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300"
      >
        <Icon icon="mdi:brush" class="w-6 h-6" />
      </div>
      <div class="flex-1">
        <h2
          class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"
        >
          Site Meta
        </h2>
        <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
          Update public site name, description and social links. Stored under
          key <code>branding</code> in <code>settings</code>.
        </p>
      </div>
    </div>
    <form @submit.prevent="save" class="space-y-5">
      <div>
        <label
          class="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1"
          >Site Name</label
        >
        <input
          v-model.trim="siteName"
          type="text"
          class="w-full h-11 rounded-md px-3 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your Site"
          required
        />
      </div>
      <div>
        <label
          class="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1"
          >Description</label
        >
        <textarea
          v-model.trim="siteDescription"
          rows="3"
          class="w-full rounded-md px-3 py-2 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Short tagline"
        ></textarea>
      </div>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label
            class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"
            >Social Links
            <span v-if="links.length" class="font-normal text-gray-400"
              >({{ links.length }})</span
            ></label
          >
          <div class="flex items-center gap-2">
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
              {{ collapsed ? "Expand" : "Collapse" }}
            </button>
            <button
              type="button"
              @click="addSocialLink"
              class="inline-flex items-center gap-1 h-7 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/60"
            >
              <Icon icon="mdi:plus" class="text-sm" /> Add
            </button>
          </div>
        </div>
        <div
          v-if="links.length === 0"
          class="text-[11px] text-gray-500 dark:text-gray-400"
        >
          No links added.
        </div>
        <transition name="fade">
          <div
            v-show="!collapsed"
            class="max-h-64 overflow-auto pr-1 custom-scroll space-y-3"
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
                    placeholder="Label"
                    class="h-9 rounded-md px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                  />
                  <input
                    v-model.trim="link.url"
                    type="text"
                    placeholder="https://"
                    class="h-9 rounded-md px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-3"
                  />
                </div>
                <div class="flex flex-wrap items-center gap-2 relative">
                  <button
                    type="button"
                    @click.stop="toggleIconPicker(i, $event)"
                    class="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 shrink-0 hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :aria-expanded="openIconIndex === i"
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
                          placeholder="Search (e.g. twitter)"
                          class="icon-picker-search flex-1 h-8 px-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          @click="closeIconPicker"
                          class="h-8 px-2 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
                        >
                          ✕
                        </button>
                      </div>
                      <div class="max-h-56 overflow-auto space-y-3 pr-1 custom-scroll">
                        <template v-if="filteredGroups.length">
                          <div v-for="group in filteredGroups" :key="group.label" class="space-y-1">
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
                          <span class="block">No matches</span>
                          <a href="https://icon-sets.iconify.design/mdi/" target="_blank" rel="noopener" class="underline block">See all icons</a>
                        </div>
                      </div>
                      <div class="flex justify-between pt-1">
                        <button
                          type="button"
                          @click="selectIcon(i, 'mdi:link-variant')"
                          class="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
                        >
                          Reset
                        </button>
                        <span class="text-[10px] text-gray-400 dark:text-gray-500">{{ totalIcons }} icons</span>
                      </div>
                    </div>
                  </Teleport>
                  <input
                    v-model.trim="link.icon"
                    type="text"
                    placeholder="mdi:icon-name"
                    class="flex-1 min-w-[140px] h-8 rounded-md px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @focus="openIconIndex = null"
                  />
                  <div class="flex items-center gap-1 ml-auto">
                    <button
                      type="button"
                      @click="moveLink(i, -1)"
                      :disabled="i === 0"
                      title="Move up"
                      class="inline-flex items-center justify-center h-8 w-8 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-40"
                    >
                      <Icon icon="mdi:arrow-up" class="text-sm" />
                    </button>
                    <button
                      type="button"
                      @click="moveLink(i, 1)"
                      :disabled="i === links.length - 1"
                      title="Move down"
                      class="inline-flex items-center justify-center h-8 w-8 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-40"
                    >
                      <Icon icon="mdi:arrow-down" class="text-sm" />
                    </button>
                    <button
                      type="button"
                      @click="removeSocialLink(i)"
                      class="inline-flex items-center gap-1 h-8 px-2 rounded-md text-[11px] font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60"
                    >
                      <Icon icon="mdi:delete" class="text-sm" /> Remove
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
          <span>{{ saving ? "Saving..." : "Save Changes" }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";
import { Icon } from "@iconify/vue";
import { useBranding, updateBranding } from "@/stores/brandingStore";
import { projectInfo } from "@/config/projectInfo";
import { useToast } from "vue-toastification";  

const branding = useBranding();
const toast = useToast();

const siteName = ref("");
const siteDescription = ref("");
const links = ref([]);
const collapsed = ref(false);
const saving = ref(false);
const message = ref("");
const error = ref(false);
const pendingAdds = ref(0);
const openIconIndex = ref(null);
const pickerCoords = ref({ top: 0, left: 0 });
const pickerStyle = computed(() => ({
  top: pickerCoords.value.top + "px",
  left: pickerCoords.value.left + "px",
}));
const iconSearch = ref("");
const iconGroups = [
  { label: 'Social', icons: ['mdi:facebook','mdi:facebook-messenger','mdi:instagram','mdi:twitter','mdi:reddit','mdi:pinterest','mdi:tumblr','mdi:snapchat','mdi:mastodon','mdi:vk','mdi:wechat','mdi:sina-weibo','ic:baseline-tiktok'] },
  { label: 'Media / Streaming', icons: ['mdi:youtube','mdi:vimeo','mdi:twitch','mdi:mixcloud','mdi:bandcamp','mdi:lastfm','mdi:flickr'] },
  { label: 'Messaging / Communication', icons: ['mdi:discord','mdi:slack','mdi:telegram','mdi:whatsapp','mdi:signal','mdi:skype'] },
  { label: 'Developer / Code', icons: ['mdi:github','mdi:github-face','mdi:gitlab','mdi:bitbucket','mdi:codepen','mdi:stack-overflow'] },
  { label: 'Content / Publishing', icons: ['mdi:medium','mdi:wordpress','mdi:newspaper','mdi:forum','mdi:dribbble','mdi:behance'] },
  { label: 'Community / Support', icons: ['mdi:patreon','mdi:steam','mdi:meetup','mdi:quora','mdi:disqus'] },
  { label: 'Corporate / Platform', icons: ['mdi:google','mdi:apple','mdi:android','mdi:microsoft'] },
  { label: 'General / Other', icons: ['mdi:link-variant','mdi:web','mdi:email','mdi:email-outline','mdi:earth','mdi:phone','mdi:account','mdi:star','mdi:bookmark','mdi:pen','mdi:feather','mdi:camera','mdi:cloud','mdi:message','mdi:rss'] }
];
const filteredGroups = computed(()=> {
  const term = iconSearch.value.trim().toLowerCase();
  return iconGroups
    .map(g=> ({ label: g.label, icons: g.icons.filter(ic => !term || ic.includes(term)) }))
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
  siteName.value = branding.siteName.value || "";
  siteDescription.value = branding.siteDescription.value || "";
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

function internalAdd() {
  links.value = [
    ...links.value,
    { id: safeId(), label: "", url: "", icon: "mdi:link-variant" },
  ];
  collapsed.value = false;
  nextTick(() => {
    const container = document.querySelector("[data-social-links]");
    if (container) {
      const inputs = container.querySelectorAll('input[placeholder="Label"]');
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
      const inputs = container.querySelectorAll('input[placeholder="Label"]');
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
    await updateBranding({
      lightFile: null,
      darkFile: null,
      faviconFile: null,
      siteName: siteName.value,
      siteDescription: siteDescription.value,
      socialLinks: cleaned,
    });
    projectInfo.applyBranding({
      siteName: siteName.value,
      siteDescription: siteDescription.value,
      socialLinks: cleaned,
    });
    toast.success("Branding updated");
    error.value = false;
  } catch (e) {
    console.error(e);
    toast.error("Error saving branding");
    error.value = true;
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
