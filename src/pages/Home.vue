<template>
  <div class="home-page">
    <!-- ==================== Hero 区域 ==================== -->
    <section class="hero-section">
      <!-- 动态背景层 -->
      <div class="hero-background">
        <div class="hero-gradient"></div>
        <div class="hero-pattern"></div>
        <div class="hero-silk-lines"></div>
        <div class="hero-sand-dunes"></div>
      </div>
      
      <div class="container">
        <div class="hero-content">
          <!-- 装饰性徽章 -->
          <div class="hero-badge animate-fade-in delay-1">
            <span class="badge-icon">丝</span>
            <span class="badge-text">宁夏 · 丝绸之路</span>
          </div>
          
          <!-- 主标题 -->
          <h1 class="hero-title animate-fade-in delay-2">
            <span class="title-main">宁夏丝路非遗地理志</span>
            <span class="title-sub">Silk Road Heritage GIS Platform</span>
          </h1>
          
          <!-- 副标题 -->
          <p class="hero-subtitle animate-fade-in delay-3">
            让丝路非遗在数字地图上
            <span class="highlight">"看得见、查得到、讲得清、传得开"</span>
          </p>
          
          <!-- 行动按钮 -->
          <div class="hero-buttons animate-fade-in delay-4">
            <router-link to="/map" class="btn btn-primary btn-large">
              <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              进入GIS地图
            </router-link>
            <router-link to="/project" class="btn btn-secondary btn-large">
              <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
              查看项目概况
            </router-link>
          </div>
          
          <!-- 快捷导航 -->
          <div class="hero-nav animate-fade-in delay-5">
            <router-link to="/archive" class="nav-link">
              <span class="nav-dot"></span>
              数字档案
            </router-link>
            <router-link to="/study" class="nav-link">
              <span class="nav-dot"></span>
              研学课程
            </router-link>
            <router-link to="/creative" class="nav-link">
              <span class="nav-dot"></span>
              文创展示
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- 波浪装饰 -->
      <div class="hero-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path class="wave-path wave-1" fill="#FFF8E7" d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,120 L0,120 Z"/>
          <path class="wave-path wave-2" fill="#F5F0E6" d="M0,80 C180,40 360,100 540,60 C720,20 900,80 1080,40 C1260,60 1380,100 1440,80 L1440,120 L0,120 Z"/>
        </svg>
      </div>
      
      <!-- 黄河流动线条 -->
      <div class="river-flow">
        <svg class="river-svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path class="river-path" stroke="#D4A017" stroke-width="2" fill="none" opacity="0.3"
            d="M0,100 Q200,80 400,100 T800,90 T1200,110 T1440,100"/>
        </svg>
      </div>
    </section>

    <!-- ==================== 项目简介 ==================== -->
    <section class="section intro-section texture-paper">
      <div class="container">
        <div class="section-header">
          <div class="header-decoration">
            <span class="deco-line"></span>
            <span class="deco-icon">古</span>
            <span class="deco-line"></span>
          </div>
          <h2 class="section-title">项目简介</h2>
          <p class="section-subtitle">数字化保护 · 时空可视化 · 文化传承</p>
        </div>
        
        <div class="intro-content">
          <div class="intro-card card-silk">
            <div class="intro-text">
              <p class="intro-paragraph">
                本项目以<span class="highlight-text">GIS技术</span>为核心，系统搜集宁夏境内丝路相关非遗资源，
                构建非遗地理数据库，通过<span class="highlight-text">空间分析</span>和
                <span class="highlight-text">WebGIS可视化</span>展示非遗分布格局、传播脉络和历史演变，
                并探索<span class="highlight-text">"非遗保护+乡村振兴+文旅融合"</span>的协同路径。
              </p>
            </div>
            
            <div class="intro-tags">
              <span class="tag tag-gold">GIS数据库</span>
              <span class="tag tag-gold">时空可视化</span>
              <span class="tag tag-gold">保护路径研究</span>
              <span class="tag tag-green">乡村振兴</span>
              <span class="tag tag-green">文旅融合</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 数据概览 ==================== -->
    <section class="section stats-section">
      <div class="stats-background">
        <div class="stats-pattern"></div>
      </div>
      <div class="container">
        <div class="stats-header">
          <h2 class="stats-title">数据概览</h2>
          <p class="stats-subtitle">宁夏丝路非遗数字化保护成果</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card" v-for="(stat, index) in stats" :key="index"
               :class="'stat-' + stat.type">
            <div class="stat-icon">
              <component :is="stat.iconComponent" />
            </div>
            <div class="stat-number" :data-value="stat.value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-bar" :style="{ width: stat.percent + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 核心功能 ==================== -->
    <section class="section features-section texture-silk">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">核心功能</h2>
          <p class="section-subtitle">全方位非遗数字化保护平台</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index"
               :style="{ animationDelay: (index * 0.1) + 's' }">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">{{ feature.icon }}</div>
              <div class="feature-icon-bg"></div>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
            <router-link :to="feature.link" class="feature-link">
              查看详情
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 创新点展示 ==================== -->
    <section class="section innovations-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">项目创新点</h2>
          <p class="section-subtitle">跨学科融合 · 技术创新 · 全链条路径</p>
        </div>
        
        <div class="innovations-container">
          <div class="innovation-card" v-for="(item, index) in innovations" :key="index">
            <div class="innovation-number">{{ index + 1 }}</div>
            <div class="innovation-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div class="innovation-tags">
                <span v-for="tag in item.tags" :key="tag" class="mini-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 研究进度时间线 ==================== -->
    <section class="section timeline-section texture-paper">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">研究进度</h2>
          <p class="section-subtitle">四阶段推进计划</p>
        </div>
        
        <div class="timeline-container">
          <div class="timeline-track">
            <div class="timeline-progress" :style="{ width: timelineProgress + '%' }"></div>
          </div>
          
          <div class="timeline-items">
            <div class="timeline-item" v-for="(item, index) in timeline" :key="index"
                 :class="{ 'item-active': index <= currentPhase }">
              <div class="timeline-marker">
                <div class="marker-dot"></div>
                <div class="marker-ring"></div>
              </div>
              <div class="timeline-card">
                <div class="card-phase">第{{ item.phase }}阶段</div>
                <div class="card-period">{{ item.period }}</div>
                <h4 class="card-title">{{ item.title }}</h4>
                <ul class="card-list">
                  <li v-for="task in item.tasks" :key="task">{{ task }}</li>
                </ul>
                <div class="card-status" :class="'status-' + item.status">
                  {{ item.statusText }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 地图预览 ==================== -->
    <section class="section map-preview-section">
      <div class="container">
        <div class="map-preview-wrapper card-silk">
          <div class="map-preview-info">
            <div class="info-badge">GIS平台</div>
            <h2>宁夏丝路非遗GIS地图</h2>
            <p class="info-desc">
              交互式地图展示宁夏境内非遗点位分布，支持图层切换、时间轴联动、点位详情查看，
              呈现丝路非遗的时空分布格局与传播脉络。
            </p>
            <div class="info-features">
              <div class="info-feature">
                <span class="feature-icon-mini">📍</span>
                <span>非遗点位标注</span>
              </div>
              <div class="info-feature">
                <span class="feature-icon-mini">🛤️</span>
                <span>丝路古道线路</span>
              </div>
              <div class="info-feature">
                <span class="feature-icon-mini">📊</span>
                <span>数据统计分析</span>
              </div>
            </div>
            <router-link to="/map" class="btn btn-primary">
              进入地图探索
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </router-link>
          </div>
          
          <div class="map-preview-visual">
            <div class="visual-container">
              <!-- 模拟地图 -->
              <div class="mock-map">
                <div class="map-base">
                  <!-- 宁夏轮廓 -->
                  <svg class="ningxia-outline" viewBox="0 0 200 300">
                    <path class="outline-path" stroke="#8B4513" stroke-width="2" fill="#F5F0E6"
                      d="M50,50 L150,50 L180,100 L150,200 L100,250 L50,200 L30,100 Z"/>
                  </svg>
                  <!-- 非遗点位 -->
                  <div class="heritage-point" style="top: 30%; left: 60%">
                    <span class="point-pulse"></span>
                    <span class="point-marker">📍</span>
                  </div>
                  <div class="heritage-point" style="top: 50%; left: 40%">
                    <span class="point-pulse"></span>
                    <span class="point-marker">📍</span>
                  </div>
                  <div class="heritage-point" style="top: 70%; left: 55%">
                    <span class="point-pulse"></span>
                    <span class="point-marker">📍</span>
                  </div>
                  <!-- 丝路线路 -->
                  <div class="silk-route">
                    <svg viewBox="0 0 200 300">
                      <path class="route-line" stroke="#D4A017" stroke-width="3" fill="none"
                        d="M80,50 Q100,150 120,250" stroke-dasharray="8,4"/>
                    </svg>
                  </div>
                </div>
                <div class="map-label">宁夏回族自治区</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 项目成果 ==================== -->
    <section class="section results-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">项目成果</h2>
          <p class="section-subtitle">数字化保护 · 研学教育 · 文创开发</p>
        </div>
        
        <div class="results-grid">
          <div class="result-card" v-for="(result, index) in results" :key="index"
               :class="'result-' + result.type">
            <div class="result-image">
              <div class="image-placeholder">
                <span class="placeholder-icon">{{ result.icon }}</span>
              </div>
            </div>
            <div class="result-content">
              <span class="result-type-tag">{{ result.typeLabel }}</span>
              <h3>{{ result.title }}</h3>
              <p>{{ result.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== CTA区域 ==================== -->
    <section class="section cta-section">
      <div class="cta-background">
        <div class="cta-pattern"></div>
      </div>
      <div class="container">
        <div class="cta-content">
          <h2>探索丝路非遗，传承文化记忆</h2>
          <p>加入我们，共同守护宁夏丝路非遗的文化瑰宝</p>
          <div class="cta-buttons">
            <router-link to="/archive" class="btn btn-primary btn-large">
              开始探索
            </router-link>
            <router-link to="/about" class="btn btn-ghost btn-large">
              了解更多
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 统计数据
const stats = ref([
  { value: '20+', label: '已建档非遗项目', type: 'gold', percent: 80 },
  { value: '5', label: '覆盖地市', type: 'gold', percent: 100 },
  { value: '6', label: '遗产类别', type: 'green', percent: 60 },
  { value: '3', label: '研学路线', type: 'green', percent: 40 },
  { value: '12', label: '文创产品', type: 'accent', percent: 50 },
  { value: '15+', label: '传承人故事', type: 'accent', percent: 70 }
])

// 核心功能
const features = ref([
  { 
    icon: '🗺️', 
    title: 'GIS地图展示', 
    description: '交互式地图展示非遗点位分布，支持多图层切换与空间分析',
    link: '/map'
  },
  { 
    icon: '⏳', 
    title: '时间轴传播演变', 
    description: '动态展示不同历史时期非遗传播路径与演变过程',
    link: '/map'
  },
  { 
    icon: '📚', 
    title: '非遗数字档案', 
    description: '完整的非遗项目数字档案，包含图文、视频、传承信息',
    link: '/archive'
  },
  { 
    icon: '🎓', 
    title: '研学课程', 
    description: '设计丝路非遗研学路线与课程内容，推动教育传播',
    link: '/study'
  },
  { 
    icon: '🎨', 
    title: '文创展示', 
    description: '非遗元素提取与文创产品设计转化，推动产业开发',
    link: '/creative'
  },
  { 
    icon: '🛡️', 
    title: '保护与振兴策略', 
    description: '基于GIS分析提出分级保护与乡村振兴协同建议',
    link: '/protection'
  }
])

// 创新点
const innovations = ref([
  {
    title: '跨学科融合创新',
    description: 'GIS技术与历史文化研究、非遗保护深度融合，形成数字人文新范式',
    tags: ['GIS', '历史', '非遗']
  },
  {
    title: '时空可视化技术',
    description: '地图与时间轴联动，直观呈现非遗的空间分布与历史演变',
    tags: ['可视化', '时空分析', 'WebGIS']
  },
  {
    title: '全链条保护路径',
    description: '构建"保护—展示—教育—文创—传播"的完整保护传播链条',
    tags: ['全链条', '保护', '传播']
  }
])

// 时间线
const timeline = ref([
  {
    phase: '一',
    period: '1-3个月',
    title: '调研建档与数据筹备',
    tasks: ['非遗资源调研', '数据采集整理', '数据库结构设计', '文献资料收集'],
    status: 'completed',
    statusText: '已完成'
  },
  {
    phase: '二',
    period: '4-6个月',
    title: 'GIS平台与网页开发',
    tasks: ['GIS数据库构建', 'WebGIS平台开发', '网页界面设计', '小程序开发'],
    status: 'active',
    statusText: '进行中'
  },
  {
    phase: '三',
    period: '7-9个月',
    title: '内容研发与品牌推广',
    tasks: ['研学手册编写', '文创产品设计', '品牌宣传推广', '课程内容开发'],
    status: 'pending',
    statusText: '待启动'
  },
  {
    phase: '四',
    period: '10-12个月',
    title: '落地运营与模式优化',
    tasks: ['研学路线落地', '文创产品投产', '运营模式优化', '成果总结推广'],
    status: 'pending',
    statusText: '待启动'
  }
])

const currentPhase = ref(1)
const timelineProgress = ref(25)

// 项目成果
const results = ref([
  {
    icon: '📊',
    type: 'database',
    typeLabel: '数据库',
    title: '宁夏丝路非遗地理数据库',
    description: '涵盖20+项非遗项目的完整数字档案'
  },
  {
    icon: '🌐',
    type: 'platform',
    typeLabel: '平台',
    title: 'GIS动态地图网页',
    description: '支持交互式地图探索与数据分析'
  },
  {
    icon: '📖',
    type: 'publication',
    typeLabel: '出版物',
    title: '研学手册',
    description: '3条主题研学路线与课程内容'
  },
  {
    icon: '📄',
    type: 'report',
    typeLabel: '报告',
    title: '数字化保护白皮书',
    description: '非遗保护策略与建议报告'
  },
  {
    icon: '🎬',
    type: 'course',
    typeLabel: '课程',
    title: '非遗研学课程',
    description: '面向青少年与公众的教育课程'
  },
  {
    icon: '🎁',
    type: 'product',
    typeLabel: '文创',
    title: '文创产品系列',
    description: '融合丝路元素的文创设计'
  }
])
</script>

<style lang="scss" scoped>
// ============================================
// Hero区域 - 丝路文化主题
// ============================================

.hero-section {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

// 主渐变背景
.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    #5D3A1A 0%,
    #8B4513 25%,
    #A0522D 50%,
    #6B4423 75%,
    #3E2723 100%
  );
}

// 丝绸纹理图案
.hero-pattern {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.6;
}

// 丝绸线条
.hero-silk-lines {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(45deg, transparent 48%, rgba(212, 160, 23, 0.1) 49%, rgba(212, 160, 23, 0.1) 51%, transparent 52%),
    linear-gradient(-45deg, transparent 48%, rgba(212, 160, 23, 0.08) 49%, rgba(212, 160, 23, 0.08) 51%, transparent 52%);
  background-size: 30px 30px;
}

// 沙丘纹理
.hero-sand-dunes {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(255, 248, 230, 0.15) 0%, transparent 40%),
    radial-gradient(ellipse at 70% 80%, rgba(255, 248, 230, 0.1) 0%, transparent 30%),
    radial-gradient(ellipse at 50% 50%, rgba(212, 160, 23, 0.05) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: var(--spacing-4xl) 0;
}

// 徽章
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(212, 160, 23, 0.2);
  border: 1px solid rgba(212, 160, 23, 0.4);
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  color: rgba(255, 255, 255, 0.95);
  
  .badge-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: var(--color-secondary);
    border-radius: 50%;
    font-size: 14px;
    font-weight: 600;
    color: white;
  }
  
  .badge-text {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
  }
}

