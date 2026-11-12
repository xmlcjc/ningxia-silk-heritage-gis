<template>
  <div class="archive-page">
    <!-- ==================== 页头：档案编目 ==================== -->
    <header class="archive-head">
      <div class="container" data-reveal-stagger>
        <p class="arch-eyebrow"><span class="arch-eyebrow__no">02</span>数字档案 · HERITAGE ARCHIVE</p>
        <h1 class="arch-title">宁夏丝路非物质文化遗产</h1>
        <p class="arch-lead">
          按遗产类别、所在地市与历史时期编目，收录宁夏境内与丝绸之路相关的代表性非遗项目。
          每一项档案都保留它的技艺脉络、文化记忆与地图位置。
        </p>
        <dl class="arch-stats">
          <div class="arch-stat">
            <dt>收录项目</dt>
            <dd><strong>{{ heritageData.length }}</strong><span>项</span></dd>
          </div>
          <div class="arch-stat">
            <dt>遗产类别</dt>
            <dd><strong>{{ categories.length - 1 }}</strong><span>类</span></dd>
          </div>
          <div class="arch-stat">
            <dt>覆盖地市</dt>
            <dd><strong>{{ cities.length - 1 }}</strong><span>市</span></dd>
          </div>
        </dl>
      </div>
    </header>

    <div class="archive-main">
      <div class="container">
        <!-- ==================== 分类入口 ==================== -->
        <div class="cat-rail" role="tablist" aria-label="按遗产类别筛选" data-reveal data-reveal-delay="80">
          <button
            v-for="(tab, index) in categoryTabs"
            :id="`archive-tab-${index}`"
            :key="tab.name"
            type="button"
            role="tab"
            class="cat-tab"
            :class="{ 'is-active': filterCategory === tab.value }"
            :aria-selected="filterCategory === tab.value"
            :aria-controls="'archive-results'"
            :tabindex="activeTabIndex === index ? 0 : -1"
            @click="setCategory(tab.value)"
            @keydown="onTabKeydown($event, index)"
          >
            {{ tab.name }}
            <span class="cat-tab__count">{{ tab.count }}</span>
          </button>
        </div>

        <!-- ==================== 检索工具 ==================== -->
        <div class="archive-tools" data-reveal data-reveal-delay="140">
          <div class="tools-search">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索项目名称或简介"
              clearable
              class="search-input"
              aria-label="搜索非遗项目"
            >
              <template #prefix>
                <Icon class="search-icon" icon="gis:zoom-in" width="17" height="17" />
              </template>
            </el-input>
          </div>

          <div class="tools-filters">
            <el-select v-model="filterCity" placeholder="所在地市" clearable class="filter-select" aria-label="按地市筛选">
              <el-option v-for="city in cities.slice(1)" :key="city" :label="city" :value="city" />
            </el-select>

            <el-select v-model="filterPeriod" placeholder="历史时期" clearable class="filter-select" aria-label="按时期筛选">
              <el-option v-for="period in periods.slice(1)" :key="period" :label="period" :value="period" />
            </el-select>

            <el-select v-model="sortBy" placeholder="排序方式" class="filter-select" aria-label="排序方式">
              <el-option label="最新收录" value="new" />
              <el-option label="保护级别" value="level" />
              <el-option label="按地区" value="city" />
            </el-select>

            <button type="button" class="tools-reset" :disabled="!hasConditions" @click="resetFilters">
              <Icon icon="gis:rotate" width="14" height="14" />
              清空条件
            </button>
          </div>
        </div>

        <!-- ==================== 结果统计与已选条件 ==================== -->
        <div
          id="archive-results"
          role="tabpanel"
          :aria-labelledby="`archive-tab-${activeTabIndex}`"
        >
        <div class="result-bar">
          <p class="result-count" role="status" aria-live="polite" aria-atomic="true">
            共 <strong>{{ filteredData.length }}</strong> 项
            <span class="result-scope">· {{ scopeLabel }}</span>
            <span v-if="!filteredData.length" class="sr-only">没有符合条件的项目</span>
          </p>

          <ul v-if="activeConditions.length" class="result-chips" aria-label="已选筛选条件">
            <li v-for="cond in activeConditions" :key="cond.key">
              <button type="button" class="chip" @click="cond.clear">
                {{ cond.label }}
                <span class="chip__x" aria-hidden="true">×</span>
                <span class="sr-only">移除该条件</span>
              </button>
            </li>
            <li>
              <button type="button" class="chip chip--clear" @click="resetFilters">全部清空</button>
            </li>
          </ul>
          <p v-else class="result-hint">可按类别、地市与时期组合检索</p>
        </div>

        <!-- ==================== 档案列表 ==================== -->
        <div v-if="paginatedData.length" class="heritage-grid" data-reveal-stagger>
          <router-link
            v-for="item in paginatedData"
            :key="item.id"
            :to="`/archive/${item.id}`"
            class="h-card"
            :aria-label="`查看 ${item.name} 项目档案`"
          >
            <span class="h-card__media">
              <HeritageImage
                :src="item.thumbImage || item.coverImage"
                :alt="item.name"
                :fallback-char="item.name.charAt(0)"
              />
              <span class="h-card__level" :class="`is-${levelKey(item.level)}`">
                <span class="h-card__level-dot" aria-hidden="true"></span>
                {{ item.level }}
              </span>
            </span>

            <span class="h-card__body">
              <span class="h-card__top">
                <span class="h-card__cat">{{ item.category }}</span>
                <span class="h-card__period">{{ item.period }}</span>
              </span>

              <span class="h-card__title">{{ item.name }}</span>
              <span class="h-card__excerpt">{{ item.intro }}</span>

              <span class="h-card__foot">
                <span class="h-card__loc">
                  <Icon icon="gis:poi" width="13" height="13" />
                  {{ item.city }} · {{ item.county }}
                </span>
                <span class="h-card__more">阅读档案 <i aria-hidden="true">→</i></span>
              </span>
            </span>
          </router-link>
        </div>

        <!-- ==================== 空结果 ==================== -->
        <div v-else class="empty-state">
          <span class="empty-state__mark" aria-hidden="true">空</span>
          <h2>没有符合当前条件的项目</h2>
          <p>{{ emptyHint }}</p>
          <button type="button" class="btn btn-primary" @click="resetFilters">清除所有筛选</button>
        </div>

        <!-- ==================== 分页 ==================== -->
        <div v-if="totalPages > 1" class="pagination-section" data-reveal>
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredData.length"
            layout="prev, pager, next"
            class="custom-pagination"
          />
          <p class="pagination-info">第 {{ currentPage }} / {{ totalPages }} 页 · 每页 {{ pageSize }} 项</p>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { ElInput, ElSelect, ElOption, ElPagination } from 'element-plus'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/pagination/style/css'
