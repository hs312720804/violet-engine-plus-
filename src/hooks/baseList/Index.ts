import { ref } from 'vue'
import { evil as functionEvil } from '@/utlis/common'
import { BaseListRow } from '@/hooks/baseList/usePageDataInit'
import { MenuDetail, MenuFields, getMenusDetailService } from '@/services/menu'


export default function initBaseListTemplate<T> (listEL:T) {
  // 初始化
  const menuDetail = ref<MenuDetail>()
  const primaryKey = ref('')
  const optionType = ref<CActionTemplateType>() // 模板类型，弹窗Or详情
  const template = ref<CActionTemplate>('') // 模板路径
  const title = ref<CActionName>('')
  const mode = ref<CActionMode>('create')
  const row = ref<BaseListRow>()
  // const selected = ref<Array<BaseListRow>>([])
  const id = ref()
  const isShowList = ref(true)
  const dialogVisible = ref(false)
  const dialogChang = ref(false) // 弹窗数据改动后是否有保存，如果已保存设置为true, 关闭弹窗后重新加载页面。


  function fetchMenuData (id: number) {
    getMenusDetailService({ id }).then(data => {
      menuDetail.value = data
      const fields = functionEvil<Array<MenuFields<BaseListRow>>>(menuDetail.value.fields)
      const primaryField = fields.filter(field => {
        return 'primaryKey' in field && field.primaryKey === 1
      })
      primaryKey.value = primaryField.length > 0 ? (primaryField[0].prop as string) : 'id'
    })
  }

  function handleUpsertEnd () {
    isShowList.value = true
    mode.value = 'list'
    listEL.value?.fetchData()
  }

  const handleOption: COptionActions<BaseListRow> = function (data) {
    console.log(data)
    template.value = data.option[2] as CActionTemplate
    title.value = data.option[0]
    mode.value = data.option[4]
    if (data.row) {
      row.value = data.row
      id.value = data.row[primaryKey.value]
    }
    // if (data.selected) {
    //   selected.value = data.selected
    // }
    optionType.value = data.option[1] as CActionTemplateType
    if (data.option[1] === 'Page') {
      isShowList.value = false
    }
    if (data.option[1] === 'Dialog') {
      dialogVisible.value = true
    }
  }

  function goBack () {
    isShowList.value = true
    mode.value = 'list'
    optionType.value = ''
    id.value = undefined
  }

  function hiddenDialog (val?: 'ok') {
    mode.value = 'list'
    optionType.value = ''
    id.value = undefined
    dialogVisible.value = false
    if (val === 'ok' || dialogChang.value) {
      listEL.value?.fetchData()
    }
    if (dialogChang.value) {
      dialogChang.value = false
    }
  }

  function handleDialogChange (msg: boolean) {
    dialogChang.value = msg
  }

  return {
    menuDetail,
    primaryKey, // 主键
    template,
    title,
    mode,
    optionType,
    id,
    row,
    // selected,
    isShowList,
    dialogVisible,
    handleUpsertEnd,
    handleOption,
    goBack,
    handleDialogChange,
    hiddenDialog,
    fetchMenuData
  }
}

