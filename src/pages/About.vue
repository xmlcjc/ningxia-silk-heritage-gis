<template>
  <div class="about-page">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="container hero-grid">
        <div class="hero-copy" data-reveal-stagger>
          <p class="hero-eyebrow">
            <span class="eyebrow-line" aria-hidden="true"></span>
            关于我们 / ABOUT THE PLATFORM
          </p>
          <h1 class="hero-title">关于我们</h1>
          <p class="hero-motto">传承丝路文化 · 守护非遗瑰宝</p>
          <p class="hero-subtitle">记录宁夏丝路沿线非遗地理信息的展示平台，由项目团队建设与维护。</p>
          <p class="hero-meta">平台说明 · 项目理念 · 数据来源</p>
          <p class="hero-link">
            <router-link to="/project#intro">了解项目建设 <span aria-hidden="true">→</span></router-link>
          </p>
        </div>

        <div class="hero-emblem" data-reveal data-reveal-delay="120" aria-hidden="true">
          <div class="emblem-frame">
            <img class="emblem-logo" src="/logo-gold.svg" alt="" />
          </div>
          <div class="emblem-text">
            <p class="emblem-name">{{ projectMeta.name }}</p>
            <p class="emblem-en">{{ projectMeta.englishName }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 平台介绍 -->
    <section class="section platform-section">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>01</span>平台介绍 / PLATFORM</p>
          <h2>平台介绍</h2>
          <p class="section-desc">{{ projectMeta.scope }} · 非遗资源的空间组织与数字展示</p>
        </div>

        <div class="platform-grid">
          <div class="platform-main" data-reveal>
            <h3 class="platform-name">{{ projectMeta.name }}</h3>
            <p>
              平台以 GIS 与 WebGIS 为技术支撑，范围覆盖{{ projectMeta.scope }}，
              以经纬度、行政区、级别、类别与所属古道组织项目记录，
              并通过地图、数字档案与三维场景三种方式呈现非遗项目的空间关系与文化信息。
            </p>
          </div>

          <ol class="focus-list" data-reveal-stagger>
            <li v-for="(item, index) in focusAreas" :key="item.title" class="focus-item">
              <span class="focus-no">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="focus-body">
                <h4>{{ item.title }}</h4>
                <p>{{ item.desc }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- 项目组织与分工 -->
    <section class="section team-section">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>02</span>项目组织 / TEAM</p>
          <h2>项目组织与分工</h2>
          <p class="section-desc">角色职责 · 指导与支持 · 人员信息待补充</p>
        </div>

        <ol class="role-list" data-reveal-stagger>
          <li v-for="(role, index) in roles" :key="role.title" class="role-item">
            <span class="role-no">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="role-body">
              <h3>{{ role.title }}<span class="role-status">人员待补充</span></h3>
              <p>{{ role.desc }}</p>
            </div>
          </li>
        </ol>

        <p class="team-note-plain" data-reveal>
          项目成员姓名、指导教师与合作单位以正式确认的公开资料为准，确认后在此更新；
          在资料到位前，本页仅说明工作分工，不列出未经确认的人员信息。
          <template v-if="projectPartners.length">已确认合作单位：{{ projectPartners.map((item) => item.name).join('、') }}。</template>
        </p>
      </div>
    </section>

    <!-- 项目理念 -->
    <section class="section mission-section">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>03</span>项目理念 / VALUES</p>
          <h2>项目理念</h2>
          <p class="section-desc">记录 · 表达 · 传播</p>
        </div>

        <ol class="mission-values" data-reveal-stagger>
          <li v-for="(value, index) in missionValues" :key="value.title" class="value-row">
            <span class="value-no">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="value-content">
              <h3>{{ value.title }}</h3>
              <p>{{ value.desc }}</p>
              <p class="value-quote">{{ value.quote }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- 数据来源与致谢 -->
    <section class="section sources-section">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>04</span>数据来源与致谢 / DATA SOURCES</p>
          <h2>数据来源与致谢</h2>
          <p class="section-desc">官方统计 · 口径说明 · 第三方资源</p>
        </div>

        <p class="source-note" data-reveal>
          平台同时使用两类信息：区域官方统计数据，以及平台逐条整理的非遗项目记录。
          下列来源用于说明官方统计数字，并不构成平台收录记录的逐项出处。
        </p>

        <div class="stat-block" data-reveal>
          <h3 class="block-title"><span class="block-no">A</span>官方资料与统计</h3>
          <ol class="stat-list" data-reveal-stagger>
            <li v-for="(item, index) in officialStats" :key="item.id" class="stat-row">
              <span class="stat-no">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="stat-figure">
                <span class="stat-value">{{ item.value }}</span>
                <em>{{ item.unit }}</em>
              </div>
              <div class="stat-body">
                <h4>{{ item.label }}</h4>
                <p class="stat-scope">{{ item.scope }}</p>
                <p class="stat-meta">
                  <span v-if="item.statisticalReference">统计参照：{{ item.statisticalReference }}</span>
                  <span v-else>统计时间：原文未注明</span>
                  <span class="stat-src-inline">
                    <span class="meta-sep">·</span>
                    <template v-for="(source, index) in item.sources" :key="source.id">
                      <a :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.title }}</a>
                      <span v-if="index < item.sources.length - 1">、</span>
                    </template>
                  </span>
                  <span class="stat-src-ref">&nbsp;· 来源 {{ item.sources.map((source) => '[' + sourceIndex(source.id) + ']').join(' ') }}</span>
                </p>
                <p v-if="item.notes" class="stat-note">
                  <span class="stat-note__label">说明</span>{{ item.notes }}
                </p>
              </div>
            </li>
          </ol>

          <ul class="stat-src-compact">
            <li v-for="(source, index) in uniqueStatSources" :key="'src-' + source.id">
              <span class="src-no">[{{ index + 1 }}]</span>
              <a :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.title }}</a>
            </li>
          </ul>

          <p class="stat-footnote" data-reveal>
            以上为区域官方统计口径，不是本平台收录量；平台收录记录以数字档案与项目成果页为准。
          </p>
        </div>

        <div class="credit-block" data-reveal>
          <h3 class="block-title"><span class="block-no">B</span>开源资源与版权致谢</h3>
          <details class="credit-details">
            <summary class="credit-summary">展开 {{ credits.length }} 项开源资源与许可</summary>
            <ol class="credit-list" data-reveal-stagger>
              <li v-for="(credit, index) in credits" :key="credit.name" class="credit-row">
                <span class="credit-no">{{ String(index + 1).padStart(2, '0') }}</span>
                <div class="credit-name">
                  <strong>{{ credit.name }}</strong>
                </div>
                <div class="credit-meta">
                  <p class="credit-use">{{ credit.use }}</p>
                  <div class="credit-actions">
                    <span class="license">
                      <span class="license-label">License</span>
                      {{ credit.license }}
                    </span>
                    <a
                      v-if="credit.url"
                      class="credit-source"
                      :href="credit.url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      来源 <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </li>
            </ol>
          </details>
        </div>
      </div>
    </section>

    <!-- 了解与参与 -->
    <section class="cta-section">
      <div class="cta-bg" aria-hidden="true"></div>
      <div class="container">
        <div class="cta-content" data-reveal>
          <h2>继续了解这个项目</h2>
          <p class="cta-desc">研究背景与技术路线、已交付成果、空间地图与数字档案。</p>
          <div class="cta-buttons">
            <router-link to="/project#results" class="btn btn-lg btn-primary">项目成果</router-link>
            <router-link to="/project" class="btn btn-lg btn-ghost">项目概况</router-link>
          </div>
          <p class="cta-more">
            <span class="cta-more__label">更多入口</span>
            <router-link to="/map">GIS 地图</router-link>
            <i aria-hidden="true">·</i>
            <router-link to="/archive">数字档案</router-link>
          </p>

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
import { projectMeta, projectPartners, contact, dataSources, officialStatistics } from '@/data/project'

