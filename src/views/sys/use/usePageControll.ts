import { Ref, ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
type IdField = string | 'id'
type IdFieldValue = string | number | undefined;

type pageControllItem = { [key in IdField]: IdFieldValue }
interface PageControllState {
  id: IdFieldValue
  item: pageControllItem | null | undefined
  mode: RBACMode
  isShowList: boolean
  version: string | undefined
}
interface ListEl {
  fetchData: () => void
}
interface PageControllParams<R, S> {
  idField: IdField
  listRef: Ref<R extends ListEl ? ListEl : never>
  deleteService: S
}
export default function usePageControll<R, S> ({ idField = 'id', listRef, deleteService }: PageControllParams<R, S>) {


  const state = reactive<PageControllState>({
    id: undefined,
    item: null,
    mode: 'read',
    isShowList: true,
    version: undefined
  })

  const isShowList = ref(true)

  function handleCreate () {
    state.id = undefined
    state.mode = 'create'
    state.item = null
    state.isShowList = false
    isShowList.value = false
  }

  function handleEdit ({ item, selected = [] }: { item: pageControllItem; selected: Array<pageControllItem>; }) {
    item = item || selected[0]
    state.id = item[idField]
    state.item = item
    state.mode = 'edit'
    state.isShowList = false
    isShowList.value = false
  }

  function handleRead ({ item, version }: { item: pageControllItem; version: string; }) {
    state.id = item[idField]
    state.item = item
    state.mode = 'read'
    state.version = version
    state.isShowList = false
    isShowList.value = false
  }

  function handleRefreshList () {
    listRef.value.fetchData()
  }

  function handleCopy ({ item }: { item: pageControllItem; }) {
    state.id = item[idField]
    state.item = item
    state.mode = 'copy'
    state.isShowList = false
    isShowList.value = false
  }

  function handleDelete ({ item, selected }: { item: pageControllItem; selected: Array<pageControllItem> | undefined; }) {
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
    isShowList.value = true
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
    handleUpsertEnd,
    isShowList
  }
}
