<template>
  <div class="map-page">
    <!-- 页面头部：压缩为地图工作台的标题条，把首屏高度尽可能留给地图 -->
    <div class="page-hero">
      <div class="hero-bg">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="hero-inner">
        <div class="hero-lead" data-reveal>
          <div class="hero-badge">
            <Icon class="badge-icon" icon="gis:map" />
            <span class="badge-text">GIS 时空可视化平台</span>
          </div>
          <h1 class="hero-title">丝路非遗 GIS 地图</h1>
          <p class="hero-subtitle">探索宁夏丝路非遗的空间分布格局与历史演变脉络</p>
        </div>
        <div class="hero-stats" data-reveal-stagger>
          <div class="hero-stat-item">
            <span class="stat-num">{{ heritageData.length }}</span>
            <span class="stat-label">非遗点位</span>
          </div>
          <div class="hero-stat-separator"></div>
          <div class="hero-stat-item">
            <span class="stat-num">{{ categories.length - 1 }}</span>
            <span class="stat-label">遗产类别</span>
          </div>
          <div class="hero-stat-separator"></div>
          <div class="hero-stat-item">
            <span class="stat-num">{{ filteredData.length }}</span>
            <span class="stat-label">当前显示</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <div class="map-container">
        <!-- 左侧面板：搜索 / 筛选 / 图层 / 时期，均沿用现有业务状态 -->
        <aside
          class="map-sidebar card-silk"
          :class="{ 'is-collapsed': sidebarCollapsed, 'is-open': sidebarOpen }"
          aria-label="地图筛选与图层面板"
        >
          <div class="sidebar-header">
            <span class="header-icon-wrapper">
              <Icon class="header-icon" icon="gis:layers" width="20" height="20" style="color:#FDF6E3" />
            </span>
            <div class="sidebar-head-text">
              <h2>图层与筛选</h2>
              <p>宁夏丝路非遗时空分布</p>
            </div>
            <button class="sidebar-close" @click="toggleSidebar" :aria-label="sidePanelVisible ? '收起图层面板' : '展开图层面板'">
              <span class="sidebar-close-bar"></span>
            </button>
          </div>

          <!-- 搜索 -->
          <div class="search-section">
            <div class="search-wrapper">
              <Icon class="search-icon" icon="gis:map-search" width="16" height="16" />
              <input
                type="text"
                v-model="searchKeyword"
                placeholder="搜索项目名称或简介..."
                aria-label="搜索非遗项目名称或简介"
                class="custom-input"
              />
              <button v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''" aria-label="清除搜索关键词">×</button>
            </div>
            <div class="result-bar">
              <span class="result-count-inline">当前显示 <strong>{{ filteredData.length }}</strong> / {{ heritageData.length }} 项</span>
              <button v-if="hasActiveFilters" class="link-clear" @click="resetFilters">清除条件</button>
            </div>
          </div>

          <!-- 筛选条件 -->
          <section class="panel-section" :class="{ 'is-open': openSections.filters }">
            <button class="panel-section-head" :aria-expanded="openSections.filters" @click="toggleSection('filters')">
              <Icon class="icon" icon="gis:map-bookmark" width="16" height="16" />
              <h4>筛选条件</h4>
              <span class="section-state">{{ activeFilterCount ? activeFilterCount + ' 项已选' : '全部' }}</span>
              <span class="section-chevron">▾</span>
            </button>
            <div class="section-collapse" :class="{ collapsed: !openSections.filters }">
              <div class="section-collapse-inner">
                <div class="filter-section">
                  <div class="filter-group">
                    <label>
                      <Icon class="label-icon" icon="gis:poi" width="13" height="13" />
                      地市
                    </label>
                    <el-select
                      v-model="filters.city"
                      placeholder="选择地市"
                      aria-label="按地市筛选"
                      clearable
                      class="custom-select"
                    >
                      <el-option v-for="city in cities.slice(1)" :key="city" :label="city" :value="city" />
                    </el-select>
                  </div>

                  <div class="filter-group">
                    <label>
                      <Icon class="label-icon" icon="gis:color" width="13" height="13" />
                      非遗类别
                    </label>
                    <el-select
                      v-model="filters.category"
                      placeholder="选择类别"
                      aria-label="按非遗类别筛选"
                      clearable
                      class="custom-select"
                    >
                      <el-option v-for="cat in categories.slice(1)" :key="cat" :label="cat" :value="cat" />
                    </el-select>
                  </div>

                  <div class="filter-group">
                    <label>
                      <Icon class="label-icon" icon="gis:map-time" width="13" height="13" />
                      历史时期
                    </label>
                    <el-select
                      v-model="filters.period"
                      placeholder="选择时期"
                      aria-label="按历史时期筛选"
                      clearable
                      :disabled="timePeriodEnabled"
                      class="custom-select"
                    >
                      <el-option v-for="p in periods.slice(1)" :key="p" :label="p" :value="p" />
                    </el-select>
                    <p v-if="timePeriodEnabled" class="filter-hint">时间轴筛选中，时期改由下方滑块控制</p>
                  </div>

                  <div class="filter-group">
                    <label>
                      <Icon class="label-icon" icon="gis:flag" width="13" height="13" />
                      保护等级
                    </label>
                    <el-select
                      v-model="filters.level"
                      placeholder="选择等级"
                      aria-label="按保护等级筛选"
                      clearable
                      class="custom-select"
                    >
                      <el-option v-for="l in levels.slice(1)" :key="l" :label="l" :value="l" />
                    </el-select>
                  </div>

                  <button class="btn-reset" @click="resetFilters">
                    <Icon icon="gis:rotate" width="14" height="14" /> 重置所有筛选
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- 图层控制 -->
          <section class="panel-section" :class="{ 'is-open': openSections.layers }">
            <button class="panel-section-head" :aria-expanded="openSections.layers" @click="toggleSection('layers')">
              <Icon class="icon" icon="gis:layers" width="16" height="16" />
              <h4>图层控制</h4>
              <span class="section-state">{{ activeLayerCount }} / 5 开启</span>
              <span class="section-chevron">▾</span>
            </button>
            <div class="section-collapse" :class="{ collapsed: !openSections.layers }">
              <div class="section-collapse-inner">
                <div class="layer-list">
                  <label
                    class="layer-item"
                    v-for="(enabled, layer) in layers"
                    :key="layer"
                    :class="{ 'is-on': enabled }"
                  >
                    <input type="checkbox" v-model="layers[layer]" />
                    <span class="layer-icon">
                      <Icon :icon="layerMeta[layer].icon" width="15" height="15" />
                    </span>
                    <span class="layer-info">
                      <span class="layer-name">{{ layerLabels[layer] }}</span>
                      <span class="layer-desc">{{ layerMeta[layer].desc }}</span>
                    </span>
                    <span class="layer-state" :class="{ 'is-off': !enabled }">{{ enabled ? layerMeta[layer].countLabel : '关闭' }}</span>
                    <span class="layer-switch">
                      <span class="switch-knob" :class="{ 'checked': enabled }"></span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <!-- 时间轴 -->
          <section class="panel-section" :class="{ 'is-open': openSections.timeline }">
            <button class="panel-section-head" :aria-expanded="openSections.timeline" @click="toggleSection('timeline')">
              <Icon class="icon" icon="gis:map-time" width="16" height="16" />
              <h4>时期演变</h4>
              <span class="section-state">{{ currentPeriod }}<template v-if="timePeriodEnabled"> · 筛选中</template></span>
              <span class="section-chevron">▾</span>
            </button>
            <div class="section-collapse" :class="{ collapsed: !openSections.timeline }">
              <div class="section-collapse-inner">
                <div class="timeline-toolbar">
                  <button
                    class="time-filter-toggle"
                    :class="{ 'is-on': timePeriodEnabled }"
                    :aria-pressed="timePeriodEnabled"
                    :title="timePeriodEnabled ? '关闭时间轴筛选（恢复全部时期）' : '启用时间轴筛选'"
                    @click="toggleTimeFilter"
                  >
                    <span class="time-switch"><span class="time-switch-knob"></span></span>
                    时间轴筛选
                  </button>
                  <button class="play-btn" :title="playing ? '暂停' : '播放演变'" :aria-label="playing ? '暂停演变回放' : '播放演变回放'" :aria-pressed="playing" @click="togglePlay">
                    <svg v-if="playing" viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                      <rect x="4" y="3" width="5.5" height="18" rx="1"/>
                      <rect x="14.5" y="3" width="5.5" height="18" rx="1"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                      <path d="M6 3.5v17a1 1 0 0 0 1.53.85l13-8.5a1 1 0 0 0 0-1.7l-13-8.5A1 1 0 0 0 6 3.5z"/>
                    </svg>
                  </button>
                </div>

                <div class="timeline-wrapper">
                  <input
                    type="range"
                    v-model="timeValue"
                    min="0"
                    max="4"
                    step="1"
                    class="timeline-slider"
                    :aria-label="'时期演变：' + currentPeriod"
                    @input="onTimeInput"
                  />
                  <div class="timeline-marks">
                    <span v-for="(label, index) in timeMarks" :key="index"
                          :class="{ active: parseInt(timeValue) === index }">
                      {{ label }}
                    </span>
                  </div>
                  <div class="current-period" :class="{ 'is-filtering': timePeriodEnabled }">
                    <Icon class="period-icon" icon="gis:pyramid" />
                    {{ currentPeriod }}<span v-if="timePeriodEnabled" class="period-flag">筛选中</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </aside>

        <!-- 移动端抽屉遮罩 -->
        <transition name="fade">
          <div v-if="sidebarOpen" class="sidebar-backdrop" @click="sidebarOpen = false"></div>
        </transition>

        <!-- 地图主区域 -->
        <main class="map-main">
          <!-- 移动端：筛选与图层面板入口（桌面端隐藏） -->
          <button class="sidebar-mobile-toggle" @click="sidebarOpen = true" aria-label="打开筛选与图层面板">
            <Icon icon="gis:layers-poi" width="16" height="16" />
            <span>图层 / 筛选</span>
            <span class="toggle-badge">{{ filteredData.length }}</span>
          </button>
          <!-- 打印专用抬头：屏幕端隐藏，打印输出时提供标题与数据来源说明 -->
          <div class="print-only print-header">
            <h1>宁夏丝路非遗地理志 · 丝路非遗 GIS 地图</h1>
            <p>数据来源：宁夏丝路非遗地理志项目（当前筛选 {{ filteredData.length }} 项非遗点位） · 底图：天地图 / 高德地图 · 制图日期：{{ printDate }}</p>
          </div>
          <div class="map-view">
            <!-- Leaflet 真实地图容器（v-show 保持地图实例存活，切换列表视图后无需重建） -->
            <div v-show="viewMode === 'map'" id="heritage-leaflet-map" class="leaflet-container"></div>

            <!-- 列表视图覆盖层 -->
            <transition name="slide-up">
              <div v-if="viewMode === 'list'" class="list-view-overlay">
                <div class="list-header">
                  <h3>非遗项目列表</h3>
                  <div class="list-header-right">
                    <span class="list-count">{{ filteredData.length }} 项结果</span>
                    <!-- 列表打开时工具栏会一并折叠让位，故此处提供返回地图的入口，
                         避免只能靠工具栏第一个按钮切回地图 -->
                    <button class="list-back" @click="toggleView" aria-label="返回地图视图">
                      <Icon class="vam" icon="gis:map" width="14" height="14" /> 返回地图
                    </button>
                  </div>
                </div>
                <div class="list-items">
                  <div
                    class="list-item"
                    v-for="item in filteredData"
                    :key="item.id"
                    role="button"
                    tabindex="0"
                    :aria-label="`查看 ${item.name} 详情`"
                    @click="focusListItem(item)"
                    @keydown.enter.prevent="focusListItem(item)"
                    @keydown.space.prevent="focusListItem(item)"
                  >
                    <div class="item-image">
                      <span class="item-char">{{ item.name.charAt(0) }}</span>
                      <img :src="item.thumbImage" :alt="item.name" loading="lazy" @error="onImgError">
                    </div>
                    <div class="item-content">
                      <div class="item-header">
                        <h4>{{ item.name }}</h4>
                        <span class="item-badge" :class="'badge-' + (item.level?.includes('国家级') ? 'gold' : 'silver')">
                          {{ item.level }}
                        </span>
                      </div>
                      <p>{{ item.intro.substring(0, 100) }}...</p>
                      <div class="item-tags">
                        <span class="tag-sm tag-category">{{ item.category }}</span>
                        <span class="tag-sm tag-location"><Icon icon="gis:poi" width="12" height="12" /> {{ item.city }}</span>
                        <span class="tag-sm tag-period"><Icon icon="gis:map-time" width="12" height="12" /> {{ item.period }}</span>
                      </div>
                    </div>
                    <div class="item-action">
                      <span class="action-arrow">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 地图工具栏：统一图标与 Tooltip；图例/底图同样可折叠。
                 标记气泡、古道信息卡、列表视图打开时自动收起让位 -->
            <div class="floating-toolbar" :class="{ collapsed: toolbarCollapsedUI }">
              <button class="toolbar-toggle" @click="toolbarCollapsed = !toolbarCollapsed"
                      :aria-expanded="!toolbarCollapsedUI" aria-label="折叠或展开地图工具栏">
                <span>{{ toolbarCollapsedUI ? '▸' : '▾' }}</span> 工具
              </button>
              <div v-show="!toolbarCollapsedUI" class="toolbar-body">
                <button class="toolbar-btn"
                        :data-tip="viewMode === 'map' ? '切换为列表视图' : '切换为地图视图'"
                        :aria-label="viewMode === 'map' ? '切换为列表视图' : '切换为地图视图'"
                        @click="toggleView">
                  <Icon class="toolbar-icon" :icon="viewMode === 'map' ? 'gis:grid' : 'gis:map'" />
                </button>
                <button class="toolbar-btn" data-tip="放大" aria-label="放大"
                        :disabled="!canZoomIn" @click="zoomIn">
                  <Icon class="toolbar-icon" icon="gis:zoom-in" />
                </button>
                <button class="toolbar-btn" data-tip="缩小" aria-label="缩小"
                        :disabled="!canZoomOut" @click="zoomOut">
                  <Icon class="toolbar-icon" icon="gis:zoom-out" />
                </button>
                <button class="toolbar-btn" data-tip="定位到所选项目" aria-label="定位到所选项目" @click="locateSelected">
                  <Icon class="toolbar-icon" icon="gis:location" />
                </button>
                <button class="toolbar-btn" data-tip="全图复位" aria-label="全图复位" @click="zoomToFit">
                  <Icon class="toolbar-icon" icon="gis:extent" />
                </button>
                <button class="toolbar-btn" :class="{ active: sidePanelVisible }"
                        :data-tip="sidePanelVisible ? '收起图层面板' : '展开图层面板'"
                        aria-label="展开或收起图层面板"
                        :aria-pressed="sidePanelVisible"
                        @click="toggleSidebar">
                  <Icon class="toolbar-icon" icon="gis:layers" />
                </button>
                <span class="toolbar-divider" aria-hidden="true"></span>
                <button class="toolbar-btn" :class="{ active: measureActive }"
                        :data-tip="measureActive ? '结束测距' : '测量距离'"
                        :aria-label="measureActive ? '结束测距' : '测量距离'"
                        :aria-pressed="measureActive"
                        @click="toggleMeasure">
                  <Icon class="toolbar-icon" icon="gis:measure" />
                </button>
                <button class="toolbar-btn" :class="{ busy: printWaiting }"
                        :data-tip="printWaiting ? '瓦片加载中，完成后自动打印' : '打印地图'"
                        :aria-label="printWaiting ? '瓦片加载中，完成后自动打印' : '打印地图'"
                        @click="printMap">
                  <Icon class="toolbar-icon" icon="gis:map-print" />
                </button>
                <button class="toolbar-btn" data-tip="全屏地图" aria-label="全屏地图" @click="toggleFullscreen">
                  <Icon class="toolbar-icon" icon="gis:full-screen" />
                </button>
              </div>
            </div>

            <!-- 测距提示 -->
            <transition name="hint-fade">
              <div v-if="measureActive" class="measure-hint">
                <Icon class="vam" icon="gis:measure-line" width="14" height="14" /> 单击地图添加测点 · 双击结束测量 · Esc 取消
              </div>
            </transition>

            <!-- 底图自动降级提示：仅天地图失效切到高德时短暂出现 -->
            <transition name="hint-fade">
              <div v-if="baseNotice" class="base-notice" role="status" aria-live="polite">
                <Icon class="vam" icon="gis:map" width="14" height="14" /> {{ baseNotice }}
              </div>
            </transition>

            <!-- 古道聚焦信息卡 -->
            <transition name="card-slide">
              <div v-if="focusedRoute" class="route-focus-card card-silk">
                <button class="route-card-close" @click="exitFocus" aria-label="关闭古道信息卡">×</button>
                <div class="route-card-head">
                  <span class="route-card-line" :style="{ background: focusedRoute.color }"></span>
                  <div class="route-card-headtext">
                    <h3>{{ focusedRoute.name }}</h3>
                    <span class="route-card-meta"><Icon class="vam" icon="gis:layer-road" width="14" height="14" /> 估算里程约 {{ focusedRouteLength }} 公里</span>
                  </div>
                </div>
                <p class="route-card-desc">{{ focusedRoute.desc }}</p>
                <p class="route-card-chartnote">下方数据图表已联动高亮该古道沿线非遗（再次点击古道取消）</p>
                <div class="route-card-items-title">
                  沿线非遗 <em>{{ focusedRouteItems.length }}</em> 项
                </div>
                <div class="route-card-items">
                  <button
                    v-for="h in focusedRouteItems"
                    :key="h.id"
                    class="route-item-chip"
                    @click="flyToRouteItem(h)"
                  >
                    <span class="chip-name">{{ h.name }}</span>
                    <span class="chip-level">{{ h.level }}</span>
                  </button>
                </div>
              </div>
            </transition>

            <!-- 图例 -->
            <div class="map-legend card-silk" :class="{ collapsed: legendCollapsedUI }">
              <!-- 折叠开关沿用「答辩离线版」的原始交互：普通 button + @click，不做焦点/滚动干预
                   （此前为消除“点击图例时页面上跳”加的 @mousedown.prevent 已按要求移除）
                   显示态用 legendCollapsedUI：详情预览弹窗 / 标记气泡 / 古道信息卡 / 非遗项目列表
                   打开时临时收起让位，关闭后回到用户手动折叠状态（legendCollapsed 未被改写） -->
              <button class="legend-toggle" @click="legendCollapsed = !legendCollapsed" :aria-expanded="!legendCollapsedUI">
                <span>{{ legendCollapsedUI ? '▸' : '▾' }}</span> 图例
              </button>
              <div v-show="!legendCollapsedUI" class="legend-body">
                <div v-if="layers.heritage" class="legend-group">
                  <div class="legend-row">
                    <span class="legend-slot"><span class="sample-marker national"><Icon icon="gis:flag-b" width="12" height="12" style="color:var(--level-national)" /></span></span> 国家级
                  </div>
                  <div class="legend-row">
                    <span class="legend-slot"><span class="sample-marker regional"><Icon icon="gis:poi" width="10" height="10" style="color:var(--level-regional)" /></span></span> 自治区级
                  </div>
                  <div class="legend-row">
                    <span class="legend-slot"><span class="sample-marker municipal"><Icon icon="gis:poi" width="8" height="8" style="color:var(--level-municipal)" /></span></span> 市级
                  </div>
                </div>
                <div v-if="layers.routes" class="legend-group">
                  <div v-for="r in silkRoadRoutes" :key="r.id" class="legend-row">
                    <span class="legend-slot"><span class="sample-line" :style="{ background: routeColorOf(r) }"></span></span>{{ r.name }}
                  </div>
                </div>
                <div v-if="layers.yellowRiver" class="legend-group">
                  <div class="legend-row">
                    <span class="legend-slot"><span class="sample-line" :style="{ background: RIVER_DISPLAY_COLOR }"></span></span>黄河
                  </div>
                </div>
                <div v-if="layers.heatmap" class="legend-group">
                  <div class="legend-row">
                    <span class="legend-slot"><span class="sample-heat"></span></span>密集辐射范围
                  </div>
                </div>
                <div v-if="layers.choropleth" class="legend-group">
                  <div class="legend-row">
                    <span class="legend-slot"><span class="sample-grad"></span></span>地市非遗数量 少 → 多
                  </div>
                </div>
                <div v-if="!layers.heritage && !layers.routes && !layers.yellowRiver && !layers.heatmap && !layers.choropleth"
                     class="legend-empty">所有图层已关闭</div>
              </div>
            </div>

            <!-- 底图切换：与图例/工具栏一致可手动折叠（baseCollapsed），
                 详情预览弹窗 / 标记气泡 / 古道信息卡 / 非遗项目列表打开时由 baseCollapsedUI 自动收起让位 -->
            <div class="base-switcher" :class="{ collapsed: baseCollapsedUI }">
              <button class="base-toggle" @click="baseCollapsed = !baseCollapsed"
                      :aria-expanded="!baseCollapsedUI" aria-label="折叠或展开底图切换">
                <span>{{ baseCollapsedUI ? '▸' : '▾' }}</span> 底图
              </button>
              <div v-show="!baseCollapsedUI" class="base-body">
                <button
                  v-for="b in baseOptions"
                  :key="b.key"
                  :class="{ active: activeBase === b.key }"
                  :title="b.label + '底图'"
                  :aria-label="b.label + '底图'"
                  :aria-pressed="activeBase === b.key"
                  @click="switchBase(b.key)"
                >
                  <Icon :icon="b.icon" class="base-icon" />
                  <span class="base-label">{{ b.label }}</span>
                </button>
              </div>
            </div>

            <!-- 实时经纬度 -->
            <div v-if="mouseCoords" class="coord-readout">{{ mouseCoords }}</div>

          </div>
        </main>

        <!-- 右侧详情面板：桌面端第三栏，窄屏转为底部面板；内容全部来自真实项目字段 -->
        <transition name="fade">
          <div v-if="selectedItem" class="detail-panel-backdrop" @click="closeDetailPanel"></div>
        </transition>
        <transition name="panel-slide">
          <aside
            v-if="selectedItem"
            ref="detailPanelEl"
            class="map-detail-panel"
            tabindex="-1"
            role="region"
            aria-label="非遗项目详情"
          >
            <div class="detail-panel-head">
              <div class="detail-panel-headtext">
                <span class="panel-eyebrow">非遗项目详情</span>
                <span class="panel-coord">{{ selectedItem.lng }}, {{ selectedItem.lat }}</span>
              </div>
              <button class="detail-panel-close" @click="closeDetailPanel" aria-label="关闭详情面板">×</button>
            </div>

            <div class="detail-panel-scroll">
              <figure class="detail-panel-figure">
                <span class="detail-placeholder">
                  <span class="placeholder-char">{{ selectedItem.name.charAt(0) }}</span>
                </span>
                <img :src="selectedItem.coverImage || selectedItem.thumbImage" :alt="selectedItem.name" @error="onImgError">
                <figcaption class="level-badge" :class="'level-' + levelClass(selectedItem.level)">
                  {{ selectedItem.level }}
                </figcaption>
              </figure>

              <div class="detail-panel-body">
                <h2>{{ selectedItem.name }}</h2>
                <div class="detail-tags">
                  <span class="detail-tag tag-category">{{ selectedItem.category }}</span>
                  <span class="detail-tag tag-location"><Icon icon="gis:poi" width="12" height="12" /> {{ selectedItem.city }}</span>
                  <span class="detail-tag tag-period"><Icon icon="gis:map-time" width="12" height="12" /> {{ selectedItem.period }}</span>
                </div>

                <p class="detail-intro">{{ selectedItem.intro }}</p>

                <dl class="detail-facts">
                  <div>
                    <dt>所在区县</dt>
                    <dd>{{ selectedItem.city }} · {{ selectedItem.county }}</dd>
                  </div>
                  <div>
                    <dt>传承人</dt>
                    <dd>{{ selectedItem.inheritor }}</dd>
                  </div>
                  <div>
                    <dt>关联丝路</dt>
                    <dd>{{ selectedItem.routeRelation }}</dd>
                  </div>
                  <div>
                    <dt>保护现状</dt>
                    <dd>{{ selectedItem.protectionStatus }}</dd>
                  </div>
                </dl>

                <div class="detail-panel-actions">
                  <button class="btn-primary" @click="goToDetail(selectedItem.id)">
                    <Icon icon="gis:map-book" width="15" height="15" /> 查看完整档案
                  </button>
                  <button class="btn-secondary" @click="locateSelected">地图居中</button>
                </div>
              </div>
            </div>
          </aside>
        </transition>
      </div>

      <!-- 数据统计图表区 -->
      <section class="charts-section texture-paper">
        <div class="container">
          <div class="section-header" data-reveal>
            <div class="header-decoration">
              <span class="deco-line"></span>
              <h2 class="section-title">数据洞察</h2>
              <span class="deco-line"></span>
            </div>
          </div>
          
          <div class="charts-grid" data-reveal-stagger>
            <div class="chart-card card-silk">
              <div class="chart-header">
                <h3>非遗类别分布</h3>
              </div>
              <div ref="pieChartRef" class="chart-container pie-chart"></div>
            </div>
            
            <div class="chart-card card-silk">
              <div class="chart-header">
                <h3>地市分布统计</h3>
              </div>
              <div ref="barChartRef" class="chart-container bar-chart"></div>
            </div>
            
            <div class="chart-card card-silk">
              <div class="chart-header">
                <h3>历史时期演变</h3>
              </div>
              <div ref="lineChartRef" class="chart-container line-chart"></div>
            </div>
          </div>

          <p class="chart-link-hint">点击古道查看简介并联动高亮下方图表，点击图表的切片或柱条可反向筛选地图（再次点击取消）</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import gisIconData from '@iconify-json/gis/icons.json'