import HeritageImage from '../components/HeritageImage.vue'
import { heritageData, categories, cities, periods } from '../data/heritageData'

const route = useRoute()
const router = useRouter()

const pick = (value, list) => (list.includes(value) ? value : '')

const searchKeyword = ref(String(route.query.q || ''))
const filterCategory = ref(pick(String(route.query.category || ''), categories.slice(1)))
const filterCity = ref(pick(String(route.query.city || ''), cities.slice(1)))
const filterPeriod = ref(pick(String(route.query.period || ''), periods.slice(1)))
const sortBy = ref(['new', 'level', 'city'].includes(route.query.sort) ? route.query.sort : 'new')
const currentPage = ref(Math.max(1, parseInt(route.query.page, 10) || 1))
const pageSize = 12

// 分类入口：沿用真实类别与数量，不新增未经确认的类别
const categoryTabs = computed(() => [
  { name: '全部', value: '', count: heritageData.length },
  ...categories.slice(1).map((name) => ({
    name,
    value: name,
    count: heritageData.filter((item) => item.category === name).length
  }))
])

const filteredData = computed(() => {
  const keyword = searchKeyword.value.trim()
  let data = heritageData.filter((item) => {
    const matchKeyword = !keyword || item.name.includes(keyword) || item.intro.includes(keyword)
    const matchCategory = !filterCategory.value || item.category === filterCategory.value
    const matchCity = !filterCity.value || item.city === filterCity.value
    const matchPeriod = !filterPeriod.value || item.period === filterPeriod.value
    return matchKeyword && matchCategory && matchCity && matchPeriod
  })

  // 保护级别排序：国家级 → 自治区级 → 市级（基于真实 level 字段，同级保持数据原顺序）
  const levelRank = (level) => (level?.includes('国家级') ? 0 : level?.includes('自治区级') ? 1 : 2)

  if (sortBy.value === 'city') {
    data = [...data].sort((a, b) => a.city.localeCompare(b.city))
  } else if (sortBy.value === 'level') {
    data = [...data].sort((a, b) => levelRank(a.level) - levelRank(b.level))
  }

  return data
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

const sortLabel = computed(
  () => ({ new: '最新收录', level: '保护级别', city: '地区' }[sortBy.value] || '最新收录')
)

const scopeLabel = computed(() => {
  if (!hasConditions.value) return '全部档案'
  return `${[filterCategory.value, filterCity.value, filterPeriod.value, searchKeyword.value.trim() && `关键词「${searchKeyword.value.trim()}」`]
    .filter(Boolean)
    .join(' · ')} · 按${sortLabel.value}排序`
})

const hasConditions = computed(
  () => !!(filterCategory.value || filterCity.value || filterPeriod.value || searchKeyword.value.trim())
)

const activeConditions = computed(() => {
  const list = []
  if (searchKeyword.value.trim()) {
    list.push({ key: 'q', label: `关键词：${searchKeyword.value.trim()}`, clear: () => (searchKeyword.value = '') })
  }
  if (filterCategory.value) {
    list.push({ key: 'category', label: filterCategory.value, clear: () => (filterCategory.value = '') })
  }
  if (filterCity.value) {
    list.push({ key: 'city', label: filterCity.value, clear: () => (filterCity.value = '') })
  }
  if (filterPeriod.value) {
    list.push({ key: 'period', label: filterPeriod.value, clear: () => (filterPeriod.value = '') })
  }
  return list
})

const emptyHint = computed(() => {
  const parts = [filterCategory.value, filterCity.value, filterPeriod.value, searchKeyword.value.trim()]
    .filter(Boolean)
    .join(' · ')
  return parts ? `没有同时满足「${parts}」的项目，可以尝试减少筛选条件。` : '可以尝试调整搜索关键词。'
})

const levelKey = (level) => {
  if (level?.includes('国家级')) return 'national'
  if (level?.includes('自治区级')) return 'regional'
  return 'municipal'
}

const setCategory = (value) => {
  filterCategory.value = value
}

// 当前选中分类的序号：用于 roving tabindex 与 tabpanel 关联
const activeTabIndex = computed(() => {
  const index = categoryTabs.value.findIndex((tab) => tab.value === filterCategory.value)
  return index < 0 ? 0 : index
})

// Tabs 键盘模式（自动激活）：方向键 / Home / End 移动焦点并同步筛选
const onTabKeydown = (event, index) => {
  const last = categoryTabs.value.length - 1
  let next = null
  if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
  else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = last
  if (next === null) return
  event.preventDefault()
  setCategory(categoryTabs.value[next].value)
  nextTick(() => document.getElementById(`archive-tab-${next}`)?.focus())
}

const resetFilters = () => {
  searchKeyword.value = ''
  filterCategory.value = ''
  filterCity.value = ''
  filterPeriod.value = ''
  currentPage.value = 1
}

// 筛选条件写入 URL，保证分类/搜索可被分享与返回；空值不进入查询串
const queryOf = () => {
  const query = {}
  const keyword = searchKeyword.value.trim()
  if (keyword) query.q = keyword
  if (filterCategory.value) query.category = filterCategory.value
  if (filterCity.value) query.city = filterCity.value
  if (filterPeriod.value) query.period = filterPeriod.value
  if (sortBy.value !== 'new') query.sort = sortBy.value
  if (currentPage.value > 1) query.page = String(currentPage.value)
  return query
}

const syncQuery = () => {
  const next = queryOf()
  const current = route.query
  const same = ['q', 'category', 'city', 'period', 'sort', 'page'].every(
    (key) => String(current[key] || '') === String(next[key] || '')
  )
  if (!same) router.replace({ query: next })
}

let applyingRoute = false

watch([searchKeyword, filterCategory, filterCity, filterPeriod], () => {
  if (applyingRoute) return
  currentPage.value = 1
  syncQuery()
})

watch(sortBy, () => {
  if (applyingRoute) return
  syncQuery()
})

watch(currentPage, () => {
  if (applyingRoute) return
  syncQuery()
})

// 支持从首页分类入口、全站搜索等位置带条件进入，也支持浏览器前进后退
watch(
  () => route.query,
  (query) => {
    applyingRoute = true
    searchKeyword.value = String(query.q || '')
    filterCategory.value = pick(String(query.category || ''), categories.slice(1))
    filterCity.value = pick(String(query.city || ''), cities.slice(1))
    filterPeriod.value = pick(String(query.period || ''), periods.slice(1))
    sortBy.value = ['new', 'level', 'city'].includes(query.sort) ? query.sort : 'new'
    currentPage.value = Math.max(1, parseInt(query.page, 10) || 1)
    nextTick(() => {
      applyingRoute = false
    })
  }
)

// 结果变少时回到有效页码
watch(totalPages, (pages) => {
  if (currentPage.value > Math.max(1, pages)) {
    currentPage.value = Math.max(1, pages)
  }
})
</script>

<style lang="scss" scoped>
.archive-page {
  min-height: 100vh;
  background: var(--color-background);
}

// ============================================
// 页头
// ============================================
.archive-head {
  // 内容页 Hero 统一留白与光晕（main.scss --hero-pad-* / --hero-glow）
  padding: var(--hero-pad-top) 0 var(--hero-pad-bottom);
  background:
    var(--hero-glow),
    var(--hero-surface);
  border-bottom: 1px solid var(--color-border-light);
}

.arch-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0 0 var(--space-4);
  font-family: var(--font-ui);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wider);
  color: var(--color-primary);

  &__no {
    font-family: var(--font-en);
    font-size: var(--text-caption);
    letter-spacing: 0.1em;
    color: var(--color-gold-refined);
    padding-bottom: 1px;
    border-bottom: 1px solid var(--color-gold-refined-line);
  }
}

