// import Vue from 'vue'
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import app, { AppModuleState } from './modules/app'
import errorLog, { ErrorLogModuleState } from './modules/errorLog'
import permission, { PermissionModuleState } from './modules/permission'
import tagsView, { TagModuleState } from './modules/tagsView'
import user, { UserModuleState } from './modules/user'
import getters from './getters'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {
  app: AppModuleState
  errorLog: ErrorLogModuleState
  permission: PermissionModuleState
  tagsView: TagModuleState
  user: UserModuleState
}

export const key: InjectionKey<Store<RootState>> = Symbol()


export const storeOptions = {
  // mutations: {},
  modules: {
    app,
    user,
    errorLog,
    permission,
    tagsView
  },
  getters
}

export const store = createStore(storeOptions)

// export default store
export function useStore () {
  return baseUseStore(key) as typeof store
}
