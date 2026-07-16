<template>
  <div
    class="relative min-h-screen text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900"
  >
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      aria-hidden="true"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"
      />
    </div>
    <div
      class="relative min-h-screen w-full px-4 py-10 flex items-center justify-center"
    >
      <div class="w-full" style="max-width: 28rem">
        <div class="mb-8 text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-sm mb-4"
          >
            <Icon icon="mdi:lock-reset" class="text-3xl" />
          </div>
          <h1
            class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight"
          >
            {{ t("auth.setNewPassword") }}
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ t("auth.setNewPasswordHint") }}
          </p>
        </div>

        <div
          v-if="status === 'waiting'"
          class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm text-center text-sm text-gray-600 dark:text-gray-400"
        >
          <Icon icon="mdi:loading" class="text-2xl animate-spin mx-auto mb-3" />
          {{ t("auth.verifyingResetLink") }}
        </div>

        <div
          v-else-if="status === 'invalid'"
          class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4 text-center"
        >
          <p class="text-sm text-red-600 dark:text-red-400">
            {{ invalidMessage || t("auth.resetLinkInvalid") }}
          </p>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"
            :disabled="leaving"
            @click="abandonRecovery"
          >
            {{ t("auth.backToLogin") }}
          </button>
        </div>

        <div
          v-else
          class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
        >
          <form @submit.prevent="submit" class="space-y-5" novalidate>
            <div>
              <div class="flex items-center justify-between gap-3 mb-1">
                <label
                  class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <Icon icon="mdi:lock-outline" class="text-base text-blue-500" />
                  {{ t("auth.newPassword") }}
                </label>
                <span
                  class="shrink-0 text-[11px] text-gray-400 dark:text-gray-500"
                  >{{ t("auth.minPassword") }}</span
                >
              </div>
              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  autocomplete="new-password"
                  placeholder="••••••••"
                  class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                  required
                  @input="refreshStrength"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :aria-label="
                    showPassword ? t('auth.hidePassword') : t('auth.showPassword')
                  "
                  class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60"
                >
                  <Icon
                    :icon="
                      showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'
                    "
                    class="text-lg"
                  />
                </button>
              </div>
              <div class="mt-2 flex items-center gap-2 text-[11px]">
                <div
                  class="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
                >
                  <div
                    :class="['h-full transition-all', strength.barClass]"
                    :style="{ width: strength.percent + '%' }"
                  />
                </div>
                <span
                  :class="[
                    'shrink-0 font-medium w-12 text-right',
                    strength.textClass,
                  ]"
                  >{{ strength.label }}</span
                >
              </div>
            </div>

            <div>
              <label
                class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                <Icon
                  icon="mdi:lock-check-outline"
                  class="text-base text-blue-500"
                />
                {{ t("auth.confirmPassword") }}
              </label>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="confirm"
                autocomplete="new-password"
                placeholder="••••••••"
                class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-50 disabled:pointer-events-none"
              :disabled="loading || leaving || strength.percent < 25 || !passwordsMatch"
            >
              <Icon v-if="loading" icon="mdi:loading" class="animate-spin" />
              <Icon v-else icon="mdi:check" class="text-lg" />
              <span>{{
                loading ? t("auth.updatingPassword") : t("auth.saveNewPassword")
              }}</span>
            </button>

            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50"
              :disabled="loading || leaving"
              @click="abandonRecovery"
            >
              <Icon v-if="leaving" icon="mdi:loading" class="animate-spin" />
              <span>{{ t("auth.cancelPasswordReset") }}</span>
            </button>

            <p
              v-if="confirm && !passwordsMatch"
              class="text-red-500 text-[13px] text-center"
            >
              {{ t("auth.passwordsDoNotMatch") }}
            </p>
            <p v-if="errorMsg" class="text-red-500 text-[13px] text-center">
              {{ errorMsg }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  ssr: false,
  // Intentionally no requiresAuth — recovery tokens are not ready when middleware runs.
})

