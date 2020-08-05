import { axios } from '@xcedu/web-share'

// 测试环境需要在请求url前加前缀
const prefix = '/api-personalized'
// const prefix = ''

export function getUserInfo () {
  return axios.get('/api-base/users/userInfo')
}

// 上传附件
export function uploadResource (data) {
  return axios.post('/api-base/attachments/save', data)
}

export function loadDetailBatchByIds (params) {
  return axios.get('/api-base/attachments/infoList', { params })
}

// -------------------------用户信息接口------------------------
export function getUserSetting () {
  return axios.get(prefix + '/advise/user/setting/getUserSetting')
}

// ------------------------版块管理相关接口---------------------
// 新增版块
export function createPlate (form) {
  return axios.post(prefix + '/advise/plate/create', form)
}

// 保存版块
export function savePlate (form) {
  return axios.post(prefix + '/advise/plate/save', form)
}

// 修改版块
export function updatePlate (form) {
  return axios.put(prefix + '/advise/plate/update', form)
}

// 查看版块详情
export function detailPlate (params) {
  return axios.get(prefix + '/advise/plate/view', { params: params })
}

// 获取所有版块列表
export function allPlate () {
  return axios.get(prefix + '/advise/plate/findAll')
}

// 获取版块管理员-列表
export function plateManagerList (params) {
  return axios.get(prefix + '/advise/plate/plateManagerList', { params: params })
}

// 判断当前用户是否拥有管理员权限
export function userManagePlate () {
  return axios.get(prefix + '/advise/plate/userManagePlate')
}

// 获得版块列表
export function getPlateList () {
  return axios.get(prefix + '/advise/plate/findAll')
}
// 版块分页
export function getPlatePage (params) {
  return axios.get(prefix + '/advise/plate/pageList', { params: params })
}

// 通过id删除帖子
export function deletePlateById (params) {
  return axios.get(prefix + '/advise/plate/delete', { params: params })
}

// --------------------------------评论相关接口-------------------------------

// 获取帖子的评论列表
export function commentList (params) {
  return axios.get(prefix + '/advise/comment/pageList', { params: params })
}

// 评论点赞
export function likeComment (params) {
  return axios.get(prefix + '/advise/comment/like', { params: params })
}
// 保存评论
export function saveComment (form) {
  return axios.post(prefix + '/advise/comment/save', form)
}

// -----------------------帖子相关接口------------------------

// 获取未发布的帖子信息
export function getNoPubArticle (id) {
  return axios.get(prefix + '/advise/article/getNoPubArticle?id=' + id)
}

// 获取用户统计数
export function getMyArticleCount () {
  return axios.get(prefix + '/advise/article/findCount')
}

// 查看
export function getArticleById (id) {
  return axios.get(prefix + '/advise/article/view?id=' + id)
}

// 新建帖子保存
export function createArticle (form) {
  return axios.post(prefix + '/advise/article', form)
}

// 修改提交数据
export function updateArticle (form) {
  return axios.put(prefix + '/advise/article', form)
}

// 热门排行榜
export function hotList (params) {
  return axios.get(prefix + '/advise/article/articleRankList', { params: params })
}

// 删除帖子
export function deleteArticle (params) {
  return axios.delete(prefix + '/advise/article', { params }
  )
}

// 收藏帖子
export function attentionArticle (params) {
  return axios.get(prefix + '/advise/article/attention', { params: params }
  )
}

// 点赞帖子
export function likeArticle (params) {
  return axios.get(prefix + '/advise/article/like', { params: params }
  )
}

// 置顶帖子
export function topArticle (params) {
  return axios.get(prefix + '/advise/article/articleTop', { params: params }
  )
}
//
export function getNoticeList (params) {
  return axios.get(prefix + '/advise/notice/pageList', { params: params })
}
// 获得帖子列表
export function getArticleList (params) {
  return axios.get(prefix + '/advise/article/pagelist', { params: params })
}
// 通过id删除帖子
export function deleteArticleById (params) {
  return axios.delete(prefix + '/advise/article/deleteById', { params: params })
}
// 将文章置顶
export function articleTop (params) {
  return axios.get(prefix + '/advise/article/articleTop', { params: params })
}

// 根据版块id获取分页帖子
export function getArticleByPlate (params) {
  return axios.get(prefix + '/advise/article/pagelist', { params: params })
}

// 转移帖子版块
export function transferPlate (params) {
  return axios.get(prefix + '/advise/article/updatePlate', { params: params })
}

// 选人接口
export function getChooseUserDataByParams (params) {
  return axios.get('/api-base/rangeScopes', { params })
}
// 选人输入
export function getSearchListByValue (params) {
  return axios.get('/api-base/rangeScopes?type=search', { params })
}

// -----------------------消息汇总相关接口------------------------
export function getMesSummary () {
  return axios.get(prefix + '/advise/message/summary/getMesSummary')
}
