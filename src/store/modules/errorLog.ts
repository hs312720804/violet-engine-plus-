import { ActionContext } from 'vuex'
import { RootState } from '@/store/index'

export interface ErrorLogModuleState {
  logs: Array<string>
}

type AppActionContext = ActionContext<ErrorLogModuleState, RootState>

const errorLog = {
  state: {
    logs: []
  },
  mutations: {
    ADD_ERROR_LOG: (state: ErrorLogModuleState, log: string) => {
      state.logs.push(log)
    }
  },
  actions: {
    addErrorLog ({ commit }: AppActionContext, log: Array<string>) {
      commit('ADD_ERROR_LOG', log)
    }
  }
}

export default errorLog
