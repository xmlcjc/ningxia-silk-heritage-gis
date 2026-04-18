# 🚀 Vercel + GitHub 完整部署指南

## 项目信息
- 项目名称：宁夏丝路非遗地理志 (ningxia-silk-heritage-gis)
- 技术栈：Vue 3 + Vite + Element Plus
- 部署方式：GitHub + Vercel

---

## 📝 完整步骤

### ✅ 阶段一：准备 GitHub 仓库（已完成）

1. **访问 GitHub**: https://github.com
2. **创建新仓库**
   - Repository name: `ningxia-silk-heritage-gis`
   - Description: 宁夏丝路非遗数字化保护平台
   - **不要勾选** Initialize with README
   - Visibility: Public
3. **复制克隆命令**: 
   ```bash
   git clone https://github.com/你的用户名/ningxia-silk-heritage-gis.git
   ```

---

### ✅ 阶段二：本地 Git 初始化并推送到 GitHub

在项目文件夹 `C:\Users\asd\Desktop\新建文件夹` 中执行以下命令：

#### 方法 A：手动执行（推荐）
```bash
# 1. 进入项目目录（如果在桌面试图运行，需使用完整路径）
cd "C:\Users\asd\Desktop\新建文件夹"

# 2. 初始化 git（如果还没初始化）
git init

# 3. 添加所有文件到暂存区
git add .

# 4. 提交更改
git commit -m "初始提交 - Vue3+Vite 项目准备部署"

# 5. 关联远程仓库（将下面的 URL 替换为你实际的 GitHub 仓库地址）
git remote add origin https://github.com/你的用户名/ningxia-silk-heritage-gis.git

# 6. 推送到 GitHub（第一次推送需要设置主分支名称，main 或 master）
git branch -M main
git push -u origin main

# 7. 如果仓库已有代码，可能需要先拉取再推送
# git pull origin main --rebase
# git push
```

#### 方法 B：双击运行 deploy_git.bat
直接双击 `C:\Users\asd\Desktop\新建文件夹\deploy_git.bat` 文件，会显示完整命令。

---

### ✅ 阶段三：在 Vercel 上部署

1. **访问 Vercel**: https://vercel.com
2. **登录/注册**
   - 点击 "Sign up for free"
   - 选择 **Continue with GitHub**（这样可以直接管理你的 GitHub 仓库）

3. **新建项目**
   - 登录后点击 **"New Project"**
   - Vercel 会自动检测并列出你 GitHub 上的仓库
   - **找到你的仓库** `ningxia-silk-heritage-gis`，点击 **"Import"**

4. **配置部署参数**
   在配置页面设置如下：

   | 配置项 | 设置值 |
   |--------|--------|
   | Project name | `ningxia-silk-heritage`（或其他易记名称） |
   | Framework preset | 选择 **"Other"** |
   | Build command | `npm run build` |
   | Output directory | `dist` |
   | Install command | `npm install` |
   | Root directory | (留空) |

   > ⚠️ 确保 **Build command** 是 `npm run build`，这是关键！

5. **部署项目**
   - 点击 **"Deploy"**
   - Vercel 会自动安装依赖、构建项目并部署
   - 等待约 1-3 分钟，状态从 "Building..." → "Deploy complete!"

6. **查看结果**
   - 部署成功后，你会得到一个唯一的域名：
     ```
     https://ningxia-silk-heritage.vercel.app
     ```
   - 点击 **"Visit"** 即可在浏览器中访问你的网站！

---

## 🔧 常见问题

### Q1: Build Error - vite 配置问题
**原因**: Vite 的 baseURL 需要指定
**解决**: 在 `vite.config.js` 中添加：
```javascript
export default defineConfig({
  base: '/your-website-name/',  // 替换为你的项目名
  // ...其他配置
})
```

### Q2: 页面刷新后 404
**原因**: SPA 路由问题
**解决**: Vercel 已配置 `rewrites`，但可能需要手动测试：
- 访问 `https://你的域名/index.html` 看是否能正常显示

### Q3: 资源加载失败（assets/路径错误）
**解决**: 
1. 在 Vercel 设置中检查域名校正
2. 确保 `vercel.json` 中的 rewrites 配置正确
3. 重新部署一次：Vercel Dashboard → Deployments → 点击 "Redeploy"

### Q4: 如何自定义域名？
1. Vercel Dashboard → Project Settings → Domains
2. 添加你的自定义域名
3. 在域名控制面板解析到 Vercel 提供的 CNAME/IP

---

## 📊 项目部署后结构

```
GitHub Repository
├── .env.production       # 环境配置（包含 .gitignore 不会被提交）
├── vercel.json           # Vercel 部署配置
├── package.json          # 依赖定义
├── vite.config.js        # Vite 构建配置
├── index.html            # HTML 入口
└── src/                  # 源代码目录

Vercel 会自动构建为:
dist/                     # 构建输出目录
├── index.html
├── assets/               # 静态资源
│   ├── css/
│   └── js/
└── _vercel/              # Vercel 运行时文件
```

---

## ✅ 部署检查清单

- [ ] GitHub 仓库已创建为 Public
- [ ] `vite.config.js` 的 build command 正确
- [ ] `.gitignore` 已排除敏感信息（如 .env 文件）
- [ ] Vercel 配置正确（build command = npm run build）
- [ ] Build output directory = dist
- [ ] 部署链接可正常访问

---

## 🎯 下一步优化

1. **自定义域名**: 购买域名并绑定到 Vercel
2. **HTTPS**: Vercel 自动提供，无需配置
3. **Analytics**: Vercel Dashboard 集成 Analytics
4. **环境变量**: 在 Vercel Settings → Environment Variables 设置敏感变量
5. **CI/CD**: 添加 Vercel Integration，代码 push 后自动部署

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Vercel Dashboard → Deployments → 最近一次失败的 Build 详情
2. 查看 Console Logs → 错误信息提示
3. 检查 Vite 构建配置是否正确

---

**恭喜！你的网站现在已经可以部署到互联网了！🎉**
