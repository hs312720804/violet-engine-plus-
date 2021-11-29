type CActionName = string
type CActionTemplateType = 'Page' | 'Dialog' | ''
type CActionHandleType = 'Todo'
type CActionType = CActionTemplateType | CActionHandleType
type CActionTemplate = 'Edit' | ''
type CActionTemplateTrueName = `${CActionTemplate}${CActionTemplateType}`
type CActionHandle = 'batchDelete'
type CActionPermission = 'add'
type CActionMode = 'read' | 'create' | 'edit' | 'copy' | 'list'

// ["新建","Page","Edit","add","edit"]
type CButtonActionList =
  [CActionName, CActionTemplateType, CActionTemplate, CActionPermission, CActionMode] |
  [CActionName, CActionHandleType, CActionHandle, CActionPermission, CActionMode]

// ["新建:Page:Edit:add:edit","删除:Todo:batchDelete:delete","刷新:Todo:handleRefresh:select"]
type CButtonAction =
  `${CButtonActionList[0]}:${CButtonActionList[1]}:${CButtonActionList[2]}` |
  `${CButtonActionList[0]}:${CButtonActionList[1]}:${CButtonActionList[2]}:${CButtonActionList[3]}` |
  `${CButtonActionList[0]}:${CButtonActionList[1]}:${CButtonActionList[2]}:${CButtonActionList[3]}:${CButtonActionList[4]}`


type RBACActionMode = 'add' | 'update' | 'delete' | 'del' | 'read' | 'select' | 'edit' | 'preview' | 'copy' | 'create'
type RBACActionModeEvent = 'create' | 'edit' | 'delete' | 'read' | 'select' | 'edit' | 'preview' | 'copy'
type CRBACButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
interface CRBACButtonAction {
  label: string
  value: string
  type?: CRBACButtonType
}

interface CRBACApiParam {
  pageNo: number
  pageSize: number
  sign?: string
}
interface CRBACApiResData<T> {
  pageInfo: {
    total: number
    list: Array<T>
  }
}

interface COptions {
  label: string
  value: string
  disabled: CRBACButtonType
}
