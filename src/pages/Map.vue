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
            <span class="badge-icon">🗺️</span>
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
              <span class="header-icon">🗺️</span>
            </div>
            <h2>丝路非遗地图</h2>
            <p>探索宁夏丝路非遗的时空分布</p>
          </div>

          <!-- 搜索框 -->
          <div class="search-section">
            <div class="search-wrapper">
              <span class="search-icon">🔍</span>
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
              <span class="icon">🔖</span>
              <h4>筛选条件</h4>
            </div>
            
            <div class="filter-group">
              <label>
                <span class="label-icon">📍</span>
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
                <span class="label-icon">🎨</span>
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
                <span class="label-icon">⏳</span>
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
                <span class="label-icon">🏆</span>
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
              <span>🔄</span> 重置所有筛选
            </button>
          </div>

          <!-- 图层控制 -->
          <div class="layers-section">
            <div class="section-title-with-icon">
              <span class="icon">🛡️</span>
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
              <span class="icon">⏳</span>
              <h4>历史时期</h4>
            </div>
            
            <div class="timeline-wrapper">
              <input 
                type="range" 
                v-model="timeValue" 
                min="0" 
                max="4"
                step="1"
                class="timeline-slider"
                @input="onTimeChange"
              />
              <div class="timeline-marks">
                <span v-for="(label, index) in timeMarks" :key="index" 
                      :class="{ active: parseInt(timeValue) === index }">
                  {{ label }}
                </span>
              </div>
              <div class="current-period">
                <span class="period-icon">🏛️</span>
                {{ currentPeriod }}
              </div>
            </div>
          </div>

          <!-- 统计摘要 -->
          <div class="stats-summary card">
            <div class="stat-row">
              <span class="stat-label">
                <span class="stat-icon">📊</span>
                当前显示
              </span>
              <span class="stat-value">{{ filteredData.length }} <em>项</em></span>
            </div>
            <div class="stat-row">
              <span class="stat-label">
                <span class="stat-icon">🗺️</span>
                筛选范围
              </span>
              <span class="stat-value">{{ filterCount > 0 ? filterCount + ' 个条件' : '全部' }}</span>
            </div>
          </div>

          <!-- 视图切换 -->
          <div class="view-toggle-section">
            <div class="toggle-buttons">
              <button 
                class="toggle-btn"
                :class="{ 'active': viewMode === 'map' }"
                @click="viewMode = 'map'"
              >
                <span class="btn-icon">🗺️</span>
                <span class="btn-text">地图视图</span>
              </button>
              <button 
                class="toggle-btn"
                :class="{ 'active': viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                <span class="btn-icon">📋</span>
                <span class="btn-text">列表视图</span>
              </button>
            </div>
          </div>
        </aside>

        <!-- 地图主区域 -->
        <main class="map-main">
          <div class="map-view" ref="mapRef">
            <!-- 地图背景 -->
            <div class="map-background">
              <div class="map-grid"></div>
              <div class="ningxia-outlines">
                <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid meet">
                  <path class="province-outline" stroke="#8B4513" stroke-width="2" fill="#F5F0E6" opacity="0.6"
                    d="M80,60 L220,60 L260,100 L220,280 L150,350 L80,280 L40,140 Z"/>
                  <path class="river-path" stroke="#D4A017" stroke-width="3" fill="none" stroke-dasharray="8,4" opacity="0.4"
                    d="M60,120 Q100,100 140,120 T220,120"/>
                </svg>
              </div>
            </div>

            <!-- 非遗点位 -->
            <div class="heritage-points" v-if="viewMode === 'map'">
              <div 
                v-for="(item, index) in filteredData.slice(0, 30)" 
                :key="item.id"
                class="heritage-point"
                :style="{ 
                  left: pointPositions[index].x + '%', 
                  top: pointPositions[index].y + '%' 
                }"
                @mouseenter="showPointTooltip(item)"
                @mouseleave="hidePointTooltip"
                @click="showDetail(item)"
              >
                <span class="point-pulse"></span>
                <span class="point-marker" :class="'level-' + (item.level?.includes('国家级') ? 'national' : 'regional')">
                  📍
                </span>
                <transition name="fade">
                  <div v-if="tooltipVisible && tooltipItem?.id === item.id" class="point-tooltip">
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.category }}</span>
                    <span class="tooltip-arrow"></span>
                  </div>
                </transition>
              </div>
            </div>

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
                    @click="goToDetail(item.id)"
                  >
                    <div class="item-image" :style="{ backgroundColor: item.color || '#F5F0E6' }">
                      <span class="item-char">{{ item.name.charAt(0) }}</span>
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
                        <span class="tag-sm tag-location">📍 {{ item.city }}</span>
                        <span class="tag-sm tag-period">⏳ {{ item.period }}</span>
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
              <button class="toolbar-btn" title="缩放至全图" @click="zoomToFit">
                <span>🔲</span>
              </button>
              <button class="toolbar-btn" title="测量距离" @click="measureDistance">
                <span>📏</span>
              </button>
              <button class="toolbar-btn" title="打印地图" @click="printMap">
                <span>🖨️</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <!-- 数据统计图表区 -->
      <section class="charts-section texture-paper">
        <div class="container">
          <div class="section-header">
            <div class="header-decoration">
              <span class="deco-line"></span>
              <span class="deco-icon">📊</span>
              <span class="deco-line"></span>
            </div>
            <h2 class="section-title">数据洞察</h2>
            <p class="section-subtitle">多维度分析宁夏丝路非遗分布特征</p>
          </div>
          
          <div class="charts-grid">
            <div class="chart-card card-silk">
              <div class="chart-header">
                <span class="chart-icon">🥧</span>
                <h3>非遗类别分布</h3>
              </div>
              <div ref="pieChartRef" class="chart-container pie-chart"></div>
            </div>
            
            <div class="chart-card card-silk">
              <div class="chart-header">
                <span class="chart-icon">📍</span>
                <h3>地市分布统计</h3>
              </div>
              <div ref="barChartRef" class="chart-container bar-chart"></div>
            </div>
            
            <div class="chart-card card-silk">
              <div class="chart-header">
                <span class="chart-icon">⏳</span>
                <h3>历史时期演变</h3>
              </div>
              <div ref="lineChartRef" class="chart-container line-chart"></div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 详情弹窗 -->
    <transition name="modal-fade">
      <div v-if="detailDialogVisible" class="detail-modal">
        <div class="modal-backdrop" @click="detailDialogVisible = false"></div>
        <div class="modal-content card-silk">
          <button class="modal-close" @click="detailDialogVisible">×</button>
          
          <div v-if="selectedItem" class="detail-body">
            <div class="detail-image-wrapper">
              <div class="detail-placeholder" :style="{ backgroundColor: selectedItem.color || '#F5F0E6' }">
                <span class="placeholder-char">{{ selectedItem.name.charAt(0) }}</span>
              </div>
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
                <span class="detail-tag tag-location">📍 {{ selectedItem.city }}</span>
                <span class="detail-tag tag-period">⏳ {{ selectedItem.period }}</span>
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
                  <span>📄</span> 查看完整档案
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { heritageData, categories, cities, periods, levels } from '../data/heritageData'

