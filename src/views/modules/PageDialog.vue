<template>
  <transition>
    <div v-show="visible" ref="dialogEl" class="page-dialog__wrapper">
      <!-- backdrop  -->
      <div class="backdrop"></div>
      <div :class="{ 'page-dialog': true, fullscreen: fullscreen }">
        <div class="page-dialog__header">
          <slot name="title">
            <span class="page-dialog__title">{{ title }}</span>
          </slot>
          <span class="page-dialog__close" @click="closeDialog">
            <slot name="close">
              <i class="el-icon-close"></i>
            </slot>
          </span>
        </div>
        <div class="page-dialog__body">
          <slot></slot>
        </div>
        <div class="page-dialog__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref,ComponentInternalInstance,watch, onUnmounted,inject  } from 'vue'
import { tabPageKey } from './TabPage.vue'
export default defineComponent({
  // inject: ['tabPage'],
  props: {
    title: {
      type: String,
      default: ''
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    visible:{
      type: Boolean,
      default: false
    }
  },
  emits:['open','close'],
  setup (props,{ emit }) {
    const id = ref((getCurrentInstance() as ComponentInternalInstance)?.uid + Math.random())
    const closed = ref(true)
    const dialogEl = ref<HTMLElement>()
    const tabPage = inject(tabPageKey)

    if (props.visible) {
      closed.value = false
      tabPage?.$el.append(dialogEl.value as HTMLElement)
      toggleLockScroll()
    }

    watch(()=>props.visible,val=>{
      if (val) {
        openDialog()
      } else {
        closeDialog()
      }
    })


    function openDialog () {
      emit('open')
      closed.value = false
      tabPage?.$el.append(dialogEl.value as HTMLElement)
      toggleLockScroll()
    }
    function closeDialog () {
      emit('close')
      closed.value = true
      toggleLockScroll()
    }
    function toggleLockScroll () {
      tabPage?.toggleLockScroll(props.visible, id.value)
    }

    onUnmounted(()=>{
      if (dialogEl.value && dialogEl.value.parentNode) {
        dialogEl.value.parentNode.removeChild(dialogEl.value)
      }
      if (!closed.value) {
        toggleLockScroll()
      }
    })

    return {
      dialogEl,
      closeDialog
    }
  }


})
</script>

<style lang="stylus">
.page-dialog__wrapper
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  z-index 3000
.page-dialog
  position relative
  display flex
  flex-direction column
  width 600px
  height 600px
  margin -300px auto
  top 50%
  background #fff
  z-index 1
.page-dialog__header
  padding 10px 20px 10px
.page-dialog__body
  padding 0 20px
  flex 1
  overflow auto
.page-dialog__close
  float right
  line-height 1.5
  cursor pointer
.fullscreen,
.backdrop
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  margin 0
  z-index -1
.backdrop
  background #000
  opacity 0.6
</style>
