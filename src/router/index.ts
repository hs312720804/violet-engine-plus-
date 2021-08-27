import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
// import Login from '@/views/Login.vue'
// import Register from '@/views/Register.vue'
import { store } from '@/store'
import routes from './routes'
import { initUserData } from '@/auth'
import { isInLoginFreeList } from './routeAuthList'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 初始化站点信息
router.beforeEach(async () => {
  await store.dispatch('app/initSite')
  if (store.state.app.site?.siteName) {
    document.title = store.state.app.site?.siteName
  }
  return true
})
// 权限校验
router.beforeEach(async to => {
  // 判断当前路由是否需要校验的
  if (isInLoginFreeList(to.path) || store.getters.isLogin) {
    return true
  }
  // 强制刷新（F5）会导致 isLogin 为空，需重新设置用户信息（权限、用户信息、菜单、动态路由......）
  try {
    await initUserData()
    return to.fullPath
    // const xx = router.currentRoute.value.matched.flatMap(record =>
    //   Object.values(record.components)
    // )
    // if (to.matched.length === 0 && xx.length > 0) {
    //   next({ path: to.fullPath })
    // } else {
    //   next()
    // }
  } catch (error) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // try {

  //   const xx = router.currentRoute.value.matched.flatMap(record =>
  //     Object.values(record.components)
  //   )
  //   if (to.matched.length === 0 && xx.length > 0) {
  //     next({ path: to.fullPath })
  //   } else {
  //     next()
  //   }
  // } catch (error) {
  //   next({ name: 'login', query: { redirect: to.fullPath } })
  // }

  // isLoggedIn().then(() => {


  //   // if (to.name !== 'login') {
  //   //   const xx = router.currentRoute.value.matched.flatMap(record =>
  //   //     Object.values(record.components)
  //   //   )
  //   //   if (to.matched.length === 0 && xx.length > 0) {
  //   //     next({ path: to.fullPath })
  //   //   } else {
  //   //     next()
  //   //   }
  //   // } else {
  //   //   if (to.query.redirect) {
  //   //     next({ path: to.query.redirect as string })
  //   //   } else {
  //   //     next({ name: 'home' })
  //   //   }
  //   // }


  // }).catch(() => {

  //   if (to.name === 'login' || to.name === 'register') {
  //     next()
  //   } else {
  //     next({ name: 'login', query: { redirect: to.fullPath } })
  //   }

  // })


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
