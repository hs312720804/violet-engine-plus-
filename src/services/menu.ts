import fetch from './fetch'

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