// 官方统计与来源：数字与口径均来自统一数据层，不在此重复维护
const sourceById = Object.fromEntries(dataSources.map((source) => [source.id, source]))
const officialStats = officialStatistics.map((item) => ({
  ...item,
  sources: item.sourceIds.map((id) => sourceById[id]).filter(Boolean)
}))

// 窄屏把逐行来源链接改为编号引用 + 底部统一来源清单，避免重复长链接撑高页面
const uniqueStatSources = []
officialStats.forEach((item) => {
  item.sources.forEach((source) => {
    if (!uniqueStatSources.some((entry) => entry.id === source.id)) uniqueStatSources.push(source)
  })
})
const sourceIndex = (id) => uniqueStatSources.findIndex((entry) => entry.id === id) + 1

// 联系方式仅在字段存在且整体状态为已核验时展示
const contactVerified = contact.verificationStatus === 'VERIFIED'
const hasContact = Boolean(contact.email || contact.phone || contact.address || contact.officeHours)

const focusAreas = [
  { title: '研究对象', desc: '宁夏丝绸之路沿线的代表性非物质文化遗产。' },
  { title: '空间组织', desc: '以经纬度、行政区、级别、类别与所属古道组织项目记录。' },
  { title: '数字展示', desc: '通过 WebGIS 地图、数字档案与三维场景呈现文化信息。' }
]

