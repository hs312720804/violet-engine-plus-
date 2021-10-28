<template>
  <PageWrapper>
    <PageContentWrapper class="menu-page">
      <ListLayout>
        <template #actions>
          <ResrouceActions
            class="actions"
            :actions="actions"
            @do-action="handleDoAction"
          ></ResrouceActions>
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
                <ResrouceActions
                  button-type="text"
                  :actions="itemActions"
                  @do-action="handleDoAction($event, row)"
                ></ResrouceActions>
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

import { PageWrapper, PageContentWrapper, ListLayout } from '../../../../utlis/deps'
import ResrouceActions from '../../../modules/ResourceActions.vue'
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
    ResrouceActions
  },
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
      const eventKey = action.split(':')[1] as CActionMode
      const eventName = commonOperationEvent[eventKey]
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
