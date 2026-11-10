<template>
  <div class="about-page">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-bg">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="container">
        <div class="hero-content" data-reveal-stagger>
          <div class="hero-badge">
            <Icon class="badge-icon" icon="gis:globe-star" />
            <span class="badge-text">传承丝路文化 · 守护非遗瑰宝</span>
          </div>
          <h1 class="hero-title">关于我们</h1>
          <p class="hero-subtitle">平台说明 · 项目理念 · 数据来源</p>
        </div>
      </div>
      <div class="hero-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="#FFF8E7" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"/>
        </svg>
      </div>
    </div>

    <!-- 平台介绍 -->
    <section class="section platform-section">
      <div class="container">
        <div class="section-header" data-reveal>
          <div class="header-decoration">
            <span class="deco-line"></span>
            <Icon class="deco-icon" icon="gis:map-users" />
            <span class="deco-line"></span>
          </div>
          <h2 class="section-title">平台介绍</h2>
          <p class="section-subtitle">{{ projectMeta.scope }} · 非遗资源的空间组织与数字展示</p>
        </div>

        <div class="platform-grid">
          <div class="platform-card card-silk" data-reveal>
            <h3>{{ projectMeta.name }}</h3>
            <p>
              平台以 GIS 与 WebGIS 为技术支撑，将宁夏丝绸之路沿线的非物质文化遗产
              放回地理空间中进行记录、整理与展示。
            </p>
            <p>
              平台范围覆盖{{ projectMeta.scope }}，以经纬度、行政区、级别、类别与所属古道组织项目记录，
              并通过地图、数字档案与三维场景三种方式呈现非遗项目的空间关系与文化信息。
            </p>

            <div class="team-note">
              <h4>团队与合作信息</h4>
              <p>项目团队成员及具体分工信息暂未公开，待正式确认后更新。</p>
              <p v-if="!projectPartners.length">合作与支持信息以正式确认的公开资料为准。</p>
              <p v-else>已确认合作单位：{{ projectPartners.map((item) => item.name).join('、') }}</p>
            </div>
          </div>

          <div class="focus-list" data-reveal-stagger>
            <div v-for="item in focusAreas" :key="item.title" class="focus-item">
              <Icon class="focus-icon" :icon="'gis:' + item.icon" />
              <div>
                <h4>{{ item.title }}</h4>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目理念 -->
    <section class="section mission-section">
      <div class="mission-bg"></div>
      <div class="container">
        <div class="section-header light" data-reveal>
          <h2 class="section-title">项目理念</h2>
          <p class="section-subtitle">记录 · 表达 · 传播</p>
        </div>

        <div class="mission-values" data-reveal-stagger>
          <div class="value-card" v-for="value in missionValues" :key="value.title">
            <div class="value-visual">
              <Icon class="value-icon" :icon="'gis:' + value.icon" />
              <div class="value-bg"></div>
            </div>
            <div class="value-content">
              <h3>{{ value.title }}</h3>
              <p>{{ value.desc }}</p>
              <div class="value-quote">{{ value.quote }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据来源与致谢 -->
    <section class="section sources-section">
      <div class="container">
        <div class="section-header" data-reveal>
          <h2 class="section-title">数据来源与致谢</h2>
          <p class="section-subtitle">官方统计 · 口径说明 · 第三方资源</p>
        </div>

        <p class="source-note" data-reveal>
          平台同时使用两类信息：区域官方统计数据，以及平台逐条整理的非遗项目记录。
          下列来源用于说明官方统计数字，并不构成平台收录记录的逐项出处。
        </p>

        <ul class="stat-list" data-reveal-stagger>
          <li v-for="item in officialStats" :key="item.id" class="stat-row">
            <span class="stat-value">{{ item.value }}<em>{{ item.unit }}</em></span>
            <div class="stat-body">
              <h3>{{ item.label }}</h3>
              <p class="stat-scope">{{ item.scope }}</p>
              <p class="stat-meta">
                <span v-if="item.statisticalReference">统计参照：{{ item.statisticalReference }}</span>
                <span v-else>统计时间：原文未注明</span>
                <span class="meta-sep">·</span>
                <template v-for="(source, index) in item.sources" :key="source.id">
                  <a :href="source.url" target="_blank" rel="noopener">{{ source.title }}</a>
                  <span v-if="index < item.sources.length - 1">、</span>
                </template>
              </p>
            </div>
          </li>
        </ul>

        <p class="stat-footnote" data-reveal>
          以上为区域官方统计口径，不是本平台收录量；平台收录记录以数字档案与项目成果页为准。
        </p>

        <div class="credit-block" data-reveal>
          <h3>第三方资源与服务</h3>
          <ul class="credit-list">
            <li v-for="credit in credits" :key="credit.name">
              <strong>{{ credit.name }}</strong>
              <p>{{ credit.use }}</p>
              <span class="license">
                {{ credit.license }}
                <template v-if="credit.url">
                  · <a :href="credit.url" target="_blank" rel="noopener">来源</a>
                </template>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 了解与参与 -->
    <section class="section cta-section">
      <div class="cta-bg"></div>
      <div class="container">
        <div class="cta-content">
          <h2>继续了解这个项目</h2>
          <p>研究背景与技术路线、已交付成果、空间地图与数字档案。</p>
          <div class="cta-buttons">
            <router-link to="/project" class="btn btn-lg btn-ghost">项目概况</router-link>
            <router-link to="/project#results" class="btn btn-lg btn-primary">项目成果</router-link>
            <router-link to="/map" class="btn btn-lg btn-ghost">GIS 地图</router-link>
            <router-link to="/archive" class="btn btn-lg btn-ghost">数字档案</router-link>
          </div>

          <div v-if="contactVerified && hasContact" class="contact-block">
            <a v-if="contact.email" :href="'mailto:' + contact.email">{{ contact.email }}</a>
            <a v-if="contact.phone" :href="'tel:' + contact.phone">{{ contact.phone }}</a>
            <span v-if="contact.address">{{ contact.address }}</span>
            <span v-if="contact.officeHours">{{ contact.officeHours }}</span>
          </div>
          <p v-else class="contact-note">
            当前暂未开放公开联系渠道。
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { projectMeta, projectPartners, contact, dataSources, officialStatistics } from '@/data/project'

// 官方统计与来源：数字与口径均来自统一数据层，不在此重复维护
const sourceById = Object.fromEntries(dataSources.map((source) => [source.id, source]))
const officialStats = officialStatistics.map((item) => ({
  ...item,
  sources: item.sourceIds.map((id) => sourceById[id]).filter(Boolean)
}))

// 联系方式仅在字段存在且整体状态为已核验时展示
const contactVerified = contact.verificationStatus === 'VERIFIED'
const hasContact = Boolean(contact.email || contact.phone || contact.address || contact.officeHours)

const focusAreas = [
  { icon: 'map', title: '研究对象', desc: '宁夏丝绸之路沿线的代表性非物质文化遗产。' },
  { icon: 'network', title: '空间组织', desc: '以经纬度、行政区、级别、类别与所属古道组织项目记录。' },
  { icon: 'cube-3d', title: '数字展示', desc: '通过 WebGIS 地图、数字档案与三维场景呈现文化信息。' }
]

const missionValues = [
  {
    icon: 'globe-shield',
    title: '记录与保存',
    desc: '以结构化记录保存非遗项目的名称、类别、级别、地区与技艺信息，为后续研究与展示提供稳定底稿。',
    quote: '让档案先于展示'
  },
  {
    icon: 'location-arrow',
    title: '空间表达',
    desc: '把非遗放回山川、古道与行政区之中，用地图呈现项目之间的空间关系。',
    quote: '让位置成为阅读线索'
  },
  {
    icon: 'globe-share',
    title: '公共传播',
    desc: '通过地图、档案与三维场景，让更多人看见并理解宁夏丝路非遗。',
    quote: '让文化信息抵达更多人'
  }
]

// 第三方资源说明：依据 README 与 package.json 中已记录的来源和许可
const credits = [
  { name: 'Font-GIS', use: '地图与界面图标', license: 'CC BY 4.0', url: 'https://github.com/viglino/font-gis' },
  { name: 'SuperSplat Viewer / splat-transform', use: '三维场景查看与格式转换', license: 'MIT', url: 'https://github.com/playcanvas/supersplat-viewer' },
  { name: 'Poly Haven', use: '器物三维预览模型（第三方素材，非本项目原创成果）', license: 'CC0 1.0', url: 'https://polyhaven.com/' },
  { name: '天地图 / 高德地图', use: '地图底图服务', license: '服务条款', url: 'https://www.tianditu.gov.cn/' },
  { name: 'dengcao/free-fonts', use: '自托管中文字体来源', license: '商用部署前需自行核查授权', url: 'https://github.com/dengcao/free-fonts' }
]
</script>

<style lang="scss" scoped>
// ============================================
// 页面英雄区
// ============================================

.about-page {
  min-height: 100vh;
}

.page-hero {
  position: relative;
  padding: var(--spacing-3xl) 0 var(--spacing-xl);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .hero-pattern {
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4A017' fill-opacity='0.05'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z'/%3E%3C/g%3E%3C/svg%3E");
  }
  
  .hero-gradient {
    position: absolute;
    inset: 0;
    background: var(--gradient-primary);
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
  
  .badge-icon {
    width: 24px;
    height: 24px;
    background: var(--color-secondary);
    border-radius: 50%;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  color: white;
  letter-spacing: 3px;
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  margin: 0 auto;
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

// ============================================
// 公共标题
// ============================================

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  
  .deco-line {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--color-secondary), transparent);
  }
  
  .deco-icon {
    display: inline-flex;
    width: 40px;
    height: 40px;
    background: var(--color-secondary);
    color: white;
    border-radius: 50%;
    font-size: 18px;
    font-weight: 600;
    align-items: center;
    justify-content: center;
  }
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  
  &::after {
    display: none;
  }
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-light);
}

