<template>
  <TabPage>
    <ListPage
      v-if="state.isShowList"
      ref="listRef"
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
      @delete="handleDelete"
    ></ListPage>
    <DetailPage
      v-if="!state.isShowList"
      :id="state.id"
      :item="state.item"
      :init-mode="state.mode"
      :version="state.version"
      @upsert-end="handleUpsertEnd"
      @refresh-list="handleRefreshList"
      @go-back="handleGoBack"
    ></DetailPage>
  </TabPage>
</template>

<script lang="ts" >
import { defineComponent, ref } from 'vue'
import TabPage from '@/views/modules/TabPage.vue'
import ListPage from './DepartmentList.vue'
import DetailPage from './DepartmentDetail.vue'
import usePageControll from '../../use/usePageControll'
import { RBACDepartment, departmentDeleteService } from '@/services/department'

// implements String
export default defineComponent({
  components: {
    TabPage,
    ListPage,
    DetailPage
  },
  setup () {
    const listRef = ref<InstanceType<typeof ListPage>>()
    const {
      state,
      handleCreate,
      handleEdit,
      handleRead,
      handleDelete,
      handleCopy,
      handleRefreshList,
      handleGoBack,
      handleUpsertEnd
    } = usePageControll<RBACDepartment>({ idField: 'id', listRef, deleteService: departmentDeleteService })
    return {
      listRef,
      state,
      handleCreate,
      handleEdit,
      handleRead,
      handleDelete,
      handleCopy,
      handleRefreshList,
      handleGoBack,
      handleUpsertEnd
    }
  }
})
</script>
<style lang="stylus" scoped></style>
