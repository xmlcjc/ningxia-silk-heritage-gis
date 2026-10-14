<template>
  <div ref="host" class="artifact-model">
    <div v-if="status === 'loading'" class="model-state">加载器物模型…</div>
    <div v-else-if="status === 'error'" class="model-state model-state--err">
      模型加载失败
    </div>
  </div>
</template>

<script setup>
// 器物三维转盘：在大屏下钻卡片中展示 CC0 器物模型（glTF），
// 自动包围盒适配 + 环境光 + 底部阴影盘 + 缓慢自转，按需挂载（卸载即销毁渲染器）
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const props = defineProps({
  // 模型 URL（.gltf / .glb）
  src: { type: String, required: true }
})

const host = ref(null)
const status = ref('loading')

let renderer, scene, camera, loader, raf
let spinGroup = null, mixer = null
let disposed = false
let lastT = 0

// 包围盒尺寸 → 相机半径（各向异性模型取最大维度，保证完整入镜）
const FRAME_PAD = 1.45

function init() {
  if (!host.value) return
  disposed = false
  // 卡片处于 transition 进入动画中，等一帧拿到稳定布局再量尺寸（否则 clientWidth 可能为 0）
  requestAnimationFrame(() => {
    if (disposed || !host.value) return
    const rect = host.value.getBoundingClientRect()
    const w = Math.max(Math.round(rect.width), 120)
    const h = Math.max(Math.round(rect.height), 100)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0) // 透明底，让卡片渐变背景透出
    host.value.appendChild(renderer.domElement)

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(38, w / h, 0.01, 50)

    // 鎏金主题的三点光：暖主光 + 冷补光 + 顶光，器物材质才有质感
    const key = new THREE.DirectionalLight(0xfff0d0, 2.4); key.position.set(2, 3, 2.5)
    const fill = new THREE.DirectionalLight(0xbfd4ff, 0.7); fill.position.set(-2.5, 1, -1)
    const top = new THREE.HemisphereLight(0xfff6e0, 0x2a2018, 1.3)
    scene.add(key, fill, top)

    spinGroup = new THREE.Group()
    scene.add(spinGroup)

    // 本项目器物模型（Poly Haven CC0）均为未压缩 glTF，无需 Draco 解码器，保持零外链
    loader = new GLTFLoader()

    loader.load(
      props.src,
      (gltf) => {
        if (disposed) return
        mixer = gltf.mixer || null
        const clip = gltf.animations?.[0]
        if (clip && mixer) mixer.clipAction(clip).play()

        spinGroup.add(gltf.scene)
        // 包围盒测量 → 底面抬到 y=0、中心平移到原点（自转轴心在器物中轴）
        const box = new THREE.Box3().setFromObject(gltf.scene)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        gltf.scene.position.sub(center)
        gltf.scene.position.y += size.y / 2

        // 底部阴影盘：贴着器物底面（y=0 稍下）
        const disc = new THREE.Mesh(
          new THREE.CircleGeometry(maxDim * 0.55, 48),
          new THREE.MeshBasicMaterial({ color: 0x2a1f14, transparent: true, opacity: 0.5 })
        )
        disc.rotation.x = -Math.PI / 2
        disc.position.y = -0.001
        spinGroup.add(disc)

        // 3/4 视角取景：注视点放在器物几何中心，保证任何长宽比的器物完整入镜
        const radius = (maxDim * FRAME_PAD) / 2
        const target = new THREE.Vector3(0, size.y / 2, 0)
        const elev = radius * 0.5
        camera.position.set(0, target.y + elev, Math.sqrt(Math.max(radius * radius - elev * elev, 0.01)))
        camera.lookAt(target)

        status.value = 'ready'
        animate(0)
      },
      undefined,
      () => { if (!disposed) status.value = 'error' }
    )
  })
}

function animate(t) {
  if (disposed) return
  raf = requestAnimationFrame(animate)
  const dt = (t - lastT) / 1000
  lastT = t
  if (mixer) mixer.update(dt)
  if (spinGroup) spinGroup.rotation.y += dt * 0.5 // 缓慢自转
  renderer.render(scene, camera)
}

function dispose() {
  disposed = true
  cancelAnimationFrame(raf)
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss?.()
    renderer.domElement?.remove()
    renderer = null
  }
  if (scene) {
    scene.traverse((o) => {
      o.geometry?.dispose?.()
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach((m) => { Object.values(m).forEach((v) => v?.isTexture && v.dispose()); m.dispose() })
      }
    })
    scene = null
  }
  mixer = null; spinGroup = null
}

// src 变化（同一卡片内切换模型）→ 整体重建
watch(() => props.src, () => {
  dispose()
  status.value = 'loading'
  if (host.value) init()
})

onMounted(init)
onBeforeUnmount(dispose)
</script>

<style lang="scss" scoped>
.artifact-model {
  width: 100%;
  height: 100%;
  position: relative;

  :deep(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
}

.model-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(243, 227, 192, 0.55);
  font-size: 12px;
  letter-spacing: 1px;

  &.model-state--err { color: rgba(214, 69, 69, 0.85); }
}
</style>
