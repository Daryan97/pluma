<template>
  <div class="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
    <header class="space-y-4">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300 mb-2">
            <Icon icon="mdi:flask-outline" class="text-base" />
            Dev only
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Internal Test &amp; Debug
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Development diagnostics for Supabase, auth, branding, i18n, and feeds.
            Guarded by <code class="text-xs">devOnly</code> meta and
            <code class="text-xs">VITE_ENV=development</code>.
          </p>
        </div>
        <button
          type="button"
          :disabled="suiteRunning"
          class="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          @click="runQuickSuite"
        >
          <Icon
            :icon="suiteRunning ? 'mdi:loading' : 'mdi:play-circle-outline'"
            :class="suiteRunning ? 'animate-spin' : ''"
            class="text-lg"
          />
          {{ suiteRunning ? "Running…" : "Run quick suite" }}
        </button>
      </div>

      <div
        v-if="suiteSummary"
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <div class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="item in suiteSummary.checks"
            :key="item.name"
            class="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-medium"
            :class="
              item.ok
                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            "
          >
            <Icon :icon="item.ok ? 'mdi:check' : 'mdi:close'" class="text-sm" />
            {{ item.name }}
          </span>
        </div>
        <pre class="text-[11px] leading-tight overflow-x-auto text-gray-700 dark:text-gray-300">{{
          formatJson(suiteSummary)
        }}</pre>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
    <!-- Storage -->
    <section :class="cardClass">
      <div :class="cardHeaderClass">
        <div class="flex items-center gap-2 min-w-0">
          <span :class="iconWrap">
            <Icon icon="mdi:bucket-outline" class="w-5 h-5" />
          </span>
          <div class="min-w-0">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100">
              Storage buckets
            </h2>
            <p class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
              List or inspect Supabase storage buckets.
            </p>
          </div>
        </div>
        <div class="flex gap-2 shrink-0">
          <button type="button" :class="btnSoft" :disabled="loading" @click="listBuckets">
            {{ loading && action === "list" ? "Listing…" : "List" }}
          </button>
          <button
            type="button"
            :class="btnSoft"
            :disabled="loading || !bucketName"
            @click="checkBucket"
          >
            {{ loading && action === "check" ? "Checking…" : "Check" }}
          </button>
        </div>
      </div>
      <div :class="cardSlotClass">
        <input
          v-model="bucketName"
          type="text"
          placeholder="bucket name"
          :class="inputClass"
        />
      </div>
      <pre :class="result || errorMsg ? preClass : emptyPreClass">{{
        errorMsg ? "ERROR: " + errorMsg : result || "No result yet."
      }}</pre>
    </section>

    <!-- Stats -->
    <section :class="cardClass">
      <div :class="cardHeaderClass">
        <div class="flex items-center gap-2 min-w-0">
          <span :class="iconWrap">
            <Icon icon="mdi:chart-box-outline" class="w-5 h-5" />
          </span>
          <div class="min-w-0">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100">
              Full stats
            </h2>
            <p class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
              Aggregate counts for posts, users, categories, series, comments.
            </p>
          </div>
        </div>
        <button type="button" :class="btnSoft" :disabled="statsLoading" @click="loadFullStats">
          {{ statsLoading ? "Refreshing…" : "Refresh" }}
        </button>
      </div>
      <div :class="cardSlotClass">
        <span v-if="statsRls" class="text-[11px] text-amber-700 dark:text-amber-300 truncate">
          RLS may be blocking some counts.
        </span>
      </div>
      <pre :class="statsResult ? preClass : emptyPreClass">{{
        statsResult || "No stats loaded yet."
      }}</pre>
    </section>

    <!-- Auth -->
    <section :class="cardClass">
      <div :class="cardHeaderClass">
        <div class="flex items-center gap-2 min-w-0">
          <span :class="iconWrap">
            <Icon icon="mdi:account-key-outline" class="w-5 h-5" />
          </span>
          <div class="min-w-0">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100">
              Auth &amp; session
            </h2>
            <p class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
              Current session and profile role.
            </p>
          </div>
        </div>
        <div class="flex gap-2 shrink-0">
          <button type="button" :class="btnSoft" @click="refreshSession">Refresh</button>
          <button type="button" :class="btnDanger" :disabled="!sessionUser" @click="signOut">
            Sign out
          </button>
        </div>
      </div>
      <div :class="cardSlotClass">
        <span :class="chipClass">User: {{ sessionUser?.email || "none" }}</span>
        <span :class="chipClass">Role: {{ profileRole || "n/a" }}</span>
        <span :class="chipClass">Expires: {{ sessionExpiry || "n/a" }}</span>
      </div>
      <pre :class="sessionRaw ? preClass : emptyPreClass">{{
        sessionRaw || "No session data."
      }}</pre>
    </section>

    <!-- Locale / i18n -->
    <section :class="cardClass">
      <div :class="cardHeaderClass">
        <div class="flex items-center gap-2 min-w-0">
          <span :class="iconWrap">
            <Icon icon="mdi:translate" class="w-5 h-5" />
          </span>
          <div class="min-w-0">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100">
              Locale &amp; i18n
            </h2>
            <p class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
              Cookie, branding locales, posts by locale.
            </p>
          </div>
        </div>
        <button
          type="button"
          :class="btnSoft"
          :disabled="localeDiagLoading"
          @click="loadLocaleDiagnostics"
        >
          {{ localeDiagLoading ? "Loading…" : "Refresh" }}
        </button>
      </div>
      <div :class="cardSlotClass">
        <span :class="chipClass">UI: {{ locale }}</span>
        <span :class="chipClass">Cookie: {{ localeCookie || "(none)" }}</span>
        <span :class="chipClass">Primary: {{ branding.primaryLocale?.value || "—" }}</span>
        <span :class="chipClass">Content: {{ contentLocale }}</span>
      </div>
      <pre :class="localeDiagRaw ? preClass : emptyPreClass">{{
        localeDiagRaw || "No locale diagnostics yet."
      }}</pre>
    </section>

    <!-- Feeds / health -->
    <section :class="cardClass">
      <div :class="cardHeaderClass">
        <div class="flex items-center gap-2 min-w-0">
          <span :class="iconWrap">
            <Icon icon="mdi:rss" class="w-5 h-5" />
          </span>
          <div class="min-w-0">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100">
              Feeds &amp; health
            </h2>
            <p class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
              Probe public feed and health endpoints.
            </p>
          </div>
        </div>
        <button type="button" :class="btnSoft" :disabled="feedsLoading" @click="probeFeeds">
          {{ feedsLoading ? "Probing…" : "Probe" }}
        </button>
      </div>
      <div :class="cardSlotClass">
        <span class="text-[11px] text-gray-500 dark:text-gray-400 truncate">
          Origin: {{ getCurrentSiteOrigin() || "—" }}
        </span>
      </div>
      <pre :class="feedsRaw ? preClass : emptyPreClass">{{
        feedsRaw || "No feed probe yet."
      }}</pre>
    </section>

    <!-- Runtime env -->
    <section :class="cardClass">
      <div :class="cardHeaderClass">
        <div class="flex items-center gap-2 min-w-0">
          <span :class="iconWrap">
            <Icon icon="mdi:cog-outline" class="w-5 h-5" />
          </span>
          <div class="min-w-0">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100">
              Runtime config
            </h2>
            <p class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
              Public runtime values (secrets masked).
            </p>
          </div>
        </div>
        <button type="button" :class="btnSoft" @click="loadRuntimeEnv">Refresh</button>
      </div>
      <div :class="cardSlotClass" />
      <pre :class="runtimeRaw ? preClass : emptyPreClass">{{
        runtimeRaw || "No runtime data yet."
      }}</pre>
    </section>

    <!-- Settings & branding -->
    <section :class="cardWideClass">
      <div class="flex flex-wrap items-center gap-2 min-h-0">
        <span :class="iconWrap">
          <Icon icon="mdi:palette-outline" class="w-5 h-5" />
        </span>
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100 flex-1">
          Settings &amp; branding
        </h2>
        <button type="button" :class="btnSoft" @click="loadSettings">Settings</button>
        <button type="button" :class="btnSoft" @click="loadBranding">Branding</button>
      </div>
      <div
        v-if="settingsRaw"
        class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] min-h-0"
      >
        <div>
          <div class="text-gray-500">Installation</div>
          <div class="truncate">{{ installationDisplay() }}</div>
        </div>
        <div>
          <div class="text-gray-500">Auth providers</div>
          <div class="truncate">{{ authProvidersDisplay() }}</div>
        </div>
        <div>
          <div class="text-gray-500">Site origin</div>
          <div class="truncate">{{ siteOriginDisplay() }}</div>
        </div>
        <div>
          <div class="text-gray-500">Site title</div>
          <div class="truncate">{{ siteTitleDisplay() }}</div>
        </div>
      </div>
      <div v-else :class="cardSlotClass" />
      <div class="grid md:grid-cols-2 gap-4 min-h-0 h-full">
        <pre :class="settingsRaw ? preClass : emptyPreClass">{{
          settingsRaw || "No settings data"
        }}</pre>
        <pre :class="brandingRaw ? preClass : emptyPreClass">{{
          brandingRaw || "No branding data"
        }}</pre>
      </div>
    </section>

    <!-- RLS -->
    <section :class="cardClass">
      <div :class="cardHeaderClass">
        <div class="flex items-center gap-2 min-w-0">
          <span :class="iconWrap">
            <Icon icon="mdi:shield-key-outline" class="w-5 h-5" />
          </span>
          <div class="min-w-0">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100">
              RLS probe
            </h2>
            <p class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
              Select * limit 5 from a table.
            </p>
          </div>
        </div>
      </div>
      <div :class="cardSlotClass">
        <button
          v-for="tbl in rlsTables"
          :key="tbl"
          type="button"
          :class="btnChip"
          @click="probeTable(tbl)"
        >
          {{ tbl }}
        </button>
      </div>
      <pre :class="rlsResult ? preClass : emptyPreClass">{{
        rlsResult || "Pick a table to probe."
      }}</pre>
    </section>

    <!-- Latency -->
    <section :class="cardClass">
      <div :class="cardHeaderClass">
        <div class="flex items-center gap-2 min-w-0">
          <span :class="iconWrap">
            <Icon icon="mdi:timer-outline" class="w-5 h-5" />
          </span>
          <div class="min-w-0">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100">
              Latency
            </h2>
            <p class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
              Round-trip ping to settings.
            </p>
          </div>
        </div>
        <button type="button" :class="btnSoft" @click="measureLatency">Ping</button>
      </div>
      <div :class="cardSlotClass">
        <span class="text-[11px] text-gray-500 dark:text-gray-400">
          {{ latencyMs !== null ? `${latencyMs} ms` : "—" }}
        </span>
      </div>
      <pre :class="latencyMs !== null ? preClass : emptyPreClass">{{
        latencyMs !== null
          ? formatJson({ ping_ms: latencyMs, at: new Date().toISOString() })
          : "Click Ping to measure."
      }}</pre>
    </section>

    <!-- Local storage -->
    <section :class="cardWideClass">
      <div :class="cardHeaderClass">
        <div class="flex items-center gap-2 min-w-0">
          <span :class="iconWrap">
            <Icon icon="mdi:database-outline" class="w-5 h-5" />
          </span>
          <div class="min-w-0">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100">
              Local storage
            </h2>
            <p class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
              Dump or clear this origin’s localStorage.
            </p>
          </div>
        </div>
        <div class="flex gap-2 shrink-0">
          <button type="button" :class="btnSoft" @click="readLocalStorage">Read</button>
          <button type="button" :class="btnDanger" @click="askClearLocalStorage">Clear</button>
        </div>
      </div>
      <div :class="cardSlotClass" />
      <pre :class="localStorageDump ? preClass : emptyPreClass">{{
        localStorageDump || "No localStorage dump yet."
      }}</pre>
    </section>

    <!-- Dev tools -->
    <section :class="cardWideClass">
      <div class="flex flex-wrap items-center gap-2 min-h-0">
        <span :class="iconWrap">
          <Icon icon="mdi:tools" class="w-5 h-5" />
        </span>
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100 flex-1">
          Dev tools
        </h2>
        <div class="flex flex-wrap gap-2">
          <button type="button" :class="btnChip" @click="toggleTheme">Toggle theme</button>
          <button type="button" :class="btnChip" @click="seedCategories">Seed categories</button>
          <button type="button" :class="btnChip" @click="latencyDistribution">Latency dist</button>
          <button type="button" :class="btnChip" @click="concurrencyBenchmark">Concurrency</button>
          <button type="button" :class="btnChip" :disabled="e2eRunning" @click="e2eRenderTime">
            {{ e2eRunning ? "E2E…" : "E2E render" }}
          </button>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 min-h-0">
        <button type="button" :class="btnBlock" @click="createDummyPost">Create dummy post</button>
        <button type="button" :class="btnBlock" @click="createMultiLocalePost">
          Create multi-locale post
        </button>
        <button type="button" :class="btnBlock" @click="archiveLatest">Archive latest post</button>
        <button type="button" :class="btnBlock" @click="unarchiveLatest">
          Unarchive latest post
        </button>
        <button type="button" :class="btnBlock" @click="listTestPosts">List test posts</button>
        <button type="button" :class="btnBlockDanger" @click="askDeleteTestPosts">
          Delete test posts
        </button>
      </div>
      <pre :class="devResult ? preClass : emptyPreClass">{{
        devResult || "No action yet."
      }}</pre>
    </section>
    </div>

    <ConfirmDialog
      v-if="confirmOpen"
      :open="confirmOpen"
      :title="confirmTitle"
      :description="confirmDescription"
      :body="t('common.areYouSure')"
      :confirm-label="confirmLabel"
      @confirm="onConfirm"
      @cancel="confirmOpen = false"
    />
  </div>
