<template>
  <div class="login-layout" :style="{backgroundImage: backgroundImage}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['backgroundImage']
}
</script>

<style lang="stylus" scoped>
.login-layout
  height 100vh
  width 100vw
  overflow hidden
  background-image linear-gradient(to right, rgb(234, 147, 17), rgb(234, 90, 17))
</style>
