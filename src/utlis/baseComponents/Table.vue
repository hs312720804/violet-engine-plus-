<script>
import { ElTable, ElTableColumn, ElCheckbox, ElRadio } from 'element-plus'
import TableWrapper from './TableWrapper.vue'

// elementui 的 hover-row 功能导致在数据量大的时候很卡,
// 下面通过特殊的手段禁用
const TableBody = {
  extends: ElTable.components.TableBody,
  methods: {
    getRowClass (row, rowIndex) {
      const classes = ['el-table__row']
      if (this.table.highlightCurrentRow && row === this.store.states.currentRow) {
        classes.push('current-row')
      }

      // if (rowIndex === this.store.states.hoverRow) {
      //   classes.push('hover-row');
      // }

      if (this.stripe && rowIndex % 2 === 1) {
        classes.push('el-table__row--striped')
      }
      const rowClassName = this.table.rowClassName
      if (typeof rowClassName === 'string') {
        classes.push(rowClassName)
      } else if (typeof rowClassName === 'function') {
        // eslint-disable-next-line
        classes.push(rowClassName.call(null, {
          row,
          rowIndex
        }))
      }

      if (this.store.states.expandRows.indexOf(row) > -1) {
        classes.push('expanded')
      }

      return classes
    }
  }
}
const Table = {
  extends: ElTable,
  components: {
    TableBody
  }
}
const defaultTableProps = {
  border: true,
  'highlight-current-row': false
}
export default {
  props: {
    props: {
    },
    data: {
    },
    header: {
    },
    selectionType: {
      type: String,
      default () {
        return 'none' // none, multiple, single
      }
    },
    selected: {
      type: Array,
      default () {
        return []
      }
    },
    selectOnRowClick: {
      type: Boolean,
      default () {
        return false
      }
    },
    fixSelection: {
      type: Boolean,
      default () {
        return true
      }
    },
    rowIndexDisableSelection: {
      type: Array,
      default () {
        return []
      }
    },
    useContextMenu: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      hiddenColumns: []
    }
  },
  computed: {
    selectStatus () {
      const dataCount = this.data.length
      const count = this.selected.length
      if (dataCount === 0 || count === 0) {
        return 'none'
      }
      if (dataCount === count) {
        return 'all'
      }
      return 'indeterminate'
    }
  },
  methods: {
    toggleColumn (index) {
      const hiddenColumns = this.hiddenColumns
      const idx = hiddenColumns.indexOf(index)
      if (idx === -1) {
        this.hiddenColumns.push(index)
      } else {
        this.hiddenColumns.splice(idx, 1)
      }
    },
    handleSortChange () {
      this.$emit('sort-change', ...arguments)
    },
    handleRowClick (row) {
      const index = this.data.indexOf(row)
      const disabled = this.rowIndexDisableSelection.includes(index)
      if (this.selectOnRowClick && !disabled) {
        const selectionType = this.selectionType
        let isSelected
        if (selectionType === 'multiple') {
          isSelected = this.selected.indexOf(index) > -1
          this.$emit(isSelected ? 'row-selection-remove' : 'row-selection-add', row, index)
        } else {
          this.$emit('row-selection-change', row, index)
        }
      }
      this.$emit('row-click', ...arguments)
    },
    handleRowDblClick (row) {
      // 双击选中？
      this.$emit('row-dblclick', ...arguments)
    },
    createEmitter (eventName) {
      return function proxy () {
        this.$emit(eventName, ...arguments)
      }.bind(this)
    }
  },
  render (h) {
    const fixSelection = this.fixSelection
    const rowIndexDisableSelection = this.rowIndexDisableSelection
    const useContextMenu = this.useContextMenu
    const hiddenColumns = this.hiddenColumns
    const header = this.header.reduce((result, item, index) => {
      if (hiddenColumns.indexOf(index) === -1) {
        let scopedSlots
        if (item.render) {
          scopedSlots = {
            default: props => item.render(h, props)
          }
        }
        result.push(h(ElTableColumn, {
          key: index,
          props: item,
          scopedSlots
        }))
      }
      return result
    }, [])
    const selectionType = this.selectionType
    if (selectionType !== 'none') {
      const options = {
        props: {
          width: 55,
          align: 'center'
        },
        scopedSlots: {}
      }
      if (fixSelection) {
        options.props.fixed = 'left'
      }
      if (selectionType === 'multiple') {
        options.props.renderHeader = () => {
          return h(ElCheckbox, {
            props: {
              value: this.selectStatus === 'all',
              indeterminate: this.selectStatus === 'indeterminate'
            },
            on: {
              input: () => {
                const selectStatus = this.selectStatus
                const status = selectStatus === 'all'
                this.$emit('all-row-selection-change', !status)
              }
            }
          })
        }

        options.scopedSlots.default = ({ $index: index, row }) => {
          const disabled = rowIndexDisableSelection.includes(index)
          return h(ElCheckbox, {
            props: {
              value: this.selected.indexOf(index) > -1,
              disabled
            },
            nativeOn: {
              click: event => event.stopPropagation()
            },
            on: {
              input: value => {
                if (value) {
                  this.$emit('row-selection-add', row, index)
                } else {
                  this.$emit('row-selection-remove', row, index)
                }
              }
            }
          })
        }
      }
      if (selectionType === 'single') {
        options.scopedSlots.default = ({ $index: index, row }) => {
          const disabled = rowIndexDisableSelection.includes(index)
          const selectedIndex = this.selected[0]
          return h(ElRadio, {
            class: 'hide-radio-label',
            props: {
              value: selectedIndex,
              label: index,
              disabled
            },
            nativeOn: {
              click: event => {
                if (!disabled) {
                  this.$emit('row-selection-change', row, index)
                }
                event.stopPropagation()
                event.preventDefault()
              }
            }
          })
        }
      }
      const selectionColumn = h(TableColumn, options)
      header.unshift(selectionColumn)
    }

    const elementUITableEvents = [
      'cell-mouse-enter',
      'cell-mouse-leave',
      'cell-click',
      'cell-dblclick',
      'row-click',
      'row-contextmenu',
      'header-click',
      'header-contextmenu',
      'sort-change',
      'current-change',
      'header-dragend',
      'expand-change'
    ].reduce((result, item) => {
      result[item] = this.createEmitter(item)
      return result
    }, {})
    const table = h(
      Table,
      {
        ref: 'table',
        class: 'cc-table',
        props: {
          ...defaultTableProps,
          ...this.props,
          data: this.data
        },
        directives: this.$directives,
        on: {
          ...elementUITableEvents,
          'sort-change': this.handleSortChange,
          'row-click': this.handleRowClick,
          'row-dblclick': this.handleRowDblClick
        }
      },
      header
    )
    if (!useContextMenu) {
      return table
    }

    const tableWrapper = h(TableWrapper, {
      props: {
        columns: this.header.map(item => item.label),
        hiddenColumns: this.hiddenColumns
      },
      on: {
        'toggle-column': this.toggleColumn
      }
    }, [table])
    return tableWrapper
  }
}

</script>
<style lang="stylus" scoped>
.cc-table
  >>> .hidden
    display none
.hide-radio-label >>> .el-radio__label
  display none
</style>
