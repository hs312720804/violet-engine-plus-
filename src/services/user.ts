import fetch from './fetch'
export function userGetList (params) {
  return fetch({
    url: 'sys/user/index',
    params
  }).then(data => {
    const { total, list: rows } = data.pageInfo
    return {
      total,
      rows
    }
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

export function userRoleDel (data) {
  data.roleIds = data.roleIds.join(',')
  return fetch({
    method: 'post',
    url: 'sys/user/delete/userRole',
    isJSON: false,
    data
  })
}

export function userRoleAdd (data) {
  data.roleIds = data.roleIds.join(',')
  return fetch({
    method: 'post',
    url: 'sys/user/update/userRole',
    isJSON: false,
    data
  })
}

export function userUpsert (data) {
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
export const websiteUpdateService = (data: websiteUpdateState)=> {
  return fetch({
    method: 'post',
    url: 'website/update',
    data
  })
}
