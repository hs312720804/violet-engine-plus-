import fetch from './fetch'
import wrapService from '@/utlis/wrapService'

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

export function getMenus (params) {
  return fetch({
    method: 'post',
    url: 'loginResource',
    params
  }).then(data => {
    return data
  })
}

export const getUserInfoService = wrapService<undefined, UserInfo>(async () => {
  return fetch({
    method: 'get',
    url: 'getUserInfo'
  }).then(data => {
    return data
  })
})

// export function getMenusDetail (params) {
//   return fetch({
//     method: 'get',
//     url: 'sys/menu/detail',
//     params
//   })
// }
export const getMenusDetailService = (params: any)=> {
  return fetch({
    method: 'get',
    url: 'sys/menu/detail',
    params
  })
}
/**
 * 获取站点信息
 */
export const getSiteInfo = wrapService(() => {
  return fetch({
    method: 'post',
    url: 'website/get',
    emptyToken: true
  })
})
