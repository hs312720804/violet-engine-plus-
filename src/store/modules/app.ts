// import Cookies from 'js-cookie'
import { ActionContext } from 'vuex'
import { CBreadcrumbItems, CTagNavInitTags } from '@ccprivate/admin-toolkit-plus'
import { RootState } from '@/store/index'
import { AppSite, getSiteInfo } from '@/services/common'
import { AppEnum, enumList } from '@/services/enum'

export type AppDeviceType = 'desktop' | 'miniScreen' | 'mobile'
export interface AppMenu { isShow: boolean; isCollapse: boolean; }
export interface AppSidebar { opened?: boolean; withoutAnimation: boolean; }
export interface AppAccess { [key: string]: boolean; }

/**
 * 用户的操作信息: 面包屑, 打开的菜单
 */
export interface UserOptLog { breadcrumb: CBreadcrumbItems; tagNavs: CTagNavInitTags; }
/**
 * 记录各个用户的操作信息
 */
export interface AppUsersOptLog { [loginName: string]: UserOptLog; }
export interface AppModuleState {
  sidebar: AppSidebar
  menu: AppMenu
  device: AppDeviceType
  language: string
  access: AppAccess
  site: AppSite
  usersOptLog: AppUsersOptLog
  loginUserToken?: string
  enums: Array<AppEnum>
}

type AppActionContext = ActionContext<AppModuleState, RootState>
const app = {
  namespaced: true,
  state: {
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    menu: {
      isShow: true,
      isCollapse: false
    },
    device: 'desktop',
    language: 'zh',
    site: undefined,
    access: {},
    usersOptLog: {},
    loginUserToken: undefined,
    enums: []
  },
  mutations: {
    TOGGLE_MENU: (state: AppModuleState) => {
      state.menu.isCollapse = !state.menu.isCollapse
    },
    SET_MENU_COLLAPSE: (state: AppModuleState, isCollapse: boolean) => {
      state.menu.isCollapse = isCollapse
    },
    CLOSE_MENU: (state: AppModuleState) => {
      state.menu.isShow = false
    },
    OPEN_MENU: (state: AppModuleState) => {
      state.menu.isShow = true
    },
    TOGGLE_SIDEBAR: (state: AppModuleState) => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state: AppModuleState, withoutAnimation: boolean) => {
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state: AppModuleState, device: AppDeviceType) => {
      state.device = device
    },
    SET_LANGUAGE: (state: AppModuleState, language: string) => {
      state.language = language
    },
    SET_ACCESS: (state: AppModuleState, access: AppAccess) => {
      state.access = access
    },
    CLEAR_ACCESS: (state: AppModuleState) => {
      state.access = {}
    },
    SET_SITE: (state: AppModuleState, site: AppSite) => {
      state.site = site
    },
    SET_TOKEN: (state: AppModuleState, token: string) => {
      state.loginUserToken = token
    },
    SET_BREADCRUMB (state: AppModuleState, userBreadcrumb: { loginName: string; breadcrumb: CBreadcrumbItems; }) {

      const { loginName, breadcrumb } = userBreadcrumb
      if (loginName) {
        const usersOptLog = state.usersOptLog[loginName] || {}
        usersOptLog.breadcrumb = breadcrumb
        state.usersOptLog[loginName] = usersOptLog
      }
    },
    SET_TAG_NAVS (state: AppModuleState, userTagNavs: { loginName: string; tagNavs: CTagNavInitTags; }) {

      const { loginName, tagNavs } = userTagNavs
      if (loginName) {
        const usersOptLog = state.usersOptLog[loginName] || {}
        usersOptLog.tagNavs = tagNavs
        state.usersOptLog[loginName] = usersOptLog
      }
    },
    SET_ENUM: (state: AppModuleState, enums: Array<AppEnum> = []) => {
      state.enums = enums
    }
  },
  actions: {
    toggleSideBar ({ commit }: AppActionContext) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar ({ commit }: AppActionContext, { withoutAnimation }: AppSidebar) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice ({ commit }: AppActionContext, device: string) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage ({ commit }: AppActionContext, language: string) {
      commit('SET_LANGUAGE', language)
    },
    setAccess ({ commit }: AppActionContext, access: AppAccess) {
      commit('SET_ACCESS', access)
    },
    clearAccess ({ commit }: AppActionContext) {
      commit('CLEAR_ACCESS')
    },
    async initSite ({ commit, state }: AppActionContext) {
      if (!state.site) {
        const siteInfo = await getSiteInfo()
        commit('SET_SITE', siteInfo)
      }
      return state.site
    },
    setBreadcrumb: ({ commit, rootState }: AppActionContext, breadcrumb: CBreadcrumbItems) => {
      const user = rootState.user
      commit('SET_BREADCRUMB', { loginName: user.loginName, breadcrumb })
    },
    setTagNavs: ({ commit, rootState }: AppActionContext, tagNavs: CTagNavInitTags) => {
      const user = rootState.user
      commit('SET_TAG_NAVS', { loginName: user.loginName, tagNavs })
    },
    setEnums ({ commit }: AppActionContext) {
      enumList({ pageNo: 1, pageSize: 999 }).then(res => {
        commit('SET_ENUM', res.list)
      })
    }
  }
}

export default app
