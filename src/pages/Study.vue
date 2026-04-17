<template>
  <div class="study-page">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-bg">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">📚</span>
            <span class="badge-text">青少年研学教育平台</span>
          </div>
          <h1 class="hero-title">丝路非遗研学</h1>
          <p class="hero-subtitle">探索宁夏丝路非遗，开启文化传承之旅</p>
          <div class="hero-cards">
            <div class="mini-stat">
              <span class="stat-icon">🗺️</span>
              <span class="stat-value">{{ studyRoutes.length }}</span>
              <span class="stat-label">条研学路线</span>
            </div>
            <div class="mini-stat">
              <span class="stat-icon">📖</span>
              <span class="stat-value">{{ courses.length }}</span>
              <span class="stat-label">个课程模块</span>
            </div>
            <div class="mini-stat">
              <span class="stat-icon">🎯</span>
              <span class="stat-value">200+</span>
              <span class="stat-label">学生已参与</span>
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

    <!-- 研学手册介绍 -->
    <section class="section handbook-section texture-paper">
      <div class="container">
        <div class="handbook-wrapper card-silk">
          <div class="handbook-visual">
            <div class="book-mockup">
              <div class="book-cover" :style="{ backgroundImage: 'linear-gradient(135deg, #8B4513, #A0522D)' }">
                <span class="book-icon">📚</span>
                <div class="book-title">
                  <span class="title-main">宁夏丝路非遗</span>
                  <span class="title-sub">研学手册</span>
                </div>
              </div>
              <div class="book-shadow"></div>
            </div>
            <div class="floating-icons">
              <span class="float-icon" style="animation-delay: 0s;">🏛️</span>
              <span class="float-icon" style="animation-delay: 0.3s;">🎨</span>
              <span class="float-icon" style="animation-delay: 0.6s;">📜</span>
            </div>
          </div>
          
          <div class="handbook-info">
            <div class="info-badge">官方研学教材</div>
            <h2>《宁夏丝路非遗研学手册》</h2>
            <p class="intro-text">
              本手册是专为<span class="highlight">青少年学生</span>设计的非遗研学指导读物，
              融合<span class="highlight">知识性、趣味性和实践性</span>于一体，让学生在旅行中学习，
              在实践中成长，深入了解宁夏丝路非遗的独特魅力。
            </p>
            
            <div class="handbook-features">
              <div class="feature-item" v-for="(feature, index) in features" :key="index">
                <div class="feature-icon-box">
                  <span class="feature-icon">{{ feature.icon }}</span>
                </div>
                <div class="feature-text">
                  <h4>{{ feature.title }}</h4>
                  <p>{{ feature.desc }}</p>
                </div>
              </div>
            </div>
            
            <button class="btn-download">
              <span class="btn-icon">⬇️</span>
              <span>下载研学手册（PDF）</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 精选研学路线 -->
    <section class="section routes-section">
      <div class="route-background">
        <div class="route-pattern"></div>
      </div>
      <div class="container">
        <div class="section-header">
          <div class="header-decoration">
            <span class="deco-line"></span>
            <span class="deco-icon">🗺️</span>
            <span class="deco-line"></span>
          </div>
          <h2 class="section-title">精选研学路线</h2>
          <p class="section-subtitle">三条主题路线 · 深度体验丝路非遗文化</p>
        </div>
        
        <div class="routes-grid">
          <div class="route-card" v-for="(route, index) in studyRoutes" :key="route.id"
               :style="{ animationDelay: (index * 0.1) + 's' }">
            <div class="card-image-wrapper">
              <div class="route-placeholder" :style="{ backgroundColor: route.color || '#F5F0E6' }">
                <span class="placeholder-icon">{{ route.icon || '🗺️' }}</span>
              </div>
              <div class="card-rank">
                <span>#{{ index + 1 }}</span>
              </div>
              <div class="image-overlay">
                <span class="overlay-btn">查看详情 →</span>
              </div>
              <div class="route-duration">
                <span>🕐 {{ route.duration }}</span>
              </div>
            </div>
            
            <div class="card-content">
              <h3 class="route-title">{{ route.name }}</h3>
              
              <div class="route-meta">
                <span class="meta-item">
                  <span class="meta-icon">👥</span>
                  {{ route.suitableFor }}
                </span>
                <span class="meta-item">
                  <span class="meta-icon">📍</span>
                  {{ route.location || '宁夏多地' }}
                </span>
              </div>
              
              <div class="objectives-section">
                <div class="section-mini-title">
                  <span class="mini-icon">🎯</span>
                  学习目标
                </div>
                <ul class="objectives-list">
                  <li v-for="obj in route.objectives.slice(0, 2)" :key="obj">
                    <span class="check-dot"></span>
                    {{ obj }}
                  </li>
                </ul>
              </div>
              
              <div class="highlights-section">
                <div class="section-mini-title">
                  <span class="mini-icon">✨</span>
                  特色体验
                </div>
                <div class="highlights-tags">
                  <span class="tag-sm tag-gold" v-for="h in route.highlights.slice(0, 3)" :key="h">{{ h }}</span>
                </div>
              </div>
              
              <button class="btn-apply" @click="showForm(route)">
                <span class="btn-text">立即报名</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 课程模块 -->
    <section class="section courses-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">课程模块</h2>
          <p class="section-subtitle">理论与实践结合 · 多维度学习体验</p>
        </div>
        
        <div class="courses-wrapper">
          <div class="course-card card-silk" v-for="(course, index) in courses" :key="index">
            <div class="course-header">
              <div class="course-number">{{ index + 1 }}</div>
              <div class="course-icon-wrapper">
                <span class="course-icon">{{ course.icon }}</span>
                <div class="icon-bg"></div>
              </div>
            </div>
            
            <div class="course-body">
              <h3>{{ course.title }}</h3>
              <p class="course-desc">{{ course.description }}</p>
              
              <div class="course-topics">
                <div class="topic-item" v-for="topic in course.topics" :key="topic">
                  <span class="topic-bullet"></span>
                  <span>{{ topic }}</span>
                </div>
              </div>
              
              <div class="course-meta">
                <span class="meta-tag">时长：{{ course.duration }}</span>
                <span class="meta-tag">难度：{{ course.difficulty }}</span>
              </div>
            </div>
            
            <div class="course-footer">
              <router-link to="/archive" class="course-link">
                了解详情
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 研学流程 -->
    <section class="section process-section">
      <div class="process-bg">
        <div class="bg-gradient"></div>
      </div>
      <div class="container">
        <div class="section-header light">
          <h2 class="section-title">研学流程</h2>
          <p class="section-subtitle">五步轻松参与 · 享受完美研学体验</p>
        </div>
        
        <div class="process-timeline">
          <div class="timeline-track">
            <div class="track-fill" style="width: 80%"></div>
          </div>
          
          <div class="process-steps">
            <div class="process-step" v-for="(step, index) in processSteps" :key="index">
              <div class="step-marker">
                <div class="marker-circle">
                  <span class="circle-num">{{ index + 1 }}</span>
                </div>
                <div class="marker-ring"></div>
              </div>
              <div class="step-card card">
                <h4>{{ step.title }}</h4>
                <p>{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 研学成果展示 -->
    <section class="section results-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">研学成果</h2>
          <p class="section-subtitle">学生学习展示 · 优秀作业分享</p>
        </div>
        
        <div class="results-gallery">
          <div class="gallery-item" v-for="(item, index) in galleryItems" :key="index">
            <div class="gallery-image" :style="{ backgroundColor: item.color || '#F5F0E6' }">
              <span class="gallery-placeholder">{{ item.icon }}</span>
              <div class="gallery-overlay">
                <span class="overlay-title">{{ item.title }}</span>
              </div>
            </div>
            <div class="gallery-info">
              <h4>{{ item.name }}</h4>
              <p>{{ item.school }}</p>
              <span class="gallery-tag">{{ item.type }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 报名弹窗 -->
    <transition name="modal-fade">
      <div v-if="formVisible" class="modal-overlay">
        <div class="modal-backdrop" @click="formVisible = false"></div>
        <div class="modal-dialog card-silk">
          <button class="modal-close" @click="formVisible">×</button>
          
          <div class="modal-header">
            <div class="header-icon">📝</div>
            <h3>{{ selectedRoute?.name || '研学报名' }}</h3>
          </div>
          
          <div class="modal-body">
            <form class="custom-form" @submit.prevent="submitForm">
              <div class="form-row">
                <div class="form-group">
                  <label>姓名 <span class="required">*</span></label>
                  <input type="text" v-model="form.name" placeholder="请输入您的姓名" required />
                </div>
                <div class="form-group">
                  <label>联系电话 <span class="required">*</span></label>
                  <input type="tel" v-model="form.phone" placeholder="请输入联系电话" required />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>邮箱</label>
                  <input type="email" v-model="form.email" placeholder="请输入邮箱地址" />
                </div>
                <div class="form-group">
                  <label>参与人数 <span class="required">*</span></label>
                  <div class="number-input">
                    <button type="button" @click="form.people = Math.max(1, form.people - 1)">-</button>
                    <input type="number" v-model="form.people" min="1" max="50" />
                    <button type="button" @click="form.people = Math.min(50, form.people + 1)">+</button>
                  </div>
                </div>
              </div>
              
              <div class="form-group full-width">
                <label>预计日期</label>
                <input type="date" v-model="form.date" />
              </div>
              
              <div class="form-group full-width">
                <label>留言 / 特殊需求</label>
                <textarea v-model="form.message" rows="3" placeholder="其他需求或问题..."></textarea>
              </div>
              
              <div class="form-actions">
                <button type="button" class="btn-cancel" @click="formVisible = false">取消</button>
                <button type="submit" class="btn-submit">
                  <span>提交报名</span>
                  <span class="btn-arrow">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const formVisible = ref(false)
const selectedRoute = ref(null)

// 功能特点
const features = ref([
  { icon: '📖', title: '知识丰富', desc: '涵盖 20+ 项非遗项目详细介绍' },
  { icon: '🎯', title: '目标明确', desc: '每节课都有清晰的学习目标' },
  { icon: '🎨', title: '图文并茂', desc: '精美插图与实拍照片结合' },
  { icon: '🔧', title: '实践导向', desc: '注重动手体验与实地调研' }
])

// 课程模块数据
const courses = ref([
  { 
    icon: '🗺️', 
    title: '非遗 + 地理',
    description: '结合 GIS 地图，探索非遗空间分布，理解地理环境与文化形成的关系',
    topics: ['宁夏地理环境认知', '非遗分布空间分析', '丝路古道实地考察'],
    duration: '2 课时',
    difficulty: '★★☆☆☆'
  },
  { 
    icon: '📜', 
    title: '非遗 + 丝路历史',
    description: '学习丝路历史，了解文化交流与传播，认识非遗在丝路交流中的作用',
    topics: ['丝绸之路发展史', '宁夏丝路文化遗产', '文化交流案例分析'],
    duration: '2 课时',
    difficulty: '★★★☆☆'
  },
  { 
    icon: '🔨', 
    title: '非遗 + 实践体验',
    description: '亲手参与非遗制作，在实践中感受非遗魅力，培养动手能力和创新思维',
    topics: ['贺兰砚制作体验', '泥哇呜演奏学习', '回族刺绣实践'],
    duration: '3 课时',
    difficulty: '★★☆☆☆'
  }
])

// 研学流程
const processSteps = ref([
  { title: '选择路线', desc: '浏览三条主题路线，选择适合的研学行程' },
  { title: '在线报名', desc: '填写报名信息，确认参与人员和时间安排' },
  { title: '支付费用', desc: '完成费用支付，获取报名确认函' },
  { title: '研学活动', desc: '参加线下研学活动，深入学习非遗文化' },
  { title: '反馈证书', desc: '完成反馈问卷，获得研学证书和纪念品' }
])

// 成果展示
const galleryItems = ref([
  { name: '我的贺兰砚作品', school: '银川市实验小学', type: '手工作品', color: '#E8DCC8', icon: '🎨' },
  { name: '丝路古道考察日记', school: '西夏区第二中学', type: '考察报告', color: '#F5F0E6', icon: '📝' },
  { name: '泥哇呜演奏视频', school: '兴庆区第一中学', type: '视频作品', color: '#E3D4C1', icon: '🎵' },
  { name: '回族刺绣图案设计', school: '金凤区第一小学', type: '设计稿', color: '#DED3C2', icon: '✂️' }
])

// 研学路线数据（模拟）
const studyRoutes = ref([
  {
    id: 1,
    name: '丝路古道探源之旅',
    suitableFor: '小学高年级 - 初中',
    duration: '2 天 1 夜',
    location: '银川市 - 吴忠市',
    icon: '🗺️',
    color: '#E8DCC8',
    objectives: [
      '了解丝绸之路的历史背景和重要作用',
      '实地考察丝路古道遗址',
      '学习沿线非遗文化'
    ],
    highlights: ['古城考察', '非遗体验', '篝火晚会']
  },
  {
    id: 2,
    name: '非遗技艺传承营',
    suitableFor: '初中 - 高中',
    duration: '3 天 2 夜',
    location: '宁夏多地',
    icon: '🔨',
    color: '#F5F0E6',
    objectives: [
      '亲手制作传统工艺品',
      '向非遗传承人学习技艺',
      '创作属于自己的非遗作品'
    ],
    highlights: ['贺兰砚制作', '刺绣体验', '作品展览']
  },
  {
    id: 3,
    name: '黄河非遗发现之旅',
    suitableFor: '全年龄段',
    duration: '1 天',
    location: '黄河沿岸',
    icon: '🌊',
    color: '#DED3C2',
    objectives: [
      '探索黄河文化与非遗的关系',
      '参观黄河沿岸非遗工坊',
      '收集民间故事和传说'
    ],
    highlights: ['黄河风光', '工坊探访', '故事采集']
  }
])

// 表单数据
const form = ref({
  name: '',
  phone: '',
  email: '',
  people: 1,
  date: '',
  message: ''
})

const showForm = (route) => {
  selectedRoute.value = route
  formVisible.value = true
}

const submitForm = () => {
  if (!form.value.name || !form.value.phone) {
    ElMessage.warning('请填写完整的信息')
    return
  }
  
  ElMessage.success(`报名成功！${selectedRoute.value?.name || '研学'}即将开始，我们会联系您确认详情。`)
  formVisible.value = false
  form.value = { name: '', phone: '', email: '', people: 1, date: '', message: '' }
}
</script>

<style lang="scss" scoped>
// ============================================
// 页面英雄区
// ============================================

.study-page {
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
  margin-bottom: var(--spacing-2xl);
}

.hero-cards {
  display: inline-flex;
  gap: var(--spacing-lg);
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}

.mini-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-xl);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
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

// ============================================
// 研学手册区
// ============================================

.handbook-section {
  background: var(--color-background);
}

.handbook-wrapper {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-3xl);
  padding: var(--spacing-2xl);
  align-items: center;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.handbook-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.book-mockup {
  position: relative;
  z-index: 1;
}

.book-cover {
  width: 200px;
  height: 280px;
  border-radius: 4px 12px 12px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(0, 0, 0, 0.1);
  }
}

