import fs from 'fs'

const path = 'src/pages/change-password.vue'
let s = fs.readFileSync(path, 'utf8')

if (!s.includes('useI18n')) {
  s = s.replace(
    "const router = useRouter();",
    "const { t } = useI18n()\nconst localePath = useLocalePath()\nconst router = useRouter();"
  )
  if (!s.includes('useI18n')) {
    s = s.replace(
      "const router = useRouter()",
      "const { t } = useI18n()\nconst localePath = useLocalePath()\nconst router = useRouter()"
    )
  }
}

const reps = [
  ['Change password', "{{ t('auth.changePassword') }}"],
  ['Enter a new password for your account.', "{{ t('auth.enterNewPassword') }}"],
  ['New password', "{{ t('auth.newPassword') }}"],
  ['Min 8 chars', "{{ t('auth.minPassword') }}"],
  [":aria-label=\"showPassword ? 'Hide password' : 'Show password'\"", ":aria-label=\"showPassword ? t('auth.hidePassword') : t('auth.showPassword')\""],
  ["{{ loading ? 'Updating...' : 'Reset password' }}", "{{ loading ? t('auth.updatingPassword') : t('auth.resetPassword') }}"],
  ['Password reset successful. Redirecting...', "{{ t('auth.passwordResetSuccess') }}"],
  ["'An error occurred.'", "t('auth.errorOccurred')"],
  ["router.push({ path: '/login'", "router.push({ path: localePath('/login')"],
  ["router.replace('/login')", "router.replace(localePath('/login'))"],
  ["router.push('/login')", "router.push(localePath('/login'))"],
]

for (const [a, b] of reps) {
  if (s.includes(a)) {
    s = s.split(a).join(b)
    console.log('ok', a.slice(0, 50))
  } else console.log('MISS', a.slice(0, 60))
}

// password strength labels
s = s.replace(
  /label:\s*'Weak'/g,
  "label: t('auth.passwordStrength.weak')"
)
s = s.replace(
  /label:\s*'Fair'/g,
  "label: t('auth.passwordStrength.fair')"
)
s = s.replace(
  /label:\s*'Good'/g,
  "label: t('auth.passwordStrength.good')"
)
s = s.replace(
  /label:\s*'Strong'/g,
  "label: t('auth.passwordStrength.strong')"
)

fs.writeFileSync(path, s)
console.log('written change-password.vue')
