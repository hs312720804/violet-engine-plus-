export default [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/Index.vue')
  },
  {
    path: '/table',
    name: 'Table',
    component: () => import('@/views/Table.vue')
  }
]
