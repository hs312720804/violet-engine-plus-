import { RootState } from './index'
export default {
  isLogin: (state: RootState) => state.user.id !== undefined,
  token: (state: RootState) => state.app.loginUserToken
  // sidebar: (state: RootState) => state.app.sidebar,
  // language: (state: RootState) => state.app.language,
  // size: (state: RootState) => state.app.size,
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