.book-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.book-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  .title-main {
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    margin-bottom: 4px;
  }
  
  .title-sub {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
  }
}

.book-shadow {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 20px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.2), transparent);
}

.floating-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.float-icon {
  position: absolute;
  font-size: 2rem;
  opacity: 0.5;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.handbook-info {
  .info-badge {
    display: inline-block;
    background: var(--color-secondary);
    color: white;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 500;
    margin-bottom: var(--spacing-md);
  }
  
  h2 {
    font-size: 1.8rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-lg);
  }
  
  .intro-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--color-text);
    margin-bottom: var(--spacing-2xl);
    
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

.handbook-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.feature-icon-box {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon {
  font-size: 1.5rem;
}

.feature-text h4 {
  color: var(--color-primary);
  margin-bottom: 4px;
}

.feature-text p {
  font-size: 14px;
  color: var(--color-text-light);
  margin: 0;
}

.btn-download {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-2xl);
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
// 研学路线区
// ============================================

.routes-section {
  position: relative;
  background: var(--color-surface);
}

.route-background {
  position: absolute;
  inset: 0;
  
  .route-pattern {
    position: absolute;
    inset: 0;
    background: 
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 20px,
        rgba(212, 160, 23, 0.02) 20px,
        rgba(212, 160, 23, 0.02) 40px
      );
  }
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  position: relative;
  z-index: 1;
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

.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  position: relative;
  z-index: 1;
}

