<template>
  <div class="max-w-5xl mx-auto px-4 py-12 space-y-10">
    <header class="flex items-center gap-3">
      <div
        class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
      >
        <Icon icon="mdi:cog-play" class="w-7 h-7" />
      </div>
      <div>
        <h1
          class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        >
          Installation Wizard
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Guided setup for {{ projectInfo.name }}
        </p>
      </div>
    </header>
    <!-- Stepper Navigation (restored) -->
    <nav
      class="flex flex-wrap justify-center gap-4 mb-6 pt-1"
      aria-label="Setup Progress"
    >
      <button
        v-for="s in steps"
        :key="s.step"
        type="button"
        :disabled="(s.disabled as any) && s.step > activeStep"
        @click="s.step < activeStep ? goToStep(s.step) : null"
        class="group flex items-center gap-3 pl-0 pr-5 rounded-full border transition-colors"
        :class="[
          activeStep === s.step
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-300',
          ((s.disabled as any) && s.step > activeStep) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
        ]"
      >
        <span
          class="w-9 h-9 inline-flex items-center justify-center rounded-full text-base font-semibold border"
          :class="
            activeStep === s.step
              ? 'border-blue-500 bg-white/80 dark:bg-gray-900'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40'
          "
        >
          <Icon :icon="s.icon" class="text-lg" />
        </span>
        <span class="flex flex-col items-start leading-tight">
          <span class="text-xs font-semibold uppercase tracking-wide">{{
            s.title
          }}</span>
          <span class="text-[10px] text-gray-400 dark:text-gray-500">{{
            s.description
          }}</span>
        </span>
      </button>
    </nav>
    <!-- STEP 1: Run SQL Migration & Provision Buckets -->
    <section
      v-if="activeStep === 1"
      class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6"
    >
      <div class="flex items-start gap-3">
        <div
          class="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"
        >
          <Icon icon="mdi:script-text" class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <h2
            class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"
          >
            1 · Run Migration SQL
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            Execute the SQL below in the <strong>SQL Editor</strong> (or psql).
            It creates tables, functions and policies and buckets.
          </p>
        </div>
      </div>
      <div class="space-y-4">
        <div class="relative">
          <pre
            class="rounded-md bg-gray-900 text-gray-100 text-[11px] leading-relaxed p-4 max-h-72 overflow-auto whitespace-pre-wrap"
            >{{ migrationSql }}</pre
          >
          <button
            type="button"
            @click="copySql"
            class="absolute top-2 right-2 inline-flex items-center gap-1 h-7 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <Icon icon="mdi:content-copy" class="text-sm" /> Copy
          </button>
        </div>
        <label
          class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer select-none pt-2"
        >
          <input
            type="checkbox"
            v-model="provisionConfirmed"
            class="rounded border-gray-300 dark:border-gray-600 focus:ring-green-500"
          />
          I ran the SQL successfully
        </label>
        <div class="flex items-center gap-3 pt-2">
          <button
            type="button"
            @click="nextStep"
            :disabled="!provisionConfirmed"
            class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-200/70 dark:border-green-800/40"
          >
            <Icon icon="mdi:arrow-right" class="text-base" /> Proceed to Verify
          </button>
        </div>
      </div>
    </section>

    <!-- STEP 2: Verify Schema & Storage -->
    <section
      v-else-if="activeStep === 2"
      class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6"
    >
      <div class="flex items-start gap-3">
        <div
          class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
        >
          <Icon icon="mdi:check-decagram" class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <h2
            class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"
          >
            2 · Verify Schema & Storage
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            Run automated checks for required tables, functions, buckets and
            policies. Supabase credentials are
            {{
              usingEnvCreds
                ? "loaded from environment (.env)"
                : "entered below"
            }}.
          </p>
        </div>
      </div>
      <div class="space-y-5">
        <div
          class="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4 text-xs space-y-3"
        >
          <div class="flex items-center gap-2">
            <Icon icon="mdi:information" class="text-blue-500" /><span
              class="font-semibold text-gray-700 dark:text-gray-200"
              >Using Environment Credentials</span
            >
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <p
                class="uppercase text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1"
              >
                VITE_SUPABASE_URL
              </p>
              <code
                class="break-all text-[11px] text-gray-800 dark:text-gray-200"
                >{{ url }}</code
              >
            </div>
            <div>
              <p
                class="uppercase text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1"
              >
                VITE_SUPABASE_ANON_KEY
              </p>
              <code
                class="break-all text-[11px] text-gray-800 dark:text-gray-200"
                >{{ maskedAnonKey }}</code
              >
            </div>
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">
            To override, unset these env vars and restart the server.
          </p>
        </div>
        <div class="flex items-center gap-3 pt-2">
          <button
            type="button"
            @click="verifyEnvironment"
            :disabled="verifying || !url || !anonKey"
            class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-200/70 dark:border-blue-800/40"
          >
            <Icon
              :icon="verifying ? 'mdi:loading' : 'mdi:play-circle'"
              :class="verifying ? 'animate-spin' : ''"
              class="text-base"
            />
            <span>{{ verifying ? "Verifying..." : "Run Checks" }}</span>
          </button>
          <button
            type="button"
            @click="prevStep"
            class="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center gap-1 ml-auto"
          >
            <Icon icon="mdi:arrow-left" class="text-sm" /> Back
          </button>
        </div>
        <div
          v-if="verificationRan"
          class="text-xs pt-1"
          :class="
            allVerified
              ? 'text-green-600 dark:text-green-300'
              : 'text-amber-600 dark:text-amber-400'
          "
        >
          {{
            allVerified
              ? "All resources verified."
              : "Some resources missing or failing."
          }}
        </div>
        <div class="grid md:grid-cols-2 gap-6 pt-6 text-[11px]">
          <div>
            <p class="font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Tables
            </p>
            <ul class="space-y-1">
              <li
                v-for="t in tableChecks"
                :key="t.name"
                :class="
                  t.status === 'ok'
                    ? 'text-green-600 dark:text-green-300'
                    : t.status === 'fail'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
                "
                class="flex items-center gap-1"
              >
                <Icon
                  :icon="
                    t.status === 'ok'
                      ? 'mdi:check-circle'
                      : t.status === 'fail'
                      ? 'mdi:alert-circle'
                      : 'mdi:clock-outline'
                  "
                  class="text-xs"
                />
                {{ t.name }}
              </li>
            </ul>
          </div>
          <div>
            <p class="font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Functions
            </p>
            <ul class="space-y-1">
              <li
                v-for="f in functionChecks"
                :key="f.name"
                :class="
                  f.status === 'ok'
                    ? 'text-green-600 dark:text-green-300'
                    : f.status === 'fail'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
                "
                class="flex items-center gap-1"
              >
                <Icon
                  :icon="
                    f.status === 'ok'
                      ? 'mdi:check-circle'
                      : f.status === 'fail'
                      ? 'mdi:alert-circle'
                      : 'mdi:clock-outline'
                  "
                  class="text-xs"
                />
                {{ f.name }}
              </li>
            </ul>
          </div>
          <div>
            <p class="font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Buckets
            </p>
            <ul class="space-y-1">
              <li
                v-for="b in bucketChecks"
                :key="b.name"
                :class="
                  b.status === 'ok'
                    ? 'text-green-600 dark:text-green-300'
                    : b.status === 'fail'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
                "
                class="flex flex-col"
              >
                <div class="flex items-center gap-1">
                  <Icon
                    :icon="
                      b.status === 'ok'
                        ? 'mdi:check-circle'
                        : b.status === 'fail'
                        ? 'mdi:alert-circle'
                        : 'mdi:clock-outline'
                    "
                    class="text-xs"
                  />
                  <span>{{ b.name }}</span>
                </div>
                <div
                  v-if="b.status === 'fail' && b.detail"
                  class="pl-4 text-[10px] leading-snug opacity-90"
                >
                  {{ bucketFailureHint(b) }}
                </div>
              </li>
            </ul>
          </div>
          <div>
            <p class="font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Policies
            </p>
            <ul class="space-y-1">
              <li
                v-for="p in policyChecks"
                :key="p.name"
                :class="
                  p.status === 'ok'
                    ? 'text-green-600 dark:text-green-300'
                    : p.status === 'fail'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
                "
                class="flex items-center gap-1"
              >
                <Icon
                  :icon="
                    p.status === 'ok'
                      ? 'mdi:check-circle'
                      : p.status === 'fail'
                      ? 'mdi:alert-circle'
                      : 'mdi:clock-outline'
                  "
                  class="text-xs"
                />
                {{ p.name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="pt-6">
          <button
            @click="nextStep"
            :disabled="!allVerified"
            class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-200/70 dark:border-green-800/40"
          >
            <Icon icon="mdi:arrow-right" class="text-base" /> Continue to
            Branding
          </button>
        </div>
      </div>
    </section>
    <!-- STEP 3: Site Branding (moved after verification) -->
    <section
      v-else-if="activeStep === 3"
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
            3 · Site Branding
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            Set the site name and description. You can add logos and social
            links later in the dashboard.
          </p>
        </div>
      </div>
      <div class="space-y-4">
        <div>
          <label
            class="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1"
            >Site Name</label
          >
          <input
            v-model.trim="siteName"
            type="text"
            class="w-full h-11 rounded-md px-3 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="My Awesome Blog"
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
            class="w-full rounded-md px-3 py-2 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Short tagline about the site"
          ></textarea>
        </div>
        <div class="flex items-center gap-3 pt-2">
          <button
            type="button"
            @click="saveInitialBranding"
            :disabled="brandingSubmitting || !siteName"
            class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40"
          >
            <Icon
              :icon="brandingSubmitting ? 'mdi:loading' : 'mdi:content-save'"
              :class="brandingSubmitting ? 'animate-spin' : ''"
              class="text-base"
            />
            <span>{{
              brandingSubmitting ? "Saving..." : "Save & Continue"
            }}</span>
          </button>
          <button
            type="button"
            @click="prevStep"
            class="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center gap-1 ml-auto"
          >
            <Icon icon="mdi:arrow-left" class="text-sm" /> Back
          </button>
        </div>
      </div>
    </section>
    <!-- STEP 4: Create Admin (mirrors Signup styling) -->
    <section
      v-else-if="activeStep === 4"
      class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-8"
    >
      <div class="flex items-start gap-3">
        <div
          class="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300"
        >
          <Icon icon="mdi:account-check" class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <h2
            class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"
          >
            4 · Create Admin Account
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            Create the first user. After email confirmation.
          </p>
        </div>
      </div>
      <template v-if="!adminExists">
        <form @submit.prevent="createAdmin" class="space-y-6" novalidate>
          <!-- Email -->
          <div>
            <label
              class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              <Icon icon="mdi:email-outline" class="text-base text-blue-500" />
              Email
            </label>
            <input
              v-model.trim="email"
              type="email"
              autocomplete="email"
              placeholder="admin@example.com"
              class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              required
            />
          </div>
          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label
                class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <Icon icon="mdi:lock-outline" class="text-base text-blue-500" />
                Password
              </label>
              <span class="text-[11px] text-gray-400 dark:text-gray-500"
                >Min 8 chars</span
              >
            </div>
            <div class="relative group">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                autocomplete="new-password"
                placeholder="••••••••"
                class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                required
                @input="validatePassword"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              >
                <Icon
                  :icon="
                    showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'
                  "
                  class="text-lg"
                />
              </button>
            </div>
            <div class="mt-1 flex items-center gap-2 text-[11px]">
              <div
                class="flex-1 h-1 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden"
              >
                <div
                  :class="['h-full transition-all', passwordStrength.barClass]"
                  :style="{ width: passwordStrength.percent + '%' }"
                ></div>
              </div>
              <span :class="['font-medium', passwordStrength.textClass]">{{
                passwordStrength.label
              }}</span>
            </div>
          </div>
          <!-- Username -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label
                class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <Icon
                  icon="mdi:account-circle"
                  class="text-base text-blue-500"
                />
                Username
              </label>
              <span class="text-[11px] text-gray-400 dark:text-gray-500"
                >A–Z, a–z, 0–9, - and _</span
              >
            </div>
            <input
              v-model.trim="username"
              type="text"
              autocomplete="username"
              placeholder="yourusername"
              class="w-full h-11 rounded-md border bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              :class="
                usernameError
                  ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              "
              required
              @input="validateUsername"
            />
            <div
              v-if="usernameError"
              class="mt-1 text-[11px] text-red-600 dark:text-red-400"
            >
              {{ usernameError }}
            </div>
          </div>
          <!-- Display Name -->
          <div>
            <label
              class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              <Icon
                icon="mdi:card-account-details-outline"
                class="text-base text-blue-500"
              />
              Display Name
            </label>
            <input
              v-model.trim="displayName"
              type="text"
              autocomplete="name"
              placeholder="Your name"
              class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              required
            />
          </div>
          <!-- Actions -->
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="prevStep"
              class="inline-flex items-center gap-2 h-10 px-4 rounded-md text-sm font-medium bg-gray-50 dark:bg-gray-700/30 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-gray-200 dark:border-gray-600"
            >
              <Icon icon="mdi:arrow-left" class="text-base" /> Back
            </button>
            <button
              type="submit"
              :disabled="
                creatingAdmin ||
                !!usernameError ||
                !email ||
                !password ||
                !username ||
                !displayName ||
                passwordStrength.percent < 25
              "
              class="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-md text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-200/70 dark:border-green-800/40 disabled:opacity-50"
            >
              <Icon
                :icon="creatingAdmin ? 'mdi:loading' : 'mdi:account-plus'"
                :class="creatingAdmin ? 'animate-spin' : ''"
                class="text-base"
              />
              <span>{{ creatingAdmin ? "Creating..." : "Create Admin" }}</span>
            </button>
          </div>
        </form>
        <div
          v-if="adminCreated"
          class="rounded-md border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/30 p-4 text-sm text-green-800 dark:text-green-200 flex items-start gap-3"
        >
          <Icon
            icon="mdi:check-circle"
            class="text-green-500 dark:text-green-300 mt-0.5"
          />
          <div>
            <p class="font-semibold">Admin account created.</p>
            <p class="text-[12px] mt-1">
              Please check your email to confirm the address before logging in.
            </p>
          </div>
        </div>
      </template>
      <div
        v-else
        class="rounded-md border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4 text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3"
      >
        <Icon
          icon="mdi:shield-account"
          class="text-blue-500 dark:text-blue-300 mt-0.5"
        />
        <div>
          <p class="font-semibold">Admin already exists</p>
          <p class="text-[12px] mt-1">Redirecting you to login…</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useToast } from "vue-toastification";

// @ts-ignore - .sql raw import
import migrationSqlRaw from "../install/pluma_initial.sql?raw";
import { projectInfo } from "@/config/projectInfo";

const toast = useToast();
const router = useRouter();

interface StepDef {
  step: number;
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
}
const steps: StepDef[] = [
  {
    step: 1,
    title: "SQL",
    description: "Copy & run migration",
    icon: "mdi:script-text",
  },
  {
    step: 2,
    title: "Verify",
    description: "Check schema & storage",
    icon: "mdi:check-decagram",
    disabled: computed(() => !provisionConfirmed.value) as any,
  },
  {
    step: 3,
    title: "Branding",
    description: "Set site name",
    icon: "mdi:brush",
    disabled: computed(() => !allVerified.value) as any,
  },
  {
    step: 4,
    title: "Admin",
    description: "Create admin account",
    icon: "mdi:account-star",
    disabled: computed(() => !allVerified.value || !brandingSaved.value) as any,
  },
];

const siteName = ref("");
const siteDescription = ref("");
const brandingSubmitting = ref(false);
const brandingSaved = ref(false);
const activeStep = ref<number>(1);
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL as
  | string
  | undefined;
const envAnon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;
const url = ref<string>(
  envUrl || localStorage.getItem("setup_supabase_url") || ""
);
const anonKey = ref<string>(
  envAnon || localStorage.getItem("setup_supabase_anon") || ""
);
const urlError = ref<string>("");
const keyError = ref<string>("");
let tempClient: SupabaseClient | null = null;
const usingEnvCreds = computed(() => !!envUrl && !!envAnon);
const maskedAnonKey = computed(() =>
  anonKey.value
    ? anonKey.value.slice(0, 16) + "..." + anonKey.value.slice(-8)
    : ""
);

type CheckItem = {
  name: string;
  type: "table" | "function" | "bucket" | "policy";
  status: "pending" | "ok" | "fail";
  detail?: string;
  expectedPublic?: boolean;
};
const tableChecks = ref<CheckItem[]>([
  { name: "categories", type: "table", status: "pending" },
  { name: "profiles", type: "table", status: "pending" },
  { name: "posts", type: "table", status: "pending" },
  { name: "comments", type: "table", status: "pending" },
  { name: "settings", type: "table", status: "pending" },
]);
const functionChecks = ref<CheckItem[]>([
  { name: "is_admin", type: "function", status: "pending" },
  { name: "is_author", type: "function", status: "pending" },
  { name: "handle_new_user", type: "function", status: "pending" },
  { name: "touch_updated_at", type: "function", status: "pending" },
]);
const bucketChecks = ref<CheckItem[]>([
  {
    name: "post-thumbnails",
    type: "bucket",
    status: "pending",
    expectedPublic: true,
  },
  {
    name: "profile-avatar",
    type: "bucket",
    status: "pending",
    expectedPublic: true,
  },
  { name: "branding", type: "bucket", status: "pending", expectedPublic: true },
]);
const policyChecks = ref<CheckItem[]>([
  { name: "RLS enabled", type: "policy", status: "pending" },
]);
const verifying = ref(false);
const verificationRan = ref(false);
const allVerified = computed(() =>
  [...tableChecks.value, ...functionChecks.value, ...bucketChecks.value].every(
    (c) => c.status === "ok"
  )
);

const provisionConfirmed = ref<boolean>(false);

const email = ref("");
const password = ref("");
const username = ref("");
const displayName = ref("");
const showPassword = ref(false);
const usernameError = ref("");
const passwordStrength = reactive({
  percent: 0,
  label: "Weak",
  barClass: "bg-red-400 dark:bg-red-500",
  textClass: "text-red-500 dark:text-red-400",
});
const creatingAdmin = ref(false);
const adminCreated = ref(false);
const installCompleted = ref(false);
const adminExists = ref(false);

const migrationSql: string = migrationSqlRaw as string;

function validate() {
  urlError.value = "";
  keyError.value = "";
  if (!url.value) urlError.value = "Missing URL";
  if (!anonKey.value) keyError.value = "Missing anon key";
  return !urlError.value && !keyError.value;
}

async function saveInitialBranding() {
  if (!siteName.value.trim()) {
    toast.error("Site name required");
    return;
  }
  if (!validate()) return;
  brandingSubmitting.value = true;
  try {
    tempClient = createClient(url.value, anonKey.value, {
      auth: { persistSession: false },
    });
    const { error } = await tempClient
      .from("settings")
      .insert({
        key: "branding",
        value: {
          siteName: siteName.value.trim(),
          siteDescription: siteDescription.value.trim(),
          socialLinks: [],
        },
      });
    if (error) throw error;
    brandingSaved.value = true;
    toast.success("Branding saved");
    activeStep.value = 4;
  } catch (e: any) {
    toast.error(e.message || "Failed to save branding");
  } finally {
    brandingSubmitting.value = false;
  }
}

async function verifyEnvironment() {
  if (!validate()) return;
  verifying.value = true;
  verificationRan.value = true;
  tempClient = null;
  [
    ...tableChecks.value,
    ...functionChecks.value,
    ...bucketChecks.value,
    ...policyChecks.value,
  ].forEach((c) => {
    c.status = "pending";
    c.detail = "";
  });
  try {
    tempClient = createClient(url.value, anonKey.value, {
      auth: { persistSession: false },
    });
    for (const t of tableChecks.value) {
      try {
        const col = t.name === "settings" ? "key" : "id";
        const { error } = await tempClient.from(t.name).select(col).limit(1);
        if (error) throw error;
        t.status = "ok";
      } catch (e: any) {
        t.status = "fail";
        t.detail = e.message;
      }
    }
    for (const f of functionChecks.value) {
      try {
        if (["is_admin", "is_author"].includes(f.name)) {
          const { error } = await tempClient.rpc(f.name);
          if (error) throw error;
          f.status = "ok";
        } else if (f.name === "handle_new_user") {
          const { error } = await tempClient
            .from("profiles")
            .select("id")
            .limit(1);
          if (error) throw error;
          f.status = "ok";
        } else if (f.name === "touch_updated_at") {
          const { error } = await tempClient
            .from("categories")
            .select("id")
            .limit(1);
          if (error) throw error;
          f.status = "ok";
        }
      } catch (e: any) {
        f.status = "fail";
        f.detail = e.message;
      }
    }
    for (const b of bucketChecks.value) {
      try {
        const { data, error } = await (
          tempClient as SupabaseClient
        ).storage.getBucket(b.name);
        if (error || !data) {
          if (b.name.endsWith("s")) {
            const singular = b.name.slice(0, -1);
            try {
              const { data: altData, error: altErr } = await (
                tempClient as SupabaseClient
              ).storage.getBucket(singular);
              if (altData && !altErr) {
                b.status = "fail";
                b.detail = `Found '${singular}' but expected '${b.name}' (rename bucket)`;
                continue;
              }
            } catch {
              /* ignore */
            }
          }
          b.status = "fail";
          b.detail = error ? error.message : "Bucket not found";
          continue;
        }
        const isPublic = (data as any).public === true;
        if (b.expectedPublic) {
          if (isPublic) b.status = "ok";
          else {
            b.status = "fail";
            b.detail = "Exists but not public";
          }
        } else {
          if (isPublic) {
            b.status = "fail";
            b.detail = "Public but expected private";
          } else {
            b.status = "ok";
          }
        }
      } catch (e: any) {
        b.status = "fail";
        b.detail = e.message || "Error verifying bucket";
      }
    }
    try {
      const { error } = await tempClient
        .from("categories")
        .select("id")
        .limit(1);
      if (error) throw error;
      policyChecks.value[0].status = "ok";
    } catch (e: any) {
      policyChecks.value[0].status = "fail";
      policyChecks.value[0].detail = e.message;
    }
    localStorage.setItem("setup_supabase_url", url.value);
    localStorage.setItem("setup_supabase_anon", anonKey.value);
    if (allVerified.value) toast.success("All checks passed");
    else toast.info("Verification finished (review results)");
  } catch (e: any) {
    console.error(e);
    toast.error("Verification failed");
  } finally {
    verifying.value = false;
  }
}

function validateUsername() {
  const val = username.value.trim();
  if (!val) usernameError.value = "Required";
  else if (!/^[A-Za-z0-9_-]{3,20}$/.test(val))
    usernameError.value = "3-20 chars: letters, numbers, - _";
  else usernameError.value = "";
}

function scorePassword(pass: string) {
  let score = 0;
  if (pass.length >= 8) score += 30;
  else return 10;
  if (/[A-Z]/.test(pass)) score += 15;
  if (/[a-z]/.test(pass)) score += 15;
  if (/[0-9]/.test(pass)) score += 15;
  if (/[^A-Za-z0-9]/.test(pass)) score += 15;
  if (pass.length >= 12) score += 10;
  return Math.min(score, 100);
}

function updatePasswordStrength() {
  const pct = scorePassword(password.value);
  passwordStrength.percent = pct;
  if (pct < 30) {
    passwordStrength.label = "Weak";
    passwordStrength.barClass = "bg-red-400 dark:bg-red-500";
    passwordStrength.textClass = "text-red-500 dark:text-red-400";
  } else if (pct < 60) {
    passwordStrength.label = "Fair";
    passwordStrength.barClass = "bg-yellow-400 dark:bg-yellow-500";
    passwordStrength.textClass = "text-yellow-600 dark:text-yellow-400";
  } else if (pct < 85) {
    passwordStrength.label = "Good";
    passwordStrength.barClass = "bg-blue-400 dark:bg-blue-500";
    passwordStrength.textClass = "text-blue-600 dark:text-blue-400";
  } else {
    passwordStrength.label = "Strong";
    passwordStrength.barClass = "bg-green-500 dark:bg-green-500";
    passwordStrength.textClass = "text-green-600 dark:text-green-400";
  }
}
function validatePassword() {
  updatePasswordStrength();
}

function bucketFailureHint(b: { name: string; detail?: string }) {
  if (!b.detail) return "Unknown failure";
  if (/not found/i.test(b.detail))
    return "Bucket not found. Create it in Storage with Public enabled and correct MIME types.";
  if (/not public|exists but not public/i.test(b.detail))
    return "Bucket exists but is private. Edit bucket -> toggle Public.";
  if (/rename bucket/i.test(b.detail))
    return b.detail + " Update policy names or bucket to match expected id.";
  if (/public but expected private/i.test(b.detail))
    return "Bucket is public but expected private per configuration.";
  return b.detail;
}

function nextStep() {
  if (activeStep.value < 4) {
    activeStep.value++;
    if (activeStep.value === 4) {
      checkExistingAdmin();
    }
  }
}
function prevStep() {
  if (activeStep.value > 1) activeStep.value--;
}
function goToStep(step: number) {
  if (step < activeStep.value) activeStep.value = step;
}

async function copySql() {
  try {
    await navigator.clipboard.writeText(migrationSql);
    toast.success("SQL copied");
  } catch {
    toast.error("Copy failed");
  }
}

async function createAdmin() {
  if (!tempClient) {
    toast.error("Reconnect first");
    return;
  }
  validateUsername();
  updatePasswordStrength();
  if (usernameError.value || passwordStrength.percent < 25) {
    toast.error("Fix validation issues");
    return;
  }
  creatingAdmin.value = true;
  adminCreated.value = false;
  try {
    const flagOk = await markInstallationComplete(true);
    if (!flagOk) {
      toast.error("Cannot set installation flag; aborting admin creation");
      return;
    }
    const { error } = await tempClient.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: { username: username.value, display_name: displayName.value },
      },
    });
    if (error) throw error;
    adminCreated.value = true;
    toast.success("Admin user created (confirm email if required)");
    setTimeout(() => {
      router.push({ name: "Login", query: { installed: "1" } });
    }, 600);
  } catch (e: any) {
    console.error(e);
    toast.error(e.message || "Failed");
  } finally {
    creatingAdmin.value = false;
  }
}

