<template>
  <PageWrapper>
    <PageContentWrapper class="menu-page">
      <ListLayout>
        <template #actions>
          <ResrouceActions
            :actions="actions"
            @do-action="handleDoAction"
          >
          </ResrouceActions>
        </template>

        <template #list>
          <el-table
            :data="menuTree"
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
              prop="alias"
              label="别名"
            >
            </el-table-column>
            <el-table-column
              prop="path"
              label="路径"
            >
            </el-table-column>
            <el-table-column
              prop="status"
              label="启用"
              width="60px"
            >
              <template #default="scope">
                <el-tag v-if="scope.row.status === 'ENABLE'" type="success">是</el-tag>
                <el-tag v-else type="danger">否</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="template"
              label="模板"
            >
              <template #default="scope">
                {{ scope.row.template ? scope.row.template + '-' + scope.row.type : '' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="sort"
              label="排序"
              width="60px"
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
  emits:['edit'],
  setup (props, ctx) {
    // const _$t = ctx.root.$t.bind(ctx.root)
    // const service = ctx.root.$service
    const { t } = useI18n() // 获取 i18n 的 t
    const _$t = t
    const menuTree = ref([])

    const actions = [
      {
        label: _$t('btn.create'),
        value: `${RESOURCE}:${CREATE}`
      }
    ]
    const itemActions = [
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
      ctx.emit(eventName, { item, selected: [item] })
    }
    function fetchData () {
      menuGetListService().then(result => {
        menuTree.value = result[0].children
      })
    }
    fetchData()
    return {
      menuTree,
      fetchData,
      actions,
      itemActions,
      handleDoAction
    }
  }
  // data () {
  //   return {
  //     actions: [
  //       {
  //         label: this.$t('btn.create'),
  //         value: `${RESOURCE}:${CREATE}`
  //       }
  //     ]
  //   }
  // }
}
</script>

<style lang="stylus" scoped>
.menu-page >>> .list-layout > .list
  overflow auto
>>>.actions
  margin-bottom 14px
</style>
