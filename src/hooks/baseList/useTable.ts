import { computed, h } from 'vue'
import { ElTag, ElImage } from 'element-plus'
import { useStore } from '@/store'
import { CTableRender } from '@ccprivate/admin-toolkit-plus'
import { CUtils, dayjs } from '@/utlis/common'
import { EnumOptions } from '@/services/enum'
import { MenuFields, MenuFieldType, MenuApi } from '@/services/menu'
import { ListTabLe } from './usePageDataInit'
import useTableColumn from './useTableColumn'

interface Params<T> {
  table: ListTabLe<T>
  api: MenuApi
  resource: string
  toDoActions: CToDoActionHandles<T>
  optionActions: COptionActions<T>
}
export default function useTable<T extends { [k: string]: any; }> ({ table, api, resource, toDoActions, optionActions }: Params<T>) {
  // ========================= 表格生成 =========================
  const store = useStore()
  const getEnumOptions = computed(() => store.getters.getEnumOptions) // ref(false)

  const tableHeader = computed(() => {
    {
      const header = JSON.parse(JSON.stringify(table.header)) as Array<MenuFields<T>>
      table.header.forEach((item, key) => {

        const _this = useTableColumn({ api, resource, toDoActions, optionActions })

        if (typeof item.render === 'string') {
          if (item.render) {
            // eslint-disable-next-line no-eval
            header[key].render = eval('(' + item.render + ')')  // 当前 render 函数中会调用 _this 的方法
          }
        }
        if (!('render' in item) || !item.render) {
          const renderMap: { [key in MenuFieldType]: CTableRender<T> } = {
            enum: function ({ row }) {
              // const rowEnum = _this.enums.find(ele => {
              //   return ele.enumCode === item.options
              // })
              const rowEnumArray = getEnumOptions.value(item.options) as Array<EnumOptions>
              if (!rowEnumArray || rowEnumArray.length <= 0) {
                return row[item.prop]
              }
              // const rowEnumArray = functionEvil(rowEnum.options)
              const optionsText: { [key: string]: string; } = {}
              const defaultColor = ['#409eff', '#67c23a', '#909399', '#f56c6c', '#e6a23c'] // 默认5种颜色
              let color = ''
              let borderColor = ''
              rowEnumArray.forEach((option, index) => {
                optionsText[option.value] = option.label
                let optionsValue
                if (typeof (row[item.prop]) === 'number') {
                  optionsValue = Number(option.value)
                } else {
                  optionsValue = option.value
                }
                if (row[item.prop] === optionsValue) {
                  color = option['color'] || defaultColor[index]
                  if (option['color']) {
                    const oc = option['color']
                    const rgb = oc.substr(0, oc.length - 1)
                    borderColor = rgb + ', .35)'
                  }
                }
              })
              return h(
                ElTag,
                {
                  effect: 'plain',
                  style: {
                    border: '1px solid ' + (borderColor || color || '#909399'), // 设有设置颜色用默认颜色，默认颜色用完用灰色
                    color: color || '#909399'
                  }
                },
                optionsText[row[item.prop]]
              )
            },
            image: function ({ row }) {
              return h(
                ElImage,
                {
                  src: row[item.prop],
                  fit: 'contain',
                  style: {
                    height: '50px'
                  }
                },
                ''
              )
            },
            date: function ({ row }) {
              return h(
                'span',
                {},
                dayjs(row[item.prop]).format(item.format)
              )
            },
            number: function ({ row }) {
              return h(
                'span',
                {},
                CUtils.format.fillNumber(row[item.prop], 3, ','))
            },
            string: function ({ row }) {
              return row[item.prop]
            }
          }
          header[key].render = renderMap[item.inputType]
        }
      })
      return header
    }

  })

  return {
    tableHeader
  }
}
