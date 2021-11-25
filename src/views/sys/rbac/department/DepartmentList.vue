<template>
  <PageWrapper>
    <PageContentWrapper class="menu-page">
      <ListLayout>
        <template #actions>
          <ResourceActions
            class="actions"
            :actions="actions"
            @do-action="handleDoAction"
          ></ResourceActions>
        </template>
        <template #list>
          <el-table
            :data="departmentTree"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作" width="90px">
              <template #default="{ row }">
                <ResourceActions
                  button-type="text"
                  :actions="itemActions"
                  @do-action="handleDoAction($event, row)"
                ></ResourceActions>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </ListLayout>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { PageWrapper, PageContentWrapper, ListLayout, ResourceActions } from '@/views/modules'

import consts from '@/utlis/consts'
const RESOURCE = 'department'
// const { CREATE, UPDATE, DELETE } = consts.commonOperation
const { commonOperationEvent, commonOperation: { CREATE, UPDATE, DELETE } } = consts


import { RBACDepartment, departmentGetListService } from '@/services/department'

export default defineComponent({
  components: {
    ListLayout,
    PageWrapper,
    PageContentWrapper,
    ResourceActions
  },
  emits: Object.keys(commonOperationEvent).map(k=> commonOperationEvent[k as keyof typeof commonOperationEvent]),
  setup (props, { emit }) {

    const { t: $t } = useI18n()

    const departmentTree = ref<Array<RBACDepartment>>([])

    const actions = [
      {
        label: $t('btn.create'),
        value: `${RESOURCE}:${CREATE}`
      }
    ]
    const itemActions: Array<CRBACButtonAction> = [
      {
        label: $t('btn.edit'),
        value: `${RESOURCE}:${UPDATE}`
      },
      {
        label: $t('btn.del'),
        value: `${RESOURCE}:${DELETE}`
      }
    ]

    function handleDoAction (action:string, item?:RBACDepartment) {
      const eventKey = action.split(':')[1] as RBACActionMode
      const eventName = commonOperationEvent[eventKey]
      console.log('eventName')
      emit(eventName, { item, selected: [item] })
    }

    function fetchData () {
      departmentGetListService().then(result => {
        departmentTree.value = result[0].children as Array<RBACDepartment>
      })
    }
    fetchData()

    return {
      departmentTree,
      fetchData,
      actions,
      itemActions,
      handleDoAction
    }
  }
})
</script>

<style lang="stylus" scoped>
.menu-page :deep(.list-layout) > .list
  overflow auto
.actions
  margin-bottom 14px
</style>