import L from 'leaflet'
import * as echarts from 'echarts'
import { heritageData, categories, cities, periods, levels, silkRoadRoutes, yellowRiver } from '../data/heritageData'
import ningxiaCitiesGeo from '../data/ningxia-cities.geo.json'
import { wgs84ToGcj02, gcj02ToWgs84, transformGeoJson } from '../utils/coordTransform'
import { globalSelection, syncGlobalSelection } from '../composables/useGlobalSelection'
import { ElSelect, ElOption } from 'element-plus'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/option/style/css'

// Leaflet 的 DivIcon/popup 是原生 HTML，无法使用 Vue 组件：
// 直接取 Font-GIS 的 path 数据拼成内联 SVG 字符串
const gisSvg = (name, color, px) =>
  `<svg viewBox="0 0 100 100" width="${px}" height="${px}" style="color:${color};flex:none;display:block;vertical-align:middle;">${gisIconData.icons[name].body}</svg>`

const router = useRouter()
const route = useRoute()
const pieChartRef = ref(null)
const barChartRef = ref(null)
const lineChartRef = ref(null)

// Leaflet 地图实例与图层组
let leafletMap = null

// 用户系统偏好：减少动态效果（JS 驱动的地图飞行也要降级）
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// 统一飞行入口：降级时直接跳转，无平移缩放动画
const flyToView = (target, zoom, duration) => {
  if (!leafletMap) return
  if (reduceMotion) leafletMap.setView(target, zoom)
  else leafletMap.flyTo(target, zoom, { duration })
}

let markerLayer = null
let routeLayer = null
let heatmapLayer = null
let yellowRiverLayer = null
let choroplethLayer = null
let measureLayer = null
const baseLayers = {}  // 底图集合（天地图街道/影像/地形 + 高德街道/影像，后者仅作降级用）

// ECharts 实例引用（用于 dispose / setOption 更新）
let pieChart = null
let barChart = null
let lineChart = null
let resizeHandler = null

// 状态
const searchKeyword = ref('')
const filters = ref({ city: '', category: '', period: '', level: '' })
const layers = ref({ heritage: true, routes: true, yellowRiver: false, heatmap: false, choropleth: false })
const viewMode = ref('map')
const timeValue = ref(2)
const timePeriodEnabled = ref(false)  // 时间轴筛选开关
const selectedItem = ref(null)        // 当前选中的非遗项目 → 驱动右侧详情面板
const detailPanelEl = ref(null)       // 详情面板容器（打开时承接焦点）
let lastFocusedEl = null              // 打开详情前的焦点元素，关闭后归还

// 左侧面板：桌面端可折叠为 0 宽，移动端为抽屉；各分区可独立展开收起
const sidebarCollapsed = ref(false)
const sidebarOpen = ref(false)
const openSections = ref({ filters: true, layers: true, timeline: true })
const isMobileLayout = ref(window.innerWidth < 992)
const isPanelDocked = ref(window.matchMedia('(min-width: 1280px)').matches)

// 地图工具状态
const canZoomIn = ref(true)
const canZoomOut = ref(true)

// 新增交互状态
const activeBase = ref('standard')           // 当前底图
const activeCrs = ref('wgs84')               // 当前底图坐标系：wgs84（天地图）/ gcj02（高德）
const isCompactViewport = window.innerWidth < 768
const legendCollapsed = ref(window.innerWidth < 1280)   // 图例折叠（窄屏默认收起，避免遮挡地图）
const toolbarCollapsed = ref(isCompactViewport)  // 工具栏折叠（手机端默认收起，点开使用）
const baseCollapsed = ref(false)                 // 底图切换折叠（手动状态；首次进入保持展开）
const mapPopupOpen = ref(false)              // 地图标记气泡（Leaflet popup）是否打开
const focusedRoute = ref(null)               // 聚焦中的古道（古道信息卡是否打开）
const mouseCoords = ref('')                  // 鼠标经纬度

// 地图标记气泡、古道信息卡、非遗项目列表任一打开时，图例、工具栏与底图切换
// 临时收起、把空间让给气泡/列表/古道卡片内容；右侧详情面板已是独立栏位，不参与折叠
const overlayOpen = computed(() => mapPopupOpen.value || !!focusedRoute.value)
const listOpen = computed(() => viewMode.value === 'list')
const legendCollapsedUI = computed(() => legendCollapsed.value || overlayOpen.value || listOpen.value)
const toolbarCollapsedUI = computed(() => toolbarCollapsed.value || overlayOpen.value || listOpen.value)
const baseCollapsedUI = computed(() => baseCollapsed.value || overlayOpen.value || listOpen.value)
const playing = ref(false)                   // 时光回放中
const measureActive = ref(false)             // 测距模式
// 打印相关：瓦片加载状态（等待打印用）、打印等待中标志、制图日期
const tilesLoading = ref(false)
const printWaiting = ref(false)
const printDate = new Date().toLocaleDateString('zh-CN')

// 底图自动降级提示：短暂显示后自动消失，避免用户误以为底图无故变化
const baseNotice = ref('')
let baseNoticeTimer = null
const showBaseNotice = (text) => {
  baseNotice.value = text
  if (baseNoticeTimer) clearTimeout(baseNoticeTimer)
  baseNoticeTimer = setTimeout(() => { baseNotice.value = '' }, 4500)
}

// 底图选项：天地图三态常驻；高德仅作为自动降级底图，只在当前正使用高德时出现
const baseOptions = computed(() => {
  const opts = [
    { key: 'standard', label: '街道', icon: 'gis:map' },
    { key: 'imagery', label: '影像', icon: 'gis:satellite' },
    { key: 'terrain', label: '地形', icon: 'gis:height-map' }
  ]
  if (activeBase.value === 'amap-standard') {
    opts.splice(1, 0, { key: 'amap-standard', label: '高德街道', icon: 'gis:map' })
  } else if (activeBase.value === 'amap-imagery') {
    opts.splice(2, 0, { key: 'amap-imagery', label: '高德影像', icon: 'gis:satellite' })
  }
  return opts
})

// 聚焦古道沿线非遗
const focusedRouteItems = computed(() => {
  if (!focusedRoute.value) return []
  return heritageData.filter(h => h.routeRelation === focusedRoute.value.name)
})

// 标签映射
const layerLabels = {
  heritage: '非遗点位',
  routes: '丝路古道',
  yellowRiver: '黄河水系',
  heatmap: '热力分布',
  choropleth: '行政区填色'
}

// 图层说明与计数：全部取自现有数据 / 当前筛选结果，不新增数据源
const layerMeta = computed(() => ({
  heritage: {
    icon: 'gis:poi',
    desc: `${heritageData.length} 个真实点位，按保护级别分级`,
    countLabel: `${filteredData.value.length} 项`
  },
  routes: {
    icon: 'gis:route',
    desc: `${silkRoadRoutes.length} 条丝路古道走向`,
    countLabel: `${silkRoadRoutes.length} 条`
  },
  yellowRiver: {
    icon: 'gis:hydro-map',
    desc: '黄河宁夏段主河道',
    countLabel: '1 段'
  },
  heatmap: {
    icon: 'gis:circle-o',
    desc: '按点位密度显示辐射范围',
    countLabel: `${filteredData.value.length} 点`
  },
  choropleth: {
    icon: 'gis:polygon',
    desc: '按当前筛选统计各地市数量',
    countLabel: `${cities.length - 1} 市`
  }
}))

const activeLayerCount = computed(() => Object.values(layers.value).filter(Boolean).length)
const activeFilterCount = computed(() =>
  [searchKeyword.value, filters.value.city, filters.value.category, filters.value.period, filters.value.level]
    .filter(Boolean).length
)
const hasActiveFilters = computed(() => activeFilterCount.value > 0)
// 左侧面板当前是否可见（桌面看折叠状态，移动端看抽屉开合）
const sidePanelVisible = computed(() =>
  isMobileLayout.value ? sidebarOpen.value : !sidebarCollapsed.value
)

const timeMarks = { 0: '汉唐', 1: '宋元', 2: '明清', 3: '近现代', 4: '当代' }
const periodMap = ['汉唐', '宋元', '明清', '近现代', '当代']
const currentPeriod = computed(() => periodMap[timeValue.value])

// 筛选数据（支持时间轴）
const filteredData = computed(() => {
  return heritageData.filter(item => {
    const matchKeyword = !searchKeyword.value || 
      item.name.includes(searchKeyword.value) || 
      item.intro.includes(searchKeyword.value)
    const matchCity = !filters.value.city || item.city === filters.value.city
    const matchCategory = !filters.value.category || item.category === filters.value.category
    const matchPeriod = !filters.value.period || item.period === filters.value.period
    const matchLevel = !filters.value.level || item.level === filters.value.level
    // 时期筛选统一走 filters.period：时间轴筛选开启时由滑块写入该值，关闭时由下拉框写入，
    // 两者共用同一状态，避免"下拉选明清 + 滑块拖汉唐"式的 AND 冲突导致 0 结果
    return matchKeyword && matchCity && matchCategory && matchPeriod && matchLevel
  })
})

// ========== Leaflet 地图初始化 ==========
// 注意：maxBounds 必须大于 zoom 7 视口跨度（约 10°×7°），否则边界限制会把所有平移/飞行
// 目标锁死在同一个中心点（视口大于边界时 Leaflet 无法同时满足两侧约束）
const NINGXIA_BOUNDS = [[31.3, 99.5], [42.5, 113.8]]  // 以宁夏为中心的大区域
const NINGXIA_CENTER = [37.5, 106.2]