const router = useRouter()
const mapRef = ref(null)
const pieChartRef = ref(null)
const barChartRef = ref(null)
const lineChartRef = ref(null)

// 状态
const searchKeyword = ref('')
const filters = ref({ city: '', category: '', period: '', level: '' })
const layers = ref({ heritage: true, routes: true, heatmap: false })
const viewMode = ref('map')
const timeValue = ref(2)
const detailDialogVisible = ref(false)
const selectedItem = ref(null)
const tooltipVisible = ref(false)
const tooltipItem = ref(null)

// 标签映射
const layerLabels = {
  heritage: '非遗点位',
  routes: '丝路古道',
  heatmap: '热力分布'
}

const timeMarks = { 0: '汉唐', 1: '宋元', 2: '明清', 3: '近现代', 4: '当代' }
const periodMap = ['汉唐', '宋元', '明清', '近现代', '当代']
const currentPeriod = computed(() => periodMap[timeValue.value])

// 筛选计数
const filterCount = computed(() => {
  let count = 0
  if (filters.value.city) count++
  if (filters.value.category) count++
  if (filters.value.period) count++
  if (filters.value.level) count++
  return count
})

// 筛选数据
const filteredData = computed(() => {
  return heritageData.filter(item => {
    const matchKeyword = !searchKeyword.value || 
      item.name.includes(searchKeyword.value) || 
      item.intro.includes(searchKeyword.value)
    const matchCity = !filters.value.city || item.city === filters.value.city
    const matchCategory = !filters.value.category || item.category === filters.value.category
    const matchPeriod = !filters.value.period || item.period === filters.value.period
    const matchLevel = !filters.value.level || item.level === filters.value.level
    return matchKeyword && matchCity && matchCategory && matchPeriod && matchLevel
  })
})

// 随机点位位置
const pointPositions = Array.from({ length: 50 }, () => ({
  x: 20 + Math.random() * 60,
  y: 25 + Math.random() * 55
}))

