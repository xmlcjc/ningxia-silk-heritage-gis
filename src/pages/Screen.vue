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
            <div v-for="lv in levelStats" :key="lv.name" class="level-row">
              <span class="level-name">{{ lv.name }}</span>
              <div class="level-track">
                <div class="level-fill" :style="{ width: (lv.value / stats.total * 100) + '%' }"></div>
              </div>
              <span class="level-val">{{ lv.value }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 中央 3D -->
      <main class="stage">
        <div ref="containerRef" class="canvas-container"></div>

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
        </div>
      </main>

      <!-- 右栏 -->
      <aside class="panel panel-right" :class="{ 'panel-open': mobilePanel }">
        <div class="chart-card">
          <h3 class="chart-title"><i class="bar"></i>五地市项目数量</h3>
          <div ref="cityRef" class="chart-box"></div>
        </div>

        <div class="chart-card">
          <h3 class="chart-title"><i class="bar"></i>历史源流年代</h3>
          <div ref="periodRef" class="chart-box"></div>
        </div>

        <div class="chart-card">
          <h3 class="chart-title"><i class="bar"></i>国家级项目名录</h3>
          <ul class="top-list">
            <li v-for="item in nationalItems" :key="item.id">
              <span class="top-index">{{ String(item.id).padStart(2, '0') }}</span>
              <span class="top-name">{{ item.name }}</span>
              <span class="top-city">{{ item.city }}</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import * as THREE from 'three'
import * as echarts from 'echarts'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import outlineData from '@/assets/ningxia-outline.json'
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

// ================= 数据统计 =================
const stats = computed(() => ({
  total: heritageData.length,
  national: heritageData.filter((d) => d.level === '国家级').length,
  cities: new Set(heritageData.map((d) => d.city)).size,
  routes: silkRoadRoutes.length
}))

const levelStats = computed(() =>
  ['国家级', '自治区级', '市级', '县级']
    .map((name) => ({ name, value: heritageData.filter((d) => d.level === name).length }))
    .filter((d) => d.value > 0)
)

const nationalItems = computed(() => heritageData.filter((d) => d.level === '国家级'))

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
let arcMaterial = null
const arcGeometries = []
let pointerDownAt = null
let onClickHandler = null
let onMoveHandler = null
let onDownHandler = null
let animationId = 0
let resizeHandler = null

const CENTROID = [106.169866, 37.291332]
const SCALE = 22
const project = ([lng, lat]) => {
  const x = (lng - CENTROID[0]) * SCALE
  const y = (lat - CENTROID[1]) * SCALE * Math.cos((CENTROID[1] * Math.PI) / 180)
  return [x, y]
}

onMounted(() => {
  const container = containerRef.value
  const width = container.clientWidth
  const height = container.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color('#15181c')
  scene.fog = new THREE.Fog('#15181c', 240, 480)

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
  camera.position.set(0, 95, 130)
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
    color: new THREE.Color('#0e171a')
  })

  const uniforms = {
    uRiseTime: { value: -0.8 },
    uRiseColor: { value: new THREE.Color('#90aba7') }
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

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.0, 10),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 })
      )
      beam.position.y = 0.55

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 20, 20),
        new THREE.MeshBasicMaterial({ color })
      )
      head.position.y = 1.2
      glowHeads.push({ mesh: head, phase: item.id * 0.7 })

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.55, 0.85, 32),
        new THREE.MeshBasicMaterial({
          color, transparent: true, opacity: 0.9,
          side: THREE.DoubleSide, depthWrite: false
        })
      )
      ring.rotation.x = -Math.PI / 2
      ring.position.y = 0.06
      pulseRings.push({ mesh: ring, material: ring.material, phase: item.id * 0.37 })

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
  })

  // ---- 拾取 ----
  const setPointer = (e) => {
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }
  onDownHandler = (e) => { pointerDownAt = { x: e.clientX, y: e.clientY } }
  onClickHandler = (e) => {
    if (pointerDownAt) {
      const moved = Math.hypot(e.clientX - pointerDownAt.x, e.clientY - pointerDownAt.y)
      if (moved > 6) return
    }
    setPointer(e)
    raycaster.setFromCamera(pointer, camera)
    const hits = raycaster.intersectObjects(hitMeshes, false)
    if (hits.length) selected.value = hits[0].object.userData.item
  }
  onMoveHandler = (e) => {
    setPointer(e)
    raycaster.setFromCamera(pointer, camera)
    renderer.domElement.style.cursor =
      raycaster.intersectObjects(hitMeshes, false).length ? 'pointer' : 'grab'
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

    for (const r of pulseRings) {
      const t = (elapsed * 0.55 + r.phase) % 1
      const s = 0.7 + t * 1.9
      r.mesh.scale.set(s, s, s)
      r.material.opacity = (1 - t) * 0.85
    }
    for (const h of glowHeads) {
      const s = 1 + 0.18 * Math.sin(elapsed * 3.2 + h.phase)
      h.mesh.scale.set(s, s, s)
    }
    if (arcMaterial) arcMaterial.uniforms.uTime.value = elapsed

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
    tooltip: { trigger: 'item', formatter: '{b}: {c} 项 ({d}%)' },
    legend: {
      bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8,
      textStyle: { color: AXIS, fontSize: 10 }
    },
    series: [
      {
        type: 'pie', radius: ['46%', '70%'], center: ['50%', '44%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#15181c', borderWidth: 2 },
        label: { show: false },
        emphasis: { scaleSize: 6, label: { show: true, color: '#fff', fontSize: 13 } },
        data: catData
      }
    ]
  })
  charts.push(pie)

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
      axisLabel: { color: AXIS, fontSize: 10 }, axisTick: { show: false }
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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #15181c;
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
  border-bottom: 1px solid rgba(212, 160, 23, 0.22);
  background: linear-gradient(180deg, rgba(31, 34, 39, 0.98), rgba(21, 24, 28, 0.98));
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
  display: flex;
  flex: 1;
  min-height: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  flex: none;
  width: 300px;
  padding: 14px;
  gap: 14px;
  overflow-y: auto;
  background: rgba(19, 22, 26, 0.6);
}

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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px 6px;
  border: 1px solid rgba(255, 248, 231, 0.08);
  border-radius: var(--radius-md);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));

  &.is-gold { border-color: rgba(255, 200, 87, 0.3); }
}

