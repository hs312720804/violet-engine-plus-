import { reactive } from 'vue'
import { ElNotification } from 'element-plus'
import { ListTabLe } from './usePageDataInit'
import apiFetch from '@/services/fetch'
import { MenuApi } from '@/services/menu'


import { get } from 'lodash'


type Param<T> = {
  api: MenuApi
  listDataMap: string
  table: ListTabLe<T>
  pagination: {
    currentPage: number
    total: number
    pageSize: number
  }
}
// eslint-disable-next-line @typescript-eslint/ban-types
export default function useTableService<T> ({ api, listDataMap, table, pagination }: Param<T>) {

  const filter = reactive({})

  function fetchData () {
    const params = {
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    if (api) {
      getListData(api.list, { ...filter, ...params })
    }
  }

  function handleFilterChange (type: 'query') {
    if (type === 'query') {
      if (pagination) {
        pagination.currentPage = 1
      }
    }
    fetchData()
  }

  function handleSearch () {
    const params = {
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    getListData(api.list, { ...filter, ...params })
  }

  function handleResetSearch () {
    Object.keys(filter).forEach(key => {
      filter[key] = ''
    })
    handleSearch()
  }

  function getListData (url: MenuApi[keyof MenuApi], params: any) {
    // const filter = this.parseFilter()
    // const _this = this
    // return new Promise((resolve, reject) => {
    return apiFetch({
      method: url[1],
      url: url[0],
      params
    }).then(data => {
      const listData = (listDataMap ? get(data, listDataMap) : data) as { list: T[]; total: number; } // 获取映射数据
      if (listData.list.length < 1 && listData.total > 0) {
        pagination.currentPage = pagination.currentPage - 1
        fetchData()
      } else {
        // resolve(data.pageInfo)
        table.data = listData.list
        pagination.total = listData.total
      }
    }).catch(e => {
      ElNotification({
        type: 'error',
        title: '获取数据失败',
        message: e.message
      })
    })
    // })
  }
  return {
    filter,
    fetchData,
    handleFilterChange,
    handleSearch,
    handleResetSearch
  }
}
