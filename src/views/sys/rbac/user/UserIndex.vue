<template>
  <TabPage>
    <ListPage
      v-show="state.isShowList"
      ref="listRef"
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
      @delete="handleDelete"
    >
    </ListPage>
    <DetailPage
      v-if="!state.isShowList"
      :id="state.id"
      :item="state.item"
      :init-mode="state.mode"
      :version="state.version"
      @upsert-end="handleUpsertEnd"
      @refresh-list="handleRefreshList"
      @go-back="handleGoBack"
    >
    </DetailPage>
  </TabPage>
</template>

<script>
import { ref } from 'vue'
import { service, TabPage } from '../../../../utlis/deps'
import ListPage from './UserList'
import DetailPage from './UserDetail'
import usePageControll from '../../use/usePageControll'
export default {
  components: {
    TabPage,
    ListPage,
    DetailPage
  },
  setup (props, ctx) {
    const listRef = ref(null)
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
    } = usePageControll({ idField: 'id', listRef, deleteService: ctx.root.$service.userDelete.bind(ctx.root) })
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
}
</script>

<style>

</style>
