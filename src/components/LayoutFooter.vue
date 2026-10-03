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
              <Icon class="logo-icon" icon="gis:compass-rose" />
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
                <Icon class="title-icon" icon="gis:poi" />
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
              </ul>
            </div>
            
            <div class="nav-group">
              <h4 class="nav-title">
                <Icon class="title-icon" icon="gis:map-book" />
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
                  <router-link to="/results">
                    <span class="link-dot"></span>
                    项目成果
                  </router-link>
                </li>
              </ul>
            </div>
            
            <div class="nav-group">
              <h4 class="nav-title">
                <Icon class="title-icon" icon="gis:phone-map" />
                联系我们
              </h4>
              <ul class="nav-list contact-list">
                <li>
                  <span class="contact-icon">
                    <Icon icon="gis:poi" width="18" height="18" />
                  </span>
                  <span>宁夏银川市西夏区</span>
                </li>
                <li>
                  <span class="contact-icon">
                    <Icon icon="gis:map-send" width="18" height="18" />
                  </span>
                  <span>contact@silkheritage-nx.cn</span>
                </li>
                <li>
                  <span class="contact-icon">
                    <Icon icon="gis:phone-map" width="18" height="18" />
                  </span>
                  <span>0951-12345678</span>
                </li>
              </ul>
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
            <p class="icon-credit">
              地图图标
              <a href="https://github.com/viglino/font-gis" target="_blank" rel="noopener">Font-GIS</a>
              by Jean-Marc Viglino ·
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>
            </p>
            <p class="project-note">
              <Icon class="note-icon" icon="gis:map-book" />
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
import { Icon } from '@iconify/vue'
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
    transition: transform 0.3s var(--ease-out);

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
    transition: color 0.3s var(--ease-out), transform 0.3s var(--ease-out);

    .link-dot {
      width: 6px;
      height: 6px;
      background: transparent;
      border-radius: 50%;
      transition: background-color 0.3s var(--ease-out);
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
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    padding: 8px 12px;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color var(--duration-fast) var(--ease-out);

    &:hover {
      color: var(--color-secondary);
    }

    &:focus-visible {
      outline: 2px solid var(--color-secondary);
      outline-offset: 2px;
      border-radius: var(--radius-sm);
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
    color: rgba(255, 255, 250, 0.6);
    font-size: 0.9rem;
    margin-bottom: 4px;
  }

  .icon-credit {
    margin: 0 0 4px;
    color: rgba(255, 255, 250, 0.5);
    font-size: 0.78rem;

    a {
      color: rgba(212, 175, 55, 0.85);
      text-decoration: none;

      &:hover {
        color: var(--color-secondary);
        text-decoration: underline;
      }
    }
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
