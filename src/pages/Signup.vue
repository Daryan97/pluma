<template>
  <div class="max-w-md mx-auto mt-14 mb-20">
    <div class="mb-8 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-sm mb-4">
        <Icon icon="mdi:account-plus" class="text-3xl" />
      </div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Create your account</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Join and start publishing your thoughts.</p>
    </div>

    <div class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <form @submit.prevent="handleSignup" class="space-y-5" novalidate>
        <div>
          <label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Icon icon="mdi:email-outline" class="text-base text-blue-500" />
            Email
          </label>
          <div class="relative">
            <input
              v-model.trim="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              required
            />
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Icon icon="mdi:lock-outline" class="text-base text-blue-500" />
              Password
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
              @input="validatePassword()"
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
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Icon icon="mdi:account-circle" class="text-base text-blue-500" />
              Username
            </label>
            <span class="text-[11px] text-gray-400 dark:text-gray-500">A–Z, a–z, 0–9, - and _</span>
          </div>
          <div class="relative">
            <input
              v-model.trim="username"
              type="text"
              autocomplete="username"
              placeholder="yourusername"
              class="w-full h-11 rounded-md border bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              :class="usernameError ? 'border-red-500 focus:ring-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'"
              required
              @input="validateUsername()"
            />
            <div v-if="usernameError" class="mt-1 text-[11px] text-red-600 dark:text-red-400">{{ usernameError }}</div>
          </div>
        </div>
        <div>
          <label class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Icon icon="mdi:card-account-details-outline" class="text-base text-blue-500" />
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
        <button
          type="submit"
          :disabled="submitting || usernameError || !email || !password || !username || !displayName || passwordStrength.percent < 25"
          class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Icon v-if="submitting" icon="mdi:loading" class="animate-spin" />
          <Icon v-else icon="mdi:account-plus" class="text-lg" />
          <span>{{ submitting ? 'Creating account...' : 'Sign Up' }}</span>
        </button>

        <p class="text-[13px] text-gray-600 dark:text-gray-400 pt-2 text-center">
          Already have an account?
          <router-link
            to="/login"
            class="text-blue-600 dark:text-blue-400 hover:underline"
            >Login</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/services/supabase';
import { useToast } from 'vue-toastification';
import { Icon } from '@iconify/vue';

const toast = useToast();
const email = ref('');
const password = ref('');
const username = ref('');
const displayName = ref('');
const submitting = ref(false);
const showPassword = ref(false);
const usernameError = ref('');
const passwordStrength = reactive({ percent: 0, label: 'Weak', barClass: 'bg-red-400 dark:bg-red-500', textClass: 'text-red-500 dark:text-red-400' });
const router = useRouter();

function validateUsername() {
  const val = username.value;
  if (!val) {
    usernameError.value = 'Required';
  } else if (!/^[A-Za-z0-9_-]{3,20}$/.test(val)) {
    usernameError.value = '3-20 chars: letters, numbers, - _';
  } else {
    usernameError.value = '';
  }
}

function scorePassword(pass) {
  let score = 0;
  if (pass.length >= 8) score += 30; else return 10;
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
    passwordStrength.label = 'Weak';
    passwordStrength.barClass = 'bg-red-400 dark:bg-red-500';
    passwordStrength.textClass = 'text-red-500 dark:text-red-400';
  } else if (pct < 60) {
    passwordStrength.label = 'Fair';
    passwordStrength.barClass = 'bg-yellow-400 dark:bg-yellow-500';
    passwordStrength.textClass = 'text-yellow-600 dark:text-yellow-400';
  } else if (pct < 85) {
    passwordStrength.label = 'Good';
    passwordStrength.barClass = 'bg-blue-400 dark:bg-blue-500';
    passwordStrength.textClass = 'text-blue-600 dark:text-blue-400';
  } else {
    passwordStrength.label = 'Strong';
    passwordStrength.barClass = 'bg-green-500 dark:bg-green-500';
    passwordStrength.textClass = 'text-green-600 dark:text-green-400';
  }
}

function validatePassword() {
  updatePasswordStrength();
}

async function handleSignup() {
  validateUsername();
  updatePasswordStrength();
  if (usernameError.value || passwordStrength.percent < 25) return;
  submitting.value = true;
  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          username: username.value,
          display_name: displayName.value,
        },
      },
    });
    if (error) throw error;
    toast.success('Account created! Check your email to confirm.');
    router.push('/');
  } catch (e) {
    toast.error(e.message || 'Signup failed');
  } finally {
    submitting.value = false;
  }
}
</script>
