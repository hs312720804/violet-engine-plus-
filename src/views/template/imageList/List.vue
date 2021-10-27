<template>
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
        <c-list-filter
          ref="expandForm"
          :options="filterFields"
          :length="3"
          :form-data="filter"
          :is-expand="filterExpand"
          v-if="!filterExpand"
          @filter="handleSearch"
          @reset="handleResetSearch"
          @filter-expand="handlefilterExpand"
        >
        </c-list-filter>
      </div>
      <div class="filter-expand">
        <c-list-filter
          ref="expandForm"
          :options="filterFields"
          :form-data="filter"
          :is-expand="filterExpand"
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
        :selection-type="table.selectionType"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      ></c-table>
    </c-content-wrapper>
  </c-card>
</template>
<script>
import BaseList from '@/views/template/baseList/BaseList'
import Actions from '@/views/template/baseList/Actions.vue'
import listActions from './mixin/listActions'
export default {
  extends: BaseList,
  mixins: [listActions],
  inject: ['baseIndex'],
  components: {
    Actions
  },
  data () {
    return {
      resourceType: 'id',
      filterFields: [],
      filter: {},
      isExpand: false,
      filterExpand: false,
      filterType: '',
      filterTypeLabel: '',
      table: {
        props: {
          border: true,
          stripe: true
        },
        header: [],
        data: [],
        selectionType: 'multiple',
        selected: []
      },
      template: '',
      actions: []
    }
  },
  computed: {
    tableHeader () {
      let header = JSON.parse(JSON.stringify(this.table.header))
      this.table.header.forEach((item, key) => {
        if (typeof item.render === 'string') {
          let _this = this
          if (item.render) {
            // eslint-disable-next-line no-eval
            header[key].render = eval('(' + item.render + ')')
          }
        }
        if (item.inputType === 'enum' && !('render' in item)) {
          let options = {}
          const tagType = ['', 'success', 'info', 'warning', 'danger', 'danger', 'warning', 'success', 'info']
          let type = ''
          item.options.forEach((option, index) => {
            options[option.value] = option.label
            type = tagType[index]
          })
          header[key].render = function (h, { row }) {
            return h(
              'el-tag',
              {
                attrs: {
                  type: type
                }
              },
              options[row.status]
            )
          }
        }
      })
      return header
    },
    api () {
      return this.$constants.evil(this.menu.api)
    },
    resource () {
      return this.$constants.evil(this.menu.extra).resource
    }
  },
  methods: {
    actionOption (data) {
      this.$emit('action', data)
    },
    actionTodo (msg) {
      this[msg[2]]()
    },
    /**
     * Array: ['显示文本:类型(页面page,确认Confirm，弹窗编辑]):Template/Function:Access:[argument]']
     */
    handleOperation (arr) {
      // 不与权限关联时用例：["编辑:Page:Edit:edit","查看:Page:Edit:read","删除:Todo:rowDelete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
      // 与权限关联时用例：["编辑:Page:Edit:update:edit","查看:Page:Edit:detail:read","删除:Todo:rowDelete:delete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
      return (h, { row }) => {
        return arr.map((item, index) => {
          let option = item.split(':')
          // if (this.resourceAccess.indexOf(option[3]) > -1) { // 权限是否存在判断
          return h(
            'el-button',
            {
              props: {
                type: 'text',
                size: 'mini'
              },
              // 不与权限关联时不需要指令，mode的索引变成3
              directives: [{
                name: 'permission',
                value: `${this.resource}:${option[3]}`
              }],
              on: {
                click: () => {
                  if (option[1] === 'Todo') {
                    this[option[2]](row)
                  } else {
                    this.$emit('option', { row, option })
                  }
                }
              }
            },
            option[0]
          )
          // }
        })
      }
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
        this.filterFrom[key] = ''
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
          method: 'get',
          url,
          params
        }).then(data => {
          if (data.pageInfo.list.length < 1 && data.pageInfo.total > 0) {
            _this.pagination.currentPage = _this.pagination.currentPage - 1
            _this.getListData()
          } else {
            // resolve(data.pageInfo)
            this.table.data = data.pageInfo.list
            this.pagination.total = data.pageInfo.total
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
  }
}
</script>
<style lang="stylus" scoped>
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
