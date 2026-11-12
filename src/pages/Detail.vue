<template>
  <div v-if="heritage" class="detail-page">
    <!-- ==================== 档案页头 ==================== -->
    <header class="detail-head">
      <div class="container">
        <nav class="crumb" aria-label="面包屑">
          <router-link to="/">首页</router-link>
          <span class="crumb__sep" aria-hidden="true">/</span>
          <router-link to="/archive">数字档案</router-link>
          <span class="crumb__sep" aria-hidden="true">/</span>
          <span class="crumb__current" aria-current="page">{{ heritage.name }}</span>
        </nav>

        <div class="detail-head__grid" data-reveal-stagger>
          <div class="head-copy">
            <p class="detail-eyebrow">
              <span class="detail-eyebrow__cat">{{ heritage.category }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ heritage.level }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ heritage.period }}</span>
            </p>

            <h1 class="detail-title">{{ heritage.name }}</h1>

            <p class="detail-meta">
              <span class="detail-meta__item">
                <Icon icon="gis:poi" width="14" height="14" />
                {{ heritage.city }} · {{ heritage.county }}
              </span>
              <span v-if="heritage.inheritor" class="detail-meta__item">
                <Icon icon="gis:map-user" width="14" height="14" />
                传承人 {{ heritage.inheritor }}
              </span>
              <span class="detail-meta__item">
                <Icon icon="gis:map-route" width="14" height="14" />
                {{ heritage.routeRelation }}
              </span>
            </p>

            <p class="detail-lead">{{ heritage.intro }}</p>

            <div class="head-actions">
              <router-link :to="mapLink" class="btn btn-primary">
                <Icon icon="gis:poi" width="17" height="17" />
                在地图中定位
              </router-link>
              <router-link to="/archive" class="btn btn-secondary">
                返回档案列表
              </router-link>
            </div>
          </div>

          <figure class="head-figure">
            <button
              type="button"
              class="head-figure__btn"
              :aria-label="`查看 ${heritage.name} 大图`"
              @click="openLightbox(0)"
            >
              <HeritageImage
                :src="heritage.coverImage"
                :alt="heritage.name"
                ratio="4 / 3"
                eager
                :fallback-char="heritage.name.charAt(0)"
              />
              <span class="head-figure__zoom">查看大图</span>
            </button>
            <figcaption>{{ heritage.name }} · {{ heritage.county }}</figcaption>
          </figure>
        </div>
      </div>
    </header>

    <!-- ==================== 正文 ==================== -->
    <section class="detail-body">
      <div class="container detail-grid">
        <article class="detail-article">
          <section id="overview" class="d-section" data-reveal>
            <h2 class="d-title"><span class="d-title__no">01</span>项目概述</h2>
            <p class="prose prose--first">{{ heritage.overview }}</p>
          </section>

          <section id="craft" class="d-section" data-reveal>
            <h2 class="d-title"><span class="d-title__no">02</span>技艺特色</h2>
            <p class="prose">{{ heritage.craft }}</p>

            <div v-if="hasSteps" class="process-flow" aria-label="工艺流程">
              <template v-for="(step, index) in processSteps" :key="index">
                <span class="process-step">
                  <span class="process-step__no">{{ index + 1 }}</span>
                  <span class="process-step__text">{{ step }}</span>
                </span>
                <span v-if="index < processSteps.length - 1" class="process-arrow" aria-hidden="true">›</span>
              </template>
            </div>
            <p v-else class="process-note">{{ heritage.process }}</p>

            <HeritageFigure v-if="heritage.figure" :figure="heritage.figure" />
          </section>

          <section id="value" class="d-section" data-reveal>
            <h2 class="d-title"><span class="d-title__no">03</span>文化价值与传承</h2>
            <p class="prose">{{ heritage.value }}</p>
            <p class="protection-line">
              <span class="protection-line__label">保护现状</span>
              {{ heritage.protectionStatus }}
            </p>
          </section>

          <section id="route" class="d-section" data-reveal>
            <h2 class="d-title"><span class="d-title__no">04</span>丝路关联</h2>
            <p class="route-fact">
              <span class="route-fact__label">关联古道</span>
              <strong>{{ heritage.routeRelation }}</strong>
            </p>
            <p class="prose">
              该非遗项目位于{{ heritage.routeRelation }}沿线，是丝绸之路文化交流与传播的重要见证，
              体现了东西方文化在宁夏地区的交融与发展。
            </p>
            <router-link
              :to="{ path: '/map', query: { route: heritage.routeRelation } }"
              class="route-link"
            >
              在地图中查看这条古道 <i aria-hidden="true">→</i>
            </router-link>
          </section>

          <section v-if="sceneModels.length" id="scene" class="d-section" data-reveal>
            <h2 class="d-title"><span class="d-title__no">{{ sectionNo('scene') }}</span>场景展示</h2>
            <p class="model-hint">可拖动环视、滚轮缩放，浏览实景扫描场景</p>
            <ArtifactViewer :models="sceneModels" />
          </section>

          <section v-if="artifactModels.length" id="artifact" class="d-section" data-reveal>
            <h2 class="d-title"><span class="d-title__no">{{ sectionNo('artifact') }}</span>文物展示</h2>
            <p class="model-hint">馆藏文物三维扫描，点击载入后可拖动旋转、滚轮缩放，查看器物细节</p>
            <div class="artifact-grid">
              <article v-for="item in artifactModels" :key="item.url" class="artifact-card">
                <ArtifactViewer :models="[item]" variant="card" />
                <div class="artifact-meta">
                  <h3 class="artifact-name">{{ item.label }}</h3>
                  <span v-if="item.credit" class="artifact-credit">{{ item.credit }}</span>
                </div>
              </article>
            </div>
          </section>

          <section v-if="heritage.gallery.length" id="gallery" class="d-section" data-reveal>
            <div class="d-head-row">
              <h2 class="d-title"><span class="d-title__no">{{ sectionNo('gallery') }}</span>图集</h2>
              <span class="d-head-hint">点击图片查看大图 · 共 {{ heritage.gallery.length }} 张</span>
            </div>

            <div class="gallery-grid" data-reveal-stagger>
              <button
                v-for="(img, index) in heritage.gallery"
                :key="index"
                type="button"
                class="gallery-item"
                :class="{ 'is-feature': index === 0 }"
                :aria-label="`查看 ${heritage.name} 图 ${index + 1}`"
                @click="openLightbox(index)"
              >
                <HeritageImage
                  :src="img"
                  :alt="`${heritage.name} 图 ${index + 1}`"
                  :ratio="index === 0 ? '16 / 9' : '4 / 3'"
                  :fallback-char="heritage.name.charAt(0)"
                />
                <span class="gallery-item__index">{{ index + 1 }} / {{ heritage.gallery.length }}</span>
              </button>
            </div>
          </section>
        </article>

        <!-- ==================== 侧栏 ==================== -->
        <aside class="detail-side" data-reveal data-reveal-delay="120">
          <div class="side-card">
            <h2 class="side-title">空间位置</h2>
            <dl class="place-list">
              <div class="place-row">
                <dt>所在地市</dt>
                <dd>{{ heritage.city }}</dd>
              </div>
              <div class="place-row">
                <dt>区县</dt>
                <dd>{{ heritage.county }}</dd>
              </div>
              <div class="place-row">
                <dt>经纬度</dt>
                <dd class="place-row__coord">{{ heritage.lng }}°E, {{ heritage.lat }}°N</dd>
              </div>
              <div class="place-row">
                <dt>关联古道</dt>
                <dd>{{ heritage.routeRelation }}</dd>
              </div>
              <div class="place-row">
                <dt>保护级别</dt>
                <dd>{{ heritage.level }}</dd>
              </div>
            </dl>
            <router-link :to="mapLink" class="btn btn-primary side-btn">
              <Icon icon="gis:map" width="16" height="16" />
              在地图中查看
            </router-link>
          </div>

          <nav class="side-card" aria-label="本页目录">
            <h2 class="side-title">本页目录</h2>
            <ul class="toc">
              <li v-for="item in sections" :key="item.id">
                <a :href="`#${item.id}`" @click.prevent="jumpTo(item.id)">{{ item.label }}</a>
              </li>
            </ul>
          </nav>

          <div v-if="relatedHeritage.length" class="side-card">
            <h2 class="side-title">相关项目</h2>
            <div class="related-list">
              <router-link
                v-for="item in relatedHeritage"
                :key="item.id"
                :to="`/archive/${item.id}`"
                class="related-item"
              >
                <span class="related-thumb">
                  <HeritageImage
                    :src="item.thumbImage || item.coverImage"
                    :alt="item.name"
                    ratio=""
                    :adaptive="false"
                    :fallback-char="item.name.charAt(0)"
                  />
                </span>
                <span class="related-info">
                  <span class="related-name">{{ item.name }}</span>
                  <span class="related-meta">{{ item.category }} · {{ item.city }}</span>
                </span>
              </router-link>
            </div>
          </div>
        </aside>
      </div>

      <!-- ==================== 上一项 / 下一项 ==================== -->
      <div class="container detail-nav">
        <button
          type="button"
          class="nav-btn"
          :disabled="!prevHeritage"
          @click="prevHeritage && goToDetail(prevHeritage.id)"
        >
          <Icon icon="gis:help-larrow" width="18" height="18" />
          <span class="nav-text">
            <span class="nav-label">上一项</span>
            <span class="nav-title">{{ prevHeritage?.name || '已是第一项' }}</span>
          </span>
        </button>
        <button
          type="button"
          class="nav-btn nav-btn--next"
          :disabled="!nextHeritage"
          @click="nextHeritage && goToDetail(nextHeritage.id)"
        >
          <span class="nav-text">
            <span class="nav-label">下一项</span>
            <span class="nav-title">{{ nextHeritage?.name || '已是最后一项' }}</span>
          </span>
          <Icon icon="gis:help-rarrow" width="18" height="18" />
        </button>
      </div>
    </section>

    <!-- ==================== 图片灯箱 ==================== -->
    <transition name="lightbox-fade">
      <div
        v-if="lightboxIndex !== null"
        ref="lightboxEl"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="图片查看器"
        tabindex="-1"
        @click.self="closeLightbox"
      >
        <button type="button" class="lightbox-close" aria-label="关闭" @click="closeLightbox">×</button>
        <button type="button" class="lightbox-nav prev" aria-label="上一张" @click="shiftImage(-1)">‹</button>
        <figure class="lightbox-figure">
          <img
            v-if="!lightboxFailed"
            :src="heritage.gallery[lightboxIndex]"
            :alt="`${heritage.name} 大图 ${lightboxIndex + 1}`"
            @error="lightboxFailed = true"
          />
          <div v-else class="lightbox-failed" role="status">
            <span class="lightbox-failed__char">{{ heritage.name.charAt(0) }}</span>
            <span>大图加载失败，请稍后重试</span>
          </div>
          <figcaption>
            {{ lightboxIndex + 1 }} / {{ heritage.gallery.length }} · {{ heritage.name }} · {{ heritage.county }}
          </figcaption>
        </figure>
        <button type="button" class="lightbox-nav next" aria-label="下一张" @click="shiftImage(1)">›</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import HeritageImage from '../components/HeritageImage.vue'
