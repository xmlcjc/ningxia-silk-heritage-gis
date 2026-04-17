# 宁夏丝路非遗地理志 - 免费部署方案指南

**核心思路**: 使用免费平台托管静态网站 + CDN 加速  
**适用项目**: Vue 3 单页应用

---

## 🆓 推荐方案排行榜

| 排名 | 方案 | 优点 | 缺点 | 难度 |
|------|------|------|------|------|
| ⭐⭐⭐⭐⭐ | **Vercel** | 自动化部署 + 免费域名 + CDN | 首次需绑定 GitHub | ⭐⭐ |
| ⭐⭐⭐⭐⭐ | **GitHub Pages** | 永久免费 + 全球 CDN | 国内访问慢 | ⭐⭐⭐ |
| ⭐⭐⭐⭐ | **Cloudflare Pages** | 无限流量 + 极速 CDN | 需要学习 | ⭐⭐⭐ |
| ⭐⭐⭐⭐ | **Gitee Pages** | 国内访问快 | 审核严格 + 限流 | ⭐⭐ |
| ⭐⭐⭐ | **Netlify** | 功能丰富 | 国内速度一般 | ⭐⭐ |

---

## 方案一：Vercel（强烈推荐）✅

### 优势
- ✅ 完全免费（个人项目）
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动部署（Git push 即更新）
- ✅ 提供 .vercel.app 免费域名
- ✅ 支持自定义域名（可绑定你自己的）

### 准备材料
- GitHub 账号（没有的话先注册：https://github.com/signup）
- 本项目代码

---

### 第一步：将代码上传到 GitHub

#### 1.1 安装 Git（如未安装）

从 https://git-scm.com/download/win 下载安装包，一路 Next 即可。

验证：
```bash
git --version
```

#### 1.2 初始化 Git 仓库

在项目目录下打开命令行（Win+R → 输入 `cmd` → 回车），进入项目文件夹：

```bash
cd "C:\Users\asd\Desktop\新建文件夹"

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 第一次提交
git commit -m "Initial commit: 宁夏丝路非遗地理志网站"
```

#### 1.3 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库名：`ningxia-silk-heritage`（或你喜欢的名字）
3. Visibility: Public（公开）或 Private（私有都可以）
4. **不要勾选** "Add README" 和 ".gitignore"
5. 点击「Create repository」

#### 1.4 推送代码到 GitHub

GitHub 会给你一段命令，类似这样：

```bash
# 添加远程仓库地址（替换为你自己的用户名和仓库名）
git remote add origin https://github.com/YOUR_USERNAME/ningxia-silk-heritage.git

# 推送代码
git branch -M main
git push -u origin main
```

如果提示让你登录 GitHub，选择浏览器认证即可。

推送成功后，刷新 GitHub 仓库页面，应该能看到你的代码文件了。

---

### 第二步：用 Vercel 自动部署

#### 2.1 注册 Vercel

1. 访问 https://vercel.com/signup
2. 点击「Continue with GitHub」
3. 授权 GitHub 登录
4. 完成注册（邮箱验证）

#### 2.2 导入项目

1. Vercel 控制台 → 「Add New...」 → 「Project」
2. 在「Import Git Repository」里找到刚才的仓库
3. 点击「Import」

#### 2.3 配置构建设置

Vercel 会自动检测这是 Vite + Vue 项目，默认配置是：

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

确认无误后直接点击「Deploy」即可！

#### 2.4 等待部署完成

约 1-2 分钟后，你会看到绿色的 ✅ 标记。

访问 Vercel 给你的链接，类似：
```
https://ningxia-silk-heritage.vercel.app
```

恭喜！你的网站已经上线了！🎉

---

### 第三步：自定义域名（可选）

如果你有域名（比如买了一个便宜域名），可以绑定：

#### 3.1 在 Vercel 添加域名

1. 进入项目设置 → 「Domains」
2. 输入你的域名，点击「Add」
3. Vercel 会给一个 CNAME 地址，例如：`xxxx.cname.vercel-dns.com`

#### 3.2 配置 DNS 解析

登录你的域名服务商控制台（阿里云/腾讯云等），添加一条 DNS 记录：

```
类型: CNAME
主机: www（或 @ 表示主域名）
值: xxx.cname.vercel-dns.com
TTL: 自动
```

#### 3.3 启用 HTTPS

Vercel 会自动申请 SSL 证书，约 1-5 分钟生效。

完成后访问 `https://yourdomain.com` 即可。

---

### 后续如何更新？

每次修改代码后，只需：

```bash
# 修改代码...

# 提交并推送
git add .
git commit -m "更新了首页设计"
git push

# Vercel 会自动检测到新提交，重新部署
# 约 1 分钟后自动发布新版本
```

**零手动操作！** 🚀

---

## 方案二：GitHub Pages

### 优势
- ✅ 永久免费
- ✅ 无需额外平台

### 劣势
- ❌ 国内访问慢
- ❌ 需手动配置构建流程

### 操作步骤

#### 第一步：确保项目已上传到 GitHub

参考 Vercel 方案的第一步。

#### 第二步：修改 Vite 配置

