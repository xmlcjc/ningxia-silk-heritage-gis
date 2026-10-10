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
            <!-- 主视觉 -->
            <figure class="detail-hero">
              <img :src="heritage.coverImage" :alt="heritage.name" class="hero-image" loading="eager">
              <figcaption class="hero-caption">{{ heritage.name }} · {{ heritage.county }}</figcaption>
            </figure>

            <!-- 标题信息 -->
            <div class="detail-header card">
              <div class="header-tags">
                <el-tag type="warning">{{ heritage.category }}</el-tag>
                <el-tag type="success">{{ heritage.city }}</el-tag>
                <el-tag type="info">{{ heritage.level }}</el-tag>
                <el-tag type="danger">{{ heritage.period }}</el-tag>
              </div>
              <h1>{{ heritage.name }}</h1>
              <p class="header-lead">{{ heritage.intro }}</p>
              <div class="header-meta">
                <span><el-icon><Location /></el-icon> {{ heritage.county }}</span>
                <span><el-icon><User /></el-icon> 传承人：{{ heritage.inheritor }}</span>
                <span><el-icon><Position /></el-icon> {{ heritage.lng }}, {{ heritage.lat }}</span>
              </div>
            </div>

            <!-- 项目概述 -->
            <div class="detail-section card">
              <h2 class="section-title-inner">项目概述</h2>
              <p class="prose-dropcap">{{ heritage.overview }}</p>
            </div>

            <!-- 技艺/表演特色 -->
            <div class="detail-section card">
              <h2 class="section-title-inner">技艺特色</h2>
              <p class="prose">{{ heritage.craft }}</p>
              <div class="process-flow" v-if="hasSteps">
                <template v-for="(step, index) in processSteps" :key="index">
                  <div class="process-step">
                    <div class="step-number">{{ index + 1 }}</div>
                    <div class="step-content">{{ step }}</div>
                  </div>
                  <span v-if="index < processSteps.length - 1" class="step-arrow">›</span>
                </template>
              </div>
              <p v-else class="process-note">{{ heritage.process }}</p>
            </div>

            <!-- 文化价值与传承 -->
            <div class="detail-section card">
              <h2 class="section-title-inner">文化价值与传承</h2>
              <p class="prose">{{ heritage.value }}</p>
              <div class="status-row">
                <el-tag type="success" effect="light">保护状态良好</el-tag>
                <span class="status-text">{{ heritage.protectionStatus }}</span>
              </div>
            </div>

            <!-- 丝路关联 -->
            <div class="detail-section card">
              <h2 class="section-title-inner">丝路关联</h2>
              <div class="route-relation">
                <el-alert
                  :title="`关联丝路线路：${heritage.routeRelation}`"
                  type="warning"
                  :closable="false"
                  show-icon
                />
                <p class="route-note">
                  该非遗项目位于{{ heritage.routeRelation }}沿线，是丝绸之路文化交流与传播的重要见证，
                  体现了东西方文化在宁夏地区的交融与发展。
                </p>
              </div>
            </div>

            <!-- 场景展示 -->
            <div v-if="heritage.models && heritage.models.length" class="detail-section card">
              <h2 class="section-title-inner">场景展示</h2>
              <p class="model-hint">可拖动环视、滚轮缩放，浏览实景扫描场景</p>
              <ArtifactViewer :models="heritage.models" />
            </div>

            <!-- 图集 -->
            <div class="detail-section card">
              <h2 class="section-title-inner">图集展示</h2>
              <div class="gallery-grid" :class="{ 'is-paired': galleryPaired }">
                <button
                  v-for="(img, index) in heritage.gallery"
                  :key="index"
                  class="gallery-item"
                  :class="{ 'is-feature': index === 0 }"
                  @click="openLightbox(index)"
                  :aria-label="`查看图片 ${index + 1}`"
                >
                  <img :src="img" :alt="`${heritage.name} 图 ${index + 1}`" loading="lazy">
                </button>
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
              <router-link
                :to="{ path: '/map', query: { id: heritage.id, lng: heritage.lng, lat: heritage.lat, zoom: 12 } }"
                class="btn btn-primary sidebar-link"
              >
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
                  <img :src="item.thumbImage || item.coverImage" :alt="item.name" loading="lazy">
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
            <div class="nav-text">
              <span class="nav-label">下一项</span>
              <span class="nav-title">{{ nextHeritage?.name || '没有了' }}</span>
            </div>
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
      </div>
    </section>

    <!-- 图片灯箱 -->
    <transition name="lightbox-fade">
      <div v-if="lightboxIndex !== null" class="lightbox" role="dialog" aria-modal="true" aria-label="图片查看器"
           tabindex="-1" ref="lightboxEl"
           @click.self="closeLightbox" @keydown="onLightboxKeydown">
        <button class="lightbox-close" @click="closeLightbox" aria-label="关闭">×</button>
        <button class="lightbox-nav prev" @click="shiftImage(-1)" aria-label="上一张">‹</button>
        <figure class="lightbox-figure" @click.self="closeLightbox">
          <img :src="heritage.gallery[lightboxIndex]" :alt="`${heritage.name} 大图`">
          <figcaption>{{ lightboxIndex + 1 }} / {{ heritage.gallery.length }} · {{ heritage.name }}</figcaption>
        </figure>
        <button class="lightbox-nav next" @click="shiftImage(1)" aria-label="下一张">›</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Location, User, Position, MapLocation, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { heritageData } from '../data/heritageData'

