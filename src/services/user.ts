import fetch from './fetch'
export interface RBACUserInfo {
  id: number
  status: 'ENABLE' | 'DISENABLE'
  departmentId: number
  imageUrl?: string
  name: string
  loginName: string
  phone: string
  email: string
}
export interface RBACUser {
  id: number
  roleIds: Array<number>
}
interface RBACUserRoleParam { userId: number; roleIds: Array<number>; }

export function userGetList (params: CRBACApiParam) {
  return fetch({
    url: 'sys/user/index',
    params
  }).then(data => {
    const { total, list: rows } = (data as CRBACApiResData<RBACUser>).pageInfo
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


export function userDelete (data) {
  return fetch({
    method: 'post',
    url: 'sys/user/delete',
    isJSON: false,
    data: {
      userId: data.id
    }
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
    isJSON: false,
    successMessage,
    data
  })
}

export function userUpsert (data: Pick<RBACUserInfo, 'id' | 'status' | 'departmentId'> & { password: string; }) {
  const url = data.id
    ? 'sys/user/update'
    : 'sys/user/add'
  return fetch({
    method: 'post',
    isJSON: false,
    url,
    data
  })
}
