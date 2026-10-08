<template>
  <div class="screen-page">
    <!-- ============ 标题栏 ============ -->
    <header class="screen-header">
      <router-link to="/" class="back-btn">
        <span class="back-ico">‹</span>
        <span class="back-text">返回主站</span>
      </router-link>

      <div class="title-group">
        <div class="title-decor left"></div>
        <h1 class="screen-title">宁夏丝路非遗 · 三维数据大屏</h1>
        <div class="title-decor right"></div>
      </div>

      <div class="header-right">
        <span class="clock">{{ clockText }}</span>
        <button class="panel-toggle" @click="mobilePanel = !mobilePanel">
          {{ mobilePanel ? '收起数据' : '查看数据' }}
        </button>
      </div>
    </header>

    <!-- ============ 主体三栏 ============ -->
    <div class="screen-body">
      <!-- 左栏 -->
      <aside class="panel panel-left" :class="{ 'panel-open': mobilePanel }">
        <div class="stat-grid">
          <div class="stat-item">
            <span class="stat-num">{{ stats.total }}</span>
            <span class="stat-label">非遗项目</span>
          </div>
          <div class="stat-item is-gold">
            <span class="stat-num">{{ stats.national }}</span>
            <span class="stat-label">国家级</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ stats.cities }}</span>
            <span class="stat-label">覆盖地市</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ stats.routes }}</span>
            <span class="stat-label">丝路古道</span>
          </div>
        </div>

        <div class="chart-card">
          <h3 class="chart-title"><i class="bar"></i>项目类别分布</h3>
          <div ref="pieRef" class="chart-box pie-box"></div>
        </div>

        <div class="chart-card">
          <h3 class="chart-title"><i class="bar"></i>保护级别构成</h3>
          <div class="level-list">
            <div
              v-for="lv in levelStats"
              :key="lv.name"
              class="level-row"
              :class="{ 'is-active': uiState.level === lv.name }"
              @click="toggleDim('level', lv.name)"
            >
              <span class="level-name">{{ lv.name }}</span>
              <div class="level-track">
                <div class="level-fill" :style="{ width: (lv.value / levelTotal * 100) + '%' }"></div>
              </div>
              <span class="level-val">{{ lv.value }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 中央 3D -->
      <main class="stage">
        <div ref="containerRef" class="canvas-container"></div>

        <!-- 悬停地级市：玻璃信息卡（跟随鼠标） -->
        <div
          v-if="hoverCardData"
          class="hover-card"
          :style="{ transform: `translate3d(${hoverCardPos.x + 16}px, ${hoverCardPos.y + 16}px, 0)` }"
        >
          <div class="hc-name">{{ hoverCardData.name }}</div>
          <div class="hc-row">
            <span>非遗项目</span><b>{{ hoverCardData.total }}</b>
          </div>
          <div v-for="lv in hoverCardData.levels" :key="lv.name" class="hc-row">
            <span>{{ lv.name }}</span><b>{{ lv.value }}</b>
          </div>
          <div class="hc-row">
            <span>主要类别</span><b>{{ hoverCardData.topCat }}</b>
          </div>
          <div class="hc-samples">
            <span v-for="s in hoverCardData.samples" :key="s">{{ s }}</span>
          </div>
        </div>

        <div class="filter-bar">
          <button class="reset-btn" @click="resetAll">
            <span class="reset-ico">⟲</span>复位视图
          </button>
          <button class="layer-btn" :class="{ 'is-on': showNeighbors }" @click="toggleNeighbors">
            <span class="reset-ico">◈</span>{{ showNeighbors ? '周边省份' : '仅看宁夏' }}
          </button>
          <button class="layer-btn" :class="{ 'is-on': showTerrain }" @click="toggleTerrain">
            <span class="reset-ico">▲</span>{{ showTerrain ? '隐藏地形' : '分层设色' }}
          </button>
          <transition-group name="chip" tag="div" class="chip-wrap">
            <span
              v-for="chip in activeChips"
              :key="chip.dim"
              class="chip"
              @click="clearDim(chip.dim)"
            >
              {{ chip.label }}<i>×</i>
            </span>
          </transition-group>
        </div>

        <transition name="card">
          <div v-if="selected" class="poi-card">
            <button class="poi-close" @click="selected = null" aria-label="关闭">×</button>
            <div class="poi-tags">
              <span class="poi-level" :class="selected.level === '国家级' ? 'is-national' : 'is-local'">
                {{ selected.level }}
              </span>
              <span class="poi-cat">{{ selected.category }}</span>
            </div>
            <h3 class="poi-name">{{ selected.name }}</h3>
            <p class="poi-meta">{{ selected.city }} · {{ selected.county }}</p>
            <p class="poi-intro">{{ selected.intro }}</p>
            <router-link class="poi-link" :to="`/archive/${selected.id}`">
              查看完整档案<span class="poi-arrow">→</span>
            </router-link>
          </div>
        </transition>

        <div class="stage-legend">
          <span><i class="lg-dot gold"></i>国家级</span>
          <span><i class="lg-dot cyan"></i>自治区级</span>
          <span class="lg-route"><i></i>丝路古道</span>
        </div>
      </main>

      <!-- 右栏 -->
      <aside class="panel panel-right" :class="{ 'panel-open': mobilePanel }">
        <div class="chart-card flex-card">
          <h3 class="chart-title"><i class="bar"></i>五地市项目数量</h3>
          <div ref="cityRef" class="chart-box"></div>
        </div>

        <div class="chart-card flex-card">
          <h3 class="chart-title"><i class="bar"></i>历史源流年代</h3>
          <div ref="periodRef" class="chart-box"></div>
        </div>

        <div class="chart-card flex-card">
          <h3 class="chart-title"><i class="bar"></i>{{ listTitle }}</h3>
          <ul class="top-list">
            <li
              v-for="item in cityItemList"
              :key="item.id"
              :class="{ 'is-active': selected && selected.id === item.id }"
              @click="selected = item"
            >
              <span class="top-index">{{ String(item.id).padStart(2, '0') }}</span>
              <span class="top-name">{{ item.name }}</span>
              <span class="top-city" :class="`lv-${uiState.city ? item.level : ''}`">
                {{ uiState.city ? item.level : item.city }}
              </span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import * as THREE from 'three'
import * as echarts from 'echarts'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import outlineData from '@/assets/ningxia-outline.json'
import citiesGeo from '@/assets/ningxia-cities.json'
import neighborsGeo from '@/data/ningxia-neighbors.geo.json'
import satUrl from '@/assets/textures/nx_sat.webp'
import dispUrl from '@/assets/textures/nx_disp.jpg'
import normalUrl from '@/assets/textures/nx_normal.jpg'
import {
  heritageData,
  categories,
  cities,
  periods,
  silkRoadRoutes
} from '@/data/heritageData.js'

const containerRef = ref(null)
const pieRef = ref(null)
const cityRef = ref(null)
const periodRef = ref(null)
const selected = ref(null)
const mobilePanel = ref(false)
const clockText = ref('')
// 悬停地级市时的信息卡
const hoverCardName = ref('')
const hoverCardPos = reactive({ x: 0, y: 0 })

// 统一联动状态（地图与图表的唯一真相源）
const uiState = reactive({
  city: '',
  route: '',
  category: '',
  level: '',
  period: '',
  itemId: null
})

// ================= 数据统计 =================
const stats = computed(() => ({
  total: heritageData.length,
  national: heritageData.filter((d) => d.level === '国家级').length,
  cities: new Set(heritageData.map((d) => d.city)).size,
  routes: silkRoadRoutes.length
}))

// 当前数据范围：选中地市/古道后仅统计其范围，否则为全量
const scopedData = computed(() => {
  let list = heritageData
  if (uiState.city) list = list.filter((d) => d.city === uiState.city)
  if (uiState.route) list = list.filter((d) => d.routeRelation === uiState.route)
  return list
})

const levelStats = computed(() =>
  ['国家级', '自治区级', '市级', '县级']
    .map((name) => ({ name, value: scopedData.value.filter((d) => d.level === name).length }))
    .filter((d) => d.value > 0)
)

const levelTotal = computed(() => levelStats.value.reduce((s, d) => s + d.value, 0))

// 右栏名录：默认国家级；选中地市或古道时展示对应范围的全部项目
const listTitle = computed(() => {
  if (uiState.route) return `${uiState.route} · 沿线非遗`
  if (uiState.city) return `${uiState.city.replace('市', '')} · 项目名录`
  return '国家级项目名录'
})
const cityItemList = computed(() =>
  uiState.city || uiState.route
    ? scopedData.value
    : heritageData.filter((d) => d.level === '国家级')
)

// 悬停地级市的悬浮信息卡内容
const hoverCardData = computed(() => {
  if (!hoverCardName.value) return null
  const items = heritageData.filter((d) => d.city === hoverCardName.value)
  if (!items.length) return null
  const catCount = {}
  items.forEach((d) => {
    catCount[d.category] = (catCount[d.category] || 0) + 1
  })
  const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]
  return {
    name: hoverCardName.value,
    total: items.length,
    levels: ['国家级', '自治区级', '市级', '县级']
      .map((name) => ({ name, value: items.filter((d) => d.level === name).length }))
      .filter((d) => d.value > 0),
    topCat: topCat ? topCat[0] : '—',
    samples: items.slice(0, 3).map((d) => d.name)
  }
})

// ================= Three.js =================
let renderer = null
let camera = null
let scene = null
let controls = null
let baseGeometry = null
let baseMaterial = null
let terrainGeometry = null
let terrainMaterial = null
const textures = []
let flyGeometry = null
let flyMaterial = null
let flyCurve = null
let flyPointsAll = []
let flyIndex = 0
const FLY_NUM = 50
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
// 流光采样复用的临时向量
const _runnerTmp = new THREE.Vector3()
const hitMeshes = []
const pulseRings = []
const glowHeads = []
const markerEntries = []
const cityEntries = []
// 市域拾取用静态网格（不参与悬停上浮，避免射线反复落空导致闪烁）
const cityPickMeshes = []
const routeEntries = []
// 古道管线的拾取网格（点击聚焦古道，与 GIS 地图的交互一致）
const routeHitMeshes = []
let hoverRouteName = ''
let arcMaterial = null
const arcGeometries = []
let gridFloorGeo = null
let gridFloorMat = null
let dustGeo = null
let dustMat = null
let hoverCityName = ''
let cameraTween = null
let dotSpriteTex = null
// 周边省级行政区参照层（甘肃/内蒙古/陕西）：默认显示，可一键隐藏做对比
const showNeighbors = ref(true)
const neighborObjects = []
const neighborDisposables = []
// 地形分层设色：默认关闭（地形仅显示暗色卫星影像），开启后按海拔高程叠加彩色色层
const showTerrain = ref(false)
let terrainTintMat = null
let reduceMotion = false
let pointerDownAt = null
let onClickHandler = null
let onMoveHandler = null
let onDownHandler = null
let onLeaveHandler = null
let animationId = 0
let resizeHandler = null