.arch-title {
  margin: 0 0 var(--space-4);
  font-family: var(--font-title);
  font-size: clamp(2.2rem, 4.4vw, 3.6rem);
  font-weight: 400;
  line-height: var(--leading-tight);
  letter-spacing: 0.02em;
  color: var(--color-primary-dark);
  // 11 字长标题在窄屏换行时避免单字孤行（渐进增强）
  text-wrap: balance;

  // 移动端 H1：字号由 clamp 下限 2.2rem 接管，此处只统一行高与字距
  @media (max-width: 768px) {
    line-height: 1.2;
    letter-spacing: 0.02em;
  }
}

.arch-lead {
  max-width: 62ch;
  margin: 0;
  font-size: var(--text-body-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-text-light);
}

.arch-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  margin: var(--space-8) 0 0;
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border-light);

  @media (max-width: 768px) {
    gap: var(--space-6);
  }
}

.arch-stat {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--space-1);

  dt {
    font-size: var(--text-caption);
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
  }

  dd {
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: var(--space-1);
    color: var(--color-text);

    strong {
      font-family: var(--font-en);
      font-size: 1.9rem;
      font-weight: 400;
      line-height: 1;
    }

    span {
      font-size: var(--text-caption);
      color: var(--color-text-muted);
    }
  }
}

