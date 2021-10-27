<template>
  <div>
    <c-card
      :title="title"
      @go-back="$emit('go-back')"
      v-if="!showIcon"
      class="add-page"
    >
      <component
        :is="pageName"
        :mode="mode"
        :id="id"
        :menu-id="menuId"
        :menu="menu"
        @upsert-end="$emit('upsert-end')"
        @go-back="$emit('go-back')"
      >
      </component>
    </c-card>
  </div>
</template>
<script>
import Temp from './pages/index.js'
export default {
  components: {
    ...Temp
  },
  data () {
    return {
      showIcon: false
    }
  },
  props: ['id', 'menuId', 'menu', 'mode', 'template', 'title', 'optionType', 'selected'],
  computed: {
    pageName () {
      return this.template + this.optionType
    }
  },
  created () {
  }
}
</script>
<style lang="stylus" scoped>
.show-one-line
  display flex
  >>> button
    height 32px
    margin-left 10px
.el-dialog--height
  max-height 400px
  overflow auto
</style>
