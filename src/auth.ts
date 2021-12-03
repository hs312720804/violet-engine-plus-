import { store } from '@/store'
import router from '@/router'
import Wrapper from '@/views/layout/Wrapper.vue'
import Main from '@/views/layout/Index.vue'
import routerComponents from '@/router/components'
import NotFoundComponent from '@/views/NotFound.vue'
import NotTemplateComponent from '@/views/NotTemplate.vue'

import { getUserInfoService } from '@/services/common'
import { AppAccess } from '@/store/modules/app'
import { RouteRecordRaw } from 'vue-router'
// const storageName = 'violet'

export async function $logout () {
  // Storage.$remove(`${storageName}/user`)
  store.dispatch('clearAccess')
  store.dispatch('clearUserInfo')
}

export async function initUserData () {
  return new Promise((resolve, reject) => {
    getUserInfoService().then(res => {

      store.dispatch('user/saveUserInfo', res)

      const menu = res.menus[0].children
      const accessObj: AppAccess = {}
      res.resourceOperations.forEach(item => {
        accessObj[item] = true
      })
      store.dispatch('app/setAccess', accessObj)
      store.dispatch('app/setEnums')
      if (menu.length === 0) {
        throw new Error('not login')
      }
      function getTemplateComponent (template: string) { // 增加菜单模板组件未提交时,会出现找不到模板的情况
        return routerComponents[template]
          ? routerComponents[template].template
          : NotTemplateComponent
      }
      const children: Array<RouteRecordRaw> = (function getRouter (menu) {
        return menu.map(element => {
          const route: RouteRecordRaw = {
            name: element.alias,
            path: element.alias === 'home' ? '/' : element.path,
            // path: element.attributes.iframeUrl.replace(/http:\/*.+?#/, ''),
            component:
              'children' in element && element.children.length > 0 && element.type !== 'tab'
                ? Wrapper
                : element.template
                  ? getTemplateComponent(element.template) : element.name === '菜单管理'
                    ? routerComponents.MenuIndex.template : routerComponents.BaseList.template,
            props: {
              menuId: element.id
            },
            meta: {
              title: element.name,
              icon: element.icon,
              tagId: element.id
            }
          }
          if ('children' in element && element.children.length > 0 && element.type !== 'tab') route.children = getRouter(element.children)
          return route
        })
      })(menu)
      // children.unshift({
      //   path: '/',
      //   name: 'dashboard',
      //   component: Dashboard,
      //   meta: {
      //     title: '概览',
      //     tagId: 'dashboard',
      //     icon: 'el-icon-odometer'
      //   }
      // })
      children.unshift({
        name: 'account',
        path: 'account',
        component: () => import('@/views/Account.vue'),
        meta: {
          title: '帐号信息',
          hideInMenu: true
        }
      })
      const filterRoutes: Array<RouteRecordRaw> = [
        {
          path: '/',
          component: Main,
          // redirect: '/desktop.html',
          children
        },
        // {
        //   name: 'not-found',
        //   path: '*',
        //   component: NotFound,
        //   meta: {
        //     title: 'NotFound'
        //   }
        // }
        {
          name: 'not-found',
          path: '/:pathMatch(.*)',
          component: NotFoundComponent,
          meta: {
            title: 'NotFound'
          }
        }
      ]
      router.options.routes = filterRoutes // 动态路由
      filterRoutes.forEach(route => router.addRoute(route))  // 动态路由
      // router.addRoutes(filterRoutes) // 动态路由
      resolve(res)
    }).catch(e => {
      reject(e)
    })
  })
}