// ============================================
// 主体
// ============================================
.archive-main {
  padding: var(--space-8) 0 var(--space-20);

  @media (max-width: 768px) {
    padding: var(--space-6) 0 var(--space-16);
  }
}

// 分类入口
.cat-rail {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-1);

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 2px;
    }
  }
}

.cat-tab {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  flex: none;
  padding: var(--space-2) var(--space-4);
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--color-text-medium);
  cursor: pointer;
  transition:
    background-color 0.25s var(--ease-out, ease),
    border-color 0.25s var(--ease-out, ease),
    color 0.25s var(--ease-out, ease);

  &:hover {
    border-color: var(--color-border-strong);
    color: var(--color-primary);
  }

  &.is-active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-paper);
  }

  &__count {
    font-family: var(--font-en);
    font-size: var(--text-label);
    color: var(--color-text-muted);
    opacity: 0.9;
  }

  &.is-active &__count {
    color: rgba(253, 251, 247, 0.72);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

// 检索工具
.archive-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
}

.tools-search {
  flex: 1 1 280px;
  min-width: 0;
}

.search-input :deep(.el-input__wrapper) {
  padding: 4px var(--space-4);
  border-radius: var(--radius-control);
  box-shadow: 0 0 0 1px var(--color-border-light) inset;
  background: var(--color-paper);

  &:hover {
    box-shadow: 0 0 0 1px var(--color-border-strong) inset;
  }

  &.is-focus {
    box-shadow: 0 0 0 1px var(--color-primary) inset, 0 0 0 3px rgba(139, 69, 19, 0.25);
  }
}