// 项目原始数据统一为 WGS84；使用高德底图（GCJ-02）时在上图前做坐标纠偏，
// 保证点位、古道、黄河、行政边界与底图严格套合
const mapLatLng = (lng, lat) => {
  const [x, y] = activeCrs.value === 'gcj02' ? wgs84ToGcj02(lng, lat) : [lng, lat]
  return [y, x]   // Leaflet 使用 [lat, lng]
}

// 自定义 marker 图标（四等级：国家级 / 自治区级 / 市级 / 县级及以下；入场时轻微破土）
// 第五批：等级配色统一为暖色层级（鎏金 / 赭石 / 暖灰），与全站 --level-* 语义色一致
const MARKER_TIERS = {
  national:  { color: '#D4A017', bg: '#FFF8F1', size: 46, svgIcon: 'flag-b', svgColor: '#D4A017', tip: 9, tw: 7 },
  regional:  { color: '#A0522D', bg: '#FBF3EB', size: 33, svgIcon: 'poi',    svgColor: '#A0522D', tip: 7, tw: 5 },
  municipal: { color: '#7E6A55', bg: '#F6F1E9', size: 27, svgIcon: 'poi',    svgColor: '#7E6A55', tip: 6, tw: 4.5 },
  county:    { color: '#8C7B63', bg: '#F7F2EA', size: 22, svgIcon: '',       svgColor: '',        tip: 5, tw: 4 }
}

// 古道与黄河的展示色：只在展示层覆盖，不修改 heritageData 中跨页面共用的 color 字段
// 浅色底图上用更深一档的暖色保证线宽 3px 的可读性；水系保留低饱和自然冷色
const MAP_ROUTE_COLORS = {
  xiaoguan: '#8B4513',
  huanling: '#C9971C',
  changxiy: '#A0522D',
  lingzhou: '#8A6D3B'
}
const routeColorOf = (route) => MAP_ROUTE_COLORS[route.id] || route.color || '#D4A017'
const RIVER_DISPLAY_COLOR = '#5B8496'

const markerTier = (item) => item.level?.includes('国家级') ? 'national'
  : item.level?.includes('自治区级') ? 'regional'
  : item.level?.includes('市级') ? 'municipal' : 'county'

// 图标总高度（圆形 + 底部三角），用于 Tooltip 偏移与标记选中态
const markerIconHeight = (item) => {
  const conf = MARKER_TIERS[markerTier(item)]
  return conf.size + conf.tip + conf.tw
}

const levelIcon = (item, delay = 0, overlapBadge = '') => {
  const tier = markerTier(item)
  const conf = MARKER_TIERS[tier]
  const { color, bg, size, svgIcon, svgColor, tip, tw } = conf
  const tipH = tip + tw
  const inner = tier === 'county'
    ? `<span style="width:5px;height:5px;border-radius:50%;background:${color};display:block;"></span>`
    : gisSvg(svgIcon, svgColor, Math.round(size * 0.62))
  const shadow = tier === 'national'
    ? '0 0 0 3px rgba(212,175,55,0.95), 0 3px 10px rgba(0,0,0,0.35)'
    : tier === 'regional'
      ? '0 2px 6px rgba(0,0,0,0.28)'
      : tier === 'municipal'
        ? '0 2px 5px rgba(0,0,0,0.24)'
        : '0 1px 3px rgba(0,0,0,0.2)'
  const borderW = tier === 'national' ? 3 : tier === 'regional' ? 2.5 : tier === 'municipal' ? 2 : 1.5
  return L.divIcon({
    className: 'heritage-marker',
    html: `<div class="sprout-pin tier-${tier}" style="
      position: relative;
      width: ${size}px; height: ${size}px;
      background: ${bg};
      border: ${borderW}px solid ${color};
      border-radius: 50%;
      box-shadow: ${shadow};
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      animation-delay: ${delay}ms;
    ">
      ${inner}
      <div style="
        position: absolute; bottom: -${tw}px; left: 50%;
        transform: translateX(-50%);
        width: 0; height: 0;
        border-left: ${tw}px solid transparent;
        border-right: ${tw}px solid transparent;
        border-top: ${tip}px solid ${color};
      ""></div>
    </div>
    ${overlapBadge}`,
    // 整体图标包含圆形 + 底部三角
    iconSize: [size, size + tipH],
    // 锚点 = 三角尖端（正好落在经纬度坐标上）
    iconAnchor: [size / 2, size + tipH]
  })
}

// 同址多点的选择面板：真实坐标完全相同的项目共用一个标记，点击后由用户选择进入哪一个
// 详情。此方案不改动任何真实经纬度，仅在地图交互层做区分。
const createOverlapPopup = (items) => `
  <div class="overlap-popup" style="min-width: 216px;">
    <div style="display:flex;align-items:center;gap:4px;font-size:12px;color:#8D6E63;margin-bottom:8px;">
      ${gisSvg('poi', '#8D6E63', 13)} 同一坐标共 ${items.length} 个项目，请选择
    </div>
    ${items.map(it => `
      <button onclick="window.__mapPickItem && window.__mapPickItem(${it.id})" style="
        display:flex;align-items:center;gap:8px;width:100%;text-align:left;
        padding:6px;margin-bottom:6px;background:#FDFBF7;border:1px solid #D9C7A8;
        border-radius:6px;cursor:pointer;
      ">
        <img src="${it.thumbImage}" alt="${it.name}" onerror="this.style.display='none'" style="
          width:38px;height:38px;object-fit:cover;border-radius:4px;flex:none;background:#EDE2CF;">
        <span style="flex:1;min-width:0;">
          <span style="display:block;font-size:13px;font-weight:700;color:#3E2723;">${it.name}</span>
          <span style="display:block;font-size:11px;color:#8B4513;margin-top:2px;">${it.level} · ${it.category}</span>
        </span>
        <span style="color:#8B4513;font-size:13px;">→</span>
      </button>
    `).join('')}
  </div>
`

const initMap = () => {
  // 等待容器有实际尺寸再初始化（首屏空白的常见原因）
  nextTick(() => {
    const container = document.getElementById('heritage-leaflet-map')
    if (!container || container.clientHeight === 0) {
      // 容器还没尺寸，再等一轮
      setTimeout(initMap, 150)
      return
    }

    leafletMap = L.map('heritage-leaflet-map', {
      center: NINGXIA_CENTER,
      zoom: 7,
      minZoom: 7,
      maxZoom: 15,
      maxBounds: NINGXIA_BOUNDS,
      maxBoundsViscosity: 0.8,
      zoomControl: true,
      attributionControl: true
    })

    // 瓦片加载进度条：弱网下提供明确反馈
    const loadBar = document.createElement('div')
    loadBar.className = 'map-loadbar'
    leafletMap.getContainer().parentElement.appendChild(loadBar)
    leafletMap.on('loading', () => loadBar.classList.add('loading'))
    leafletMap.on('load', () => loadBar.classList.remove('loading'))
    // 瓦片加载状态：打印前据此等待瓦片就绪（复用 Leaflet 地图级 loading/load 事件，
    // 任意底图图层开始/结束加载都会触发，无需逐层绑定）
    leafletMap.on('loading', () => { tilesLoading.value = true })
    leafletMap.on('load', () => { tilesLoading.value = false })

    // ========== 底图（天地图三态 + 高德两态） ==========
    // 天地图 token（个人申请的"浏览器端"key，可到 https://console.tianditu.gov.cn 管理）
    const TDT_TK = 'e07bb586409712614deed879e42dddb9'
    const tdtUrl = (layer, matrix = 'w') =>
      `https://t{s}.tianditu.gov.cn/${layer}_${matrix}/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0` +
      `&LAYER=${layer}&STYLE=default&TILEMATRIXSET=${matrix}&FORMAT=tiles` +
      `&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TDT_TK}`
    const tdtOpts = { subdomains: '01234567', maxZoom: 18 }

    // 高德瓦片：矢量街道 / 卫星影像 / 路网注记（透明底，叠加在卫星上形成"影像+路网"）
    const AMAP_OPTS = { subdomains: '1234', maxZoom: 18, attribution: '&copy; 高德地图' }
    const amapStreet = L.tileLayer(
      'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      AMAP_OPTS
    )
    const amapSatellite = L.tileLayer(
      'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      AMAP_OPTS
    )
    const amapRoadNet = L.tileLayer(
      'https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
      { ...AMAP_OPTS, attribution: '', opacity: 0.6 }
    )

    // 天地图街道：矢量底图 + 中文注记
    const tdtVec = L.tileLayer(tdtUrl('vec'), { ...tdtOpts, attribution: '&copy; 天地图' })
    const tdtCva = L.tileLayer(tdtUrl('cva'), tdtOpts)
    baseLayers.standard = L.layerGroup([tdtVec, tdtCva])
    // 天地图影像：卫星影像 + 中文注记叠加
    const tdtImg = L.tileLayer(tdtUrl('img'), { ...tdtOpts, attribution: '&copy; 天地图' })
    baseLayers.imagery = L.layerGroup([tdtImg, L.tileLayer(tdtUrl('cia'), tdtOpts)])
    // 天地图地形：地形晕渲 + 地形注记叠加
    baseLayers.terrain = L.layerGroup([
      L.tileLayer(tdtUrl('ter'), { ...tdtOpts, attribution: '&copy; 天地图' }),
      L.tileLayer(tdtUrl('cta'), tdtOpts)
    ])
    // 高德街道 / 高德影像（影像 + 路网注记）
    baseLayers['amap-standard'] = L.layerGroup([amapStreet])
    baseLayers['amap-imagery'] = L.layerGroup([amapSatellite, amapRoadNet])

    // 天地图配额失效时自动切到对应的高德底图（切换时会同步做 GCJ-02 纠偏）；
    // 高德按钮不常驻，仅在降级使用期间随 activeBase 动态出现在底图栏
    const fallbackToAmap = (fromKey, toKey) => {
      if (activeBase.value !== fromKey) return
      switchBase(toKey)
      showBaseNotice(`天地图服务不可用，已切换至${toKey === 'amap-imagery' ? '高德影像' : '高德街道'}底图`)
    }
    tdtVec.on('tileerror', () => fallbackToAmap('standard', 'amap-standard'))
    tdtImg.on('tileerror', () => fallbackToAmap('imagery', 'amap-imagery'))

    baseLayers.standard.addTo(leafletMap)

    // ========== 比例尺（移入图例卡片内部，宽度与图例匹配；刻度仍由 Leaflet 按真实分辨率计算） ==========
    L.control.scale({ imperial: false, position: 'bottomleft', maxWidth: 110 }).addTo(leafletMap)
    const scaleLineEl = document.querySelector('.leaflet-control-scale-line')
    const legendBodyEl = document.querySelector('.map-legend .legend-body')
    if (scaleLineEl && legendBodyEl) {
      const scaleWrap = document.createElement('div')
      scaleWrap.className = 'legend-scale-wrap'
      const scaleLabel = document.createElement('span')
      scaleLabel.className = 'legend-scale-label'
      scaleLabel.textContent = '比例尺'
      scaleWrap.appendChild(scaleLabel)
      scaleWrap.appendChild(scaleLineEl)
      legendBodyEl.appendChild(scaleWrap)
    }

    // ========== 初始化数据图层组 ==========
    markerLayer = L.layerGroup().addTo(leafletMap)
    routeLayer = L.layerGroup().addTo(leafletMap)
    heatmapLayer = L.layerGroup()
    yellowRiverLayer = L.layerGroup()
    choroplethLayer = L.layerGroup()
    measureLayer = L.layerGroup().addTo(leafletMap)

    // 黄河水系
    renderYellowRiver()
    // 分级填色（真实地市边界）
    renderChoropleth()

    // 第一次渲染所有数据
    renderMarkers(filteredData.value)
    renderRoutes()

    // fitBounds 包含所有点位（若带深链参数则由 applyDeepLink 覆盖为具体坐标）
    fitAllMarkers()
    applyDeepLink()

    // 同址选择面板：选中某个项目后打开右侧详情面板（与列表点击一致）
    window.__mapPickItem = (id) => {
      const it = heritageData.find(d => d.id === id)
      if (!it) return
      openDetailPreview(it)
    }

    // 标记气泡开合 → 驱动浮层自动让位（同址选择面板仍使用 Leaflet popup）
    leafletMap.on('popupopen', () => { mapPopupOpen.value = true })
    leafletMap.on('popupclose', () => { mapPopupOpen.value = false })

    // 鼠标移动 → 实时经纬度
    leafletMap.on('mousemove', onMapMouseMove)
    leafletMap.on('mouseout', onMapMouseOut)

    // 缩放/平移后重算古道名称标签的碰撞避让，并同步缩放按钮可用状态
    leafletMap.on('zoomend moveend', updateLabelCollision)
    leafletMap.on('zoomend', updateZoomState)
    updateZoomState()

    // 修复潜在的首屏不渲染问题
    setTimeout(() => leafletMap && leafletMap.invalidateSize(), 300)
  })
}

// 标记点击波纹：单次播放，动画结束即移除；减少动态效果时不播放
const playMarkerRipple = (el) => {
  if (!el || reduceMotion) return
  const ripple = document.createElement('span')
  ripple.className = 'marker-ripple'
  ripple.setAttribute('aria-hidden', 'true')
  const remove = () => ripple.remove()
  ripple.addEventListener('animationend', remove, { once: true })
  // 兜底清理：即使 animationend 被中断也不会残留节点
  setTimeout(remove, 900)
  el.insertBefore(ripple, el.firstChild)
}

