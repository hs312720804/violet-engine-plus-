<script>
import { ElTable as ElTable, ElTableColumn, ElCheckbox, ElRadio } from 'element-plus'
import TableWrapper from './TableWrapper.vue'
import { h } from 'vue'
// interface ObjectOf<V> {
//   [_: string]: V
// }
// class OrderItem {
//   uuid: string
//   amount: number;
//   secondaryTotal: number;
//   total: number;
//   originalTotal: number;
//   checked: boolean;
// }
// interface Table {
//   components: {
//     extends: ObjectOf<OrderItem>
//   }
// }
// const aaa:Table = {
//   components: {
//     'extends': [{ 'uuid': '12' }]
//   }
// }
// function identity<T>(arg: T): T {
//   return arg
// }

// let myIdentity: {<U>(arg: U) : U;} = identity
// console.log('111=>', myIdentity([1,2,3]))

// function loggingIdentity<T>(arg: Array<T>): number {
//   console.log(arg.length)  // Array has a .length, so no more error
//   return arg.length
// }
// let aaa = [1, 2, 3]
// console.log(toString.call(bbb))

// elementui 的 hover-row 功能导致在数据量大的时候很卡,
// 下面通过特殊的手段禁用
// const TableBody = {
//   extends: ElTable.components.TableBody,
//   methods: {
//     getRowClass (row, rowIndex) {
//       const classes = ['el-table__row']
//       if (this.table.highlightCurrentRow && row === this.store.states.currentRow) {
//         classes.push('current-row')
//       }

//       // if (rowIndex === this.store.states.hoverRow) {
//       //   classes.push('hover-row');
//       // }

//       if (this.stripe && rowIndex % 2 === 1) {
//         classes.push('el-table__row--striped')
//       }
//       const rowClassName = this.table.rowClassName
//       if (typeof rowClassName === 'string') {
//         classes.push(rowClassName)
//       } else if (typeof rowClassName === 'function') {
//         // classes.push(rowClassName.call(null, {row, rowIndex}))
//         classes.push(rowClassName(row, rowIndex))
//       }

//       if (this.store.states.expandRows.indexOf(row) > -1) {
//         classes.push('expanded')
//       }

//       return classes
//     }
//   }
// }
// const Table = {
//   extends: ElTable,
//   components: {
//     TableBody
//   }
// }
const defaultTableProps = {
  border: true,
  'highlight-current-row': false
}
export default {
  name: 'CTable',
  props: {
    props: {
      type: Object, //类型
      default: null //默认值
    },
    data: {
      type: Object, //类型
      default: null //默认值
    },
    header: {
      type: Object, //类型
      default: null //默认值
    },
    selectionType: {
      type: String,
      default () {
        return 'none' // none, multiple, single
      }
    },
    selected: {
      type: Object, //类型
      default: null //默认值
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
    createEmitter (eventName) {
      return function proxy () {
        this.$emit(eventName, ...arguments)
      }.bind(this)
    }
  },
  render () {
    // console.log('props==>', this.props)
    const fixSelection = this.fixSelection
    const rowIndexDisableSelection = this.rowIndexDisableSelection
    const useContextMenu = this.useContextMenu
    const hiddenColumns = this.hiddenColumns

    const selectionType = this.selectionType

    const elementUITableEvents = [
      'onCellMouseEnter',
      'onCellMouseLeave',
      'onCellClick',
      'onCellDblclick',
      // 'onRowClick',
      'onRowContextmenu',
      'onRowDblclick',
      'onHeaderClick',
      'onHeaderContextmenu',
      // 'onSortChange',
      'onCurrentChange',
      'onHeaderDragend',
      'onExpandChange'
    ].reduce((result, item) => {
      result[item] = this.createEmitter(item)
      // debugger
      return result
    }, {})
    let options = {}

    const getHeader = () => {
      // console.log('88888888<==header==>', this.header)
      const header = this.header.reduce((result, item, index) => {
        if (hiddenColumns.indexOf(index) === -1) {
          let slots
          if (item.render) {
            slots = {
              default: props => item.render(h, props)
            }
          }
          // console.log('result===>', index)
          // console.log('result===>', result)
          let a = h(ElTableColumn, {
            key: index,
            ...item,
            slots
          })
          // debugger
          // let a = 1
          result.push(a)
        }
        // console.log('result===>', result)
        return result
      }, [])

      // const a = this.header.reduce((re, obj, i) => {
      //   re.push(obj)
      //   return re
      // }, [])
      // console.log('a=>>>', header)
      if (selectionType !== 'none') {
        options = {
        // props: {
          width: 55,
          align: 'center',
          // },
          slots: {}
        }
        if (fixSelection) {
          options.fixed = 'left'
        }
        if (selectionType === 'multiple') {
        // options.type = 'selection'
          options.renderHeader = () => {
            return h(ElCheckbox, {
            // props: {
            // value: this.selectStatus === 'all',
              modelValue: this.selectStatus === 'all',
              'onUpdate:modelValue': value => this.$emit('update:modelValue', value),
              indeterminate: this.selectStatus === 'indeterminate',
              // },
              // on: {
              onChange: () => {
                const selectStatus = this.selectStatus
                const status = selectStatus === 'all' || selectStatus === 'indeterminate'
                this.$emit('all-row-selection-change', !status)
              }
            // }
            })
          }
          options.slots.default = ({ $index: index, row, $event }) => {
            const disabled = rowIndexDisableSelection.includes(index)
            return h(ElCheckbox, {
            // props: {
            // value: this.selected.indexOf(index) > -1,
              modelValue: this.selected.indexOf(index) > -1,
              // 'onUpdate:modelValue': value => this.$emit('update:modelValue', value),
              disabled,
              // },
              // nativeOn: {
              onClick: event => event.stopPropagation(),
              // },
              // on: {
              onChange: value => {
                if (value) {
                  this.$emit('row-selection-add', row, index)
                } else {
                  this.$emit('row-selection-remove', row, index)
                }
                $event.stopPropagation()
                $event.preventDefault()
              }
            // }
            })
          }
        }

        if (selectionType === 'single') {
          options.slots.default = ({ $index: index, row, $event }) => {
          // debugger
            const disabled = rowIndexDisableSelection.includes(index)
            return h(ElRadio, {
              class: 'hide-radio-label',
              // props: {
              modelValue: this.selected,
              'onUpdate:modelValue': value => this.$emit('update:modelValue', value),
              label: index,
              disabled,
              // },
              // nativeOn: {
              onChange: () => {
              // debugger
                if (!disabled) {
                  this.$emit('row-selection-change', row, index)
                }
                $event.stopPropagation()
                $event.preventDefault()
              }
            // }
            })
          }
        }
        const selectionColumn = h(ElTableColumn, options, options.slots)
        // debugger
        header.unshift(selectionColumn)
      }

      return header
    }

    // console.log('getHeader===>', getHeader)
    const table = h(
      ElTable,
      {
        ref: 'table',
        class: 'cc-table',
        props: {
          ...defaultTableProps
        },
        ...this.props,
        data: this.data,
        // directives: this.$directives,
        // on: {
        ...elementUITableEvents,
        'onSortChange': this.handleSortChange,
        'onRowClick':  this.handleRowClick
        // }
      },
      // header
      {
        default: getHeader
      }
    )
    // console.log('table==>', table)
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
  &:deep(.hidden)
    display none
.hide-radio-label &:deep(.el-radio__label)
  display none
</style>
