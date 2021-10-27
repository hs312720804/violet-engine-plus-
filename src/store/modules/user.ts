import { ActionContext } from 'vuex'
import { RootState } from '@/store/index'
export interface UserModuleState {
  id: number
  name?: string
  loginName?: string
  token?: string
  departmentId?: string
}

type UserActionContext = ActionContext<UserModuleState, RootState>

const user = {
  namespaced: true,
  state: {
    id: undefined,
    name: undefined,
    loginName: undefined,
    token: undefined,
    departmentId: undefined
  },

  mutations: {
    SET_ID: (state: UserModuleState, id: number) => {
      state.id = id
    },
    SET_TOKEN: (state: UserModuleState, token: string) => {
      state.token = token
    },
    SET_NAME: (state: UserModuleState, name: string) => {
      state.name = name
    },
    SET_LOGIN_NAME: (state: UserModuleState, name: string) => {
      state.loginName = name
    },
    SET_DEPARTMENT: (state: UserModuleState, id: string) => {
      state.departmentId = id
    }
  },

  actions: {
    saveUserInfo ({ commit }: UserActionContext, user: UserModuleState) {
      commit('SET_ID', user.id)
      commit('SET_TOKEN', user.token)
      commit('SET_NAME', user.name)
      commit('SET_LOGIN_NAME', user.loginName)
      commit('SET_DEPARTMENT', user.departmentId)
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
