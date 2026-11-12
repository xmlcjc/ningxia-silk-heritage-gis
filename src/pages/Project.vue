<template>
  <div class="project-page">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="container hero-grid">
        <div class="hero-copy" data-reveal-stagger>
          <p class="hero-eyebrow">
            <span class="eyebrow-line" aria-hidden="true"></span>
            项目概况 / PROJECT OVERVIEW
          </p>
          <h1 class="hero-title">项目概况</h1>
          <p class="hero-subtitle">
            基于 GIS 与 WebGIS 的宁夏丝路非遗数字化保护、时空可视化与传播展示平台
          </p>
          <p class="hero-meta">大学生创新创业项目</p>
          <div class="hero-actions">
            <a href="#results" class="btn btn-primary">查看项目成果</a>
            <a href="#intro" class="btn btn-ghost">了解项目内容</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 页内章节导航：全页唯一一套，桌面吸顶、窄屏横向滚动 -->
    <nav class="section-nav" aria-label="本页章节">
      <div class="container section-nav__inner">
        <a
          v-for="section in pageSections"
          :key="'nav-' + section.id"
          class="section-nav__item"
          :class="{ 'is-active': activeSection === section.id }"
          :href="'#' + section.id"
          :aria-current="activeSection === section.id ? 'true' : undefined"
        >
          <span class="section-nav__no">{{ section.no }}</span>
          <span class="section-nav__name">{{ section.name }}</span>
        </a>
      </div>
    </nav>

    <!-- 项目简介 -->
    <section id="intro" class="section intro-section">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>01</span>概览</p>
          <h2>项目介绍</h2>
          <p class="section-desc">建设背景 · 项目定位 · 研究缘起</p>
        </div>
        
        <div class="intro-wrapper">
          <div class="intro-main" data-reveal>
            <p class="intro-eyebrow">项目背景</p>
            <p class="intro-text">
              宁夏丝绸之路沿线的非物质文化遗产分布分散，项目信息多以名录与图文形式保存，
              缺少统一的空间记录与可按地理关系检索的视图。本项目尝试把非遗资源放回山川、
              古道与行政区之中组织与呈现。
            </p>
            <p class="intro-eyebrow">研究缘起</p>
            <p class="intro-text">
              本项目以<span class="highlight">宁夏丝绸之路沿线非物质文化遗产</span>为研究对象，
              运用<span class="highlight">GIS空间分析技术</span>，系统搜集、整理宁夏丝路非遗资源，
              构建<span class="highlight">宁夏丝路非遗地理信息数据库</span>。通过WebGIS技术实现非遗资源的
              <span class="highlight">时空可视化展示</span>，探索"非遗保护+乡村振兴+文旅融合"的协同发展路径，
              为宁夏非遗的数字化保护、传承与传播提供新的技术手段和平台支撑。
            </p>
          </div>

          <ol class="intro-points" data-reveal-stagger>
            <li class="intro-point" v-for="(point, index) in introPoints" :key="index">
              <span class="intro-point__no">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="intro-point__body">
                <h3>{{ point.title }}</h3>
                <p>{{ point.desc }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- 立项依据 -->
    <section id="basis" class="section basis-section">
      <div class="section-bg"></div>
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>02</span>基础</p>
          <h2>项目基础</h2>
          <p class="section-desc">区域基础 · 研究基础 · 工作基础</p>
        </div>
        
        <div class="basis-tabs" data-reveal data-reveal-delay="80">
          <div class="tabs-header" role="tablist" aria-label="项目基础内容">
            <button
              v-for="(tab, index) in basisTabs"
              :id="'basis-tab-' + tab.key"
              :key="tab.key"
              type="button"
              role="tab"
              class="tab-btn"
              :class="{ 'active': activeBasisTab === tab.key }"
              :aria-selected="activeBasisTab === tab.key ? 'true' : 'false'"
              :aria-controls="'basis-panel-' + tab.key"
              :tabindex="activeBasisTab === tab.key ? 0 : -1"
              @click="selectBasisTab(tab.key)"
              @keydown="onBasisKeydown($event, index)"
            >
              <Icon class="tab-icon" :icon="'gis:' + tab.icon" />
              <span class="tab-label">{{ tab.label }}</span>
            </button>
          </div>
          
          <div class="tabs-content">
            <!-- 研究目的与意义 -->
            <div
              v-show="activeBasisTab === 'purpose'"
              id="basis-panel-purpose"
              class="tab-panel"
              role="tabpanel"
              aria-labelledby="basis-tab-purpose"
            >
              <div class="panel-grid">
                <div class="panel-card">
                  <div class="card-header">
                    <Icon class="header-icon" icon="gis:location-arrow" />
                    <h3>研究目的</h3>
                  </div>
                  <ul class="card-list">
                    <li>
                      <span class="list-num">01</span>
                      <span>把分散的非遗项目整理为可查询、可关联的地理信息数据库</span>
                    </li>
                    <li>
                      <span class="list-num">02</span>
                      <span>用地图与档案联动呈现非遗的空间分布、传播脉络与历史演变</span>
                    </li>
                    <li>
                      <span class="list-num">03</span>
                      <span>为非遗保护、乡村振兴与文旅融合提供可持续维护的数字平台</span>
                    </li>
                  </ul>
                  <p class="card-note">
                    总体目标说明项目希望解决的问题；具体研究对象与工作内容见
                    <a href="#research">研究内容</a>。
                  </p>
                </div>
                
                <div class="panel-card">
                  <div class="card-header">
                    <Icon class="header-icon" icon="gis:poi-info" />
                    <h3>研究意义</h3>
                  </div>
                  <div class="meaning-grid">
                    <div class="meaning-item">
                      <Icon class="meaning-icon" icon="gis:map-book" />
                      <div class="meaning-content">
                        <h4>学术意义</h4>
                        <p>拓展GIS技术在文化遗产保护领域的应用，丰富数字人文研究方法</p>
                      </div>
                    </div>
                    <div class="meaning-item">
                      <Icon class="meaning-icon" icon="gis:map-options" />
                      <div class="meaning-content">
                        <h4>实践意义</h4>
                        <p>为宁夏非遗保护提供技术平台，服务地方文化建设与经济发展</p>
                      </div>
                    </div>
                    <div class="meaning-item">
                      <Icon class="meaning-icon" icon="gis:globe" />
                      <div class="meaning-content">
                        <h4>社会意义</h4>
                        <p>提升公众对丝路非遗的认知，促进文化传承与传播</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 国内外研究现状 -->
            <div
              v-show="activeBasisTab === 'status'"
              id="basis-panel-status"
              class="tab-panel"
              role="tabpanel"
              aria-labelledby="basis-tab-status"
            >
              <div class="status-grid">
                <div class="status-card">
                  <div class="status-header">
                    <Icon class="status-flag" icon="gis:earth" />
                    <h3>国际研究与实践</h3>
                  </div>
                  <p>
                    GIS 与数字人文的结合已有较长积累，文化遗产的空间分布、历史地理与可视化表达是常见研究方向。
                    相关实践为非遗资源的空间组织、地图表达与公众展示提供了方法参考。
                  </p>
                  <div class="status-examples">
                    <span class="example-tag">空间人文</span>
                    <span class="example-tag">遗产地图</span>
                    <span class="example-tag">数字人文</span>
                  </div>
                </div>
                
                <div class="status-card">
                  <div class="status-header">
                    <Icon class="status-flag" icon="gis:earth-asia" />
                    <h3>国内研究与实践</h3>
                  </div>
                  <p>
                    国内相关研究在非遗数字化、文化资源空间分布与知识组织等方向持续展开。
                    针对宁夏丝路非遗的系统性空间整理与公众展示仍相对有限，本项目尝试在这一方向上作出补充。
                  </p>
                  <div class="status-examples">
                    <span class="example-tag">非遗数字化</span>
                    <span class="example-tag">文化资源 GIS</span>
                    <span class="example-tag">数字档案</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 项目前期准备 -->
            <div
              v-show="activeBasisTab === 'preparation'"
              id="basis-panel-preparation"
              class="tab-panel"
              role="tabpanel"
              aria-labelledby="basis-tab-preparation"
            >
              <div class="prep-grid">
                <div class="prep-card" v-for="(prep, index) in preparations" :key="index">
                  <div class="prep-icon-wrapper">
                    <Icon class="prep-icon" :icon="'gis:' + prep.icon" />
                    <div class="prep-icon-bg"></div>
                  </div>
                  <h4>{{ prep.title }}</h4>
                  <p>{{ prep.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 研究内容 -->
    <section id="research" class="section research-section">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>03</span>内容</p>
          <h2>研究内容</h2>
          <p class="section-desc">四大核心方向 · 系统性研究框架</p>
        </div>
        
        <div class="research-framework" data-reveal-stagger>
          <div class="research-card" v-for="(item, index) in researchContent" :key="index">
            <div class="research-header">
              <div class="research-num">{{ String(index + 1).padStart(2, '0') }}</div>
              <h3>{{ item.title }}</h3>
            </div>
            <div class="research-body">
              <ul class="research-list">
                <li v-for="task in item.tasks" :key="task">
                  <span class="task-dot"></span>
                  {{ task }}
                </li>
              </ul>
            </div>
            <div class="research-footer">
              <span class="footer-tag">{{ item.typeLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术路线 -->
    <section id="tech" class="section tech-section">
      <div class="section-bg-alt"></div>
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>04</span>路线</p>
          <h2>技术路线</h2>
          <p class="section-desc">资料整理 → 空间组织 → 地理处理 → 可视化 → 数字档案与三维展示</p>
        </div>

        <ol class="tech-flow" data-reveal-stagger>
          <li v-for="(step, index) in techRoute" :key="step.title" class="tech-step">
            <div class="tech-step__marker">
              <span class="tech-step__no">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="tech-step__node" aria-hidden="true"></span>
            </div>
            <div class="tech-step__body">
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
          </li>
        </ol>

        <div class="tech-stack" data-reveal>
          <span class="tech-stack__label">当前技术栈</span>
          <ul>
            <li v-for="item in techStack" :key="item">{{ item }}</li>
          </ul>
          <p class="tech-note">
            平台当前为纯前端静态站点，未使用后端接口或数据库服务；地图底图来自天地图与高德，
            三维场景使用 3D 高斯泼溅查看器。
          </p>
        </div>
      </div>
    </section>

    <!-- 创新点 -->
    <section id="innovation" class="section innovation-section">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>05</span>创新</p>
          <h2>创新特色</h2>
          <p class="section-desc">常规做法 · 本项目做法 · 实际价值</p>
        </div>
        
        <div class="innovation-list" data-reveal-stagger>
          <article class="innovation-item" v-for="(item, index) in innovations" :key="index">
            <span class="innovation-no">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="innovation-body">
              <h3>{{ item.title }}</h3>
              <dl class="innovation-compare">
                <div>
                  <dt>常规做法</dt>
                  <dd>{{ item.conventional }}</dd>
                </div>
                <div>
                  <dt>本项目做法</dt>
                  <dd>{{ item.approach }}</dd>
                </div>
                <div>
                  <dt>实际价值</dt>
                  <dd>{{ item.value }}</dd>
                </div>
              </dl>
              <div class="innovation-tags">
                <span v-for="tag in item.tags" :key="tag" class="tag-mini">{{ tag }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 项目成果 -->
    <section id="results" class="section results-section">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow"><span>06</span>成果</p>
          <h2>项目成果</h2>
          <p class="section-desc">{{ deliverableCount }} 项成果条目 · 逐项标注可用性与核验状态</p>
        </div>

        <div class="results-grid" data-reveal-stagger>
          <component
            :is="item.route ? 'router-link' : 'div'"
            v-for="item in projectDeliverables"
            :key="item.id"
            :to="item.route || undefined"
            class="result-card"
            :class="['deliverable-' + item.id, { 'is-static': !item.route }]"
          >
            <div class="card-image-wrapper">
              <div class="result-placeholder" :class="'bg-' + item.category.toLowerCase()">
                <Icon class="placeholder-icon" :icon="iconForDeliverable(item)" />
              </div>
              <div class="result-badge" :class="'type-' + categoryKey(item.category)">
                {{ categoryLabel(item.category) }}
              </div>
              <div v-if="item.route" class="image-overlay">
                <span class="overlay-btn">打开平台 →</span>
              </div>
            </div>

            <div class="card-body">
              <h3 class="result-title">{{ item.name }}</h3>
              <p class="result-desc">{{ item.description }}</p>

              <div class="result-meta">
                <span class="meta-tag" :class="statusClass(item.verificationStatus)">
                  {{ statusLabel(item.verificationStatus) }}
                </span>
                <span class="meta-tag go-tag" v-if="item.route">站内入口</span>
                <span class="meta-tag" v-else>数据与资源 · 不可点击</span>
                <span class="meta-tag direction-tag">{{ directionLabel(item.id) }}</span>
              </div>

              <p v-if="item.verificationNote" class="result-note">
                <span class="note-label">核验说明</span>{{ item.verificationNote }}
              </p>
            </div>
            <span v-if="item.route" class="result-go" aria-hidden="true">→</span>
          </component>
        </div>
      </div>
    </section>

    <!-- 建设目标 -->
    <section id="goals" class="section outcomes-section">
      <div class="outcomes-bg">
        <div class="bg-pattern"></div>
      </div>
      <div class="container">
        <div class="section-head section-head--light" data-reveal>
          <p class="eyebrow"><span>07</span>展望</p>
          <h2>未来展望</h2>
          <p class="section-desc">尚未完成的建设方向 · 已完成成果见「项目成果」</p>
        </div>
        
        <div class="outcomes-layout" data-reveal-stagger>
          <div class="goals-main">
            <div class="goals-header">
              <Icon class="header-icon" icon="gis:flag-finish" />
              <h3>后续建设方向</h3>
            </div>
            <ol class="goal-list">
              <li v-for="(goal, index) in goals" :key="goal.text">
                <span class="goal-no">{{ String(index + 1).padStart(2, '0') }}</span>
                <span>{{ goal.text }}</span>
                <span class="goal-status" :class="goal.status === '计划' ? 'is-planned' : 'is-ongoing'">
                  {{ goal.status }}
                </span>
              </li>
            </ol>
          </div>

          <aside class="goals-aside">
            <h3>查看已交付成果</h3>
            <div class="goal-links">
              <a href="#results" class="goal-link">
                项目成果清单 <span aria-hidden="true">→</span>
              </a>
              <router-link to="/map" class="goal-link">
                GIS 地图 <span aria-hidden="true">→</span>
              </router-link>
              <router-link to="/archive" class="goal-link">
                数字档案 <span aria-hidden="true">→</span>
              </router-link>
            </div>
            <p class="goal-note">
              成果条目由统一数据层管理，并逐项标注可用性与核验状态。
            </p>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { projectDeliverables } from '@/data/project'

const activeBasisTab = ref('purpose')

// 页内章节：全页唯一一套导航的数据源
const pageSections = [
  { id: 'intro', no: '01', name: '项目介绍' },
  { id: 'basis', no: '02', name: '项目基础' },
  { id: 'research', no: '03', name: '研究内容' },
  { id: 'tech', no: '04', name: '技术路线' },
  { id: 'innovation', no: '05', name: '创新特色' },
  { id: 'results', no: '06', name: '项目成果' },
  { id: 'goals', no: '07', name: '未来展望' }
]

// 当前章节：IntersectionObserver 轻量同步，不引入滚动监听
const activeSection = ref('intro')
let sectionObserver = null

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') return
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      })
    },
    { rootMargin: '-40% 0px -55% 0px' }
  )
  pageSections.forEach((section) => {
    const el = document.getElementById(section.id)
    if (el) sectionObserver.observe(el)
  })
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
  sectionObserver = null
})

