export interface ErrorLogModuleState {
  logs: Array<string>
}

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
  }
}

export default errorLog
