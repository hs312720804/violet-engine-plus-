<template>
  <div class="content-actions">
    <el-button-group>
      <el-button
        v-for="item in finalActions"
        :key="item.value"
        :disabled="disabled"
        :type="item.type || buttonType"
        @click="handleDoAction(item)"
      >
        {{ item.label }}
      </el-button>
    </el-button-group>
  </div>
</template>

<script>
// import { service } from '../utlis/deps'
import { useStore } from '@/store'
export default {
  props: {
    buttonType: {
      default () {
        return 'primary'
      }
    },
    disabled: {
      default () {
        return false
      }
    },
    actions: {
      type: Array,
      default () {
        return []
      }
    }
  },
  emits: [
    'do-action'
  ],
  setup (props, ctx) {
    const $store = useStore()

    /**
     * 该处采用高阶函数形式返回 拿到自定义指令引用函数参数
     * @param item
     * @returns {Function}
     */
    function handleDoAction (item) {
      ctx.emit('do-action', item.value)
    }
    const userAccessMap = $store.state.app.access || {}
    const finalActions = props.actions.filter(item => userAccessMap[item.value])
    return {
      handleDoAction,
      finalActions
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
