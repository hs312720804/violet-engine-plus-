// eslint-disable-next-line
import { ref, reactive, watch } from 'vue'

export default function useSelection (options) {
  const { idField, type, data: tableData } = options
  const selected = ref([])
  const tableSelected = ref([])

  const getId = item => {
    return typeof idField === 'string'
      ? item[idField]
      : idField(item)
  }
  const updateTableSelected = () => {
    const newSelectedIndex = selected.value.reduce((result, item) => {
      const id = getId(item)
      result[id] = true
      return result
    }, {})
    tableSelected.value = tableData.value.reduce((result, item, index) => {
      const id = getId(item)
      if (newSelectedIndex[id]) {
        result.push(index)
      }
      return result
    }, [])
  }
  const handleRowSelectionAdd = targetItem => {
    selected.value.push(targetItem)
    updateTableSelected()
  }
  const handleRowSelectionRemove = targetItem => {
    const targetId = getId(targetItem)
    selected.value = selected.value.filter(item => {
      const id = getId(item)
      return id !== targetId
    })
    updateTableSelected()
  }
  const handleRowSelectionChange = (item, index) => {
    selected.value = [item]
    tableSelected.value = [index]
  }
  const handleAllRowSelectionChange = value => {
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