// 项目成果：数据来自统一数据层
const deliverableCount = projectDeliverables.length
const categoryLabels = { SOFTWARE: '软件平台', DATA: '数据成果', ASSET: '场景资源' }
const categoryKeys = { SOFTWARE: 'platform', DATA: 'database', ASSET: 'scene' }
const categoryIcons = { SOFTWARE: 'gis:globe', DATA: 'gis:layers', ASSET: 'gis:cube-3d' }
// 按成果 ID 区分图标，避免三项软件成果共用同一地球图标
const deliverableIcons = {
  'gis-map': 'gis:map',
  'digital-archive': 'gis:map-book',
  'three-dimension-screen': 'gis:cube-3d',
  'heritage-records': 'gis:layers',
  'three-dimension-scenes': 'gis:globe'
}
const statusLabels = { VERIFIED: '已核验', CONDITIONAL: '有条件核验', NOT_VERIFIED: '未核验' }
const categoryLabel = (category) => categoryLabels[category] || category
const categoryKey = (category) => categoryKeys[category] || 'platform'
const iconForDeliverable = (item) =>
  deliverableIcons[item.id] || categoryIcons[item.category] || 'gis:folder-map'
const statusLabel = (status) => statusLabels[status] || status
const statusClass = (status) =>
  ({ VERIFIED: 'is-verified', CONDITIONAL: 'is-conditional', NOT_VERIFIED: 'is-unverified' }[status] || 'is-unverified')