const renderMarkers = (data, animate = true) => {
  if (!markerLayer || !leafletMap) return
  markerLayer.clearLayers()

  if (!data || data.length === 0) return

  // 同址归并：经纬度完全相同的项目合并为一个标记，避免上层标记盖住下层导致其一无法点击。
  // 真实坐标保持不变，仅在交互层用"重叠点选择面板"（createOverlapPopup）区分
  const groups = new Map()
  data.forEach((item) => {
    if (!item.lat || !item.lng) return
    const key = `${item.lat},${item.lng}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  })

  let idx = 0
  groups.forEach((items) => {
    // 错峰延迟：点位像小草一样依次破土而出（切换底图坐标系重绘时不重播动画）
    const delay = animate ? Math.min(idx * 55, 900) : 0
    idx += 1
    const anchor = items[0]
    const isOverlap = items.length > 1
    const overlapBadge = isOverlap
      ? `<span class="overlap-badge" title="同址 ${items.length} 个项目，点击选择">${items.length}</span>`
      : ''
    const marker = L.marker(mapLatLng(anchor.lng, anchor.lat), { icon: levelIcon(anchor, delay, overlapBadge) })
      .on('click', () => {
        playMarkerRipple(marker.getElement())
        if (isOverlap) {
          // 同址多点：标记本身不直接进入某一个，交由选择面板决定
          selectedItem.value = null
          return
        }
        // 窄屏下详情为浮层，先把点位移到未遮挡区域，避免面板盖住标记
        if (window.innerWidth < 1280) {
          flyToItem(anchor, Math.max(leafletMap.getZoom(), 11))
        }
        openDetailPreview(anchor)
      })
    marker.item = anchor
    marker.items = items
    // 同址归并点仍保留选择气泡；单点直接进入右侧详情面板，不再叠加重复气泡
    if (isOverlap) {
      marker.bindPopup(createOverlapPopup(items), { maxWidth: 260, className: 'heritage-popup-wrap' })
    }
    // Hover 标签：默认隐藏，悬停显示项目名称（同址点显示组信息）
    marker.bindTooltip(
      isOverlap ? `${items.length} 个同址项目 · ${anchor.name} 等` : anchor.name,
      {
        direction: 'top',
        offset: [0, -markerIconHeight(anchor) - 4],
        className: 'marker-name-tip',
        opacity: 1
      }
    )
    marker.addTo(markerLayer)
  })

  // 同时在热力图层生成 circleMarker
  if (heatmapLayer) {
    heatmapLayer.clearLayers()
    data.forEach(item => {
      if (!item.lat || !item.lng) return
      const isNational = item.level?.includes('国家级')
      L.circleMarker(mapLatLng(item.lng, item.lat), {
        radius: isNational ? 30 : 18,
        fillColor: isNational ? 'rgba(198, 40, 40, 0.15)' : 'rgba(139, 69, 19, 0.12)',
        stroke: false,
        fillOpacity: 0.6
      }).addTo(heatmapLayer)
    })
  }

  // 古道聚焦时，非沿线点位降透明度（等图标 DOM 生成后执行）
  setTimeout(() => {
    applyFocusDim()
    updateMarkerSelection()
  }, 0)
}

// 选中态：朱砂描边 + 置顶；不持续播放动画，仅在选中时出现
const updateMarkerSelection = () => {
  if (!markerLayer) return
  markerLayer.eachLayer(m => {
    const el = m.getElement()
    if (!el) return
    const ids = (m.items || [m.item]).filter(Boolean).map(i => String(i.id))
    const isSelected = !!selectedItem.value && ids.includes(String(selectedItem.value.id))
    el.classList.toggle('is-selected', isSelected)
    el.style.zIndex = isSelected ? 680 : ''
    const pin = el.querySelector('.sprout-pin')
    if (pin) pin.classList.toggle('is-selected', isSelected)
  })
}

// 古道可视化对象：routeId → { route, paths:[彩色线], hitAreas:[透明点击区], label:名称标签 }
const routeVisuals = new Map()

// 路线描边：每次页面装载只播放一次（首次绘制时），缩放 / 拖动不会重播
let routeDrawPlayed = false
const routeDrawTimers = new Set()

const clearRouteDrawTimers = () => {
  routeDrawTimers.forEach((t) => clearTimeout(t))
  routeDrawTimers.clear()
}

const playRouteDraw = () => {
  if (routeDrawPlayed || !routeVisuals.size || reduceMotion || !leafletMap) return false
  // SVG path 尚未挂载时放弃本次，由调用方在下一次渲染后重试
  const ready = [...routeVisuals.values()].some(vis => vis.paths.some(line => line._path))
  if (!ready) return false
  routeDrawPlayed = true

  let routeIndex = 0
  routeVisuals.forEach((vis) => {
    const delay = 120 + routeIndex * 100
    routeIndex += 1
    vis.paths.forEach((line) => {
      const path = line._path
      if (!path || typeof path.getTotalLength !== 'function') return
      let length = 0
      try {
        length = path.getTotalLength()
      } catch {
        return
      }
      if (!length) return

      // 先设为"实线且完全偏移"，再过渡到 0，形成描边生长效果；结束后恢复虚线样式
      path.style.transition = 'none'
      path.style.strokeDasharray = `${length}`
      path.style.strokeDashoffset = `${length}`
      void path.getBoundingClientRect()

      path.style.transition = `stroke-dashoffset var(--motion-scene) var(--ease-out) ${delay}ms`
      path.style.strokeDashoffset = '0'

      const timer = setTimeout(() => {
        path.style.transition = ''
        path.style.strokeDasharray = ''
        path.style.strokeDashoffset = ''
      }, delay + 720)
      routeDrawTimers.add(timer)
    })
  })
  return true
}

const renderRoutes = () => {
  if (!routeLayer || !leafletMap) return
  routeLayer.clearLayers()
  routeVisuals.clear()

  if (!silkRoadRoutes || silkRoadRoutes.length === 0) return

  silkRoadRoutes.forEach(route => {
    // 支持多段线（route.segments）与单段线（route.coordinates）
    const segments = (route.segments ?? [route.coordinates])
      .map(seg => seg.map(c => mapLatLng(c[0], c[1])))  // [lng,lat] → [lat,lng]（含坐标系纠偏）

    const paths = []
    const hitAreas = []
    segments.forEach(latlngs => {
      const polyline = L.polyline(latlngs, {
        color: routeColorOf(route),
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 6',
        lineCap: 'round',
        className: 'route-path'
      }).addTo(routeLayer)

      // 透明加粗点击区（细线在缩小后难以点中）
      const hitArea = L.polyline(latlngs, {
        color: '#fff',
        weight: 16,
        opacity: 0
      }).addTo(routeLayer)

      // 彩色线与透明点击区共用同一组交互
      ;[polyline, hitArea].forEach(ln => {
        ln.on('click', () => toggleRouteFocus(route))
        ln.on('mouseover', () => emphasizeRoute(route, true))
        ln.on('mouseout', () => emphasizeRoute(route, false))
      })

      paths.push(polyline)
      hitAreas.push(hitArea)
    })

    // 古道名称标签：锚定在预设的 labelAt（地理分离，避免重叠）；缺省取首段中部
    const anchor = route.labelAt
      ? mapLatLng(route.labelAt[0], route.labelAt[1])
      : segments[0][Math.floor(segments[0].length / 2)]
    // 可读性覆盖：浅暖色（鎏金）路线用深棕文字，其余深暖色用白字（对比度均 ≥4.5）
    const labelOverride = {
      huanling: { color: '#3E2A08' }
    }[route.id] || {}
    const labelStyle = `background:${labelOverride.background || routeColorOf(route)};color:${labelOverride.color || '#fff'}`
    const label = L.marker(anchor, {
      icon: L.divIcon({
        className: 'route-label',
        html: `<span class="route-label-pill" style="${labelStyle}">${route.name}</span>`,
        iconSize: [90, 20],
        iconAnchor: [45, 10]
      }),
      interactive: false,
      keyboard: false
    }).addTo(routeLayer)

    routeVisuals.set(route.id, { route, paths, hitAreas, label })
  })

  applyRouteFocusStyle()
  setTimeout(updateLabelCollision, 0)
  if (!playRouteDraw()) {
    setTimeout(playRouteDraw, 60)
  }
}

const emphasizeRoute = (route, on) => {
  if (measureActive.value) return
  const vis = routeVisuals.get(route.id)
  if (!vis) return
  if (on) {
    const weight = focusedRoute.value ? 7 : 6
    vis.paths.forEach(p => p.setStyle({ weight, opacity: 1 }))
    leafletMap.getContainer().style.cursor = 'pointer'
  } else {
    applyRouteFocusStyle()   // 移出时按聚焦状态平滑恢复，而非生硬复位
    leafletMap.getContainer().style.cursor = ''
  }
}

const fitAllMarkers = () => {
  if (!leafletMap || !markerLayer) return
  const group = L.featureGroup(markerLayer.getLayers())
  if (group.getLayers().length > 0) {
    leafletMap.fitBounds(group.getBounds().pad(0.2))
  } else {
    leafletMap.setView(NINGXIA_CENTER, 7)
  }
}

// 深链定位：档案页"在地图中查看"携带 lng/lat/zoom/id 进来时，
// 不走 fitBounds 概览，而是直接飞到该点位并弹开它的信息气泡
const applyDeepLink = () => {
  if (!leafletMap) return
  const { lng, lat, zoom, id } = route.query
  const hasCoord = lng !== undefined && lat !== undefined && lng !== '' && lat !== ''
  if (!hasCoord && !id) return
  const item = id ? heritageData.find(d => String(d.id) === String(id)) : null
  const targetLng = hasCoord ? Number(lng) : item?.lng
  const targetLat = hasCoord ? Number(lat) : item?.lat
  if (targetLng === undefined || targetLat === undefined || Number.isNaN(targetLng) || Number.isNaN(targetLat)) return
  const z = Math.min(15, Math.max(7, Number(zoom) || 12))
  flyToView(mapLatLng(targetLng, targetLat), z, 0.9)
  if (item) {
    // 同步选中态与右侧面板：URL 里的 id 与本地状态一致，后续写回 URL 时不会被误判为"已清除"
    selectedItem.value = item
  }
}

// ========== 黄河水系图层 ==========
const renderYellowRiver = () => {
  if (!yellowRiverLayer) return
  yellowRiverLayer.clearLayers()
  const latlngs = yellowRiver.coordinates.map(c => mapLatLng(c[0], c[1]))
  L.polyline(latlngs, {
    color: RIVER_DISPLAY_COLOR,
    weight: 5,
    opacity: 0.75,
    lineCap: 'round'
  }).addTo(yellowRiverLayer)
  // 黄河标签（青铜峡段附近）
  L.marker(latlngs[3], {
    icon: L.divIcon({
      className: 'river-label',
      html: `<span style="
        background: rgba(91,132,150,0.92); color:#fff;
        padding:2px 8px; border-radius:10px;
        font-size:11px; font-weight:600; white-space:nowrap;
      ">黄河</span>`,
      iconSize: [44, 20],
      iconAnchor: [0, 10]
    }),
    interactive: false
  }).addTo(yellowRiverLayer)
}

// ========== 行政区分级填色 ==========
// 统计口径：与项目列表 / 统计图表使用同一套筛选结果（filteredData），
// 筛选变化时填色与 tooltip 同步更新，保证地图颜色、图例、计数和列表表达一致

// 数量 → 颜色（浅米黄 → 深棕）
const cityFillColor = (n, max) => {
  if (!n) return '#F3ECE0'
  const ratio = n / Math.max(1, max)
  const stops = [
    [247, 232, 203],  // 少
    [234, 197, 130],
    [212, 160, 23],
    [159, 110, 30],
    [109, 72, 18]     // 多
  ]
  const f = ratio * (stops.length - 1)
  const i = Math.min(stops.length - 2, Math.floor(f))
  const t = f - i
  const a = stops[i], b = stops[i + 1]
  const rgb = a.map((v, k) => Math.round(v + (b[k] - v) * t))
  return `rgb(${rgb.join(',')})`
}

// 填色图层复用：筛选变化时直接更新样式（rAF 插值），而不是重建图层
let choroplethGeo = null
let choroplethCrs = ''
let choroplethCounts = {}
let choroplethMax = 1
const choroplethLayers = new Map()

// 用 rAF 插值颜色/透明度（SVG 属性变化不会触发 CSS 过渡），实现选中区域颜色平滑变化
let choroplethAnimRaf = 0

const cancelChoroplethAnim = () => {
  if (choroplethAnimRaf) {
    cancelAnimationFrame(choroplethAnimRaf)
    choroplethAnimRaf = 0
  }
}

