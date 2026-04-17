<template>
  <div class="about-page">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-bg">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">团</span>
            <span class="badge-text">传承丝路文化 · 守护非遗瑰宝</span>
          </div>
          <h1 class="hero-title">关于我们</h1>
          <p class="hero-subtitle">以 GIS 技术为支撑，构建宁夏丝路非遗数字化保护与展示平台</p>
        </div>
      </div>
      <div class="hero-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="#FFF8E7" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"/>
        </svg>
      </div>
    </div>

    <!-- 团队简介区 -->
    <section class="section team-section">
      <div class="container">
        <div class="section-header">
          <div class="header-decoration">
            <span class="deco-line"></span>
            <span class="deco-icon">团</span>
            <span class="deco-line"></span>
          </div>
          <h2 class="section-title">团队简介</h2>
          <p class="section-subtitle">跨学科创新创业团队 · 多专业协同合作</p>
        </div>
        
        <div class="team-wrapper">
          <div class="team-intro card-silk">
            <p class="intro-text">
              我们是一支由<span class="highlight">大学生组成</span>的跨学科创新创业团队，成员来自
              <span class="highlight">地理信息科学</span>、<span class="highlight">计算机科学与技术</span>、
              <span class="highlight">历史学</span>、<span class="highlight">文化产业管理</span>等多个专业。
              我们怀揣着对丝路文化的热爱和对非遗保护的责任感，致力于运用现代技术手段，为宁夏丝路非遗的
              <span class="highlight">保护、传承与传播</span>贡献力量。
            </p>
            
            <div class="team-skills">
              <div class="skill-item" v-for="(skill, index) in teamSkills" :key="index">
                <div class="skill-icon">{{ skill.icon }}</div>
                <div class="skill-info">
                  <h4>{{ skill.name }}</h4>
                  <p>{{ skill.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 使命价值观区 -->
    <section class="section mission-section">
      <div class="mission-bg"></div>
      <div class="container">
        <div class="section-header light">
          <h2 class="section-title">项目使命</h2>
          <p class="section-subtitle">让非遗在数字地图上"看得见、查得到、讲得清、传得开"</p>
        </div>
        
        <div class="mission-values">
          <div class="value-card" v-for="(value, index) in missionValues" :key="index">
            <div class="value-visual">
              <span class="value-icon">{{ value.icon }}</span>
              <div class="value-bg"></div>
            </div>
            <div class="value-content">
              <h3>{{ value.title }}</h3>
              <p>{{ value.desc }}</p>
              <div class="value-quote">"${{ value.quote }}"</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 研究方向区 -->
    <section class="section research-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">研究方向</h2>
          <p class="section-subtitle">四大研究领域 · 推动文化科技创新</p>
        </div>
        
        <div class="research-grid">
          <div class="research-card" v-for="(area, index) in researchAreas" :key="index"
               :style="{ animationDelay: (index * 0.1) + 's' }">
            <div class="card-number">{{ index + 1 }}</div>
            <div class="card-icon">{{ area.icon }}</div>
            <h3>{{ area.title }}</h3>
            <p>{{ area.desc }}</p>
            <ul class="research-tags">
              <li v-for="tag in area.tags" :key="tag" class="tag-sm">{{ tag }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系合作区 -->
    <section class="section contact-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">联系合作</h2>
          <p class="section-subtitle">期待与您携手，共同守护丝路非遗</p>
        </div>
        
        <div class="contact-wrapper">
          <div class="contact-info-panel">
            <h3>联系方式</h3>
            <div class="contact-cards">
              <div class="contact-card" v-for="(item, index) in contactItems" :key="index">
                <div class="contact-icon-wrapper">
                  <span class="contact-icon">{{ item.icon }}</span>
                  <div class="icon-bg"></div>
                </div>
                <div class="contact-text">
                  <h4>{{ item.label }}</h4>
                  <p>{{ item.value }}</p>
                </div>
              </div>
            </div>
            
            <div class="office-hours">
              <h4>工作时间</h4>
              <p>周一至周五：9:00 - 17:00</p>
              <p>周末及节假日：休息</p>
            </div>
          </div>
          
          <div class="contact-form-panel card">
            <h3>留言给我们</h3>
            <form class="custom-form" @submit.prevent="submitForm">
              <div class="form-group">
                <label>姓名 <span class="required">*</span></label>
                <input type="text" v-model="form.name" placeholder="请输入您的姓名" required />
              </div>
              
              <div class="form-group">
                <label>邮箱 <span class="required">*</span></label>
                <input type="email" v-model="form.email" placeholder="请输入邮箱地址" required />
              </div>
              
              <div class="form-group">
                <label>主题 <span class="required">*</span></label>
                <select v-model="form.subject" required>
                  <option value="">请选择留言主题</option>
                  <option value="合作">项目合作</option>
                  <option value="咨询">非遗咨询</option>
                  <option value="建议">建议反馈</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>留言 <span class="required">*</span></label>
                <textarea v-model="form.message" rows="5" placeholder="请输入您的留言内容" required></textarea>
              </div>
              
              <button type="submit" class="btn-submit">
                <span class="btn-text">提交留言</span>
                <span class="btn-arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- 合作单位区 -->
    <section class="section partners-section">
      <div class="partners-bg">
        <div class="bg-pattern"></div>
      </div>
      <div class="container">
        <div class="section-header light">
          <h2 class="section-title">合作单位</h2>
          <p class="section-subtitle">多方协作 · 汇聚力量</p>
        </div>
        
        <div class="partners-grid">
          <div class="partner-card" v-for="(partner, index) in partners" :key="index">
            <div class="partner-logo-wrapper">
              <div class="partner-placeholder">
                <span class="placeholder-icon">🏛️</span>
              </div>
            </div>
            <h4>{{ partner.name }}</h4>
            <p>{{ partner.type }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA 区域 -->
    <section class="section cta-section">
      <div class="cta-bg"></div>
      <div class="container">
        <div class="cta-content">
          <h2>加入我们，共筑丝路非遗保护新篇章</h2>
          <p>无论你是研究者、开发者还是文化爱好者，这里都有你发挥作用的空间</p>
          <div class="cta-buttons">
            <a href="mailto:contact@silkheritage-nx.cn" class="btn-primary">
              <span>📧</span> 联系我们
            </a>
            <router-link to="/project" class="btn-ghost">
              <span>📖</span> 了解项目
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// 团队技能
const teamSkills = ref([
  { icon: '🗺️', name: 'GIS 技术', desc: '空间数据分析与可视化' },
  { icon: '💻', name: 'Web 开发', desc: '全栈开发与用户体验设计' },
  { icon: '📚', name: '文化研究', desc: '丝路文化与非遗学术探讨' },
  { icon: '🎨', name: '文创设计', desc: '文化元素提取与应用转化' }
])

// 使命价值观
const missionValues = ref([
  { 
    icon: '🛡️', 
    title: '保护传承', 
    desc: '建立完整的非遗数字档案，确保珍贵文化遗产永久保存',
    quote: '守护每一份珍贵的文化记忆'
  },
  { 
    icon: '⚡', 
    title: '创新驱动', 
    desc: '运用现代技术手段，为传统非遗注入新活力',
    quote: '用科技点亮传统文化'
  },
  { 
    icon: '🤝', 
    title: '开放合作', 
    desc: '汇聚各方力量，共建共享非遗保护成果',
    quote: '凝聚合力，共创未来'
  }
])

// 研究方向
const researchAreas = ref([
  { 
    icon: '🗺️', 
    title: 'GIS 与文化遗产', 
    desc: '运用地理信息系统技术，研究文化遗产的空间分布特征与演变规律',
    tags: ['空间分析', '遗产地图', '时空演变']
  },
  { 
    icon: '🌐', 
    title: '数字人文', 
    desc: '探索数字化技术在人文研究中的应用，推动人文研究的创新发展',
    tags: ['数字方法', '文本挖掘', '数据可视化']
  },
  { 
    icon: '🌱', 
    title: '乡村振兴', 
    desc: '研究非遗保护与乡村振兴的协同路径，促进地方经济社会发展',
    tags: ['文旅融合', '产业振兴', '社区发展']
  },
  { 
    icon: '🎨', 
    title: '文创设计', 
    desc: '提取非遗文化元素，进行文创产品设计，实现非遗的活态传承',
    tags: ['文化 IP', '产品设计', '品牌塑造']
  }
])

// 联系方式
const contactItems = ref([
  { icon: '📍', label: '地址', value: '宁夏银川市西夏区文萃北街' },
  { icon: '📧', label: '邮箱', value: 'contact@silkheritage-nx.cn' },
  { icon: '📞', label: '电话', value: '0951-12345678' }
])

// 合作单位
const partners = ref([
  { name: '宁夏大学', type: '主办单位' },
  { name: '宁夏非物质文化遗产保护中心', type: '指导单位' },
  { name: '银川市文化和旅游局', type: '支持单位' },
  { name: '宁夏回族自治区博物馆', type: '合作单位' },
  { name: '宁夏民间文艺家协会', type: '合作单位' },
  { name: '宁夏文化产业协会', type: '合作单位' }
])

const submitForm = () => {
  if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) {
    ElMessage.warning('请填写完整的信息')
    return
  }
  
  ElMessage.success('感谢您的留言！我们会尽快回复。')
  form.value = { name: '', email: '', subject: '', message: '' }
}
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
  
  .badge-icon {
    width: 24px;
    height: 24px;
    background: var(--color-secondary);
    border-radius: 50%;
    font-size: 14px;
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
// 团队简介区
// ============================================

.team-section {
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

.team-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.team-intro {
  padding: var(--spacing-2xl);
}

.intro-text {
  font-size: 1.15rem;
  line-height: 2;
  color: var(--color-text);
  text-align: center;
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

.team-skills {
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

.skill-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-secondary);
    box-shadow: var(--shadow-md);
  }
}

.skill-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.skill-info h4 {
  color: var(--color-primary);
  margin-bottom: 4px;
}

.skill-info p {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin: 0;
}

// ============================================
// 使命价值观区
// ============================================

.mission-section {
  position: relative;
  background: var(--color-surface);
  overflow: hidden;
}

.mission-bg {
  position: absolute;
  inset: 0;
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
  transition: all 0.3s ease;
  
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
  transition: all 0.3s ease;
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
// 研究方向区
// ============================================

.research-section {
  background: var(--color-background);
}

.research-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-xl);
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.research-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-secondary);
    
    .card-number {
      background: var(--color-secondary);
    }
  }
}

.card-number {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.3s ease;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-lg);
}

