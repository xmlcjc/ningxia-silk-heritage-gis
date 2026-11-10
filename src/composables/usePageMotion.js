import { nextTick, onBeforeUnmount, onMounted } from 'vue'

// ============================================
// 全站动效调度（阶段 6）
// --------------------------------------------
// 职责：
// 1. 在路由切换后扫描 [data-reveal] / [data-reveal-stagger] 并交给
//    IntersectionObserver 渐进显现（不锁定滚动、不监听 scroll 做 reveal）。
// 2. 为 [data-parallax] 提供轻量视差（单 rAF，仅桌面端）。
// 3. prefers-reduced-motion 时直接呈现静态结果，不播放任何位移/缩放。
//
// 不使用任何第三方动画库；所有监听与观察器在页面卸载时清理。
// ============================================

const REVEAL_SELECTOR = '[data-reveal], [data-reveal-stagger]'
const PARALLAX_SELECTOR = '[data-parallax]'

export function usePageMotion() {
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const isReduce = () => reduceQuery.matches

  let observer = null
  let parallaxEls = []
  let rafId = 0
  let scrollBound = false

  // 首帧前就加上标记，避免 reveal 元素先闪现再隐藏
  if (!isReduce()) {
    document.documentElement.classList.add('motion-ready')
  }

  const markStatic = (root) => {
    root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => el.classList.add('is-inview'))
    root.querySelectorAll(PARALLAX_SELECTOR).forEach((el) => {
      el.style.removeProperty('--parallax-y')
    })
  }

  const updateParallax = () => {
    if (!parallaxEls.length) return
    const vh = window.innerHeight || 1
    parallaxEls.forEach((el) => {
      const rect = el.getBoundingClientRect()
      // 视口外跳过计算，避免无意义样式写入
      if (rect.bottom < -160 || rect.top > vh + 160) return
      const speed = Number(el.dataset.parallax) || 0.35
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh
      const y = Math.max(-18, Math.min(18, -progress * 24 * speed))
      el.style.setProperty('--parallax-y', `${y.toFixed(1)}px`)
    })
  }

  const onScroll = () => {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      rafId = 0
      updateParallax()
    })
  }

  const bindScroll = () => {
    if (scrollBound) return
    scrollBound = true
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
  }

  const unbindScroll = () => {
    if (!scrollBound) return
    scrollBound = false
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }

  const disconnect = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    unbindScroll()
    parallaxEls = []
  }

  const collectParallax = (root) => {
    parallaxEls = isReduce() || window.innerWidth < 768
      ? []
      : Array.from(root.querySelectorAll(PARALLAX_SELECTOR))

    if (parallaxEls.length) {
      bindScroll()
      updateParallax()
    } else {
      unbindScroll()
    }
  }

  const refresh = async () => {
    disconnect()
    await nextTick()

    const root = document.getElementById('main')
    if (!root) return

    if (isReduce()) {
      markStatic(root)
      return
    }

    document.documentElement.classList.add('motion-ready')
    const targets = Array.from(root.querySelectorAll(REVEAL_SELECTOR))

    if (!targets.length || !('IntersectionObserver' in window)) {
      markStatic(root)
      collectParallax(root)
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          const delay = Number(el.dataset.revealDelay || 0)
          if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`)
          el.classList.add('is-inview')
          observer && observer.unobserve(el)
        })
      },
      {
        // 元素进入视口约 92% 时触发；threshold 0 保证超高容器也能及时显现
        rootMargin: '0px 0px -8% 0px',
        threshold: 0
      }
    )

    targets.forEach((el) => observer.observe(el))
    collectParallax(root)
  }

  const onReduceChange = () => {
    if (isReduce()) {
      disconnect()
      const root = document.getElementById('main')
      if (root) markStatic(root)
    } else {
      refresh()
    }
  }

  if (typeof reduceQuery.addEventListener === 'function') {
    reduceQuery.addEventListener('change', onReduceChange)
  } else if (typeof reduceQuery.addListener === 'function') {
    reduceQuery.addListener(onReduceChange)
  }

  onMounted(() => {
    // 首屏：等一帧让布局稳定后再观察（路由切换由 App.vue 的 @enter 触发）
    requestAnimationFrame(refresh)
  })

  onBeforeUnmount(() => {
    disconnect()
    if (typeof reduceQuery.removeEventListener === 'function') {
      reduceQuery.removeEventListener('change', onReduceChange)
    } else if (typeof reduceQuery.removeListener === 'function') {
      reduceQuery.removeListener(onReduceChange)
    }
  })

  return { refresh }
}
