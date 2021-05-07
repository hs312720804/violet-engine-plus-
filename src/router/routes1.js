import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const routes = [
  // {
  //   path: '/',
  //   component: Main,
  //   children
  // },
  {
    name: 'register',
    path: '/register',
    component: Register,
    constantRoutes: true,
    meta: {
      title: '注册'
    }
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    }
  }
]

export default routes
