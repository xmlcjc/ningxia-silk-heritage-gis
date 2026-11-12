<template>
  <div class="home-page">
    <!-- ==================== 首屏：品牌叙事 + 真实地理主视觉 ==================== -->
    <section class="home-hero">
      <div class="container home-hero__inner">
        <div class="hero-copy">
          <p class="hero-eyebrow" data-reveal>
            <span class="eyebrow-line" aria-hidden="true"></span>
            宁夏 · 丝绸之路 · 非遗地理
          </p>

          <h1 class="hero-title" data-reveal data-reveal-delay="60">
            <span class="hero-title__line">宁夏丝路</span><span class="hero-title__line">非遗地理志</span>
          </h1>
          <p class="hero-en" data-reveal data-reveal-delay="110">Ningxia Silk Road Heritage GIS Platform</p>

          <p class="hero-lead" data-reveal data-reveal-delay="160">
            以地理为索引，把宁夏境内的代表性非物质文化遗产放回山川、河流与古道之间，
            让丝路非遗在数字地图上看得见、查得到、讲得清、传得开。
          </p>

          <div class="hero-actions" data-reveal data-reveal-delay="220">
            <router-link to="/map" class="btn btn-primary btn-lg">
              <Icon icon="gis:poi" width="19" height="19" />
              进入 GIS 地图
            </router-link>
            <router-link to="/archive" class="btn btn-secondary btn-lg">
              <Icon icon="gis:map-book" width="19" height="19" />
              浏览数字档案
            </router-link>
          </div>

          <ul class="hero-stats" data-reveal data-reveal-delay="280">
            <li v-for="stat in platformStats" :key="stat.label">
              <span class="hero-stat__value">{{ stat.value }}</span>
              <span class="hero-stat__unit">{{ stat.unit }}</span>
              <span class="hero-stat__label">{{ stat.label }}</span>
            </li>
          </ul>

          <p class="hero-quick" data-reveal data-reveal-delay="330">
            <span class="hero-quick__label">延伸浏览</span>
            <router-link to="/project">项目概况</router-link>
            <i aria-hidden="true">·</i>
            <router-link to="/screen">三维大屏</router-link>
            <i aria-hidden="true">·</i>
            <router-link to="/protection">保护路径</router-link>
          </p>
        </div>

        <div class="hero-visual" data-reveal="image" data-reveal-delay="180">
          <div class="hero-visual__inner" data-parallax="0.35">
            <HomeGeoMap />
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 平台定位 ==================== -->
    <section class="section intro-section">
      <div class="container intro-grid">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>01</span>平台定位</p>
          <h2>以地理为索引，重述丝路非遗</h2>
          <p class="section-desc">
            本项目以<span class="em">GIS 技术</span>为核心，系统搜集宁夏境内丝路相关非遗资源，
            构建非遗地理数据库，通过空间分析与 WebGIS 可视化展示非遗分布格局、传播脉络和历史演变，
            并探索“非遗保护 + 乡村振兴 + 文旅融合”的协同路径。
          </p>
          <div class="intro-tags">
            <span class="tag">GIS 数据库</span>
            <span class="tag">时空可视化</span>
            <span class="tag">三维大屏</span>
            <span class="tag">三维场景</span>
            <span class="tag">保护路径研究</span>
            <span class="tag tag-green">乡村振兴</span>
            <span class="tag tag-green">文旅融合</span>
          </div>
        </div>

        <ol class="workflow" data-reveal-stagger>
          <li v-for="(step, index) in workflow" :key="step.title">
            <span class="workflow-no">{{ pad(index + 1) }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
          </li>
        </ol>

        <router-link to="/project#tech" class="text-link workflow-link" data-reveal>
          查看技术路线 <span aria-hidden="true">→</span>
        </router-link>
      </div>
    </section>

    <!-- ==================== 非遗地理分布（真实统计） ==================== -->
    <section class="section distribution-section">
      <div class="container distribution-grid">
        <div>
          <div class="section-head" data-reveal>
            <p class="eyebrow"><span>02</span>地理分布</p>
            <h2>沿黄河而生，随丝路而传</h2>
            <p class="section-desc">
              {{ stats.total }} 项代表性非遗分布于宁夏 {{ stats.cities }} 个地市。银川、吴忠、固原三地分布最为集中，
              中卫、石嘴山亦有代表性项目；项目沿黄河两岸与古道节点展开，构成一条可阅读的文化地理线索。
            </p>
          </div>

          <div class="city-bars" data-reveal-stagger>
            <div v-for="city in cityStats" :key="city.name" class="city-row">
              <span class="city-name">{{ city.name }}</span>
              <span class="city-track">
                <span class="city-fill" :style="{ width: city.percent + '%' }"></span>
              </span>
              <span class="city-count">{{ city.count }}</span>
            </div>
          </div>
          <p class="data-note">按平台非遗数据库的申报地区统计，共 {{ stats.total }} 项。</p>
        </div>

        <div class="distribution-side" data-reveal data-reveal-delay="120">
          <div class="side-block">
            <h3>遗产类别</h3>
            <ul class="cat-chips">
              <li v-for="cat in categoryStats" :key="cat.name">
                <span>{{ cat.name }}</span>
                <b>{{ cat.count }}</b>
              </li>
            </ul>
          </div>

          <div class="side-block">
            <h3>保护级别</h3>
            <div v-for="level in levelStats" :key="level.name" class="level-row">
              <span class="level-name">{{ level.name }}</span>
              <span class="level-track">
                <span class="level-fill" :class="level.key" :style="{ width: level.percent + '%' }"></span>
              </span>
              <span class="level-count">{{ level.count }}</span>
            </div>
          </div>

          <router-link to="/archive" class="text-link">查看全部数字档案 <span aria-hidden="true">→</span></router-link>
        </div>
      </div>
    </section>

    <!-- ==================== 宁夏特色非遗（真实图片） ==================== -->
    <section class="section gallery-section">
      <div class="container">
        <div class="section-head section-head--row" data-reveal>
          <div>
            <p class="eyebrow"><span>03</span>特色非遗</p>
            <h2>从一方砚石，到一曲花儿</h2>
          </div>
          <p class="section-desc section-desc--aside">
            五项代表性项目，覆盖传统技艺、音乐、美术与戏剧，
            它们在山河之间生成，也在今天被重新看见。
          </p>
        </div>

        <div class="gallery-lead-grid" data-reveal="image">
          <router-link :to="'/archive/' + lead.id" class="gallery-lead gallery-link">
            <img :src="lead.coverImage" :alt="lead.name + ' · ' + lead.category" loading="eager" />
          </router-link>

          <div class="gallery-note">
            <span class="gallery-index">01 / 05</span>
            <h3>{{ lead.name }}</h3>
            <p>{{ lead.intro }}</p>
            <dl class="gallery-meta">
              <div>
                <dt>类别</dt>
                <dd>{{ lead.category }}</dd>
              </div>
              <div>
                <dt>级别</dt>
                <dd>{{ lead.level }}</dd>
              </div>
              <div>
                <dt>地区</dt>
                <dd>{{ lead.city }} · {{ lead.county }}</dd>
              </div>
            </dl>
            <router-link :to="'/archive/' + lead.id" class="text-link">进入数字档案 <span aria-hidden="true">→</span></router-link>
          </div>
        </div>

        <div class="gallery-strip" data-reveal-stagger>
          <router-link
            v-for="item in galleryRest"
            :key="item.id"
            :to="'/archive/' + item.id"
            class="gallery-item gallery-link"
          >
            <figure>
              <img :src="item.coverImage" :alt="item.name + ' · ' + item.category" loading="lazy" />
              <figcaption>
                <span class="gallery-item__name">{{ item.name }}</span>
                <span class="gallery-item__meta">{{ item.category }} · {{ item.city }}</span>
              </figcaption>
            </figure>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ==================== 丝路古道（真实路线） ==================== -->
    <section class="section routes-section">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>04</span>文化路线</p>
          <h2>{{ stats.routes }} 条古道，穿过宁夏</h2>
          <p class="section-desc">
            萧关道、环灵道、长安西域道与灵州道，在宁夏境内交会。
            非遗点位沿这些通道分布，商旅、军旅与僧侣的往来，也把技艺、歌声与信仰留在了沿线。
          </p>
        </div>

        <div class="route-grid" data-reveal-stagger>
          <router-link
            v-for="(route, index) in silkRoadRoutes"
            :key="route.id"
            :to="{ path: '/map', query: { route: route.name } }"
            class="route-item"
          >
            <span class="route-index">{{ pad(index + 1) }}</span>
            <h3>{{ route.name }}</h3>
            <p>{{ routeBrief(route) }}</p>
            <span class="route-link">在地图中查看 <span aria-hidden="true">→</span></span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ==================== 平台功能 ==================== -->
    <section class="section features-section">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>05</span>平台功能</p>
          <h2>{{ features.length }} 个入口，走进非遗现场</h2>
        </div>

        <div class="feature-grid" data-reveal-stagger>
          <router-link
            v-for="(feature, index) in features"
            :key="feature.title"
            :to="feature.link"
            class="feature-row"
            :title="feature.tip"
          >
            <span class="feature-no">{{ pad(index + 1) }}</span>
            <span class="feature-icon"><Icon :icon="'gis:' + feature.icon" /></span>
            <span class="feature-body">
              <strong>{{ feature.title }}</strong>
              <span>{{ feature.description }}</span>
            </span>
            <span class="feature-arrow" aria-hidden="true">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ==================== GIS 地图说明 ==================== -->
    <section class="section platform-section">
      <div class="container platform-grid">
        <div class="section-head section-head--light" data-reveal>
          <p class="eyebrow"><span>06</span>GIS 地图</p>
          <h2>以地图为索引的非遗档案</h2>
          <p class="section-desc">
            交互式地图汇聚宁夏境内 {{ stats.total }} 项代表性非遗的空间分布与关联信息。
            平台以地理坐标为索引，将非遗项目与萧关道、环灵道、长安西域道、灵州道四条丝路古道叠合呈现，
            支持图层切换、分类筛选、时间轴联动与点位详情查看。
          </p>
          <div class="platform-actions">
            <router-link to="/map" class="btn btn-primary">进入地图探索</router-link>
            <router-link to="/archive" class="btn btn-secondary">浏览数字档案</router-link>
          </div>
          <p class="platform-more">
            <span>更多入口</span>
            <router-link to="/protection">保护路径</router-link>
            <i aria-hidden="true">·</i>
            <router-link to="/screen">三维大屏</router-link>
            <i aria-hidden="true">·</i>
            <router-link to="/archive/1">三维场景</router-link>
          </p>
        </div>

        <div class="platform-facts" data-reveal-stagger>
          <div v-for="fact in platformStats" :key="fact.label" class="fact-item">
            <strong>{{ fact.value }}<em>{{ fact.unit }}</em></strong>
            <span>{{ fact.label }}</span>
          </div>
          <p class="platform-routes">萧关道 · 环灵道 · 长安西域道 · 灵州道</p>
        </div>
      </div>
    </section>

    <!-- ==================== 项目成果（统一数据层） ==================== -->
    <section class="section deliverables-section">
      <div class="container deliverables-grid">
        <div>
          <div class="section-head" data-reveal>
            <p class="eyebrow"><span>07</span>项目成果</p>
            <h2>已交付的平台成果</h2>
            <p class="section-desc">
              首页仅展示可直接访问的软件平台成果；数据资源、三维场景与核验说明见项目概况页「项目成果」栏目。
            </p>
          </div>
          <router-link to="/project#results" class="text-link" data-reveal>
            查看全部成果 <span aria-hidden="true">→</span>
          </router-link>
        </div>

        <div class="results-block" data-reveal data-reveal-delay="120">
          <h3 class="results-title">软件平台</h3>
          <ul>
            <li v-for="item in homeDeliverables" :key="item.id">
              <router-link :to="item.route" :title="item.description">
                <span class="result-type">{{ categoryLabel(item.category) }}</span>
                <span class="result-name">
                  {{ item.name }}
                  <em v-if="item.verificationStatus !== 'VERIFIED'" class="result-status">
                    {{ statusLabel(item.verificationStatus) }}
                  </em>
                </span>
                <span class="result-arrow" aria-hidden="true">→</span>
              </router-link>
            </li>
          </ul>
          <p v-for="item in conditionalNotes" :key="item.name" class="results-note">
            <b>{{ item.name }}</b>：{{ item.note }}
          </p>
        </div>
      </div>
    </section>

    <!-- ==================== CTA ==================== -->
    <section class="cta-section">
      <div class="cta-pattern" aria-hidden="true"></div>
      <div class="container cta-inner" data-reveal>
        <h2>探索丝路非遗，传承文化记忆</h2>
        <p>从一条古道开始，读懂宁夏非遗的地理与历史。</p>
        <div class="cta-buttons">
          <router-link to="/archive" class="btn btn-primary btn-lg">开始探索</router-link>
          <router-link to="/about" class="btn btn-ghost btn-lg">了解更多</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import HomeGeoMap from '../components/HomeGeoMap.vue'
import { heritageData, silkRoadRoutes, categories } from '../data/heritageData'
import { getProjectStats, projectDeliverables } from '@/data/project'

const pad = (n) => String(n).padStart(2, '0')

// ---------- 平台统计：统一由数据层计算 ----------
const stats = getProjectStats()

const platformStats = [
  { value: String(stats.total), unit: '项', label: '代表性非遗' },
  { value: String(stats.cities), unit: '市', label: '覆盖地市' },
  { value: String(stats.routes), unit: '条', label: '丝路古道' },
  { value: String(stats.categories), unit: '类', label: '遗产类别' }
]

// ---------- 平台定位：工作路径 ----------
const workflow = [
  {
    title: '资源普查与建档',
    desc: '系统搜集宁夏境内丝路相关非遗资源，构建可检索、可关联的非遗地理数据库。'
  },
  {
    title: '空间分析与可视化',
    desc: '以 WebGIS 呈现非遗分布格局、传播脉络与历史演变，让空间关系成为阅读入口。'
  },
  {
    title: '保护与传播',
    desc: '探索“非遗保护 + 乡村振兴 + 文旅融合”的协同路径，让档案走向公众。'
  }
]

// ---------- 地理分布 ----------
const cityOrder = ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市']
const cityRows = cityOrder.map((name) => ({ name, count: stats.byCity[name] || 0 }))
const cityMax = Math.max(1, ...cityRows.map((item) => item.count))
const cityStats = cityRows.map((item) => ({
  ...item,
  percent: Math.round((item.count / cityMax) * 100)
}))

const categoryStats = categories
  .filter((name) => name !== '全部')
  .map((name) => ({ name, count: heritageData.filter((item) => item.category === name).length }))
  .filter((item) => item.count > 0)

const LEVEL_KEY = { 国家级: 'national', 自治区级: 'regional', 市级: 'municipal' }
const levelOrder = ['国家级', '自治区级', '市级']
const levelRaw = levelOrder
  .map((name) => ({
    name,
    key: LEVEL_KEY[name],
    count: stats.byLevel[name] || 0
  }))
  .filter((item) => item.count > 0)
const levelMax = Math.max(1, ...levelRaw.map((item) => item.count))
const levelStats = levelRaw.map((item) => ({
  ...item,
  percent: Math.round((item.count / levelMax) * 100)
}))

// ---------- 特色非遗 ----------
const lead = heritageData.find((item) => item.id === 1)
const galleryRest = [2, 3, 5, 6]
  .map((id) => heritageData.find((item) => item.id === id))
  .filter(Boolean)

// ---------- 丝路古道：取真实描述首句 ----------
const routeBrief = (route) => {
  const first = route.desc.split('。')[0]
  return first ? first + '。' : route.desc
}

// ---------- 平台功能（保留原首页全部入口） ----------
const features = [
  {
    icon: 'map',
    title: 'GIS 地图展示',
    description: '交互式地图展示非遗点位分布，支持多图层切换与空间分析',
    link: '/map'
  },
  {
    icon: 'map-time',
    title: '时间轴传播演变',
    description: '动态展示不同历史时期非遗传播路径与演变过程',
    link: '/map'
  },
  {
    icon: 'map-book',
    title: '非遗数字档案',
    description: '完整的非遗项目数字档案，包含图文、视频、传承信息',
    link: '/archive'
  },
  {
    icon: 'globe-shield',
    title: '保护与振兴策略',
    description: '基于 GIS 分析提出分级保护与乡村振兴协同建议',
    link: '/protection'
  },
  {
    icon: 'map-stat',
    title: '三维数据大屏',
    description: '沉浸式三维大屏，纵览五市非遗格局、丝路古道与核心数据',
    link: '/screen'
  },
  {
    icon: 'cube-3d',
    title: '文物三维场景展示',
    description: '照片转高斯泼溅场景重建，以飞行相机自由漫游查看文物与原境',
    tip: '基于实景照片的高斯泼溅场景重建，支持飞行相机自由漫游；进入详情页后点击「载入三维场景」即可体验',
    link: '/archive/1'
  }
]

// ---------- 首页成果摘要：统一数据层中的软件平台成果 ----------
const homeDeliverables = projectDeliverables.filter(
  (item) => item.category === 'SOFTWARE' && item.route
)

const conditionalNotes = homeDeliverables
  .filter((item) => item.verificationStatus === 'CONDITIONAL' && item.verificationNote)
  .map((item) => ({ name: item.name, note: item.verificationNote }))

const DELIVERABLE_LABELS = {
  SOFTWARE: '平台',
  DATA: '数据',
  ASSET: '场景'
}
const categoryLabel = (category) => DELIVERABLE_LABELS[category] || category

const STATUS_LABELS = {
  VERIFIED: '已核验',
  CONDITIONAL: '有条件核验',
  NOT_VERIFIED: '未核验'
}
const statusLabel = (status) => STATUS_LABELS[status] || status
</script>

<style lang="scss" scoped>
// ============================================
// 首页 - 暖白博物馆式叙事版式
// ============================================

.home-page {
  overflow-x: clip;

  .section {
    // 标准内容区块间距（main.scss --section-gap）
    padding: var(--section-gap) 0;
  }
}

// 区块标题（统一左对齐的编辑部式节奏）
.section-head {
  max-width: 660px;

  h2 {
    margin: var(--space-3) 0 var(--space-4);
    font-family: var(--font-title);
    font-size: var(--text-h2);
    font-weight: 400;
    line-height: 1.28;
    letter-spacing: 0.02em;
    color: var(--color-primary-dark);
  }
}

// 章节眉标统一由 main.scss 的 .eyebrow 提供（字体 / 字号 / 字距 / 颜色）

.section-desc {
  color: var(--color-text-light);
  font-size: var(--text-body);
  line-height: var(--leading-relaxed);

  .em {
    color: var(--color-primary);
    font-weight: 600;
  }
}

.section-head--row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-8);
  max-width: none;

  > div {
    max-width: 560px;
  }
}

