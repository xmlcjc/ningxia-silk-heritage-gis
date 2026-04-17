<template>
  <div class="results-page">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-bg">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">🏆</span>
            <span class="badge-text">阶段性成果展示</span>
          </div>
          <h1 class="hero-title">项目成果与资讯</h1>
          <p class="hero-subtitle">记录项目进展 · 分享研究成果 · 传播非遗文化</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-num">{{ resultsData.length }}</span>
              <span class="stat-label">项成果</span>
            </div>
            <div class="stat-divider">|</div>
            <div class="stat-item">
              <span class="stat-num">{{ newsData.length }}</span>
              <span class="stat-label">篇资讯</span>
            </div>
            <div class="stat-divider">|</div>
            <div class="stat-item">
              <span class="stat-num">{{ completedPhases }}/{{ totalPhases }}</span>
              <span class="stat-label">阶段完成</span>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="#FFF8E7" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"/>
        </svg>
      </div>
    </div>

    <!-- 项目成果区 -->
    <section class="section results-section">
      <div class="container">
        <div class="section-header">
          <div class="header-decoration">
            <span class="deco-line"></span>
            <span class="deco-icon">📊</span>
            <span class="deco-line"></span>
          </div>
          <h2 class="section-title">项目成果</h2>
          <p class="section-subtitle">六大核心成果 · 全方位展示项目价值</p>
        </div>
        
        <div class="results-tabs">
          <div class="tabs-header">
            <button 
              v-for="tab in resultTabs" 
              :key="tab.key"
              class="tab-btn"
              :class="{ 'active': activeResultTab === tab.key }"
              @click="activeResultTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <div class="tabs-content">
            <div v-show="activeResultTab === 'all'" class="tab-panel">
              <div class="results-grid">
                <div class="result-card card-silk" v-for="(result, index) in resultsData" :key="result.id"
                     :style="{ animationDelay: (index * 0.1) + 's' }">
                  <div class="card-image-wrapper">
                    <div class="result-placeholder" :style="{ backgroundColor: result.color || '#F5F0E6' }">
                      <span class="placeholder-icon">{{ result.icon || '📁' }}</span>
                    </div>
                    <div class="result-badge" :class="'type-' + result.typeCategory">
                      {{ result.type }}
                    </div>
                    <div class="image-overlay">
                      <span class="overlay-btn">查看详情 →</span>
                    </div>
                  </div>
                  
                  <div class="card-body">
                    <h3 class="result-title">{{ result.title }}</h3>
                    <p class="result-desc">{{ result.description }}</p>
                    
                    <div class="result-meta">
                      <span class="meta-tag" v-if="result.size">📦 {{ result.size }}</span>
                      <span class="meta-tag" v-if="result.date">📅 {{ result.date }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-for="cat in uniqueCategories" :key="cat" v-show="activeResultTab === cat" class="tab-panel">
              <div class="results-grid">
                <div class="result-card card-silk" v-for="result in getResultsByCategory(cat)" :key="result.id">
                  <div class="card-image-wrapper">
                    <div class="result-placeholder" :style="{ backgroundColor: result.color || '#F5F0E6' }">
                      <span class="placeholder-icon">{{ result.icon || '📁' }}</span>
                    </div>
                    <div class="result-badge" :class="'type-' + result.typeCategory">
                      {{ result.type }}
                    </div>
                  </div>
                  
                  <div class="card-body">
                    <h3 class="result-title">{{ result.title }}</h3>
                    <p class="result-desc">{{ result.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 时间轴线区 -->
    <section class="section timeline-section">
      <div class="timeline-bg">
        <div class="bg-pattern"></div>
      </div>
      <div class="container">
        <div class="section-header light">
          <h2 class="section-title">项目进度</h2>
          <p class="section-subtitle">四阶段推进计划 · 12 个月完整周期</p>
        </div>
        
        <div class="timeline-r">
          <div class="timeline-track">
            <div class="track-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          
          <div class="timeline-items">
            <div class="timeline-item" v-for="(item, index) in timelineData" :key="index">
              <div class="timeline-marker">
                <div class="marker-dot" :class="{ 'active': item.status === '已完成', 'progress': item.status === '进行中' }">
                  <span class="phase-num">{{ index + 1 }}</span>
                </div>
                <div class="marker-ring"></div>
              </div>
              
              <div class="timeline-card card">
                <div class="card-header-row">
                  <div class="phase-badge">第{{ item.phase }}阶段</div>
                  <div class="period-label">{{ item.period }}</div>
                </div>
                
                <h3 class="card-title">{{ item.title }}</h3>
                
                <ul class="task-list">
                  <li v-for="(task, idx) in item.tasks" :key="idx">
                    <span class="task-check" :class="{ 'done': item.status === '已完成' }">✓</span>
                    {{ task }}
                  </li>
                </ul>
                
                <div class="card-footer">
                  <el-tag 
                    :color="getStatusColor(item.status)"
                    size="small"
                    effect="light"
                  >
                    {{ item.status }}
                  </el-tag>
                  <span class="completion-rate">完成率：{{ item.completion || 0 }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新资讯区 -->
    <section class="section news-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">最新资讯</h2>
          <p class="section-subtitle">项目动态 · 研究成果 · 活动通知</p>
        </div>
        
        <div class="news-filter">
          <button 
            class="filter-btn"
            :class="{ 'active': activeNewsFilter === 'all' }"
            @click="activeNewsFilter = 'all'"
          >
            全部
          </button>
          <button 
            v-for="cat in uniqueNewsCategories" 
            :key="cat"
            class="filter-btn"
            :class="{ 'active': activeNewsFilter === cat }"
            @click="activeNewsFilter = cat"
          >
            {{ cat }}
          </button>
        </div>
        
        <div class="news-grid">
          <article class="news-card card-silk" v-for="news in filteredNews" :key="news.id">
            <div class="news-image-wrapper">
              <div class="news-placeholder" :style="{ backgroundColor: news.color || '#E8DCC8' }">
                <span class="placeholder-char">{{ news.title.charAt(0) }}</span>
              </div>
              <div class="news-date-badge">
                <span class="date-month">{{ getMonth(news.date) }}</span>
                <span class="date-day">{{ getDay(news.date) }}</span>
              </div>
            </div>
            
            <div class="news-content">
              <div class="news-meta">
                <el-tag size="small" :type="getNewsTagType(news.category)">{{ news.category }}</el-tag>
                <time>{{ news.date }}</time>
              </div>
              
              <h3 class="news-title">{{ news.title }}</h3>
              <p class="news-excerpt">{{ news.summary.substring(0, 120) }}...</p>
              
              <div class="news-tags">
                <span class="tag-sm" v-for="tag in news.tags?.slice(0, 2)" :key="tag">{{ tag }}</span>
              </div>
              
              <a href="#" class="read-more">
                <span>阅读全文</span>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </a>
            </div>
          </article>
        </div>
        
        <div class="pagination-section" v-if="filteredNews.length > pageSize * maxNewsPage">
          <button class="load-more" @click="showMoreNews">
            <span class="btn-icon">📰</span>
            <span>加载更多资讯</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 合作展示区 -->
    <section class="section partners-section">
      <div class="partners-bg">
        <div class="bg-gradient"></div>
      </div>
      <div class="container">
        <div class="section-header light">
          <h2 class="section-title">合作与致谢</h2>
          <p class="section-subtitle">感谢所有支持本项目的单位和個人</p>
        </div>
        
        <div class="partners-grid">
          <div class="partner-category">
            <h4 class="category-title">指导单位</h4>
            <div class="partner-list">
              <div class="partner-item" v-for="p in partnerData.guidance" :key="p">
                <span class="partner-logo">🏛️</span>
                <span class="partner-name">{{ p }}</span>
              </div>
            </div>
          </div>
          
          <div class="partner-category">
            <h4 class="category-title">主办单位</h4>
            <div class="partner-list">
              <div class="partner-item" v-for="p in partnerData.host" :key="p">
                <span class="partner-logo">🎓</span>
                <span class="partner-name">{{ p }}</span>
              </div>
            </div>
          </div>
          
          <div class="partner-category">
            <h4 class="category-title">支持单位</h4>
            <div class="partner-list">
              <div class="partner-item" v-for="p in partnerData.support" :key="p">
                <span class="partner-logo">🤝</span>
                <span class="partner-name">{{ p }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA 区域 -->
    <section class="section cta-section">
      <div class="cta-bg"></div>
      <div class="container">
        <div class="cta-content">
          <h2>关注我们，获取最新项目动态</h2>
          <p>订阅我们的通讯，第一时间了解宁夏丝路非遗的最新研究和活动信息</p>
          <div class="subscribe-form">
            <input type="email" placeholder="输入您的邮箱地址" />
            <button class="btn-subscribe">
              <span>订阅</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
          <div class="social-links">
            <a href="#" class="social-icon" title="微信公众号">📱</a>
            <a href="#" class="social-icon" title="微博">👁️</a>
            <a href="#" class="social-icon" title="知乎">📚</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeResultTab = ref('all')
const activeNewsFilter = ref('all')
const showMoreCount = ref(0)

// 模拟数据
const resultsData = ref([
  { id: 1, title: '宁夏丝路非遗地理数据库', type: '数据库', typeCategory: 'database', description: '涵盖 20+ 项非遗项目的完整数字档案', color: '#E8DCC8', icon: '🗄️', date: '2024-06', size: '500MB' },
  { id: 2, title: 'GIS 动态地图网页平台', type: '平台', typeCategory: 'platform', description: '支持交互式地图探索与数据分析', color: '#F5F0E6', icon: '🌐', date: '2024-08', size: '在线' },
  { id: 3, title: '《宁夏丝路非遗研学手册》', type: '出版物', typeCategory: 'publication', description: '3 条主题研学路线与课程内容', color: '#E3D4C1', icon: '📖', date: '2024-09', size: 'PDF' },
  { id: 4, title: '数字化保护白皮书', type: '报告', typeCategory: 'report', description: '非遗保护策略与建议报告', color: '#DED3C2', icon: '📄', date: '2024-10' },
  { id: 5, title: '非遗研学课程', type: '课程', typeCategory: 'course', description: '面向青少年与公众的教育课程', color: '#E0D0C0', icon: '🎬', date: '2024-11' },
  { id: 6, title: '文创产品系列', type: '产品', typeCategory: 'product', description: '融合丝路元素的文创设计', color: '#F0E8D8', icon: '🎁', date: '2024-12' }
])

const resultTabs = ref([
  { key: 'all', label: '全部成果' },
  { key: 'database', label: '数据库' },
  { key: 'platform', label: '平台' },
  { key: 'publication', label: '出版物' },
  { key: 'report', label: '报告' },
  { key: 'course', label: '课程' },
  { key: 'product', label: '产品' }
])

const uniqueCategories = computed(() => [...new Set(resultsData.value.map(r => r.typeCategory))])

const getResultsByCategory = (cat) => {
  return resultsData.value.filter(r => r.typeCategory === cat)
}

const newsData = ref([
  { id: 1, title: '项目组参加宁夏文化遗产保护论坛', category: '活动', summary: '2024 年 10 月 15 日，项目组代表受邀参加宁夏文化遗产保护论坛，分享了 GIS 技术在非遗保护中的应用实践。', date: '2024-10-15', tags: ['论坛', '交流'], color: '#E8DCC8' },
  { id: 2, title: '《研学手册》正式出版发行', category: '成果', summary: '经过半年多的编写和完善，《宁夏丝路非遗研学手册》终于正式出版，将在宁夏各地中小学推广使用。', date: '2024-09-20', tags: ['出版', '教育'], color: '#F5F0E6' },
  { id: 3, title: '贺兰砚制作技艺实地调研', category: '调研', summary: '项目组前往贺兰县，对贺兰砚制作技艺进行深度调研，采访了多位非遗传承人，收集了大量第一手资料。', date: '2024-08-10', tags: ['调研', '贺兰砚'], color: '#E3D4C1' },
  { id: 4, title: 'GIS 平台正式上线运行', category: '成果', summary: '宁夏丝路非遗 GIS 展示平台正式上线，公众可以通过网页访问，探索宁夏非遗的空间分布。', date: '2024-07-01', tags: ['上线', 'GIS'], color: '#DED3C2' },
  { id: 5, title: '与银川市博物馆建立合作', category: '合作', summary: '项目组与银川市博物馆达成合作协议，将在展品数字化、展览策划等方面开展深度合作。', date: '2024-06-15', tags: ['合作', '博物馆'], color: '#E0D0C0' },
  { id: 6, title: '首届非遗研学夏令营成功举办', category: '活动', summary: '来自银川市的 50 名中小学生参加了为期三天的非遗研学夏令营，体验了贺兰砚制作和回族刺绣。', date: '2024-07-20', tags: ['研学', '夏令营'], color: '#F0E8D8' }
])

const uniqueNewsCategories = computed(() => [...new Set(newsData.value.map(n => n.category))])

const filteredNews = computed(() => {
  if (activeNewsFilter.value === 'all') {
    return newsData.value.slice(0, 3 + showMoreCount.value)
  }
  return newsData.value.filter(n => n.category === activeNewsFilter.value).slice(0, 3 + showMoreCount.value)
})

const pageSize = 3
const maxNewsPage = 2

const showMoreNews = () => {
  showMoreCount.value += 3
}

// 时间轴数据
const timelineData = ref([
  { phase: '一', period: '1-3 个月', title: '调研建档与数据筹备', tasks: ['非遗资源调研', '数据采集整理', '数据库结构设计', '文献资料收集'], status: '已完成', completion: 100 },
  { phase: '二', period: '4-6 个月', title: 'GIS 平台与网页开发', tasks: ['GIS 数据库构建', 'WebGIS 平台开发', '网页界面设计', '小程序开发'], status: '进行中', completion: 65 },
  { phase: '三', period: '7-9 个月', title: '内容研发与品牌推广', tasks: ['研学手册编写', '文创产品设计', '品牌宣传推广', '课程内容开发'], status: '待启动', completion: 0 },
  { phase: '四', period: '10-12 个月', title: '落地运营与模式优化', tasks: ['研学路线落地', '文创产品投产', '运营模式优化', '成果总结推广'], status: '待启动', completion: 0 }
])

const completedPhases = computed(() => timelineData.value.filter(t => t.status === '已完成').length)
const totalPhases = timelineData.value.length
const progressPercentage = computed(() => {
  const total = timelineData.value.reduce((sum, t) => sum + (t.completion || 0), 0)
  return Math.round(total / totalPhases.value)
})

const getStatusColor = (status) => {
  if (status === '已完成') return '#4CAF50'
  if (status === '进行中') return '#FF9800'
  return '#9E9E9E'
}

const getNewsTagType = (cat) => {
  const types = { '活动': 'warning', '成果': 'success', '调研': 'info', '合作': 'primary' }
  return types[cat] || ''
}

const getMonth = (dateStr) => {
  return dateStr.split('-')[1]
}

const getDay = (dateStr) => {
  return parseInt(dateStr.split('-')[2])
}

// 合作单位数据
const partnerData = ref({
  guidance: ['宁夏非物质文化遗产保护中心', '宁夏回族自治区文化和旅游厅'],
  host: ['宁夏大学', '宁夏大学历史文化学院'],
  support: ['银川市文化和旅游局', '宁夏回族自治区博物馆', '宁夏民间文艺家协会']
})
</script>

<style lang="scss" scoped>
// ============================================
// 页面英雄区
// ============================================

.results-page {
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
  
  .hero-pattern {
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4A017' fill-opacity='0.05'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z'/%3E%3C/g%3E%3C/svg%3E");
  }
  
  .hero-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #5D3A1A 0%, #8B4513 50%, #A0522D 100%);
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
}

.badge-icon {
  font-size: 16px;
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
  margin-bottom: var(--spacing-xl);
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-xl);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .stat-num {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-secondary);
  }
  
  .stat-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.3);
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

.section {
  padding: var(--spacing-3xl) 0;
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
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-light);
}

.section-header.light .section-title,
.section-header.light .section-subtitle {
  color: white;
}

// ============================================
// 成果展示区
// ============================================

.results-section {
  background: var(--color-background);
}

.results-tabs {
  max-width: 1000px;
  margin: 0 auto;
}

.tabs-header {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-xl);
}

.tab-btn {
  padding: 8px 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text);
  font-size: 14px;
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
}