import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRoute } from "vue-router"
import { supabase } from "@/services/supabase"
import { Icon } from "@iconify/vue"
import { scorePassword, passwordStrengthMeta } from "@/lib/passwordStrength"

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const status = ref("waiting") // waiting | ready | invalid
const invalidMessage = ref("")
const password = ref("")
const confirm = ref("")
const showPassword = ref(false)
const loading = ref(false)
const leaving = ref(false)
const errorMsg = ref(null)
const strength = ref(passwordStrengthMeta(0, t))
const recoveryReady = ref(false)

const passwordsMatch = computed(
  () => password.value.length > 0 && password.value === confirm.value
)

function refreshStrength() {
  strength.value = passwordStrengthMeta(scorePassword(password.value), t)
}

let unsub = null
let waitTimer = null

function markReady() {
  recoveryReady.value = true
  status.value = "ready"
  if (waitTimer) {
    clearTimeout(waitTimer)
    waitTimer = null
  }
}

function markInvalid(msg) {
  if (recoveryReady.value) return
  status.value = "invalid"
  invalidMessage.value = msg || ""
  clearRecoveryFlag()
}

function clearRecoveryFlag() {
  try {
    sessionStorage.removeItem("pluma-password-recovery")
  } catch {
    /* ignore */
  }
  useState("password-recovery-pending", () => false).value = false
}

function hasRecoveryHint() {
  if (!import.meta.client) return false
  if (useState("password-recovery-pending", () => false).value) return true
  try {
    if (sessionStorage.getItem("pluma-password-recovery") === "1") return true
  } catch {
    /* ignore */
  }
  const hash = window.location.hash || ""
  const search = window.location.search || ""
  return /type=recovery/i.test(hash + search)
}

onMounted(async () => {
  const { error_code, error_description, error } = route.query
  if (error_code || error_description || error) {
    markInvalid(
      decodeURIComponent(
        String(error_description || error || t("auth.errorOccurred"))
      )
    )
    return
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      markReady()
      return
    }
    if (session && event === "SIGNED_IN" && hasRecoveryHint()) {
      markReady()
    }
    if (session && event === "INITIAL_SESSION" && hasRecoveryHint()) {
      markReady()
    }
  })
  unsub = () => subscription.unsubscribe()

  // Session may already exist (hash parsed on / then redirected here).
  if (hasRecoveryHint()) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      markReady()
      return
    }
  }

  waitTimer = setTimeout(() => {
    if (!recoveryReady.value) {
      markInvalid(t("auth.resetLinkInvalid"))
    }
  }, 8000)
})

onUnmounted(() => {
  if (unsub) unsub()
  if (waitTimer) clearTimeout(waitTimer)
})

function finishRecoveryAndGoLogin({ withResetQuery = false } = {}) {
  try {
    sessionStorage.setItem("pluma-password-recovery-done", "1")
  } catch {
    /* ignore */
  }
  clearRecoveryFlag()
  try {
    useAuthCache().clearAuthCache()
  } catch {
    /* ignore */
  }

  const loginPath = localePath("/login")
  const query = withResetQuery ? { reset: "1" } : {}

  // Defer signOut to avoid Supabase auth mutex deadlock with updateUser.
  setTimeout(() => {
    supabase.auth
      .signOut()
      .catch(() => {})
      .finally(() => {
        clearRecoveryFlag()
        navigateTo({ path: loginPath, query }, { replace: true })
      })
  }, 0)
}

function abandonRecovery() {
  if (leaving.value || loading.value) return
  leaving.value = true
  finishRecoveryAndGoLogin({ withResetQuery: false })
}

async function submit() {
  if (!passwordsMatch.value) {
    errorMsg.value = t("auth.passwordsDoNotMatch")
    return
  }
  loading.value = true
  errorMsg.value = null

  const { error } = await supabase.auth.updateUser({ password: password.value })
  if (error) {
    errorMsg.value = error.message
    loading.value = false
    return
  }

  finishRecoveryAndGoLogin({ withResetQuery: true })
}
</script>
