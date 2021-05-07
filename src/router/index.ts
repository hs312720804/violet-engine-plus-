import { createRouter, createWebHistory } from 'vue-router'
// import Login from '@/views/Login.vue'
// import Register from '@/views/Register.vue'
// import store from '@/store'
import routes from './routes'

function beforeEach (to, from, next) {
  const app = this.app
  function routerTo () { // 路由跳转
    app.$isLoggedIn().then(() => {
      document.title = store.state.app.site.siteName
      next(to.name !== 'login'
        ? to.matched.length === 0 && app.$router.getMatchedComponents(to.fullPath).length > 0
          ? { path: to.fullPath }
          : undefined
        : to.query.redirect
          ? { path: to.query.redirect }
          : { name: 'home' }
      )
    }).catch(e => {
      next(to.name === 'login' || to.name === 'register'
        ? undefined
        : { name: 'login', query: { redirect: to.fullPath } }
      )
    })
  }
  if (Object.keys(store.state.app.site).length < 1) { // 判断是否已存在站点信息
    app.$service.getSiteInfo().then(data => {
      store.dispatch('setSite', data)
      routerTo()
    }).catch(e => {
      console.log(e)
    })
  } else {
    routerTo()
  }
}
function afterEach (to) {
  const app = this.app
  const breadcrumb = to.matched.slice(1).map(({ name, meta }) => {
    return {
      name: meta.title,
      to: name
        ? { name }
        : undefined
    }
  })
  app.$nextTick(() => {
    app.$bus.$emit('breadcrumb-change', breadcrumb)
  })
}




const router = createRouter({ history: createWebHistory(), routes })
// router.beforeEach(beforeEach.bind(router))
// router.afterEach(afterEach.bind(router))

export default router
