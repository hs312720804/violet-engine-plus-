/**
 * Created Date: Monday, July 12th 2021, 7:14:01 pm
 * Author: 郑佳鹏
 * 列表自定义渲染函数
 * Copyright (c) 2021 Your Company
 */
import { h } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { CTableRender } from '@ccprivate/admin-toolkit-plus'
import CellEdit from '@/components/CellEdit.vue'
import { CUtils } from '@/utlis/common'
import apiFetch from '@/services/fetch'
import { MenuApi } from '@/services/menu'

// 方法名:说明，如果用数组，索引0为下拉表单显示的名称，索引1为提示。
export const renderMap = {
  handleOperation: [
    '普通列表操作',
    '参数说明：字符数组，元素格式"名称:操作类型[Page|Dialog|Todo]:文件名(末尾去掉Page|Dialog):权限:[mode]"，如["编辑:Page:Edit:update:edit","删除:Todo:roleDelete:delete",....]'
  ],
  stringHidden: '字符串隐藏',
  cellEdit: '单元格编辑'
}

interface Params<T> {
  api: MenuApi
  resource: string
  toDoActions: CToDoActionHandles<T>
  optionActions: COptionActions<T>
}
export default function useTableColumn<T extends { [k: string]: any; }> ({ api, resource, toDoActions, optionActions }: Params<T>) {

  const { t: $t } = useI18n()
  /**
   * 操作按钮
   * @param arr
   * @returns
   */
  function handleOperation (arr: Array<CButtonAction>): CTableRender<T> {
    // 不与权限关联时用例：["编辑:Page:Edit:edit","查看:Page:Edit:read","删除:Todo:rowDelete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
    // 与权限关联时用例：["编辑:Page:Edit:update:edit","查看:Page:Edit:detail:read","删除:Todo:rowDelete:delete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
    return ({ row }) => {
      return arr.map((item, index) => {
        const option = item.split(':') as CButtonActionList
        // if (this.resourceAccess.indexOf(option[3]) > -1) { // 权限是否存在判断
        return h(
          'el-button',
          {
            props: {
              type: 'text',
              size: 'mini'
            },
            // 不与权限关联时不需要指令，mode的索引变成3
            directives: [
              {
                name: 'permission',
                value: `${resource}:${option[3]}`
              }
            ],
            on: {
              click: () => {
                if (option[1] === 'Todo') {
                  toDoActions[option[2]](row)
                  // this[option[2]](row)
                } else {
                  optionActions({ row, option })
                  // this.$emit('option', {
                  //   row,
                  //   option
                  // })
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
  /**
   * 字段信息隐藏，如隐藏电话号码中间的某几位
   * @param argment
   * @returns
   */
  function stringHidden (argment: [keyof T, number, number]): CTableRender<T> {
    return ({ row }) => {
      return h('span', {}, CUtils.format.hidden(row[argment[0]], argment[1], argment[2]))
    }
  }
  /**
   * 单元格编辑
   * @param {prop} prop
   */
  function cellEdit (prop: keyof T): CTableRender<T> {
    return ({ row }) => {
      return h(CellEdit, {
        props: {
          initValue: row[prop]
        },
        on: {
          blur: (val: T[keyof T]) => {
            const form: T = JSON.parse(JSON.stringify(row))
            form[prop] = val
            apiFetch({
              method: api.update[1],
              url: api.update[0],
              data: form
            }).then(() => {
              ElMessage.success($t('message.editSuccess'))
              row[prop] = val
            })
          }
        }
      })
    }
  }
  return {
    handleOperation,
    stringHidden,
    cellEdit
  }
}
