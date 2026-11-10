<template>
  <div class="app-shell">
    <a class="skip-link" href="#main">跳到主内容</a>
    <LayoutHeader v-if="!isFullscreen" />
    <main id="main" class="main-content" tabindex="-1">
      <router-view v-slot="{ Component }">
        <transition name="page-shift" mode="out-in" @enter="refresh">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <LayoutFooter v-if="!isFullscreen" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import { usePageMotion } from './composables/usePageMotion'

// 全屏页（如三维大屏）不显示主站页头页脚
const route = useRoute()
const isFullscreen = computed(() => route.meta.fullscreen)

// 路由切换后在进入阶段扫描新页面，驱动 reveal / 轻量视差
const { refresh } = usePageMotion()
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  /* 预留首屏高度，避免异步路由内容挂载时把页脚顶入视口造成 CLS */
  min-height: 100vh;
}

/* 路由转场：离场 160ms，入场 250ms（只动 opacity / transform） */
.page-shift-enter-active {
  transition:
    opacity var(--motion-base) var(--ease-out),
    transform var(--motion-base) var(--ease-out);
}
.page-shift-leave-active {
  transition:
    opacity var(--motion-fast) var(--ease-out),
    transform var(--motion-fast) var(--ease-out);
}
.page-shift-enter-from {
  opacity: 0;
  transform: translate3d(0, 8px, 0);
}
.page-shift-leave-to {
  opacity: 0;
  transform: translate3d(0, -4px, 0);
}

@media (prefers-reduced-motion: reduce) {
  .page-shift-enter-from,
  .page-shift-leave-to {
    transform: none;
  }
}
</style>