import { heritageData } from '../data/heritageData'

// 三维查看器按需加载，避免查看器逻辑进入首屏主包
const ArtifactViewer = defineAsyncComponent(() => import('../components/ArtifactViewer.vue'))
// 工艺示意图同样按需加载：图是内联 SVG，体积不小，且只有部分条目配了图
const HeritageFigure = defineAsyncComponent(() => import('../components/HeritageFigure.vue'))

const route = useRoute()
const router = useRouter()

const heritage = ref(null)
const processSteps = ref([])
const lightboxIndex = ref(null)
const lightboxFailed = ref(false)
const lightboxEl = ref(null)
let lastFocused = null

const hasSteps = computed(() => processSteps.value.length > 1)

const modelList = computed(() => heritage.value?.models || [])
// 文物模型进「文物展示」展柜卡片，其余扫描场景走「场景展示」大画布
const artifactModels = computed(() => modelList.value.filter((m) => m.kind === 'artifact'))
const sceneModels = computed(() => modelList.value.filter((m) => m.kind !== 'artifact'))

const mapLink = computed(() =>
  heritage.value
    ? {
        path: '/map',
        query: {
          id: heritage.value.id,
          lng: heritage.value.lng,
          lat: heritage.value.lat,
          zoom: 12
        }
      }
    : '/map'
)

