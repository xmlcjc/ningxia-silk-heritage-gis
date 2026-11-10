<template>
  <figure class="geo-map">
    <div class="geo-map__stage">
      <svg
        :viewBox="`0 0 ${MAP_W} ${MAP_H}`"
        role="img"
        aria-label="宁夏回族自治区非遗地理分布示意图：以真实行政边界为底，叠加黄河、四条丝路古道与 20 项非遗点位"
      >
        <defs>
          <clipPath id="nx-province-clip">
            <path :d="provincePath" />
          </clipPath>

          <!-- 地形影像上的暖纸罩色，使卫星底图与站内暖白纸色融合 -->
          <linearGradient id="nx-paper-wash" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FFF8E7" stop-opacity="0.52" />
            <stop offset="52%" stop-color="#FDFBF7" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#F5F0E6" stop-opacity="0.36" />
          </linearGradient>

          <radialGradient id="nx-map-glow" cx="50%" cy="44%" r="62%">
            <stop offset="0%" stop-color="#D4A017" stop-opacity="0.13" />
            <stop offset="60%" stop-color="#D4A017" stop-opacity="0.04" />
            <stop offset="100%" stop-color="#D4A017" stop-opacity="0" />
          </radialGradient>

          <!-- 古道在画面左右边缘渐隐，读作“向宁夏之外延续”，避免生硬截断 -->
          <linearGradient id="nx-route-fade-x" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0" />
            <stop offset="10%" stop-color="#FFFFFF" stop-opacity="1" />
            <stop offset="90%" stop-color="#FFFFFF" stop-opacity="1" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
          </linearGradient>
          <mask id="nx-route-fade">
            <rect x="0" y="0" :width="MAP_W" :height="MAP_H" fill="url(#nx-route-fade-x)" />
          </mask>
        </defs>

        <!-- 背景光晕 -->
        <rect x="0" y="0" :width="MAP_W" :height="MAP_H" fill="url(#nx-map-glow)" />

        <!-- 省界投影 -->
        <path :d="provincePath" class="province-shadow" transform="translate(0 5)" />

        <g clip-path="url(#nx-province-clip)">
          <!-- 真实卫星地形（已按宁夏轮廓裁切，与省界同一坐标范围） -->
          <image
            :href="satImage"
            :x="imageRect.x"
            :y="imageRect.y"
            :width="imageRect.w"
            :height="imageRect.h"
            preserveAspectRatio="none"
            class="province-terrain"
          />
          <rect :x="imageRect.x" :y="imageRect.y" :width="imageRect.w" :height="imageRect.h" fill="url(#nx-paper-wash)" />

          <!-- 地级市边界（真实矢量） -->
          <path v-for="city in cityPaths" :key="city.name" :d="city.d" class="city-line" />
        </g>

        <!-- 省界描边 -->
        <path :d="provincePath" class="province-line" />

        <!-- 黄河（真实河道，自甘宁界至内蒙古界） -->
        <path :d="riverPath" class="river-halo" />
        <path :d="riverPath" class="river-line" />

        <!-- 四条丝路古道（真实走向，边缘渐隐） -->
        <g mask="url(#nx-route-fade)">
          <path
            v-for="route in routePaths"
            :key="route.name"
            :d="route.d"
            class="route-line"
            :style="{ stroke: route.color }"
          />
        </g>

        <text class="river-label" :x="riverLabel.x" :y="riverLabel.y" text-anchor="middle">黄河</text>

        <!-- 20 项非遗点位（真实经纬度） -->
        <g
          v-for="point in points"
          :key="point.id"
          class="heritage-point"
          :class="'is-' + point.levelKey"
        >
          <title>{{ point.name }} · {{ point.city }} · {{ point.level }}</title>
          <circle :cx="point.x" :cy="point.y" r="7" class="point-halo" />
          <circle :cx="point.x" :cy="point.y" :r="point.r" class="point-core" />
        </g>

        <!-- 三个代表项目的引线标注 -->
        <g v-for="callout in callouts" :key="callout.text" class="map-callout">
          <line
            :x1="callout.x"
            :y1="callout.y"
            :x2="callout.lx"
            :y2="callout.ly"
            class="callout-line"
          />
          <circle :cx="callout.x" :cy="callout.y" r="2.6" class="callout-anchor" />
          <text
            :x="callout.tx"
            :y="callout.ty"
            :text-anchor="callout.anchor"
            class="callout-text"
          >{{ callout.text }}</text>
        </g>

        <!-- 指北针 -->
        <g class="north-mark" :transform="`translate(${MAP_W - 26} 34)`">
          <path d="M0 -11 L4.2 2 L0 -1.6 L-4.2 2 Z" />
          <text x="0" y="13" text-anchor="middle">N</text>
        </g>
      </svg>
    </div>

    <figcaption class="geo-map__caption">
      <span class="legend-item"><i class="legend-dot"></i>非遗点位 20</span>
      <span class="legend-item"><i class="legend-route"></i>丝路古道 4</span>
      <span class="legend-item"><i class="legend-river"></i>黄河</span>
      <span class="legend-source">据宁夏行政边界与项目真实坐标绘制</span>
    </figcaption>
  </figure>