// 主标题
.hero-title {
  margin-bottom: var(--spacing-lg);
  
  .title-main {
    display: block;
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 700;
    color: white;
    letter-spacing: 4px;
    text-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 4px 8px rgba(0, 0, 0, 0.2),
      0 8px 16px rgba(0, 0, 0, 0.1);
    line-height: 1.2;
  }
  
  .title-sub {
    display: block;
    font-size: clamp(0.9rem, 2vw, 1.2rem);
    color: rgba(212, 160, 23, 0.9);
    letter-spacing: 3px;
    margin-top: var(--spacing-md);
    font-weight: 400;
  }
}

// 副标题
.hero-subtitle {
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-2xl);
  max-width: 800px;
  line-height: 1.8;
  
  .highlight {
    color: var(--color-secondary);
    font-weight: 600;
    position: relative;
    
    &::before, &::after {
      content: '"';
      color: var(--color-secondary);
    }
  }
}

// 按钮组
.hero-buttons {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-2xl);
}

.btn-large {
  padding: var(--spacing-md) var(--spacing-2xl);
  font-size: 1.1rem;
  font-weight: 500;
}

.btn-icon {
  flex-shrink: 0;
}

// 快捷导航
.hero-nav {
  display: flex;
  gap: var(--spacing-xl);
  justify-content: center;
  flex-wrap: wrap;
  
  .nav-link {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-sm);
    transition: all var(--duration-fast) ease;
    
    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .nav-dot {
      width: 6px;
      height: 6px;
      background: var(--color-secondary);
      border-radius: 50%;
    }
  }
}

