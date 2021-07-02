<template>
  <div :class="{'tab-page-local': true, 'tab-page--lock-scroll': modals.length > 0 }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modals: [],
      originScrollTop: undefined
    }
  },
  provide () {
    return {
      tabPage: this
    }
  },
  methods: {
    toggleLockScroll (val, id) {
      const modals = this.modals
      if (val) {
        if (modals.length <= 0) {
          this.originScrollTop = this.$el.scrollTop
        }
        if (modals.indexOf(id) === -1) {
          modals.push(id)
        }
        this.$el.scroll({ top: 0 })
      } else {
        this.modals = modals.filter(item => item !== id)
        if (this.modals.length <= 0 && this.originScrollTop !== undefined) {
          this.$el.scroll({ top: this.originScrollTop })
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.tab-page-local
  position relative
  height 100%
  overflow auto
.tab-page--lock-scroll
  overflow hidden
</style>
