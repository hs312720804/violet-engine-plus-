
import { ElMessage, ElMessageBox } from 'element-plus'
import apiFetch from '@/services/fetch'

export interface FetchDataMethods {
  (): void
}
interface ListActionsParams {
  fetchData: FetchDataMethods
  api: { delete: string; }
  selected: number
}
export default function useListActions ({ fetchData, api, selected }: ListActionsParams) {
  function batchDelete () {
    if (selected < 1) {
      return ElMessage.error('请选择数据，再删除')
    }
    ElMessageBox.confirm('确定要删除吗, 是否继续?', '提示', { type: 'warning' }).then(() => {
      apiFetch({
        method: 'post',
        url: api.delete
      })
      ElMessage.success('删除成功!')
    }).catch(() => {
      ElMessage.info('已取消删除')
      this.$emit('go-back')
    })
  }
  function rowDelete (row: { id: string; }) {

    ElMessageBox.confirm(`确定要删除 ${row.id} 吗, 是否继续?`, '提示', { type: 'warning' }).then(() => {
      ElMessage.success('删除成功!')
      // 实际应用时请用下面的代码
      // this.$sevice.fetch({
      //   method: 'post',
      //   url: this.api.delete,
      //   data: [row.id]
      // }).then(() => {
      //   ElMessage.success('删除成功!')
      // })
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }
  function handleRefresh () {
    fetchData()
  }
  return {
    batchDelete,
    rowDelete,
    handleRefresh
  }
}
