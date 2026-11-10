<template>
  <div class="project-page">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-background">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="container">
        <div class="hero-content" data-reveal-stagger>
          <div class="hero-badge">
            <Icon class="badge-icon" icon="gis:map-add" />
            <span class="badge-text">大学生创新创业项目</span>
          </div>
          <h1 class="hero-title">项目概况</h1>
          <p class="hero-subtitle">
            基于GIS与WebGIS的宁夏丝路非遗数字化保护、时空可视化与传播展示平台
          </p>
          <nav class="hero-tags" aria-label="本页目录">
            <a class="tag" href="#intro">项目简介</a>
            <a class="tag" href="#basis">立项依据</a>
            <a class="tag" href="#research">研究内容</a>
            <a class="tag" href="#tech">技术路线</a>
            <a class="tag" href="#innovation">创新点</a>
            <a class="tag" href="#results">项目成果</a>
            <a class="tag" href="#goals">建设目标</a>
          </nav>
        </div>
      </div>
      <div class="hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path fill="#FFF8E7" d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"/>
        </svg>
      </div>
    </div>

    <!-- 项目简介 -->
    <section id="intro" class="section intro-section">
      <div class="container">
        <div class="section-header" data-reveal>
          <div class="header-decoration">
            <span class="deco-line"></span>
            <Icon class="deco-icon" icon="gis:world-folder" />
            <span class="deco-line"></span>
          </div>
          <h2 class="section-title">项目简介</h2>
        </div>
        
        <div class="intro-wrapper">
          <div class="intro-main card-silk" data-reveal>
            <p class="intro-text">
              本项目以<span class="highlight">宁夏丝绸之路沿线非物质文化遗产</span>为研究对象，
              运用<span class="highlight">GIS空间分析技术</span>，系统搜集、整理宁夏丝路非遗资源，
              构建<span class="highlight">宁夏丝路非遗地理信息数据库</span>。通过WebGIS技术实现非遗资源的
              <span class="highlight">时空可视化展示</span>，探索"非遗保护+乡村振兴+文旅融合"的协同发展路径，
              为宁夏非遗的数字化保护、传承与传播提供新的技术手段和平台支撑。
            </p>
          </div>
          
          <div class="intro-points" data-reveal-stagger>
            <div class="point-card" v-for="(point, index) in introPoints" :key="index">
              <Icon class="point-icon" :icon="'gis:' + point.icon" />
              <div class="point-content">
                <h4>{{ point.title }}</h4>
                <p>{{ point.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 立项依据 -->
    <section id="basis" class="section basis-section">
      <div class="section-bg"></div>
      <div class="container">
        <div class="section-header" data-reveal>
          <h2 class="section-title">立项依据</h2>
          <p class="section-subtitle">研究背景 · 现状 · 工作基础</p>
        </div>
        
        <div class="basis-tabs" data-reveal data-reveal-delay="80">
          <div class="tabs-header">
            <button 
              v-for="tab in basisTabs" 
              :key="tab.key"
              class="tab-btn"
              :class="{ 'active': activeBasisTab === tab.key }"
              @click="activeBasisTab = tab.key"
            >
              <Icon class="tab-icon" :icon="'gis:' + tab.icon" />
              <span class="tab-label">{{ tab.label }}</span>
            </button>
          </div>
          
          <div class="tabs-content">
            <!-- 研究目的与意义 -->
            <div v-show="activeBasisTab === 'purpose'" class="tab-panel">
              <div class="panel-grid">
                <div class="panel-card">
                  <div class="card-header">
                    <Icon class="header-icon" icon="gis:location-arrow" />
                    <h3>研究目的</h3>
                  </div>
                  <ul class="card-list">
                    <li>
                      <span class="list-num">01</span>
                      <span>构建宁夏丝路非遗地理信息数据库，实现非遗资源的系统化、数字化管理</span>
                    </li>
                    <li>
                      <span class="list-num">02</span>
                      <span>运用GIS空间分析技术，揭示宁夏丝路非遗的空间分布特征与演变规律</span>
                    </li>
                    <li>
                      <span class="list-num">03</span>
                      <span>开发WebGIS动态展示平台，实现非遗资源的可视化传播与互动体验</span>
                    </li>
                    <li>
                      <span class="list-num">04</span>
                      <span>探索非遗保护与乡村振兴、文旅融合的协同发展路径</span>
                    </li>
                  </ul>
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
            <div v-show="activeBasisTab === 'status'" class="tab-panel">
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
            <div v-show="activeBasisTab === 'preparation'" class="tab-panel">
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
        <div class="section-header" data-reveal>
          <h2 class="section-title">研究内容</h2>
          <p class="section-subtitle">四大核心方向 · 系统性研究框架</p>
        </div>
        
        <div class="research-framework" data-reveal-stagger>
          <div class="research-card" v-for="(item, index) in researchContent" :key="index"
               :class="'research-' + item.type">
            <div class="research-header">
              <div class="research-num">{{ index + 1 }}</div>
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
        <div class="section-header" data-reveal>
          <h2 class="section-title">技术路线</h2>
          <p class="section-subtitle">资料整理 → 空间组织 → 地理处理 → 可视化 → 数字档案</p>
        </div>

        <ol class="tech-steps" data-reveal-stagger>
          <li v-for="(step, index) in techRoute" :key="step.title" class="tech-step">
            <span class="tech-step__no">{{ index + 1 }}</span>
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
        <div class="section-header" data-reveal>
          <h2 class="section-title">项目创新点</h2>
          <p class="section-subtitle">空间组织 · 地图联动 · 三维辅助</p>
        </div>
        
        <div class="innovation-showcase" data-reveal-stagger>
          <div class="innovation-card" v-for="(item, index) in innovations" :key="index">
            <div class="innovation-visual">
              <Icon class="visual-icon" :icon="'gis:' + item.icon" />
              <div class="visual-bg"></div>
            </div>
            <div class="innovation-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
              <div class="innovation-tags">
                <span v-for="tag in item.tags" :key="tag" class="tag-mini">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目成果 -->
    <section id="results" class="section results-section">
      <div class="container">
        <div class="section-header" data-reveal>
          <h2 class="section-title">项目成果</h2>
          <p class="section-subtitle">{{ deliverableCount }} 项已核实成果 · 软件、数据与场景资源均可在站内或数据文件中追溯</p>
        </div>

        <div class="results-grid" data-reveal-stagger>
          <component
            :is="item.route ? 'router-link' : 'div'"
            v-for="item in projectDeliverables"
            :key="item.id"
            :to="item.route || undefined"
            class="result-card card-silk"
            :class="{ 'is-static': !item.route }"
          >
            <div class="card-image-wrapper">
              <div class="result-placeholder" :class="'bg-' + item.category.toLowerCase()">
                <Icon class="placeholder-icon" :icon="iconForDeliverable(item.category)" />
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
                <span class="meta-tag" v-else>数据与资源</span>
              </div>

              <p v-if="item.verificationNote" class="result-note">
                <span class="note-label">核验说明</span>{{ item.verificationNote }}
              </p>
            </div>
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
        <div class="section-header light" data-reveal>
          <h2 class="section-title">建设目标</h2>
          <p class="section-subtitle">方向性目标 · 不代表已交付成果</p>
        </div>
        
        <div class="outcomes-grid" data-reveal-stagger>
          <div class="outcome-card card-white">
            <div class="card-header-white">
              <Icon class="header-icon" icon="gis:flag-finish" />
              <h3>后续建设方向</h3>
            </div>
            <ul class="goal-list">
              <li v-for="goal in goals" :key="goal">{{ goal }}</li>
            </ul>
          </div>
          
          <div class="outcome-card card-white">
            <div class="card-header-white">
              <Icon class="header-icon" icon="gis:network" />
              <h3>查看已交付成果</h3>
            </div>
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
              成果清单由统一数据层提供，仅收录可验证的软件、数据与场景资源。
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { projectDeliverables } from '@/data/project'

const activeBasisTab = ref('purpose')

// 项目成果：数据来自统一数据层
const deliverableCount = projectDeliverables.length
const categoryLabels = { SOFTWARE: '软件平台', DATA: '数据成果', ASSET: '场景资源' }
const categoryKeys = { SOFTWARE: 'platform', DATA: 'database', ASSET: 'scene' }
const categoryIcons = { SOFTWARE: 'gis:globe', DATA: 'gis:layers', ASSET: 'gis:cube-3d' }
const statusLabels = { VERIFIED: '已核验', CONDITIONAL: '有条件核验', NOT_VERIFIED: '未核验' }
const categoryLabel = (category) => categoryLabels[category] || category
const categoryKey = (category) => categoryKeys[category] || 'platform'
const iconForDeliverable = (category) => categoryIcons[category] || 'gis:folder-map'
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
  { title: 'WebGIS 可视化', desc: '基于 Leaflet 构建交互地图，支持筛选、时间轴回放、古道联动与点位详情查看。' },
  { title: '数字档案与三维展示', desc: '以图文档案承载项目信息，并在地图与大屏中提供三维地形、古道与实景三维场景的辅助展示。' }
])

