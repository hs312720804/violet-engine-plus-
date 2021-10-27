import fetch from './fetch'
export interface RBACRole {
  id: number
  name: string
}
export function roleGetList (params: CRBACApiParam) {
  return fetch({
    url: 'sys/role/index',
    params
  }).then(data => {
    const { total, list: rows } = (data as CRBACApiResData<RBACRole>).pageInfo
    return {
      total,
      rows
    }
  })
  // const result = {
  //   total: 10,
  //   rows: [{
  //     id: 1,
  //     name: '超级管理员',
  //     remark: '超级管理员',
  //     status: 1
  //   }, {
  //     id: 2,
  //     name: '开发人员',
  //     remark: '开发部门人员'
  //   }]
  // }
  // return Promise.resolve(result)
}

export function roleUpsert (data) {
  const url = data.id
    ? 'sys/role/update'
    : 'sys/role/add'
  return fetch({
    method: 'post',
    url,
    data
  })
}

export function roleAccessUpsert (data) {
  return fetch({
    method: 'post',
    url: 'sys/role/update/resource',
    isJSON: false,
    data
  })
}

export function roleMenuUpsert (data) {
  return fetch({
    method: 'post',
    url: 'sys/role/update/menu',
    isJSON: false,
    data
  })
}

export function roleDelete (data) {
  return fetch({
    method: 'post',
    url: 'sys/role/delete',
    isJSON: false,
    data: {
      roleId: data.id
    }
  })
}

export function roleUserAdd (data) {
  if (data.userIds) {
    return fetch({
      method: 'post',
      url: 'sys/role/update/user',
      isJSON: false,
      data
    })
  } else {
    return Promise.resolve()
  }
}

export function roleUserRemove (data) {
  return fetch({
    method: 'post',
    url: 'sys/role/delete/user',
    isJSON: false,
    data
  })
}
