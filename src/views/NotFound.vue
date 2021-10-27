<template>
  <div class="notfound">
    <i></i>
    <span class="c404">404</span>
    <span class="text">{{ $t('message.notFound') }}</span>
    <el-button type="primary" size="normal" @click="$router.push({path: '/'})">{{ $t('btn.backHome') }}</el-button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>
<style lang="stylus" scoped>
.notfound
  padding-top 100px
  text-align center
.notfound i
  display block
  height 64px
  width 64px
  background-image url(../assets/notfound.png)
  margin 0 auto
.notfound
  span
    color #222a35
  .text
    display block
    text-align center
    line-height 60px
    margin-bottom 30px
  .c404
    font-size 200px
    font-weight bolder
    line-height 200px
</style>
