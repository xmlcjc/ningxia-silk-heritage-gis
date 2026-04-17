# 宁夏丝路非遗地理志 - 阿里云上线部署指南

**项目类型**: Vue 3 单页应用（纯前端）  
**适用平台**: 阿里云 OSS 静态网站托管 / ECS 虚拟机

---

## 📋 方案选择

| 方案 | 成本 | 难度 | 推荐度 | 适用场景 |
|------|------|------|--------|---------|
| **OSS 静态网站托管** | ¥20-50/月 | ⭐⭐ | ⭐⭐⭐⭐⭐ | 纯前端项目、无需后端 |
| **ECS 轻量应用服务器** | ¥89-199/月 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 需要自定义域名 SSL、未来可能加后端 |
| **Serverless 容器** | ¥30-80/月 | ⭐⭐⭐ | ⭐⭐⭐ | 弹性需求、自动化部署 |

**✅ 推荐使用：OSS 静态网站托管** - 成本最低、最稳定、最适合纯前端项目

---

## 方案一：阿里云 OSS 静态网站托管（推荐）

### 第一步：准备工作

#### 1.1 构建项目

```bash
# 进入项目目录
cd "C:\Users\asd\Desktop\新建文件夹"

# 安装依赖（如尚未安装）
npm install

# 执行构建命令
npm run build

# 生成 dist 目录（约 2-5MB）
```

构建完成后会生成 `dist/` 目录，包含以下内容：
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── ...
├── favicon.ico
└── vite.svg
```

#### 1.2 检查构建产物

```bash
# Windows PowerShell
dir dist

# 或使用资源管理器打开
explorer "C:\Users\asd\Desktop\新建文件夹\dist"
```

确保 `index.html` 正常存在，文件大小约 1-2KB。

---

### 第二步：创建 OSS Bucket

#### 2.1 登录阿里云控制台

访问: https://oss.console.aliyun.com

如果没有账号，需要先完成实名认证（免费）。

#### 2.2 创建存储空间（Bucket）

1. 点击左侧「 buckets 列表」 → 「创建 Bucket」
2. 填写信息：
   - **Bucket 名称**: `ningxia-silk-heritage`（需全局唯一，建议：`yourname-ningxia-silk`）
   - **地域**: 选择离你用户最近的（推荐：华北 2 北京 / 华东 2 上海）
   - **存储类型**: 标准存储
   - **读写权限**: 公共读（⚠️注意：后续可设置 CDN 和防盗链）
   - **数据冗余**: 本地冗余存储（免费版）
3. 点击「确定」

#### 2.3 配置静态网站托管

1. 进入刚创建的 Bucket
2. 左侧菜单「数据处理」 → 「静态页面」
3. 开启「启用静态页面托管」
4. 填写：
   - **默认首页**: `index.html`
   - **默认错误页**: `index.html`（Vue Router 需要）
5. 点击「保存」

> ⚠️ **重要**: 设置 `index.html` 为错误页是为了支持 Vue Router 的 History 模式刷新

#### 2.4 上传文件

**方式 A：网页控制台上传（适合初次）**

1. 点击左侧「文件管理」 → 「上传文件」
2. 选择「批量上传」
3. 将 `dist/` 目录下所有文件拖入上传框
4. 勾选「递归上传」
5. 点击「开始上传」

**方式 B：OSS Browser 工具（推荐后期维护）**

1. 下载 [OSS Browser](https://help.aliyun.com/document_detail/64919.html)
2. 使用阿里云账号登录
3. 直接拖拽 `dist/` 文件夹到 Bucket

**方式 C：命令行 ossutil（自动化）**

```bash
# 下载 ossutil: https://oss.apache.org/ossutil/
# 配置凭证
ossutil config -e <endpoint> -i <accessKeyID> -k <accessKeySecret>

# 上传所有文件
ossutil cp -r dist/ oss://your-bucket-name/ --recursive
```

#### 2.5 测试访问

1. 在 Bucket 概览页找到「外网 Endpoint」
2. 格式: `http://[bucket-name].[region].aliyuncs.com`
3. 添加路径: `/index.html`
4. 示例: `http://ningxia-silk-heritage.oss-cn-beijing.aliyuncs.com/index.html`

如果能正常看到网站首页，说明成功！

---

### 第三步：绑定自定义域名（可选但推荐）

#### 3.1 准备域名

- 已有域名：直接在阿里云 DNS 解析
- 新购域名：访问 https://wanwang.aliyun.com/domain

