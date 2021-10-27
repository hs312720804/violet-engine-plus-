<script lang="ts">
import { defineComponent, PropType, h } from 'vue'

export default defineComponent({
  name: 'ListActions',
  props: {
    resource: {
      type: String,
      default: ''
    },
    actions: {
      type: Array as PropType<Array<CButtonAction>>,
      default: () => {
        return []
      }
    }
  },
  emits:['todo','action'],
  setup(props,{ emit }){

    // let arr = ["新建:Page:Edit:add:edit","删除:Todo:batchDelete:delete","刷新:Todo:handleRefresh:select"]
    const buttons = props.actions.map(item => {
      let option = item.split(':') as CButtonActionList
      // if (this.access.indexOf(option[3]) > -1) {
      return h(
        'el-button',
        {
          props: {
            type: 'primary'
          },
          // 不与权限关联时不需要指令，mode的索引变成3
          directives: [{
            name: 'permission',
            value: `${props.resource}:${option[3]}`
          }],
          on: {
            click: () => {
              if (option[1] === 'Todo') {
                emit('todo', option)
              } else {
                emit('action', { option })
              }
            }
          }
        },
        option[0]
      )
      // }
    })

    return ()=>h('el-button-group', {}, buttons)
  }
  // computed: {
  //   selectedRow () {
  //     return this.rows.filter((item, index) => {
  //       const b = this.selected.some((select, key) => {
  //         return select === index
  //       })
  //       if (b) {
  //         return item
  //       }
  //     })
  //   }
  // }
})
</script>