// 项目简介要点
const introPoints = ref([
  { icon: 'map-stat', title: 'GIS数据库构建', desc: '系统搜集整理宁夏丝路非遗资源，构建地理信息数据库' },
  { icon: 'map', title: '时空可视化展示', desc: '运用WebGIS技术，实现非遗资源的时空分布展示' },
  { icon: 'network', title: '保护路径探索', desc: '探索非遗保护与乡村振兴、文旅融合的协同路径' }
])

// 立项依据标签页
const basisTabs = ref([
  { key: 'purpose', label: '研究目的与意义', icon: 'location-arrow' },
  { key: 'status', label: '国内外研究现状', icon: 'map-book' },
  { key: 'preparation', label: '研究基础', icon: 'map-legend' }
])

// 项目基础标签页：roving tabindex + 方向键，与数字档案的标签模式保持一致
const selectBasisTab = (key) => {
  activeBasisTab.value = key
  nextTick(() => document.getElementById('basis-tab-' + key)?.focus())
}

const onBasisKeydown = (event, index) => {
  const total = basisTabs.value.length
  let next = index
  if (event.key === 'ArrowRight') next = (index + 1) % total
  else if (event.key === 'ArrowLeft') next = (index - 1 + total) % total
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = total - 1
  else return
  event.preventDefault()
  selectBasisTab(basisTabs.value[next].key)
}

