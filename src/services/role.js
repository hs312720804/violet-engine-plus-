
export function roleGetList (params) {
  return this.fetch({
    url: 'sys/role/index',
    params
  }).then(data => {
    const { total, list: rows } = data.pageInfo
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
  return this.fetch({
    method: 'post',
    url,
    data
  })
}

export function roleAccessUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'sys/role/update/resource',
    isJSON: false,
    data
  })
}

export function roleMenuUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'sys/role/update/menu',
    isJSON: false,
    data
  })
}

export function roleDelete (data) {
  return this.fetch({
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
    return this.fetch({
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
  return this.fetch({
    method: 'post',
    url: 'sys/role/delete/user',
    isJSON: false,
    data
  })
}