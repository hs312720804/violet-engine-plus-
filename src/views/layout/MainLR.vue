<template>
  <el-container>
    <el-drawer
      v-if="!isShowMenu"
      v-model="drawer"
      direction="ltr"
      size="200"
      :with-header="false"
    >
      <div :class="isCollapseMenu ? 'aside__menu aside__menu_collapse' : 'aside__menu'">
        <div class="aside__menu-main">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <c-menu
              :default-active="route.name"
              :items="menu || defaultMenu"
              :is-collapse="isCollapseMenu"
            >
            </c-menu>
          </el-scrollbar>
        </div>
      </div>
    </el-drawer>
    <div v-if="isShowMenu" :class="isCollapseMenu? 'aside__menu aside__menu_collapse' : 'aside__menu'">
      <div class="aside__menu-main">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <c-menu
            :default-active="route.name"
            :items="menu || defaultMenu"
            :is-collapse="isCollapseMenu"
            background-color="#282c34"
            text-color="rgba(255,255,255,0.7)"
          >
          </c-menu>
        </el-scrollbar>
      </div>
    </div>
    <el-container direction="vertical" class="right-main">
      <el-header
        class="header"
      >
        <el-button
          class="collpase-btn"
          type="text"
          :icon="isCollapseMenu? Expand : Fold"
          @click="handleToggleMenu"
        >
        </el-button>

        <SiteName :name="siteInfo?.siteName"></SiteName>

        <div class="c-breadcrumb">
          <span>&nbsp;&nbsp;/</span>
          <c-breadcrumb
            class="breadcrumb"
            :items="breadcrumb"
          ></c-breadcrumb>
        </div>
        <Screenfull></Screenfull>
        <div class="user-info">
          <el-dropdown :hide-on-click="false" @command="handleDropdownCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-cc-user"></i>
              {{ store.state.user.name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-icon><arrow-down></arrow-down></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="account">{{ $t('accountInfo') }}</el-dropdown-item>
                <el-dropdown-item command="logout">{{ $t('btn.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="system-setting" @click="$emit('set-layout', true)">
          <!-- <i class="el-icon-setting"></i> -->
          <el-icon :size="20"><setting></setting></el-icon>
        </div>
      </el-header>
      <c-tag-nav
        v-show="basic?.isShowTagNav"
        v-if="device !== 'mobile'"
        ref="tagRef"
        :init-tags="initTags"
        theme="gray-tab"
      ></c-tag-nav>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType  } from 'vue'
import { useRouter, useRoute, RouteRecordRaw } from 'vue-router'
import { CMenuItems, CTagNav } from '@ccprivate/admin-toolkit-plus'

import { useStore } from '@/store'
import { $logout } from '@/auth'

import SiteName from '@/views/layout/SiteName.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import { UIBasic } from './Index.vue'

import useMainWindowResize,{ HeaderDropdownCommand, DeviceChangeMethods } from '@/hooks/useMainWindowResize'
import useUserSiteInfo from '@/hooks/useUserSiteInfo'

import { Fold, Expand } from '@element-plus/icons-vue'

export default defineComponent({
  components: {
    Screenfull,
    SiteName
  },
  props:{
    menu: {
      type: Array as PropType<Array<CMenuItems>>,
      default(){
        return undefined
      }
    },
    basic:{
      type: Object as PropType<UIBasic>,
      default(){
        return undefined
      }
    }
  },
  emits: ['click', 'set-layout', 'command'],
  setup() {

    const store = useStore()
    const route = useRoute()
    const $router = useRouter()

    const siteInfo = computed (() => store.state.app.site)

    const defaultMenu = computed(() => {
      const mainRoute = $router.options.routes.find(item => {
        return item.path === '/'
      })
      let items

      if(mainRoute){
        function gen ({ name, meta = {}, children }: RouteRecordRaw ) {
          if (!meta.hideInMenu) {
            const currentMenuItem: CMenuItems = {
              title: meta.title as string,
              icon: meta.icon as string,
              route: name as string
            }
            if (children) {
              currentMenuItem.children = children.reduce((result: Array<CMenuItems>, item) => {
                const menuItem = gen(item)
                if (menuItem) {
                  result.push(menuItem)
                }
                return result
              }, [])
            }
            return currentMenuItem
          }
        }
        items = gen(mainRoute)?.children
      }

      return items
    })


    const deviceChangeMethods: DeviceChangeMethods = device => {
      if (device === 'miniScreen') {
        store.commit('app/OPEN_MENU')
        store.commit('app/SET_MENU_COLLAPSE', true)
      } else if (device === 'mobile') {
        store.commit('app/CLOSE_MENU')
        store.commit('app/SET_MENU_COLLAPSE', true)
      } else {
        store.commit('app/OPEN_MENU')
      }
    }
    const { isCollapseMenu, isShowMenu, device } = useMainWindowResize({ deviceChangeMethods })
    const tagRef = ref<InstanceType<CTagNav>>()
    const { breadcrumb, initTags } = useUserSiteInfo({ tagRef })

    let drawer = ref(false)
    const handleToggleMenu = () => {
      if (device.value === 'mobile') {
        drawer.value = true
        store.commit('app/SET_MENU_COLLAPSE', false)
      } else {
        store.commit('app/TOGGLE_MENU')
      }
    }

    const handleDropdownCommand = (command:HeaderDropdownCommand) => {
      if (command === 'logout') {
        $logout().then(() => {
          $router.push({ name: 'login' })
        })
      }
      $router.push({ name: command })
    }


    return {
      breadcrumb,
      isCollapseMenu,
      isShowMenu,
      drawer,
      device,
      siteInfo,
      initTags,
      defaultMenu,
      handleDropdownCommand,
      handleToggleMenu,
      route,
      store,
      tagRef,
      Fold,
      Expand
    }

  }

})
</script>

<style lang="stylus">
.user-info
  margin-left 20px
.aside__menu
  min-height 100vh
  background $--side-menu-bg
.aside__menu:not(.aside__menu_collapse)
  width 200px
.aside__menu-main
  height 100vh
  display block
  -webkit-box-flex 1
  -ms-flex 1
  flex 1
  -ms-flex-preferred-size auto
  flex-basis auto
  -webkit-box-sizing border-box
  box-sizing border-box
  position relative
  overflow hidden
.aside__menu .menu:not(.el-menu--collapse)
  width 200px
  background $--side-menu-bg
.menu li
  position relative
.el-submenu__title
  color #fff
.aside__menu .el-menu-item.is-active,.el-menu--vertical .el-menu-item.is-active
  color #fff
  background #101419
  &:before
    width 3px
    background #eb603a
    content ' '
    display block
    position absolute
    left 0
    top 0
    height 100%
    transition background-color 1s ease
.el-menu-item
    color rgba(255,255,255,.65)
.el-menu-item, .el-submenu__title
  height 45px
  line-height 45px
.el-submenu .el-menu-item
  height 40px
  line-height 40px
.el-menu.el-menu--collapse,.el-menu--vertical .el-menu
  background $--side-menu-bg
.aside__menu .el-submenu__title:hover,.el-menu--vertical .el-submenu__title:hover, .aside__menu .el-menu-item:hover,.el-menu--vertical .el-menu-item:hover
  background #253245
.el-menu--vertical .el-submenu.is-opened .el-submenu__title
  background #2d2d2d
.aside__menu .el-submenu .el-menu
  background #1c222b
.aside__menu_collapse .el-submenu.is-active
  background #1c222b
.aside__menu_collapse .el-submenu.is-active:before
  width 3px
  background #eb603a
  content ' '
  display block
  position absolute
  left 0
  top 0
  height 100%
  transition background-color 1s ease
  z-index 100
.aside__menu .el-submenu.is-active:not(.is-opened)
  background #1e1e1e
  span
    color #fff
.aside__menu .el-submenu.is-active:not(.is-opened):before
  width 3px
  background #eb603a
  content ' '
  display block
  position absolute
  left 0
  top 0
  height 100%
  z-index 100
  transition background-color 1s ease
.el-menu--popup a
  color hsla(0,0%,100%,.7)
  text-decoration none
.aside__menu .el-menu-item.is-active a
  color #fff
.el-scrollbar
  height 100%
.scrollbar-wrapper
  overflow-x hidden !important
  .el-scrollbar__view
    height 100%
  .el-scrollbar__bar.is-vertical
    right 0px
.el-menu--horizontal
  margin-left 40px
</style>
<style lang="stylus" scoped>
:deep(.el-header)
  .collpase-btn
    &,
    &:hover,
    &:focus
      color #606266
  .collpase-btn
    border-radius 0
    padding 13px 15px
  .collpase-btn i
    font-size 24px
  .collpase-btn:hover, .collpase-btn:focus
    padding 13px 15px
.c-breadcrumb
  display flex
  color #C0C4CC
  margin-left 10px
  line-height 1
  padding-top 5px
  font-size 14px
  :deep(.breadcrumb)
    padding-top 0
  :deep(.el-breadcrumb__inner.is-link)
    font-weight normal
.right-main
  height 100vh
@media screen and (max-width:992px)
  .c-breadcrumb,.system-setting
    display none
  .c-fullscreen
    display none
  .user-info
    margin-left auto
    padding-right 10px
  .logo
    display none
</style>