const missionValues = [
  {
    title: '记录与保存',
    desc: '以结构化记录保存非遗项目的名称、类别、级别、地区与技艺信息，为后续研究与展示提供稳定底稿。',
    quote: '让档案先于展示'
  },
  {
    title: '空间表达',
    desc: '把非遗放回山川、古道与行政区之中，用地图呈现项目之间的空间关系。',
    quote: '让位置成为阅读线索'
  },
  {
    title: '公共传播',
    desc: '通过地图、档案与三维场景，让更多人看见并理解宁夏丝路非遗。',
    quote: '让文化信息抵达更多人'
  }
]

// 项目组织与分工：只描述职责，人员信息待正式确认后补充，不虚构姓名
const roles = [
  {
    title: '项目统筹',
    desc: '负责选题论证、研究框架与进度安排，协调各环节任务与成果提交。'
  },
  {
    title: '数据整理',
    desc: '负责非遗项目名录搜集、字段核对与空间信息整理，形成结构化数据底稿。'
  },
  {
    title: '平台开发',
    desc: '负责 WebGIS 地图、数字档案与三维场景的技术实现与迭代维护。'
  },
  {
    title: '内容核验',
    desc: '负责文案、统计口径与来源链接的复核，确保页面信息与公开资料一致。'
  },
  {
    title: '学术指导',
    desc: '负责研究方法、GIS 空间分析与成果表达的把关与建议。'
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
  background:
    var(--hero-glow),
    var(--hero-surface);
  border-bottom: 1px solid var(--color-border-light);
  overflow: hidden;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  gap: clamp(32px, 5vw, 88px);
  align-items: center;
  // 内容页 Hero 统一留白（main.scss --hero-pad-*）
  padding-top: var(--hero-pad-top);
  padding-bottom: var(--hero-pad-bottom);
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

  .eyebrow-line {
    width: 30px;
    height: 1px;
    background: var(--color-gold-refined);
  }
}

.hero-title {
  margin: var(--space-4) 0 var(--space-3);
  font-family: var(--font-title);
  font-size: clamp(2.2rem, 4.4vw, 3.6rem);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0.03em;
  color: var(--color-primary-dark);
}

.hero-motto {
  margin-bottom: var(--space-3);
  font-family: var(--font-sub);
  font-size: var(--text-body-sm);
  letter-spacing: 0.12em;
  color: var(--color-secondary-dark);
}

.hero-subtitle {
  max-width: 32em;
  font-size: var(--text-body-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-text-medium);
}

.hero-meta {
  margin-top: var(--space-4);
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
}

.hero-link {
  margin-top: var(--space-3);

  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    color: var(--color-secondary-dark);
    font-size: var(--text-body-sm);
    text-decoration: none;
    border-bottom: 1px solid var(--color-gold-refined-line);
    transition: color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);

    &:hover {
      color: var(--color-interactive);
      border-color: var(--color-interactive);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
      border-radius: var(--radius-sm);
    }
  }
}