const techStack = ['Vue 3 + Vite', 'Vue Router', 'Leaflet', 'ECharts', 'Three.js', 'GeoJSON', '3D 高斯泼溅（SuperSplat）']

// 创新点
const innovations = ref([
  {
    icon: 'map-stat',
    title: '非遗资源空间化组织',
    desc: '将非遗项目的类别、级别、地区与经纬度统一组织，并与丝路古道、黄河河道建立空间关联，使文化信息可以按地理关系检索。',
    tags: ['空间组织', '地理关联', '数据记录']
  },
  {
    icon: 'network',
    title: '地图与数字档案联动',
    desc: '地图选点、档案详情与 URL 状态双向同步，读者可以从空间位置直接进入项目档案，再回到地图继续浏览。',
    tags: ['地图联动', '数字档案', '深链']
  },
  {
    icon: 'cube-3d',
    title: '三维场景辅助展示',
    desc: '以三维地形大屏与实景高斯泼溅场景，补充平面地图难以表达的地貌与场景信息。',
    tags: ['三维地形', '实景场景', '辅助展示']
  }
])

// 建设目标（方向性，不代表已交付）
const goals = ref([
  '持续完善非遗项目记录的结构与信息完整度',
  '提升非遗空间分布的可视化与检索能力',
  '完善地图、数字档案与三维场景之间的联动',
  '补充可核验的数据来源与更新记录',
  '为研究、教学与公众传播提供稳定的信息入口'
])
</script>

