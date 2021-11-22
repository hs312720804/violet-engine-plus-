export default {
  props: {
    menuId: {
      type: Number
    },
    menu: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      disabled: false,
      resourceType: undefined,
      pagination: {
        pageSize: 10,
        currentPage: 1
      },
      selected: [],
      showInfo: false,
      showList: false
    }
  },
  methods: {
    // setHeight () {
    //   const tableEl = this.$refs.table.$refs.table.$el
    //   const tableRect = tableEl.getBoundingClientRect()
    //   const height = window.innerHeight - tableRect.top - 76
    //   this.table.props = {
    //     'max-height': height,
    //     'height': height
    //   }
    //   this.$refs.table.$refs.table.doLayout()
    // },
    // listHeightChange () {
    //   const elTable = document.querySelector('.el-table') ? document.querySelector('.el-table') : ''
    //   const height = document.querySelector('.el-main').clientHeight
    //   if (!height) {
    //     this.table.props = {
    //       ...this.table.props,
    //       'max-height': this.$store.state.app.listHeight
    //     }
    //     this.tableDoLayout()
    //   } else {
    //     elTable.style.maxHeight = (height - 107) + 'px'
    //   }
    // },
    handleSizeChange (val) {
      this.pageSize = val
      this.fetchData()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.currentPage = val
      this.fetchData()
    },
    handleRowSelectionAdd (targetItem) {
      this.selected.push(targetItem)
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      this.selected = this.selected.filter(item => {
        return item.id !== targetItem.id
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange (value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.handleAllRowSelectionRemove()
      }
    },
    handleAllRowSelectionRemove () {
      const currentPageSelected = this.table.data.map(e => {
        return e.id
      })
      this.selected = this.selected.filter(e => {
        return !currentPageSelected.includes(e.id)
      })
      this.table.selected = []
    },
    updateTableSelected () {
      const table = this.table
      const newSelectedIndex = this.selected.reduce((result, item) => {
        result[item.id] = true
        return result
      }, {})
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex[item.id]) {
          result.push(index)
        }
        return result
      }, [])
    },
    clearSelected () {
      this.selected = []
      this.table.selected = []
      this.updateTableSelected()
    },
    handleFilterChange (type) {
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    parseFilter () {
      const {
        filter,
        pagination
      } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.pageSize = pagination.pageSize
      }
      return filter
    }
  },
  created () { },
  beforeMount () {
    // window.addEventListener('resize', this.setHeight)
  },
  mounted () {
    // this.setHeight()
  },
  destroyed () {
    // window.removeEventListener('resize', this.setHeight)
  },
  activated () {
  }
}
