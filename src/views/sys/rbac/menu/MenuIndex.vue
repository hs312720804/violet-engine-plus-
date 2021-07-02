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
import ListPage from './MenuList.vue'
import DetailPage from './MenuDetail.vue'
import usePageControll from '../../use/usePageControll'
import { TabPage } from '../../../../utlis/deps'
import { menuDeleteService } from '@/services/menu'

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
    } = usePageControll({ idField: 'id', listRef, deleteService: menuDeleteService.bind(ctx.root) })
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
  },
  created () {
    console.log(this.$route)
  }
}
</script>

<style>

</style>
