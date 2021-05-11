import store from '@/store'
import Wrapper from '@/components/Wrapper.vue'
import Main from '@/components/layout/Index.vue'
import routerComponents from '@/router/components'
import NotFound from '@/views/NotFound.vue'
import Storage from '@/utlis/storage'
import { getUserInfoService } from '@/services/common'
import { LoginService, LoginArg } from '@/services/login'
import router from '@/router'
const storageName = 'violet'

export const isLoggedIn = async function () {

  // memory
  if (store.state.user.name) {
    return
  }
  // storage
  const user = Storage.$get(`${storageName}/user`)
  if (user) {
    // try login
    store.dispatch('cacheUserInfo', user)
    return $getInitData().catch(e => {
      Storage.$set(`${storageName}/user`, '')
      router.push({ name: 'login' })
    })
  }
  return Promise.reject(new Error('NOT LOGGEDIN'))
}

export const login = async function (data: LoginArg) {


  return LoginService(data).then(res => {
    const user = {
      name: res.loginName,
      token: res.token,
      departmentId: res.departmentId,
      id: res.id
    }
    store.dispatch('cacheUserInfo', user)
    Storage.$set(`${storageName}/user`, user)
    $getInitData().catch(e => {
      Storage.$set(`${storageName}/user`, '')
      router.push({ name: 'login' })
    })
  })
}
export const $logout = async function () {
  Storage.$remove(`${storageName}/user`)
  store.dispatch('clearAccess')
  store.dispatch('clearUserInfo')
}
export const $getInitData = async function () {


  return new Promise((resolve, reject) => {
    getUserInfoService(null).then(res => {
      const menu = res.menus[0].children
      const accessObj = {}
      res.resourceOperations.forEach(item => {
        accessObj[item] = true
      })
      store.dispatch('setAccess', accessObj)
      if (menu.length === 0) {
        throw new Error('not login')
      }
      const children = (function getRouter (menu) {
        return menu.map(element => {
          const route = {
            name: element.alias,
            path: element.alias === 'home' ? '/' : element.path,
            // path: element.attributes.iframeUrl.replace(/http:\/*.+?#/, ''),
            component: 'children' in element && element.children.length > 0 && element.type !== 'tab'
              ? Wrapper
              : element.template
                ? routerComponents[element.template].template : element.name === '菜单管理'
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
      const filterRoutes = [
        {
          path: '/',
          component: Main,
          // redirect: '/desktop.html',
          children
        },
        {
          name: 'not-found',
          path: '*',
          component: NotFound,
          meta: {
            title: 'NotFound'
          }
        }
      ]
      router.options.routes = filterRoutes // 动态路由
      filterRoutes.forEach(item => {
        debugger
        router.addRoute(item)
      }) // 动态路由
      console.log('动态路由====', router.getRoutes())
      // return Promise.resolve()
      resolve()
    }).catch(e => {
      reject(e)
    })
  })
}