<style lang="scss" scoped>
// 页内锚点：避开固定导航
.project-page section[id] {
  scroll-margin-top: 96px;
}

// ============================================
// 页面英雄区
// ============================================

.page-hero {
  position: relative;
  padding: var(--spacing-3xl) 0 var(--spacing-xl);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  
  .hero-pattern {
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
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
  margin-bottom: var(--spacing-xl);
  color: white;
  
  .badge-icon {
    display: inline-flex;
    width: 24px;
    height: 24px;
    background: var(--color-secondary);
    border-radius: 50%;
    font-size: 16px;
    font-weight: 600;
    color: white;
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
  margin: 0 auto var(--spacing-xl);
  line-height: 1.6;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
  
  .tag {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 20px;
    border-radius: var(--radius-full);
    color: white;
    font-size: 14px;
    text-decoration: none;
    transition: background-color 0.3s var(--ease-out), border-color 0.3s var(--ease-out);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
    }
  }
}

.hero-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  
  svg {
    width: 100%;
    height: 100%;
  }
}

// ============================================
// 项目简介区
// ============================================

.intro-section {
  background: var(--color-background);
}

.intro-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.intro-main {
  margin-bottom: var(--spacing-2xl);
  
  .intro-text {
    font-size: 1.15rem;
    line-height: 2;
    color: var(--color-text);
    text-align: center;
    
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
}

.intro-points {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.point-card {
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
  
  .point-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .point-content h4 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  .point-content p {
    color: var(--color-text-light);
    font-size: 0.95rem;
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
  max-width: 1000px;
  margin: 0 auto;
}

.tabs-header {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text);
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    border-color 0.3s var(--ease-out),
    background-color 0.3s var(--ease-out),
    color 0.3s var(--ease-out);

  &:hover {
    border-color: var(--color-secondary);
  }

  &.active {
    background: var(--color-secondary);
    border-color: var(--color-secondary);
    color: var(--color-gold-ink);
  }
  
  .tab-icon {
    font-size: 1.2rem;
  }
}

.panel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.panel-card {
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  transition:
    transform 0.3s var(--ease-out),
    box-shadow 0.3s var(--ease-out),
    border-color 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-secondary);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  
  .header-icon {
    font-size: 1.5rem;
  }
  
  h3 {
    color: var(--color-primary);
    margin: 0;
  }
}

.card-list {
  list-style: none;
  padding: 0;
  
  li {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
    
    .list-num {
      display: inline-flex;
      width: 28px;
      height: 28px;
      background: var(--color-secondary);
      color: white;
      border-radius: 50%;
      font-size: 14px;
      font-weight: 600;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
  }
}

.meaning-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.meaning-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(212, 160, 23, 0.05);
  border-radius: var(--radius-md);
  
  .meaning-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  .meaning-content h4 {
    color: var(--color-primary);
    margin-bottom: 4px;
  }
  
  .meaning-content p {
    color: var(--color-text-light);
    font-size: 0.9rem;
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
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  
  .status-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    
    .status-flag {
      font-size: 1.5rem;
    }
    
    h3 {
      color: var(--color-primary);
      margin: 0;
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
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  transition:
    transform 0.3s var(--ease-out),
    box-shadow 0.3s var(--ease-out),
    border-color 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-secondary);

    // 图标底衬放大提亮，与创新点卡的 visual-bg 动效一致
    .prep-icon-bg {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.2;
    }
  }

  .prep-icon-wrapper {
    position: relative;
    margin-bottom: var(--spacing-lg);

    .prep-icon {
      font-size: 2.5rem;
      position: relative;
      z-index: 1;
    }

    .prep-icon-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, var(--color-secondary), transparent);
      border-radius: 50%;
      opacity: 0.1;
      transition: transform 0.3s var(--ease-out), opacity 0.3s var(--ease-out);
    }
  }
  
  h4 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    color: var(--color-text-light);
    font-size: 0.9rem;
    margin-bottom: var(--spacing-md);
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
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