const sections = computed(() => {
  if (!heritage.value) return []
  const list = [
    { id: 'overview', label: '项目概述' },
    { id: 'craft', label: '技艺特色' },
    { id: 'value', label: '文化价值与传承' },
    { id: 'route', label: '丝路关联' }
  ]
  if (sceneModels.value.length) list.push({ id: 'scene', label: '场景展示' })
  if (artifactModels.value.length) list.push({ id: 'artifact', label: '文物展示' })
  if (heritage.value.gallery.length) list.push({ id: 'gallery', label: '图集' })
  return list
})

const sectionNo = (id) => {
  const index = sections.value.findIndex((item) => item.id === id)
  return index >= 0 ? String(index + 1).padStart(2, '0') : ''
}

const currentIndex = computed(() => heritageData.findIndex((h) => h.id === heritage.value?.id))

const prevHeritage = computed(() => {
  if (currentIndex.value > 0) return heritageData[currentIndex.value - 1]
  return null
})

const nextHeritage = computed(() => {
  if (currentIndex.value >= 0 && currentIndex.value < heritageData.length - 1) {
    return heritageData[currentIndex.value + 1]
  }
  return null
})

const relatedHeritage = computed(() => {
  if (!heritage.value) return []
  return heritageData
    .filter(
      (h) =>
        h.id !== heritage.value.id &&
        (h.category === heritage.value.category || h.city === heritage.value.city)
    )
    .slice(0, 4)
})

