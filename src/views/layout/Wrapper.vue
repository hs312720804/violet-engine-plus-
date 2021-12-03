<template>
  <router-view v-slot="{ Component }">
    <keep-alive v-if="isKeepAlive">
      <component :is="Component" :key="route.path"></component>
    </keep-alive>
    <component :is="Component" v-else></component>
  </router-view>
</template>
<script lang="ts">
import { defineComponent,computed } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  props:{
    menuId:{
      type:Number,
      default:undefined
    }
  },
  setup(){
    const route = useRoute()
    const isKeepAlive = computed(() => {
      const meta = route.meta
      return meta && meta.isCache !== false
    })
    return {
      route,
      isKeepAlive
    }
  }
})
</script>