.route-card {
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    
    .image-overlay {
      opacity: 1;
    }
  }
}

.card-image-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  
  .route-placeholder {
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
  
  .card-rank {
    position: absolute;
    top: var(--spacing-md);
    left: var(--spacing-md);
    width: 36px;
    height: 36px;
    background: var(--color-secondary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
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
  
  .route-duration {
    position: absolute;
    bottom: var(--spacing-md);
    right: var(--spacing-md);
    padding: 6px 14px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: var(--radius-full);
    font-size: 12px;
    backdrop-filter: blur(4px);
  }
}

.card-content {
  padding: var(--spacing-xl);
}

.route-title {
  font-size: 1.3rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.route-meta {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-light);
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: var(--color-text-light);
  }
}

.section-mini-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
  
  .mini-icon {
    font-size: 14px;
  }
}

.objectives-list {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: var(--spacing-lg);
  
  li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 6px;
    font-size: 13px;
    color: var(--color-text-light);
    
    .check-dot {
      width: 6px;
      height: 6px;
      background: var(--color-secondary);
      border-radius: 50%;
      margin-top: 6px;
      flex-shrink: 0;
    }
  }
}

.highlights-tags {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-lg);
}

.tag-sm {
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  
  &.tag-gold {
    background: rgba(212, 160, 23, 0.15);
    color: var(--color-secondary-dark);
  }
}