const goToDetail = (id) => {
  if (id) router.push(`/archive/${id}`)
}

const jumpTo = (id) => {
  const target = document.getElementById(id)
  if (!target) return
  const offset = window.innerWidth <= 768 ? 76 : 88
  const top = target.getBoundingClientRect().top + window.scrollY - offset
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
}

let bodyOverflowBefore = ''
const openLightbox = (index) => {
  if (!heritage.value?.gallery.length) return
  lightboxFailed.value = false
  lastFocused = document.activeElement
  bodyOverflowBefore = document.body.style.overflow
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onLightboxKeydown)
  nextTick(() => lightboxEl.value?.focus())
}

const closeLightbox = () => {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = null
  lightboxFailed.value = false
  window.removeEventListener('keydown', onLightboxKeydown)
  document.body.style.overflow = bodyOverflowBefore || ''
  if (lastFocused instanceof HTMLElement && lastFocused.isConnected) lastFocused.focus()
  else document.getElementById('main')?.focus()
}

const shiftImage = (delta) => {
  const len = heritage.value.gallery.length
  lightboxFailed.value = false
  lightboxIndex.value = (lightboxIndex.value + delta + len) % len
}

const lightboxFocusables = () => {
  const root = lightboxEl.value
  if (!root) return []
  return [...root.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
}

// 灯箱打开期间挂在 window：即使焦点意外离开对话框，Esc / 方向键仍然有效
const onLightboxKeydown = (event) => {
  if (lightboxIndex.value === null) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeLightbox()
    return
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    shiftImage(-1)
    return
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    shiftImage(1)
    return
  }
  if (event.key !== 'Tab') return
  const items = lightboxFocusables()
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (!lightboxEl.value?.contains(document.activeElement)) {
    event.preventDefault()
    first.focus()
    return
  }
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

const loadHeritage = (id) => {
  heritage.value = heritageData.find((h) => h.id === id) || null
  if (heritage.value && heritage.value.process.includes('→')) {
    processSteps.value = heritage.value.process.split('→')
  } else if (heritage.value) {
    processSteps.value = [heritage.value.process]
  } else {
    processSteps.value = []
  }
}

watch(
  () => route.params.id,
  (newId) => {
    if (lightboxIndex.value !== null) closeLightbox()
    loadHeritage(parseInt(newId, 10))
    nextTick(() => window.scrollTo({ top: 0 }))
  }
)

onMounted(() => {
  loadHeritage(parseInt(route.params.id, 10))
  nextTick(() => window.scrollTo({ top: 0 }))
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onLightboxKeydown)
  document.body.style.overflow = bodyOverflowBefore || ''
})
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: var(--color-background);
}

