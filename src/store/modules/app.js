import Cookies from 'js-cookie'
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
    site: {}
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', size)
    },
    SET_ACCESS: (state, access) => {
      state.access = access
    },
    CLEAR_ACCESS: state => {
      state.access = {}
    },
    SET_SITE: (state, site) => {
      state.site = site
    }
  },
  actions: {
    toggleSideBar ({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar ({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage ({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setSize ({ commit }, size) {
      commit('SET_SIZE', size)
    },
    setAccess ({ commit }, access) {
      commit('SET_ACCESS', access)
    },
    clearAccess ({ commit }) {
      commit('CLEAR_ACCESS')
    },
    setSite ({ commit }, site) {
      commit('SET_SITE', site)
    }
  }
}

export default app