.btn-apply {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 160, 23, 0.4);
    
    .btn-arrow {
      transform: translateX(4px);
    }
  }
}

.btn-arrow {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

// ============================================
// 课程模块区
// ============================================

.courses-section {
  background: var(--color-background);
}

.courses-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

.course-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-secondary);
    box-shadow: var(--shadow-lg);
    transform: translateY(-6px);
    
    .icon-bg {
      transform: scale(1.2);
      opacity: 0.2;
    }
  }
}

.course-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.course-number {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.course-icon-wrapper {
  position: relative;
  width: 72px;
  height: 72px;
  
  .course-icon {
    font-size: 2.5rem;
    position: relative;
    z-index: 1;
  }
  
  .icon-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 72px;
    height: 72px;
    background: radial-gradient(circle, var(--color-secondary), transparent);
    border-radius: 50%;
    opacity: 0.1;
    transition: all 0.3s ease;
  }
}

.course-body h3 {
  font-size: 1.3rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.course-desc {
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: var(--spacing-lg);
}

.course-topics {
  margin-bottom: var(--spacing-lg);
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--color-text);
  
  .topic-bullet {
    width: 8px;
    height: 8px;
    background: var(--color-secondary);
    border-radius: 50%;
    flex-shrink: 0;
  }
}

.course-meta {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
  
  .meta-tag {
    font-size: 12px;
    color: var(--color-text-muted);
  }
}