.hero-emblem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: end;
  text-align: center;
}

.emblem-frame {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(168px, 18vw, 232px);
  aspect-ratio: 1;
  background: radial-gradient(circle at 50% 42%, rgba(212, 160, 23, 0.12), transparent 68%);
  border: 1px solid var(--color-gold-refined-line);
  border-radius: 50%;

  &::before {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(201, 168, 76, 0.24);
    border-radius: 50%;
  }
}

.emblem-logo {
  width: 72%;
  height: 72%;
  object-fit: contain;
}

.emblem-text {
  margin-top: var(--space-4);
  text-align: center;
}

.emblem-name {
  font-family: var(--font-sub);
  font-size: var(--text-body);
  letter-spacing: 0.08em;
  color: var(--color-primary-dark);
}

.emblem-en {
  margin-top: var(--space-1);
  font-family: var(--font-en);
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-8);
  }

  .hero-copy {
    max-width: none;
  }

  .hero-emblem {
    flex-direction: row;
    align-items: center;
    justify-self: start;
    gap: var(--space-4);
    text-align: left;
  }

  .emblem-frame {
    flex: 0 0 auto;
    width: 128px;
  }

  .emblem-text {
    margin-top: 0;
    text-align: left;
  }
}

// 移动端 H1：字号由 clamp 下限 2.2rem 接管，此处只统一行高与字距
@media (max-width: 768px) {
  .hero-title {
    line-height: 1.2;
    letter-spacing: 0.02em;
  }
}

@media (max-width: 640px) {
  .hero-subtitle {
    font-size: var(--text-body-sm);
    line-height: 1.85;
  }

  .emblem-frame {
    width: 104px;
  }

  .emblem-en {
    display: none;
  }
}

// ============================================
// 公共标题
// ============================================

// 编辑式章节标题：eyebrow 基础样式由 main.scss 统一提供，此处只保留版式
.section-head {
  max-width: 660px;
  margin-bottom: var(--spacing-2xl);

  h2 {
    margin: var(--space-3) 0 var(--space-4);
    font-family: var(--font-title);
    font-size: var(--text-h2);
    font-weight: 400;
    line-height: 1.28;
    letter-spacing: 0.02em;
    color: var(--color-primary-dark);
  }

  .section-desc {
    color: var(--color-text-light);
    font-size: var(--text-body);
    line-height: var(--leading-relaxed);
  }
}

// ============================================
// 平台介绍
// ============================================

.platform-section {
  background: var(--color-background);
  padding: var(--section-gap) 0;
}

.platform-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
  gap: clamp(32px, 5vw, 88px);
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-8);
  }
}

.platform-main {
  max-width: 620px;

  .platform-name {
    margin-bottom: var(--space-4);
    font-family: var(--font-sub);
    font-size: var(--text-h4);
    color: var(--color-primary-dark);
  }

  > p {
    color: var(--color-text-medium);
    font-size: var(--text-body);
    line-height: 2;

    & + p {
      margin-top: var(--space-4);
    }
  }

  @media (max-width: 900px) {
    max-width: none;
  }
}

// ============================================
// 项目组织与分工
// ============================================

.team-section {
  background: var(--color-background);
  padding: clamp(48px, 5.5vw, 72px) 0 clamp(32px, 4vw, 48px);

  .section-head {
    // 团队区块沿用全站统一的章节头间距（48px），与平台介绍 / 项目理念一致
    margin-bottom: var(--spacing-2xl);
  }
}

.role-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--color-border);
}

.role-item {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.role-no {
  font-family: var(--font-en);
  font-size: 1.25rem;
  line-height: 1.35;
  color: var(--color-secondary);
}

.role-body {
  h3 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-sub);
    font-size: var(--text-h5);
    font-weight: 600;
    color: var(--color-primary-dark);
  }

  p {
    margin-top: var(--space-1);
    color: var(--color-text-muted);
    font-size: var(--text-body-sm);
    line-height: 1.8;
  }
}