.tabs-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
}

.result-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    
    .image-overlay {
      opacity: 1;
    }
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
    
    &.type-database { background: rgba(21, 101, 192, 0.9); }
    &.type-platform { background: rgba(46, 125, 50, 0.9); }
    &.type-publication { background: rgba(251, 192, 45, 0.9); }
    &.type-report { background: rgba(244, 67, 54, 0.9); }
    &.type-course { background: rgba(156, 39, 176, 0.9); }
    &.type-product { background: rgba(233, 30, 99, 0.9); }
  }
  
  .image-overlay {
    position: absolute;
    inset: 0;
    background: rgba(139, 69, 19, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
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
  }
}

// ============================================
// 时间轴线区
// ============================================

.timeline-section {
  position: relative;
  background: var(--color-surface);
}

.timeline-bg {
  position: absolute;
  inset: 0;
  
  .bg-pattern {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(ellipse at 20% 30%, rgba(212, 160, 23, 0.05) 0%, transparent 40%),
      radial-gradient(ellipse at 80% 70%, rgba(46, 139, 87, 0.05) 0%, transparent 40%);
  }
}

.timeline-r {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-xl) 0;
  position: relative;
}

.timeline-track {
  position: absolute;
  top: 40px;
  left: 50px;
  right: 50px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  z-index: 0;
}

