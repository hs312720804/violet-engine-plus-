import fetch from './fetch'

export interface EnumOptions {
  label: string
  value: string
  color: string
}
export interface AppEnum {
  id: number
  enumCode: string
  options: string // JSON.stringify(Array<EnumOptions>)
}

/**
 * 删除枚举字典
 *
 * @param {*} data
 * @returns
 */
export function enumDelete (data: Pick<AppEnum, 'id'>) {
  return fetch({
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
export function enumUpdate (data: Pick<AppEnum, 'id' | 'options'>) {
  return fetch({
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
export function enumList (params: { pageNo: number; pageSize: number; }) {
  return fetch({
    method: 'get',
    url: 'sys/enum/index',
    isJSON: true,
    params
  }).then(res => {
    return res as { list: Array<AppEnum>; }
  })
}

/**
 * 枚举字典详情
 *
 * @param {*} params
 * @returns
 */
export function enumDetail (params: Pick<AppEnum, 'id'>) {
  return fetch({
    method: 'get',
    url: 'sys/enum/detail',
    isJSON: true,
    params
  })
}
