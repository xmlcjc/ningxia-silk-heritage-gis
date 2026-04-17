<template>
  <div class="archive-page">
    <!-- 页面头部 -->
    <div class="page-hero">
      <div class="hero-bg">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">档</span>
            <span class="badge-text">非遗数字档案库</span>
          </div>
          <h1 class="hero-title">宁夏丝路非物质文化遗产</h1>
          <p class="hero-subtitle">全面收录 · 数字化保护 · 永久保存</p>
          <div class="stats-inline">
            <div class="stat-item">
              <span class="stat-number">{{ heritageData.length }}</span>
              <span class="stat-label">非遗项目</span>
            </div>
            <div class="stat-divider">|</div>
            <div class="stat-item">
              <span class="stat-number">{{ categories.length }}</span>
              <span class="stat-label">遗产类别</span>
            </div>
            <div class="stat-divider">|</div>
            <div class="stat-item">
              <span class="stat-number">{{ cities.length }}</span>
              <span class="stat-label">覆盖地市</span>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="#FFF8E7" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"/>
        </svg>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <div class="container">
        <!-- 工具栏 -->
        <div class="archive-toolbar card-silk">
          <div class="toolbar-left">
            <div class="search-box-wrapper">
              <el-input 
                v-model="searchKeyword" 
                placeholder="搜索非遗项目名称、描述..." 
                clearable
                class="search-input"
              >
                <template #prefix>
                  <span class="search-icon">🔍</span>
                </template>
              </el-input>
              <span class="search-hint">输入关键词快速定位</span>
            </div>
          </div>
          
          <div class="toolbar-right">
            <div class="filters-group">
              <el-select 
                v-model="filterCategory" 
                placeholder="遗产类别" 
                clearable
                class="filter-select"
              >
                <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
              </el-select>
              
              <el-select 
                v-model="filterCity" 
                placeholder="地区" 
                clearable
                class="filter-select"
              >
                <el-option v-for="city in cities" :key="city" :label="city" :value="city" />
              </el-select>
              
              <el-select 
                v-model="filterPeriod" 
                placeholder="时期" 
                clearable
                class="filter-select"
              >
                <el-option v-for="period in periods" :key="period" :label="period" :value="period" />
              </el-select>
              
              <el-select 
                v-model="sortBy" 
                placeholder="排序方式"
                class="filter-select"
              >
                <el-option label="最新收录" value="new" />
                <el-option label="热门浏览" value="hot" />
                <el-option label="按地区" value="city" />
              </el-select>
            </div>
            
            <button class="btn-reset" @click="resetFilters">
              <span>🔄</span> 重置
            </button>
          </div>
        </div>

        <!-- 结果统计 -->
        <div class="results-header">
          <div class="results-info">
            <h3 class="results-title">
              找到 <span class="highlight">{{ filteredData.length }}</span> 项非遗项目
            </h3>
            <p class="results-desc">涵盖传统技艺、民间文学、传统音乐等多个领域</p>
          </div>
          
          <div class="view-toggle">
            <button 
              class="view-btn active" 
              :class="{ 'active': viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              📋 网格视图
            </button>
            <button 
              class="view-btn"
              :class="{ 'active': viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              📄 列表视图
            </button>
          </div>
        </div>

        <!-- 档案结果 -->
        <div 
          class="archive-results"
          :class="'view-' + viewMode"
        >
          <!-- 网格视图 -->
          <div v-if="viewMode === 'grid'" class="archive-grid">
            <div 
              class="heritage-card" 
              v-for="item in paginatedData" 
              :key="item.id"
              @click="goToDetail(item.id)"
            >
              <div class="card-image-wrapper">
                <div class="image-placeholder" :style="{ backgroundColor: item.color || '#F5F0E6' }">
                  <span class="placeholder-char">{{ item.name.charAt(0) }}</span>
                </div>
                <div class="card-badge" :class="'level-' + (item.level?.includes('国家级') ? 'national' : 'regional')">
                  {{ item.level }}
                </div>
                <div class="card-overlay">
                  <span class="overlay-btn">查看详情 →</span>
                </div>
              </div>
              
              <div class="card-body">
                <div class="card-tags">
                  <span class="tag tag-category">{{ item.category }}</span>
                  <span class="tag tag-location">📍 {{ item.city }}</span>
                </div>
                
                <h3 class="card-title">{{ item.name }}</h3>
                <p class="card-excerpt">{{ item.intro.substring(0, 80) }}...</p>
                
                <div class="card-meta">
                  <span class="meta-item">
                    <span class="meta-icon">⏳</span>
                    {{ item.period }}
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">👁️</span>
                    {{ item.views || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 列表视图 -->
          <div v-else class="archive-list">
            <div 
              class="heritage-list-item" 
              v-for="item in paginatedData" 
              :key="item.id"
              @click="goToDetail(item.id)"
            >
              <div class="list-image">
                <div class="image-placeholder-sm">
                  <span class="placeholder-char-sm">{{ item.name.charAt(0) }}</span>
                </div>
              </div>
              
              <div class="list-content">
                <div class="list-header">
                  <h3 class="list-title">{{ item.name }}</h3>
                  <span class="list-badge">{{ item.level }}</span>
                </div>
                
                <p class="list-desc">{{ item.intro }}</p>
                
                <div class="list-meta">
                  <span class="list-tag">{{ item.category }}</span>
                  <span class="list-tag">{{ item.city }}</span>
                  <span class="list-tag">{{ item.period }}</span>
                </div>
              </div>
              
              <div class="list-action">
                <span class="action-arrow">→</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-section" v-if="totalPages > 1">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredData.length"
            layout="prev, pager, next, jumper, total"
            class="custom-pagination"
          />
          <div class="pagination-info">
            共 {{ filteredData.length }} 项 · 第 {{ currentPage }} / {{ totalPages }} 页
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredData.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>未找到相关非遗项目</h3>
          <p>尝试调整筛选条件或修改搜索关键词</p>
          <button class="btn-clear" @click="resetFilters">清除所有筛选</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { heritageData, categories, cities, periods } from '../data/heritageData'

const router = useRouter()
const searchKeyword = ref('')
const filterCategory = ref('')
const filterCity = ref('')
const filterPeriod = ref('')
const sortBy = ref('new')
const currentPage = ref(1)
const pageSize = ref(12)
const viewMode = ref('grid')

// 筛选和排序
const filteredData = computed(() => {
  let data = heritageData.filter(item => {
    const matchKeyword = !searchKeyword.value || 
      item.name.includes(searchKeyword.value) || 
      item.intro.includes(searchKeyword.value)
    const matchCategory = !filterCategory.value || item.category === filterCategory.value
    const matchCity = !filterCity.value || item.city === filterCity.value
    const matchPeriod = !filterPeriod.value || item.period === filterPeriod.value
    return matchKeyword && matchCategory && matchCity && matchPeriod
  })

  if (sortBy.value === 'city') {
    data = [...data].sort((a, b) => a.city.localeCompare(b.city))
  } else if (sortBy.value === 'hot') {
    data = [...data].sort((a, b) => (b.views || 0) - (a.views || 0))
  }

  return data
})

// 分页
const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize.value))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

