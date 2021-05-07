
export function getMenus (params) {
  return this.fetch({
    method: 'post',
    url: 'loginResource',
    params
  }).then(data => {
    return data
  })
}
export async function getUserInfo () {
  return this.fetch({
    method: 'get',
    url: 'getUserInfo'
  }).then(data => {
    return data
  })
}
export function getMenusDetail (params) {
  return this.fetch({
    method: 'get',
    url: 'sys/menu/detail',
    params
  })
}
/**
 * 获取站点信息
 */
export function getSiteInfo () {
  return this.fetch({
    method: 'post',
    url: 'website/get',
    emptyToken: true
  })
}
