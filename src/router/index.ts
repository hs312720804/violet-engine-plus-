import { createRouter, createWebHistory } from 'vue-router'
// import Login from '@/views/Login.vue'
// import Register from '@/views/Register.vue'
import { store } from '@/store'
import routes from './routes'
import { getInitData } from '@/auth'
import { isInLoginFreeList } from './routeAuthList'
import { getSiteInfo } from '@/services/common'

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  console.log(store.state.app.site)
  if (router.currentRoute.value.matched.length === 0) {
    getSiteInfo().then(data => {
      store.dispatch('setSite', data)// ('setSite', data)
    }).catch(e => {
      console.log(e)
    })
  }
  next()
  // if (Object.keys(store.state.app.site).length < 1) { // 判断是否已存在站点信息
  //   app.$service.getSiteInfo().then(data => {
  //     store.dispatch('setSite', data)
  //     routerTo()
  //   }).catch(e => {
  //     console.log(e)
  //   })
  // } else {
  //   routerTo()
  // }
})

router.beforeEach((to, from, next) => {
  if (isInLoginFreeList(to.path)) {
    return next()
  }
  // const app = this.app
  function routerTo () { // 路由跳转
    getInitData().then(() => {
      document.title = store.state.app.site.siteName as string
      if (to.name !== 'login') {
        const xx = router.currentRoute.value.matched.flatMap(record =>
          Object.values(record.components)
        )
        if (to.matched.length === 0 && xx.length > 0) {
          next({ path: to.fullPath })
        } else {
          next()
        }
      } else {
        if (to.query.redirect) {
          next({ path: to.query.redirect as string })
        } else {
          next({ name: 'home' })
        }
      }

      // next(to.name !== 'login'
      //   ? to.matched.length === 0 && app.$router.getMatchedComponents(to.fullPath).length > 0
      //     ? { path: to.fullPath }
      //     : undefined
      //   : to.query.redirect
      //     ? { path: to.query.redirect }
      //     : { name: 'home' }
      // )
    }).catch(() => {
      // next(to.name === 'login' || to.name === 'register'
      //   ? undefined
      //   : { name: 'login', query: { redirect: to.fullPath } }
      // )
      if (to.name === 'login' || to.name === 'register') {
        next()
      } else {
        next({ name: 'login', query: { redirect: to.fullPath } })
      }

    })
  }
  routerTo()
  // if (Object.keys(store.state.app.site).length < 1) { // 判断是否已存在站点信息
  //   app.$service.getSiteInfo().then(data => {
  //     store.dispatch('setSite', data)
  //     routerTo()
  //   }).catch(e => {
  //     console.log(e)
  //   })
  // } else {
  //   routerTo()
  // }
})
// router.afterEach(to => {
//   const app = this.app
//   const breadcrumb = to.matched.slice(1).map(({ name, meta }) => {
//     return {
//       name: meta.title,
//       to: name
//         ? { name }
//         : undefined
//     }
//   })
//   app.$nextTick(() => {
//     app.$bus.$emit('breadcrumb-change', breadcrumb)
//   })
// })


export default router