.track-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-secondary), var(--color-accent));
  border-radius: 3px;
  transition: width 0.5s ease;
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  position: relative;
  z-index: 1;
}

.timeline-item {
  display: flex;
  gap: var(--spacing-lg);
  align-items: flex-start;
}

@media (max-width: 768px) {
  .timeline-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.timeline-marker {
  flex-shrink: 0;
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-dot {
  width: 36px;
  height: 36px;
  background: var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(135deg, var(--color-secondary), var(--color-accent));
    box-shadow: 0 0 20px rgba(212, 160, 23, 0.4);
    
    .phase-num {
      color: white;
    }
  }
  
  &.progress {
    background: linear-gradient(135deg, #FF9800, #F57C00);
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.phase-num {
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.marker-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border: 2px solid rgba(212, 160, 23, 0.2);
  border-radius: 50%;
}

.timeline-card {
  flex: 1;
  background: var(--color-background);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
}

.card-header-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  @media (max-width: 768px) {
    justify-content: center;
  }
}

.phase-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
}

.period-label {
  color: var(--color-text-muted);
  font-size: 13px;
}

.card-title {
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-lg) 0;
  
  li {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    color: var(--color-text);
    font-size: 14px;
    
    .task-check {
      width: 18px;
      height: 18px;
      background: var(--color-sand);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: transparent;
      
      &.done {
        background: #4CAF50;
        color: white;
      }
    }
  }
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}

.completion-rate {
  font-size: 13px;
  color: var(--color-text-muted);
}

// ============================================
// 资讯区
// ============================================

.news-section {
  background: var(--color-background);
}

.news-filter {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-xl);
}