.section-desc--aside {
  max-width: 400px;
  font-size: var(--text-body-sm);
  text-align: right;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-caption);
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--color-gold-refined-line);
  padding-bottom: 2px;
  transition: color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--color-interactive);
    border-color: var(--color-interactive);
  }
}

// ============================================
// 首屏
// ============================================
.home-hero {
  position: relative;
  background:
    radial-gradient(1100px 620px at 86% 12%, rgba(212, 160, 23, 0.12), transparent 62%),
    radial-gradient(760px 520px at 4% 0%, rgba(139, 69, 19, 0.07), transparent 66%),
    var(--color-paper);
  border-bottom: 1px solid var(--color-border-light);
  overflow: hidden;
}

.home-hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
  align-items: center;
  gap: clamp(32px, 4.5vw, 72px);
  min-height: calc(100vh - 72px);
  padding-top: clamp(40px, 5vw, 64px);
  padding-bottom: clamp(36px, 4vw, 56px);
}

.hero-title__line {
  display: inline;
}

.hero-copy {
  min-width: 0;
  max-width: 660px;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-ui);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wider);
  color: var(--color-primary);
}

.eyebrow-line {
  width: 30px;
  height: 1px;
  background: var(--color-gold-refined);
}

.hero-title {
  margin: var(--space-4) 0 var(--space-2);
  font-family: var(--font-title);
  font-size: clamp(2.9rem, 5.2vw, 4.35rem);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: 0.035em;
  color: var(--color-primary-dark);
}