.research-card h3 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.research-card > p {
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: var(--spacing-lg);
}

.research-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag-sm {
  background: rgba(212, 160, 23, 0.1);
  color: var(--color-secondary-dark);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
}

// ============================================
// 联系合作区
// ============================================

.contact-section {
  background: var(--color-surface);
}

.contact-wrapper {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-2xl);
  align-items: start;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

.contact-info-panel {
  h3 {
    font-size: 1.3rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-xl);
  }
}

.contact-cards {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.contact-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-secondary);
    box-shadow: var(--shadow-md);
  }
}

.contact-icon-wrapper {
  position: relative;
  flex-shrink: 0;
  
  .contact-icon {
    font-size: 2rem;
    position: relative;
    z-index: 1;
  }
  
  .icon-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 56px;
    height: 56px;
    background: radial-gradient(circle, var(--color-secondary), transparent);
    border-radius: 50%;
    opacity: 0.1;
  }
}

.contact-text h4 {
  color: var(--color-primary);
  margin-bottom: 4px;
}

.contact-text p {
  color: var(--color-text);
  margin: 0;
}

.office-hours {
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  
  h4 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: var(--color-text-light);
    font-size: 0.9rem;
    margin-bottom: 4px;
  }
}

.contact-form-panel {
  h3 {
    font-size: 1.3rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-xl);
  }
}

.custom-form {
  .form-group {
    margin-bottom: var(--spacing-lg);
    
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
    select,
    textarea {
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
    
    textarea {
      resize: vertical;
      min-height: 120px;
    }
  }
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  width: 100%;
  padding: 14px 24px;
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
  
  .btn-arrow {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }
}

// ============================================
// 合作单位区
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

.bg-pattern {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.partner-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
  }
}

.partner-logo-wrapper {
  margin-bottom: var(--spacing-md);
  
  .partner-placeholder {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
  
  .placeholder-icon {
    font-size: 2.5rem;
  }
}

.partner-card h4 {
  color: white;
  margin-bottom: 4px;
}

.partner-card p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
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

.btn-primary,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-full);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--color-secondary);
  color: white;
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