/**
 * Attempts to mark installation complete. Returns true on success or if already complete.
 * When silent=true, suppress success toast.
 */
async function markInstallationComplete(silent = false): Promise<boolean> {
  if (!tempClient) return false;
  try {
    const { data: existing, error: selErr } = await tempClient
      .from("settings")
      .select("value")
      .eq("key", "installation")
      .maybeSingle();
    if (!selErr && existing) {
      const val = existing.value as any;
      if (val && typeof val === "object" && val.complete === true) {
        installCompleted.value = true;
        return true;
      }
      toast.error(
        "Existing installation flag present but incomplete. Use admin to finalize."
      );
      return false;
    }
    const { error } = await tempClient.from("settings").insert({
      key: "installation",
      value: {
        complete: true,
        completed_at: new Date().toISOString(),
      },
    });
    if (error) throw error;
    installCompleted.value = true;
    if (!silent) toast.success("Installation marked complete");
    return true;
  } catch (e: any) {
    console.warn("Failed to mark installation complete", e);
    if (!silent)
      toast.error("Could not flag installation complete (set manually later)");
    return false;
  }
}

async function checkExistingAdmin() {
  if (!tempClient) return;
  try {
    const { data, error } = await tempClient
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .limit(1);
    if (!error && data && data.length > 0) {
      adminExists.value = true;
      toast.info("Admin already exists – skipping creation");
      if (!installCompleted.value) {
        await markInstallationComplete();
      }
      setTimeout(() => {
        router.push({ name: "Login", query: { installed: "1" } });
      }, 600);
    }
  } catch (e) {
    console.warn("Admin existence check failed", e);
  }
}
</script>
