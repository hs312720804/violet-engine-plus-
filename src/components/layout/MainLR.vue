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
              :default-active="$route.name"
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
            :default-active="$route.name"
            :items="menu || defaultMenu"
            :is-collapse="isCollapseMenu"
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
          :icon="isCollapseMenu? 'el-icon-cc-indent' : 'el-icon-cc-outdent'"
          @click="toggleMenu"
        >
        </el-button>
        <SiteName :name="siteInfo.siteName"></SiteName>
        <!-- <c-menu
          :default-active="$route.name"
          :items="menu || horizontalMenu"
          v-if="basic.topMenu"
          mode="horizontal"
        >
        </c-menu> -->
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
              {{ $store.state.user.name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">{{ $t('btn.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="system-setting" @click="$emit('set-layout', true)">
          <i class="el-icon-setting"></i>
        </div>
      </el-header>
      <c-tag-nav
        v-show="basic.isShowTagNav"
        v-if="device !== 'mobile'"
        ref="tag"
        :init-tags="initTags"
        theme="gray-tab"
      ></c-tag-nav>
      <el-main>
        <keep-alive>
          <router-view v-if="isKeepAlive" :key="$route.name"></router-view>
        </keep-alive>
        <router-view v-if="!isKeepAlive" :key="$route.name"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'

import SiteName from '@/components/SiteName.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import ResizeMixin from './mixin/ResizeHandler'
import { $logout } from '@/auth'

export default defineComponent({
  components: {
    Screenfull,
    SiteName
  },
  mixins: [ResizeMixin],
  props: ['menu', 'basic'],
  emits: ['click', 'set-layout', 'command'],
  setup() {
    const $store = useStore()
    const $router = useRouter()
    const $route = useRoute()

    let breadcrumb = reactive([])
    let isCollapseMenu = ref(false)
    let isShowMenu = ref(true)
    let drawer = ref(false)

    const sidebar = computed(() => {
      return $store.state.app.sidebar
    })

    const device = computed(() => {
      return $store.state.app.device
    })

    const siteInfo = computed (() => {
      return $store.state.app.site
    })

    const isKeepAlive = computed(() => {
      const meta = $route.meta
      return meta && meta.isCache !== false
    })

    const initTags = computed(() => {
      return []
      // return this.$appState.$storage(this.$store.state.user.name).$get('tags') || []
    })

    const defaultMenu = computed(() => {
      const mainRoute = $router.options.routes.find(item => {
        return item.path === '/'
      })
      function gen ({ name, meta = {}, children }) {
        if (!meta.hideInMenu) {
          const currentMenuItem = {
            title: meta.title,
            icon: meta.icon,
            route: name
          }
          if (children) {
            currentMenuItem.children = children.reduce((result, item) => {
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
      const items = gen(mainRoute).children
      // console.log(JSON.stringify(items))
      console.log('items==>', items)
      return items
    })

    const horizontalMenu = computed(() => {
      const mainRoute = $router.options.routes.find(item => {
        return item.path === '/'
      })
      function gen ({ name, meta = {}, children }) {
        if (!meta.hideInMenu) {
          const currentMenuItem = {
            title: meta.title,
            route: name
          }
          if (children) {
            currentMenuItem.children = children.reduce((result, item) => {
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
      const items = gen(mainRoute).children
      // console.log(JSON.stringify(items))
      return items.splice(0, 5)
    })

    watch(() => device,
      () => {
        responsiveMenu()
      })

    const handleSelect = name => {
      $router.push({ name }).catch(() => {})
    }

    const handleDropdownCommand = command => {
      if (command === 'logout') {
        $logout().then(() => {
          $router.push({ name: 'login' })
        })
      }
    }

    const responsiveMenu = () => {
      const device = device
      if (device === 'miniScreen') {
        // this.isShowMenu = true
        $store.commit('OPEN_MENU')
        // const isCollapseMenu = !this.isCollapseMenu ? !this.isCollapseMenu : this.isCollapseMenu
        // this.$appState.$set('isCollapseMenu', isCollapseMenu)
        // this.isCollapseMenu = isCollapseMenu
      } else if (device === 'mobile') {
        // const isShowMenu = this.isShowMenu ? !this.isShowMenu : this.isShowMenu
        // this.$appState.$set('isShowMenu', isShowMenu)
        // this.isShowMenu = isShowMenu

        // this.$appState.$set('isCollapseMenu', true)
        // this.isCollapseMenu = true
        $store.commit('SET_MENU_COLLAPSE', true)
      } else {

        $store.commit('OPEN_MENU')
        // this.isShowMenu = true
      }
    }

    const toggleMenu = () => {
      if (device.value === 'mobile') {
        drawer.value = true
        // this.isCollapseMenu = false
        $store.commit('SET_MENU_COLLAPSE', false)
      } else {

        $store.commit('TOGGLE_MENU')
        // const isCollapseMenu = !this.isCollapseMenu
        // this.$appState.$set('isCollapseMenu', isCollapseMenu)
        // this.isCollapseMenu = isCollapseMenu
        // this.$store.dispatch('closeSideBar', { withoutAnimation: false })
      }
    }

    const saveTags = () => {
      // const tags = this.$refs.tag.tags
      // this.$appState.$storage(this.$store.state.user.name).$set('tags', tags)
    }

    // this.isCollapseMenu = !!this.$appState.$get('isCollapseMenu')
    // this.$bus.$on('breadcrumb-change', breadcrumb => {
    //   this.breadcrumb = breadcrumb
    // })

    onMounted(() => {
      window.addEventListener('beforeunload', saveTags())
    })
    onUnmounted(() => {
      window.removeEventListener('beforeunload', saveTags())
    })

    return {
      breadcrumb,
      isCollapseMenu,
      isShowMenu,
      drawer,
      sidebar,
      device,
      siteInfo,
      isKeepAlive,
      initTags,
      defaultMenu,
      horizontalMenu,
      handleSelect,
      handleDropdownCommand,
      responsiveMenu,
      toggleMenu,
      saveTags,
      $route,
      $store
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
>>>.el-header
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
  >>>.breadcrumb
    padding-top 0
  >>>.el-breadcrumb__inner.is-link
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

