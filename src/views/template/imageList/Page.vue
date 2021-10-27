<template>
  <div>
    <component
      :is="pageName"
      v-if="optionType === 'Confirm'"
      :id="id"
      :mode="mode"
      :menu-id="menuId"
      :menu="menu"
      :selected="selected"
      @go-back="$emit('go-back')"
    >
    </component>
    <template v-if="optionType === 'Page'">
      <c-card
        v-if="!showIcon"
        :title="title"
        class="add-page"
        @go-back="$emit('go-back')"
      >
        <component
          :is="pageName"
          :id="id"
          :mode="mode"
          :menu-id="menuId"
          :menu="menu"
          @upsert-end="$emit('upsert-end')"
          @go-back="$emit('go-back')"
        >
        </component>
      </c-card>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent,computed } from 'vue'

import Temp from './pages/index'
export default defineComponent({
  components: {
    ...Temp
  },
  props: ['id', 'menuId', 'menu', 'mode', 'template', 'title', 'optionType', 'selected'],
  setup(props){
    const showIcon = false
    const pageName = computed(()=>props.template + props.optionType)
    return {
      showIcon,
      pageName
    }
  }
})
</script>
<style lang="stylus" scoped>
.show-one-line
  display flex
  :deep(button)
    height 32px
    margin-left 10px
.el-dialog--height
  max-height 400px
  overflow auto
</style>