// ============================================
// 平台介绍
// ============================================

.platform-section {
  background: var(--color-background);
}

.platform-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: var(--spacing-2xl);
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

.platform-card {
  padding: var(--spacing-2xl);

  h3 {
    font-size: 1.35rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }

  p {
    color: var(--color-text-light);
    line-height: 1.9;

    & + p {
      margin-top: var(--spacing-md);
    }
  }
}

.team-note {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(212, 160, 23, 0.06);
  border-left: 3px solid var(--color-secondary);
  border-radius: var(--radius-md);

  h4 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }

  p {
    margin: 0;
    color: var(--color-text-light);
    font-size: 0.9rem;
    line-height: 1.7;

    & + p {
      margin-top: var(--spacing-sm);
    }
  }
}

.focus-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.focus-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  transition: border-color 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);

  &:hover {
    border-color: var(--color-secondary);
    box-shadow: var(--shadow-md);
  }

  .focus-icon {
    font-size: 1.8rem;
    flex-shrink: 0;
  }

  h4 {
    color: var(--color-primary);
    margin-bottom: 4px;
  }

  p {
    margin: 0;
    color: var(--color-text-light);
    font-size: 0.9rem;
    line-height: 1.7;
  }
}

// ============================================
// 项目理念
// ============================================

.mission-section {
  position: relative;
  background: var(--color-surface);
  overflow: hidden;
}

