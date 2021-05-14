import Main from '@/components/layout/Index.vue'
export default [
  // {
  //   path: '/',
  //   name: 'Index',
  //   component: () => import('@/views/Index.vue')
  // },
  {
    path: '/',
    component: Main
    // redirect: '/desktop.html',
    // children
  },
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