// 研究基础
const preparations = ref([
  { icon: 'map-book', title: '文献与名录', desc: '整理宁夏地方志、非遗名录与相关研究资料，作为项目背景与项目释文的参考。' },
  { icon: 'map', title: '空间数据', desc: '为非遗项目补充经纬度与所属行政区，形成可查询、可关联的空间记录结构。' },
  { icon: 'globe-gear', title: '技术实现', desc: '使用 Vue、Leaflet、ECharts 与 Three.js 完成地图、图表和三维展示功能。' },
  { icon: 'map-legend', title: '资料核验', desc: '区分平台收录记录与官方统计口径，对尚未核实的字段保留说明空间。' }
])

// 研究内容
const researchContent = ref([
  {
    title: '非遗资源整理与空间组织',
    type: 'database',
    typeLabel: '数据层',
    tasks: ['宁夏丝路非遗资源整理与分类', '非遗地理信息记录结构设计', '非遗空间分布特征分析', '丝路古道与非遗关联性研究']
  },
  {
    title: 'WebGIS 地图与档案联动',
    type: 'platform',
    typeLabel: '技术层',
    tasks: ['WebGIS 地图功能实现', '时空筛选与联动展示', '地图与数字档案互链', '响应式页面开发']
  },
  {
    title: '非遗保护与传播路径研究',
    type: 'strategy',
    typeLabel: '应用层',
    tasks: ['非遗保护与传播路径梳理', '分级分类展示策略研究', '非遗与文旅融合案例整理', '乡村振兴协同路径探讨']
  },
  {
    title: '三维地形与场景辅助展示',
    type: 'screen',
    typeLabel: '展示层',
    tasks: ['三维地形与非遗点位展示', '丝路古道三维可视化', '五市非遗数据大屏联动', '实景三维场景辅助展示']
  }
])

// 技术路线（按实际实现整理，不含时间计划）
const techRoute = ref([
  { title: '资料与名录整理', desc: '以公开名录、地方志与项目资料为基础，逐条整理非遗项目的名称、类别、级别、地区与传承信息。' },
  { title: '空间数据组织', desc: '为每条记录补充经纬度与所属行政区，形成可查询、可关联的空间记录结构。' },
  { title: '地理信息处理', desc: '按地市、类别、级别与历史时期进行分组统计，并将项目与丝路古道、黄河河道建立空间关联。' },
  { title: 'WebGIS 可视化', desc: '把空间记录组织为可交互的地图视图，并以 URL 保存筛选与选点状态，便于回访与分享。' },
  { title: '数字档案与三维展示', desc: '以图文档案承载项目信息，并为地图与大屏提供三维地形与实景场景作为辅助。' }
])

const techStack = ['Vue 3 + Vite', 'Vue Router', 'Leaflet', 'ECharts', 'Three.js', 'GeoJSON', '3D 高斯泼溅（SuperSplat）']

// 创新点
const innovations = ref([
  {
    icon: 'map-stat',
    title: '非遗资源空间化组织',
    conventional: '非遗名录多以文本、图片或名录数据库保存，项目之间缺少统一的空间坐标与地理关系。',
    approach: '在记录中补充经纬度、行政区与所属古道，把项目与丝路古道、黄河河道放在同一空间结构中。',
    value: '可以按地理关系检索与比较项目，为分布特征与线路关联提供可核对的底稿。',
    tags: ['空间组织', '地理关联', '数据记录']
  },
  {
    icon: 'network',
    title: '地图与数字档案联动',
    conventional: '展示页与档案页往往各自独立，用户在地图上看到项目后需要重新检索。',
    approach: '地图选点、档案详情与 URL 状态双向同步，筛选与选点可以分享和回访。',
    value: '从空间位置直接进入项目档案，再回到地图继续浏览，减少重复检索。',
    tags: ['地图联动', '数字档案', '深链']
  },
  {
    icon: 'cube-3d',
    title: '三维场景辅助展示',
    conventional: '平面地图难以表达地形起伏与实景空间，非遗项目常以图文形式呈现。',
    approach: '在二维地图之外提供三维地形大屏与实景高斯泼溅场景，作为理解地貌与场景的辅助。',
    value: '补充平面地图缺失的地貌与场景信息，但不替代档案中的文字与图像记录。',
    tags: ['三维地形', '实景场景', '辅助展示']
  }
])

// 未来展望：仅列尚未完成的建设方向，不重复已交付成果
const goals = ref([
  { text: '持续完善非遗项目记录的结构与信息完整度', status: '持续完善' },
  { text: '提升非遗空间分布的可视化与检索能力', status: '持续完善' },
  { text: '完善地图、数字档案与三维场景之间的联动', status: '持续完善' },
  { text: '补充可核验的数据来源与更新记录', status: '计划' },
  { text: '为研究、教学与公众传播提供稳定的信息入口', status: '持续完善' }
])

// 成果卡来源方向标记：与「研究内容」的四个方向对应，仅作展示，不改变成果数据
const directionLabels = {
  'gis-map': '技术层',
  'digital-archive': '技术层',
  'three-dimension-screen': '展示层',
  'heritage-records': '数据层',
  'three-dimension-scenes': '展示层'
}
const directionLabel = (id) => directionLabels[id] || '项目成果'
</script>

<style lang="scss" scoped>
// ============================================
// 区块节奏（本页专用，略紧于全站默认，控制长页总高）
// ============================================
.project-page section[id] {
  // 固定 Header 72/64px + 吸顶章节导航约 60px
  scroll-margin-top: 132px;
}