.stat-num {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: #eaf6ff;
  line-height: 1.1;
}

.stat-item.is-gold .stat-num {
  color: #ffc857;
  text-shadow: 0 0 16px rgba(255, 200, 87, 0.4);
}

.stat-label { font-size: 11px; color: rgba(255, 248, 231, 0.5); }

/* ---- 图表卡 ---- */
.chart-card {
  padding: 13px 14px 14px;
  border: 1px solid rgba(255, 248, 231, 0.07);
  border-radius: var(--radius-md);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.008));
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

.chart-box { width: 100%; height: 168px; }
.pie-box { height: 182px; }

/* ---- 级别条 ---- */
.level-list { display: flex; flex-direction: column; gap: 10px; padding-top: 4px; }

.level-row { display: flex; align-items: center; gap: 10px; font-size: 12px; }
.level-name { width: 56px; flex: none; color: rgba(255, 248, 231, 0.7); }
.level-track { flex: 1; height: 7px; border-radius: 4px; background: rgba(255, 255, 255, 0.06); overflow: hidden; }
.level-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, #54d8ff, #82aaff);
}
.level-val { width: 18px; flex: none; text-align: right; color: rgba(255, 248, 231, 0.7); }

/* ---- TOP 列表 ---- */
.top-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }

.top-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 2px;
  border-bottom: 1px solid rgba(255, 248, 231, 0.06);
  font-size: 12px;

  &:last-child { border-bottom: none; }
}

.top-index { font-family: var(--font-display); color: #ffc857; font-weight: 600; }
.top-name { flex: 1; color: rgba(255, 248, 231, 0.85); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.top-city { flex: none; color: rgba(255, 248, 231, 0.45); }

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
  background: rgba(21, 24, 28, 0.7);
  backdrop-filter: blur(6px);
  font-size: 12px;
  color: rgba(255, 248, 231, 0.8);

  .lg-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; }
  .lg-dot.gold { background: #ffc857; box-shadow: 0 0 7px #ffc857; }
  .lg-dot.cyan { background: #54d8ff; box-shadow: 0 0 7px #54d8ff; }
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
  background: linear-gradient(160deg, rgba(34, 37, 41, 0.95), rgba(24, 26, 29, 0.95));
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
    background: rgba(19, 22, 26, 0.97);
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
}
</style>
