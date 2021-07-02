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
          <el-tree
            class="tree-item-list"
            :data="departmentTree"
            node-key="id"
            default-expand-all
          >
            <div class="tree-item" slot-scope="{ node, data }">
              <span class="tree-item__name">{{ data.name }}</span>
              <el-row class="tree-item__info">
                <ResrouceActions
                  button-type="text"
                  :actions="itemActions"
                  @do-action="handleDoAction($event, data)"
                >
                </ResrouceActions>
              </el-row>
            </div>
          </el-tree>
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
.tree-item-list
  border-top 1px solid #eee
  font-size 12px
  line-height 30px
  >>>
    .el-tree-node__content
      border-bottom 1px solid #eee
      padding 5px 0
.tree-item
  width 100%
  height 100%
.tree-item__info
  width 800px
  float right
  >>>.el-button
    padding 0 5px
.actions
  margin-bottom 14px
</style>
