<template>
  <div
    v-if="authenticated"
    class="w-full px-4 py-14 grid place-items-center"
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
          {{ t("auth.changePassword") }}
        </h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ t("auth.changePasswordHint") }}
        </p>
      </div>
      <div
        class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
      >
      <form @submit.prevent="handleChange" class="space-y-5" novalidate>
        <div>
          <label
            class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            <Icon icon="mdi:lock-outline" class="text-base text-blue-500" />
            {{ t("auth.currentPassword") }}
          </label>
          <div class="relative">
            <input
              :type="showCurrent ? 'text' : 'password'"
              v-model="currentPassword"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              required
            />
            <button
              type="button"
              @click="showCurrent = !showCurrent"
              :aria-label="
                showCurrent ? t('auth.hidePassword') : t('auth.showPassword')
              "
              class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60"
            >
              <Icon
                :icon="showCurrent ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                class="text-lg"
              />
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between gap-3 mb-1">
            <label
              class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <Icon icon="mdi:lock-plus-outline" class="text-base text-blue-500" />
              {{ t("auth.newPassword") }}
            </label>
            <span class="shrink-0 text-[11px] text-gray-400 dark:text-gray-500">{{
              t("auth.minPassword")
            }}</span>
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
                :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
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
              :class="['shrink-0 font-medium w-12 text-right', strength.textClass]"
              >{{ strength.label }}</span
            >
          </div>
        </div>

        <div>
          <label
            class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            <Icon icon="mdi:lock-check-outline" class="text-base text-blue-500" />
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
          :disabled="
            loading ||
            !currentPassword ||
            strength.percent < 25 ||
            !passwordsMatch
          "
        >
          <Icon v-if="loading" icon="mdi:loading" class="animate-spin" />
          <Icon v-else icon="mdi:check" class="text-lg" />
          <span>{{
            loading ? t("auth.updatingPassword") : t("auth.changePassword")
          }}</span>
        </button>

        <p class="text-center text-[13px] text-gray-500 dark:text-gray-400">
          <button
            type="button"
            class="text-blue-600 dark:text-blue-400 hover:underline"
            @click="forgotConfirmOpen = true"
          >
            {{ t("auth.forgotPasswordUseLogin") }}
          </button>
        </p>

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

    <ConfirmDialog
      :open="forgotConfirmOpen"
      :title="t('auth.forgotPasswordConfirmTitle')"
      :description="t('auth.forgotPasswordConfirmBody')"
      :confirm-label="t('auth.forgotPasswordConfirmAction')"
      icon="mdi:logout"
      @confirm="confirmForgotAndSignOut"
      @cancel="forgotConfirmOpen = false"
    />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, ssr: false })

import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "@/services/supabase"
import { Icon } from "@iconify/vue"
import ConfirmDialog from "@/components/ConfirmDialog.vue"
import { scorePassword, passwordStrengthMeta } from "@/lib/passwordStrength"

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const toast = useToast()

const currentPassword = ref("")
const password = ref("")
const confirm = ref("")
const strength = ref(passwordStrengthMeta(0, t))
const errorMsg = ref(null)
const loading = ref(false)
const authenticated = ref(false)
const showPassword = ref(false)
const showCurrent = ref(false)
const userEmail = ref("")
const forgotConfirmOpen = ref(false)

const passwordsMatch = computed(
  () => password.value.length > 0 && password.value === confirm.value
)

function refreshStrength() {
  strength.value = passwordStrengthMeta(scorePassword(password.value), t)
}

function isRecoverySession() {
  try {
    if (sessionStorage.getItem("pluma-password-recovery") === "1") return true
    if (useState("password-recovery-pending", () => false).value) return true
  } catch {
    /* ignore */
  }
  const hash = import.meta.client ? window.location.hash || "" : ""
  const search = import.meta.client ? window.location.search || "" : ""
  return /type=recovery/i.test(hash + search)
}

async function confirmForgotAndSignOut() {
  forgotConfirmOpen.value = false
  try {
    useAuthCache().clearAuthCache()
  } catch {
    /* ignore */
  }
  await supabase.auth.signOut().catch(() => {})
  router.push(localePath("/login"))
}

onMounted(async () => {
  // Forgot-password recovery must use /reset-password, not this page.
  if (isRecoverySession()) {
    router.replace(localePath("/reset-password"))
    return
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    router.replace(localePath("/login"))
    return
  }
  userEmail.value = user.email || ""
  authenticated.value = true
})

async function handleChange() {
  if (!currentPassword.value) {
    errorMsg.value = t("auth.currentPasswordRequired")
    return
  }
  if (!passwordsMatch.value) {
    errorMsg.value = t("auth.passwordsDoNotMatch")
    return
  }
  if (password.value === currentPassword.value) {
    errorMsg.value = t("auth.newPasswordMustDiffer")
    return
  }
  if (!userEmail.value) {
    errorMsg.value = t("auth.passwordChangeNeedsEmail")
    return
  }

  loading.value = true
  errorMsg.value = null

  // Re-authenticate so a stolen session alone can’t change the password.
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: userEmail.value,
    password: currentPassword.value,
  })
  if (reauthError) {
    errorMsg.value = t("auth.currentPasswordIncorrect")
    loading.value = false
    return
  }

  const { error } = await supabase.auth.updateUser({ password: password.value })
  if (error) {
    errorMsg.value = error.message
    loading.value = false
    return
  }

  toast.success(t("auth.passwordChanged"))
  router.push(localePath("/profile"))
  loading.value = false
}
</script>
