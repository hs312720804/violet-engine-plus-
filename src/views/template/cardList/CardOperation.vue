<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // 不与权限关联时用例：["编辑:Page:Edit:edit","查看:Page:Edit:read","删除:Todo:rowDelete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
  // 与权限关联时用例：["编辑:Page:Edit:update:edit","查看:Page:Edit:detail:read","删除:Todo:rowDelete:delete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
  name: 'CardOperation',
  props: {
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    actions: { // ['显示文本:类型(页面page,确认Confirm，弹窗编辑]):Template/Function:Access:[argument]']
      type: Array,
      default: () => {
        return []
      }
    },
    resource: {
      type: String,
      default: ''
    },
    header: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['todo', 'option'],
  render () {
    console.log('header====', this.header)
    return this.header.map(item => {
      return item.render(this.row)
    })
    // const _this = useTableColumn({ this.resource, this.actions, optionActions })

    // const _this = this
    // const buttonList = this.actions.map((item: any, index) => {
    //   let option = item.split(':')
    //   // if (this.resourceAccess.indexOf(option[3]) > -1) { // 权限是否存在判断
    //   return h(
    //     ElButton,
    //     {
    //       props: {
    //         type: 'text',
    //         size: 'mini'
    //       },
    //       // 不与权限关联时不需要指令，mode的索引变成3
    //       directives: [{
    //         name: 'permission',
    //         value: `${_this.resource}:${option[3]}`
    //       }],
    //       on: {
    //         click: () => {
    //           if (option[1] === 'Todo') {
    //             _this.$emit('todo', { row: _this.row, option })
    //           } else {
    //             _this.$emit('option', { row: _this.row, option })
    //           }
    //         }
    //       }
    //     },
    //     option[0]
    //   )
    // // }
    // })
    // return h('div',
    //   {
    //     class: {
    //     }
    //   },
    //   buttonList)
  }
})
</script>
