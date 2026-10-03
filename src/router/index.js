import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/project',
    name: 'Project',
    component: () => import('../pages/Project.vue')
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('../pages/Map.vue')
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('../pages/Archive.vue')
  },
  {
    path: '/archive/:id',
    name: 'Detail',
    component: () => import('../pages/Detail.vue')
  },
  {
    path: '/protection',
    name: 'Protection',
    component: () => import('../pages/Protection.vue')
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('../pages/Results.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/About.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue')
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

// 懒加载分包期间给出轻量进度反馈（本地 Mock 下瞬时，弱网下可见）
router.beforeEach(() => { document.body.style.cursor = 'progress' })
router.afterEach(() => { document.body.style.cursor = '' })

export default router
