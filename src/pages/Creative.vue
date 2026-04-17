<template>
  <div class="creative-page">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-bg">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">🎨</span>
            <span class="badge-text">非遗文化创新设计</span>
          </div>
          <h1 class="hero-title">宁夏丝路非遗文创</h1>
          <p class="hero-subtitle">让非遗文化元素融入现代生活，实现活态传承</p>
          <div class="hero-features">
            <div class="mini-feature">
              <span class="feature-num">{{ products.length }}</span>
              <span class="feature-label">款文创产品</span>
            </div>
            <div class="mini-divider"></div>
            <div class="mini-feature">
              <span class="feature-num">{{ elements.length }}</span>
              <span class="feature-label">种设计元素</span>
            </div>
            <div class="mini-divider"></div>
            <div class="mini-feature">
              <span class="feature-num">20+</span>
              <span class="feature-label">应用场景</span>
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

    <!-- 设计流程区 -->
    <section class="section process-section texture-paper">
      <div class="container">
        <div class="section-header">
          <div class="header-decoration">
            <span class="deco-line"></span>
            <span class="deco-icon">✏️</span>
            <span class="deco-line"></span>
          </div>
          <h2 class="section-title">文创设计流程</h2>
          <p class="section-subtitle">从文化符号到现代产品的创意转化</p>
        </div>
        
        <div class="process-wrapper card-silk">
          <div class="process-timeline-c">
            <div class="timeline-track">
              <div class="track-progress" style="width: 75%"></div>
            </div>
            
            <div class="process-flow">
              <div v-for="(step, index) in designProcess" :key="index" class="flow-step">
                <div class="step-marker">
                  <div class="marker-number">{{ index + 1 }}</div>
                  <div class="marker-ring"></div>
                </div>
                <div class="step-card card">
                  <div class="step-icon-wrapper">
                    <span class="step-icon">{{ step.icon }}</span>
                  </div>
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.desc }}</p>
                  <ul class="step-activities">
                    <li v-for="activity in step.activities" :key="activity">
                      <span class="activity-dot"></span>
                      {{ activity }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 文创产品展示区 -->
    <section class="section products-section">
      <div class="products-bg">
        <div class="bg-pattern"></div>
      </div>
      <div class="container">
        <div class="section-header light">
          <h2 class="section-title">文创产品展示</h2>
          <p class="section-subtitle">融合传统与现代 · 让非遗走进日常生活</p>
        </div>
        
        <div class="products-grid">
          <div class="product-card" v-for="(product, index) in products" :key="product.id"
               :style="{ animationDelay: (index * 0.1) + 's' }">
            <div class="product-image-wrapper">
              <div class="product-placeholder" :style="{ backgroundColor: product.color || '#F5F0E6' }">
                <span class="placeholder-icon">{{ product.icon || '🎁' }}</span>
              </div>
              <div class="product-badge" :class="'price-' + (index % 3)">
                ¥{{ product.price }}
              </div>
              <div class="image-overlay">
                <button class="overlay-btn">查看详情 →</button>
              </div>
            </div>
            
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              
              <div class="product-inspiration">
                <span class="insp-label">✨ 灵感来源</span>
                <span class="insp-value">{{ product.inspiration }}</span>
              </div>
              
              <p class="product-desc">{{ product.description }}</p>
              
              <div class="product-scenes">
                <span class="scene-tag" v-for="scene in product.scenes.slice(0, 3)" :key="scene">
                  {{ scene }}
                </span>
              </div>
              
              <div class="product-actions">
                <button class="btn-view">查看详情</button>
                <button class="btn-favorite">❤️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 设计元素库 -->
    <section class="section elements-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">设计元素库</h2>
          <p class="section-subtitle">提取丝路非遗核心文化符号 · 丰富设计素材宝库</p>
        </div>
        
        <div class="elements-categories">
          <!-- 色彩系列 -->
          <div class="element-category">
            <div class="category-header">
              <span class="cat-icon">🎨</span>
              <h3>丝路色彩</h3>
              <p class="cat-desc">提取自贺兰石、鎏金器物的经典配色</p>
            </div>
            <div class="color-grid">
              <div class="color-item" v-for="(color, index) in colorElements" :key="index">
                <div class="color-preview" :style="{ background: color.gradient }">
                  <span class="color-sample">{{ color.sample }}</span>
                </div>
                <div class="color-info">
                  <h4>{{ color.name }}</h4>
                  <code class="color-code">{{ color.code }}</code>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 图案系列 -->
          <div class="element-category">
            <div class="category-header">
              <span class="cat-icon">🔷</span>
              <h3>纹样图案</h3>
              <p class="cat-desc">源自非遗技艺的传统装饰纹样</p>
            </div>
            <div class="pattern-grid">
              <div class="pattern-item" v-for="(pattern, index) in patternElements" :key="index">
                <div class="pattern-preview" :style="{ backgroundColor: pattern.bg }">
                  <span class="pattern-icon">{{ pattern.icon }}</span>
                </div>
                <h4>{{ pattern.name }}</h4>
                <p>{{ pattern.source }}</p>
              </div>
            </div>
          </div>
          
          <!-- 符号系列 -->
          <div class="element-category">
            <div class="category-header">
              <span class="cat-icon">🏛️</span>
              <h3>文化符号</h3>
              <p class="cat-desc">代表丝路文化的标志性视觉符号</p>
            </div>
            <div class="symbol-grid">
              <div class="symbol-item" v-for="(symbol, index) in symbolElements" :key="index">
                <div class="symbol-card card">
                  <div class="symbol-icon">{{ symbol.icon }}</div>
                  <h4>{{ symbol.name }}</h4>
                  <p>{{ symbol.meaning }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 应用场景展示 -->
    <section class="section applications-section">
      <div class="applications-bg">
        <div class="bg-gradient"></div>
      </div>
      <div class="container">
        <div class="section-header light">
          <h2 class="section-title">应用场景</h2>
          <p class="section-subtitle">非遗文创 × 多元生活场景</p>
        </div>
        
        <div class="applications-showcase">
          <div class="app-category" v-for="(app, index) in applications" :key="index">
            <div class="app-card">
              <div class="app-image" :style="{ backgroundColor: app.color || '#E8DCC8' }">
                <span class="app-icon">{{ app.icon }}</span>
              </div>
              <div class="app-info">
                <h3>{{ app.title }}</h3>
                <p>{{ app.desc }}</p>
                <div class="app-tags">
                  <span class="tag-mini" v-for="tag in app.tags" :key="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 定制服务 -->
    <section class="section custom-section">
      <div class="container">
        <div class="custom-wrapper card-silk">
          <div class="custom-content">
            <div class="custom-text">
              <div class="custom-badge">企业定制服务</div>
              <h2>需要企业专属文创方案？</h2>
              <p>我们提供企业专属的非遗文创定制服务，将贵企业品牌文化与宁夏丝路非遗元素巧妙融合，
              打造独具特色的商务礼品、会议纪念品、品牌周边等产品。</p>
              
              <div class="custom-features">
                <div class="cf-item">
                  <span class="cf-icon">📋</span>
                  <span>一对一需求沟通</span>
                </div>
                <div class="cf-item">
                  <span class="cf-icon">🎨</span>
                  <span>专业设计方案</span>
                </div>
                <div class="cf-item">
                  <span class="cf-icon">🏭</span>
                  <span>品质生产保障</span>
                </div>
                <div class="cf-item">
                  <span class="cf-icon">🚚</span>
                  <span>全国物流配送</span>
                </div>
              </div>
              
              <button class="btn-contact">
                <span class="btn-icon">📧</span>
                <span>联系定制服务</span>
              </button>
            </div>
            
            <div class="custom-visual">
              <div class="mockup-container">
                <div class="mockup-box" style="transform: rotateY(-15deg) rotateX(5deg);">
                  <div class="mockup-front">
                    <span class="mo-icon">🎁</span>
                    <span class="mo-text">企业礼盒</span>
                  </div>
                </div>
                <div class="mockup-box" style="transform: rotateY(15deg) rotateX(5deg); margin-left: 40px;">
                  <div class="mockup-front">
                    <span class="mo-icon">👜</span>
                    <span class="mo-text">商务包袋</span>
                  </div>
                </div>
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

// 设计流程
const designProcess = ref([
  {
    icon: '🔍',
    title: '非遗元素提取',
    desc: '深入研究非遗项目，识别并提取具有代表性的文化符号、色彩、图案等核心元素',
    activities: ['田野调研与资料收集', '专家访谈与考证', '元素分类与筛选']
  },
  {
    icon: '✏️',
    title: '设计转化',
    desc: '运用现代设计理念，将传统非遗元素进行创新重组，使其符合当代审美和使用习惯',
    activities: ['风格定位与概念设计', '矢量图形绘制', '色彩搭配与优化']
  },
  {
    icon: '🎨',
    title: '产品设计',
    desc: '结合目标用户需求和市场趋势，将设计元素应用到具体产品形态上',
    activities: ['产品功能定义',3D 建模与渲染',打样与反馈调整']
  },
  {
    icon: '🛠️',
    title: '文创落地',
    desc: '选择合适的材料和工艺，将设计方案转化为实际产品，并确保品质可控',
    activities: ['材料与工艺选择', '生产线对接', '质量控制与包装']
  }
])

// 色彩元素
const colorElements = ref([
  { name: '赭石深棕', code: '#8B4513', gradient: 'linear-gradient(135deg, #8B4513, #A0522D)', sample: '棕' },
  { name: '鎏金色', code: '#D4A017', gradient: 'linear-gradient(135deg, #D4A017, #F0C040)', sample: '金' },
  { name: '黄河沙', code: '#E8DCC8', gradient: 'linear-gradient(135deg, #E8DCC8, #DED3C2)', sample: '沙' },
  { name: '文化绿', code: '#2E7D32', gradient: 'linear-gradient(135deg, #2E7D32, #4CAF50)', sample: '绿' }
])

// 图案元素
const patternElements = ref([
  { name: '驼队剪影', source: '丝路古道', icon: '🐫', bg: '#F5F0E6' },
  { name: '黄河波纹', source: '黄河文化', icon: '🌊', bg: '#E3D4C1' },
  { name: '贺兰山纹', source: '地域特色', icon: '⛰️', bg: '#DED3C2' },
  { name: '回文字样', source: '回族文化', icon: '🔷', bg: '#E8DCC8' }
])

// 符号元素
const symbolElements = ref([
  { name: '骆驼', icon: '🐫', meaning: '丝绸之路的象征，代表着坚韧与毅力' },
  { name: '黄河', icon: '🌊', meaning: '中华民族的母亲河，孕育了灿烂的文明' },
  { name: '贺兰山', icon: '⛰️', meaning: '宁夏地理标志，见证丝路历史变迁' },
  { name: '莲花', icon: '🪷', meaning: '佛教文化符号，象征纯洁与美好' },
  { name: '云纹', icon: '☁️', meaning: '传统吉祥纹样，寓意吉祥如意' },
  { name: '钱币', icon: '💰', meaning: '古代贸易象征，反映丝路商贸繁荣' }
])

// 应用场景
const applications = ref([
  {
    icon: '📦',
    title: '商务礼品',
    desc: '企业伴手礼、会议纪念品、商务馈赠',
    tags: ['高端定制', '品牌联名'],
    color: '#F5F0E6'
  },
  {
    icon: '👕',
    title: '服饰配饰',
    desc: '丝巾、领带、胸针、手机壳等日常用品',
    tags: ['时尚设计', '便携实用'],
    color: '#E8DCC8'
  },
  {
    icon: '🏠',
    title: '家居装饰',
    desc: '摆件、挂画、茶具、香薰等生活用品',
    tags: ['文化气息', '居家美学'],
    color: '#E3D4C1'
  },
  {
    icon: '📱',
    title: '数码周边',
    desc: '充电宝、鼠标垫、耳机盒、电脑贴纸',
    tags: ['年轻群体', '科技融合'],
    color: '#DED3C2'
  }
])

// 文创产品数据（模拟）
const products = ref([
  {
    id: 1,
    name: '丝路驼韵·贺兰砚台套装',
    price: 288,
    icon: '🪨',
    color: '#E3D4C1',
    inspiration: '贺兰石雕刻技艺',
    description: '精选优质贺兰石，雕刻丝路驼队图案，配以精美包装盒，兼具收藏与实用价值。',
    scenes: ['书房摆件', '商务送礼', '收藏鉴赏']
  },
  {
    id: 2,
    name: '黄河之韵·丝绸方巾',
    price: 168,
    icon: '🧣',
    color: '#F5F0E6',
    inspiration: '黄河水波纹样',
    description: '采用 100% 桑蚕丝，印刻黄河波纹图案，优雅大方，彰显东方美学。',
    scenes: ['日常搭配', '职场穿搭', '节日礼物']
  },
  {
    id: 3,
    name: '非遗印象·文创手账本',
    price: 88,
    icon: '📔',
    color: '#E8DCC8',
    inspiration: '西夏文书法艺术',
    description: '封面采用非遗元素手绘插画，内页精装，记录你的每一天精彩。',
    scenes: ['学生用品', '办公文具', '旅行笔记']
  },
  {
    id: 4,
    name: '丝路记忆·陶瓷茶具套组',
    price: 358,
    icon: '🍵',
    color: '#DED3C2',
    inspiration: '宁夏传统制瓷工艺',
    description: '手工拉坯制作，釉下彩描绘丝路风景，品味茶香中的人文情怀。',
    scenes: ['茶道爱好', '客厅待客', '茶室布置']
  },
  {
    id: 5,
    name: '非遗匠心·刺绣帆布袋',
    price: 128,
    icon: '👜',
    color: '#E0D0C0',
    inspiration: '回族刺绣技艺',
    description: '纯棉帆布材质，手工刺绣非遗图案，环保耐用又时尚。',
    scenes: ['日常通勤', '购物使用', '校园生活']
  },
  {
    id: 6,
    name: '古韵新风·金属书签礼盒',
    price: 98,
    icon: '🔖',
    color: '#F0E8D8',
    inspiration: '古代书籍装帧艺术',
    description: '黄铜材质，精雕细刻，镀金处理，为阅读增添仪式感。',
    scenes: ['读书爱好者', '毕业礼物', '书架装饰']
  }
])
</script>

<style lang="scss" scoped>
// ============================================
// 页面英雄区
// ============================================

.creative-page {
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

.hero-features {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-xl);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
}

.mini-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .feature-num {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-secondary);
  }
  
  .feature-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
}

