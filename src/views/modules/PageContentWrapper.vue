<template>
  <div class="page-content-wrapper">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>

<style lang="stylus" scoped>
.page-content-wrapper
  position absolute
  width 100%
  height 100%
  overflow-y auto
  top 0
</style>
