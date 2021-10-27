import { AppSite } from '@/store/modules/app'
import fetch from './fetch'

export interface Menu {
  id: number
  icon: string
  type: string
  name: string
  alias: string
  path: string
  template: string
  children: Array<Menu>
}
interface UserInfo {
  resourceOperations: Array<string>
  menus: Array<Menu>
}

// export function getMenus (params) {
//   return fetch({
//     method: 'post',
//     url: 'loginResource',
//     params
//   }).then(data => {
//     return data
//   })
// }

export function getUserInfoService () {
  return fetch<UserInfo>({
    method: 'get',
    url: 'getUserInfo'
  }).then(data => {
    return data as UserInfo
  })
}


/**
 * 获取站点信息
 */
export function getSiteInfo () {
  return fetch<AppSite>({
    method: 'post',
    url: 'website/get',
    emptyToken: true
  })
}

export interface websiteUpdateState {
  copyright: ''
  extra: ''
  id: 0
  introduction: ''
  layout: ''
  logo: ''
  recordNum: ''
  siteName: ''
}
export const websiteUpdateService = (data: websiteUpdateState) => {
  return fetch({
    method: 'post',
    url: 'website/update',
    data
  })
}