.role-status {
  padding: 2px 8px;
  border: 1px solid var(--color-gold-refined-line);
  border-radius: var(--radius-sm);
  font-family: var(--font-ui);
  font-size: var(--text-label);
  font-weight: 400;
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
}

.team-note-plain {
  margin-top: var(--space-5);
  color: var(--color-text-muted);
  font-size: var(--text-caption);
  line-height: 1.8;
}

@media (max-width: 640px) {
  .role-item {
    grid-template-columns: 36px minmax(0, 1fr);
    gap: var(--space-3);
    padding: var(--space-3) 0;
  }

  .role-no {
    font-size: 1rem;
  }
}

.focus-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--color-border);
}

.focus-item {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.focus-no {
  font-family: var(--font-en);
  font-size: 1.5rem;
  line-height: 1.15;
  color: var(--color-secondary);
}

.focus-body {
  h4 {
    font-family: var(--font-sub);
    font-size: var(--text-h5);
    font-weight: 600;
    color: var(--color-primary-dark);
  }

  p {
    margin-top: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-body-sm);
    line-height: 1.8;
  }
}

// ============================================
// 项目理念
// ============================================

.mission-section {
  background: var(--color-surface);
  padding: var(--section-gap) 0;
}

.mission-values {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--color-border);
}

.value-row {
  display: grid;
  grid-template-columns: clamp(64px, 8vw, 104px) minmax(0, 1fr);
  gap: clamp(16px, 3vw, 40px);
  padding: clamp(24px, 3vw, 36px) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.value-no {
  font-family: var(--font-en);
  font-size: clamp(1.9rem, 3vw, 2.5rem);
  line-height: 1;
  color: var(--color-secondary);
}

.value-content {
  h3 {
    font-family: var(--font-sub);
    font-size: var(--text-h4);
    font-weight: 600;
    color: var(--color-primary-dark);
  }

  p {
    max-width: 46em;
    margin-top: var(--space-3);
    color: var(--color-text-light);
    font-size: var(--text-body);
    line-height: 1.9;
  }

  .value-quote {
    margin-top: var(--space-2);
    color: var(--color-secondary-dark);
    font-size: var(--text-body-sm);
    font-style: italic;
  }
}

@media (max-width: 640px) {
  .focus-item {
    grid-template-columns: 40px minmax(0, 1fr);
    gap: var(--space-3);
  }

  .focus-no {
    font-size: 1.25rem;
  }

  .value-row {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: var(--space-3);
    padding: var(--space-6) 0;
  }

  .value-no {
    font-size: 1.5rem;
  }
}

// ============================================
// 数据来源与致谢
// ============================================

.sources-section {
  background: var(--color-background);
  padding: var(--section-gap) 0;
}

.source-note {
  max-width: 760px;
  margin-bottom: var(--space-8);
  color: var(--color-text-light);
  font-size: var(--text-body-sm);
  line-height: 1.9;
}

.block-title {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  font-family: var(--font-sub);
  font-size: var(--text-h5);
  font-weight: 600;
  color: var(--color-primary-dark);

  .block-no {
    font-family: var(--font-en);
    font-size: var(--text-label);
    letter-spacing: var(--tracking-wider);
    color: var(--color-secondary-dark);
  }
}

.stat-block {
  margin-bottom: clamp(48px, 6vw, 72px);
}

.stat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--color-border);
}

.stat-row {
  display: grid;
  grid-template-columns: 32px 132px minmax(0, 1fr);
  gap: var(--space-4) var(--space-6);
  align-items: start;
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.stat-no {
  padding-top: 10px;
  font-family: var(--font-en);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
}

.stat-figure {
  display: flex;
  align-items: baseline;
  gap: 4px;

  .stat-value {
    font-family: var(--font-en);
    font-size: clamp(2rem, 2.6vw, 2.6rem);
    line-height: 1;
    color: var(--color-secondary-dark);
  }

  em {
    font-style: normal;
    font-size: var(--text-caption);
    color: var(--color-text-muted);
  }
}

.stat-body {
  h4 {
    font-family: var(--font-sub);
    font-size: var(--text-body-lg);
    font-weight: 600;
    color: var(--color-primary-dark);
  }
}

.stat-scope {
  margin-top: var(--space-1);
  color: var(--color-text-light);
  font-size: var(--text-body-sm);
  line-height: 1.7;
}

.stat-meta {
  margin-top: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--text-caption);
  line-height: 1.8;

  a {
    color: var(--color-secondary-dark);
    text-decoration: none;
    border-bottom: 1px solid var(--color-gold-refined-line);

    &:hover {
      color: var(--color-interactive);
      border-color: var(--color-interactive);
    }
  }

  .meta-sep {
    margin: 0 6px;
  }
}