.mission-bg {
  position: absolute;
  inset: 0;
  // 装饰背景不拦截鼠标事件，避免盖住使命卡的 hover 交互
  pointer-events: none;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(212, 160, 23, 0.05) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 70%, rgba(46, 139, 87, 0.05) 0%, transparent 40%);
}

.section-header.light {
  .section-title {
    color: var(--color-primary);
  }

  .section-subtitle {
    color: var(--color-text-light);
  }
}

.mission-values {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

.value-card {
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  text-align: center;
  transition:
    transform 0.3s var(--ease-out),
    box-shadow 0.3s var(--ease-out),
    border-color 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-secondary);
    
    .value-bg {
      transform: scale(1.2);
      opacity: 0.2;
    }
  }
}

.value-visual {
  position: relative;
  margin-bottom: var(--spacing-lg);
}

.value-icon {
  font-size: 3rem;
  position: relative;
  z-index: 1;
}

.value-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, var(--color-secondary), transparent);
  border-radius: 50%;
  opacity: 0.1;
  transition: transform 0.3s var(--ease-out), opacity 0.3s var(--ease-out);
}

.value-content h3 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.value-content p {
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: var(--spacing-lg);
}

.value-quote {
  font-style: italic;
  color: var(--color-secondary-dark);
  font-size: 0.9rem;
}

// ============================================
// 数据来源与致谢
// ============================================

.sources-section {
  background: var(--color-background);
}

.source-note {
  max-width: 820px;
  margin: 0 auto var(--spacing-xl);
  text-align: center;
  color: var(--color-text-light);
  font-size: 0.95rem;
  line-height: 1.8;
}

.stat-list {
  list-style: none;
  padding: 0;
  max-width: 920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.stat-row {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-secondary-dark);
  line-height: 1.2;

  em {
    margin-left: 4px;
    font-style: normal;
    font-size: 0.95rem;
    color: var(--color-text-muted);
  }
}

.stat-body h3 {
  color: var(--color-primary);
  font-size: 1rem;
  margin-bottom: 4px;
}

.stat-scope {
  color: var(--color-text-light);
  font-size: 0.9rem;
  line-height: 1.6;
}

.stat-meta {
  margin-top: var(--spacing-sm);
  color: var(--color-text-muted);
  font-size: 0.8rem;
  line-height: 1.7;

  a {
    color: var(--color-secondary-dark);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .meta-sep {
    margin: 0 6px;
  }
}

.stat-footnote {
  max-width: 920px;
  margin: var(--spacing-lg) auto 0;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  line-height: 1.8;
}

.credit-block {
  max-width: 920px;
  margin: var(--spacing-2xl) auto 0;
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);

  h3 {
    text-align: center;
    color: var(--color-primary);
    font-size: 1.2rem;
    margin-bottom: var(--spacing-lg);
  }
}

.credit-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  li {
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-md);

    strong {
      color: var(--color-primary);
    }

    p {
      margin-top: 4px;
      color: var(--color-text-light);
      font-size: 0.85rem;
      line-height: 1.6;
    }

    .license {
      display: block;
      margin-top: 4px;
      color: var(--color-text-muted);
      font-size: 0.78rem;

      a {
        color: var(--color-secondary-dark);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// ============================================
// 了解与参与
// ============================================

.cta-section {
  position: relative;
  padding: var(--spacing-4xl) 0;
}

.cta-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: var(--gradient-primary);
}

.cta-content {
  position: relative;
  z-index: 1;
  text-align: center;
  
  h2 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    color: white;
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: var(--spacing-2xl);
  }
}

.cta-buttons {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.contact-note {
  margin-top: var(--spacing-xl);
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.7;
}

.contact-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;

  a {
    color: #F5E6C8;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// CTA 深色底上的按钮配色
.btn-primary {
  background: var(--color-secondary);
  color: var(--color-gold-ink);
  border: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

.btn-ghost {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
}
</style>
