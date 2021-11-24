import CellEdit from '@/components/CellEdit.vue'
function handleOperation (arr) {
  // 不与权限关联时用例：["编辑:Page:Edit:edit","查看:Page:Edit:read","删除:Todo:rowDelete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
  // 与权限关联时用例：["编辑:Page:Edit:update:edit","查看:Page:Edit:detail:read","删除:Todo:rowDelete:delete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
  return (h, { row }) => {
    return arr.map((item, index) => {
      let option = item.split(':')
      // if (this.resourceAccess.indexOf(option[3]) > -1) { // 权限是否存在判断
      return h(
        'el-button', {
          props: {
            type: 'text',
            size: 'mini'
          },
          // 不与权限关联时不需要指令，mode的索引变成3
          directives: [{
            name: 'permission',
            value: `${this.resource}:${option[3]}`
          }],
          on: {
            click: () => {
              if (option[1] === 'Todo') {
                this[option[2]](row)
              } else {
                this.$emit('option', {
                  row,
                  option
                })
              }
            }
          }
        },
        option[0]
      )
      // }
    })
  }
}
function stringHidden (argment) {
  return (h, { row }) => {
    return h(
      'span',
      {},
      this.$cUtils.format.hidden(row[argment[0]], argment[1], argment[2])
    )
  }
}
/**
 * 单元格编辑
 * @param {prop} prop
 */
function cellEdit (prop) {
  return (h, { row }) => {
    return h(
      CellEdit,
      {
        props: {
          initValue: row[prop]
        },
        on: {
          blur: val => {
            let form = JSON.parse(JSON.stringify(row))
            form[prop] = val
            this.$service.fetch({
              method: this.api.update[1],
              url: this.api.update[0],
              data: form
            })
              .then(() => {
                this.$message.success(this.$t('message.editSuccess'))
                row[prop] = val
              })
          }
        }
      }

    )
  }
}
const renderMethods = {
  handleOperation,
  stringHidden,
  cellEdit
}
// 方法名:说明，如果用数组，索引0为下拉表单显示的名称，索引1为提示。
const renderMap = {
  handleOperation: ['普通列表操作', '参数说明：字符数组，元素格式"名称:操作类型[Page|Dialog|Todo]:文件名(末尾去掉Page|Dialog):权限:[mode]"，如["编辑:Page:Edit:update:edit","删除:Todo:roleDelete:delete",....]'],
  stringHidden: '字符串隐藏',
  cellEdit: '单元格编辑'
}
export { renderMethods, renderMap }
