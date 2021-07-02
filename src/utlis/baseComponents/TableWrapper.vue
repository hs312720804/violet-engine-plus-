<template>
  <div class="cc-table-wrapper">
    <slot></slot>
    <div
      class="cc-table-context-menu"
      :style="menuStyle"
    >
      <ul class="column-status">
        <li
          v-for="(item, index) in columns"
          :key="index"
          @click="$emit('toggle-column', index)"
        >
          <span class="column-status__icon">
            <i v-show="hiddenColumns.indexOf(index) === -1" class="el-icon-check"></i>
          </span>
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showContextMenu: false,
      menuStyle: {
        top: 0,
        left: 0,
        display: 'none'
      }
    }
  },
  props: ['columns', 'hiddenColumns'],
  methods: {
    handleShowContextMenu (event) {
      event.stopPropagation()
      event.preventDefault()
      const menuStyle = this.menuStyle
      menuStyle.top = event.y + 'px'
      menuStyle.left = event.x + 'px'
      menuStyle.display = 'block'
    },
    handleHideContextmenu () {
      this.menuStyle.display = 'none'
    },
    addEventListener () {
      const $el = this.$el
      $el.querySelector('thead').addEventListener('contextmenu', this.handleShowContextMenu)
      $el.querySelector('.cc-table-context-menu').addEventListener('mouseleave', this.handleHideContextmenu)
    },
    removeEventListener () {
      const $el = this.$el
      $el.querySelector('thead').removeEventListener('contextmenu', this.handleShowContextMenu)
      $el.querySelector('.cc-table-context-menu').removeEventListener('mouseleave', this.handleHideContextmenu)
    }
  },
  mounted () {
    this.addEventListener()
  },
  destroyed () {
    this.removeEventListener()
  }
}
</script>

<style lang="stylus" scoped>
.cc-table-context-menu
  position fixed
  background #fff
  border 1px solid #ccc
  font-size 14px
.cc-table-wrapper
  position relative
.column-status
  margin 0
  padding 10px
  list-style none
  li
    cursor pointer
.column-status__icon
  display inline-block
  width 15px
  margin-right 10px

</style>
