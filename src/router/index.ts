import { createRouter, createWebHashHistory } from 'vue-router';
// import/export 只能在模块顶层使用，不能在函数、判断语句等代码块之中引用；require/exports 可以。
const routes = [
    {
        path: '/',
        name: 'Index',
        component: () => import('../views/Index.vue')
    },
    {
        path: '/table',
        name: 'Table',
        component: () => import('../views/Table.vue')
    }

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// router.beforeEach((to, from, next) => {
//    if(to.path === '/') {
//      next({ path: '/home' })
//    } else {
//       next()
//    }
// })

export default router;
