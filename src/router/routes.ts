export default [
  // {
  //   path: '/',
  //   name: 'Index',
  //   component: () => import('@/views/Index.vue')
  // },
  {
    path: '/table',
    name: 'Table',
    component: () => import('@/views/Table.vue')
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
