<template>
  <div v-if="models.length" class="artifact-viewer">
    <!-- 三维舞台 -->
    <div class="av-stage">
      <img
        v-if="!live && active.poster && !posterFailed"
        class="av-poster"
        :src="active.poster"
        alt="场景预览"
        @error="posterFailed = true"
      >

      <!-- 载入前：封面遮罩 + 载入入口 -->
      <div v-if="!live" class="av-veil">
        <span class="av-veil-icon"><Icon icon="gis:cube-3d" width="34" height="34" /></span>
        <button v-if="webglOk" class="av-launch" type="button" @click="launch">
          <Icon icon="gis:cube-3d" width="16" height="16" class="vam" />
          载入三维场景
        </button>
        <p v-else class="av-tip">当前浏览器不支持 WebGL，暂无法查看场景</p>
      </div>

      <!-- 载入后：SuperSplat 查看器 -->
      <iframe
        v-else
        class="av-frame"
        :src="frameSrc"
        title="场景展示"
        allow="fullscreen"
        @load="frameLoading = false"
      />

      <div v-if="live && frameLoading" class="av-loading">
        <span class="av-spinner" aria-hidden="true"></span>
        <span>正在载入场景数据…</span>
      </div>
    </div>

    <!-- 同条目多模型切换 -->
    <div v-if="models.length > 1" class="av-tabs" role="tablist">
      <button
        v-for="(item, index) in models"
        :key="item.url"
        class="av-tab"
        :class="{ 'is-on': index === activeIndex }"
        type="button"
        role="tab"
        :aria-selected="index === activeIndex"
        @click="selectModel(index)"
      >
        {{ item.label || `模型 ${index + 1}` }}
      </button>
    </div>

    <!-- 来源登记 -->
    <p v-if="active.credit" class="av-credit">场景来源：{{ active.credit }}</p>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  // [{ type, url, poster, label, credit }]
  models: { type: Array, default: () => [] }
})

const activeIndex = ref(0)
const live = ref(false)
const frameLoading = ref(false)
const webglOk = ref(true)
const reduceMotion = ref(false)
const posterFailed = ref(false)

const active = computed(() => props.models[activeIndex.value] || {})

// 查看器以文件名后缀判定模型格式，因此这里透传 .sog 地址
// 初始相机用与模型同名的 .settings.json（构建期生成），复现原图拍摄视角，
// 避免从穿帮角度展示「照片转 3DGS」的场景模型
const frameSrc = computed(() => {
  const params = new URLSearchParams({
    content: active.value.url,
    settings: active.value.url.replace(/\.sog$/i, '.settings.json'),
    lang: 'zh-CN'
  })
  if (active.value.poster) params.set('poster', active.value.poster)
  if (reduceMotion.value) params.set('noanim', '')
  return `/viewer/index.html?${params.toString()}`
})

const launch = () => {
  frameLoading.value = true
  live.value = true
}

const selectModel = (index) => {
  if (index === activeIndex.value) return
  activeIndex.value = index
  posterFailed.value = false
  // 已载入时切换模型 -> 重新请求查看器
  if (live.value) frameLoading.value = true
}

const detectWebgl = () => {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

onMounted(() => {
  webglOk.value = detectWebgl()
  reduceMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
})

// 卸载时销毁 iframe，释放 WebGL 上下文与显存
onBeforeUnmount(() => {
  live.value = false
})
</script>

<style lang="scss" scoped>
.artifact-viewer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.av-stage {
  position: relative;
  aspect-ratio: 16 / 10;
  min-height: 280px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: linear-gradient(135deg, #2a1f17, #171210);

  @media (max-width: 768px) {
    aspect-ratio: 4 / 3;
    min-height: 240px;
  }
}

.av-poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.av-veil {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  background: linear-gradient(180deg, rgba(23, 18, 16, 0.55), rgba(23, 18, 16, 0.85));

  .av-veil-icon {
    color: rgba(240, 192, 64, 0.85);
    line-height: 0;
  }
}

.av-launch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 26px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-secondary);
  color: var(--color-gold-ink);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 3px;
  }
}

.av-tip {
  margin: 0;
  padding: 0 var(--spacing-lg);
  text-align: center;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
}

.av-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.av-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(23, 18, 16, 0.9);
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
}

.av-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(240, 192, 64, 0.3);
  border-top-color: var(--color-secondary);
  border-radius: 50%;
  animation: av-spin 0.8s linear infinite;
}

@keyframes av-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .av-spinner { animation-duration: 2.4s; }
  .av-launch:hover { transform: none; }
}

.av-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.av-tab {
  padding: 8px 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.3s var(--ease-out), color 0.3s var(--ease-out);

  &:hover {
    border-color: var(--color-secondary);
    color: var(--color-secondary);
  }

  &.is-on {
    border-color: var(--color-secondary);
    background: rgba(212, 160, 23, 0.14);
    color: var(--color-secondary-dark);
    font-weight: 600;
  }
}

.av-credit {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>