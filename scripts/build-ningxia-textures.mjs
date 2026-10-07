/**
 * 宁夏 3D 大屏贴图构建（技术验证，一次性脚本）
 * - 卫星底图：高德卫星瓦片（GCJ-02，与 DataV 边界一致）
 * - 真实高程：AWS Terrarium 瓦片（RGB 编码海拔）→ 置换图
 * - 法线图：高程经平滑后 Sobel 推导
 * - 行政区遮罩：轮廓外像素透明
 */
import { readFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const sharp = require('sharp')
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'src', 'assets', 'textures')
mkdirSync(OUT_DIR, { recursive: true })

const Z = 9
const TILE = 256
const N = 2 ** Z

const geo = JSON.parse(
  readFileSync(join(ROOT, 'src', 'assets', 'ningxia-outline.json'), 'utf8')
)

// ---- 收集全部坐标与外环 ----
const rings = []
let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity
const feature = geo.features[0]
const polys =
  feature.geometry.type === 'MultiPolygon'
    ? feature.geometry.coordinates
    : [feature.geometry.coordinates]
for (const polygon of polys) {
  polygon.forEach((ring, i) => {
    if (i === 0) rings.push(ring)
    for (const [lng, lat] of ring) {
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
    }
  })
}

// ---- 瓦片数学 ----
const lngToPx = (lng) => ((lng + 180) / 360) * N * TILE
const latToPx = (lat) => {
  const r = (lat * Math.PI) / 180
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * N * TILE
}
const lngToTx = (lng) => Math.floor(lngToPx(lng) / TILE)
const latToTy = (lat) => Math.floor(latToPx(lat) / TILE)

const minTx = lngToTx(minLng), maxTx = lngToTx(maxLng)
const minTy = latToTy(maxLat), maxTy = latToTy(minLat)
const cols = maxTx - minTx + 1
const rows = maxTy - minTy + 1
console.log(`bbox: [${minLng.toFixed(3)}, ${minLat.toFixed(3)}, ${maxLng.toFixed(3)}, ${maxLat.toFixed(3)}]`)
console.log(`z${Z} 瓦片网格: ${cols}列 x ${rows}行 = ${cols * rows} 块`)

const crop = {
  left: Math.round(lngToPx(minLng) - minTx * TILE),
  top: Math.round(latToPx(maxLat) - minTy * TILE),
  width: Math.round(lngToPx(maxLng) - lngToPx(minLng)),
  height: Math.round(latToPx(minLat) - latToPx(maxLat))
}
console.log('裁剪区:', crop)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function fetchTile(url, headers, label, attempt = 1) {
  try {
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 200) throw new Error('内容过小')
    return buf
  } catch (e) {
    if (attempt >= 4) throw new Error(`${label} 失败: ${e.message}`)
    await sleep(400 * attempt)
    return fetchTile(url, headers, label, attempt + 1)
  }
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

async function buildLayer(urlFn, headers, name) {
  const tasks = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tx = minTx + x, ty = minTy + y
      tasks.push(
        fetchTile(urlFn(tx, ty), headers, `${name} ${tx}/${ty}`).then((buf) => ({
          input: buf,
          left: x * TILE,
          top: y * TILE
        }))
      )
    }
  }
  // 分批控制并发
  const layers = []
  for (let i = 0; i < tasks.length; i += 8) {
    layers.push(...(await Promise.all(tasks.slice(i, i + 8))))
    process.stdout.write(`\r${name}: ${Math.min(i + 8, tasks.length)}/${tasks.length}`)
  }
  process.stdout.write('\n')

  const canvas = sharp({
    create: {
      width: cols * TILE,
      height: rows * TILE,
      channels: 3,
      background: '#000000'
    }
  }).composite(layers)

  return canvas.extract(crop).removeAlpha().png().toBuffer()
}

console.log('下载卫星瓦片…')
const satBuf = await buildLayer(
  (x, y) => `https://webst01.is.autonavi.com/appmaptile?style=6&x=${x}&y=${y}&z=${Z}`,
  { 'User-Agent': UA, Referer: 'https://www.amap.com/' },
  'sat'
)