</template>

<script setup>
definePageMeta({ devOnly: true });

import { ref, computed, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";
import { supabase } from "@/services/supabase";
import { useBranding, fetchBranding } from "@/stores/brandingStore";
import { getBrowserOrigin, getBrowserUrl } from "@/lib/utils";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

const { t, locale, locales, defaultLocale } = useI18n();
const localePath = useLocalePath();
const branding = useBranding();
const { contentLocale } = useContentLocale();
const runtimeConfig = useRuntimeConfig();
const localeCookieName = ["pluma", "locale"].join("_");
const localeCookieRef = useCookie(localeCookieName);

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

const localeCookie = computed(() => localeCookieRef.value || "");

const devResult = ref("");
const suiteRunning = ref(false);
const suiteSummary = ref(null);
const e2eRunning = ref(false);
let e2eCleanup = null;
const confirmOpen = ref(false);
const confirmTitle = ref("");
const confirmDescription = ref("");
const confirmLabel = ref("");
let confirmAction = null;

/** Origin of the page you're on — not VITE_SITE_URL (which may be a fixed port). */
function getCurrentSiteOrigin() {
  if (import.meta.client && typeof window !== "undefined") {
    return window.location.origin;
  }
  return getBrowserOrigin();
}

function formatJson(obj) {
  try {
    return typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

function setDevResult(obj) {
  devResult.value = formatJson(obj);
}

function askConfirm(title, description, label, action) {
  confirmTitle.value = title;
  confirmDescription.value = description;
  confirmLabel.value = label;
  confirmAction = action;
  confirmOpen.value = true;
}

function onConfirm() {
  confirmOpen.value = false;
  const fn = confirmAction;
  confirmAction = null;
  if (typeof fn === "function") fn();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  document.documentElement.style.colorScheme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* ignore */
  }
  setDevResult(`Theme -> ${next}`);
}

async function seedCategories() {
  setDevResult("Seeding...");
  try {
    const enabled = branding.enabledLocales?.value;
    const locales =
      Array.isArray(enabled) && enabled.length
        ? enabled
        : [branding.primaryLocale?.value || unref(locale) || "en"];
    const names = [
      { name: "Announcements", slug: "announcements" },
      { name: "Tutorials", slug: "tutorials" },
      { name: "Guides", slug: "guides" },
    ];
    const rows = [];
    for (const item of names) {
      const groupId = crypto.randomUUID();
      for (const loc of locales) {
        rows.push({
          name: item.name,
          slug: item.slug,
          locale: loc,
          translation_group_id: groupId,
        });
      }
    }
    const { data, error } = await supabase
      .from("categories")
      .upsert(rows, { onConflict: "locale,slug" })
      .select("*");
    if (error) throw error;
    setDevResult({ seeded: data?.length || 0, locales, rows: data });
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

async function createDummyPost() {
  setDevResult("Creating...");
  try {
    const stamp = Date.now();
    const title = `Test Post ${stamp}`;
    const slug = `test-post-${stamp}`;
    const sessionResult = await supabase.auth.getSession();
    const userId = sessionResult?.data?.session?.user?.id || null;
    if (!userId) throw new Error("No authenticated user in session");

    const payload = {
      title,
      content: "This is a test post created by dev tools.",
      tags: ["test"],
      status: "published",
      slug,
      locale: branding.primaryLocale?.value || unref(locale) || "en",
      comments_disabled: true,
      author_id: userId,
    };

    const { data, error } = await supabase
      .from("posts")
      .insert([payload])
      .select("id,slug,locale")
      .single();
    if (error) throw error;
    setDevResult(data);
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

async function createMultiLocalePost() {
  setDevResult("Creating multi-locale posts...");
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) throw new Error("No authenticated user in session");

    await fetchBranding(true);
    const enabled = branding.enabledLocales?.value?.length
      ? branding.enabledLocales.value
      : ["en"];
    const groupId = crypto.randomUUID();
    const stamp = Date.now();
    const slug = `test-multi-${stamp}`;
    const rows = enabled.map((loc) => ({
      title: `Test Multi ${stamp} (${loc})`,
      content: `Multi-locale test body (${loc}).`,
      tags: ["test", "multi"],
      status: "published",
      slug,
      locale: loc,
      translation_group_id: groupId,
      comments_disabled: true,
      author_id: userId,
    }));
    const { data, error } = await supabase
      .from("posts")
      .insert(rows)
      .select("id,slug,locale,translation_group_id");
    if (error) throw error;
    setDevResult({ groupId, count: data?.length || 0, rows: data });
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

function msStats(arr) {
  if (!arr || !arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const sum = sorted.reduce((s, v) => s + v, 0);
  const avg = sum / sorted.length;
  const p = (pct) => {
    const idx = Math.min(
      sorted.length - 1,
      Math.floor((pct / 100) * sorted.length)
    );
    return sorted[idx];
  };
  return {
    count: sorted.length,
    min: sorted[0],
    avg: Math.round(avg),
    p50: p(50),
    p95: p(95),
    p99: p(99),
    max: sorted[sorted.length - 1],
  };
}

async function latencyDistribution() {
  setDevResult("Measuring latency distribution...");
  try {
    const reps = 20;
    const times = [];
    let failures = 0;
    for (let i = 0; !(i >= reps); i++) {
      const t0 = performance.now();
      try {
        await supabase.from("settings").select("key").limit(1);
      } catch {
        failures++;
      }
      times.push(Math.round(performance.now() - t0));
      await new Promise((r) => setTimeout(r, 100));
    }
    setDevResult({
      op: "settings.select",
      reps,
      failures,
      stats: msStats(times),
      raw: times,
    });
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

async function concurrencyBenchmark() {
  setDevResult("Running concurrency benchmark...");
  try {
    const total = 30;
    const parallel = 6;
    const start = performance.now();
    let created = 0;
    let failed = 0;
    const sessionResp = await supabase.auth.getSession();
    const userId = sessionResp?.data?.session?.user?.id;
    if (!userId) return setDevResult("No authenticated user for concurrency benchmark");
    const loc = branding.primaryLocale?.value || unref(locale) || "en";

    const batches = Math.ceil(total / parallel);
    for (let b = 0; !(b >= batches); b++) {
      const ops = [];
      for (let i = 0; !(i >= parallel) && !(b * parallel + i >= total); i++) {
        const stamp = `${Date.now()}-${b}-${i}`;
        ops.push(
          supabase
            .from("posts")
            .insert([
              {
                title: "Perf Test " + stamp,
                content: "perf",
                slug: ("perf-" + stamp).replace(/[^a-z0-9-]/g, "-"),
                status: "published",
                locale: loc,
                comments_disabled: true,
                author_id: userId,
              },
            ])
            .select("id")
            .single()
        );
      }
      const results = await Promise.allSettled(ops);
      for (const r of results) {
        if (r.status === "fulfilled" && r.value?.data) created++;
        else failed++;
      }
      await new Promise((r) => setTimeout(r, 150));
    }
    const dur = Math.round(performance.now() - start);
    setDevResult({
      total,
      created,
      failed,
      duration_ms: dur,
      ops_per_sec: Math.round((created + failed) / (dur / 1000)),
    });
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

async function e2eRenderTime() {
  if (e2eRunning.value) return;
  e2eRunning.value = true;
  setDevResult("Measuring end-to-end render time for PostDetail…");

  if (typeof e2eCleanup === "function") {
    try {
      e2eCleanup();
    } catch {
      /* ignore */
    }
    e2eCleanup = null;
  }

  try {
    const { data: posts, error: pErr } = await supabase
      .from("posts")
      .select("slug,locale,status")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1);
    if (pErr) throw pErr;
    const postRow = posts?.[0];
    if (!postRow?.slug) {
      e2eRunning.value = false;
      setDevResult("No published posts available to test");
      return;
    }

    const path = localePath(`/posts/${postRow.slug}`, postRow.locale || unref(locale));
    const url = getCurrentSiteOrigin() + path;

    // Same-origin iframe avoids popup blockers / noopener WindowProxy issues.
    const iframe = document.createElement("iframe");
    iframe.setAttribute("title", "e2e-render-probe");
    iframe.style.cssText =
      "position:fixed;inset:auto;left:-9999px;top:0;width:1024px;height:768px;opacity:0;pointer-events:none;border:0;";
    document.body.appendChild(iframe);

    const start = performance.now();
    const maxMs = 15000;
    let finished = false;
    let pollTimer = null;
    let timeoutTimer = null;

    const finish = (payload) => {
      if (finished) return;
      finished = true;
      if (pollTimer) clearInterval(pollTimer);
      if (timeoutTimer) clearTimeout(timeoutTimer);
      try {
        iframe.remove();
      } catch {
        /* ignore */
      }
      e2eCleanup = null;
      e2eRunning.value = false;
      setDevResult(payload);
    };

    e2eCleanup = () => finish({ url, cancelled: true });

    const lookForArticle = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return false;
        const ready =
          doc.readyState === "complete" || doc.readyState === "interactive";
        if (!ready) return false;
        const article =
          doc.querySelector("article[itemtype*='Article']") ||
          doc.querySelector("article") ||
          doc.querySelector(".markdown-content");
        return !!article;
      } catch (e) {
        finish({
          url,
          path,
          locale: postRow.locale,
          render_ms: null,
          error: e.message || String(e),
          message: "Cannot read iframe document (cross-origin?).",
        });
        return true;
      }
    };

    iframe.addEventListener("load", () => {
      // Vue may hydrate after the load event — poll briefly.
      if (lookForArticle()) {
        finish({
          url,
          path,
          locale: postRow.locale,
          slug: postRow.slug,
          render_ms: Math.round(performance.now() - start),
          method: "iframe",
        });
        return;
      }
      pollTimer = setInterval(() => {
        if (lookForArticle()) {
          finish({
            url,
            path,
            locale: postRow.locale,
            slug: postRow.slug,
            render_ms: Math.round(performance.now() - start),
            method: "iframe",
          });
        }
      }, 100);
    });

    timeoutTimer = setTimeout(() => {
      finish({
        url,
        path,
        locale: postRow.locale,
        slug: postRow.slug,
        render_ms: null,
        elapsed_ms: Math.round(performance.now() - start),
        message: "Timed out waiting for article element (15s).",
        method: "iframe",
      });
    }, maxMs);

    iframe.src = url;
  } catch (e) {
    e2eRunning.value = false;
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

async function getLatestPost() {
  const { data, error } = await supabase
    .from("posts")
    .select("id,slug,status")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function archiveLatest() {
  setDevResult("Archiving...");
  try {
    const p = await getLatestPost();
    if (!p) return setDevResult("No posts found");
    const { error } = await supabase
      .from("posts")
      .update({ status: "archived" })
      .eq("id", p.id);
    if (error) throw error;
    setDevResult("Archived: " + p.id);
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

async function unarchiveLatest() {
  setDevResult("Unarchiving...");
  try {
    const p = await getLatestPost();
    if (!p) return setDevResult("No posts found");
    const { error } = await supabase
      .from("posts")
      .update({ status: "published" })
      .eq("id", p.id);
    if (error) throw error;
    setDevResult("Unarchived: " + p.id);
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

async function listTestPosts() {
  setDevResult("Listing...");
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,slug,status,locale,created_at")
      .or("title.ilike.%Test Post%,title.ilike.%Perf Test%,title.ilike.%Test Multi%")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    setDevResult(data);
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

function askDeleteTestPosts() {
  askConfirm(
    t("common.confirmAction"),
    'Delete test posts with titles like "Test Post", "Perf Test", or "Test Multi"?',
    t("common.remove"),
    deleteTestPosts
  );
}

async function deleteTestPosts() {
  setDevResult("Deleting...");
  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .or(
        "title.ilike.%Test Post%,title.ilike.%Perf Test%,title.ilike.%Test Multi%"
      )
      .select("id,title");
    if (error) throw error;
    setDevResult({
      deleted: Array.isArray(data) ? data.length : 0,
      rows: data,
    });
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
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
  "series",
];
const rlsResult = ref("");

const latencyMs = ref(null);
const localStorageDump = ref("");

const statsLoading = ref(false);
const statsResult = ref("");
const statsRls = ref(false);
const statsRlsMsg = ref("");

const localeDiagLoading = ref(false);
const localeDiagRaw = ref("");
const feedsLoading = ref(false);
const feedsRaw = ref("");
const runtimeRaw = ref("");

async function loadFullStats() {
  statsLoading.value = true;
  statsResult.value = "Loading...";
  statsRls.value = false;
  statsRlsMsg.value = "";
  try {
    function isRlsError(e) {
      if (!e) return false;
      const status = e?.status || e?.statusCode || null;
      const msg = (e?.message || e?.details || e?.error_description || "")
        .toString()
        .toLowerCase();
      if (status === 401 || status === 403) return true;
      return /permission|forbidden|row-level|rls|not authorized|insufficient/.test(
        msg
      );
    }

    async function guardedCount(buildFn) {
      try {
        const resp = await buildFn(supabase);
        if (resp?.error) throw resp.error;
        return resp?.count ?? null;
      } catch (e) {
        if (isRlsError(e)) {
          statsRls.value = true;
          statsRlsMsg.value = e.message || String(e);
          return null;
        }
        throw e;
      }
    }

    const total = await guardedCount((s) =>
      s.from("posts").select("id", { count: "exact", head: true })
    );
    const published = await guardedCount((s) =>
      s
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
    );
    const drafts = await guardedCount((s) =>
      s.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft")
    );
    const archived = await guardedCount((s) =>
      s
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "archived")
    );

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const last24h = await guardedCount((s) =>
      s
        .from("posts")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since)
    );

    const users = await guardedCount((s) =>
      s.from("profiles").select("id", { count: "exact", head: true })
    );
    const categories = await guardedCount((s) =>
      s.from("categories").select("id", { count: "exact", head: true })
    );
    const series = await guardedCount((s) =>
      s.from("series").select("id", { count: "exact", head: true })
    );

    const commentsTotal = await guardedCount((s) =>
      s.from("comments").select("id", { count: "exact", head: true })
    );
    const commentsApproved = await guardedCount((s) =>
      s
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("approved", true)
    );
    const commentsPending = await guardedCount((s) =>
      s
        .from("comments")
        .select("id", { count: "exact", head: true })
        .or("approved.eq.false,approved.is.null")
    );

    let buckets = null;
    try {
      const list = await supabase.storage.listBuckets();
      if (list.error) throw list.error;
      buckets = Array.isArray(list.data) ? list.data.length : null;
    } catch (e) {
      buckets = "error: " + (e.message || String(e));
    }

    const { data: localeRows } = await supabase.from("posts").select("locale");
    const byLocale = {};
    for (const row of localeRows || []) {
      const code = row.locale || "unknown";
      byLocale[code] = (byLocale[code] || 0) + 1;
    }

    statsResult.value = formatJson({
      posts: {
        total: total ?? null,
        published: published ?? null,
        drafts: drafts ?? null,
        archived: archived ?? null,
        last24h: last24h ?? null,
        byLocale,
      },
      users: users ?? null,
      categories: categories ?? null,
      series: series ?? null,
      comments: {
        total: commentsTotal ?? null,
        approved: commentsApproved ?? null,
        pending: commentsPending ?? null,
      },
      buckets,
      sampled_at: new Date().toISOString(),
      rls_blocked: statsRls.value || undefined,
    });
  } catch (e) {
    statsResult.value = "ERROR: " + (e.message || String(e));
  } finally {
    statsLoading.value = false;
  }
}

function prepareRun(act) {
  action.value = act;
  errorMsg.value = "";
  result.value = "";
  loading.value = true;
}

function authProvidersDisplay() {
  const ap =
    settingsMap.value["auth_providers_enabled"] ||
    settingsMap.value["auth_providers"] ||
    null;
  if (!ap) return "—";
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
  return settingsMap.value["site_title"] || "—";
}

function siteOriginDisplay() {
  const configured = settingsMap.value["site_origin"] || getBrowserOrigin() || "—";
  const current = getCurrentSiteOrigin() || "—";
  if (configured === current) return current;
  return `${current} (configured: ${configured})`;
}

function installationDisplay() {
  const inst = settingsMap.value["installation"] || null;
  if (!inst) return "—";
  const ok = !!inst.complete;
  const when = inst.completed_at
    ? new Date(inst.completed_at).toLocaleString()
    : null;
  return ok
    ? `Complete - ${when || "unknown"}`
    : `Incomplete${when ? " - " + when : ""}`;
}

async function checkBucket() {
  prepareRun("check");
  try {
    const { data, error } = await supabase.storage.getBucket(
      bucketName.value.trim()
    );
    if (error) errorMsg.value = error.message;
    else if (!data) errorMsg.value = "Bucket not found.";
    else result.value = formatJson(data);
  } catch (e) {
    errorMsg.value = e.message || "Unknown error";
  } finally {
    loading.value = false;
    action.value = "";
  }
}

async function listBuckets() {
  prepareRun("list");
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) errorMsg.value = error.message;
    else result.value = formatJson(data);
  } catch (e) {
    errorMsg.value = e.message || "Unknown error";
  } finally {
    loading.value = false;
    action.value = "";
  }
}

async function refreshSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  sessionUser.value = session?.user || null;
  sessionRaw.value = session ? formatJson(session) : "";
  sessionExpiry.value = session?.expires_at
    ? new Date(session.expires_at * 1000).toLocaleString()
    : "";
  if (sessionUser.value) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", sessionUser.value.id)
      .maybeSingle();
    profileRole.value = profile?.role || "";
  } else profileRole.value = "";
}

async function signOut() {
  await supabase.auth.signOut();
  refreshSession();
}

async function loadSettings() {
  try {
    const { data, error } = await supabase.from("settings").select("key,value");
    if (error) throw error;
    settingsRaw.value = formatJson(data);
    const map = {};
    for (const row of data || []) {
      try {
        map[row.key] =
          typeof row.value === "string" ? JSON.parse(row.value) : row.value;
      } catch {
        map[row.key] = row.value;
      }
    }
    settingsMap.value = map;
  } catch (e) {
    settingsRaw.value = "ERROR: " + (e.message || "unknown");
  }
}

async function loadBranding() {
  try {
    await fetchBranding(true);
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "branding")
      .maybeSingle();
    if (error) throw error;
    brandingRaw.value = formatJson(data?.value || {});
  } catch (e) {
    brandingRaw.value = "ERROR: " + (e.message || "unknown");
  }
}

async function probeTable(tbl) {
  rlsResult.value = "Loading...";
  try {
    const { data, error } = await supabase.from(tbl).select("*").limit(5);
    if (error) throw error;
    rlsResult.value = formatJson(data);
  } catch (e) {
    rlsResult.value = "ERROR: " + (e.message || "unknown");
  }
}

async function measureLatency() {
  const start = performance.now();
  try {
    await supabase.from("settings").select("key").limit(1);
  } catch {
    /* ignore */
  }
  latencyMs.value = Math.round(performance.now() - start);
}

function readLocalStorage() {
  const dump = {};
  for (let i = 0; !(i >= localStorage.length); i++) {
    const k = localStorage.key(i);
    dump[k] = localStorage.getItem(k);
  }
  localStorageDump.value = formatJson(dump);
}

function askClearLocalStorage() {
  askConfirm(
    t("common.confirmAction"),
    "Clear ALL localStorage keys for this origin?",
    t("common.remove"),
    () => {
      localStorage.clear();
      localStorageDump.value = "";
    }
  );
}

async function loadLocaleDiagnostics() {
  localeDiagLoading.value = true;
  try {
    await fetchBranding(true);
    const { data: localeRows } = await supabase.from("posts").select("locale");
    const byLocale = {};
    for (const row of localeRows || []) {
      const code = row.locale || "unknown";
      byLocale[code] = (byLocale[code] || 0) + 1;
    }
    const catalog = (unref(locales) || []).map((l) =>
      typeof l === "string" ? l : { code: l.code, name: l.name, dir: l.dir }
    );
    localeDiagRaw.value = formatJson({
      uiLocale: unref(locale),
      defaultLocale: unref(defaultLocale),
      contentLocale: unref(contentLocale),
      cookie: localeCookieRef.value || null,
      branding: {
        loaded: branding.brandingLoaded?.value,
        primary: branding.primaryLocale?.value,
        enabled: branding.enabledLocales?.value,
      },
      catalog,
      postsByLocale: byLocale,
      href: getBrowserUrl() || null,
      currentOrigin: getCurrentSiteOrigin(),
      configuredOrigin: getBrowserOrigin(),
    });
  } catch (e) {
    localeDiagRaw.value = "ERROR: " + (e.message || String(e));
  } finally {
    localeDiagLoading.value = false;
  }
}

async function probeFeeds() {
  feedsLoading.value = true;
  try {
    const origin = getCurrentSiteOrigin();
    const paths = [
      "/rss.xml",
      "/sitemap.xml",
      "/robots.txt",
      "/readyz",
      "/healthz",
      "/env",
    ];
    const results = [];
    for (const path of paths) {
      const url = origin + path;
      const t0 = performance.now();
      try {
        const res = await fetch(url, { method: "GET" });
        const text = await res.text();
        results.push({
          path,
          status: res.status,
          ok: res.ok,
          ms: Math.round(performance.now() - t0),
          contentType: res.headers.get("content-type"),
          bytes: text.length,
          preview: text.slice(0, 120).replace(/\s+/g, " "),
        });
      } catch (e) {
        results.push({
          path,
          ok: false,
          error: e.message || String(e),
          ms: Math.round(performance.now() - t0),
        });
      }
    }
    feedsRaw.value = formatJson({ origin, results });
  } catch (e) {
    feedsRaw.value = "ERROR: " + (e.message || String(e));
  } finally {
    feedsLoading.value = false;
  }
}

function loadRuntimeEnv() {
  const pub = runtimeConfig.public || {};
  runtimeRaw.value = formatJson({
    env: pub.env,
    siteUrl: pub.siteUrl,
    siteLocale: pub.siteLocale,
    twitterSite: pub.twitterSite,
    supabaseUrl: pub.supabaseUrl
      ? String(pub.supabaseUrl).replace(/^(https?:\/\/[^/]+).*/, "$1/…")
      : null,
    supabaseAnonKey: pub.supabaseAnonKey
      ? `${String(pub.supabaseAnonKey).slice(0, 8)}…(${String(pub.supabaseAnonKey).length} chars)`
      : null,
    configuredOrigin: getBrowserOrigin(),
    currentOrigin: getCurrentSiteOrigin(),
  });
}

async function runQuickSuite() {
  suiteRunning.value = true;
  suiteSummary.value = null;
  const checks = [];
  const push = (name, ok, detail) => checks.push({ name, ok, detail });

  try {
    await refreshSession();
    push("session", !!sessionUser.value, sessionUser.value?.email || "anonymous");

    const t0 = performance.now();
    const { error: pingErr } = await supabase.from("settings").select("key").limit(1);
    push("supabase", !pingErr, pingErr?.message || `${Math.round(performance.now() - t0)}ms`);

    await fetchBranding(true);
    push(
      "branding",
      !!branding.brandingLoaded?.value,
      `primary=${branding.primaryLocale?.value}; enabled=${(branding.enabledLocales?.value || []).join(",")}`
    );

    await loadLocaleDiagnostics();
    push("locale", !!localeDiagRaw.value && !String(localeDiagRaw.value).startsWith("ERROR"));

    await probeFeeds();
    let feedsOk = false;
    try {
      const parsed = JSON.parse(feedsRaw.value);
      feedsOk = (parsed.results || []).some((r) => r.ok);
    } catch {
      feedsOk = false;
    }
    push("feeds", feedsOk);

    loadRuntimeEnv();
    push("runtime", !!runtimeConfig.public?.supabaseUrl);

    await loadFullStats();
    push("stats", !!statsResult.value && !String(statsResult.value).startsWith("ERROR"));

    suiteSummary.value = {
      at: new Date().toISOString(),
      passed: checks.filter((c) => c.ok).length,
      total: checks.length,
      checks,
    };
  } catch (e) {
    suiteSummary.value = {
      at: new Date().toISOString(),
      error: e.message || String(e),
      checks,
    };
  } finally {
    suiteRunning.value = false;
  }
}

refreshSession();
loadRuntimeEnv();

onUnmounted(() => {
  if (typeof e2eCleanup === "function") {
    try {
      e2eCleanup();
    } catch {
      /* ignore */
    }
  }
});
</script>

<style scoped>
/* Layout only — visual utilities live on the class string constants in script. */
.test-card {
  min-height: 26rem;
  display: grid;
  grid-template-rows: 4.5rem 1fr 16rem;
}
.test-card-wide {
  min-height: 28rem;
  display: grid;
  grid-template-rows: auto auto 16rem;
}
.test-pre {
  font-size: 11px;
}
</style>

