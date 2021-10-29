<template>
  <PageWrapper>
    <PageContentWrapper class="user-page">
      <ListLayout class="department-list">
        <el-tree
          slot="list"
          class="tree-item-list"
          :data="departmentTree"
          :expand-on-click-node="false"
          :props="{
            label: 'name'
          }"
          :highlight-current="true"
          node-key="id"
          default-expand-all
          @current-change="handleInputDepartmentId"
        >
        <!-- <div class="tree-item" slot-scope="{ node, data }">
          <span class="tree-item__name">{{ data.name }}</span>
        </div> -->
        </el-tree>
      </ListLayout>
      <ListLayout class="user-list">
        <div slot="filter" class="list-top">
          <ResourceActions
            slot="actions"
            :actions="actions"
            @do-action="handleDoAction"
          >
          </ResourceActions>
          <el-form
            slot="filter"
            ref="elFilterForm"
            :inline="true"
            :model="filterForm"
            class="filter-form"
            @reset.native.prevent="handleReset"
            @submit.native="handleSearch"
          >
            <el-form-item label="">
              <el-input
                v-model="filterForm.searchKey"
                class="search-input"
                autocomplete="on"
                name="userKey"
                :placeholder="$t('placeholder.searchUser')"
              ></el-input>
            </el-form-item>
            <el-button-group>
              <el-button native-type="submit">{{ $t('btn.search') }}</el-button>
              <el-button native-type="reset">{{ $t('btn.reset') }}</el-button>
            </el-button-group>
          </el-form>
        </div>
        <c-table
          slot="list"
          slot-scope="{ height }"
          :select-on-row-click="true"
          :selection-type="selectionType"
          :selected="tableSelected"
          :data="tableData"
          :header="tableHeader"
          :props="{ height }"
          @row-selection-change="handleRowSelectionChange"
          @row-selection-add="handleRowSelectionAdd"
          @row-selection-remove="handleRowSelectionRemove"
          @all-row-selection-change="handleAllRowSelectionChange"
        >
        </c-table>
        <el-pagination
          slot="pagination"
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[15, 30, 50, 100, 200]"
          :total="pagination.total"
        >
        </el-pagination>
      </ListLayout>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useSelection, useFilter } from '../../use'
import { PageWrapper, PageContentWrapper, ListLayout, ResourceActions } from '@/views/modules'
import consts from '../../../../utlis/consts'
import UserRoleSetter from '../../../../components/UserRoleSetter'
const RESOURCE = 'user'
const { CREATE, UPDATE, DELETE } = consts.commonOperation
const commonOperationEvent = consts.commonOperationEvent

export default {
  components: {
    ListLayout,
    ResourceActions,
    PageWrapper,
    PageContentWrapper
  },
  setup (props, ctx) {
    const _$t = ctx.root.$t.bind(ctx.root)
    const service = ctx.root.$service
    const idField = 'id'
    const departmentTree = ref([])
    const activeDepartmentId = ref(undefined)
    service.departmentGetListService().then(result => {
      departmentTree.value = result
    })
    function handleInputDepartmentId (item) {
      activeDepartmentId.value = item.id
    }
    const tableData = ref([])
    const tableHeader = computed(() => {
      const result = [
        {
          label: _$t('loginName'),
          prop: 'loginName'
        },
        {
          label: _$t('email'),
          prop: 'email'
        },
        {
          label: _$t('xingming'),
          prop: 'name'
        },
        {
          label: _$t('phone'),
          prop: 'phone'
        },
        {
          label: _$t('type'),
          prop: 'registerType'
        },
        {
          label: _$t('remark'),
          prop: 'remark'
        },
        {
          label: _$t('status'),
          prop: 'status',
          render: (h, { row }) => {
            return consts.abilityStatusText[row.status]
          }
        },
        {
          label: _$t('btn.operation'),
          render: (h, { row }) => {
            return h(UserRoleSetter, { props: { user: row } }, _$t('setRole'))
          }
        }
      ]
      return result
    })

    const elFilterForm = ref(null)
    const validateFilter = cb => {
      elFilterForm.value.validate(valid => {
        if (valid) {
          cb()
        }
      })
    }
    function genDefaultFilter () {
      return {
        searchKey: ''
      }
    }
    const { filter, filterForm, handleSearch, handleReset } = useFilter({ genDefaultFilter, validate: validateFilter })
    const pagination = ref({ total: 0, pageSize: 15, page: 1 })
    watch(filter, () => {
      pagination.value.page = 1
    })

    const fetchOptions = computed(() => {
      const departmentId = activeDepartmentId.value
      const { page: pageNo, pageSize } = pagination.value
      return {
        pageNo,
        pageSize,
        departmentId,
        ...filter.value
      }
    })
    watch(fetchOptions, fetchData)

    function fetchData () {
      service.userGetList(fetchOptions.value).then(result => {
        tableData.value = result.rows
        pagination.value.total = result.total
      })
    }

    const {
      selectionType,
      tableSelected,
      selected,
      handleRowSelectionAdd,
      handleRowSelectionRemove,
      handleRowSelectionChange,
      handleAllRowSelectionChange
    } = useSelection({ idField, type: 'multiple', data: tableData })

    const actions = [
      {
        label: _$t('btn.create'),
        value: `${RESOURCE}:${CREATE}`
      },
      {
        label: _$t('btn.edit'),
        value: `${RESOURCE}:${UPDATE}`
      },
      {
        label: _$t('btn.del'),
        value: `${RESOURCE}:${DELETE}`
      }
    ]
    function handleDoAction (action, item) {
      const eventName = commonOperationEvent[action.split(':')[1]]
      ctx.emit(eventName, { item, selected: selected.value })
    }

    return {
      tableData,
      tableHeader,
      pagination,
      elFilterForm,
      filterForm,
      handleSearch,
      handleReset,
      selectionType,
      selected,
      tableSelected,
      handleRowSelectionAdd,
      handleRowSelectionRemove,
      handleRowSelectionChange,
      handleAllRowSelectionChange,
      actions,
      handleDoAction,
      fetchData,
      departmentTree,
      handleInputDepartmentId
    }
  }
}
</script>

<style lang="stylus" scoped>
.search-input
  width 300px
.user-page
  flex-direction row
.department-list
  width 300px
  margin-right 10px
  border 1px solid #EBEEF5
  box-sizing border-box
  padding 7px 0
  background #fff
  float left
.filter-form
  padding-left 14px
.user-list
  flex 1
.list-top
  display flex
  .el-form-item--small.el-form-item
    margin-bottom 14px
</style>