.hero-en {
  font-family: var(--font-en);
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.hero-lead {
  max-width: 33em;
  margin-top: var(--space-6);
  font-size: var(--text-body-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-text-medium);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-8);
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4) clamp(28px, 4vw, 56px);
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border-light);
  list-style: none;

  li {
    display: flex;
    align-items: baseline;
    gap: 4px;
    min-width: 0;
  }
}

.hero-stat__value {
  font-family: var(--font-en);
  font-size: 2rem;
  line-height: 1;
  color: var(--color-primary);
}

.hero-stat__unit {
  font-size: var(--text-caption);
  color: var(--color-primary);
}

.hero-stat__label {
  display: block;
  margin-left: var(--space-2);
  font-size: var(--text-caption);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.hero-quick {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
  font-size: var(--text-caption);
  color: var(--color-text-muted);

  &__label {
    letter-spacing: var(--tracking-wide);
  }

  a {
    color: var(--color-text-medium);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out);

    &:hover {
      color: var(--color-primary);
    }
  }

  i {
    font-style: normal;
    opacity: 0.5;
  }
}

.hero-visual {
  position: relative;
  min-width: 0;

  &__inner {
    position: relative;
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    inset: -8% -6% -4%;
    background: radial-gradient(closest-side, rgba(212, 160, 23, 0.13), transparent 72%);
    pointer-events: none;
  }

  :deep(.geo-map) {
    position: relative;
    z-index: 1;
  }
}