// 波浪装饰
.hero-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  .wave-path {
    transition: fill var(--duration-normal) ease;
  }
}

// 河流线条
.river-flow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  overflow: hidden;
  
  .river-svg {
    width: 200%;
    height: 100%;
    animation: waveFlow 20s linear infinite;
  }
  
  .river-path {
    filter: drop-shadow(0 0 4px rgba(212, 160, 23, 0.3));
  }
}

// ============================================
// 项目简介区域
// ============================================

.intro-section {
  background: var(--color-background);
}

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
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--color-secondary);
    color: white;
    border-radius: 50%;
    font-size: 18px;
    font-weight: 600;
  }
}

.section-title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  margin-bottom: var(--spacing-md);
  
  &::after {
    display: none;
  }
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-light);
}

.intro-card {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
}

.intro-paragraph {
  font-size: 1.15rem;
  line-height: 2;
  color: var(--color-text);
  text-align: center;
  
  .highlight-text {
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
      background: linear-gradient(90deg, var(--color-secondary), transparent);
    }
  }
}

.intro-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xl);
}

.tag-gold {
  background: linear-gradient(135deg, rgba(212, 160, 23, 0.2), rgba(184, 134, 11, 0.15));
  border: 1px solid rgba(212, 160, 23, 0.3);
  color: var(--color-secondary-dark);
}

