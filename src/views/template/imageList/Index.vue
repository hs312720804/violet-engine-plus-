<template>
  <div class="page-code--child">
    <ResourceList
      v-if="menuDetail"
      ref="list"
      :style="{'visibility': isShowList ? 'visible' : 'hidden'}"
      :menu="menuDetail"
      @option="handleOption"
      @action="handleAction"
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
      :selected="selected"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack"
    ></ResourceContent>
    <el-dialog
      v-model:visible="dialogVisible"
      :title="title"
      width="50%"
    >
      <component
        :is="template"
        :id="id"
        :mode="mode"
        :menu-id="menuId"
        :menu="menuDetail"
      >
      </component>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="dialogVisible = false">{{ $t('btn.ok') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import ResourceContent from './Page.vue'
import ResourceList from './List.vue'
import DialogPage from './dialog/index'
export default defineComponent({
  components: {
    ResourceList,
    ResourceContent,
    ...DialogPage
  },
  provide () {
    return {
      baseIndex: this
    }
  },
  props: {
    menuId: {
      type: [Number,String],
      default:undefined
    }
  },
  setup(props){

    fetchMenuData(props.menuId)

    this.$bus.$on('go-back', () => {
      this.isShowList = true
    })

    function disposalField (fields, useType) {
      return fields.filter(item => {
        if ('use' in item && item.use.length > 0) {
          const bool = item.use.some(num => {
            return num === useType
          })
          if (bool) {
            return item
          }
        } else {
          return item
        }
      })
    }
    function fetchMenuData (id) {
      this.$service.getMenusDetailService({ id }).then(data => {
        this.menuDetail = data
      })
    }
    function handleUpsertEnd () {
      this.isShowList = true
      this.mode = 'list'
      this.$refs.list.fetchData()
    }
    function handleOption (data) {
      this.template = data.option[2]
      this.title = data.option[0]
      this.mode = data.option[4]
      if ('row' in data) {
        this.id = data.row.id
      }
      this.optionType = data.option[1]
      if (data.option[1] === 'Page') {
        this.isShowList = false
      }
      if (data.option[1] === 'Dialog') {
        this.dialogVisible = true
      }
    }
    function handleAction (data) {
      this.template = data.option[2]
      this.title = data.option[0]
      this.mode = data.option[3]
      if ('row' in data) {
        this.id = data.row.id
      }
      if ('selected' in data) {
        this.selected = data.selected
      }
      this.optionType = data.option[1]
      if (data.option[1] === 'Page') {
        this.isShowList = false
      }
      if (data.option[1] === 'Dialog') {
        this.dialogVisible = true
      }
    }
    function goBack () {
      this.isShowList = true
      this.mode = 'list'
      this.optionType = ''
      this.id = undefined
    }
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      template: '',
      title: '',
      menuDetail: '',
      dialogVisible: false,
      optionType: '',
      selected: []
    }
  }
})
</script>
