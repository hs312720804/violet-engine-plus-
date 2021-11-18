import fetch from './fetch'
export interface RBACUserInfo {
  id: number
  status: 'ENABLE' | 'DISABLE'
  departmentId: number
  imageUrl?: string
  name: string
  loginName: string
  phone: string
  email: string
  registerType: string
  remark: string
}
export interface RBACUserRole {
  id: number
  roleIds: Array<number>
}
interface RBACUserRoleParam { userId: number; roleIds: Array<number>; }

export function userGetList (params: CRBACApiParam) {
  return fetch({
    url: 'sys/user/index',
    params
  }).then(data => {
    const { total, list: rows } = (data as CRBACApiResData<RBACUserInfo>).pageInfo
    return {
      total,
      rows
    }
  })
}

export function userDetailService (params: { userId: number; }) {
  return fetch<RBACUserInfo>({
    method: 'get',
    url: 'sys/user/detail',
    isJSON: false,
    params
  }).then(data => {
    return data as RBACUserInfo
  })
}


export function userDelete (data: { id: string; }, successMessage?: string) {
  return fetch({
    method: 'post',
    url: 'sys/user/delete',
    isJSON: false,
    data: {
      userId: data.id
    },
    successMessage
  })
}

export function userRoleDel (res: RBACUserRoleParam, successMessage?: string) {
  const data = {
    ...res,
    roleIds: res.roleIds.join(',')
  }
  return fetch({
    method: 'post',
    url: 'sys/user/delete/userRole',
    isJSON: false,
    successMessage,
    data
  })
}

export function userRoleAdd (res: RBACUserRoleParam, successMessage?: string) {
  const data = {
    ...res,
    roleIds: res.roleIds.join(',')
  }
  return fetch({
    method: 'post',
    url: 'sys/user/update/userRole',
    data,
    isJSON: false,
    successMessage
  })
}

export function userUpsert (data: Pick<RBACUserInfo, 'id' | 'status' | 'departmentId'> & { password: string; }, successMessage?: string) {
  const url = data.id
    ? 'sys/user/update'
    : 'sys/user/add'
  return fetch({
    method: 'post',
    url,
    data,
    isJSON: false,
    successMessage
  })
}
