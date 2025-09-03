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
        Do NOT enable in production.
      </p>
    </header>

    <!-- Storage Buckets -->
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

    <!-- Auth / Session -->
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

    <!-- Settings & Branding -->
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
          <pre
            v-if="settingsRaw"
            class="p-3 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[11px] leading-tight text-gray-800 dark:text-gray-200 overflow-x-auto max-h-64"
            >{{ settingsRaw }}</pre
          >
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

    <!-- RLS Probe -->
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

    <!-- Latency -->
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

    <!-- Local Storage -->
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
  </div>
</template>

<script setup>
import { supabase } from "@/services/supabase";
import { ref } from "vue";
import { fetchBranding } from "@/stores/brandingStore";

// Storage
const bucketName = ref("");
const loading = ref(false);
const result = ref("");
const errorMsg = ref("");
const action = ref("");

// Session
const sessionUser = ref(null);
const sessionRaw = ref("");
const sessionExpiry = ref("");
const profileRole = ref("");

// Settings / branding
const settingsRaw = ref("");
const brandingRaw = ref("");

// RLS
const rlsTables = ["settings", "profiles", "posts", "comments"];
const rlsResult = ref("");

// Latency
const latencyMs = ref(null);

// Local storage
const localStorageDump = ref("");

function prepareRun(act) {
  action.value = act;
  errorMsg.value = "";
  result.value = "";
  loading.value = true;
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
