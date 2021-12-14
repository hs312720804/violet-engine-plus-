<template>
  <div class="page-code--child">
    <ResourceList
      v-if="menuDetail"
      ref="listEL"
      :style="{ 'visibility': isShowList ? 'visible' : 'hidden' }"
      :menu="menuDetail"
      @action="handleOption"
    ></ResourceList>
    <ResourceContent
      v-if="!isShowList"
      :id="id"
      :mode="mode"
      :menu-id="menuId"
      :menu="menuDetail"
      :template="template"
      :title="title"
      :option-type="optionType"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack"
    ></ResourceContent>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      width="50%"
      @close="hiddenDialog"
    >
      <component
        :is="DialogPage[`${template}Dialog`]"
        v-if="dialogVisible"
        :id="id"
        :mode="mode"
        :row="row"
        :menu-id="menuId"
        :menu="menuDetail"
        @set-change="handleDialogChange"
        @set-end="hiddenDialog('ok')"
        @set-cancel="hiddenDialog"
      ></component>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{ $t('btn.ok') }}</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
import ResourceContent from './Page.vue'
import ResourceList from './List.vue'
import DialogPage from './dialog/Index'

import { baseIndexKey } from '@/hooks/baseList/usePageDataInit'
import initBaseListTemplate from '@/hooks/baseList/Index'

export default defineComponent({
  components: {
    ResourceList,
    ResourceContent
    // ...DialogPage
  },
  props: {
    menuId: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const listEL = ref<typeof ResourceList>()

    const {
      menuDetail,
      primaryKey, // 主键
      template,
      title,
      mode,
      optionType,
      id,
      row,
      // selected,
      isShowList,
      dialogVisible,
      handleUpsertEnd,
      handleOption,
      goBack,
      handleDialogChange,
      hiddenDialog,
      fetchMenuData } = initBaseListTemplate<typeof ResourceList>(listEL)

    provide(baseIndexKey, {
      primaryKey
    })

    fetchMenuData(props.menuId)

    return {
      menuDetail,
      primaryKey, // 主键
      template,
      title,
      mode,
      optionType,
      id,
      row,
      // selected,
      isShowList,
      dialogVisible,
      listEL,
      handleUpsertEnd,
      handleOption,
      goBack,
      handleDialogChange,
      hiddenDialog,
      DialogPage
    }
  }
})
</script>
<style lang="stylus" scoped>
:deep(.el-dialog__header)
  border-bottom 1px solid #EBEEF5
:deep(.el-dialog__body)
  padding 20px 20px
</style>