// ============================================
// 页头
// ============================================
.detail-head {
  padding: var(--space-8) 0 var(--space-12);
  background:
    radial-gradient(880px 420px at 88% 0%, rgba(212, 160, 23, 0.1), transparent 62%),
    var(--color-paper);
  border-bottom: 1px solid var(--color-border-light);

  @media (max-width: 768px) {
    padding: var(--space-6) 0 var(--space-8);
  }
}

.crumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
  font-size: var(--text-caption);
  color: var(--color-text-muted);

  a {
    color: var(--color-text-medium);

    &:hover {
      color: var(--color-primary);
    }
  }

  &__sep {
    color: var(--color-border-strong);
  }

  &__current {
    color: var(--color-text);
  }

  @media (max-width: 768px) {
    margin-bottom: var(--space-6);
  }
}

.detail-head__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: var(--space-12);
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}

.detail-eyebrow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin: 0 0 var(--space-4);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);

  &__cat {
    padding: 3px 10px;
    border: 1px solid var(--color-gold-refined-line);
    border-radius: var(--radius-sm);
    color: var(--color-primary);
  }
}

.detail-title {
  margin: 0 0 var(--space-4);
  font-family: var(--font-title);
  font-size: clamp(2.2rem, 4.4vw, 3.6rem);
  font-weight: 400;
  line-height: var(--leading-tight);
  color: var(--color-primary-dark);
  // 11 字长标题在窄屏换行时避免单字孤行（渐进增强）
  text-wrap: balance;

  // 移动端 H1：字号由 clamp 下限 2.2rem 接管，此处只统一行高与字距
  @media (max-width: 768px) {
    line-height: 1.2;
    letter-spacing: 0.02em;
  }
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin: 0 0 var(--space-6);
  font-size: var(--text-caption);
  color: var(--color-text-muted);

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
}

.detail-lead {
  margin: 0 0 var(--space-6);
  padding-left: var(--space-4);
  border-left: 2px solid var(--color-gold-refined-line);
  font-size: var(--text-body-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-text-light);

  @media (max-width: 640px) {
    font-size: var(--text-body);
  }
}

.head-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.head-figure {
  margin: 0;

  &__btn {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-card);
    overflow: hidden;
    background: var(--color-surface);
    cursor: zoom-in;

    &:hover :deep(.h-image img) {
      transform: scale(1.03);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  &__zoom {
    position: absolute;
    right: var(--space-3);
    bottom: var(--space-3);
    z-index: 2;
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    background: rgba(46, 26, 15, 0.66);
    color: var(--color-white);
    font-size: var(--text-label);
    letter-spacing: 0.04em;
  }

  figcaption {
    margin-top: var(--space-2);
    font-size: var(--text-label);
    letter-spacing: 0.04em;
    color: var(--color-text-muted);
    text-align: right;
  }
}

// ============================================
// 正文布局
// ============================================
.detail-body {
  padding: var(--space-12) 0 var(--space-20);

  @media (max-width: 768px) {
    padding: var(--space-8) 0 var(--space-16);
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 312px;
  gap: var(--space-12);
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}

.detail-article {
  min-width: 0;
}

.d-section {
  padding-bottom: var(--space-8);
  margin-bottom: var(--space-8);
  border-bottom: 1px solid var(--color-border-light);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
}

.d-title {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin: 0 0 var(--space-4);
  font-family: var(--font-sub);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--color-text);

  &__no {
    font-family: var(--font-en);
    font-size: var(--text-caption);
    letter-spacing: 0.1em;
    color: var(--color-gold-refined);
  }

  @media (max-width: 640px) {
    font-size: 1.3rem;
  }
}

.d-head-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
}

.d-head-hint {
  font-size: var(--text-label);
  color: var(--color-text-muted);
}

