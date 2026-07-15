import fs from 'fs'

const path = 'src/pages/profile.vue'
let s = fs.readFileSync(path, 'utf8')

if (!s.includes('useI18n')) {
  s = s.replace(
    'const router = useRouter();',
    "const { t } = useI18n();\nconst localePath = useLocalePath();\nconst router = useRouter();"
  )
}

const reps = [
  ['My Profile', "{{ t('profile.title') }}"],
  ['Authentication', "{{ t('profile.authentication') }}"],
  ['>Hidden</span', ">{{ t('common.hidden') }}</span"],
  ['New Email:', "{{ t('profile.newEmail') }}"],
  ['{{ savingEmail ? "Sending…" : "Send Change Request" }}', "{{ savingEmail ? t('auth.sending') : t('profile.sendChangeRequest') }}"],
  ['{{ savingEmail ? "Sending..." : "Send Change Request" }}', "{{ savingEmail ? t('auth.sending') : t('profile.sendChangeRequest') }}"],
  ["router.push('/change-password')", "router.push(localePath('/change-password'))"],
  ['{{ profile?.username || "N/A" }}', "{{ profile?.username || t('common.na') }}"],
  ['{{ profile?.display_name || "N/A" }}', "{{ profile?.display_name || t('common.na') }}"],
  ['{{ uploadingAvatar ? "Uploading..." : "Save" }}', "{{ uploadingAvatar ? t('common.uploading') : t('common.save') }}"],
  ["{{ expanded ? 'Show less' : `Show ${enabledProviders.length - COLLAPSED_COUNT} more` }}", "{{ expanded ? t('common.showLess') : t('common.showMore', { count: enabledProviders.length - COLLAPSED_COUNT }) }}"],
]

for (const [a, b] of reps) {
  if (s.includes(a)) {
    s = s.split(a).join(b)
    console.log('ok', a.slice(0, 50))
  } else console.log('MISS', a.slice(0, 60))
}

// Label / button text nodes that appear once — use careful replaces
const labelReps = [
  [/>\s*Change\s*</g, ">{{ t('common.change') }}<"],
  [/>\s*Cancel\s*</g, ">{{ t('common.cancel') }}<"],
  [/>\s*Edit\s*</g, ">{{ t('common.edit') }}<"],
  [/>\s*Save\s*</g, ">{{ t('common.save') }}<"],
  [/>\s*Created\s*</g, ">{{ t('profile.created') }}<"],
  [/>\s*Username\s*</g, ">{{ t('profile.username') }}<"],
  [/>\s*Display\s*</g, ">{{ t('profile.display') }}<"],
  [/>\s*Username:\s*</g, ">{{ t('auth.username') }}:<"],
  [/>\s*Display Name:\s*</g, ">{{ t('profile.displayName') }}<"],
  [/>\s*Profile\s*</g, ">{{ t('profile.profileSection') }}<"],
  [/>\s*Avatar\s*</g, ">{{ t('profile.avatar') }}<"],
  [/>\s*Linked Accounts\s*</g, ">{{ t('profile.linkedAccounts') }}<"],
  [/>\s*Click to Change\s*</g, ">{{ t('profile.clickToChange') }}<"],
  [/>\s*Link\s*</g, ">{{ t('profile.link') }}<"],
  [/>\s*Unlink\s*</g, ">{{ t('profile.unlink') }}<"],
  [/>\s*Email\s*</g, ">{{ t('auth.email') }}<"],
  [/>\s*Password\s*</g, ">{{ t('auth.password') }}<"],
  [/>\s*ID\s*</g, ">{{ t('profile.id') }}<"],
]

for (const [re, b] of labelReps) {
  const before = s
  s = s.replace(re, b)
  if (s !== before) console.log('regex ok', String(re))
}

s = s.replace(
  'Click the avatar to upload a new one.',
  "{{ t('profile.clickAvatarHint') }}"
)

const toasts = [
  ['Error checking username uniqueness', "t('profile.usernameCheckFailed')"],
  ['Username already taken', "t('profile.usernameTaken')"],
  ['Failed to update profile', "t('profile.updateFailed')"],
  ['Profile updated', "t('profile.updated')"],
  ['Failed to change email', "t('profile.updateFailed')"],
  ['Email change request sent', "t('profile.emailChangeSent')"],
  ['Please enter a new email address', "t('auth.pleaseEnterEmail')"],
  ['Only PNG/JPEG/WEBP images are allowed', "t('profile.avatarTypeError')"],
  ['File too large (max 2MB)', "t('profile.avatarSizeError')"],
  ['Avatar updated', "t('profile.avatarUpdated')"],
  ['Failed to upload avatar', "t('profile.uploadFailed')"],
  ['Avatar removed', "t('profile.avatarRemoved')"],
  ['Failed to remove avatar', "t('profile.uploadFailed')"],
  ['Not authenticated', "t('common.unexpectedError')"],
]
for (const [a, b] of toasts) {
  for (const q of [`'${a}'`, `"${a}"`]) {
    if (s.includes(q)) {
      s = s.split(q).join(b)
      console.log('toast', a)
    }
  }
}

fs.writeFileSync(path, s)
console.log('written profile.vue')
