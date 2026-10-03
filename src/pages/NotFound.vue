<template>
  <div class="notfound-page">
    <div class="nf-bg-pattern"></div>

    <div class="nf-content">
      <div class="nf-404">
        <span class="digit">4</span>
        <Icon class="compass" icon="gis:compass-rose" width="72" height="72" />
        <span class="digit">4</span>
      </div>

      <h1 class="nf-title">古道迷踪</h1>
      <p class="nf-desc">
        您寻访的页面已湮没在漫漫黄沙之中……<br />
        或许它从未存在，或许已随驼铃声远去。
      </p>

      <div class="nf-actions">
        <router-link to="/" class="nf-btn btn-primary">
          <Icon icon="gis:home" width="17" height="17" /> 返回首页
        </router-link>
        <router-link to="/map" class="nf-btn btn-secondary">
          <Icon icon="gis:map" width="17" height="17" /> 打开 GIS 地图
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 404 兜底页面：无路由匹配时展示
import { Icon } from '@iconify/vue'
</script>

<style lang="scss" scoped>
.notfound-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(180deg, #F5EFE4 0%, #E8DCC8 100%);
  padding: var(--spacing-xl);
}

.nf-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(212, 160, 23, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.1) 0%, transparent 40%);
  pointer-events: none;
}

.nf-content {
  position: relative;
  text-align: center;
  max-width: 560px;
}

.nf-404 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: var(--spacing-lg);

  .digit {
    font-size: 96px;
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1;
    text-shadow: 0 4px 12px rgba(62, 39, 35, 0.2);
  }

  .compass {
    font-size: 72px;
    animation: nf-spin 6s linear infinite;
  }
}

@keyframes nf-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.nf-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--spacing-md);
  letter-spacing: 6px;
}

.nf-desc {
  font-size: 15px;
  color: var(--color-text-muted);
  line-height: 1.9;
  margin: 0 0 var(--spacing-xl);
}

.nf-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.nf-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.25s var(--ease-out),
    color 0.25s var(--ease-out),
    box-shadow 0.25s var(--ease-out),
    transform 0.25s var(--ease-out);

  &.btn-primary {
    background: var(--color-primary);
    color: #fff;

    &:hover {
      background: #5D4037;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(62, 39, 35, 0.3);
    }
  }

  &.btn-secondary {
    background: var(--color-secondary);
    color: #fff;

    &:hover {
      background: #B88F14;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(212, 160, 23, 0.35);
    }
  }
}

@media (max-width: 768px) {
  .nf-404 {
    .digit { font-size: 64px; }
    .compass { font-size: 48px; }
  }

  .nf-title { font-size: 24px; }
  .nf-btn { width: 100%; justify-content: center; }
}
</style>
