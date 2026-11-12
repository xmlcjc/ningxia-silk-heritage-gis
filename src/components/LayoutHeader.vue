<template>
  <header class="layout-header" :class="{ 'is-scrolled': isScrolled, 'is-nav-open': isNavOpen }">
    <div class="header-bar">
      <div class="container header-content">
        <!-- 品牌入口：徽标 + 站名 -->
        <router-link to="/" class="brand" aria-label="宁夏丝路非遗地理志 · 返回首页">
          <span class="brand-mark" aria-hidden="true">
            <img src="/logo-gold.svg" alt="" />
          </span>
          <span class="brand-copy">
            <span class="brand-name">宁夏丝路非遗地理志</span>
            <span class="brand-en">Ningxia Silk Road Heritage GIS</span>
          </span>
        </router-link>

        <!-- 桌面端主导航：与真实路由一一对应 -->
        <nav class="primary-nav" aria-label="主导航">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ 'is-active': isActive(item.path) }"
            :aria-current="isActive(item.path) ? 'page' : undefined"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- 右侧：搜索 + 进入地图 + 移动菜单 -->
        <div class="header-actions">
          <button
            ref="searchButton"
            type="button"
            class="header-action search-trigger"
            aria-label="搜索非遗项目"
            aria-haspopup="dialog"
            :aria-expanded="isSearchOpen"
            @click="openSearch"
          >
            <Icon icon="gis:zoom-in" width="17" height="17" />
            <span class="action-label">搜索</span>
          </button>

          <router-link to="/map" class="header-cta">
            <Icon icon="gis:poi" width="15" height="15" />
            <span>进入地图</span>
          </router-link>

          <button
            ref="menuToggle"
            type="button"
            class="menu-toggle"
            :class="{ 'is-open': isNavOpen }"
            :aria-expanded="isNavOpen"
            aria-controls="mobile-nav"
            :aria-label="isNavOpen ? '关闭导航菜单' : '打开导航菜单'"
            @click="toggleNav"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端抽屉导航 -->
    <Transition name="nav-backdrop">
      <div v-if="isNavOpen" class="nav-backdrop" aria-hidden="true" @click="closeNav"></div>
    </Transition>

    <Transition name="nav-panel">
      <aside
        v-if="isNavOpen"
        id="mobile-nav"
        ref="drawerRef"
        class="nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="站点导航"
        @keydown="onDrawerKeydown"
      >
        <div class="drawer-head">
          <span class="drawer-title">导航</span>
          <button
            ref="drawerClose"
            type="button"
            class="drawer-close"
            aria-label="关闭导航菜单"
            @click="closeNav"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>

        <nav class="drawer-nav" aria-label="移动端主导航">
          <router-link
            v-for="(item, index) in navItems"
            :key="item.path"
            :to="item.path"
            class="drawer-link"
            :class="{ 'is-active': isActive(item.path) }"
            :aria-current="isActive(item.path) ? 'page' : undefined"
            @click="closeNav"
          >
            <span class="drawer-link__index">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="drawer-link__name">{{ item.name }}</span>
          </router-link>
        </nav>

        <div class="drawer-foot">
          <button type="button" class="btn btn-primary btn-block" @click="openSearchFromDrawer">
            <Icon icon="gis:zoom-in" width="17" height="17" />
            搜索非遗项目
          </button>
          <router-link to="/map" class="btn btn-secondary btn-block" @click="closeNav">
            <Icon icon="gis:map" width="17" height="17" />
            进入 GIS 地图
          </router-link>
        </div>
      </aside>
    </Transition>

    <!-- 全站搜索面板 -->
    <GlobalSearch ref="searchPanel" @open="isSearchOpen = true" @close="onSearchClose" />
  </header>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import GlobalSearch from './GlobalSearch.vue'

const route = useRoute()

const isNavOpen = ref(false)
const isSearchOpen = ref(false)
const isScrolled = ref(false)

const searchButton = ref(null)
const menuToggle = ref(null)
const drawerRef = ref(null)
const drawerClose = ref(null)
const searchPanel = ref(null)

// 导航结构保持与真实路由一致，不删减入口
const navItems = [
  { path: '/', name: '首页' },
  { path: '/project', name: '项目概况' },
  { path: '/map', name: 'GIS地图' },
  { path: '/screen', name: '3D大屏' },
  { path: '/archive', name: '数字档案' },
  { path: '/about', name: '关于我们' }
]

// 当前路由判定：档案详情页仍归属「数字档案」
const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path + '/')
}

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}

