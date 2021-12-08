<template>
  <div>
    <div v-show="showInfo">{{ $t('message.pageConfiguration') }}</div>
    <c-content-wrapper
      v-show="showList"
      :filter="filter"
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
        <c-list-filter
          v-if="!cListFilterExpand"
          ref="expandForm"
          :options="filterFields"
          :length="3"
          :form-data="filter"
          :is-expand="cListFilterExpand"
          @filter="handleSearch"
          @reset="handleResetSearch"
          @filter-expand="handleCListfilterExpand"
        >
        </c-list-filter>
      </div>
      <div class="filter-expand">
        <c-list-filter
          v-if="cListFilterExpand"
          ref="expandForm"
          :options="filterFields"
          :form-data="filter"
          :is-expand="cListFilterExpand"
          @filter="handleSearch"
          @reset="handleResetSearch"
          @filter-expand="handleCListfilterExpand"
        >
        </c-list-filter>
      </div>
      <!-- <c-table
        ref="tableEl"
        :props="table.props"
        :header="tableHeader"
        :data="table.data"
        :selected="table.selected"
        :selection-type="selectionType ? selectionType : 'none'"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      ></c-table> -->
      <c-card-list
        ref="tableEl"
        :data="table.data"
        :selected="table.selected"
        :selection-type="selectionType ? selectionType : 'none'"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      >
        <template #default="{ row }">
          <div class="card-content">
            <CardItem :row="row">
              <div class="card-item__actions">
                <!-- <CardOperation
                  :row="row"
                  :actions="actions"
                  :resource="resource"
                  @option="optionActions"
                  @todo="todoactions"
                ></CardOperation> -->
              </div>
            </CardItem>
          </div>
        </template>
      </c-card-list>
    </c-content-wrapper>
  </div>
</template>
<script lang="ts">
// import CardList from './cardList'

// import listActions from '@/views/baseList/mixin/listActions'
import CardItem from './CardItem.vue'
import CardOperation from './CardOperation.js'

import { defineComponent, ref, PropType, inject } from 'vue'
import { CTable } from '@ccprivate/admin-toolkit-plus'
// import { ElTable } from 'element-plus'
import CListFilter from '@/components/CListFilter.vue'
import Actions from '@/views/template/baseList/Actions.vue'
import { MenuDetail } from '@/services/menu'
import usePageDataInit, { BaseListRow, baseIndexKey, InjectionKeyType } from '@/hooks/baseList/usePageDataInit'
import useTableService from '@/hooks/baseList/useTableService'
import useContentPagination from '@/hooks/useContentPagination'
import useTableSelection from '@/hooks/baseList/useTableSelection'
import useToDoActions from '@/hooks/baseList/useToDoActions'
// import useTable from '@/hooks/baseList/useTable'
export default defineComponent({
  components: {
    Actions,
    CardItem,
    // CardOperation,
    CListFilter
  },
  props: {
    menu: {
      type: Object as PropType<MenuDetail>,
      default: () => {
        return {}
      }
    }
  },
  // inject: ['baseIndex'],
  setup (props,{ emit }) {

    const baseIndex = inject<InjectionKeyType>(baseIndexKey) as InjectionKeyType

    // 自定义方法：主要是批量删除、删除、编辑等 在当前页面就能实现的功能
    function todoactions (msg: CButtonActionList) {
      toDoActions[msg[2] as CToDoActionNotRow]()
    }
    // 自定义方法：主要是页面跳转、弹窗展开等需要在 Index 页面实现的功能
    const optionActions: COptionActions<BaseListRow> = function (data) {
      emit('action', data)
    }

    function goBack () {
      emit('go-back')
    }
    // 根据菜单中的配置生成页面初始化数据
    const { api, listDataMap, table, filterFields, actions, resource, selectionType, showInfo, showList, cListButtonText, cListFilterExpand, handleCListfilterExpand } = usePageDataInit<BaseListRow>(props.menu)
    // const { table } = usePageDataInit<BaseListRow>(props.menu)
    // 分页功能
    const { pagination } = useContentPagination()
    // 数据搜索

    const { filter, fetchData, handleFilterChange, handleSearch, handleResetSearch } = useTableService<BaseListRow>({ api:api.value, listDataMap: listDataMap.value, table, pagination })

    // table.data = useTableService<BaseListRow>({ api:api.value, listDataMap: listDataMap.value, table, pagination }).table.data

    console.log('table', table)

    // 列表选择方法
    const { selected, handleRowSelectionAdd, handleRowSelectionRemove, handleAllRowSelectionChange } = useTableSelection<BaseListRow>(table)
    // 新增、批量删除等按钮的方法（包括列表操作列上的删除、预览等按钮）
    const toDoActions = useToDoActions<BaseListRow>({ fetchData, api: api.value, selected:selected.value, goBack, primaryKey: baseIndex.primaryKey.value })
    // 根据格式化后的 table 数据生成 c-table 组件渲染时所需的 Header
    // const { tableHeader } = useTable<BaseListRow>({ table, api: api.value, resource: resource.value, toDoActions, optionActions })

    const tableEl = ref<InstanceType<CTable<BaseListRow>>>()
    // // table 自适应
    // useTableResize({
    //   table,
    //   CTableComp: tableEl.value // ?.$refs.table as InstanceType<typeof ElTable>
    // })

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
      // tableHeader,
      tableEl
    }
  }

})
</script>
<style lang="stylus" scoped>
>>>.content-list
  margin-top 0
  .el-pagination
    padding 0
    margin-top 0
    border none
    background none
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
>>>.data-form
  .el-form-item--small.el-form-item
    margin-bottom 14px
.list-option
  .action-list
    margin-right 20px
    margin-bottom 14px
    float left
>>>.card-item__selection
  top 7px
  left 14px
.card-item__actions
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background rgba(0,0,0,.5)
  text-align right
  padding 0 10px
  box-sizing border-box
  display none
.card-content:hover .card-item__actions
  display block
</style>
