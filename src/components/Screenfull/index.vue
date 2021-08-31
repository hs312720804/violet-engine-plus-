<template>
  <div class="c-fullscreen" @click="click">
    <i :class="isFullscreen ? 'el-icon-cc-fullscreen-exit' : 'el-icon-full-screen'"></i>
  </div>
</template>

<script>

import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data () {
    return {
      isFullscreen: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    click () {
      if (!screenfull.isEnabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
      screenfull.on('change', () => {
        if (screenfull.isFullscreen) {
          this.isFullscreen = true
        } else {
          this.isFullscreen = false
        }
      })
    },
    init () {
      if (screenfull.enabled) {
        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen
        })
      }
    }
  }
}
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
