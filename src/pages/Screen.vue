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

        <div class="filter-bar">
          <button class="reset-btn" @click="resetAll">
            <span class="reset-ico">⟲</span>复位视图
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

// 统一联动状态（地图与图表的唯一真相源）
const uiState = reactive({
  city: '',
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

// 当前数据范围：选中地市后仅统计该市，否则为全量
const scopedData = computed(() =>
  uiState.city ? heritageData.filter((d) => d.city === uiState.city) : heritageData
)

const levelStats = computed(() =>
  ['国家级', '自治区级', '市级', '县级']
    .map((name) => ({ name, value: scopedData.value.filter((d) => d.level === name).length }))
    .filter((d) => d.value > 0)
)

const levelTotal = computed(() => levelStats.value.reduce((s, d) => s + d.value, 0))

// 右栏名录：默认国家级；选中地市时展示该市全部项目
const listTitle = computed(() =>
  uiState.city ? `${uiState.city.replace('市', '')} · 项目名录` : '国家级项目名录'
)
const cityItemList = computed(() =>
  uiState.city
    ? heritageData.filter((d) => d.city === uiState.city)
    : heritageData.filter((d) => d.level === '国家级')
)

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
const hitMeshes = []
const pulseRings = []
const glowHeads = []
const markerEntries = []
const cityEntries = []
const routeEntries = []
let arcMaterial = null
const arcGeometries = []
let hoverCityName = ''
let cameraTween = null
let dotSpriteTex = null
let reduceMotion = false
let pointerDownAt = null
let onClickHandler = null
let onMoveHandler = null
let onDownHandler = null
let animationId = 0
let resizeHandler = null

const CENTROID = [106.169866, 37.291332]
const SCALE = 22
const CITY_BASE_COLOR = new THREE.Color('#6fc6e8')
const CITY_GOLD_COLOR = new THREE.Color('#ffc857')
const project = ([lng, lat]) => {
  // x 取反：three.js 相机在南侧向北看时东西会镜像，翻转投影保证左西右东
  const x = -(lng - CENTROID[0]) * SCALE
  const y = (lat - CENTROID[1]) * SCALE * Math.cos((CENTROID[1] * Math.PI) / 180)
  return [x, y]
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
        depthWrite: false
      })
      const label = new THREE.Sprite(labelMat)
      label.position.set(lx, lgy + 4.4, lyN)
      label.scale.set(12.5, 12.5 * (140 / 512), 1)
      group.add(label)

      // 边界流光点（沿本市最大外环跑动）
      let mainRingPts = []
      polys[0][0].forEach(([lng, lat]) => {
        const [x, yN] = project([lng, lat])
        mainRingPts.push(new THREE.Vector3(x, sampleGround(lng, lat) * DISP_SCALE + 0.5, yN))
      })
      const runnerGeo = new THREE.BufferGeometry().setFromPoints([mainRingPts[0]])
      const runnerMat = new THREE.PointsMaterial({
        map: dotSpriteTex,
        color: CITY_GOLD_COLOR.clone(),
        size: 2.4,
        transparent: true,
        opacity: 0,
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
        lineGeos,
        lineMat,
        labelTex,
        labelMat,
        runnerGeo,
        runnerMat,
        ringPts: mainRingPts,
        runT: ci * 0.21,
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

    // 点位优先于市域
    const itemHits = raycaster.intersectObjects(hitMeshes, false)
    if (itemHits.length) {
      selected.value = itemHits[0].object.userData.item
      return
    }
    const cityHits = raycaster.intersectObjects(
      cityEntries.map((c) => c.fillMesh),
      false
    )
    if (cityHits.length) {
      toggleDim('city', cityHits[0].object.userData.cityName)
    } else {
      selected.value = null
    }
  }
  onMoveHandler = (e) => {
    setPointer(e)
    raycaster.setFromCamera(pointer, camera)
    let cursor = 'grab'
    if (raycaster.intersectObjects(hitMeshes, false).length) {
      hoverCityName = ''
      cursor = 'pointer'
    } else {
      const ch = raycaster.intersectObjects(
        cityEntries.map((c) => c.fillMesh),
        false
      )
      hoverCityName = ch.length ? ch[0].object.userData.cityName : ''
      if (ch.length) cursor = 'pointer'
    }
    renderer.domElement.style.cursor = cursor
  }
  renderer.domElement.addEventListener('pointerdown', onDownHandler)
  renderer.domElement.addEventListener('click', onClickHandler)
  renderer.domElement.addEventListener('pointermove', onMoveHandler)

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

    // ---- 市域视觉与流光 ----
    cityEntries.forEach((c, ci) => {
      const intro = reduceMotion
        ? 1
        : Math.min(1, Math.max(0, (elapsed - (0.3 + ci * 0.22)) / 1.1))
      if (!reduceMotion) {
        const ease = 1 - Math.pow(1 - intro, 3)
        c.group.position.y = -3.5 * (1 - ease)
      }

      const isActive = uiState.city === c.name
      const anyCity = !!uiState.city
      const isHover = !anyCity && hoverCityName === c.name
      const gold = isActive || isHover
      const tFill = isActive ? 0.3 : isHover ? 0.22 : anyCity ? 0.05 : 0.14
      const tLine = isActive ? 1 : anyCity ? 0.22 : 0.7
      const tLabel = isActive ? 1 : anyCity ? 0.35 : 0.85

      c.fillMat.opacity += (tFill * intro - c.fillMat.opacity) * 0.12
      c.lineMat.opacity += (tLine * intro - c.lineMat.opacity) * 0.12
      c.labelMat.opacity += (tLabel * intro - c.labelMat.opacity) * 0.12
      // 金色流光：常态隐藏，仅鼠标悬停本市时跑动
      const runnerTarget = isHover ? 0.95 : 0
      c.runnerMat.opacity += (runnerTarget * intro - c.runnerMat.opacity) * 0.1

      const targetCol = gold ? CITY_GOLD_COLOR : CITY_BASE_COLOR
      c.fillMat.color.lerp(targetCol, 0.1)
      c.lineMat.color.lerp(targetCol, 0.1)
      c.labelMat.color.lerp(targetCol, 0.1)

      c.runT = (c.runT + delta * 0.14) % 1
      const f = c.runT * (c.ringPts.length - 1)
      const i0 = Math.floor(f)
      const i1 = (i0 + 1) % c.ringPts.length
      const tt = f - i0
      const p0 = c.ringPts[i0]
      const p1 = c.ringPts[i1]
      c.runnerGeo.setFromPoints([
        new THREE.Vector3(
          p0.x + (p1.x - p0.x) * tt,
          p0.y + (p1.y - p0.y) * tt,
          p0.z + (p1.z - p0.z) * tt
        )
      ])
    })

    // ---- 丝路古道淡入（市域升起之后依次显现） ----
    for (const r of routeEntries) {
      const t = Math.min(1, Math.max(0, (elapsed - r.start) / 1.0))
      const e = 1 - Math.pow(1 - t, 3)
      for (const tb of r.tubes) tb.mat.opacity = 0.9 * e
      r.labelMat.opacity = e
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
  uiState.category = ''
  uiState.level = ''
  uiState.period = ''
  resetView()
}

const activeChips = computed(() => {
  const arr = []
  if (uiState.city) arr.push({ dim: 'city', label: uiState.city })
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
  if (cityHL) {
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

// 选中地市 → 类别环形图、年代条按市域刷新数据
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
watch(() => uiState.city, refreshScopedCharts)

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
  }
  arcGeometries.forEach((g) => g.dispose())
  arcMaterial?.dispose()
  cityEntries.forEach((c) => {
    c.fillGeo.dispose()
    c.fillMat.dispose()
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
      t.mat.dispose()
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
  baseGeometry?.dispose()
  baseMaterial?.dispose()
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
