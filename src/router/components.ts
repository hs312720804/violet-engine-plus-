// import E404 from '@/views/error/E404.vue'
// import Login3 from '@/views/Login3.vue'
// const NotFound = () => import('@/views/NotFound.vue')

interface RouterComponents {
  [key: string]: {
    template: any
    type: string
  }
}

/**
 * {type} 的作用是在菜单编辑时可以自动使用预设配置数据模板，有3种type:list\iframe\custom，可根据项目需要自行增减
 * 列表：list
 * 外部网页：iframe
 * 自定义可使用custom或者为空
 */
const routerComponents: RouterComponents = {
  // ConferenceManagement: {
  //   template: () => import('@/views/single/ConferenceManagement.vue'),
  //   type: 'single'
  // },
  // TreeSideList: {
  //   template: () => import('@/views/treeSideList/Index.vue'),
  //   type: 'list'
  // },
  BaseList: {
    template: () => import('@/views/template/baseList/Index.vue'),
    type: 'list'
  },
  // TabPage: {
  //   template: () => import('@/views/tabPage/Index.vue'),
  //   type: 'tab'
  // },
  // ImageList: {
  //   template: () => import('@/components/imageList/Index.vue'),
  //   type: 'list'
  // },
  // CardList: {
  //   template: () => import('@/views/cardList/Index.vue'),
  //   type: 'list'
  // },
  // ExternalIframe: {
  //   template: () => import('@/views/externalIframe/Index.vue'),
  //   type: 'iframe'
  // },
  Dashboard: {
    template: () => import('@/views/Dashboard.vue'),
    type: 'custom'
  },
  // 用户管理
  UserIndex: {
    template: () => import('@/views/sys/rbac/user/UserIndex.vue'),
    type: 'custom'
  },
  // 菜单管理
  MenuIndex: {
    template: () => import('@/views/sys/rbac/menu/MenuIndex.vue'),
    type: 'custom'
  },
  // 部门管理
  DepartmentIndex: {
    template: () => import('@/views/sys/rbac/department/DepartmentIndex.vue'),
    type: 'custom'
  },
  // 站点信息
  SiteInfo: {
    template: () => import('@/views/sys/SiteInfo.vue'),
    type: 'custom'
  }
}
export default routerComponents
