import fs from 'fs'

const files = [
  'src/pages/dashboard/index.vue',
  'src/pages/category/[slug].vue',
  'src/pages/archive/category/[slug].vue',
]

for (const f of files) {
  let s = fs.readFileSync(f, 'utf8')
  // localePath('/foo/${id}') -> localePath(`/foo/${id}`)
  s = s.replace(
    /localePath\('([^']*)\$\{([^}]+)\}([^']*)'\)/g,
    (_, a, b, c) => 'localePath(`' + a + '${' + b + '}' + c + '`)'
  )
  // :title="'{{ t('x') }}'" -> :title="t('x')"
  s = s.replace(
    /:(title|description|body|placeholder|aria-label)="' \{\{ t\('([^']+)'\) \} \}'"/g,
    ':$1="t(\'$2\')"'
  )
  s = s.replace(
    /:(title|description|body|placeholder|aria-label)="'{{ t\('([^']+)'\) }}'"/g,
    ':$1="t(\'$2\')"'
  )
  s = s.replace(
    /:title="'{{ t\('common\.confirmAction'\) }}'"/g,
    ":title=\"t('common.confirmAction')\""
  )
  s = s.replace(
    'body="Are you sure you want to proceed?"',
    ":body=\"t('common.areYouSure')\""
  )
  // Dashboard heading
  s = s.replace(
    />\s*Dashboard\s*</g,
    ">{{ t('dashboard.title') }}<"
  )
  fs.writeFileSync(f, s)
  console.log('fixed', f)
}

// Verify
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8')
  const bad = s.match(/localePath\('[^']*\$\{/)
  const badTitle = s.match(/:title="'{{/)
  console.log(f, 'badPath', !!bad, 'badTitle', !!badTitle)
}
