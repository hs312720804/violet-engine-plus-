
import { MenuFields, MenuFieldUse } from '@/services/menu'
export { default as dayjs } from 'dayjs'
export { default as CUtils } from '@ccprivate/utils'
export function evil<T> (fn: string): T {
  const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}

export function disposalField<T> (fields: Array<MenuFields<T>>, useType: MenuFieldUse) {
  return fields.filter(item => {
    if ('use' in item && item.use.length > 0) {
      const bool = item.use.some(num => {
        return num === useType
      })
      if (bool) {
        return item
      }
    } else {
      return item
    }
  })
}
