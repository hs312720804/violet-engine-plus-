<template>
  <div style="height:calc(100vh - 170px);">
    <el-row class="card" :gutter="14">
      <el-alert
        title="提示：此站点为演示站点，请大家不要去修改系统设置和示例页面下的菜单。可以自行新建菜单或者修改除了系统设置和示例页面之外的菜单。"
        type="warning"
        :closable="false"
      ></el-alert>
    </el-row>
    <iframe
      src="http://172.20.155.102/violet/"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name:'Dashboard' })
</script>
