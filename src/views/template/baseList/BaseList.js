export default {
  inject: ['baseIndex'],
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
      pagination: {
        pageSize: 10,
        currentPage: 1
      },
      selected: [],
      showInfo: false,
      showList: false
    }
  },
  computed: {
    primaryKey () {
      return this.baseIndex.primaryKey
    },
    tableHeader () {
      let header = JSON.parse(JSON.stringify(this.table.header))
      this.table.header.forEach((item, key) => {
        const _this = this
        if (typeof item.render === 'string') {
          if (item.render) {
            // eslint-disable-next-line no-eval
            header[key].render = eval('(' + item.render + ')')
          }
        }
        if (!('render' in item) || !item.render) {
          const renderMap = {
            enum: function (h, { row }) {
              let options = {}
              const tagType = ['', 'success', 'info', 'warning', 'danger', 'danger', 'warning', 'success', 'info']
              let type = ''
              item.options.forEach((option, index) => {
                options[option.value] = option.label
                let optionsValue
                if (typeof (row[item.prop]) === 'number') {
                  optionsValue = Number(option.value)
                } else {
                  optionsValue = option.value
                }
                if (row[item.prop] === optionsValue) {
                  type = tagType[index]
                }
              })
              return h(
                'el-tag',
                {
                  attrs: {
                    type: type
                  }
                },
                options[row[item.prop]]
              )
            },
            image: function (h, { row }) {
              return h(
                'el-image',
                {
                  attrs: {
                    src: row[item.prop],
                    fit: 'contain'
                  },
                  style: {
                    height: '50px'
                  }
                },
                ''
              )
            },
            date: function (h, { row }) {
              return h(
                'span',
                {},
                _this.$moment(row[item.prop]).format(item.format)
              )
            },
            number: function (h, { row }) {
              return h(
                'span',
                {},
                _this.$cUtils.format.fillNumber(row[item.prop], 3, ','))
            }
          }
          header[key].render = renderMap[item.inputType]
        }
      })
      return header
    },
    api () {
      return this.$constants.evil(this.menu.api)
    },
    resource () { // 权限资源
      return this.$constants.evil(this.menu.extra).resource
    },
    listDataMap () { // 列表数据映射
      return this.$constants.evil(this.menu.extra).listDataMap
    },
    selectionType () {
      return this.$constants.evil(this.menu.extra).selectionType
    }
  },
  methods: {
    selectChange () {
      this.disabled = true
      this.$nextTick(() => {
        this.disabled = false
      })
    },
    setHeight () {
      const tableEl = this.$refs.table.$refs.table.$el
      const tableRect = tableEl.getBoundingClientRect()
      const height = window.innerHeight - tableRect.top - 76
      this.table.props = {
        'max-height': height,
        'height': height
      }
      this.$refs.table.$refs.table.doLayout()
    },
    listHeightChange () {
      const elTable = document.querySelector('.el-table') ? document.querySelector('.el-table') : ''
      const height = document.querySelector('.el-main').clientHeight
      if (!height) {
        this.table.props = {
          ...this.table.props,
          'max-height': this.$store.state.app.listHeight
        }
        this.tableDoLayout()
      } else {
        elTable.style.maxHeight = (height - 107) + 'px'
      }
    },
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
        return item[this.primaryKey] !== targetItem[this.primaryKey]
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
        return e[this.primaryKey]
      })
      this.selected = this.selected.filter(e => {
        return !currentPageSelected.includes(e[this.primaryKey])
      })
      this.table.selected = []
    },
    updateTableSelected () {
      const table = this.table
      const newSelectedIndex = this.selected.reduce((result, item) => {
        result[item[this.primaryKey]] = true
        return result
      }, {})
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex[item[this.primaryKey]]) {
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
  created () {
    document.onkeypress = e => {
      this.disabled = false
      if (e.keyCode === 13) {
        if (typeof (this.fetchData) !== 'undefined') {
          this.fetchData()
        }
      }
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.setHeight)
  },
  mounted () {
    this.setHeight()
  },
  destroyed () {
    window.removeEventListener('resize', this.setHeight)
  },
  activated () {
    this.listHeightChange()
  }
}
