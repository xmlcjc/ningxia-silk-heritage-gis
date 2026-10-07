# 宁夏丝路非遗地理志

基于 GIS 与 WebGIS 的宁夏丝路非物质文化遗产数字化保护、时空可视化与传播展示平台。

🔗 **线上体验**：https://ningxia-silk-heritage-gis.vercel.app
🌐 **三维数据大屏**：https://ningxia-silk-heritage-gis.vercel.app/screen
💬 **讨论交流**：[Discussions](https://github.com/xmlcjc/ningxia-silk-heritage-gis/discussions) ｜ 🐛 问题反馈：[Issues](https://github.com/xmlcjc/ningxia-silk-heritage-gis/issues)

## 项目简介

本项目以宁夏丝绸之路沿线非物质文化遗产为研究对象，运用 GIS 空间分析技术，系统搜集、整理宁夏丝路非遗资源，构建非遗地理信息数据库；通过 WebGIS 技术实现非遗资源的时空可视化展示，并探索“非遗保护 + 乡村振兴 + 文旅融合”的协同发展路径。

## 技术栈

- **前端框架**：Vue 3（Composition API + `<script setup>`）+ Vite
- **UI 组件库**：Element Plus
- **路由**：Vue Router（History 模式）
- **地图引擎**：Leaflet —— 底图采用天地图矢量/卫星/地形服务，并以高德矢量作为兜底，保证国内访问可用
- **三维引擎**：Three.js —— 卫星影像 + 高程位移的 3D 地形、市域边界、丝路古道与三维数据大屏
- **数据可视化**：ECharts
- **样式**：SCSS

## 项目结构

```
ningxia-silk-heritage-gis/
├── src/
│   ├── components/            # 公共组件
│   │   ├── LayoutHeader.vue   # 顶部导航
│   │   └── LayoutFooter.vue   # 页脚
│   ├── pages/                 # 页面组件
│   │   ├── Home.vue           # 首页
│   │   ├── Project.vue        # 项目概况
│   │   ├── Map.vue            # GIS 地图
│   │   ├── Archive.vue        # 数字档案列表
│   │   ├── Detail.vue         # 非遗详情页
│   │   ├── Protection.vue     # 保护路径
│   │   ├── Results.vue        # 项目成果
│   │   ├── About.vue          # 关于我们
│   │   ├── Screen.vue         # 三维数据大屏（全屏沉浸路由 /screen）
│   │   └── NotFound.vue       # 404 兜底页
│   ├── data/
│   │   └── heritageData.js    # 非遗图文数据、古道、黄河
│   ├── assets/
│   │   ├── ningxia-cities.json  # 五地市行政边界 GeoJSON
│   │   ├── ningxia-outline.json # 自治区轮廓 GeoJSON
│   │   └── textures/          # 卫星影像 / 高程 / 法线地形纹理
│   ├── styles/
│   │   └── main.scss          # 全局样式与主题变量
│   ├── router/
│   │   └── index.js           # 路由配置
│   ├── App.vue
│   └── main.js
├── scripts/
│   └── build-ningxia-textures.mjs # 地形纹理与市域边界数据生成脚本
├── public/
│   └── heritage/              # 20 个项目的压缩照片（封面/缩略图/图集）
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 功能模块

### 首页
项目简介、数据概览、创新亮点、研究进度时间轴、GIS 地图预览与项目成果展示。

### 项目概况
项目简介、立项依据、研究内容、技术方案、创新点、预期目标与成果形式。

### GIS 地图（核心）
- 20 项非遗点位按级别差异化标注（国家级 / 自治区级 / 县级），带破土萌芽入场动画
- 4 条历史考证的丝路古道：**萧关道、环灵道、长安西域道、灵州道**，以及黄河宁夏段真实河道
- 点击古道：视角飞行居中，选中路线加粗高亮、其余古道与非沿线点位弱化，古道简介卡片弹出（里程、沿线非遗）
- 古道与下方 ECharts 图表联动（类别分布、地市分布、历史时期），再次点击取消联动
- 古道名称标签带屏幕空间碰撞检测与自动避让
- 地市 / 类别 / 时期 / 等级多维度筛选、时光回放时间轴、点位详情弹窗
- 工具栏：缩放至全图、距离测量、打印、全屏；图例与比例尺
- 支持地图视图 / 列表视图切换：标记弹窗顶部带项目缩略图；列表视图以缩略图、等级徽章与标签胶囊呈现，点击列表项弹出左图右文的快速预览弹窗

### 三维数据大屏（`/screen`）
全屏沉浸式数据大屏，采用赭石·鎏金·宣纸暖色调，初始 45° 俯视、上北下南：
- 卫星影像 + 高程位移（displacement）构建真实起伏的 3D 地形，配 SRTM 高程与 Sobel 法线纹理
- 五地市行政边界贴地渲染，市名 Sprite 标签始终面向相机；鼠标悬停时市域鎏金、边界金色流光，默认不显示流光
- 4 条丝路古道（萧关道、环灵道、长安西域道、灵州道三段）以 Catmull-Rom 平滑曲线 + 贴地流光管线呈现，各配主题色名称标牌
- 20 项非遗点位立体标注，支持鼠标悬停提示与点击查看
- 点击地级市：相机 45° 飞行聚焦，右侧项目名录、保护级别构成、类别分布环形图、历史源流年代图、五地市柱图全部按该市联动刷新；复位视图恢复全量
- 支持鼠标拖拽旋转 / 缩放、右下角图例、返回主站；组件卸载时自动释放 Three.js 几何体 / 材质 / 纹理与 ECharts 实例

### 数字档案
关键词搜索、多维筛选、分页浏览；档案卡片展示真实项目照片，点击进入非遗详情。

### 非遗详情
叙事式图文排版：项目概述首字下沉、技艺特色以工序流程节点串联、文化价值与传承、丝路关联；图集为「首图铺满 + 两列网格」布局，点击进入灯箱查看大图（支持左右方向键循环切换、ESC 关闭）。另含传承人、地理坐标、关联古道、地图定位侧栏、相关项目推荐与上一项 / 下一项导航。

### 其他页面
保护路径、项目成果、关于我们，以及 404 兜底页。

## 快速开始

环境要求：Node.js 16+。

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:3000）
npm run dev

# 构建生产版本（输出至 dist/）
npm run build

# 本地预览生产版本
npm run preview
```

> 地图底图使用天地图服务，如需替换可在 `src/pages/Map.vue` 中更换为自己的天地图浏览器端 key。

## 数据说明

当前为纯前端应用，结构化数据集中在 `src/data/heritageData.js`：

- 20 条宁夏代表性非遗项目，每条含项目概述、技艺特色、文化价值三段文字，以及地理坐标、历史时期、传承人、保护级别等属性
- 项目照片位于 `public/heritage/NN/`（`cover.jpg` 封面、`thumb.jpg` 缩略图、图集 `01.jpg` 起），经统一压缩优化
- 4 条丝路古道坐标（灵州道含主线、南线、北线三段）
- 黄河宁夏段河道坐标（取自 OpenStreetMap）
- 类别、地市、时期、等级等字典数据

三维大屏所用的五地市行政边界（`src/assets/ningxia-cities.json`，取自阿里云 DataV）、自治区轮廓与地形纹理（卫星影像 / SRTM 高程 / 法线，位于 `src/assets/textures/`）由 `scripts/build-ningxia-textures.mjs` 抓取生成，地形管线按行政区轮廓做了透明遮罩裁剪。

后续如需扩展，可将数据层替换为后端 API。

## 部署

项目为纯静态站点，构建产物在 `dist/`，可托管于任意静态平台。以 Vercel 为例，仓库已内置 `vercel.json`，包含：

- SPA History 路由全部回退至 `index.html`
- `/assets/` 静态资源一年强缓存

其它平台（如 Nginx）部署时同样需要配置前端路由回退：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 浏览器支持

Chrome / Edge（推荐）、Firefox、Safari。页面适配桌面与移动端，并对系统“减少动态效果”偏好做了降级处理。

## 许可证

本项目为大学生创新创业训练计划项目演示版本。
