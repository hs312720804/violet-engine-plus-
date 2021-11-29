<template>
  <div>
    <div>
      <el-checkbox
        class="access-item"
        v-for="item in row.operations"
        :value="item.status === 'ENABLE'"
        @input="handleToggleOperationStatus(item)"
        :key="item.id"
      >
        {{ item.name }}
      </el-checkbox>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import consts from '@/utlis/consts'
export default {
  props: {
    menu: {
      type: Object,
      default: () => {
        return {}
      }
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup (props, ctx) {
    const _$t = ctx.root.$t.bind(ctx.root)
    const inited = ref(false)
    const service = ctx.root.$service
    const api = consts.evil(props.menu.api)
    function handleShowDialog () {
      if (!inited.value) {
        inited.value = true
      }
    }
    function handleToggleOperationStatus (item) {
      item.status = item.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
      service.fetch({
        method: api.update[1],
        url: api.update[0],
        isJSON: false,
        data: {
          resourceOperationId: item.id,
          status: item.status
        }
      }).then(data => {
        ctx.root.$notify({
          title: _$t('message.operationSuccess'),
          message: data.msg,
          type: 'success'
        })
        ctx.emit('set-change', true)
      })
    }

    return {
      inited,
      handleShowDialog,
      handleToggleOperationStatus
    }
  }
}
</script>

<style lang="stylus" scoped>
.access-item
  margin 10px
.footer
  padding 10px
  text-align right
</style>
