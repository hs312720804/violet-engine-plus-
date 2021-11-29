/**
 * Created Date: Thursday, July 8th 2021, 9:56:49 am
 * Author: 郑佳鹏
 * c-content-wrapper 分页参数生成
 * Copyright (c) 2021 Your Company
 */
import { reactive } from 'vue'

type Params = { currentPage: number; pageSize: number; }

export default function useContentPagination (options: Params = { currentPage: 10, pageSize: 1 }) {

  const { currentPage, pageSize } = options

  const pagination = reactive({
    pageSize: currentPage,
    currentPage: pageSize,
    total: 0
  })

  return {
    pagination
  }
}
