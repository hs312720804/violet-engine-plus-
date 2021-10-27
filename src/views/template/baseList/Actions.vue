<script>
export default {
  name: 'ListActions',
  props: {
    resource: {
      type: String,
      default: ''
    },
    actions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    selectedRow () {
      return this.rows.filter((item, index) => {
        const b = this.selected.some((select, key) => {
          return select === index
        })
        if (b) {
          return item
        }
      })
    }
  },
  methods: {},
  render (createElement) {
    // let arr = ["新建:Page:Edit:add:edit","删除:Todo:batchDelete:delete","刷新:Todo:handleRefresh:select"]
    const h = createElement
    const buttons = this.actions.map((item, index) => {
      let option = item.split(':')
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
            value: `${this.resource}:${option[3]}`
          }],
          on: {
            click: () => {
              if (option[1] === 'Todo') {
                this.$emit('todo', option)
              } else {
                this.$emit('action', { option })
              }
            }
          }
        },
        option[0]
      )
      // }
    })
    return h('el-button-group', {}, buttons)
  }
}
</script>