.prose {
  // 长文阅读行宽：约 42 个汉字/行，避免 1440 下一行超过 60 字；
  // 仅约束文字段落，图集、主图与三维器物仍在 .d-section 中保持全宽
  max-width: 42em;
  margin: 0;
  font-size: var(--text-body);
  line-height: var(--leading-relaxed);
  color: var(--color-text);
  text-align: justify;

  &--first::first-letter {
    float: left;
    padding: 0.06em 0.14em 0 0;
    font-family: var(--font-title);
    font-size: 3em;
    line-height: 0.9;
    color: var(--color-primary);
  }

  @media (max-width: 768px) {
    text-align: left;
  }
}

// 工艺流程
.process-flow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
  padding: var(--space-4);
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
}

.process-step {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3) var(--space-1) var(--space-1);
  background: var(--color-background);
  border-radius: var(--radius-pill);

  &__no {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--color-primary);
    color: var(--color-paper);
    font-family: var(--font-en);
    font-size: 0.72rem;
  }

  &__text {
    font-size: var(--text-caption);
    color: var(--color-text);
  }
}

.process-arrow {
  color: var(--color-gold-refined);
  line-height: 1;
}

.process-note {
  margin: var(--space-4) 0 0;
  padding: var(--space-3) var(--space-4);
  background: var(--color-paper);
  border-left: 2px solid var(--color-gold-refined-line);
  font-size: var(--text-body-sm);
  line-height: 1.8;
  color: var(--color-text-light);
}

.protection-line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-3);
  margin: var(--space-6) 0 0;
  padding: var(--space-3) var(--space-4);
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-control);
  font-size: var(--text-body-sm);
  color: var(--color-text);

  &__label {
    flex: none;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    background: var(--color-success-soft);
    color: var(--color-success-ink);
    font-size: var(--text-label);
    letter-spacing: 0.04em;
  }
}

.route-fact {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin: 0 0 var(--space-4);
  font-size: var(--text-body);

  &__label {
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    background: var(--color-warning-soft);
    color: var(--color-warning-ink);
    font-size: var(--text-label);
  }

  strong {
    font-family: var(--font-sub);
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--color-primary);
  }
}

.route-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  font-size: var(--text-body-sm);
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-gold-refined-line);
  padding-bottom: 2px;

  i {
    font-style: normal;
    transition: transform 0.25s var(--ease-out, ease);
  }

  &:hover i {
    transform: translateX(3px);
  }
}

.model-hint {
  margin: 0 0 var(--space-4);
  font-size: var(--text-caption);
  color: var(--color-text-muted);
}

// 文物展柜
.artifact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.artifact-card {
  display: flex;
  flex-direction: column;
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  overflow: hidden;
}

.artifact-meta {
  padding: var(--space-3) var(--space-4) var(--space-4);
  border-top: 1px solid var(--color-border-light);
}

.artifact-name {
  margin: 0 0 4px;
  font-size: var(--text-body);
  font-weight: 400;
  color: var(--color-text);
}

.artifact-credit {
  font-size: var(--text-label);
  color: var(--color-text-muted);
}

// 图集
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-4);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.gallery-item {
  position: relative;
  display: block;
  padding: 0;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--color-paper);
  cursor: zoom-in;

  &.is-feature {
    grid-column: 1 / -1;
  }

  :deep(.h-image img) {
    transition: transform 0.5s var(--ease-out, ease), opacity 0.4s var(--ease-out, ease);
  }

  &:hover :deep(.h-image img) {
    transform: scale(1.04);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &__index {
    position: absolute;
    right: var(--space-2);
    bottom: var(--space-2);
    z-index: 2;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    background: rgba(46, 26, 15, 0.6);
    color: var(--color-white);
    font-family: var(--font-en);
    font-size: var(--text-label);
    letter-spacing: 0.04em;
  }
}

// ============================================
// 侧栏
// ============================================
.detail-side {
  position: sticky;
  top: 88px;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);

  @media (max-width: 992px) {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.side-card {
  padding: var(--space-4);
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
}

.side-title {
  margin: 0 0 var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border-light);
  font-family: var(--font-sub);
  font-size: 1.05rem;
  font-weight: 400;
  color: var(--color-text);
}

.place-list {
  margin: 0;
}

