import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default function usePageControll ({ idField = 'id', listRef, deleteService }) {
  const state = reactive({
    id: undefined,
    item: null,
    mode: 'read',
    isShowList: true
  })

  function handleCreate () {
    state.id = undefined
    state.mode = 'create'
    state.item = null
    state.isShowList = false
  }

  function handleEdit ({ item, selected = [] }) {
    item = item || selected[0]
    state.id = item[idField]
    state.item = item
    state.mode = 'edit'
    state.isShowList = false
  }

  function handleRead ({ item, version }) {
    state.id = item[idField]
    state.item = item
    state.mode = 'read'
    state.version = version
    state.isShowList = false
  }

  function handleRefreshList () {
    listRef.value.fetchData()
  }

  function handleCopy ({ item }) {
    state.id = item[idField]
    state.item = item
    state.mode = 'copy'
    state.isShowList = false
  }

  function handleDelete ({ item, selected }) {
    selected = selected || [item]
    const id = selected.map(item => item[idField]).join(',')
    ElMessageBox.confirm('此操作将删除该数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteService({ id }, '删除成功').then(() => {
        listRef.value.fetchData()
      })
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
  }
  function handleGoBack () {
    state.isShowList = true
    state.mode = 'list'
    state.version = undefined
  }

  function handleUpsertEnd () {
    handleRefreshList()
    handleGoBack()
  }

  return {
    state,
    handleCreate,
    handleEdit,
    handleRead,
    handleCopy,
    handleDelete,
    handleRefreshList,
    handleGoBack,
    handleUpsertEnd
  }
}
