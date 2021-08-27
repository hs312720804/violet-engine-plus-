// import Cookies from 'js-cookie'
import { ActionContext } from 'vuex'
import { RootState } from '@/store/index'
import { getSiteInfo } from '@/services/common'

export interface AppMenu { isShow: boolean; isCollapse: boolean; }
export interface AppSidebar { opened?: boolean; withoutAnimation: boolean; }
export interface AppSite { copyright: string; layout: string; recordNum: string; siteName: string; }
export interface AppAccess { [key: string]: boolean; }
export interface UserModuleState {
  id?: number
  loginName: string
  token?: string
  departmentId?: string
}
export interface AppUsers {
  [key: string]: UserModuleState
}

export interface AppModuleState {
  sidebar: AppSidebar
  menu: AppMenu
  device: string
  language: string
  size: string
  access: AppAccess
  site?: AppSite
  users: AppUsers
  loginUserToken?: string
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
    size: 'medium',
    access: {},
    site: undefined,
    users: {},
    loginUserToken: undefined
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
    TOGGLE_DEVICE: (state: AppModuleState, device: string) => {
      state.device = device
    },
    SET_LANGUAGE: (state: AppModuleState, language: string) => {
      state.language = language
    },
    SET_SIZE: (state: AppModuleState, size: string) => {
      state.size = size
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
    SET_APPUSERINFO: (state: AppModuleState, user: UserModuleState) => {
      state.users[user.loginName] = user
    },
    SET_TOKEN: (state: AppModuleState, token: string) => {
      state.loginUserToken = token
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
    setSize ({ commit }: AppActionContext, size: string) {
      commit('SET_SIZE', size)
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
    }
  }
}

export default app