.tag-green {
  background: linear-gradient(135deg, rgba(46, 139, 87, 0.15), rgba(34, 139, 34, 0.1));
  border: 1px solid rgba(46, 139, 87, 0.3);
  color: var(--color-accent);
}

// ============================================
// 统计数据区域
// ============================================

.stats-section {
  position: relative;
  padding: var(--spacing-4xl) 0;
  background: linear-gradient(135deg, #5D3A1A, #8B4513, #A0522D);
  overflow: hidden;
}

.stats-background {
  position: absolute;
  inset: 0;
  
  .stats-pattern {
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50L100 0L100 100Z' fill='%23D4A017' fill-opacity='0.03'/%3E%3C/svg%3E");
  }
}

.stats-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  position: relative;
  z-index: 1;
}

.stats-title {
  font-size: 2.5rem;
  color: white;
  margin-bottom: var(--spacing-sm);
}

.stats-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--spacing-lg);
  position: relative;
  z-index: 1;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all var(--duration-normal) ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
  opacity: 0.8;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.stat-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: var(--color-secondary);
  border-radius: var(--radius-sm);
  transition: width var(--duration-slow) ease;
}

.stat-gold .stat-bar { background: var(--color-secondary); }
.stat-green .stat-bar { background: #4CAF50; }
.stat-accent .stat-bar { background: #2196F3; }

// ============================================
// 核心功能区域
// ============================================

.features-section {
  background: var(--color-surface);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 250, 240, 0.95), rgba(245, 240, 230, 0.95));
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  text-align: center;
  animation: fadeIn 0.6s ease forwards;
  opacity: 0;
  transition: all var(--duration-normal) ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-secondary);
    
    .feature-icon-bg {
      transform: scale(1.2);
      opacity: 0.2;
    }
    
    .feature-link {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.feature-icon-wrapper {
  position: relative;
  margin-bottom: var(--spacing-lg);
}

.feature-icon {
  font-size: 3.5rem;
  position: relative;
  z-index: 1;
}

.feature-icon-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, var(--color-secondary), transparent);
  border-radius: 50%;
  opacity: 0.1;
  transition: all var(--duration-normal) ease;
}