const toRgb = (color) => {
  const hex = /^#?([0-9a-f]{6})$/i.exec(color || '')
  if (hex) {
    const n = parseInt(hex[1], 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const rgb = /^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i.exec(color || '')
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
  return [139, 69, 19]
}

const mixColor = (from, to, t) => {
  const a = toRgb(from)
  const b = toRgb(to)
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`
}

const choroplethStyle = (name, withClass = false) => {
  // 地市筛选联动：选中的地市用朱砂描边强调，其余保持赭石细边
  const isFocusedCity = !!filters.value.city && name === filters.value.city
  const style = {
    fillColor: cityFillColor(choroplethCounts[name] || 0, choroplethMax),
    weight: isFocusedCity ? 3 : 1,
    color: isFocusedCity ? '#C62828' : '#8B4513',
    fillOpacity: isFocusedCity ? 0.72 : 0.6
  }
  if (withClass) style.className = 'choropleth-path'
  return style
}

const renderChoropleth = () => {
  if (!choroplethLayer) return
  // 基于当前筛选结果统计各地市项目数量（而非全量数据）
  const counts = {}
  filteredData.value.forEach(h => {
    counts[h.city] = (counts[h.city] || 0) + 1
  })
  choroplethCounts = counts
  choroplethMax = Math.max(1, ...Object.values(counts))

  // 坐标系切换必须重建几何；筛选变化只更新样式，保证填色平滑过渡
  if (!choroplethGeo || choroplethCrs !== activeCrs.value) {
    choroplethLayer.clearLayers()
    choroplethLayers.clear()
    // 注意：choroplethLayer 是 LayerGroup（无 resetStyle），需持有内部 GeoJSON 实例用于悬停还原
    // 行政边界同样按当前底图坐标系纠偏后上图
    const choroData = activeCrs.value === 'gcj02'
      ? transformGeoJson(ningxiaCitiesGeo, wgs84ToGcj02)
      : ningxiaCitiesGeo
    choroplethGeo = L.geoJSON(choroData, {
      style: (feature) => choroplethStyle(feature.properties.name, true),
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name
        choroplethLayers.set(name, layer)
        layer.bindTooltip(`${name}：${choroplethCounts[name] || 0} 项非遗（当前筛选）`, { sticky: true })
        layer.on({
          mouseover: (e) => e.target.setStyle({
            weight: filters.value.city === name ? 4 : 2.5,
            fillOpacity: 0.8
          }),
          mouseout: (e) => e.target.setStyle(choroplethStyle(name))
        })
      }
    }).addTo(choroplethLayer)
    choroplethCrs = activeCrs.value
    return
  }

  // 复用已有图层：插值过渡到新的填色与选中描边
  cancelChoroplethAnim()
  const fromStyles = new Map()
  const targetStyles = new Map()
  choroplethLayers.forEach((layer, name) => {
    fromStyles.set(name, {
      fillColor: layer.options.fillColor,
      color: layer.options.color,
      fillOpacity: layer.options.fillOpacity,
      weight: layer.options.weight
    })
    targetStyles.set(name, choroplethStyle(name))
    layer.setTooltipContent(`${name}：${choroplethCounts[name] || 0} 项非遗（当前筛选）`)
  })

  if (reduceMotion) {
    choroplethLayers.forEach((layer, name) => layer.setStyle(targetStyles.get(name)))
    return
  }

  const duration = 250
  const start = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration)
    const ease = 1 - Math.pow(1 - t, 3) // ease-out
    choroplethLayers.forEach((layer, name) => {
      const from = fromStyles.get(name)
      const to = targetStyles.get(name)
      layer.setStyle({
        fillColor: mixColor(from.fillColor, to.fillColor, ease),
        color: mixColor(from.color, to.color, ease),
        fillOpacity: from.fillOpacity + (to.fillOpacity - from.fillOpacity) * ease,
        weight: from.weight + (to.weight - from.weight) * ease
      })
    })
    if (t < 1) {
      choroplethAnimRaf = requestAnimationFrame(step)
    } else {
      choroplethAnimRaf = 0
      // 回到精确的目标值（保留 hex，便于下一次过渡读取）
      choroplethLayers.forEach((layer, name) => layer.setStyle(targetStyles.get(name)))
    }
  }
  choroplethAnimRaf = requestAnimationFrame(step)
}

// ========== 古道聚焦模式 ==========
// 当前古道加粗提亮，其余古道的线条与名称标签一并淡出（SVG path 与标签均带 CSS 过渡）
const applyRouteFocusStyle = () => {
  if (!routeVisuals.size) return
  routeVisuals.forEach(vis => {
    const isFocused = focusedRoute.value?.id === vis.route.id
    vis.paths.forEach(p => {
      if (!focusedRoute.value) {
        p.setStyle({ weight: 3, opacity: 0.8 })
      } else if (isFocused) {
        p.setStyle({ weight: 7, opacity: 1 })
      } else {
        p.setStyle({ weight: 3, opacity: 0.18 })
      }
    })
    // 名称标签：聚焦古道保持醒目，其余降到几乎不争抢注意力
    const el = vis.label.getElement()
    if (el) {
      el.style.opacity = !focusedRoute.value ? 1 : (isFocused ? 1 : 0.1)
    }
    // 过渡结束后再置顶：同帧或过渡中重插 DOM 都会中断/跳过 CSS 过渡
    if (focusedRoute.value && isFocused) {
      vis.paths.forEach(p => setTimeout(() => p.bringToFront(), 470))
    }
  })
}

const applyFocusDim = () => {
  if (!markerLayer) return
  markerLayer.eachLayer(m => {
    const el = m.getElement()
    if (!el || !m.item) return
    // 同址归并后的标记可能代表多个项目：任一项目属于聚焦古道即保持醒目
    const items = m.items || [m.item]
    const dim = !!focusedRoute.value && !items.some(it => it.routeRelation === focusedRoute.value.name)
    el.style.opacity = dim ? 0.2 : 1
  })
}

const getRouteLength = (route) => {
  let km = 0
  const segments = route.segments ?? [route.coordinates]
  segments.forEach(c => {
    for (let i = 1; i < c.length; i++) {
      km += L.latLng(c[i][1], c[i][0]).distanceTo(L.latLng(c[i - 1][1], c[i - 1][0])) / 1000
    }
  })
  return Math.round(km)
}
const focusedRouteLength = computed(() => focusedRoute.value ? getRouteLength(focusedRoute.value) : 0)

const focusRoute = (route) => {
  focusedRoute.value = route
  applyRouteFocusStyle()

  // 合并该古道所有线段的几何
  const latlngs = []
  ;(route.segments ?? [route.coordinates]).forEach(seg => {
    seg.forEach(c => latlngs.push(mapLatLng(c[0], c[1])))
  })

  // 右侧介绍卡片（280px + 12px 右间距）会遮住地图右侧：
  // 把古道中心放到"未被遮挡区域"的视觉中央——地图中心相应向东偏移卡片宽度的一半
  const bounds = L.latLngBounds(latlngs).pad(0.35)
  const size = leafletMap.getSize()
  // 右侧介绍卡片：宽 280 + 右间距 12 = 292。未遮挡区中心相对地图中心左移 292/2
  const cardSpace = size.x > 640 ? 292 : 0
  const shiftPx = cardSpace / 2
  // 缩放级别计算时仅使用未遮挡区域，避免古道东段被卡片压住
  const zoom = leafletMap.getBoundsZoom(bounds, false, L.point(cardSpace, 20))
  const center = leafletMap.project(bounds.getCenter(), zoom).add(L.point(shiftPx, 0))
  const targetCenter = leafletMap.unproject(center, zoom)
  flyToView(targetCenter, zoom, 0.9)

  setTimeout(applyFocusDim, 500)

  // 联动下方数据图表：高亮沿线非遗对应的切片/柱条/折线点
  renderCharts()
}

// 再次点击已聚焦古道 → 取消联动、关闭简介、恢复多古道展示
const toggleRouteFocus = (route) => {
  if (focusedRoute.value?.id === route.id) {
    exitFocus()
  } else {
    focusRoute(route)
  }
}

const exitFocus = () => {
  focusedRoute.value = null
  applyFocusDim()
  applyRouteFocusStyle()
  renderCharts()  // 图表恢复常态
}

// ========== 古道名称标签碰撞避让 ==========
// 标签锚点已做地理分离；此处做屏幕空间兜底：移动/缩放后若仍有重叠，
// 在标签胶囊（而非 Leaflet 定位外壳，避免覆盖其定位 transform）上做纵向位移
const updateLabelCollision = () => {
  if (!leafletMap || !routeVisuals.size) return
  const mapRect = leafletMap.getContainer().getBoundingClientRect()

  const pills = []
  silkRoadRoutes.forEach(route => {
    const vis = routeVisuals.get(route.id)
    const outer = vis?.label?.getElement?.()
    const pill = outer?.querySelector('.route-label-pill')
    if (pill) {
      pill.style.transform = ''
      pills.push(pill)
    }
  })

  const placed = []
  pills.forEach(pill => {
    const r = pill.getBoundingClientRect()
    let dy = 0
    placed.forEach(p => {
      const hitX = r.left < p.right - 2 && r.right > p.left + 2
      const hitY = r.top < p.bottom - 2 && r.bottom > p.top + 2
      if (hitX && hitY) dy = Math.max(dy, p.bottom - r.top + 6)
    })
    if (dy && r.bottom + dy > mapRect.bottom - 8) {
      // 下方放不下 → 改为向上避让
      const topLine = Math.min(...placed.map(p => p.top))
      const upNeed = r.bottom - topLine + 6
      dy = r.top - upNeed > mapRect.top + 8 ? -upNeed : 0
    }
    if (dy) {
      pill.style.transform = `translateY(${dy}px)`
      placed.push(pill.getBoundingClientRect())
    } else {
      placed.push(r)
    }
  })
}

const flyToRouteItem = (item) => {
  if (!leafletMap || !item.lat) return
  flyToView(mapLatLng(item.lng, item.lat), 10, 0.7)
  setTimeout(() => {
    markerLayer.eachLayer(m => {
      if (m.item?.id === item.id) m.openPopup()
    })
  }, 750)
}

// ========== 底图切换 ==========
// 高德底图为 GCJ-02，天地图为 WGS84：切换底图时同步切换矢量图层坐标系
const crsOfBase = (key) => key.startsWith('amap-') ? 'gcj02' : 'wgs84'

// 坐标系变化时重绘所有矢量图层，保证点位 / 古道 / 黄河 / 行政边界始终与底图套合
const renderVectorLayers = () => {
  renderMarkers(filteredData.value, false)
  renderRoutes()
  renderYellowRiver()
  renderChoropleth()
  applyRouteFocusStyle()
  setTimeout(updateLabelCollision, 0)
}

const switchBase = (key) => {
  if (!leafletMap || !baseLayers[key] || key === activeBase.value) return
  leafletMap.removeLayer(baseLayers[activeBase.value])
  baseLayers[key].addTo(leafletMap)
  activeBase.value = key
  const crs = crsOfBase(key)
  if (crs !== activeCrs.value) {
    activeCrs.value = crs
    renderVectorLayers()
  }
}

// ========== 实时经纬度 ==========
// 读数统一显示项目原始坐标系（WGS84）：高德底图下先把鼠标点反算回 WGS84
const onMapMouseMove = (e) => {
  const { lng, lat } = e.latlng
  const [wLng, wLat] = activeCrs.value === 'gcj02' ? gcj02ToWgs84(lng, lat) : [lng, lat]
  mouseCoords.value = `经度 ${wLng.toFixed(3)}° · 纬度 ${wLat.toFixed(3)}°`
}
const onMapMouseOut = () => {
  mouseCoords.value = ''
}

// ========== 全屏 ==========
const onFullscreenChange = () => {
  // 浏览器全屏过渡时长不一，多次重算尺寸，确保瓦片铺满
  ;[100, 300, 600].forEach(t => setTimeout(() => leafletMap?.invalidateSize(), t))
}
const toggleFullscreen = () => {
  // 对整个地图视图（含工具栏、图例、聚焦卡）全屏，全屏后所有控件仍可操作
  const el = document.querySelector('.map-view')
  if (!el) return
  if (!document.fullscreenElement) {
    const request = el.requestFullscreen || el.webkitRequestFullscreen
    if (!request) return
    const p = request.call(el)
    if (p && p.catch) p.catch(err => console.warn('无法进入全屏：', err))
  } else {
    const exit = document.exitFullscreen || document.webkitExitFullscreen
    exit && exit.call(document)
  }
}

// ========== 时光回放 ==========
let playTimer = null
const stopPlay = () => {
  playing.value = false
  if (playTimer) {
    clearInterval(playTimer)
    playTimer = null
  }
}
const togglePlay = () => {
  if (playing.value) {
    stopPlay()
    return
  }
  if (timeValue.value !== 0) timeValue.value = 0  // 每次播放均从汉唐开始完整演示
  timePeriodEnabled.value = true
  filters.value.period = currentPeriod.value  // 播放同时把时期筛选取值同步给下拉，保持二者一致
  playing.value = true
  playTimer = setInterval(() => {
    if (timeValue.value >= 4) {
      stopPlay()
      return
    }
    timeValue.value += 1
  }, 1400)
}

// ========== 时间轴筛选开关 ==========
// 用户拖动滑块（含键盘方向键）→ 开启时间轴筛选并写入时期筛选值；
// 程序化改变 timeValue（播放推进 / resetFilters）不触发 @input，避免误开启
const onTimeInput = (e) => {
  const v = Number(e.target.value)
  timeValue.value = v
  timePeriodEnabled.value = true
  filters.value.period = periodMap[v]
}

const toggleTimeFilter = () => {
  if (timePeriodEnabled.value) {
    // 关闭时间轴筛选：解除时期过滤并停止播放，结果恢复为未按时期筛选
    timePeriodEnabled.value = false
    filters.value.period = ''
    stopPlay()
  } else {
    timePeriodEnabled.value = true
    filters.value.period = currentPeriod.value
  }
}

// ========== 交互式测距 ==========
let measurePts = []
const fmtDist = (m) => m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`

const drawMeasure = () => {
  if (!measureLayer) return
  measureLayer.clearLayers()
  if (measurePts.length === 0) return
  if (measurePts.length > 1) {
    L.polyline(measurePts, {
      color: '#C62828', weight: 2, dashArray: '6,4'
    }).addTo(measureLayer)
  }
  let total = 0
  measurePts.forEach((p, i) => {
    if (i > 0) total += p.distanceTo(measurePts[i - 1])
    const isLast = i === measurePts.length - 1
    L.circleMarker(p, {
      radius: 4, color: '#C62828', weight: 2, fillColor: '#fff', fillWeight: 2
    }).bindTooltip(isLast && i > 0 ? fmtDist(total) : (i === 0 ? '起点' : ''), {
      permanent: isLast && i > 0,
      direction: 'top',
      offset: [0, -6],
      className: 'measure-tip'
    }).addTo(measureLayer)
  })
}

const onMeasureClick = (e) => {
  measurePts.push(e.latlng)
  drawMeasure()
}

const onMeasureDblClick = () => {
  // 双击前会先触发两次单击，移除最后一个重复点
  if (measurePts.length) measurePts.pop()
  drawMeasure()
  finishMeasure(false)
}

const clearMeasureGraphics = () => {
  measurePts = []
  measureLayer && measureLayer.clearLayers()
}

const startMeasure = () => {
  if (!leafletMap) return
  clearMeasureGraphics()
  measureActive.value = true
  leafletMap.getContainer().classList.add('measure-cursor')
  leafletMap.on('click', onMeasureClick)
  leafletMap.on('dblclick', onMeasureDblClick)
}

const finishMeasure = (cancelled) => {
  if (!leafletMap) return
  measureActive.value = false
  leafletMap.getContainer().classList.remove('measure-cursor')
  leafletMap.off('click', onMeasureClick)
  leafletMap.off('dblclick', onMeasureDblClick)
  if (cancelled) clearMeasureGraphics()
}

const toggleMeasure = () => {
  measureActive.value ? finishMeasure(true) : startMeasure()
}

const onKeydown = (e) => {
  if (e.key !== 'Escape') return
  // 详情面板优先关闭，避免 Escape 同时触发其他快捷键
  if (selectedItem.value) {
    closeDetailPanel()
    return
  }
  if (measureActive.value) finishMeasure(true)
}

// ========== 跨页联动（地图 ↔ 三维大屏） ==========
// 页面挂载时从全局状态恢复上一页留下的选中态（模块单例在路由切换后仍存活）
onMounted(() => {
  // URL 查询参数优先（可分享的深链），其次全局选中态（SPA 跨页带入）
  const city = route.query.city || globalSelection.city
  const routeName = route.query.route || globalSelection.route
  const hasDeepPoint = route.query.lng !== undefined || route.query.id !== undefined
  if (city) {
    filters.value.city = city
    // 同时带点位深链时，视图交由 applyDeepLink 定位到该点，不再缩放全图
    if (!hasDeepPoint) setTimeout(() => fitAllMarkers(), 300)
  }
  if (routeName) {
    const target = silkRoadRoutes.find(r => r.name === routeName)
    if (target) setTimeout(() => focusRoute(target), 400)
  }
})

// 本地筛选变化时写回全局状态（syncGlobalSelection 幂等，仅值变化才写）
watch(() => filters.value.city, (v) => {
  syncGlobalSelection({ city: v }, 'map')
})
watch(focusedRoute, (r) => {
  syncGlobalSelection({ route: r ? r.name : '' }, 'map')
})

// 外部（大屏等）改动全局状态时同步本地（仅当来源不是自己）
watch(() => [globalSelection.city, globalSelection.route], ([c, r]) => {
  if (globalSelection.source === 'map') return
  if ((filters.value.city || '') !== (c || '')) {
    filters.value.city = c || ''
    setTimeout(() => fitAllMarkers(), 150)
  }
  if ((focusedRoute.value?.name || '') !== (r || '')) {
    const target = r ? silkRoadRoutes.find(x => x.name === r) : null
    if (target) focusRoute(target)
    else if (focusedRoute.value) exitFocus()
  }
})

// ---- URL 状态化：?city=&route=&id=（可分享链接，浏览器前进/后退可回退） ----
// 双向同步以"值相等即跳过"的幂等比较打断 state→URL→state 的循环
const writeUrl = () => {
  const next = { ...route.query }
  delete next.city; delete next.route; delete next.id
  if (filters.value.city) next.city = filters.value.city
  if (focusedRoute.value?.name) next.route = focusedRoute.value.name
  if (selectedItem.value?.id) next.id = String(selectedItem.value.id)
  const cur = route.query
  if ((cur.city || '') === (next.city || '') &&
      (cur.route || '') === (next.route || '') &&
      (cur.id || '') === (next.id || '')) return
  // 用 push 而非 replace：每次选中态变化都是一个历史记录，浏览器后退即可逐级回退选中态
  router.push({ query: next })
}
watch([() => filters.value.city, () => focusedRoute.value?.name, () => selectedItem.value?.id], writeUrl)

// 前进/后退或直接粘贴带参数的链接 → 应用到本地状态
watch([() => route.query.city, () => route.query.route, () => route.query.id], ([c, r, id]) => {
  const city = c || ''
  const routeName = r || ''
  const itemId = id === undefined ? '' : String(id)
  if ((filters.value.city || '') !== city) {
    filters.value.city = city
    setTimeout(() => fitAllMarkers(), 150)
  }
  if ((focusedRoute.value?.name || '') !== routeName) {
    const target = routeName ? silkRoadRoutes.find(x => x.name === routeName) : null
    if (target) focusRoute(target)
    else if (focusedRoute.value) exitFocus()
  }
  if (String(selectedItem.value?.id || '') !== itemId) {
    const item = itemId ? heritageData.find(d => String(d.id) === itemId) : null
    selectedItem.value = item
    if (item) flyToView(mapLatLng(item.lng, item.lat), 12, 0.8)
  }
})

// ========== 筛选 / 图层 / 时间轴 联动 ==========
watch(filteredData, (newData) => {
  // 筛选变化即时更新，不重播入场动画
  renderMarkers(newData, false)
  renderCharts()
  renderChoropleth()  // 行政区填色同步当前筛选口径
}, { deep: true })

// 时间轴数值变化（播放自动推进或程序化复位）→ 仅在筛选开启时同步时期筛选值
watch(timeValue, () => {
  if (timePeriodEnabled.value) filters.value.period = currentPeriod.value
})

watch([
  () => layers.value.heritage,
  () => layers.value.routes,
  () => layers.value.yellowRiver,
  () => layers.value.heatmap,
  () => layers.value.choropleth
], ([h, r, y, heat, ch]) => {
  if (!leafletMap) return
  if (h) markerLayer.addTo(leafletMap); else leafletMap.removeLayer(markerLayer)
  if (r) routeLayer.addTo(leafletMap); else leafletMap.removeLayer(routeLayer)
  if (y) yellowRiverLayer.addTo(leafletMap); else leafletMap.removeLayer(yellowRiverLayer)
  if (heat) heatmapLayer.addTo(leafletMap); else leafletMap.removeLayer(heatmapLayer)
  if (ch) choroplethLayer.addTo(leafletMap); else leafletMap.removeLayer(choroplethLayer)
}, { flush: 'post' })

// ========== ECharts 图表 ==========
const chartOptionCategory = (data) => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c}项 ({d}%)' },
  legend: { bottom: '0%', left: 'center', itemWidth: 12, itemHeight: 12, textStyle: { fontSize: 11 } },
  series: [{
    type: 'pie', radius: ['45%', '70%'], center: ['50%', '45%'],
    avoidLabelOverlap: false,
    data,
    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    emphasis: { label: { show: true, fontSize: 13, fontWeight: 600 } }
  }]
})

const chartOptionCity = (data) => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
  series: [{
    type: 'bar', data,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#D4A017' }, { offset: 1, color: '#B8860B' }
      ]),
      borderRadius: [4, 4, 0, 0]
    },
    barWidth: '50%'
  }]
})

const chartOptionPeriod = (data) => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
  series: [{
    type: 'line', data, smooth: true,
    symbol: 'circle', symbolSize: 8, lineStyle: { width: 3 },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(212, 160, 23, 0.3)' }, { offset: 1, color: 'rgba(212, 160, 23, 0.05)' }
      ])
    },
    itemStyle: { color: '#D4A017' }
  }]
})

const buildChartData = (data) => ({
  category: categories.slice(1).map(cat => ({
    name: cat, value: data.filter(h => h.category === cat).length
  })).filter(d => d.value > 0),
  city: cities.slice(1).map(city => ({
    name: city, value: data.filter(h => h.city === city).length
  })),
  period: periodMap.map(p => ({
    name: p, value: data.filter(h => h.period === p).length
  }))
})

// 组件存活标志：卸载后阻止延迟重试继续在已分离的 DOM 上初始化图表（防实例残留）
let chartsAlive = false

const initCharts = () => {
  nextTick(() => {
    if (!chartsAlive) return
    // 容器高度未就绪时延迟重试，避免 ECharts 以 0 尺寸初始化
    const refs = [pieChartRef, barChartRef, lineChartRef].map(r => r.value)
    if (refs.some(el => !el || el.clientHeight === 0)) {
      setTimeout(() => { if (chartsAlive) initCharts() }, 150)
      return
    }
    // 防御重复初始化：同一 DOM 上已有实例时先销毁（HMR / 重挂载场景）
    pieChartRef.value && echarts.getInstanceByDom(pieChartRef.value)?.dispose()
    barChartRef.value && echarts.getInstanceByDom(barChartRef.value)?.dispose()
    lineChartRef.value && echarts.getInstanceByDom(lineChartRef.value)?.dispose()
    pieChart = echarts.init(pieChartRef.value)
    barChart = echarts.init(barChartRef.value)
    lineChart = echarts.init(lineChartRef.value)
    renderCharts()

    // 图表点击 → 联动筛选地图（再次点击同项取消）
    pieChart.on('click', (p) => linkChartFilter('category', p.name))
    barChart.on('click', (p) => linkChartFilter('city', p.name))
    lineChart.on('click', (p) => linkChartFilter('period', p.name))

    // resize handler 保存引用以便清理
    resizeHandler = () => {
      pieChart?.resize()
      barChart?.resize()
      lineChart?.resize()
      leafletMap?.invalidateSize()
    }
    window.addEventListener('resize', resizeHandler)
  })
}

// 古道 → 图表联动：沿线非遗涉及的类别 / 地市 / 时期名称集合
const routeLinkKeys = computed(() => {
  const r = focusedRoute.value
  if (!r) return null
  const items = heritageData.filter(h => h.routeRelation === r.name)
  return {
    category: new Set(items.map(i => i.category)),
    city: new Set(items.map(i => i.city)),
    period: new Set(items.map(i => i.period))
  }
})

const LINK_DIM = 0.15  // 联动时非关联切片/柱条/点的透明度

const renderCharts = () => {
  const data = filteredData.value
  const { category, city, period } = buildChartData(data)
  const k = routeLinkKeys.value

  // 有关联古道时：非关联数据降透明度（保留色相等，仅不争抢注意力）
  const withDim = (list, keyName) => list.map(d => (
    k && !k[keyName].has(d.name)
      ? { ...d, itemStyle: { ...(d.itemStyle || {}), opacity: LINK_DIM } }
      : d
  ))
  const catData = withDim(category, 'category')
  const cityData = withDim(city, 'city')
  const periodData = withDim(period, 'period')

  pieChart && pieChart.setOption(chartOptionCategory(catData), true)
  barChart && barChart.setOption(chartOptionCity(cityData), true)
  lineChart && lineChart.setOption(chartOptionPeriod(periodData), true)

  // 关联项额外高亮（饼图弹出标签、柱条/折线点强调）
  if (k) {
    nextTick(() => {
      catData.forEach((d, i) => {
        if (k.category.has(d.name)) pieChart?.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: i })
      })
      cityData.forEach((d, i) => {
        if (k.city.has(d.name)) barChart?.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: i })
      })
      periodData.forEach((d, i) => {
        if (k.period.has(d.name)) lineChart?.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: i })
      })
    })
  }
}

// ========== 方法 ==========
const resetFilters = () => {
  searchKeyword.value = ''
  filters.value = { city: '', category: '', period: '', level: '' }
  // 时间轴状态一并复位：关闭筛选并回到默认刻度（明清），避免残留筛选态
  timePeriodEnabled.value = false
  timeValue.value = 2
  stopPlay()
  exitFocus()
  if (measureActive.value) finishMeasure(true)
  if (leafletMap) leafletMap.closePopup()
}

// 图表联动筛选
const linkChartFilter = (field, value) => {
  filters.value[field] = filters.value[field] === value ? '' : value
  viewMode.value = 'map'
  setTimeout(() => fitAllMarkers(), 450)
}

const goToDetail = (id) => {
  if (id) router.push(`/archive/${id}`)
}

// ========== 详情面板 / 图层面板 / 地图工具 ==========
const levelClass = (level) =>
  level?.includes('国家级') ? 'national' : level?.includes('自治区级') ? 'regional' : 'municipal'

// 统一打开入口：记录来源焦点 → 打开右侧详情面板（供地图标记、列表项、同址选择面板共用）
const openDetailPreview = (item) => {
  if (!item) return
  lastFocusedEl = document.activeElement
  selectedItem.value = item
  // 同址选择面板仍使用 Leaflet popup，选中后关闭，避免与详情面板重复
  if (leafletMap) leafletMap.closePopup()
}

