import fetch from './fetch'
import wrapService from '@/utlis/wrapService'

export function getMenus (params) {
  return fetch({
    method: 'post',
    url: 'loginResource',
    params
  }).then(data => {
    return data
  })
}
export const getUserInfoService = wrapService(async () => {
  debugger
  // const data = await fetch({
  //   method: 'get',
  //   url: 'getUserInfo'
  // })
  // return data

  return fetch({
    method: 'get',
    url: 'getUserInfo'
  }).then(data => {
    return data
  })
})

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
