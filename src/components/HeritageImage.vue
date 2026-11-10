<template>
  <span
    class="h-image"
    :class="{ 'is-loaded': loaded, 'is-failed': failed, 'is-portrait': portrait }"
    :style="rootStyle"
  >
    <span class="h-image__ph" aria-hidden="true">
      <span class="h-image__char">{{ fallbackChar || alt.charAt(0) }}</span>
      <span v-if="failed" class="h-image__msg" role="status">{{ fallbackText }}</span>
    </span>
    <img
      v-if="!failed"
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      :style="{ objectPosition: position }"
      @load="onLoad"
      @error="onError"
    />
  </span>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  // 容器比例；留空表示撑满父容器（用于固定尺寸的缩略图位置）
  ratio: { type: String, default: '4 / 3' },
  position: { type: String, default: 'center' },
  eager: { type: Boolean, default: false },
  // 竖幅图片自动改为等比完整显示，避免为填满画幅而裁掉主体
  adaptive: { type: Boolean, default: true },
  fallbackChar: { type: String, default: '' },
  fallbackText: { type: String, default: '图片加载失败' }
})

const loaded = ref(false)
const failed = ref(false)
const portrait = ref(false)

const rootStyle = computed(() => (props.ratio ? { aspectRatio: props.ratio } : null))

const onLoad = (event) => {
  const img = event.target
  if (props.adaptive && img.naturalWidth && img.naturalHeight) {
    portrait.value = img.naturalHeight > img.naturalWidth * 1.15
  }
  loaded.value = true
}

const onError = () => {
  failed.value = true
  loaded.value = false
}

watch(
  () => props.src,
  () => {
    loaded.value = false
    failed.value = false
    portrait.value = false
  }
)
</script>

<style scoped>
.h-image {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-surface);
}

.h-image img {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s var(--ease-out, ease), transform 0.5s var(--ease-out, ease);
}

.h-image.is-loaded img {
  opacity: 1;
}

.h-image.is-portrait img {
  object-fit: contain;
}

/* 统一占位：暖纸底 + 项目首字，图片载入后淡出 */
.h-image__ph {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: linear-gradient(150deg, var(--color-surface), var(--color-sand));
}

.h-image__char {
  font-family: var(--font-title);
  font-size: 2.4rem;
  line-height: 1;
  color: rgba(139, 69, 19, 0.28);
}

.h-image.is-failed .h-image__char {
  color: rgba(139, 69, 19, 0.5);
}

.h-image__msg {
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .h-image img {
    transition: none;
  }
}
</style>