.filter-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-light);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-secondary);
    color: var(--color-secondary);
  }
  
  &.active {
    background: var(--color-secondary);
    border-color: var(--color-secondary);
    color: white;
  }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

.news-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
  }
}

.news-image-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  
  .news-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .placeholder-char {
    font-size: 4rem;
    font-weight: 700;
    color: rgba(139, 69, 19, 0.2);
  }
  
  .news-date-badge {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    background: white;
    padding: 6px 10px;
    border-radius: var(--radius-lg);
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .date-month {
      display: block;
      font-size: 10px;
      color: var(--color-text-muted);
      text-transform: uppercase;
    }
    
    .date-day {
      display: block;
      font-size: 18px;
      font-weight: 700;
      color: var(--color-primary);
    }
  }
}

.news-content {
  padding: var(--spacing-lg);
}

.news-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  
  time {
    font-size: 13px;
    color: var(--color-text-muted);
  }
}

.news-title {
  font-size: 1.15rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
}

.news-excerpt {
  font-size: 14px;
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-tags {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  
  .tag-sm {
    padding: 2px 8px;
    background: rgba(212, 160, 23, 0.1);
    color: var(--color-secondary-dark);
    border-radius: var(--radius-sm);
    font-size: 11px;
  }
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-secondary);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    gap: 8px;
  }
}