</template>

<script setup>
import { computed } from 'vue'
import outline from '../assets/ningxia-outline.json'
import cityGeo from '../data/ningxia-cities.geo.json'
import { heritageData, silkRoadRoutes } from '../data/heritageData'
import yellowRiverGeo from '../data/yellow-river.geo.json'
import satImage from '../assets/textures/nx_sat.webp'

// ============ 投影：与卫星纹理同为 Web Mercator ============
// 卫星底图由脚本按宁夏轮廓的 Web Mercator 外接框裁切，
// 因此矢量层必须使用同一投影，城市边界 / 黄河 / 古道才能与地形严格套合。
const MAP_W = 480
const PAD = 22

const provincePolygons = outline.features[0].geometry.coordinates

let minLon = Infinity
let maxLon = -Infinity
let minLat = Infinity
let maxLat = -Infinity
for (const polygon of provincePolygons) {
  for (const [lon, lat] of polygon[0]) {
    minLon = Math.min(minLon, lon)
    maxLon = Math.max(maxLon, lon)
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
  }
}

const mercatorY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
const rawX = (lon) => ((lon - minLon) * Math.PI) / 180
const rawY = (lat) => mercatorY(maxLat) - mercatorY(lat)
const rawW = rawX(maxLon)
const rawH = rawY(minLat)
const MAP_H = Math.round((MAP_W * rawH) / rawW)
const scale = Math.min((MAP_W - PAD * 2) / rawW, (MAP_H - PAD * 2) / rawH)
const offsetX = (MAP_W - rawW * scale) / 2
const offsetY = (MAP_H - rawH * scale) / 2

const project = (lon, lat) => [
  offsetX + rawX(lon) * scale,
  offsetY + rawY(lat) * scale
]
const fixed = (n) => n.toFixed(1)

const ringToPath = (ring) =>
  ring.map(([lon, lat], i) => {
    const [x, y] = project(lon, lat)
    return `${i === 0 ? 'M' : 'L'}${fixed(x)} ${fixed(y)}`
  }).join(' ') + 'Z'

const polygonsToPath = (polygons) =>
  polygons.map((polygon) => polygon.map(ringToPath).join(' ')).join(' ')

const provincePath = polygonsToPath(provincePolygons)

const cityPaths = cityGeo.features.map((feature) => {
  const geometry = feature.geometry
  const polygons = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates]
  return { name: feature.properties.name, d: polygonsToPath(polygons) }
})

const imageRect = {
  x: fixed(offsetX),
  y: fixed(offsetY),
  w: fixed(rawW * scale),
  h: fixed(rawH * scale)
}

// ============ 黄河 ============
const riverPath = yellowRiverGeo.geometry.coordinates.map(([lon, lat], i) => {
  const [x, y] = project(lon, lat)
  return `${i === 0 ? 'M' : 'L'}${fixed(x)} ${fixed(y)}`
}).join(' ')

const riverLabelPoint = project(105.62, 37.68)
const riverLabel = { x: fixed(riverLabelPoint[0] - 8), y: fixed(riverLabelPoint[1] - 10) }

// ============ 丝路古道 ============
// 统一到站内暖色系：赭石 / 鎏金 / 砂褐 / 暖棕（第五批：移除绿与蓝灰，保持四条古道可区分）
const ROUTE_COLORS = {
  xiaoguan: '#8B4513',
  huanling: '#C9971C',
  changxiy: '#A0522D',
  lingzhou: '#8A6D3B'
}

const routePaths = silkRoadRoutes.map((route) => {
  const lines = route.segments || [route.coordinates]
  return {
    name: route.name,
    color: ROUTE_COLORS[route.id] || route.color,
    d: lines.map((line) => line.map(([lon, lat], i) => {
      const [x, y] = project(lon, lat)
      return `${i === 0 ? 'M' : 'L'}${fixed(x)} ${fixed(y)}`
    }).join(' ')).join(' ')
  }
})

// ============ 非遗点位 ============
const LEVEL_KEY = { 国家级: 'national', 自治区级: 'regional', 市级: 'municipal' }
const LEVEL_RADIUS = { national: 4.2, regional: 3.3, municipal: 2.8 }

const points = heritageData.map((item) => {
  const [x, y] = project(item.lng, item.lat)
  const levelKey = LEVEL_KEY[item.level] || 'regional'
  return {
    id: item.id,
    name: item.name,
    city: item.city,
    level: item.level,
    levelKey,
    x: fixed(x),
    y: fixed(y),
    r: LEVEL_RADIUS[levelKey]
  }
})

