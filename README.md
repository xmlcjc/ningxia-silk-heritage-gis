# 宁夏丝路非遗地理志

基于GIS与WebGIS的宁夏丝路非遗数字化保护、时空可视化与传播展示平台

## 项目简介

本项目以宁夏丝绸之路沿线非物质文化遗产为研究对象，运用GIS空间分析技术，系统搜集、整理宁夏丝路非遗资源，构建宁夏丝路非遗地理信息数据库。通过WebGIS技术实现非遗资源的时空可视化展示，探索"非遗保护+乡村振兴+文旅融合"的协同发展路径。

## 技术栈

- **前端框架**: Vue 3 + Vite
- **UI组件库**: Element Plus
- **路由**: Vue Router
- **状态管理**: Pinia
- **地图**: Leaflet（预留接入）
- **图表**: ECharts
- **样式**: SCSS

## 项目结构

```
ningxia-silk-heritage-gis/
├── src/
│   ├── components/        # 公共组件
│   │   ├── LayoutHeader.vue    # 顶部导航
│   │   └── LayoutFooter.vue    # 页脚
│   ├── pages/          # 页面组件
│   │   ├── Home.vue         # 首页
│   │   ├── Project.vue      # 项目概况
│   │   ├── Map.vue          # GIS地图
│   │   ├── Archive.vue      # 数字档案
│   │   ├── Detail.vue       # 详情页
│   │   ├── Protection.vue  # 保护路径
│   │   ├── Study.vue       # 研学课程
│   │   ├── Creative.vue    # 文创展示
│   │   ├── Results.vue     # 项目成果
│   │   └── About.vue       # 关于我们
│   ├── data/           # 数据
│   │   └── heritageData.js  # Mock数据
│   ├── styles/         # 样式
│   │   └── main.scss       # 主样式
│   ├── router/         # 路由
│   │   └── index.js
│   ├── stores/         # 状态管理
│   ├── assets/         # 静态资源
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 功能模块

### 1. 首页
- Hero区域展示
- 项目简介
- 数据概览
- 核心功能
- 创新亮点
- 研究进度时间轴
- 地图预览
- 项目成果展示

### 2. 项目概况
- 项目简介
- 立项依据
- 研究内容
- 技术方案
- 创新点
- 预期目标与成果形式

### 3. GIS地图
- 地图视图与列表视图切换
- 筛选器（地市、类别、时期、等级）
- 图层控制
- 时间轴功能
- 点位详情弹窗
- ECharts图表联动

### 4. 非遗数字档案
- 搜索与筛选
- 档案卡片列表
- 分页功能
- 详情页展示

### 5. 保护路径与乡村振兴
- 现状分析
- GIS支持下的保护建议
- 非遗与乡村振兴结合方式
- 协同发展路径

### 6. 研学课程
- 研学手册介绍
- 精选研学路线
- 课程模块
- 报名表单

### 7. 文创展示
- 文创设计流程
- 文创产品展示
- 设计元素库

### 8. 项目成果与资讯
- 项目成果卡片
- 项目进度时间轴
- 最新资讯列表

### 9. 关于我们
- 团队简介
- 项目使命
- 研究方向
- 联系方式
- 合作单位
- 留言表单

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 数据说明

当前项目使用Mock数据进行演示，包含：

- 20条宁夏丝路非遗示例数据
- 3条研学路线
- 6款文创产品
- 6项项目成果
- 4条资讯动态

所有数据均为演示数据，实际项目中可替换为真实数据。

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 开发说明

### 样式变量

```scss
// 主色调
--color-primary: #8B5A2B;      // 丝路赭石色
--color-secondary: #D4AF37;      // 鎏金色
--color-accent: #2E8B57;         // 青绿色

// 背景色
--color-background: #F5F0E6;   // 米白色
```

### 组件开发

- 所有页面使用Vue 3 Composition API开发
- 使用Element Plus组件库
- 响应式设计，适配PC、平板、手机端

## 后续优化方向

1. 接入真实GIS地图（Leaflet/Mapbox/ArcGIS）
2. 接入后端API
3. 用户系统功能
4. 数据管理后台
5. 多语言支持
6. SEO优化
7. 性能优化

## 许可证

本项目为大学生创新创业训练计划项目演示版本。

## 联系方式

- 邮箱: contact@silkheritage-nx.cn
- 电话: 0951-12345678

---

**让丝路非遗在数字地图上"看得见、查得到、讲得清、传得开"
