import fetch from './fetch'
import wrapService from '@/utlis/wrapService'

function removeEmptyChildren (menus:any) {
  menus.forEach(item => {
    if (item.children) {
      if (item.children.length === 0) {
        item.children = null
      } else {
        removeEmptyChildren(item.children)
      }
    }
  })
}

export function menuGetListService (params: undefined) {
  return fetch({
    url: 'sys/menu/index',
    params
  }).then(data => {
    removeEmptyChildren(data)
    return data
  })
}
// export const menuGetListService = wrapService<undefined, any>(params => {
//   return fetch({
//     url: 'sys/menu/index',
//     params
//   }).then(data => {
//     removeEmptyChildren(data)
//     return data
//   })
// })

// export const getUserInfoService = wrapService<undefined, UserInfo>(() => {
//   return fetch({
//     method: 'get',
//     url: 'getUserInfo'
//   }).then(data => {
//     return data
//   })
// })

// export const LoginService = wrapService<LoginArg, UserModuleState>(async data => {

//   return fetch({
//     method: 'post',
//     url: 'login',
//     data,
//     isJSON: false,
//     emptyToken: true
//   }).then(res => {
//     console.log('res==>', res)
//     store.dispatch('cacheUserInfo', res)
//     return res
//   })
// })

export function menuUpsertService (data) {
  const url = data.id
    ? 'sys/menu/update'
    : 'sys/menu/add'
  return fetch({
    method: 'post',
    url,
    isJSON: false,
    data
  })
}

// export function menuDelete (data) {
//   return fetch({
//     method: 'post',
//     url: 'sys/menu/delete',
//     isJSON: false,
//     data: {
//       id: data.id
//     }
//   })
// }

/**
 * {@linlk menuDeleteService}
 */
export interface menuDeleteArg {
  /** sh */
  id: string
}
export interface menuDeleteState {
  /** sh */
  data: string
}
/**
 *
 * @param data
 * @returns { Promise<menuDeleteState>}
 * {@link xx}
 */
export const menuDeleteService = (data: menuDeleteArg)=> {
  return fetch({
    method: 'post',
    url: 'sys/menu/delete',
    isJSON: false,
    data: {
      id: data.id
    }
  })
}

function xx (a:string|number,b:number){
  return (a as number + b)
}

console.log(xx('11',2))
export const isString = (arg: unknown): arg is string => typeof arg === 'string'

function useIt(numOrStr: number | string) {
  const aaa = isString(numOrStr)
  console.log(aaa)

  if (isString(numOrStr)) {
    console.log(numOrStr.length)
  }
}
useIt(33)
