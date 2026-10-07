<template>
  <div id="app">
    <a class="skip-link" href="#main">跳到主内容</a>
    <LayoutHeader v-if="!isFullscreen" />
    <main id="main" class="main-content" tabindex="-1">
      <router-view />
    </main>
    <LayoutFooter v-if="!isFullscreen" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'

// 全屏页（如三维大屏）不显示主站页头页脚
const route = useRoute()
const isFullscreen = computed(() => route.meta.fullscreen)
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
}
</style>
