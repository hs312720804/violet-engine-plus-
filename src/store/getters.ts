import { RootState } from './index'
// import { UserOptLog } from './modules/app'
export default {
  isLogin: (state: RootState) => state.user.id !== undefined,
  token: (state: RootState) => state.app.loginUserToken,
  breadcrumb: (state: RootState) => {
    const { loginName } = state.user
    let breadcrumb
    if (loginName) {
      breadcrumb = state.app.usersOptLog[loginName].breadcrumb
    }
    return breadcrumb || []
  },
  tags: (state: RootState) => {
    const { loginName } = state.user
    let tags
    if (loginName) {
      tags = state.app.usersOptLog[loginName].tagNavs
    }
    return tags || []
  }
  // sidebar: (state: RootState) => state.app.sidebar,
  // language: (state: RootState) => state.app.language,
  // device: (state: RootState) => state.app.device,
  // access: (state: RootState) => state.app.access,
  // site: (state: RootState) => state.app.site,
  // visitedViews: (state: RootState) => state.tagsView.visitedViews,
  // cachedViews: (state: RootState) => state.tagsView.cachedViews,
  // name: (state: RootState) => state.user.name,
  // permission_routers: (state: RootState) => state.permission.routers,
  // addRouters: (state: RootState) => state.permission.addRouters,
  // errorLogs: (state: RootState) => state.errorLog.logs
}
