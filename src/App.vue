<template>
  <div id="app">
    <a class="skip-link" href="#main">跳到主内容</a>
    <LayoutHeader />
    <main id="main" class="main-content" tabindex="-1">
      <router-view />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup>
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
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