.project-page .section {
  padding-top: clamp(26px, 2.1vw, 30px);
  padding-bottom: clamp(26px, 2.1vw, 30px);
}

@media (max-width: 768px) {
  .project-page .section {
    padding-top: 22px;
    padding-bottom: 22px;
  }
}

// ============================================
// 页面英雄区
// ============================================

.page-hero {
  position: relative;
  background:
    radial-gradient(1100px 620px at 86% 12%, rgba(212, 160, 23, 0.12), transparent 62%),
    radial-gradient(760px 520px at 4% 0%, rgba(139, 69, 19, 0.07), transparent 66%),
    var(--color-paper);
  border-bottom: 1px solid var(--color-border-light);
  overflow: hidden;
}

.hero-grid {
  padding-top: clamp(32px, 3.6vw, 48px);
  padding-bottom: clamp(32px, 3.6vw, 48px);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.hero-copy {
  min-width: 0;
  max-width: 720px;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-ui);
  font-size: var(--text-caption);
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

.hero-subtitle {
  max-width: 34em;
  font-size: var(--text-body-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-text-medium);
}

.hero-meta {
  margin-top: var(--space-3);
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
}

// 页内章节导航：全页唯一一套，桌面吸顶、窄屏横向滚动
.section-nav {
  position: sticky;
  top: 72px;
  z-index: 20;
  background: var(--color-paper);
  border-bottom: 1px solid var(--color-border-light);

  &__inner {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 0;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    padding: 0 12px;
    border-radius: var(--radius-full);
    color: var(--color-text-medium);
    font-size: var(--text-caption);
    text-decoration: none;
    white-space: nowrap;
    transition: color var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out);

    &:hover {
      color: var(--color-primary);
    }

    &.is-active {
      color: var(--color-primary-dark);
      background: rgba(212, 160, 23, 0.12);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
  }

  &__no {
    font-family: var(--font-en);
    font-size: var(--text-label);
    letter-spacing: var(--tracking-wider);
    color: var(--color-primary);
  }
}

@media (max-width: 1100px) {
  .hero-grid {
    gap: var(--space-8);
  }
}

@media (max-width: 900px) {
  .hero-copy {
    max-width: none;
  }
}

@media (max-width: 768px) {
  .section-nav {
    top: 64px;
  }

  .project-page section[id] {
    scroll-margin-top: 124px;
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
}

// ============================================
// 项目简介区
// ============================================

.intro-section {
  background: var(--color-background);
}

.intro-wrapper {
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
  gap: clamp(32px, 5vw, 88px);
  align-items: start;
}

.intro-main {
  max-width: 620px;
}

.intro-eyebrow {
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border-light);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wider);
  color: var(--color-primary);
}

.intro-text {
  margin-top: var(--space-5);
  font-size: var(--text-body-lg);
  line-height: 2;
  color: var(--color-text-medium);
  text-align: justify;

  .highlight {
    color: var(--color-primary);
    font-weight: 600;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-secondary);
      opacity: 0.5;
    }
  }
}

.intro-points {
  list-style: none;
  margin: 0;
  padding: 0;
}

.intro-point {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-5) 0;
  border-top: 1px solid var(--color-border-light);

  &:last-child {
    border-bottom: 1px solid var(--color-border-light);
  }

  &__no {
    font-family: var(--font-en);
    font-size: 1.45rem;
    line-height: 1.2;
    color: var(--color-secondary);
  }

  &__body {
    h3 {
      margin-bottom: 6px;
      font-family: var(--font-sub);
      font-size: var(--text-body-lg);
      color: var(--color-primary-dark);
    }

    p {
      font-size: var(--text-body);
      line-height: 1.9;
      color: var(--color-text-light);
    }
  }
}

@media (max-width: 900px) {
  .intro-wrapper {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-6);
  }

  .intro-main {
    max-width: none;
  }
}

// ============================================
// 立项依据区
// ============================================

.basis-section {
  position: relative;
  background: var(--color-surface);
  overflow: hidden;
}

.section-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(212, 160, 23, 0.05) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 70%, rgba(46, 139, 87, 0.05) 0%, transparent 40%);
}

.basis-tabs {
  max-width: none;
}

.tabs-header {
  display: flex;
  gap: var(--space-6);
  justify-content: flex-start;
  margin-bottom: var(--space-8);
  border-bottom: 1px solid var(--color-border-light);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-btn {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--space-2);
  min-height: 44px;
  padding: var(--space-3) 2px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  color: var(--color-text-light);
  font-size: var(--text-body);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--color-primary);
  }

  &.active {
    background: transparent;
    color: var(--color-primary);
    border-bottom-color: var(--color-secondary);
  }

  .tab-icon {
    font-size: 1rem;
    color: var(--color-secondary);
  }

  &:focus-visible {
    outline: none;
    border-radius: var(--radius-sm);
    box-shadow: var(--focus-ring);
  }
}

.tabs-content {
  padding: clamp(24px, 3vw, 40px);
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
}

.panel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(24px, 4vw, 56px);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
}

.panel-card {
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;

  & + .panel-card {
    padding-left: clamp(24px, 4vw, 56px);
    border-left: 1px solid var(--color-border-light);
  }

  @media (max-width: 768px) {
    & + .panel-card {
      padding-top: var(--space-6);
      padding-left: 0;
      border-top: 1px solid var(--color-border-light);
      border-left: 0;
    }
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border-light);

  .header-icon {
    font-size: 1.1rem;
    color: var(--color-secondary);
  }

  h3 {
    margin: 0;
    font-family: var(--font-sub);
    font-size: 1.15rem;
    color: var(--color-primary-dark);
  }
}

.card-list {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
    color: var(--color-text-medium);
    line-height: 1.85;

    .list-num {
      display: inline-flex;
      width: 24px;
      flex-shrink: 0;
      padding-top: 2px;
      background: none;
      color: var(--color-secondary);
      font-family: var(--font-en);
      font-size: 0.8rem;
      font-weight: 400;
    }
  }
}

.meaning-grid {
  display: flex;
  flex-direction: column;
}