.search-icon {
  color: var(--color-text-muted);
}

.tools-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.filter-select {
  width: 132px;

  :deep(.el-input__wrapper) {
    padding: 4px var(--space-3);
    border-radius: var(--radius-control);
    box-shadow: 0 0 0 1px var(--color-border-light) inset;
    background: var(--color-paper);

    &:hover {
      box-shadow: 0 0 0 1px var(--color-border-strong) inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px var(--color-primary) inset, 0 0 0 3px rgba(139, 69, 19, 0.25);
    }
  }

  // Element Plus 下拉：焦点边界改用品牌赭石（默认蓝色 1px 对比不足）
  :deep(.el-select__wrapper.is-focused) {
    box-shadow: 0 0 0 1px var(--color-primary) inset, 0 0 0 3px rgba(139, 69, 19, 0.25);
  }
}

.tools-reset {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  background: transparent;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-control);
  font-family: var(--font-body);
  font-size: var(--text-caption);
  color: var(--color-text-medium);
  cursor: pointer;
  transition: border-color 0.25s var(--ease-out, ease), color 0.25s var(--ease-out, ease);

  &:hover:not(:disabled) {
    border-color: var(--color-secondary);
    color: var(--color-primary);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  // 金色在暖白纸面上对比不足（约 2.3:1），改用更深的品牌赭石色（约 6.9:1）
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

// 结果统计
.result-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin: var(--space-6) 0 var(--space-6);
}

.result-count {
  margin: 0;
  font-size: var(--text-body-sm);
  color: var(--color-text-medium);

  strong {
    font-family: var(--font-en);
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--color-primary);
    padding: 0 2px;
  }
}

.result-scope {
  color: var(--color-text-muted);
  font-size: var(--text-caption);
}

.result-hint {
  margin: 0;
  font-size: var(--text-caption);
  color: var(--color-text-muted);
}

.result-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 24px;
  padding: 4px var(--space-3);
  background: var(--color-primary-soft);
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-size: var(--text-label);
  color: var(--color-primary);
  cursor: pointer;

  &:hover {
    border-color: var(--color-secondary);
  }

  // 与清空按钮一致：暖白纸面上用深赭石色保证可见对比
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &__x {
    font-size: 0.9em;
    line-height: 1;
    color: var(--color-text-muted);
  }

  &--clear {
    background: transparent;
    border-color: var(--color-border);
    color: var(--color-text-medium);

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }
}

// ============================================
// 档案卡片
// ============================================
.heritage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-8) var(--card-gap);

  @media (max-width: 640px) {
    gap: var(--space-6);
  }
}

.h-card {
  display: flex;
  flex-direction: column;
  background: var(--color-paper);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  overflow: hidden;
  text-decoration: none;
  transition:
    transform 0.3s var(--ease-out, ease),
    border-color 0.3s var(--ease-out, ease),
    box-shadow 0.3s var(--ease-out, ease);

  &:hover {
    transform: translateY(-3px);
    border-color: var(--color-gold-refined-line);
    box-shadow: var(--shadow-sm);

    .h-card__title {
      color: var(--color-primary);
    }

    :deep(.h-image img) {
      transform: scale(1.045);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &__media {
    position: relative;
    display: block;
    background: var(--color-surface);
  }

  &__level {
    position: absolute;
    top: var(--space-3);
    left: var(--space-3);
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    background: rgba(253, 251, 247, 0.93);
    border-radius: var(--radius-sm);
    font-size: var(--text-label);
    letter-spacing: 0.04em;
    color: var(--color-text-medium);
    backdrop-filter: blur(4px);

    &-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--level-municipal);
    }

    &.is-national {
      color: var(--level-national-ink);

      .h-card__level-dot {
        background: var(--level-national);
      }
    }

    &.is-regional {
      color: var(--level-regional-ink);

      .h-card__level-dot {
        background: var(--level-regional);
      }
    }

    &.is-municipal {
      color: var(--level-municipal-ink);

      .h-card__level-dot {
        background: var(--level-municipal);
      }
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: var(--space-4) var(--space-4) var(--space-4);
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
  }

  &__cat {
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    background: var(--color-secondary-soft);
    font-size: var(--text-label);
    color: var(--color-warning-ink);
    letter-spacing: 0.04em;
  }

  &__period {
    font-size: var(--text-label);
    color: var(--color-text-muted);
  }

  &__title {
    margin-bottom: var(--space-2);
    font-family: var(--font-sub);
    font-size: 1.32rem;
    line-height: 1.45;
    color: var(--color-text);
    transition: color 0.25s var(--ease-out, ease);
  }

  &__excerpt {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: var(--space-4);
    font-size: var(--text-body-sm);
    line-height: 1.8;
    color: var(--color-text-light);
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    margin-top: auto;
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-light);
    font-size: var(--text-label);
    color: var(--color-text-muted);
  }

  &__loc {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__more {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--color-primary);

    i {
      font-style: normal;
      transition: transform 0.25s var(--ease-out, ease);
    }
  }

  &:hover &__more i {
    transform: translateX(3px);
  }
}