const resetFilters = () => {
  searchKeyword.value = ''
  filterCategory.value = ''
  filterCity.value = ''
  filterPeriod.value = ''
  currentPage.value = 1
}

const goToDetail = (id) => {
  router.push(`/archive/${id}`)
}
</script>

<style lang="scss" scoped>
// ============================================
// 页面英雄区
// ============================================

.archive-page {
  min-height: 100vh;
}

.page-hero {
  position: relative;
  padding: var(--spacing-3xl) 0 var(--spacing-xl);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  
  .hero-pattern {
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4A017' fill-opacity='0.05'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z'/%3E%3C/g%3E%3C/svg%3E");
  }
  
  .hero-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #5D3A1A 0%, #8B4513 50%, #A0522D 100%);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(212, 160, 23, 0.2);
  border: 1px solid rgba(212, 160, 23, 0.4);
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  color: white;
  
  .badge-icon {
    width: 24px;
    height: 24px;
    background: var(--color-secondary);
    border-radius: 50%;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  color: white;
  letter-spacing: 3px;
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-xl);
}

.stats-inline {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  padding: var(--spacing-md) var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-secondary);
  }
  
  .stat-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
  }
}

.stat-divider {
  color: rgba(255, 255, 255, 0.3);
  font-size: 1.5rem;
  
  @media (max-width: 768px) {
    transform: rotate(90deg);
  }
}

.hero-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  
  svg {
    display: block;
    width: 100%;
    height: 60px;
  }
}

// ============================================
// 主内容区
// ============================================

.main-content {
  background: var(--color-background);
  padding: var(--spacing-2xl) 0 var(--spacing-3xl);
}

// ============================================
// 工具栏
// ============================================

.archive-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  
  @media (max-width: 992px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.toolbar-left {
  flex: 1;
}

.search-box-wrapper {
  position: relative;
  
  .search-input :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--color-border-light) inset;
    border-radius: var(--radius-full);
    padding: 6px 20px;
    
    &:hover {
      box-shadow: 0 0 0 1px var(--color-secondary) inset;
    }
  }
  
  .search-icon {
    font-size: 18px;
  }
}

.search-hint {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.toolbar-right {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 992px) {
    width: 100%;
    justify-content: space-between;
  }
}

.filters-group {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
}

.filter-select :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--color-border-light) inset;
  border-radius: var(--radius-full);
}