.feature-title {
  font-size: 1.25rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.feature-desc {
  color: var(--color-text-light);
  line-height: 1.8;
  margin-bottom: var(--spacing-lg);
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-secondary);
  font-size: 14px;
  opacity: 0;
  transform: translateY(10px);
  transition: all var(--duration-fast) ease;
  
  svg {
    transition: transform var(--duration-fast) ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
}

// ============================================
// 创新点区域
// ============================================

.innovations-section {
  background: var(--color-background);
}

.innovations-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  max-width: 800px;
  margin: 0 auto;
}

.innovation-card {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  transition: all var(--duration-normal) ease;
  
  &:hover {
    border-color: var(--color-secondary);
    box-shadow: var(--shadow-md);
    
    .innovation-number {
      background: var(--color-secondary);
      transform: scale(1.1);
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.innovation-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: all var(--duration-normal) ease;
}

.innovation-content {
  h3 {
    font-size: 1.3rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    color: var(--color-text-light);
    line-height: 1.8;
    margin-bottom: var(--spacing-md);
  }
}

.innovation-tags {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
}

.mini-tag {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(212, 160, 23, 0.1);
  color: var(--color-secondary-dark);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
}

// ============================================
// 时间线区域
// ============================================

.timeline-section {
  background: var(--color-background);
}

.timeline-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-xl) 0;
}

