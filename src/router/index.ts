
import { CBreadcrumbItems } from '@ccprivate/admin-toolkit-plus'
import { createRouter, createWebHashHistory } from 'vue-router'
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
    await initUserData()  // 会重新添加路由
    // https://next.router.vuejs.org/zh/guide/advanced/dynamic-routing.html#在导航守卫中添加路由
    return to.fullPath
  } catch (error) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

})

// 记录用户打开页面的路径，用于面包屑
router.afterEach(to => {
  const breadcrumb: CBreadcrumbItems = to.matched.slice(1).map(({ meta }) => {
    return {
      name: meta.title as string,
      to: undefined
    }
  })
  store.dispatch('app/setBreadcrumb', breadcrumb)
})

export default router
