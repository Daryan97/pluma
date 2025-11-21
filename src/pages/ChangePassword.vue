<template>
  <div v-if="authenticated" class="max-w-md mx-auto mt-14 mb-20">
    <div class="mb-8 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-sm mb-4">
        <Icon icon="mdi:lock-reset" class="text-3xl" />
      </div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Change password</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Enter a new password for your account.</p>
    </div>
    <div class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <form @submit.prevent="handleReset" class="space-y-5" novalidate>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Icon icon="mdi:lock-outline" class="text-base text-blue-500" />
              New password
            </label>
            <span class="text-[11px] text-gray-400 dark:text-gray-500">Min 8 chars</span>
          </div>
          <div class="relative group">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              autocomplete="new-password"
              placeholder="••••••••"
              class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              required
              @input="updatePasswordStrength()"
            />
            <button type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'" class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500">
              <Icon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="text-lg" />
            </button>
          </div>
          <div class="mt-1 flex items-center gap-2 text-[11px]">
            <div class="flex-1 h-1 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div :class="['h-full transition-all', passwordStrength.barClass]" :style="{ width: passwordStrength.percent + '%' }"></div>
            </div>
            <span :class="['font-medium', passwordStrength.textClass]">{{ passwordStrength.label }}</span>
          </div>
        </div>

        <button
          type="submit"
          class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none"
          :disabled="loading || passwordStrength.percent < 25"
        >
          <Icon v-if="loading" icon="mdi:loading" class="animate-spin" />
            <Icon v-else icon="mdi:check" class="text-lg" />
          <span>{{ loading ? 'Updating...' : 'Reset password' }}</span>
        </button>

        <p v-if="errorMsg" class="text-red-500 text-[13px] text-center">{{ errorMsg }}</p>
        <p v-if="success" class="text-green-600 dark:text-green-400 text-[13px] text-center">Password reset successful. Redirecting...</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { Icon } from '@iconify/vue'

const password = ref('')
const passwordStrength = ref({ percent: 0, label: 'Weak', barClass: 'bg-red-400 dark:bg-red-500', textClass: 'text-red-500 dark:text-red-400' })
const errorMsg = ref(null)
const success = ref(false)
const loading = ref(false)
const authenticated = ref(false)
const showPassword = ref(false)

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const { error_code, error_description } = route.query

  if (error_code || error_description) {
    const errorMessage = decodeURIComponent(error_description || 'An error occurred.')
    router.push({ path: '/login', query: { error: errorMessage } })
    return
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    router.replace('/login')
  } else {
    authenticated.value = true
  }
})

function scorePassword(pass) {
  let score = 0
  if (pass.length >= 8) score += 30; else return 10
  if (/[A-Z]/.test(pass)) score += 15
  if (/[a-z]/.test(pass)) score += 15
  if (/[0-9]/.test(pass)) score += 15
  if (/[^A-Za-z0-9]/.test(pass)) score += 15
  if (pass.length >= 12) score += 10
  return Math.min(score, 100)
}

function updatePasswordStrength() {
  const pct = scorePassword(password.value)
  passwordStrength.value.percent = pct
  if (pct < 30) {
    passwordStrength.value.label = 'Weak'
    passwordStrength.value.barClass = 'bg-red-400 dark:bg-red-500'
    passwordStrength.value.textClass = 'text-red-500 dark:text-red-400'
  } else if (pct < 60) {
    passwordStrength.value.label = 'Fair'
    passwordStrength.value.barClass = 'bg-yellow-400 dark:bg-yellow-500'
    passwordStrength.value.textClass = 'text-yellow-600 dark:text-yellow-400'
  } else if (pct < 85) {
    passwordStrength.value.label = 'Good'
    passwordStrength.value.barClass = 'bg-blue-400 dark:bg-blue-500'
    passwordStrength.value.textClass = 'text-blue-600 dark:text-blue-400'
  } else {
    passwordStrength.value.label = 'Strong'
    passwordStrength.value.barClass = 'bg-green-500 dark:bg-green-500'
    passwordStrength.value.textClass = 'text-green-600 dark:text-green-400'
  }
}

const handleReset = async () => {
  loading.value = true
  errorMsg.value = null
  success.value = false

  const { error } = await supabase.auth.updateUser({ password: password.value })

  if (error) {
    errorMsg.value = error.message
  } else {
    success.value = true
    setTimeout(() => router.push('/login'), 1800)
  }
  loading.value = false
}
</script>