.meaning-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4) 0;

  & + .meaning-item {
    border-top: 1px solid var(--color-border-light);
  }

  .meaning-icon {
    font-size: 1.1rem;
    color: var(--color-secondary);
    flex-shrink: 0;
    margin-top: 4px;
  }

  .meaning-content h4 {
    margin-bottom: 4px;
    font-family: var(--font-sub);
    font-size: 1rem;
    color: var(--color-primary-dark);
  }

  .meaning-content p {
    color: var(--color-text-light);
    font-size: 0.95rem;
    line-height: 1.8;
  }
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.status-card {
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--space-6);

  .status-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--color-border-light);

    .status-flag {
      font-size: 1.1rem;
      color: var(--color-secondary);
    }

    h3 {
      margin: 0;
      font-family: var(--font-sub);
      font-size: 1.15rem;
      color: var(--color-primary-dark);
    }
  }
  
  p {
    color: var(--color-text-light);
    line-height: 1.8;
    margin-bottom: var(--spacing-lg);
    
    strong {
      color: var(--color-primary);
    }
  }
  
  .status-examples {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    
    .example-tag {
      background: rgba(212, 160, 23, 0.1);
      color: var(--color-secondary-dark);
      padding: 4px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
    }
  }
}

.prep-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.prep-card {
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  transition: border-color var(--duration-fast) var(--ease-out);

  &:hover {
    border-color: var(--color-secondary);
  }

  .prep-icon-wrapper {
    margin-bottom: var(--space-4);

    .prep-icon {
      font-size: 1.5rem;
      color: var(--color-secondary);
    }

    .prep-icon-bg {
      display: none;
    }
  }

  h4 {
    margin-bottom: var(--space-2);
    font-family: var(--font-sub);
    font-size: 1rem;
    color: var(--color-primary-dark);
  }

  p {
    color: var(--color-text-light);
    font-size: 0.95rem;
    line-height: 1.8;
  }
}

// ============================================
// 研究内容区
// ============================================

.research-section {
  background: var(--color-background);
}

.research-framework {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(20px, 2.6vw, 32px);

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.research-card {
  padding: clamp(20px, 3vw, 32px);
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  transition: border-color var(--duration-fast) var(--ease-out);

  &:hover {
    border-color: var(--color-secondary);
  }
}

.research-header {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  .research-num {
    font-family: var(--font-en);
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.2;
    color: var(--color-secondary);
  }

  h3 {
    margin: 0;
    font-family: var(--font-sub);
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1.45;
    color: var(--color-primary-dark);
  }
}

.research-list {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
    font-size: var(--text-body);
    line-height: 1.85;
    color: var(--color-text-light);

    .task-dot {
      width: 4px;
      height: 4px;
      margin-top: 10px;
      background: var(--color-secondary);
      border-radius: 50%;
      flex-shrink: 0;
    }
  }
}

.research-footer {
  margin-top: var(--space-5);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-light);

  .footer-tag {
    font-size: var(--text-label);
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
  }
}

// ============================================
// 技术路线
// ============================================

.tech-section {
  position: relative;
  background: var(--color-surface);
}

.section-bg-alt {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(45deg, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
    linear-gradient(-45deg, rgba(212, 160, 23, 0.03) 0%, transparent 50%);
}

.tech-flow {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}

.tech-step {
  position: relative;
  padding: 20px 24px 0 0;
  border-top: 1px solid var(--color-border);

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 0;
    width: 8px;
    height: 8px;
    background: var(--color-secondary);
    border-radius: 50%;
    box-shadow: 0 0 0 4px var(--color-surface);
  }

  &:last-child {
    padding-right: 0;
  }

  &__marker {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  &__no {
    font-family: var(--font-en);
    font-size: 1.6rem;
    line-height: 1;
    color: var(--color-secondary);
  }

  &__node {
    display: none;
  }

  &__body h3 {
    margin-bottom: var(--space-3);
    font-family: var(--font-sub);
    font-size: 1.05rem;
    font-weight: 600;
    line-height: 1.45;
    color: var(--color-primary-dark);
  }

  &__body p {
    font-size: 0.95rem;
    line-height: 1.85;
    color: var(--color-text-light);
  }
}

@media (max-width: 992px) {
  .tech-flow {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: var(--space-8);
  }

  .tech-step {
    padding-right: var(--space-5);
  }
}

@media (max-width: 640px) {
  .tech-flow {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0;
  }

  .tech-step {
    padding: 0 0 var(--space-8) 40px;
    border-top: 0;

    &::before {
      top: 8px;
      left: 0;
      box-shadow: 0 0 0 4px var(--color-surface);
    }

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 4px;
      top: 16px;
      bottom: 0;
      width: 1px;
      background: var(--color-border);
    }

    &__marker {
      margin-bottom: var(--space-2);
    }

    &__no {
      font-size: 1.25rem;
    }

    &__body h3 {
      font-size: 1rem;
    }

    &__body p {
      font-size: 0.92rem;
    }
  }
}

.tech-stack {
  margin-top: var(--space-8);
  padding-top: var(--space-5);
  border-top: 1px solid var(--color-border-light);

  &__label {
    display: block;
    margin-bottom: var(--space-3);
    font-size: var(--text-label);
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: inline-flex;
      align-items: center;
      font-size: 12.5px;
      color: var(--color-text-medium);

      & + li::before {
        content: '·';
        margin: 0 10px;
        color: var(--color-secondary);
      }
    }
  }
}

.tech-note {
  max-width: 880px;
  margin-top: var(--space-4);
  color: var(--color-text-muted);
  font-size: 12.5px;
  line-height: 1.8;
}

// ============================================
// 创新点区
// ============================================

.innovation-section {
  background: var(--color-background);
}

.innovation-list {
  border-top: 1px solid var(--color-border-light);
}

.innovation-item {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: clamp(16px, 3vw, 40px);
  padding: clamp(24px, 3.5vw, 40px) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.innovation-no {
  font-family: var(--font-en);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1;
  color: var(--color-secondary);
}

.innovation-body {
  h3 {
    margin-bottom: var(--space-3);
    font-family: var(--font-sub);
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--color-primary-dark);
  }

  p {
    max-width: 780px;
    margin-bottom: var(--space-3);
    font-size: var(--text-body);
    line-height: 1.9;
    color: var(--color-text-light);
  }
}

