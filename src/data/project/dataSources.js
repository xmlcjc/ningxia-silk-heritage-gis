// 官方数据来源与统计事实。
// dataSources 只保存资料元数据；具体数字只保存在 officialStatistics 一处。
// 所有数字均为区域官方统计，不是本平台收录量。
export const dataSources = [
  {
    id: 'nx-gov-2026-436',
    title: '政协提案第436号办理情况',
    publisher: '宁夏回族自治区人民政府门户网站（主办：自治区文化和旅游厅）',
    documentNumber: null,
    documentDate: null,
    publishedAt: '2026-01-04',
    url: 'https://www.nx.gov.cn/hdjl/zxta/202601/t20260104_5125707.html',
    scope: '全区非遗资源与代表性项目统计（政协提案办理情况）',
    notes: '页面于 2026-01-04 发布，办理情况落款为 2025 年 8 月；所列数字与 2024 年答复一致，不应标注为 2026 年新统计结果。'
  },
  {
    id: 'nx-wlt-2024-418',
    title: '关于自治区政协十二届二次会议第388号提案答复的函',
    publisher: '宁夏回族自治区文化和旅游厅',
    documentNumber: '宁文旅函〔2024〕418号',
    documentDate: '2024-08-27',
    publishedAt: '2024-08-29',
    url: 'https://whhlyt.nx.gov.cn/zwgk/fdzdgknr/rdjyzxtabl/202409/t20240919_4664349.html',
    scope: '全区非遗资源、代表性项目与代表性传承人统计',
    notes: '原文使用“截止目前”表述，未给出明确的统计截止日期。'
  },
  {
    id: 'nx-gov-2024-16',
    title: '宁夏回族自治区人民政府关于公布第七批自治区级非物质文化遗产代表性项目名录的通知',
    publisher: '宁夏回族自治区人民政府',
    documentNumber: '宁政发〔2024〕16号',
    documentDate: '2024-04-09',
    publishedAt: '2024-04-28',
    url: 'https://www.nx.gov.cn/zwgk/qzfwj/202404/t20240428_4524819.html',
    scope: '第七批自治区级代表性项目名录及扩展项目名录',
    notes: '通知同时公布新增代表性项目名录与扩展项目名录，二者类型不同，均不可与累计数相加。'
  }
]

export const officialStatistics = [
  {
    id: 'nx-resource-total',
    label: '宁夏全区非物质文化遗产资源普查数量',
    value: 5667,
    unit: '项',
    scope: '宁夏全区非物质文化遗产资源（普查口径，非代表性项目数）',
    sourceIds: ['nx-gov-2026-436', 'nx-wlt-2024-418'],
    statisticalReference: null,
    verificationStatus: 'VERIFIED',
    notes: '官方原文表述为“非遗资源”，属资源普查口径，不能作为代表性项目数或平台收录量。官方未给出明确统计截止日。'
  },
  {
    id: 'nx-national-items',
    label: '宁夏全区国家级非物质文化遗产代表性项目',
    value: 28,
    unit: '项',
    scope: '宁夏全区国家级代表性项目',
    sourceIds: ['nx-gov-2026-436', 'nx-wlt-2024-418'],
    statisticalReference: null,
    verificationStatus: 'VERIFIED',
    notes: '两份官方来源数字一致；官方未给出明确统计截止日。不能作为平台收录量。'
  },
  {
    id: 'nx-regional-items',
    label: '宁夏全区自治区级非物质文化遗产代表性项目',
    value: 289,
    unit: '项',
    scope: '宁夏全区自治区级代表性项目（第 1–7 批累计）',
    sourceIds: ['nx-gov-2026-436', 'nx-wlt-2024-418'],
    statisticalReference: null,
    verificationStatus: 'VERIFIED',
    notes: '为第 1–7 批累计数，已包含第七批新增代表性项目，不得再次叠加第七批数量。'
  },
  {
    id: 'nx-batch7-new',
    label: '第七批自治区级非物质文化遗产代表性项目（新增）',
    value: 39,
    unit: '项',
    scope: '第七批自治区级代表性项目名录（新增）',
    sourceIds: ['nx-gov-2024-16'],
    statisticalReference: '2024-04-09（宁政发〔2024〕16号成文日期）',
    verificationStatus: 'VERIFIED',
    notes: '第七批新增项目数，非累计数；不可与扩展项目数或 289 项累计数相加。'
  },
  {
    id: 'nx-batch7-expanded',
    label: '第七批自治区级非物质文化遗产代表性项目扩展项目',
    value: 26,
    unit: '项',
    scope: '第七批自治区级代表性项目扩展项目名录',
    sourceIds: ['nx-gov-2024-16'],
    statisticalReference: '2024-04-09（宁政发〔2024〕16号成文日期）',
    verificationStatus: 'VERIFIED',
    notes: '扩展项目与新增项目属不同名录类型，不可与新增项目数或 289 项累计数相加。'
  }
]
