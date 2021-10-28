
import fetch from './fetch'
export interface RBACDepartment {
  id: number
  name: string
  parentId: number
  remark: string
  children?: Array<RBACDepartment> | null
}
function removeEmptyChildren (menus: Array<RBACDepartment>) {
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
export function departmentGetListService () {
  return fetch<Array<RBACDepartment>>({
    url: 'sys/department/index'
    // params
  }).then(data => {
    const res = data as Array<RBACDepartment>
    removeEmptyChildren(res)
    return res
  })
}

export function departmentUpsertService (data, successMessage?: string) {
  const url = data.id ? 'sys/department/update' : 'sys/department/add'
  return fetch({
    method: 'post',
    url,
    isJSON: false,
    data,
    successMessage
  })
}
export function departmentDeleteService (data) {
  return fetch({
    method: 'post',
    url: 'sys/department/delete',
    isJSON: false,
    data: {
      id: data.id
    }
  })
}
