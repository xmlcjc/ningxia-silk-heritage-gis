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
        <button class="panel-toggle" @click="cycleMobilePanel">
          {{ mobilePanel === 0 ? '查看数据' : mobilePanel === 2 ? '收起数据' : '查看图表' }}
        </button>
      </div>
    </header>

    <!-- ============ 主体三栏 ============ -->
    <div class="screen-body">
      <!-- 左栏 -->
      <aside class="panel panel-left" :class="{ 'panel-open': mobilePanel === 1 }">
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

        <!-- 观赏视角切换器：独立于筛选栏，避免与非遗类别筛选混用 -->
        <nav class="viewpoint-switcher" aria-label="观赏视角">
          <span class="vs-caption">观赏视角</span>
          <button
            v-for="vp in viewpoints"
            :key="vp.id"
            class="vs-item"
            :class="{ 'is-active': activeViewpoint === vp.id }"
            :aria-pressed="activeViewpoint === vp.id"
            @click="applyViewpoint(vp.id)"
          >
            <i class="vs-index">{{ vp.index }}</i>
            <span class="vs-name">{{ vp.name }}</span>
          </button>
        </nav>

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

            <!-- 三维预览：有实景场景的条目内嵌 SuperSplat 查看器，其余按类别展示 CC0 器物转盘 -->
            <div v-if="pipSrc" class="poi-scene">
              <iframe class="poi-scene-frame" :src="pipSrc" title="实景三维场景" allow="fullscreen" />
            </div>
            <div v-else-if="artifact" class="poi-artifact">
              <ArtifactModel :src="artifact.src" />
              <span class="poi-artifact-label">
                {{ artifact.label }} · {{ artifact.relation === 'reference' ? '工艺参照模型，非该项目实物' : '对应器物' }}
              </span>
            </div>
            <div v-else class="poi-artifact poi-artifact-empty">
              <span class="poi-artifact-empty-title">暂无对应三维模型</span>
              <span class="poi-artifact-empty-note">该项目尚未有可靠的三维数字化模型</span>
            </div>

            <router-link class="poi-link" :to="`/archive/${selected.id}`">
              查看完整档案<span class="poi-arrow">→</span>
            </router-link>
          </div>
        </transition>

        <div class="stage-legend" :class="{ 'is-hidden': isNarrow && selected }">
          <span><i class="lg-dot gold"></i>国家级</span>
          <span><i class="lg-dot green"></i>自治区级</span>
          <span><i class="lg-dot bluegray"></i>市级</span>
          <span class="lg-route"><i></i>丝路古道</span>
        </div>
      </main>

      <!-- 右栏 -->
      <aside class="panel panel-right" :class="{ 'panel-open': mobilePanel === 2 }">
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
import { ref, reactive, computed, watch, onBeforeUnmount, onMounted, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as THREE from 'three'
import * as echarts from 'echarts'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import outlineData from '@/assets/ningxia-outline.json'
import citiesGeo from '@/assets/ningxia-cities.json'
import neighborsGeo from '@/data/ningxia-neighbors.geo.json'
import { globalSelection, syncGlobalSelection } from '@/composables/useGlobalSelection'
import { artifactFor } from '@/data/artifactModels'
import satUrl from '@/assets/textures/nx_sat.webp'
import dispUrl from '@/assets/textures/nx_disp.jpg'
import normalUrl from '@/assets/textures/nx_normal.jpg'
import hillshadeUrl from '@/assets/textures/nx_hillshade.png'
import {
  heritageData,
  categories,
  cities,
  periods,
  silkRoadRoutes
} from '@/data/heritageData.js'

// 器物三维转盘按需加载：仅在下钻卡片打开且条目无实景场景时才拉取 GLTFLoader 代码
const ArtifactModel = defineAsyncComponent(() => import('@/components/ArtifactModel.vue'))

// 路由（URL 状态化：选中态写入查询参数，可分享、可前进后退）
const router = useRouter()
const route = useRoute()

const containerRef = ref(null)
const pieRef = ref(null)
const cityRef = ref(null)
const periodRef = ref(null)
const selected = ref(null)
// 实景三维场景嵌入地址（与地图画中画/档案页同源：viewer-embed.html + 同名 settings 初始视角）
const pipSrc = computed(() => {
  const m = selected.value?.models?.[0]
  if (!m) return ''
  const params = new URLSearchParams({
    content: m.url,
    settings: m.url.replace(/\.sog$/i, '.settings.json'),
    lang: 'zh-CN'
  })
  return `/viewer-embed.html?${params.toString()}`
})
// 器物模型：仅接受与条目有明确语义对应的模型；无对应时不展示（见 artifactModels.js）
const artifact = computed(() => (selected.value ? artifactFor(selected.value) : null))
// 窄屏判定：与 CSS 断点 1024px 对齐，用于浮层互斥（POI 详情卡 ↔ 抽屉面板/图例）
const isNarrow = ref(typeof window !== 'undefined' && window.innerWidth <= 1024)
// 窄屏数据面板开关：单键循环 0 收起 → 1 左栏总览 → 2 右栏图表/名录；
// 避免两块 280px 面板在 <1024px 窄屏同时展开相互遮挡导致内容被裁切
const mobilePanel = ref(0)
const cycleMobilePanel = () => {
  // 窄屏互斥：打开抽屉面板前先关闭 POI 详情卡，避免两块浮层争抢同一显示区域
  if (isNarrow.value && selected.value) selected.value = null
  mobilePanel.value = (mobilePanel.value + 1) % 3
}
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
  ['国家级', '自治区级', '市级']
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
    levels: ['国家级', '自治区级', '市级']
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
// 标注 Sprite 世界坐标复用向量（用于按相机距离做淡出）
const _labelWorldTmp = new THREE.Vector3()
// 邻省省名屏幕边缘安全区微调：把投影到视口外的文字拉回可见范围
const _labelNdcTmp = new THREE.Vector3()
const _camRightTmp = new THREE.Vector3()
const _camUpTmp = new THREE.Vector3()
const NEIGHBOR_SAFE_NDC = 0.94
// 市名/古道标牌的距离淡出阈值（世界单位）：
// 默认视角约 160、聚焦地市约 81~105，均完整显示；小于 68 开始淡出，贴到 38 以内完全隐藏，
// 避免极限放大时 12.5 世界单位宽的 Sprite 随透视放大铺满视口
const LABEL_FADE_NEAR = 38
const LABEL_FADE_FAR = 68
function labelFadeByDistance(dist) {
  return Math.min(1, Math.max(0, (dist - LABEL_FADE_NEAR) / (LABEL_FADE_FAR - LABEL_FADE_NEAR)))
}
// 邻省省名基础不透明度（沿用原视觉值）
const NEIGHBOR_LABEL_BASE_OPACITY = 0.82
// 注视点相对地表的稳定抬升量（世界单位）
const TARGET_GROUND_CLEARANCE = 1.5
// 平移边界：以地形实际包围盒为基准，额外保留少量观察缓冲
const PAN_LIMIT_BUFFER = 6
// 当前选中的预设视角；手动拖动/缩放或聚焦地市后置空，避免切换器显示与实际镜头不符
const activeViewpoint = ref('all')
// 竖屏窄屏构图：保持观察距离不变，抬高俯角，让地形在纵向画面中占比更高
// （仅改变相机取景，不改变地形数据、地理坐标或空间比例）
const PORTRAIT_PITCH = (57 * Math.PI) / 180
let portraitFraming = false
let lastCameraAspect = 1
const viewPitchRatio = () => (portraitFraming ? Math.tan(PORTRAIT_PITCH) : 0.98)
const defaultCameraPose = () => {
  if (!portraitFraming) return { pos: new THREE.Vector3(0, 114, -114), target: new THREE.Vector3(0, 2, 0) }
  const d = 160
  return {
    pos: new THREE.Vector3(0, 2 + d * Math.sin(PORTRAIT_PITCH), -d * Math.cos(PORTRAIT_PITCH)),
    target: new THREE.Vector3(0, 2, 0)
  }
}
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
// 省名 Sprite 与材质：与市名/古道共用同一套距离淡出，避免极限放大时铺满视口
const neighborLabelSprites = []
const neighborDisposables = []
// DEM 采样器（世界坐标版）与地形实际包围盒：供注视点高程化、平移边界复用
let groundSamplerWorld = null
let terrainBounds = null
// 地形分层设色：默认关闭（地形仅显示暗色卫星影像），开启后按海拔高程叠加彩色色层
const showTerrain = ref(false)
let terrainTintMat = null
let terrainTintMesh = null
let reduceMotion = false
let pointerDownAt = null
let onClickHandler = null
let onMoveHandler = null
let onDownHandler = null
let onLeaveHandler = null
let onWheelHandler = null
let animationId = 0
let resizeHandler = null
let containerResizeObserver = null
let resizeFrame = 0
let lastContainerW = 0
let lastContainerH = 0

const CENTROID = [106.169866, 37.291332]
const SCALE = 22
// 中心纬度余弦：经度方向每度对应的地表距离约为纬度方向的 cos(lat) 倍，
// 因此 cos 因子必须作用在经度轴。此前它被乘在纬度轴上，导致世界 X/Z 尺度比
// 偏离真实地表约 1/cos² ≈ 1.58 倍（整幅地图东西向被拉伸）。
const COS_CENTROID = Math.cos((CENTROID[1] * Math.PI) / 180)
// 五市基础色：低饱和琥珀（原科技蓝 #6fc6e8），悬停/选中时提亮为鎏金
const CITY_BASE_COLOR = new THREE.Color('#b08a4a')
const CITY_GOLD_COLOR = new THREE.Color('#ffc857')
// /screen 专属古道配色：统一为琥珀色系，不修改 heritageData 中跨页面共用的 route.color
const ROUTE_AMBER = ['#d9a05b', '#c98f4a', '#e0b36a', '#b97c3c', '#d2a56b']
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
  // 等距圆柱（中心纬度为标准纬线）：经度轴乘 cos，纬度轴线性。
  // 这样 1 个世界单位在东西与南北方向对应同一地表距离，长宽比与真实地形一致。
  // x 取反：three.js 相机在南侧向北看时东西会镜像，翻转投影保证左西右东
  const x = -(lng - CENTROID[0]) * SCALE * COS_CENTROID
  const y = (lat - CENTROID[1]) * SCALE
  return [x, y]
}

