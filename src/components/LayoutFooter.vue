<template>
  <footer class="layout-footer">
    <!-- 顶部装饰波浪 -->
    <div class="footer-wave">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path fill="#3D2B1F" d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"/>
      </svg>
    </div>
    
    <!-- 主要内容区 -->
    <div class="footer-main">
      <div class="container">
        <div class="footer-content">
          <!-- 品牌区域 -->
          <div class="footer-brand">
            <div class="brand-logo">
              <span class="logo-icon">🏜️</span>
              <div class="logo-text">
                <h3>宁夏丝路非遗地理志</h3>
                <span class="logo-sub">Ningxia Silk Road Heritage GIS</span>
              </div>
            </div>
            <p class="brand-desc">
              基于GIS与WebGIS的宁夏丝路非遗数字化保护、时空可视化与传播展示平台，
              探索"非遗保护+乡村振兴+文旅融合"的协同发展路径。
            </p>
            <div class="brand-tags">
              <span class="tag tag-gold">丝路文化</span>
              <span class="tag tag-gold">黄河文明</span>
              <span class="tag tag-green">数字人文</span>
              <span class="tag tag-green">GIS应用</span>
            </div>
          </div>
          
          <!-- 导航链接区 -->
          <div class="footer-nav">
            <div class="nav-group">
              <h4 class="nav-title">
                <span class="title-icon">📍</span>
                快速导航
              </h4>
              <ul class="nav-list">
                <li>
                  <router-link to="/">
                    <span class="link-dot"></span>
                    首页
                  </router-link>
                </li>
                <li>
                  <router-link to="/map">
                    <span class="link-dot"></span>
                    GIS地图
                  </router-link>
                </li>
                <li>
                  <router-link to="/archive">
                    <span class="link-dot"></span>
                    数字档案
                  </router-link>
                </li>
                <li>
                  <router-link to="/study">
                    <span class="link-dot"></span>
                    研学课程
                  </router-link>
                </li>
              </ul>
            </div>
            
            <div class="nav-group">
              <h4 class="nav-title">
                <span class="title-icon">📚</span>
                研究内容
              </h4>
              <ul class="nav-list">
                <li>
                  <router-link to="/project">
                    <span class="link-dot"></span>
                    项目概况
                  </router-link>
                </li>
                <li>
                  <router-link to="/protection">
                    <span class="link-dot"></span>
                    保护路径
                  </router-link>
                </li>
                <li>
                  <router-link to="/creative">
                    <span class="link-dot"></span>
                    文创展示
                  </router-link>
                </li>
                <li>
                  <router-link to="/results">
                    <span class="link-dot"></span>
                    项目成果
                  </router-link>
                </li>
              </ul>
            </div>
            
            <div class="nav-group">
              <h4 class="nav-title">
                <span class="title-icon">📞</span>
                联系我们
              </h4>
              <ul class="nav-list contact-list">
                <li>
                  <span class="contact-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </span>
                  <span>宁夏银川市西夏区</span>
                </li>
                <li>
                  <span class="contact-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </span>
                  <span>contact@silkheritage-nx.cn</span>
                </li>
                <li>
                  <span class="contact-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </span>
                  <span>0951-12345678</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- 特色展示条 -->
        <div class="footer-features">
          <div class="feature-item">
            <span class="feature-icon">🗺️</span>
            <div class="feature-content">
              <span class="feature-title">GIS可视化</span>
              <span class="feature-desc">交互式地图展示</span>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">⏳</span>
            <div class="feature-content">
              <span class="feature-title">时空演变</span>
              <span class="feature-desc">历史脉络追溯</span>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎓</span>
            <div class="feature-content">
              <span class="feature-title">研学教育</span>
              <span class="feature-desc">非遗文化传承</span>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎨</span>
            <div class="feature-content">
              <span class="feature-title">文创开发</span>
              <span class="feature-desc">文化价值转化</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部版权区 -->
    <div class="footer-bottom">
      <div class="container">
        <div class="bottom-content">
          <div class="footer-links">
            <a href="#" class="link-item">隐私政策</a>
            <span class="link-divider">|</span>
            <a href="#" class="link-item">使用条款</a>
            <span class="link-divider">|</span>
            <a href="#" class="link-item">网站地图</a>
            <span class="link-divider">|</span>
            <a href="#" class="link-item">参考资料</a>
          </div>
          
          <div class="copyright">
            <p class="copyright-text">© 2024 宁夏丝路非遗地理志 · 保留所有权利</p>
            <p class="project-note">
              <span class="note-icon">📚</span>
              大学生创新创业训练计划项目
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 装饰纹理 -->
    <div class="footer-pattern"></div>
  </footer>
