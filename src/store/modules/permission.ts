// import { asyncRouterMap, constantRouterMap } from '@/router'

import { ActionContext } from 'vuex'
import { RootState } from '@/store/index'

export interface PermissionModuleState {
  routers: Array<string>
  addRouters: Array<string>
}

type PermissionActionContext = ActionContext<PermissionModuleState, RootState>


// /**
//  * 通过meta.role判断是否与当前用户权限匹配
//  * @param roles
//  * @param route
//  */
// function hasPermission (roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

// /**
//  * 递归过滤异步路由表，返回符合用户角色权限的路由表
//  * @param routes asyncRouterMap
//  * @param roles
//  */
// function filterAsyncRouter (routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRouter(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state: PermissionModuleState, routers: Array<string>) => {
      state.addRouters = routers
      // state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }: PermissionActionContext, data: { roles: Array<string>; }) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.includes('admin')) {
          // accessedRouters = asyncRouterMap
        } else {
          // accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
