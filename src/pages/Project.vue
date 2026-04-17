<template>
  <div class="project-page">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-background">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">丝</span>
            <span class="badge-text">大学生创新创业项目</span>
          </div>
          <h1 class="hero-title">项目概况</h1>
          <p class="hero-subtitle">
            基于GIS与WebGIS的宁夏丝路非遗数字化保护、时空可视化与传播展示平台
          </p>
          <div class="hero-tags">
            <span class="tag">GIS技术应用</span>
            <span class="tag">非遗数字化</span>
            <span class="tag">数字人文</span>
          </div>
        </div>
      </div>
      <div class="hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path fill="#FFF8E7" d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"/>
        </svg>
      </div>
    </div>

    <!-- 项目简介 -->
    <section class="section intro-section">
      <div class="container">
        <div class="section-header">
          <div class="header-decoration">
            <span class="deco-line"></span>
            <span class="deco-icon">简</span>
            <span class="deco-line"></span>
          </div>
          <h2 class="section-title">项目简介</h2>
        </div>
        
        <div class="intro-wrapper">
          <div class="intro-main card-silk">
            <p class="intro-text">
              本项目以<span class="highlight">宁夏丝绸之路沿线非物质文化遗产</span>为研究对象，
              运用<span class="highlight">GIS空间分析技术</span>，系统搜集、整理宁夏丝路非遗资源，
              构建<span class="highlight">宁夏丝路非遗地理信息数据库</span>。通过WebGIS技术实现非遗资源的
              <span class="highlight">时空可视化展示</span>，探索"非遗保护+乡村振兴+文旅融合"的协同发展路径，
              为宁夏非遗的数字化保护、传承与传播提供新的技术手段和平台支撑。
            </p>
          </div>
          
          <div class="intro-points">
            <div class="point-card" v-for="(point, index) in introPoints" :key="index">
              <div class="point-icon">{{ point.icon }}</div>
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
    <section class="section basis-section">
      <div class="section-bg"></div>
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">立项依据</h2>
          <p class="section-subtitle">深入调研 · 科学规划 · 切实可行</p>
        </div>
        
        <div class="basis-tabs">
          <div class="tabs-header">
            <button 
              v-for="tab in basisTabs" 
              :key="tab.key"
              class="tab-btn"
              :class="{ 'active': activeBasisTab === tab.key }"
              @click="activeBasisTab = tab.key"
            >
              <span class="tab-icon">{{ tab.icon }}</span>
              <span class="tab-label">{{ tab.label }}</span>
            </button>
          </div>
          
          <div class="tabs-content">
            <!-- 研究目的与意义 -->
            <div v-show="activeBasisTab === 'purpose'" class="tab-panel">
              <div class="panel-grid">
                <div class="panel-card">
                  <div class="card-header">
                    <span class="header-icon">🎯</span>
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
                    <span class="header-icon">💡</span>
                    <h3>研究意义</h3>
                  </div>
                  <div class="meaning-grid">
                    <div class="meaning-item">
                      <div class="meaning-icon">📚</div>
                      <div class="meaning-content">
                        <h4>学术意义</h4>
                        <p>拓展GIS技术在文化遗产保护领域的应用，丰富数字人文研究方法</p>
                      </div>
                    </div>
                    <div class="meaning-item">
                      <div class="meaning-icon">🛠️</div>
                      <div class="meaning-content">
                        <h4>实践意义</h4>
                        <p>为宁夏非遗保护提供技术平台，服务地方文化建设与经济发展</p>
                      </div>
                    </div>
                    <div class="meaning-item">
                      <div class="meaning-icon">🌐</div>
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
                    <span class="status-flag">🌍</span>
                    <h3>国外研究现状</h3>
                  </div>
                  <p>
                    欧美等发达国家较早将GIS技术应用于文化遗产保护，如联合国教科文组织的
                    <strong>世界遗产GIS数据库</strong>、英国的<strong>遗产地图系统</strong>等。
                    数字人文领域也积极探索GIS与历史文化研究的结合，形成了较为成熟的理论与方法体系。
                  </p>
                  <div class="status-examples">
                    <span class="example-tag">UNESCO Heritage GIS</span>
                    <span class="example-tag">英国遗产地图</span>
                    <span class="example-tag">欧洲数字人文</span>
                  </div>
                </div>
                
                <div class="status-card">
                  <div class="status-header">
                    <span class="status-flag">🇨🇳</span>
                    <h3>国内研究现状</h3>
                  </div>
                  <p>
                    近年来，我国越来越多的学者开始运用GIS技术进行文化遗产研究，在非遗数字化、
                    文化资源空间分布等方面取得了一定成果。但针对<strong>宁夏丝路非遗</strong>的
                    系统性GIS研究仍有不足，本项目旨在填补这一空白。
                  </p>
                  <div class="status-examples">
                    <span class="example-tag">非遗数字化</span>
                    <span class="example-tag">文化资源GIS</span>
                    <span class="example-tag">文化遗产图谱</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 项目前期准备 -->
            <div v-show="activeBasisTab === 'preparation'" class="tab-panel">
              <div class="prep-grid">
                <div class="prep-card" v-for="(prep, index) in preparations" :key="index">
                  <div class="prep-icon-wrapper">
                    <span class="prep-icon">{{ prep.icon }}</span>
                    <div class="prep-icon-bg"></div>
                  </div>
                  <h4>{{ prep.title }}</h4>
                  <p>{{ prep.desc }}</p>
                  <div class="prep-stat">
                    <span class="stat-num">{{ prep.stat }}</span>
                    <span class="stat-label">{{ prep.statLabel }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 研究内容 -->
    <section class="section research-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">研究内容</h2>
          <p class="section-subtitle">三大核心方向 · 系统性研究框架</p>
        </div>
        
        <div class="research-framework">
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

    <!-- 技术方案 -->
    <section class="section timeline-section">
      <div class="section-bg-alt"></div>
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">技术方案</h2>
          <p class="section-subtitle">四阶段推进 · 12个月周期</p>
        </div>
        
        <div class="phase-timeline">
          <div class="timeline-track">
            <div class="track-progress"></div>
          </div>
          
          <div class="timeline-cards">
            <div class="phase-card" v-for="(phase, index) in phases" :key="index">
              <div class="phase-marker">
                <span class="marker-num">{{ index + 1 }}</span>
                <div class="marker-ring"></div>
              </div>
              <div class="phase-content card">
                <div class="phase-badge">{{ phase.period }}</div>
                <h3>{{ phase.title }}</h3>
                <ul class="phase-list">
                  <li v-for="task in phase.tasks" :key="task">{{ task }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 创新点 -->
    <section class="section innovation-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">项目创新点</h2>
          <p class="section-subtitle">跨学科融合 · 技术创新 · 全链条路径</p>
        </div>
        
        <div class="innovation-showcase">
          <div class="innovation-card" v-for="(item, index) in innovations" :key="index">
            <div class="innovation-visual">
              <span class="visual-icon">{{ item.icon }}</span>
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

    <!-- 预期目标与成果 -->
    <section class="section outcomes-section">
      <div class="outcomes-bg">
        <div class="bg-pattern"></div>
      </div>
      <div class="container">
        <div class="section-header light">
          <h2 class="section-title">预期目标与成果</h2>
          <p class="section-subtitle">务实创新 · 知行合一</p>
        </div>
        
        <div class="outcomes-grid">
          <div class="outcome-card card-white">
            <div class="card-header-white">
              <span class="header-icon">🎯</span>
              <h3>预期目标</h3>
            </div>
            <ul class="outcome-list">
              <li>
                <span class="check-icon">✅</span>
                完成宁夏丝路非遗地理数据库建设，收录非遗项目200项以上
              </li>
              <li>
                <span class="check-icon">✅</span>
                开发完成WebGIS展示平台，实现时空可视化等核心功能
              </li>
              <li>
                <span class="check-icon">✅</span>
                发表学术论文1-2篇，形成研究报告1份
              </li>
              <li>
                <span class="check-icon">✅</span>
                开发研学课程3-5门，设计文创产品系列
              </li>
              <li>
                <span class="check-icon">✅</span>
                为3-5项非遗项目提供数字化保护方案
              </li>
            </ul>
          </div>
          
          <div class="outcome-card card-white">
            <div class="card-header-white">
              <span class="header-icon">🏆</span>
              <h3>成果形式</h3>
            </div>
            <div class="成果-items">
              <div class="成果-item" v-for="(item, index) in outcomes" :key="index">
                <span class="item-icon">{{ item.icon }}</span>
                <span class="item-text">{{ item.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeBasisTab = ref('purpose')

// 项目简介要点
const introPoints = ref([
  { icon: '📊', title: 'GIS数据库构建', desc: '系统搜集整理宁夏丝路非遗资源，构建地理信息数据库' },
  { icon: '🗺️', title: '时空可视化展示', desc: '运用WebGIS技术，实现非遗资源的时空分布展示' },
  { icon: '🔗', title: '保护路径探索', desc: '探索非遗保护与乡村振兴、文旅融合的协同路径' }
])

// 立项依据标签页
const basisTabs = ref([
  { key: 'purpose', label: '研究目的与意义', icon: '🎯' },
  { key: 'status', label: '国内外研究现状', icon: '📚' },
  { key: 'preparation', label: '项目前期准备', icon: '📋' }
])

// 前期准备
const preparations = ref([
  { icon: '📚', title: '文献资料', desc: '已搜集相关文献100余篇，包括宁夏地方志、非遗保护报告、GIS应用案例等', stat: '100+', statLabel: '篇文献' },
  { icon: '🗺️', title: '数据基础', desc: '已初步整理宁夏非遗名录200余项，获取宁夏基础地理数据', stat: '200+', statLabel: '项非遗' },
  { icon: '💻', title: '技术储备', desc: '团队成员已掌握GIS、Web开发、数据可视化等相关技术', stat: '5', statLabel: '项技术' },
  { icon: '👥', title: '团队构成', desc: '由地理信息、计算机、历史文化等多学科背景成员组成', stat: '跨学科', statLabel: '多领域' }
])

// 研究内容
const researchContent = ref([
  {
    title: 'GIS数据库构建与空间分析',
    type: 'database',
    typeLabel: '数据层',
    tasks: ['宁夏丝路非遗资源普查与整理', '非遗地理信息数据库设计与构建', '非遗空间分布特征分析', '丝路古道与非遗关联性研究']
  },
  {
    title: 'WebGIS动态展示平台开发',
    type: 'platform',
    typeLabel: '技术层',
    tasks: ['WebGIS地图功能实现', '时空可视化展示模块', '互动式用户界面设计', '响应式网站开发']
  },
  {
    title: '非遗保护路径优化与乡村振兴协同',
    type: 'strategy',
    typeLabel: '应用层',
    tasks: ['非遗保护现状评估', '分级分类保护策略研究', '非遗+文旅融合模式探索', '乡村振兴协同路径分析']
  }
])

// 研究阶段
const phases = ref([
  {
    title: '调研建档与数据筹备',
    period: '第1-3个月',
    tasks: ['文献资料搜集与整理', '非遗项目田野调查', '地理数据获取与处理', 'GIS数据库设计', '数据录入与质量控制']
  },
  {
    title: 'GIS平台与网页开发',
    period: '第4-6个月',
    tasks: ['WebGIS地图功能开发', '前端页面设计与实现', '后端接口开发', '时空可视化模块', '系统测试与优化']
  },
  {
    title: '内容研发与品牌推广',
    period: '第7-9个月',
    tasks: ['研学课程开发', '文创产品设计', '研学手册编写', '品牌策划与设计', '宣传推广活动']
  },
  {
    title: '落地运营与模式优化',
    period: '第10-12个月',
    tasks: ['平台正式上线', '用户反馈收集', '合作单位对接', '运营模式总结', '项目验收与推广']
  }
])

// 创新点
const innovations = ref([
  {
    icon: '🔬',
    title: '跨学科融合创新',
    desc: '将GIS技术与历史文化研究、非遗保护深度融合，形成数字人文新范式',
    tags: ['GIS', '历史', '非遗', '数字人文']
  },
  {
    icon: '⏳',
    title: '时空可视化技术',
    desc: '地图与时间轴联动，直观呈现非遗的空间分布格局与历史演变过程',
    tags: ['可视化', '时空分析', 'WebGIS']
  },
  {
    icon: '🔗',
    title: '全链条保护路径',
    desc: '构建"保护—展示—教育—文创—传播"五位一体的非遗传承体系',
    tags: ['全链条', '保护', '传播']
  }
])

// 成果形式
const outcomes = ref([
  { icon: '📊', text: '宁夏丝路非遗地理数据库' },
  { icon: '🌐', text: 'WebGIS动态展示平台网站' },
  { icon: '📄', text: '学术论文与研究报告' },
  { icon: '📖', text: '宁夏丝路非遗研学手册' },
  { icon: '📋', text: '数字化保护白皮书' },
  { icon: '🎁', text: '非遗主题文创产品系列' }
])
</script>

<style lang="scss" scoped>
// ============================================
// 页面英雄区
// ============================================

.page-hero {
  position: relative;
  padding: var(--spacing-4xl) 0 var(--spacing-2xl);
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
    background: linear-gradient(135deg, #5D3A1A 0%, #8B4513 40%, #A0522D 100%);
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
    font-size: 14px;
    font-weight: 600;
    color: white;
    align-items: center;
    justify-content: center;
  }
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  color: white;
  letter-spacing: 4px;
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
  gap: var(--spacing-md);
  justify-content: center;
  
  .tag {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 20px;
    border-radius: var(--radius-full);
    color: white;
    font-size: 14px;
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
  transition: all 0.3s ease;
  
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
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-secondary);
  }
  
  &.active {
    background: var(--color-secondary);
    border-color: var(--color-secondary);
    color: white;
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
  
  .prep-stat {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    
    .stat-num {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-secondary);
    }
    
    .stat-label {
      color: var(--color-text-muted);
      font-size: 0.85rem;
    }
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
  grid-template-columns: repeat(3, 1fr);
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
  transition: all 0.3s ease;
  
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
// 技术方案时间线
// ============================================

.timeline-section {
  position: relative;
  background: var(--color-surface);
}

.section-bg-alt {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(45deg, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
    linear-gradient(-45deg, rgba(212, 160, 23, 0.03) 0%, transparent 50%);
}

.phase-timeline {
  max-width: 900px;
  margin: 0 auto;
}

.timeline-track {
  position: relative;
  height: 6px;
  background: var(--color-sand);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-2xl);
  
  .track-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 25%;
    height: 100%;
    background: linear-gradient(90deg, var(--color-secondary), var(--color-accent));
    border-radius: var(--radius-full);
  }
}

.timeline-cards {
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

.phase-card {
  position: relative;
  
  .phase-marker {
    position: relative;
    width: 48px;
    height: 48px;
    margin: 0 auto var(--spacing-md);
    
    .marker-num {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      width: 32px;
      height: 32px;
      background: var(--color-secondary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    
    .marker-ring {
      position: absolute;
      inset: 0;
      border: 2px solid rgba(212, 160, 23, 0.2);
      border-radius: 50%;
    }
  }
}

.phase-content {
  background: var(--color-background);
  text-align: center;
  
  .phase-badge {
    display: inline-block;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 12px;
    margin-bottom: var(--spacing-md);
  }
  
  h3 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
    font-size: 1rem;
  }
}

.phase-list {
  list-style: none;
  padding: 0;
  text-align: left;
  
  li {
    position: relative;
    padding-left: var(--spacing-md);
    margin-bottom: 4px;
    color: var(--color-text-light);
    font-size: 0.85rem;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--color-secondary);
    }
  }
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
  transition: all 0.3s ease;
  
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
    transition: all 0.3s ease;
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
// 预期目标与成果
// ============================================

.outcomes-section {
  position: relative;
  overflow: hidden;
}

.outcomes-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #5D3A1A, #8B4513, #A0522D);
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

.outcome-list {
  list-style: none;
  padding: 0;
  
  li {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
    
    .check-icon {
      color: var(--color-success);
      flex-shrink: 0;
    }
  }
}

.成果-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.成果-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(212, 160, 23, 0.05);
  border-radius: var(--radius-md);
  
  .item-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  .item-text {
    color: var(--color-text);
  }
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