import { RootState } from './index'
import { evil as functionEvil } from '@/utlis/common'
import { EnumOptions } from '@/services/enum'
// import { UserOptLog } from './modules/app'

export interface AppLogoInfo { image: string; height: string; width: string; }
export interface AppLogo { login: AppLogoInfo; top: AppLogoInfo; }


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
  },
  appLog: (state: RootState) => JSON.parse(state.app.site.logo) as AppLogo,
  getEnumOptions: (state: RootState) => (code: string) => {
    const rowEnum = state.app.enums.find(ele => ele.enumCode === code)
    return rowEnum ? functionEvil<EnumOptions>(rowEnum.options) : []
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
