<template>
  <div class="notfound">
    <el-icon size="50"><sunset></sunset></el-icon>
    <span class="text">{{ $t('message.notTemplate') }}</span>
  </div>
</template>
<script>
export default {

}
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
</style>
