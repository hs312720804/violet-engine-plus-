<template>
  <div>
    <div class="img-container">
      <slot></slot>
      <img src="http://www.coocaa.com/img/index/section1_entry_img3.jpg" />
    </div>
    <div class="text">
      <div class="prize">199.00</div>
      {{ row.name }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardItem',
  props: ['row'],
  data () {
    return {

    }
  }
}
</script>

<style lang="stylus" scoped>
.card-content
  img
    width 100%
    display block
  .text
    background #fff
    padding 10px 14px
    line-height 1.4
    font-size 14px
    .prize
      color #fc4c02
      font-size 18px
.img-container
  position relative
</style>
