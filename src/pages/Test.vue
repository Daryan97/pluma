<template>
  <div class="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
    <header>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Internal Test & Debug
      </h1>
      <p
        class="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800 rounded-md px-4 py-3"
      >
        This page exposes internal debugging utilities. It is guarded by
        <code>devOnly</code> route meta and <code>VITE_ENV=development</code>.
        It should never be accessible in production environments.
      </p>
    </header>
    <section
      class="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 space-y-4"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Storage Buckets
        </h2>
        <div class="flex gap-2">
          <button
            @click="listBuckets"
            :disabled="loading"
            class="h-8 px-3 text-xs rounded font-medium border border-indigo-500/20 dark:border-indigo-400/20 bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 dark:hover:bg-indigo-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading && action === "list" ? "Listing..." : "List" }}
          </button>
          <button
            @click="checkBucket"
            :disabled="loading || !bucketName"
            class="h-8 px-3 text-xs rounded font-medium border border-blue-500/20 dark:border-blue-400/20 bg-blue-500/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 dark:hover:bg-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading && action === "check" ? "Checking..." : "Check" }}
          </button>
        </div>
      </div>
      <div class="flex flex-wrap gap-3">
        <input
          v-model="bucketName"
          type="text"
          placeholder="bucket name"
          class="flex-1 min-w-[200px] h-9 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Enter a bucket name or list all buckets.
      </p>
      <p v-if="errorMsg" class="text-xs text-red-600 dark:text-red-400">
        {{ errorMsg }}
      </p>
      <pre
        v-if="result"
        class="text-[11px] leading-tight p-3 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 overflow-x-auto max-h-72"
        >{{ result }}</pre
      >
    </section>
    <section
      class="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 space-y-3"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Full Stats
        </h2>
        <div class="flex gap-2">
          <button
            @click="loadFullStats"
            :disabled="statsLoading"
            class="h-8 px-3 text-xs rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60"
          >
            {{ statsLoading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Quick aggregate counters for the site (posts, users, categories, buckets, recent activity).</p>
      <div>
        <div v-if="statsRls" class="mb-2 p-3 rounded bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
          Queries appear to be blocked by Row Level Security (RLS) or permission issues.
          <div class="mt-1 text-xs text-yellow-700 dark:text-yellow-300">{{ statsRlsMsg || 'Check RLS policies, service role, or use an authenticated account with sufficient permissions.' }}</div>
        </div>
        <pre
          v-if="statsResult"
          class="p-3 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[11px] leading-tight text-gray-800 dark:text-gray-200 overflow-x-auto max-h-64"
          >{{ statsResult }}</pre
        >
        <p v-else class="text-gray-400">No stats loaded yet.</p>
      </div>
    </section>
    <section
      class="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 space-y-3"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Auth & Session
        </h2>
        <div class="flex gap-2">
          <button
            @click="refreshSession"
            class="h-8 px-3 text-xs rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"
          >
            Refresh
          </button>
          <button
            @click="signOut"
            :disabled="!sessionUser"
            class="h-8 px-3 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-40"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 text-[11px]">
        <span
          class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >User: {{ sessionUser?.email || "none" }}</span
        >
        <span
          class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >Role: {{ profileRole || "n/a" }}</span
        >
        <span
          class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >Expires: {{ sessionExpiry || "n/a" }}</span
        >
      </div>
      <pre
        v-if="sessionRaw"
        class="text-[11px] leading-tight p-3 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 overflow-x-auto max-h-72"
        >{{ sessionRaw }}</pre
      >
    </section>
    <section
      class="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 space-y-4"
    >
      <div class="flex items-center gap-2 flex-wrap">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Settings & Branding Snapshot
        </h2>
        <button
          @click="loadSettings"
          class="h-8 px-3 text-xs rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60"
        >
          Settings
        </button>
        <button
          @click="loadBranding"
          class="h-8 px-3 text-xs rounded bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/60"
        >
          Branding
        </button>
      </div>
      <div
        class="grid md:grid-cols-2 gap-4 text-[11px] text-gray-800 dark:text-gray-200"
      >
        <div>
          <h3 class="font-medium mb-1">Settings</h3>
          <div v-if="settingsRaw" class="space-y-2">
            <pre
              class="p-3 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[11px] leading-tight text-gray-800 dark:text-gray-200 overflow-x-auto max-h-64"
              >{{ settingsRaw }}</pre
            >
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="text-gray-600 dark:text-gray-300">Installation</div>
              <div class="text-gray-800 dark:text-gray-100">
                {{ installationDisplay() }}
              </div>
              <div class="text-gray-600 dark:text-gray-300">Auth Providers</div>
              <div class="text-gray-800 dark:text-gray-100">
                {{ authProvidersDisplay() }}
              </div>
              <div class="text-gray-600 dark:text-gray-300">Site Origin</div>
              <div class="text-gray-800 dark:text-gray-100">
                {{ siteOriginDisplay() }}
              </div>
              <div class="text-gray-600 dark:text-gray-300">Site Title</div>
              <div class="text-gray-800 dark:text-gray-100">
                {{ siteTitleDisplay() }}
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400">No data</p>
        </div>
        <div>
          <h3 class="font-medium mb-1">Branding</h3>
          <pre
            v-if="brandingRaw"
            class="p-3 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[11px] leading-tight text-gray-800 dark:text-gray-200 overflow-x-auto max-h-64"
            >{{ brandingRaw }}</pre
          >
          <p v-else class="text-gray-400">No data</p>
        </div>
      </div>
    </section>
    <section
      class="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 space-y-4"
    >
      <div class="flex items-center gap-2 flex-wrap">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          RLS Probe
        </h2>
        <button
          v-for="t in rlsTables"
          :key="t"
          @click="probeTable(t)"
          class="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs"
        >
          {{ t }}
        </button>
      </div>
      <pre
        v-if="rlsResult"
        class="text-[11px] leading-tight p-3 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 overflow-x-auto max-h-72"
        >{{ rlsResult }}</pre
      >
    </section>
    <section
      class="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 space-y-3"
    >
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Latency
        </h2>
        <button
          @click="measureLatency"
          class="h-8 px-3 text-xs rounded bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/60"
        >
          Ping
        </button>
        <span class="text-[11px] text-gray-500 dark:text-gray-400">{{
          latencyMs !== null ? latencyMs + " ms" : "—"
        }}</span>
      </div>
    </section>
    <section
      class="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 space-y-3"
    >
      <div class="flex items-center gap-2 flex-wrap">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Local Storage
        </h2>
        <button
          @click="readLocalStorage"
          class="h-8 px-3 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Read
        </button>
        <button
          @click="clearLocalStorage"
          class="h-8 px-3 text-xs rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
        >
          Clear
        </button>
      </div>
      <pre
        v-if="localStorageDump"
        class="text-[11px] leading-tight p-3 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 overflow-x-auto max-h-72"
        >{{ localStorageDump }}</pre
      >
    </section>
    <section
      class="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 space-y-4"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Dev Tools
        </h2>
        <div class="flex gap-2">
          <button
            @click="toggleTheme"
            class="h-8 px-3 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            Toggle Theme
          </button>
          <button
            @click="seedCategories"
            class="h-8 px-3 text-xs rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
          >
            Seed Categories
          </button>
          <button
            @click="latencyDistribution"
            class="h-8 px-3 text-xs rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
          >
            Latency Dist
          </button>
          <button
            @click="concurrencyBenchmark"
            class="h-8 px-3 text-xs rounded bg-slate-100 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300"
          >
            Concurrency
          </button>
          <button
            @click="e2eRenderTime"
            class="h-8 px-3 text-xs rounded bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
          >
            E2E Render
          </button>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-3">
        <div class="space-y-2">
          <button
            @click="createDummyPost"
            class="w-full h-9 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm"
          >
            Create Dummy Post
          </button>
          <button
            @click="archiveLatest"
            class="w-full h-9 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm"
          >
            Archive Latest Post
          </button>
          <button
            @click="unarchiveLatest"
            class="w-full h-9 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm"
          >
            Unarchive Latest Post
          </button>
        </div>
        <div class="space-y-2">
          <button
            @click="listTestPosts"
            class="w-full h-9 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
          >
            List Test Posts
          </button>
          <button
            @click="deleteTestPosts"
            class="w-full h-9 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-sm"
          >
            Delete Test Posts
          </button>
        </div>
      </div>

      <div>
        <h3 class="font-medium mb-1">Result</h3>
        <pre
          v-if="devResult"
          class="p-3 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[11px] leading-tight text-gray-800 dark:text-gray-200 overflow-x-auto max-h-64"
          >{{ devResult }}</pre
        >
        <p v-else class="text-gray-400">No action yet.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { supabase } from "@/services/supabase";
import { ref } from "vue";
import { fetchBranding } from "@/stores/brandingStore";
import { getBrowserOrigin, getBrowserUrl } from "@/lib/utils";

const devResult = ref("");

function setDevResult(obj) {
  try {
    devResult.value =
      typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  } catch {
    devResult.value = String(obj);
  }
}

function toggleTheme() {
  const current = document.body.dataset.theme === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  document.body.dataset.theme = next;
  setDevResult(`Theme -> ${next}`);
}

async function seedCategories() {
  setDevResult("Seeding...");
  try {
    const defaults = [
      { name: "Announcements", slug: "announcements" },
      { name: "Tutorials", slug: "tutorials" },
      { name: "Guides", slug: "guides" },
    ];
    const { data, error } = await supabase
      .from("categories")
      .upsert(defaults, { onConflict: ["slug"] })
      .select("*");
    if (error) throw error;
    setDevResult(data);
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

async function createDummyPost() {
  setDevResult("Creating...");
  try {
    const title = "Test Post " + Date.now();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;
    if (!userId) throw new Error("No authenticated user in session");

    const payload = {
      title,
      content: "This is a test post created by dev tools.",
      tags: ["test"],
      status: "published",
      slug,
      comments_disabled: true,
      author_id: userId,
    };

    const { data, error } = await supabase
      .from("posts")
      .insert([payload])
      .select("id,slug")
      .single();
    if (error) throw error;
    setDevResult(data);
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

function msStats(arr) {
  if (!arr || !arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const sum = sorted.reduce((s, v) => s + v, 0);
  const avg = sum / sorted.length;
  const p = (p) => {
    const idx = Math.min(
      sorted.length - 1,
      Math.floor((p / 100) * sorted.length)
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
    for (let i = 0; i < reps; i++) {
      const t0 = performance.now();
      try {
        await supabase.from("settings").select("key").limit(1);
      } catch (e) {
        failures++;
      }
      const t1 = performance.now();
      times.push(Math.round(t1 - t0));
      await new Promise((r) => setTimeout(r, 100));
    }
    setDevResult({
      op: "settings.select",
      reps: reps,
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
    let created = 0,
      failed = 0;
    const sessionResp = await supabase.auth.getSession();
    const userId = sessionResp?.data?.session?.user?.id;
    if (!userId)
      return setDevResult("No authenticated user for concurrency benchmark");

    const batches = Math.ceil(total / parallel);
    for (let b = 0; b < batches; b++) {
      const ops = [];
      for (let i = 0; i < parallel && b * parallel + i < total; i++) {
        const t = Date.now() + "-" + b + "-" + i;
        const payload = {
          title: "Perf Test " + t,
          content: "perf",
          slug: ("perf-" + t).replace(/[^a-z0-9-]/g, "-"),
          status: "published",
          comments_disabled: true,
          author_id: userId,
        };
        ops.push(
          supabase.from("posts").insert([payload]).select("id").single()
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
  setDevResult("Measuring end-to-end render time for PostDetail...");
  try {
    const { data: posts, error: pErr } = await supabase
      .from("posts")
      .select("slug")
      .order("created_at", { ascending: false })
      .limit(1);
    if (pErr) throw pErr;
    const slug = posts?.[0]?.slug;
    if (!slug) return setDevResult("No posts available to test");

    const url = getBrowserOrigin() + "/posts/" + slug;
    const w = window.open(url, "_blank");
    if (!w) return setDevResult("Popup blocked; allow popups for this site");

    const start = performance.now();
    const pollInterval = 250;
    const maxMs = 10000;
    let elapsed = 0;
    let stopped = false;

    const stop = (msg) => {
      if (stopped) return;
      stopped = true;
      try {
        if (!w.closed) w.close();
      } catch (e) {}
      setDevResult(msg);
    };

    const poll = setInterval(() => {
      elapsed = Math.round(performance.now() - start);
      if (w.closed) {
        clearInterval(poll);
        stop({
          url,
          render_ms: "popup closed before measurement",
          elapsed_ms: elapsed,
        });
        return;
      }
      try {
        const doc = w.document;
        if (!doc) return;
        const article =
          doc.querySelector("article") ||
          doc.querySelector("[data-post-root]") ||
          doc.querySelector(".markdown-content");
        if (article) {
          clearInterval(poll);
          const renderMs = Math.round(performance.now() - start);
          const roundTrip = Math.round(performance.now() - start);
          stop({ url, render_ms: renderMs, elapsed_ms: roundTrip });
        }
      } catch (e) {
        clearInterval(poll);
        stop({
          url,
          render_ms: null,
          message:
            "Opened popup but cannot access DOM due to same-origin policy. For exact timing, add a postMessage report from PostDetail.",
        });
      }
      if (elapsed >= maxMs) {
        clearInterval(poll);
        stop({
          url,
          render_ms: null,
          message:
            "Timed out waiting for article (10s). Page may be slow or blocked.",
        });
      }
    }, pollInterval);
  } catch (e) {
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
      .select("id,title,slug,status,created_at")
      .or("title.ilike.%Test Post%,title.ilike.%Perf Test%")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    setDevResult(data);
  } catch (e) {
    setDevResult("ERROR: " + (e.message || String(e)));
  }
}

async function deleteTestPosts() {
  if (
    !confirm(
      'Delete test posts with title like "Test Post" or "Perf Test"? This will remove posts created by dev tools.'
    )
  )
    return;
  setDevResult("Deleting...");
  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .or("title.ilike.%Test Post%,title.ilike.%Perf Test%")
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

const rlsTables = ["settings", "profiles", "posts", "comments"];
const rlsResult = ref("");

const latencyMs = ref(null);

const localStorageDump = ref("");

const statsLoading = ref(false);
const statsResult = ref("");
const statsRls = ref(false);
const statsRlsMsg = ref("");

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
      return /permission|forbidden|row-level|rls|not authorized|insufficient/.test(msg);
    }

    async function guardedCount(buildFn) {
      try {
        let q = supabase.from("posts");
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

    const total = await guardedCount((s) => s.from("posts").select("id", { count: "exact", head: true }));
    const published = await guardedCount((s) => s.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"));
    const drafts = await guardedCount((s) => s.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"));
    const archived = await guardedCount((s) => s.from("posts").select("id", { count: "exact", head: true }).eq("status", "archived"));

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const last24h = await guardedCount((s) => s.from("posts").select("id", { count: "exact", head: true }).gte("created_at", since));

    const users = await guardedCount((s) => s.from("profiles").select("id", { count: "exact", head: true }));
    const categories = await guardedCount((s) => s.from("categories").select("id", { count: "exact", head: true }));

    const commentsTotal = await guardedCount((s) => s.from("comments").select("id", { count: "exact", head: true }));
    const commentsApproved = await guardedCount((s) => s.from("comments").select("id", { count: "exact", head: true }).eq("approved", true));
    const commentsPending = await guardedCount((s) => s.from("comments").select("id", { count: "exact", head: true }).or("approved.eq.false,approved.is.null"));

    let buckets = null;
    try {
      const list = await supabase.storage.listBuckets();
      if (list.error) throw list.error;
      buckets = Array.isArray(list.data) ? list.data.length : null;
    } catch (e) {
      buckets = "error: " + (e.message || String(e));
    }

    statsResult.value = JSON.stringify(
      {
        posts: {
          total: total ?? null,
          published: published ?? null,
          drafts: drafts ?? null,
          archived: archived ?? null,
          last24h: last24h ?? null,
        },
        users: users ?? null,
        categories: categories ?? null,
        comments: {
          total: commentsTotal ?? null,
          approved: commentsApproved ?? null,
          pending: commentsPending ?? null,
        },
        buckets,
        sampled_at: new Date().toISOString(),
        rls_blocked: statsRls.value || undefined,
      },
      null,
      2
    );
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
  } catch (e) {
    return JSON.stringify(ap);
  }
}

function siteTitleDisplay() {
  const branding = settingsMap.value["branding"] || null;
  if (branding && branding.siteName) return branding.siteName;
  return settingsMap.value["site_title"] || "—";
}

function siteOriginDisplay() {
  return settingsMap.value["site_origin"] || getBrowserOrigin() || "—";
}

function installationDisplay() {
  const inst = settingsMap.value["installation"] || null;
  if (!inst) return "—";
  const ok = !!inst.complete;
  const when = inst.completed_at
    ? new Date(inst.completed_at).toLocaleString()
    : null;
  return ok
    ? `Complete — ${when || "unknown"}`
    : `Incomplete${when ? " — " + when : ""}`;
}

async function checkBucket() {
  prepareRun("check");
  try {
    const { data, error } = await supabase.storage.getBucket(
      bucketName.value.trim()
    );
    if (error) errorMsg.value = error.message;
    else if (!data) errorMsg.value = "Bucket not found.";
    else result.value = JSON.stringify(data, null, 2);
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
    else result.value = JSON.stringify(data, null, 2);
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
  sessionRaw.value = session ? JSON.stringify(session, null, 2) : "";
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
    settingsRaw.value = JSON.stringify(data, null, 2);
    const map = {};
    for (const row of data || []) {
      try {
        map[row.key] =
          typeof row.value === "string" ? JSON.parse(row.value) : row.value;
      } catch (_) {
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
    brandingRaw.value = JSON.stringify(data?.value || {}, null, 2);
  } catch (e) {
    brandingRaw.value = "ERROR: " + (e.message || "unknown");
  }
}

async function probeTable(tbl) {
  rlsResult.value = "Loading...";
  try {
    const { data, error } = await supabase.from(tbl).select("*").limit(5);
    if (error) throw error;
    rlsResult.value = JSON.stringify(data, null, 2);
  } catch (e) {
    rlsResult.value = "ERROR: " + (e.message || "unknown");
  }
}

async function measureLatency() {
  const start = performance.now();
  try {
    await supabase.from("settings").select("key").limit(1);
  } catch (_) {}
  latencyMs.value = Math.round(performance.now() - start);
}

function readLocalStorage() {
  const dump = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    dump[k] = localStorage.getItem(k);
  }
  localStorageDump.value = JSON.stringify(dump, null, 2);
}

function clearLocalStorage() {
  if (!confirm("Clear ALL localStorage keys?")) return;
  localStorage.clear();
  localStorageDump.value = "";
}

refreshSession();
</script>
