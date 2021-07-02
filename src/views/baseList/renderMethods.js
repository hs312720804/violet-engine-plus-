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
function stringHidden (prop, frontLen, endLen) {
  return (h, { row }) => {
    return h(
      'span',
      {},
      this.$cUtils.format.hidden(row[prop], frontLen, endLen)
    )
  }
}
const renderMethods = {
  handleOperation,
  stringHidden
}
// 方法名:说明
const renderMap = {
  handleOperation: '普通列表操作',
  stringHidden: '字符串隐藏'
}
export { renderMethods, renderMap }
