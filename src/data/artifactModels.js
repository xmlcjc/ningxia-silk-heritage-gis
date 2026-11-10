// 非遗条目三维器物解析（第三阶段 P1-3 修订）
//
// 语义分级契约：
//   relation: 'authentic'  —— 与该非遗项目真实对应的器物模型，可直接展示
//   relation: 'reference'  —— 仅作工艺/风格参照的通用模型，必须标注“工艺参照模型，非该项目实物”
//   返回 null              —— 无明确对应关系，不展示器物模型，由详情卡显示“暂无对应三维模型”
//
// 修订说明：
//   此前按“非遗类别 → Poly Haven CC0 道具”批量映射（传统音乐→铜瓶、传统美术→古瓷瓶、
//   传统戏剧/舞蹈→木灯笼、传统民俗/体育→茶桌茶具等）。这些道具与具体非遗项目之间
//   不存在可考证的对应关系（如泥哇呜展示铜瓶、固原砖雕展示古瓷瓶），属于语义错配，
//   会误导观众，因此本批全部停用。
//
//   3 个拥有实景三维场景（3DGS）的条目走 heritageData.models，不经过本模块。
//   后续若引入真实器物模型，须先确认其与项目的对应关系并标注 relation 后再恢复返回。

/**
 * 解析非遗条目的器物模型。
 * @param {object} [_item] 非遗条目（含 category 等字段）
 * @returns {{src: string, label: string, relation: 'authentic' | 'reference'} | null}
 */
export function artifactFor(_item) {
  return null
}
