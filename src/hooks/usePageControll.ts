import { Ref, ref, reactive, defineComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Fetch from '@/services/fetch'
import consts from '@/utlis/consts'
type IdValueType = number
type DataLimit<T, VT> = Pick<T, { [K in keyof T]: T[K] extends VT ? K : never }[keyof T]>;
type IdKeyType<D, KV> = keyof DataLimit<D, KV>
interface PageControllState<Data, KV, K> {
  id?: K extends IdKeyType<Data, KV> ? KV : never
  item?: Data
  mode: RBACActionMode
  isShowList: boolean
  version: string | undefined
}

// fix: list 组件，用于定义 listRef 类型，无实际用途 by zjp at 2021/10/29
const listComponent = defineComponent({
  emits: Object.keys(consts.commonOperationEvent).map(k => consts.commonOperationEvent[k as keyof typeof consts.commonOperationEvent]),
  setup () {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      fetchData () { }
    }
  }
})
export type ListComponentType = InstanceType<typeof listComponent>
interface PageControllParams<Data, KV, K extends IdKeyType<Data, KV> = IdKeyType<Data, KV>> {
  idField?: K
  listRef: Ref<ListComponentType | undefined>
  deleteService: (data: { id: string; }, successMessage: string) => ReturnType<typeof Fetch>
}

export default function usePageControll<Data, KV = IdValueType, K extends IdKeyType<Data, KV> = IdKeyType<Data, KV>> ({ idField, listRef, deleteService }: PageControllParams<Data, KV, K>) {

  const _idField = idField || 'id' as K

  const state = reactive<PageControllState<Data, KV, K>>({
    id: undefined,
    item: undefined,
    mode: 'read',
    isShowList: true,
    version: undefined
  }) as PageControllState<Data, KV, K>

  const isShowList = ref(true)

  function handleCreate () {
    state.id = undefined
    state.mode = 'create'
    state.item = undefined
    state.isShowList = false
    isShowList.value = false
  }

  function handleEdit ({ item, selected = [] }: { item: Data; selected: Array<Data>; }) {
    item = item || selected[0]
    state.id = item[_idField]
    state.item = item
    state.mode = 'edit'
    state.isShowList = false
    isShowList.value = false
  }

  function handleRead ({ item, version }: { item: Data; version: string; }) {
    state.id = item[_idField]
    state.item = item
    state.mode = 'read'
    state.version = version
    state.isShowList = false
    isShowList.value = false
  }

  function handleRefreshList () {
    listRef?.value?.fetchData()
  }

  function handleCopy ({ item }: { item: Data; }) {
    state.id = item[_idField]
    state.item = item
    state.mode = 'copy'
    state.isShowList = false
    isShowList.value = false
  }

  function handleDelete ({ item, selected }: { item: Data; selected: Array<Data> | undefined; }) {
    selected = selected || [item]
    const id = selected.map(item => item[_idField]).join(',')
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
