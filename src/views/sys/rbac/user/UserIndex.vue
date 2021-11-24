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

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { TabPage } from '@/views/modules'
import ListPage from './UserList.vue'
import DetailPage from './UserDetail.vue'
import usePageControll from '@/hooks/usePageControll'
import { RBACUserInfo, userDelete } from '@/services/user'

export default defineComponent({
  components: {
    TabPage,
    ListPage,
    DetailPage
  },
  setup () {
    const listRef = ref<InstanceType<typeof ListPage>>()
    // function del () {
    //   console.log(data2)
    //   return Promise.resolve(1)
    // }
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
    } = usePageControll<RBACUserInfo>({ listRef, deleteService: userDelete })

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
