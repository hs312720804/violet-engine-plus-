<template>
  <div class="main-layout">
    <div v-show="!isContentOnly" class="right" :style="{width: rightWidth}">
      <slot name="right"></slot>
    </div>
    <div class="left">
      <div v-show="!isContentOnly" class="header" :style="{height: headerHeight}">
        <slot name="header"></slot>
      </div>
      <div v-show="!isContentOnly" class="nav" :style="{height: navHeight}">
        <slot name="nav"></slot>
      </div>
      <div class="content">
        <slot name="content"> </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['headerHeight', 'navHeight', 'rightWidth', 'isContentOnly'],
  setup (props) {
    return {
    }
  }
}
</script>

<style lang="stylus" scoped>
.main-layout
  display flex
  height 100vh
  width 100vw
.right
  width 200px
  height 100vh
  background #eee
  overflow auto
.left
  width auto
  min-width 400px
  flex 1
  display flex
  flex-direction column
  .header
    width 100%
    height 60px
    border-bottom solid 1px #e6e6e6
  .content
    width 100%
    height auto
    flex 1

</style>
