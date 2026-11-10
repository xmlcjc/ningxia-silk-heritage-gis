<template>
  <div
    v-if="model"
    class="scene-pip"
    :class="{ 'is-min': minimized }"
    :style="minimized ? { left: pos.x + 'px', top: pos.y + 'px' } : {}"
  >
    <!-- 标题栏（可拖动） -->
    <div class="pip-bar" @pointerdown="onDragStart">
      <span class="pip-dot"></span>
      <span class="pip-title">{{ item.name }} · {{ model.label || '三维场景' }}</span>
      <div class="pip-actions">
        <button class="pip-btn" type="button" :aria-label="minimized ? '展开' : '最小化'" @click.stop="minimized = !minimized">
          {{ minimized ? '□' : '—' }}
        </button>
        <button class="pip-btn pip-close" type="button" aria-label="关闭" @click.stop="$emit('close')">
          ×
        </button>
      </div>
    </div>

    <!-- 舞台 -->
    <div v-show="!minimized" class="pip-stage">
      <iframe
        v-if="frameSrc"
        class="pip-frame"
        :src="frameSrc"
        title="三维场景速览"
        allow="fullscreen"
      />
      <div class="pip-foot">
        <button class="pip-link" type="button" @click="goFull">查看完整档案 →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  // 非遗条目（需含 models 数组）
  item: { type: Object, required: true }
})
defineEmits(['close'])

const router = useRouter()
const minimized = ref(false)
// 拖动位置（默认右下角由 CSS 定位，拖动后转为内联定位）
const pos = ref({ x: 0, y: 0 })
let dragging = false
let offsetX = 0
let offsetY = 0

const model = computed(() => props.item?.models?.[0] || null)

// 与 ArtifactViewer 同构：.sog 地址 + 同名 .settings.json 初始视角，复用自托管嵌入页
const frameSrc = computed(() => {
  if (!model.value) return ''
  const params = new URLSearchParams({
    content: model.value.url,
    settings: model.value.url.replace(/\.sog$/i, '.settings.json'),
    lang: 'zh-CN'
  })
  return `/viewer-embed.html?${params.toString()}`
})

const goFull = () => {
  if (props.item?.id) router.push(`/archive/${props.item.id}`)
}

const onDragStart = (e) => {
  // 首次拖动：把 CSS 右下角定位换算成内联坐标，之后跟随指针
  const rect = e.currentTarget.parentElement.getBoundingClientRect()
  pos.value = { x: rect.left, y: rect.top }
  dragging = true
  offsetX = e.clientX - rect.left
  offsetY = e.clientY - rect.top
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onDragEnd, { once: true })
}

const onDragMove = (e) => {
  if (!dragging) return
  const maxX = window.innerWidth - 120
  const maxY = window.innerHeight - 40
  pos.value = {
    x: Math.min(Math.max(e.clientX - offsetX, 0), maxX),
    y: Math.min(Math.max(e.clientY - offsetY, 0), maxY)
  }
}

const onDragEnd = () => {
  dragging = false
  window.removeEventListener('pointermove', onDragMove)
}
</script>

<style lang="scss" scoped>
// 画中画浮窗：锚定地图视口右下角，暗金边框呼应大屏鎏金主题
.scene-pip {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 360px;
  z-index: 900;              // 高于 Leaflet 控件（z 1000 以下的内部面板），不越出地图视口
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: linear-gradient(160deg, #241a12, #17120d);
  border: 1px solid rgba(212, 160, 23, 0.55);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  animation: pip-in 0.32s var(--ease-out);

  &.is-min {
    right: auto;
    bottom: auto;
    width: 240px;
  }

  @media (max-width: 768px) {
    width: calc(100% - 24px);
    right: 12px;
    left: auto;
  }
}

@keyframes pip-in {
  from { opacity: 0; transform: translateY(14px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.pip-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.35);
  cursor: grab;
  user-select: none;

  &:active { cursor: grabbing; }
}

.pip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-secondary);
  box-shadow: 0 0 6px rgba(212, 160, 23, 0.8);
  flex: none;
}

.pip-title {
  flex: 1;
  min-width: 0;
  color: #f3e3c0;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pip-actions { display: flex; gap: 4px; }

.pip-btn {
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(243, 227, 192, 0.85);
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s var(--ease-out);

  &:hover { background: rgba(212, 160, 23, 0.35); }
}

.pip-close:hover { background: rgba(198, 40, 40, 0.65); }

.pip-stage { position: relative; }

.pip-frame {
  display: block;
  width: 100%;
  height: 225px;
  border: 0;
  background: #12100c;
}

.pip-foot {
  display: flex;
  justify-content: flex-end;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.25);
  border-top: 1px solid rgba(212, 160, 23, 0.18);
}

.pip-link {
  border: none;
  background: transparent;
  color: var(--color-secondary);
  font-size: 12px;
  cursor: pointer;
  padding: 2px 4px;
  transition: color 0.2s var(--ease-out);

  &:hover { color: #f3e3c0; text-decoration: underline; }
}
</style>
