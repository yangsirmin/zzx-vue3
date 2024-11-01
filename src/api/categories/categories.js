import request from '@/utils/request'

// 查询物品种类列表
export function listCategories(query) {
  return request({
    url: '/categories/categories/list',
    method: 'get',
    params: query
  })
}

// 查询物品种类详细
export function getCategories(id) {
  return request({
    url: '/categories/categories/' + id,
    method: 'get'
  })
}

// 新增物品种类
export function addCategories(data) {
  return request({
    url: '/categories/categories',
    method: 'post',
    data: data
  })
}

// 修改物品种类
export function updateCategories(data) {
  return request({
    url: '/categories/categories',
    method: 'put',
    data: data
  })
}

// 删除物品种类
export function delCategories(id) {
  return request({
    url: '/categories/categories/' + id,
    method: 'delete'
  })
}
