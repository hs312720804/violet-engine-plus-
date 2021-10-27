const modeText = {
  read: '查看',
  edit: '编辑',
  create: '新建',
  del: '删除'
}

const commonOperation = {
  CREATE: 'add',
  UPDATE: 'update',
  DELETE: 'delete',
  READ: 'read',
  LIST: 'select'
}

const commonOperationEvent = {
  add: 'create',
  update: 'edit',
  delete: 'delete',
  read: 'read'
}

const abilityStatusText = {
  ENABLE: '可用',
  DISABLE: '禁用'
}

function evil (fn: string) {
  const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}
function disposalField (fields, useType) {
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
export default { evil, modeText, commonOperation, commonOperationEvent, abilityStatusText, disposalField }