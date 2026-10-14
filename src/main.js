import { createApp } from 'vue'
import { addCollection } from '@iconify/vue'
// Element Plus 基础层（CSS 变量 + 过渡类）保持全局，组件样式改为在各使用页面按需引入，
// 避免整库 JS/CSS 进入首屏主包；全局变量层需在 main.scss 之前引入，保证字体变量覆盖生效
import 'element-plus/theme-chalk/base.css'
import 'leaflet/dist/leaflet.css'

import App from './App.vue'
import router from './router'
import './styles/main.scss'

// Font-GIS 图标集离线注册（无需运行时请求 Iconify API）
import gisIcons from '@iconify-json/gis/icons.json'
addCollection(gisIcons)

const app = createApp(App)

app.use(router)

app.mount('#app')