</template>

<script setup>
// 无需额外脚本
</script>

<style lang="scss" scoped>
// ============================================
// 页脚主容器
// ============================================

.layout-footer {
  position: relative;
  background: linear-gradient(
    180deg,
    #3D2B1F 0%,
    #4A3728 50%,
    #3D2B1F 100%
  );
  overflow: hidden;
}

// 顶部波浪
.footer-wave {
  position: relative;
  margin-top: -1px;
  
  svg {
    display: block;
    width: 100%;
    height: 80px;
  }
}

// 主要内容区
.footer-main {
  padding: var(--spacing-2xl) 0 var(--spacing-xl);
}

// ============================================
// 内容布局
// ============================================

.footer-content {
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: var(--spacing-3xl);
  margin-bottom: var(--spacing-2xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}

// ============================================
// 品牌区域
// ============================================

.footer-brand {
  .brand-logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    
    .logo-icon {
      font-size: 2.5rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }
    
    .logo-text {
      h3 {
        font-size: 1.4rem;
        color: white;
        margin: 0;
        letter-spacing: 2px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      
      .logo-sub {
        display: block;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        letter-spacing: 1px;
        margin-top: 4px;
      }
    }
  }
  
  .brand-desc {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.8;
    margin-bottom: var(--spacing-lg);
    font-size: 0.95rem;
  }
}

.brand-tags {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  
  .tag {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
  
  .tag-gold {
    background: linear-gradient(135deg, rgba(212, 160, 23, 0.25), rgba(184, 134, 11, 0.2));
    border: 1px solid rgba(212, 160, 23, 0.4);
    color: #D4A017;
  }
  
  .tag-green {
    background: linear-gradient(135deg, rgba(46, 139, 87, 0.2), rgba(34, 139, 34, 0.15));
    border: 1px solid rgba(46, 139, 87, 0.35);
    color: #4CAF50;
  }
}

// ============================================
// 导航链接区
// ============================================

.footer-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.nav-group {
  .nav-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--color-secondary);
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid rgba(212, 160, 23, 0.2);
    
    .title-icon {
      font-size: 1.2rem;
    }
  }
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: var(--spacing-sm);
  }
  
  a {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    font-size: 0.95rem;
    padding: 6px 0;
    transition: all 0.3s ease;
    
    .link-dot {
      width: 6px;
      height: 6px;
      background: transparent;
      border-radius: 50%;
      transition: all 0.3s ease;
    }
    
    &:hover {
      color: var(--color-secondary);
      transform: translateX(4px);
      
      .link-dot {
        background: var(--color-secondary);
      }
    }
  }
}

// 联系信息
.contact-list {
  li {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.95rem;
    padding: 6px 0;
  }
  
  .contact-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: rgba(212, 160, 23, 0.15);
    border-radius: var(--radius-sm);
    color: var(--color-secondary);
  }
}

// ============================================
// 特色展示条
// ============================================

.footer-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(212, 160, 23, 0.1);
    transform: translateY(-2px);
    
    .feature-icon {
      transform: scale(1.1);
    }
  }
  
  .feature-icon {
    font-size: 1.8rem;
    transition: transform 0.3s ease;
  }
  
  .feature-content {
    display: flex;
    flex-direction: column;
  }
  
  .feature-title {
    color: white;
    font-size: 0.95rem;
    font-weight: 500;
  }
  
  .feature-desc {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
  }
}

// ============================================
// 底部版权区
// ============================================

.footer-bottom {
  background: rgba(0, 0, 0, 0.15);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: var(--spacing-lg) 0;
}

.bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.footer-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  .link-item {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--color-secondary);
    }
  }
  
  .link-divider {
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.8rem;
  }
}

.copyright {
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: center;
  }
  
  .copyright-text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    margin-bottom: 4px;
  }
  
  .project-note {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--color-secondary);
    font-size: 0.85rem;
    
    .note-icon {
      font-size: 1rem;
    }
  }
}

// ============================================
// 装饰纹理
// ============================================

.footer-pattern {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

// 确保内容在纹理之上
.footer-main,
.footer-bottom {
  position: relative;
  z-index: 1;
}
</style>