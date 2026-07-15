import fs from 'fs'
import zlib from 'zlib'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(__dirname, '..', 'src', 'public')

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function rgbaPng(w, h, paint) {
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) {
    const row = y * (w * 4 + 1)
    raw[row] = 0
    for (let x = 0; x < w; x++) {
      const i = row + 1 + x * 4
      const [r, g, b, a] = paint(x, y, w, h)
      raw[i] = r
      raw[i + 1] = g
      raw[i + 2] = b
      raw[i + 3] = a
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** Default Open Graph image when branding has no logo/cover (not a favicon). */
function ogDefault() {
  return rgbaPng(1200, 630, (x, y, w, h) => {
    const t = x / w
    const r = Math.round(37 + t * 40)
    const g = Math.round(99 + t * 20)
    const b = Math.round(235 - t * 40)
    const dx = x - w / 2
    const dy = y - h / 2
    if (dx * dx + dy * dy < 90 * 90) return [255, 255, 255, 255]
    return [r, g, b, 255]
  })
}

fs.mkdirSync(dir, { recursive: true })
// Favicon is admin-uploaded via branding — do not ship a static favicon.
for (const name of ['favicon.png', 'favicon.svg', 'apple-touch-icon.png']) {
  const p = path.join(dir, name)
  if (fs.existsSync(p)) fs.unlinkSync(p)
}
fs.writeFileSync(path.join(dir, 'og-default.png'), ogDefault())
console.log('SEO assets written to', dir, fs.readdirSync(dir))
