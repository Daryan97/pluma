import fs from 'fs'

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = d + '/' + e.name
    if (e.isDirectory()) walk(p, a)
    else if (e.name.endsWith('.vue')) a.push(p)
  }
  return a
}

let n = 0
for (const f of walk('src')) {
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // '{{ t('x') }}'  (single-quoted string containing mustache)
  s = s.replace(/'\{\{\s*t\('([^']+)'\)\s*\}\}'/g, "t('$1')")
  // "{{ t('x') }}" already handled, but also: '{{ t("x") }}'
  s = s.replace(/'\{\{\s*t\("([^"]+)"\)\s*\}\}'/g, "t('$1')")
  // :placeholder="'{{ t('x') }}'" style leftovers already covered
  // label:'{{ t('x') }}'
  s = s.replace(/label:'\{\{\s*t\('([^']+)'\)\s*\}\}'/g, "label: t('$1')")
  s = s.replace(/label:"\{\{\s*t\('([^']+)'\)\s*\}\}"/g, 'label: t(\'$1\')')
  if (s !== before) {
    fs.writeFileSync(f, s)
    console.log('fixed', f)
    n++
  }
}
console.log('files', n)
