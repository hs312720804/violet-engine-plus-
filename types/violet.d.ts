type CActionName = string
// type ActionType = 'Page' | 'Todo'
type CActionTemplate = 'Edit'
type CActionHandle = 'batchDelete'
type CActionPermission = 'add'
type CActionMode = 'add' | 'delete' | 'preview' | 'edit' | 'select'
type RBACMode = 'read' | 'create' | 'edit' | 'copy' | 'list'

type CButtonActionList =
  [CActionName, 'Page', CActionTemplate, CActionPermission, CActionMode] |
  [CActionName, 'Todo', CActionHandle, CActionPermission, CActionMode]

// ["新建:Page:Edit:add:edit","删除:Todo:batchDelete:delete","刷新:Todo:handleRefresh:select"]
type CButtonAction =
  `${CButtonActionList[0]}:${CButtonActionList[1]}:${CButtonActionList[2]}` |
  `${CButtonActionList[0]}:${CButtonActionList[1]}:${CButtonActionList[2]}:${CButtonActionList[3]}` |
  `${CButtonActionList[0]}:${CButtonActionList[1]}:${CButtonActionList[2]}:${CButtonActionList[3]}:${CButtonActionList[4]}`

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
