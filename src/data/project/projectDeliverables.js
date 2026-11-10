// 已核实的项目成果清单。
// 仅收录当前源码、路由或实际文件可以证明存在的成果；
// 白皮书、论文、研究报告等没有真实文件的规划内容不列入。
export const projectDeliverables = [
  {
    id: 'gis-map',
    name: 'GIS 动态地图网页平台',
    category: 'SOFTWARE',
    description: '基于 Leaflet 的交互式地图，支持非遗点位筛选、丝路古道联动与时空可视化展示。',
    availability: 'AVAILABLE',
    verificationStatus: 'VERIFIED',
    route: '/map',
    evidence: ['src/pages/Map.vue'],
    verificationNote: null
  },
  {
    id: 'digital-archive',
    name: '数字档案',
    category: 'SOFTWARE',
    description: '非遗项目档案列表与详情页，支持关键词检索、多维筛选与分页浏览。',
    availability: 'AVAILABLE',
    verificationStatus: 'VERIFIED',
    route: '/archive',
    evidence: ['src/pages/Archive.vue', 'src/pages/Detail.vue'],
    verificationNote: null
  },
  {
    id: 'three-dimension-screen',
    name: '三维数据大屏',
    category: 'SOFTWARE',
    description: '基于 Three.js 的宁夏三维地形与五市非遗数据可视化大屏。',
    availability: 'AVAILABLE',
    verificationStatus: 'CONDITIONAL',
    route: '/screen',
    evidence: ['src/pages/Screen.vue'],
    verificationNote: '功能已在软件渲染环境验证；真实 NVIDIA GPU 渲染尚未验证。'
  },
  {
    id: 'heritage-records',
    name: '非遗项目数据',
    category: 'DATA',
    description: '平台当前收录的宁夏丝路非遗项目记录，含图文、地理坐标、级别、类别、传承人等字段。',
    availability: 'AVAILABLE',
    verificationStatus: 'CONDITIONAL',
    route: null,
    evidence: ['src/data/heritageData.js'],
    verificationNote: '记录数量以 getProjectStats().total 为准（本批实测为 20 条）；记录存在不代表其官方名录身份、传承人信息已逐项核实，也不是可下载的完整数据库。'
  },
  {
    id: 'three-dimension-scenes',
    name: '三维场景资源',
    category: 'ASSET',
    description: '由实景照片重建的 3D 高斯泼溅场景（.sog），用于非遗详情与场景预览的沉浸式查看。',
    availability: 'AVAILABLE',
    verificationStatus: 'CONDITIONAL',
    route: null,
    evidence: [
      'public/models/helanyan.sog',
      'public/models/huihuaer-a.sog',
      'public/models/huihuaer-b.sog',
      'public/models/guoshoujing.sog',
      'public/models/liyuanhao.sog'
    ],
    verificationNote: '5 个场景文件均存在；李元昊、郭守敬两件模型与「青铜峡黄河祭祀」条目的语义对应关系尚待确认；Poly Haven 器物模型为第三方素材，不计入本项目成果。'
  }
]