.pagination-section {
  text-align: center;
  margin-top: var(--spacing-2xl);
}

.load-more {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 12px 32px;
  background: var(--color-secondary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

// ============================================
// 合作展示区
// ============================================

.partners-section {
  position: relative;
  overflow: hidden;
}

.partners-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #5D3A1A, #8B4513, #A0522D);
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 30% 20%, rgba(212, 160, 23, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 70% 80%, rgba(46, 139, 87, 0.05) 0%, transparent 40%);
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  position: relative;
  z-index: 1;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

.partner-category {
  h4 {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin-bottom: var(--spacing-lg);
    text-align: center;
  }
}

.partner-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.partner-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(4px);
  }
}

.partner-logo {
  font-size: 1.5rem;
}

.partner-name {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

// ============================================
// CTA 区域
// ============================================

.cta-section {
  position: relative;
  padding: var(--spacing-4xl) 0;
}

.cta-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #5D3A1A, #8B4513, #A0522D);
}

.cta-content {
  position: relative;
  z-index: 1;
  text-align: center;
  
  h2 {
    font-size: clamp(1.5rem, 4vw, 2.2rem);
    color: white;
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: var(--spacing-2xl);
  }
}

.subscribe-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto var(--spacing-xl);
  gap: var(--spacing-sm);
  
  input {
    flex: 1;
    padding: 14px 20px;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: var(--radius-full);
    font-size: 15px;
    
    &::placeholder {
      color: var(--color-text-muted);
    }
  }
  
  .btn-subscribe {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: var(--color-secondary);
    color: white;
    border: none;
    border-radius: var(--radius-full);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      
      .btn-arrow {
        transform: translateX(4px);
      }
    }
  }
}

.social-links {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  
  .social-icon {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      background: var(--color-secondary);
      border-color: var(--color-secondary);
      transform: translateY(-4px);
    }
  }
}

.text-center {
  text-align: center;
}
</style>