// 关闭面板：归还焦点到打开前的元素（元素可能已随筛选/路由卸载，需做存在性判断）
const closeDetailPanel = () => {
  selectedItem.value = null
  const el = lastFocusedEl
  lastFocusedEl = null
  nextTick(() => {
    if (el && el.isConnected && typeof el.focus === 'function') el.focus()
  })
}

const toggleSection = (key) => {
  openSections.value[key] = !openSections.value[key]
}

// 桌面端折叠面板 / 移动端开合抽屉
const toggleSidebar = () => {
  if (isMobileLayout.value) {
    sidebarOpen.value = !sidebarOpen.value
    return
  }
  sidebarCollapsed.value = !sidebarCollapsed.value
  // 宽度过渡结束后刷新地图尺寸，避免瓦片留白
  ;[120, 360].forEach(ms => setTimeout(() => leafletMap && leafletMap.invalidateSize(), ms))
}

const updateZoomState = () => {
  if (!leafletMap) return
  canZoomIn.value = leafletMap.getZoom() < leafletMap.getMaxZoom()
  canZoomOut.value = leafletMap.getZoom() > leafletMap.getMinZoom()
}

const zoomIn = () => {
  if (leafletMap && canZoomIn.value) leafletMap.zoomIn()
}

const zoomOut = () => {
  if (leafletMap && canZoomOut.value) leafletMap.zoomOut()
}

// 浮层详情面板会遮住地图：按视口形态把目标点偏移到未遮挡区域（桌面停靠布局不偏移）
const panelViewOffset = () => {
  const w = window.innerWidth
  if (w >= 1280) return [0, 0]
  if (w >= 768) return [190, 0]
  return [0, 120]
}

const flyToItem = (item, zoom = 11) => {
  if (!leafletMap || !item) return
  const target = mapLatLng(item.lng, item.lat)
  const [dx, dy] = reduceMotion ? [0, 0] : panelViewOffset()
  if (!dx && !dy) {
    flyToView(target, zoom, 0.8)
    return
  }
  const projected = leafletMap.project(target, zoom).add(L.point(dx, dy))
  flyToView(leafletMap.unproject(projected, zoom), zoom, 0.8)
}

// 定位：有选中项目时飞到该项目，否则回到宁夏全图中心
const locateSelected = () => {
  if (!leafletMap) return
  if (selectedItem.value) {
    flyToItem(selectedItem.value, 11)
    return
  }
  flyToView(NINGXIA_CENTER, 7, 0.8)
}

// 列表项 → 回到地图、定位到项目并打开详情面板
const focusListItem = (item) => {
  if (!item) return
  viewMode.value = 'map'
  nextTick(() => {
    if (leafletMap) leafletMap.invalidateSize()
    flyToItem(item, 11)
    openDetailPreview(item)
  })
}

// 视口变化：切换详情面板形态与抽屉状态，并同步 body 滚动锁定
const onViewportResize = () => {
  isMobileLayout.value = window.innerWidth < 992
  isPanelDocked.value = window.matchMedia('(min-width: 1280px)').matches
  if (isMobileLayout.value) {
    sidebarCollapsed.value = false
  } else {
    sidebarOpen.value = false
  }
  document.body.style.overflow = selectedItem.value && !isPanelDocked.value ? 'hidden' : ''
}

// 选中项目 → 同步标记高亮、面板尺寸与滚动锁定
watch(selectedItem, (item) => {
  updateMarkerSelection()
  document.body.style.overflow = item && !isPanelDocked.value ? 'hidden' : ''
  if (isPanelDocked.value) return
  nextTick(() => {
    // preventScroll：面板为浮层，聚焦时不应把页面滚动到它的 DOM 位置
    if (item && detailPanelEl.value) detailPanelEl.value.focus({ preventScroll: true })
  })
})

// 面板开合会改变地图容器宽度，过渡结束后刷新 Leaflet 尺寸
watch(selectedItem, () => {
  setTimeout(() => leafletMap && leafletMap.invalidateSize(), 360)
})

const onImgError = (e) => {
  e.target.classList.add('is-failed')
}

// 地图 / 列表视图切换；地图容器用 v-show 保活，回到地图后需刷新瓦片尺寸
const toggleView = () => {
  viewMode.value = viewMode.value === 'map' ? 'list' : 'map'
  if (viewMode.value === 'map' && leafletMap) {
    nextTick(() => leafletMap.invalidateSize())
  }
}

const zoomToFit = () => {
  // 处于古道聚焦态时先退出，恢复多古道展示与图表常态，再缩放到全部点位
  if (focusedRoute.value) exitFocus()
  if (leafletMap) leafletMap.closePopup()
  fitAllMarkers()
}

const printMap = async () => {
  if (!leafletMap) return
  // 打印前重算尺寸，确保地图容器按当前布局完整渲染
  leafletMap.invalidateSize()
  // 瓦片未加载完就触发打印会输出大片空白：等待加载完成（8s 超时兜底，避免极端情况下无响应）
  if (tilesLoading.value) {
    printWaiting.value = true
    const start = Date.now()
    await new Promise(resolve => {
      const timer = setInterval(() => {
        if (!tilesLoading.value || Date.now() - start > 8000) {
          clearInterval(timer)
          resolve()
        }
      }, 200)
    })
    printWaiting.value = false
  }
  window.print()
}

// ========== 生命周期 ==========
onMounted(() => {
  initMap()
  chartsAlive = true
  initCharts()
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onViewportResize)
})

onBeforeUnmount(() => {
  // 停止回放 / 路线描边定时器
  stopPlay()
  clearRouteDrawTimers()
  cancelChoroplethAnim()
  chartsAlive = false

  // 清理底图降级提示定时器
  if (baseNoticeTimer) { clearTimeout(baseNoticeTimer); baseNoticeTimer = null }

  // 清理 Leaflet
  if (leafletMap) {
    leafletMap.remove()
    leafletMap = null
  }
  markerLayer = null
  routeLayer = null
  heatmapLayer = null
  yellowRiverLayer = null
  choroplethLayer = null
  measureLayer = null

  // 清理 ECharts
  pieChart && pieChart.dispose()
  barChart && barChart.dispose()
  lineChart && lineChart.dispose()
  pieChart = barChart = lineChart = null

  // 清理全局监听
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onViewportResize)
  document.body.style.overflow = ''

  // 清理 window 引用
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  window.__mapPickItem = null
})
</script>

<style lang="scss" scoped>
// ============================================
// 页面标题条（压缩高度，把首屏留给地图工作台）
// ============================================

.page-hero {
  position: relative;
  overflow: hidden;
  background: var(--gradient-primary);
  border-bottom: 1px solid rgba(201, 168, 76, 0.42);
}

.hero-bg {
  position: absolute;
  inset: 0;

  .hero-pattern {
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4A017' fill-opacity='0.06'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z'/%3E%3C/g%3E%3C/svg%3E");
  }

  .hero-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 160% at 88% 10%, rgba(212, 160, 23, 0.22) 0%, transparent 58%);
  }
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 1920px;
  margin: 0 auto;
  padding: 14px var(--space-6) 16px;
  min-height: 108px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}

.hero-lead {
  min-width: 0;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(212, 160, 23, 0.18);
  border: 1px solid rgba(212, 160, 23, 0.42);
  border-radius: var(--radius-pill);
  padding: 2px 10px;
  margin-bottom: 5px;
  color: #FFF8E7;
  font-size: 12px;
  letter-spacing: 0.12em;
}

.badge-icon {
  width: 12px;
  height: 12px;
}

.hero-title {
  margin: 0 0 2px;
  font-family: var(--font-title);
  font-size: clamp(1.35rem, 2.1vw, 1.8rem);
  line-height: 1.25;
  letter-spacing: 0.06em;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}

.hero-subtitle {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.78);
}

.hero-stats {
  flex: none;
  display: flex;
  align-items: center;
  gap: 0;
  padding: 8px 4px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--radius-card);
}

.hero-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 82px;
  padding: 0 16px;

  .stat-num {
    font-family: var(--font-en);
    font-size: 1.35rem;
    line-height: 1.2;
    font-weight: 700;
    color: var(--color-secondary-light);
  }

  .stat-label {
    font-size: 12px;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.72);
  }
}

.hero-stat-separator {
  width: 1px;
  height: 26px;
  background: rgba(255, 255, 255, 0.18);
}

.main-content {
  background: var(--color-background);
}

// 地图工作台：视口高度 - 顶栏 72px - 标题条 108px
.map-container {
  display: flex;
  height: calc(100vh - 180px);
  height: calc(100dvh - 180px);
  min-height: 520px;
  // 键盘/锚点定位时避开吸顶导航
  scroll-margin-top: 72px;
}

@media (max-width: 992px) {
  .map-container {
    height: calc(100vh - 180px);
    height: calc(100dvh - 180px);
    min-height: 520px;
  }
}

// ============================================
// 数据洞察区（与地图板块拉开间距 + 独立底色形成视觉区分）
// ============================================
.charts-section {
  margin-top: 32px;
  padding: 60px 0 68px;
  background: linear-gradient(180deg, #F1E6CF 0%, #FAF4E7 40%, #FDF9F0 100%);
  border-top: 1px solid var(--color-border-light);
  box-shadow: inset 0 6px 16px rgba(139, 90, 43, 0.08);

  .section-header {
    margin-bottom: var(--spacing-2xl);
  }

  @media (max-width: 768px) {
    margin-top: 20px;
    padding: 40px 0 48px;
  }
}

// ============================================
// 数据图表（ECharts 容器必须有明确高度，否则高度塌陷）
// ============================================

.charts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.chart-container {
  width: 100%;
  height: 280px;
}

@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-container {
    height: 240px;
  }
}

// ============================================
// Leaflet 真实地图容器
// ============================================

.map-main {
  flex: 1 1 0;
  width: 0;            // 三栏布局下允许地图列自由收缩
  min-width: 0;
  height: 100%;
  min-height: 0;
  position: relative;
  overflow: hidden;
  background: #E8DCC8;
}

// 移动端面板入口：仅 <992px 显示
.sidebar-mobile-toggle {
  display: none;
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1100;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-pill);
  background: rgba(255, 250, 240, 0.96);
  box-shadow: var(--shadow-sm);
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  .toggle-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: var(--radius-pill);
    background: var(--color-secondary);
    color: var(--color-gold-ink);
    font-family: var(--font-en);
    font-size: 12px;
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }
}

// 瓦片加载进度条
.map-loadbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 800;
  overflow: hidden;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40%;
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--color-secondary), transparent);
    opacity: 0;
  }

  &.loading::after {
    opacity: 1;
    animation: mapLoadSlide 1s var(--ease-inout) infinite;
  }
}
@keyframes mapLoadSlide {
  from { transform: translateX(-100%); }
  to { transform: translateX(350%); }
}

.map-view {
  width: 100%;
  height: 100%;
  min-height: 0;
  position: relative;
  z-index: 1;  // 建立层叠上下文，把浮动面板关在地图内，避免越过顶部导航

  // 全屏模式下由该容器（含全部浮动控件）铺满视口
  &:fullscreen,
  &:-webkit-full-screen {
    width: 100%;
    height: 100%;
    background: #E8DCC8;
  }
}

// ============================================
// 点位"小草发芽"动画
// ============================================
// 古道线路聚焦/悬停时的平滑过渡（加粗与淡出不再生硬）
:deep(path.route-path) {
  transition: stroke-width 0.45s var(--ease-out), stroke-opacity 0.45s var(--ease-out);
}

// 标记点击波纹：单次播放，由 JS 在动画结束后移除
:deep(.marker-ripple) {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 16px;
  height: 16px;
  margin: 0 0 -8px -8px;
  border-radius: 50%;
  border: 2px solid var(--color-interactive);
  background: var(--color-interactive-soft);
  pointer-events: none;
  animation: marker-ripple var(--motion-scene) var(--ease-out) forwards;
}

@keyframes marker-ripple {
  from {
    transform: scale(0.45);
    opacity: 0.75;
  }
  to {
    transform: scale(3.2);
    opacity: 0;
  }
}

// 古道名称标签
:deep(.route-label) {
  width: 90px;            // 与 iconSize 一致
  text-align: center;     // 胶囊在定位外壳内居中
  pointer-events: none;
  transition: opacity 0.45s var(--ease-out);
}

:deep(.route-label-pill) {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.28);
  transition: transform 0.2s var(--ease-out);
}

:deep(.sprout-pin) {
  animation-name: sprout;
  animation-duration: 0.55s;
  animation-timing-function: cubic-bezier(0.32, 1.28, 0.48, 1);
  animation-fill-mode: backwards;
  will-change: transform, opacity;
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);

  // 原点固定在各自三角尖端（= 非遗坐标点），从尖端向上长出
  &.tier-national { transform-origin: 50% calc(100% + 16px); }
  &.tier-regional { transform-origin: 50% calc(100% + 12px); }
  &.tier-municipal { transform-origin: 50% calc(100% + 11px); }
  &.tier-county   { transform-origin: 50% calc(100% + 9px); }
}

// 点位交互态：悬停轻微抬起，选中用朱砂描边（静态强调，不持续播放动画）
:deep(.heritage-marker:hover) {
  z-index: 600 !important;

  .sprout-pin {
    transform: translateY(-2px) scale(1.08);
  }
}

:deep(.sprout-pin.is-selected) {
  outline: none;
  // 白底 + 朱砂双环，压在国家级金色描边之上仍清晰可辨
  box-shadow:
    0 0 0 3px #FFFDF7,
    0 0 0 6px var(--color-interactive),
    0 4px 14px rgba(0, 0, 0, 0.32) !important;
  transform: translateY(-2px) scale(1.06);
}

:deep(.heritage-marker.is-selected) {
  z-index: 680 !important;
}

// 悬停标签（Leaflet Tooltip）：与地图配色统一
:deep(.marker-name-tip) {
  padding: 3px 9px;
  border: none;
  border-radius: var(--radius-sm);
  background: rgba(62, 39, 35, 0.94);
  color: #FFF8E7;
  font-size: 12px;
  line-height: 1.5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  white-space: nowrap;

  &::before {
    border-top-color: rgba(62, 39, 35, 0.94);
  }
}

// 同址多点的数量角标：左上角，提示点击后可从选择面板进入各自详情
:deep(.overlap-badge) {
  position: absolute;
  top: -5px; left: -5px;
  min-width: 17px; height: 17px;
  padding: 0 3px;
  display: flex; align-items: center; justify-content: center;
  background: #FFF3D6;
  border: 1.5px solid #8B4513;
  border-radius: 9px;
  color: #8B4513;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  z-index: 2;
  pointer-events: none;
}

@keyframes sprout {
  0% {
    opacity: 0;
    transform: scale(0.12, 0.28);   // 细芽尖初现
  }
  55% {
    opacity: 1;
    transform: scale(1.06, 1.1);    // 舒展并轻微拔高
  }
  78% {
    transform: scale(0.98, 0.97);  // 回弹
  }
  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
}

.leaflet-container {
  width: 100% !important;
  height: 100% !important;
  min-height: 400px;
  outline: none;
  background: #E8DCC8;
  font-family: var(--font-body);
}

// 自定义 popup 样式（匹配丝路主题）
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 10px;
  background: #FDFBF7;
  box-shadow: 0 4px 20px rgba(139, 69, 19, 0.2);
}

:deep(.leaflet-popup-tip) {
  background: #FDFBF7;
}

:deep(.leaflet-popup-content) {
  margin: 12px;
  font-size: 13px;
}

// Leaflet 控件主题化
:deep(.leaflet-control-zoom a) {
  background: #FDFBF7;
  color: #8B4513;
  border: 1px solid #D7CCC8;
  font-weight: bold;
}

:deep(.leaflet-control-zoom a:hover) {
  background: #D4A017;
  color: white;
}

:deep(.leaflet-control-attribution) {
  background: rgba(253, 251, 247, 0.85);
  color: #5D4037;
  font-size: 12px;
  margin: 0 8px 72px 0;
}

// ============================================
// 左侧图层面板（桌面三栏之一；移动端为抽屉）
// ============================================

.map-sidebar {
  flex: 0 0 280px;
  width: 280px;
  min-width: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border-light);
  padding: 12px 14px 18px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  z-index: 2;
  transition:
    flex-basis 0.32s var(--ease-out),
    width 0.32s var(--ease-out),
    padding 0.32s var(--ease-out),
    opacity 0.22s var(--ease-out);

  // 桌面端折叠：宽度收为 0，由工具栏的图层按钮重新展开
  &.is-collapsed {
    flex-basis: 0;
    width: 0;
    padding-left: 0;
    padding-right: 0;
    opacity: 0;
    pointer-events: none;
    border-right: none;
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 2px 2px 11px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--color-border-light);
  text-align: left;

  .header-icon-wrapper {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-xs);

    .header-icon {
      display: block;
    }
  }

  .sidebar-head-text {
    min-width: 0;
  }

  h2 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 15px;
    line-height: 1.3;
    letter-spacing: 0.06em;
    color: var(--color-primary);
  }

  p {
    margin: 1px 0 0;
    font-size: 12px;
    line-height: 1.4;
    color: var(--color-text-muted);
  }
}

// 桌面折叠 / 移动抽屉关闭共用一个按钮
.sidebar-close {
  flex: none;
  margin-left: auto;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: var(--color-paper);
  color: var(--color-text-light);
  cursor: pointer;
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);

  .sidebar-close-bar {
    display: block;
    width: 7px;
    height: 7px;
    margin-left: 2px;
    border-left: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: rotate(45deg);
  }

  &:hover {
    background: var(--color-secondary-soft);
    color: var(--color-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }
}

