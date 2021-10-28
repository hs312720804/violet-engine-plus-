<template>
  <div
    ref="tabPageEL"
    :class="{ 'tab-page-local': true, 'tab-page--lock-scroll': modals.length > 0 }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, InjectionKey, provide } from 'vue'

interface ToggleLockScroll {
  (val?: boolean, id?: string | number): void
}
export const tabPageKey: InjectionKey<{ toggleLockScroll: ToggleLockScroll; $el: HTMLElement; }> = Symbol()

export default defineComponent({

  setup () {

    const modals = ref<Array<string | number>>([])
    const tabPageEL = ref<HTMLElement>()

    let originScrollTop = 0


    const toggleLockScroll: ToggleLockScroll = function (val, id) {
      // const modals = modals.value
      const $el = tabPageEL.value as HTMLElement
      if (val) {
        if (modals.value.length <= 0) {
          originScrollTop = $el.scrollTop
        }
        if (id !== undefined && modals.value.indexOf(id) === -1) {
          modals.value.push(id)
        }
        $el.scroll({ top: 0 })
      } else {
        modals.value = modals.value.filter(item => item !== id)
        if (modals.value.length <= 0 && originScrollTop !== undefined) {
          $el.scroll({ top: originScrollTop })
        }
      }
    }

    provide(tabPageKey, {
      toggleLockScroll,
      $el: tabPageEL.value
    })

    return {
      modals: [],
      tabPageEL
    }
  }
})
</script>

<style lang="stylus" scoped>
.tab-page-local
  position relative
  height 100%
  overflow auto
.tab-page--lock-scroll
  overflow hidden
</style>