.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-secondary);
    color: var(--color-secondary);
  }
}

// ============================================
// 结果区域
// ============================================

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.results-info {
  .results-title {
    font-size: 1.1rem;
    color: var(--color-text);
    margin: 0 0 4px 0;
    
    .highlight {
      color: var(--color-secondary);
      font-weight: 600;
    }
  }
  
  .results-desc {
    font-size: 0.9rem;
    color: var(--color-text-light);
    margin: 0;
  }
}

.view-toggle {
  display: flex;
  gap: var(--spacing-sm);
  
  .view-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-light);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: var(--color-secondary);
    }
    
    &.active {
      background: var(--color-secondary);
      border-color: var(--color-secondary);
      color: white;
    }
  }
}

// ============================================
// 档案网格视图
// ============================================

.archive-results {
  &.view-grid .archive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-xl);
  }
  
  &.view-list .archive-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }
}

.heritage-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-secondary);
    
    .card-overlay {
      opacity: 1;
    }
  }
}

.card-image-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: linear-gradient(135deg, #E8DCC8, #D4C4AD);
  
  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .placeholder-char {
    font-size: 4rem;
    font-weight: 700;
    color: rgba(139, 69, 19, 0.3);
  }
  
  .card-badge {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 11px;
    font-weight: 600;
    color: white;
    backdrop-filter: blur(4px);
    
    &.level-national {
      background: rgba(212, 160, 23, 0.9);
    }
    
    &.level-regional {
      background: rgba(46, 139, 87, 0.9);
    }
  }
  
  .card-overlay {
    position: absolute;
    inset: 0;
    background: rgba(139, 69, 19, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .overlay-btn {
      display: inline-block;
      padding: 10px 24px;
      background: var(--color-secondary);
      color: white;
      border-radius: var(--radius-full);
      font-size: 14px;
      font-weight: 500;
      transform: translateY(10px);
      transition: transform 0.3s ease;
    }
    
    &:hover .overlay-btn {
      transform: translateY(0);
    }
  }
}

.card-body {
  padding: var(--spacing-lg);
}

.card-tags {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.tag {
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  
  &.tag-category {
    background: rgba(212, 160, 23, 0.15);
    color: var(--color-secondary-dark);
  }
  
  &.tag-location {
    background: rgba(139, 69, 19, 0.1);
    color: var(--color-primary);
  }
}

.card-title {
  font-size: 1.1rem;
  color: var(--color-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.4;
}

.card-excerpt {
  font-size: 0.9rem;
  color: var(--color-text-light);
  line-height: 1.6;
  margin: 0 0 var(--spacing-md) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
  
  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: var(--color-text-muted);
    
    .meta-icon {
      font-size: 14px;
    }
  }
}

// ============================================
// 列表视图
// ============================================

.heritage-list-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-secondary);
    box-shadow: var(--shadow-md);
    
    .action-arrow {
      transform: translateX(4px);
      color: var(--color-secondary);
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.list-image {
  flex-shrink: 0;
  
  .image-placeholder-sm {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #E8DCC8, #D4C4AD);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .placeholder-char-sm {
    font-size: 2rem;
    font-weight: 700;
    color: rgba(139, 69, 19, 0.3);
  }
}

.list-content {
  flex: 1;
}

.list-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.list-title {
  font-size: 1.1rem;
  color: var(--color-primary);
  margin: 0;
}

.list-badge {
  display: inline-block;
  padding: 2px 10px;
  background: rgba(212, 160, 23, 0.15);
  color: var(--color-secondary-dark);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
}

.list-desc {
  font-size: 0.9rem;
  color: var(--color-text-light);
  line-height: 1.6;
  margin: 0 0 var(--spacing-sm) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-meta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  
  .list-tag {
    display: inline-block;
    padding: 2px 8px;
    background: rgba(139, 69, 19, 0.08);
    color: var(--color-text-muted);
    border-radius: var(--radius-sm);
    font-size: 12px;
  }
}

.list-action {
  flex-shrink: 0;
  
  .action-arrow {
    font-size: 1.5rem;
    color: var(--color-text-light);
    transition: all 0.3s ease;
  }
}

// ============================================
// 分页区域
// ============================================

.pagination-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-2xl);
}

.custom-pagination :deep(.el-pagination) {
  display: flex;
  gap: var(--spacing-sm);
  
  button {
    border-radius: var(--radius-sm);
  }
}

.pagination-info {
  font-size: 13px;
  color: var(--color-text-muted);
}

// ============================================
// 空状态
// ============================================

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) 0;
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
  }
  
  h3 {
    font-size: 1.5rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    color: var(--color-text-light);
    margin-bottom: var(--spacing-lg);
  }
}

.btn-clear {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-secondary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

.text-center {
  text-align: center;
}
</style>