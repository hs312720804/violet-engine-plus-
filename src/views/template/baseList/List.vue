<template>
  <c-card ref="contentCard" class="content">
    <div v-show="showInfo">{{ $t('message.pageConfiguration') }}</div>
    <c-content-wrapper
      v-show="showList"
      :pagination="pagination"
      @filter-change="handleFilterChange"
    >
      <div class="list-option clearfix">
        <div class="action-list">
          <Actions
            :selected="table.selected"
            :actions="actions"
            :rows="table.data"
            :resource="resource"
            @action="optionActions"
            @todo="todoactions"
          ></Actions>
        </div>
        <template v-if="filterFields.length > 0">
          <c-list-filter
            v-if="!cListFilterExpand"
            ref="expandForm"
            :options="filterFields"
            :length="3"
            :form-data="filter"
            :is-expand="cListFilterExpand"
            :button-text="cListButtonText"
            :hidden-expand-button="filterFields.length <= 3"
            @filter="handleSearch"
            @reset="handleResetSearch"
            @filter-expand="handleCListfilterExpand"
          ></c-list-filter>
        </template>
      </div>
      <div class="filter-expand">
        <c-list-filter
          v-if="cListFilterExpand"
          ref="expandForm"
          :options="filterFields"
          :form-data="filter"
          :is-expand="cListFilterExpand"
          :button-text="cListButtonText"
          @filter="handleSearch"
          @reset="handleResetSearch"
          @filter-expand="handleCListfilterExpand"
        ></c-list-filter>
      </div>
      <c-table
        ref="tableEl"
        :props="table.props"
        :header="tableHeader"
        :data="table.data"
        :selected="table.selected"
        :selection-type="selectionType ? selectionType : 'none'"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      ></c-table>
    </c-content-wrapper>
  </c-card>
</template>
<script lang="ts">
import { defineComponent,ref, PropType, inject } from 'vue'
import { CTable } from '@ccprivate/admin-toolkit-plus'
// import { ElTable } from 'element-plus'
import CListFilter from '@/components/CListFilter.vue'
import Actions from './Actions.vue'
import { MenuDetail } from '@/services/menu'

import usePageDataInit, { BaseListRow, baseIndexKey, InjectionKeyType } from '@/hooks/baseList/usePageDataInit'
import useTableService from '@/hooks/baseList/useTableService'
import useContentPagination from '@/hooks/useContentPagination'
import useTableSelection from '@/hooks/baseList/useTableSelection'
import useToDoActions from '@/hooks/baseList/useToDoActions'
import useTable from '@/hooks/baseList/useTable'
import useTableResize from '@/hooks/baseList/useTableResize'

export default defineComponent({
  components: {
    CListFilter,
    Actions
  },
  props: {
    menu: {
      type: Object as PropType<MenuDetail>,
      default: () => {
        return {}
      }
    }
  },
  // extends: BaseList,
  // mixins: [listActions],
  emits:{
    'go-back': () => true,
    action:(data:Parameters<COptionActions<BaseListRow>>[0])=> true
  },
  setup (props,{ emit }) {

    const baseIndex = inject<InjectionKeyType>(baseIndexKey) as InjectionKeyType

    // 自定义方法：主要是批量删除、删除、编辑等 在当前页面就能实现的功能
    function todoactions (msg: CButtonActionList) {
      toDoActions[msg[2] as CToDoActionNotRow]()
    }
    // 自定义方法：主要是页面调整、弹窗展开等需要在 Index 页面实现的功能
    const optionActions: COptionActions<BaseListRow> = function (data) {
      emit('action', data)
    }

    function goBack(){
      emit('go-back')
    }

    // 根据菜单中的配置生成页面初始化数据
    const { api,listDataMap, table, filterFields, actions, resource, selectionType, showInfo, showList, cListButtonText, cListFilterExpand, handleCListfilterExpand } = usePageDataInit<BaseListRow>(props.menu)
    // 分页功能
    const { pagination } = useContentPagination()
    // 数据搜索
    const { filter, fetchData, handleFilterChange, handleSearch, handleResetSearch } = useTableService<BaseListRow>({ api:api.value, listDataMap:listDataMap.value, table, pagination })
    // 列表选择方法
    const { selected,  handleRowSelectionAdd, handleRowSelectionRemove, handleAllRowSelectionChange } =  useTableSelection<BaseListRow>(table)
    // 新增、批量删除等按钮的方法（包括列表操作列上的删除、预览等按钮）
    const toDoActions = useToDoActions<BaseListRow>({ fetchData, api: api.value, selected:selected.value, goBack, primaryKey: baseIndex.primaryKey.value })
    // 根据格式化后的 table 数据生成 c-table 组件渲染时所需的 Header
    const { tableHeader } = useTable<BaseListRow>({ table, api: api.value, resource: resource.value, toDoActions, optionActions })

    const tableEl = ref<InstanceType<CTable<BaseListRow>>>()
    // table 自适应
    useTableResize({
      table,
      CTableComp: tableEl.value // ?.$refs.table as InstanceType<typeof ElTable>
    })

    fetchData()

    return {

      // 页面初始化参数
      table,
      filterFields,
      actions,  // 操作按钮组
      resource,
      selectionType,
      showInfo,
      showList,
      cListButtonText,
      cListFilterExpand,
      handleCListfilterExpand,
      // 分页查询
      pagination,
      filter,
      handleFilterChange,
      handleSearch,
      handleResetSearch,
      // 列表选中
      handleRowSelectionAdd,
      handleRowSelectionRemove,
      handleAllRowSelectionChange,
      // 自定义 ToDo 事件
      todoactions,
      optionActions,
      // table 渲染函数
      tableHeader,
      tableEl
    }
  }
})
</script>
<style lang="stylus" scoped>
:deep(.content-list)
  margin-top 0
  .el-pagination
    padding 15px 0 0
    margin-top 0
    border none
table
  border 1px solid #EBEEF5
  border-collapse collapse
  width 100%
  font-size 12px
  i
    cursor pointer
  thead
    tr
      th
        color #909399
        text-align left
  tbody
    color #606266
th, td
  border 1px solid #EBEEF5
  padding 8px
:deep(.data-form)
  .el-form-item--small.el-form-item
    margin-bottom 14px
.list-option
  .action-list
    float left
    .el-button-group:empty
      display none
    .el-button-group:not(:empty)
      margin-right 20px
      margin-bottom 14px
  .filter-form
    float left
</style>