.innovation-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tag-mini {
  padding: 3px 10px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-full);
  color: var(--color-text-muted);
  font-size: 12px;
}

@media (max-width: 640px) {
  .innovation-item {
    grid-template-columns: 48px minmax(0, 1fr);
    gap: var(--space-3);
  }

  .innovation-no {
    font-size: 1.5rem;
  }

  .innovation-body h3 {
    font-size: 1.15rem;
  }

  .innovation-body p {
    font-size: 0.95rem;
  }
}

// ============================================
// 项目成果
// ============================================

.results-section {
  background: var(--color-background);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(16px, 2vw, 24px);
}

.result-card {
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr) 18px;
  align-items: stretch;
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  text-decoration: none;
  transition: border-color var(--duration-fast) var(--ease-out);

  &:hover {
    border-color: var(--color-secondary);

    .image-overlay {
      opacity: 1;
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 3px;
  }

  &.is-static {
    cursor: default;
    background: var(--color-background);
    border-style: dashed;

    &:hover {
      border-color: var(--color-border-light);
    }
  }
}

@media (max-width: 1100px) and (min-width: 641px) {
  .results-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .results-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 160px;
  overflow: hidden;

  .result-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &.bg-software { background: #EFE5D3; }
    &.bg-data { background: #F2EEE3; }
    &.bg-asset { background: #EDE3D2; }
  }

  .placeholder-icon {
    font-size: 3rem;
    opacity: 0.72;
  }

  // 按成果 ID 区分图标色，避免三项软件成果视觉同质
  .deliverable-gis-map & .placeholder-icon { color: var(--color-primary); }
  .deliverable-digital-archive & .placeholder-icon { color: #A0522D; }
  .deliverable-three-dimension-screen & .placeholder-icon { color: #6E5333; }
  .deliverable-heritage-records & .placeholder-icon { color: #2E7D57; }
  .deliverable-three-dimension-scenes & .placeholder-icon { color: var(--color-secondary-dark); }

  .result-badge {
    position: absolute;
    top: var(--spacing-md);
    left: var(--spacing-md);
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 600;
    color: white;
    backdrop-filter: blur(4px);

    &.type-database { background: rgba(139, 69, 19, 0.92); }
    &.type-platform { background: rgba(160, 82, 45, 0.92); }
    &.type-scene { background: rgba(110, 83, 51, 0.92); }
  }

  .image-overlay {
    position: absolute;
    inset: 0;
    background: rgba(93, 58, 26, 0.72);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-out);

    .overlay-btn {
      display: inline-block;
      padding: 10px 24px;
      background: var(--color-paper);
      color: var(--color-primary);
      border-radius: var(--radius-full);
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: clamp(18px, 2vw, 24px);
}

.result-title {
  margin-bottom: var(--space-2);
  font-family: var(--font-sub);
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.45;
  color: var(--color-primary-dark);
}

.result-desc {
  margin-bottom: var(--space-4);
  font-size: 14px;
  line-height: 1.75;
  color: var(--color-text-medium);
}

.result-meta {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-top: auto;

  .meta-tag {
    display: inline-block;
    padding: 3px 9px;
    background: rgba(212, 160, 23, 0.1);
    color: var(--color-secondary-dark);
    border-radius: var(--radius-sm);
    font-size: 12px;

    &.is-verified {
      background: rgba(46, 139, 87, 0.12);
      color: #2E7D57;
    }

    &.is-conditional {
      background: rgba(212, 160, 23, 0.16);
      color: #8A5A00;
    }

    &.is-unverified {
      background: rgba(126, 106, 85, 0.14);
      color: #6B5B4A;
    }
  }

  .go-tag {
    font-weight: 600;
    background: rgba(212, 160, 23, 0.18);
  }
}

.result-note {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px dashed var(--color-border-light);
  font-size: 12px;
  line-height: 1.7;
  color: var(--color-text-muted);

  .note-label {
    margin-right: 6px;
    color: var(--color-secondary-dark);
    font-weight: 600;
  }
}

// ============================================
// 建设目标
// ============================================

.outcomes-section {
  position: relative;
  overflow: hidden;
}

.outcomes-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px 520px at 82% 6%, rgba(212, 160, 23, 0.16), transparent 62%),
    radial-gradient(700px 520px at 4% 100%, rgba(212, 160, 23, 0.07), transparent 58%),
    var(--color-primary-dark);
}

.bg-pattern {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.outcomes-layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.22fr) minmax(0, 0.78fr);
  gap: clamp(36px, 5vw, 80px);

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-8);
  }
}

.goals-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid rgba(255, 248, 231, 0.18);

  .header-icon {
    font-size: 1.1rem;
    color: var(--color-secondary-light);
  }

  h3 {
    margin: 0;
    font-family: var(--font-sub);
    font-size: 1.15rem;
    color: var(--color-background);
  }
}

.goal-list {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    gap: var(--space-3);
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 248, 231, 0.14);
    color: rgba(255, 248, 231, 0.9);
    font-size: 15.5px;
    line-height: 1.8;
  }

  .goal-no {
    font-family: var(--font-en);
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    color: var(--color-secondary-light);
  }
}

.goals-aside {
  padding-left: clamp(24px, 3vw, 48px);
  border-left: 1px solid rgba(255, 248, 231, 0.18);

  h3 {
    margin: 0 0 var(--space-5);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid rgba(255, 248, 231, 0.18);
    font-family: var(--font-sub);
    font-size: 1.15rem;
    color: var(--color-background);
  }

  @media (max-width: 900px) {
    padding-top: var(--space-6);
    padding-left: 0;
    border-top: 1px solid rgba(255, 248, 231, 0.18);
    border-left: 0;
  }
}

.goal-links {
  display: flex;
  flex-direction: column;
}