// 窄屏来源呈现：行内链接隐藏，改为编号引用 + 底部统一清单
.stat-src-ref,
.stat-src-compact {
  display: none;
}

.stat-note {
  margin-top: var(--space-2);
  padding-left: var(--space-3);
  border-left: 2px solid var(--color-gold-refined-line);
  color: var(--color-text-muted);
  font-size: var(--text-caption);
  line-height: 1.7;

  &__label {
    margin-right: var(--space-2);
    font-family: var(--font-en);
    font-size: 0.62rem;
    letter-spacing: var(--tracking-wide);
    color: var(--color-primary);
  }
}

.stat-footnote {
  margin-top: var(--space-4);
  color: var(--color-text-muted);
  font-size: var(--text-caption);
  line-height: 1.8;
}

.credit-block {
  padding-top: clamp(32px, 4vw, 48px);
  border-top: 1px solid var(--color-border);
}

.credit-details {
  border-top: 1px solid var(--color-border);
}

.credit-summary {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 48px;
  padding: var(--space-2) 0;
  cursor: pointer;
  font-family: var(--font-ui);
  font-size: var(--text-body-sm);
  color: var(--color-secondary-dark);
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &::before {
    content: '+';
    font-family: var(--font-en);
    font-size: 1.05rem;
    line-height: 1;
    color: var(--color-secondary);
  }

  &:hover {
    color: var(--color-interactive);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
    border-radius: var(--radius-sm);
  }
}

.credit-details[open] .credit-summary::before {
  content: '−';
}

.credit-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--color-border);
}

.credit-row {
  display: grid;
  grid-template-columns: 40px minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: var(--space-3) var(--space-6);
  align-items: start;
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.credit-no {
  padding-top: 4px;
  font-family: var(--font-en);
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
}

.credit-name strong {
  font-family: var(--font-sub);
  font-size: var(--text-body-lg);
  font-weight: 600;
  color: var(--color-primary-dark);
}

.credit-use {
  color: var(--color-text-light);
  font-size: var(--text-body-sm);
  line-height: 1.7;
}

.credit-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-4);
  margin-top: var(--space-2);
}

.license {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--color-gold-refined-line);
  border-radius: var(--radius-sm);
  color: var(--color-text-medium);
  font-size: var(--text-label);
  line-height: 1.5;
}

.license-label {
  font-family: var(--font-en);
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.credit-source {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  color: var(--color-secondary-dark);
  font-size: var(--text-caption);
  text-decoration: none;
  border-bottom: 1px solid var(--color-gold-refined-line);
  transition: color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--color-interactive);
    border-color: var(--color-interactive);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
    border-radius: var(--radius-sm);
  }
}

@media (max-width: 900px) {
  .stat-row {
    grid-template-columns: 28px 112px minmax(0, 1fr);
    gap: var(--space-3) var(--space-4);
  }

  .credit-row {
    grid-template-columns: 32px minmax(0, 1fr);
    row-gap: var(--space-2);
  }

  .credit-meta {
    grid-column: 2;
  }
}