const CENTROID = [106.169866, 37.291332]
const SCALE = 22
const CITY_BASE_COLOR = new THREE.Color('#6fc6e8')
const CITY_GOLD_COLOR = new THREE.Color('#ffc857')
// 边界流光：单点脉冲（悬停时仅沿边界跑一个亮点）
const RUNNER_TRAIL = 1

// 周边省份名锚点：均已通过"点在多边形内"验证（确保落在该省界内、宁夏界外、圆盘内）。
// 不能用裁切环的点坐标求平均——环绕宁夏的边界弧求均后形心会落进宁夏，
// 造成"内蒙古压在吴忠旁、甘肃压在固原上"的错位。
const NEIGHBOR_ANCHORS = {
  内蒙古自治区: [105.973, 40.509],
  陕西省: [108.631, 35.823],
  甘肃省: [103.863, 35.521]
}
const project = ([lng, lat]) => {
  // x 取反：three.js 相机在南侧向北看时东西会镜像，翻转投影保证左西右东
  const x = -(lng - CENTROID[0]) * SCALE
  const y = (lat - CENTROID[1]) * SCALE * Math.cos((CENTROID[1] * Math.PI) / 180)
  return [x, y]
}

// ---- 周边省级行政区参照层的裁剪（Sutherland–Hodgman，凸多边形裁切）----
// 只保留贴近宁夏的一段，避免内蒙/甘肃向外延伸数千公里把大屏撑满
const stripClosing = (ring) => {
  if (ring.length > 1) {
    const f = ring[0]
    const l = ring[ring.length - 1]
    if (Math.abs(f[0] - l[0]) < 1e-6 && Math.abs(f[1] - l[1]) < 1e-6) return ring.slice(0, -1)
  }
  return ring
}
// 以宁夏中心为圆心的凸多边形（近似圆盘），避免出现生硬的矩形裁切边
const makeClipDisc = (cx, cy, radiusLng, cosLat, seg = 64) => {
  const poly = []
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2
    poly.push([cx + radiusLng * Math.cos(a), cy + (radiusLng / cosLat) * Math.sin(a)])
  }
  return poly
}
// 返回 { pts, orig }：orig 标记该点是否来自原始省界（裁切交点则为 false），
// 便于绘制边界时剔除裁切产生的直边/弧边
function clipRingToPoly(ring, poly) {
  let out = stripClosing(ring).map((p) => ({ p, orig: true }))
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % poly.length]
    const ex = b[0] - a[0]
    const ey = b[1] - a[1]
    const side = (q) => ex * (q[1] - a[1]) - ey * (q[0] - a[0])
    const inter = (p, q) => {
      const dp = side(p)
      const dq = side(q)
      const t = dp / (dp - dq)
      return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
    }
    const input = out
    out = []
    for (let k = 0; k < input.length; k++) {
      const cur = input[k]
      const prev = input[(k + input.length - 1) % input.length]
      const curIn = side(cur.p) >= 0
      const prevIn = side(prev.p) >= 0
      if (curIn) {
        if (!prevIn) out.push({ p: inter(prev.p, cur.p), orig: false })
        out.push(cur)
      } else if (prevIn) {
        out.push({ p: inter(prev.p, cur.p), orig: false })
      }
    }
    if (!out.length) return { pts: [], orig: [] }
  }
  return {
    pts: out.map((o) => o.p),
    orig: out.map((o) => o.orig)
  }
}

// 收起悬停信息卡：选中地市或非遗点位后立刻清掉，
// 否则卡片会压在跟随相机居中的市名标签上（吴忠/银川/石嘴山的"市名显示不全"即由此而来）
function clearHoverCard() {
  hoverCityName = ''
  hoverCardName.value = ''
}

// 按等弧长在闭合外环上取点（t 为 0~1 的整圈进度），保证流光匀速
function sampleRing(entry, t, out) {
  const { ringPts, ringCum, ringLen } = entry
  let target = t % 1
  if (target < 0) target += 1
  target *= ringLen
  let lo = 0
  let hi = ringCum.length - 1
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1
    if (ringCum[mid] <= target) lo = mid
    else hi = mid
  }
  const segLen = ringCum[hi] - ringCum[lo] || 1
  const f = Math.min(1, Math.max(0, (target - ringCum[lo]) / segLen))
  return out.copy(ringPts[lo]).lerp(ringPts[hi], f)
}