.place-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-2) 0;
  border-bottom: 1px dashed var(--color-border-light);
  font-size: var(--text-caption);

  &:last-child {
    border-bottom: none;
  }

  dt {
    flex: none;
    color: var(--color-text-muted);
  }

  dd {
    margin: 0;
    text-align: right;
    color: var(--color-text);
  }

  &__coord {
    font-family: var(--font-en);
    font-size: var(--text-label);
    letter-spacing: 0.02em;
  }
}

.side-btn {
  width: 100%;
  margin-top: var(--space-4);
}

.toc {
  margin: 0;
  padding: 0;
  list-style: none;

  li + li {
    margin-top: 2px;
  }

  a {
    display: block;
    padding: var(--space-2) var(--space-2);
    border-radius: var(--radius-sm);
    font-size: var(--text-body-sm);
    color: var(--color-text-medium);

    &:hover {
      background: var(--color-primary-soft);
      color: var(--color-primary);
    }
  }
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.related-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text);

  &:hover .related-name {
    color: var(--color-primary);
  }
}

.related-thumb {
  flex: none;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  overflow: hidden;

  :deep(.h-image) {
    height: 100%;
  }
}

.related-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.related-name {
  font-size: var(--text-body-sm);
  line-height: 1.5;
  transition: color 0.25s var(--ease-out, ease);
}

.related-meta {
  font-size: var(--text-label);
  color: var(--color-text-muted);
}

// ============================================
// 上下导航
// ============================================
.detail-nav {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-12);

  @media (max-width: 640px) {
    flex-direction: column;
  }
}

.nav-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  color: var(--color-text);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.25s var(--ease-out, ease), box-shadow 0.25s var(--ease-out, ease);

  &:hover:not(:disabled) {
    border-color: var(--color-gold-refined-line);
    box-shadow: var(--shadow-xs);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // 暖白纸面背景：用深赭石色焦点环保证键盘可见性
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &--next {
    justify-content: flex-end;
    text-align: right;
  }
}

.nav-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.nav-label {
  font-size: var(--text-label);
  color: var(--color-text-muted);
}

.nav-title {
  font-family: var(--font-sub);
  font-size: var(--text-body);
  color: var(--color-text);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// ============================================
// 灯箱
// ============================================
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-6);
  background: rgba(30, 20, 10, 0.93);
}

.lightbox-figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: min(88vw, 1280px);

  img {
    display: block;
    max-width: 100%;
    max-height: 82vh;
    object-fit: contain;
    border-radius: var(--radius-sm);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
  }

  figcaption {
    margin-top: var(--space-3);
    font-size: var(--text-caption);
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.78);
  }
}

.lightbox-failed {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  width: min(70vw, 640px);
  height: min(50vh, 360px);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-card);
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--text-body-sm);

  &__char {
    font-family: var(--font-title);
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.35);
  }
}

.lightbox-close,
.lightbox-nav {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: var(--color-white);
  cursor: pointer;
  transition: background-color 0.25s var(--ease-out, ease);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }
}

.lightbox-close {
  top: var(--space-4);
  right: var(--space-4);
  width: 42px;
  height: 42px;
  font-size: 1.4rem;
}

.lightbox-nav {
  top: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.8rem;
  transform: translateY(-50%);

  &.prev {
    left: var(--space-4);
  }

  &.next {
    right: var(--space-4);
  }
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.25s var(--ease-out, ease);
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .lightbox-fade-enter-active,
  .lightbox-fade-leave-active {
    transition: none;
  }
}

// ============================================
// 移动端 / 平板触控热区（≤768 生效，桌面端不变）
// ============================================
@media (max-width: 768px) {
  .toc a {
    display: flex;
    align-items: center;
    min-height: 44px;
  }

  // 独立链接：加高盒子保证点击面积；下划线改用文字装饰，避免随盒高远离文字
  .route-link {
    min-height: 44px;
    border-bottom: none;
    text-decoration: underline;
    text-decoration-color: var(--color-gold-refined-line);
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
  }

  // 灯箱关闭按钮：移动端热区提升到 44×44，位置与图标不变
  .lightbox-close {
    width: 44px;
    height: 44px;
  }
}
</style>
