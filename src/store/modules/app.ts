import Cookies from 'js-cookie'
import { ActionContext } from 'vuex'
import { RootState } from '@/store/index'

export interface AppSidebar { opened?: boolean; withoutAnimation: boolean; }
export interface AppSite { copyright?: string; layout: string; recordNum?: string; siteName: string; }
export interface AppAccess { [key: string]: boolean; }

export interface AppModuleState {
  sidebar: AppSidebar
  device: string
  language: string
  size: string
  access: AppAccess
  site: AppSite
}

type AppActionContext = ActionContext<AppModuleState, RootState>

const app = {
  state: {
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    language: Cookies.get('language') || 'en',
    size: Cookies.get('size') || 'medium',
    access: {},
    site: { layout: 'default', siteName: '站点名称' }
  },
  mutations: {
    TOGGLE_SIDEBAR: (state: AppModuleState) => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
    CLOSE_SIDEBAR: (state: AppModuleState, withoutAnimation: boolean) => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state: AppModuleState, device: string) => {
      state.device = device
    },
    SET_LANGUAGE: (state: AppModuleState, language: string) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_SIZE: (state: AppModuleState, size: string) => {
      state.size = size
      Cookies.set('size', size)
    },
    SET_ACCESS: (state: AppModuleState, access: AppAccess) => {
      state.access = access
    },
    CLEAR_ACCESS: (state: AppModuleState) => {
      state.access = {}
    },
    SET_SITE: (state: AppModuleState, site: AppSite) => {
      state.site = site
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
    setSite ({ commit }: AppActionContext, site: AppSite) {
      commit('SET_SITE', site)
    }
  }
}

export default app
