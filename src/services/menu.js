import fetch from './fetch'
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

export function menuGetList (params) {
  return fetch({
    url: 'sys/menu/index',
    params
  }).then(data => {
    removeEmptyChildren(data)
    return data
  })
}

export function menuUpsert (data) {
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

export function menuDelete (data) {
  return fetch({
    method: 'post',
    url: 'sys/menu/delete',
    isJSON: false,
    data: {
      id: data.id
    }
  })
}
