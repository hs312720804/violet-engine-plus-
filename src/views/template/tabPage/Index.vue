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
    <div class="tabpage-head">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item, key) in menuChildren">
          <el-tab-pane
            v-if="item.template"
            :key="key"
            :label="item.name"
            :name="item.alias"
          >
            <component
              :is="routerComponents[item.template].template"
              :ref="item.alias"
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
import { defineComponent, ref, reactive, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getMenusDetailService } from '@/services/menu'
import { evil as functionEvil, disposalField } from '@/utlis/common'
import PageComponentMap from '../baseList/pages/Index'

import routerComponents from '@/router/components'
export default defineComponent({
  props: {
    menuId: {
      type: Number,
      required: true
    },
    menu: {
      type: Object,
      default: () => {}
    }
  },
  setup (props) {

    const $router = useRouter()
    const $route = useRoute()
    const { t: $t } = useI18n() // 获取 i18n 的 t
    let pageName = ref('AAPage')
    let activeName = ref('')
    let menuDetail = ref({})
    // let routerComponents = ref('')
    let pageTemplate = routerComponents.BaseList.template
    let menuChildren = ref([])
    let actions = ref('')
    let filterFields = ref([])
    let filterExpand = ref(false)
    let filter = ref({})
    let buttonText = reactive({
      query: $t('btn.search'),
      reset: $t('btn.reset'),
      expand: $t('btn.expand'),
      packUp: $t('btn.packUp')
    })

    function handleClick (tab, event) {
      $router.push({ query: { tab: activeName.value } })
      // nextTick()
      nextTick(() => {
        menuChildren.value.forEach((item, index) => {
          if (item.alias === activeName.value && item.template === 'BaseList') { // 判断是BaseList时才会进行高度的设置
            // this.$refs[activeName][0].$refs.list.setHeight()
          }
        })
      })
    }

    function fetchMenuData (id) {
      getMenusDetailService({ id }).then(data => {
        menuDetail.value = data
        menuChildren.value = menuDetail.value.children
        const fields = functionEvil(menuDetail.value.fields)
        const primaryField = fields.filter(field => {
          return 'primaryKey' in field && field.primaryKey === 1
        })
        // this.primaryKey = primaryField.length > 0 ? primaryField[0].prop : 'id'
        if (menuChildren.value.length > 0) {
          if ($route.query.tab) {
            activeName.value = $route.query.tab
          } else {
            activeName.value = menuChildren.value[0].alias
          }
        }
        pageSetting(menuDetail.value)
      })
    }
    function pageSetting (data) {
      if (data.fields) {
        const fields = functionEvil(data.fields)
        filterFields.value = disposalField(fields, 2)
      }
      if (data.extra) {
        const extra = functionEvil(data.extra)
        actions.value = 'actions' in extra ? functionEvil(extra.actions) : []
      }
    }
    function handleSearch () {
      menuChildren.value.forEach(item => {
        const refs = this.$refs[item.alias][0].$refs
        if ('list' in refs) {
          const reflist = refs['list']
          reflist.filter = filter.value
          reflist.fetchData()
        }
      })
    }
    function handleResetSearch () {
      Object.keys(filter.value).forEach(key => {
        filter[key] = ''
      })
      handleSearch()
    }
    function handlefilterExpand (msg) {
      filterExpand.value = msg
    }

    fetchMenuData(props.menuId)

    console.log('routerComponents===', routerComponents)
    console.log('PageComponentMap===', PageComponentMap)

    return {
      activeName,
      menuDetail,
      routerComponents,
      pageTemplate,
      menuChildren,
      filterFields,
      filterExpand,
      filter,
      buttonText,
      handleClick,
      fetchMenuData,
      pageSetting,
      handleSearch,
      handleResetSearch,
      handlefilterExpand,
      pageName,
      PageComponentMap
    }

  }

})
</script>

<style lang="stylus" scoped>
.tabpage-head
  background #fff
  z-index 200
  position relative
:deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2))
  padding-left 14px
:deep(.el-tabs__header)
  margin-bottom 0
</style>