.research-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
  }
  
  &.research-database {
    border-top: 4px solid var(--color-secondary);
  }
  
  &.research-platform {
    border-top: 4px solid var(--color-accent);
  }
  
  &.research-strategy {
    border-top: 4px solid var(--color-primary);
  }

  &.research-screen {
    border-top: 4px solid var(--color-secondary-dark);
  }
}

.research-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  
  .research-num {
    display: inline-flex;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    border-radius: 50%;
    font-size: 1.25rem;
    font-weight: 700;
    align-items: center;
    justify-content: center;
  }
  
  h3 {
    color: var(--color-primary);
    margin: 0;
  }
}

.research-list {
  list-style: none;
  padding: 0;
  
  li {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-light);
    
    .task-dot {
      width: 8px;
      height: 8px;
      background: var(--color-secondary);
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 6px;
    }
  }
}

.research-footer {
  margin-top: var(--spacing-lg);
  
  .footer-tag {
    display: inline-block;
    background: rgba(212, 160, 23, 0.1);
    color: var(--color-secondary-dark);
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 500;
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

.tech-steps {
  list-style: none;
  max-width: 980px;
  margin: 0 auto;
  padding: 0;
  display: grid;
  gap: var(--spacing-md);

  @media (min-width: 993px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.tech-step {
  position: relative;
  padding: var(--spacing-lg);
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-top: 3px solid var(--color-secondary);
  border-radius: var(--radius-lg);
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  &__no {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    margin-bottom: var(--spacing-sm);
    border-radius: 50%;
    background: var(--color-secondary);
    color: white;
    font-size: 0.85rem;
    font-weight: 700;
  }

  &__body h3 {
    color: var(--color-primary);
    font-size: 1rem;
    margin-bottom: var(--spacing-sm);
  }

  &__body p {
    color: var(--color-text-light);
    font-size: 0.85rem;
    line-height: 1.7;
  }
}

.tech-stack {
  max-width: 980px;
  margin: var(--spacing-xl) auto 0;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);

  &__label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-size: var(--text-label);
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    list-style: none;
    padding: 0;

    li {
      padding: 4px 12px;
      background: rgba(212, 160, 23, 0.1);
      color: var(--color-secondary-dark);
      border-radius: var(--radius-full);
      font-size: 12px;
    }
  }
}

.tech-note {
  margin-top: var(--spacing-md);
  color: var(--color-text-muted);
  font-size: 0.85rem;
  line-height: 1.7;
}

// ============================================
// 创新点区
// ============================================

.innovation-section {
  background: var(--color-background);
}

.innovation-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

.innovation-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  text-align: center;
  transition:
    border-color 0.3s var(--ease-out),
    box-shadow 0.3s var(--ease-out),
    transform 0.3s var(--ease-out);

  &:hover {
    border-color: var(--color-secondary);
    box-shadow: var(--shadow-lg);
    transform: translateY(-6px);
    
    .visual-bg {
      transform: scale(1.2);
      opacity: 0.2;
    }
  }
}

.innovation-visual {
  position: relative;
  margin-bottom: var(--spacing-lg);
  
  .visual-icon {
    font-size: 3rem;
    position: relative;
    z-index: 1;
  }
  
  .visual-bg {
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
}

.innovation-content {
  h3 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: var(--color-text-light);
    line-height: 1.7;
    margin-bottom: var(--spacing-md);
  }
}

.innovation-tags {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.tag-mini {
  background: rgba(212, 160, 23, 0.1);
  color: var(--color-secondary-dark);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
}

// ============================================
// 项目成果
// ============================================

.results-section {
  background: var(--color-background);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.result-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);

    .image-overlay {
      opacity: 1;
    }
  }

  &.is-static {
    cursor: default;
  }
}

