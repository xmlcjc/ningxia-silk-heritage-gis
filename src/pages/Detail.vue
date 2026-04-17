<template>
  <div class="detail-page" v-if="heritage">
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb-nav">
          <router-link to="/">首页</router-link>
          <span>/</span>
          <router-link to="/archive">数字档案</router-link>
          <span>/</span>
          <span class="current">{{ heritage.name }}</span>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="detail-layout">
          <div class="detail-main">
            <div class="detail-hero">
              <img :src="heritage.coverImage" :alt="heritage.name" class="hero-image">
            </div>

            <div class="detail-header card">
              <div class="header-tags">
                <el-tag type="warning">{{ heritage.category }}</el-tag>
                <el-tag type="success">{{ heritage.city }}</el-tag>
                <el-tag type="info">{{ heritage.level }}</el-tag>
                <el-tag type="danger">{{ heritage.period }}</el-tag>
              </div>
              <h1>{{ heritage.name }}</h1>
              <div class="header-meta">
                <span><el-icon><Location /></el-icon> {{ heritage.county }}</span>
                <span><el-icon><User /></el-icon> 传承人：{{ heritage.inheritor }}</span>
                <span><el-icon><Position /></el-icon> {{ heritage.lng }}, {{ heritage.lat }}</span>
              </div>
            </div>

            <div class="detail-section card">
              <h2 class="section-title-inner">项目简介</h2>
              <p>{{ heritage.intro }}</p>
            </div>

            <div class="detail-section card">
              <h2 class="section-title-inner">历史渊源</h2>
              <p>{{ heritage.history }}</p>
            </div>

            <div class="detail-section card">
              <h2 class="section-title-inner">工艺流程</h2>
              <div class="process-flow">
                <div class="process-step" v-for="(step, index) in processSteps" :key="index">
                  <div class="step-number">{{ index + 1 }}</div>
                  <div class="step-content">{{ step }}</div>
                </div>
              </div>
            </div>

            <div class="detail-section card">
              <h2 class="section-title-inner">丝路关联</h2>
              <div class="route-relation">
                <el-alert
                  :title="`关联丝路线路：${heritage.routeRelation}`"
                  type="warning"
                  :closable="false"
                  show-icon
                />
                <p style="margin-top: var(--spacing-md); color: var(--color-text-light);">
                  该非遗项目位于{{ heritage.routeRelation }}沿线，是丝绸之路文化交流与传播的重要见证，
                  体现了东西方文化在宁夏地区的交融与发展。
                </p>
              </div>
            </div>

            <div class="detail-section card">
              <h2 class="section-title-inner">图集展示</h2>
              <div class="gallery-grid">
                <div v-for="i in 4" :key="i" class="gallery-item">
                  <div class="gallery-placeholder">
                    <el-icon size="40"><Picture /></el-icon>
                    <p>演示图片 {{ i }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="two-column-info">
              <div class="detail-section card">
                <h2 class="section-title-inner">保护现状</h2>
                <p>{{ heritage.protectionStatus }}</p>
                <div class="status-badge" style="margin-top: var(--spacing-md);">
                  <el-tag type="success">保护状态良好</el-tag>
                </div>
              </div>
              <div class="detail-section card">
                <h2 class="section-title-inner">研学价值</h2>
                <p>{{ heritage.studyValue }}</p>
                <router-link to="/study" class="btn btn-primary" style="margin-top: var(--spacing-md); display: inline-block;">
                  查看研学路线
                </router-link>
              </div>
            </div>

            <div class="detail-section card">
              <h2 class="section-title-inner">文创转化方向</h2>
              <p>{{ heritage.creativeDirection }}</p>
              <div class="creative-tags" style="margin-top: var(--spacing-md);">
                <el-tag v-for="tag in heritage.tags" :key="tag" style="margin-right: var(--spacing-xs); margin-bottom: var(--spacing-xs);">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>

          <div class="detail-sidebar">
            <div class="sidebar-card card">
              <h3>地图定位</h3>
              <div class="map-location">
                <div class="location-placeholder">
                  <el-icon size="60" color="#8B5A2B"><MapLocation /></el-icon>
                  <p>{{ heritage.city }} {{ heritage.county }}</p>
                </div>
              </div>
              <router-link to="/map" class="btn btn-primary" style="width: 100%; margin-top: var(--spacing-md);">
                在地图中查看
              </router-link>
            </div>

            <div class="sidebar-card card">
              <h3>快速导航</h3>
              <div class="quick-nav">
                <a href="#" @click.prevent="scrollToTop">返回顶部</a>
                <router-link to="/map">探索地图</router-link>
                <router-link to="/archive">返回列表</router-link>
              </div>
            </div>

            <div class="sidebar-card card">
              <h3>相关项目</h3>
              <div class="related-list">
                <div class="related-item" v-for="item in relatedHeritage" :key="item.id" @click="goToDetail(item.id)">
                  <img :src="item.coverImage" :alt="item.name">
                  <div class="related-info">
                    <h4>{{ item.name }}</h4>
                    <span>{{ item.category }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-nav">
          <button class="nav-btn" :disabled="!prevHeritage" @click="goToDetail(prevHeritage?.id)">
            <el-icon><ArrowLeft /></el-icon>
            <div class="nav-text">
              <span class="nav-label">上一项</span>
              <span class="nav-title">{{ prevHeritage?.name || '没有了' }}</span>
            </div>
          </button>
          <button class="nav-btn" :disabled="!nextHeritage" @click="goToDetail(nextHeritage?.id)">
            <div class="nav-text" style="text-align: right;">
              <span class="nav-label">下一项</span>
              <span class="nav-title">{{ nextHeritage?.name || '没有了' }}</span>
            </div>
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Location, User, Position, Picture, MapLocation, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { heritageData } from '../data/heritageData'

const route = useRoute()
const router = useRouter()
const heritage = ref(null)
const processSteps = ref([])

const currentIndex = computed(() => {
  return heritageData.findIndex(h => h.id === heritage.value?.id)
})

const prevHeritage = computed(() => {
  if (currentIndex.value > 0) {
    return heritageData[currentIndex.value - 1]
  }
  return null
})

const nextHeritage = computed(() => {
  if (currentIndex.value < heritageData.length - 1) {
    return heritageData[currentIndex.value + 1]
  }
  return null
})

const relatedHeritage = computed(() => {
  if (!heritage.value) return []
  return heritageData
    .filter(h => h.id !== heritage.value.id && (h.category === heritage.value.category || h.city === heritage.value.city))
    .slice(0, 4)
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToDetail = (id) => {
  if (id) {
    router.push(`/archive/${id}`)
  }
}

onMounted(() => {
  const id = parseInt(route.params.id)
  heritage.value = heritageData.find(h => h.id === id)
  if (heritage.value) {
    processSteps.value = heritage.value.process.split('→')
  }
  nextTick(() => {
    scrollToTop()
  })
})
</script>

<style scoped>
.page-header {
  background: var(--color-background);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border);
}

.breadcrumb-nav {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.breadcrumb-nav a {
  color: var(--color-primary);
}

.breadcrumb-nav .current {
  color: var(--color-text);
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--spacing-xl);
}

.detail-main {
  min-width: 0;
}

.detail-hero {
  margin-bottom: var(--spacing-lg);
}

.hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--border-radius);
}

.detail-header {
  margin-bottom: var(--spacing-lg);
}

.header-tags {
  margin-bottom: var(--spacing-md);
}

.header-tags .el-tag {
  margin-right: var(--spacing-xs);
}

.detail-header h1 {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
}

.header-meta {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  color: var(--color-text-light);
}

.header-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-section {
  margin-bottom: var(--spacing-lg);
}

.section-title-inner {
  font-size: 1.3rem;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
}

.detail-section p {
  line-height: 1.9;
  color: var(--color-text);
}

.process-flow {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.process-step {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-background);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
}

.step-number {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
}

.step-content {
  color: var(--color-text);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.gallery-item {
  aspect-ratio: 4/3;
  background: var(--color-background);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-placeholder {
  text-align: center;
  color: var(--color-text-light);
}

.gallery-placeholder p {
  margin-top: var(--spacing-xs);
}

.two-column-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.detail-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.sidebar-card {
  margin-bottom: var(--spacing-lg);
}

.sidebar-card h3 {
  margin-bottom: var(--spacing-md);
  font-size: 1.1rem;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.map-location {
  height: 180px;
  background: linear-gradient(135deg, #E8DFD0 0%, #D4C4AD 100%);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-placeholder {
  text-align: center;
}

.location-placeholder p {
  margin-top: var(--spacing-sm);
  color: var(--color-primary);
  font-weight: 500;
}

.quick-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.quick-nav a,
.quick-nav .router-link-active {
  padding: var(--spacing-sm);
  color: var(--color-text);
  border-radius: var(--border-radius);
  transition: background 0.3s;
}

.quick-nav a:hover,
.quick-nav .router-link-active:hover {
  background: var(--color-background);
  color: var(--color-primary);
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.related-item {
  display: flex;
  gap: var(--spacing-sm);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: background 0.3s;
}

.related-item:hover {
  background: var(--color-background);
}

.related-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius);
}

.related-info {
  flex: 1;
}

.related-info h4 {
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.related-info span {
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.detail-nav {
  margin-top: var(--spacing-xl);
  display: flex;
  gap: var(--spacing-lg);
}

.nav-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-text {
  flex: 1;
  text-align: left;
}

.nav-label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.nav-title {
  display: block;
  font-size: 1rem;
  color: var(--color-text);
  font-weight: 500;
}

@media (max-width: 992px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .detail-sidebar {
    position: static;
  }

  .two-column-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-image {
    height: 250px;
  }

  .process-flow {
    flex-direction: column;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .detail-nav {
    flex-direction: column;
  }
}
</style>
