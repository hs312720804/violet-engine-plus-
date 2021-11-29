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
      v-if="!isShowList || optionType === 'Confirm'"
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
      v-model:visible="dialogVisible"
      :title="title"
      width="50%"
      @close="hiddenDialog"
    >
      <component
        :is="`${template}Dialog`"
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
import { evil as functionEvil } from '@/utlis/common'
import { MenuDetail,MenuFields, getMenusDetailService } from '@/services/menu'

import { BaseListRow, baseIndexKey } from '@/hooks/baseList/usePageDataInit'


export default defineComponent({
  components: {
    ResourceList,
    ResourceContent,
    ...DialogPage
  },
  // provide () {
  //   return {
  //     baseIndex: this
  //   }
  // },
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

    const menuDetail = ref<MenuDetail>()
    const primaryKey = ref('')
    const optionType = ref<CActionTemplateType>() // 模板类型，弹窗Or详情
    const template = ref<CActionTemplate>('') // 模板路径
    const title = ref<CActionName>('')
    const mode = ref<CActionMode>('create')
    const row = ref<BaseListRow>()
    // const selected = ref<Array<BaseListRow>>([])
    const id = ref()
    const isShowList = ref(true)
    const dialogVisible = ref(false)
    const dialogChang = ref(false) // 弹窗数据改动后是否有保存，如果已保存设置为true, 关闭弹窗后重新加载页面。
    const listEL = ref<typeof ResourceList>()
    function fetchMenuData (id:number) {
      getMenusDetailService({ id }).then(data => {
        menuDetail.value = data
        const fields = functionEvil<Array<MenuFields<BaseListRow>>>(menuDetail.value.fields)
        const primaryField = fields.filter(field => {
          return 'primaryKey' in field && field.primaryKey === 1
        })
        primaryKey.value = primaryField.length > 0 ? (primaryField[0].prop as string) : 'id'
      })
    }
    function handleUpsertEnd () {
      isShowList.value = true
      mode.value = 'list'
      listEL.value?.fetchData()
    }
    const handleOption: COptionActions<BaseListRow> =  function  (data) {
      template.value = data.option[2] as CActionTemplate
      title.value = data.option[0]
      mode.value = data.option[4]
      if (data.row) {
        row.value = data.row
        id.value = data.row[primaryKey.value]
      }
      // if (data.selected) {
      //   selected.value = data.selected
      // }
      optionType.value = data.option[1] as CActionTemplateType
      if (data.option[1] === 'Page') {
        isShowList.value = false
      }
      if (data.option[1] === 'Dialog') {
        dialogVisible.value = true
      }
    }
    // function handleAction (data) {
    //   this.template = data.option[2]
    //   this.title = data.option[0]
    //   this.mode = data.option[3]
    //   if ('row' in data) {
    //     this.id = data.row[this.primaryKey]
    //   }
    //   if ('selected' in data) {
    //     this.selected = data.selected
    //   }
    //   this.optionType = data.option[1]
    //   if (data.option[1] === 'Page') {
    //     this.isShowList = false
    //   }
    //   if (data.option[1] === 'Dialog') {
    //     this.dialogVisible = true
    //   }
    // }
    function goBack () {
      isShowList.value = true
      mode.value = 'list'
      optionType.value = ''
      id.value = undefined
    }
    function hiddenDialog (val?:'ok') {
      mode.value = 'list'
      optionType.value = ''
      id.value = undefined
      dialogVisible.value = false
      if (val === 'ok' || dialogChang.value) {
        listEL.value?.fetchData()
      }
      if (dialogChang.value) {
        dialogChang.value = false
      }
    }
    function handleDialogChange (msg:boolean) {
      dialogChang.value = msg
    }

    fetchMenuData(props.menuId)
    // this.$bus.$on('go-back', () => {
    //   this.isShowList = true
    // })

    provide(baseIndexKey, {
      primaryKey: primaryKey.value
    })

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
      hiddenDialog
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