const closeNav = () => {
  if (!isNavOpen.value) return
  isNavOpen.value = false
  nextTick(() => menuToggle.value?.focus())
}

const openSearch = () => {
  searchPanel.value?.open()
}

// 关闭搜索：同步 aria-expanded 并恢复到触发按钮
const onSearchClose = () => {
  isSearchOpen.value = false
  restoreSearchFocus()
}

const openSearchFromDrawer = () => {
  isNavOpen.value = false
  nextTick(() => searchPanel.value?.open())
}

// 搜索关闭后把焦点交回触发按钮，保证键盘操作连续
const restoreSearchFocus = () => {
  nextTick(() => searchButton.value?.focus())
}

// 抽屉打开时锁定页面滚动，关闭时恢复
watch(isNavOpen, async (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    await nextTick()
    drawerClose.value?.focus()
  } else {
    document.body.style.overflow = ''
  }
})

// 路由切换后自动收起抽屉，避免菜单遮住新页面
watch(
  () => route.fullPath,
  () => {
    isNavOpen.value = false
  }
)

// 抽屉内键盘行为：Esc 关闭、Tab 焦点循环
const onDrawerKeydown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeNav()
    return
  }
  if (event.key !== 'Tab' || !drawerRef.value) return

  const focusables = drawerRef.value.querySelectorAll('a[href], button:not([disabled])')
  if (!focusables.length) return

  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 8
}

// 桌面宽度恢复时自动关闭抽屉
const handleResize = () => {
  if (window.innerWidth > 1000) isNavOpen.value = false
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
// ============================================
// 头部容器：暖白宣纸底 + 细腻分隔线
// ============================================

.layout-header {
  position: sticky;
  top: 0;
  z-index: 1000; // 需高于 Leaflet 地图控件与页面浮层
}

.header-bar {
  background: rgba(255, 251, 242, 0.9);
  backdrop-filter: blur(14px) saturate(1.1);
  -webkit-backdrop-filter: blur(14px) saturate(1.1);
  border-bottom: 1px solid var(--color-border-light);
  transition:
    background-color var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out),
    border-color var(--duration-normal) var(--ease-out);
}

// 滚动后提高不透明度并追加轻微阴影
.is-scrolled .header-bar {
  background: rgba(255, 251, 242, 0.97);
  border-bottom-color: rgba(139, 69, 19, 0.1);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.7) inset,
    0 8px 24px rgba(62, 39, 35, 0.08);
}

.header-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: var(--space-4);
  height: 72px;
}

// ============================================
// 品牌入口
// ============================================

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  justify-self: start;
  padding: 6px;
  margin-left: -6px;
  border-radius: var(--radius-control);
  text-decoration: none;
  transition: background-color var(--duration-fast) var(--ease-out);

  &:hover {
    background: var(--color-primary-soft);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--color-primary-dark), var(--color-primary));
  box-shadow:
    inset 0 0 0 1px rgba(201, 168, 76, 0.45),
    0 2px 6px rgba(62, 39, 35, 0.18);

  img {
    display: block;
    width: 27px;
    height: 27px;
    object-fit: contain;
  }
}

.brand-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.2;
}

.brand-name {
  font-family: var(--font-sub);
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--color-primary);
  white-space: nowrap;
}

.brand-en {
  margin-top: 3px;
  font-family: var(--font-en);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  white-space: nowrap;
}

// ============================================
// 主导航
// ============================================

.primary-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  justify-self: center;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 9px 12px;
  border-radius: 6px;
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-medium);
  white-space: nowrap;
  text-decoration: none;
  transition:
    color var(--duration-fast) var(--ease-out),
    background-color var(--duration-fast) var(--ease-out);

  // 选中指示线：鎏金细线，hover 时淡入
  &::after {
    content: '';
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 3px;
    height: 2px;
    border-radius: 2px;
    background: var(--color-secondary);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform var(--duration-normal) var(--ease-out);
  }

  &:hover {
    color: var(--color-primary);
    background: var(--color-primary-soft);

    &::after {
      transform: scaleX(0.55);
      opacity: 0.6;
    }
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  &.is-active {
    color: var(--color-primary);
    font-weight: 600;

    &::after {
      transform: scaleX(1);
      opacity: 1;
    }
  }
}

// ============================================
// 右侧操作区
// ============================================

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-self: end;
}

.header-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-control);
  background: rgba(255, 255, 255, 0.55);
  color: var(--color-text-medium);
  font-family: var(--font-ui);
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);

  &:hover {
    background: var(--color-primary-soft);
    border-color: var(--color-border);
    color: var(--color-primary);
  }

  &:active {
    background: var(--color-secondary-soft);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
}

