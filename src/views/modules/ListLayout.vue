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

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, onActivated, nextTick } from 'vue'
export default defineComponent({
  setup () {
    const heightRef = ref<number | undefined>()
    const $list = ref<HTMLElement | null>()
    const setHeight = () => {
      nextTick(() => {
        const el = $list.value as HTMLElement
        heightRef.value = el.clientHeight
      })
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
})
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
