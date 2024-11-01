import request from '@/utils/request'

// 查询物品管理列表
export function listItems(query) {
  return request({
    url: '/items/items/list',
    method: 'get',
    params: query
  })
}

// 查询物品管理详细
export function getItems(id) {
  return request({
    url: '/items/items/' + id,
    method: 'get'
  })
}

// 新增物品管理
export function addItems(data) {
  return request({
    url: '/items/items',
    method: 'post',
    data: data
  })
}

// 修改物品管理
export function updateItems(data) {
  return request({
    url: '/items/items',
    method: 'put',
    data: data
  })
}

// 删除物品管理
export function delItems(id) {
  return request({
    url: '/items/items/' + id,
    method: 'delete'
  })
}