.card-image-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;

  .result-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &.bg-software { background: #E8DCC8; }
    &.bg-data { background: #F5F0E6; }
    &.bg-asset { background: #EADDC8; }
  }

  .placeholder-icon {
    font-size: 4rem;
    opacity: 0.5;
  }

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
    background: rgba(139, 69, 19, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s var(--ease-out);

    .overlay-btn {
      display: inline-block;
      padding: 10px 24px;
      background: white;
      color: var(--color-primary);
      border-radius: var(--radius-full);
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.card-body {
  padding: var(--spacing-xl);
}

.result-title {
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.result-desc {
  font-size: 14px;
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: var(--spacing-md);
}

.result-meta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;

  .meta-tag {
    display: inline-block;
    padding: 4px 10px;
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
  background: var(--gradient-primary);
}

.bg-pattern {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.section-header.light {
  .section-title {
    color: white;
  }
  
  .section-subtitle {
    color: rgba(255, 255, 255, 0.8);
  }
}

.outcomes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  max-width: 900px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.outcome-card {
  background: var(--color-paper);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  transition:
    transform 0.3s var(--ease-out),
    box-shadow 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
  }
}

.card-header-white {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  
  .header-icon {
    font-size: 1.5rem;
  }
  
  h3 {
    color: var(--color-primary);
    margin: 0;
  }
}

.goal-list {
  list-style: none;
  padding: 0;

  li {
    position: relative;
    padding-left: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
    line-height: 1.7;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 9px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-secondary);
    }
  }
}

.goal-links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.goal-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(212, 160, 23, 0.06);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--color-text);
  text-decoration: none;
  transition:
    background-color 0.3s var(--ease-out),
    border-color 0.3s var(--ease-out),
    transform 0.3s var(--ease-out);

  &:hover {
    background: rgba(212, 160, 23, 0.14);
    border-color: var(--color-secondary);
    transform: translateX(4px);
    color: var(--color-primary);
  }

  span {
    color: var(--color-primary);
  }
}

.goal-note {
  margin-top: var(--spacing-lg);
  color: var(--color-text-muted);
  font-size: 0.8rem;
  line-height: 1.7;
}

// ============================================
// 公共样式
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
</style>