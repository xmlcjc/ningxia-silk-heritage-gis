<template>
  <figure v-if="art" class="heritage-figure">
    <div class="hf-head">
      <span class="hf-label">{{ figure.label }}</span>
      <span class="hf-meta">{{ figure.meta }}</span>
    </div>

    <div class="hf-stage" @pointerenter="onStageEnter" @pointerleave="onStageLeave">
      <!-- 图是构建期生成的静态 SVG；拆开/选中由 setupArt() 在挂载后挂上去
           （v-html 注入的节点不进 Vue 的模板编译，行为只能这么接） -->
      <div
        ref="canvasRef"
        class="hf-canvas"
        v-html="art"
        @pointerover="onCanvasOver"
        @pointerleave="onCanvasLeave"
      ></div>

      <div v-if="figure.parts" class="hf-parts" @keydown="onPartsKey">
        <button
          v-for="p in figure.parts"
          :key="p.id"
          type="button"
          class="hf-part"
          :class="{ 'is-on': activeId === p.id, 'is-pinned': pinnedId === p.id }"
          @pointerenter="onPartEnter(p.id)"
          @pointerleave="onPartLeave"
          @focus="onPartEnter(p.id)"
          @blur="onPartLeave"
          @click="onPartClick(p.id)"
        >
          {{ p.label }}
        </button>
        <p class="hf-readout">{{ readout }}</p>
      </div>
    </div>

    <div class="hf-foot">
      <ul class="hf-params">
        <li v-for="p in figure.params" :key="p">{{ p }}</li>
      </ul>
      <p class="hf-caption">{{ figure.caption }}</p>
    </div>
  </figure>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
// 示意图是构建期用 anatomy kit 生成的静态 SVG（详见 README「第三方资源」）。
// 静态 import 让每张图随本组件一起切成懒加载分包，详情页首屏不背这部分体积。
import raftAssembly from './figures/raft-assembly.svg?raw'

const FIGURES = { raft: raftAssembly }

const props = defineProps({
  figure: { type: Object, required: true }
})

const art = computed(() => FIGURES[props.figure.key] || '')

// ── 选中态 ──────────────────────────────────────────────────────────────────
// overId：鼠标悬停 / 键盘聚焦到某一组；pinnedId：点按钮钉住的那一组（触屏的唯一通路）。
const overId = ref(null)
const pinnedId = ref(null)
const apart = ref(false)
const activeId = computed(() => overId.value || pinnedId.value)
const readout = computed(() => {
  const hit = (props.figure.parts || []).find((p) => p.id === activeId.value)
  return hit ? hit.what : props.figure.hint || ''
})

// ── 拆开运行时 ──────────────────────────────────────────────────────────────
// 图里每一件是 <g class="it" data-piece data-k data-m[ data-ride]>：
//   data-m   世界坐标下的拆卸位移（皮囊沿径向抽开、木架向上抬起）
//   data-k   静态深度键，与 kit 的 depthOf 同一根轴
//   data-ride 借另一件的弹簧（麻绳扎在横木上，随木架一起被带走）
// 运行时只读这些契约，不碰几何；常量随图一起走（<svg data-cam data-stagger>）。
const SPRING = { stiffness: 64, damping: 14.2, substeps: 4 } // 临界阻尼附近：回弹有重量感
const STAGGER = 35 // ms，逐件错开启动
const SETTLED = { x: 4e-4, v: 2e-3 }

const canvasRef = ref(null)
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

let raf = 0
let last = 0
let hovering = false
let order = ''
let bob = null
let cam = null
let staggerOrder = []
let nodes = []
const springs = new Map() // piece → { x, v, target, at }

const springOf = (node) => springs.get(node.ride || node.piece)

function setupArt() {
  const svg = canvasRef.value && canvasRef.value.querySelector('.iso-svg')
  if (!svg) return
  const raw = (svg.dataset.cam || '').split(',').map(Number)
  if (raw.length !== 5 || raw.some(Number.isNaN)) return
  const [sinA, cosA, sinE, cosE, k] = raw
  // 视线单位轴：与 kit 的 depthOf 一致，用来把位移量折算成深度变化
  cam = { sinA, cosA, sinE, cosE, k, view: [cosA * cosE, sinA * cosE, sinE] }
  bob = svg.querySelector('.rf-bob')
  if (!bob) return

  nodes = [...bob.querySelectorAll('.it')].map((el, i) => {
    const move = (el.dataset.m || '0,0,0').split(',').map(Number)
    return {
      el,
      i,
      piece: el.dataset.piece || '',
      ride: el.dataset.ride || '',
      key: Number(el.dataset.k || 0),
      move,
      lift: move[0] * cam.view[0] + move[1] * cam.view[1] + move[2] * cam.view[2]
    }
  })
  // 借骑件的件不单独排弹簧——它随被骑的件一起走
  for (const node of nodes) {
    const owner = node.ride || node.piece
    if (owner && !springs.has(owner)) springs.set(owner, { x: 0, v: 0, target: 0, at: 0 })
  }
  staggerOrder = (svg.dataset.stagger || '')
    .split(',')
    .map((name) => name.trim())
    .filter((name) => springs.has(name))
  if (!staggerOrder.length) staggerOrder = [...springs.keys()]
}