// ============================================
// 平台定位
// ============================================
.intro-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  gap: clamp(32px, 5vw, 88px);
  align-items: start;
}

.intro-tags {
  display: grid;
  grid-template-columns: repeat(4, max-content);
  gap: 6px;
  margin-top: var(--space-6);

  .tag {
    padding: 3px 10px;
    font-size: var(--text-label);
  }
}

.workflow {
  list-style: none;
  border-top: 1px solid var(--color-border);

  li {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr);
    gap: var(--space-4);
    padding: var(--space-5) 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  h3 {
    font-family: var(--font-sub);
    font-size: var(--text-h5);
    font-weight: 600;
    color: var(--color-primary-dark);
  }

  p {
    margin-top: var(--space-2);
    font-size: var(--text-body-sm);
    line-height: var(--leading-normal);
    color: var(--color-text-muted);
  }
}

.workflow-no {
  font-family: var(--font-en);
  font-size: var(--text-caption);
  color: var(--color-primary);
  padding-top: 3px;
}

// ============================================
// 地理分布
// ============================================
.distribution-section {
  background: var(--color-surface);
}

.distribution-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(0, 0.82fr);
  gap: clamp(32px, 5vw, 88px);
  align-items: start;
}

.city-bars {
  margin-top: var(--space-8);
}

