export default [
  {
    name: 'register',
    path: '/register',
    component: () => import('@/views/Register.vue'),
    constantRoutes: true,
    meta: {
      title: '注册'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录'
    }
  }
]
