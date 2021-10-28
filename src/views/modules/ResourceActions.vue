<template>
  <div class="content-actions">
    <!-- <el-button-group> -->
    <el-button
      v-for="item in finalActions"
      :key="item.value"
      v-debounce="[handleDoAction(item), 'click', 500]"
      :disabled="disabled"
      :type="item.type || buttonType"
    >
      {{ item.label }}
    </el-button>
    <!-- </el-button-group> -->
  </div>
</template>

<script lang="ts">
// import { service } from '../utlis/deps'
import { defineComponent, PropType } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  props: {
    buttonType: {
      type: String as PropType<CRBACButtonType>,
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    actions: {
      type: Array as PropType<Array<CRBACButtonAction>>,
      default: () => {
        return []
      }
    }
  },
  emits: ['do-action'],
  setup (props, { emit }) {
    const store = useStore()

    const userAccessMap = store.state.app.access || {}
    const finalActions = props.actions.filter(item => userAccessMap[item.value])
    /**
     * 该处采用高阶函数形式返回 拿到自定义指令引用函数参数
     */
    function handleDoAction (item: CRBACButtonAction) {
      return () => {
        emit('do-action', item.value)
      }
    }
    return {
      finalActions,
      handleDoAction
    }
  }
})
</script>

<style lang="stylus" scoped>
</style>