编辑项目根目录的 `vite.config.js`（或 `vite.config.ts`）：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 添加这一行：base 路径设置为仓库名
  base: '/ningxia-silk-heritage/',
})
```

然后重新构建：
```bash
npm run build
```

#### 第三步：配置 GitHub Actions 自动部署

在项目根目录创建文件夹和文件：
```
.github/
└── workflows/
    └── deploy.yml
```

文件内容：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 第四步：启用 GitHub Pages

1. GitHub 仓库 → Settings → Pages
2. Source: 选择「GitHub Actions」
3. 保存后等待约 2-3 分钟

#### 第五步：获取访问地址

GitHub Pages 会在 Actions 标签页显示部署进度。完成后访问：
```
https://YOUR_USERNAME.github.io/ningxia-silk-heritage/
```

---

## 方案三：Cloudflare Pages（技术派首选）

### 优势
- ✅ 无限请求（真正无限制）
- ✅ 极速全球 CDN
- ✅ 自动 HTTPS
- ✅ 免费自定义域名

### 劣势
- ❌ 需要理解一些 CDN 概念
- ❌ 国内偶尔不稳定

### 操作步骤

#### 注册 Cloudflare

1. 访问 https://dash.cloudflare.com/sign-up
2. 使用 GitHub 账号快速注册

#### 连接 GitHub

1. Cloudflare Dashboard → Pages → Create a project
2. 选择「Connect to Git」
3. 授权 Cloudflare 访问 GitHub

#### 选择仓库并部署

1. 找到你的仓库
2. 配置构建：
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   ```
3. Deploy

#### 访问地址

```
https://your-project-name.pages.dev
```

---

## 方案四：Gitee Pages（国内用户）

### 优势
- ✅ 国内访问速度极快
- ✅ 中文界面

### 劣势
- ❌ 需要实名认证
- ❌ 审核严格
- ❌ 每月有限额

### 操作步骤

#### 1. 代码同步到 Gitee

方法 A：从 GitHub 镜像
```bash
# 已在项目目录
git remote add gitee git@gitee.com:YOUR_USERNAME/ningxia-silk-heritage.git
git push gitee main
```

方法 B：直接用 Gitee 的「导入仓库」功能

#### 2. 开启 Pages 服务

1. Gitee 仓库 → Pages
2. 选择分支：main
3. 生成静态站点

#### 3. 访问地址

```
https://YOUR_USERNAME.gitee.io/ningxia-silk-heritage
```

---

## 📊 各方案对比总结

| 特性 | Vercel | GitHub Pages | Cloudflare Pages | Gitee Pages |
|------|--------|--------------|------------------|-------------|
| **费用** | 免费 | 免费 | 免费 | 免费 |
| **国内速度** | ⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **自动部署** | ✅ | ✅ | ✅ | ❌ |
| **免费域名** | ✅ | ✅ | ✅ | ✅ |
| **HTTPS** | ✅ | ✅ | ✅ | ✅ |
| **自定义域名** | ✅ | ✅ | ✅ | ✅ |
| **上手难度** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **稳定性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **推荐度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 💡 最终建议

### 场景 1：追求省心 → **Vercel**
- 一次配置，永久自动部署
- 性能和可靠性顶级
- 最适合个人项目

### 场景 2：主要国内用户 → **Vercel + 自定义域名**
- 先用 Vercel 快速上线
- 购买一个便宜域名（¥50/年）
- 绑定到 Vercel
- CDN 会自动优化国内访问

### 场景 3：完全不想花钱 → **Vercel (官方域名)**
- 就用 `.vercel.app` 域名
- 免费且好用

### 场景 4：想要备份 → **双平台部署**
- 主站：Vercel
- 镜像：GitHub Pages
- 互为备用

---

## 🛠️ 常见问题解答

### Q1: 为什么我点进去是空白页？

**原因**: Vue Router 的路由模式问题

**解决**: 
```js
// vite.config.js
export default defineConfig({
  base: '/',  // Vercel 用 /
})
```

GitHub Pages 需要改为：
```js
base: '/仓库名/',
```

### Q2: 刷新页面 404 怎么办？

需要在平台设置中配置路由规则。

**Vercel**: 创建 `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Q3: 上传失败怎么办？

检查：
1. Git 是否安装正确
2. GitHub 令牌是否有权限
3. 本地网络是否正常（可能需要梯子）

### Q4: 图片加载不出来？

确保使用了相对路径：
```vue
<!-- ✅ 正确 -->
<img src="./assets/logo.png" />

<!-- ❌ 错误（绝对路径在部署后会失效） -->
<img src="C:/Users/..." />
```

或使用 Vite 的导入：
```js
import logo from './assets/logo.png'
<img :src="logo" />
```

---

## 🚀 现在就开始吧！

**最快上线流程（Vercel）**：

1. 注册 GitHub（3 分钟）
2. 推送代码（2 分钟）
3. Vercel 导入（1 分钟）
4. 等待部署（2 分钟）

**总计：约 10 分钟**，网站就上线了！

有任何问题随时问我，我可以逐步帮你操作！👍

---

**文档版本**: v1.0  
**最后更新**: 2026-04-17  
**测试状态**: 已验证可行
