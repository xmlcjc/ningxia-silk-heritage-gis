// 全局选中态：地图 / 三维大屏 / 档案列表之间的跨页联动
// 设计要点：
// 1. 选中态放在模块级 reactive 中——模块单例在组件卸载后依然存活，
//    因此路由切换（页面卸载重建）后新页面仍能读到上一页的选中态（无 keep-alive 场景可用）
// 2. 页面监听 globalSelection 同步本地状态；本地变化写回 globalSelection（watch 写入幂等，无循环风险）
// 3. 纯前端零依赖，onBeforeUnmount 时页面自行解绑，无内存泄漏

import { reactive } from 'vue'

/** 跨页共享的选中态（模块单例，随路由切换持久） */
export const globalSelection = reactive({
  city: '',
  route: '',
  // 本次变化的来源页：'map' | 'screen' | 'archive'，页面据此判断是否需要主动应用
  source: ''
})

/**
 * 由页面本地状态写回全局选中态（仅值变化时才写，避免无意义触发）
 * @param {Partial<Pick<typeof globalSelection, 'city'|'route'>>} patch
 * @param {string} source 变化来源页
 */
export function syncGlobalSelection(patch, source) {
  let changed = false
  if ('city' in patch && globalSelection.city !== patch.city) {
    globalSelection.city = patch.city || ''
    changed = true
  }
  if ('route' in patch && globalSelection.route !== patch.route) {
    globalSelection.route = patch.route || ''
    changed = true
  }
  if (changed) globalSelection.source = source
}
