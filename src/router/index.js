import { createRouter, createWebHistory } from 'vue-router'
import { heritageData } from '../data/heritageData'

// 站点常量：标题后缀、规范域名、社交分享默认图（均为线上真实信息，取自 README 部署地址）
const SITE_NAME = '宁夏丝路非遗地理志'
const SITE_URL = 'https://ningxia-silk-heritage-gis.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/logo.svg`

// 各路由独立 SEO 元数据。title / description 均取自对应页面的真实标题与副标题，
// 不做臆造文案；indexable=false 用于不该被搜索引擎收录的兜底路由（noindex）
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
    meta: {
      title: `${SITE_NAME} · GIS 时空可视化平台`,
      description: '立足宁夏丝路非遗，以 GIS 与 WebGIS 技术让丝路非遗在数字地图上看得见、查得到、讲得清、传得开。'
    }
  },
  {
    path: '/project',
    name: 'Project',
    component: () => import('../pages/Project.vue'),
    meta: {
      title: `项目概况 · ${SITE_NAME}`,
      description: '基于 GIS 与 WebGIS 的宁夏丝路非遗数字化保护、时空可视化与传播展示平台的项目背景、技术路线与创新亮点。'
    }
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('../pages/Map.vue'),
    meta: {
      title: `丝路非遗 GIS 地图 · ${SITE_NAME}`,
      description: '以交互式地图探索宁夏丝路非遗的空间分布格局与历史演变脉络，支持级别、类别、时期筛选与丝路古道联动。'
    }
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('../pages/Archive.vue'),
    meta: {
      title: `数字档案 · ${SITE_NAME}`,
      description: '全面收录宁夏丝路沿线非物质文化遗产项目，提供分类检索、级别标识与项目详情查看。'
    }
  },
  {
    path: '/archive/:id',
    name: 'Detail',
    component: () => import('../pages/Detail.vue'),
    meta: {
      title: `项目档案 · ${SITE_NAME}`,
      description: '宁夏丝路非物质文化遗产项目档案：项目概述、技艺特色、文化价值与丝路关联。'
    }
  },
  {
    path: '/protection',
    name: 'Protection',
    component: () => import('../pages/Protection.vue'),
    meta: {
      title: `保护路径与乡村振兴 · ${SITE_NAME}`,
      description: '探索宁夏丝路非遗保护与乡村振兴协同发展的新路径。'
    }
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('../pages/Results.vue'),
    meta: {
      title: `项目成果与资讯 · ${SITE_NAME}`,
      description: '记录项目进展 · 分享研究成果 · 传播非遗文化，汇集宁夏丝路非遗地理志项目的阶段性成果与资讯。'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/About.vue'),
    meta: {
      title: `关于我们 · ${SITE_NAME}`,
      description: '以 GIS 技术为支撑，构建宁夏丝路非遗数字化保护与展示平台。'
    }
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('../pages/Screen.vue'),
    meta: {
      fullscreen: true,
      title: `三维数据大屏 · ${SITE_NAME}`,
      description: '宁夏丝路非遗三维数据大屏：三维地形、项目类别构成、地市分布与丝路古道脉络的可视化呈现。'
    }
  },
  {
    // 兜底路由不对应真实内容，标记为 noindex，避免被当作有效页面索引
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
    meta: {
      title: `页面未找到 · ${SITE_NAME}`,
      description: '抱歉，您访问的页面不存在或已被移动。',
      indexable: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// ========== 逐路由 SEO：title / description / canonical / Open Graph ==========
// 仅使用原生 DOM API，不引入任何新依赖；在路由切换后统一写入 head

const setMeta = (attr, key, content) => {
  if (content === undefined || content === null || content === '') return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const setLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const applySeo = (to) => {
  const meta = to.meta || {}
  let title = meta.title
  let description = meta.description

  // 详情页标题/描述取自真实项目数据（名称、类别、级别、地市、简介），不做臆造
  if (to.name === 'Detail') {
    const item = heritageData.find(h => String(h.id) === String(to.params.id))
    if (item) {
      title = `${item.name} · 项目档案 · ${SITE_NAME}`
      const intro = (item.intro || '').trim()
      description = `${item.name}｜${item.category} · ${item.level} · ${item.city}。${intro.slice(0, 90)}`
    }
  }
  if (!title) title = SITE_NAME
  document.title = title

  // canonical 使用不含查询参数的路径：?city=&route=&id= 等筛选/深链 URL
  // 一律归一到同一规范页，避免被搜索引擎误判为多个独立页面
  const canonical = `${SITE_URL}${to.path === '/' ? '/' : to.path}`
  setLink('canonical', canonical)

  setMeta('name', 'description', description)
  setMeta('name', 'robots', meta.indexable === false ? 'noindex, nofollow' : 'index, follow')

  // Open Graph（面向公开分享）
  setMeta('property', 'og:site_name', SITE_NAME)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:locale', 'zh_CN')
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', canonical)
  setMeta('property', 'og:image', DEFAULT_IMAGE)

  // Twitter / 微博分享卡片
  setMeta('name', 'twitter:card', 'summary')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', DEFAULT_IMAGE)
}

// 懒加载分包期间给出轻量进度反馈（本地 Mock 下瞬时，弱网下可见）
router.beforeEach(() => { document.body.style.cursor = 'progress' })
router.afterEach((to) => {
  document.body.style.cursor = ''
  applySeo(to)
})

export default router