#### 3.2 配置 CDN 加速（推荐）

1. 访问 https://cdn.console.aliyun.com
2. 点击「域名管理」 → 「添加域名」
3. 填写：
   - **加速域名**: `www.yourdomain.com` 或 `silk.yourdomain.com`
   - **源站类型**: OSS 域名
   - **源站域名**: 选择你的 Bucket（如 `ningxia-silk-heritage.oss-cn-beijing.aliyuncs.com`）
4. 点击「下一步」并完成配置

#### 3.3 配置 DNS 解析

1. 访问 https://dns.console.aliyun.com
2. 选择你的域名 → 「添加记录」
3. 填写：
   - **记录类型**: `CNAME`
   - **主机记录**: `www`（或留空表示主域名）
   - **记录值**: CDN 提供的 CNAME 地址（如 `xxxxx.cn-hangzhou.kunlun.com`）
   - **TTL**: 10 分钟
4. 点击「确认」

#### 3.4 配置 HTTPS（SSL 证书）

1. 访问 https://ssl.aliyun.com
2. 申请免费证书（DigiCert 免费版）
3. 选择「DV 型个人版」
4. 按指引完成域名验证（DNS 或文件验证）
5. 审核通过后下载证书（选择 Nginx/Apache 格式）
6. 返回 CDN 控制台 → 「HTTPS 配置」
7. 上传证书并开启 HTTPS

---

### 第四步：优化配置

#### 4.1 设置缓存策略

OSS 控制台 → 「数据处理」 → 「缓存配置」

建议设置：
```
index.html              HTTP 过期时间: 0（不缓存）
*.css *.js *.svg        HTTP 过期时间: 365 天（长期缓存）
*.png *.jpg             HTTP 过期时间: 365 天
```

#### 4.2 配置防盗链

OSS 控制台 → 「数据安全」 → 「Referer 防盗链」

```
允许 Referer 为空: ❌ 不允许
Referer 白名单:
  - https://www.yourdomain.com
  - https://yourdomain.com
```

#### 4.3 跨域设置（如有 API 调用）

OSS 控制台 → 「数据处理」 → 「跨域设置」

```
来源: * 或指定域名
允许 Methods: GET, POST, PUT, DELETE
允许 Headers: *
暴露 Headers: Content-Type
最大时长: 1800
```

---

## 方案二：ECS 轻量应用服务器（进阶）

如果未来计划增加后端功能（如 API、数据库），建议使用 ECS。

### 第一步：购买服务器

1. 访问 https://lightweight.aliyun.com
2. 选择配置：
   - **镜像**: Ubuntu 22.04 LTS 或 CentOS 7.9
   - **CPU**: 2 核（最低）
   - **内存**: 2GB（推荐 4GB）
   - **带宽**: 3Mbps（约¥89/月起）
   - **地域**: 根据用户群体选择
3. 配置系统盘：高效云盘 40GB
4. 设置 root 密码或 SSH 密钥
5. 购买并等待启动

### 第二步：连接服务器

**方式 A：Workbench 远程连接**（推荐新手）

1. 云服务器控制台 → 实例详情
2. 点击「远程连接」 → 「Workbench」
3. 使用 root 账号登录

**方式 B：SSH 终端**

```bash
ssh root@<服务器公网IP>
# 输入密码后登录
```

### 第三步：安装环境

```bash
# 更新系统包
apt update && apt upgrade -y

# 安装 Nginx
apt install nginx -y

# 安装 Node.js（可选，用于本地构建）
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install nodejs -y

# 检查版本
node -v    # v18.x
npm -v     # 9.x
nginx -v   # 已安装成功
```

### 第四步：上传并部署网站

#### 4.1 构建项目（本地）

```bash
cd "C:\Users\asd\Desktop\新建文件夹"
npm install
npm run build
```

#### 4.2 上传 dist 到服务器

**方式 A：SCP 命令**

```bash
scp -r dist/* root@<服务器 IP>:/var/www/html/
```

**方式 B：FileZilla / WinSCP**

1. 使用 SFTP 协议连接到服务器
2. 上传 `dist/` 目录所有文件到 `/var/www/html/`

**方式 C：Git 自动部署**（进阶）

```bash
# 服务器上初始化 Git 仓库
cd /var/www/html
git init

# 本地推送代码（略）
```

#### 4.3 配置 Nginx

```bash
# 编辑配置文件
nano /etc/nginx/sites-available/default
```

