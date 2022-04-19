<template>
  <el-dialog
    v-model="show.is"
    title="选择图标"
    width="60%"
    top="4vh"
    append-to-body
    custom-class="icon-choose-wrap"
  >
    <!-- <div class="search">
      <el-input
        v-model="icon"
        clearable
        prefix-icon="search"
        type="text"
        placeholder="请输入图标名称"
        @blur="searchIcons"
      ></el-input>
    </div> -->
    <!-- <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="elem-icons" name="elemIcon"></el-tab-pane>
      <el-tab-pane v-if="showDefine" label="define-icons" name="define"></el-tab-pane> -->
    <el-scrollbar style="height: calc(90vh - 165px)">
      <c-icon-select
        @get-icon="$emit('getIcon', $event)"
      ></c-icon-select>
    </el-scrollbar>
    <!-- </el-tabs> -->
  </el-dialog>
</template>
<script>
import { toRefs, ref, defineComponent } from 'vue'
export default defineComponent({
  name: 'Icons',
  props: {
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Object,
      default () {
        return { is: false }
      }
    },
    showDefine: {
      type: Boolean,
      default: true
    }
  },
  emits: ['getIcon' ],
  setup (props, { emit }) {
    // let { show } = toRefs(props)
    let iconList = ref([])

    // function searchIcons () {
    //   // const list = this.activeName === 'elemIcon' ? elementIcons : svgIcons
    //   this.iconList = list.filter(item => {
    //     if (item.indexOf(this.icon) > -1) {
    //       return item
    //     }
    //   })
    // }

    return {
      // searchIcons,
      iconList
    }
  }

})
</script>
<style lang="stylus" scoped>
:deep(.el-icon)
  font-size 30px
</style>