@media (max-width: 640px) {
  .sources-section {
    padding: 36px 0;
  }

  .sources-section .section-head {
    margin-bottom: var(--space-5);

    .section-desc {
      display: none;
    }
  }

  .source-note {
    margin-bottom: var(--space-4);
    font-size: var(--text-caption);
    line-height: 1.7;
  }

  .stat-block {
    margin-bottom: var(--space-5);
  }

  .stat-row {
    grid-template-columns: 22px 64px minmax(0, 1fr);
    column-gap: var(--space-2);
    row-gap: 0;
    padding: 12px 0;
  }

  .stat-no {
    padding-top: 6px;
  }

  .stat-figure {
    grid-column: 2;

    .stat-value {
      font-size: 1.4rem;
    }

    em {
      font-size: 0.68rem;
    }
  }

  .stat-body {
    grid-column: 3;

    h4 {
      font-size: 0.95rem;
      line-height: 1.45;
    }
  }

  .stat-scope {
    margin-top: 2px;
    font-size: 0.75rem;
    line-height: 1.6;
  }

  .stat-note {
    margin-top: var(--space-1);
    padding-left: var(--space-2);
    font-size: 0.72rem;
    line-height: 1.6;
  }

  .stat-meta {
    margin-top: 2px;
    font-size: 0.72rem;
    line-height: 1.55;
  }

  .stat-src-inline {
    display: none;
  }

  .stat-src-ref {
    display: inline;
  }

  .stat-src-compact {
    display: block;
    list-style: none;
    margin: var(--space-2) 0 0;
    padding: var(--space-2) 0 0;
    border-top: 1px dashed var(--color-border-light);

    li {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
    }

    .src-no {
      flex: 0 0 auto;
      font-family: var(--font-en);
      font-size: var(--text-caption);
      line-height: 1.7;
      color: var(--color-secondary-dark);
    }

    a {
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      color: var(--color-secondary-dark);
      font-size: var(--text-caption);
      line-height: 1.5;
      text-decoration: none;
      border-bottom: 1px solid var(--color-gold-refined-line);
    }
  }

  .stat-footnote {
    margin-top: var(--space-3);
    font-size: 0.72rem;
    line-height: 1.6;
  }

  .credit-block {
    padding-top: var(--space-4);
  }

  .credit-row {
    padding: var(--space-4) 0;
  }

  .credit-actions {
    margin-top: var(--space-1);
  }

  .credit-source {
    min-height: 44px;
  }
}

// ============================================
// 了解与参与
// ============================================

.cta-section {
  position: relative;
  background: var(--color-primary);
  overflow: hidden;
}

.cta-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(640px 320px at 50% 0%, rgba(212, 160, 23, 0.28), transparent 70%),
    repeating-linear-gradient(45deg, rgba(255, 248, 231, 0.04) 0 1px, transparent 1px 12px);
  opacity: 0.9;
}

.cta-content {
  position: relative;
  z-index: 1;
  padding: clamp(56px, 7vw, 88px) 0;
  text-align: center;

  h2 {
    font-family: var(--font-title);
    font-size: var(--text-h2);
    font-weight: 400;
    letter-spacing: 0.02em;
    color: var(--color-background);
  }
}

.cta-desc {
  margin-top: var(--space-3);
  color: rgba(255, 248, 231, 0.76);
  font-size: var(--text-body-sm);
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.cta-more {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  font-size: var(--text-caption);
  color: rgba(255, 248, 231, 0.6);

  &__label {
    letter-spacing: var(--tracking-wide);
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 4px;
    color: rgba(255, 248, 231, 0.86);
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 248, 231, 0.28);
    transition: color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);

    &:hover {
      color: var(--color-background);
      border-color: var(--color-secondary);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
      border-radius: var(--radius-sm);
    }
  }

  i {
    font-style: normal;
    opacity: 0.5;
  }
}

.contact-note {
  margin-top: var(--space-4);
  margin-bottom: 0;
  color: rgba(255, 248, 231, 0.62);
  font-size: var(--text-caption);
  line-height: 1.7;
}

.contact-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
  color: rgba(255, 248, 231, 0.8);
  font-size: var(--text-caption);

  a {
    color: #F5E6C8;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// CTA 深色底上的次级按钮
.cta-section .btn-ghost {
  color: var(--color-background);
  border: 1px solid rgba(255, 248, 231, 0.5);

  &:hover {
    background: rgba(255, 248, 231, 0.1);
    color: var(--color-background);
  }
}
</style>
