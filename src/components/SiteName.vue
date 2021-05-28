<template>
  <div class="logo" direction="vertical">
    <a
      class="logo__img"
      :href="siteUrl"
    >
      <span
        :style="{
          backgroundImage: logo.top.image ? 'url(' + logo.top.image + ')': ''
        }"
      ></span>
      <div class="site-name">{{ name }}</div>
    </a>
  </div>
</template>
<script>
import $constants from '@/utlis/consts'
export default {
  props: {
    name: {
      type: String,
      default: '站点名称'
    },
    siteUrl: {
      type: String,
      default: '/'
    }
  },
  computed: {
    logo () {
      return $constants.evil(this.$store.state.app.site.logo)
    }
  }
}
</script>
<style lang="stylus" scoped>
.logo
  height 50px
  line-height 50px
  font-size 18px
  a.logo__img
    color #606266
    span
      display inline-block
      width 180px
      height 50px
      background url(@/assets/images/logo-red.png) no-repeat center
      background-size 100%
      float left
    .site-name
      display inline-block
      height 50px
      line-height 50px
      font-style normal
      padding-left 8px
</style>
