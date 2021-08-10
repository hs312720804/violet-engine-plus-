<template>
  <TabPage>
    <!-- {{ state.isShowList }}
    {{ state.isShowList === true }}
    {{ !(state.isShowList) === false }} -->

    <template v-if="isShowList">
      <div class="aaa"></div>
      <el-form></el-form>
      <ListPage
        ref="listRef"
        @create="handleCreate"
        @read="handleRead"
        @edit="handleEdit"
        @copy="handleCopy"
        @delete="handleDelete"
      >
      </ListPage>
    </template>
    <!-- <div  class="aaa"> -->

    {{ isShowList }}
    <DetailPage
      v-if="!isShowList"
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
import { defineComponent, ref, onMounted } from 'vue'
import ListPage from './MenuList.vue'
import DetailPage from './MenuDetail.vue'
import usePageControll from '../../use/usePageControll'
import { TabPage } from '../../../../utlis/deps'
import { menuDeleteService } from '@/services/menu'

export default defineComponent({
  components: {
    TabPage,
    ListPage,
    DetailPage
  },
  setup (props, ctx) {
    const listRef = ref()

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
