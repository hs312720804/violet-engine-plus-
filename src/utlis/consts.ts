const modeText: { [k in RBACActionMode]: string } = {
  read: '查看',
  edit: '编辑',
  create: '新建',
  del: '删除',
  copy: '复制',
  // list: '列表'
  // ---------------
  add: '增加',
  update: '更新',
  delete: '删除',
  select: '选择',
  preview: '预览'
}

const commonOperation: { [k: string]: RBACActionMode; } = {
  CREATE: 'add',
  UPDATE: 'update',
  DELETE: 'delete',
  READ: 'read',
  LIST: 'select'
}

const commonOperationEvent: { [k in RBACActionMode]: RBACActionModeEvent } = {
  add: 'create',
  create: 'create',
  update: 'edit',
  del: 'delete',
  delete: 'delete',
  read: 'read',
  select: 'select',
  edit: 'edit',
  preview: 'preview',
  copy: 'copy'
}

const abilityStatusText = {
  ENABLE: '可用',
  DISABLE: '禁用'
}


export default { modeText, commonOperation, commonOperationEvent, abilityStatusText }