.mini-divider {
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

// ============================================
// 设计流程区
// ============================================

.process-section {
  background: var(--color-background);
}

.process-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
}

.process-timeline-c {
  position: relative;
}

.timeline-track {
  position: absolute;
  top: 24px;
  left: 80px;
  right: 80px;
  height: 4px;
  background: var(--color-sand);
  border-radius: 2px;
  z-index: 0;
}

.track-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--color-secondary), var(--color-accent));
  border-radius: 2px;
}

.process-flow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  position: relative;
  z-index: 1;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.flow-step {
  text-align: center;
}

.step-marker {
  position: relative;
  margin-bottom: var(--spacing-lg);
  
  .marker-number {
    width: 48px;
    height: 48px;
    background: var(--color-secondary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.2rem;
    margin: 0 auto;
    box-shadow: 0 0 0 8px rgba(212, 160, 23, 0.1);
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
  background: var(--color-background);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
}

.step-icon-wrapper {
  margin-bottom: var(--spacing-md);
  
  .step-icon {
    font-size: 2.5rem;
  }
}

.step-card h3 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.step-card > p {
  color: var(--color-text-light);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.step-activities {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  
  li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 6px;
    font-size: 12px;
    color: var(--color-text-muted);
    
    .activity-dot {
      width: 6px;
      height: 6px;
      background: var(--color-secondary);
      border-radius: 50%;
      margin-top: 4px;
      flex-shrink: 0;
    }
  }
}

// ============================================
// 产品展示区
// ============================================

.products-section {
  position: relative;
  background: var(--color-surface);
}

.products-bg {
  position: absolute;
  inset: 0;
  
  .bg-pattern {
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

.section-header.light .section-title {
  color: var(--color-primary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  position: relative;
  z-index: 1;
}

.product-card {
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

.product-image-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  
  .product-placeholder {
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
  
  .product-badge {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    padding: 6px 14px;
    border-radius: var(--radius-full);
    font-weight: 700;
    color: white;
    backdrop-filter: blur(4px);
    
    &.price-0 { background: rgba(212, 160, 23, 0.9); }
    &.price-1 { background: rgba(139, 69, 19, 0.9); }
    &.price-2 { background: rgba(46, 139, 87, 0.9); }
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

.product-info {
  padding: var(--spacing-xl);
}

.product-name {
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.product-inspiration {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border-light);
  
  .insp-label {
    font-size: 12px;
    color: var(--color-text-muted);
  }
  
  .insp-value {
    font-size: 13px;
    color: var(--color-secondary-dark);
    font-weight: 500;
  }
}

.product-desc {
  font-size: 14px;
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: var(--spacing-md);
}

.product-scenes {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-lg);
  
  .scene-tag {
    padding: 4px 10px;
    background: rgba(212, 160, 23, 0.1);
    color: var(--color-secondary-dark);
    border-radius: var(--radius-sm);
    font-size: 12px;
  }
}

.product-actions {
  display: flex;
  gap: var(--spacing-sm);
  
  button {
    padding: 10px 20px;
    border-radius: var(--radius-full);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-view {
    flex: 1;
    background: var(--color-secondary);
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }
  
  .btn-favorite {
    width: 44px;
    background: var(--color-sand);
    border: none;
  }
}