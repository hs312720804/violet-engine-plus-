function removeEmptyChildren (menus) {
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
export function departmentGetList (params) {
  return this.fetch({
    url: 'sys/department/index',
    params
  }).then(data => {
    removeEmptyChildren(data)
    return data
  })
}

export function departmentUpsert (data) {
  const url = data.id ? 'sys/department/update' : 'sys/department/add'
  return this.fetch({
    method: 'post',
    url,
    isJSON: false,
    data
  })
}
export function departmentDelete (data) {
  return this.fetch({
    method: 'post',
    url: 'sys/department/delete',
    isJSON: false,
    data: {
      id: data.id
    }
  })
}