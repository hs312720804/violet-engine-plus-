<template>
  <div class="page-wrapper">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>

<style lang="stylus" scoped>
.page-wrapper
  height 100%
  position relative
  overflow-y auto
</style>
