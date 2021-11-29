
import { Ref, ref, inject } from 'vue'
import { baseIndexKey, InjectionKeyType, BaseListRow } from '@/hooks/baseList/usePageDataInit'
import { ListTabLe } from './usePageDataInit'

type SelectedIndex = { [key: string]: boolean; }

export default function useTableSelection<T extends BaseListRow> (table: ListTabLe<T>) {


  // ========================= 表格选中 =========================
  const baseIndex = inject(baseIndexKey) as InjectionKeyType<T>
  const selected = ref<Array<T>>([]) as Ref<Array<T>>

  function updateTableSelected () {
    // const table = this.table
    const newSelectedIndex = selected.value.reduce((result, item) => {
      result[item[baseIndex.primaryKey]] = true
      return result
    }, {} as SelectedIndex)
    table.selected = table.data.reduce((result, item, index) => {
      if (newSelectedIndex[item[baseIndex.primaryKey]]) {
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
      return item[baseIndex.primaryKey] !== targetItem[baseIndex.primaryKey]
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
      return e[baseIndex.primaryKey]
    })
    selected.value = selected.value.filter(e => {
      return !currentPageSelected.includes(e[baseIndex.primaryKey])
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
