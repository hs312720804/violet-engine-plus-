<template>
  <div>
    <MainLR
      v-if="uiSetting.layout === 'default'"
      ref="mlr"
      :basic="uiSetting.basic"
      @set-layout="setLayout"
    >
    </MainLR>
    <MainTLR
      v-if="uiSetting.layout === 'tlr'"
      ref="mtlr"
      :basic="uiSetting.basic"
      @set-layout="setLayout"
    >
    </MainTLR>
    <MainTB
      v-if="uiSetting.layout === 'tb'"
      ref="mtb"
      :basic="uiSetting.basic"
      @set-layout="setLayout"
    >
    </MainTB>
    <el-drawer
      v-model="isShowSetting"
      title="我是标题"
      :with-header="false"
      size="260"
    >
      <div v-show="isShowSetting" class="setting_side transition-box">
        <h5>基础设置</h5>
        <div class="tagnav_switch">
          标签导航
          <el-switch
            v-model="uiSetting.basic.isShowTagNav"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleTagNav"
          >
          </el-switch>
          <br>
          头部菜单
          <el-switch
            v-model="uiSetting.basic.topMenu"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleTagNav"
          >
          </el-switch>
        </div>
        <h5>布局</h5>
        <div class="layout">
          <div class="default" @click="handleSelectLayout('default')">
            <p>
              <span></span>
              <b></b>
            </p>
            布局一(响应式)
          </div>
          <div class="tlr" @click="handleSelectLayout('tlr')">
            <p>
              <span></span>
              <b>
                <small></small>
              </b>
            </p>
            布局二
          </div>
        </div>
        <div class="layout">
          <div class="tb" @click="handleSelectLayout('tb')">
            <p>
              <span></span>
            </p>
            布局三
          </div>
        </div>
        <el-button @click="handleBackDefault">恢复默认</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useStore } from '@/store'
import { AppUILayout } from '@/services/common'

import MainLR from './MainLR.vue'
import MainTLR from './MainTLR.vue'
import MainTB from './MainTB.vue'

export interface UIBasic  {
  isShowTagNav: boolean
  topMenu: boolean
}

interface UISetting {
  layout: AppUILayout
  basic: UIBasic
}

export default defineComponent({
  components: {
    MainLR,
    MainTLR,
    MainTB
  },
  props: {
    mode: {
      type: String,
      default: ''
    }
  },
  setup() {
    const store = useStore()

    const uiSettingDefault = reactive<UISetting>({
      layout: 'default',
      basic: {
        isShowTagNav: true, // 标签导航
        topMenu: true //  头部菜单
      }
    })
    let uiSetting = reactive<UISetting>({
      layout: 'default',
      basic: {
        isShowTagNav: true, // 标签导航
        topMenu: true //  头部菜单
      }
    })
    function handleBackDefault() {
      uiSetting = JSON.parse(JSON.stringify(uiSettingDefault))
    }

    const layoutMap = reactive<Array<AppUILayout>>(['default', 'tlr', 'tb'])
    const layout = store.state.app.site?.layout ?? 'default'
    layoutMap.indexOf(layout) > -1 ? uiSetting.layout = layout : uiSetting.layout = 'default'

    let isShowSetting = ref(false)
    const setLayout = (msg: boolean) => {
      isShowSetting.value = msg
    }

    const handleSelectLayout = (layout: AppUILayout) => {
      uiSetting.layout = layout
      // $appState.$set('uiSetting', this.uiSetting)
    }
    const handleTagNav = () => {
      // $appState.$set('uiSetting', this.uiSetting)
    }

    return {
      isShowSetting,
      uiSetting,
      setLayout,
      handleSelectLayout,
      handleTagNav,
      handleBackDefault
    }
  }
})
</script>
<style lang="stylus" scoped>
.layout
  display flex
  font-size 12px
  margin-bottom 10px
.layout>div
  width 50%
.layout .default p
  display flex
  height 60px
  margin 0 10px 6px 0
  background #f3f3f3
  span
    width 20%
    background #bbb
    display block
  b
    width 80%
    display block
    border 1px solid #eee
.layout .tlr p
  height 60px
  margin 0 10px 6px 0
  background #f3f3f3
  span
    background #bbb
    display block
    height 10px
  b
    display block
    small
      display block
      width 20px
      background #ddd
      height 50px
.layout .tb p
  height 60px
  margin 0 10px 6px 0
  background #f3f3f3
  span
    background #bbb
    display block
    height 10px
.layout p
  border 1px solid #bbb
  cursor pointer
.layout p:hover
  border-color #999 !important
</style>
