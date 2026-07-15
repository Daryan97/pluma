import fs from 'fs'

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'))

function load(code) {
  try {
    return JSON.parse(fs.readFileSync(`src/locales/${code}.json`, 'utf8'))
  } catch {
    return {}
  }
}

function isObj(v) {
  return v && typeof v === 'object' && !Array.isArray(v)
}

function mergeStructure(enNode, locNode) {
  if (!isObj(enNode)) {
    return typeof locNode === 'string' && locNode.trim() ? locNode : enNode
  }
  const out = {}
  for (const k of Object.keys(enNode)) {
    out[k] = mergeStructure(enNode[k], isObj(locNode) ? locNode[k] : undefined)
  }
  return out
}

function setByPath(obj, path, value) {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (!isObj(cur[parts[i]])) cur[parts[i]] = {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
}

const maps = JSON.parse(fs.readFileSync('scripts/i18n-leaf-maps.json', 'utf8'))

for (const code of ['fr', 'es', 'de', 'ar']) {
  const existing = load(code)
  const out = mergeStructure(en, existing)
  for (const [path, val] of Object.entries(maps[code] || {})) {
    setByPath(out, path, val)
  }
  fs.writeFileSync(`src/locales/${code}.json`, JSON.stringify(out, null, 2) + '\n')
  console.log('wrote', code)
}
