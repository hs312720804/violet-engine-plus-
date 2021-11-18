// eslint-disable-next-line
import { Ref, ref, watch } from 'vue'
import { CSelectionType } from '@ccprivate/admin-toolkit-plus'
type SelectedIndex = { [key: string]: boolean; }
interface IdFieldFn<T> {
  (item: T): string | number
}

interface SelectionOptions<T> { idField: keyof T | IdFieldFn<T>; type: CSelectionType; data: Ref<Array<T>>; }
export default function useSelection<T> (options: SelectionOptions<T>) {
  const { idField, type, data: tableData } = options
  const selected = ref<Array<T>>([]) as Ref<Array<T>>
  const tableSelected = ref<Array<number>>([])

  const getId = (item: T) => {
    return typeof idField === 'string'
      ? item[idField]
      : (idField as IdFieldFn<T>)(item)
  }
  const updateTableSelected = () => {
    const newSelectedIndex: SelectedIndex = selected.value.reduce((result: SelectedIndex, item) => {
      const id = getId(item) as string
      result[id] = true
      return result
    }, {})
    tableSelected.value = tableData.value.reduce((result: Array<number>, item, index) => {
      const id = getId(item) as string
      if (newSelectedIndex[id]) {
        result.push(index)
      }
      return result
    }, [])
  }
  const handleRowSelectionAdd = (targetItem: T) => {
    selected.value.push(targetItem)
    updateTableSelected()
  }
  const handleRowSelectionRemove = (targetItem: T) => {
    const targetId = getId(targetItem)
    selected.value = selected.value.filter(item => {
      const id = getId(item)
      return id !== targetId
    })
    updateTableSelected()
  }
  const handleRowSelectionChange = (item: T, index: number) => {
    selected.value = [item]
    tableSelected.value = [index]
  }
  const handleAllRowSelectionChange = (value: T) => {
    if (value) {
      tableData.value.forEach(handleRowSelectionAdd)
    } else {
      tableData.value.forEach(handleRowSelectionRemove)
    }
  }
  const clearSelected = () => {
    selected.value = []
    tableSelected.value = []
    updateTableSelected()
  }

  watch(() => tableData.value, clearSelected)

  return {
    selectionType: type,
    selected,
    tableSelected,
    updateTableSelected,
    handleRowSelectionAdd,
    handleRowSelectionRemove,
    handleRowSelectionChange,
    handleAllRowSelectionChange,
    clearSelected
  }
}
