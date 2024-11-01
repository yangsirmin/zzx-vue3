import request from '@/utils/request'

// 查询领取地点列表
export function listLocations(query) {
  return request({
    url: '/locations/locations/list',
    method: 'get',
    params: query
  })
}

// 查询领取地点详细
export function getLocations(id) {
  return request({
    url: '/locations/locations/' + id,
    method: 'get'
  })
}

// 新增领取地点
export function addLocations(data) {
  return request({
    url: '/locations/locations',
    method: 'post',
    data: data
  })
}

// 修改领取地点
export function updateLocations(data) {
  return request({
    url: '/locations/locations',
    method: 'put',
    data: data
  })
}

// 删除领取地点
export function delLocations(id) {
  return request({
    url: '/locations/locations/' + id,
    method: 'delete'
  })
}
