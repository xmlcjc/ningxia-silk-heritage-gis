import { createApp } from 'vue'
import { addCollection } from '@iconify/vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'leaflet/dist/leaflet.css'

import App from './App.vue'
import router from './router'
import './styles/main.scss'

// Font-GIS 图标集离线注册（无需运行时请求 Iconify API）
import gisIcons from '@iconify-json/gis/icons.json'
addCollection(gisIcons)

const app = createApp(App)

app.use(router)
app.use(ElementPlus)

app.mount('#app')
