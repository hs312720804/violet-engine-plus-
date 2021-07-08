<template>
  <PageWrapper>
    <PageContentWrapper class="menu-page">
      <ListLayout>
        <ResrouceActions
          slot="actions"
          class="actions"
          :actions="actions"
          @do-action="handleDoAction"
        >
        </ResrouceActions>
        <div slot="list">
          <el-table
            :data="departmentTree"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column
              prop="name"
              label="名称"
            >
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="90px"
            >
              <template #default="{row}">
                <ResrouceActions
                  button-type="text"
                  :actions="itemActions"
                  @do-action="handleDoAction($event, row)"
                >
                </ResrouceActions>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </ListLayout>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import { ref } from 'vue'
import { PageWrapper, PageContentWrapper, ListLayout } from '../../../../utlis/deps'
import ResrouceActions from '../../../../components/ResourceActions.vue'
import consts from '../../../../utlis/consts'
const RESOURCE = 'department'
const { CREATE, UPDATE, DELETE } = consts.commonOperation
const commonOperationEvent = consts.commonOperationEvent

export default {
  components: {
    ListLayout,
    PageWrapper,
    PageContentWrapper,
    ResrouceActions
  },
  setup (props, ctx) {
    const departmentTree = ref([])
    const _this = ctx.root
    const actions = [
      {
        label: _this.$t('btn.create'),
        value: `${RESOURCE}:${CREATE}`
      }
    ]
    const itemActions = [
      {
        label: _this.$t('btn.edit'),
        value: `${RESOURCE}:${UPDATE}`
      },
      {
        label: _this.$t('btn.del'),
        value: `${RESOURCE}:${DELETE}`
      }
    ]
    function handleDoAction (action, item) {
      const eventName = commonOperationEvent[action.split(':')[1]]
      ctx.emit(eventName, { item, selected: [item] })
    }

    function fetchData () {
      _this.$service.departmentGetList().then(result => {
        departmentTree.value = result[0].children
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
}
</script>

<style lang="stylus" scoped>
.menu-page >>> .list-layout > .list
  overflow auto
.actions
  margin-bottom 14px
</style>
