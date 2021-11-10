<template>
  <TabPage>
    <!-- <template v-if="isShowList">
      <div class="aaa"></div>
      <el-form></el-form> -->
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
    <!-- </template> -->
    <!-- <div  class="aaa"> -->

    <!-- {{ isShowList }} -->
    <DetailPage
      v-if="!state.isShowList"
      :id="state.id"
      style="color:red;"
      :item="state.item"
      :init-mode="state.mode"
      :version="state.version"
      @upsert-end="handleUpsertEnd"
      @refresh-list="handleRefreshList"
      @go-back="handleGoBack"
    >
    </DetailPage>
    <!-- </div> -->
  </TabPage>
</template>

<script>
import { defineComponent, ref } from 'vue'
import ListPage from './MenuList.vue'
import DetailPage from './MenuDetail.vue'
import usePageControll from '@/hooks/usePageControll'
import { TabPage } from '@/views/modules'
import { menuDeleteService } from '@/services/menu'

export default defineComponent({
  components: {
    TabPage,
    ListPage,
    DetailPage
  },
  setup (props, ctx) {
    const listRef = ref(null)
    const {
      isShowList,
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
      handleUpsertEnd,
      isShowList
    }
  }
})
</script>

<style>

</style>
