<template>
  <header class="layout-header" :class="{ 'header-scrolled': isScrolled }">
    <!-- 顶部装饰条 -->
    <div class="header-top-bar">
      <div class="top-pattern"></div>
    </div>
    
    <div class="container">
      <div class="header-content">
        <!-- Logo区域 -->
        <router-link to="/" class="logo">
          <div class="logo-wrapper">
            <span class="logo-icon">🏜️</span>
            <div class="logo-text-group">
              <span class="logo-text">宁夏丝路非遗地理志</span>
              <span class="logo-sub">Ningxia Silk Road Heritage GIS</span>
            </div>
          </div>
        </router-link>
        
        <!-- 导航菜单 -->
        <nav class="nav-menu" :class="{ 'nav-open': isNavOpen }">
          <div class="nav-inner">
            <router-link 
              v-for="(item, index) in navItems" 
              :key="item.path" 
              :to="item.path"
              class="nav-link"
              :style="{ animationDelay: (index * 0.05) + 's' }"
              @click="closeNav"
            >
              <span class="nav-text">{{ item.name }}</span>
              <span class="nav-indicator"></span>
            </router-link>
          </div>
          
          <!-- 移动端关闭按钮 -->
          <button class="nav-close" @click="closeNav" v-if="isNavOpen">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </nav>
        
        <!-- 右侧工具栏 -->
        <div class="header-actions">
          <router-link to="/map" class="action-btn action-primary">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>进入地图</span>
          </router-link>
          
          <!-- 移动端菜单按钮 -->
          <button class="nav-toggle" @click="toggleNav">
            <span class="toggle-icon" :class="{ 'toggle-active': isNavOpen }">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 底部装饰线 -->
    <div class="header-bottom-line"></div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isNavOpen = ref(false)
const isScrolled = ref(false)

const navItems = [
  { path: '/', name: '首页' },
  { path: '/project', name: '项目概况' },
  { path: '/map', name: 'GIS地图' },
  { path: '/archive', name: '数字档案' },
  { path: '/study', name: '研学课程' },
  { path: '/creative', name: '文创展示' },
  { path: '/results', name: '项目成果' },
  { path: '/about', name: '关于我们' }
]

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}

const closeNav = () => {
  isNavOpen.value = false
}

// 滚动监听
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
// ============================================
// 头部主容器
// ============================================

.layout-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

// 顶部装饰条
.header-top-bar {
  height: 4px;
  background: linear-gradient(90deg, 
    var(--color-secondary) 0%, 
    var(--color-accent) 50%, 
    var(--color-secondary) 100%);
  position: relative;
  overflow: hidden;
  
  .top-pattern {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 20px,
      rgba(255, 255, 255, 0.3) 20px,
      rgba(255, 255, 255, 0.3) 40px
    );
    animation: patternMove 10s linear infinite;
  }
}

@keyframes patternMove {
  0% { transform: translateX(-40px); }
  100% { transform: translateX(0); }
}

// 头部主体
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  background: linear-gradient(
    135deg,
    rgba(93, 58, 26, 0.98) 0%,
    rgba(139, 69, 19, 0.98) 50%,
    rgba(160, 82, 45, 0.98) 100%
  );
  position: relative;
  
  // 丝绸纹理背景
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4A017' fill-opacity='0.05'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z'/%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
}

// 底部装饰线
.header-bottom-line {
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--color-secondary) 20%, 
    var(--color-secondary) 80%, 
    transparent);
  opacity: 0.5;
}

// 滚动效果
.header-scrolled {
  .header-content {
    padding: var(--spacing-sm) 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
}

// ============================================
// Logo区域
// ============================================

.logo {
  position: relative;
  z-index: 1;
  text-decoration: none;
  
  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-lg);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(212, 160, 23, 0.1);
    }
  }
  
  .logo-icon {
    font-size: 2rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    transition: transform 0.3s ease;
  }
  
  &:hover .logo-icon {
    transform: scale(1.1) rotate(-5deg);
  }
  
  .logo-text-group {
    display: flex;
    flex-direction: column;
  }
  
  .logo-text {
    font-size: 1.3rem;
    font-weight: 700;
    color: white;
    letter-spacing: 2px;
    font-family: var(--font-title);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    line-height: 1.2;
  }
  
  .logo-sub {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 1px;
    margin-top: 2px;
  }
  
  @media (max-width: 768px) {
    .logo-text {
      font-size: 1.1rem;
    }
    
    .logo-sub {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    .logo-text {
      font-size: 0.95rem;
    }
  }
}

