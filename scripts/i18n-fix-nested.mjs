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
  // "{{ t('x') }}" -> t('x')  inside JS expressions
  s = s.replace(/"\{\{\s*t\('([^']+)'\)\s*\}\}"/g, "t('$1')")
  s = s.replace(/'\{\{\s*t\("([^"]+)"\)\s*\}\}'/g, "t('$1')")
  if (s !== before) {
    fs.writeFileSync(f, s)
    console.log('fixed', f)
    n++
  }
}
console.log('files', n)
