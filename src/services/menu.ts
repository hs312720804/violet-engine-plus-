import MenuDetail from '@/views/sys/rbac/menu/MenuDetail.vue'
import fetch from './fetch'

export interface MenuExtra {
  actions: string // Array<CButtonAction>
  listDataMap: string
  resource: string
}

export interface MenuFields {
  inputType: 'operate' | ''
  label: string
  options: string
  prop: string
  queryExclude: boolean
  render: string
  use: Array<number>
  width: string
  primaryKey: 1 | 0
}
export interface MenuDetail {
  /**
   * JSON.stringify(MenuExtra)
   */
  extra: string
  /**
   * JSON.stringify(MenuFields<T>)
   */
  fields: string
}

export const getMenusDetailService = (params: { id: string | number; }) => {
  return fetch<MenuDetail>({
    method: 'get',
    url: 'sys/menu/detail',
    params
  }).then(res => {
    return res as MenuDetail
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
 */
export const menuDeleteService = (data: { id: string; }) => {
  return fetch({
    method: 'post',
    url: 'sys/menu/delete',
    isJSON: false,
    data: {
      id: data.id
    }
  })
}