// 三维查看器按需加载，避免查看器逻辑进入首屏主包
const ArtifactViewer = defineAsyncComponent(() => import('../components/ArtifactViewer.vue'))

const route = useRoute()
const router = useRouter()
const heritage = ref(null)
const processSteps = ref([])
const lightboxIndex = ref(null)
const lightboxEl = ref(null)

const hasSteps = computed(() => processSteps.value.length > 1)
// 偶数张图集时，大图之外的图片成对排列（末图落单时横向铺满）
const galleryPaired = computed(() => heritage.value?.gallery.length % 2 === 0)

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

const openLightbox = (index) => {
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
  nextTick(() => lightboxEl.value?.focus())
}

const closeLightbox = () => {
  lightboxIndex.value = null
  document.body.style.overflow = ''
}

const shiftImage = (delta) => {
  const len = heritage.value.gallery.length
  lightboxIndex.value = (lightboxIndex.value + delta + len) % len
}

const onLightboxKeydown = (e) => {
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') shiftImage(-1)
  else if (e.key === 'ArrowRight') shiftImage(1)
}

const loadHeritage = (id) => {
  heritage.value = heritageData.find(h => h.id === id)
  if (heritage.value && heritage.value.process.includes('→')) {
    processSteps.value = heritage.value.process.split('→')
  } else if (heritage.value) {
    processSteps.value = [heritage.value.process]
  }
}

watch(() => route.params.id, (newId) => {
  loadHeritage(parseInt(newId))
  nextTick(scrollToTop)
})

onMounted(() => {
  loadHeritage(parseInt(route.params.id))
  nextTick(scrollToTop)
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
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

/* ---- 主视觉 ---- */
.detail-hero {
  margin: 0 0 var(--spacing-lg);
}

.hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--border-radius);
  display: block;
}

.hero-caption {
  margin-top: var(--spacing-xs);
  text-align: right;
  font-size: 0.82rem;
  color: var(--color-text-light);
  letter-spacing: 0.08em;
}

/* ---- 标题卡 ---- */
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
  font-size: clamp(1.6rem, 3.5vw, 2rem);
  margin-bottom: var(--spacing-sm);
}

.header-lead {
  color: var(--color-text-light);
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 var(--spacing-md);
  padding-left: var(--spacing-md);
  border-left: 3px solid var(--color-secondary);
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

/* ---- 内容卡 ---- */
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

.model-hint {
  margin: 0 0 var(--spacing-md);
  font-size: 13px;
  color: var(--color-text-muted);
}

.prose,
.prose-dropcap {
  line-height: 2;
  color: var(--color-text);
  font-size: 0.98rem;
  text-align: justify;
}

.prose-dropcap::first-letter {
  float: left;
  font-size: 3.1em;
  line-height: 0.9;
  padding: 0.08em 0.14em 0 0;
  color: var(--color-primary);
  font-weight: 700;
}

/* ---- 流程节点 ---- */
.process-flow {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-top: var(--spacing-md);
}

.process-step {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-background);
  padding: var(--spacing-xs) var(--spacing-md) var(--spacing-xs) var(--spacing-xs);
  border-radius: var(--radius-full, 999px);
}