.city-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 32px;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.city-name {
  font-size: var(--text-body-sm);
  color: var(--color-text-medium);
}

.city-track {
  height: 6px;
  border-radius: 3px;
  background: rgba(139, 69, 19, 0.09);
  overflow: hidden;
}

.city-fill {
  display: block;
  height: 100%;
  min-width: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
}

.city-count {
  font-family: var(--font-en);
  font-size: var(--text-body-lg);
  color: var(--color-primary);
  text-align: right;
}

.data-note {
  margin-top: var(--space-4);
  font-size: var(--text-caption);
  color: var(--color-text-muted);
}

.distribution-side {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding-top: var(--space-2);

  .text-link {
    align-self: flex-start;
  }
}

.side-block {
  h3 {
    padding-top: var(--space-3);
    border-top: 2px solid var(--color-primary);
    font-family: var(--font-sub);
    font-size: var(--text-body-sm);
    font-weight: 600;
    letter-spacing: var(--tracking-wide);
    color: var(--color-primary-dark);
  }
}

.cat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-4);
  list-style: none;

  li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-sm);
    background: var(--color-paper);
    font-size: var(--text-caption);
    color: var(--color-text-medium);
  }

  b {
    font-family: var(--font-en);
    font-weight: 400;
    color: var(--color-primary);
  }
}

