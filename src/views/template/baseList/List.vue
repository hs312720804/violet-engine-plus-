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
        <template v-if="filterFields.length > 0">
          <c-list-filter
            v-if="!filterExpand"
            ref="expandForm"
            :options="filterFields"
            :length="3"
            :form-data="filter"
            :is-expand="filterExpand"
            :button-text="buttonText"
            :hidden-expand-button="filterFields.length <= 3"
            @filter="handleSearch"
            @reset="handleResetSearch"
            @filter-expand="handlefilterExpand"
          >
          </c-list-filter>
        </template>
      </div>
      <div class="filter-expand">
        <c-list-filter
          v-if="filterExpand"
          ref="expandForm"
          :options="filterFields"
          :form-data="filter"
          :is-expand="filterExpand"
          :button-text="buttonText"
          @filter="handleSearch"
          @reset="handleResetSearch"
          @filter-expand="handlefilterExpand"
        >
        </c-list-filter>
      </div>
      <c-table
        ref="table"
        :props="table.props"
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
</template>
<script>
import BaseList from '@/views/template/baseList/BaseList'
import Actions from '@/views/template/baseList/Actions.vue'
import listActions from './mixin/listActions'
import { renderMethods } from '@/views/template/baseList/renderMethods'
import _ from 'lodash'
export default {
  components: {
    Actions
  },
  extends: BaseList,
  mixins: [listActions],
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
        if (item.inputType === 'enum' && (!('render' in item) || !item.render)) {
          header[key].render = function (h, { row }) {
            let options = {}
            const tagType = ['', 'success', 'info', 'warning', 'danger', 'danger', 'warning', 'success', 'info']
            let type = ''
            item.options.forEach((option, index) => {
              options[option.value] = option.label
              if (row[item.prop] === option.value) {
                type = tagType[index]
              }
            })
            return h(
              'el-tag',
              {
                attrs: {
                  type: type
                }
              },
              options[row[item.prop]]
            )
          }
        }
        if (item.inputType === 'image' && (!('render' in item) || !item.render)) {
          header[key].render = function (h, { row }) {
            return h(
              'el-image',
              {
                attrs: {
                  src: row[item.prop],
                  fit: 'contain'
                },
                style: {
                  height: '50px'
                }
              },
              ''
            )
          }
        }
      })
      return header
    },
    api () {
      return this.$constants.evil(this.menu.api)
    },
    resource () { // 权限资源
      return this.$constants.evil(this.menu.extra).resource
    },
    listDataMap () { // 列表数据映射
      return this.$constants.evil(this.menu.extra).listDataMap
    },
    selectionType () {
      return this.$constants.evil(this.menu.extra).selectionType
    }
  },
  created () {
    this.pageSetting(this.menu)
  },
  methods: {
    ...renderMethods,
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
            _this.fetchData()
          } else {
            // resolve(data.pageInfo)
            this.table.data = listData.list
            this.pagination.total = listData.total
          }
        }).catch(e => {
          this.$notify({
            title: '获取数据失败',
            type: 'error',
            message: e.message
          })
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