.step-number {
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  flex: none;
}

.step-content {
  color: var(--color-text);
  font-size: 0.9rem;
}

.step-arrow {
  color: var(--color-secondary);
  font-size: 1.2rem;
  line-height: 1;
}

.process-note {
  margin: var(--spacing-md) 0 0;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--border-radius);
  color: var(--color-text-light);
  font-size: 0.9rem;
}

/* ---- 保护状态 ---- */
.status-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
  flex-wrap: wrap;
}

.status-text {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

/* ---- 丝路 ---- */
.route-note {
  margin: var(--spacing-md) 0 0;
  color: var(--color-text-light);
  line-height: 1.9;
}

/* ---- 图集 ---- */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.gallery-item {
  padding: 0;
  border: none;
  background: var(--color-background);
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 4 / 3;
}

.gallery-item.is-feature {
  grid-column: 1 / -1;
  aspect-ratio: 16 / 8.5;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s var(--ease-out, ease);
}

.gallery-item:hover img,
.gallery-item:focus-visible img {
  transform: scale(1.05);
}

.gallery-item:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}

/* 偶数张：首图之后剩余奇数张，末图落单时横向铺满 */
.gallery-grid.is-paired .gallery-item:last-child {
  grid-column: 1 / -1;
  aspect-ratio: 16 / 8.5;
}

/* ---- 侧栏 ---- */
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

.sidebar-link {
  width: 100%;
  margin-top: var(--spacing-md);
  text-align: center;
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

.quick-nav a {
  padding: var(--spacing-sm);
  color: var(--color-text);
  border-radius: var(--border-radius);
  transition: background-color 0.3s var(--ease-out, ease);
}

.quick-nav a:hover {
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
  transition: background-color 0.3s var(--ease-out, ease);
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
  min-width: 0;
}

.related-info h4 {
  font-size: 0.95rem;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-info span {
  font-size: 0.85rem;
  color: var(--color-text-light);
}

/* ---- 上下导航 ---- */
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
  transition: border-color 0.3s var(--ease-out, ease), box-shadow 0.3s var(--ease-out, ease);
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

/* ---- 灯箱 ---- */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(30, 20, 10, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.lightbox-figure {
  margin: 0;
  max-width: min(86vw, 1200px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-figure img {
  max-width: 100%;
  max-height: 82vh;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
}

.lightbox-figure figcaption {
  margin-top: var(--spacing-sm);
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.lightbox-close,
.lightbox-nav {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.25s var(--ease-out, ease);
}

.lightbox-close:hover,
.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.25);
}

.lightbox-close:focus-visible,
.lightbox-nav:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}

.lightbox-close {
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  width: 44px;
  height: 44px;
  font-size: 1.5rem;
}

.lightbox-nav {
  width: 52px;
  height: 52px;
  font-size: 2rem;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-nav.prev { left: var(--spacing-lg); }
.lightbox-nav.next { right: var(--spacing-lg); }

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.25s var(--ease-out, ease);
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

/* ---- 响应式 ---- */
@media (max-width: 992px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .detail-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .hero-image {
    height: 240px;
  }

  .gallery-item.is-feature,
  .gallery-grid.is-paired .gallery-item:last-child {
    aspect-ratio: 16 / 10;
  }

  .detail-nav {
    flex-direction: column;
  }

  .lightbox-nav {
    width: 42px;
    height: 42px;
    font-size: 1.5rem;
  }

  .prose,
  .prose-dropcap {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-item img,
  .lightbox-fade-enter-active,
  .lightbox-fade-leave-active {
    transition: none;
  }
}
</style>
