<template>
  {{ $t('btn.copy') }}
  <PageWrapper>
    <PageContentWrapper class="menu-page">
      <ListLayout>
        <ResrouceActions
          slot="actions"
          :actions="actions"
          @do-action="handleDoAction"
        >
        </ResrouceActions>
        <template #list>
          <el-tree
            class="tree-item-list"
            :data="menuTree"
            node-key="id"
            default-expand-all
            draggable
            @node-drop="handleDrop"
          >
            <template #default="{ data }" class="tree-item">
              <span>{{ data.name }}</span>
              <el-row class="tree-item__info">
                <ResrouceActions
                  button-type="text"
                  :actions="itemActions"
                  @do-action="handleDoAction($event, data)"
                >
                </ResrouceActions>
              </el-row>
            </template>
          </el-tree>
        </template>
      </ListLayout>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import { ref } from 'vue'
import { PageWrapper, PageContentWrapper, ListLayout } from '../../../../utlis/deps'
import ResrouceActions from '../../../../components/ResourceActions.vue'
import consts from '../../../../utlis/consts'
const RESOURCE = 'menu'
const { CREATE, UPDATE, DELETE } = consts.commonOperation
const commonOperationEvent = consts.commonOperationEvent
import { menuGetListService } from '@/services/menu'
import { useI18n } from 'vue-i18n'

export default {
  components: {
    ListLayout,
    PageWrapper,
    PageContentWrapper,
    ResrouceActions
  },
  setup (props, ctx) {
    // const _$t = ctx.root.$t.bind(ctx.root)
    // const service = ctx.root.$service
    const { t } = useI18n() // 获取 i18n 的 t
    const _$t = t

    // console.log('useI18n()===', useI18n())
    // console.log('useI18n()===', useI18n().t)
    const menuTree = ref([])
    function handleDrop (node, dropNode, dropType, ev) {
      const menu = node.data
      const dropMenu = dropNode.data
      menu.parentId = dropMenu.parentId
      switch (dropType) {
        case 'before':
          menu.sort = dropMenu.sort
          break
        case 'after':
          menu.sort = dropMenu.sort + 1
          break
        case 'inner':
          menu.parentId = dropMenu.id
      }
      // service.menuUpsert(menu)
    }

    const actions = [
      {
        label: _$t('btn.create'),
        // label: '创建',
        value: `${RESOURCE}:${CREATE}`
      }
    ]
    const itemActions = [
      {
        label: _$t('btn.edit'),
        // label: '编辑',
        value: `${RESOURCE}:${UPDATE}`
      },
      {
        label: _$t('btn.del'),
        // label: '删除',
        value: `${RESOURCE}:${DELETE}`
      }
    ]
    function handleDoAction (action, item) {
      debugger
      const eventName = commonOperationEvent[action.split(':')[1]]
      ctx.emit(eventName, { item, selected: [item] })
    }
    function fetchData () {
      menuGetListService().then(result => {
        console.log('result===', result)
        menuTree.value = result[0].children
      })
    }
    fetchData()
    let aaa = ref(_$t('btn.copy'))
    return {
      menuTree,
      handleDrop,
      fetchData,
      actions,
      itemActions,
      handleDoAction,
      aaa
    }
  }
  // data () {
  //   return {
  //     actions: [
  //       {
  //         label: $t('btn.create'),
  //         // label: '创建',
  //         value: `${RESOURCE}:${CREATE}`
  //       }
  //     ]
  //   }
  // }
}
</script>

<style lang="stylus" scoped>
.menu-page :deep(.list-layout > .list)
  overflow auto
.tree-item-list
  border-top 1px solid #eee
  font-size 12px
  line-height 30px
  :deep(.el-tree-node__content)
    border-bottom 1px solid #eee
    padding 5px 0
.tree-item
  width 100%
  height 100%
:deep(.actions)
  margin-bottom 14px
.tree-item
  width 100%
  height 100%
  position relative
  .tree-item__info
    position absolute
    display flex
    left 200px
    top 0
    z-index 100
    :deep(.el-button)
      padding 0 5px
:deep(.el-tree-node__children)
  .tree-item__info
    left 182px
</style>