.timeline-track {
  position: relative;
  height: 8px;
  background: var(--color-sand);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-2xl);
  
  .timeline-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--color-secondary), var(--color-accent));
    border-radius: var(--radius-full);
    transition: width var(--duration-slow) ease;
  }
}

.timeline-items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.timeline-item {
  position: relative;
  
  .timeline-marker {
    position: relative;
    width: 40px;
    height: 40px;
    margin: 0 auto var(--spacing-md);
    
    .marker-dot {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      background: var(--color-surface);
      border: 3px solid var(--color-border);
      border-radius: 50%;
      transition: all var(--duration-normal) ease;
    }
    
    .marker-ring {
      position: absolute;
      inset: 0;
      border: 2px solid transparent;
      border-radius: 50%;
      transition: all var(--duration-normal) ease;
    }
  }
  
  &.item-active {
    .marker-dot {
      background: var(--color-secondary);
      border-color: var(--color-secondary);
      box-shadow: 0 0 12px rgba(212, 160, 23, 0.5);
    }
    
    .marker-ring {
      border-color: rgba(212, 160, 23, 0.3);
    }
  }
}

.timeline-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  
  .card-phase {
    display: inline-block;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 500;
    margin-bottom: var(--spacing-sm);
  }
  
  .card-period {
    color: var(--color-text-muted);
    font-size: 14px;
    margin-bottom: var(--spacing-sm);
  }
  
  .card-title {
    font-size: 1.1rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }
  
  .card-list {
    list-style: none;
    margin-bottom: var(--spacing-md);
    
    li {
      position: relative;
      padding-left: var(--spacing-md);
      color: var(--color-text-light);
      font-size: 13px;
      margin-bottom: 4px;
      
      &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--color-secondary);
      }
    }
  }
  
  .card-status {
    display: inline-block;
    padding: 4px 12px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
  }
  
  .status-completed {
    background: rgba(76, 175, 80, 0.15);
    color: #4CAF50;
  }
  
  .status-active {
    background: rgba(212, 160, 23, 0.15);
    color: var(--color-secondary-dark);
  }
  
  .status-pending {
    background: rgba(158, 158, 158, 0.15);
    color: #9E9E9E;
  }
}

