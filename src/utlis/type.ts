/**
 * 判断是否为纯对象
 */
export function isObject (value: any) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

