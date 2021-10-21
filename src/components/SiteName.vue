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
<script lang="ts">
import { defineComponent,computed  } from 'vue'
import { useStore } from '@/store'
import { AppLogo } from '@/store/getters'
export default defineComponent({
  props: {
    name: {
      type: String,
      default: 'Site Name'
    },
    siteUrl: {
      type: String,
      default: '/'
    }
  },
  setup(){
    const store = useStore()
    const logo = computed<AppLogo>(()=> store.getters.appLog)

    return {
      logo
    }
  }
})
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