.goal-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  min-height: 48px;
  padding: var(--space-3) 0;
  border-bottom: 1px solid rgba(255, 248, 231, 0.14);
  color: rgba(255, 248, 231, 0.86);
  font-size: 15px;
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);

  span {
    color: var(--color-secondary-light);
    transition: transform var(--duration-fast) var(--ease-out);
  }

  &:hover {
    color: #FFF8E7;
    border-color: var(--color-secondary-light);

    span {
      transform: translateX(4px);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary-light);
    outline-offset: 3px;
  }
}

.goal-note {
  margin-top: var(--space-6);
  color: rgba(255, 248, 231, 0.55);
  font-size: 12.5px;
  line-height: 1.8;
}

// ============================================
// 公共样式
// ============================================

// 编辑式章节标题：与 Home 同源的 eyebrow + 左对齐 H2
.section-head {
  max-width: 660px;
  margin-bottom: clamp(24px, 2.2vw, 32px);

  .eyebrow {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-ui);
    font-size: var(--text-label);
    letter-spacing: var(--tracking-wider);
    color: var(--color-primary);

    span {
      font-family: var(--font-en);
      color: var(--color-primary);
    }
  }

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

  &--light {
    .eyebrow,
    .eyebrow span {
      color: var(--color-secondary-light);
    }

    h2 {
      color: var(--color-background);
    }

    .section-desc {
      color: rgba(255, 248, 231, 0.82);
    }
  }
}

// ============================================
// 8A / 8B 新增：目标注释、对比式创新点、成果方向标记、未来展望状态
// ============================================

.card-note {
  margin-top: var(--space-4);
  font-size: var(--text-caption);
  line-height: 1.8;
  color: var(--color-text-muted);

  a {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 3px;

    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
      border-radius: var(--radius-sm);
    }
  }
}

.innovation-compare {
  max-width: 780px;
  margin: 0;
  display: grid;
  gap: 6px;

  div {
    display: grid;
    grid-template-columns: 84px minmax(0, 1fr);
    gap: var(--space-3);
    align-items: start;
  }

  dt {
    padding-top: 2px;
    font-size: var(--text-label);
    letter-spacing: var(--tracking-wide);
    color: var(--color-secondary-dark);
  }

  dd {
    margin: 0;
    font-size: var(--text-body);
    line-height: 1.8;
    color: var(--color-text-light);
  }

  @media (max-width: 640px) {
    div {
      grid-template-columns: minmax(0, 1fr);
      gap: 2px;
    }
  }
}

.direction-tag {
  background: transparent !important;
  border: 1px solid var(--color-border-light);
  color: var(--color-text-muted);
}

.goal-status {
  display: inline-flex;
  align-self: start;
  margin-left: auto;
  padding: 2px 9px;
  border-radius: var(--radius-full);
  font-size: 11px;
  letter-spacing: 0.04em;
  white-space: nowrap;

  &.is-ongoing {
    background: rgba(212, 160, 23, 0.16);
    color: var(--color-secondary-light);
  }

  &.is-planned {
    background: rgba(255, 248, 231, 0.12);
    color: rgba(255, 248, 231, 0.78);
  }
}

.result-go {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-size: 1rem;
}

// 8B：移动端成果卡改为紧凑行式，控制成果区高度
@media (max-width: 640px) {
  .result-card {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr) 16px;
    align-items: start;
    gap: 12px;
    padding: 10px 12px;
  }

  .card-image-wrapper {
    width: 52px;
    height: 52px;
    min-height: 0;
    border-radius: var(--radius-sm);

    .result-badge,
    .image-overlay {
      display: none;
    }

    .placeholder-icon {
      font-size: 1.35rem;
    }
  }

  .card-body {
    display: grid;
    gap: 4px;
    min-width: 0;
    padding: 0;
  }

  .result-title {
    font-size: 0.98rem;
    line-height: 1.4;
  }

  .result-desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.6;
  }

  .result-meta {
    margin-top: 2px;
    gap: 5px;
  }

  .result-note {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-top: 2px;
    font-size: 0.74rem;
    line-height: 1.55;
  }

  .result-go {
    display: block;
    color: var(--color-primary);
    font-size: 1rem;
  }
}

// 320 宽度：标签栏可横滑，用渐隐提示还有后续选项
@media (max-width: 480px) {
  .tabs-header {
    padding-right: 24px;
    -webkit-mask-image: linear-gradient(90deg, #000 0, #000 calc(100% - 28px), transparent 100%);
    mask-image: linear-gradient(90deg, #000 0, #000 calc(100% - 28px), transparent 100%);
  }
}

// 移动端：压缩对比式创新点与展望的行距，避免长页继续拉长
@media (max-width: 640px) {
  .innovation-compare {
    gap: 3px;

    dd {
      font-size: 0.92rem;
      line-height: 1.6;
    }
  }

  .goal-list li {
    font-size: 14.5px;
    line-height: 1.7;
  }
}

// 移动端：长页压缩（仅调整节奏与间距，不隐藏内容、不缩小正文字号到不可读）
@media (max-width: 768px) {
  .hero-grid {
    padding-top: 22px;
    padding-bottom: 22px;
  }

  .section-head {
    margin-bottom: var(--space-4);
  }

  .intro-point {
    padding: 10px 0;
  }

  .intro-text {
    line-height: 1.7;
  }

  .goal-status {
    font-size: 10px;
    padding: 1px 7px;
  }

  .status-card,
  .prep-card {
    padding: var(--space-3);
  }

  .research-list li {
    line-height: 1.6;
  }

  .tech-step {
    padding-top: 2px;
  }

  .goal-list li {
    padding: 4px 0;
  }

  .result-card {
    padding: 8px 12px;
  }

  .results-grid {
    gap: 8px;
  }

  .direction-tag,
  .innovation-tags {
    display: none;
  }

  .research-card {
    padding: var(--space-4);
  }

  .innovation-item {
    padding: 14px 0;
  }

  .tabs-content {
    padding: var(--space-4);
  }

  .result-note {
    font-size: 0.7rem;
    line-height: 1.5;
  }

  .hero-actions {
    flex-wrap: nowrap;

    .btn {
      flex: 1 1 0;
      min-height: 44px;
      padding-left: 8px;
      padding-right: 8px;
    }
  }
}
</style>