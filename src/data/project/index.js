// 项目统一数据层入口。
// 仅做汇总导出与统计计算，不在此处保存任何手工统计数字。
import { heritageData, silkRoadRoutes } from '../heritageData.js'

export { projectMeta } from './projectMeta.js'
export { projectDeliverables } from './projectDeliverables.js'
export { projectPartners } from './projectPartners.js'
export { contact } from './contact.js'
export { dataSources, officialStatistics } from './dataSources.js'

const toSafeArray = (value) => (Array.isArray(value) ? value : [])
const readText = (value) => (typeof value === 'string' ? value.trim() : '')
const UNKNOWN = '未标注'

// 平台统计：全部由 heritageData / silkRoadRoutes 动态计算。
// 新增或删除记录后无需修改任何数字。
export const getProjectStats = () => {
  const records = toSafeArray(heritageData).filter((item) => item && typeof item === 'object')
  const byLevel = {}
  const byCity = {}
  const categorySet = new Set()

  records.forEach((item) => {
    const level = readText(item.level) || UNKNOWN
    const city = readText(item.city) || UNKNOWN
    const category = readText(item.category)

    byLevel[level] = (byLevel[level] || 0) + 1
    byCity[city] = (byCity[city] || 0) + 1
    if (category) categorySet.add(category)
  })

  // 缺失地市的记录归入“未标注”，但不计入地市数量
  const validCities = Object.keys(byCity).filter((name) => name !== UNKNOWN)

  return {
    total: records.length,
    cities: validCities.length,
    routes: toSafeArray(silkRoadRoutes).filter((route) => route && typeof route === 'object').length,
    categories: categorySet.size,
    byLevel,
    byCity
  }
}
