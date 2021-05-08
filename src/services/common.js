import fetch from './fetch'

export function getMenus (params) {
  return fetch({
    method: 'post',
    url: 'loginResource',
    params
  }).then(data => {
    return data
  })
}
export async function getUserInfo () {
  return fetch({
    method: 'get',
    url: 'getUserInfo'
  }).then(data => {
    return data
  })
}
export function getMenusDetail (params) {
  return fetch({
    method: 'get',
    url: 'sys/menu/detail',
    params
  })
}
/**
 * 获取站点信息
 */
export function getSiteInfo () {
  return fetch({
    method: 'post',
    url: 'website/get',
    emptyToken: true
  })
}