.course-footer {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px dashed var(--color-border);
  
  .course-link {
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
}

// ============================================
// 研学流程区
// ============================================

.process-section {
  position: relative;
  overflow: hidden;
}

.process-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #5D3A1A, #8B4513, #A0522D);
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(212, 160, 23, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 70%, rgba(46, 139, 87, 0.05) 0%, transparent 40%);
}

.section-header.light .section-title {
  color: white;
}

.process-timeline {
  position: relative;
  padding: var(--spacing-2xl) 0;
  max-width: 1000px;
  margin: 0 auto;
}

.timeline-track {
  position: absolute;
  top: 30px;
  left: 50px;
  right: 50px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  z-index: 0;
}

.track-fill {
  height: 100%;
  background: var(--color-secondary);
  border-radius: 2px;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
}

.process-step {
  text-align: center;
}

.step-marker {
  position: relative;
  margin-bottom: var(--spacing-md);
  
  .marker-circle {
    width: 48px;
    height: 48px;
    background: var(--color-secondary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    box-shadow: 0 0 0 8px rgba(212, 160, 23, 0.1);
  }
  
  .circle-num {
    font-size: 1.2rem;
    font-weight: 700;
    color: white;
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
}

.step-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  
  h4 {
    color: white;
    font-size: 14px;
    margin-bottom: 4px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    margin: 0;
  }
}

// ============================================
// 成果展示区
// ============================================

.results-section {
  background: var(--color-surface);
}

.results-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

.gallery-item {
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    
    .gallery-overlay {
      opacity: 1;
    }
  }
}

