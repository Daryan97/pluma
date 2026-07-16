/**
 * Shared password strength helpers for change/reset password pages.
 */
export function scorePassword(pass) {
  let score = 0
  if (!pass || pass.length < 8) return pass ? 10 : 0
  score += 30
  if (/[A-Z]/.test(pass)) score += 15
  if (/[a-z]/.test(pass)) score += 15
  if (/[0-9]/.test(pass)) score += 15
  if (/[^A-Za-z0-9]/.test(pass)) score += 15
  if (pass.length >= 12) score += 10
  return Math.min(score, 100)
}

export function passwordStrengthMeta(pct, t) {
  if (pct < 30) {
    return {
      percent: pct,
      label: t('auth.passwordStrength.weak'),
      barClass: 'bg-red-400 dark:bg-red-500',
      textClass: 'text-red-500 dark:text-red-400',
    }
  }
  if (pct < 60) {
    return {
      percent: pct,
      label: t('auth.passwordStrength.fair'),
      barClass: 'bg-yellow-400 dark:bg-yellow-500',
      textClass: 'text-yellow-600 dark:text-yellow-400',
    }
  }
  if (pct < 85) {
    return {
      percent: pct,
      label: t('auth.passwordStrength.good'),
      barClass: 'bg-blue-400 dark:bg-blue-500',
      textClass: 'text-blue-600 dark:text-blue-400',
    }
  }
  return {
    percent: pct,
    label: t('auth.passwordStrength.strong'),
    barClass: 'bg-green-500 dark:bg-green-500',
    textClass: 'text-green-600 dark:text-green-400',
  }
}
