import fs from 'fs'

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = `${d}/${e.name}`
    if (e.isDirectory()) walk(p, a)
    else if (e.name.endsWith('.vue')) a.push(p)
  }
  return a
}

const attrs = ['placeholder', 'aria-label', 'title', 'alt', 'label']
let files = 0

for (const f of walk('src')) {
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  for (const attr of attrs) {
    // placeholder=t('key')  -> :placeholder="t('key')"
    // SelectValue placeholder=t('key') -> :placeholder="t('key')"
    const re = new RegExp(`\\b${attr}=t\\((['"])([^'"\\)]+)\\1\\)`, 'g')
    s = s.replace(re, `:${attr}="t($1$2$1)"`)
  }
  if (s !== before) {
    fs.writeFileSync(f, s)
    console.log('fixed attrs', f)
    files++
  }
}
console.log('done', files)
