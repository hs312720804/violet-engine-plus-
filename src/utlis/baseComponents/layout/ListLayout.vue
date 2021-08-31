<template>
  <div class="list-layout">
    <div class="filter">
      <slot name="filter"></slot>
    </div>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
    <div ref="$list" class="list">
      <slot name="list" :height="height"></slot>
    </div>
    <div class="pagination">
      <slot name="pagination"></slot>
    </div>
  </div>
</template>

<script>
// import { ref, onMounted, onBeforeUnmount, onActivated } from '@vue/composition-api'
import { ref, onMounted, onBeforeUnmount, onActivated } from 'vue'
export default {
  setup (props, ctx) {
    const heightRef = ref(undefined)
    const $list = ref(null)
    const setHeight = () => {
      // ctx.root.$nextTick(() => {
      //   const el = $list.value
      //   heightRef.value = el.clientHeight
      // })
      heightRef.value = 600
    }

    onMounted(() => {
      setHeight()
      window.addEventListener('resize', setHeight)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', setHeight)
    })
    onActivated(() => {
      setHeight()
    })
    return {
      height: heightRef,
      $list: $list
    }
  }
}
</script>

<style lang="stylus" scoped>
.list-layout
  height 100%
  display flex
  flex-direction column
.list
  flex 1
  overflow hidden
// .pagination
//   margin-top 10px
</style>
