// 从 @playcanvas/supersplat-viewer 同步自托管的三维查看器静态资源到 public/viewer/
// 由 npm predev / prebuild 钩子自动执行，因此 public/viewer/ 无需纳入版本库
import { mkdir, copyFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const src = join(root, 'node_modules', '@playcanvas', 'supersplat-viewer', 'public')
const dest = join(root, 'public', 'viewer')

// 查看器自带 UI 的默认背景改为站点暖色深底，让文物主体更突出（色值为 0~1）
const BACKGROUND = [0.086, 0.071, 0.063]

// 每个场景模型的初始视角。
// 模型为「照片转 3DGS」的场景扫描，点云位于拍摄相机坐标系（相机在原点看向 +Z），
// 仅在拍摄视角附近可信，因此初始相机必须复现原图视角，否则会露出空洞产生伪 3D 感。
// - position：拍摄相机位置（原点）
// - target：点云包围盒中心（偏离光轴不到 10°，透视仍贴合原图且构图居中）
// - fov：由源 .ply 内参 fy 与图像高度反算的原图垂直 FOV（2*atan(h/2/fy)）
const MODEL_VIEWS = {
  'helanyan.sog': { position: [0, 0, 0], target: [-1.146, -6.721, 45.057], fov: 43.6 },
  'huihuaer-a.sog': { position: [0, 0, 0], target: [-1.554, -5.93, 67.18], fov: 43.6 },
  'huihuaer-b.sog': { position: [0, 0, 0], target: [-1.351, -7.365, 52.623], fov: 39.6 },
}

if (!existsSync(src)) {
  console.error('[sync-viewer] 未找到 @playcanvas/supersplat-viewer，请先执行 npm install')
  process.exit(1)
}

await mkdir(dest, { recursive: true })

// 仅复制运行所需文件，跳过体积很大的 source map
for (const file of ['index.html', 'index.js', 'index.css']) {
  await copyFile(join(src, file), join(dest, file))
}

// 查看器默认会请求同级的 settings.json，缺失会报错，因此按官方 schema 生成一份
const { defaultSettings } = await import('@playcanvas/supersplat-viewer/settings')
const settings = defaultSettings('object')
settings.background.color = BACKGROUND
await writeFile(join(dest, 'settings.json'), `${JSON.stringify(settings, null, 2)}\n`)

// 为每个场景模型生成专属 settings（ArtifactViewer 通过 ?settings= 按模型引用），
// 初始相机复现原图拍摄视角，避免从穿帮角度展示场景模型
const modelsDest = join(root, 'public', 'models')
if (existsSync(modelsDest)) {
  for (const [file, view] of Object.entries(MODEL_VIEWS)) {
    const s = defaultSettings('object')
    s.background.color = BACKGROUND
    s.cameras[0].initial = {
      position: [...view.position],
      target: [...view.target],
      fov: view.fov,
    }
    const out = join(modelsDest, file.replace(/\.sog$/i, '.settings.json'))
    await writeFile(out, `${JSON.stringify(s, null, 2)}\n`)
  }
  console.log(`[sync-viewer] 已生成 ${Object.keys(MODEL_VIEWS).length} 份模型初始视角 settings`)
}

console.log('[sync-viewer] 已同步三维查看器资源到 public/viewer/')