.search-section {
  padding: 10px 2px 6px;

  .search-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    .search-icon {
      position: absolute;
      left: 11px;
      color: var(--color-text-muted);
      pointer-events: none;
    }

    .custom-input {
      width: 100%;
      padding: 9px 32px 9px 34px;
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-control);
      font-family: var(--font-body);
      font-size: 12.5px;
      color: var(--color-text);
      transition: border-color 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);

      &::placeholder {
        color: var(--color-text-muted);
      }

      &:focus {
        outline: none;
        border-color: var(--color-secondary);
        box-shadow: var(--focus-ring);
      }
    }

    .clear-btn {
      position: absolute;
      right: 8px;
      width: 18px;
      height: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 50%;
      font-size: 16px;
      line-height: 1;
      color: var(--color-text-muted);
      cursor: pointer;

      &:hover {
        background: var(--color-border-light);
        color: var(--color-text);
      }
    }
  }

  .result-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 7px;
    font-size: 11px;
    color: var(--color-text-muted);

    strong {
      font-family: var(--font-en);
      font-size: 13px;
      color: var(--color-primary);
    }
  }

  .link-clear {
    padding: 0;
    border: none;
    background: none;
    color: var(--color-interactive);
    font-family: var(--font-body);
    font-size: 11px;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
    white-space: nowrap;

    &:focus-visible {
      outline: 2px solid var(--color-secondary);
      outline-offset: 2px;
    }
  }
}

// 可折叠分区（筛选 / 图层 / 时期）
.panel-section {
  border-bottom: 1px solid var(--color-border-light);

  &:last-of-type {
    border-bottom: none;
  }
}

.panel-section-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 2px;
  border: none;
  background: transparent;
  color: var(--color-primary);
  font-family: var(--font-body);
  text-align: left;
  cursor: pointer;

  .icon {
    color: var(--color-secondary-dark);
    flex: none;
  }

  h4 {
    margin: 0;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .section-state {
    margin-left: auto;
    font-size: 12px;
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  .section-chevron {
    flex: none;
    font-size: 12px;
    color: var(--color-text-muted);
    transition: transform 0.25s var(--ease-out);
  }

  &:hover .section-chevron {
    color: var(--color-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 1px;
    border-radius: var(--radius-sm);
  }
}

.panel-section.is-open .section-chevron {
  transform: rotate(180deg);
}

.section-collapse {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.28s var(--ease-out);
}

.section-collapse.collapsed {
  grid-template-rows: 0fr;
}

.section-collapse-inner {
  overflow: hidden;
  min-height: 0;
}

.filter-section {
  .filter-group {
    margin-bottom: var(--spacing-md);
    
    label {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
      font-size: 13px;
      color: var(--color-text);
      
      .label-icon {
        font-size: 14px;
      }
    }
    
    .custom-select {
      width: 100%;
      
      :deep(.el-input__wrapper) {
        border-radius: var(--radius-md);
        box-shadow: 0 0 0 1px var(--color-border-light) inset;
        
        &:hover {
          box-shadow: 0 0 0 1px var(--color-secondary) inset;
        }
      }
    }

    .filter-hint {
      margin: 4px 0 0;
      font-size: 11px;
      line-height: 1.5;
      color: var(--color-text-muted);
    }
  }
  
  .btn-reset {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 10px 16px;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    color: var(--color-text);
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.3s var(--ease-out), color 0.3s var(--ease-out);

    &:hover {
      border-color: var(--color-secondary);
      color: var(--color-secondary);
    }
  }
}

.layer-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-bottom: 8px;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  background: var(--color-background);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.2s var(--ease-out), border-color 0.2s var(--ease-out);

  // 保留原生 checkbox 的键盘可达性，仅视觉隐藏
  input[type="checkbox"] {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    border-color: var(--color-border);
  }

  &:has(input:focus-visible) {
    outline: 2px solid var(--color-secondary);
    outline-offset: 1px;
  }

  &.is-on {
    background: #FFFDF6;
    border-color: var(--color-border-light);
  }

  .layer-icon {
    flex: none;
    width: 26px;
    height: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    background: var(--color-sand);
    color: var(--color-text-light);
    transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
  }

  &.is-on .layer-icon {
    background: var(--color-secondary-soft);
    color: var(--color-primary);
  }

  .layer-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .layer-name {
    font-size: 12.5px;
    line-height: 1.45;
    color: var(--color-text);
  }

  .layer-desc {
    font-size: 12px;
    line-height: 1.4;
    color: var(--color-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .layer-state {
    flex: none;
    font-family: var(--font-en);
    font-size: 12px;
    color: var(--color-secondary-dark);
    white-space: nowrap;

    &.is-off {
      color: var(--color-text-muted);
    }
  }

  .layer-switch {
    flex: none;
    width: 33px;
    height: 19px;
    background: var(--color-border);
    border-radius: 10px;
    position: relative;
    transition: background-color 0.25s var(--ease-out);

    .switch-knob {
      position: absolute;
      top: 2.5px;
      left: 2.5px;
      width: 14px;
      height: 14px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
      transition:
        transform 0.25s var(--ease-out),
        background-color 0.25s var(--ease-out);

      &.checked {
        transform: translateX(14px);
        background: #fff;
      }
    }
  }

  &.is-on .layer-switch {
    background: var(--color-secondary);
  }
}

.timeline-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 2px 4px;

  .time-filter-toggle {
    margin-left: 0;
  }

  .play-btn {
    margin-left: auto;
  }
}

.timeline-wrapper {
  padding: var(--spacing-sm) 2px 8px;
    
    .timeline-slider {
      width: 100%;
      height: 6px;
      background: var(--color-sand);
      border-radius: 3px;
      appearance: none;
      outline: none;
      
      &::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        background: var(--color-secondary);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(212, 160, 23, 0.4);
      }

      &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border: none;
        background: var(--color-secondary);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(212, 160, 23, 0.4);
      }

      // 键盘焦点指示（原 outline:none 的可访问替代）
      &:focus-visible {
        outline: none;

        &::-webkit-slider-thumb {
          box-shadow:
            0 2px 6px rgba(212, 160, 23, 0.4),
            0 0 0 4px rgba(212, 160, 23, 0.25);
        }
        &::-moz-range-thumb {
          box-shadow:
            0 2px 6px rgba(212, 160, 23, 0.4),
            0 0 0 4px rgba(212, 160, 23, 0.25);
        }
      }
    }
    
    .timeline-marks {
      display: flex;
      justify-content: space-between;
      margin-top: var(--spacing-sm);
      
      span {
        font-size: 11px;
        color: var(--color-text-muted);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        transition: background-color 0.3s var(--ease-out), color 0.3s var(--ease-out);

        &.active {
          background: var(--color-secondary);
          color: var(--color-gold-ink);
        }
      }
    }
    
    .current-period {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: var(--spacing-md);
      padding: 8px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      border-radius: var(--radius-full);
      color: white;
      font-size: 13px;
      font-weight: 600;

      // 筛选生效时的状态提示，与常驻展示态区分
      .period-flag {
        padding: 1px 7px;
        border: 1px solid rgba(255, 255, 255, 0.7);
        border-radius: var(--radius-full);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
    }
}

// ============================================
// 时间轴筛选开关
// ============================================
.time-filter-toggle {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  padding: 3px 8px 3px 5px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-full);
  background: var(--color-paper);
  color: var(--color-text-muted);
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);

  .time-switch {
    position: relative;
    flex: none;
    width: 26px;
    height: 15px;
    border-radius: 8px;
    background: var(--color-border);
    transition: background-color 0.25s var(--ease-out);

    .time-switch-knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.25s var(--ease-out);
    }
  }

  &.is-on {
    color: var(--color-primary);
    border-color: var(--color-secondary);
    background: #FFF9EC;

    .time-switch { background: var(--color-secondary); }
    .time-switch-knob { transform: translateX(11px); }
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }
}

// ============================================
// 时光回放按钮
// ============================================
.play-btn {
  flex: none;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
  color: #fff;
  font-size: 11px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(139, 69, 19, 0.3);
  transition: transform 0.2s var(--ease-out);

  &:hover { transform: scale(1.1); }
}

// ============================================
// 地图浮动工具栏（2 列图标面板，统一 Tooltip）
// ============================================
.floating-toolbar {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
  background: rgba(255, 250, 240, 0.96);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(4px);

  &.collapsed {
    width: auto;
    padding: 5px 10px;
  }
}

// 工具栏折叠开关：与 .legend-toggle / .base-toggle 保持同一形态
.toolbar-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  border: none;
  background: transparent;
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0 2px;

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
}

.toolbar-body {
  display: grid;
  grid-template-columns: repeat(2, 34px);
  gap: 4px;
  margin-top: 5px;
}

.toolbar-divider {
  grid-column: 1 / -1;
  height: 1px;
  margin: 2px 3px;
  background: var(--color-border-light);
}

.toolbar-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);

  &:hover {
    background: rgba(212, 160, 23, 0.16);
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 1px;
  }

  &.active {
    background: var(--color-secondary);
    color: var(--color-gold-ink);
  }

  &.busy {
    animation: toolbarPulse 1.1s ease-in-out infinite;
  }

  &:disabled {
    opacity: 0.34;
    cursor: not-allowed;
    background: transparent;
  }

  // Tooltip（纯 CSS，避免引入额外依赖；键盘聚焦同样可见）
  &::after {
    content: attr(data-tip);
    position: absolute;
    top: 50%;
    right: calc(100% + 9px);
    transform: translateY(-50%) translateX(4px);
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    background: rgba(62, 39, 35, 0.94);
    color: #FFF8E7;
    font-family: var(--font-body);
    font-size: 11px;
    line-height: 1.4;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    box-shadow: var(--shadow-sm);
    transition: opacity 0.16s var(--ease-out), transform 0.16s var(--ease-out);
    z-index: 5;
  }

  &:hover::after,
  &:focus-visible::after,
  &.busy::after {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

@keyframes toolbarPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

.toolbar-icon {
  width: 17px;
  height: 17px;
  flex: none;
}

// ============================================
// 测距提示横幅
// ============================================
.measure-hint {
  position: absolute;
  top: 14px;
  left: 50%;
  z-index: 1000;
  transform: translateX(-50%);
  padding: 7px 18px;
  background: rgba(198, 40, 40, 0.92);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hint-fade-enter-active,
.hint-fade-leave-active {
  transition: opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out);
}
.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}

// 底图自动降级提示（与测距提示同一位置与动效）
.base-notice {
  position: absolute;
  top: 14px;
  left: 50%;
  z-index: 1000;
  transform: translateX(-50%);
  padding: 7px 18px;
  background: rgba(62, 39, 35, 0.92);
  color: #FFF8E7;
  border: 1px solid rgba(212, 160, 23, 0.5);
  border-radius: var(--radius-full);
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

// 测距模式十字光标
:deep(.measure-cursor),
:deep(.measure-cursor .leaflet-grab),
:deep(.measure-cursor .leaflet-interactive) {
  cursor: crosshair !important;
}

// 测距结果气泡
:deep(.measure-tip) {
  background: #C62828;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);

  &::before { display: none; }
}

// ============================================
// 古道聚焦信息卡
// ============================================
.route-focus-card {
  position: absolute;
  top: 246px;
  right: 12px;
  bottom: 78px;   // 底部止于底图切换按钮上方，绝不重叠（按钮区约 64px 高 + 间距）
  z-index: 1000;
  width: 280px;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.route-card-close {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-light);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: var(--color-primary);
  }
}

.route-card-head {
  display: flex;
  align-items: stretch;
  gap: 10px;
  margin-bottom: var(--spacing-md);

  .route-card-line {
    width: 4px;
    border-radius: 2px;
  }

  .route-card-headtext {
    h3 {
      margin: 0 0 2px;
      font-size: 1.15rem;
      color: var(--color-primary);
    }
  }

  .route-card-meta {
    font-size: 12px;
    color: var(--color-text-light);
  }
}

.route-card-desc {
  margin: 0 0 var(--spacing-md);
  font-size: 13px;
  line-height: 1.85;
  color: var(--color-text);
}

.route-card-chartnote {
  margin: 0 0 var(--spacing-md);
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-primary);
  background: rgba(212, 160, 23, 0.12);
  border-left: 3px solid var(--color-secondary);
  border-radius: 4px;
}

.route-card-items-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-light);
  margin-bottom: 8px;

  em {
    font-style: normal;
    color: var(--color-secondary-dark);
  }
}

.route-card-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.route-item-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 12px;
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    border-color 0.2s var(--ease-out),
    background-color 0.2s var(--ease-out),
    transform 0.2s var(--ease-out);

  .chip-name {
    font-size: 13px;
    color: var(--color-primary);
  }

  .chip-level {
    font-size: 11px;
    color: var(--color-secondary-dark);
    background: rgba(212, 160, 23, 0.14);
    padding: 1px 7px;
    border-radius: var(--radius-full);
    white-space: nowrap;
  }

  &:hover {
    border-color: var(--color-secondary);
    background: rgba(212, 160, 23, 0.08);
    transform: translateX(-3px);
  }
}

.card-slide-enter-active,
.card-slide-leave-active {
  transition: opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out);
}
.card-slide-enter-from,
.card-slide-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

// ============================================
// 图例面板
// ============================================
.map-legend {
  position: absolute;
  bottom: 26px;
  left: 12px;
  z-index: 1000;
  width: 172px;
  padding: 8px 10px;
  // 卡片面统一处理：本卡此前只挂了 .card-silk（仅背景），实测圆角 0px、无边框、无阴影，
  // 是页面上唯一一个直角、无边界、直接贴死底图的卡片面，与 .base-switcher（同位置浮层：
  // 12px 圆角 + 1px 边框 + shadow-md）和 .chart-card（12px 圆角）明显不一致。
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);

  &.collapsed {
    width: auto;
    padding: 6px 10px;
  }
}

// 图例卡片内的比例尺行（动态插入的 DOM，用 :deep 命中）
:deep(.map-legend .legend-scale-wrap) {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px dashed var(--color-border-light);

  .legend-scale-label {
    font-size: 11px;
    color: var(--color-text-light);
  }

  // 融入图例卡片：去掉原生白底与边框，只保留刻度线
  .leaflet-control-scale-line {
    position: static;
    margin: 0;
    padding: 2px 4px 0;
    background: transparent;
    border: none;
    border-top: 2px solid var(--color-primary);
    color: var(--color-text-light);
    font-size: 10px;
    line-height: 1.3;
  }
}

.legend-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  border: none;
  background: transparent;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.legend-body {
  margin-top: 6px;
}

.legend-group {
  margin-bottom: 6px;

  &:last-child { margin-bottom: 0; }
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text);
  line-height: 1.9;
}

// 图例样本槽位：所有样本同宽（22px）并在槽位内居中，
// 使各行文字左边缘落在同一条竖线上（原先 16/22/26 三种宽度导致文字错位最多 10px）；
// 槽位固定 24px 高，用于容纳图钉样本的下尖角，保证加了尖角后各行行高仍完全一致
.legend-slot {
  flex: none;
  width: 22px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

// 保护级别样本：与地图标记同构缩小 —— 圆形色底 + 级别色描边 + 级别图标 + 底部下尖角。
// 形状取自地图标记（levelIcon：圆 + border 三角尖角），直径按地图 46/33/27 → 图例 20/16/13 缩小，
// 尖角按同一比例取高 4/3/3px、半宽 3/2/2px
.sample-marker {
  --pin-color: var(--color-primary);
  --pin-tip: 3px; // 下尖角高度
  --pin-tw: 2px; // 下尖角半宽

  flex: none;
  position: relative;
  box-sizing: border-box;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  // 下尖角：与地图标记同一构造（左右透明边框 + 级别色上边框三角），
  // 上移 2px 与圆下缘咬合，避免圆底切线处露出缝隙
  &::after {
    content: '';
    position: absolute;
    top: calc(100% - 2px);
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: var(--pin-tw) solid transparent;
    border-right: var(--pin-tw) solid transparent;
    border-top: var(--pin-tip) solid var(--pin-color);
  }

  // 国家级：最重的描边 + 金色光环，与地图上国家级标记的强调方式呼应
  &.national {
    --pin-color: var(--level-national);
    --pin-tip: 4px;
    --pin-tw: 3px;
    width: 20px;
    height: 20px;
    border: 2px solid var(--level-national);
    background: #FFF8F1;
    box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.45);
  }

  // 描边只保留「国家级更重」这一级差异：16/13px 圆上的 1.5px 级差会被浏览器取整成 1px，
  // 层级感改由直径与图标尺寸承担（20/16/13、12/10/8），与地图 46/33/27 的比例一致
  &.regional {
    --pin-color: var(--level-regional);
    width: 16px;
    height: 16px;
    border: 1px solid var(--level-regional);
    background: #FDFBF7;
  }

  &.municipal {
    --pin-color: var(--level-municipal);
    width: 13px;
    height: 13px;
    border: 1px solid var(--level-municipal);
    background: #F3F7FA;
  }
}

.sample-line {
  flex: none;
  width: 20px;
  height: 4px;
  border-radius: 2px;
  background: var(--color-secondary);
}

.sample-heat {
  flex: none;
  width: 20px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(198, 40, 40, 0.5), rgba(139, 69, 19, 0.12) 70%, transparent);
}

