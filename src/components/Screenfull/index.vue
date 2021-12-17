<template>
  <div class="c-fullscreen" @click="handleClick">
    <el-icon :size="20">
      <failed v-if="isFullscreen"></failed>
      <full-screen v-else></full-screen>
    </el-icon>
    <!-- <i :class="isFullscreen ? 'el-icon-cc-fullscreen-exit' : 'el-icon-cc-fullScreen'"></i> -->
  </div>
</template>

<script lang="ts">

import { defineComponent,ref  } from 'vue'
import  screenfull,{ Screenfull } from 'screenfull'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Screenfull',
  setup(){
    const isFullscreen = ref(false)
    if (screenfull.isEnabled) {
      screenfull.on('change',() =>{
        const sf = screenfull as Screenfull
        isFullscreen.value = sf.isFullscreen
      })
    }
    function  handleClick () {
      if (!screenfull.isEnabled) {
        return ElMessage.warning('you browser can not work')
      }
      screenfull.toggle()
    }
    return {
      isFullscreen,
      handleClick
    }
  }
})
</script>

<style lang="stylus" scoped>
.c-fullscreen
  font-size 20px
  height 60px
  width 20px
  line-height 60px
  margin-left auto
  cursor pointer
.c-fullscreen:hover
  color #000
</style>
