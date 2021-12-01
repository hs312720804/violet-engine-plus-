<template>
  <el-container>
    <el-container direction="vertical">
      <el-header class="header">
        <!-- <el-button
          class="collpase-btn"
          type="text"
          :icon="isCollapseMenu? 'el-icon-cc-indent' : 'el-icon-cc-outdent'"
          @click="toggleMenu"
        >
        </el-button>-->
        <SiteName style="margin-left:14px" :name="siteInfo?.siteName"></SiteName>
        <c-menu
          v-if="basic?.topMenu"
          :default-active="route.name"
          :items="menu || defaultMenu"
          mode="horizontal"
        ></c-menu>
        <!-- <span>&nbsp;&nbsp;/</span>
        <Breadcrumb
            class="breadcrumb"
            :items="breadcrumb"
        />-->
        <Screenfull></Screenfull>
        <div class="user-info">
          <el-dropdown :hide-on-click="false" @command="handleDropdownCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-cc-user"></i>
              {{ store.state.user.name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="account">{{ $t('accountInfo') }}</el-dropdown-item>
                <el-dropdown-item command="logout">{{ $t('btn.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="system-setting" @click="$emit('set-layout', true)">
          <i class="el-icon-setting"></i>
        </div>
      </el-header>
      <el-container direction="layout">
        <el-container direction="vertical">
          <c-tag-nav
            v-show="basic?.isShowTagNav"
            ref="tagRef"
            :init-tags="initTags"
            theme="gray-tab"
          ></c-tag-nav>
          <el-main>
            <router-view v-slot="{ Component }">
              <keep-alive v-if="isKeepAlive">
                <component :is="Component" :key="route.path"></component>
              </keep-alive>
              <component :is="Component" v-else></component>
            </router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue'
import { useRouter, useRoute, RouteRecordRaw } from 'vue-router'
import { CMenuItems, CTagNav } from '@ccprivate/admin-toolkit-plus'

import { useStore } from '@/store'
import { $logout } from '@/auth'

import SiteName from '@/views/layout/SiteName.vue'
import Screenfull from '@/components/Screenfull/index.vue'

import { UIBasic } from './Index.vue'

import { HeaderDropdownCommand } from '@/hooks/useMainWindowResize'
import useUserSiteInfo from '@/hooks/useUserSiteInfo'

export default defineComponent({
  components: {
    Screenfull,
    SiteName
  },
  props: {
    menu: {
      type: Array as PropType<Array<CMenuItems>>,
      default () {
        return undefined
      }
    },
    basic: {
      type: Object as PropType<UIBasic>,
      default () {
        return undefined
      }
    }
  },
  emits: ['click', 'set-layout', 'command'],
  setup () {
    const store = useStore()
    const route = useRoute()
    const $router = useRouter()

    const siteInfo = computed(() => store.state.app.site)

    const isKeepAlive = computed(() => {
      const meta = route.meta
      return meta && meta.isCache !== false
    })

    const defaultMenu = computed(() => {
      const mainRoute = $router.options.routes.find(item => {
        return item.path === '/'
      })
      let items
      if (mainRoute) {
        function gen ({ name, meta = {}, children }: RouteRecordRaw) {
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


    const tagRef = ref<InstanceType<CTagNav>>()
    const { initTags } = useUserSiteInfo({ tagRef })

    const handleDropdownCommand = (command: HeaderDropdownCommand) => {
      if (command === 'logout') {
        $logout().then(() => {
          $router.push({ name: 'login' })
        })
      }
      $router.push({ name: command })
    }

    return {
      isKeepAlive,
      initTags,
      siteInfo,
      defaultMenu,
      handleDropdownCommand,
      route,
      store,
      tagRef
    }
  }

})
</script>

<style lang="stylus">
.breadcrumb
  margin-left 10px
  padding-top 8px
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
  color rgba(255,255,255,.65)
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
>>>.collpase-btn
  &,
  &:hover,
  &:focus
    color #fff
>>>.collpase-btn
  width 100%
  background #eb603a
  border-radius 0
  padding 10px 20px 10px
>>>.collpase-btn.el-button--small i
  font-size 20px !important
  color #fff
>>>.collpase-btn:hover, >>>.collpase-btn:focus
  color #fff
  background #e44907
</style>
