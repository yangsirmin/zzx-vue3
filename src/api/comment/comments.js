import request from '@/utils/request'

// 查询用户评论列表
export function listComment(query) {
  return request({
    url: '/comment/comment/list',
    method: 'get',
    params: query
  })
}

// 查询用户评论详细
export function getComment(id) {
  return request({
    url: '/comment/comment/' + id,
    method: 'get'
  })
}

// 新增用户评论
export function addComment(data) {
  return request({
    url: '/comment/comment',
    method: 'post',
    data: data
  })
}

// 修改用户评论
export function updateComment(data) {
  return request({
    url: '/comment/comment',
    method: 'put',
    data: data
  })
}

// 删除用户评论
export function delComment(id) {
  return request({
    url: '/comment/comment/' + id,
    method: 'delete'
  })
}
