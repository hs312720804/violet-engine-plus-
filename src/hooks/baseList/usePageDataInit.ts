import { computed, ref, Ref, InjectionKey,reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { MenuDetail, MenuApi, MenuExtra, MenuFields } from '@/services/menu'
import { evil as functionEvil, disposalField } from '@/utlis/common'
import consts from '@/utlis/consts'
const { FieldUse } = consts
import { useStore } from '@/store'
export interface ListTabLe<T> {
  data: Array<T>
  header: Array<MenuFields<T>>
  selected: Array<number>
  props: Omit<ELTableProps<T>, 'data'>
}

export type InjectionKeyType<T = { [k: string]: any; }> = { primaryKey: Ref<string>; }
export type BaseListRow = { [key: string]: any; }
export const baseIndexKey: InjectionKey<InjectionKeyType> = Symbol('baseIndex')


export default function usePageDataInit<T> (menu: MenuDetail) {

  const { t: $t } = useI18n()
  const store = useStore()

  const api = computed(() => functionEvil<MenuApi>(menu.api))
  const extra = computed(() => functionEvil<MenuExtra>(menu.extra))
  const resource = computed(() => extra.value.resource)
  const listDataMap = computed(() => extra.value.listDataMap)
  const selectionType = computed(() => extra.value.selectionType)
  const actions = computed(() => functionEvil<Array<CButtonAction>>(extra.value.actions || '[]'))

  const table: ListTabLe<T> = reactive({
    props: {
      border: true,
      stripe: true
    },
    header: [],
    data: [],
    selected: []
  })
  const filterFields = ref<Array<MenuFields<T>>>([])
  const showList = ref(false)
  const showInfo = ref(false)


  const cListButtonText = {
    query: $t('btn.search'),
    reset: $t('btn.reset'),
    expand: $t('btn.expand'),
    packUp: $t('btn.packUp')
  }
  const cListFilterExpand = ref(false)
  function handleCListfilterExpand (msg: boolean) {
    cListFilterExpand.value = msg
  }

  function pageInit (data: MenuDetail) {
    // let params = {
    //   pageNo: pagination.currentPage,
    //   pageSize: pagination.pageSize
    // }
    if (data.fields) {
      const fields = functionEvil<Array<MenuFields<T>>>(data.fields)

      const getEnumOptions = store.getters.getEnumOptions
      filterFields.value = disposalField(fields, FieldUse.filter).map(item => {
        if (item.inputType === 'enum') {  // 针对enum类型的表单项，需要拿到相应枚举字典的数据
          item.options = getEnumOptions(item.options)
        }
        return {
          ...item
        }
      })

      table.header = disposalField(fields, FieldUse.list)
      if (data.template !== 'CardList' ) {
        table.header.length > 0 ? showList.value = true : showInfo.value = true
      } else {
        showList.value = true
      }
      // this.getListData(this.api.list, params)
    }
    // if (data.extra) {
    //   const extra = this.$constants.evil(data.extra)
    //   this.actions = 'actions' in extra ? this.$constants.evil(extra.actions) : []
    // }
  }

  pageInit(menu)

  return {
    api,
    resource,
    listDataMap,
    selectionType,
    actions,
    table,
    filterFields,
    showList,
    showInfo,
    cListButtonText,
    cListFilterExpand,
    handleCListfilterExpand
  }
}