onMounted(() => {
  const container = containerRef.value
  const width = container.clientWidth
  const height = container.clientHeight

  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  scene = new THREE.Scene()
  scene.background = new THREE.Color('#1d1510')
  scene.fog = new THREE.Fog('#1d1510', 240, 480)

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
  // 相机置于南侧向北 45° 俯视 → 画面上北下南、左西右东
  camera.position.set(0, 114, -114)
  camera.lookAt(0, 2, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  const shapes = []
  const rings = []
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity
  const feature = outlineData.features[0]
  const polygons =
    feature.geometry.type === 'MultiPolygon'
      ? feature.geometry.coordinates
      : [feature.geometry.coordinates]

  polygons.forEach((polygon) => {
    polygon.forEach((ring, ringIndex) => {
      if (ringIndex === 0) rings.push(ring)
      const shape = new THREE.Shape()
      ring.forEach((coord, i) => {
        const [x, y] = project(coord)
        if (ringIndex === 0) {
          if (i === 0) shape.moveTo(x, -y)
          else shape.lineTo(x, -y)
        }
        minLng = Math.min(minLng, coord[0])
        maxLng = Math.max(maxLng, coord[0])
        minLat = Math.min(minLat, coord[1])
        maxLat = Math.max(maxLat, coord[1])
      })
      if (ringIndex === 0) shapes.push(shape)
    })
  })

  // ---- 挤出基座 ----
  baseGeometry = new THREE.ExtrudeGeometry(shapes, { depth: 0.5, bevelEnabled: false })
  baseGeometry.computeVertexNormals()

  baseMaterial = new THREE.MeshPhysicalMaterial({
    transparent: true,
    opacity: 0.95,
    color: new THREE.Color('#160f0b')
  })

  const uniforms = {
    uRiseTime: { value: -0.8 },
    uRiseColor: { value: new THREE.Color('#d8b06a') }
  }

  baseMaterial.onBeforeCompile = (shader) => {
    shader.uniforms = { ...shader.uniforms, ...uniforms }

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         varying vec3 vTransformedNormal;
         varying float vHeight;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vTransformedNormal = normalize(normal);
         vHeight = transformed.z;`
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform vec3 uRiseColor;
         uniform float uRiseTime;
         varying float vHeight;
         varying vec3 vTransformedNormal;
         vec3 riseLine() {
           float smoothness = 0.5;
           float speed = uRiseTime;
           bool isTopBottom = (vTransformedNormal.z > 0.0 || vTransformedNormal.z < 0.0) && vTransformedNormal.x == 0.0 && vTransformedNormal.y == 0.0;
           float ratio = isTopBottom ? 0.0 : smoothstep(speed, speed + smoothness, vHeight) - smoothstep(speed + smoothness, speed + smoothness * 2.0, vHeight);
           return uRiseColor * ratio;
         }`
      )
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
         gl_FragColor = gl_FragColor + vec4(riseLine(), 1.0);`
      )
  }

  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial)
  baseMesh.rotation.x = -Math.PI / 2
  baseMesh.position.y = -0.6
  scene.add(baseMesh)

  // ---- 周边省级行政区参照层 ----
  // 说明：周边省份整体尺度远超宁夏（内蒙东西跨度约 29°），
  // 因此裁成"以宁夏为中心、半径 ≈80 个世界单位"的圆盘，只留环绕宁夏的一段；
  // 填充面再按到中心的距离做径向淡出，宁夏如"浮"在区域之中，直观表明其地理位置。
  const cosLat = Math.cos((CENTROID[1] * Math.PI) / 180)
  const [rCx, rCy] = project([(minLng + maxLng) / 2, (minLat + maxLat) / 2])
  // 中心在 shape 空间的坐标（shape 的 y 为 project-y 的相反数）
  const scx = rCx
  const scy = -rCy
  const discR = 80 // 世界单位
  const clipPoly = makeClipDisc((minLng + maxLng) / 2, (minLat + maxLat) / 2, discR / SCALE, cosLat, 64)
  const fadeStart = discR * 0.5
  const fadeEnd = discR * 0.97
  // r 为到宁夏中心的距离（shape 空间），返回 1→0 的平滑淡出系数
  const fadeAt = (r) => {
    const t = Math.min(1, Math.max(0, (r - fadeStart) / (fadeEnd - fadeStart)))
    return 1 - t * t * (3 - 2 * t)
  }
  const neighborFillMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#4a83a8'),
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false
  })
  const neighborEdgeMat = new THREE.LineBasicMaterial({
    color: new THREE.Color('#8ccbea'),
    vertexColors: true,
    transparent: true,
    opacity: 0.75
  })
  neighborDisposables.push(neighborFillMat, neighborEdgeMat)

  for (const prov of neighborsGeo) {
    const shapes = []
    const clipped = []
    for (const poly of prov.coordinates) {
      const { pts, orig } = clipRingToPoly(poly[0], clipPoly)
      if (pts.length < 3) continue
      const shape = new THREE.Shape()
      pts.forEach((coord, i) => {
        const [x, y] = project(coord)
        if (i === 0) shape.moveTo(x, -y)
        else shape.lineTo(x, -y)
      })
      shape.closePath()
      shapes.push(shape)
      clipped.push({ pts, orig })
    }
    if (!shapes.length) continue

    // 填充面：逐顶点写入 RGBA，靠近圆盘外缘时 alpha → 0
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 0.25, bevelEnabled: false })
    const pos = geo.attributes.position
    const col = new Float32Array(pos.count * 4)
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i) - scx, pos.getY(i) - scy)
      col[i * 4] = 1
      col[i * 4 + 1] = 1
      col[i * 4 + 2] = 1
      col[i * 4 + 3] = fadeAt(r) * 0.5
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 4))
    const plate = new THREE.Mesh(geo, neighborFillMat)
    plate.rotation.x = -Math.PI / 2
    plate.position.y = -0.85
    scene.add(plate)
    neighborDisposables.push(geo)

    // 行政边界线：剔除裁切产生的外缘段，只画真实省界，并同样径向淡出
    clipped.forEach(({ pts, orig }) => {
      let run = []
      const flush = () => {
        if (run.length < 2) { run = []; return }
        const linePts = []
        const lcol = new Float32Array(run.length * 4)
        run.forEach((coord, i) => {
          const [x, y] = project(coord)
          linePts.push(new THREE.Vector3(x, -0.6, -y))
          const a = fadeAt(Math.hypot(x - scx, -y - scy))
          lcol[i * 4] = 1
          lcol[i * 4 + 1] = 1
          lcol[i * 4 + 2] = 1
          lcol[i * 4 + 3] = a * 0.95
        })
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts)
        lineGeo.setAttribute('color', new THREE.BufferAttribute(lcol, 4))
        const line = new THREE.Line(lineGeo, neighborEdgeMat)
        scene.add(line)
        neighborObjects.push(line)
        neighborDisposables.push(lineGeo)
        run = []
      }
      for (let i = 0; i < pts.length; i++) {
        const next = (i + 1) % pts.length
        if (orig[i] && orig[next]) {
          if (!run.length) run.push(pts[i])
          run.push(pts[next])
        } else {
          flush()
        }
      }
      flush()
    })

    // 省名：使用经校验的固定锚点（正北方为内蒙古、东南为陕西、西南为甘肃）
    const anchor = NEIGHBOR_ANCHORS[prov.name]
    const labelTex = makeNeighborLabelTexture(prov.short)
    const labelMat = new THREE.SpriteMaterial({
      map: labelTex,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      depthTest: false
    })
    const label = new THREE.Sprite(labelMat)
    const [lx, lz] = project(anchor)
    label.position.set(lx, 1.4, lz)
    label.scale.set(11, 11 * (140 / 512), 1)
    label.renderOrder = 19
    scene.add(label)

    neighborObjects.push(plate, label)
    neighborDisposables.push(labelTex, labelMat)
  }

  // ---- 地形平面 ----
  const [sx0, sy0] = project([minLng, minLat])
  const [sx1, sy1] = project([maxLng, maxLat])
  const worldW = sx1 - sx0
  const worldH = sy1 - sy0
  const centerX = (sx0 + sx1) / 2
  const centerZ = (sy0 + sy1) / 2

  terrainGeometry = new THREE.PlaneGeometry(worldW, worldH, 256, 396)
  terrainGeometry.rotateX(-Math.PI / 2)

  const uvAttr = terrainGeometry.attributes.uv
  for (let i = 0; i < uvAttr.count; i++) uvAttr.setY(i, 1 - uvAttr.getY(i))

  terrainMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.92,
    metalness: 0.06,
    displacementScale: 4,
    displacementBias: 0,
    alphaTest: 0.35
  })

  const loader = new THREE.TextureLoader()
  const loadTex = (url, srgb = false) =>
    new Promise((resolve) => {
      loader.load(url, (tex) => {
        if (srgb) tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
        textures.push(tex)
        resolve(tex)
      })
    })

  Promise.all([loadTex(satUrl, true), loadTex(dispUrl), loadTex(normalUrl)]).then(
    ([satTex, dispTex, normTex]) => {
      terrainMaterial.map = satTex
      terrainMaterial.displacementMap = dispTex
      terrainMaterial.normalMap = normTex
      terrainMaterial.needsUpdate = true

      // ---- 地形分层设色叠加层（复用同一地形几何，沿同一DEM位移）----
      // 关键：法线来自 vertex shader 中 displacement 贴图的中心差分，
      // 属于真实世界空间的几何法线，与相机俯角无关——顶视和斜视都能看到正确起伏。
      const DISP_SCALE = 4.0
      terrainTintMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        // 与 terrainMesh 共享同一几何和位移，共面会被深度测试挡住
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uDisp: { value: dispTex },
          uMask: { value: satTex },
          uTexel: { value: new THREE.Vector2(1 / dispTex.image.width, 1 / dispTex.image.height) },
          uWorldSize: { value: new THREE.Vector2(worldW, worldH) },
          uDispScale: { value: DISP_SCALE },
          uVMin: { value: 2 / 255 },
          uVMax: { value: 246 / 255 },
          uOpacity: { value: 0 }
        },
        vertexShader: `
          uniform sampler2D uDisp;
          uniform vec2 uTexel;
          uniform vec2 uWorldSize;
          uniform float uDispScale;
          varying vec2 vUv;
          varying vec3 vWorld;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            // 中心差分：采 4 邻居 displacement
            float h  = texture2D(uDisp, uv).x;
            float hL = texture2D(uDisp, uv - vec2(uTexel.x, 0.0)).x;
            float hR = texture2D(uDisp, uv + vec2(uTexel.x, 0.0)).x;
            float hD = texture2D(uDisp, uv - vec2(0.0, uTexel.y)).x;
            float hU = texture2D(uDisp, uv + vec2(0.0, uTexel.y)).x;
            // 世界空间切向量
            vec3 tx = vec3(uTexel.x * uWorldSize.x, (hR - hL) * uDispScale, 0.0);
            vec3 tz = vec3(0.0, (hU - hD) * uDispScale, uTexel.y * uWorldSize.y);
            // cross(tx, tz) 应朝上（+y）；若 y 分量为负则翻转
            vec3 n = cross(tx, tz);
            if (n.y < 0.0) n = -n;
            vNormal = normalize((modelMatrix * vec4(n, 0.0)).xyz);

            vec3 p = position;
            p.y += h * uDispScale + 0.15;
            vec4 wp = modelMatrix * vec4(p, 1.0);
            vWorld = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform sampler2D uDisp;
          uniform sampler2D uMask;
          uniform float uVMin;
          uniform float uVMax;
          uniform float uOpacity;
          varying vec2 vUv;
          varying vec3 vWorld;
          varying vec3 vNormal;

          // 分层设色色带：低海拔平原绿 → 浅黄绿 → 土黄 → 赭褐 → 雪线白
          vec3 ramp(float t) {
            vec3 c1 = vec3(0.34, 0.58, 0.34);
            vec3 c2 = vec3(0.64, 0.70, 0.37);
            vec3 c3 = vec3(0.78, 0.63, 0.36);
            vec3 c4 = vec3(0.52, 0.33, 0.21);
            vec3 c5 = vec3(0.87, 0.85, 0.81);
            if (t < 0.30) return mix(c1, c2, t / 0.30);
            if (t < 0.52) return mix(c2, c3, (t - 0.30) / 0.22);
            if (t < 0.74) return mix(c3, c4, (t - 0.52) / 0.22);
            return mix(c4, c5, smoothstep(0.74, 1.0, t));
          }

          void main() {
            // satTex alpha 非完美 0/1 mask，宁夏高海拔区 alpha 近 0，用极底阈值过滤界外
            float m = texture2D(uMask, vUv).a;
            if (m < 0.001) discard;
            float raw = clamp((texture2D(uDisp, vUv).x - uVMin) / (uVMax - uVMin), 0.0, 1.0);
            raw = pow(raw, 0.72);

            vec3 ld = normalize(vec3(0.45, 0.82, 0.30));
            float lit = 0.52 + 0.48 * max(dot(normalize(vNormal), ld), 0.0);

            gl_FragColor = vec4(ramp(raw) * lit * 2.4, uOpacity);
          }
        `
      })
      const tintMesh = new THREE.Mesh(terrainGeometry, terrainTintMat)
      tintMesh.position.set(centerX, 0, centerZ)
      tintMesh.renderOrder = 1
      scene.add(tintMesh)
    }
  )

  const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial)
  terrainMesh.position.set(centerX, 0, centerZ)
  scene.add(terrainMesh)

  scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x4a3b28, 0.85))
  const dirLight = new THREE.DirectionalLight(0xfff4e0, 1.7)
  dirLight.position.set(60, 100, 40)
  scene.add(dirLight)
  const fillLight = new THREE.DirectionalLight(0x9fc4ff, 0.35)
  fillLight.position.set(-70, 40, -30)
  scene.add(fillLight)

  // ---- 无限鎏金网格地面（参考 demo0 的 infiniteGrid，换为暖色） ----
  gridFloorGeo = new THREE.PlaneGeometry(1800, 1800, 1, 1)
  gridFloorGeo.rotateX(-Math.PI / 2)
  gridFloorMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uCell: { value: 4.0 },
      uSection: { value: 20.0 },
      uColorCell: { value: new THREE.Color('#6d4c22') },
      uColorSection: { value: new THREE.Color('#c08f3c') },
      uFadeStart: { value: 130.0 },
      uFadeEnd: { value: 430.0 },
      uOpacity: { value: 0.0 }
    },
    vertexShader: `
      varying vec3 vWorld;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform float uCell;
      uniform float uSection;
      uniform vec3 uColorCell;
      uniform vec3 uColorSection;
      uniform float uFadeStart;
      uniform float uFadeEnd;
      uniform float uOpacity;
      varying vec3 vWorld;
      float gridLine(vec2 p, float size, float w) {
        vec2 c = p / size;
        vec2 g = abs(fract(c - 0.5) - 0.5) / fwidth(c);
        return 1.0 - min(min(g.x, g.y) / w, 1.0);
      }
      void main() {
        float cell = gridLine(vWorld.xz, uCell, 1.0);
        float sect = gridLine(vWorld.xz, uSection, 1.7);
        float d = distance(cameraPosition.xz, vWorld.xz);
        float fade = 1.0 - smoothstep(uFadeStart, uFadeEnd, d);
        float near = smoothstep(0.0, 45.0, d);
        vec3 col = uColorCell * cell * 0.55 + uColorSection * sect;
        float a = max(cell * 0.45, sect) * fade * near * uOpacity;
        gl_FragColor = vec4(col, a);
      }
    `
  })
  const gridFloor = new THREE.Mesh(gridFloorGeo, gridFloorMat)
  gridFloor.position.y = -1.4
  gridFloor.renderOrder = -1
  scene.add(gridFloor)

  // ---- 暖色星尘（缓慢漂浮的鎏金微粒） ----
  const DUST_COUNT = 1300
  const dustPos = new Float32Array(DUST_COUNT * 3)
  const dustPhase = new Float32Array(DUST_COUNT)
  const dustAmp = new Float32Array(DUST_COUNT)
  for (let i = 0; i < DUST_COUNT; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 560
    dustPos[i * 3 + 1] = 6 + Math.random() * 168
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 560
    dustPhase[i] = Math.random() * Math.PI * 2
    dustAmp[i] = 4 + Math.random() * 12
  }
  dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3))
  dustGeo.setAttribute('aPhase', new THREE.Float32BufferAttribute(dustPhase, 1))
  dustGeo.setAttribute('aAmp', new THREE.Float32BufferAttribute(dustAmp, 1))
  dustMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0.0 },
      uColor: { value: new THREE.Color('#ffd98a') }
    },
    vertexShader: `
      attribute float aPhase;
      attribute float aAmp;
      uniform float uTime;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.22 + aPhase) * aAmp;
        p.x += cos(uTime * 0.16 + aPhase) * aAmp * 0.35;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = clamp(3.4 * (300.0 / -mv.z), 1.2, 7.0);
        float twinkle = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase * 3.1);
        float far = 1.0 - smoothstep(230.0, 470.0, -mv.z);
        vAlpha = twinkle * far;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      void main() {
        float r = distance(gl_PointCoord, vec2(0.5));
        float a = smoothstep(0.5, 0.0, r);
        gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
      }
    `
  })
  const dust = new THREE.Points(dustGeo, dustMat)
  dust.renderOrder = 1
  scene.add(dust)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 30
  controls.maxDistance = 400
  controls.maxPolarAngle = Math.PI / 2 - 0.03
  controls.target.set(0, 2, 0)

  // ---- 边缘流光 ----
  let mainRing = []
  rings.forEach((ring) => {
    if (ring.length > mainRing.length) mainRing = ring
  })

  const flyV3 = mainRing.map((coord) => {
    const [x, y] = project(coord)
    return new THREE.Vector3(x, 0.6, y)
  })

  flyPointsAll = new THREE.CatmullRomCurve3(flyV3).getSpacedPoints(800)
  flyIndex = Math.floor((flyPointsAll.length - 35) * Math.random())
  flyCurve = new THREE.CatmullRomCurve3(flyPointsAll.slice(flyIndex, flyIndex + FLY_NUM))

  flyGeometry = new THREE.BufferGeometry()
  flyGeometry.setFromPoints(flyCurve.getSpacedPoints(200))

  const vertexCount = flyGeometry.attributes.position.count
  const flyHalf = Math.floor(vertexCount / 2)
  const percentArr = []
  for (let v = 0; v < vertexCount; v++) {
    percentArr.push(v < flyHalf ? v / flyHalf : 1 - (v - flyHalf) / flyHalf)
  }
  flyGeometry.setAttribute('percent', new THREE.Float32BufferAttribute(percentArr, 1))

  flyMaterial = new THREE.PointsMaterial({
    transparent: true,
    color: new THREE.Color('#eaf6ff'),
    size: 0.9,
    depthWrite: false
  })

  flyMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('void main() {', 'attribute float percent;\nvoid main() {')
      .replace('gl_PointSize = size;', 'gl_PointSize = percent * size;')

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <output_fragment>',
      `#include <output_fragment>
       float r = distance(gl_PointCoord, vec2(0.5));
       float alpha = pow(1.0 - r / 0.5, 6.0);
       gl_FragColor = vec4(gl_FragColor.rgb, gl_FragColor.a * alpha);`
    )
  }

  const flyPoints = new THREE.Points(flyGeometry, flyMaterial)
  scene.add(flyPoints)

  const updateFly = (delta) => {
    const total = flyPointsAll.length
    flyIndex = (flyIndex + 60 * delta) % total
    const start = Math.floor(flyIndex)
    const end = start + FLY_NUM
    const segment =
      end <= total
        ? flyPointsAll.slice(start, end)
        : flyPointsAll.slice(start).concat(flyPointsAll.slice(0, end - total))
    flyCurve.points = segment
    flyGeometry.setFromPoints(flyCurve.getSpacedPoints(200))
  }

  // ---- 点位 + 飞线 ----
  const loadDispSampler = () =>
    new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const c = document.createElement('canvas')
        c.width = img.width
        c.height = img.height
        const ctx = c.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(img, 0, 0)
        resolve((lng, lat) => {
          const u = (lng - minLng) / (maxLng - minLng)
          const yy = ((lat - minLat) / (maxLat - minLat)) * img.height
          const px = Math.min(img.width - 1, Math.max(0, Math.round(u * img.width)))
          const py = Math.min(img.height - 1, Math.max(0, Math.round(yy)))
          return ctx.getImageData(px, py, 1, 1).data[0] / 255
        })
      }
      img.src = dispUrl
    })

  const DISP_SCALE = 4
  loadDispSampler().then((sampleGround) => {
    arcMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#5ecbff') } },
      vertexShader: `
        attribute float frac;
        varying float vFrac;
        void main() {
          vFrac = frac;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying float vFrac;
        void main() {
          float edgeFade = smoothstep(0.0, 0.06, vFrac) * smoothstep(1.0, 0.9, vFrac);
          float dash = fract(vFrac * 4.0 - uTime * 0.35);
          float glow = smoothstep(0.0, 0.12, dash) * (1.0 - smoothstep(0.2, 0.45, dash));
          float a = edgeFade * (0.07 + 0.8 * glow);
          gl_FragColor = vec4(uColor, a);
        }`
    })

    const ORIGIN = [106.23, 38.485]
    const [ox, oz] = project(ORIGIN)
    const oy = sampleGround(ORIGIN[0], ORIGIN[1]) * DISP_SCALE
    const startV = new THREE.Vector3(ox, oy + 0.6, oz)

    heritageData.forEach((item) => {
      const [wx, wz] = project([item.lng, item.lat])
      const groundY = sampleGround(item.lng, item.lat) * DISP_SCALE
      const isNational = item.level === '国家级'
      const color = new THREE.Color(isNational ? '#ffc857' : '#54d8ff')

      const group = new THREE.Group()

      const beamMat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.85
      })
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0, 10), beamMat)
      beam.position.y = 0.55

      const headMat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 1
      })
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), headMat)
      head.position.y = 1.2
      glowHeads.push({ mesh: head, phase: item.id * 0.7 })

      const ringMat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.9,
        side: THREE.DoubleSide, depthWrite: false
      })
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.85, 32), ringMat)
      ring.rotation.x = -Math.PI / 2
      ring.position.y = 0.06
      const marker = { item, active: 1, beamMat, headMat, ringMat }
      markerEntries.push(marker)
      pulseRings.push({ mesh: ring, material: ringMat, phase: item.id * 0.37, marker })

      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(1.3, 8, 8),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
      )
      hit.position.y = 1.0
      hit.userData.item = item
      hitMeshes.push(hit)

      group.add(beam, head, ring, hit)
      group.position.set(wx, groundY + 0.08, wz)
      scene.add(group)

      const endV = new THREE.Vector3(wx, groundY + 1.25, wz)
      const dist = startV.distanceTo(endV)
      const ctrlV = new THREE.Vector3(
        (startV.x + endV.x) / 2,
        Math.max(startV.y, endV.y) + dist * 0.42 + 3,
        (startV.z + endV.z) / 2
      )
      const curve = new THREE.QuadraticBezierCurve3(startV, ctrlV, endV)
      const pts = curve.getPoints(90)
      const g = new THREE.BufferGeometry().setFromPoints(pts)
      g.setAttribute(
        'frac',
        new THREE.Float32BufferAttribute(pts.map((_, i) => i / (pts.length - 1)), 1)
      )
      arcGeometries.push(g)
      scene.add(new THREE.Line(g, arcMaterial))
    })

    // ---- 市域层（填充面 + 发光边界 + 流光点 + 市名） ----
    dotSpriteTex = makeDotTexture()
    const cos0 = Math.cos((CENTROID[1] * Math.PI) / 180)

    citiesGeo.cities.forEach((cityDef, ci) => {
      const group = new THREE.Group()
      const polys =
        cityDef.geometry.type === 'MultiPolygon'
          ? cityDef.geometry.coordinates
          : [cityDef.geometry.coordinates]

      const fillShapes = []
      const lineGeos = []
      let latS = Infinity, latE = -Infinity

      polys.forEach((polygon) => {
        polygon.forEach((ring, ri) => {
          const shape = new THREE.Shape()
          ring.forEach(([lng, lat], i) => {
            const [x, yN] = project([lng, lat])
            if (i === 0) shape.moveTo(x, -yN)
            else shape.lineTo(x, -yN)
            latS = Math.min(latS, lat)
            latE = Math.max(latE, lat)
          })
          if (ri === 0) fillShapes.push(shape)

          const v3 = ring.map(([lng, lat]) => {
            const [x, yN] = project([lng, lat])
            return new THREE.Vector3(x, sampleGround(lng, lat) * DISP_SCALE + 0.3, yN)
          })
          lineGeos.push(new THREE.BufferGeometry().setFromPoints(v3))
        })
      })

      // 填充面：顶点反算经纬度并贴地
      const fillGeo = new THREE.ShapeGeometry(fillShapes)
      const fp = fillGeo.attributes.position
      for (let i = 0; i < fp.count; i++) {
        const x = fp.getX(i)
        const wz = -fp.getY(i)
        const lng = -x / SCALE + CENTROID[0]
        const lat = wz / (SCALE * cos0) + CENTROID[1]
        fp.setY(i, sampleGround(lng, lat) * DISP_SCALE + 0.18)
        fp.setZ(i, wz)
      }

      const fillMat = new THREE.MeshBasicMaterial({
        color: CITY_BASE_COLOR.clone(),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false
      })
      const fillMesh = new THREE.Mesh(fillGeo, fillMat)
      fillMesh.userData.cityName = cityDef.name
      group.add(fillMesh)

      // 静态拾取面（共用几何体，不随悬停上浮）——避免上浮后射线落空造成悬停闪烁
      const pickMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      })
      const pickMesh = new THREE.Mesh(fillGeo, pickMat)
      pickMesh.userData.cityName = cityDef.name
      scene.add(pickMesh)
      cityPickMeshes.push(pickMesh)

      const lineMat = new THREE.LineBasicMaterial({
        color: CITY_BASE_COLOR.clone(),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false
      })
      lineGeos.forEach((g) => {
        const lineLoop = new THREE.LineLoop(g, lineMat)
        lineLoop.renderOrder = 8
        group.add(lineLoop)
      })

      // 市名
      const [lx, lyN] = project(cityDef.center)
      const lgy = sampleGround(cityDef.center[0], cityDef.center[1]) * DISP_SCALE
      const labelTex = makeLabelTexture(cityDef.name)
      const labelMat = new THREE.SpriteMaterial({
        map: labelTex,
        color: CITY_BASE_COLOR.clone(),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        // 不参与深度测试：否则低海拔地市（银川、吴忠）的市名会被前方地形挡住而"显示不全"
        depthTest: false
      })
      const label = new THREE.Sprite(labelMat)
      label.position.set(lx, lgy + 4.4, lyN)
      label.scale.set(12.5, 12.5 * (140 / 512), 1)
      label.renderOrder = 21
      group.add(label)

      // 取本市所有外环中跨度最大的一环作为流光跑道
      // （此前固定取 polys[0][0]，多块结构的市域可能选到极小的孤立岛屿）
      const majorRing = polys
        .map((polygon) => polygon[0])
        .reduce((best, ring) => {
          const spanOf = (r) => {
            let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity
            r.forEach(([lng, lat]) => {
              a = Math.min(a, lng); b = Math.max(b, lng)
              c = Math.min(c, lat); d = Math.max(d, lat)
            })
            return (b - a) + (d - c)
          }
          return spanOf(ring) > spanOf(best) ? ring : best
        })
      const mainRingPts = majorRing.map(([lng, lat]) => {
        const [x, yN] = project([lng, lat])
        return new THREE.Vector3(x, sampleGround(lng, lat) * DISP_SCALE + 0.5, yN)
      })
      // 各顶点累计弧长：流光按等弧长采样，避免顶点疏密导致忽快忽慢
      const ringCum = [0]
      for (let i = 1; i < mainRingPts.length; i++) {
        ringCum.push(ringCum[i - 1] + mainRingPts[i].distanceTo(mainRingPts[i - 1]))
      }
      const ringLen = ringCum[ringCum.length - 1]

      // 边界流光：单点脉冲，悬停时沿边界跑动一个亮点
      const trailPos = new Float32Array(RUNNER_TRAIL * 3)
      const trailColor = new Float32Array(RUNNER_TRAIL * 3)
      for (let i = 0; i < RUNNER_TRAIL; i++) {
        trailColor[i * 3] = 1
        trailColor[i * 3 + 1] = 0.84
        trailColor[i * 3 + 2] = 0.4
      }
      const runnerGeo = new THREE.BufferGeometry()
      runnerGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3))
      runnerGeo.setAttribute('color', new THREE.BufferAttribute(trailColor, 3))
      const runnerMat = new THREE.PointsMaterial({
        map: dotSpriteTex,
        size: 5.0,
        transparent: true,
        opacity: 0,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false
      })
      const runner = new THREE.Points(runnerGeo, runnerMat)
      runner.renderOrder = 20
      group.add(runner)

      group.position.y = reduceMotion ? 0 : -3.5
      scene.add(group)

      cityEntries.push({
        name: cityDef.name,
        group,
        fillMesh,
        fillGeo,
        fillMat,
        pickMat,
        lineGeos,
        lineMat,
        labelTex,
        labelMat,
        runnerGeo,
        runnerMat,
        ringPts: mainRingPts,
        ringCum,
        ringLen,
        trailPos,
        runT: ci * 0.21,
        lift: 0,
        latSpan: latE - latS
      })
    })

    // ---- 丝路古道（贴地流光管线 + 名称标牌） ----
    silkRoadRoutes.forEach((route, ri) => {
      const lines = route.segments ?? [route.coordinates]
      const tubes = []

      lines.forEach((coords) => {
        const pts = coords.map(([lng, lat]) => {
          const [x, z] = project([lng, lat])
          return new THREE.Vector3(x, sampleGround(lng, lat) * DISP_SCALE + 0.6, z)
        })
        const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.35)
        const tubeGeo = new THREE.TubeGeometry(
          curve, Math.max(80, pts.length * 5), 0.13, 8, false
        )
        const tubeMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(route.color),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
        const tube = new THREE.Mesh(tubeGeo, tubeMat)
        tube.renderOrder = 6
        scene.add(tube)
        tubes.push({ geo: tubeGeo, mat: tubeMat })

        // 透明加粗命中管：管线本体只有 0.13，直接拾取过难
        const hitGeo = new THREE.TubeGeometry(curve, Math.max(60, pts.length * 3), 0.6, 6, false)
        const hitMesh = new THREE.Mesh(
          hitGeo,
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        )
        hitMesh.userData.routeName = route.name
        scene.add(hitMesh)
        routeHitMeshes.push(hitMesh)
        tubes.push({ geo: hitGeo, mat: null })
      })

      // 灵州道标牌锚点北移至石空，避开"中卫"市名
      const anchor = route.id === 'lingzhou' ? [105.72, 37.62] : route.labelAt
      const [laX, laZ] = project(anchor)
      const laY = sampleGround(anchor[0], anchor[1]) * DISP_SCALE
      const rlabelTex = makeRouteLabelTexture(route.name, route.color)
      const rlabelMat = new THREE.SpriteMaterial({
        map: rlabelTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false
      })
      const rlabel = new THREE.Sprite(rlabelMat)
      const rw = 2.6 + route.name.length * 1.55
      rlabel.scale.set(rw, (rw * 96) / (72 + route.name.length * 76), 1)
      rlabel.position.set(laX, laY + 2.4, laZ)
      rlabel.renderOrder = 22
      scene.add(rlabel)

      routeEntries.push({
        name: route.name,
        tubes,
        labelMat: rlabelMat,
        labelTex: rlabelTex,
        start: 1.7 + ri * 0.28
      })
    })
  })

  // ---- 拾取 ----
  const setPointer = (e) => {
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }
  onDownHandler = (e) => {
    pointerDownAt = { x: e.clientX, y: e.clientY }
    cameraTween = null // 用户接管时取消相机飞行
  }
  onClickHandler = (e) => {
    if (pointerDownAt) {
      const moved = Math.hypot(e.clientX - pointerDownAt.x, e.clientY - pointerDownAt.y)
      if (moved > 6) return
    }
    setPointer(e)
    raycaster.setFromCamera(pointer, camera)

    // 点位优先于古道与市域
    const itemHits = raycaster.intersectObjects(hitMeshes, false)
    if (itemHits.length) {
      selected.value = itemHits[0].object.userData.item
      clearHoverCard()
      return
    }
    // 古道：点击聚焦/取消聚焦（与 GIS 地图一致）
    const routeHits = raycaster.intersectObjects(routeHitMeshes, false)
    if (routeHits.length) {
      toggleDim('route', routeHits[0].object.userData.routeName)
      clearHoverCard()
      return
    }
    const cityHits = raycaster.intersectObjects(cityPickMeshes, false)
    if (cityHits.length) {
      toggleDim('city', cityHits[0].object.userData.cityName)
      clearHoverCard()
    } else {
      selected.value = null
    }
  }
  onMoveHandler = (e) => {
    setPointer(e)
    raycaster.setFromCamera(pointer, camera)
    let cursor = 'grab'
    if (raycaster.intersectObjects(hitMeshes, false).length) {
      clearHoverCard()
      hoverRouteName = ''
      cursor = 'pointer'
    } else {
      // 古道优先于市域做悬停强调
      const rh = raycaster.intersectObjects(routeHitMeshes, false)
      hoverRouteName = rh.length ? rh[0].object.userData.routeName : ''
      if (hoverRouteName) cursor = 'pointer'

      const ch = raycaster.intersectObjects(cityPickMeshes, false)
      const name = ch.length ? ch[0].object.userData.cityName : ''
      if (name && !hoverRouteName) cursor = 'pointer'
      // 已选中地市或非遗点位时不再弹出悬停卡，避免遮挡市名标签
      if (name && !hoverRouteName && !uiState.city && !selected.value) {
        hoverCityName = name
        const rect = containerRef.value.getBoundingClientRect()
        hoverCardPos.x = e.clientX - rect.left
        hoverCardPos.y = e.clientY - rect.top
        hoverCardName.value = name
      } else {
        clearHoverCard()
      }
    }
    renderer.domElement.style.cursor = cursor
  }
  onLeaveHandler = () => {
    clearHoverCard()
    hoverRouteName = ''
  }
  renderer.domElement.addEventListener('pointerdown', onDownHandler)
  renderer.domElement.addEventListener('click', onClickHandler)
  renderer.domElement.addEventListener('pointermove', onMoveHandler)
  renderer.domElement.addEventListener('pointerleave', onLeaveHandler)

  // ---- 动画 ----
  const clock = new THREE.Clock()
  let elapsed = 0
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const delta = clock.getDelta()
    elapsed += delta

    uniforms.uRiseTime.value =
      uniforms.uRiseTime.value >= 0.5 ? -0.8 : uniforms.uRiseTime.value + 0.003

    updateFly(delta)

    // ---- 相机飞行 ----
    if (cameraTween) {
      const tp = Math.min(1, (performance.now() - cameraTween.t0) / cameraTween.duration)
      const te = tp < 0.5 ? 4 * tp * tp * tp : 1 - Math.pow(-2 * tp + 2, 3) / 2
      camera.position.lerpVectors(cameraTween.fromPos, cameraTween.toPos, te)
      controls.target.lerpVectors(cameraTween.fromTarget, cameraTween.toTarget, te)
      if (tp >= 1) cameraTween = null
    }

    // ---- 点位过滤（平滑过渡） ----
    for (const m of markerEntries) {
      const tA = itemMatches(m.item) ? 1 : 0.1
      m.active += (tA - m.active) * 0.12
      m.beamMat.opacity = 0.85 * m.active
      m.headMat.opacity = m.active
    }

    for (const r of pulseRings) {
      const t = (elapsed * 0.55 + r.phase) % 1
      const s = 0.7 + t * 1.9
      r.mesh.scale.set(s, s, s)
      r.material.opacity = (1 - t) * 0.85 * r.marker.active
    }
    for (const h of glowHeads) {
      const s = 1 + 0.18 * Math.sin(elapsed * 3.2 + h.phase)
      h.mesh.scale.set(s, s, s)
    }
    if (arcMaterial) arcMaterial.uniforms.uTime.value = elapsed

    // ---- 背景：鎏金网格与星尘淡入 ----
    const bgIn = reduceMotion ? 1 : Math.min(1, Math.max(0, (elapsed - 0.15) / 1.6))
    if (gridFloorMat) gridFloorMat.uniforms.uOpacity.value = bgIn * 0.7
    if (dustMat) {
      dustMat.uniforms.uTime.value = elapsed
      dustMat.uniforms.uOpacity.value = bgIn
    }

    // ---- 市域视觉与流光 ----
    cityEntries.forEach((c, ci) => {
      const intro = reduceMotion
        ? 1
        : Math.min(1, Math.max(0, (elapsed - (0.3 + ci * 0.22)) / 1.1))
      const introEase = 1 - Math.pow(1 - intro, 3)
      const introY = reduceMotion ? 0 : -3.5 * (1 - introEase)

      const isActive = uiState.city === c.name
      const anyCity = !!uiState.city
      const isHover = !anyCity && hoverCityName === c.name
      const gold = isActive || isHover

      // 悬停该市域：整体上浮（参考 demo1 的城市块升起），移出后回落
      c.lift += ((isHover ? 3.2 : 0) - c.lift) * 0.12
      c.group.position.y = introY + c.lift

      const tFill = isActive ? 0.3 : isHover ? 0.32 : anyCity ? 0.05 : 0.14
      const tLine = isActive ? 1 : anyCity ? 0.22 : 0.7
      const tLabel = isActive ? 1 : anyCity ? 0.35 : 0.85

      c.fillMat.opacity += (tFill * intro - c.fillMat.opacity) * 0.12
      c.lineMat.opacity += (tLine * intro - c.lineMat.opacity) * 0.12
      c.labelMat.opacity += (tLabel * intro - c.labelMat.opacity) * 0.12
      // 金色流光：常态隐藏，仅鼠标悬停本市时沿边界跑动
      const runnerTarget = isHover ? 1 : 0
      c.runnerMat.opacity += (runnerTarget * intro - c.runnerMat.opacity) * 0.1

      const targetCol = gold ? CITY_GOLD_COLOR : CITY_BASE_COLOR
      c.fillMat.color.lerp(targetCol, 0.1)
      c.lineMat.color.lerp(targetCol, 0.1)
      c.labelMat.color.lerp(targetCol, 0.1)

      c.runT = (c.runT + delta * 0.14) % 1
      sampleRing(c, c.runT, _runnerTmp)
      c.trailPos[0] = _runnerTmp.x
      c.trailPos[1] = _runnerTmp.y
      c.trailPos[2] = _runnerTmp.z
      c.runnerGeo.attributes.position.needsUpdate = true
    })

    // ---- 丝路古道淡入（市域升起之后依次显现） ----
    for (const r of routeEntries) {
      const t = Math.min(1, Math.max(0, (elapsed - r.start) / 1.0))
      const e = 1 - Math.pow(1 - t, 3)
      // 聚焦某条古道时，其余古道淡化，聚焦项提亮（与 GIS 地图的强调逻辑一致）
      const isFocus = uiState.route === r.name
      const isHover = !uiState.route && hoverRouteName === r.name
      const dim = uiState.route && !isFocus ? 0.18 : 1
      const boost = isFocus ? 1.4 : isHover ? 1.2 : 1
      for (const tb of r.tubes) if (tb.mat) tb.mat.opacity = Math.min(1, 0.9 * e * dim * boost)
      r.labelMat.opacity = e * (uiState.route && !isFocus ? 0.3 : 1)
    }

    // ---- 地形分层设色：透明 ↔ 有色 平滑过渡 ----
    if (terrainTintMat) {
      const tintTarget = showTerrain.value ? 0.92 : 0
      const u = terrainTintMat.uniforms.uOpacity
      u.value += (tintTarget - u.value) * 0.12
    }

    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  resizeHandler = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    charts.forEach((c) => c && c.resize())
  }
  window.addEventListener('resize', resizeHandler)

  initCharts()
  startClock()
})

// ================= 联动：地图 ↔ 图表 =================
function itemMatches(item) {
  if (uiState.city && item.city !== uiState.city) return false
  if (uiState.route && item.routeRelation !== uiState.route) return false
  if (uiState.category && item.category !== uiState.category) return false
  if (uiState.level && item.level !== uiState.level) return false
  if (uiState.period && item.period !== uiState.period) return false
  if (uiState.itemId && item.id !== uiState.itemId) return false
  return true
}

function flyCamera(toPos, toTarget, duration = 1.3) {
  if (!camera) return
  if (reduceMotion) {
    camera.position.copy(toPos)
    controls.target.copy(toTarget)
    return
  }
  cameraTween = {
    t0: performance.now(),
    duration: duration * 1000,
    fromPos: camera.position.clone(),
    toPos: toPos.clone(),
    fromTarget: controls.target.clone(),
    toTarget: toTarget.clone()
  }
}

function focusCity(name) {
  const cityDef = citiesGeo.cities.find((c) => c.name === name)
  if (!cityDef) return
  const entry = cityEntries.find((c) => c.name === name)
  const [cx, cyN] = project(cityDef.center)
  const target = new THREE.Vector3(cx, 0.8, cyN)
  const span = entry?.latSpan ?? 1
  const d = 42 + span * 13
  flyCamera(new THREE.Vector3(cx, d * 0.98, cyN - d), target)
}

function resetView() {
  flyCamera(new THREE.Vector3(0, 114, -114), new THREE.Vector3(0, 2, 0))
}

function toggleDim(dim, val) {
  uiState[dim] = uiState[dim] === val ? '' : val
  if (dim === 'city') {
    if (uiState.city) focusCity(uiState.city)
    else resetView()
  }
}

function clearDim(dim) {
  if (dim === 'itemId') {
    selected.value = null
    return
  }
  uiState[dim] = ''
  if (dim === 'city') resetView()
}

function resetAll() {
  selected.value = null
  uiState.city = ''
  uiState.route = ''
  uiState.category = ''
  uiState.level = ''
  uiState.period = ''
  showTerrain.value = false
  resetView()
}

// 周边省份参照层显隐
function toggleNeighbors() {
  showNeighbors.value = !showNeighbors.value
  neighborObjects.forEach((o) => { o.visible = showNeighbors.value })
}

// 地形分层设色开关
function toggleTerrain() {
  showTerrain.value = !showTerrain.value
}

const activeChips = computed(() => {
  const arr = []
  if (uiState.city) arr.push({ dim: 'city', label: uiState.city })
  if (uiState.route) arr.push({ dim: 'route', label: uiState.route })
  if (uiState.category) arr.push({ dim: 'category', label: uiState.category })
  if (uiState.level) arr.push({ dim: 'level', label: uiState.level })
  if (uiState.period) arr.push({ dim: 'period', label: uiState.period })
  if (selected.value) arr.push({ dim: 'itemId', label: selected.value.name })
  return arr
})

// selected 与 uiState.itemId 双向同步
watch(selected, (v) => {
  const id = v ? v.id : null
  if (uiState.itemId !== id) uiState.itemId = id
})
watch(
  () => uiState.itemId,
  (v) => {
    const cur = selected.value ? selected.value.id : null
    if (cur !== v) selected.value = v ? heritageData.find((d) => d.id === v) : null
  }
)

// 地图状态 → 图表高亮
function syncChartHighlight() {
  const pie = charts[0]
  const cityChart = charts[1]
  const periodChart = charts[2]
  if (!pie) return
  pie.dispatchAction({ type: 'downplay', seriesIndex: 0 })
  cityChart.dispatchAction({ type: 'downplay', seriesIndex: 0 })
  periodChart.dispatchAction({ type: 'downplay', seriesIndex: 0 })

  const catHL = uiState.category || (selected.value ? selected.value.category : '')
  const cityHL = uiState.city || (selected.value ? selected.value.city : '')
  if (catHL) pie.dispatchAction({ type: 'highlight', seriesIndex: 0, name: catHL })
  // 聚焦古道时，高亮沿线项目涉及的各地市柱条
  if (uiState.route) {
    const routeCities = new Set(scopedData.value.map((d) => d.city.replace('市', '')))
    routeCities.forEach((name) => {
      cityChart.dispatchAction({ type: 'highlight', seriesIndex: 0, name })
    })
  } else if (cityHL) {
    cityChart.dispatchAction({
      type: 'highlight', seriesIndex: 0, name: cityHL.replace('市', '')
    })
  }
  if (uiState.period) {
    periodChart.dispatchAction({ type: 'highlight', seriesIndex: 0, name: uiState.period })
  }
}
watch(uiState, syncChartHighlight, { deep: true })
watch(selected, syncChartHighlight)

// 选中地市/古道 → 类别环形图、年代条按范围刷新数据
function refreshScopedCharts() {
  const pie = charts[0]
  const periodChart = charts[2]
  if (!pie || !periodChart) return
  const data = scopedData.value

  const catData = categories
    .slice(1)
    .map((c) => ({ name: c, value: data.filter((d) => d.category === c).length }))
    .filter((d) => d.value > 0)
  pie.setOption({ series: [{ data: catData }] })

  const periodCounts = periods
    .slice(1)
    .map((p) => ({ name: p, value: data.filter((d) => d.period === p).length }))
    .filter((d) => d.value > 0)
  periodChart.setOption({
    yAxis: { data: periodCounts.map((d) => d.name) },
    series: [{ data: periodCounts.map((d) => d.value) }]
  })
}
watch(() => [uiState.city, uiState.route], refreshScopedCharts)

// ================= 标签 / 光点纹理工厂 =================
function makeDotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.7)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

function makeLabelTexture(name) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 140
  const ctx = c.getContext('2d')
  ctx.font = '700 88px "Noto Serif SC", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.9)'
  ctx.shadowBlur = 10
  ctx.fillStyle = '#ffffff'
  ctx.fillText(name.replace('市', ''), 256, 74)
  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return tex
}

// 周边省份名标签：弱化的青灰文字，避免与宁夏五地市名抢视觉
function makeNeighborLabelTexture(name) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 140
  const ctx = c.getContext('2d')
  ctx.font = '600 76px "Noto Serif SC", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.85)'
  ctx.shadowBlur = 10
  ctx.fillStyle = '#9fd0ea'
  ctx.fillText(name, 256, 74)
  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return tex
}

// 丝路古道名称标签：暗色圆角牌 + 古道主题色描边文字
function makeRouteLabelTexture(name, color) {
  const c = document.createElement('canvas')
  const h = 96
  const w = 72 + name.length * 76
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')

  const pad = 6
  const r = 22
  ctx.beginPath()
  ctx.moveTo(r, pad)
  ctx.arcTo(w - pad, pad, w - pad, h - pad, r)
  ctx.arcTo(w - pad, h - pad, pad, h - pad, r)
  ctx.arcTo(pad, h - pad, pad, pad, r)
  ctx.arcTo(pad, pad, w - pad, pad, r)
  ctx.closePath()
  ctx.fillStyle = 'rgba(26,17,10,0.72)'
  ctx.fill()
  ctx.lineWidth = 2.5
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.85
  ctx.stroke()
  ctx.globalAlpha = 1

  ctx.font = '600 52px "Noto Serif SC", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = color
  ctx.shadowBlur = 10
  ctx.fillStyle = color
  ctx.fillText(name, w / 2, h / 2 + 2)

  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return tex
}

// ================= ECharts =================
const charts = []
const AXIS = 'rgba(255,248,231,0.45)'
const SPLIT = 'rgba(255,248,231,0.06)'

function initCharts() {
  // 类别环形
  const catData = categories
    .slice(1)
    .map((c) => ({ name: c, value: heritageData.filter((d) => d.category === c).length }))
    .filter((d) => d.value > 0)

  const palette = ['#ffc857', '#54d8ff', '#c792ea', '#7ee787', '#ff9d76', '#82aaff', '#f78c6c']
  const pie = echarts.init(pieRef.value)
  pie.setOption({
    color: palette,
    animationDuration: 1500,
    animationEasing: 'elasticOut',
    animationDelay: (idx) => idx * 130,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 项 ({d}%)',
      confine: true,
      backgroundColor: 'rgba(29,21,16,0.92)',
      borderColor: 'rgba(212,160,23,0.55)',
      borderWidth: 1,
      padding: [7, 11],
      textStyle: { color: '#f5e6c8', fontSize: 11 },
      // 固定出现在鼠标上方，避免遮住正在悬停的扇区
      position: (point, params, dom, rect, size) => {
        const x = Math.min(point[0] + 12, size.viewSize[0] - size.contentSize[0] - 2)
        const y = Math.max(2, point[1] - size.contentSize[1] - 12)
        return [Math.max(2, x), y]
      }
    },
    legend: {
      bottom: 2, icon: 'circle', itemWidth: 9, itemHeight: 9,
      textStyle: { color: AXIS, fontSize: 10.5 }
    },
    series: [
      {
        type: 'pie', radius: ['50%', '76%'], center: ['50%', '42%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#1d1510', borderWidth: 2 },
        label: { show: false },
        emphasis: { scaleSize: 9 },
        data: catData
      }
    ]
  })
  charts.push(pie)
  pie.on('click', (p) => toggleDim('category', p.name))

  // 地市柱图
  const cityCounts = cities
    .slice(1)
    .map((c) => ({ name: c.replace('市', ''), value: heritageData.filter((d) => d.city === c).length }))

  const cityChart = echarts.init(cityRef.value)
  cityChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 8, right: 16, top: 18, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category', data: cityCounts.map((d) => d.name),
      axisLine: { lineStyle: { color: 'rgba(255,248,231,0.2)' } },
      axisLabel: { color: AXIS, fontSize: 9, interval: 0 }, axisTick: { show: false }
    },
    yAxis: {
      type: 'value', minInterval: 1,
      axisLabel: { color: AXIS, fontSize: 10 },
      splitLine: { lineStyle: { color: SPLIT } }
    },
    series: [
      {
        type: 'bar', data: cityCounts.map((d) => d.value),
        barWidth: '46%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ffd98a' }, { offset: 1, color: '#c07f2e' }
          ])
        }
      }
    ]
  })
  charts.push(cityChart)
  cityChart.on('click', (p) => toggleDim('city', p.name + '市'))

  // 年代横向条
  const periodCounts = periods
    .slice(1)
    .map((p) => ({ name: p, value: heritageData.filter((d) => d.period === p).length }))
    .filter((d) => d.value > 0)

  const periodChart = echarts.init(periodRef.value)
  periodChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 8, right: 24, top: 12, bottom: 4, containLabel: true },
    xAxis: {
      type: 'value', minInterval: 1,
      axisLabel: { color: AXIS, fontSize: 10 },
      splitLine: { lineStyle: { color: SPLIT } }
    },
    yAxis: {
      type: 'category', data: periodCounts.map((d) => d.name),
      axisLine: { lineStyle: { color: 'rgba(255,248,231,0.2)' } },
      axisLabel: { color: AXIS, fontSize: 10 }, axisTick: { show: false }
    },
    series: [
      {
        type: 'bar', data: periodCounts.map((d) => d.value),
        barWidth: '52%',
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#2f9ec4' }, { offset: 1, color: '#54d8ff' }
          ])
        },
        label: { show: true, position: 'right', color: AXIS, fontSize: 10 }
      }
    ]
  })
  charts.push(periodChart)
  periodChart.on('click', (p) => toggleDim('period', p.name))
}

// ================= 时钟 =================
let clockTimer = null
function startClock() {
  const update = () => {
    const n = new Date()
    const p = (v) => String(v).padStart(2, '0')
    clockText.value = `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())} ${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`
  }
  update()
  clockTimer = setInterval(update, 1000)
}

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (renderer) {
    onDownHandler && renderer.domElement.removeEventListener('pointerdown', onDownHandler)
    onClickHandler && renderer.domElement.removeEventListener('click', onClickHandler)
    onMoveHandler && renderer.domElement.removeEventListener('pointermove', onMoveHandler)
    onLeaveHandler && renderer.domElement.removeEventListener('pointerleave', onLeaveHandler)
  }
  arcGeometries.forEach((g) => g.dispose())
  arcMaterial?.dispose()
  gridFloorGeo?.dispose()
  gridFloorMat?.dispose()
  dustGeo?.dispose()
  dustMat?.dispose()
  cityEntries.forEach((c) => {
    c.fillGeo.dispose()
    c.fillMat.dispose()
    c.pickMat.dispose()
    c.lineGeos.forEach((g) => g.dispose())
    c.lineMat.dispose()
    c.labelTex.dispose()
    c.labelMat.dispose()
    c.runnerGeo.dispose()
    c.runnerMat.dispose()
  })
  routeEntries.forEach((r) => {
    r.tubes.forEach((t) => {
      t.geo.dispose()
      t.mat?.dispose()
    })
    r.labelTex.dispose()
    r.labelMat.dispose()
  })
  markerEntries.forEach((m) => {
    m.beamMat.dispose()
    m.headMat.dispose()
    m.ringMat.dispose()
  })
  dotSpriteTex?.dispose()
  controls?.dispose()
  flyGeometry?.dispose()
  flyMaterial?.dispose()
  terrainGeometry?.dispose()
  terrainMaterial?.dispose()
  terrainTintMat?.dispose()
  baseGeometry?.dispose()
  baseMaterial?.dispose()
  neighborDisposables.forEach((d) => d.dispose())
  textures.forEach((t) => t.dispose())
  charts.forEach((c) => c.dispose())
  if (clockTimer) clearInterval(clockTimer)
  renderer?.dispose()
  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
})
</script>

<style lang="scss" scoped>
.screen-page {
  // 大屏主题色板（呼应主站：赭石 · 鎏金 · 宣纸）
  --scr-gold: #d4a017;
  --scr-gold-light: #f0c040;
  --scr-ochre: #8b4513;
  --scr-text: #f5e6c8;
  --scr-border: rgba(212, 160, 23, 0.16);
  --scr-warm: rgba(33, 23, 17, 0.78);

  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(ellipse 95% 55% at 50% -10%, rgba(212, 160, 23, 0.15), transparent 62%),
    radial-gradient(ellipse 65% 48% at 10% 108%, rgba(139, 69, 19, 0.24), transparent 60%),
    radial-gradient(ellipse 65% 48% at 90% 108%, rgba(139, 69, 19, 0.2), transparent 60%),
    linear-gradient(180deg, #23190f 0%, #1d1510 46%, #150e0a 100%);

  // 极淡丝绸斜纹（全局，位于内容之下）
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      repeating-linear-gradient(45deg, transparent 0 42px, rgba(212, 160, 23, 0.028) 42px 43px),
      repeating-linear-gradient(-45deg, transparent 0 42px, rgba(212, 160, 23, 0.022) 42px 43px);
  }
}

/* ============ 标题栏 ============ */
.screen-header {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: none;
  height: 64px;
  padding: 0 22px;
  border-bottom: 1px solid rgba(212, 160, 23, 0.28);
  background: linear-gradient(180deg, rgba(40, 28, 19, 0.92), rgba(29, 21, 16, 0.86));
  box-shadow: 0 1px 0 rgba(240, 192, 64, 0.12), 0 10px 28px rgba(0, 0, 0, 0.35);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: rgba(255, 248, 231, 0.75);
  text-decoration: none;
  transition: color 0.2s;

  &:hover { color: #ffd98a; }
  .back-ico { font-size: 20px; line-height: 1; }
}

.title-group {
  display: flex;
  align-items: center;
  gap: 18px;
}

.screen-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 6px;
  color: #ffe9bd;
  text-shadow: 0 2px 14px rgba(255, 200, 87, 0.35);
}

.title-decor {
  width: 90px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 160, 23, 0.7));

  &.right { background: linear-gradient(90deg, rgba(212, 160, 23, 0.7), transparent); }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.clock { font-size: 13px; color: rgba(255, 248, 231, 0.6); font-variant-numeric: tabular-nums; }

.panel-toggle {
  display: none;
  padding: 5px 14px;
  border: 1px solid rgba(212, 160, 23, 0.4);
  border-radius: var(--radius-full);
  background: none;
  font-size: 12px;
  color: #ffd98a;
  cursor: pointer;
}

/* ============ 主体 ============ */
.screen-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  min-height: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  flex: none;
  width: 300px;
  padding: 16px;
  gap: 14px;
  overflow-y: auto;
  background: linear-gradient(180deg, rgba(35, 24, 17, 0.6), rgba(22, 15, 11, 0.6));
}

// 左栏按自然高度，富余空间三块均匀铺开
.panel-left { justify-content: space-between; }

.stage {
  position: relative;
  flex: 1;
  min-width: 0;

  // 径向暗角（参考 demo0 的 HUD 暗角），让地图向外自然沉入背景
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    background: radial-gradient(
      ellipse 74% 68% at 50% 47%,
      transparent 40%,
      rgba(10, 7, 4, 0.5) 100%
    );
  }
}

/* ---- 悬停地级市：玻璃信息卡 ---- */
.hover-card {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 7;
  min-width: 172px;
  padding: 10px 14px;
  border: 1px solid rgba(240, 192, 64, 0.3);
  border-radius: 10px;
  background: rgba(43, 30, 20, 0.78);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.42);
  pointer-events: none;
  font-size: 12px;
  color: rgba(255, 248, 231, 0.8);
  will-change: transform;

  .hc-name {
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--scr-gold-light);
  }

  .hc-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    line-height: 1.9;

    b {
      font-weight: 600;
      color: #ffd98a;
    }
  }

  .hc-samples {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 7px;
    padding-top: 7px;
    border-top: 1px dashed rgba(240, 192, 64, 0.2);

    span {
      padding: 1px 7px;
      border-radius: var(--radius-full);
      background: rgba(212, 160, 23, 0.16);
      font-size: 11px;
      color: rgba(255, 248, 231, 0.72);
    }
  }
}

.canvas-container { position: absolute; inset: 0; }

/* ---- 统计网格 ---- */
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px 6px 12px;
  border: 1px solid var(--scr-border);
  border-radius: var(--radius-md);
  background: linear-gradient(160deg, rgba(212, 160, 23, 0.08), rgba(0, 0, 0, 0.16));
  overflow: hidden;

  // 顶部鎏金细线
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 16%;
    right: 16%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(240, 192, 64, 0.55), transparent);
  }

  &.is-gold { border-color: rgba(212, 160, 23, 0.38); }
}

.stat-num {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: #f3e2c0;
  line-height: 1.1;
}

.stat-item.is-gold .stat-num {
  color: #ffc857;
  text-shadow: 0 0 18px rgba(255, 200, 87, 0.45);
}

.stat-label { font-size: 11px; color: rgba(245, 230, 200, 0.55); letter-spacing: 1px; }

/* ---- 图表卡 ---- */
.chart-card {
  display: flex;
  flex-direction: column;
  flex: none;
  padding: 14px 15px 15px;
  border: 1px solid var(--scr-border);
  border-radius: var(--radius-md);
  background: linear-gradient(160deg, rgba(212, 160, 23, 0.055), rgba(0, 0, 0, 0.14));

  // 需要纵向伸展填满面板的卡片
  &.flex-card { flex: 1 1 0; min-height: 210px; }
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 248, 231, 0.9);

  .bar { width: 3px; height: 13px; border-radius: 2px; background: linear-gradient(180deg, #ffd98a, #c07f2e); }
}

.chart-box { flex: 1 1 auto; width: 100%; min-height: 150px; }
.pie-box { flex: none; height: 288px; }

/* ---- 级别条 ---- */
.level-list { display: flex; flex-direction: column; gap: 10px; padding-top: 4px; }

.level-row {
  display: flex; align-items: center; gap: 10px; font-size: 12px;
  cursor: pointer; user-select: none;
  transition: opacity 0.2s;
  &:hover .level-name { color: rgba(255, 248, 231, 0.95); }
  &.is-active {
    .level-name { color: #ffc857; }
    .level-fill { background: linear-gradient(90deg, #ffc857, #ffd98a); }
  }
}
.level-name { width: 56px; flex: none; color: rgba(255, 248, 231, 0.7); }
.level-track { flex: 1; height: 7px; border-radius: 4px; background: rgba(255, 255, 255, 0.06); overflow: hidden; }
.level-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, #54d8ff, #82aaff);
}
.level-val { width: 18px; flex: none; text-align: right; color: rgba(255, 248, 231, 0.7); }

/* ---- TOP 列表 ---- */
.top-list {
  flex: 1 1 auto;
  min-height: 0;
  list-style: none;
  margin: 0;
  padding: 0 2px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.top-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 -6px;
  padding: 8px 6px;
  border-radius: 6px;
  border-bottom: 1px solid rgba(255, 248, 231, 0.06);
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(255, 255, 255, 0.045); }
  &.is-active { background: rgba(255, 200, 87, 0.13); }
}

.top-index { font-family: var(--font-display); color: #ffc857; font-weight: 600; }
.top-name { flex: 1; color: rgba(255, 248, 231, 0.85); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.top-city {
  flex: none;
  color: rgba(255, 248, 231, 0.45);

  &.lv-国家级 { color: #ffc857; }
  &.lv-自治区级 { color: #54d8ff; }
  &.lv-市级, &.lv-县级 { color: rgba(255, 248, 231, 0.6); }
}

/* ---- 筛选状态条 ---- */
.filter-bar {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 6;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  max-width: calc(100% - 32px);
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 13px;
  border: 1px solid rgba(212, 160, 23, 0.4);
  border-radius: var(--radius-full);
  background: rgba(33, 23, 17, 0.78);
  backdrop-filter: blur(6px);
  font-size: 12px;
  color: #ffd98a;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: rgba(212, 160, 23, 0.18); }
  .reset-ico { font-size: 14px; line-height: 1; }
}

.layer-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 13px;
  border: 1px solid rgba(124, 192, 228, 0.42);
  border-radius: var(--radius-full);
  background: rgba(33, 23, 17, 0.78);
  backdrop-filter: blur(6px);
  font-size: 12px;
  color: #9fd0ea;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: rgba(124, 192, 228, 0.18); }
  &.is-on { border-color: rgba(124, 192, 228, 0.75); background: rgba(124, 192, 228, 0.16); }
  .reset-ico { font-size: 14px; line-height: 1; }
}

.chip-wrap { display: contents; }

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px 5px 12px;
  border: 1px solid rgba(84, 216, 255, 0.4);
  border-radius: var(--radius-full);
  background: rgba(33, 23, 17, 0.82);
  font-size: 12px;
  color: #9fe4ff;
  cursor: pointer;

  i { font-style: normal; opacity: 0.6; }
  &:hover { border-color: #54d8ff; }
}

.chip-enter-active, .chip-leave-active { transition: all 0.25s var(--ease-out); }
.chip-enter-from, .chip-leave-to { opacity: 0; transform: translateY(-6px); }

/* ---- 图例 ---- */
.stage-legend {
  position: absolute;
  left: 18px;
  bottom: 16px;
  z-index: 6;
  display: flex;
  gap: 18px;
  padding: 7px 14px;
  border: 1px solid rgba(255, 248, 231, 0.1);
  border-radius: var(--radius-full);
  background: rgba(30, 21, 15, 0.72);
  backdrop-filter: blur(6px);
  font-size: 12px;
  color: rgba(255, 248, 231, 0.8);

  .lg-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; }
  .lg-dot.gold { background: #ffc857; box-shadow: 0 0 7px #ffc857; }
  .lg-dot.cyan { background: #54d8ff; box-shadow: 0 0 7px #54d8ff; }

  .lg-route {
    display: inline-flex;
    align-items: center;
    gap: 5px;

    i {
      width: 18px;
      height: 3px;
      border-radius: 2px;
      background: linear-gradient(90deg, #8b5a2b, #d4af37 55%, #2e8b57);
      box-shadow: 0 0 6px rgba(212, 175, 55, 0.6);
    }
  }
}

/* ---- 信息卡 ---- */
.poi-card {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 5;
  width: 300px;
  max-width: calc(100% - 40px);
  padding: 20px;
  border: 1px solid rgba(212, 160, 23, 0.3);
  border-radius: var(--radius-lg);
  background: linear-gradient(160deg, rgba(40, 28, 19, 0.96), rgba(24, 17, 12, 0.96));
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
}

.poi-close {
  position: absolute; top: 9px; right: 12px;
  border: none; background: none; font-size: 22px; line-height: 1;
  color: rgba(255, 248, 231, 0.5); cursor: pointer;
  &:hover { color: rgba(255, 248, 231, 0.95); }
}

.poi-tags { display: flex; gap: 8px; margin-bottom: 12px; }
.poi-level, .poi-cat { padding: 3px 10px; border-radius: var(--radius-full); font-size: 11px; }
.poi-level.is-national { background: rgba(255, 200, 87, 0.16); color: #ffc857; border: 1px solid rgba(255, 200, 87, 0.4); }
.poi-level.is-local { background: rgba(84, 216, 255, 0.13); color: #54d8ff; border: 1px solid rgba(84, 216, 255, 0.38); }
.poi-cat { background: rgba(255, 255, 255, 0.07); color: rgba(255, 248, 231, 0.65); }

.poi-name { margin: 0 0 6px; font-family: var(--font-display); font-size: 19px; font-weight: 600; color: #fff8e7; }
.poi-meta { margin: 0 0 12px; font-size: 12px; color: rgba(255, 248, 231, 0.5); }
.poi-intro { margin: 0 0 16px; font-size: 13px; line-height: 1.7; color: rgba(255, 248, 231, 0.78); }

.poi-link {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border: 1px solid rgba(212, 160, 23, 0.5);
  border-radius: var(--radius-full); font-size: 13px; color: #ffd98a; text-decoration: none;
  transition: all 0.25s var(--ease-out);
  &:hover { background: rgba(212, 160, 23, 0.14); gap: 10px; }
}

.card-enter-active, .card-leave-active { transition: all 0.3s var(--ease-out); }
.card-enter-from, .card-leave-to { opacity: 0; transform: translateX(24px); }

/* ============ 响应式 ============ */
@media (max-width: 1180px) {
  .panel { width: 260px; }
  .title-decor { width: 40px; }
}

@media (max-width: 1024px) {
  .panel {
    position: absolute;
    top: 0; bottom: 0;
    z-index: 15;
    width: 280px;
    transform: translateX(-100%);
    transition: transform 0.3s var(--ease-out);
    background: rgba(26, 18, 13, 0.97);
  }
  .panel-right {
    right: 0; left: auto;
    transform: translateX(100%);
  }
  .panel-left.panel-open { transform: translateX(0); }
  .panel-right.panel-open { transform: translateX(0); }

  .panel-toggle { display: block; }
  .back-text { display: none; }
  .screen-title { font-size: 17px; letter-spacing: 3px; }
  .title-decor { display: none; }
}

@media (max-width: 560px) {
  .screen-header { padding: 0 14px; height: 56px; }
  .clock { display: none; }
  .poi-card { top: auto; right: 12px; bottom: 12px; left: 12px; width: auto; }
  .stage-legend { left: 12px; bottom: 12px; }
  .filter-bar { top: 10px; left: 10px; max-width: calc(100% - 20px); }
}
</style>
