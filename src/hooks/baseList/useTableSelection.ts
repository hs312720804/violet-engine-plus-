
import { Ref, ref, inject } from 'vue'
import { baseIndexKey, InjectionKeyType, BaseListRow } from '@/hooks/baseList/usePageDataInit'
import { ListTabLe } from './usePageDataInit'

type SelectedIndex = { [key: string]: boolean; }

export default function useTableSelection<T extends BaseListRow> (table: ListTabLe<T>) {


  // ========================= 表格选中 =========================
  const baseIndex = inject(baseIndexKey) as InjectionKeyType<T>
  const primaryKey = baseIndex.primaryKey.value
  const selected = ref<Array<T>>([]) as Ref<Array<T>>

  function updateTableSelected () {
    // const table = this.table
    const newSelectedIndex = selected.value.reduce((result, item) => {
      result[item[primaryKey]] = true
      return result
    }, {} as SelectedIndex)
    table.selected = table.data.reduce((result, item, index) => {
      if (newSelectedIndex[item[primaryKey]]) {
        result.push(index)
      }
      return result
    }, [] as number[])
  }

  function handleRowSelectionAdd (targetItem: T) {
    selected.value.push(targetItem)
    updateTableSelected()
  }


  function handleRowSelectionRemove (targetItem: T) {
    selected.value = selected.value.filter(item => {
      return item[primaryKey] !== targetItem[primaryKey]
    })
    updateTableSelected()
  }

  function handleAllRowSelectionChange (value: boolean) {
    if (value) {
      table.data.forEach(handleRowSelectionAdd)
    } else {
      handleAllRowSelectionRemove()
    }
  }

  function handleAllRowSelectionRemove () {
    const currentPageSelected = table.data.map(e => {
      return e[primaryKey]
    })
    selected.value = selected.value.filter(e => {
      return !currentPageSelected.includes(e[primaryKey])
    })
    table.selected = []
  }

  // function clearSelected () {
  //   selected.value = []
  //   table.selected = []
  //   updateTableSelected()
  // }
  // watch(() => table.data, clearSelected)
  return {
    selected,
    handleRowSelectionAdd,
    handleRowSelectionRemove,
    handleAllRowSelectionChange
  }
}
