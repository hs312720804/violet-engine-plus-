<template>
  <div class="content-card">
    <div v-if="title !== undefined" class="content-card__header">
      <slot name="title">{{ title }}</slot>
      <div class="actions">
        <slot name="actions">
          <el-button type="text" @click="$emit('go-back')">返回</el-button>
        </slot>
      </div>
    </div>
    <div class="content-card__main">
      <div class="content-actions-wrapper">
        <slot name="resource-actions"></slot>
      </div>
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  emits: ['go-back']
  // setup (props, ctx) {
  // }
})
</script>

<style lang="stylus" scoped>
.content-card__main
    position relative
    padding 15px
    background #fff
.content-card__header
    position relative
    height 50px
    text-indent 20px
    line-height 50px
    font-size 18px
    font-weight bold
    border-bottom 1px solid #f0f0f0
    background #fff
    .actions
        padding 0 20px
        float right
.content-actions-wrapper :deep(>*:first-child)
    margin-bottom 15px
</style>