// ============================================
// 空结果
// ============================================
.empty-state {
  padding: var(--space-20) var(--space-6);
  text-align: center;
  background: var(--color-paper);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-card);

  &__mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    margin-bottom: var(--space-4);
    border: 1px solid var(--color-gold-refined-line);
    border-radius: 50%;
    font-family: var(--font-title);
    font-size: 1.4rem;
    color: var(--color-gold-refined);
  }

  h2 {
    margin-bottom: var(--space-2);
    font-family: var(--font-sub);
    font-size: 1.3rem;
    font-weight: 400;
    color: var(--color-text);
  }

  p {
    max-width: 46ch;
    margin: 0 auto var(--space-6);
    font-size: var(--text-body-sm);
    line-height: 1.8;
    color: var(--color-text-light);
  }
}

// ============================================
// 分页
// ============================================
.pagination-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-12);
}

.custom-pagination :deep(.el-pagination) {
  --el-pagination-button-bg-color: transparent;
  --el-pagination-hover-color: var(--color-primary);
  gap: var(--space-1);

  button,
  .el-pager li {
    font-family: var(--font-en);
    border-radius: var(--radius-sm);
    color: var(--color-text-medium);
  }

  .el-pager li.is-active {
    background: var(--color-primary);
    color: var(--color-paper);
  }
}

.pagination-info {
  margin: 0;
  font-size: var(--text-caption);
  color: var(--color-text-muted);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// ============================================
// 响应式
// ============================================
@media (max-width: 900px) {
  .archive-tools {
    flex-direction: column;
    align-items: stretch;
  }

  .tools-search {
    flex: none;
  }

  .tools-filters {
    justify-content: space-between;
  }

  .filter-select {
    flex: 1 1 120px;
    width: auto;
  }
}

@media (max-width: 640px) {
  .tools-filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-select {
    width: 100%;
  }

  .tools-reset {
    justify-content: center;
  }

  .result-bar {
    align-items: flex-start;
  }

  .result-hint {
    display: none;
  }

  .heritage-grid {
    grid-template-columns: 1fr;
  }

  .h-card__body {
    padding: var(--space-4);
  }
}

// ============================================
// 移动端 / 平板触控热区（≤768 生效，桌面端不变）
// ============================================
@media (max-width: 768px) {
  .cat-tab {
    min-height: 44px;
  }

  .search-input :deep(.el-input__wrapper) {
    min-height: 44px;
  }

  .filter-select :deep(.el-select__wrapper) {
    min-height: 44px;
  }

  .tools-reset {
    min-width: 44px;
    min-height: 44px;
  }

  // 已选条件 chip 本身是删除按钮：整体增高到 44，文字与 × 仍由 inline-flex 居中
  .chip {
    min-height: 44px;
  }

  // 分页按钮：移动端热区 ≥44（Element Plus 内部按钮）
  .custom-pagination {
    :deep(.btn-prev),
    :deep(.btn-next),
    :deep(.el-pager li) {
      min-width: 44px;
      min-height: 44px;
      line-height: 44px;
    }
  }
}
</style>