// 方法
const resetFilters = () => {
  searchKeyword.value = ''
  filters.value = { city: '', category: '', period: '', level: '' }
}

const onTimeChange = () => {
  console.log('切换时期:', currentPeriod.value)
}

const showPointTooltip = (item) => {
  tooltipItem.value = item
  tooltipVisible.value = true
}

const hidePointTooltip = () => {
  tooltipVisible.value = false
}

const showDetail = (item) => {
  selectedItem.value = item
  detailDialogVisible.value = true
}

const goToDetail = (id) => {
  if (id) {
    detailDialogVisible.value = false
    router.push(`/archive/${id}`)
  }
}

const zoomToFit = () => {
  console.log('缩放到全图')
}

const measureDistance = () => {
  console.log('测量距离')
}

const printMap = () => {
  window.print()
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 饼图 - 类别分布
    if (pieChartRef.value) {
      const pieChart = echarts.init(pieChartRef.value)
      const categoryData = categories.slice(1).map(cat => ({
        name: cat,
        value: heritageData.filter(h => h.category === cat).length
      })).filter(d => d.value > 0)

      pieChart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c}项 ({d}%)' },
        legend: { bottom: '0%', left: 'center', itemWidth: 12, itemHeight: 12 },
        series: [{
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          data: categoryData,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 13, fontWeight: 600 }
          }
        }]
      })
    }

    // 柱状图 - 地市分布
    if (barChartRef.value) {
      const barChart = echarts.init(barChartRef.value)
      const cityData = cities.slice(1).map(city => ({
        name: city,
        value: heritageData.filter(h => h.city === city).length
      }))

      barChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { 
          type: 'category', 
          data: cityData.map(d => d.name),
          axisLabel: { fontSize: 11 }
        },
        yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
        series: [{
          type: 'bar',
          data: cityData.map(d => d.value),
          itemStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#D4A017' },
              { offset: 1, color: '#B8860B' }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '50%'
        }]
      })
    }

    // 折线图 - 时期演变
    if (lineChartRef.value) {
      const lineChart = echarts.init(lineChartRef.value)
      const periodDataList = periodMap.map(p => ({
        name: p,
        value: heritageData.filter(h => h.period === p).length
      }))

      lineChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { 
          type: 'category', 
          data: periodDataList.map(d => d.name),
          axisLabel: { fontSize: 11 }
        },
        yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
        series: [{
          type: 'line',
          data: periodDataList.map(d => d.value),
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 3 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(212, 160, 23, 0.3)' },
              { offset: 1, color: 'rgba(212, 160, 23, 0.05)' }
            ])
          },
          itemStyle: { color: '#D4A017' }
        }]
      })
    }

    // 窗口大小改变时重绘
    window.addEventListener('resize', () => {
      pieChartRef.value && echarts.getInstanceByDom(pieChartRef.value)?.resize()
      barChartRef.value && echarts.getInstanceByDom(barChartRef.value)?.resize()
      lineChartRef.value && echarts.getInstanceByDom(lineChartRef.value)?.resize()
    })
  })
}

onMounted(() => {
  initCharts()
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
  
  @media (max-width: 992px) {
    width: 100%;
    max-height: 400px;
  }
}

.sidebar-header {
  text-align: center;
  
  .header-icon-wrapper {
    display: inline-flex;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
    border-radius: 50%;
    margin-bottom: var(--spacing-md);
    
    .header-icon {
      font-size: 28px;
      line-height: 56px;
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
      transition: all 0.3s ease;
      
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
    transition: all 0.3s ease;
    
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
      transition: all 0.3s ease;
      
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
      transition: all 0.3s ease;
      
      .switch-knob {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 50%;
        transition: all 0.3s ease;
        
        &.checked {
          left: 21px;
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
        transition: all 0.3s ease;
        
        &.active {
          background: var(--color-secondary);
          color: white;
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

.stats-summary {
  background: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  
  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    
    &:not(:last-child) {
      border-bottom: 1px solid var(--color-border-light);
    }
    
    .stat-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--color-text-light);
      
      .stat-icon {
        font-size: 14px;
      }
    }
    
    .stat-value {
      font-weight: 600;
      color: var(--color-primary);
      
      em {
        font-style: normal;
        font-size: 12px;
        color: var(--color-text-muted);
        margin-left: 2px;
      }
    }
  }
}

.view-toggle-section {
  .toggle-buttons {
    display: flex;
    gap: var(--spacing-sm);
    
    .toggle-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 16px;
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text);
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.active {
        background: var(--color-secondary);
        border-color: var(--color-secondary);
        color: white;
      }
    }
  }
}