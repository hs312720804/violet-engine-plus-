// import { loginByUsername, logout, getUserInfo } from '@/api/login'
// import { getToken, setToken, removeToken } from '@/utils/auth'


import { ActionContext } from 'vuex'
import { RootState } from '@/store/index'

export interface UserModuleState {
  name: string
  token: string
  departmentId: string
}

type UserActionContext = ActionContext<UserModuleState, RootState>

const user = {
  state: {
    name: '',
    token: '',
    departmentId: ''
    // status: '',
    // code: '',
    // name: '',
    // avatar: '',
    // introduction: '',
    // roles: [],
    // setting: {
    //   articlePlatform: []
    // }
  },

  mutations: {
    SET_TOKEN: (state: UserModuleState, token: string) => {
      state.token = token
    },
    SET_NAME: (state: UserModuleState, name: string) => {
      state.name = name
    },
    SET_DEPARTMENT: (state: UserModuleState, id: string) => {
      state.departmentId = id
    }
    // SET_INTRODUCTION: (state, introduction) => {
    //   state.introduction = introduction
    // },
    // SET_SETTING: (state, setting) => {
    //   state.setting = setting
    // },
    // SET_STATUS: (state, status) => {
    //   state.status = status
    // },
    // SET_AVATAR: (state, avatar) => {
    //   state.avatar = avatar
    // },
    // SET_ROLES: (state, roles) => {
    //   state.roles = roles
    // }
  },

  actions: {
    // 用户名登录
    // LoginByUsername ({ commit }, userInfo) {
    //   const username = userInfo.username.trim()
    //   return new Promise((resolve, reject) => {
    //     loginByUsername(username, userInfo.password).then(response => {
    //       const data = response.data
    //       commit('SET_TOKEN', data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    cacheUserInfo ({ commit }: UserActionContext, user: UserModuleState) {
      commit('SET_NAME', user.name)
      commit('SET_TOKEN', user.token)
      commit('SET_DEPARTMENT', user.departmentId)
    },
    clearUserInfo ({ commit }: UserActionContext) {
      commit('SET_NAME', '')
      commit('SET_TOKEN', '')
      commit('SET_DEPARTMENT', '')
    }
    // 获取用户信息
    // GetUserInfo ({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getUserInfo(state.token).then(response => {
    //       // 由于mockjs 不支持自定义状态码只能这样hack
    //       if (!response.data) {
    //         reject('Verification failed, please login again.')
    //       }
    //       const data = response.data

    //       if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //         commit('SET_ROLES', data.roles)
    //       } else {
    //         reject('getInfo: roles must be a non-null array!')
    //       }

    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       commit('SET_INTRODUCTION', data.introduction)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    // LogOut ({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 前端 登出
    // FedLogOut ({ commit }) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', '')
    //     removeToken()
    //     resolve()
    //   })
    // },

    // 动态修改权限
    // ChangeRoles ({ commit, dispatch }, role) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', role)
    //     setToken(role)
    //     getUserInfo(role).then(response => {
    //       const data = response.data
    //       commit('SET_ROLES', data.roles)
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       commit('SET_INTRODUCTION', data.introduction)
    //       dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
    //       resolve()
    //     })
    //   })
    // }
  }
}

export default user
