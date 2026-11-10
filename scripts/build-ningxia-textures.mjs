/**
 * 宁夏 3D 大屏贴图构建
 * - 卫星底图：高德卫星瓦片（GCJ-02，与 DataV 边界一致）
 * - 真实高程：AWS Terrarium 瓦片（RGB 编码海拔）→ 置换图
 * - 法线图：高程经平滑后 Sobel 推导（向量空间重采样 + 归一化）
 * - 行政区遮罩：轮廓外像素透明
 *
 * 第六批：瓦片拼接仍是 Web Mercator 像素网格，但**输出统一重采样到线性纬度
 * 规则网格**（行=纬度、列=经度），与 Screen.vue 的 UV / DEM 采样一致；
 * 四张纹理共用同一目标网格，并输出 build-manifest.json（含 SHA256）。
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, relative, isAbsolute, sep } from 'node:path'

const require = createRequire(import.meta.url)
const sharp = require('sharp')
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const ASSET_DIR = join(ROOT, 'src', 'assets')

// ---- 输出目录：--out <dir> 时隔离到独立目录；缺省仍写正式资产目录 ----
function resolveOutDir() {
  const i = process.argv.indexOf('--out')
  if (i === -1) return { dir: join(ASSET_DIR, 'textures'), isolated: false }
  const value = process.argv[i + 1]
  if (!value || value.startsWith('-')) {
    throw new Error('--out 缺少有效目录参数，已中止（不会回退到正式输出目录）')
  }
  const dir = resolve(ROOT, value)
  const rel = relative(ROOT, dir)
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) {
    throw new Error(`--out 目录必须是项目内子目录且不能是项目根目录: ${dir}`)
  }
  const first = rel.split(sep)[0]
  if (['src', 'public', 'node_modules', 'dist'].includes(first)) {
    throw new Error(`--out 禁止指向 ${first}/（正式资产区），请改用独立验证目录: ${rel}`)
  }
  return { dir, isolated: true }
}
const { dir: OUT_DIR, isolated: OUT_ISOLATED } = resolveOutDir()
const CITIES_OUT = OUT_ISOLATED ? OUT_DIR : ASSET_DIR
mkdirSync(OUT_DIR, { recursive: true })
console.log(`输出目录: ${OUT_DIR}${OUT_ISOLATED ? '（隔离验证模式）' : ''}`)

// ---- 离线晕渲（Hillshade）派生：只读 DEM，不改变原始高程与地理配准 ----
// 光照方向固定为西北（方位角 315°，高度角 45°），与场景主光一致；
// 输出 8-bit 灰度 PNG，值域压到 [0.62, 1.0]，避免山体阴影被压死。
const HILLSHADE = {
  azimuthDeg: 315,
  altitudeDeg: 45,
  // 平地（法线朝上）对应的灰度：1.0 表示平原完全不被压暗，只在背光坡产生阴影
  neutral: 1.0,
  gain: 1.35, // 以平地为中枢的对比增益（受光坡截断在 1.0，只保留阴影层次）
  min: 0.62, // 阴影下限，避免山体暗部被压死
  // 真实坡度在 242m 像元下过于平缓（贺兰山平均坡仅 ~10°），按场景位移的垂直夸张
  //（约 6.3×）的一半放大：既能凸显山脊沟谷，又不把平原微起伏放大成斑块
  zFactor: 3.2
}
function computeHillshade(elevArr, width, height, cellX, cellY) {
  const az = (HILLSHADE.azimuthDeg * Math.PI) / 180
  const alt = (HILLSHADE.altitudeDeg * Math.PI) / 180
  // 光向量（指向光源）：x=东、y=北、z=上
  const lx = Math.sin(az) * Math.cos(alt)
  const ly = Math.cos(az) * Math.cos(alt)
  const lz = Math.sin(alt)
  const out = Buffer.alloc(width * height, 255)
  const at = (x, y) => elevArr[Math.min(height - 1, Math.max(0, y)) * width + Math.min(width - 1, Math.max(0, x))]
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Horn 3×3：行号向南增大，故"北"方向取 (上一行 − 下一行)
      const z1 = at(x - 1, y - 1), z2 = at(x, y - 1), z3 = at(x + 1, y - 1)
      const z4 = at(x - 1, y), z6 = at(x + 1, y)
      const z7 = at(x - 1, y + 1), z8 = at(x, y + 1), z9 = at(x + 1, y + 1)
      const gx = ((z3 + 2 * z6 + z9) - (z1 + 2 * z4 + z7)) / (8 * cellX)
      const gyNorth = ((z1 + 2 * z2 + z3) - (z7 + 2 * z8 + z9)) / (8 * cellY)
      let nx = -gx * HILLSHADE.zFactor
      let ny = -gyNorth * HILLSHADE.zFactor
      let nz = 1
      const len = Math.hypot(nx, ny, nz)
      nx /= len; ny /= len; nz /= len
      const shade = Math.max(0, nx * lx + ny * ly + nz * lz)
      // 以平地受光值（法线朝上时的 N·L = sin(altitude)）为中枢做对比展开
      const flat = Math.sin(alt)
      const v = HILLSHADE.neutral + HILLSHADE.gain * (shade - flat)
      out[y * width + x] = Math.round(255 * Math.min(1, Math.max(HILLSHADE.min, v)))
    }
  }
  return out
}

// 仅重建晕渲：node scripts/build-ningxia-textures.mjs --hillshade-only [--out <dir>]
if (process.argv.includes('--hillshade-only')) {
  const { readFileSync: rf } = await import('node:fs')
  const dispPath = join(ASSET_DIR, 'textures', 'nx_disp.jpg')
  const satPath = join(ASSET_DIR, 'textures', 'nx_sat.webp')
  const dispRaw = await sharp(rf(dispPath)).raw().toBuffer({ resolveWithObject: true })
  const satRaw = await sharp(rf(satPath)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = dispRaw.info
  const dC = dispRaw.info.channels
  const sC = satRaw.info.channels
  // 与主构建一致的高程还原：952–3493 m 归一化；单像元约 242 m
  const E_MIN = 952
  const E_MAX = 3493
  const elevArr = new Float32Array(W * H)
  for (let i = 0; i < W * H; i++) {
    elevArr[i] = E_MIN + (dispRaw.data[i * dC] / 255) * (E_MAX - E_MIN)
  }
  const hs = computeHillshade(elevArr, W, H, 242, 242)
  // 轮廓外保持中性白（乘性叠加时等同于不着色）
  for (let i = 0; i < W * H; i++) {
    if (satRaw.data[i * sC + 3] < 128) hs[i] = 255
  }
  const png = await sharp(hs, { raw: { width: W, height: H, channels: 1 } })
    .blur(0.6)
    .png({ compressionLevel: 9 })
    .toBuffer()
  const { writeFileSync } = await import('node:fs')
  writeFileSync(join(OUT_DIR, 'nx_hillshade.png'), png)
  console.log(`输出 nx_hillshade.png: ${(png.length / 1024).toFixed(0)} KB (${W}x${H})`)
  process.exit(0)
}

const Z = 9
const TILE = 256
const N = 2 ** Z

const geo = JSON.parse(
  readFileSync(join(ROOT, 'src', 'assets', 'ningxia-outline.json'), 'utf8')
)

// ---- 地级市边界（--cities-only 时仅生成此项） ----
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

const CITIES = [
  { name: '银川市', adcode: 640100 },
  { name: '石嘴山市', adcode: 640200 },
  { name: '吴忠市', adcode: 640300 },
  { name: '固原市', adcode: 640400 },
  { name: '中卫市', adcode: 640500 }
]

async function buildCities() {
  const out = []
  for (const c of CITIES) {
    const res = await fetch(
      `https://geo.datav.aliyun.com/areas_v3/bound/${c.adcode}.json`,
      { headers: { 'User-Agent': UA } }
    )
    if (!res.ok) throw new Error(`${c.name} HTTP ${res.status}`)
    const gj = JSON.parse(await res.text())
    const f = gj.features[0]
    out.push({
      name: c.name,
      adcode: c.adcode,
      center: f.properties.center,
      geometry: f.geometry
    })
    console.log(`  ${c.name}: ${f.geometry.type}`)
  }
  writeFileSync(
    join(CITIES_OUT, 'ningxia-cities.json'),
    JSON.stringify({ cities: out })
  )
  console.log(`输出 ${join(CITIES_OUT, 'ningxia-cities.json')}（${CITIES.length} 市）`)
}

if (process.argv.includes('--cities-only')) {
  console.log('仅生成地级市边界…')
  await buildCities()
  process.exit(0)
}

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

  // 先完成拼接并实例化为无损 PNG，再对"拼接结果"单独裁剪。
  // 原写法 composite().extract() 在同一链上时，extract 会先作用于底板，
  // 拼接仍从 (0,0) 贴瓦片，导致 crop.left/top 失效（等价于从 (0,0) 裁剪）。
  const mosaicBuf = await sharp({
    create: {
      width: cols * TILE,
      height: rows * TILE,
      channels: 3,
      background: '#000000'
    }
  })
    .composite(layers)
    .png()
    .toBuffer()

  const outBuf = await sharp(mosaicBuf).extract(crop).removeAlpha().png().toBuffer()
  cropChecks[name] = await verifyCropApplied(mosaicBuf, outBuf, name)
  console.log(`  ${name} 裁剪自检:`, JSON.stringify(cropChecks[name]))
  return outBuf
}

// ---- 裁剪自检：区域级比对，防止裁剪原点再次失效 ----
const CHECK_SIZE = 128
const cropChecks = {}
async function verifyCropApplied(mosaicBuf, outBuf, label) {
  const meta = await sharp(outBuf).metadata()
  if (meta.width !== crop.width || meta.height !== crop.height) {
    throw new Error(
      `[${label}] 输出尺寸 ${meta.width}x${meta.height} 与 crop ${crop.width}x${crop.height} 不符`
    )
  }
  const grab = (buf, left, top) =>
    sharp(buf)
      .extract({ left, top, width: CHECK_SIZE, height: CHECK_SIZE })
      .removeAlpha()
      .raw()
      .toBuffer()
  const [outTL, mosaicCropTL, mosaicZeroTL] = await Promise.all([
    grab(outBuf, 0, 0),
    grab(mosaicBuf, crop.left, crop.top),
    grab(mosaicBuf, 0, 0)
  ])
  if (!outTL.equals(mosaicCropTL)) {
    throw new Error(
      `[${label}] 裁剪未生效：输出左上 ${CHECK_SIZE}×${CHECK_SIZE} 与拼接图 (${crop.left},${crop.top}) 区域不一致`
    )
  }
  let diffPixels = 0
  let sumDiff = 0
  for (let i = 0; i < outTL.length; i++) {
    const d = Math.abs(outTL[i] - mosaicZeroTL[i])
    sumDiff += d
    if (d > 0) diffPixels++
  }
  const diffFraction = diffPixels / outTL.length
  const meanAbsDiff = sumDiff / outTL.length
  if (diffFraction < 0.1 || meanAbsDiff < 1) {
    throw new Error(
      `[${label}] 自检不足：输出左上区域与拼接图 (0,0) 差异过小（差异像素占比 ${(diffFraction * 100).toFixed(1)}%，平均差 ${meanAbsDiff.toFixed(2)}），疑似仍为 (0,0) 裁剪`
    )
  }
  return {
    outputSize: [meta.width, meta.height],
    checkRegion: [CHECK_SIZE, CHECK_SIZE],
    identicalToCropOrigin: true,
    diffPixelFractionVsZero: +diffFraction.toFixed(4),
    meanAbsDiffVsZero: +meanAbsDiff.toFixed(2)
  }
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

if (OUT_ISOLATED) {
  writeFileSync(
    join(OUT_DIR, 'crop-check.json'),
    JSON.stringify(
      {
        isolated: true,
        bbox: { minLng, minLat, maxLng, maxLat },
        grid: { minTx, maxTx, minTy, maxTy, cols, rows },
        crop,
        checks: cropChecks
      },
      null,
      2
    )
  )
}

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

// ================== 统一目标网格：线性纬度规则网格 ==================
// 源为 Web Mercator 裁剪（行随纬度非线性），目标为"行=纬度、列=经度"，
// 与 Screen.vue 的 PlaneGeometry UV 与 loadDispSampler() 完全一致。
// 经纬度 → 目标行列：row = (1-(lat-minLat)/Δlat)*(H-1)，col = (lng-minLng)/Δlng*(W-1)
// 目标行列 → 源像素：srcY = latToPx(lat) - originY，srcX = lngToPx(lng) - originX
const originX = minTx * TILE + crop.left
const originY = minTy * TILE + crop.top
const srcXOf = (c) => lngToPx(minLng + (c / (W - 1)) * (maxLng - minLng)) - originX
const srcYOf = (r) => latToPx(maxLat - (r / (H - 1)) * (maxLat - minLat)) - originY

// N 通道 8-bit 双线性重采样
function resampleChannels(src, C, sxFn, syFn) {
  const out = new Uint8Array(W * H * C)
  for (let r = 0; r < H; r++) {
    const sy = Math.min(H - 1, Math.max(0, syFn(r)))
    const y0 = Math.floor(sy), y1 = Math.min(H - 1, y0 + 1), fy = sy - y0
    for (let c = 0; c < W; c++) {
      const sx = Math.min(W - 1, Math.max(0, sxFn(c)))
      const x0 = Math.floor(sx), x1 = Math.min(W - 1, x0 + 1), fx = sx - x0
      const o = (r * W + c) * C
      const i00 = (y0 * W + x0) * C, i10 = (y0 * W + x1) * C
      const i01 = (y1 * W + x0) * C, i11 = (y1 * W + x1) * C
      for (let k = 0; k < C; k++) {
        out[o + k] = Math.round(
          src[i00 + k] * (1 - fx) * (1 - fy) + src[i10 + k] * fx * (1 - fy) +
          src[i01 + k] * (1 - fx) * fy + src[i11 + k] * fx * fy
        )
      }
    }
  }
  return out
}

// 单通道 Float32 双线性重采样（高程，保持米单位）
function resampleFloat(src, sxFn, syFn) {
  const out = new Float32Array(W * H)
  for (let r = 0; r < H; r++) {
    const sy = Math.min(H - 1, Math.max(0, syFn(r)))
    const y0 = Math.floor(sy), y1 = Math.min(H - 1, y0 + 1), fy = sy - y0
    for (let c = 0; c < W; c++) {
      const sx = Math.min(W - 1, Math.max(0, sxFn(c)))
      const x0 = Math.floor(sx), x1 = Math.min(W - 1, x0 + 1), fx = sx - x0
      out[r * W + c] =
        src[y0 * W + x0] * (1 - fx) * (1 - fy) + src[y0 * W + x1] * fx * (1 - fy) +
        src[y1 * W + x0] * (1 - fx) * fy + src[y1 * W + x1] * fx * fy
    }
  }
  return out
}

// 法线：解码到向量空间 → 双线性 → 归一化 → 按原 RGB 编码写回
function resampleNormal(src) {
  const out = new Uint8Array(W * H * 3)
  const gather = (x, y, k) => src[(y * W + x) * 3 + k] / 127.5 - 1
  for (let r = 0; r < H; r++) {
    const sy = Math.min(H - 1, Math.max(0, srcYOf(r)))
    const y0 = Math.floor(sy), y1 = Math.min(H - 1, y0 + 1), fy = sy - y0
    for (let c = 0; c < W; c++) {
      const sx = Math.min(W - 1, Math.max(0, srcXOf(c)))
      const x0 = Math.floor(sx), x1 = Math.min(W - 1, x0 + 1), fx = sx - x0
      const comp = [0, 0, 0]
      for (let k = 0; k < 3; k++) {
        comp[k] =
          gather(x0, y0, k) * (1 - fx) * (1 - fy) + gather(x1, y0, k) * fx * (1 - fy) +
          gather(x0, y1, k) * (1 - fx) * fy + gather(x1, y1, k) * fx * fy
      }
      let [nx, ny, nz] = comp
      const len = Math.hypot(nx, ny, nz)
      if (len < 1e-6) { nx = 0; ny = 0; nz = 1 } else { nx /= len; ny /= len; nz /= len }
      const o = (r * W + c) * 3
      out[o] = Math.round((nx * 0.5 + 0.5) * 255)
      out[o + 1] = Math.round((ny * 0.5 + 0.5) * 255)
      out[o + 2] = Math.round((nz * 0.5 + 0.5) * 255)
    }
  }
  return out
}

const satSrc = await sharp(satBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
if (satSrc.info.width !== W || satSrc.info.height !== H) {
  throw new Error(`卫星裁剪尺寸 ${satSrc.info.width}x${satSrc.info.height} 与 DEM ${W}x${H} 不一致`)
}
const satT = resampleChannels(satSrc.data, 4, srcXOf, srcYOf)
const elevT = resampleFloat(elev, srcXOf, srcYOf)
console.log(`已重采样到线性纬度目标网格: ${W}x${H}`)

// ---- 置换图：海拔归一化为 0-255 ----
const dispGray = Buffer.alloc(W * H)
for (let i = 0; i < W * H; i++) {
  const t = Math.max(0, Math.min(1, (elevT[i] - eMin) / (eMax - eMin)))
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
// 法线在向量空间重采样到目标网格（解码 → 双线性 → 归一化 → 编码），
// 保持既有 G 方向约定，不在此处做任何翻转。
const normalT = resampleNormal(normalBuf)
const normalJpg = await sharp(normalT, { raw: { width: W, height: H, channels: 3 } })
  .jpeg({ quality: 90 })
  .toBuffer()

// ---- 轮廓遮罩（SVG → alpha）：按目标网格（线性纬度）栅格化 ----
const toLocalPx = (lng, lat) => {
  const px = ((lng - minLng) / (maxLng - minLng)) * (W - 1)
  const py = (1 - (lat - minLat) / (maxLat - minLat)) * (H - 1)
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
const maskRaw = await sharp(maskPng).raw().toBuffer({ resolveWithObject: true })

// 显式写入 alpha：raw RGBA 输入上 joinChannel 会追加通道而不是替换 alpha，故直接合成
const satRGBA = Buffer.from(satT)
for (let i = 0; i < W * H; i++) satRGBA[i * 4 + 3] = maskRaw.data[i * maskRaw.info.channels]
const satMasked = await sharp(satRGBA, { raw: { width: W, height: H, channels: 4 } })
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

// ---- 离线晕渲：基于**重采样后的最终 DEM** 重新计算（不是把旧晕渲当图片重采样）----
const cellXM = ((maxLng - minLng) * 111320 * Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180)) / W
const cellYM = ((maxLat - minLat) * 110574) / H
const hsBuf = computeHillshade(elevT, W, H, cellXM, cellYM)
for (let i = 0; i < W * H; i++) {
  if (maskRaw.data[i * maskRaw.info.channels] < 128) hsBuf[i] = 255
}
const hillshadePng = await sharp(hsBuf, { raw: { width: W, height: H, channels: 1 } })
  .blur(0.6)
  .png({ compressionLevel: 9 })
  .toBuffer()
await write(hillshadePng, 'nx_hillshade.png')
console.log(`晕渲像元: ${cellXM.toFixed(1)}m × ${cellYM.toFixed(1)}m`)
console.log(`纹理尺寸: ${W} x ${H}`)

// ---- 构建清单：记录目标网格、参数与四张纹理哈希，供自动质量验收与追溯 ----
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex')
const manifest = {
  generatedAt: new Date().toISOString(),
  source: {
    satellite: '高德 XYZ 卫星瓦片（Web Mercator / EPSG:3857），z=9',
    dem: 'AWS elevation-tiles-prod terrarium（Web Mercator），z=9',
    outline: 'src/assets/ningxia-outline.json',
    bbox: { minLng, minLat, maxLng, maxLat },
    tileGrid: { minTx, maxTx, minTy, maxTy, cols, rows },
    crop
  },
  targetGrid: {
    width: W,
    height: H,
    row: '纬度线性：row=(1-(lat-minLat)/Δlat)*(H-1)',
    col: '经度线性：col=(lng-minLng)/Δlng*(W-1)',
    uv: 'v=1 对应北边界（与 Screen.vue PlaneGeometry + flipY 约定一致）',
    sameGridForAllTextures: true
  },
  dem: {
    encoding: 'terrarium: R*256 + G + B/256 - 32768',
    minMeters: Math.round(eMin),
    maxMeters: Math.round(eMax),
    unit: 'm',
    cellMeters: { x: +cellXM.toFixed(1), y: +cellYM.toFixed(1) }
  },
  normal: {
    encoding: 'RGB: c/255*2-1，重采样后按分量归一化',
    resample: 'vector-space bilinear + normalize（保持既有 G 方向）'
  },
  hillshade: { ...HILLSHADE, cellMeters: { x: +cellXM.toFixed(1), y: +cellYM.toFixed(1) }, blur: 0.6 },
  files: {
    'nx_sat.webp': { bytes: satMasked.length, sha256: sha256(satMasked) },
    'nx_disp.jpg': { bytes: dispPng.length, sha256: sha256(dispPng) },
    'nx_normal.jpg': { bytes: normalJpg.length, sha256: sha256(normalJpg) },
    'nx_hillshade.png': { bytes: hillshadePng.length, sha256: sha256(hillshadePng) }
  }
}
writeFileSync(join(OUT_DIR, 'build-manifest.json'), JSON.stringify(manifest, null, 2))
console.log('输出 build-manifest.json')

// 隔离构建时额外导出重采样后的浮点 DEM，供质量脚本精确复算 Hillshade / 法线
if (OUT_ISOLATED) {
  writeFileSync(join(OUT_DIR, 'dem-float32.bin'), Buffer.from(elevT.buffer, elevT.byteOffset, elevT.byteLength))
  console.log('输出 dem-float32.bin（仅隔离构建）')
}

console.log('生成地级市边界…')
await buildCities()
console.log('完成。')
