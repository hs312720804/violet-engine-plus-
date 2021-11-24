<template>
  <div class="device">
    <div class="department">
      <div class="container">
        <el-tree
          slot="list"
          class="tree-item-list"
          :data="treeData"
          :expand-on-click-node="false"
          :props="{
            label: 'name'
          }"
          :highlight-current="true"
          @current-change="handleInputDepartmentId"
          node-key="id"
          default-expand-all
        >
        <!-- <div class="tree-item" slot-scope="{ node, data }">
          <span class="tree-item__name">{{ data.name }}</span>
        </div> -->
        </el-tree>
      </div>
    </div>
    <c-card ref="contentCard" class="content">
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
              @action="actionOption"
              @todo="actionTodo"
            ></Actions>
          </div>
          <template v-if="filterFields.length > 0">
            <c-list-filter
              ref="expandForm"
              :options="filterFields"
              :length="3"
              :form-data="filter"
              :is-expand="filterExpand"
              :button-text="buttonText"
              :hidden-expand-button="filterFields.length <= 3"
              v-if="!filterExpand"
              @filter="handleSearch"
              @reset="handleResetSearch"
              @filter-expand="handlefilterExpand"
            >
            </c-list-filter>
          </template>
        </div>
        <div class="filter-expand">
          <c-list-filter
            ref="expandForm"
            :options="filterFields"
            :form-data="filter"
            :is-expand="filterExpand"
            :button-text="buttonText"
            v-if="filterExpand"
            @filter="handleSearch"
            @reset="handleResetSearch"
            @filter-expand="handlefilterExpand"
          >
          </c-list-filter>
        </div>
        <c-table
          :props="table.props"
          ref="table"
          :header="tableHeader"
          :data="table.data"
          :selected="table.selected"
          :selection-type="selectionType"
          @row-selection-add="handleRowSelectionAdd"
          @row-selection-remove="handleRowSelectionRemove"
          @all-row-selection-change="handleAllRowSelectionChange"
        ></c-table>
      </c-content-wrapper>
    </c-card>
  </div>
</template>
<script>
import BaseList from '@/views/baseList/BaseList'
import Actions from '@/views/baseList/Actions.vue'
import listActions from '@/views/baseList/mixin/listActions'
import { renderMethods } from '@/views/baseList/renderMethods'
import _ from 'lodash'
export default {
  extends: BaseList,
  mixins: [listActions],
  components: {
    Actions
  },
  data () {
    return {
      filterFields: [],
      filter: {},
      isExpand: false,
      filterExpand: false,
      filterType: '',
      filterTypeLabel: '',
      buttonText: {
        query: this.$t('btn.search'),
        reset: this.$t('btn.reset'),
        expand: this.$t('btn.expand'),
        packUp: this.$t('btn.packUp')
      },
      table: {
        props: {
          border: true,
          stripe: true
        },
        header: [],
        data: [],
        selected: []
      },
      template: '',
      actions: [],
      treeData: [],
      activeDepartmentId: ''
    }
  },
  computed: {
  },
  methods: {
    ...renderMethods,
    getDepartment () {
      this.$service.fetch({
        method: this.api.department[1],
        url: this.api.department[0],
        params: {
          id: this.$store.state.user.departmentId
        }
      }).then((data) => {
        this.treeData = data
      })
    },
    handleInputDepartmentId (item) {
      this.filter['organizationId'] = item.id
      this.pagination.currentPage = 1
      this.fetchData()
    },
    actionOption (data) {
      this.$emit('action', data)
    },
    actionTodo (msg) {
      this[msg[2]]()
    },
    handleSearch () {
      let params = {
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      this.getListData(this.api.list, { ...this.filter, ...params })
    },
    handleResetSearch () {
      Object.keys(this.filter).forEach(key => {
        this.filter[key] = ''
      })
      this.handleSearch()
    },
    handlefilterExpand (msg) {
      this.filterExpand = msg
    },
    handleExpand (val) {
      this.isExpand = val
    },
    handleFilterQuery (value) {
      this.filter = value
      this.handleFilterChange('query')
    },
    hancleClearFilter () {
      this.filter = {}
    },
    pageSetting (data) {
      let params = {
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      if (data.fields) {
        const fields = this.$constants.evil(data.fields)
        this.filterFields = this.baseIndex.disposalField(fields, 2)
        this.table.header = this.baseIndex.disposalField(fields, 1)
        this.table.header.length > 0 ? this.showList = true : this.showInfo = true
        this.getListData(this.api.list, params)
      }
      if (data.extra) {
        const extra = this.$constants.evil(data.extra)
        this.actions = 'actions' in extra ? this.$constants.evil(extra.actions) : []
      }
    },
    getListData (url, params) {
      // const filter = this.parseFilter()
      const _this = this
      return new Promise((resolve, reject) => {
        _this.$service.fetch({
          method: url[1],
          url: url[0],
          params
        }).then(data => {
          let listData = this.listDataMap ? _.get(data, this.listDataMap) : data // 获取映射数据
          if (listData.list.length < 1 && listData.total > 0) {
            _this.pagination.currentPage = _this.pagination.currentPage - 1
            _this.getListData()
          } else {
            // resolve(data.pageInfo)
            this.table.data = listData.list
            this.pagination.total = listData.total
          }
        })
      })
    },
    fetchData () {
      let params = {
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      if (this.api) {
        this.getListData(this.api.list, { ...this.filter, ...params })
      }
    }
  },
  created () {
    this.pageSetting(this.menu)
    this.getDepartment()
  }
}
</script>
<style lang="stylus" scoped>
.device
  background #fff
  .department
    width 280px
    float left
    box-sizing border-box
    position relative
    .container
      background #fff
      padding 14px
  .content-card
    margin-left 280px
    border-left 1px solid #EBEEF5
.device:after
  content ''
  height 0
  clear both
  display block
>>>.content-list
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
>>>.data-form
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
</style>