// 屏幕位移：与 kit 的 iso() 同一个式子，作用在世界位移上
function place() {
  const { sinA, cosA, sinE, cosE, k } = cam
  const sorted = nodes
    .slice()
    .sort((a, b) => a.key + a.lift * springOf(a).x - (b.key + b.lift * springOf(b).x) || a.i - b.i)
  const signature = sorted.map((node) => node.i).join(',')
  if (signature !== order) {
    // 只在前后顺序真的变了才重排 DOM：拆开过程中木架会越过前排皮囊
    order = signature
    const frag = document.createDocumentFragment()
    for (const node of sorted) frag.appendChild(node.el)
    bob.appendChild(frag)
  }
  for (const node of nodes) {
    const amount = springOf(node).x
    // 低于半个像素的位移读不出来，直接当成装好态——静止的图与静态 SVG 逐字一致
    if (Math.abs(amount) * 60 < 0.5) {
      node.el.removeAttribute('transform')
      continue
    }
    const [mx, my, mz] = node.move
    const tx = (mx * sinA - my * cosA) * k * amount
    const ty = ((mx * cosA + my * sinA) * sinE - mz * cosE) * k * amount
    node.el.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)})`)
  }
}

function step(now) {
  raf = 0
  const dt = Math.min(64, last ? now - last : 16.7)
  last = now
  const h = dt / SPRING.substeps / 1000
  let live = false
  for (const s of springs.values()) {
    if (now < s.at) {
      live = true // 还没轮到它启动（stagger）
      continue
    }
    for (let sub = 0; sub < SPRING.substeps; sub++) {
      const accel = SPRING.stiffness * (s.target - s.x) - SPRING.damping * s.v
      s.v += accel * h
      s.x += s.v * h
    }
    if (Math.abs(s.x - s.target) < SETTLED.x && Math.abs(s.v) < SETTLED.v) {
      s.x = s.target
      s.v = 0
    } else {
      live = true
    }
  }
  place()
  if (live) raf = requestAnimationFrame(step)
  else last = 0
}

function setApart(next) {
  if (next === apart.value) return
  apart.value = next
  // 拆开顺序写死「木架先行」，合拢反序（皮囊先归位，木架再落下）
  const queue = next ? staggerOrder : staggerOrder.slice().reverse()
  const now = performance.now()
  let wait = 0
  for (const piece of queue) {
    const s = springs.get(piece)
    if (!s || s.target === (next ? 1 : 0)) continue // 已经在目标态的不重排
    s.target = next ? 1 : 0
    s.at = now + wait * STAGGER
    wait++
  }
  if (reduce.matches) {
    // 降级：直接到位，不排帧
    for (const s of springs.values()) {
      s.x = s.target
      s.v = 0
      s.at = 0
    }
    place()
    return
  }
  if (!raf) {
    last = 0
    raf = requestAnimationFrame(step)
  }
}

// 唯一的拆开开关：钉住或（鼠标）悬停时拆开
function sync() {
  setApart(Boolean(pinnedId.value) || (hovering && !reduce.matches))
}

// ── 交互 ────────────────────────────────────────────────────────────────────
function onStageEnter(event) {
  if (event.pointerType && event.pointerType !== 'mouse') return
  hovering = true
  sync()
}
function onStageLeave() {
  hovering = false
  sync()
}
function onCanvasOver(event) {
  const it = event.target.closest ? event.target.closest('.it') : null
  overId.value = it ? it.dataset.piece || null : null
}
function onCanvasLeave() {
  overId.value = null
}
function onPartEnter(id) {
  overId.value = id
}
function onPartLeave() {
  overId.value = null
}
function onPartClick(id) {
  pinnedId.value = pinnedId.value === id ? null : id
  sync()
}
function onPartsKey(event) {
  const parts = props.figure.parts || []
  if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key) || !parts.length) return
  event.preventDefault()
  const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
  const at = parts.findIndex((p) => p.id === activeId.value)
  const index = at < 0 ? (forward ? 0 : parts.length - 1) : (at + (forward ? 1 : -1) + parts.length) % parts.length
  const buttons = event.currentTarget.querySelectorAll('.hf-part')
  if (buttons[index]) buttons[index].focus()
}

// 选中：只有这一个色相（黄河水那一支的深金），其余件退进纸面
watch(activeId, (id) => {
  const svg = canvasRef.value && canvasRef.value.querySelector('.iso-svg')
  if (!svg) return
  for (const node of nodes) node.el.toggleAttribute('data-on', node.piece === id)
  if (id) svg.setAttribute('data-focus', '')
  else svg.removeAttribute('data-focus')
})

onMounted(() => {
  nextTick(setupArt)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
})
</script>

<!-- anatomy kit 的视觉全部读 --anatomy-* 自定义属性（kit/iso.css，MIT）。
     这里只把令牌接到一处颜色：黄河水。筏体（皮囊/木架/麻绳）全部无彩色，
     靠明度分级读体积与材质，于是整张图只有一个色相焦点；选中件也走同一支深金。
     选择器一律带 .heritage-figure 前缀，不 scoped（v-html 注入的节点拿不到作用域属性），
     也不会污染站点其它样式。 -->
<style>
.heritage-figure {
  margin: 0;
  padding: 14px 16px 12px;
  background: var(--color-paper, #FDFBF7);
  border: 1px solid var(--color-border-light, #ECE0D6);
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
}

/* 版式：像工程图册那样，图有编号、有出处、有参数行 */
.heritage-figure .hf-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border-light, #ECE0D6);
}
.heritage-figure .hf-label {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-primary, #8B4513);
}
.heritage-figure .hf-meta {
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: var(--color-text-muted, #82685E);
  white-space: nowrap;
}
.heritage-figure .hf-canvas {
  padding: 4px 0 2px;
}
.heritage-figure .hf-canvas svg {
  display: block;
  width: 100%;
  height: auto;
}

/* 零件行：三个按钮 + 一行读出（悬停/选中这件是干什么用的） */
.heritage-figure .hf-parts {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 8px;
  padding-top: 10px;
}
.heritage-figure .hf-part {
  appearance: none;
  margin: 0;
  padding: 3px 10px;
  font: inherit;
  font-size: 11.5px;
  letter-spacing: 0.04em;
  color: var(--color-text-light, #7E5E54);
  background: transparent;
  border: 1px solid var(--color-border, #D7CCC8);
  border-radius: 999px;
  cursor: pointer;
  transition: color 120ms linear, border-color 120ms linear, background-color 120ms linear;
}
.heritage-figure .hf-part:hover,
.heritage-figure .hf-part.is-on {
  color: var(--color-primary-dark, #5D3A1A);
  border-color: #C79A3E;
  background: rgba(212, 160, 23, 0.14);
}
.heritage-figure .hf-part.is-pinned {
  border-color: var(--color-primary, #8B4513);
}
.heritage-figure .hf-part:focus-visible {
  outline: 2px solid var(--color-secondary, #D4A017);
  outline-offset: 1px;
}
.heritage-figure .hf-readout {
  flex: 1 1 200px;
  min-width: 0;
  margin: 0;
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--color-text-muted, #82685E);
  text-align: justify;
}

.heritage-figure .hf-foot {
  padding-top: 8px;
  border-top: 1px solid var(--color-border-light, #ECE0D6);
}
.heritage-figure .hf-params {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 0;
  margin: 0 0 6px;
  padding: 0;
  list-style: none;
  font-size: 11.5px;
  color: var(--color-text-light, #7E5E54);
}
.heritage-figure .hf-params li + li::before {
  content: "·";
  margin: 0 8px;
  color: var(--color-border, #D7CCC8);
}
.heritage-figure .hf-caption {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.75;
  color: var(--color-text-muted, #82685E);
  text-align: justify;
}

.heritage-figure .iso-svg {
  --anatomy-page: #FDFBF7;
  --anatomy-card: #FDFBF7;
  --anatomy-text: #5D4037;
  --anatomy-strong: #3E2723;
  --anatomy-muted: #82685E;
  --anatomy-paper: #FDFBF7;
  --anatomy-face: #FCFAF5;
  --anatomy-top: #FFFFFF;
  --anatomy-shade-0: #D9D1C4;
  --anatomy-shade-1: #E7E1D6;
  --anatomy-shade-2: #F2EEE6;
  --anatomy-shade-3: #F9F6F0;
  --anatomy-lit-top: #FFFFFF;
  --anatomy-lit-shade: #F5F2EC;
  --anatomy-hi: #3E3730;
  --anatomy-mid: #6B6156;
  --anatomy-lo: #877C6F;
  --anatomy-faint: #C9C0B3;
  --anatomy-lit: #000000;
  --anatomy-halo: #D4A017;
  --anatomy-halo-opacity: 0.14;
  --anatomy-dot: #6B6156;
  --anatomy-red: #C62828;
  --anatomy-green: #2E7D32;
  --anatomy-blue: #1565C0;
  --anatomy-weight: 0.65px;
  /* 选中件：就用黄河水那一支的深金来点，于是整张图仍然只有一个色相 */
  --anatomy-lit-face: #EEDCA6;
  --anatomy-lit-top: #F3E2B2;
  --anatomy-lit-shade: #DCC079;
  --anatomy-lit: #7A5D22;
}
/* 皮囊：全图最亮的一组体块，纯中性白模 */
.heritage-figure .rf-skin {
  --anatomy-top: #FFFFFF;
  --anatomy-face: #FCFAF5;
  --anatomy-shade-0: #D5CCBE;
  --anatomy-shade-1: #E4DED2;
  --anatomy-shade-2: #F0ECE3;
  --anatomy-shade-3: #F8F5EF;
  --anatomy-hi: #3E3730;
  --anatomy-mid: #625850;
  --anatomy-lo: #857A6D;
  --anatomy-faint: #C7BEB1;
}
/* 木架：比皮囊暗一档，用明度而不是色相区分材质 */
.heritage-figure .rf-frame {
  --anatomy-top: #EFEAE1;
  --anatomy-face: #E5DFD4;
  --anatomy-shade-0: #B3A99A;
  --anatomy-shade-1: #C4BBAC;
  --anatomy-shade-2: #D5CDC0;
  --anatomy-shade-3: #E5DFD4;
  --anatomy-hi: #3E3730;
  --anatomy-mid: #6A6055;
  --anatomy-lo: #8A7F71;
  --anatomy-faint: #C3B9AB;
}
/* 黄河水：整张图唯一的一处色（浑黄的河面） */
.heritage-figure .rf-water {
  --anatomy-top: #EFD79B;
  --anatomy-face: #E7CD8C;
  --anatomy-shade-0: #C2A057;
  --anatomy-shade-1: #D1B069;
  --anatomy-shade-2: #DDC27C;
  --anatomy-shade-3: #E7CF8D;
  --anatomy-lo: #8E6F2E;
  --anatomy-faint: #B79C50;
}
/* 画在水面上的线与纹：走水面自己的深金，而不是筏体的灰 */
.heritage-figure .rf-surface,
.heritage-figure .rf-ring {
  --anatomy-lo: #8E6F2E;
  --anatomy-mid: #A5852F;
  --anatomy-faint: #B79C50;
  --anatomy-weight: 0.8px;
}
/* 筏子在水面上的接触暗影 */
.heritage-figure .rf-shadow {
  fill: rgba(120, 86, 24, 0.20);
  filter: blur(11px);
}
/* 麻绳：勒在颈部的那一圈最重，垂下来的绳身次之 */
.heritage-figure .rf-rope { stroke-width: 1.7; }
.heritage-figure .rf-tie { stroke-width: 2.1; }
/* 选中的那一组：整组换成深金（唯一强调色），其余组退进纸面里。
   覆盖 iso.css 里按 data-tone / data-shade 上色的规则，故选择器必须更长。 */
.heritage-figure .it { transition: opacity 120ms linear; }
.heritage-figure .iso-svg[data-focus] .it:not([data-on]) { opacity: 0.5; }
.heritage-figure .it[data-on] .iso-fill { fill: var(--anatomy-lit-face); }
.heritage-figure .it[data-on] .iso-top { fill: var(--anatomy-lit-top); }
.heritage-figure .it[data-on] .iso-shade { fill: var(--anatomy-lit-shade); }
.heritage-figure .it[data-on] .iso-solid[data-seamless] > .iso-shade { stroke: var(--anatomy-lit-shade); }
.heritage-figure .it[data-on] .iso-solid[data-seamless] > .iso-top { stroke: var(--anatomy-lit-top); }
.heritage-figure .it[data-on] .iso-line { stroke: var(--anatomy-lit); }
.heritage-figure .it[data-on] .iso-line.rf-rope { stroke-width: 2.4; }
.heritage-figure .it[data-on] .iso-line.rf-tie { stroke-width: 2.8; }
.heritage-figure .it[data-on] .iso-dots circle { fill: var(--anatomy-lit); opacity: 0.85; }
/* 整筏随水轻轻起伏；只有一处流光（水纹）在走 */
@keyframes hf-bob {
  from { transform: translateY(0); }
  to { transform: translateY(2.2px); }
}
@media (prefers-reduced-motion: no-preference) {
  .heritage-figure .rf-bob {
    animation: hf-bob 3.8s var(--anatomy-ease, cubic-bezier(0.32, 0.72, 0, 1)) infinite alternate;
  }
}
@media (prefers-reduced-motion: reduce) {
  .heritage-figure .iso-line[data-flow],
  .heritage-figure .iso-dots circle[data-pulse],
  .heritage-figure .rf-bob { animation: none; }
}
</style>
