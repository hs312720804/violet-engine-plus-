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
/** component 为vuejs 对象，
 *  row为表格一行对象，
 * actionsAndPermissions ={handleSendAudit: ['送审', 'moviePush:sendAudit']}
 * add by wanghaihua
 * */
function createOperationRender (component, row, actionsAndPermissions) {
  let actions = {}
  let permissions = {}
  let disabledMap = {}
  let keys = Object.keys(actionsAndPermissions)
  keys.forEach(e => {
    actions[e] = actionsAndPermissions[e][0]
    permissions[e] = actionsAndPermissions[e][1]
    disabledMap[e] = actionsAndPermissions[e][2]
  })
  // const btnsColor = {
  //   'handleEdit': 'primary',
  //   'handleSendAudit': 'success',
  //   'handleAudit': 'success',
  //   'handleUnAudit': 'danger',
  //   'handleCopy': 'warning',
  //   'handleUnpush': 'danger',
  //   'handlePush': 'success',
  //   'interceptPush': 'danger',
  //   'handleDelete': 'danger',
  //   'handleChangeStatus': 'success',
  //   'handleChangeAppStatus': 'danger',
  //   'handleChannelOpen': 'warning',
  //   'handleDicManage': 'success'
  // }
  let h = component.$createElement
  return Object.keys(actions).map(key => {
    return h(
      'el-button', {
        directives: [{
          name: 'permission',
          value: permissions[key]
        }],
        props: {
          type: 'text',
          plain: false,
          size: 'mini',
          disabled: disabledMap[key]
        },
        on: {
          click: () => {
            component[key](row)
          }
        }
      },
      actions[key]
    )
  })
  // return h(
  //   'el-button-group', {},
  //   btns
  // )
}

function changToOptions (data, name, id) {
  return data.reduce((result, current) => {
    let obj = {}
    obj['label'] = current[name]
    obj['value'] = current[id]
    result.push(obj)
    return result
  }, [])
}

function objToArrOptions (obj) {
  return Object.keys(obj).map(key => {
    return {
      label: obj[key],
      value: key
    }
  })
}

function evil (fn) {
  var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
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
export default { createOperationRender, changToOptions, objToArrOptions, evil, modeText, commonOperation, commonOperationEvent, abilityStatusText, disposalField }
