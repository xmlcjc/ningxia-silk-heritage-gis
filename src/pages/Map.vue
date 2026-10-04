<template>
  <div class="map-page">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-bg">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <Icon class="badge-icon" icon="gis:map" />
            <span class="badge-text">GIS 时空可视化平台</span>
          </div>
          <h1 class="hero-title">丝路非遗 GIS 地图</h1>
          <p class="hero-subtitle">探索宁夏丝路非遗的空间分布格局与历史演变脉络</p>
          <div class="hero-stats">
            <div class="hero-stat-item">
              <span class="stat-num">{{ heritageData.length }}</span>
              <span class="stat-label">非遗点位</span>
            </div>
            <div class="hero-stat-separator">|</div>
            <div class="hero-stat-item">
              <span class="stat-num">{{ categories.length - 1 }}</span>
              <span class="stat-label">遗产类别</span>
            </div>
            <div class="hero-stat-separator">|</div>
            <div class="hero-stat-item">
              <span class="stat-num">{{ filteredData.length }}</span>
              <span class="stat-label">当前显示</span>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="#FFF8E7" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"/>
        </svg>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <div class="map-container">
        <!-- 左侧工具栏 -->
        <aside class="map-sidebar card-silk">
          <div class="sidebar-header">
            <div class="header-icon-wrapper">
              <Icon class="header-icon" icon="gis:map" width="26" height="26" style="color:#FDF6E3" />
            </div>
            <h2>丝路非遗地图</h2>
            <p>探索宁夏丝路非遗的时空分布</p>
          </div>

          <!-- 搜索框 -->
          <div class="search-section">
            <div class="search-wrapper">
              <Icon class="search-icon" icon="gis:zoom-in" />
              <input 
                type="text" 
                v-model="searchKeyword" 
                placeholder="搜索非遗项目名称..."
                class="custom-input"
              />
              <button v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''">×</button>
            </div>
          </div>

          <!-- 筛选条件 -->
          <div class="filter-section">
            <div class="section-title-with-icon">
              <Icon class="icon" icon="gis:map-bookmark" />
              <h4>筛选条件</h4>
            </div>
            
            <div class="filter-group">
              <label>
                <Icon class="label-icon" icon="gis:poi" />
                地市
              </label>
              <el-select 
                v-model="filters.city" 
                placeholder="选择地市" 
                clearable
                class="custom-select"
              >
                <el-option v-for="city in cities" :key="city" :label="city" :value="city" />
              </el-select>
            </div>

            <div class="filter-group">
              <label>
                <Icon class="label-icon" icon="gis:color" />
                非遗类别
              </label>
              <el-select 
                v-model="filters.category" 
                placeholder="选择类别" 
                clearable
                class="custom-select"
              >
                <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
              </el-select>
            </div>

            <div class="filter-group">
              <label>
                <Icon class="label-icon" icon="gis:map-time" />
                历史时期
              </label>
              <el-select 
                v-model="filters.period" 
                placeholder="选择时期" 
                clearable
                class="custom-select"
              >
                <el-option v-for="p in periods" :key="p" :label="p" :value="p" />
              </el-select>
            </div>

            <div class="filter-group">
              <label>
                <Icon class="label-icon" icon="gis:flag" />
                保护等级
              </label>
              <el-select 
                v-model="filters.level" 
                placeholder="选择等级" 
                clearable
                class="custom-select"
              >
                <el-option v-for="l in levels" :key="l" :label="l" :value="l" />
              </el-select>
            </div>

            <button class="btn-reset" @click="resetFilters">
              <Icon icon="gis:rotate" width="15" height="15" /> 重置所有筛选
            </button>
          </div>

          <!-- 图层控制 -->
          <div class="layers-section">
            <div class="section-title-with-icon">
              <Icon class="icon" icon="gis:layers" />
              <h4>图层控制</h4>
            </div>
            
            <div class="layer-list">
              <label class="layer-item" v-for="(enabled, layer) in layers" :key="layer">
                <input type="checkbox" v-model="layers[layer]" />
                <div class="layer-tile" :class="{ 'active': enabled }">
                  <span class="layer-dot"></span>
                </div>
                <span class="layer-name">{{ layerLabels[layer] }}</span>
                <span class="layer-switch">
                  <span class="switch-knob" :class="{ 'checked': enabled }"></span>
                </span>
              </label>
            </div>
          </div>

          <!-- 时间轴 -->
          <div class="timeline-section">
            <div class="section-title-with-icon">
              <Icon class="icon" icon="gis:map-time" />
              <h4>历史时期</h4>
              <button class="play-btn" :title="playing ? '暂停' : '播放演变'" @click="togglePlay">
                <svg v-if="playing" viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <rect x="4" y="3" width="5.5" height="18" rx="1"/>
                  <rect x="14.5" y="3" width="5.5" height="18" rx="1"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M6 3.5v17a1 1 0 0 0 1.53.85l13-8.5a1 1 0 0 0 0-1.7l-13-8.5A1 1 0 0 0 6 3.5z"/>
                </svg>
              </button>
            </div>
            
            <div class="timeline-wrapper">
              <input 
                type="range" 
                v-model="timeValue" 
                min="0" 
                max="4"
                step="1"
                class="timeline-slider"
              />
              <div class="timeline-marks">
                <span v-for="(label, index) in timeMarks" :key="index" 
                      :class="{ active: parseInt(timeValue) === index }">
                  {{ label }}
                </span>
              </div>
              <div class="current-period">
                <Icon class="period-icon" icon="gis:pyramid" />
                {{ currentPeriod }}
              </div>
            </div>
          </div>
        </aside>

        <!-- 地图主区域 -->
        <main class="map-main">
          <div class="map-view">
            <!-- Leaflet 真实地图容器（v-show 保持地图实例存活，切换列表视图后无需重建） -->
            <div v-show="viewMode === 'map'" id="heritage-leaflet-map" class="leaflet-container"></div>

            <!-- 列表视图覆盖层 -->
            <transition name="slide-up">
              <div v-if="viewMode === 'list'" class="list-view-overlay">
                <div class="list-header">
                  <h3>非遗项目列表</h3>
                  <span class="list-count">{{ filteredData.length }} 项结果</span>
                </div>
                <div class="list-items">
                  <div
                    class="list-item"
                    v-for="item in filteredData"
                    :key="item.id"
                    @click="openItemPreview(item)"
                  >
                    <div class="item-image">
                      <span class="item-char">{{ item.name.charAt(0) }}</span>
                      <img :src="item.thumbImage" :alt="item.name" loading="lazy" @error="onImgError">
                    </div>
                    <div class="item-content">
                      <div class="item-header">
                        <h4>{{ item.name }}</h4>
                        <span class="item-badge" :class="'badge-' + (item.level?.includes('国家级') ? 'gold' : 'silver')">
                          {{ item.level }}
                        </span>
                      </div>
                      <p>{{ item.intro.substring(0, 100) }}...</p>
                      <div class="item-tags">
                        <span class="tag-sm tag-category">{{ item.category }}</span>
                        <span class="tag-sm tag-location"><Icon icon="gis:poi" width="12" height="12" /> {{ item.city }}</span>
                        <span class="tag-sm tag-period"><Icon icon="gis:map-time" width="12" height="12" /> {{ item.period }}</span>
                      </div>
                    </div>
                    <div class="item-action">
                      <span class="action-arrow">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 地图工具栏 -->
            <div class="floating-toolbar">
              <button class="toolbar-btn"
                      :title="viewMode === 'map' ? '切换为列表视图' : '切换为地图视图'"
                      @click="toggleView">
                <Icon class="toolbar-icon" :icon="viewMode === 'map' ? 'gis:grid' : 'gis:map'" />
              </button>
              <button class="toolbar-btn" title="缩放至全图" @click="zoomToFit">
                <Icon class="toolbar-icon" icon="gis:extent" />
              </button>
              <button class="toolbar-btn" :class="{ active: measureActive }"
                      :title="measureActive ? '结束测距' : '测量距离'"
                      @click="toggleMeasure">
                <Icon class="toolbar-icon" icon="gis:measure" />
              </button>
              <button class="toolbar-btn" title="打印地图" @click="printMap">
                <Icon class="toolbar-icon" icon="gis:map-print" />
              </button>
              <button class="toolbar-btn" title="全屏地图" @click="toggleFullscreen">
                <Icon class="toolbar-icon" icon="gis:full-screen" />
              </button>
            </div>

            <!-- 测距提示 -->
            <transition name="hint-fade">
              <div v-if="measureActive" class="measure-hint">
                <Icon class="vam" icon="gis:measure-line" width="14" height="14" /> 单击地图添加测点 · 双击结束测量 · Esc 取消
              </div>
            </transition>

            <!-- 古道聚焦信息卡 -->
            <transition name="card-slide">
              <div v-if="focusedRoute" class="route-focus-card card-silk">
                <button class="route-card-close" @click="exitFocus">×</button>
                <div class="route-card-head">
                  <span class="route-card-line" :style="{ background: focusedRoute.color }"></span>
                  <div class="route-card-headtext">
                    <h3>{{ focusedRoute.name }}</h3>
                    <span class="route-card-meta"><Icon class="vam" icon="gis:layer-road" width="14" height="14" /> 估算里程约 {{ focusedRouteLength }} 公里</span>
                  </div>
                </div>
                <p class="route-card-desc">{{ focusedRoute.desc }}</p>
                <p class="route-card-chartnote">下方数据图表已联动高亮该古道沿线非遗（再次点击古道取消）</p>
                <div class="route-card-items-title">
                  沿线非遗 <em>{{ focusedRouteItems.length }}</em> 项
                </div>
                <div class="route-card-items">
                  <button
                    v-for="h in focusedRouteItems"
                    :key="h.id"
                    class="route-item-chip"
                    @click="flyToRouteItem(h)"
                  >
                    <span class="chip-name">{{ h.name }}</span>
                    <span class="chip-level">{{ h.level }}</span>
                  </button>
                </div>
              </div>
            </transition>

            <!-- 图例 -->
            <div class="map-legend card-silk" :class="{ collapsed: legendCollapsed }">
              <button class="legend-toggle" @click="legendCollapsed = !legendCollapsed">
                <span>{{ legendCollapsed ? '▸' : '▾' }}</span> 图例
              </button>
              <div v-show="!legendCollapsed" class="legend-body">
                <div v-if="layers.heritage" class="legend-group">
                  <div class="legend-row">
                    <span class="sample-marker national"><Icon icon="gis:flag-b" width="16" height="16" style="color:#C99A1E" /></span> 国家级
                  </div>
                  <div class="legend-row">
                    <span class="sample-marker regional"><Icon icon="gis:poi" width="16" height="16" style="color:#8B4513" /></span> 自治区级
                  </div>
                  <div class="legend-row">
                    <span class="sample-marker county"></span> 县级及以下
                  </div>
                </div>
                <div v-if="layers.routes" class="legend-group">
                  <div v-for="r in silkRoadRoutes" :key="r.id" class="legend-row">
                    <span class="sample-line" :style="{ background: r.color }"></span>{{ r.name }}
                  </div>
                </div>
                <div v-if="layers.yellowRiver" class="legend-group">
                  <div class="legend-row">
                    <span class="sample-line river"></span>黄河
                  </div>
                </div>
                <div v-if="layers.heatmap" class="legend-group">
                  <div class="legend-row">
                    <span class="sample-heat"></span>密集辐射范围
                  </div>
                </div>
                <div v-if="layers.choropleth" class="legend-group">
                  <div class="legend-row">
                    <span class="sample-grad"></span>地市非遗数量 少 → 多
                  </div>
                </div>
                <div v-if="!layers.heritage && !layers.routes && !layers.yellowRiver && !layers.heatmap && !layers.choropleth"
                     class="legend-empty">所有图层已关闭</div>
              </div>
            </div>

            <!-- 底图切换 -->
            <div class="base-switcher">
              <button
                v-for="b in baseOptions"
                :key="b.key"
                :class="{ active: activeBase === b.key }"
                :title="b.label + '底图'"
                @click="switchBase(b.key)"
              >
                <Icon v-if="b.key === 'standard'" icon="gis:map" class="base-icon" />
                <Icon v-else-if="b.key === 'imagery'" icon="gis:satellite" class="base-icon" />
                <Icon v-else icon="gis:height-map" class="base-icon" />
                <span class="base-label">{{ b.label }}</span>
              </button>
            </div>

            <!-- 实时经纬度 -->
            <div v-if="mouseCoords" class="coord-readout">{{ mouseCoords }}</div>
          </div>
        </main>
      </div>

      <!-- 数据统计图表区 -->
      <section class="charts-section texture-paper">
        <div class="container">
          <div class="section-header">
            <div class="header-decoration">
              <span class="deco-line"></span>
              <span class="deco-line"></span>
            </div>
            <h2 class="section-title">数据洞察</h2>
          </div>
          
          <div class="charts-grid">
            <div class="chart-card card-silk">
              <div class="chart-header">
                <h3>非遗类别分布</h3>
              </div>
              <div ref="pieChartRef" class="chart-container pie-chart"></div>
            </div>
            
            <div class="chart-card card-silk">
              <div class="chart-header">
                <h3>地市分布统计</h3>
              </div>
              <div ref="barChartRef" class="chart-container bar-chart"></div>
            </div>
            
            <div class="chart-card card-silk">
              <div class="chart-header">
                <h3>历史时期演变</h3>
              </div>
              <div ref="lineChartRef" class="chart-container line-chart"></div>
            </div>
          </div>

          <p class="chart-link-hint">点击古道查看简介并联动高亮下方图表，点击图表的切片或柱条可反向筛选地图（再次点击取消）</p>
        </div>
      </section>
    </div>

    <!-- 详情弹窗 -->
    <transition name="modal-fade">
      <div v-if="detailDialogVisible" class="detail-modal">
        <div class="modal-backdrop" @click="detailDialogVisible = false"></div>
        <div class="modal-content card-silk">
          <button class="modal-close" @click="detailDialogVisible = false">×</button>
          
          <div v-if="selectedItem" class="detail-body">
            <div class="detail-image-wrapper">
              <div class="detail-placeholder">
                <span class="placeholder-char">{{ selectedItem.name.charAt(0) }}</span>
              </div>
              <img class="detail-image" :src="selectedItem.thumbImage" :alt="selectedItem.name" @error="onImgError">
              <div class="image-overlay">
                <span class="level-badge" :class="'level-' + (selectedItem.level?.includes('国家级') ? 'national' : 'regional')">
                  {{ selectedItem.level }}
                </span>
              </div>
            </div>
            
            <div class="detail-info">
              <h2>{{ selectedItem.name }}</h2>
              
              <div class="detail-tags">
                <span class="detail-tag tag-category">{{ selectedItem.category }}</span>
                <span class="detail-tag tag-location"><Icon icon="gis:poi" width="12" height="12" /> {{ selectedItem.city }}</span>
                <span class="detail-tag tag-period"><Icon icon="gis:map-time" width="12" height="12" /> {{ selectedItem.period }}</span>
              </div>
              
              <p class="detail-intro">{{ selectedItem.intro }}</p>
              
              <div class="detail-meta-grid">
                <div class="meta-item">
                  <span class="meta-label">传承人</span>
                  <span class="meta-value">{{ selectedItem.inheritor }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">关联丝路</span>
                  <span class="meta-value">{{ selectedItem.routeRelation }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">经纬度</span>
                  <span class="meta-value">{{ selectedItem.lng }}, {{ selectedItem.lat }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">浏览次数</span>
                  <span class="meta-value">{{ selectedItem.views || 0 }} 次</span>
                </div>
              </div>
              
              <div class="detail-actions">
                <button class="btn-primary" @click="detailDialogVisible = false">关闭</button>
                <button class="btn-secondary" @click="goToDetail(selectedItem?.id)">
                  <Icon icon="gis:map-book" width="15" height="15" /> 查看完整档案
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import gisIconData from '@iconify-json/gis/icons.json'
import L from 'leaflet'
import * as echarts from 'echarts'
import { heritageData, categories, cities, periods, levels, silkRoadRoutes, yellowRiver } from '../data/heritageData'
import ningxiaCitiesGeo from '../data/ningxia-cities.geo.json'

// Leaflet 的 DivIcon/popup 是原生 HTML，无法使用 Vue 组件：
// 直接取 Font-GIS 的 path 数据拼成内联 SVG 字符串
const gisSvg = (name, color, px) =>
  `<svg viewBox="0 0 100 100" width="${px}" height="${px}" style="color:${color};flex:none;display:block;vertical-align:middle;">${gisIconData.icons[name].body}</svg>`

const router = useRouter()
const pieChartRef = ref(null)
const barChartRef = ref(null)
const lineChartRef = ref(null)

// Leaflet 地图实例与图层组
let leafletMap = null

// 用户系统偏好：减少动态效果（JS 驱动的地图飞行也要降级）
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// 统一飞行入口：降级时直接跳转，无平移缩放动画
const flyToView = (target, zoom, duration) => {
  if (!leafletMap) return
  if (reduceMotion) leafletMap.setView(target, zoom)
  else leafletMap.flyTo(target, zoom, { duration })
}

let markerLayer = null
let routeLayer = null
let heatmapLayer = null
let yellowRiverLayer = null
let choroplethLayer = null
let measureLayer = null
const baseLayers = {}  // 底图集合（街道/影像/地形/古风）

// ECharts 实例引用（用于 dispose / setOption 更新）
let pieChart = null
let barChart = null
let lineChart = null
let resizeHandler = null

// 状态
const searchKeyword = ref('')
const filters = ref({ city: '', category: '', period: '', level: '' })
const layers = ref({ heritage: true, routes: true, yellowRiver: false, heatmap: false, choropleth: false })
const viewMode = ref('map')
const timeValue = ref(2)
const timePeriodEnabled = ref(false)  // 时间轴筛选开关
const detailDialogVisible = ref(false)
const selectedItem = ref(null)

// 新增交互状态
const activeBase = ref('standard')           // 当前底图
const legendCollapsed = ref(false)           // 图例折叠
const mouseCoords = ref('')                  // 鼠标经纬度
const focusedRoute = ref(null)               // 聚焦中的古道
const playing = ref(false)                   // 时光回放中
const measureActive = ref(false)             // 测距模式

// 底图选项（街道 / 影像 / 地形）
const baseOptions = [
  { key: 'standard', label: '街道' },
  { key: 'imagery', label: '影像' },
  { key: 'terrain', label: '地形' }
]

// 聚焦古道沿线非遗
const focusedRouteItems = computed(() => {
  if (!focusedRoute.value) return []
  return heritageData.filter(h => h.routeRelation === focusedRoute.value.name)
})

// 标签映射
const layerLabels = {
  heritage: '非遗点位',
  routes: '丝路古道',
  yellowRiver: '黄河水系',
  heatmap: '热力分布',
  choropleth: '行政区填色'
}

const timeMarks = { 0: '汉唐', 1: '宋元', 2: '明清', 3: '近现代', 4: '当代' }
const periodMap = ['汉唐', '宋元', '明清', '近现代', '当代']
const currentPeriod = computed(() => periodMap[timeValue.value])

// 筛选数据（支持时间轴）
const filteredData = computed(() => {
  return heritageData.filter(item => {
    const matchKeyword = !searchKeyword.value || 
      item.name.includes(searchKeyword.value) || 
      item.intro.includes(searchKeyword.value)
    const matchCity = !filters.value.city || item.city === filters.value.city
    const matchCategory = !filters.value.category || item.category === filters.value.category
    const matchPeriod = !filters.value.period || item.period === filters.value.period
    const matchLevel = !filters.value.level || item.level === filters.value.level
    const matchTime = !timePeriodEnabled.value || item.period === currentPeriod.value
    return matchKeyword && matchCity && matchCategory && matchPeriod && matchLevel && matchTime
  })
})

// ========== Leaflet 地图初始化 ==========
// 注意：maxBounds 必须大于 zoom 7 视口跨度（约 10°×7°），否则边界限制会把所有平移/飞行
// 目标锁死在同一个中心点（视口大于边界时 Leaflet 无法同时满足两侧约束）
const NINGXIA_BOUNDS = [[31.3, 99.5], [42.5, 113.8]]  // 以宁夏为中心的大区域
const NINGXIA_CENTER = [37.5, 106.2]

// 自定义 marker 图标（三等级：国家级 / 自治区级 / 县级及以下；小草发芽动画）
const levelIcon = (item, delay = 0) => {
  const tier = item.level?.includes('国家级') ? 'national'
    : item.level?.includes('自治区级') ? 'regional' : 'county'
  const conf = {
    national: { color: '#C62828', bg: '#FFF8F1', size: 46, svgIcon: 'flag-b', svgColor: '#C99A1E', tip: 9, tw: 7, halo: true },
    regional: { color: '#8B4513', bg: '#FDFBF7', size: 33, svgIcon: 'poi',    svgColor: '#8B4513', tip: 7, tw: 5, halo: false },
    county:   { color: '#7A8A6E', bg: '#F6F8F2', size: 22, svgIcon: '',       svgColor: '',        tip: 5, tw: 4, halo: false }
  }[tier]
  const { color, bg, size, svgIcon, svgColor, tip, tw, halo } = conf
  const tipH = tip + tw
  const inner = tier === 'county'
    ? `<span style="width:5px;height:5px;border-radius:50%;background:${color};display:block;"></span>`
    : gisSvg(svgIcon, svgColor, Math.round(size * 0.62))
  const shadow = tier === 'national'
    ? '0 0 0 3px rgba(212,175,55,0.95), 0 3px 10px rgba(0,0,0,0.35)'
    : tier === 'regional'
      ? '0 2px 6px rgba(0,0,0,0.28)'
      : '0 1px 3px rgba(0,0,0,0.2)'
  const borderW = tier === 'national' ? 3 : tier === 'regional' ? 2.5 : 1.5
  return L.divIcon({
    className: 'heritage-marker',
    html: `<div class="sprout-pin tier-${tier}" style="
      position: relative;
      width: ${size}px; height: ${size}px;
      background: ${bg};
      border: ${borderW}px solid ${color};
      border-radius: 50%;
      box-shadow: ${shadow};
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      animation-delay: ${delay}ms;
    ">
      ${halo ? '<span class="tier-halo"></span>' : ''}
      ${inner}
      <div style="
        position: absolute; bottom: -${tw}px; left: 50%;
        transform: translateX(-50%);
        width: 0; height: 0;
        border-left: ${tw}px solid transparent;
        border-right: ${tw}px solid transparent;
        border-top: ${tip}px solid ${color};
      ""></div>
    </div>`,
    // 整体图标包含圆形 + 底部三角
    iconSize: [size, size + tipH],
    // 锚点 = 三角尖端（正好落在经纬度坐标上）
    iconAnchor: [size / 2, size + tipH]
  })
}

const createPopupContent = (item) => `
  <div class="heritage-popup" style="min-width: 220px;">
    <img src="${item.thumbImage}" alt="${item.name}" onerror="this.style.display='none'" style="
      display:block;width:100%;height:124px;object-fit:cover;border-radius:6px;margin-bottom:8px;
      background:#EDE2CF;
    ">
    <h3 style="margin:0 0 6px;color:#3E2723;font-size:15px;font-weight:700;">${item.name}</h3>
    <div style="display:flex;gap:6px;margin-bottom:6px;flex-wrap:wrap;">
      <span style="background:#D4A017;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;">${item.category}</span>
      <span style="background:#2E8B57;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;">${item.city}</span>
      <span style="background:#8B4513;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;">${item.level}</span>
    </div>
    <p style="margin:0 0 8px;font-size:12px;color:#5D4037;line-height:1.5;">${item.intro.substring(0, 80)}...</p>
    <div style="display:flex;gap:6px;font-size:11px;color:#8D6E63;margin-bottom:8px;align-items:center;">
      <span style="display:inline-flex;align-items:center;gap:3px;">${gisSvg('pyramid', '#8D6E63', 12)}${item.period}</span>
      <span>•</span>
      <span style="display:inline-flex;align-items:center;gap:3px;">${gisSvg('route', '#8D6E63', 12)}${item.routeRelation}</span>
    </div>
    <button onclick="window.__mapGoToDetail && window.__mapGoToDetail(${item.id})" style="
      width:100%;padding:6px;background:#8B4513;color:#fff;border:none;border-radius:4px;
      cursor:pointer;font-size:12px;
    ">查看完整档案 →</button>
  </div>
`

const initMap = () => {
  // 等待容器有实际尺寸再初始化（首屏空白的常见原因）
  nextTick(() => {
    const container = document.getElementById('heritage-leaflet-map')
    if (!container || container.clientHeight === 0) {
      // 容器还没尺寸，再等一轮
      setTimeout(initMap, 150)
      return
    }

    leafletMap = L.map('heritage-leaflet-map', {
      center: NINGXIA_CENTER,
      zoom: 7,
      minZoom: 7,
      maxZoom: 15,
      maxBounds: NINGXIA_BOUNDS,
      maxBoundsViscosity: 0.8,
      zoomControl: true,
      attributionControl: true
    })

    // 瓦片加载进度条：弱网下提供明确反馈
    const loadBar = document.createElement('div')
    loadBar.className = 'map-loadbar'
    leafletMap.getContainer().parentElement.appendChild(loadBar)
    leafletMap.on('loading', () => loadBar.classList.add('loading'))
    leafletMap.on('load', () => loadBar.classList.remove('loading'))

    // ========== 底图（三种可切换） ==========
    // 天地图 token（个人申请的"浏览器端"key，可到 https://console.tianditu.gov.cn 管理）
    const TDT_TK = 'e07bb586409712614deed879e42dddb9'
    const tdtUrl = (layer, matrix = 'w') =>
      `https://t{s}.tianditu.gov.cn/${layer}_${matrix}/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0` +
      `&LAYER=${layer}&STYLE=default&TILEMATRIXSET=${matrix}&FORMAT=tiles` +
      `&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TDT_TK}`
    const tdtOpts = { subdomains: '01234567', maxZoom: 18 }

    // 街道：天地图矢量底图 + 中文注记（矢量服务配额失效时自动降级为高德矢量，避免空白）
    const tdtVec = L.tileLayer(tdtUrl('vec'), { ...tdtOpts, attribution: '&copy; 天地图' })
    const tdtCva = L.tileLayer(tdtUrl('cva'), tdtOpts)
    const gaodeVec = L.tileLayer(
      'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      { subdomains: '1234', maxZoom: 18, attribution: '&copy; 高德地图' }
    )
    baseLayers.standard = L.layerGroup([tdtVec, tdtCva])
    let vecFellBack = false
    tdtVec.on('tileerror', () => {
      if (vecFellBack) return
      vecFellBack = true
      const group = baseLayers.standard
      group.removeLayer(tdtVec)
      group.removeLayer(tdtCva)
      group.addLayer(gaodeVec)
    })
    // 影像：天地图卫星影像 + 中文注记叠加
    baseLayers.imagery = L.layerGroup([
      L.tileLayer(tdtUrl('img'), { ...tdtOpts, attribution: '&copy; 天地图' }),
      L.tileLayer(tdtUrl('cia'), tdtOpts)
    ])
    // 地形：天地图地形晕渲 + 地形注记叠加
    baseLayers.terrain = L.layerGroup([
      L.tileLayer(tdtUrl('ter'), { ...tdtOpts, attribution: '&copy; 天地图' }),
      L.tileLayer(tdtUrl('cta'), tdtOpts)
    ])
    baseLayers.standard.addTo(leafletMap)

    // ========== 比例尺（移入图例卡片内部，宽度与图例匹配；刻度仍由 Leaflet 按真实分辨率计算） ==========
    L.control.scale({ imperial: false, position: 'bottomleft', maxWidth: 110 }).addTo(leafletMap)
    const scaleLineEl = document.querySelector('.leaflet-control-scale-line')
    const legendBodyEl = document.querySelector('.map-legend .legend-body')
    if (scaleLineEl && legendBodyEl) {
      const scaleWrap = document.createElement('div')
      scaleWrap.className = 'legend-scale-wrap'
      const scaleLabel = document.createElement('span')
      scaleLabel.className = 'legend-scale-label'
      scaleLabel.textContent = '比例尺'
      scaleWrap.appendChild(scaleLabel)
      scaleWrap.appendChild(scaleLineEl)
      legendBodyEl.appendChild(scaleWrap)
    }

    // ========== 初始化数据图层组 ==========
    markerLayer = L.layerGroup().addTo(leafletMap)
    routeLayer = L.layerGroup().addTo(leafletMap)
    heatmapLayer = L.layerGroup()
    yellowRiverLayer = L.layerGroup()
    choroplethLayer = L.layerGroup()
    measureLayer = L.layerGroup().addTo(leafletMap)

    // 黄河水系
    renderYellowRiver()
    // 分级填色（真实地市边界）
    renderChoropleth()

    // 第一次渲染所有数据
    renderMarkers(filteredData.value)
    renderRoutes()

    // fitBounds 包含所有点位
    fitAllMarkers()

    // 注册全局函数供 popup 按钮调用
    window.__mapGoToDetail = (id) => {
      if (id) {
        detailDialogVisible.value = false
        router.push(`/archive/${id}`)
      }
    }

    // 鼠标移动 → 实时经纬度
    leafletMap.on('mousemove', onMapMouseMove)
    leafletMap.on('mouseout', onMapMouseOut)

    // 缩放/平移后重算古道名称标签的碰撞避让
    leafletMap.on('zoomend moveend', updateLabelCollision)

    // 修复潜在的首屏不渲染问题
    setTimeout(() => leafletMap && leafletMap.invalidateSize(), 300)
  })
}

const renderMarkers = (data) => {
  if (!markerLayer || !leafletMap) return
  markerLayer.clearLayers()

  if (!data || data.length === 0) return

  data.forEach((item, idx) => {
    if (!item.lat || !item.lng) return
    // 错峰延迟：点位像小草一样依次破土而出
    const delay = Math.min(idx * 55, 900)
    const marker = L.marker([item.lat, item.lng], { icon: levelIcon(item, delay) })
      .bindPopup(createPopupContent(item), { maxWidth: 280, className: 'heritage-popup-wrap' })
      .on('click', () => {
        selectedItem.value = item
      })
    marker.item = item
    marker.addTo(markerLayer)
  })

  // 同时在热力图层生成 circleMarker
  if (heatmapLayer) {
    heatmapLayer.clearLayers()
    data.forEach(item => {
      if (!item.lat || !item.lng) return
      const isNational = item.level?.includes('国家级')
      L.circleMarker([item.lat, item.lng], {
        radius: isNational ? 30 : 18,
        fillColor: isNational ? 'rgba(198, 40, 40, 0.15)' : 'rgba(139, 69, 19, 0.12)',
        stroke: false,
        fillOpacity: 0.6
      }).addTo(heatmapLayer)
    })
  }

  // 古道聚焦时，非沿线点位降透明度（等图标 DOM 生成后执行）
  setTimeout(applyFocusDim, 0)
}

// 古道可视化对象：routeId → { route, paths:[彩色线], hitAreas:[透明点击区], label:名称标签 }
const routeVisuals = new Map()

const renderRoutes = () => {
  if (!routeLayer || !leafletMap) return
  routeLayer.clearLayers()
  routeVisuals.clear()

  if (!silkRoadRoutes || silkRoadRoutes.length === 0) return

  silkRoadRoutes.forEach(route => {
    // 支持多段线（route.segments）与单段线（route.coordinates）
    const segments = (route.segments ?? [route.coordinates])
      .map(seg => seg.map(c => [c[1], c[0]]))  // [lng,lat] → [lat,lng]

    const paths = []
    const hitAreas = []
    segments.forEach(latlngs => {
      const polyline = L.polyline(latlngs, {
        color: route.color || '#D4A017',
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 6',
        lineCap: 'round',
        className: 'route-path'
      }).addTo(routeLayer)

      // 透明加粗点击区（细线在缩小后难以点中）
      const hitArea = L.polyline(latlngs, {
        color: '#fff',
        weight: 16,
        opacity: 0
      }).addTo(routeLayer)

      // 彩色线与透明点击区共用同一组交互
      ;[polyline, hitArea].forEach(ln => {
        ln.on('click', () => toggleRouteFocus(route))
        ln.on('mouseover', () => emphasizeRoute(route, true))
        ln.on('mouseout', () => emphasizeRoute(route, false))
      })

      paths.push(polyline)
      hitAreas.push(hitArea)
    })

    // 古道名称标签：锚定在预设的 labelAt（地理分离，避免重叠）；缺省取首段中部
    const anchor = route.labelAt
      ? [route.labelAt[1], route.labelAt[0]]
      : segments[0][Math.floor(segments[0].length / 2)]
    // 可读性覆盖：浅色路线用深棕文字；绿色加深保证白字对比度 ≥4.5
    const labelOverride = {
      huanling: { color: '#3E2A08' },
      changxiy: { background: '#2A804F' }
    }[route.id] || {}
    const labelStyle = `background:${labelOverride.background || route.color};color:${labelOverride.color || '#fff'}`
    const label = L.marker(anchor, {
      icon: L.divIcon({
        className: 'route-label',
        html: `<span class="route-label-pill" style="${labelStyle}">${route.name}</span>`,
        iconSize: [90, 20],
        iconAnchor: [45, 10]
      }),
      interactive: false,
      keyboard: false
    }).addTo(routeLayer)

    routeVisuals.set(route.id, { route, paths, hitAreas, label })
  })

  applyRouteFocusStyle()
  setTimeout(updateLabelCollision, 0)
}

const emphasizeRoute = (route, on) => {
  if (measureActive.value) return
  const vis = routeVisuals.get(route.id)
  if (!vis) return
  if (on) {
    const weight = focusedRoute.value ? 7 : 6
    vis.paths.forEach(p => p.setStyle({ weight, opacity: 1 }))
    leafletMap.getContainer().style.cursor = 'pointer'
  } else {
    applyRouteFocusStyle()   // 移出时按聚焦状态平滑恢复，而非生硬复位
    leafletMap.getContainer().style.cursor = ''
  }
}

const fitAllMarkers = () => {
  if (!leafletMap || !markerLayer) return
  const group = L.featureGroup(markerLayer.getLayers())
  if (group.getLayers().length > 0) {
    leafletMap.fitBounds(group.getBounds().pad(0.2))
  } else {
    leafletMap.setView(NINGXIA_CENTER, 7)
  }
}

// ========== 黄河水系图层 ==========
const renderYellowRiver = () => {
  if (!yellowRiverLayer) return
  yellowRiverLayer.clearLayers()
  const latlngs = yellowRiver.coordinates.map(c => [c[1], c[0]])
  L.polyline(latlngs, {
    color: yellowRiver.color,
    weight: 5,
    opacity: 0.75,
    lineCap: 'round'
  }).addTo(yellowRiverLayer)
  // 黄河标签（青铜峡段附近）
  L.marker(latlngs[3], {
    icon: L.divIcon({
      className: 'river-label',
      html: `<span style="
        background: rgba(30,136,229,0.92); color:#fff;
        padding:2px 8px; border-radius:10px;
        font-size:11px; font-weight:600; white-space:nowrap;
      ">黄河</span>`,
      iconSize: [44, 20],
      iconAnchor: [0, 10]
    }),
    interactive: false
  }).addTo(yellowRiverLayer)
}

// ========== 行政区分级填色 ==========
const cityCounts = {}
heritageData.forEach(h => {
  cityCounts[h.city] = (cityCounts[h.city] || 0) + 1
})
const maxCityCount = Math.max(...Object.values(cityCounts))

// 数量 → 颜色（浅米黄 → 深棕）
const cityFillColor = (n) => {
  if (!n) return '#F3ECE0'
  const ratio = n / maxCityCount
  const stops = [
    [247, 232, 203],  // 少
    [234, 197, 130],
    [212, 160, 23],
    [159, 110, 30],
    [109, 72, 18]     // 多
  ]
  const f = ratio * (stops.length - 1)
  const i = Math.min(stops.length - 2, Math.floor(f))
  const t = f - i
  const a = stops[i], b = stops[i + 1]
  const rgb = a.map((v, k) => Math.round(v + (b[k] - v) * t))
  return `rgb(${rgb.join(',')})`
}

const renderChoropleth = () => {
  if (!choroplethLayer) return
  choroplethLayer.clearLayers()
  L.geoJSON(ningxiaCitiesGeo, {
    style: (feature) => ({
      fillColor: cityFillColor(cityCounts[feature.properties.name] || 0),
      weight: 1,
      color: '#8B4513',
      fillOpacity: 0.6
    }),
    onEachFeature: (feature, layer) => {
      const n = cityCounts[feature.properties.name] || 0
      layer.bindTooltip(`${feature.properties.name}：${n} 项非遗`, { sticky: true })
      layer.on({
        mouseover: (e) => e.target.setStyle({ weight: 2.5, fillOpacity: 0.8 }),
        mouseout: (e) => choroplethLayer.resetStyle(e.target)
      })
    }
  }).addTo(choroplethLayer)
}

// ========== 古道聚焦模式 ==========
// 当前古道加粗提亮，其余古道的线条与名称标签一并淡出（SVG path 与标签均带 CSS 过渡）
const applyRouteFocusStyle = () => {
  if (!routeVisuals.size) return
  routeVisuals.forEach(vis => {
    const isFocused = focusedRoute.value?.id === vis.route.id
    vis.paths.forEach(p => {
      if (!focusedRoute.value) {
        p.setStyle({ weight: 3, opacity: 0.8 })
      } else if (isFocused) {
        p.setStyle({ weight: 7, opacity: 1 })
      } else {
        p.setStyle({ weight: 3, opacity: 0.18 })
      }
    })
    // 名称标签：聚焦古道保持醒目，其余降到几乎不争抢注意力
    const el = vis.label.getElement()
    if (el) {
      el.style.opacity = !focusedRoute.value ? 1 : (isFocused ? 1 : 0.1)
    }
    // 过渡结束后再置顶：同帧或过渡中重插 DOM 都会中断/跳过 CSS 过渡
    if (focusedRoute.value && isFocused) {
      vis.paths.forEach(p => setTimeout(() => p.bringToFront(), 470))
    }
  })
}

const applyFocusDim = () => {
  if (!markerLayer) return
  markerLayer.eachLayer(m => {
    const el = m.getElement()
    if (!el || !m.item) return
    el.style.opacity = (!focusedRoute.value || m.item.routeRelation === focusedRoute.value.name) ? 1 : 0.2
  })
}

const getRouteLength = (route) => {
  let km = 0
  const segments = route.segments ?? [route.coordinates]
  segments.forEach(c => {
    for (let i = 1; i < c.length; i++) {
      km += L.latLng(c[i][1], c[i][0]).distanceTo(L.latLng(c[i - 1][1], c[i - 1][0])) / 1000
    }
  })
  return Math.round(km)
}
const focusedRouteLength = computed(() => focusedRoute.value ? getRouteLength(focusedRoute.value) : 0)

const focusRoute = (route) => {
  focusedRoute.value = route
  applyRouteFocusStyle()

  // 合并该古道所有线段的几何
  const latlngs = []
  ;(route.segments ?? [route.coordinates]).forEach(seg => {
    seg.forEach(c => latlngs.push([c[1], c[0]]))
  })

  // 右侧介绍卡片（280px + 12px 右间距）会遮住地图右侧：
  // 把古道中心放到"未被遮挡区域"的视觉中央——地图中心相应向东偏移卡片宽度的一半
  const bounds = L.latLngBounds(latlngs).pad(0.35)
  const size = leafletMap.getSize()
  // 右侧介绍卡片：宽 280 + 右间距 12 = 292。未遮挡区中心相对地图中心左移 292/2
  const cardSpace = size.x > 640 ? 292 : 0
  const shiftPx = cardSpace / 2
  // 缩放级别计算时仅使用未遮挡区域，避免古道东段被卡片压住
  const zoom = leafletMap.getBoundsZoom(bounds, false, L.point(cardSpace, 20))
  const center = leafletMap.project(bounds.getCenter(), zoom).add(L.point(shiftPx, 0))
  const targetCenter = leafletMap.unproject(center, zoom)
  flyToView(targetCenter, zoom, 0.9)

  setTimeout(applyFocusDim, 500)

  // 联动下方数据图表：高亮沿线非遗对应的切片/柱条/折线点
  renderCharts()
}

// 再次点击已聚焦古道 → 取消联动、关闭简介、恢复多古道展示
const toggleRouteFocus = (route) => {
  if (focusedRoute.value?.id === route.id) {
    exitFocus()
  } else {
    focusRoute(route)
  }
}

const exitFocus = () => {
  focusedRoute.value = null
  applyFocusDim()
  applyRouteFocusStyle()
  renderCharts()  // 图表恢复常态
}

// ========== 古道名称标签碰撞避让 ==========
// 标签锚点已做地理分离；此处做屏幕空间兜底：移动/缩放后若仍有重叠，
// 在标签胶囊（而非 Leaflet 定位外壳，避免覆盖其定位 transform）上做纵向位移
const updateLabelCollision = () => {
  if (!leafletMap || !routeVisuals.size) return
  const mapRect = leafletMap.getContainer().getBoundingClientRect()

  const pills = []
  silkRoadRoutes.forEach(route => {
    const vis = routeVisuals.get(route.id)
    const outer = vis?.label?.getElement?.()
    const pill = outer?.querySelector('.route-label-pill')
    if (pill) {
      pill.style.transform = ''
      pills.push(pill)
    }
  })

  const placed = []
  pills.forEach(pill => {
    const r = pill.getBoundingClientRect()
    let dy = 0
    placed.forEach(p => {
      const hitX = r.left < p.right - 2 && r.right > p.left + 2
      const hitY = r.top < p.bottom - 2 && r.bottom > p.top + 2
      if (hitX && hitY) dy = Math.max(dy, p.bottom - r.top + 6)
    })
    if (dy && r.bottom + dy > mapRect.bottom - 8) {
      // 下方放不下 → 改为向上避让
      const topLine = Math.min(...placed.map(p => p.top))
      const upNeed = r.bottom - topLine + 6
      dy = r.top - upNeed > mapRect.top + 8 ? -upNeed : 0
    }
    if (dy) {
      pill.style.transform = `translateY(${dy}px)`
      placed.push(pill.getBoundingClientRect())
    } else {
      placed.push(r)
    }
  })
}

const flyToRouteItem = (item) => {
  if (!leafletMap || !item.lat) return
  flyToView([item.lat, item.lng], 10, 0.7)
  setTimeout(() => {
    markerLayer.eachLayer(m => {
      if (m.item?.id === item.id) m.openPopup()
    })
  }, 750)
}

// ========== 底图切换 ==========
const switchBase = (key) => {
  if (!leafletMap || !baseLayers[key] || key === activeBase.value) return
  leafletMap.removeLayer(baseLayers[activeBase.value])
  baseLayers[key].addTo(leafletMap)
  activeBase.value = key
}

// ========== 实时经纬度 ==========
const onMapMouseMove = (e) => {
  mouseCoords.value = `经度 ${e.latlng.lng.toFixed(3)}° · 纬度 ${e.latlng.lat.toFixed(3)}°`
}
const onMapMouseOut = () => {
  mouseCoords.value = ''
}

// ========== 全屏 ==========
const onFullscreenChange = () => {
  // 浏览器全屏过渡时长不一，多次重算尺寸，确保瓦片铺满
  ;[100, 300, 600].forEach(t => setTimeout(() => leafletMap?.invalidateSize(), t))
}
const toggleFullscreen = () => {
  // 对整个地图视图（含工具栏、图例、聚焦卡）全屏，全屏后所有控件仍可操作
  const el = document.querySelector('.map-view')
  if (!el) return
  if (!document.fullscreenElement) {
    const request = el.requestFullscreen || el.webkitRequestFullscreen
    if (!request) return
    const p = request.call(el)
    if (p && p.catch) p.catch(err => console.warn('无法进入全屏：', err))
  } else {
    const exit = document.exitFullscreen || document.webkitExitFullscreen
    exit && exit.call(document)
  }
}

// ========== 时光回放 ==========
let playTimer = null
const stopPlay = () => {
  playing.value = false
  if (playTimer) {
    clearInterval(playTimer)
    playTimer = null
  }
}
const togglePlay = () => {
  if (playing.value) {
    stopPlay()
    return
  }
  if (timeValue.value !== 0) timeValue.value = 0  // 每次播放均从汉唐开始完整演示
  timePeriodEnabled.value = true
  playing.value = true
  playTimer = setInterval(() => {
    if (timeValue.value >= 4) {
      stopPlay()
      return
    }
    timeValue.value += 1
  }, 1400)
}

// ========== 交互式测距 ==========
let measurePts = []
const fmtDist = (m) => m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`

const drawMeasure = () => {
  if (!measureLayer) return
  measureLayer.clearLayers()
  if (measurePts.length === 0) return
  if (measurePts.length > 1) {
    L.polyline(measurePts, {
      color: '#C62828', weight: 2, dashArray: '6,4'
    }).addTo(measureLayer)
  }
  let total = 0
  measurePts.forEach((p, i) => {
    if (i > 0) total += p.distanceTo(measurePts[i - 1])
    const isLast = i === measurePts.length - 1
    L.circleMarker(p, {
      radius: 4, color: '#C62828', weight: 2, fillColor: '#fff', fillWeight: 2
    }).bindTooltip(isLast && i > 0 ? fmtDist(total) : (i === 0 ? '起点' : ''), {
      permanent: isLast && i > 0,
      direction: 'top',
      offset: [0, -6],
      className: 'measure-tip'
    }).addTo(measureLayer)
  })
}

const onMeasureClick = (e) => {
  measurePts.push(e.latlng)
  drawMeasure()
}

const onMeasureDblClick = () => {
  // 双击前会先触发两次单击，移除最后一个重复点
  if (measurePts.length) measurePts.pop()
  drawMeasure()
  finishMeasure(false)
}

const clearMeasureGraphics = () => {
  measurePts = []
  measureLayer && measureLayer.clearLayers()
}

const startMeasure = () => {
  if (!leafletMap) return
  clearMeasureGraphics()
  measureActive.value = true
  leafletMap.getContainer().classList.add('measure-cursor')
  leafletMap.on('click', onMeasureClick)
  leafletMap.on('dblclick', onMeasureDblClick)
}

const finishMeasure = (cancelled) => {
  if (!leafletMap) return
  measureActive.value = false
  leafletMap.getContainer().classList.remove('measure-cursor')
  leafletMap.off('click', onMeasureClick)
  leafletMap.off('dblclick', onMeasureDblClick)
  if (cancelled) clearMeasureGraphics()
}

const toggleMeasure = () => {
  measureActive.value ? finishMeasure(true) : startMeasure()
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && measureActive.value) finishMeasure(true)
}

// ========== 筛选 / 图层 / 时间轴 联动 ==========
watch(filteredData, (newData) => {
  renderMarkers(newData)
  renderCharts()
}, { deep: true })

// 时间轴滑块拖动 → 自动开启时间筛选
watch(timeValue, () => {
  timePeriodEnabled.value = true
})

watch([
  () => layers.value.heritage,
  () => layers.value.routes,
  () => layers.value.yellowRiver,
  () => layers.value.heatmap,
  () => layers.value.choropleth
], ([h, r, y, heat, ch]) => {
  if (!leafletMap) return
  if (h) markerLayer.addTo(leafletMap); else leafletMap.removeLayer(markerLayer)
  if (r) routeLayer.addTo(leafletMap); else leafletMap.removeLayer(routeLayer)
  if (y) yellowRiverLayer.addTo(leafletMap); else leafletMap.removeLayer(yellowRiverLayer)
  if (heat) heatmapLayer.addTo(leafletMap); else leafletMap.removeLayer(heatmapLayer)
  if (ch) choroplethLayer.addTo(leafletMap); else leafletMap.removeLayer(choroplethLayer)
}, { flush: 'post' })

// ========== ECharts 图表 ==========
const chartOptionCategory = (data) => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c}项 ({d}%)' },
  legend: { bottom: '0%', left: 'center', itemWidth: 12, itemHeight: 12, textStyle: { fontSize: 11 } },
  series: [{
    type: 'pie', radius: ['45%', '70%'], center: ['50%', '45%'],
    avoidLabelOverlap: false,
    data,
    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    emphasis: { label: { show: true, fontSize: 13, fontWeight: 600 } }
  }]
})

const chartOptionCity = (data) => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
  series: [{
    type: 'bar', data,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#D4A017' }, { offset: 1, color: '#B8860B' }
      ]),
      borderRadius: [4, 4, 0, 0]
    },
    barWidth: '50%'
  }]
})

const chartOptionPeriod = (data) => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
  series: [{
    type: 'line', data, smooth: true,
    symbol: 'circle', symbolSize: 8, lineStyle: { width: 3 },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(212, 160, 23, 0.3)' }, { offset: 1, color: 'rgba(212, 160, 23, 0.05)' }
      ])
    },
    itemStyle: { color: '#D4A017' }
  }]
})

const buildChartData = (data) => ({
  category: categories.slice(1).map(cat => ({
    name: cat, value: data.filter(h => h.category === cat).length
  })).filter(d => d.value > 0),
  city: cities.slice(1).map(city => ({
    name: city, value: data.filter(h => h.city === city).length
  })),
  period: periodMap.map(p => ({
    name: p, value: data.filter(h => h.period === p).length
  }))
})

const initCharts = () => {
  nextTick(() => {
    // 容器高度未就绪时延迟重试，避免 ECharts 以 0 尺寸初始化
    const refs = [pieChartRef, barChartRef, lineChartRef].map(r => r.value)
    if (refs.some(el => !el || el.clientHeight === 0)) {
      setTimeout(initCharts, 150)
      return
    }
    pieChart = echarts.init(pieChartRef.value)
    barChart = echarts.init(barChartRef.value)
    lineChart = echarts.init(lineChartRef.value)
    renderCharts()

    // 图表点击 → 联动筛选地图（再次点击同项取消）
    pieChart.on('click', (p) => linkChartFilter('category', p.name))
    barChart.on('click', (p) => linkChartFilter('city', p.name))
    lineChart.on('click', (p) => linkChartFilter('period', p.name))

    // resize handler 保存引用以便清理
    resizeHandler = () => {
      pieChart?.resize()
      barChart?.resize()
      lineChart?.resize()
      leafletMap?.invalidateSize()
    }
    window.addEventListener('resize', resizeHandler)
  })
}

// 古道 → 图表联动：沿线非遗涉及的类别 / 地市 / 时期名称集合
const routeLinkKeys = computed(() => {
  const r = focusedRoute.value
  if (!r) return null
  const items = heritageData.filter(h => h.routeRelation === r.name)
  return {
    category: new Set(items.map(i => i.category)),
    city: new Set(items.map(i => i.city)),
    period: new Set(items.map(i => i.period))
  }
})

const LINK_DIM = 0.15  // 联动时非关联切片/柱条/点的透明度

const renderCharts = () => {
  const data = filteredData.value
  const { category, city, period } = buildChartData(data)
  const k = routeLinkKeys.value

  // 有关联古道时：非关联数据降透明度（保留色相等，仅不争抢注意力）
  const withDim = (list, keyName) => list.map(d => (
    k && !k[keyName].has(d.name)
      ? { ...d, itemStyle: { ...(d.itemStyle || {}), opacity: LINK_DIM } }
      : d
  ))
  const catData = withDim(category, 'category')
  const cityData = withDim(city, 'city')
  const periodData = withDim(period, 'period')

  pieChart && pieChart.setOption(chartOptionCategory(catData), true)
  barChart && barChart.setOption(chartOptionCity(cityData), true)
  lineChart && lineChart.setOption(chartOptionPeriod(periodData), true)

  // 关联项额外高亮（饼图弹出标签、柱条/折线点强调）
  if (k) {
    nextTick(() => {
      catData.forEach((d, i) => {
        if (k.category.has(d.name)) pieChart?.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: i })
      })
      cityData.forEach((d, i) => {
        if (k.city.has(d.name)) barChart?.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: i })
      })
      periodData.forEach((d, i) => {
        if (k.period.has(d.name)) lineChart?.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: i })
      })
    })
  }
}

// ========== 方法 ==========
const resetFilters = () => {
  searchKeyword.value = ''
  filters.value = { city: '', category: '', period: '', level: '' }
  timePeriodEnabled.value = false
  stopPlay()
  exitFocus()
  if (measureActive.value) finishMeasure(true)
  if (leafletMap) leafletMap.closePopup()
}

// 图表联动筛选
const linkChartFilter = (field, value) => {
  filters.value[field] = filters.value[field] === value ? '' : value
  viewMode.value = 'map'
  setTimeout(() => fitAllMarkers(), 450)
}

const goToDetail = (id) => {
  if (id) {
    detailDialogVisible.value = false
    router.push(`/archive/${id}`)
  }
}

// 列表视图内点击项目：先弹出快速预览弹窗（弹窗内可再跳转完整档案）
const openItemPreview = (item) => {
  if (!item) return
  selectedItem.value = item
  detailDialogVisible.value = true
}

const onImgError = (e) => {
  e.target.classList.add('is-failed')
}

// 地图 / 列表视图切换；地图容器用 v-show 保活，回到地图后需刷新瓦片尺寸
const toggleView = () => {
  viewMode.value = viewMode.value === 'map' ? 'list' : 'map'
  if (viewMode.value === 'map' && leafletMap) {
    nextTick(() => leafletMap.invalidateSize())
  }
}

const zoomToFit = () => {
  // 处于古道聚焦态时先退出，恢复多古道展示与图表常态，再缩放到全部点位
  if (focusedRoute.value) exitFocus()
  if (leafletMap) leafletMap.closePopup()
  fitAllMarkers()
}

const printMap = () => {
  window.print()
}

// ========== 生命周期 ==========
onMounted(() => {
  initMap()
  initCharts()
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  // 停止回放
  stopPlay()

  // 清理 Leaflet
  if (leafletMap) {
    leafletMap.remove()
    leafletMap = null
  }
  markerLayer = null
  routeLayer = null
  heatmapLayer = null
  yellowRiverLayer = null
  choroplethLayer = null
  measureLayer = null

  // 清理 ECharts
  pieChart && pieChart.dispose()
  barChart && barChart.dispose()
  lineChart && lineChart.dispose()
  pieChart = barChart = lineChart = null

  // 清理全局监听
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('keydown', onKeydown)

  // 清理 window 引用
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  window.__mapGoToDetail = null
})
</script>

<style lang="scss" scoped>
// ============================================
// 页面英雄区
// ============================================

.page-hero {
  position: relative;
  padding: var(--spacing-2xl) 0 var(--spacing-xl);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  
  .hero-pattern {
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4A017' fill-opacity='0.05'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z'/%3E%3C/g%3E%3C/svg%3E");
  }
  
  .hero-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #5D3A1A 0%, #8B4513 50%, #A0522D 100%);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(212, 160, 23, 0.2);
  border: 1px solid rgba(212, 160, 23, 0.4);
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  color: white;
}

.badge-icon {
  font-size: 16px;
}

.hero-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  color: white;
  letter-spacing: 3px;
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-xl);
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-lg);
}

.hero-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .stat-num {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-secondary);
  }
  
  .stat-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
}

.hero-stat-separator {
  color: rgba(255, 255, 255, 0.3);
}

.hero-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  
  svg {
    display: block;
    width: 100%;
    height: 60px;
  }
}

.main-content {
  background: var(--color-background);
}

.map-container {
  display: flex;
  height: calc(100vh - 200px);
  min-height: 500px;
}

@media (max-width: 992px) {
  .map-container {
    flex-direction: column;
    height: auto;
  }
}

// ============================================
// 数据洞察区（与地图板块拉开间距 + 独立底色形成视觉区分）
// ============================================
.charts-section {
  margin-top: 32px;
  padding: 60px 0 68px;
  background: linear-gradient(180deg, #F1E6CF 0%, #FAF4E7 40%, #FDF9F0 100%);
  border-top: 1px solid var(--color-border-light);
  box-shadow: inset 0 6px 16px rgba(139, 90, 43, 0.08);

  .section-header {
    margin-bottom: var(--spacing-2xl);
  }

  @media (max-width: 768px) {
    margin-top: 20px;
    padding: 40px 0 48px;
  }
}

// ============================================
// 数据图表（ECharts 容器必须有明确高度，否则高度塌陷）
// ============================================

.charts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.chart-container {
  width: 100%;
  height: 280px;
}

@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-container {
    height: 240px;
  }
}

// ============================================
// Leaflet 真实地图容器
// ============================================

.map-main {
  flex: 1 1 0;
  height: 100%;
  min-height: 0;
  position: relative;
  overflow: hidden;
  background: #E8DCC8;
}

// 瓦片加载进度条
.map-loadbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 800;
  overflow: hidden;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40%;
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--color-secondary), transparent);
    opacity: 0;
  }

  &.loading::after {
    opacity: 1;
    animation: mapLoadSlide 1s var(--ease-inout) infinite;
  }
}
@keyframes mapLoadSlide {
  from { transform: translateX(-100%); }
  to { transform: translateX(350%); }
}

.map-view {
  width: 100%;
  height: 100%;
  min-height: 0;
  position: relative;
  z-index: 1;  // 建立层叠上下文，把浮动面板关在地图内，避免越过顶部导航

  // 全屏模式下由该容器（含全部浮动控件）铺满视口
  &:fullscreen,
  &:-webkit-full-screen {
    width: 100%;
    height: 100%;
    background: #E8DCC8;
  }
}

// ============================================
// 点位"小草发芽"动画
// ============================================
// 古道线路聚焦/悬停时的平滑过渡（加粗与淡出不再生硬）
:deep(path.route-path) {
  transition: stroke-width 0.45s var(--ease-out), stroke-opacity 0.45s var(--ease-out);
}

// 古道名称标签
:deep(.route-label) {
  width: 90px;            // 与 iconSize 一致
  text-align: center;     // 胶囊在定位外壳内居中
  pointer-events: none;
  transition: opacity 0.45s var(--ease-out);
}

:deep(.route-label-pill) {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.28);
  transition: transform 0.2s var(--ease-out);
}

:deep(.sprout-pin) {
  animation-name: sprout;
  animation-duration: 0.55s;
  animation-timing-function: cubic-bezier(0.32, 1.28, 0.48, 1);
  animation-fill-mode: backwards;
  will-change: transform, opacity;

  // 原点固定在各自三角尖端（= 非遗坐标点），从尖端向上长出
  &.tier-national { transform-origin: 50% calc(100% + 16px); }
  &.tier-regional { transform-origin: 50% calc(100% + 12px); }
  &.tier-county   { transform-origin: 50% calc(100% + 9px); }
}

// 国家级点位的金色脉冲光环（等级最高，持续吸引视线）
:deep(.tier-halo) {
  position: absolute;
  top: -7px; left: -7px; right: -7px; bottom: -7px;
  border-radius: 50%;
  border: 2px solid rgba(198, 40, 40, 0.55);
  pointer-events: none;
  animation: tierHalo 2.4s ease-out infinite;
}

@keyframes tierHalo {
  0%   { transform: scale(0.72); opacity: 0.85; }
  100% { transform: scale(1.35); opacity: 0; }
}

@keyframes sprout {
  0% {
    opacity: 0;
    transform: scale(0.12, 0.28);   // 细芽尖初现
  }
  55% {
    opacity: 1;
    transform: scale(1.06, 1.1);    // 舒展并轻微拔高
  }
  78% {
    transform: scale(0.98, 0.97);  // 回弹
  }
  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
}

.leaflet-container {
  width: 100% !important;
  height: 100% !important;
  min-height: 400px;
  outline: none;
  background: #E8DCC8;
  font-family: var(--font-body);
}

// 自定义 popup 样式（匹配丝路主题）
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 10px;
  background: #FDFBF7;
  box-shadow: 0 4px 20px rgba(139, 69, 19, 0.2);
}

:deep(.leaflet-popup-tip) {
  background: #FDFBF7;
}

:deep(.leaflet-popup-content) {
  margin: 12px;
  font-size: 13px;
}

:deep(.heritage-popup h3) {
  margin: 0 0 6px;
  color: #3E2723;
  font-size: 15px;
  font-weight: 700;
}

:deep(.heritage-popup button:hover) {
  filter: brightness(1.1);
}

// Leaflet 控件主题化
:deep(.leaflet-control-zoom a) {
  background: #FDFBF7;
  color: #8B4513;
  border: 1px solid #D7CCC8;
  font-weight: bold;
}

:deep(.leaflet-control-zoom a:hover) {
  background: #D4A017;
  color: white;
}

:deep(.leaflet-control-attribution) {
  background: rgba(253, 251, 247, 0.85);
  color: #5D4037;
  font-size: 11px;
}

// ============================================
// 左侧工具栏
// ============================================

.map-sidebar {
  width: 340px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border-light);
  padding: var(--spacing-lg);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  position: relative;
  z-index: 1;
  
  @media (max-width: 992px) {
    width: 100%;
    max-height: 400px;
  }
}

// 纵向（移动端）布局：父容器高度由内容撑开，百分比高度失效，给地图明确高度
@media (max-width: 992px) {
  .map-main {
    flex: none;
    height: 480px;
  }
}

.sidebar-header {
  text-align: center;
  
  .header-icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
    border-radius: 50%;
    margin-bottom: var(--spacing-md);
    box-shadow: 0 3px 8px rgba(93, 64, 24, 0.35);

    .header-icon {
      display: block;
    }
  }
  
  h2 {
    font-size: 1.3rem;
    color: var(--color-primary);
    margin-bottom: 4px;
  }
  
  p {
    font-size: 13px;
    color: var(--color-text-light);
  }
}

.search-section {
  .search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    
    .search-icon {
      position: absolute;
      left: 12px;
      font-size: 16px;
      opacity: 0.5;
    }
    
    .custom-input {
      width: 100%;
      padding: 12px 36px 12px 40px;
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      font-size: 14px;
      transition: border-color 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);

      &:focus {
        outline: none;
        border-color: var(--color-secondary);
        box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.1);
      }
    }
    
    .clear-btn {
      position: absolute;
      right: 12px;
      background: transparent;
      border: none;
      font-size: 20px;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
  }
}

.section-title-with-icon {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  
  .icon {
    font-size: 18px;
  }
  
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-primary);
    margin: 0;
  }
}

.filter-section {
  .filter-group {
    margin-bottom: var(--spacing-md);
    
    label {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
      font-size: 13px;
      color: var(--color-text);
      
      .label-icon {
        font-size: 14px;
      }
    }
    
    .custom-select {
      width: 100%;
      
      :deep(.el-input__wrapper) {
        border-radius: var(--radius-md);
        box-shadow: 0 0 0 1px var(--color-border-light) inset;
        
        &:hover {
          box-shadow: 0 0 0 1px var(--color-secondary) inset;
        }
      }
    }
  }
  
  .btn-reset {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 10px 16px;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    color: var(--color-text);
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.3s var(--ease-out), color 0.3s var(--ease-out);

    &:hover {
      border-color: var(--color-secondary);
      color: var(--color-secondary);
    }
  }
}

.layers-section {
  .layer-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .layer-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: 8px;
    background: var(--color-background);
    border-radius: var(--radius-md);
    cursor: pointer;
    
    input[type="checkbox"] {
      display: none;
    }
    
    .layer-tile {
      width: 32px;
      height: 32px;
      background: var(--color-sand);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s var(--ease-out);

      &.active {
        background: var(--color-secondary);
      }
      
      .layer-dot {
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      }
    }
    
    .layer-name {
      flex: 1;
      font-size: 13px;
      color: var(--color-text);
    }
    
    .layer-switch {
      width: 40px;
      height: 22px;
      background: var(--color-border);
      border-radius: 11px;
      position: relative;
      transition: background-color 0.3s var(--ease-out);

      .switch-knob {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 50%;
        transition:
          transform 0.3s var(--ease-out),
          background-color 0.3s var(--ease-out);

        &.checked {
          transform: translateX(18px);
          background: var(--color-secondary);
        }
      }
    }
  }
}

.timeline-section {
  .timeline-wrapper {
    padding: var(--spacing-sm) 0;
    
    .timeline-slider {
      width: 100%;
      height: 6px;
      background: var(--color-sand);
      border-radius: 3px;
      appearance: none;
      outline: none;
      
      &::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        background: var(--color-secondary);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(212, 160, 23, 0.4);
      }

      &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border: none;
        background: var(--color-secondary);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(212, 160, 23, 0.4);
      }

      // 键盘焦点指示（原 outline:none 的可访问替代）
      &:focus-visible {
        outline: none;

        &::-webkit-slider-thumb {
          box-shadow:
            0 2px 6px rgba(212, 160, 23, 0.4),
            0 0 0 4px rgba(212, 160, 23, 0.25);
        }
        &::-moz-range-thumb {
          box-shadow:
            0 2px 6px rgba(212, 160, 23, 0.4),
            0 0 0 4px rgba(212, 160, 23, 0.25);
        }
      }
    }
    
    .timeline-marks {
      display: flex;
      justify-content: space-between;
      margin-top: var(--spacing-sm);
      
      span {
        font-size: 11px;
        color: var(--color-text-muted);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        transition: background-color 0.3s var(--ease-out), color 0.3s var(--ease-out);

        &.active {
          background: var(--color-secondary);
          color: var(--color-gold-ink);
        }
      }
    }
    
    .current-period {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: var(--spacing-md);
      padding: 8px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      border-radius: var(--radius-full);
      color: white;
      font-size: 13px;
      font-weight: 600;
    }
  }
}

// ============================================
// 时光回放按钮
// ============================================
.play-btn {
  margin-left: auto;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
  color: #fff;
  font-size: 11px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(139, 69, 19, 0.3);
  transition: transform 0.2s var(--ease-out);

  &:hover { transform: scale(1.1); }
}

// ============================================
// 地图浮动工具栏
// ============================================
.floating-toolbar {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px;
  background: rgba(255, 250, 240, 0.95);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);

  &:hover {
    background: rgba(212, 160, 23, 0.18);
    transform: scale(1.06);
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }

  &.active {
    background: var(--color-secondary);
    color: var(--color-gold-ink);
  }
}

.toolbar-icon {
  width: 20px;
  height: 20px;
  flex: none;
}

// ============================================
// 测距提示横幅
// ============================================
.measure-hint {
  position: absolute;
  top: 14px;
  left: 50%;
  z-index: 1000;
  transform: translateX(-50%);
  padding: 7px 18px;
  background: rgba(198, 40, 40, 0.92);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hint-fade-enter-active,
.hint-fade-leave-active {
  transition: opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out);
}
.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}

// 测距模式十字光标
:deep(.measure-cursor),
:deep(.measure-cursor .leaflet-grab),
:deep(.measure-cursor .leaflet-interactive) {
  cursor: crosshair !important;
}

// 测距结果气泡
:deep(.measure-tip) {
  background: #C62828;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);

  &::before { display: none; }
}

// ============================================
// 古道聚焦信息卡
// ============================================
.route-focus-card {
  position: absolute;
  top: 196px;
  right: 12px;
  bottom: 78px;   // 底部止于底图切换按钮上方，绝不重叠（按钮区约 64px 高 + 间距）
  z-index: 1000;
  width: 280px;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.route-card-close {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-light);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: var(--color-primary);
  }
}

.route-card-head {
  display: flex;
  align-items: stretch;
  gap: 10px;
  margin-bottom: var(--spacing-md);

  .route-card-line {
    width: 4px;
    border-radius: 2px;
  }

  .route-card-headtext {
    h3 {
      margin: 0 0 2px;
      font-size: 1.15rem;
      color: var(--color-primary);
    }
  }

  .route-card-meta {
    font-size: 12px;
    color: var(--color-text-light);
  }
}

.route-card-desc {
  margin: 0 0 var(--spacing-md);
  font-size: 13px;
  line-height: 1.85;
  color: var(--color-text);
}

.route-card-chartnote {
  margin: 0 0 var(--spacing-md);
  padding: 6px 10px;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--color-primary);
  background: rgba(212, 160, 23, 0.12);
  border-left: 3px solid var(--color-secondary);
  border-radius: 4px;
}

.route-card-items-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-light);
  margin-bottom: 8px;

  em {
    font-style: normal;
    color: var(--color-secondary-dark);
  }
}

.route-card-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.route-item-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 12px;
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    border-color 0.2s var(--ease-out),
    background-color 0.2s var(--ease-out),
    transform 0.2s var(--ease-out);

  .chip-name {
    font-size: 13px;
    color: var(--color-primary);
  }

  .chip-level {
    font-size: 11px;
    color: var(--color-secondary-dark);
    background: rgba(212, 160, 23, 0.14);
    padding: 1px 7px;
    border-radius: var(--radius-full);
    white-space: nowrap;
  }

  &:hover {
    border-color: var(--color-secondary);
    background: rgba(212, 160, 23, 0.08);
    transform: translateX(-3px);
  }
}

.card-slide-enter-active,
.card-slide-leave-active {
  transition: opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out);
}
.card-slide-enter-from,
.card-slide-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

// ============================================
// 图例面板
// ============================================
.map-legend {
  position: absolute;
  bottom: 26px;
  left: 12px;
  z-index: 1000;
  width: 172px;
  padding: 10px 12px;

  &.collapsed {
    width: auto;
    padding: 6px 10px;
  }
}

// 图例卡片内的比例尺行（动态插入的 DOM，用 :deep 命中）
:deep(.map-legend .legend-scale-wrap) {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed var(--color-border-light);

  .legend-scale-label {
    font-size: 11px;
    color: var(--color-text-light);
  }

  // 融入图例卡片：去掉原生白底与边框，只保留刻度线
  .leaflet-control-scale-line {
    position: static;
    margin: 0;
    padding: 2px 4px 0;
    background: transparent;
    border: none;
    border-top: 2px solid var(--color-primary);
    color: var(--color-text-light);
    font-size: 10px;
    line-height: 1.3;
  }
}

.legend-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  border: none;
  background: transparent;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.legend-body {
  margin-top: 8px;
}

.legend-group {
  margin-bottom: 8px;

  &:last-child { margin-bottom: 0; }
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  color: var(--color-text);
  line-height: 1.9;
}

.sample-marker {
  font-size: 13px;
  width: 16px;
  text-align: center;

  &.national { font-size: 15px; filter: drop-shadow(0 0 2px rgba(212,175,55,0.9)); }
  &.regional { font-size: 12px; }
  &.county {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    border: 1.5px solid #7A8A6E;
    background: radial-gradient(circle, #7A8A6E 0 26%, #F6F8F2 30%);
  }
}

.sample-line {
  flex: none;
  width: 22px;
  height: 4px;
  border-radius: 2px;
  background: var(--color-secondary);

  &.river { background: #1E88E5; }
}

.sample-heat {
  flex: none;
  width: 22px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(198, 40, 40, 0.5), rgba(139, 69, 19, 0.12) 70%, transparent);
}

.sample-grad {
  flex: none;
  width: 26px;
  height: 10px;
  border-radius: 2px;
  border: 1px solid var(--color-border-light);
  background: linear-gradient(90deg, #F7E8CB, #D4A017, #6D4812);
}

.legend-empty {
  font-size: 11px;
  color: var(--color-text-light);
}

// ============================================
// 底图切换
// ============================================
.base-switcher {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 1000;
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(255, 250, 240, 0.95);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px 10px;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-out);

    .base-icon { width: 16px; height: 16px; color: var(--color-primary); flex: none; }
    .base-label { font-size: 10.5px; color: var(--color-text-light); }

    &:hover { background: rgba(212, 160, 23, 0.15); }

    &:focus-visible {
      outline: 2px solid var(--color-secondary);
      outline-offset: 2px;
    }

    &.active {
      background: var(--color-secondary);

      .base-icon,
      .base-label { color: var(--color-gold-ink); }
    }
  }
}

// ============================================
// 实时经纬度读数
// ============================================
.coord-readout {
  position: absolute;
  bottom: 14px;
  left: 50%;
  z-index: 900;
  transform: translateX(-50%);
  padding: 4px 14px;
  background: rgba(62, 39, 35, 0.82);
  color: #F5E6C8;
  border-radius: var(--radius-full);
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
}

// ============================================
// 图表联动提示（图表区下方，右下角）
// ============================================
.chart-link-hint {
  margin: 18px 0 0;
  padding: 8px 14px;
  background: rgba(253, 248, 240, 0.92);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-secondary-dark);
}

// 桌面端：收缩为靠右胶囊（移动端为块级，避免 nowrap 溢出）
@media (min-width: 993px) {
  .chart-link-hint {
    display: table;
    margin-left: auto;
    border-radius: 999px;
    white-space: nowrap;
  }
}

// ============================================
// 列表视图覆盖层
// ============================================
.list-view-overlay {
  position: absolute;
  inset: 0;
  z-index: 600;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f4ead7 0%, #ede0c8 100%);
}

.list-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: 22px 28px 15px;
  border-bottom: 1px solid var(--color-border-light);
  background: rgba(253, 248, 231, 0.88);

  h3 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 20px;
    letter-spacing: 0.04em;
    color: var(--color-gold-ink);
  }
}

.list-count {
  font-size: 13px;
  color: var(--color-secondary-dark);
  white-space: nowrap;
}

.list-items {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 18px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 15px 20px;
  background: linear-gradient(180deg, #fdf8eb 0%, #f7efdd 100%);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out),
              border-color 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(212, 160, 23, 0.5);
    box-shadow: var(--shadow-md);

    .action-arrow {
      color: #fff8e7;
      background: var(--color-secondary);
      transform: translateX(4px);
    }
  }
}

.item-image {
  position: relative;
  flex: 0 0 auto;
  width: 86px;
  height: 86px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: linear-gradient(135deg, #d8c6a6 0%, #c2ac85 100%);
  box-shadow: inset 0 0 0 1px rgba(62, 42, 8, 0.08);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;

    &.is-failed { display: none; }
  }
}

.item-char {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 700;
  color: rgba(253, 246, 227, 0.92);
  text-shadow: 0 1px 3px rgba(62, 42, 8, 0.28);
}

.item-content {
  flex: 1;
  min-width: 0;

  p {
    margin: 6px 0 8px;
    font-size: 13px;
    line-height: 1.65;
    color: #6b5a44;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.item-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  h4 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 17px;
    color: var(--color-gold-ink);
  }
}

.item-badge {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  line-height: 1.6;
  white-space: nowrap;

  &.badge-gold {
    background: linear-gradient(135deg, #d4a017 0%, #b8860b 100%);
    color: #fff8e7;
    box-shadow: 0 2px 6px rgba(184, 134, 11, 0.35);
  }

  &.badge-silver {
    background: linear-gradient(135deg, #a0825a 0%, #8b4513 100%);
    color: #fdf6e3;
  }
}

.item-tags {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}

.tag-sm {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 9px;
  border-radius: var(--radius-full);
  font-size: 11px;
  line-height: 1.6;

  &.tag-category { background: rgba(212, 160, 23, 0.16); color: #8a6708; }
  &.tag-location { background: rgba(139, 69, 19, 0.10); color: #6d3410; }
  &.tag-period   { background: rgba(46, 109, 87, 0.12);  color: #23634a; }
}

.item-action {
  flex: 0 0 auto;
}

.action-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  background: rgba(212, 160, 23, 0.16);
  color: var(--color-secondary-dark);
  font-size: 16px;
  transition: transform 0.3s var(--ease-out), color 0.3s var(--ease-out),
              background 0.3s var(--ease-out);
}

// 列表视图入场动画
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.38s var(--ease-out), opacity 0.3s var(--ease-out);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(28px);
  opacity: 0;
}

// ============================================
// 详情弹窗
// ============================================
.detail-modal {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(43, 28, 12, 0.55);
  backdrop-filter: blur(3px);
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 880px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s var(--ease-out);

  .modal-content {
    transition: transform 0.35s var(--ease-out), opacity 0.35s var(--ease-out);
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-content {
    transform: translateY(24px) scale(0.98);
    opacity: 0;
  }
}

.modal-close {
  position: absolute;
  top: 13px;
  right: 13px;
  z-index: 2;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: var(--radius-full);
  background: rgba(62, 42, 8, 0.08);
  color: var(--color-gold-ink);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.25s var(--ease-out), transform 0.25s var(--ease-out);

  &:hover {
    background: rgba(139, 69, 19, 0.18);
    transform: rotate(90deg);
  }
}

.detail-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 28px;
  align-items: start;
}

.detail-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: linear-gradient(135deg, #d8c6a6 0%, #c2ac85 100%);
  box-shadow: var(--shadow-sm);
}

.detail-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-char {
  font-family: var(--font-display);
  font-size: 72px;
  font-weight: 700;
  color: rgba(253, 246, 227, 0.92);
  text-shadow: 0 2px 4px rgba(62, 42, 8, 0.28);
}

.detail-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  &.is-failed { display: none; }
}

.image-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 30px 13px 11px;
  background: linear-gradient(180deg, transparent 0%, rgba(43, 28, 12, 0.55) 100%);
  pointer-events: none;
}

.level-badge {
  display: inline-block;
  padding: 3px 11px;
  border-radius: var(--radius-full);
  font-size: 11px;
  color: #fff8e7;

  &.level-national {
    background: linear-gradient(135deg, #d4a017 0%, #b8860b 100%);
    box-shadow: 0 2px 8px rgba(184, 134, 11, 0.5);
  }

  &.level-regional {
    background: linear-gradient(135deg, rgba(160, 130, 90, 0.94) 0%, rgba(139, 69, 19, 0.94) 100%);
  }
}

.detail-info {
  min-width: 0;

  h2 {
    margin: 0 0 12px;
    font-family: var(--font-display);
    font-size: 26px;
    letter-spacing: 0.03em;
    color: var(--color-gold-ink);
  }
}

.detail-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.detail-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 11px;
  border-radius: var(--radius-full);
  font-size: 12px;

  &.tag-category { background: rgba(212, 160, 23, 0.16); color: #8a6708; }
  &.tag-location { background: rgba(139, 69, 19, 0.10); color: #6d3410; }
  &.tag-period   { background: rgba(46, 109, 87, 0.12);  color: #23634a; }
}

.detail-intro {
  margin: 0 0 18px;
  padding-left: 13px;
  border-left: 3px solid var(--color-secondary);
  font-size: 14px;
  line-height: 1.8;
  color: #5c4a33;
}

.detail-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 22px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  padding: 10px 13px;
  background: rgba(255, 248, 231, 0.7);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
}

.meta-label {
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--color-secondary-dark);
}

.meta-value {
  font-size: 13px;
  font-weight: 600;
  word-break: break-word;
  color: var(--color-gold-ink);
}

.detail-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 22px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.25s var(--ease-out), box-shadow 0.25s var(--ease-out),
              background 0.25s var(--ease-out);
}

.btn-primary {
  background: linear-gradient(135deg, #a05a2c 0%, #8b4513 100%);
  color: #fdf6e3;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 7px 16px rgba(139, 69, 19, 0.38);
  }
}

.btn-secondary {
  background: transparent;
  border-color: rgba(139, 69, 19, 0.4);
  color: var(--color-primary);

  &:hover {
    background: rgba(139, 69, 19, 0.08);
    transform: translateY(-1px);
  }
}

// ============================================
// 图表卡片与章节标题
// ============================================
.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}

.header-decoration {
  display: flex;
  gap: 7px;
}

.deco-line {
  width: 42px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, var(--color-secondary));

  &:last-child {
    background: linear-gradient(90deg, var(--color-secondary), transparent);
  }
}

.section-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 26px;
  letter-spacing: 0.08em;
  color: var(--color-gold-ink);
}

.chart-card {
  padding: 20px 20px 12px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.chart-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  h3 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 17px;
    color: var(--color-gold-ink);

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 16px;
      margin-right: 9px;
      border-radius: 2px;
      background: linear-gradient(180deg, var(--color-secondary), var(--color-primary));
      vertical-align: -2px;
    }
  }
}

// ============================================
// 移动端适配（列表视图 + 详情弹窗）
// ============================================
@media (max-width: 768px) {
  .hero-stats {
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-xs) var(--spacing-sm);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-lg);
  }
  .hero-stat-separator { display: none; }
  .hero-stat-item .stat-num { font-size: 1.2rem; }

  .list-header { padding: 16px 18px 12px; }
  .list-items { padding: 14px 16px 20px; gap: 12px; }
  .list-item { gap: 13px; padding: 12px 14px; }
  .item-image { width: 64px; height: 64px; }
  .item-char { font-size: 26px; }
  .item-header h4 { font-size: 15px; }
  .item-content p { margin: 4px 0 6px; }
  .item-action { display: none; }

  .detail-modal { padding: 0; }
  .modal-content {
    height: 100%;
    max-height: 100vh;
    padding: 22px 18px;
    border-radius: 0;
  }
  .detail-body { grid-template-columns: 1fr; gap: 18px; }
  .detail-image-wrapper { aspect-ratio: 16 / 9; }
  .placeholder-char { font-size: 56px; }
  .detail-info h2 { font-size: 22px; }
  .detail-meta-grid { grid-template-columns: 1fr; }
  .detail-actions .btn-primary,
  .detail-actions .btn-secondary { flex: 1; }

  .section-title { font-size: 22px; }
}
</style>