.level-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 30px;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.level-name {
  font-size: var(--text-caption);
  color: var(--color-text-medium);
}

.level-track {
  height: 4px;
  border-radius: 2px;
  background: rgba(139, 69, 19, 0.08);
  overflow: hidden;
}

.level-fill {
  display: block;
  height: 100%;
  border-radius: 2px;

  &.national {
    background: var(--level-national);
  }

  &.regional {
    background: var(--level-regional);
  }

  &.municipal {
    background: var(--level-municipal);
  }
}

.level-count {
  font-family: var(--font-en);
  font-size: var(--text-body-sm);
  color: var(--color-text-medium);
  text-align: right;
}

// ============================================
// 特色非遗
// ============================================
.gallery-section {
  background: var(--color-paper);
}

.gallery-lead-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.42fr) minmax(0, 1fr);
  margin-top: var(--space-8);
  border: 1px solid var(--color-border-light);
  background: var(--color-paper);
}

.gallery-lead {
  display: block;
  overflow: hidden;
  min-width: 0;

  img {
    width: 100%;
    height: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    display: block;
    transition: transform var(--duration-slow) var(--ease-out);
  }

  &:hover img {
    transform: scale(1.025);
  }
}

.gallery-note {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-3);
  padding: clamp(24px, 3vw, 40px);
  border-left: 1px solid var(--color-border-light);
  background: var(--color-surface);

  h3 {
    font-family: var(--font-title);
    font-size: var(--text-h3);
    font-weight: 400;
    line-height: 1.3;
    color: var(--color-primary-dark);
  }

  > p {
    font-size: var(--text-body-sm);
    line-height: var(--leading-relaxed);
    color: var(--color-text-light);
  }

  .text-link {
    align-self: flex-start;
    margin-top: var(--space-1);
  }
}

.gallery-index {
  font-family: var(--font-en);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wider);
  color: var(--color-primary);
}

.gallery-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-light);

  dt {
    font-size: var(--text-label);
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
  }

  dd {
    margin-top: 2px;
    font-size: var(--text-caption);
    color: var(--color-text-medium);
  }
}

.gallery-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.gallery-item {
  display: block;
  min-width: 0;
  text-decoration: none;

  figure {
    margin: 0;
  }

  img {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    display: block;
    border-radius: var(--radius-sm);
    transition: transform var(--duration-slow) var(--ease-out), filter var(--duration-normal) var(--ease-out);
  }

  &:hover img {
    transform: scale(1.025);
    filter: brightness(1.03);
  }

  figcaption {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: var(--space-3);
  }

  &__name {
    font-family: var(--font-sub);
    font-size: var(--text-body-sm);
    color: var(--color-text);
    transition: color var(--duration-fast) var(--ease-out);
  }

  &__meta {
    font-size: var(--text-label);
    color: var(--color-text-muted);
  }

  &:hover &__name {
    color: var(--color-primary);
  }
}

// ============================================
// 丝路古道
// ============================================
.routes-section {
  background: var(--color-surface);
}

.route-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(20px, 3vw, 40px);
  margin-top: var(--space-8);
}

.route-item {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
  text-decoration: none;
  transition: border-color var(--duration-normal) var(--ease-out);

  h3 {
    margin: var(--space-2) 0 var(--space-3);
    font-family: var(--font-title);
    font-size: var(--text-h4);
    font-weight: 400;
    color: var(--color-primary-dark);
    transition: color var(--duration-normal) var(--ease-out);
  }

  > p {
    font-size: var(--text-caption);
    line-height: 1.95;
    color: var(--color-text-light);
  }

  &:hover {
    border-top-color: var(--color-secondary);

    h3 {
      color: var(--color-primary);
    }
  }
}

