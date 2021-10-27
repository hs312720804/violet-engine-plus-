/**
 * 删除枚举字典
 *
 * @param {*} data
 * @returns
 */
export function enumDelete (data) {
  return this.fetch({
    method: 'post',
    url: 'sys/enum/delete',
    isJSON: false,
    data: {
      enumId: data.id
    }
  })
}

/**
 * 更新枚举字典
 *
 * @param {*} data
 * @returns
 */
export function enumUpdate (data) {
  return this.fetch({
    method: 'post',
    url: 'sys/enum/update',
    isJSON: true,
    data
  })
}

/**
 * 枚举字典列表
 *
 * @param {*} params
 * @returns
 */
export function enumList (params) {
  return this.fetch({
    method: 'get',
    url: 'sys/enum/index',
    isJSON: true,
    params
  })
}

/**
 * 枚举字典详情
 *
 * @param {*} params
 * @returns
 */
export function enumDetail (params) {
  return this.fetch({
    method: 'get',
    url: 'sys/enum/detail',
    isJSON: true,
    params
  })
}
