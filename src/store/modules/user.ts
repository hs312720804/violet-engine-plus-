import { ActionContext } from 'vuex'
import { RootState } from '@/store/index'
export interface UserModuleState {
  id?: string
  loginName?: string
  token?: string
  departmentId?: string
}

type UserActionContext = ActionContext<UserModuleState, RootState>

const user = {
  namespaced: true,
  state: {
    id: undefined,
    loginName: undefined,
    token: undefined,
    departmentId: undefined
  },

  mutations: {
    SET_TOKEN: (state: UserModuleState, token: string) => {
      state.token = token
    },
    SET_LOGIN_NAME: (state: UserModuleState, name: string) => {
      state.loginName = name
    },
    SET_DEPARTMENT: (state: UserModuleState, id: string) => {
      state.departmentId = id
    },
    SET_ID: (state: UserModuleState, id: string) => {
      state.id = id
    }
  },

  actions: {
    saveUserInfo ({ commit }: UserActionContext, user: UserModuleState) {
      commit('SET_LOGIN_NAME', user.loginName)
      commit('SET_TOKEN', user.token)
      commit('SET_DEPARTMENT', user.departmentId)
      commit('SET_ID', user.id)
      commit('app/SET_APPUSERINFO', user, { root: true })
      commit('app/SET_TOKEN', user.token, { root: true })
    },
    clearUserInfo ({ commit }: UserActionContext) {
      commit('SET_LOGIN_NAME', '')
      commit('SET_TOKEN', '')
      commit('SET_DEPARTMENT', '')
      commit('app/SET_TOKEN', undefined, { root: true })
    }
  }
}

export default user