.route-index {
  font-family: var(--font-en);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wider);
  color: var(--color-primary);
}

.route-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: var(--space-4);
  font-size: var(--text-caption);
  color: var(--color-primary);
  opacity: 0.85;
}

// ============================================
// 平台功能
// ============================================
.features-section {
  background: var(--color-paper);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(32px, 5vw, 88px);
  margin-top: var(--space-8);
}

.feature-row {
  display: grid;
  grid-template-columns: 26px 44px minmax(0, 1fr) 20px;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--color-border-light);
  text-decoration: none;
  transition: border-color var(--duration-fast) var(--ease-out);

  &:hover {
    border-bottom-color: var(--color-secondary);

    .feature-arrow {
      opacity: 1;
      transform: translateX(3px);
    }

    .feature-icon {
      color: var(--color-secondary-dark);
    }
  }
}

.feature-no {
  font-family: var(--font-en);
  font-size: var(--text-label);
  color: var(--color-text-muted);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border-light);
  border-radius: 50%;
  color: var(--color-primary);
  font-size: 19px;
  transition: color var(--duration-fast) var(--ease-out);
}

.feature-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;

  strong {
    font-family: var(--font-sub);
    font-size: var(--text-body);
    font-weight: 600;
    color: var(--color-text);
  }

  span {
    font-size: var(--text-caption);
    line-height: 1.7;
    color: var(--color-text-muted);
  }
}

.feature-arrow {
  color: var(--color-primary);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
}

// ============================================
// GIS 地图说明（深色锚点）
// ============================================
.platform-section {
  background: var(--color-primary-dark);
  color: var(--color-background);
  overflow: hidden;
}

.platform-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  gap: clamp(32px, 5vw, 88px);
  align-items: center;
}

.section-head--light {
  .eyebrow {
    color: var(--color-secondary-light);

    span {
      color: var(--color-secondary-light);
    }
  }

  h2 {
    color: var(--color-background);
  }

  .section-desc {
    color: rgba(255, 248, 231, 0.82);
  }
}

.platform-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.platform-section .btn-secondary {
  color: var(--color-background);
  border-color: rgba(255, 248, 231, 0.5);

  &:hover {
    background: var(--color-secondary);
    border-color: var(--color-secondary);
    color: var(--color-gold-ink);
  }
}

.platform-more {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  font-size: var(--text-caption);
  color: rgba(255, 248, 231, 0.7);

  a {
    color: rgba(255, 248, 231, 0.9);
    text-decoration: none;

    &:hover {
      color: var(--color-secondary-light);
    }
  }

  i {
    font-style: normal;
    opacity: 0.5;
  }
}

.platform-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 32px;
}

.fact-item {
  padding: var(--space-5) 0;
  border-top: 1px solid rgba(255, 248, 231, 0.18);

  strong {
    display: block;
    font-family: var(--font-en);
    font-size: clamp(2.2rem, 3.6vw, 3rem);
    font-weight: 400;
    line-height: 1;
    color: var(--color-secondary-light);
  }

  em {
    font-style: normal;
    font-size: var(--text-caption);
    margin-left: 4px;
  }

  span {
    display: block;
    margin-top: var(--space-2);
    font-size: var(--text-caption);
    color: rgba(255, 248, 231, 0.74);
  }
}

.platform-routes {
  grid-column: 1 / -1;
  padding-top: var(--space-4);
  border-top: 1px solid rgba(255, 248, 231, 0.18);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wide);
  color: rgba(255, 248, 231, 0.72);
}

// ============================================
// 项目成果（统一数据层）
// ============================================
.deliverables-section {
  background: var(--color-paper);
}

.deliverables-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: clamp(32px, 5vw, 88px);
  align-items: start;
}

.results-block {
  padding-top: var(--space-2);
}

.results-title {
  font-family: var(--font-sub);
  font-size: var(--text-h5);
  font-weight: 600;
  color: var(--color-primary-dark);
  padding-top: var(--space-3);
  border-top: 2px solid var(--color-primary);
}

.results-block ul {
  list-style: none;
  margin-top: var(--space-4);
}

.results-block li {
  border-bottom: 1px solid var(--color-border-light);

  a {
    display: grid;
    grid-template-columns: 54px minmax(0, 1fr) 16px;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) 0;
    text-decoration: none;

    &:hover {
      .result-name {
        color: var(--color-primary);
      }

      .result-arrow {
        opacity: 1;
        transform: translateX(3px);
      }
    }
  }
}

.result-type {
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wide);
  color: var(--color-primary);
}

.result-name {
  font-size: var(--text-body-sm);
  color: var(--color-text);
  transition: color var(--duration-fast) var(--ease-out);
}

.result-arrow {
  color: var(--color-primary);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
}

