<template>
  <div>
    <div class="list-option clearfix">
      <div class="action-list">
        <!-- <Actions
          :selected="table.selected"
          :actions="actions"
          :rows="table.data"
          :resource="resource"
          @action="actionOption"
          @todo="actionTodo"
        ></Actions> -->
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
    <div class="tabpage-head">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, key) in menuChildren">
          <el-tab-pane
            :label="item.name"
            :name="item.alias"
            :key="key"
            v-if="item.template"
          >
            <component
              :ref="item.alias"
              :is="routerComponents[item.template].template"
              :menu-id="item.id"
            ></component>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <!-- <div v-for="(page, key) in menuChildren" :key="page.alias + '_' + key">
      <component
        :ref="page.alias"
        :is="routerComponents[page.template].template"
        :menu-id="page.id"
        v-show="activeName === page.alias"
      ></component>
    </div> -->
  </div>
</template>

<script>
import routerComponents from '@/router/components'
export default {
  props: {
    menuId: {
      type: Number
    },
    menu: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      activeName: '',
      menuDetail: {},
      routerComponents,
      pageTemplate: routerComponents.BaseList.template,
      menuChildren: [],
      filterFields: [],
      filterExpand: false,
      filter: {},
      buttonText: {
        query: this.$t('btn.search'),
        reset: this.$t('btn.reset'),
        expand: this.$t('btn.expand'),
        packUp: this.$t('btn.packUp')
      }
    }
  },
  methods: {
    handleClick (tab, event) {
      this.$nextTick(() => {
        this.menuChildren.forEach((item, index) => {
          if (item.alias === this.activeName && item.template === 'BaseList') { // 判断是BaseList时才会进行高度的设置
            this.$refs[this.activeName][0].$refs.list.setHeight()
          }
        })
      })
    },
    fetchMenuData (id) {
      this.$service.getMenusDetail({ id }).then((data) => {
        this.menuDetail = data
        this.menuChildren = this.menuDetail.children
        const fields = this.$constants.evil(this.menuDetail.fields)
        const primaryField = fields.filter((field) => {
          return 'primaryKey' in field && field.primaryKey === 1
        })
        this.primaryKey = primaryField.length > 0 ? primaryField[0].prop : 'id'
        if (this.menuChildren.length > 0) {
          this.activeName = this.menuChildren[0].alias
        }
        this.pageSetting(this.menuDetail)
      })
    },
    pageSetting (data) {
      if (data.fields) {
        const fields = this.$constants.evil(data.fields)
        this.filterFields = this.$constants.disposalField(fields, 2)
      }
      if (data.extra) {
        const extra = this.$constants.evil(data.extra)
        this.actions = 'actions' in extra ? this.$constants.evil(extra.actions) : []
      }
    },
    handleSearch () {
      this.menuChildren.forEach(item => {
        const refs = this.$refs[item.alias][0].$refs
        if ('list' in refs) {
          const reflist = refs['list']
          reflist.filter = this.filter
          reflist.fetchData()
        }
      })
    },
    handleResetSearch () {
      Object.keys(this.filter).forEach(key => {
        this.filter[key] = ''
      })
      this.handleSearch()
    },
    handlefilterExpand (msg) {
      this.filterExpand = msg
    }
  },
  created () {
    this.fetchMenuData(this.menuId)
  }
}
</script>

<style lang="stylus" scoped>
.tabpage-head
  background #fff
  z-index 200
  position relative
>>>.el-tabs--top .el-tabs__item.is-top:nth-child(2)
  padding-left 14px
>>>.el-tabs__header
  margin-bottom 0
</style>
