<template>
  <div>
    <c-card
      v-if="!showIcon"
      :title="title"
      class="add-page"
      @go-back="$emit('go-back')"
    >
      <!-- 返回 -->
      <template #actions><el-button type="text" @click="$emit('go-back')">返回</el-button></template>
      <component
        :is="PageComponentMap[pageName]"
        :id="id"
        :mode="mode"
        :menu-id="menuId"
        :menu="menu"
        @upsert-end="$emit('upsert-end')"
        @go-back="$emit('go-back')"
      ></component>
    </c-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue'
import PageComponentMap from './pages/Index'
import { MenuDetail } from '@/services/menu'

export default defineComponent({
  // props: ['id', 'menuId', 'menu', 'mode', 'template', 'title', 'optionType'],
  props: {
    id: {
      type: [Number, String],
      default: undefined
    },
    menuId: {
      type: Number,
      required: true
    },
    menu: {
      type: Object as PropType<MenuDetail>,
      default: () => undefined
    },
    mode: {
      type: String as PropType<CActionMode>,
      default: ''
    },
    title: {
      type: String as PropType<CActionName>,
      default: ''
    },
    // 模板路径
    template: {
      type: String as PropType<CActionTemplate>,
      default: ''
    },
    // 模板类型，弹窗Or详情
    optionType: {
      type: String as PropType<CActionTemplateType>,
      default: ''
    }
  },
  emits: {
    'go-back': () => true,
    'upsert-end': () => true
  },
  setup (props) {
    const showIcon = ref(false)
    const pageName = computed<CActionTemplateTrueName>(() => `${props.template}${props.optionType}`)
    return {
      PageComponentMap,
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