// ============================================
// 地图预览区域
// ============================================

.map-preview-section {
  background: linear-gradient(135deg, var(--color-surface), var(--color-background));
}

.map-preview-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.map-preview-info {
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  
  .info-badge {
    display: inline-block;
    background: var(--color-secondary);
    color: white;
    padding: 4px 12px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
    margin-bottom: var(--spacing-md);
  }
  
  h2 {
    font-size: 2rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-lg);
  }
  
  .info-desc {
    color: var(--color-text-light);
    line-height: 1.8;
    margin-bottom: var(--spacing-xl);
  }
}

.info-features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  
  .info-feature {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    color: var(--color-text);
    
    .feature-icon-mini {
      font-size: 1.2rem;
    }
  }
}

.map-preview-visual {
  background: linear-gradient(135deg, #E8DCC8, #D4C4AD);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 1024px) {
    order: -1;
    min-height: 300px;
  }
}

.visual-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.mock-map {
  position: relative;
  width: 280px;
  height: 400px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.map-base {
  position: absolute;
  inset: 0;
  
  .ningxia-outline {
    width: 100%;
    height: 100%;
    
    .outline-path {
      fill: rgba(245, 240, 230, 0.8);
      stroke: var(--color-primary);
      stroke-width: 2;
    }
  }
}

.heritage-point {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .point-pulse {
    position: absolute;
    width: 30px;
    height: 30px;
    background: rgba(212, 160, 23, 0.3);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }
  
  .point-marker {
    font-size: 1.2rem;
    position: relative;
    z-index: 1;
  }
}

.silk-route {
  position: absolute;
  inset: 0;
  
  .route-line {
    stroke-dasharray: 8, 4;
    animation: waveFlow 10s linear infinite;
  }
}

.map-label {
  position: absolute;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(139, 69, 19, 0.8);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  white-space: nowrap;
}

// ============================================
// 项目成果区域
// ============================================

.results-section {
  background: var(--color-background);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.result-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--duration-normal) ease;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-secondary);
  }
}

.result-image {
  height: 180px;
  background: linear-gradient(135deg, var(--color-sand), var(--color-surface));
  display: flex;
  align-items: center;
  justify-content: center;
  
  .image-placeholder {
    width: 80px;
    height: 80px;
    background: rgba(212, 160, 23, 0.15);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    
    .placeholder-icon {
      font-size: 2.5rem;
      opacity: 0.6;
    }
  }
}

.result-content {
  padding: var(--spacing-lg);
  
  .result-type-tag {
    display: inline-block;
    background: rgba(139, 69, 19, 0.1);
    color: var(--color-primary);
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 12px;
    margin-bottom: var(--spacing-md);
  }
  
  h3 {
    font-size: 1.1rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    color: var(--color-text-light);
    font-size: 14px;
    line-height: 1.6;
  }
}

// ============================================
// CTA区域
// ============================================

.cta-section {
  position: relative;
  padding: var(--spacing-4xl) 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  overflow: hidden;
}

.cta-background {
  position: absolute;
  inset: 0;
  
  .cta-pattern {
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
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

.btn-ghost {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
}

// ============================================
// 动画定义
// ============================================

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.1;
  }
}

@keyframes waveFlow {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.6s ease forwards;
}

.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
.delay-5 { animation-delay: 0.5s; }
</style>