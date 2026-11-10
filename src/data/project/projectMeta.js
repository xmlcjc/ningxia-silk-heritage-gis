// 项目跨页面复用的基本信息。
// 只写入可以从现有项目资料中确认的内容；无法确认的字段保留 null。
export const projectMeta = {
  name: '宁夏丝路非遗地理志',
  // 英文名取自 LayoutHeader.vue / LayoutFooter.vue / README.md 的品牌英文名
  englishName: 'Ningxia Silk Road Heritage GIS',
  scope: '宁夏回族自治区',
  // 依据 README.md 的项目简介概括，不复制页面长文案
  positioning: '基于 GIS 与 WebGIS 的宁夏丝绸之路沿线非物质文化遗产数字化保护、时空可视化与传播展示平台',
  status: 'VERIFIED'
}