替换为以下配置：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/html;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Vue Router History 模式
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

保存退出 (`Ctrl+X`, `Y`, `Enter`)

```bash
# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
systemctl enable nginx
```

### 第五步：配置域名和 SSL

#### 5.1 域名解析

同方案一的步骤 3.3，将域名 A 记录指向服务器公网 IP。

#### 5.2 安装 Certbot（Let's Encrypt 免费证书）

```bash
apt install certbot python3-certbot-nginx -y

# 申请证书
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 按提示输入邮箱，同意条款
# 选择是否强制 HTTPS（推荐选 Yes）
```

Certbot 会自动修改 Nginx 配置，启用 HTTPS。

#### 5.3 自动续期

```bash
# 测试自动续期
certbot renew --dry-run

# 设置定时任务（通常已自动配置）
crontab -l
# 应该能看到类似：0 0,12 * * * certbot renew --quiet
```

---

## 方案对比总结

| 特性 | OSS 静态托管 | ECS 服务器 |
|------|------------|-----------|
| **成本** | ¥20-50/月 | ¥89-199/月 |
| **维护** | 免运维 | 需自行维护 |
| **性能** | CDN 全球加速 | 依赖带宽配置 |
| **扩展性** | 仅静态内容 | 可扩展后端 |
| **备案** | 国内节点需要 | 需要 |
| **上手难度** | ⭐⭐ | ⭐⭐⭐⭐ |
| **推荐场景** | 纯展示网站 | 有后端需求 |

---

## 📝 常见问题 FAQ

### Q1: 如何备案？

**阿里云 ICP 备案流程**:
1. 访问 https://beian.aliyun.com
2. 选择「新增备案」
3. 填写主体信息（个人或企业）
4. 填写网站信息
5. 上传证件照片
6. 短信核验 + 人脸识别
7. 等待工信部审核（约 10-20 工作日）

备案期间可以先使用阿里云提供的临时域名进行测试。

### Q2: 刷新页面显示 404 怎么办？

这是 Vue Router 的 History 模式问题。解决方案：
- **OSS**: 错误页面设置为 `index.html`
- **Nginx**: 添加 `try_files $uri $uri/ /index.html;`

### Q3: 如何更新网站？

**OSS 方式**:
```bash
# 重新构建
npm run build

# 覆盖上传（只传变化的文件）
ossutil cp -r dist/ oss://your-bucket/ --update
```

**ECS 方式**:
```bash
# 上传新文件
scp -r dist/* root@ip:/var/www/html/

# 或在服务器上拉取 Git
cd /var/www/html
git pull origin main
npm run build
```

### Q4: 如何监控访问统计？

**OSS**:
- Bucket 控制台 → 「数据分析」 → 「流量统计」
- 开通 OSS 日志分析功能

**CDN**:
- CDN 控制台 → 「监控查询」 → 「流量/带宽统计」

**ECS+Nginx**:
```bash
# 查看访问日志
tail -f /var/log/nginx/access.log

# 安装 GoAccess 实时分析
apt install goaccess -y
goaccess /var/log/nginx/access.log -o report.html
```

---

## 🚀 快速部署脚本（一键部署）

如果选择 ECS 方案，可以用这个脚本自动化：

```bash
#!/bin/bash
# deploy.sh - 放在项目根目录

# 1. 构建
npm install
npm run build

# 2. 上传并部署
scp -r dist/* root@your-server-ip:/var/www/html/

# 3. 重启 Nginx
ssh root@your-server-ip "systemctl restart nginx"

echo "✅ 部署完成！请访问 http://your-domain.com"
```

使用方法：
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 💰 成本估算（第一年）

| 项目 | OSS 方案 | ECS 方案 |
|------|---------|---------|
| 域名 | ¥50/年 | ¥50/年 |
| 主机服务 | ¥300/年 | ¥1000/年 |
| SSL 证书 | 免费 | 免费 |
| CDN | ¥50/年（按量） | - |
| **合计** | **¥400** | **¥1100** |

---

## 📞 需要帮助？

如果遇到部署问题：

1. 检查项目是否能本地运行：`npm run preview`
2. 查看阿里云文档：https://help.aliyun.com
3. 阿里云工单系统：https://workorder.console.aliyun.com
4. 7×24 小时技术支持热线：95187

---

**最后更新**: 2026-04-17  
**适用于**: Vue 3 + Vite 项目  
**文档作者**: QwenPaw
