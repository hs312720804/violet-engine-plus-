<template>
  <router-view></router-view>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props:{
    menuId:{
      type:Number,
      default:undefined
    }
  }
})
</script>