// ============================================
// 导航菜单
// ============================================

.nav-menu {
  position: relative;
  z-index: 1;
  
  .nav-inner {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(0, 0, 0, 0.2);
    padding: 4px;
    border-radius: var(--radius-full);
  }
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--radius-full);
  transition: all 0.3s ease;
  white-space: nowrap;
  
  .nav-text {
    position: relative;
    z-index: 1;
  }
  
  .nav-indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 20px;
    height: 3px;
    background: var(--color-secondary);
    border-radius: var(--radius-full);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    
    .nav-indicator {
      transform: translateX(-50%) scaleX(1);
    }
  }
  
  &.router-link-active {
    color: white;
    background: rgba(212, 160, 23, 0.2);
    
    .nav-indicator {
      transform: translateX(-50%) scaleX(1);
      background: var(--color-secondary);
    }
  }
  
  &.router-link-exact-active {
    background: linear-gradient(135deg, var(--color-secondary), rgba(212, 160, 23, 0.8));
    color: white;
    box-shadow: 0 2px 8px rgba(212, 160, 23, 0.3);
    
    .nav-indicator {
      display: none;
    }
  }
}

// ============================================
// 右侧工具栏
// ============================================

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  
  svg {
    flex-shrink: 0;
  }
}

.action-primary {
  background: linear-gradient(135deg, var(--color-secondary), rgba(212, 160, 23, 0.9));
  color: white;
  box-shadow: 0 2px 8px rgba(212, 160, 23, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(212, 160, 23, 0.4);
    color: white;
  }
  
  @media (max-width: 1024px) {
    span {
      display: none;
    }
    
    padding: var(--spacing-sm);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
}

// ============================================
// 移动端菜单按钮
// ============================================

.nav-toggle {
  display: none;
  background: transparent;
  border: none;
  padding: var(--spacing-sm);
  cursor: pointer;
  
  .toggle-icon {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 24px;
    
    span {
      display: block;
      height: 2px;
      background: white;
      border-radius: 2px;
      transition: all 0.3s ease;
      
      &:nth-child(1) {
        width: 100%;
      }
      
      &:nth-child(2) {
        width: 70%;
      }
      
      &:nth-child(3) {
        width: 50%;
      }
    }
    
    &.toggle-active {
      span {
        &:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
          width: 100%;
        }
        
        &:nth-child(2) {
          opacity: 0;
        }
        
        &:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
          width: 100%;
        }
      }
    }
  }
}

.nav-close {
  display: none;
}

// ============================================
// 响应式设计
// ============================================

@media (max-width: 1200px) {
  .nav-menu {
    .nav-inner {
      background: transparent;
      padding: 0;
    }
  }
  
  .nav-link {
    padding: var(--spacing-sm);
    font-size: 0.9rem;
  }
}

@media (max-width: 992px) {
  .nav-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .nav-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    
    &.nav-open {
      opacity: 1;
      visibility: visible;
      
      .nav-inner {
        transform: translateX(0);
      }
    }
    
    .nav-inner {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 280px;
      flex-direction: column;
      align-items: stretch;
      background: linear-gradient(
        180deg,
        rgba(93, 58, 26, 0.99) 0%,
        rgba(139, 69, 19, 0.99) 100%
      );
      padding: 80px var(--spacing-lg) var(--spacing-lg);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      border-radius: 0;
      gap: 4px;
      overflow-y: auto;
    }
  }
  
  .nav-link {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-lg);
    font-size: 1rem;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .nav-indicator {
      display: none;
    }
    
    &.router-link-active,
    &.router-link-exact-active {
      background: rgba(212, 160, 23, 0.2);
      border-left: 3px solid var(--color-secondary);
      border-radius: var(--radius-lg);
    }
  }
  
  .nav-close {
    display: flex;
    position: fixed;
    top: var(--spacing-lg);
    right: var(--spacing-lg);
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: var(--spacing-sm);
    border-radius: var(--radius-full);
    cursor: pointer;
    z-index: 1001;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

@media (max-width: 576px) {
  .logo {
    .logo-wrapper {
      padding: var(--spacing-xs);
    }
    
    .logo-icon {
      font-size: 1.6rem;
    }
    
    .logo-text {
      font-size: 1rem;
    }
  }
}
</style>