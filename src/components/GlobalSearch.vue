<template>
  <Transition name="search-fade">
    <div v-if="isOpen" class="search-overlay" @mousedown.self="close">
      <div
        ref="panelRef"
        class="search-panel"
        role="dialog"
        aria-modal="true"
        aria-label="全站搜索"
        @keydown="onKeydown"
      >
        <div class="search-field">
          <Icon class="search-field__icon" icon="gis:zoom-in" width="20" height="20" />
          <input
            ref="inputRef"
            v-model="keyword"
            type="search"
            class="search-input"
            placeholder="搜索非遗项目、地区、类别或保护级别"
            aria-label="搜索非遗项目"
            autocomplete="off"
          />
          <button type="button" class="search-cancel" @click="close">取消</button>
        </div>

        <div class="search-body">
          <p v-if="!keyword.trim()" class="search-hint">
            共收录 <strong>{{ heritageData.length }}</strong> 项非遗项目，输入关键词开始检索。
          </p>

          <ul v-else-if="results.length" class="search-results" role="listbox" aria-label="搜索结果">
            <li
              v-for="(item, index) in results"
              :key="item.id"
              role="option"
              :aria-selected="index === activeIndex"
            >
              <button
                type="button"
                class="result-item"
                :class="{ 'is-active': index === activeIndex }"
                @mouseenter="activeIndex = index"
                @click="goToDetail(item)"
              >
                <span class="result-main">
                  <span class="result-name">{{ item.name }}</span>
                  <span class="result-meta">{{ item.category }} · {{ item.city }} · {{ item.level }}</span>
                </span>
                <span class="result-arrow" aria-hidden="true">→</span>
              </button>
            </li>
          </ul>

          <p v-else class="search-empty">未找到与「{{ keyword.trim() }}」相关的非遗项目。</p>

          <a href="/archive" class="search-all" @click.prevent="goToArchive">
            {{ keyword.trim() ? '在数字档案中查看相关项目 →' : '前往数字档案浏览全部项目 →' }}
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { heritageData } from '../data/heritageData'

const emit = defineEmits(['close', 'open'])
const router = useRouter()

const isOpen = ref(false)
const keyword = ref('')
const activeIndex = ref(0)

const panelRef = ref(null)
const inputRef = ref(null)

// 与资料库字段保持一致，覆盖名称、类别、地区、级别、简介与标签
const results = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  if (!query) return []

  return heritageData
    .filter((item) => {
      const haystack = [
        item.name,
        item.category,
        item.city,
        item.county,
        item.level,
        item.period,
        item.intro,
        ...(item.tags || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
    .slice(0, 8)
})

watch(keyword, () => {
  activeIndex.value = 0
})

const open = () => {
  isOpen.value = true
  emit('open')
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  keyword.value = ''
  activeIndex.value = 0
  emit('close')
}

const goToDetail = (item) => {
  close()
  router.push(`/archive/${item.id}`)
}

// 携带当前关键词进入档案页，保留检索上下文
const goToArchive = () => {
  const query = keyword.value.trim()
  close()
  router.push(query ? { path: '/archive', query: { q: query } } : '/archive')
}

const onKeydown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }

  if (event.key === 'ArrowDown' && results.value.length) {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % results.value.length
    return
  }

  if (event.key === 'ArrowUp' && results.value.length) {
    event.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + results.value.length) % results.value.length
    return
  }

  if (event.key === 'Enter' && results.value.length) {
    event.preventDefault()
    goToDetail(results.value[activeIndex.value])
    return
  }

  if (event.key !== 'Tab' || !panelRef.value) return

  const focusables = panelRef.value.querySelectorAll('input, a[href], button:not([disabled])')
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

// 打开时锁定滚动并聚焦输入框
watch(isOpen, async (openState) => {
  if (openState) {
    document.body.style.overflow = 'hidden'
    await nextTick()
    inputRef.value?.focus()
  } else {
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})

defineExpose({ open })
</script>

<style lang="scss" scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal-backdrop);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: clamp(80px, 12vh, 132px) var(--space-4) var(--space-8);
  background: rgba(46, 26, 15, 0.5);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.search-panel {
  position: relative;
  z-index: var(--z-modal);
  width: min(680px, 100%);
  max-height: calc(100dvh - 160px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-panel);
  box-shadow: var(--shadow-overlay);
}

.search-field {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: none;
  padding: var(--space-4) var(--space-4) var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-background);
}

.search-field__icon {
  flex: none;
  color: var(--color-primary);
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-family: var(--font-ui);
  font-size: 1rem;
  line-height: 1.4;
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }
}

.search-cancel {
  flex: none;
  height: 34px;
  padding: 0 var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--color-text-medium);
  font-family: var(--font-ui);
  font-size: 0.875rem;
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

.search-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) var(--space-3) var(--space-2);
}

.search-hint,
.search-empty {
  margin: 0;
  padding: var(--space-6) var(--space-4);
  color: var(--color-text-muted);
  font-size: var(--text-body-sm);
  line-height: var(--leading-normal);
  text-align: center;

  strong {
    color: var(--color-primary);
    font-weight: 600;
  }
}

.search-results {
  list-style: none;
  margin: 0;
  padding: 0;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-control);
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out);

  &:hover,
  &.is-active {
    background: var(--color-primary-soft);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
}

.result-main {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.result-name {
  color: var(--color-text);
  font-family: var(--font-ui);
  font-size: var(--text-body);
  font-weight: 600;
}

.result-meta {
  color: var(--color-text-muted);
  font-size: var(--text-caption);
}

.result-arrow {
  flex: none;
  color: var(--color-secondary-dark);
  font-size: 1rem;
}

.search-all {
  display: block;
  margin-top: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-border-light);
  color: var(--color-primary);
  font-size: var(--text-body-sm);
  text-align: center;
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--color-secondary-dark);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
    border-radius: var(--radius-control);
  }
}

// 过渡
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out);
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .search-overlay {
    padding: 12px;
  }

  .search-panel {
    max-height: calc(100dvh - 24px);
    border-radius: var(--radius-lg);
  }

  .search-field {
    padding: var(--space-3) var(--space-3) var(--space-3) var(--space-4);
  }
}
</style>