// ============ 三个代表项目标注 ============
const calloutDefs = [
  { id: 1, text: '贺兰砚', dx: 24, dy: -16, anchor: 'start' },
  { id: 2, text: '回族花儿', dx: 24, dy: 22, anchor: 'start' },
  { id: 3, text: '羊皮筏子', dx: -24, dy: -16, anchor: 'end' }
]

const callouts = computed(() => calloutDefs.map((def) => {
  const item = heritageData.find((h) => h.id === def.id)
  if (!item) return null
  const [x, y] = project(item.lng, item.lat)
  return {
    text: def.text,
    x: fixed(x),
    y: fixed(y),
    lx: fixed(x + def.dx * 0.62),
    ly: fixed(y + def.dy * 0.62),
    tx: fixed(x + def.dx),
    ty: fixed(y + def.dy),
    anchor: def.anchor
  }
}).filter(Boolean))
</script>

<style scoped lang="scss">
.geo-map {
  margin: 0;
  width: 100%;
  position: relative;
}

.geo-map__stage {
  width: 100%;
  display: flex;
  justify-content: center;

  svg {
    display: block;
    width: auto;
    height: clamp(420px, 70vh, 680px);
    max-width: 100%;
    overflow: visible;
  }
}

// ---- 省界与地形 ----
.province-shadow {
  fill: rgba(62, 39, 35, 0.16);
}

.province-terrain {
  filter: sepia(0.68) saturate(1.16) brightness(1.04) contrast(1.02);
  opacity: 0.74;
}

.city-line {
  fill: none;
  stroke: rgba(93, 64, 55, 0.32);
  stroke-width: 0.7;
  stroke-dasharray: 3 3;
}

.province-line {
  fill: none;
  stroke: #7A3B10;
  stroke-width: 1.9;
  stroke-linejoin: round;
  opacity: 0.92;
}

// ---- 黄河 ----
.river-halo {
  fill: none;
  stroke: rgba(255, 248, 231, 0.78);
  stroke-width: 7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.river-line {
  fill: none;
  stroke: #8A5A12;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.95;
}

.river-label {
  font-family: var(--font-sub);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  fill: #6B4A0E;
  paint-order: stroke fill;
  stroke: var(--color-paper);
  stroke-width: 3.5px;
  stroke-linejoin: round;
}

// ---- 丝路古道 ----
.route-line {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 6 4;
  opacity: 0.88;
}

// ---- 非遗点位 ----
.heritage-point {
  .point-halo {
    fill: var(--color-interactive);
    opacity: 0.14;
  }

  .point-core {
    fill: var(--color-interactive);
    stroke: var(--color-paper);
    stroke-width: 1.3;
    transition: r var(--duration-fast) var(--ease-out), fill var(--duration-fast) var(--ease-out);
  }

  &.is-national .point-halo {
    opacity: 0.26;
  }

  &.is-national .point-core {
    fill: var(--color-interactive-active);
  }

  &:hover .point-core {
    r: 6;
    fill: var(--color-interactive-hover);
  }
}

// ---- 引线标注 ----
.callout-line {
  stroke: rgba(139, 69, 19, 0.55);
  stroke-width: 0.9;
}

.callout-anchor {
  fill: var(--color-paper);
  stroke: var(--color-primary);
  stroke-width: 1.1;
}

.callout-text {
  font-family: var(--font-sub);
  font-size: 13px;
  letter-spacing: 0.06em;
  fill: var(--color-text);
  paint-order: stroke fill;
  stroke: rgba(253, 251, 247, 0.92);
  stroke-width: 4px;
  stroke-linejoin: round;
}

// ---- 指北针 ----
.north-mark {
  path {
    fill: var(--color-primary);
    opacity: 0.55;
  }

  text {
    font-family: var(--font-en);
    font-size: 10px;
    letter-spacing: 0.1em;
    fill: var(--color-text-muted);
  }
}

// ---- 图例 ----
.geo-map__caption {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  margin-top: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-light);
  font-size: var(--text-caption);
  color: var(--color-text-muted);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
}

.legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-interactive);
}

.legend-route {
  width: 18px;
  height: 0;
  border-top: 1.5px dashed var(--color-secondary);
}

.legend-river {
  width: 18px;
  height: 2px;
  border-radius: 1px;
  background: var(--color-gold-refined);
}

.legend-source {
  margin-left: auto;
  color: var(--color-text-muted);
  opacity: 0.85;
}

@media (max-width: 1024px) {
  .geo-map__stage svg {
    height: clamp(360px, 46vw, 560px);
  }
}

@media (max-width: 768px) {
  .geo-map__stage svg {
    height: auto;
    width: min(100%, 360px);
  }

  .geo-map__caption {
    justify-content: center;
  }

  .legend-source {
    margin-left: 0;
    width: 100%;
    text-align: center;
  }
}
</style>