.gallery-image {
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  .gallery-placeholder {
    font-size: 4rem;
    opacity: 0.5;
  }
  
  .gallery-overlay {
    position: absolute;
    inset: 0;
    background: rgba(139, 69, 19, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .overlay-title {
      color: white;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.gallery-info {
  padding: var(--spacing-lg);
  text-align: center;
  
  h4 {
    font-size: 1.1rem;
    color: var(--color-primary);
    margin-bottom: 4px;
  }
  
  p {
    font-size: 13px;
    color: var(--color-text-light);
    margin: 0 0 var(--spacing-sm) 0;
  }
  
  .gallery-tag {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(212, 160, 23, 0.15);
    color: var(--color-secondary-dark);
    border-radius: var(--radius-full);
    font-size: 12px;
  }
}

// ============================================
// 报名弹窗
// ============================================

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-dialog {
  position: relative;
  width: calc(100% - 40px);
  max-width: 560px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  background: var(--color-paper);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-2xl);
}

.modal-close {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  width: 32px;
  height: 32px;
  background: var(--color-sand);
  border: none;
  border-radius: 50%;
  font-size: 20px;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-error);
    color: white;
  }
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: var(--spacing-xl);
  
  .header-icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
  }
  
  h3 {
    font-size: 1.5rem;
    color: var(--color-primary);
    margin: 0;
  }
}

.modal-body {
  .custom-form {
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
      
      @media (max-width: 576px) {
        grid-template-columns: 1fr;
      }
    }
    
    .form-group {
      margin-bottom: var(--spacing-lg);
      
      &.full-width {
        grid-column: 1 / -1;
      }
      
      label {
        display: block;
        color: var(--color-text);
        font-weight: 500;
        margin-bottom: 6px;
        
        .required {
          color: var(--color-error);
          margin-left: 4px;
        }
      }
      
      input,
      textarea,
      select {
        width: 100%;
        padding: 12px 16px;
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 14px;
        color: var(--color-text);
        transition: all 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.1);
        }
      }
      
      .number-input {
        display: flex;
        align-items: center;
        
        button {
          width: 40px;
          height: 44px;
          background: var(--color-sand);
          border: none;
          font-size: 18px;
          color: var(--color-text);
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background: var(--color-secondary);
            color: white;
          }
        }
        
        input {
          flex: 1;
          text-align: center;
          border-radius: 0;
          border-left: 0;
          border-right: 0;
          
          &::-webkit-inner-spin-button,
          &::-webkit-outer-spin-button {
            opacity: 1;
          }
        }
        
        button:first-child {
          border-radius: var(--radius-md) 0 0 var(--radius-md);
        }
        
        button:last-child {
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }
      }
    }
    
    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      
      button {
        padding: 12px 24px;
        border-radius: var(--radius-full);
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .btn-cancel {
        background: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-text);
        
        &:hover {
          border-color: var(--color-text);
        }
      }
      
      .btn-submit {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
        border: none;
        color: white;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 160, 23, 0.4);
          
          .btn-arrow {
            transform: translateX(4px);
          }
        }
      }
    }
  }
}

// ============================================
// 动画
// ============================================

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>