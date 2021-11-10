import { Ref, UnwrapRef, ref, reactive, defineComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Fetch from '@/services/fetch'

type IdField = 'id' | 'customId'  // 不同数据的主键
type IdFieldValue = number | undefined;
type pageControllItem = { [key in IdField]?: IdFieldValue }
interface PageControllState<Data extends pageControllItem> {
  id: IdFieldValue
  item: Data | undefined
  mode: RBACMode
  isShowList: boolean
  version: string | undefined
}
// fix: list 组件，用于定义 listRef 类型，无实际用途 by zjp at 2021/10/29
const listComponent = defineComponent({
  setup () {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      fetchData () { }
    }
  }
})
export type ListComponentType = InstanceType<typeof listComponent>
interface PageControllParams {
  idField: IdField
  listRef: Ref<ListComponentType | undefined>
  deleteService: (data: { id: string; }, successMessage: string) => ReturnType<typeof Fetch>
}


export default function usePageControll<Data extends pageControllItem> ({ idField = 'id', listRef, deleteService }: PageControllParams) {

  const state = reactive<PageControllState<Data>>({
    id: undefined,
    item: undefined,
    mode: 'read',
    isShowList: true,
    version: undefined
  })
  console.log('state', state)

  const isShowList = ref(true)

  function handleCreate () {
    state.id = undefined
    state.mode = 'create'
    state.item = undefined
    state.isShowList = false
    isShowList.value = false
  }

  function handleEdit ({ item, selected = [] }: { item: UnwrapRef<Data>; selected: Array<Data>; }) {
    console.log('handleEdit', state.item, item)
    item = item || selected[0]
    state.id = item[idField]
    state.item = item
    state.mode = 'edit'
    state.isShowList = false
    isShowList.value = false
  }

  function handleRead ({ item, version }: { item: UnwrapRef<Data>; version: string; }) {
    state.id = item[idField]
    state.item = item
    state.mode = 'read'
    state.version = version
    state.isShowList = false
    isShowList.value = false
  }

  function handleRefreshList () {
    listRef?.value?.fetchData()
  }

  function handleCopy ({ item }: { item: UnwrapRef<Data>; }) {
    state.id = item[idField]
    state.item = item
    state.mode = 'copy'
    state.isShowList = false
    isShowList.value = false
  }

  function handleDelete ({ item, selected }: { item: Data; selected: Array<Data> | undefined; }) {
    selected = selected || [item]
    const id = selected.map(item => item[idField]).join(',')
    ElMessageBox.confirm('此操作将删除该数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteService({ id }, '删除成功').then(() => {
        listRef?.value?.fetchData()
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
    handleGoBack()
    handleRefreshList()
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
