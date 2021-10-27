import fetch from './fetch'
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

// export function getMenusDetail (params) {
//   return fetch({
//     method: 'get',
//     url: 'sys/menu/detail',
//     params
//   })
// }
export const getMenusDetailService = (params: { id: string; }) => {
  return fetch({
    method: 'get',
    url: 'sys/menu/detail',
    params
  })
}

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