console.log('下载高程瓦片…')
const demBuf = await buildLayer(
  (x, y) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${x}/${y}.png`,
  {},
  'dem'
)

// ---- Terrarium 解码海拔 ----
const demRaw = await sharp(demBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = demRaw.info
const elev = new Float32Array(W * H)
let eMin = Infinity, eMax = -Infinity
for (let i = 0; i < W * H; i++) {
  const r = demRaw.data[i * C]
  const g = demRaw.data[i * C + 1]
  const b = demRaw.data[i * C + 2]
  const e = r * 256 + g + b / 256 - 32768
  elev[i] = e
  if (e > -500) {
    eMin = Math.min(eMin, e)
    eMax = Math.max(eMax, e)
  }
}
console.log(`海拔范围: ${eMin.toFixed(0)}m ~ ${eMax.toFixed(0)}m`)

// ---- 置换图：海拔归一化为 0-255 ----
const dispGray = Buffer.alloc(W * H)
for (let i = 0; i < W * H; i++) {
  const t = Math.max(0, Math.min(1, (elev[i] - eMin) / (eMax - eMin)))
  dispGray[i] = Math.round(t * 255)
}
const dispPng = await sharp(dispGray, { raw: { width: W, height: H, channels: 1 } })
  .blur(1.2)
  .jpeg({ quality: 90 })
  .toBuffer()

// ---- 法线图：先对高度做盒式平滑，再 Sobel ----
const smooth = (arr, radius) => {
  const out = new Float32Array(arr.length)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0, n = 0
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const xx = x + dx, yy = y + dy
          if (xx >= 0 && xx < W && yy >= 0 && yy < H) {
            sum += arr[yy * W + xx]
            n++
          }
        }
      }
      out[y * W + x] = sum / n
    }
  }
  return out
}
const hS = smooth(elev, 2)
const STRENGTH = 220 // 法线锐度（米/采样）
const normalBuf = Buffer.alloc(W * H * 3)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const xl = hS[y * W + Math.max(0, x - 1)]
    const xr = hS[y * W + Math.min(W - 1, x + 1)]
    const yu = hS[Math.max(0, y - 1) * W + x]
    const yd = hS[Math.min(H - 1, y + 1) * W + x]
    const dx = (xr - xl) / 2
    const dy = (yd - yu) / 2
    let nx = -dx / STRENGTH
    let ny = -dy / STRENGTH
    let nz = 1
    const len = Math.hypot(nx, ny, nz)
    nx /= len; ny /= len; nz /= len
    const i = (y * W + x) * 3
    normalBuf[i] = Math.round((nx * 0.5 + 0.5) * 255)
    normalBuf[i + 1] = Math.round((ny * 0.5 + 0.5) * 255)
    normalBuf[i + 2] = Math.round((nz * 0.5 + 0.5) * 255)
  }
}
const normalJpg = await sharp(normalBuf, { raw: { width: W, height: H, channels: 3 } })
  .jpeg({ quality: 90 })
  .toBuffer()

// ---- 轮廓遮罩（SVG → alpha） ----
const toLocalPx = (lng, lat) => {
  const px = lngToPx(lng) - minTx * TILE - crop.left
  const py = latToPx(lat) - minTy * TILE - crop.top
  return `${px.toFixed(1)},${py.toFixed(1)}`
}
const polysPath = rings
  .map((ring) => `M${ring.map((c) => toLocalPx(c[0], c[1])).join(' L')} Z`)
  .join(' ')
const maskSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
     <rect width="${W}" height="${H}" fill="#000"/>
     <path d="${polysPath}" fill="#fff"/>
   </svg>`
)
const maskPng = await sharp(maskSvg).extractChannel('red').png().toBuffer()

const satMasked = await sharp(satBuf)
  .ensureAlpha()
  .joinChannel(maskPng, { applyAlpha: true })
  .webp({ quality: 82, alphaQuality: 95 })
  .toBuffer()

// ---- 输出 ----
const write = (buf, name) => {
  const { writeFileSync } = require('node:fs')
  writeFileSync(join(OUT_DIR, name), buf)
  console.log(`输出 ${name}: ${(buf.length / 1024).toFixed(0)} KB`)
}
await write(satMasked, 'nx_sat.webp')
await write(dispPng, 'nx_disp.jpg')
await write(normalJpg, 'nx_normal.jpg')
console.log(`纹理尺寸: ${W} x ${H}`)
console.log('完成。')