// 四个预设观赏视角：锚点全部以地理坐标保存，世界坐标在 project() 之后由同一函数换算，
// 避免投影修正后残留旧投影下的硬编码坐标。
// - 贺兰山：贺兰砚 POI(106.27,38.45) ↔ 石嘴山市中心(106.376,39.013) 中点
//   项目没有山体矢量数据，此为临时 POI 锚点，不代表测绘意义上的贺兰山中心
// - 黄河流域：黄河河道青铜峡段 yellowRiver.coordinates[25] (105.93,37.817)
// - 丝路文化：全部古道点（含 segments 分支）地理质心 ≈ (105.553952, 37.027369)
// L 为水平前距，相机沿用既有构型 target + (0, 0.98L, −L)，俯角约 44.5°
const VIEWPOINT_DEFS = [
  { id: 'all', index: '01', name: '宁夏全域', anchor: null, baseY: 2, L: 0 },
  { id: 'helan', index: '02', name: '贺兰山', anchor: [106.323, 38.7315], baseY: 0.8, L: 55 },
  { id: 'river', index: '03', name: '黄河流域', anchor: [105.93, 37.817], baseY: 0.8, L: 75 },
  { id: 'silk', index: '04', name: '丝路文化', anchor: [105.679883, 37.027312], baseY: 1.2, L: 90 }
]
const viewpoints = VIEWPOINT_DEFS.map((vp) => {
  const [x, z] = vp.anchor ? project(vp.anchor) : [0, 0]
  return { ...vp, x, z }
})

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
// 半径按经纬两个方向分别给出：世界空间圆的 X/Z 半径需要分别除以 SCALE·cos 与 SCALE
const makeClipDisc = (cx, cy, radiusLng, radiusLat, seg = 64) => {
  const poly = []
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2
    poly.push([cx + radiusLng * Math.cos(a), cy + radiusLat * Math.sin(a)])
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
  // 雾效与最大观察距离（400）协调：原 240/480 在拉远时会把地形吞掉约 2/3，
  // 后移到 300/620，最远处仍保留地形轮廓，默认距离 160 不受影响。
  scene.fog = new THREE.Fog('#1d1510', 300, 620)

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
  // 相机置于南侧向北 45° 俯视 → 画面上北下南、左西右东
  // 竖屏窄屏改用更陡的俯角，保持观察距离不变；桌面端构图不变
  portraitFraming = window.innerWidth <= 900 && width / height < 0.9
  lastCameraAspect = width / height
  const initialPose = defaultCameraPose()
  camera.position.copy(initialPose.pos)
  camera.lookAt(initialPose.target)

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
  const [rCx, rCy] = project([(minLng + maxLng) / 2, (minLat + maxLat) / 2])
  // 中心在 shape 空间的坐标（shape 的 y 为 project-y 的相反数）
  const scx = rCx
  const scy = -rCy
  const discR = 80 // 世界单位
  const clipPoly = makeClipDisc(
    (minLng + maxLng) / 2,
    (minLat + maxLat) / 2,
    discR / (SCALE * COS_CENTROID),
    discR / SCALE,
    64
  )
  const fadeStart = discR * 0.5
  const fadeEnd = discR * 0.97
  // r 为到宁夏中心的距离（shape 空间），返回 1→0 的平滑淡出系数
  const fadeAt = (r) => {
    const t = Math.min(1, Math.max(0, (r - fadeStart) / (fadeEnd - fadeStart)))
    return 1 - t * t * (3 - 2 * t)
  }
  const neighborFillMat = new THREE.MeshBasicMaterial({
    // 邻省填充：暖褐，压暗后退，不再使用科技蓝
    color: new THREE.Color('#3a2b1d'),
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false
  })
  const neighborEdgeMat = new THREE.LineBasicMaterial({
    // 邻省省界：低饱和暖灰（省级边界层级）
    color: new THREE.Color('#a98e5e'),
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
          // z 必须用 +y（与宁夏五市边界线、邻省plate旋转后的约定一致）；
          // 此前误用 -y 导致邻省省界线整体南北镜像（内蒙南界被画到宁夏南侧）
          linePts.push(new THREE.Vector3(x, -0.6, y))
          const a = fadeAt(Math.hypot(x - rCx, y - rCy))
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
      opacity: NEIGHBOR_LABEL_BASE_OPACITY,
      depthWrite: false,
      depthTest: false
    })
    const label = new THREE.Sprite(labelMat)
    const [lx, lz] = project(anchor)
    label.position.set(lx, 1.4, lz)
    // 竖屏缩小省名，减少贴边裁切；base 与 baseScale 供边缘安全区微调时复位使用
    const baseScale = 11
    const labelScale = baseScale * (portraitFraming ? 0.78 : 1)
    label.scale.set(labelScale, labelScale * (140 / 512), 1)
    label.renderOrder = 19
    scene.add(label)

    neighborObjects.push(plate, label)
    neighborLabelSprites.push({ mat: labelMat, sprite: label, base: label.position.clone(), baseScale })
    neighborDisposables.push(labelTex, labelMat)
  }

  // ---- 地形平面 ----
  const [sx0, sy0] = project([minLng, minLat])
  const [sx1, sy1] = project([maxLng, maxLat])
  // 地形实际世界包围盒：平移边界与注视点采样都以它为准，不用硬编码坐标
  terrainBounds = {
    minX: Math.min(sx0, sx1),
    maxX: Math.max(sx0, sx1),
    minZ: Math.min(sy0, sy1),
    maxZ: Math.max(sy0, sy1)
  }
  const worldW = sx1 - sx0
  const worldH = sy1 - sy0
  const centerX = (sx0 + sx1) / 2
  const centerZ = (sy0 + sy1) / 2

  // project() 对经度取负（保证左西右东），worldW 为负；PlaneGeometry 负宽度会翻转
  // 三角面绕序，rotateX 后正面朝下被 FrontSide 剔除。几何体宽度取绝对值修正绕序；
  // worldW 仍保留带符号值，供分层设色着色器的切向量约定使用。
  const planeW = Math.abs(worldW)
  terrainGeometry = new THREE.PlaneGeometry(planeW, worldH, 256, 396)
  terrainGeometry.rotateX(-Math.PI / 2)

  // UV 仍保持 u=0 在西、u=1 在东（与卫星/高程纹理裁剪方向一致）；
  // 宽度取正后 u 方向反转，这里同步翻转 u，使世界坐标→UV 映射与修复前一致。
  const uvAttr = terrainGeometry.attributes.uv
  for (let i = 0; i < uvAttr.count; i++) {
    uvAttr.setX(i, 1 - uvAttr.getX(i))
    uvAttr.setY(i, 1 - uvAttr.getY(i))
  }

  terrainMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.92,
    metalness: 0.06,
    displacementScale: 4,
    displacementBias: 0,
    alphaTest: 0.35,
    // 法线贴图 G 通道与真实南北向高程梯度反相（离线相关 -0.978）。
    // three r186 的 normal_fragment_maps 中 `mapN.xy *= normalScale`，
    // 故将 y 取负即在渲染管线内翻转 G，无需重编码正式纹理 nx_normal.jpg。
    // 1.6 为实测选定强度：1.8/2.0 的局部对比度只提升 0.4%/1.3%（肉眼不可辨），
    // 却在贺兰山暗部出现明显颗粒噪点，故选 1.6 保持自然。
    normalScale: new THREE.Vector2(1.6, -1.6)
  })

  // 离线晕渲（nx_hillshade.png）：DEM 派生的宏观山脊/沟谷光照，按乘法调制漫反射基色。
  // 位移只改顶点、不重算法线，几何法线与法线贴图都只能提供细节层次，
  // 宏观晕渲必须靠这张离线纹理，运行时零额外计算（仅 +1 次片元采样）。
  const hillshadeUniforms = {
    uHillshade: { value: null },
    uHillshadeStrength: { value: 0 }
  }
  terrainMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uHillshade = hillshadeUniforms.uHillshade
    shader.uniforms.uHillshadeStrength = hillshadeUniforms.uHillshadeStrength
    shader.fragmentShader = `
      uniform sampler2D uHillshade;
      uniform float uHillshadeStrength;
    ` + shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
       #ifdef USE_MAP
         if (uHillshadeStrength > 0.0) {
           float hs = texture2D(uHillshade, vMapUv).r;
           diffuseColor.rgb *= mix(1.0, hs, uHillshadeStrength);
         }
       #endif`
    )
  }

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

  Promise.all([loadTex(satUrl, true), loadTex(dispUrl), loadTex(normalUrl), loadTex(hillshadeUrl)]).then(
    ([satTex, dispTex, normTex, hsTex]) => {
      terrainMaterial.map = satTex
      terrainMaterial.displacementMap = dispTex
      terrainMaterial.normalMap = normTex
      // 晕渲加载完成后再启用，避免首帧采样空纹理
      // 灰度晕渲按单通道上传：显存约为 RGBA 的 1/4（1228×1898 含 mipmap 约 3.1MB）
      hsTex.format = THREE.RedFormat
      hillshadeUniforms.uHillshade.value = hsTex
      hillshadeUniforms.uHillshadeStrength.value = 1
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
        // 普通混合：色带以固定不透明度叠加，保留卫星纹理细节，且不会把亮区推成白色
        blending: THREE.NormalBlending,
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
            // 0.02 仅为数值余量：tint 已 depthTest:false，无需 0.15 的抬升，
            // 原 0.15 在斜视时会让叠色边缘相对地形错位约 1px（浮边）
            p.y += h * uDispScale + 0.02;
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

          // 分层设色色带：按宁夏真实高程分布（p25≈1306m / p75≈1796m / p99≈2483m）划分，
          // 暖灰（平原）→ 砂黄（台地黄土）→ 赭石（山地）→ 暖白（高峰），不使用绿色与纯白
          vec3 ramp(float elev) {
            vec3 c1 = vec3(0.549, 0.482, 0.388); // #8C7B63 暖灰
            vec3 c2 = vec3(0.761, 0.659, 0.471); // #C2A878 砂黄
            vec3 c3 = vec3(0.545, 0.271, 0.075); // #8B4513 赭石
            vec3 c4 = vec3(1.000, 0.973, 0.906); // #FFF8E7 暖白
            if (elev < 1200.0) return mix(c1, c2, smoothstep(1050.0, 1200.0, elev));
            if (elev < 1700.0) return mix(c2, c3, smoothstep(1200.0, 1700.0, elev));
            if (elev < 2500.0) return mix(c3, c4, smoothstep(1700.0, 2500.0, elev));
            return c4;
          }

          void main() {
            // satTex alpha 非完美 0/1 mask，宁夏高海拔区 alpha 近 0，用极底阈值过滤界外
            float m = texture2D(uMask, vUv).a;
            if (m < 0.001) discard;
            float raw = clamp((texture2D(uDisp, vUv).x - uVMin) / (uVMax - uVMin), 0.0, 1.0);
            // 高程还原：构建脚本以 952–3493 m 归一化 nx_disp.jpg
            float elev = 952.0 + raw * 2541.0;

            vec3 ld = normalize(vec3(0.45, 0.82, 0.30));
            // 基础地形已由离线晕渲提供宏观明暗，这里只保留极轻的方向调制（0.88–1.0），
            // 避免同一套光照被叠加两次把暗部压死
            float lit = 0.88 + 0.12 * max(dot(normalize(vNormal), ld), 0.0);

            // 普通混合：alpha 控制强度并参与淡入淡出，色带不会截断成白色
            float k = clamp(uOpacity * smoothstep(0.0, 0.4, m), 0.0, 1.0);
            gl_FragColor = vec4(ramp(elev) * lit, k);
          }
        `
      })
      const tintMesh = new THREE.Mesh(terrainGeometry, terrainTintMat)
      tintMesh.position.set(centerX, 0, centerZ)
      tintMesh.renderOrder = 1
      // 默认关闭分层设色：从首帧起就不参与绘制，避免"透明但仍在全程绘制"
      tintMesh.visible = false
      terrainTintMesh = tintMesh
      scene.add(tintMesh)
    }
  )

  const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial)
  terrainMesh.position.set(centerX, 0, centerZ)
  scene.add(terrainMesh)

  // 半球天空色由冷蓝 #dfe9ff 改为暖灰 #d8cbb4，避免给地形叠加科技蓝偏色
  scene.add(new THREE.HemisphereLight(0xd8cbb4, 0x4a3b28, 0.7))
  // 主光保留西北方向（世界坐标 X=西、Z=北），是北半球制图的常规受光方向
  const dirLight = new THREE.DirectionalLight(0xfff4e0, 1.7)
  dirLight.position.set(60, 100, 40)
  scene.add(dirLight)
  // 东南补光降为极低强度（0.35 → 0.12）并去掉高饱和青蓝，避免抵消主光形成的山体明暗
  const fillLight = new THREE.DirectionalLight(0x9fb8c8, 0.12)
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
  // 限制近水平视角：原 π/2−0.03 ≈ 87.3° 会让相机贴到地表甚至进入山体
  controls.maxPolarAngle = Math.PI / 2 - 0.18
  controls.target.set(0, 2, 0)

  // 平移边界：保留平移能力，但把注视点约束在地形包围盒 + 少量缓冲内。
  // 越界时连同相机一起回移相同的世界位移，避免“只挪注视点”造成的视角扭转。
  const clampTargetToTerrain = () => {
    if (!terrainBounds || cameraTween) return
    const t = controls.target
    const nx = Math.min(terrainBounds.maxX + PAN_LIMIT_BUFFER, Math.max(terrainBounds.minX - PAN_LIMIT_BUFFER, t.x))
    const nz = Math.min(terrainBounds.maxZ + PAN_LIMIT_BUFFER, Math.max(terrainBounds.minZ - PAN_LIMIT_BUFFER, t.z))
    const dx = nx - t.x
    const dz = nz - t.z
    if (dx === 0 && dz === 0) return
    t.x = nx
    t.z = nz
    camera.position.x += dx
    camera.position.z += dz
  }
  controls.addEventListener('change', clampTargetToTerrain)

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
    // 古道流光：暖白偏金，替代原冷白 #eaf6ff
    color: new THREE.Color('#ffe9c2'),
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
          // 与地形网格采样保持一致：几何 UV 的 v 分量与纬度线性对应（v=0 南极、v=1 北极），
          // 纹理 flipY=true 使 v=1 取图像第 0 行；而高程纹理第 0 行是北侧，
          // 故图像行号应为 (1 - t) * (H - 1)，此前的 t * H 会把南北取反。
          const u = (lng - minLng) / (maxLng - minLng)
          const t = (lat - minLat) / (maxLat - minLat)
          const px = Math.min(img.width - 1, Math.max(0, Math.round(u * (img.width - 1))))
          const py = Math.min(img.height - 1, Math.max(0, Math.round((1 - t) * (img.height - 1))))
          return ctx.getImageData(px, py, 1, 1).data[0] / 255
        })
      }
      img.src = dispUrl
    })

  const DISP_SCALE = 4
  loadDispSampler().then((sampleGround) => {
    // 供相机注视点高程化复用：与地形位移完全同一套采样与换算，数据未就绪时为 null
    groundSamplerWorld = (lng, lat) => sampleGround(lng, lat) * DISP_SCALE
    arcMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#d9a05b') } },
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
      // POI 颜色层级：国家级=鎏金，自治区级=砂黄，市级=暖灰（与图例一致）
      const color = new THREE.Color(
        item.level === '国家级' ? '#ffc857' : item.level === '自治区级' ? '#c2a878' : '#8c7b63'
      )

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
        const lng = -x / (SCALE * COS_CENTROID) + CENTROID[0]
        const lat = wz / SCALE + CENTROID[1]
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
        label,
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
      // /screen 古道统一琥珀色系（数据层 route.color 供其他页面使用，此处不改）
      const routeColor = ROUTE_AMBER[ri % ROUTE_AMBER.length]
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
          color: new THREE.Color(routeColor),
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
      const rlabelTex = makeRouteLabelTexture(route.name, routeColor)
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
        label: rlabel,
        start: 1.7 + ri * 0.28
      })
    })

    // ---- 邻省参照层地形贴合 ----
    // 根因：邻省参照层plate/line在.then回调之前创建，顶点Y固定在y=-0.85/-0.6，
    // 完全无视DEM地形位移；而宁夏五市fillGeo顶点已贴合DEM（抬升0~4世界单位），
    // 导致省界衔接处出现垂直高度差，视觉上像"坐标系不匹配"。
    // 修复：遍历neighborObjects中的plate和line，反算经纬度后采样DEM得到正确Y值。
    const NEIGHBOR_OFFSET = -0.35 // 邻省比宁夏五市略低一点，保证层级关系清晰

    neighborObjects.forEach((obj) => {
      if (obj.isMesh && obj.geometry?.isExtrudeGeometry) {
        // plate: ExtrudeGeometry + rotation.x=-PI/2 + position.y=-0.85
        // 先烘焙rotation和position到顶点，再覆盖为世界坐标 + 地形Y
        const geo = obj.geometry
        const pos = geo.attributes.position
        for (let i = 0; i < pos.count; i++) {
          const lx = pos.getX(i) // shape.x = -(lng-C[0])*SCALE*cos
          const ly = pos.getY(i) // shape.y = -(lat-C[1])*SCALE
          // 反算经纬度
          const lng = -lx / (SCALE * COS_CENTROID) + CENTROID[0]
          const lat = -ly / SCALE + CENTROID[1]
          const groundY = sampleGround(lng, lat) * DISP_SCALE + NEIGHBOR_OFFSET
          pos.setX(i, lx)
          pos.setY(i, groundY)
          pos.setZ(i, -ly)
        }
        pos.needsUpdate = true
        // 清除变换（已烘焙进顶点）
        obj.rotation.set(0, 0, 0)
        obj.position.set(0, 0, 0)
      } else if (obj.isLine && obj.geometry) {
        // line: BufferGeometry，顶点已是世界空间 (x, -0.6, +y_project)
        const geo = obj.geometry
        const pos = geo.attributes.position
        for (let i = 0; i < pos.count; i++) {
          const wx = pos.getX(i)
          const wz = pos.getZ(i)
          // 反算经纬度（z=+y_project）
          const lng = -wx / (SCALE * COS_CENTROID) + CENTROID[0]
          const lat = wz / SCALE + CENTROID[1]
          const groundY = sampleGround(lng, lat) * DISP_SCALE + NEIGHBOR_OFFSET
          pos.setY(i, groundY)
        }
        pos.needsUpdate = true
      }
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
      // 同一拾取位置若覆盖多个点位（如回族刺绣与同心清真小吃坐标完全重合），
      // 连续点击按命中顺序轮换选中，保证重叠范围内每个 POI 仍可访问；原始坐标不变
      const items = []
      for (const h of itemHits) {
        const it = h.object.userData.item
        if (it && !items.some((x) => x.id === it.id)) items.push(it)
      }
      if (items.length > 1) {
        const cur = selected.value ? items.findIndex((i) => i.id === selected.value.id) : -1
        selected.value = items[(cur + 1) % items.length]
      } else {
        selected.value = items[0]
      }
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
    // 拖动超过点击阈值：视为用户手动接管镜头，预设视角高亮失效
    if (pointerDownAt && Math.hypot(e.clientX - pointerDownAt.x, e.clientY - pointerDownAt.y) > 6) {
      activeViewpoint.value = ''
    }
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
  // 滚轮缩放同样视为用户接管镜头：取消飞行并清除预设视角高亮
  onWheelHandler = () => {
    cameraTween = null
    activeViewpoint.value = ''
  }
  renderer.domElement.addEventListener('pointerdown', onDownHandler)
  renderer.domElement.addEventListener('click', onClickHandler)
  renderer.domElement.addEventListener('pointermove', onMoveHandler)
  renderer.domElement.addEventListener('pointerleave', onLeaveHandler)
  renderer.domElement.addEventListener('wheel', onWheelHandler, { passive: true })

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
      // 市名按相机距离淡出：默认/中景完整可读，极限放大时平滑隐去，避免 Sprite 铺满视口
      c.label.getWorldPosition(_labelWorldTmp)
      const labelFade = labelFadeByDistance(camera.position.distanceTo(_labelWorldTmp))
      const tLabel = (isActive ? 1 : anyCity ? 0.35 : 0.85) * labelFade

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
      // 古道标牌同样按相机距离淡出，避免近距离放大遮挡地形
      r.label.getWorldPosition(_labelWorldTmp)
      const labelFade = labelFadeByDistance(camera.position.distanceTo(_labelWorldTmp))
      r.labelMat.opacity = e * (uiState.route && !isFocus ? 0.3 : 1) * labelFade
    }

    // ---- 邻省省名按相机距离淡出 + 屏幕边缘安全区微调 ----
    // 与市名/古道共用 38/68 阈值：默认远景完整显示，逼近时平滑隐去，避免铺满视口。
    // 边缘微调只在文字会越出视口时，把 Sprite 沿相机右/上方向平移最少距离；
    // 地理锚点不变，偏移量随投影连续变化，因此推拉/缩放时不会跳变。
    camera.updateMatrixWorld()
    for (const n of neighborLabelSprites) {
      n.sprite.position.copy(n.base)
      n.sprite.getWorldPosition(_labelWorldTmp)
      const dist = camera.position.distanceTo(_labelWorldTmp)
      const fade = labelFadeByDistance(dist)
      n.mat.opacity = NEIGHBOR_LABEL_BASE_OPACITY * fade
      if (fade <= 0.02) continue
      _labelNdcTmp.copy(_labelWorldTmp).project(camera)
      const halfV = Math.tan((camera.fov * Math.PI) / 360)
      const px = dist * halfV * camera.aspect
      const py = dist * halfV
      // 贴图有透明留白，按 0.86 估算实际文字半宽/半高
      const halfW = ((n.sprite.scale.x * 0.86) / 2) / px
      const halfH = ((n.sprite.scale.y * 0.86) / 2) / py
      const limX = Math.max(0, NEIGHBOR_SAFE_NDC - halfW)
      const limY = Math.max(0, NEIGHBOR_SAFE_NDC - halfH)
      const nx = Math.min(limX, Math.max(-limX, _labelNdcTmp.x))
      const ny = Math.min(limY, Math.max(-limY, _labelNdcTmp.y))
      if (nx === _labelNdcTmp.x && ny === _labelNdcTmp.y) continue
      _camRightTmp.setFromMatrixColumn(camera.matrixWorld, 0)
      _camUpTmp.setFromMatrixColumn(camera.matrixWorld, 1)
      n.sprite.position
        .addScaledVector(_camRightTmp, (nx - _labelNdcTmp.x) * px)
        .addScaledVector(_camUpTmp, (ny - _labelNdcTmp.y) * py)
    }

    // ---- 地形分层设色：透明 ↔ 有色 平滑过渡 ----
    if (terrainTintMat && terrainTintMesh) {
      // 0.38 为普通混合下的目标不透明度：能读出高程色带，又保留卫星纹理细节
      const tintTarget = showTerrain.value ? 0.38 : 0
      const u = terrainTintMat.uniforms.uOpacity
      if (showTerrain.value) terrainTintMesh.visible = true
      u.value += (tintTarget - u.value) * 0.12
      // 淡出到位后彻底停止绘制（关闭态不再产生任何片元开销）
      if (!showTerrain.value && u.value < 0.004) {
        u.value = 0
        terrainTintMesh.visible = false
      }
    }

    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // 尺寸同步：只在布局稳定后读取容器尺寸，避免 resize 事件早于 flex/媒体查询重排时读到上一帧尺寸
  const syncRendererSize = () => {
    resizeFrame = 0
    if (!renderer || !camera || !container) return
    const w = container.clientWidth
    const h = container.clientHeight
    if (!w || !h) return
    // 尺寸未变则跳过：既避免重复更新，也避免 ResizeObserver 与 renderer.setSize 相互触发
    if (w === lastContainerW && h === lastContainerH) return
    lastContainerW = w
    lastContainerH = h
    isNarrow.value = window.innerWidth <= 1024
    // 旋转/缩窗进入窄屏时同步互斥，避免残留的抽屉面板压住已打开的详情卡
    if (isNarrow.value && selected.value) mobilePanel.value = 0
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const pr = Math.min(window.devicePixelRatio || 1, 2)
    if (renderer.getPixelRatio() !== pr) renderer.setPixelRatio(pr)
    renderer.setSize(w, h)
    // 旋转/缩窗后重新判定竖屏构图：尺寸或比例变化时按当前预设视角重建取景
    const nextAspect = w / h
    const aspectChanged = Math.abs(nextAspect - lastCameraAspect) > 0.02
    lastCameraAspect = nextAspect
    const nextPortrait = window.innerWidth <= 900 && nextAspect < 0.9
    const framingChanged = nextPortrait !== portraitFraming
    portraitFraming = nextPortrait
    const neighborScale = 11 * (portraitFraming ? 0.78 : 1)
    for (const n of neighborLabelSprites) {
      n.sprite.scale.set(neighborScale, neighborScale * (140 / 512), 1)
    }
    if ((framingChanged || aspectChanged) && activeViewpoint.value) applyViewpoint(activeViewpoint.value, true)
    charts.forEach((c) => c && c.resize())
  }
  // 合并同一帧内的多次请求（连续拖拽窗口只更新一次）
  resizeHandler = () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(syncRendererSize)
  }
  window.addEventListener('resize', resizeHandler)
  // 容器自身尺寸变化（侧栏宽度切换等）不一定会触发 window resize，用 ResizeObserver 兜底
  if (typeof ResizeObserver !== 'undefined') {
    containerResizeObserver = new ResizeObserver(resizeHandler)
    containerResizeObserver.observe(container)
  }
  syncRendererSize()

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

// 世界坐标 → 地表高度（世界单位）：project() 的解析逆变换 + 现有 DEM 采样器。
// 越界、DEM 尚未加载或采样异常时返回 null，由调用方回退到原固定高度。
function groundWorldAt(x, z) {
  if (!groundSamplerWorld || !terrainBounds) return null
  const pad = 2
  if (x < terrainBounds.minX - pad || x > terrainBounds.maxX + pad) return null
  if (z < terrainBounds.minZ - pad || z > terrainBounds.maxZ + pad) return null
  const lng = CENTROID[0] - x / (SCALE * COS_CENTROID)
  const lat = CENTROID[1] + z / SCALE
  const h = groundSamplerWorld(lng, lat)
  return Number.isFinite(h) ? h : null
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
  activeViewpoint.value = '' // 聚焦地市后不再对应任何预设视角
  const entry = cityEntries.find((c) => c.name === name)
  const [cx, cyN] = project(cityDef.center)
  // 注视点高程化：按城市真实位置的 DEM 高度抬升，并等量抬高相机以保持既有构图；
  // 采样未就绪/越界时回退到原固定 0.8，避免 NaN 或镜头跳变
  const groundY = groundWorldAt(cx, cyN)
  const targetY = groundY === null ? 0.8 : groundY + TARGET_GROUND_CLEARANCE
  const lift = targetY - 0.8
  const target = new THREE.Vector3(cx, targetY, cyN)
  const span = entry?.latSpan ?? 1
  const d = 42 + span * 13
  flyCamera(new THREE.Vector3(cx, d * 0.98 + lift, cyN - d), target)
}

function resetView() {
  activeViewpoint.value = 'all'
  const pose = defaultCameraPose()
  flyCamera(pose.pos, pose.target)
}

// 切换预设观赏视角：复用 flyCamera 的缓动与中断机制
// instant=true 仅用于屏幕比例变化时立即重建当前视角构图，不播放动画
function applyViewpoint(id, instant = false) {
  const vp = viewpoints.find((v) => v.id === id)
  if (!vp) return
  activeViewpoint.value = id
  if (vp.id === 'all') {
    const pose = defaultCameraPose()
    if (instant) {
      camera.position.copy(pose.pos)
      controls.target.copy(pose.target)
      controls.update()
    } else {
      flyCamera(pose.pos, pose.target, 1.5)
    }
    return
  }
  // 注视点按 DEM 高程化；相机与注视点同步抬升，保持审计确定的构图与俯角
  const groundY = groundWorldAt(vp.x, vp.z)
  const targetY = groundY === null ? vp.baseY : groundY + TARGET_GROUND_CLEARANCE
  // 竖屏采用更陡的俯角；手机竖屏略收近前距提高占比，平板竖屏适度拉远避免两侧被裁切
  const ratio = viewPitchRatio()
  const spanScale = !portraitFraming ? 1 : camera.aspect < 0.6 ? 0.92 : 1.12
  const pos = new THREE.Vector3(vp.x, targetY + ratio * vp.L * spanScale, vp.z - vp.L * spanScale)
  const target = new THREE.Vector3(vp.x, targetY, vp.z)
  if (instant) {
    camera.position.copy(pos)
    controls.target.copy(target)
    controls.update()
    return
  }
  flyCamera(pos, target, 1.5)
}

function toggleDim(dim, val) {
  uiState[dim] = uiState[dim] === val ? '' : val
  if (dim === 'city') {
    if (uiState.city) focusCity(uiState.city)
    else resetView()
    syncGlobalSelection({ city: uiState.city }, 'screen')
  }
  if (dim === 'route') syncGlobalSelection({ route: uiState.route }, 'screen')
}

function clearDim(dim) {
  if (dim === 'itemId') {
    selected.value = null
    return
  }
  uiState[dim] = ''
  if (dim === 'city') {
    resetView()
    syncGlobalSelection({ city: '' }, 'screen')
  }
  if (dim === 'route') syncGlobalSelection({ route: '' }, 'screen')
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
  syncGlobalSelection({ city: '', route: '' }, 'screen')
}

// ========== 跨页联动（地图 → 大屏） ==========
// 页面挂载时恢复选中态：URL 查询参数优先（可分享深链），其次全局选中态（SPA 跨页带入）
onMounted(() => {
  const city = route.query.city || globalSelection.city
  const routeName = route.query.route || globalSelection.route
  const itemId = route.query.id
  if (city) {
    uiState.city = city
    setTimeout(() => focusCity(city), 300)
  }
  if (routeName) uiState.route = routeName
  // 深链 ?id= 直接打开该项目的下钻卡片
  if (itemId !== undefined && itemId !== '') {
    selected.value = heritageData.find(d => String(d.id) === String(itemId)) || null
  }
})

// 外部（地图等）改动全局状态时同步本地（来源是自己则跳过，避免循环）
watch(() => [globalSelection.city, globalSelection.route], ([c, r]) => {
  if (globalSelection.source === 'screen') return
  if (uiState.city !== (c || '')) {
    uiState.city = c || ''
    if (c) focusCity(c)
    else resetView()
  }
  if (uiState.route !== (r || '')) uiState.route = r || ''
})

// ---- URL 状态化：?city=&route=&id=（可分享链接，浏览器前进/后退可回退） ----
// 双向同步以"值相等即跳过"的幂等比较打断 state→URL→state 的循环
const writeUrl = () => {
  const next = { ...route.query }
  delete next.city; delete next.route; delete next.id
  if (uiState.city) next.city = uiState.city
  if (uiState.route) next.route = uiState.route
  if (selected.value?.id) next.id = String(selected.value.id)
  const cur = route.query
  if ((cur.city || '') === (next.city || '') &&
      (cur.route || '') === (next.route || '') &&
      (cur.id || '') === (next.id || '')) return
  // 用 push 而非 replace：每次选中态变化都是一个历史记录，浏览器后退即可逐级回退选中态
  router.push({ query: next })
}
watch([() => uiState.city, () => uiState.route, () => selected.value?.id], writeUrl)

// 前进/后退或直接粘贴带参数的链接 → 应用到本地状态
watch([() => route.query.city, () => route.query.route, () => route.query.id], ([c, r, id]) => {
  const city = c || ''
  const routeName = r || ''
  const itemId = id === undefined ? '' : String(id)
  if (uiState.city !== city) {
    uiState.city = city
    if (city) focusCity(city)
    else resetView()
  }
  if (uiState.route !== routeName) uiState.route = routeName
  if (String(selected.value?.id || '') !== itemId) {
    selected.value = itemId ? heritageData.find(d => String(d.id) === itemId) || null : null
  }
})

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
  // 窄屏互斥：详情卡打开时收起抽屉面板，保证卡片完整可见、按钮可操作
  if (v && isNarrow.value) mobilePanel.value = 0
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
  ctx.fillStyle = '#fff3da'
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

  // 类别色板改为品牌色系（鎏金/琥珀/赭石 + 低饱和对比色），去掉青蓝
  const palette = ['#ffc857', '#d9a05b', '#c792ea', '#7ee787', '#ff9d76', '#e8c468', '#f78c6c']
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
            { offset: 0, color: '#8b4513' }, { offset: 1, color: '#c9a84c' }
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
  if (resizeFrame) cancelAnimationFrame(resizeFrame)
  containerResizeObserver?.disconnect()
  containerResizeObserver = null
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (renderer) {
    onDownHandler && renderer.domElement.removeEventListener('pointerdown', onDownHandler)
    onClickHandler && renderer.domElement.removeEventListener('click', onClickHandler)
    onMoveHandler && renderer.domElement.removeEventListener('pointermove', onMoveHandler)
    onLeaveHandler && renderer.domElement.removeEventListener('pointerleave', onLeaveHandler)
    onWheelHandler && renderer.domElement.removeEventListener('wheel', onWheelHandler)
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
  background: linear-gradient(90deg, #c9a84c, #e8c468);
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
  &.lv-自治区级 { color: #c2a878; }
  &.lv-市级 { color: #a99b86; }
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
  border: 1px solid rgba(201, 168, 76, 0.42);
  border-radius: var(--radius-full);
  background: rgba(33, 23, 17, 0.78);
  backdrop-filter: blur(6px);
  font-size: 12px;
  color: #e8d9b0;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: rgba(201, 168, 76, 0.18); }
  &.is-on { border-color: rgba(201, 168, 76, 0.75); background: rgba(201, 168, 76, 0.16); }
  .reset-ico { font-size: 14px; line-height: 1; }
}

.chip-wrap { display: contents; }

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px 5px 12px;
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: var(--radius-full);
  background: rgba(33, 23, 17, 0.82);
  font-size: 12px;
  color: #ffe9c2;
  cursor: pointer;

  i { font-style: normal; opacity: 0.6; }
  &:hover { border-color: #c9a84c; }
}

.chip-enter-active, .chip-leave-active { transition: all 0.25s var(--ease-out); }
.chip-enter-from, .chip-leave-to { opacity: 0; transform: translateY(-6px); }

/* ---- 观赏视角切换器 ---- */
/* 置于场景右侧中部：不遮挡左上筛选栏、左下地形图例与中央地形主体 */
.viewpoint-switcher {
  position: absolute;
  top: 50%;
  right: 16px;
  z-index: 6;
  display: flex;
  flex-direction: column;
  padding: 10px 7px 9px 9px;
  border: 1px solid rgba(212, 160, 23, 0.22);
  border-radius: 3px;
  background: rgba(26, 19, 14, 0.78);
  backdrop-filter: blur(6px);
  transform: translateY(-50%);

  .vs-caption {
    padding: 0 7px 7px;
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(255, 248, 231, 0.4);
    white-space: nowrap;
  }

  .vs-item {
    display: flex;
    align-items: baseline;
    gap: 7px;
    padding: 6px 9px 6px 8px;
    border: none;
    border-left: 2px solid transparent;
    background: transparent;
    font-family: inherit;
    font-size: 12.5px;
    letter-spacing: 1.5px;
    color: rgba(255, 248, 231, 0.6);
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;

    .vs-index {
      font-style: normal;
      font-size: 10px;
      letter-spacing: 0;
      color: rgba(212, 160, 23, 0.5);
      transition: color 0.2s;
    }

    &:hover {
      color: #ffe9bd;
      background: rgba(212, 160, 23, 0.07);
    }

    &.is-active {
      border-left-color: #d4a017;
      background: rgba(212, 160, 23, 0.1);
      color: #ffd98a;

      .vs-index { color: #d4a017; }
    }
  }
}

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
  .lg-dot.green { background: #c2a878; box-shadow: 0 0 7px #c2a878; }
  .lg-dot.bluegray { background: #a99b86; box-shadow: 0 0 7px #a99b86; }

  .lg-route {
    display: inline-flex;
    align-items: center;
    gap: 5px;

    i {
      width: 18px;
      height: 3px;
      border-radius: 2px;
      background: linear-gradient(90deg, #8b4513, #c9a84c 55%, #e8c468);
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
.poi-level.is-local { background: rgba(194, 168, 120, 0.14); color: #c2a878; border: 1px solid rgba(194, 168, 120, 0.38); }
.poi-cat { background: rgba(255, 255, 255, 0.07); color: rgba(255, 248, 231, 0.65); }

.poi-name { margin: 0 0 6px; font-family: var(--font-display); font-size: 19px; font-weight: 600; color: #fff8e7; }
.poi-meta { margin: 0 0 12px; font-size: 12px; color: rgba(255, 248, 231, 0.5); }
.poi-intro { margin: 0 0 16px; font-size: 13px; line-height: 1.7; color: rgba(255, 248, 231, 0.78); }

// 实景三维场景内嵌（3DGS 条目）
.poi-scene {
  margin: 0 0 16px;
  border: 1px solid rgba(212, 160, 23, 0.35);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #12100c;
}

.poi-scene-frame {
  display: block;
  width: 100%;
  height: 170px;
  border: 0;
}

// 器物参照三维转盘（无实景场景的条目，按类别映射 CC0 器物）
.poi-artifact {
  position: relative;
  margin: 0 0 16px;
  height: 150px;
  border: 1px solid rgba(212, 160, 23, 0.22);
  border-radius: var(--radius-md);
  background: radial-gradient(ellipse at 50% 82%, rgba(212, 160, 23, 0.12), transparent 62%),
              linear-gradient(160deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.18));
  overflow: hidden;
}

.poi-artifact-label {
  position: absolute;
  left: 8px;
  bottom: 6px;
  font-size: 10.5px;
  letter-spacing: 1px;
  color: rgba(255, 248, 231, 0.45);
  pointer-events: none;
}

// 无可靠对应模型时的中性占位（不展示任何与项目语义不符的通用器物）
.poi-artifact-empty {
  height: 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-style: dashed;
  border-color: rgba(255, 248, 231, 0.14);
  background: rgba(255, 255, 255, 0.02);

  .poi-artifact-empty-title {
    font-size: 12.5px;
    letter-spacing: 1px;
    color: rgba(255, 248, 231, 0.55);
  }

  .poi-artifact-empty-note {
    font-size: 10.5px;
    letter-spacing: 0.5px;
    color: rgba(255, 248, 231, 0.32);
  }
}

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

  // 浮层互斥：详情卡打开时图例隐藏，避免遮挡卡片按钮；抽屉面板在详情卡出现时已自动收起
  .stage-legend.is-hidden { display: none; }
  // 窄屏下详情卡可能高于可视区，允许内部滚动保证文字/按钮完整可达
  .poi-card { max-height: calc(100% - 40px); overflow-y: auto; z-index: 16; }
}

// 竖屏（含平板 768×1024）：切换器从右侧中部上移到地形上方的空白区，避免压住地形主体
@media (max-aspect-ratio: 9/10) and (max-width: 1024px) {
  .viewpoint-switcher { top: 96px; transform: none; }
}

@media (max-width: 560px) {
  // 标题栏：窄屏压缩字距与左右内边距，避免标题被挤压换行 / 与右侧按钮相撞
  .screen-header { padding: 0 12px; height: 54px; gap: 8px; }
  .title-group { min-width: 0; }
  .screen-title {
    font-size: 15px;
    letter-spacing: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .back-btn { flex: none; }
  .back-ico { font-size: 18px; }
  .header-right { flex: none; }
  .panel-toggle { padding: 4px 10px; font-size: 11.5px; }
  .clock { display: none; }

  .poi-card { top: auto; right: 12px; bottom: 12px; left: 12px; width: auto; max-height: calc(100% - 24px); }

  // 图例：收紧内边距与条目间距，避免在 390 宽度下几乎占满整行
  .stage-legend { left: 10px; bottom: 10px; gap: 10px; padding: 6px 10px; font-size: 11px; }
  .stage-legend .lg-route i { width: 14px; }

  // 筛选栏：缩小按钮内边距与间距，chip 换行后仍保持两行以内的高度
  .filter-bar { top: 8px; left: 8px; gap: 6px; max-width: calc(100% - 16px); }
  .reset-btn, .layer-btn {
    padding: 5px 10px;
    font-size: 11.5px;
    gap: 4px;

    .reset-ico { font-size: 12px; }
  }
  .chip { padding: 4px 6px 4px 10px; font-size: 11.5px; }

  // 视角切换器：改为底部紧凑横条，横向铺开贴底排列，让出地形中部空间；
  // 四个预设入口全部保留，触达高度仍 ≥28px
  .viewpoint-switcher {
    top: auto;
    right: 10px;
    bottom: 46px;
    left: 10px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 3px;
    padding: 5px 7px;
    transform: none;

    .vs-caption { padding: 0 4px 0 0; font-size: 9px; letter-spacing: 0.5px; }
    .vs-item {
      flex: 1 1 auto;
      justify-content: center;
      align-items: center;
      gap: 3px;
      padding: 7px 4px;
      border-left: none;
      border-bottom: 2px solid transparent;
      font-size: 10.5px;
      letter-spacing: 0;

      .vs-index { font-size: 9px; }

      &.is-active {
        border-left-color: transparent;
        border-bottom-color: #d4a017;
        background: rgba(212, 160, 23, 0.1);
      }
    }
  }
}
</style>