// 非完全核验成果的状态提示
.result-status {
  margin-left: var(--space-2);
  font-style: normal;
  font-size: var(--text-label);
  color: var(--color-text-muted);
}

// 条件性成果的简短核验说明
.results-note {
  margin-top: var(--space-4);
  font-size: var(--text-caption);
  line-height: 1.6;
  color: var(--color-text-muted);

  b {
    color: var(--color-primary);
    font-weight: 600;
  }
}

// ============================================
// CTA
// ============================================
.cta-section {
  position: relative;
  background: var(--color-primary);
  overflow: hidden;
}

.cta-pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(640px 320px at 50% 0%, rgba(212, 160, 23, 0.28), transparent 70%),
    repeating-linear-gradient(45deg, rgba(255, 248, 231, 0.04) 0 1px, transparent 1px 12px);
  opacity: 0.9;
}

.cta-inner {
  position: relative;
  padding: clamp(56px, 7vw, 88px) var(--gutter);
  text-align: center;

  h2 {
    font-family: var(--font-title);
    font-size: var(--text-h2);
    font-weight: 400;
    letter-spacing: 0.02em;
    color: var(--color-background);
  }

  p {
    margin-top: var(--space-3);
    font-size: var(--text-body-sm);
    color: rgba(255, 248, 231, 0.76);
  }
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.cta-section .btn-ghost {
  color: var(--color-background);
  border: 1px solid rgba(255, 248, 231, 0.5);

  &:hover {
    background: rgba(255, 248, 231, 0.1);
    color: var(--color-background);
  }
}

// ============================================
// 响应式
// ============================================
@media (max-width: 1100px) {
  .home-hero__inner {
    gap: var(--space-8);
  }

  .hero-title__line {
    display: block;
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-4);
  }

  .route-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: var(--space-8);
  }
}

@media (max-width: 900px) {
  .home-hero__inner {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
    padding-top: var(--space-12);
    padding-bottom: var(--space-10, 48px);
    gap: var(--space-8);
  }

  .hero-copy {
    max-width: none;
  }

  .hero-visual {
    display: flex;
    justify-content: center;
  }

  .hero-visual :deep(.geo-map) {
    max-width: 460px;
  }

  .intro-grid,
  .distribution-grid,
  .deliverables-grid,
  .platform-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .section-head--row {
    display: block;
  }

  .section-desc--aside {
    margin-top: var(--space-4);
    max-width: none;
    text-align: left;
  }

  .gallery-lead-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .gallery-note {
    border-left: 0;
    border-top: 1px solid var(--color-border-light);
  }

  .feature-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .platform-section {
    padding-top: var(--space-16);
    padding-bottom: var(--space-16);
  }
}

@media (max-width: 640px) {
  .home-hero__inner {
    padding-top: var(--space-8);
    padding-bottom: var(--space-8);
    gap: var(--space-6);
  }

  .hero-title {
    font-size: 2.35rem;
    line-height: 1.16;
    letter-spacing: 0.02em;
  }

  .hero-title__line {
    display: block;
  }

  .hero-en {
    font-size: 0.62rem;
    letter-spacing: 0.16em;
  }

  .hero-lead {
    margin-top: var(--space-4);
    font-size: var(--text-body-sm);
    line-height: 1.85;
  }

  .hero-actions {
    gap: var(--space-2);
    margin-top: var(--space-6);

    .btn {
      flex: 1 1 0;
      gap: 6px;
      padding: 12px var(--space-3);
      font-size: var(--text-body-sm);
      white-space: nowrap;
    }
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-4);
    margin-top: var(--space-6);
    padding-top: var(--space-4);
  }

  .hero-quick {
    margin-top: var(--space-4);
  }

  .intro-tags {
    grid-template-columns: repeat(2, max-content);
  }

  .hero-visual :deep(.geo-map) {
    max-width: 370px;
  }

  .hero-stat__label {
    display: block;
    margin-left: 0;
    margin-top: 2px;
  }

  .city-row {
    grid-template-columns: 64px minmax(0, 1fr) 28px;
    gap: var(--space-3);
  }

  .gallery-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-4) var(--space-3);
  }

  .route-grid {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--space-6);
  }

  .feature-row {
    grid-template-columns: 22px 40px minmax(0, 1fr);
    gap: var(--space-2);

    .feature-arrow {
      display: none;
    }
  }

  .platform-facts {
    gap: 0 var(--space-4);
  }

  .results-block li a {
    grid-template-columns: 46px minmax(0, 1fr) 14px;
  }

  .cta-buttons {
    .btn {
      width: 100%;
    }
  }
}

// 8A：首页只保留工作逻辑摘要，技术细节指向项目概况
.workflow-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  margin-top: var(--space-4);
  font-size: var(--text-caption);
}
</style>
