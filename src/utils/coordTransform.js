// 坐标系转换：WGS84（天地图 / 项目原始数据）↔ GCJ-02（高德 / 火星坐标）
// 采用国内通用的偏移量算法，宁夏范围内精度优于 1 米，满足地图套合与点位纠偏需求

const PI = Math.PI
const A = 6378245.0                  // 克拉索夫斯基椭球长半轴
const EE = 0.00669342162296594323    // 椭球第一偏心率平方

// 国外坐标不做加密偏移（本项目数据均在境内，保留判断以符合算法完整性）
const outOfChina = (lng, lat) =>
  lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271

const transformLat = (x, y) => {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0
  ret += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0
  return ret
}

const transformLng = (x, y) => {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0
  ret += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0
  return ret
}

/**
 * WGS84 → GCJ-02
 * @param {number} lng 经度
 * @param {number} lat 纬度
 * @returns {[number, number]} [经度, 纬度]
 */
export function wgs84ToGcj02(lng, lat) {
  if (outOfChina(lng, lat)) return [lng, lat]

  let dLat = transformLat(lng - 105.0, lat - 35.0)
  let dLng = transformLng(lng - 105.0, lat - 35.0)

  const radLat = (lat / 180.0) * PI
  let magic = Math.sin(radLat)
  magic = 1 - EE * magic * magic
  const sqrtMagic = Math.sqrt(magic)

  dLat = (dLat * 180.0) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI)
  dLng = (dLng * 180.0) / ((A / sqrtMagic) * Math.cos(radLat) * PI)
  return [lng + dLng, lat + dLat]
}

/**
 * GCJ-02 → WGS84（一次反向解算，误差约 1 米级，足够用于坐标读数显示）
 * @param {number} lng 经度
 * @param {number} lat 纬度
 * @returns {[number, number]} [经度, 纬度]
 */
export function gcj02ToWgs84(lng, lat) {
  if (outOfChina(lng, lat)) return [lng, lat]
  const [gLng, gLat] = wgs84ToGcj02(lng, lat)
  return [lng * 2 - gLng, lat * 2 - gLat]
}

// 递归转换 GeoJSON 坐标（支持 Polygon / MultiPolygon / LineString 等任意嵌套层级）
const transformCoords = (coords, fn) => {
  if (typeof coords[0] === 'number') return fn(coords[0], coords[1])
  return coords.map(c => transformCoords(c, fn))
}

/**
 * 返回一份坐标已转换的 GeoJSON 副本，不修改原始数据
 * @param {object} geojson FeatureCollection
 * @param {(lng: number, lat: number) => [number, number]} fn
 */
export function transformGeoJson(geojson, fn) {
  return {
    ...geojson,
    features: (geojson.features || []).map(f => ({
      ...f,
      geometry: f.geometry
        ? { ...f.geometry, coordinates: transformCoords(f.geometry.coordinates, fn) }
        : f.geometry
    }))
  }
}