// 与行政区填色图层共用同一组 5 级色阶（数量少 → 多），保证图例与地图配色一致
.sample-grad {
  flex: none;
  width: 20px;
  height: 10px;
  border-radius: 2px;
  background: linear-gradient(90deg, #F7E8CB, #EAC582, #D4A017, #9F6E1E, #6D4812);
}

.legend-empty {
  font-size: 11px;
  color: var(--color-text-light);
}

// ============================================
// 底图切换
// ============================================
.base-switcher {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: rgba(255, 250, 240, 0.95);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);

  // 折叠态（手动折叠、或详情预览弹窗打开时自动收起）：只留标题开关，收成小标签
  &.collapsed {
    padding: 4px 10px;
  }

  // 折叠开关：与 .legend-toggle / .toolbar-toggle 同一形态
  .base-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 2px;
    border: none;
    background: transparent;
    color: var(--color-primary);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
  }

  .base-body { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 4px; max-width: min(420px, calc(100vw - 60px)); }

  .base-body button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px 10px;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-out);

    .base-icon { width: 16px; height: 16px; color: var(--color-primary); flex: none; }
    .base-label { font-size: 12px; color: var(--color-text-light); }

    &:hover { background: rgba(212, 160, 23, 0.15); }

    &:focus-visible {
      outline: 2px solid var(--color-secondary);
      outline-offset: 2px;
    }

    &.active {
      background: var(--color-secondary);

      .base-icon,
      .base-label { color: var(--color-gold-ink); }
    }
  }
}

// ============================================
// 实时经纬度读数
// ============================================
.coord-readout {
  position: absolute;
  bottom: 14px;
  left: 50%;
  z-index: 900;
  transform: translateX(-50%);
  padding: 4px 14px;
  background: rgba(62, 39, 35, 0.82);
  color: #F5E6C8;
  border-radius: var(--radius-full);
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
}

// ============================================
// 图表联动提示（图表区下方，右下角）
// ============================================
.chart-link-hint {
  margin: 18px 0 0;
  padding: 8px 14px;
  background: rgba(253, 248, 240, 0.92);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-secondary-dark);
}

// 桌面端：收缩为靠右胶囊（移动端为块级，避免 nowrap 溢出）
@media (min-width: 993px) {
  .chart-link-hint {
    display: table;
    margin-left: auto;
    border-radius: 999px;
    white-space: nowrap;
  }
}

// ============================================
// 列表视图覆盖层
// ============================================
.list-view-overlay {
  position: absolute;
  inset: 0;
  z-index: 600;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f4ead7 0%, #ede0c8 100%);
}

.list-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: 22px 28px 15px;
  border-bottom: 1px solid var(--color-border-light);
  background: rgba(253, 248, 231, 0.88);

  h3 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 20px;
    letter-spacing: 0.04em;
    color: var(--color-gold-ink);
  }
}

.list-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.list-count {
  font-size: 13px;
  color: var(--color-secondary-dark);
  white-space: nowrap;
}

// 列表视图内「返回地图」入口（列表打开时工具栏折叠让位，故在此提供出口）
.list-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: rgba(212, 160, 23, 0.12);
  color: var(--color-primary);
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out);

  &:hover { background: rgba(212, 160, 23, 0.22); }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }
}

.list-items {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 18px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 15px 20px;
  background: linear-gradient(180deg, #fdf8eb 0%, #f7efdd 100%);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out),
              border-color 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(212, 160, 23, 0.5);
    box-shadow: var(--shadow-md);

    .action-arrow {
      color: #fff8e7;
      background: var(--color-secondary);
      transform: translateX(4px);
    }
  }

  // 键盘可见焦点：列表项可作为 role=button 聚焦并用 Enter/Space 打开详情
  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
    border-color: rgba(212, 160, 23, 0.5);
    box-shadow: var(--shadow-md);
  }
}

.item-image {
  position: relative;
  flex: 0 0 auto;
  width: 86px;
  height: 86px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: linear-gradient(135deg, #d8c6a6 0%, #c2ac85 100%);
  box-shadow: inset 0 0 0 1px rgba(62, 42, 8, 0.08);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;

    &.is-failed { display: none; }
  }
}

.item-char {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 700;
  color: rgba(253, 246, 227, 0.92);
  text-shadow: 0 1px 3px rgba(62, 42, 8, 0.28);
}

.item-content {
  flex: 1;
  min-width: 0;

  p {
    margin: 6px 0 8px;
    font-size: 13px;
    line-height: 1.65;
    color: #6b5a44;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.item-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  h4 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 17px;
    color: var(--color-gold-ink);
  }
}

.item-badge {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  line-height: 1.6;
  white-space: nowrap;

  &.badge-gold {
    background: linear-gradient(135deg, #d4a017 0%, #b8860b 100%);
    color: #fff8e7;
    box-shadow: 0 2px 6px rgba(184, 134, 11, 0.35);
  }

  &.badge-silver {
    background: linear-gradient(135deg, #a0825a 0%, #8b4513 100%);
    color: #fdf6e3;
  }
}

.item-tags {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}

.tag-sm {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 9px;
  border-radius: var(--radius-full);
  font-size: 11px;
  line-height: 1.6;

  &.tag-category { background: rgba(212, 160, 23, 0.16); color: #8a6708; }
  &.tag-location { background: rgba(139, 69, 19, 0.10); color: #6d3410; }
  &.tag-period   { background: rgba(46, 109, 87, 0.12);  color: #23634a; }
}

.item-action {
  flex: 0 0 auto;
}

.action-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  background: rgba(212, 160, 23, 0.16);
  color: var(--color-secondary-dark);
  font-size: 16px;
  transition: transform 0.3s var(--ease-out), color 0.3s var(--ease-out),
              background 0.3s var(--ease-out);
}

// 列表视图入场动画
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.38s var(--ease-out), opacity 0.3s var(--ease-out);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(28px);
  opacity: 0;
}

// ============================================
// 右侧非遗详情面板（桌面第三栏 / 窄屏浮层 / 移动底部面板）
// ============================================
.map-detail-panel {
  flex: 0 0 340px;
  width: 340px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-paper);
  border-left: 1px solid var(--color-border-light);
  overflow: hidden;
  outline: none;
  z-index: 2;

  &:focus {
    outline: none;
  }
}

.detail-panel-head {
  flex: none;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 11px 14px 10px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border-light);
}

.detail-panel-headtext {
  min-width: 0;
}

.panel-eyebrow {
  display: block;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--color-secondary-dark);
}

.panel-coord {
  display: block;
  margin-top: 2px;
  font-family: var(--font-en);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.detail-panel-close {
  flex: none;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: var(--color-paper);
  color: var(--color-text-light);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);

  &:hover {
    background: var(--color-interactive-soft);
    color: var(--color-interactive);
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }
}

.detail-panel-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.detail-panel-figure {
  position: relative;
  margin: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: linear-gradient(135deg, #D8C6A6 0%, #C2AC85 100%);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s var(--ease-out);

    &.is-failed {
      display: none;
    }
  }

  .level-badge {
    position: absolute;
    left: 12px;
    bottom: 12px;
    z-index: 1;
    box-shadow: var(--shadow-sm);
  }
}

.detail-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-char {
  font-family: var(--font-display);
  font-size: 60px;
  font-weight: 700;
  color: rgba(253, 246, 227, 0.92);
  text-shadow: 0 2px 4px rgba(62, 42, 8, 0.28);
}

.level-badge {
  display: inline-block;
  padding: 3px 11px;
  border-radius: var(--radius-full);
  font-size: 11px;
  color: #FFF8E7;

  &.level-national {
    background: linear-gradient(135deg, #D4A017 0%, #B8860B 100%);
  }

  &.level-regional {
    background: linear-gradient(135deg, rgba(160, 130, 90, 0.94) 0%, rgba(139, 69, 19, 0.94) 100%);
  }

  &.level-municipal {
    background: linear-gradient(135deg, rgba(90, 130, 158, 0.94) 0%, rgba(62, 110, 140, 0.94) 100%);
  }
}

.detail-panel-body {
  padding: 14px 15px 20px;
  min-width: 0;

  h2 {
    margin: 0 0 9px;
    font-family: var(--font-title);
    font-size: 24px;
    line-height: 1.35;
    letter-spacing: 0.03em;
    color: var(--color-gold-ink);
  }
}

.detail-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.detail-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 9px;
  border-radius: var(--radius-full);
  font-size: 11px;
  line-height: 1.6;

  &.tag-category { background: rgba(212, 160, 23, 0.16); color: #8A6708; }
  &.tag-location { background: rgba(139, 69, 19, 0.10); color: #6D3410; }
  &.tag-period   { background: rgba(46, 109, 87, 0.12);  color: #23634A; }
}

.detail-intro {
  margin: 0 0 14px;
  padding-left: 11px;
  border-left: 3px solid var(--color-secondary);
  font-size: 13px;
  line-height: 1.8;
  color: #5C4A33;
}

.detail-facts {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0 0 16px;

  div {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 6px 9px;
    background: var(--color-background);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-sm);
  }

  dt {
    flex: none;
    width: 54px;
    font-size: 10.5px;
    color: var(--color-text-muted);
  }

  dd {
    margin: 0;
    min-width: 0;
    font-size: 12px;
    line-height: 1.6;
    color: var(--color-text);
    word-break: break-word;
  }
}

.detail-panel-actions {
  display: flex;
  gap: 8px;

  .btn-primary {
    flex: 1.35;
  }

  .btn-secondary {
    flex: 1;
  }
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 9px 12px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.25s var(--ease-out),
    box-shadow 0.25s var(--ease-out),
    background 0.25s var(--ease-out);
}

.btn-primary {
  background: linear-gradient(135deg, #A05A2C 0%, #8B4513 100%);
  color: #FDF6E3;
  box-shadow: 0 3px 10px rgba(139, 69, 19, 0.28);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(139, 69, 19, 0.36);
  }
}

.btn-secondary {
  background: transparent;
  border-color: rgba(139, 69, 19, 0.4);
  color: var(--color-primary);

  &:hover {
    background: rgba(139, 69, 19, 0.08);
    transform: translateY(-1px);
  }
}

.btn-primary:focus-visible,
.btn-secondary:focus-visible,
.detail-panel-close:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}

// 窄屏浮层遮罩（桌面端隐藏，面板为独立第三栏）
.detail-panel-backdrop {
  display: none;
  position: fixed;
  inset: 72px 0 0;
  z-index: 1500;
  background: rgba(43, 28, 12, 0.45);
  backdrop-filter: blur(2px);
}

// 面板转场：桌面从右侧滑入，窄屏从底部浮起
.panel-slide-enter-active {
  transition:
    opacity var(--motion-base) var(--ease-out),
    transform var(--motion-base) var(--ease-out);
}

.panel-slide-leave-active {
  transition:
    opacity var(--motion-fast) var(--ease-out),
    transform 180ms var(--ease-out);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateX(32px);
}

// ============================================
// 图表卡片与章节标题
// ============================================
.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}

.header-decoration {
  display: flex;
  align-items: center;
  gap: 14px;
}

.deco-line {
  width: 42px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, var(--color-secondary));

  &:last-child {
    background: linear-gradient(90deg, var(--color-secondary), transparent);
  }
}

.section-title {
  margin: 0;
  font-family: var(--font-title);
  font-size: 26px;
  letter-spacing: 0.08em;
  color: var(--color-gold-ink);
}

.chart-card {
  padding: 20px 20px 12px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.chart-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  h3 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 17px;
    color: var(--color-gold-ink);

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 16px;
      margin-right: 9px;
      border-radius: 2px;
      background: linear-gradient(180deg, var(--color-secondary), var(--color-primary));
      vertical-align: -2px;
    }
  }
}

// ============================================
// 窄屏适配：左侧面板转抽屉，详情面板转浮层 / 底部面板
// ============================================
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1279px) {
  .detail-panel-backdrop {
    display: block;
  }

  .map-detail-panel {
    position: fixed;
    left: auto;
    right: 12px;
    bottom: 12px;
    width: 380px;
    max-height: calc(100dvh - 96px);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-panel);
    box-shadow: var(--shadow-xl);
    z-index: 1600;
  }

  .detail-panel-scroll {
    max-height: calc(100dvh - 150px);
  }

  .panel-slide-enter-from,
  .panel-slide-leave-to {
    transform: translateY(32px);
  }
}

@media (max-width: 991px) {
  .hero-inner {
    padding: 11px 16px 12px;
    min-height: 96px;
    gap: 12px;
  }

  .hero-title {
    font-size: 1.3rem;
  }

  .hero-subtitle {
    font-size: 12px;
  }

  .hero-stats {
    padding: 6px 2px;
  }

  .hero-stat-item {
    min-width: 68px;
    padding: 0 10px;

    .stat-num {
      font-size: 1.15rem;
    }
  }

  .map-container {
    height: calc(100dvh - 180px);
    min-height: 480px;
  }

  // 左侧面板改为左侧抽屉（默认收起，由地图左上的按钮打开）
  .map-sidebar {
    position: fixed;
    top: 72px;
    bottom: 0;
    left: 0;
    width: min(86vw, 320px);
    height: auto;
    max-height: none;
    flex: none;
    padding: 14px;
    border-right: 1px solid var(--color-border);
    box-shadow: var(--shadow-xl);
    transform: translateX(-100%);
    transition: transform 0.3s var(--ease-out);
    z-index: 1600;

    &.is-open {
      transform: translateX(0);
    }

    // 桌面折叠态在移动端不生效：抽屉由 is-open 控制
    &.is-collapsed {
      width: min(86vw, 320px);
      flex-basis: auto;
      padding: 14px;
      opacity: 1;
      pointer-events: auto;
      border-right: 1px solid var(--color-border);
    }
  }

  .sidebar-mobile-toggle {
    display: inline-flex;
  }

  .sidebar-backdrop {
    position: fixed;
    inset: 72px 0 0;
    z-index: 1500;
    background: rgba(43, 28, 12, 0.45);
    backdrop-filter: blur(2px);
  }

  // Leaflet 默认缩放控件下移，避开移动端面板入口
  .map-view :deep(.leaflet-top.leaflet-left) {
    top: 46px;
  }

  .list-header { padding: 16px 18px 12px; }
  .list-items { padding: 14px 16px 20px; gap: 12px; }
  .list-item { gap: 13px; padding: 12px 14px; }
  .item-image { width: 64px; height: 64px; }
  .item-char { font-size: 26px; }
  .item-header h4 { font-size: 15px; }
  .item-content p { margin: 4px 0 6px; }
  .item-action { display: none; }

  // 古道聚焦卡：窄屏改为贴底横向卡片，底部让开底图切换按钮
  .route-focus-card {
    top: auto;
    bottom: 96px;
    left: 12px;
    right: 12px;
    width: auto;
    max-height: 52%;
  }

  .section-title { font-size: 22px; }
}

@media (max-width: 767px) {
  .hero-inner {
    flex-wrap: wrap;
    gap: 5px 12px;
    min-height: 0;
    padding: 10px 16px 11px;
  }

  // 手机首屏以地图为主：隐藏平台徽标，保留标题与真实数据
  .hero-badge {
    display: none;
  }

  .hero-title {
    font-size: 1.2rem;
  }

  .hero-subtitle {
    font-size: 12px;
  }

  .hero-stats {
    width: 100%;
    justify-content: space-between;
    padding: 4px 2px;
    margin-top: 1px;
  }

  .hero-stat-item {
    flex: 1;

    .stat-num {
      font-size: 1.05rem;
    }
  }

  .map-container {
    height: calc(100dvh - 198px);
    min-height: 440px;
  }

  // 工具栏在手机上默认收起；展开时改为 3 列，减少对地图的遮挡
  .floating-toolbar:not(.collapsed) .toolbar-body {
    grid-template-columns: repeat(3, 34px);
  }

  .map-detail-panel {
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    max-height: 72dvh;
    border-radius: var(--radius-panel) var(--radius-panel) 0 0;
    border-bottom: none;
  }

  .detail-panel-head {
    position: relative;
    padding-top: 15px;

    // 底部面板拖拽条
    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 50%;
      width: 36px;
      height: 4px;
      border-radius: 2px;
      background: var(--color-border);
      transform: translateX(-50%);
    }
  }

  .detail-panel-scroll {
    max-height: calc(72dvh - 56px);
  }

  .detail-panel-figure {
    aspect-ratio: 16 / 9;
  }

  .detail-panel-body {
    padding: 12px 14px 18px;

    h2 {
      font-size: 21px;
    }
  }
}

// ============================================
// 打印样式：仅保留地图主体、图例（含比例尺）、
// 打印抬头（标题 + 数据来源），隐藏一切交互 UI
// ============================================
.print-only { display: none; }

@media print {
  // 隐藏与地图内容无关的区块与浮层
  .page-hero,
  .map-sidebar,
  .floating-toolbar,
  .base-switcher,
  .route-focus-card,
  .list-view-overlay,
  .charts-section,
  .coord-readout,
  .map-detail-panel,
  .detail-panel-backdrop,
  .sidebar-mobile-toggle,
  .sidebar-backdrop,
  .base-notice,
  .map-loadbar { display: none !important; }

  // Leaflet 交互控件（缩放按钮、弹窗）不随打印输出；attribution 保留作数据来源说明
  :deep(.leaflet-control-zoom),
  :deep(.leaflet-popup) { display: none !important; }

  .print-only { display: block; }

  .print-header {
    padding: 0 0 10px;
    border-bottom: 2px solid var(--color-secondary);
    margin-bottom: 10px;

    h1 {
      margin: 0 0 4px;
      font-size: 18pt;
      color: #6d3410;
    }

    p {
      margin: 0;
      font-size: 9pt;
      color: #666;
    }
  }

  // 打印布局：地图区域铺满页宽，给定固定高度避免容器塌缩
  .main-content { padding: 0 !important; }
  .map-container { display: block !important; padding: 0 !important; }
  .map-main {
    width: 100% !important;
    padding: 0 !important;
    overflow: visible !important;
  }
  .map-view {
    height: 620px !important;
    border: 1px solid #ccc;
  }
  #heritage-leaflet-map { height: 100% !important; }

  // 图例卡片在打印中保持可见但去除屏幕端浮层定位阴影
  .map-legend {
    position: absolute !important;
    box-shadow: none !important;
    border: 1px solid #ccc;
  }
}
</style>