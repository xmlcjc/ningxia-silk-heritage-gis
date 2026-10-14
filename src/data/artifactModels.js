// 器物模型映射：为无实景三维场景的非遗条目按类别配 CC0 器物模型（Poly Haven，公共领域）
// 用途：大屏/地图下钻卡片中的三维器物预览，与 3DGS 实景场景形成"器物 + 实景"两级三维展示
const BASE = '/models/polyhaven'

const MAP = {
  传统技艺: [
    { src: `${BASE}/ceramic_pot/ceramic_pot.gltf`, label: '陶罐' },
    { src: `${BASE}/carved_wooden_plate/carved_wooden_plate.gltf`, label: '雕花木盘' }
  ],
  传统音乐: [
    { src: `${BASE}/brass_vase_01/brass_vase_01.gltf`, label: '铜瓶' }
  ],
  传统美术: [
    { src: `${BASE}/antique_ceramic_vase_01/antique_ceramic_vase_01.gltf`, label: '古瓷瓶' },
    { src: `${BASE}/carved_wooden_plate/carved_wooden_plate.gltf`, label: '雕花木盘' }
  ],
  传统戏剧: [
    { src: `${BASE}/wooden_lantern_01/wooden_lantern_01.gltf`, label: '木灯笼' }
  ],
  传统民俗: [
    { src: `${BASE}/chinese_tea_table/chinese_tea_table.gltf`, label: '中式茶桌' },
    { src: `${BASE}/wooden_candlestick/wooden_candlestick.gltf`, label: '木烛台' }
  ],
  传统舞蹈: [
    { src: `${BASE}/wooden_lantern_01/wooden_lantern_01.gltf`, label: '木灯笼' }
  ],
  传统体育: [
    { src: `${BASE}/chinese_tea_table/chinese_tea_table.gltf`, label: '中式茶桌' },
    { src: `${BASE}/tea_set_01/tea_set_01.gltf`, label: '茶具' }
  ]
}

/**
 * 按非遗类别取器物模型（首个）
 * @param {string} category 非遗类别
 * @returns {{src: string, label: string} | null}
 */
export function artifactFor(category) {
  return MAP[category]?.[0] || null
}