.header-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 16px;
  border-radius: var(--radius-control);
  background: var(--color-secondary);
  color: var(--color-gold-ink);
  font-family: var(--font-ui);
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  box-shadow: var(--shadow-xs);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);

  &:hover {
    background: var(--color-secondary-hover);
    color: var(--color-gold-ink);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  &:active {
    background: var(--color-secondary-active);
    transform: translateY(0);
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
}

// ============================================
// 移动端菜单按钮
// ============================================

.menu-toggle {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  background: transparent;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out);

  span {
    display: block;
    width: 20px;
    height: 1.5px;
    border-radius: 2px;
    background: var(--color-primary);
    transition:
      transform var(--duration-normal) var(--ease-out),
      opacity var(--duration-fast) var(--ease-out),
      width var(--duration-normal) var(--ease-out);
  }

  &:hover {
    background: var(--color-primary-soft);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  &.is-open {
    span:nth-child(1) {
      transform: translateY(6.5px) rotate(45deg);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      transform: translateY(-6.5px) rotate(-45deg);
    }
  }
}

// ============================================
// 移动端抽屉导航
// ============================================

.nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal-backdrop);
  background: var(--color-overlay);
}

.nav-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
  width: min(340px, 88vw);
  height: 100dvh;
  background: var(--color-paper);
  box-shadow: var(--shadow-overlay);
  border-left: 1px solid var(--color-border-light);
  overscroll-behavior: contain;
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: none;
  padding: var(--space-4) var(--space-4) var(--space-3) var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
}

.drawer-title {
  font-family: var(--font-sub);
  font-size: var(--text-h4);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  color: var(--color-primary);
}

.drawer-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--color-text-medium);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);

  &:hover {
    background: var(--color-primary-soft);
    color: var(--color-primary);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
}

.drawer-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) var(--space-4);
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 52px;
  padding: 0 var(--space-4);
  border-radius: var(--radius-control);
  border-left: 3px solid transparent;
  color: var(--color-text);
  font-family: var(--font-ui);
  font-size: 1.0625rem;
  text-decoration: none;
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);

  & + & {
    margin-top: 2px;
  }

  &__index {
    font-family: var(--font-en);
    font-size: 0.6875rem;
    letter-spacing: var(--tracking-wide);
    color: var(--color-gold-refined);
    min-width: 20px;
  }

  &:hover {
    background: var(--color-primary-soft);
    color: var(--color-primary);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  &.is-active {
    background: var(--color-primary-soft);
    border-left-color: var(--color-secondary);
    color: var(--color-primary);
    font-weight: 600;

    .drawer-link__index {
      color: var(--color-secondary-dark);
    }
  }
}

.drawer-foot {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: none;
  padding: var(--space-4);
  border-top: 1px solid var(--color-border-light);
  background: var(--color-background);
}

// 抽屉过渡
.nav-backdrop-enter-active,
.nav-backdrop-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out);
}

.nav-backdrop-enter-from,
.nav-backdrop-leave-to {
  opacity: 0;
}

.nav-panel-enter-active,
.nav-panel-leave-active {
  transition: transform var(--duration-normal) var(--ease-out);
}

.nav-panel-enter-from,
.nav-panel-leave-to {
  transform: translateX(100%);
}

// ============================================
// 响应式
// ============================================

@media (max-width: 1180px) {
  .brand-en {
    display: none;
  }

  .nav-link {
    padding: 9px 9px;
    font-size: 0.875rem;

    &::after {
      left: 9px;
      right: 9px;
    }
  }
}

@media (max-width: 1000px) {
  .header-content {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .primary-nav {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }
}

@media (max-width: 768px) {
  .header-content {
    height: 64px;
    gap: var(--space-2);
  }

  // 移动端入口按钮保持 ≥44 热区
  .header-action,
  .header-cta {
    min-height: 44px;
  }

  .brand {
    padding: 4px;
    margin-left: -4px;
  }

  .brand-mark {
    width: 36px;
    height: 36px;

    img {
      width: 24px;
      height: 24px;
    }
  }

  .brand-name {
    font-size: 1rem;
    letter-spacing: 0.04em;
  }

  .header-action {
    width: 44px;
    height: 44px;
    padding: 0;
  }

  .action-label {
    display: none;
  }

  .header-cta {
    display: none;
  }
}

@media (max-width: 380px) {
  .brand-name {
    font-size: 0.9375rem;
  }
}
</style>
